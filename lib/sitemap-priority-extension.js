'use strict'

const fs = require('fs')
const path = require('path')

/**
 * Antora extension that generates an enhanced sitemap.xml with:
 * - <priority> and <changefreq> tags for each URL
 * - Support for :page-priority: and :page-changefreq: AsciiDoc attributes
 * - Configurable priority rules from antora-playbook.yml
 * - Inclusion of the site root URL (e.g. https://docs.stacksaga.org/)
 * - Option to exclude pages via :page-sitemap: false or :page-noindex:
 */
module.exports.register = function (context, vars) {
  const ctx = (context && typeof context.on === 'function') ? context : this
  const extensionConfig = (vars && vars.config) || (context && context.config) || {}
  const includeRoot = extensionConfig.include_root !== false
  const defaultPriority = normalizePriority(extensionConfig.default_priority, 0.5)
  const defaultChangefreq = extensionConfig.default_changefreq || 'monthly'
  const rules = Array.isArray(extensionConfig.rules) ? extensionConfig.rules : []

  let generatedSitemapXml = ''

  ctx.on('siteMapped', ({ siteCatalog, contentCatalog, playbook }) => {
    let siteUrl = (playbook && playbook.site && playbook.site.url) || ''
    if (!siteUrl) return
    if (siteUrl.endsWith('/')) siteUrl = siteUrl.slice(0, -1)

    const siteStartPage = typeof contentCatalog.getSiteStartPage === 'function'
      ? contentCatalog.getSiteStartPage()
      : null
    const siteStartPageUrl = siteStartPage && siteStartPage.pub ? siteStartPage.pub.url : ''

    const nowISO = new Date().toISOString()
    const entries = []
    const seenUrls = new Set()

    // 1. Prepend Root URL if configured
    if (includeRoot) {
      const rootUrl = siteUrl + '/'
      seenUrls.add(rootUrl)
      entries.push({
        loc: rootUrl,
        lastmod: nowISO,
        changefreq: 'weekly',
        priority: '1.0',
        sortWeight: 100,
      })
    }

    const pages = contentCatalog.getPages((page) => Boolean(page.out && page.pub))

    for (const page of pages) {
      const pageAttrs = (page.asciidoc && page.asciidoc.attributes) || {}

      // Check if page should be excluded from sitemap
      const sitemapAttr = pageAttrs['page-sitemap'] || pageAttrs['sitemap']
      if (sitemapAttr === 'false' || sitemapAttr === 'no' || sitemapAttr === false) {
        continue
      }
      if ('page-noindex' in pageAttrs || 'noindex' in pageAttrs) {
        continue
      }

      const pagePubUrl = (page.pub && page.pub.url) || ''
      const pageUrl = siteUrl + pagePubUrl
      if (seenUrls.has(pageUrl)) continue
      seenUrls.add(pageUrl)

      const isStartPage = Boolean(
        (siteStartPageUrl && pagePubUrl === siteStartPageUrl) ||
        isStartPageFallback(page, playbook)
      )

      // Calculate priority
      let priority = null
      let changefreq = null

      // A. Explicit AsciiDoc attribute on page (highest precedence)
      const rawPriority = pageAttrs['page-priority'] ?? pageAttrs['priority']
      if (rawPriority !== undefined && rawPriority !== null && rawPriority !== '') {
        priority = normalizePriority(rawPriority, defaultPriority)
      }

      const rawChangefreq = pageAttrs['page-changefreq'] ?? pageAttrs['changefreq']
      if (rawChangefreq) {
        changefreq = String(rawChangefreq).trim().toLowerCase()
      }

      // B. Playbook rule match
      if (priority === null || !changefreq) {
        for (const rule of rules) {
          if (rule && rule.match && matchesPattern(rule.match, pagePubUrl, page.src?.relative)) {
            if (priority === null && rule.priority !== undefined) {
              priority = normalizePriority(rule.priority, defaultPriority)
            }
            if (!changefreq && rule.changefreq) {
              changefreq = rule.changefreq
            }
            break
          }
        }
      }

      // C. Smart hierarchical defaults
      if (priority === null) {
        priority = isStartPage ? 1.0 : getSmartDefaultPriority(page, defaultPriority)
      }
      if (!changefreq) {
        changefreq = isStartPage ? 'weekly' : getSmartDefaultChangefreq(page, defaultChangefreq)
      }

      // Determine sort weight: start page gets 95, then by priority descending
      const sortWeight = isStartPage ? 95 : parseFloat(priority) * 10

      entries.push({
        loc: pageUrl,
        lastmod: nowISO,
        changefreq,
        priority: formatPriority(priority),
        sortWeight,
      })
    }

    // Sort entries: root and start page first, then by priority (descending), then alphabetical by loc
    entries.sort((a, b) => {
      if (b.sortWeight !== a.sortWeight) {
        return b.sortWeight - a.sortWeight
      }
      return a.loc.localeCompare(b.loc)
    })

    // Build the XML content
    generatedSitemapXml = buildSitemapXml(entries)

    // Update sitemap.xml in siteCatalog
    const sitemapFiles = siteCatalog.getFiles().filter((f) => (f.out || {}).path === 'sitemap.xml')
    if (sitemapFiles.length > 0) {
      sitemapFiles.forEach((file) => {
        file.contents = Buffer.from(generatedSitemapXml, 'utf8')
      })
    } else {
      const Vinyl = require('vinyl')
      siteCatalog.addFile(
        new Vinyl({
          out: { path: 'sitemap.xml' },
          pub: { url: '/sitemap.xml' },
          contents: Buffer.from(generatedSitemapXml, 'utf8'),
        })
      )
    }
  })

  // Fail-safe to ensure build output directory has the generated sitemap
  ctx.on('sitePublished', ({ playbook }) => {
    if (!generatedSitemapXml) return
    const outputDir = (playbook.output.destinations || []).reduce(
      (dir, dest) => dest.path || dir,
      playbook.output.dir || 'build/site'
    )
    const targetPath = path.join(outputDir, 'sitemap.xml')
    fs.mkdirSync(path.dirname(targetPath), { recursive: true })
    fs.writeFileSync(targetPath, generatedSitemapXml, 'utf8')
  })
}

function normalizePriority (val, fallback) {
  const num = parseFloat(val)
  if (isNaN(num)) return fallback
  return Math.min(1.0, Math.max(0.0, num))
}

function formatPriority (val) {
  const num = normalizePriority(val, 0.5)
  return num.toFixed(1)
}

function matchesPattern (pattern, pubUrl, srcRelative) {
  if (!pattern) return false
  const targetUrl = pubUrl || ''
  const targetSrc = srcRelative || ''

  if (pattern === targetUrl || pattern === targetSrc) return true

  // Support glob-like patterns: e.g. **/index.html, /foundations/**
  const regexStr = pattern
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/\*\*/g, '.*')
    .replace(/(?<!\.)\*/g, '[^/]*')

  const regex = new RegExp('^' + regexStr + '$')
  const relativeRegex = new RegExp(regexStr + '$')

  return (
    regex.test(targetUrl) ||
    relativeRegex.test(targetUrl) ||
    regex.test(targetSrc) ||
    relativeRegex.test(targetSrc)
  )
}

function isStartPageFallback (page, playbook) {
  const startPage = (playbook.site && (playbook.site.startPage || playbook.site.start_page)) || ''
  if (!startPage) return false

  const pageSrc = page.src || {}
  const targetFile = startPage.includes('::') ? startPage.split('::')[1] : startPage
  if (pageSrc.relative === targetFile) return true
  if (page.pub && page.pub.url && targetFile) {
    const htmlName = targetFile.replace(/\.adoc$/, '.html')
    if (page.pub.url.endsWith(htmlName)) return true
  }
  return false
}

function getSmartDefaultPriority (page, fallback) {
  const url = (page.pub && page.pub.url) || ''

  // Top-level index / landing pages
  if (url.endsWith('/index.html') || url === '/index.html') {
    return 0.8
  }

  // Core overview or architecture pages
  if (url.endsWith('/overview.html') || url.endsWith('/architecture.html')) {
    return 0.8
  }

  // Static / policy / about pages
  if (url.includes('/static/')) {
    return 0.3
  }

  return fallback
}

function getSmartDefaultChangefreq (page, fallback) {
  const url = (page.pub && page.pub.url) || ''
  if (url.endsWith('/index.html') || url.endsWith('/overview.html')) {
    return 'weekly'
  }
  if (url.includes('/static/')) {
    return 'yearly'
  }
  return fallback
}

function escapeXml (str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function buildSitemapXml (entries) {
  const xmlLines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ]

  for (const entry of entries) {
    xmlLines.push('  <url>')
    xmlLines.push(`    <loc>${escapeXml(entry.loc)}</loc>`)
    xmlLines.push(`    <lastmod>${escapeXml(entry.lastmod)}</lastmod>`)
    if (entry.changefreq) {
      xmlLines.push(`    <changefreq>${escapeXml(entry.changefreq)}</changefreq>`)
    }
    if (entry.priority) {
      xmlLines.push(`    <priority>${escapeXml(entry.priority)}</priority>`)
    }
    xmlLines.push('  </url>')
  }

  xmlLines.push('</urlset>')
  xmlLines.push('')

  return xmlLines.join('\n')
}
