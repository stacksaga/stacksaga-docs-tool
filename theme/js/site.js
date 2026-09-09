!function () {
    "use strict";
    var a = /^sect[0-5](?=$| )/, t = document.querySelector(".nav-container"),
        n = document.querySelector(".toolbar .nav-toggle");
    n.addEventListener("click", function (e) {
        if (n.classList.contains("is-active")) return u(e);
        v(e);
        e = document.documentElement;
        /mobi/i.test(window.navigator.userAgent) && (Math.round(parseFloat(window.getComputedStyle(e).minHeight)) !== window.innerHeight ? e.style.setProperty("--vh", window.innerHeight / 100 + "px") : e.style.removeProperty("--vh"));
        e.classList.add("is-clipped--nav"), n.classList.add("is-active"), t.classList.add("is-active"), e.addEventListener("click", u)
    }), t.addEventListener("click", v);
    var i, e, o, r = t.querySelector(".nav"), s = r.querySelector("[data-panel=menu]"),
        c = {encroachingElement: document.querySelector("footer.footer")};
    if (window.addEventListener("load", m), window.addEventListener("resize", m), !s) return m({}), 0;

    function l(e, t) {
        t && p(s, ".nav-item.is-active").forEach(function (e) {
            e.classList.remove("is-current-path", "is-current-page", "is-active")
        });
        for (var n = e; (n = n.parentNode) && n !== s;) n.classList.contains("nav-item") && n.classList.add("is-current-path", "is-active");
        e.classList.add("is-current-page", "is-active")
    }

    function d() {
        var e, t, n, i;
        this.classList.toggle("is-active") && (e = parseFloat(window.getComputedStyle(this).marginTop), t = this.getBoundingClientRect(), n = s.getBoundingClientRect(), 0 < (i = Math.round(t.bottom - n.top - n.height + e)) && (s.scrollTop += Math.min(Math.round(t.top - n.top - e), i)))
    }

    function u(e) {
        v(e);
        e = document.documentElement;
        e.classList.remove("is-clipped--nav"), n.classList.remove("is-active"), t.classList.remove("is-active"), e.removeEventListener("click", u)
    }

    function v(e) {
        e.stopPropagation()
    }

    function g(e) {
        var t = window.location.hash;
        if (t) {
            t.indexOf("%") && (t = decodeURIComponent(t)), t.indexOf('"') && (t = t.replace(/(?=")/g, "\\"));
            var n = !e && s.querySelector('.nav-link[href="' + t + '"]');
            if (n) return n.parentNode;
            t = document.getElementById(t.slice(1));
            if (t) for (var i = document.querySelector("article.doc"), o = t; (o = o.parentNode) && o !== i;) {
                var r = o.id;
                if ((r = r || a.test(o.className) && (o.firstElementChild || {}).id) && (n = s.querySelector('.nav-link[href="#' + r + '"]'))) return n.parentNode
            }
        }
    }

    function h(e, t) {
        var n = e.getBoundingClientRect();
        e.scrollHeight !== Math.round(n.height) && (t = t.querySelector(".nav-link").getBoundingClientRect(), e.scrollTop += Math.round(t.top - n.top - .5 * (n.height - t.height)))
    }

    function p(e, t) {
        return [].slice.call(e.querySelectorAll(t))
    }

    function m(e) {
        window.removeEventListener("scroll", f), "fixed" !== window.getComputedStyle(t).position && (c.availableHeight = window.innerHeight, c.preferredHeight = t.getBoundingClientRect().height, f() && "resize" !== e.type && i && h(s, i), window.addEventListener("scroll", f))
    }

    function f() {
        var e = s && s.scrollTop + s.offsetHeight,
            t = c.availableHeight - c.encroachingElement.getBoundingClientRect().top,
            t = 0 < t ? r.style.height !== (r.style.height = Math.max(Math.round(c.preferredHeight - t), 0) + "px") : !!r.style.removeProperty("height");
        return s && (s.scrollTop = e - s.offsetHeight), t
    }

    s.classList.contains("is-loading") ? ((i = g() || s.querySelector(".is-current-url")) ? (l(i), h(s, i)) : s.scrollTop = 0, s.classList.remove("is-loading")) : (e = i = s.querySelector(".is-current-page")) && !e.classList.contains("is-provisional") || !(e = g(!0)) || (o = !!i, l(i = e, o), h(s, i)), m({}), s.querySelector(".nav-menu-toggle").addEventListener("click", function () {
        var t = !this.classList.toggle("is-active");
        p(s, ".nav-item > .nav-item-toggle").forEach(function (e) {
            t ? e.parentElement.classList.remove("is-active") : e.parentElement.classList.add("is-active")
        }), i ? (t && l(i), h(s, i)) : s.scrollTop = 0
    }), p(s, ".nav-item-toggle").forEach(function (e) {
        e.addEventListener("click", d.bind(e.parentElement));
        var t = e.nextElementSibling;
        t && t.classList.contains("nav-text") && (t.style.cursor = "pointer", t.addEventListener("click", d.bind(e.parentElement)))
    }), r.querySelector("[data-panel=explore] .context").addEventListener("click", function () {
        p(r, "[data-panel]").forEach(function (e) {
            e.classList.toggle("is-active")
        })
    }), s.addEventListener("mousedown", function (e) {
        1 < e.detail && e.preventDefault()
    }), s.querySelector('.nav-link[href^="#"]') && window.addEventListener("hashchange", function () {
        var e = g() || s.querySelector(".is-current-url");
        e && e !== i && (l(i = e, !0), h(s, i))
    })
}();
!function () {
    "use strict";
    var e = document.querySelector("aside.toc.sidebar");
    if (e) {
        if (document.querySelector("body.-toc")) return e.parentNode.removeChild(e);
        var t = parseInt(e.dataset.levels || 2, 10);
        if (!(t < 0)) {
            for (var o = "article.doc", d = document.querySelector(o), n = [], i = 0; i <= t; i++) {
                var r = [o];
                if (i) {
                    for (var a = 1; a <= i; a++) r.push((2 === a ? ".sectionbody>" : "") + ".sect" + a);
                    r.push("h" + (i + 1) + "[id]")
                } else r.push("h1[id].sect0");
                n.push(r.join(">"))
            }
            var c, s = (m = n.join(","), f = d.parentNode, [].slice.call((f || document).querySelectorAll(m)));
            if (!s.length) return e.parentNode.removeChild(e);
            var l = {}, u = s.reduce(function (e, t) {
                var o = document.createElement("a");
                o.textContent = t.textContent, l[o.href = "#" + t.id] = o;
                var n = document.createElement("li");
                return n.dataset.level = parseInt(t.nodeName.slice(1), 10) - 1, n.appendChild(o), e.appendChild(n), e
            }, document.createElement("ul")), f = e.querySelector(".toc-menu");
            f || ((f = document.createElement("div")).className = "toc-menu");
            var m = document.createElement("h3");
            m.textContent = e.dataset.title || "Contents", f.appendChild(m), f.appendChild(u);
            e = !document.getElementById("toc") && d.querySelector("h1.page ~ :not(.is-before-toc)");
            e && ((m = document.createElement("aside")).className = "toc embedded", m.appendChild(f.cloneNode(!0)), e.parentNode.insertBefore(m, e)), window.addEventListener("load", function () {
                p(), window.addEventListener("scroll", p)
            })
        }
    }

    function p() {
        var t, e = window.pageYOffset, o = 1.15 * v(document.documentElement, "fontSize"), n = d.offsetTop;
        if (e && window.innerHeight + e + 2 >= document.documentElement.scrollHeight) {
            c = Array.isArray(c) ? c : Array(c || 0);
            var i = [], r = s.length - 1;
            return s.forEach(function (e, t) {
                var o = "#" + e.id;
                t === r || e.getBoundingClientRect().top + v(e, "paddingTop") > n ? (i.push(o), c.indexOf(o) < 0 && l[o].classList.add("is-active")) : ~c.indexOf(o) && l[c.shift()].classList.remove("is-active")
            }), u.scrollTop = u.scrollHeight - u.offsetHeight, void (c = 1 < i.length ? i : i[0])
        }
        Array.isArray(c) && (c.forEach(function (e) {
            l[e].classList.remove("is-active")
        }), c = void 0), s.some(function (e) {
            return e.getBoundingClientRect().top + v(e, "paddingTop") - o > n || void (t = "#" + e.id)
        }), t ? t !== c && (c && l[c].classList.remove("is-active"), (e = l[t]).classList.add("is-active"), u.scrollHeight > u.offsetHeight && (u.scrollTop = Math.max(0, e.offsetTop + e.offsetHeight - u.offsetHeight)), c = t) : c && (l[c].classList.remove("is-active"), c = void 0)
    }

    function v(e, t) {
        return parseFloat(window.getComputedStyle(e)[t])
    }
}();
!function () {
    "use strict";
    var o = document.querySelector("article.doc"), t = document.querySelector(".toolbar");

    function i(e) {
        return e && (~e.indexOf("%") ? decodeURIComponent(e) : e).slice(1)
    }

    function r(e) {
        if (e) {
            if (e.altKey || e.ctrlKey) return;
            window.location.hash = "#" + this.id, e.preventDefault()
        }
        window.scrollTo(0, function e(t, n) {
            return o.contains(t) ? e(t.offsetParent, t.offsetTop + n) : n
        }(this, 0) - t.getBoundingClientRect().bottom)
    }

    window.addEventListener("load", function e(t) {
        var n, o;
        (n = i(window.location.hash)) && (o = document.getElementById(n)) && (r.bind(o)(), setTimeout(r.bind(o), 0)), window.removeEventListener("load", e)
    }), Array.prototype.slice.call(document.querySelectorAll('a[href^="#"]')).forEach(function (e) {
        var t, n;
        (t = i(e.hash)) && (n = document.getElementById(t)) && e.addEventListener("click", r.bind(n))
    })
}();
!function () {
    "use strict";
    var t, e = document.querySelector(".page-versions .version-menu-toggle");
    e && (t = document.querySelector(".page-versions"), e.addEventListener("click", function (e) {
        t.classList.toggle("is-active"), e.stopPropagation()
    }), document.documentElement.addEventListener("click", function () {
        t.classList.remove("is-active")
    }))
}();
!function () {
    "use strict";
    var t = document.querySelector(".navbar-burger");
    t && t.addEventListener("click", function (t) {
        t.stopPropagation();
        var e = document.documentElement, t = document.getElementById(this.dataset.target);
        !t.classList.contains("is-active") && /mobi/i.test(window.navigator.userAgent) && (Math.round(parseFloat(window.getComputedStyle(e).minHeight)) !== window.innerHeight ? e.style.setProperty("--vh", window.innerHeight / 100 + "px") : e.style.removeProperty("--vh"));
        e.classList.toggle("is-clipped--navbar"), this.classList.toggle("is-active"), t.classList.toggle("is-active")
    }.bind(t))
}();
!function () {
    "use strict";
    var o = /^\$ (\S[^\\\n]*(\\\n(?!\$ )[^\\\n]*)*)(?=\n|$)/gm, l = /( ) *\\\n *|\\\n( ?) */g, d = / +$/gm,
        e = (document.getElementById("site-script") || {dataset: {}}).dataset, r = e.uiRootPath, p = e.svgAs,
        h = window.navigator.clipboard && null != r;
    [].slice.call(document.querySelectorAll(".doc pre.highlight, .doc .literalblock pre")).forEach(function (e) {
        var t, n, c, a, i;
        if (e.classList.contains("highlight")) (c = (t = e.querySelector("code")).dataset.lang) && "console" !== c && ((a = document.createElement("span")).className = "source-lang", a.appendChild(document.createTextNode(c))); else {
            if (!e.innerText.startsWith("$ ")) return;
            var s = e.parentNode.parentNode;
            s.classList.remove("literalblock"), s.classList.add("listingblock"), e.classList.add("highlightjs", "highlight"), (t = document.createElement("code")).className = "language-console hljs", t.dataset.lang = "console", t.appendChild(e.firstChild), e.appendChild(t)
        }
        (c = document.createElement("div")).className = "source-toolbox", a && c.appendChild(a), h && ((n = document.createElement("button")).className = "copy-button", n.setAttribute("title", "Copy to clipboard"), "svg" === p ? ((s = document.createElementNS("http://www.w3.org/2000/svg", "svg")).setAttribute("class", "copy-icon"), (a = document.createElementNS("http://www.w3.org/2000/svg", "use")).setAttribute("href", r + "/img/octicons-16.svg#icon-clippy"), s.appendChild(a), n.appendChild(s)) : ((i = document.createElement("img")).src = r + "/img/octicons-16.svg#view-clippy", i.alt = "copy icon", i.className = "copy-icon", n.appendChild(i)), (i = document.createElement("span")).className = "copy-toast", i.appendChild(document.createTextNode("Copied!")), n.appendChild(i), c.appendChild(n)), e.appendChild(c), n && n.addEventListener("click", function (e) {
            var t = e.innerText.replace(d, "");
            "console" === e.dataset.lang && t.startsWith("$ ") && (t = function (e) {
                var t, n = [];
                for (; t = o.exec(e);) n.push(t[1].replace(l, "$1$2"));
                return n.join(" && ")
            }(t));
            window.navigator.clipboard.writeText(t).then(function () {
                this.classList.add("clicked"), this.offsetHeight, this.classList.remove("clicked")
            }.bind(this), function () {
            })
        }.bind(n, t))
    })
}();
!function () {
    "use strict";
    var t, n, e;

    function o(e) {
        window.navigator.clipboard.writeText(e).then(function () {
        }, function () {
        })
    }

    window.navigator.clipboard && (t = /H[2-6]/, n = (document.querySelector("head meta[name=page-spec]") || {}).content, e = document.querySelector(".toolbar .edit-this-page a"), n && e && (e && e.addEventListener("click", function (e) {
        e.altKey && o(n)
    }), [].slice.call(document.querySelectorAll(".doc a.anchor")).forEach(function (e) {
        t.test(e.parentNode.tagName) && e.addEventListener("click", function (e) {
            e.altKey && (e.preventDefault(), o(n + function (e) {
                return ~e.indexOf("%") ? decodeURIComponent(e) : e
            }(this.hash)))
        }.bind(e))
    })))
}();

const targetDate = new Date("2024-12-10T23:59:59").getTime();

// Function to update the countdown
function updateCountdown() {
    const now = new Date().getTime();
    const timeLeft = targetDate - now;

    if (timeLeft <= 0) {
        document.getElementById("countdown").innerHTML = "";
        clearInterval(interval);
        return;
    }

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    document.getElementById("countdown").innerHTML =
        `Framework is published soon... ${days}d ${hours}h ${minutes}m ${seconds}s`;
}

// document.querySelector('.nav-menu-toggle').click();
// Update the countdown every second
const interval = setInterval(updateCountdown, 1000);

// Collapse/expand the left navigation sidebar (desktop) as a toggle
(function () {
    var STORAGE_KEY = "nav-collapsed";
    var toggle = document.querySelector(".toolbar .nav-collapse-toggle");
    if (!toggle) return;
    toggle.addEventListener("click", function () {
        var collapsed = document.documentElement.classList.toggle("is-nav-collapsed");
        try {
            window.localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0");
        } catch (e) {}
    });
})();

// ==========================================================================
// Interactive Image Zoom, Pan, and Lightbox Explorer
// ==========================================================================
// Interactive Image Zoom, Pan, and Lightbox Explorer
// ==========================================================================
!function () {
    "use strict";

    var overlay, stage, viewport, card, titleEl, zoomBadge, helperPill;
    var scale = 1.0, translateX = 0, translateY = 0;
    var baseWidth = 0, baseHeight = 0;
    var currentNatW = 0, currentNatH = 0;
    var currentLoadId = 0;
    var isMouseDown = false, hasDragged = false, startX = 0, startY = 0;
    var initialDistance = 0, initialScale = 1;
    var MIN_SCALE = 0.5, MAX_SCALE = 6.0, STEP = 0.25;

    function createLightbox() {
        if (overlay) return;

        overlay = document.createElement("div");
        overlay.className = "image-lightbox-overlay";
        overlay.setAttribute("role", "dialog");
        overlay.setAttribute("aria-modal", "true");
        overlay.setAttribute("aria-label", "Image Zoom Viewer");

        overlay.innerHTML =
            '<div class="image-lightbox-header">' +
                '<div class="image-lightbox-title"></div>' +
                '<div class="image-lightbox-actions">' +
                    '<button type="button" class="image-lightbox-btn btn-zoom-out" title="Zoom Out (-)" aria-label="Zoom Out">' +
                        '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>' +
                    '</button>' +
                    '<span class="image-lightbox-zoom-badge" title="Click to Reset (100%)">100%</span>' +
                    '<button type="button" class="image-lightbox-btn btn-zoom-in" title="Zoom In (+)" aria-label="Zoom In">' +
                        '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>' +
                    '</button>' +
                    '<button type="button" class="image-lightbox-btn btn-reset" title="Fit to Screen (0)" aria-label="Fit to Screen">' +
                        '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><polyline points="3 3 3 8 8 8"></polyline></svg>' +
                    '</button>' +
                    '<a class="image-lightbox-btn btn-open-tab" title="Open Original Image in New Tab" target="_blank" rel="noopener noreferrer" aria-label="Open in New Tab">' +
                        '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>' +
                    '</a>' +
                    '<button type="button" class="image-lightbox-btn btn-close" title="Close (Esc)" aria-label="Close">' +
                        '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>' +
                    '</button>' +
                '</div>' +
            '</div>' +
            '<div class="image-lightbox-viewport">' +
                '<div class="image-lightbox-stage">' +
                    '<div class="image-lightbox-card"></div>' +
                '</div>' +
            '</div>' +
            '<div class="image-lightbox-hint">Scroll to zoom &bull; Drag to pan &bull; Double-click to expand &bull; Esc to close</div>';

        document.body.appendChild(overlay);

        titleEl = overlay.querySelector(".image-lightbox-title");
        zoomBadge = overlay.querySelector(".image-lightbox-zoom-badge");
        helperPill = overlay.querySelector(".image-lightbox-hint");
        viewport = overlay.querySelector(".image-lightbox-viewport");
        stage = overlay.querySelector(".image-lightbox-stage");
        card = overlay.querySelector(".image-lightbox-card");

        // Toolbar controls
        overlay.querySelector(".btn-zoom-in").addEventListener("click", function (e) {
            e.stopPropagation();
            zoomTo(scale + STEP);
        });

        overlay.querySelector(".btn-zoom-out").addEventListener("click", function (e) {
            e.stopPropagation();
            zoomTo(scale - STEP);
        });

        zoomBadge.addEventListener("click", function (e) {
            e.stopPropagation();
            resetTransform();
        });

        overlay.querySelector(".btn-reset").addEventListener("click", function (e) {
            e.stopPropagation();
            resetTransform();
        });

        overlay.querySelector(".btn-close").addEventListener("click", function (e) {
            e.stopPropagation();
            closeLightbox();
        });

        // Close when clicking empty backdrop area
        viewport.addEventListener("click", function (e) {
            if (!hasDragged && (e.target === viewport || e.target === stage)) {
                closeLightbox();
            }
        });

        // Double click to toggle 2x zoom
        card.addEventListener("dblclick", function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (scale > 1.05) {
                resetTransform();
            } else {
                zoomTo(2.0, e.clientX, e.clientY);
            }
        });

        // Mouse wheel zoom centered at cursor
        viewport.addEventListener("wheel", function (e) {
            e.preventDefault();
            var factor = e.deltaY < 0 ? 1.18 : 0.85;
            var targetScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale * factor));
            zoomTo(targetScale, e.clientX, e.clientY);
        }, { passive: false });

        // Mouse drag to pan
        viewport.addEventListener("mousedown", function (e) {
            if (e.button !== 0) return;
            isMouseDown = true;
            hasDragged = false;
            startX = e.clientX - translateX;
            startY = e.clientY - translateY;
            stage.classList.add("is-dragging");
        });

        window.addEventListener("mousemove", function (e) {
            if (!isMouseDown) return;
            var dx = e.clientX - startX;
            var dy = e.clientY - startY;
            if (Math.abs(dx - translateX) > 3 || Math.abs(dy - translateY) > 3) {
                hasDragged = true;
            }
            translateX = dx;
            translateY = dy;
            updateTransform(false);
        });

        window.addEventListener("mouseup", function () {
            if (!isMouseDown) return;
            isMouseDown = false;
            stage.classList.remove("is-dragging");
        });

        // Touch support (1 finger pan, 2 fingers pinch)
        viewport.addEventListener("touchstart", function (e) {
            if (e.touches.length === 1) {
                isMouseDown = true;
                hasDragged = false;
                startX = e.touches[0].clientX - translateX;
                startY = e.touches[0].clientY - translateY;
            } else if (e.touches.length === 2) {
                isMouseDown = false;
                initialDistance = getTouchDistance(e.touches);
                initialScale = scale;
            }
        }, { passive: true });

        viewport.addEventListener("touchmove", function (e) {
            if (e.touches.length === 1 && isMouseDown) {
                var dx = e.touches[0].clientX - startX;
                var dy = e.touches[0].clientY - startY;
                if (Math.abs(dx - translateX) > 3 || Math.abs(dy - translateY) > 3) {
                    hasDragged = true;
                }
                translateX = dx;
                translateY = dy;
                updateTransform(false);
            } else if (e.touches.length === 2 && initialDistance > 0) {
                var dist = getTouchDistance(e.touches);
                var center = getTouchCenter(e.touches);
                var targetScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, initialScale * (dist / initialDistance)));
                zoomTo(targetScale, center.x, center.y);
            }
        }, { passive: true });

        viewport.addEventListener("touchend", function (e) {
            if (e.touches.length === 0) {
                isMouseDown = false;
                initialDistance = 0;
            }
        });

        // Keyboard shortcuts
        window.addEventListener("keydown", function (e) {
            if (!overlay || !overlay.classList.contains("is-active")) return;
            if (e.key === "Escape") {
                closeLightbox();
            } else if (e.key === "+" || e.key === "=") {
                zoomTo(scale + STEP);
            } else if (e.key === "-" || e.key === "_") {
                zoomTo(scale - STEP);
            } else if (e.key === "0" || e.key === "r" || e.key === "R") {
                resetTransform();
            }
        });

        // Resize handler
        window.addEventListener("resize", function () {
            if (!overlay || !overlay.classList.contains("is-active")) return;
            if (currentNatW && currentNatH) {
                calcBaseDimensions(currentNatW, currentNatH);
                updateTransform(false);
            }
        });
    }

    function getTouchDistance(touches) {
        var dx = touches[0].clientX - touches[1].clientX;
        var dy = touches[0].clientY - touches[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    function getTouchCenter(touches) {
        return {
            x: (touches[0].clientX + touches[1].clientX) / 2,
            y: (touches[0].clientY + touches[1].clientY) / 2
        };
    }

    function calcBaseDimensions(natW, natH) {
        currentNatW = natW;
        currentNatH = natH;
        var aspect = (natW && natH) ? (natW / natH) : (16 / 9);
        var rect = viewport ? viewport.getBoundingClientRect() : { width: window.innerWidth, height: window.innerHeight };
        var maxW = Math.max(300, (rect.width || window.innerWidth) * 0.90);
        var maxH = Math.max(200, (rect.height || window.innerHeight) * 0.85);

        var baseW = maxW;
        var baseH = baseW / aspect;
        if (baseH > maxH) {
            baseH = maxH;
            baseW = baseH * aspect;
        }
        baseWidth = Math.round(baseW);
        baseHeight = Math.round(baseH);
    }

    function updateTransform(withTransition) {
        if (!card || !baseWidth || !baseHeight) return;

        var curW = Math.round(baseWidth * scale);
        var curH = Math.round(baseHeight * scale);

        if (withTransition) {
            stage.style.transition = "transform 0.18s cubic-bezier(0.2, 0, 0, 1)";
            card.style.transition = "width 0.18s cubic-bezier(0.2, 0, 0, 1), height 0.18s cubic-bezier(0.2, 0, 0, 1), margin 0.18s cubic-bezier(0.2, 0, 0, 1)";
        } else {
            stage.style.transition = "none";
            card.style.transition = "none";
        }

        card.style.width = curW + "px";
        card.style.height = curH + "px";
        card.style.marginLeft = -Math.round(curW / 2) + "px";
        card.style.marginTop = -Math.round(curH / 2) + "px";

        stage.style.transform = "translate(" + Math.round(translateX) + "px, " + Math.round(translateY) + "px)";
        zoomBadge.textContent = Math.round(scale * 100) + "%";
    }

    function zoomTo(newScale, focalX, focalY) {
        var clamped = Math.min(MAX_SCALE, Math.max(MIN_SCALE, Math.round(newScale * 100) / 100));
        if (focalX !== undefined && focalY !== undefined && scale !== clamped) {
            var rect = viewport.getBoundingClientRect();
            var px = focalX - (rect.left + rect.width / 2);
            var py = focalY - (rect.top + rect.height / 2);
            translateX = Math.round(px - (px - translateX) * (clamped / scale));
            translateY = Math.round(py - (py - translateY) * (clamped / scale));
        }
        scale = clamped;
        updateTransform(true);
    }

    function resetTransform() {
        scale = 1.0;
        translateX = 0;
        translateY = 0;
        updateTransform(true);
    }

    function displaySvg(svgEl) {
        card.innerHTML = "";
        svgEl.setAttribute("draggable", "false");

        // Determine natural dimensions from viewBox or width/height attributes
        var natW = 0, natH = 0;
        var vb = svgEl.getAttribute("viewBox");
        if (vb) {
            var parts = vb.trim().split(/[\s,]+/);
            if (parts.length >= 4) {
                natW = parseFloat(parts[2]);
                natH = parseFloat(parts[3]);
            }
        }
        if (!natW || !natH) {
            natW = parseFloat(svgEl.getAttribute("width")) || 1100;
            natH = parseFloat(svgEl.getAttribute("height")) || 1480;
        }

        svgEl.setAttribute("preserveAspectRatio", "xMidYMid meet");
        svgEl.removeAttribute("width");
        svgEl.removeAttribute("height");
        card.appendChild(svgEl);

        calcBaseDimensions(natW, natH);
        updateTransform(false);
    }

    function displayImg(src, alt) {
        card.innerHTML = "";
        var imgEl = document.createElement("img");
        imgEl.draggable = false;
        imgEl.alt = alt || "";
        card.appendChild(imgEl);

        imgEl.onload = function () {
            var natW = imgEl.naturalWidth || 1000;
            var natH = imgEl.naturalHeight || 750;
            calcBaseDimensions(natW, natH);
            updateTransform(false);
        };
        imgEl.src = src;
        if (imgEl.complete && imgEl.naturalWidth > 0) {
            calcBaseDimensions(imgEl.naturalWidth, imgEl.naturalHeight);
            updateTransform(false);
        }
    }

    function openLightbox(src, alt, title) {
        createLightbox();
        titleEl.textContent = title || alt || "Image Preview";
        overlay.querySelector(".btn-open-tab").href = src;
        resetTransform();

        document.documentElement.classList.add("is-clipped--lightbox");
        overlay.classList.add("is-active");

        var loadId = ++currentLoadId;
        var isSvg = /\.svg($|\?)/i.test(src);

        if (isSvg) {
            fetch(src)
                .then(function (res) {
                    if (!res.ok) throw new Error("HTTP " + res.status);
                    return res.text();
                })
                .then(function (svgText) {
                    if (loadId !== currentLoadId) return;
                    var parser = new DOMParser();
                    var doc = parser.parseFromString(svgText, "image/svg+xml");
                    var svgEl = doc.querySelector("svg");
                    if (svgEl && !doc.querySelector("parsererror")) {
                        displaySvg(svgEl);
                        return;
                    }
                    displayImg(src, alt);
                })
                .catch(function () {
                    if (loadId !== currentLoadId) return;
                    displayImg(src, alt);
                });
        } else {
            displayImg(src, alt);
        }

        if (helperPill) {
            helperPill.classList.remove("is-hidden");
            clearTimeout(helperPill._timer);
            helperPill._timer = setTimeout(function () {
                helperPill.classList.add("is-hidden");
            }, 3500);
        }
    }

    function closeLightbox() {
        if (!overlay) return;
        overlay.classList.remove("is-active");
        document.documentElement.classList.remove("is-clipped--lightbox");
    }

    function initZoomableImages() {
        // Query standard images
        var images = document.querySelectorAll("article.doc img, .doc .imageblock img, .doc .image img, .doc img");
        images.forEach(function (image) {
            if (image.classList.contains("icon") || image.closest(".icon") || image.closest(".nav") || image.closest(".navbar") || image.closest("header")) {
                return;
            }
            if (image.classList.contains("image-lightbox-img") || image.closest(".image-lightbox-overlay")) {
                return;
            }

            image.classList.add("zoomable-image");

            var caption = "";
            var titleBlock = image.closest(".imageblock") && image.closest(".imageblock").querySelector(".title");
            if (titleBlock) {
                caption = titleBlock.textContent.trim();
            } else if (image.getAttribute("alt")) {
                caption = image.getAttribute("alt").trim();
            } else if (image.getAttribute("title")) {
                caption = image.getAttribute("title").trim();
            }

            image.addEventListener("click", function (e) {
                var parentLink = image.closest("a");
                if (parentLink && parentLink.href && (parentLink.href === image.src || parentLink.href.match(/\.(svg|png|jpe?g|webp)($|\?)/i))) {
                    e.preventDefault();
                }
                openLightbox(image.src, image.alt, caption);
            });
        });

        // Query interactive SVG objects (e.g. opts=interactive)
        var objects = document.querySelectorAll("article.doc object[type='image/svg+xml']");
        objects.forEach(function (obj) {
            var src = obj.getAttribute("data");
            if (!src) return;

            var altEl = obj.querySelector(".alt");
            var caption = altEl ? altEl.textContent.trim() : (obj.getAttribute("aria-label") || "Diagram Preview");

            function attachObjectClick() {
                try {
                    var doc = obj.contentDocument;
                    if (doc && doc.documentElement) {
                        doc.documentElement.style.cursor = "zoom-in";
                        doc.documentElement.addEventListener("click", function (e) {
                            e.preventDefault();
                            openLightbox(src, caption, caption);
                        });
                    }
                } catch (e) {}
            }

            obj.addEventListener("load", attachObjectClick);
            attachObjectClick();
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initZoomableImages);
    } else {
        initZoomableImages();
    }
}();

