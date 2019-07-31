!function() {
    "ace" in window || (window.ace = {}),
    ace.config = {
        storage_method: 0,
        cookie_expiry: 604800,
        cookie_path: ""
    },
    "vars" in window.ace || (window.ace.vars = {}),
    ace.vars.very_old_ie = !("querySelector" in document.documentElement),
    ace.settings = {
        saveState: function(a, b, c, d) {
            if (!a || "string" == typeof a && !(a = document.getElementById(a)) || !a.hasAttribute("id")) return ! 1;
            if (!ace.hasClass(a, "ace-save-state")) return ! 1;
            var b = b || "class",
            e = a.getAttribute("id"),
            f = ace.data.get("state", "id-" + e) || {};
            if ("string" == typeof f) try {
                f = JSON.parse(f)
            } catch(g) {
                f = {}
            }
            var h, i = "undefined" != typeof c,
            j = !1,
            k = /class/i,
            l = /checked|disabled|readonly|value/i;
            l.test(b) ? h = i ? c: a[b] : a.hasAttribute(b) ? h = i ? c: a.getAttribute(b) : i || (j = !0),
            j ? delete f[b] : k.test(b) ? (f.hasOwnProperty(b) || (f[b] = {}), d === !0 ? f[b][h] = 1 : d === !1 ? f[b][h] = -1 : f[b].className = h) : f[b] = h,
            ace.data.set("state", "id-" + e, JSON.stringify(f))
        },
        loadState: function(a, b) {
            if (!a || "string" == typeof a && !(a = document.getElementById(a)) || !a.hasAttribute("id")) return ! 1;
            var c = a.getAttribute("id"),
            d = ace.data.get("state", "id-" + c) || {};
            if ("string" == typeof d) try {
                d = JSON.parse(d)
            } catch(e) {
                d = {}
            }
            var f = function(a, b, c) {
                var d = /class/i,
                e = /checked|disabled|readonly|value/i;
                if (d.test(b)) {
                    if ("object" == typeof c) {
                        "className" in c && a.setAttribute("class", c.className);
                        for (var f in c) if (c.hasOwnProperty(f)) {
                            var g = c[f];
                            1 == g ? ace.addClass(a, f) : -1 == g && ace.removeClass(a, f)
                        }
                    }
                } else e.test(b) ? a[b] = c: a.setAttribute(b, c)
            };
            if (void 0 !== b) d.hasOwnProperty(b) && null !== d[b] && f(a, b, d[b]);
            else for (var g in d) d.hasOwnProperty(g) && null !== d[g] && f(a, g, d[g])
        },
        clearState: function(a) {
            var b = null;
            "string" == typeof a ? b = a: "hasAttribute" in a && a.hasAttribute("id") && (b = a.getAttribute("id")),
            b && ace.data.remove("state", "id-" + b)
        }
    },
    function() {
        var a = function() {
            var a = !1,
            b = "animation",
            c = "",
            d = "Webkit Moz O ms Khtml".split(" "),
            e = "",
            f = document.createElement("div");
            if (void 0 !== f.style.animationName && (a = !0), a === !1) for (var g = 0; g < d.length; g++) if (void 0 !== f.style[d[g] + "AnimationName"]) {
                e = d[g],
                b = e + "Animation",
                c = "-" + e.toLowerCase() + "-",
                a = !0;
                break
            }
            return a
        };
        if (ace.vars.animation = a(), ace.vars.animation) {
            var b = "@keyframes nodeInserted{from{outline-color:#fff}to{outline-color:#000}}@-moz-keyframes nodeInserted{from{outline-color:#fff}to{outline-color:#000}}@-webkit-keyframes nodeInserted{from{outline-color:#fff}to{outline-color:#000}}@-ms-keyframes nodeInserted{from{outline-color:#fff}to{outline-color:#000}}@-o-keyframes nodeInserted{from{outline-color:#fff}to{outline-color:#000}}.ace-save-state{animation-duration:10ms;-o-animation-duration:10ms;-ms-animation-duration:10ms;-moz-animation-duration:10ms;-webkit-animation-duration:10ms;animation-delay:0s;-o-animation-delay:0s;-ms-animation-delay:0s;-moz-animation-delay:0s;-webkit-animation-delay:0s;animation-name:nodeInserted;-o-animation-name:nodeInserted;-ms-animation-name:nodeInserted;-moz-animation-name:nodeInserted;-webkit-animation-name:nodeInserted}",
            c = document.createElement("style");
            c.innerHTML = b,
            document.head.appendChild(c);
            var d = function(a) {
                var b = a.target;
                b && ace.hasClass(b, "ace-save-state") && ace.settings.loadState(b)
            };
            document.addEventListener("animationstart", d, !1),
            document.addEventListener("MSAnimationStart", d, !1),
            document.addEventListener("webkitAnimationStart", d, !1)
        } else {
            var e = function() {
                for (var a = document.querySelectorAll(".ace-save-state"), b = 0; b < a.length; b++) ace.settings.loadState(a[b])
            };
            "complete" == document.readyState ? e() : document.addEventListener ? document.addEventListener("DOMContentLoaded", e, !1) : document.attachEvent && document.attachEvent("onreadystatechange",
            function() {
                "complete" == document.readyState && e()
            })
        }
    } (),
    ace.data_storage = function(a, b) {
        var c = "ace_",
        d = null,
        e = 0; (1 == a || a === b || 0 == a) && "localStorage" in window && null !== window.localStorage ? (d = ace.storage, e = 1) : null == d && (2 == a || a === b) && "cookie" in document && null !== document.cookie && (d = ace.cookie, e = 2),
        this.set = function(a, b, f, g, h, i) {
            if (d) if (f === i) f = b,
            b = a,
            null == f ? d.remove(c + b) : 1 == e ? d.set(c + b, f) : 2 == e && d.set(c + b, f, ace.config.cookie_expiry, g || ace.config.cookie_path);
            else if (1 == e) null == f ? d.remove(c + a + "_" + b) : (h && "object" == typeof f && (f = JSON.stringify(f)), d.set(c + a + "_" + b, f));
            else if (2 == e) {
                var j = d.get(c + a),
                k = j ? JSON.parse(j) : {};
                if (null == f) {
                    if (delete k[b], 0 == ace.sizeof(k)) return void d.remove(c + a)
                } else k[b] = f;
                d.set(c + a, JSON.stringify(k), ace.config.cookie_expiry, g || ace.config.cookie_path)
            }
        },
        this.get = function(a, b, f, g) {
            if (!d) return null;
            if (b === g) return b = a,
            d.get(c + b);
            if (1 == e) {
                var h = d.get(c + a + "_" + b);
                if (f && h) try {
                    h = JSON.parse(h)
                } catch(i) {}
                return h
            }
            if (2 == e) {
                var j = d.get(c + a),
                k = j ? JSON.parse(j) : {};
                return b in k ? k[b] : null
            }
        },
        this.remove = function(a, b, c) {
            d && (b === c ? (b = a, this.set(b, null)) : this.set(a, b, null))
        }
    },
    ace.cookie = {
        get: function(a) {
            var b, c, d = document.cookie,
            e = a + "=";
            if (d) {
                if (c = d.indexOf("; " + e), -1 == c) {
                    if (c = d.indexOf(e), 0 != c) return null
                } else c += 2;
                return b = d.indexOf(";", c),
                -1 == b && (b = d.length),
                decodeURIComponent(d.substring(c + e.length, b))
            }
        },
        set: function(a, b, c, d, e, f) {
            var g = new Date;
            "object" == typeof c && c.toGMTString ? c = c.toGMTString() : parseInt(c, 10) ? (g.setTime(g.getTime() + 1e3 * parseInt(c, 10)), c = g.toGMTString()) : c = "",
            document.cookie = a + "=" + encodeURIComponent(b) + (c ? "; expires=" + c: "") + (d ? "; path=" + d: "") + (e ? "; domain=" + e: "") + (f ? "; secure": "")
        },
        remove: function(a, b) {
            this.set(a, "", -1e3, b)
        }
    },
    ace.storage = {
        get: function(a) {
            return window.localStorage.getItem(a)
        },
        set: function(a, b) {
            window.localStorage.setItem(a, b)
        },
        remove: function(a) {
            window.localStorage.removeItem(a)
        }
    },
    ace.sizeof = function(a) {
        var b = 0;
        for (var c in a) a.hasOwnProperty(c) && b++;
        return b
    },
    ace.hasClass = function(a, b) {
        return (" " + a.className + " ").indexOf(" " + b + " ") > -1
    },
    ace.addClass = function(a, b) {
        for (var c = b.split(/\s+/), d = 0; d < c.length; d++) if (c[d].length > 0 && !ace.hasClass(a, c[d])) {
            var e = a.className;
            a.className = e + (e.length ? " ": "") + c[d]
        }
    },
    ace.removeClass = function(a, b) {
        for (var c = b.split(/\s+/), d = 0; d < c.length; d++) c[d].length > 0 && ace.replaceClass(a, c[d]);
        ace.replaceClass(a, b)
    },
    ace.replaceClass = function(a, b, c) {
        var d = new RegExp("(^|\\s)" + b + "(\\s|$)", "i");
        a.className = a.className.replace(d,
        function(a, b, d) {
            return c ? b + c + d: " "
        }).replace(/^\s+|\s+$/g, "")
    },
    ace.toggleClass = function(a, b) {
        ace.hasClass(a, b) ? ace.removeClass(a, b) : ace.addClass(a, b)
    },
    ace.isHTMlElement = function(a) {
        return window.HTMLElement ? a instanceof HTMLElement: "nodeType" in a ? 1 == a.nodeType: !1
    },
    ace.data = new ace.data_storage(ace.config.storage_method)
} (window.jQuery);