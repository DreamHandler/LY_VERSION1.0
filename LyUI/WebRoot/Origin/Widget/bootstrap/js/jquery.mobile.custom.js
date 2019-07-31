/*
* jQuery Mobile v1.4.5
* http://jquerymobile.com
*
* Copyright 2010, 2014 jQuery Foundation, Inc. and other contributors
* Released under the MIT license.
* http://jquery.org/license
*
*/
!function(a, b, c) {
    "function" == typeof define && define.amd ? define(["jquery"],
    function(d) {
        return c(d, a, b),
        d.mobile
    }) : c(a.jQuery, a, b)
} (this, document,
function(a, b, c, d) { !
    function(a, b, c, d) {
        function e(a) {
            for (; a && "undefined" != typeof a.originalEvent;) a = a.originalEvent;
            return a
        }
        function f(b, c) {
            var f, g, h, i, j, k, l, m, n, o = b.type;
            if (b = a.Event(b), b.type = c, f = b.originalEvent, g = a.event.props, o.search(/^(mouse|click)/) > -1 && (g = E), f) for (l = g.length, i; l;) i = g[--l],
            b[i] = f[i];
            if (o.search(/mouse(down|up)|click/) > -1 && !b.which && (b.which = 1), -1 !== o.search(/^touch/) && (h = e(f), o = h.touches, j = h.changedTouches, k = o && o.length ? o[0] : j && j.length ? j[0] : d)) for (m = 0, n = C.length; n > m; m++) i = C[m],
            b[i] = k[i];
            return b
        }
        function g(b) {
            for (var c, d, e = {}; b;) {
                c = a.data(b, z);
                for (d in c) c[d] && (e[d] = e.hasVirtualBinding = !0);
                b = b.parentNode
            }
            return e
        }
        function h(b, c) {
            for (var d; b;) {
                if (d = a.data(b, z), d && (!c || d[c])) return b;
                b = b.parentNode
            }
            return null
        }
        function i() {
            M = !1
        }
        function j() {
            M = !0
        }
        function k() {
            Q = 0,
            K.length = 0,
            L = !1,
            j()
        }
        function l() {
            i()
        }
        function m() {
            n(),
            G = setTimeout(function() {
                G = 0,
                k()
            },
            a.vmouse.resetTimerDuration)
        }
        function n() {
            G && (clearTimeout(G), G = 0)
        }
        function o(b, c, d) {
            var e;
            return (d && d[b] || !d && h(c.target, b)) && (e = f(c, b), a(c.target).trigger(e)),
            e
        }
        function p(b) {
            var c, d = a.data(b.target, A);
            L || Q && Q === d || (c = o("v" + b.type, b), c && (c.isDefaultPrevented() && b.preventDefault(), c.isPropagationStopped() && b.stopPropagation(), c.isImmediatePropagationStopped() && b.stopImmediatePropagation()))
        }
        function q(b) {
            var c, d, f, h = e(b).touches;
            h && 1 === h.length && (c = b.target, d = g(c), d.hasVirtualBinding && (Q = P++, a.data(c, A, Q), n(), l(), J = !1, f = e(b).touches[0], H = f.pageX, I = f.pageY, o("vmouseover", b, d), o("vmousedown", b, d)))
        }
        function r(a) {
            M || (J || o("vmousecancel", a, g(a.target)), J = !0, m())
        }
        function s(b) {
            if (!M) {
                var c = e(b).touches[0],
                d = J,
                f = a.vmouse.moveDistanceThreshold,
                h = g(b.target);
                J = J || Math.abs(c.pageX - H) > f || Math.abs(c.pageY - I) > f,
                J && !d && o("vmousecancel", b, h),
                o("vmousemove", b, h),
                m()
            }
        }
        function t(a) {
            if (!M) {
                j();
                var b, c, d = g(a.target);
                o("vmouseup", a, d),
                J || (b = o("vclick", a, d), b && b.isDefaultPrevented() && (c = e(a).changedTouches[0], K.push({
                    touchID: Q,
                    x: c.clientX,
                    y: c.clientY
                }), L = !0)),
                o("vmouseout", a, d),
                J = !1,
                m()
            }
        }
        function u(b) {
            var c, d = a.data(b, z);
            if (d) for (c in d) if (d[c]) return ! 0;
            return ! 1
        }
        function v() {}
        function w(b) {
            var c = b.substr(1);
            return {
                setup: function() {
                    u(this) || a.data(this, z, {});
                    var d = a.data(this, z);
                    d[b] = !0,
                    F[b] = (F[b] || 0) + 1,
                    1 === F[b] && O.bind(c, p),
                    a(this).bind(c, v),
                    N && (F.touchstart = (F.touchstart || 0) + 1, 1 === F.touchstart && O.bind("touchstart", q).bind("touchend", t).bind("touchmove", s).bind("scroll", r))
                },
                teardown: function() {--F[b],
                    F[b] || O.unbind(c, p),
                    N && (--F.touchstart, F.touchstart || O.unbind("touchstart", q).unbind("touchmove", s).unbind("touchend", t).unbind("scroll", r));
                    var d = a(this),
                    e = a.data(this, z);
                    e && (e[b] = !1),
                    d.unbind(c, v),
                    u(this) || d.removeData(z)
                }
            }
        }
        var x, y, z = "virtualMouseBindings",
        A = "virtualTouchID",
        B = "vmouseover vmousedown vmousemove vmouseup vclick vmouseout vmousecancel".split(" "),
        C = "clientX clientY pageX pageY screenX screenY".split(" "),
        D = a.event.mouseHooks ? a.event.mouseHooks.props: [],
        E = a.event.props.concat(D),
        F = {},
        G = 0,
        H = 0,
        I = 0,
        J = !1,
        K = [],
        L = !1,
        M = !1,
        N = "addEventListener" in c,
        O = a(c),
        P = 1,
        Q = 0;
        for (a.vmouse = {
            moveDistanceThreshold: 10,
            clickDistanceThreshold: 10,
            resetTimerDuration: 1500
        },
        y = 0; y < B.length; y++) a.event.special[B[y]] = w(B[y]);
        N && c.addEventListener("click",
        function(b) {
            var c, d, e, f, g, h, i = K.length,
            j = b.target;
            if (i) for (c = b.clientX, d = b.clientY, x = a.vmouse.clickDistanceThreshold, e = j; e;) {
                for (f = 0; i > f; f++) if (g = K[f], h = 0, e === j && Math.abs(g.x - c) < x && Math.abs(g.y - d) < x || a.data(e, A) === g.touchID) return b.preventDefault(),
                void b.stopPropagation();
                e = e.parentNode
            }
        },
        !0)
    } (a, b, c),
    function(a) {
        a.mobile = {}
    } (a),
    function(a, b) {
        var d = {
            touch: "ontouchend" in c
        };
        a.mobile.support = a.mobile.support || {},
        a.extend(a.support, d),
        a.extend(a.mobile.support, d)
    } (a),
    function(a, b, d) {
        function e(b, c, e, f) {
            var g = e.type;
            e.type = c,
            f ? a.event.trigger(e, d, b) : a.event.dispatch.call(b, e),
            e.type = g
        }
        var f = a(c),
        g = a.mobile.support.touch,
        h = "touchmove scroll",
        i = g ? "touchstart": "mousedown",
        j = g ? "touchend": "mouseup",
        k = g ? "touchmove": "mousemove";
        a.each("touchstart touchmove touchend tap taphold swipe swipeleft swiperight scrollstart scrollstop".split(" "),
        function(b, c) {
            a.fn[c] = function(a) {
                return a ? this.bind(c, a) : this.trigger(c)
            },
            a.attrFn && (a.attrFn[c] = !0)
        }),
        a.event.special.scrollstart = {
            enabled: !0,
            setup: function() {
                function b(a, b) {
                    c = b,
                    e(f, c ? "scrollstart": "scrollstop", a)
                }
                var c, d, f = this,
                g = a(f);
                g.bind(h,
                function(e) {
                    a.event.special.scrollstart.enabled && (c || b(e, !0), clearTimeout(d), d = setTimeout(function() {
                        b(e, !1)
                    },
                    50))
                })
            },
            teardown: function() {
                a(this).unbind(h)
            }
        },
        a.event.special.tap = {
            tapholdThreshold: 750,
            emitTapOnTaphold: !0,
            setup: function() {
                var b = this,
                c = a(b),
                d = !1;
                c.bind("vmousedown",
                function(g) {
                    function h() {
                        clearTimeout(k)
                    }
                    function i() {
                        h(),
                        c.unbind("vclick", j).unbind("vmouseup", h),
                        f.unbind("vmousecancel", i)
                    }
                    function j(a) {
                        i(),
                        d || l !== a.target ? d && a.preventDefault() : e(b, "tap", a)
                    }
                    if (d = !1, g.which && 1 !== g.which) return ! 1;
                    var k, l = g.target;
                    c.bind("vmouseup", h).bind("vclick", j),
                    f.bind("vmousecancel", i),
                    k = setTimeout(function() {
                        a.event.special.tap.emitTapOnTaphold || (d = !0),
                        e(b, "taphold", a.Event("taphold", {
                            target: l
                        }))
                    },
                    a.event.special.tap.tapholdThreshold)
                })
            },
            teardown: function() {
                a(this).unbind("vmousedown").unbind("vclick").unbind("vmouseup"),
                f.unbind("vmousecancel")
            }
        },
        a.event.special.swipe = {
            scrollSupressionThreshold: 30,
            durationThreshold: 1e3,
            horizontalDistanceThreshold: 30,
            verticalDistanceThreshold: 30,
            getLocation: function(a) {
                var c = b.pageXOffset,
                d = b.pageYOffset,
                e = a.clientX,
                f = a.clientY;
                return 0 === a.pageY && Math.floor(f) > Math.floor(a.pageY) || 0 === a.pageX && Math.floor(e) > Math.floor(a.pageX) ? (e -= c, f -= d) : (f < a.pageY - d || e < a.pageX - c) && (e = a.pageX - c, f = a.pageY - d),
                {
                    x: e,
                    y: f
                }
            },
            start: function(b) {
                var c = b.originalEvent.touches ? b.originalEvent.touches[0] : b,
                d = a.event.special.swipe.getLocation(c);
                return {
                    time: (new Date).getTime(),
                    coords: [d.x, d.y],
                    origin: a(b.target)
                }
            },
            stop: function(b) {
                var c = b.originalEvent.touches ? b.originalEvent.touches[0] : b,
                d = a.event.special.swipe.getLocation(c);
                return {
                    time: (new Date).getTime(),
                    coords: [d.x, d.y]
                }
            },
            handleSwipe: function(b, c, d, f) {
                if (c.time - b.time < a.event.special.swipe.durationThreshold && Math.abs(b.coords[0] - c.coords[0]) > a.event.special.swipe.horizontalDistanceThreshold && Math.abs(b.coords[1] - c.coords[1]) < a.event.special.swipe.verticalDistanceThreshold) {
                    var g = b.coords[0] > c.coords[0] ? "swipeleft": "swiperight";
                    return e(d, "swipe", a.Event("swipe", {
                        target: f,
                        swipestart: b,
                        swipestop: c
                    }), !0),
                    e(d, g, a.Event(g, {
                        target: f,
                        swipestart: b,
                        swipestop: c
                    }), !0),
                    !0
                }
                return ! 1
            },
            eventInProgress: !1,
            setup: function() {
                var b, c = this,
                d = a(c),
                e = {};
                b = a.data(this, "mobile-events"),
                b || (b = {
                    length: 0
                },
                a.data(this, "mobile-events", b)),
                b.length++,
                b.swipe = e,
                e.start = function(b) {
                    if (!a.event.special.swipe.eventInProgress) {
                        a.event.special.swipe.eventInProgress = !0;
                        var d, g = a.event.special.swipe.start(b),
                        h = b.target,
                        i = !1;
                        e.move = function(b) {
                            g && !b.isDefaultPrevented() && (d = a.event.special.swipe.stop(b), i || (i = a.event.special.swipe.handleSwipe(g, d, c, h), i && (a.event.special.swipe.eventInProgress = !1)), Math.abs(g.coords[0] - d.coords[0]) > a.event.special.swipe.scrollSupressionThreshold && b.preventDefault())
                        },
                        e.stop = function() {
                            i = !0,
                            a.event.special.swipe.eventInProgress = !1,
                            f.off(k, e.move),
                            e.move = null
                        },
                        f.on(k, e.move).one(j, e.stop)
                    }
                },
                d.on(i, e.start)
            },
            teardown: function() {
                var b, c;
                b = a.data(this, "mobile-events"),
                b && (c = b.swipe, delete b.swipe, b.length--, 0 === b.length && a.removeData(this, "mobile-events")),
                c && (c.start && a(this).off(i, c.start), c.move && f.off(k, c.move), c.stop && f.off(j, c.stop))
            }
        },
        a.each({
            scrollstop: "scrollstart",
            taphold: "tap",
            swipeleft: "swipe.left",
            swiperight: "swipe.right"
        },
        function(b, c) {
            a.event.special[b] = {
                setup: function() {
                    a(this).bind(c, a.noop)
                },
                teardown: function() {
                    a(this).unbind(c)
                }
            }
        })
    } (a, this)
});