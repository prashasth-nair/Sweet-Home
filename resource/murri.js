/**
 * Muuri v0.9.5
 * https://muuri.dev/
 * Copyright (c) 2015-present, Haltu Oy
 * Released under the MIT license
 * https://github.com/haltu/muuri/blob/master/LICENSE.md
 * @license MIT
 *
 * Muuri Packer
 * Copyright (c) 2016-present, Niklas Rämö <inramo@gmail.com>
 * @license MIT
 *
 * Muuri Ticker / Muuri Emitter / Muuri Dragger
 * Copyright (c) 2018-present, Niklas Rämö <inramo@gmail.com>
 * @license MIT
 *
 * Muuri AutoScroller
 * Copyright (c) 2019-present, Niklas Rämö <inramo@gmail.com>
 * @license MIT
 */
!(function (t, e) {
  "object" == typeof exports && "undefined" != typeof module
    ? (module.exports = e())
    : "function" == typeof define && define.amd
    ? define(e)
    : ((t = "undefined" != typeof globalThis ? globalThis : t || self).Muuri =
        e());
})(this, function () {
  "use strict";
  var t = {},
    e = "function" == typeof Map ? new Map() : null,
    i = "swap",
    s = "move",
    n = "layoutStart",
    o = "layoutEnd",
    r = "layoutAbort",
    h = "remove",
    a = "hideStart",
    _ = "filter",
    l = "sort",
    d = "move",
    u = "send",
    c = "beforeSend",
    f = "receive",
    p = "beforeReceive",
    m = "dragReleaseEnd",
    g = "ontouchstart" in window,
    v = !!window.PointerEvent,
    y = !!window.navigator.msPointerEnabled;
  function S() {
    (this._events = {}),
      (this._queue = []),
      (this._counter = 0),
      (this._clearOnEmit = !1);
  }
  (S.prototype.on = function (t, e) {
    if (!this._events || !t || !e) return this;
    var i = this._events[t];
    return i || (i = this._events[t] = []), i.push(e), this;
  }),
    (S.prototype.off = function (t, e) {
      if (!this._events || !t || !e) return this;
      var i,
        s = this._events[t];
      if (!s || !s.length) return this;
      for (; -1 !== (i = s.indexOf(e)); ) s.splice(i, 1);
      return this;
    }),
    (S.prototype.clear = function (t) {
      if (!this._events || !t) return this;
      var e = this._events[t];
      return e && ((e.length = 0), delete this._events[t]), this;
    }),
    (S.prototype.emit = function (t) {
      if (!this._events || !t) return (this._clearOnEmit = !1), this;
      var e = this._events[t];
      if (!e || !e.length) return (this._clearOnEmit = !1), this;
      var i,
        s = this._queue,
        n = s.length,
        o = arguments.length - 1;
      o > 3 && ((i = []).push.apply(i, arguments), i.shift()),
        s.push.apply(s, e),
        this._clearOnEmit && ((e.length = 0), (this._clearOnEmit = !1)),
        ++this._counter;
      for (var r = n, h = s.length; r < h; r++)
        if (
          (0 === o
            ? s[r]()
            : 1 === o
            ? s[r](arguments[1])
            : 2 === o
            ? s[r](arguments[1], arguments[2])
            : 3 === o
            ? s[r](arguments[1], arguments[2], arguments[3])
            : s[r].apply(null, i),
          !this._events)
        )
          return this;
      return --this._counter, this._counter || (s.length = 0), this;
    }),
    (S.prototype.burst = function () {
      return this._events
        ? ((this._clearOnEmit = !0), this.emit.apply(this, arguments), this)
        : this;
    }),
    (S.prototype.countListeners = function (t) {
      if (!this._events) return 0;
      var e = this._events[t];
      return e ? e.length : 0;
    }),
    (S.prototype.destroy = function () {
      return this._events
        ? ((this._queue.length = this._counter = 0),
          (this._events = null),
          this)
        : this;
    });
  var w = v ? "pointerout" : y ? "MSPointerOut" : "";
  function D(t) {
    w &&
      ((this._dragger = t),
      (this._timeout = null),
      (this._outEvent = null),
      (this._isActive = !1),
      (this._addBehaviour = this._addBehaviour.bind(this)),
      (this._removeBehaviour = this._removeBehaviour.bind(this)),
      (this._onTimeout = this._onTimeout.bind(this)),
      (this._resetData = this._resetData.bind(this)),
      (this._onStart = this._onStart.bind(this)),
      (this._onOut = this._onOut.bind(this)),
      this._dragger.on("start", this._onStart));
  }
  (D.prototype._addBehaviour = function () {
    this._isActive ||
      ((this._isActive = !0),
      this._dragger.on("move", this._resetData),
      this._dragger.on("cancel", this._removeBehaviour),
      this._dragger.on("end", this._removeBehaviour),
      window.addEventListener(w, this._onOut));
  }),
    (D.prototype._removeBehaviour = function () {
      this._isActive &&
        (this._dragger.off("move", this._resetData),
        this._dragger.off("cancel", this._removeBehaviour),
        this._dragger.off("end", this._removeBehaviour),
        window.removeEventListener(w, this._onOut),
        this._resetData(),
        (this._isActive = !1));
    }),
    (D.prototype._resetData = function () {
      window.clearTimeout(this._timeout),
        (this._timeout = null),
        (this._outEvent = null);
    }),
    (D.prototype._onStart = function (t) {
      "mouse" !== t.pointerType && this._addBehaviour();
    }),
    (D.prototype._onOut = function (t) {
      this._dragger._getTrackedTouch(t) &&
        (this._resetData(),
        (this._outEvent = t),
        (this._timeout = window.setTimeout(this._onTimeout, 100)));
    }),
    (D.prototype._onTimeout = function () {
      var t = this._outEvent;
      this._resetData(), this._dragger.isActive() && this._dragger._onCancel(t);
    }),
    (D.prototype.destroy = function () {
      w && (this._dragger.off("start", this._onStart), this._removeBehaviour());
    });
  var b = ["", "webkit", "moz", "ms", "o", "Webkit", "Moz", "MS", "O"],
    A = {};
  function E(t, e) {
    var i = A[e] || "";
    if (i) return i;
    for (var s = e[0].toUpperCase() + e.slice(1), n = 0; n < b.length; ) {
      if ((i = b[n] ? b[n] + s : e) in t) return (A[e] = i), i;
      ++n;
    }
    return "";
  }
  function T() {
    var t = !1;
    try {
      var e = Object.defineProperty({}, "passive", {
        get: function () {
          t = !0;
        },
      });
      window.addEventListener("testPassive", null, e),
        window.removeEventListener("testPassive", null, e);
    } catch (t) {}
    return t;
  }
  var x = window.navigator.userAgent.toLowerCase(),
    k = x.indexOf("edge") > -1,
    L = x.indexOf("trident") > -1,
    R = x.indexOf("firefox") > -1,
    I = x.indexOf("android") > -1,
    C = !!T() && { passive: !0 },
    M = "touchAction",
    P = E(document.documentElement.style, M);
  function X(t, e) {
    (this._element = t),
      (this._emitter = new S()),
      (this._isDestroyed = !1),
      (this._cssProps = {}),
      (this._touchAction = ""),
      (this._isActive = !1),
      (this._pointerId = null),
      (this._startTime = 0),
      (this._startX = 0),
      (this._startY = 0),
      (this._currentX = 0),
      (this._currentY = 0),
      (this._onStart = this._onStart.bind(this)),
      (this._onMove = this._onMove.bind(this)),
      (this._onCancel = this._onCancel.bind(this)),
      (this._onEnd = this._onEnd.bind(this)),
      (this._edgeHack = null),
      (k || L) && (v || y) && (this._edgeHack = new D(this)),
      this.setCssProps(e),
      this._touchAction || this.setTouchAction("auto"),
      t.addEventListener("dragstart", X._preventDefault, !1),
      t.addEventListener(X._inputEvents.start, this._onStart, C);
  }
  (X._pointerEvents = {
    start: "pointerdown",
    move: "pointermove",
    cancel: "pointercancel",
    end: "pointerup",
  }),
    (X._msPointerEvents = {
      start: "MSPointerDown",
      move: "MSPointerMove",
      cancel: "MSPointerCancel",
      end: "MSPointerUp",
    }),
    (X._touchEvents = {
      start: "touchstart",
      move: "touchmove",
      cancel: "touchcancel",
      end: "touchend",
    }),
    (X._mouseEvents = {
      start: "mousedown",
      move: "mousemove",
      cancel: "",
      end: "mouseup",
    }),
    (X._inputEvents = g
      ? X._touchEvents
      : v
      ? X._pointerEvents
      : y
      ? X._msPointerEvents
      : X._mouseEvents),
    (X._emitter = new S()),
    (X._emitterEvents = {
      start: "start",
      move: "move",
      end: "end",
      cancel: "cancel",
    }),
    (X._activeInstances = []),
    (X._preventDefault = function (t) {
      t.preventDefault && !1 !== t.cancelable && t.preventDefault();
    }),
    (X._activateInstance = function (t) {
      X._activeInstances.indexOf(t) > -1 ||
        (X._activeInstances.push(t),
        X._emitter.on(X._emitterEvents.move, t._onMove),
        X._emitter.on(X._emitterEvents.cancel, t._onCancel),
        X._emitter.on(X._emitterEvents.end, t._onEnd),
        1 === X._activeInstances.length && X._bindListeners());
    }),
    (X._deactivateInstance = function (t) {
      var e = X._activeInstances.indexOf(t);
      -1 !== e &&
        (X._activeInstances.splice(e, 1),
        X._emitter.off(X._emitterEvents.move, t._onMove),
        X._emitter.off(X._emitterEvents.cancel, t._onCancel),
        X._emitter.off(X._emitterEvents.end, t._onEnd),
        X._activeInstances.length || X._unbindListeners());
    }),
    (X._bindListeners = function () {
      window.addEventListener(X._inputEvents.move, X._onMove, C),
        window.addEventListener(X._inputEvents.end, X._onEnd, C),
        X._inputEvents.cancel &&
          window.addEventListener(X._inputEvents.cancel, X._onCancel, C);
    }),
    (X._unbindListeners = function () {
      window.removeEventListener(X._inputEvents.move, X._onMove, C),
        window.removeEventListener(X._inputEvents.end, X._onEnd, C),
        X._inputEvents.cancel &&
          window.removeEventListener(X._inputEvents.cancel, X._onCancel, C);
    }),
    (X._getEventPointerId = function (t) {
      return "number" == typeof t.pointerId
        ? t.pointerId
        : t.changedTouches
        ? t.changedTouches[0]
          ? t.changedTouches[0].identifier
          : null
        : 1;
    }),
    (X._getTouchById = function (t, e) {
      if ("number" == typeof t.pointerId) return t.pointerId === e ? t : null;
      if (t.changedTouches) {
        for (var i = 0; i < t.changedTouches.length; i++)
          if (t.changedTouches[i].identifier === e) return t.changedTouches[i];
        return null;
      }
      return t;
    }),
    (X._onMove = function (t) {
      X._emitter.emit(X._emitterEvents.move, t);
    }),
    (X._onCancel = function (t) {
      X._emitter.emit(X._emitterEvents.cancel, t);
    }),
    (X._onEnd = function (t) {
      X._emitter.emit(X._emitterEvents.end, t);
    }),
    (X.prototype._reset = function () {
      (this._pointerId = null),
        (this._startTime = 0),
        (this._startX = 0),
        (this._startY = 0),
        (this._currentX = 0),
        (this._currentY = 0),
        (this._isActive = !1),
        X._deactivateInstance(this);
    }),
    (X.prototype._createEvent = function (t, e) {
      var i = this._getTrackedTouch(e);
      return {
        type: t,
        srcEvent: e,
        distance: this.getDistance(),
        deltaX: this.getDeltaX(),
        deltaY: this.getDeltaY(),
        deltaTime: t === X._emitterEvents.start ? 0 : this.getDeltaTime(),
        isFirst: t === X._emitterEvents.start,
        isFinal: t === X._emitterEvents.end || t === X._emitterEvents.cancel,
        pointerType: e.pointerType || (e.touches ? "touch" : "mouse"),
        identifier: this._pointerId,
        screenX: i.screenX,
        screenY: i.screenY,
        clientX: i.clientX,
        clientY: i.clientY,
        pageX: i.pageX,
        pageY: i.pageY,
        target: i.target,
      };
    }),
    (X.prototype._emit = function (t, e) {
      this._emitter.emit(t, this._createEvent(t, e));
    }),
    (X.prototype._getTrackedTouch = function (t) {
      return null === this._pointerId
        ? null
        : X._getTouchById(t, this._pointerId);
    }),
    (X.prototype._onStart = function (t) {
      if (
        !this._isDestroyed &&
        null === this._pointerId &&
        ((this._pointerId = X._getEventPointerId(t)), null !== this._pointerId)
      ) {
        var e = this._getTrackedTouch(t);
        (this._startX = this._currentX = e.clientX),
          (this._startY = this._currentY = e.clientY),
          (this._startTime = Date.now()),
          (this._isActive = !0),
          this._emit(X._emitterEvents.start, t),
          this._isActive && X._activateInstance(this);
      }
    }),
    (X.prototype._onMove = function (t) {
      var e = this._getTrackedTouch(t);
      e &&
        ((this._currentX = e.clientX),
        (this._currentY = e.clientY),
        this._emit(X._emitterEvents.move, t));
    }),
    (X.prototype._onCancel = function (t) {
      this._getTrackedTouch(t) &&
        (this._emit(X._emitterEvents.cancel, t), this._reset());
    }),
    (X.prototype._onEnd = function (t) {
      this._getTrackedTouch(t) &&
        (this._emit(X._emitterEvents.end, t), this._reset());
    }),
    (X.prototype.isActive = function () {
      return this._isActive;
    }),
    (X.prototype.setTouchAction = function (t) {
      (this._touchAction = t),
        P && ((this._cssProps[P] = ""), (this._element.style[P] = t)),
        g &&
          (this._element.removeEventListener(
            X._touchEvents.start,
            X._preventDefault,
            !0
          ),
          (this._element.style[P] !== t || (R && I)) &&
            this._element.addEventListener(
              X._touchEvents.start,
              X._preventDefault,
              !0
            ));
    }),
    (X.prototype.setCssProps = function (t) {
      if (t) {
        var e,
          i,
          s = this._cssProps,
          n = this._element;
        for (e in s) (n.style[e] = s[e]), delete s[e];
        for (e in t)
          t[e] &&
            (e !== M
              ? (i = E(n.style, e)) && ((s[i] = ""), (n.style[i] = t[e]))
              : this.setTouchAction(t[e]));
      }
    }),
    (X.prototype.getDeltaX = function () {
      return this._currentX - this._startX;
    }),
    (X.prototype.getDeltaY = function () {
      return this._currentY - this._startY;
    }),
    (X.prototype.getDistance = function () {
      var t = this.getDeltaX(),
        e = this.getDeltaY();
      return Math.sqrt(t * t + e * e);
    }),
    (X.prototype.getDeltaTime = function () {
      return this._startTime ? Date.now() - this._startTime : 0;
    }),
    (X.prototype.on = function (t, e) {
      this._emitter.on(t, e);
    }),
    (X.prototype.off = function (t, e) {
      this._emitter.off(t, e);
    }),
    (X.prototype.destroy = function () {
      if (!this._isDestroyed) {
        var t = this._element;
        for (var e in (this._edgeHack && this._edgeHack.destroy(),
        this._reset(),
        this._emitter.destroy(),
        t.removeEventListener(X._inputEvents.start, this._onStart, C),
        t.removeEventListener("dragstart", X._preventDefault, !1),
        t.removeEventListener(X._touchEvents.start, X._preventDefault, !0),
        this._cssProps))
          (t.style[e] = this._cssProps[e]), delete this._cssProps[e];
        (this._element = null), (this._isDestroyed = !0);
      }
    });
  var Y = (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (t) {
      return this.setTimeout(function () {
        t(Date.now());
      }, 16.666666666666668);
    }
  ).bind(window);
  function q(t) {
    (this._nextStep = null),
      (this._lanes = []),
      (this._stepQueue = []),
      (this._stepCallbacks = {}),
      (this._step = this._step.bind(this));
    for (var e = 0; e < t; e++) this._lanes.push(new O());
  }
  function O() {
    (this.queue = []), (this.indices = {}), (this.callbacks = {});
  }
  (q.prototype._step = function (t) {
    var e,
      i,
      s,
      n,
      o,
      r,
      h = this._lanes,
      a = this._stepQueue,
      _ = this._stepCallbacks;
    for (this._nextStep = null, e = 0; e < h.length; e++) {
      for (
        n = h[e].queue, o = h[e].callbacks, r = h[e].indices, i = 0;
        i < n.length;
        i++
      )
        (s = n[i]) && (a.push(s), (_[s] = o[s]), delete o[s], delete r[s]);
      n.length = 0;
    }
    for (e = 0; e < a.length; e++) _[(s = a[e])] && _[s](t), delete _[s];
    a.length = 0;
  }),
    (q.prototype.add = function (t, e, i) {
      this._lanes[t].add(e, i),
        this._nextStep || (this._nextStep = Y(this._step));
    }),
    (q.prototype.remove = function (t, e) {
      this._lanes[t].remove(e);
    }),
    (O.prototype.add = function (t, e) {
      var i = this.indices[t];
      void 0 !== i && (this.queue[i] = void 0),
        this.queue.push(t),
        (this.callbacks[t] = e),
        (this.indices[t] = this.queue.length - 1);
    }),
    (O.prototype.remove = function (t) {
      var e = this.indices[t];
      void 0 !== e &&
        ((this.queue[e] = void 0),
        delete this.callbacks[t],
        delete this.indices[t]);
    });
  var H = "layoutRead",
    G = "layoutWrite",
    W = "visibilityRead",
    B = "visibilityWrite",
    N = "dragStartRead",
    F = "dragStartWrite",
    z = "dragMoveRead",
    V = "dragMoveWrite",
    j = "dragScrollRead",
    Q = "dragScrollWrite",
    U = "dragSortRead",
    Z = "placeholderLayoutRead",
    J = "placeholderLayoutWrite",
    $ = "placeholderResizeWrite",
    K = "autoScrollRead",
    tt = "autoScrollWrite",
    et = "debounceRead",
    it = new q(3);
  function st(t) {
    it.remove(0, H + t), it.remove(2, G + t);
  }
  function nt(t) {
    it.remove(0, W + t), it.remove(2, B + t);
  }
  function ot(t) {
    it.remove(0, N + t), it.remove(2, F + t);
  }
  function rt(t) {
    it.remove(0, z + t), it.remove(2, V + t);
  }
  function ht(t) {
    it.remove(0, j + t), it.remove(2, Q + t);
  }
  function at(t, e) {
    it.add(1, U + t, e);
  }
  function _t(t) {
    it.remove(0, Z + t), it.remove(2, J + t);
  }
  function lt(t, e) {
    it.add(0, K, t), it.add(2, tt, e);
  }
  function dt(t) {
    return "function" == typeof t;
  }
  var ut = "function" == typeof WeakMap ? new WeakMap() : null;
  function ct(t, e) {
    var i = ut && ut.get(t);
    return (
      i || ((i = window.getComputedStyle(t, null)), ut && ut.set(t, i)),
      i.getPropertyValue(e)
    );
  }
  function ft(t, e) {
    return parseFloat(ct(t, e)) || 0;
  }
  var pt,
    mt = document.documentElement,
    gt = document.body,
    vt = { value: 0, offset: 0 };
  function yt(t) {
    return t === window || t === mt || t === gt ? window : t;
  }
  function St(t) {
    return t === window ? t.pageXOffset : t.scrollLeft;
  }
  function wt(t) {
    return t === window ? t.pageYOffset : t.scrollTop;
  }
  function Dt(t) {
    return t === window
      ? mt.scrollWidth - mt.clientWidth
      : t.scrollWidth - t.clientWidth;
  }
  function bt(t) {
    return t === window
      ? mt.scrollHeight - mt.clientHeight
      : t.scrollHeight - t.clientHeight;
  }
  function At(t, e) {
    if (((e = e || {}), t === window))
      (e.width = mt.clientWidth),
        (e.height = mt.clientHeight),
        (e.left = 0),
        (e.right = e.width),
        (e.top = 0),
        (e.bottom = e.height);
    else {
      var i = t.getBoundingClientRect(),
        s = t.clientLeft || ft(t, "border-left-width"),
        n = t.clientTop || ft(t, "border-top-width");
      (e.width = t.clientWidth),
        (e.height = t.clientHeight),
        (e.left = i.left + s),
        (e.right = e.left + e.width),
        (e.top = i.top + n),
        (e.bottom = e.top + e.height);
    }
    return e;
  }
  function Et(t) {
    return t._drag._getGrid()._settings.dragAutoScroll;
  }
  function Tt(t) {
    if (t._drag && t._isActive) {
      var e = t._drag;
      (e._scrollDiffX = e._scrollDiffY = 0), t._setTranslate(e._left, e._top);
    }
  }
  function xt(t, e, i, s) {
    return (
      (vt.value = Math.min(s / 2, t)),
      (vt.offset = Math.max(0, i + 2 * vt.value + s * e - s) / 2),
      vt
    );
  }
  function kt() {
    this.reset();
  }
  function Lt() {
    (this.element = null),
      (this.requestX = null),
      (this.requestY = null),
      (this.scrollLeft = 0),
      (this.scrollTop = 0);
  }
  function Rt(t, e) {
    (this.pool = []), (this.createItem = t), (this.releaseItem = e);
  }
  function It(t, e) {
    var i = (function (t, e) {
      return (function (t, e) {
        return !(
          t.left + t.width <= e.left ||
          e.left + e.width <= t.left ||
          t.top + t.height <= e.top ||
          e.top + e.height <= t.top
        );
      })(t, e)
        ? (Math.min(t.left + t.width, e.left + e.width) -
            Math.max(t.left, e.left)) *
            (Math.min(t.top + t.height, e.top + e.height) -
              Math.max(t.top, e.top))
        : 0;
    })(t, e);
    return i
      ? (i / (Math.min(t.width, e.width) * Math.min(t.height, e.height))) * 100
      : 0;
  }
  (kt.prototype.reset = function () {
    this.isActive && this.onStop(),
      (this.item = null),
      (this.element = null),
      (this.isActive = !1),
      (this.isEnding = !1),
      (this.direction = null),
      (this.value = null),
      (this.maxValue = 0),
      (this.threshold = 0),
      (this.distance = 0),
      (this.speed = 0),
      (this.duration = 0),
      (this.action = null);
  }),
    (kt.prototype.hasReachedEnd = function () {
      return 4 & this.direction ? this.value >= this.maxValue : this.value <= 0;
    }),
    (kt.prototype.computeCurrentScrollValue = function () {
      return null === this.value
        ? 1 & this.direction
          ? St(this.element)
          : wt(this.element)
        : Math.max(0, Math.min(this.value, this.maxValue));
    }),
    (kt.prototype.computeNextScrollValue = function (t) {
      var e = this.speed * (t / 1e3),
        i = 4 & this.direction ? this.value + e : this.value - e;
      return Math.max(0, Math.min(i, this.maxValue));
    }),
    (kt.prototype.computeSpeed =
      ((pt = {
        direction: null,
        threshold: 0,
        distance: 0,
        value: 0,
        maxValue: 0,
        deltaTime: 0,
        duration: 0,
        isEnding: !1,
      }),
      function (t) {
        var e = this.item,
          i = Et(e).speed;
        return dt(i)
          ? ((pt.direction = this.direction),
            (pt.threshold = this.threshold),
            (pt.distance = this.distance),
            (pt.value = this.value),
            (pt.maxValue = this.maxValue),
            (pt.duration = this.duration),
            (pt.speed = this.speed),
            (pt.deltaTime = t),
            (pt.isEnding = this.isEnding),
            i(e, this.element, pt))
          : i;
      })),
    (kt.prototype.tick = function (t) {
      return (
        this.isActive || ((this.isActive = !0), this.onStart()),
        (this.value = this.computeCurrentScrollValue()),
        (this.speed = this.computeSpeed(t)),
        (this.value = this.computeNextScrollValue(t)),
        (this.duration += t),
        this.value
      );
    }),
    (kt.prototype.onStart = function () {
      var t = this.item,
        e = Et(t).onStart;
      dt(e) && e(t, this.element, this.direction);
    }),
    (kt.prototype.onStop = function () {
      var t = this.item,
        e = Et(t).onStop;
      dt(e) && e(t, this.element, this.direction), t._drag && t._drag.sort();
    }),
    (Lt.prototype.reset = function () {
      this.requestX && (this.requestX.action = null),
        this.requestY && (this.requestY.action = null),
        (this.element = null),
        (this.requestX = null),
        (this.requestY = null),
        (this.scrollLeft = 0),
        (this.scrollTop = 0);
    }),
    (Lt.prototype.addRequest = function (t) {
      1 & t.direction
        ? (this.removeRequest(this.requestX), (this.requestX = t))
        : (this.removeRequest(this.requestY), (this.requestY = t)),
        (t.action = this);
    }),
    (Lt.prototype.removeRequest = function (t) {
      t &&
        (this.requestX === t
          ? ((this.requestX = null), (t.action = null))
          : this.requestY === t && ((this.requestY = null), (t.action = null)));
    }),
    (Lt.prototype.computeScrollValues = function () {
      (this.scrollLeft = this.requestX
        ? this.requestX.value
        : St(this.element)),
        (this.scrollTop = this.requestY
          ? this.requestY.value
          : wt(this.element));
    }),
    (Lt.prototype.scroll = function () {
      var t = this.element;
      t &&
        (t.scrollTo
          ? t.scrollTo(this.scrollLeft, this.scrollTop)
          : ((t.scrollLeft = this.scrollLeft), (t.scrollTop = this.scrollTop)));
    }),
    (Rt.prototype.pick = function () {
      return this.pool.pop() || this.createItem();
    }),
    (Rt.prototype.release = function (t) {
      this.releaseItem(t), -1 === this.pool.indexOf(t) && this.pool.push(t);
    }),
    (Rt.prototype.reset = function () {
      this.pool.length = 0;
    });
  var Ct = { width: 0, height: 0, left: 0, right: 0, top: 0, bottom: 0 },
    Mt = { width: 0, height: 0, left: 0, right: 0, top: 0, bottom: 0 };
  function Pt() {
    (this._isDestroyed = !1),
      (this._isTicking = !1),
      (this._tickTime = 0),
      (this._tickDeltaTime = 0),
      (this._items = []),
      (this._actions = []),
      (this._requests = {}),
      (this._requests[1] = {}),
      (this._requests[2] = {}),
      (this._requestOverlapCheck = {}),
      (this._dragPositions = {}),
      (this._dragDirections = {}),
      (this._overlapCheckInterval = 150),
      (this._requestPool = new Rt(
        function () {
          return new kt();
        },
        function (t) {
          t.reset();
        }
      )),
      (this._actionPool = new Rt(
        function () {
          return new Lt();
        },
        function (t) {
          t.reset();
        }
      )),
      (this._readTick = this._readTick.bind(this)),
      (this._writeTick = this._writeTick.bind(this));
  }
  (Pt.AXIS_X = 1),
    (Pt.AXIS_Y = 2),
    (Pt.FORWARD = 4),
    (Pt.BACKWARD = 8),
    (Pt.LEFT = 9),
    (Pt.RIGHT = 5),
    (Pt.UP = 10),
    (Pt.DOWN = 6),
    (Pt.smoothSpeed = function (t, e, i) {
      return function (s, n, o) {
        var r = 0;
        if (!o.isEnding)
          if (o.threshold > 0) {
            var h = o.threshold - Math.max(0, o.distance);
            r = (t / o.threshold) * h;
          } else r = t;
        var a = o.speed,
          _ = r;
        return a === r
          ? _
          : a < r
          ? ((_ = a + e * (o.deltaTime / 1e3)), Math.min(r, _))
          : ((_ = a - i * (o.deltaTime / 1e3)), Math.max(r, _));
      };
    }),
    (Pt.pointerHandle = function (t) {
      var e = { left: 0, top: 0, width: 0, height: 0 },
        i = t || 1;
      return function (t, s, n, o, r, h, a) {
        return (
          (e.left = h - 0.5 * i),
          (e.top = a - 0.5 * i),
          (e.width = i),
          (e.height = i),
          e
        );
      };
    }),
    (Pt.prototype._readTick = function (t) {
      this._isDestroyed ||
        (t && this._tickTime
          ? ((this._tickDeltaTime = t - this._tickTime),
            (this._tickTime = t),
            this._updateRequests(),
            this._updateActions())
          : ((this._tickTime = t), (this._tickDeltaTime = 0)));
    }),
    (Pt.prototype._writeTick = function () {
      this._isDestroyed ||
        (this._applyActions(), lt(this._readTick, this._writeTick));
    }),
    (Pt.prototype._startTicking = function () {
      (this._isTicking = !0), lt(this._readTick, this._writeTick);
    }),
    (Pt.prototype._stopTicking = function () {
      (this._isTicking = !1),
        (this._tickTime = 0),
        (this._tickDeltaTime = 0),
        it.remove(0, K),
        it.remove(2, tt);
    }),
    (Pt.prototype._getItemHandleRect = function (t, e, i) {
      var s = t._drag;
      if (e) {
        var n = s._dragMoveEvent || s._dragStartEvent,
          o = e(
            t,
            s._clientX,
            s._clientY,
            t._width,
            t._height,
            n.clientX,
            n.clientY
          );
        (i.left = o.left),
          (i.top = o.top),
          (i.width = o.width),
          (i.height = o.height);
      } else
        (i.left = s._clientX),
          (i.top = s._clientY),
          (i.width = t._width),
          (i.height = t._height);
      return (i.right = i.left + i.width), (i.bottom = i.top + i.height), i;
    }),
    (Pt.prototype._requestItemScroll = function (t, e, i, s, n, o, r) {
      var h = this._requests[e],
        a = h[t._id];
      a
        ? (a.element === i && a.direction === s) || a.reset()
        : (a = this._requestPool.pick()),
        (a.item = t),
        (a.element = i),
        (a.direction = s),
        (a.threshold = n),
        (a.distance = o),
        (a.maxValue = r),
        (h[t._id] = a);
    }),
    (Pt.prototype._cancelItemScroll = function (t, e) {
      var i = this._requests[e],
        s = i[t._id];
      s &&
        (s.action && s.action.removeRequest(s),
        this._requestPool.release(s),
        delete i[t._id]);
    }),
    (Pt.prototype._checkItemOverlap = function (t, e, i) {
      var s = Et(t),
        n = dt(s.targets) ? s.targets(t) : s.targets,
        o = s.threshold,
        r = s.safeZone;
      if (!n || !n.length)
        return (
          e && this._cancelItemScroll(t, 1),
          void (i && this._cancelItemScroll(t, 2))
        );
      var h = this._dragDirections[t._id],
        a = h[0],
        _ = h[1];
      if (!a && !_)
        return (
          e && this._cancelItemScroll(t, 1),
          void (i && this._cancelItemScroll(t, 2))
        );
      for (
        var l = this._getItemHandleRect(t, s.handle, Ct),
          d = Mt,
          u = null,
          c = null,
          f = !0,
          p = !0,
          m = 0,
          g = 0,
          v = null,
          y = null,
          S = 0,
          w = 0,
          D = 0,
          b = null,
          A = -1 / 0,
          E = 0,
          T = 0,
          x = null,
          k = 0,
          L = 0,
          R = null,
          I = -1 / 0,
          C = 0,
          M = 0,
          P = null,
          X = 0,
          Y = 0,
          q = 0;
        q < n.length;
        q++
      )
        (u = n[q]),
          (f = e && a && 2 !== u.axis),
          (p = i && _ && 1 !== u.axis),
          (g = u.priority || 0),
          ((!f || g < A) && (!p || g < I)) ||
            ((c = yt(u.element || u)),
            (w = f ? Dt(c) : -1),
            (D = p ? bt(c) : -1),
            (w || D) &&
              ((m = It(l, (d = At(c, d)))) <= 0 ||
                (f &&
                  g >= A &&
                  w > 0 &&
                  (g > A || m > T) &&
                  ((y = null),
                  (v = xt(
                    "number" == typeof u.threshold ? u.threshold : o,
                    r,
                    l.width,
                    d.width
                  )),
                  5 === a
                    ? (S = d.right + v.offset - l.right) <= v.value &&
                      St(c) < w &&
                      (y = 5)
                    : 9 === a &&
                      (S = l.left - (d.left - v.offset)) <= v.value &&
                      St(c) > 0 &&
                      (y = 9),
                  null !== y &&
                    ((b = c),
                    (A = g),
                    (E = v.value),
                    (T = m),
                    (x = y),
                    (k = S),
                    (L = w))),
                p &&
                  g >= I &&
                  D > 0 &&
                  (g > I || m > M) &&
                  ((y = null),
                  (v = xt(
                    "number" == typeof u.threshold ? u.threshold : o,
                    r,
                    l.height,
                    d.height
                  )),
                  6 === _
                    ? (S = d.bottom + v.offset - l.bottom) <= v.value &&
                      wt(c) < D &&
                      (y = 6)
                    : 10 === _ &&
                      (S = l.top - (d.top - v.offset)) <= v.value &&
                      wt(c) > 0 &&
                      (y = 10),
                  null !== y &&
                    ((R = c),
                    (I = g),
                    (C = v.value),
                    (M = m),
                    (P = y),
                    (X = S),
                    (Y = D))))));
      e &&
        (b
          ? this._requestItemScroll(t, 1, b, x, E, k, L)
          : this._cancelItemScroll(t, 1)),
        i &&
          (R
            ? this._requestItemScroll(t, 2, R, P, C, X, Y)
            : this._cancelItemScroll(t, 2));
    }),
    (Pt.prototype._updateScrollRequest = function (t) {
      for (
        var e = t.item,
          i = Et(e),
          s = dt(i.targets) ? i.targets(e) : i.targets,
          n = (s && s.length) || 0,
          o = i.threshold,
          r = i.safeZone,
          h = this._getItemHandleRect(e, i.handle, Ct),
          a = Mt,
          _ = null,
          l = null,
          d = !1,
          u = null,
          c = null,
          f = null,
          p = null,
          m = null,
          g = 0;
        g < n;
        g++
      )
        if ((l = yt((_ = s[g]).element || _)) === t.element) {
          if ((d = !!(1 & t.direction))) {
            if (2 === _.axis) continue;
          } else if (1 === _.axis) continue;
          if ((p = d ? Dt(l) : bt(l)) <= 0) break;
          if (It(h, (a = At(l, a))) <= 0) break;
          if (
            ((u = xt(
              "number" == typeof _.threshold ? _.threshold : o,
              r,
              d ? h.width : h.height,
              d ? a.width : a.height
            )),
            (c =
              9 === t.direction
                ? h.left - (a.left - u.offset)
                : 5 === t.direction
                ? a.right + u.offset - h.right
                : 10 === t.direction
                ? h.top - (a.top - u.offset)
                : a.bottom + u.offset - h.bottom) > u.value)
          )
            break;
          if (
            ((f = d ? St(l) : wt(l)), (m = 4 & t.direction ? f >= p : f <= 0))
          )
            break;
          return (
            (t.maxValue = p),
            (t.threshold = u.value),
            (t.distance = c),
            (t.isEnding = !1),
            !0
          );
        }
      return (
        !0 === i.smoothStop && t.speed > 0
          ? (null === m && (m = t.hasReachedEnd()), (t.isEnding = !m))
          : (t.isEnding = !1),
        t.isEnding
      );
    }),
    (Pt.prototype._updateRequests = function () {
      for (
        var t,
          e,
          i,
          s,
          n,
          o,
          r,
          h = this._items,
          a = this._requests[1],
          _ = this._requests[2],
          l = 0;
        l < h.length;
        l++
      )
        (t = h[l]),
          (n =
            (s = this._requestOverlapCheck[t._id]) > 0 &&
            this._tickTime - s > this._overlapCheckInterval),
          (o = !0),
          (e = a[t._id]) &&
            e.isActive &&
            (o = !this._updateScrollRequest(e)) &&
            ((n = !0), this._cancelItemScroll(t, 1)),
          (r = !0),
          (i = _[t._id]) &&
            i.isActive &&
            (r = !this._updateScrollRequest(i)) &&
            ((n = !0), this._cancelItemScroll(t, 2)),
          n &&
            ((this._requestOverlapCheck[t._id] = 0),
            this._checkItemOverlap(t, o, r));
    }),
    (Pt.prototype._requestAction = function (t, e) {
      for (
        var i = this._actions, s = 1 === e, n = null, o = 0;
        o < i.length;
        o++
      ) {
        if (((n = i[o]), t.element === n.element)) {
          if (s ? n.requestX : n.requestY)
            return void this._cancelItemScroll(t.item, e);
          break;
        }
        n = null;
      }
      n || (n = this._actionPool.pick()),
        (n.element = t.element),
        n.addRequest(t),
        t.tick(this._tickDeltaTime),
        i.push(n);
    }),
    (Pt.prototype._updateActions = function () {
      var t,
        e,
        i,
        s,
        n = this._items,
        o = this._requests,
        r = this._actions;
      for (s = 0; s < n.length; s++)
        (t = n[s]._id),
          (e = o[1][t]),
          (i = o[2][t]),
          e && this._requestAction(e, 1),
          i && this._requestAction(i, 2);
      for (s = 0; s < r.length; s++) r[s].computeScrollValues();
    }),
    (Pt.prototype._applyActions = function () {
      var t,
        e = this._actions,
        i = this._items;
      if (e.length) {
        for (t = 0; t < e.length; t++)
          e[t].scroll(), this._actionPool.release(e[t]);
        for (e.length = 0, t = 0; t < i.length; t++)
          (s = i[t])._drag && s._drag._prepareScroll();
        var s;
        for (t = 0; t < i.length; t++) Tt(i[t]);
      }
    }),
    (Pt.prototype._updateDragDirection = function (t) {
      var e = this._dragPositions[t._id],
        i = this._dragDirections[t._id],
        s = t._drag._left,
        n = t._drag._top;
      if (e.length) {
        var o = e[0],
          r = e[1];
        (i[0] = s > o ? 5 : s < o ? 9 : i[0] || 0),
          (i[1] = n > r ? 6 : n < r ? 10 : i[1] || 0);
      }
      (e[0] = s), (e[1] = n);
    }),
    (Pt.prototype.addItem = function (t) {
      this._isDestroyed ||
        (-1 === this._items.indexOf(t) &&
          (this._items.push(t),
          (this._requestOverlapCheck[t._id] = this._tickTime),
          (this._dragDirections[t._id] = [0, 0]),
          (this._dragPositions[t._id] = []),
          this._isTicking || this._startTicking()));
    }),
    (Pt.prototype.updateItem = function (t) {
      this._isDestroyed ||
        (this._dragDirections[t._id] &&
          (this._updateDragDirection(t),
          this._requestOverlapCheck[t._id] ||
            (this._requestOverlapCheck[t._id] = this._tickTime)));
    }),
    (Pt.prototype.removeItem = function (t) {
      if (!this._isDestroyed) {
        var e = this._items.indexOf(t);
        if (-1 !== e) {
          var i = t._id;
          this._requests[1][i] &&
            (this._cancelItemScroll(t, 1), delete this._requests[1][i]),
            this._requests[2][i] &&
              (this._cancelItemScroll(t, 2), delete this._requests[2][i]),
            delete this._requestOverlapCheck[i],
            delete this._dragPositions[i],
            delete this._dragDirections[i],
            this._items.splice(e, 1),
            this._isTicking && !this._items.length && this._stopTicking();
        }
      }
    }),
    (Pt.prototype.isItemScrollingX = function (t) {
      var e = this._requests[1][t._id];
      return !(!e || !e.isActive);
    }),
    (Pt.prototype.isItemScrollingY = function (t) {
      var e = this._requests[2][t._id];
      return !(!e || !e.isActive);
    }),
    (Pt.prototype.isItemScrolling = function (t) {
      return this.isItemScrollingX(t) || this.isItemScrollingY(t);
    }),
    (Pt.prototype.destroy = function () {
      if (!this._isDestroyed) {
        for (var t = this._items.slice(0), e = 0; e < t.length; e++)
          this.removeItem(t[e]);
        (this._actions.length = 0),
          this._requestPool.reset(),
          this._actionPool.reset(),
          (this._isDestroyed = !0);
      }
    });
  var Xt = window.Element.prototype,
    Yt =
      Xt.matches ||
      Xt.matchesSelector ||
      Xt.webkitMatchesSelector ||
      Xt.mozMatchesSelector ||
      Xt.msMatchesSelector ||
      Xt.oMatchesSelector ||
      function () {
        return !1;
      };
  function qt(t, e) {
    return Yt.call(t, e);
  }
  function Ot(t, e) {
    e &&
      (t.classList
        ? t.classList.add(e)
        : qt(t, "." + e) || (t.className += " " + e));
  }
  var Ht = [];
  function Gt(t, e, i) {
    var s = "number" == typeof i ? i : -1;
    s < 0 && (s = t.length - s + 1),
      t.splice.apply(t, Ht.concat(s, 0, e)),
      (Ht.length = 0);
  }
  function Wt(t, e, i) {
    var s = Math.max(0, t.length - 1 + (i || 0));
    return e > s ? s : e < 0 ? Math.max(s + e + 1, 0) : e;
  }
  function Bt(t, e, i) {
    if (!(t.length < 2)) {
      var s = Wt(t, e),
        n = Wt(t, i);
      s !== n && t.splice(n, 0, t.splice(s, 1)[0]);
    }
  }
  function Nt(t, e, i) {
    if (!(t.length < 2)) {
      var s,
        n = Wt(t, e),
        o = Wt(t, i);
      n !== o && ((s = t[n]), (t[n] = t[o]), (t[o] = s));
    }
  }
  var Ft = E(document.documentElement.style, "transform") || "transform",
    zt = /([A-Z])/g,
    Vt = /^(webkit-|moz-|ms-|o-)/,
    jt = /^(-m-s-)/;
  function Qt(t) {
    var e = t.replace(zt, "-$1").toLowerCase();
    return (e = (e = e.replace(Vt, "-$1")).replace(jt, "-ms-"));
  }
  var Ut = Qt(Ft);
  function Zt(t) {
    var e = ct(t, Ut);
    if (!e || "none" === e) return !1;
    var i = ct(t, "display");
    return "inline" !== i && "none" !== i;
  }
  function Jt(t) {
    for (
      var e = document, i = t || e;
      i && i !== e && "static" === ct(i, "position") && !Zt(i);

    )
      i = i.parentElement || e;
    return i;
  }
  var $t = {},
    Kt = {},
    te = {};
  function ee(t, e) {
    var i,
      s = e || {};
    return (
      (s.left = 0),
      (s.top = 0),
      t === document
        ? s
        : ((s.left = window.pageXOffset || 0),
          (s.top = window.pageYOffset || 0),
          t.self === window.self ||
            ((i = t.getBoundingClientRect()),
            (s.left += i.left),
            (s.top += i.top),
            (s.left += ft(t, "border-left-width")),
            (s.top += ft(t, "border-top-width"))),
          s)
    );
  }
  function ie(t, e, i) {
    return (
      (te.left = 0),
      (te.top = 0),
      t === e ||
        (i && (t = Jt(t)) === (e = Jt(e))) ||
        (ee(t, $t),
        ee(e, Kt),
        (te.left = Kt.left - $t.left),
        (te.top = Kt.top - $t.top)),
      te
    );
  }
  function se(t) {
    return "auto" === t || "scroll" === t || "overlay" === t;
  }
  function ne(t) {
    return (
      se(ct(t, "overflow")) ||
      se(ct(t, "overflow-x")) ||
      se(ct(t, "overflow-y"))
    );
  }
  function oe(t, e) {
    for (e = e || []; t && t !== document; )
      t.getRootNode && t instanceof DocumentFragment
        ? (t = t.getRootNode().host)
        : (ne(t) && e.push(t), (t = t.parentNode));
    return e.push(window), e;
  }
  var re = {},
    he = /^matrix3d/,
    ae = /([^,]*,){4}/,
    _e = /([^,]*,){12}/,
    le = /[^,]*,/;
  function de(t) {
    (re.x = 0), (re.y = 0);
    var e = ct(t, Ut);
    if (!e || "none" === e) return re;
    var i = he.test(e),
      s = e.replace(i ? _e : ae, ""),
      n = s.replace(le, "");
    return (re.x = parseFloat(s) || 0), (re.y = parseFloat(n) || 0), re;
  }
  function ue(t, e) {
    e &&
      (t.classList
        ? t.classList.remove(e)
        : qt(t, "." + e) &&
          (t.className = (" " + t.className + " ")
            .replace(" " + e + " ", " ")
            .trim()));
  }
  var ce,
    fe,
    pe,
    me,
    ge =
      /^(iPad|iPhone|iPod)/.test(window.navigator.platform) ||
      (/^Mac/.test(window.navigator.platform) &&
        window.navigator.maxTouchPoints > 1),
    ve = !!T() && { passive: !0 };
  function ye(t) {
    var e = t._element,
      i = t.getGrid(),
      s = i._settings;
    (this._item = t),
      (this._gridId = i._id),
      (this._isDestroyed = !1),
      (this._isMigrating = !1),
      (this._startPredicate = dt(s.dragStartPredicate)
        ? s.dragStartPredicate
        : ye.defaultStartPredicate),
      (this._startPredicateState = 0),
      (this._startPredicateResult = void 0),
      (this._isSortNeeded = !1),
      (this._sortTimer = void 0),
      (this._blockedSortIndex = null),
      (this._sortX1 = 0),
      (this._sortX2 = 0),
      (this._sortY1 = 0),
      (this._sortY2 = 0),
      this._reset(),
      (this._preStartCheck = this._preStartCheck.bind(this)),
      (this._preEndCheck = this._preEndCheck.bind(this)),
      (this._onScroll = this._onScroll.bind(this)),
      (this._prepareStart = this._prepareStart.bind(this)),
      (this._applyStart = this._applyStart.bind(this)),
      (this._prepareMove = this._prepareMove.bind(this)),
      (this._applyMove = this._applyMove.bind(this)),
      (this._prepareScroll = this._prepareScroll.bind(this)),
      (this._applyScroll = this._applyScroll.bind(this)),
      (this._handleSort = this._handleSort.bind(this)),
      (this._handleSortDelayed = this._handleSortDelayed.bind(this)),
      (this._handle = (s.dragHandle && e.querySelector(s.dragHandle)) || e),
      (this._dragger = new X(this._handle, s.dragCssProps)),
      this._dragger.on("start", this._preStartCheck),
      this._dragger.on("move", this._preStartCheck),
      this._dragger.on("cancel", this._preEndCheck),
      this._dragger.on("end", this._preEndCheck);
  }
  function Se(t, e) {
    var i,
      s,
      n = {};
    if (Array.isArray(e))
      for (s = 0; s < e.length; s++) n[(i = e[s])] = ct(t, Qt(i));
    else for (i in e) n[i] = ct(t, Qt(i));
    return n;
  }
  (ye.autoScroller = new Pt()),
    (ye.defaultStartPredicate = function (t, e, i) {
      var s = t._drag;
      if (e.isFirst && e.srcEvent.button) return !1;
      if (
        !ge &&
        e.isFirst &&
        !0 === e.srcEvent.isTrusted &&
        !1 === e.srcEvent.defaultPrevented &&
        !1 === e.srcEvent.cancelable
      )
        return !1;
      if (!e.isFinal) {
        var n = s._startPredicateData;
        if (!n) {
          var o = i || s._getGrid()._settings.dragStartPredicate || {};
          s._startPredicateData = n = {
            distance: Math.max(o.distance, 0) || 0,
            delay: Math.max(o.delay, 0) || 0,
          };
        }
        return (
          n.delay &&
            ((n.event = e),
            n.delayTimer ||
              (n.delayTimer = window.setTimeout(function () {
                (n.delay = 0),
                  s._resolveStartPredicate(n.event) &&
                    (s._forceResolveStartPredicate(n.event),
                    s._resetStartPredicate());
              }, n.delay))),
          s._resolveStartPredicate(e)
        );
      }
      s._finishStartPredicate(e);
    }),
    (ye.defaultSortPredicate =
      ((ce = {}),
      (fe = {}),
      (pe = {}),
      (me = []),
      function (t, e) {
        var n = t._drag,
          o = n._getGrid(),
          r = e && "number" == typeof e.threshold ? e.threshold : 50,
          h = e && e.action === i ? i : s,
          a = e && e.migrateAction === i ? i : s;
        (r = Math.min(Math.max(r, 1), 100)),
          (ce.width = t._width),
          (ce.height = t._height),
          (ce.left = n._clientX),
          (ce.top = n._clientY);
        var _ = (function (t, e, i) {
          var s,
            n,
            o,
            r,
            h,
            a,
            _,
            l,
            d,
            u,
            c = null,
            f = e._settings.dragSort,
            p = -1;
          if (
            (!0 === f ? ((me[0] = e), (n = me)) : dt(f) && (n = f.call(e, t)),
            !n || !Array.isArray(n) || !n.length)
          )
            return c;
          for (u = 0; u < n.length; u++)
            if (!(o = n[u])._isDestroyed) {
              for (
                o._updateBoundingRect(),
                  a = Math.max(0, o._left),
                  _ = Math.max(0, o._top),
                  l = Math.min(window.innerWidth, o._right),
                  d = Math.min(window.innerHeight, o._bottom),
                  r = o._element.parentNode;
                r &&
                r !== document &&
                r !== document.documentElement &&
                r !== document.body;

              )
                if (r.getRootNode && r instanceof DocumentFragment)
                  r = r.getRootNode().host;
                else {
                  if (
                    ("visible" !== ct(r, "overflow") &&
                      ((h = r.getBoundingClientRect()),
                      (a = Math.max(a, h.left)),
                      (_ = Math.max(_, h.top)),
                      (l = Math.min(l, h.right)),
                      (d = Math.min(d, h.bottom))),
                    "fixed" === ct(r, "position"))
                  )
                    break;
                  r = r.parentNode;
                }
              a >= l ||
                _ >= d ||
                ((fe.left = a),
                (fe.top = _),
                (fe.width = l - a),
                (fe.height = d - _),
                (s = It(ce, fe)) > i && s > p && ((p = s), (c = o)));
            }
          return (me.length = 0), c;
        })(t, o, r);
        if (!_) return null;
        var l,
          d,
          u,
          c = t.getGrid() !== _,
          f = 0,
          p = 0,
          m = 0,
          g = -1,
          v = !1;
        for (
          _ === o
            ? ((ce.left = n._gridX + t._marginLeft),
              (ce.top = n._gridY + t._marginTop))
            : (_._updateBorders(1, 0, 1, 0),
              (f = _._left + _._borderLeft),
              (p = _._top + _._borderTop)),
            u = 0;
          u < _._items.length;
          u++
        )
          (l = _._items[u])._isActive &&
            l !== t &&
            ((v = !0),
            (fe.width = l._width),
            (fe.height = l._height),
            (fe.left = l._left + l._marginLeft + f),
            (fe.top = l._top + l._marginTop + p),
            (d = It(ce, fe)) > m && ((g = u), (m = d)));
        return (
          c && m < r && ((g = v ? g : 0), (m = r)),
          m >= r
            ? ((pe.grid = _), (pe.index = g), (pe.action = c ? a : h), pe)
            : null
        );
      })),
    (ye.prototype.stop = function () {
      if (this._isActive)
        if (this._isMigrating) this._finishMigration();
        else {
          var t = this._item,
            e = t._id;
          if (
            (ye.autoScroller.removeItem(t),
            ot(e),
            rt(e),
            ht(e),
            this._cancelSort(),
            this._isStarted)
          ) {
            this._unbindScrollListeners();
            var i = t._element,
              s = this._getGrid(),
              n = s._settings.itemDraggingClass;
            i.parentNode !== s._element &&
              (s._element.appendChild(i),
              t._setTranslate(this._gridX, this._gridY),
              n && i.clientWidth),
              ue(i, n);
          }
          this._reset();
        }
    }),
    (ye.prototype.sort = function (t) {
      var e = this._item;
      this._isActive &&
        e._isActive &&
        this._dragMoveEvent &&
        (!0 === t ? this._handleSort() : at(e._id, this._handleSort));
    }),
    (ye.prototype.destroy = function () {
      this._isDestroyed ||
        (this.stop(),
        this._dragger.destroy(),
        ye.autoScroller.removeItem(this._item),
        (this._isDestroyed = !0));
    }),
    (ye.prototype._getGrid = function () {
      return t[this._gridId] || null;
    }),
    (ye.prototype._reset = function () {
      (this._isActive = !1),
        (this._isStarted = !1),
        (this._container = null),
        (this._containingBlock = null),
        (this._dragStartEvent = null),
        (this._dragMoveEvent = null),
        (this._dragPrevMoveEvent = null),
        (this._scrollEvent = null),
        (this._scrollers = []),
        (this._left = 0),
        (this._top = 0),
        (this._gridX = 0),
        (this._gridY = 0),
        (this._clientX = 0),
        (this._clientY = 0),
        (this._scrollDiffX = 0),
        (this._scrollDiffY = 0),
        (this._moveDiffX = 0),
        (this._moveDiffY = 0),
        (this._containerDiffX = 0),
        (this._containerDiffY = 0);
    }),
    (ye.prototype._bindScrollListeners = function () {
      var t,
        e,
        i = this._getGrid()._element,
        s = this._container,
        n = this._scrollers;
      if (((n.length = 0), oe(this._item._element.parentNode, n), s !== i))
        for (oe(i, (t = [])), e = 0; e < t.length; e++)
          n.indexOf(t[e]) < 0 && n.push(t[e]);
      for (e = 0; e < n.length; e++)
        n[e].addEventListener("scroll", this._onScroll, ve);
    }),
    (ye.prototype._unbindScrollListeners = function () {
      var t,
        e = this._scrollers;
      for (t = 0; t < e.length; t++)
        e[t].removeEventListener("scroll", this._onScroll, ve);
      e.length = 0;
    }),
    (ye.prototype._resolveStartPredicate = function (t) {
      var e = this._startPredicateData;
      if (!(t.distance < e.distance || e.delay))
        return this._resetStartPredicate(), !0;
    }),
    (ye.prototype._forceResolveStartPredicate = function (t) {
      this._isDestroyed ||
        1 !== this._startPredicateState ||
        ((this._startPredicateState = 2), this._onStart(t));
    }),
    (ye.prototype._finishStartPredicate = function (t) {
      var e = this._item._element,
        i =
          Math.abs(t.deltaX) < 2 && Math.abs(t.deltaY) < 2 && t.deltaTime < 200;
      this._resetStartPredicate(),
        i &&
          (function (t) {
            if ("a" !== t.tagName.toLowerCase()) return;
            var e = t.getAttribute("href");
            if (!e) return;
            var i = t.getAttribute("target");
            i && "_self" !== i ? window.open(e, i) : (window.location.href = e);
          })(e);
    }),
    (ye.prototype._resetHeuristics = function (t, e) {
      (this._blockedSortIndex = null),
        (this._sortX1 = this._sortX2 = t),
        (this._sortY1 = this._sortY2 = e);
    }),
    (ye.prototype._checkHeuristics = function (t, e) {
      var i = this._getGrid()._settings.dragSortHeuristics,
        s = i.minDragDistance;
      if (s <= 0) return (this._blockedSortIndex = null), !0;
      var n = t - this._sortX2,
        o = e - this._sortY2,
        r = s > 3 && i.minBounceBackAngle > 0;
      if (
        (r || (this._blockedSortIndex = null),
        Math.abs(n) > s || Math.abs(o) > s)
      ) {
        if (r) {
          var h = Math.atan2(n, o),
            a = Math.atan2(
              this._sortX2 - this._sortX1,
              this._sortY2 - this._sortY1
            ),
            _ = Math.atan2(Math.sin(h - a), Math.cos(h - a));
          Math.abs(_) > i.minBounceBackAngle && (this._blockedSortIndex = null);
        }
        return (
          (this._sortX1 = this._sortX2),
          (this._sortY1 = this._sortY2),
          (this._sortX2 = t),
          (this._sortY2 = e),
          !0
        );
      }
      return !1;
    }),
    (ye.prototype._resetStartPredicate = function () {
      var t = this._startPredicateData;
      t &&
        (t.delayTimer && (t.delayTimer = window.clearTimeout(t.delayTimer)),
        (this._startPredicateData = null));
    }),
    (ye.prototype._handleSort = function () {
      if (this._isActive) {
        var t = this._getGrid()._settings;
        if (
          !t.dragSort ||
          (!t.dragAutoScroll.sortDuringScroll &&
            ye.autoScroller.isItemScrolling(this._item))
        )
          return (
            (this._sortX1 = this._sortX2 = this._gridX),
            (this._sortY1 = this._sortY2 = this._gridY),
            (this._isSortNeeded = !0),
            void (
              void 0 !== this._sortTimer &&
              (this._sortTimer = window.clearTimeout(this._sortTimer))
            )
          );
        var e = this._checkHeuristics(this._gridX, this._gridY);
        if (this._isSortNeeded || e) {
          var i = t.dragSortHeuristics.sortInterval;
          i <= 0 || this._isSortNeeded
            ? ((this._isSortNeeded = !1),
              void 0 !== this._sortTimer &&
                (this._sortTimer = window.clearTimeout(this._sortTimer)),
              this._checkOverlap())
            : void 0 === this._sortTimer &&
              (this._sortTimer = window.setTimeout(this._handleSortDelayed, i));
        }
      }
    }),
    (ye.prototype._handleSortDelayed = function () {
      (this._isSortNeeded = !0),
        (this._sortTimer = void 0),
        at(this._item._id, this._handleSort);
    }),
    (ye.prototype._cancelSort = function () {
      var t;
      (this._isSortNeeded = !1),
        void 0 !== this._sortTimer &&
          (this._sortTimer = window.clearTimeout(this._sortTimer)),
        (t = this._item._id),
        it.remove(1, U + t);
    }),
    (ye.prototype._finishSort = function () {
      var t =
        this._getGrid()._settings.dragSort &&
        (this._isSortNeeded || void 0 !== this._sortTimer);
      this._cancelSort(), t && this._checkOverlap();
    }),
    (ye.prototype._checkOverlap = function () {
      if (this._isActive) {
        var t,
          e,
          n,
          o,
          r,
          h,
          a,
          _,
          l = this._item,
          m = this._getGrid()._settings;
        (t = dt(m.dragSortPredicate)
          ? m.dragSortPredicate(l, this._dragMoveEvent)
          : ye.defaultSortPredicate(l, m.dragSortPredicate)) &&
          "number" == typeof t.index &&
          ((a = t.action === i ? i : s),
          (_ = (e = l.getGrid()) !== (o = t.grid || e)),
          (n = e._items.indexOf(l)),
          (r = Wt(o._items, t.index, _ && a === s ? 1 : 0)),
          (_ || r !== this._blockedSortIndex) &&
            (_
              ? ((this._blockedSortIndex = null),
                (h = o._items[r]),
                e._hasListeners(c) &&
                  e._emit(c, {
                    item: l,
                    fromGrid: e,
                    fromIndex: n,
                    toGrid: o,
                    toIndex: r,
                  }),
                o._hasListeners(p) &&
                  o._emit(p, {
                    item: l,
                    fromGrid: e,
                    fromIndex: n,
                    toGrid: o,
                    toIndex: r,
                  }),
                (l._gridId = o._id),
                (this._isMigrating = l._gridId !== this._gridId),
                e._items.splice(n, 1),
                Gt(o._items, l, r),
                (l._sortData = null),
                e._hasListeners(u) &&
                  e._emit(u, {
                    item: l,
                    fromGrid: e,
                    fromIndex: n,
                    toGrid: o,
                    toIndex: r,
                  }),
                o._hasListeners(f) &&
                  o._emit(f, {
                    item: l,
                    fromGrid: e,
                    fromIndex: n,
                    toGrid: o,
                    toIndex: r,
                  }),
                a === i &&
                  h &&
                  h.isActive() &&
                  o._items.indexOf(h) > -1 &&
                  o.send(h, e, n, {
                    appendTo: this._container || document.body,
                    layoutSender: !1,
                    layoutReceiver: !1,
                  }),
                e.layout(),
                o.layout())
              : n !== r &&
                ((this._blockedSortIndex = n),
                (a === i ? Nt : Bt)(e._items, n, r),
                e._hasListeners(d) &&
                  e._emit(d, { item: l, fromIndex: n, toIndex: r, action: a }),
                e.layout())));
      }
    }),
    (ye.prototype._finishMigration = function () {
      var t,
        e,
        i = this._item,
        s = i._dragRelease,
        n = i._element,
        o = i._isActive,
        r = i.getGrid(),
        h = r._element,
        a = r._settings,
        _ = a.dragContainer || h,
        l = this._getGrid()._settings,
        d = n.parentNode,
        u = o ? l.itemVisibleClass : l.itemHiddenClass,
        c = o ? a.itemVisibleClass : a.itemHiddenClass;
      (this._isMigrating = !1),
        this.destroy(),
        l.itemClass !== a.itemClass && (ue(n, l.itemClass), Ot(n, a.itemClass)),
        u !== c && (ue(n, u), Ot(n, c)),
        _ !== d &&
          (_.appendChild(n),
          (e = ie(d, _, !0)),
          ((t = de(n)).x -= e.left),
          (t.y -= e.top)),
        i._refreshDimensions(),
        (e = ie(_, h, !0)),
        (s._containerDiffX = e.left),
        (s._containerDiffY = e.top),
        (i._drag = a.dragEnabled ? new ye(i) : null),
        _ !== d && i._setTranslate(t.x, t.y),
        i._visibility.setStyles(o ? a.visibleStyles : a.hiddenStyles),
        s.start();
    }),
    (ye.prototype._preStartCheck = function (t) {
      0 === this._startPredicateState && (this._startPredicateState = 1),
        1 === this._startPredicateState
          ? ((this._startPredicateResult = this._startPredicate(this._item, t)),
            !0 === this._startPredicateResult
              ? ((this._startPredicateState = 2), this._onStart(t))
              : !1 === this._startPredicateResult &&
                (this._resetStartPredicate(t),
                this._dragger._reset(),
                (this._startPredicateState = 0)))
          : 2 === this._startPredicateState &&
            this._isActive &&
            this._onMove(t);
    }),
    (ye.prototype._preEndCheck = function (t) {
      var e = 2 === this._startPredicateState;
      this._startPredicate(this._item, t),
        (this._startPredicateState = 0),
        e && this._isActive && (this._isStarted ? this._onEnd(t) : this.stop());
    }),
    (ye.prototype._onStart = function (t) {
      var e,
        i,
        s,
        n = this._item;
      n._isActive &&
        ((this._isActive = !0),
        (this._dragStartEvent = t),
        ye.autoScroller.addItem(n),
        (e = n._id),
        (i = this._prepareStart),
        (s = this._applyStart),
        it.add(0, N + e, i),
        it.add(2, F + e, s));
    }),
    (ye.prototype._prepareStart = function () {
      if (this._isActive) {
        var t = this._item;
        if (t._isActive) {
          var e = t._element,
            i = this._getGrid(),
            s = i._settings,
            n = i._element,
            o = s.dragContainer || n,
            r = Jt(o),
            h = de(e),
            a = e.getBoundingClientRect(),
            _ = o !== n;
          if (
            ((this._container = o),
            (this._containingBlock = r),
            (this._clientX = a.left),
            (this._clientY = a.top),
            (this._left = this._gridX = h.x),
            (this._top = this._gridY = h.y),
            (this._scrollDiffX = this._scrollDiffY = 0),
            (this._moveDiffX = this._moveDiffY = 0),
            this._resetHeuristics(this._gridX, this._gridY),
            _)
          ) {
            var l = ie(r, n);
            (this._containerDiffX = l.left), (this._containerDiffY = l.top);
          }
        }
      }
    }),
    (ye.prototype._applyStart = function () {
      if (this._isActive) {
        var t = this._item;
        if (t._isActive) {
          var e = this._getGrid(),
            i = t._element,
            s = t._dragRelease,
            n = t._migrate,
            o = this._container !== e._element;
          t.isPositioning() && t._layout.stop(!0, this._left, this._top),
            n._isActive &&
              ((this._left -= n._containerDiffX),
              (this._top -= n._containerDiffY),
              (this._gridX -= n._containerDiffX),
              (this._gridY -= n._containerDiffY),
              n.stop(!0, this._left, this._top)),
            t.isReleasing() && s._reset(),
            e._settings.dragPlaceholder.enabled && t._dragPlaceholder.create(),
            (this._isStarted = !0),
            e._emit("dragInit", t, this._dragStartEvent),
            o &&
              (i.parentNode === this._container
                ? ((this._gridX -= this._containerDiffX),
                  (this._gridY -= this._containerDiffY))
                : ((this._left += this._containerDiffX),
                  (this._top += this._containerDiffY),
                  this._container.appendChild(i),
                  t._setTranslate(this._left, this._top))),
            Ot(i, e._settings.itemDraggingClass),
            this._bindScrollListeners(),
            e._emit("dragStart", t, this._dragStartEvent);
        }
      }
    }),
    (ye.prototype._onMove = function (t) {
      var e,
        i,
        s,
        n = this._item;
      n._isActive
        ? ((this._dragMoveEvent = t),
          (e = n._id),
          (i = this._prepareMove),
          (s = this._applyMove),
          it.add(0, z + e, i),
          it.add(2, V + e, s),
          at(n._id, this._handleSort))
        : this.stop();
    }),
    (ye.prototype._prepareMove = function () {
      if (this._isActive && this._item._isActive) {
        var t = this._getGrid()._settings.dragAxis,
          e = this._dragMoveEvent,
          i = this._dragPrevMoveEvent || this._dragStartEvent || e;
        if ("y" !== t) {
          var s = e.clientX - i.clientX;
          (this._left = this._left - this._moveDiffX + s),
            (this._gridX = this._gridX - this._moveDiffX + s),
            (this._clientX = this._clientX - this._moveDiffX + s),
            (this._moveDiffX = s);
        }
        if ("x" !== t) {
          var n = e.clientY - i.clientY;
          (this._top = this._top - this._moveDiffY + n),
            (this._gridY = this._gridY - this._moveDiffY + n),
            (this._clientY = this._clientY - this._moveDiffY + n),
            (this._moveDiffY = n);
        }
        this._dragPrevMoveEvent = e;
      }
    }),
    (ye.prototype._applyMove = function () {
      if (this._isActive) {
        var t = this._item;
        t._isActive &&
          ((this._moveDiffX = this._moveDiffY = 0),
          t._setTranslate(this._left, this._top),
          this._getGrid()._emit("dragMove", t, this._dragMoveEvent),
          ye.autoScroller.updateItem(t));
      }
    }),
    (ye.prototype._onScroll = function (t) {
      var e,
        i,
        s,
        n = this._item;
      n._isActive
        ? ((this._scrollEvent = t),
          (e = n._id),
          (i = this._prepareScroll),
          (s = this._applyScroll),
          it.add(0, j + e, i),
          it.add(2, Q + e, s),
          at(n._id, this._handleSort))
        : this.stop();
    }),
    (ye.prototype._prepareScroll = function () {
      if (this._isActive) {
        var t = this._item;
        if (t._isActive) {
          var e = t._element,
            i = this._getGrid()._element,
            s = e.getBoundingClientRect();
          if (this._container !== i) {
            var n = ie(this._containingBlock, i);
            (this._containerDiffX = n.left), (this._containerDiffY = n.top);
          }
          var o = this._clientX - this._moveDiffX - s.left;
          (this._left = this._left - this._scrollDiffX + o),
            (this._scrollDiffX = o);
          var r = this._clientY - this._moveDiffY - s.top;
          (this._top = this._top - this._scrollDiffY + r),
            (this._scrollDiffY = r),
            (this._gridX = this._left - this._containerDiffX),
            (this._gridY = this._top - this._containerDiffY);
        }
      }
    }),
    (ye.prototype._applyScroll = function () {
      if (this._isActive) {
        var t = this._item;
        t._isActive &&
          ((this._scrollDiffX = this._scrollDiffY = 0),
          t._setTranslate(this._left, this._top),
          this._getGrid()._emit("dragScroll", t, this._scrollEvent));
      }
    }),
    (ye.prototype._onEnd = function (t) {
      var e = this._item,
        i = e._element,
        s = this._getGrid(),
        n = s._settings,
        o = e._dragRelease;
      e._isActive
        ? (ot(e._id),
          rt(e._id),
          ht(e._id),
          this._finishSort(),
          this._unbindScrollListeners(),
          (o._containerDiffX = this._containerDiffX),
          (o._containerDiffY = this._containerDiffY),
          this._reset(),
          ue(i, n.itemDraggingClass),
          ye.autoScroller.removeItem(e),
          s._emit("dragEnd", e, t),
          this._isMigrating ? this._finishMigration() : o.start())
        : this.stop();
    });
  var we = /^(webkit|moz|ms|o|Webkit|Moz|MS|O)(?=[A-Z])/,
    De = {};
  function be(t) {
    var e = De[t];
    return (
      e ||
      ((e = t.replace(we, "")) !== t && (e = e[0].toLowerCase() + e.slice(1)),
      (De[t] = e),
      e)
    );
  }
  function Ae(t, e) {
    for (var i in e) t.style[i] = e[i];
  }
  var Ee,
    Te,
    xe = !(!Element || !dt(Element.prototype.animate)),
    ke = !!(
      Element &&
      ((Ee = Element.prototype.animate),
      (Te = window.Symbol),
      Ee &&
        dt(Te) &&
        dt(Te.toString) &&
        Te(Ee).toString().indexOf("[native code]") > -1)
    );
  function Le(t) {
    (this._element = t),
      (this._animation = null),
      (this._duration = 0),
      (this._easing = ""),
      (this._callback = null),
      (this._props = []),
      (this._values = []),
      (this._isDestroyed = !1),
      (this._onFinish = this._onFinish.bind(this));
  }
  function Re(t, e) {
    var i = {};
    for (var s in t) i[e ? s : be(s)] = t[s];
    return i;
  }
  function Ie(t, e) {
    return "translateX(" + t + "px) translateY(" + e + "px)";
  }
  function Ce(t) {
    (this._item = t),
      (this._animation = new Le()),
      (this._element = null),
      (this._className = ""),
      (this._didMigrate = !1),
      (this._resetAfterLayout = !1),
      (this._left = 0),
      (this._top = 0),
      (this._transX = 0),
      (this._transY = 0),
      (this._nextTransX = 0),
      (this._nextTransY = 0),
      (this._setupAnimation = this._setupAnimation.bind(this)),
      (this._startAnimation = this._startAnimation.bind(this)),
      (this._updateDimensions = this._updateDimensions.bind(this)),
      (this._onLayoutStart = this._onLayoutStart.bind(this)),
      (this._onLayoutEnd = this._onLayoutEnd.bind(this)),
      (this._onReleaseEnd = this._onReleaseEnd.bind(this)),
      (this._onMigrate = this._onMigrate.bind(this)),
      (this._onHide = this._onHide.bind(this));
  }
  function Me(t) {
    (this._item = t),
      (this._isActive = !1),
      (this._isDestroyed = !1),
      (this._isPositioningStarted = !1),
      (this._containerDiffX = 0),
      (this._containerDiffY = 0);
  }
  (Le.prototype.start = function (t, e, i) {
    if (!this._isDestroyed) {
      var s = this._element,
        n = i || {};
      if (!xe)
        return (
          Ae(s, e),
          (this._callback = dt(n.onFinish) ? n.onFinish : null),
          void this._onFinish()
        );
      var o,
        r,
        h,
        a = this._animation,
        _ = this._props,
        l = this._values,
        d = n.duration || 300,
        u = n.easing || "ease",
        c = !1;
      if (
        a &&
        ((r = 0), (d === this._duration && u === this._easing) || (c = !0), !c)
      ) {
        for (o in e)
          if ((++r, -1 === (h = _.indexOf(o)) || e[o] !== l[h])) {
            c = !0;
            break;
          }
        r !== _.length && (c = !0);
      }
      if (
        (c && a.cancel(),
        (this._callback = dt(n.onFinish) ? n.onFinish : null),
        !a || c)
      ) {
        for (o in ((_.length = l.length = 0), e)) _.push(o), l.push(e[o]);
        (this._duration = d),
          (this._easing = u),
          (this._animation = s.animate([Re(t, ke), Re(e, ke)], {
            duration: d,
            easing: u,
          })),
          (this._animation.onfinish = this._onFinish),
          Ae(s, e);
      }
    }
  }),
    (Le.prototype.stop = function () {
      !this._isDestroyed &&
        this._animation &&
        (this._animation.cancel(),
        (this._animation = this._callback = null),
        (this._props.length = this._values.length = 0));
    }),
    (Le.prototype.getCurrentStyles = function () {
      return Se(element, currentProps);
    }),
    (Le.prototype.isAnimating = function () {
      return !!this._animation;
    }),
    (Le.prototype.destroy = function () {
      this._isDestroyed ||
        (this.stop(), (this._element = null), (this._isDestroyed = !0));
    }),
    (Le.prototype._onFinish = function () {
      var t = this._callback;
      (this._animation = this._callback = null),
        (this._props.length = this._values.length = 0),
        t && t();
    }),
    (Ce.prototype._updateDimensions = function () {
      this.isActive() &&
        Ae(this._element, {
          width: this._item._width + "px",
          height: this._item._height + "px",
        });
    }),
    (Ce.prototype._onLayoutStart = function (t, e) {
      var i = this._item;
      if (-1 !== t.indexOf(i)) {
        var s = i._left,
          n = i._top,
          o = this._left,
          r = this._top;
        if (
          ((this._left = s),
          (this._top = n),
          e || this._didMigrate || o !== s || r !== n)
        ) {
          var h,
            a,
            _,
            l = s + i._marginLeft,
            d = n + i._marginTop,
            u = i.getGrid();
          if (!(!e && u._settings.layoutDuration > 0) || this._didMigrate)
            return (
              _t(i._id),
              (this._element.style[Ft] = Ie(l, d)),
              this._animation.stop(),
              void (
                this._didMigrate &&
                (u.getElement().appendChild(this._element),
                (this._didMigrate = !1))
              )
            );
          (this._nextTransX = l),
            (this._nextTransY = d),
            (h = i._id),
            (a = this._setupAnimation),
            (_ = this._startAnimation),
            it.add(0, Z + h, a),
            it.add(2, J + h, _);
        }
      } else this.reset();
    }),
    (Ce.prototype._setupAnimation = function () {
      if (this.isActive()) {
        var t = de(this._element);
        (this._transX = t.x), (this._transY = t.y);
      }
    }),
    (Ce.prototype._startAnimation = function () {
      if (this.isActive()) {
        var t = this._animation,
          e = this._transX,
          i = this._transY,
          s = this._nextTransX,
          n = this._nextTransY;
        if (e !== s || i !== n) {
          var o = this._item.getGrid()._settings,
            r = {},
            h = {};
          (r[Ft] = Ie(e, i)),
            (h[Ft] = Ie(s, n)),
            t.start(r, h, {
              duration: o.layoutDuration,
              easing: o.layoutEasing,
              onFinish: this._onLayoutEnd,
            });
        } else
          t.isAnimating() && ((this._element.style[Ft] = Ie(s, n)), t.stop());
      }
    }),
    (Ce.prototype._onLayoutEnd = function () {
      this._resetAfterLayout && this.reset();
    }),
    (Ce.prototype._onReleaseEnd = function (t) {
      if (t._id === this._item._id) {
        if (!this._animation.isAnimating()) return void this.reset();
        this._resetAfterLayout = !0;
      }
    }),
    (Ce.prototype._onMigrate = function (t) {
      if (t.item === this._item) {
        var e = this._item.getGrid(),
          i = t.toGrid;
        e.off(m, this._onReleaseEnd),
          e.off(n, this._onLayoutStart),
          e.off(c, this._onMigrate),
          e.off(a, this._onHide),
          i.on(m, this._onReleaseEnd),
          i.on(n, this._onLayoutStart),
          i.on(c, this._onMigrate),
          i.on(a, this._onHide),
          (this._didMigrate = !0);
      }
    }),
    (Ce.prototype._onHide = function (t) {
      t.indexOf(this._item) > -1 && this.reset();
    }),
    (Ce.prototype.create = function () {
      if (this.isActive()) this._resetAfterLayout = !1;
      else {
        var t,
          e = this._item,
          i = e.getGrid(),
          s = i._settings,
          o = this._animation;
        (this._left = e._left),
          (this._top = e._top),
          (t = dt(s.dragPlaceholder.createElement)
            ? s.dragPlaceholder.createElement(e)
            : document.createElement("div")),
          (this._element = t),
          (o._element = t),
          (this._className = s.itemPlaceholderClass || ""),
          this._className && Ot(t, this._className),
          Ae(t, {
            position: "absolute",
            left: "0px",
            top: "0px",
            width: e._width + "px",
            height: e._height + "px",
          }),
          (t.style[Ft] = Ie(e._left + e._marginLeft, e._top + e._marginTop)),
          i.on(n, this._onLayoutStart),
          i.on(m, this._onReleaseEnd),
          i.on(c, this._onMigrate),
          i.on(a, this._onHide),
          dt(s.dragPlaceholder.onCreate) && s.dragPlaceholder.onCreate(e, t),
          i.getElement().appendChild(t);
      }
    }),
    (Ce.prototype.reset = function () {
      if (this.isActive()) {
        var t,
          e = this._element,
          i = this._item,
          s = i.getGrid(),
          o = s._settings,
          r = this._animation;
        (this._resetAfterLayout = !1),
          _t(i._id),
          (t = i._id),
          it.remove(2, $ + t),
          r.stop(),
          (r._element = null),
          s.off(m, this._onReleaseEnd),
          s.off(n, this._onLayoutStart),
          s.off(c, this._onMigrate),
          s.off(a, this._onHide),
          this._className && (ue(e, this._className), (this._className = "")),
          e.parentNode.removeChild(e),
          (this._element = null),
          dt(o.dragPlaceholder.onRemove) && o.dragPlaceholder.onRemove(i, e);
      }
    }),
    (Ce.prototype.isActive = function () {
      return !!this._element;
    }),
    (Ce.prototype.getElement = function () {
      return this._element;
    }),
    (Ce.prototype.updateDimensions = function () {
      var t, e;
      this.isActive() &&
        ((t = this._item._id),
        (e = this._updateDimensions),
        it.add(2, $ + t, e));
    }),
    (Ce.prototype.destroy = function () {
      this.reset(),
        this._animation.destroy(),
        (this._item = this._animation = null);
    }),
    (Me.prototype.start = function () {
      if (!this._isDestroyed && !this._isActive) {
        var t = this._item,
          e = t.getGrid(),
          i = e._settings;
        (this._isActive = !0),
          Ot(t._element, i.itemReleasingClass),
          i.dragRelease.useDragContainer || this._placeToGrid(),
          e._emit("dragReleaseStart", t),
          e._nextLayoutData || t._layout.start(!1);
      }
    }),
    (Me.prototype.stop = function (t, e, i) {
      if (!this._isDestroyed && this._isActive) {
        var s = this._item,
          n = s.getGrid();
        t || (void 0 !== e && void 0 !== i) || ((e = s._left), (i = s._top));
        var o = this._placeToGrid(e, i);
        this._reset(o), t || n._emit(m, s);
      }
    }),
    (Me.prototype.isJustReleased = function () {
      return this._isActive && !1 === this._isPositioningStarted;
    }),
    (Me.prototype.destroy = function () {
      this._isDestroyed ||
        (this.stop(!0), (this._item = null), (this._isDestroyed = !0));
    }),
    (Me.prototype._placeToGrid = function (t, e) {
      if (!this._isDestroyed) {
        var i = this._item,
          s = i._element,
          n = i.getGrid()._element,
          o = !1;
        if (s.parentNode !== n) {
          if (void 0 === t || void 0 === e) {
            var r = de(s);
            (t = r.x - this._containerDiffX), (e = r.y - this._containerDiffY);
          }
          n.appendChild(s), i._setTranslate(t, e), (o = !0);
        }
        return (this._containerDiffX = 0), (this._containerDiffY = 0), o;
      }
    }),
    (Me.prototype._reset = function (t) {
      if (!this._isDestroyed) {
        var e = this._item,
          i = e.getGrid()._settings.itemReleasingClass;
        (this._isActive = !1),
          (this._isPositioningStarted = !1),
          (this._containerDiffX = 0),
          (this._containerDiffY = 0),
          i && (t && e._element.clientWidth, ue(e._element, i));
      }
    });
  function Pe(t) {
    var e = t._element,
      i = e.style;
    (this._item = t),
      (this._isActive = !1),
      (this._isDestroyed = !1),
      (this._isInterrupted = !1),
      (this._currentStyles = {}),
      (this._targetStyles = {}),
      (this._nextLeft = 0),
      (this._nextTop = 0),
      (this._offsetLeft = 0),
      (this._offsetTop = 0),
      (this._skipNextAnimation = !1),
      (this._animOptions = {
        onFinish: this._finish.bind(this),
        duration: 0,
        easing: 0,
      }),
      (i.left = "0px"),
      (i.top = "0px"),
      t._setTranslate(0, 0),
      (this._animation = new Le(e)),
      (this._queue = "layout-" + t._id),
      (this._setupAnimation = this._setupAnimation.bind(this)),
      (this._startAnimation = this._startAnimation.bind(this));
  }
  function Xe(t) {
    (this._item = t),
      (this._isActive = !1),
      (this._isDestroyed = !1),
      (this._container = !1),
      (this._containerDiffX = 0),
      (this._containerDiffY = 0);
  }
  function Ye(t) {
    var e = t._isActive,
      i = t._element,
      s = i.children[0],
      n = t.getGrid()._settings;
    if (!s)
      throw new Error("No valid child element found within item element.");
    (this._item = t),
      (this._isDestroyed = !1),
      (this._isHidden = !e),
      (this._isHiding = !1),
      (this._isShowing = !1),
      (this._childElement = s),
      (this._currentStyleProps = []),
      (this._animation = new Le(s)),
      (this._queue = "visibility-" + t._id),
      (this._finishShow = this._finishShow.bind(this)),
      (this._finishHide = this._finishHide.bind(this)),
      (i.style.display = e ? "" : "none"),
      Ot(i, e ? n.itemVisibleClass : n.itemHiddenClass),
      this.setStyles(e ? n.visibleStyles : n.hiddenStyles);
  }
  (Pe.prototype.start = function (t, e) {
    if (!this._isDestroyed) {
      var i,
        s,
        n,
        o = this._item,
        r = o._dragRelease,
        h = o.getGrid()._settings,
        a = this._isActive,
        _ = r.isJustReleased(),
        l = _ ? h.dragRelease.duration : h.layoutDuration,
        d = _ ? h.dragRelease.easing : h.layoutEasing,
        u = !t && !this._skipNextAnimation && l > 0;
      if (
        (a && (st(o._id), o._emitter.burst(this._queue, !0, o)),
        _ && (r._isPositioningStarted = !0),
        dt(e) && o._emitter.on(this._queue, e),
        (this._skipNextAnimation = !1),
        !u)
      )
        return (
          this._updateOffsets(),
          o._setTranslate(this._nextLeft, this._nextTop),
          this._animation.stop(),
          void this._finish()
        );
      this._animation.isAnimating() &&
        (this._animation._animation.onfinish = null),
        (this._isActive = !0),
        (this._animOptions.easing = d),
        (this._animOptions.duration = l),
        (this._isInterrupted = a),
        (i = o._id),
        (s = this._setupAnimation),
        (n = this._startAnimation),
        it.add(0, H + i, s),
        it.add(2, G + i, n);
    }
  }),
    (Pe.prototype.stop = function (t, e, i) {
      if (!this._isDestroyed && this._isActive) {
        var s = this._item;
        if ((st(s._id), this._animation.isAnimating())) {
          if (void 0 === e || void 0 === i) {
            var n = de(s._element);
            (e = n.x), (i = n.y);
          }
          s._setTranslate(e, i), this._animation.stop();
        }
        ue(s._element, s.getGrid()._settings.itemPositioningClass),
          (this._isActive = !1),
          t && s._emitter.burst(this._queue, !0, s);
      }
    }),
    (Pe.prototype.destroy = function () {
      if (!this._isDestroyed) {
        var t = this._item._element.style;
        this.stop(!0, 0, 0),
          this._item._emitter.clear(this._queue),
          this._animation.destroy(),
          (t[Ft] = ""),
          (t.left = ""),
          (t.top = ""),
          (this._item = null),
          (this._currentStyles = null),
          (this._targetStyles = null),
          (this._animOptions = null),
          (this._isDestroyed = !0);
      }
    }),
    (Pe.prototype._updateOffsets = function () {
      if (!this._isDestroyed) {
        var t = this._item,
          e = t._migrate,
          i = t._dragRelease;
        (this._offsetLeft = i._isActive
          ? i._containerDiffX
          : e._isActive
          ? e._containerDiffX
          : 0),
          (this._offsetTop = i._isActive
            ? i._containerDiffY
            : e._isActive
            ? e._containerDiffY
            : 0),
          (this._nextLeft = this._item._left + this._offsetLeft),
          (this._nextTop = this._item._top + this._offsetTop);
      }
    }),
    (Pe.prototype._finish = function () {
      if (!this._isDestroyed) {
        var t = this._item,
          e = t._migrate,
          i = t._dragRelease;
        (t._tX = this._nextLeft),
          (t._tY = this._nextTop),
          this._isActive &&
            ((this._isActive = !1),
            ue(t._element, t.getGrid()._settings.itemPositioningClass)),
          i._isActive && i.stop(),
          e._isActive && e.stop(),
          t._emitter.burst(this._queue, !1, t);
      }
    }),
    (Pe.prototype._setupAnimation = function () {
      var t = this._item;
      if (void 0 === t._tX || void 0 === t._tY) {
        var e = de(t._element);
        (t._tX = e.x), (t._tY = e.y);
      }
    }),
    (Pe.prototype._startAnimation = function () {
      var t = this._item,
        e = t.getGrid()._settings,
        i = this._animOptions.duration <= 0;
      this._updateOffsets();
      var s = Math.abs(t._left - (t._tX - this._offsetLeft)),
        n = Math.abs(t._top - (t._tY - this._offsetTop));
      if (i || (s < 2 && n < 2))
        return (
          (s || n || this._isInterrupted) &&
            t._setTranslate(this._nextLeft, this._nextTop),
          this._animation.stop(),
          void this._finish()
        );
      this._isInterrupted || Ot(t._element, e.itemPositioningClass),
        (this._currentStyles[Ft] = Ie(t._tX, t._tY)),
        (this._targetStyles[Ft] = Ie(this._nextLeft, this._nextTop)),
        (t._tX = t._tY = void 0),
        this._animation.start(
          this._currentStyles,
          this._targetStyles,
          this._animOptions
        );
    }),
    (Xe.prototype.start = function (t, e, i) {
      if (!this._isDestroyed) {
        var s,
          n,
          o,
          r,
          h,
          a,
          _,
          l,
          d,
          m,
          g = this._item,
          v = g._element,
          y = g.isActive(),
          S = g.isVisible(),
          w = g.getGrid(),
          D = w._settings,
          b = t._settings,
          A = t._element,
          E = t._items,
          T = w._items.indexOf(g),
          x = i || document.body;
        if ("number" == typeof e) s = Wt(E, e, 1);
        else {
          if (!(n = t.getItem(e))) return;
          s = E.indexOf(n);
        }
        (g.isPositioning() || this._isActive || g.isReleasing()) &&
          ((_ = (a = de(v)).x), (l = a.y)),
          g.isPositioning() && g._layout.stop(!0, _, l),
          this._isActive &&
            ((_ -= this._containerDiffX),
            (l -= this._containerDiffY),
            this.stop(!0, _, l)),
          g.isReleasing() &&
            ((_ -= g._dragRelease._containerDiffX),
            (l -= g._dragRelease._containerDiffY),
            g._dragRelease.stop(!0, _, l)),
          g._visibility.stop(!0),
          g._drag && g._drag.destroy(),
          w._hasListeners(c) &&
            w._emit(c, {
              item: g,
              fromGrid: w,
              fromIndex: T,
              toGrid: t,
              toIndex: s,
            }),
          t._hasListeners(p) &&
            t._emit(p, {
              item: g,
              fromGrid: w,
              fromIndex: T,
              toGrid: t,
              toIndex: s,
            }),
          D.itemClass !== b.itemClass &&
            (ue(v, D.itemClass), Ot(v, b.itemClass)),
          (d = S ? D.itemVisibleClass : D.itemHiddenClass) !==
            (m = S ? b.itemVisibleClass : b.itemHiddenClass) &&
            (ue(v, d), Ot(v, m)),
          w._items.splice(T, 1),
          Gt(E, g, s),
          (g._gridId = t._id),
          y
            ? x !== (o = v.parentNode) &&
              (x.appendChild(v),
              (r = ie(x, o, !0)),
              a || ((_ = (a = de(v)).x), (l = a.y)),
              g._setTranslate(_ + r.left, l + r.top))
            : A.appendChild(v),
          g._visibility.setStyles(S ? b.visibleStyles : b.hiddenStyles),
          y && (h = ie(x, A, !0)),
          g._refreshDimensions(),
          (g._sortData = null),
          (g._drag = b.dragEnabled ? new ye(g) : null),
          y
            ? ((this._isActive = !0),
              (this._container = x),
              (this._containerDiffX = h.left),
              (this._containerDiffY = h.top))
            : ((this._isActive = !1),
              (this._container = null),
              (this._containerDiffX = 0),
              (this._containerDiffY = 0)),
          w._hasListeners(u) &&
            w._emit(u, {
              item: g,
              fromGrid: w,
              fromIndex: T,
              toGrid: t,
              toIndex: s,
            }),
          t._hasListeners(f) &&
            t._emit(f, {
              item: g,
              fromGrid: w,
              fromIndex: T,
              toGrid: t,
              toIndex: s,
            });
      }
    }),
    (Xe.prototype.stop = function (t, e, i) {
      if (!this._isDestroyed && this._isActive) {
        var s,
          n = this._item,
          o = n._element,
          r = n.getGrid()._element;
        this._container !== r &&
          ((void 0 !== e && void 0 !== i) ||
            (t
              ? ((e = (s = de(o)).x - this._containerDiffX),
                (i = s.y - this._containerDiffY))
              : ((e = n._left), (i = n._top))),
          r.appendChild(o),
          n._setTranslate(e, i)),
          (this._isActive = !1),
          (this._container = null),
          (this._containerDiffX = 0),
          (this._containerDiffY = 0);
      }
    }),
    (Xe.prototype.destroy = function () {
      this._isDestroyed ||
        (this.stop(!0), (this._item = null), (this._isDestroyed = !0));
    }),
    (Ye.prototype.show = function (t, e) {
      if (!this._isDestroyed) {
        var i = this._item,
          s = i._element,
          n = dt(e) ? e : null,
          o = i.getGrid()._settings;
        this._isShowing || this._isHidden
          ? !this._isShowing || t
            ? (this._isShowing ||
                (i._emitter.burst(this._queue, !0, i),
                ue(s, o.itemHiddenClass),
                Ot(s, o.itemVisibleClass),
                this._isHiding || (s.style.display = "")),
              n && i._emitter.on(this._queue, n),
              (this._isShowing = !0),
              (this._isHiding = this._isHidden = !1),
              this._startAnimation(!0, t, this._finishShow))
            : n && i._emitter.on(this._queue, n)
          : n && n(!1, i);
      }
    }),
    (Ye.prototype.hide = function (t, e) {
      if (!this._isDestroyed) {
        var i = this._item,
          s = i._element,
          n = dt(e) ? e : null,
          o = i.getGrid()._settings;
        this._isHiding || !this._isHidden
          ? !this._isHiding || t
            ? (this._isHiding ||
                (i._emitter.burst(this._queue, !0, i),
                Ot(s, o.itemHiddenClass),
                ue(s, o.itemVisibleClass)),
              n && i._emitter.on(this._queue, n),
              (this._isHidden = this._isHiding = !0),
              (this._isShowing = !1),
              this._startAnimation(!1, t, this._finishHide))
            : n && i._emitter.on(this._queue, n)
          : n && n(!1, i);
      }
    }),
    (Ye.prototype.stop = function (t) {
      if (!this._isDestroyed && (this._isHiding || this._isShowing)) {
        var e = this._item;
        nt(e._id),
          this._animation.stop(),
          t && e._emitter.burst(this._queue, !0, e);
      }
    }),
    (Ye.prototype.setStyles = function (t) {
      var e = this._childElement,
        i = this._currentStyleProps;
      for (var s in (this._removeCurrentStyles(), t))
        i.push(s), (e.style[s] = t[s]);
    }),
    (Ye.prototype.destroy = function () {
      if (!this._isDestroyed) {
        var t = this._item,
          e = t._element,
          i = t.getGrid()._settings;
        this.stop(!0),
          t._emitter.clear(this._queue),
          this._animation.destroy(),
          this._removeCurrentStyles(),
          ue(e, i.itemVisibleClass),
          ue(e, i.itemHiddenClass),
          (e.style.display = ""),
          (this._isHiding = this._isShowing = !1),
          (this._isDestroyed = this._isHidden = !0);
      }
    }),
    (Ye.prototype._startAnimation = function (t, e, i) {
      if (!this._isDestroyed) {
        var s,
          n = this._item,
          o = this._animation,
          r = this._childElement,
          h = n.getGrid()._settings,
          a = t ? h.visibleStyles : h.hiddenStyles,
          _ = t ? h.showDuration : h.hideDuration,
          l = t ? h.showEasing : h.hideEasing,
          d = e || _ <= 0;
        if (a) {
          if ((nt(n._id), d)) return Ae(r, a), o.stop(), void (i && i());
          var u, c, f;
          o.isAnimating() && (o._animation.onfinish = null),
            (u = n._id),
            (c = function () {
              s = Se(r, a);
            }),
            (f = function () {
              o.start(s, a, { duration: _, easing: l, onFinish: i });
            }),
            it.add(0, W + u, c),
            it.add(2, B + u, f);
        } else i && i();
      }
    }),
    (Ye.prototype._finishShow = function () {
      this._isHidden ||
        ((this._isShowing = !1),
        this._item._emitter.burst(this._queue, !1, this._item));
    }),
    (Ye.prototype._finishHide = function () {
      if (this._isHidden) {
        var t = this._item;
        (this._isHiding = !1),
          t._layout.stop(!0, 0, 0),
          (t._element.style.display = "none"),
          t._emitter.burst(this._queue, !1, t);
      }
    }),
    (Ye.prototype._removeCurrentStyles = function () {
      for (
        var t = this._childElement, e = this._currentStyleProps, i = 0;
        i < e.length;
        i++
      )
        t.style[e[i]] = "";
      e.length = 0;
    });
  var qe = 0;
  function Oe() {
    return ++qe;
  }
  function He(t, i, s) {
    var n = t._settings;
    if (e) {
      if (e.has(i))
        throw new Error("You can only create one Muuri Item per element!");
      e.set(i, this);
    }
    (this._id = Oe()),
      (this._gridId = t._id),
      (this._element = i),
      (this._isDestroyed = !1),
      (this._left = 0),
      (this._top = 0),
      (this._width = 0),
      (this._height = 0),
      (this._marginLeft = 0),
      (this._marginRight = 0),
      (this._marginTop = 0),
      (this._marginBottom = 0),
      (this._tX = void 0),
      (this._tY = void 0),
      (this._sortData = null),
      (this._emitter = new S()),
      i.parentNode !== t._element && t._element.appendChild(i),
      Ot(i, n.itemClass),
      "boolean" != typeof s && (s = "none" !== ct(i, "display")),
      (this._isActive = s),
      (this._visibility = new Ye(this)),
      (this._layout = new Pe(this)),
      (this._migrate = new Xe(this)),
      (this._drag = n.dragEnabled ? new ye(this) : null),
      (this._dragRelease = new Me(this)),
      (this._dragPlaceholder = new Ce(this));
  }
  function Ge(t) {
    var e,
      i,
      s,
      n,
      o,
      r = 0.001,
      h = 0.5;
    function a(t) {
      return ((((1e3 * t + 0.5) << 0) / 10) << 0) / 100;
    }
    function _() {
      (this.currentRects = []),
        (this.nextRects = []),
        (this.rectTarget = {}),
        (this.rectStore = []),
        (this.slotSizes = []),
        (this.rectId = 0),
        (this.slotIndex = -1),
        (this.slotData = { left: 0, top: 0, width: 0, height: 0 }),
        (this.sortRectsLeftTop = this.sortRectsLeftTop.bind(this)),
        (this.sortRectsTopLeft = this.sortRectsTopLeft.bind(this));
    }
    if (
      ((_.prototype.computeLayout = function (t, e) {
        var i,
          s,
          n,
          o,
          r,
          h,
          _ = t.items,
          l = t.slots,
          d = !!(1 & e),
          u = !!(2 & e),
          c = !!(4 & e),
          f = !!(8 & e),
          p = !!(16 & e),
          m = "number" == typeof _[0];
        if (!_.length) return t;
        for (s = m ? 2 : 1, i = 0; i < _.length; i += s)
          m
            ? ((o = _[i]), (r = _[i + 1]))
            : ((o = (n = _[i])._width + n._marginLeft + n._marginRight),
              (r = n._height + n._marginTop + n._marginBottom)),
            p && ((o = a(o)), (r = a(r))),
            (h = this.computeNextSlot(t, o, r, d, u)),
            u
              ? h.left + h.width > t.width && (t.width = h.left + h.width)
              : h.top + h.height > t.height && (t.height = h.top + h.height),
            (l[++this.slotIndex] = h.left),
            (l[++this.slotIndex] = h.top),
            (c || f) && this.slotSizes.push(h.width, h.height);
        if (c)
          for (i = 0; i < l.length; i += 2)
            l[i] = t.width - (l[i] + this.slotSizes[i]);
        if (f)
          for (i = 1; i < l.length; i += 2)
            l[i] = t.height - (l[i] + this.slotSizes[i]);
        return (
          (this.slotSizes.length = 0),
          (this.currentRects.length = 0),
          (this.nextRects.length = 0),
          (this.rectStore.length = 0),
          (this.rectId = 0),
          (this.slotIndex = -1),
          t
        );
      }),
      (_.prototype.computeNextSlot = function (t, e, i, s, n) {
        var o,
          a,
          _,
          l,
          d,
          u = this.slotData,
          c = this.currentRects,
          f = this.nextRects,
          p = !1;
        for (
          f.length = 0,
            u.left = null,
            u.top = null,
            u.width = e,
            u.height = i,
            l = 0;
          l < c.length;
          l++
        )
          if (
            (a = c[l]) &&
            ((o = this.getRect(a)),
            u.width <= o.width + r && u.height <= o.height + r)
          ) {
            (u.left = o.left), (u.top = o.top);
            break;
          }
        if (
          (null === u.left &&
            (n
              ? ((u.left = t.width), (u.top = 0))
              : ((u.left = 0), (u.top = t.height)),
            s || (p = !0)),
          !n &&
            u.top + u.height > t.height + r &&
            (u.left > h && f.push(this.addRect(0, t.height, u.left, 1 / 0)),
            u.left + u.width < t.width - h &&
              f.push(
                this.addRect(
                  u.left + u.width,
                  t.height,
                  t.width - u.left - u.width,
                  1 / 0
                )
              ),
            (t.height = u.top + u.height)),
          n &&
            u.left + u.width > t.width + r &&
            (u.top > h && f.push(this.addRect(t.width, 0, 1 / 0, u.top)),
            u.top + u.height < t.height - h &&
              f.push(
                this.addRect(
                  t.width,
                  u.top + u.height,
                  1 / 0,
                  t.height - u.top - u.height
                )
              ),
            (t.width = u.left + u.width)),
          !p)
        )
          for (s && (l = 0); l < c.length; l++)
            if ((a = c[l]))
              for (
                o = this.getRect(a), _ = this.splitRect(o, u), d = 0;
                d < _.length;
                d++
              )
                (a = _[d]),
                  (o = this.getRect(a)),
                  (n ? o.left + r < t.width - r : o.top + r < t.height - r) &&
                    f.push(a);
        return (
          f.length > 1 &&
            this.purgeRects(f).sort(
              n ? this.sortRectsLeftTop : this.sortRectsTopLeft
            ),
          (this.currentRects = f),
          (this.nextRects = c),
          u
        );
      }),
      (_.prototype.addRect = function (t, e, i, s) {
        var n = ++this.rectId;
        return (
          (this.rectStore[n] = t || 0),
          (this.rectStore[++this.rectId] = e || 0),
          (this.rectStore[++this.rectId] = i || 0),
          (this.rectStore[++this.rectId] = s || 0),
          n
        );
      }),
      (_.prototype.getRect = function (t, e) {
        return (
          e || (e = this.rectTarget),
          (e.left = this.rectStore[t] || 0),
          (e.top = this.rectStore[++t] || 0),
          (e.width = this.rectStore[++t] || 0),
          (e.height = this.rectStore[++t] || 0),
          e
        );
      }),
      (_.prototype.splitRect =
        ((e = []),
        (i = 0),
        (s = 0),
        function (t, n) {
          return (
            (e.length = 0),
            t.left + t.width <= n.left + r ||
            n.left + n.width <= t.left + r ||
            t.top + t.height <= n.top + r ||
            n.top + n.height <= t.top + r
              ? (e.push(this.addRect(t.left, t.top, t.width, t.height)), e)
              : ((i = n.left - t.left) >= h &&
                  e.push(this.addRect(t.left, t.top, i, t.height)),
                (i = t.left + t.width - (n.left + n.width)) >= h &&
                  e.push(this.addRect(n.left + n.width, t.top, i, t.height)),
                (s = n.top - t.top) >= h &&
                  e.push(this.addRect(t.left, t.top, t.width, s)),
                (s = t.top + t.height - (n.top + n.height)) >= h &&
                  e.push(this.addRect(t.left, n.top + n.height, t.width, s)),
                e)
          );
        })),
      (_.prototype.isRectAWithinRectB = function (t, e) {
        return (
          t.left + r >= e.left &&
          t.top + r >= e.top &&
          t.left + t.width - r <= e.left + e.width &&
          t.top + t.height - r <= e.top + e.height
        );
      }),
      (_.prototype.purgeRects =
        ((n = {}),
        (o = {}),
        function (t) {
          for (var e, i = t.length; i--; )
            if (((e = t.length), t[i]))
              for (this.getRect(t[i], n); e--; )
                if (
                  t[e] &&
                  i !== e &&
                  (this.getRect(t[e], o), this.isRectAWithinRectB(n, o))
                ) {
                  t[i] = 0;
                  break;
                }
          return t;
        })),
      (_.prototype.sortRectsTopLeft = (function () {
        var t = {},
          e = {};
        return function (i, s) {
          return (
            this.getRect(i, t),
            this.getRect(s, e),
            t.top < e.top && t.top + r < e.top
              ? -1
              : t.top > e.top && t.top - r > e.top
              ? 1
              : t.left < e.left && t.left + r < e.left
              ? -1
              : t.left > e.left && t.left - r > e.left
              ? 1
              : 0
          );
        };
      })()),
      (_.prototype.sortRectsLeftTop = (function () {
        var t = {},
          e = {};
        return function (i, s) {
          return (
            this.getRect(i, t),
            this.getRect(s, e),
            t.left < e.left && t.left + r < e.left
              ? -1
              : t.left > e.left && t.left - r < e.left
              ? 1
              : t.top < e.top && t.top + r < e.top
              ? -1
              : t.top > e.top && t.top - r > e.top
              ? 1
              : 0
          );
        };
      })()),
      t)
    ) {
      var l = new _();
      self.onmessage = function (t) {
        var e = new Float32Array(t.data),
          i = e.subarray(4, e.length),
          s = new Float32Array(i.length),
          n = e[3],
          o = { items: i, slots: s, width: e[1], height: e[2] };
        l.computeLayout(o, n),
          (e[1] = o.width),
          (e[2] = o.height),
          e.set(o.slots, 4),
          postMessage(e.buffer, [e.buffer]);
      };
    }
    return _;
  }
  (He.prototype.getGrid = function () {
    return t[this._gridId];
  }),
    (He.prototype.getElement = function () {
      return this._element;
    }),
    (He.prototype.getWidth = function () {
      return this._width;
    }),
    (He.prototype.getHeight = function () {
      return this._height;
    }),
    (He.prototype.getMargin = function () {
      return {
        left: this._marginLeft,
        right: this._marginRight,
        top: this._marginTop,
        bottom: this._marginBottom,
      };
    }),
    (He.prototype.getPosition = function () {
      return { left: this._left, top: this._top };
    }),
    (He.prototype.isActive = function () {
      return this._isActive;
    }),
    (He.prototype.isVisible = function () {
      return !!this._visibility && !this._visibility._isHidden;
    }),
    (He.prototype.isShowing = function () {
      return !(!this._visibility || !this._visibility._isShowing);
    }),
    (He.prototype.isHiding = function () {
      return !(!this._visibility || !this._visibility._isHiding);
    }),
    (He.prototype.isPositioning = function () {
      return !(!this._layout || !this._layout._isActive);
    }),
    (He.prototype.isDragging = function () {
      return !(!this._drag || !this._drag._isActive);
    }),
    (He.prototype.isReleasing = function () {
      return !(!this._dragRelease || !this._dragRelease._isActive);
    }),
    (He.prototype.isDestroyed = function () {
      return this._isDestroyed;
    }),
    (He.prototype._refreshDimensions = function (t) {
      if (!(this._isDestroyed || (!0 !== t && this._visibility._isHidden))) {
        var e = this._element,
          i = this._dragPlaceholder,
          s = e.getBoundingClientRect();
        (this._width = s.width),
          (this._height = s.height),
          (this._marginLeft = Math.max(0, ft(e, "margin-left"))),
          (this._marginRight = Math.max(0, ft(e, "margin-right"))),
          (this._marginTop = Math.max(0, ft(e, "margin-top"))),
          (this._marginBottom = Math.max(0, ft(e, "margin-bottom"))),
          i && i.updateDimensions();
      }
    }),
    (He.prototype._refreshSortData = function () {
      if (!this._isDestroyed) {
        var t,
          e = (this._sortData = {}),
          i = this.getGrid()._settings.sortData;
        for (t in i) e[t] = i[t](this, this._element);
      }
    }),
    (He.prototype._addToLayout = function (t, e) {
      !0 !== this._isActive &&
        ((this._isActive = !0), (this._left = t || 0), (this._top = e || 0));
    }),
    (He.prototype._removeFromLayout = function () {
      !1 !== this._isActive &&
        ((this._isActive = !1), (this._left = 0), (this._top = 0));
    }),
    (He.prototype._canSkipLayout = function (t, e) {
      return (
        this._left === t &&
        this._top === e &&
        !this._migrate._isActive &&
        !this._layout._skipNextAnimation &&
        !this._dragRelease.isJustReleased()
      );
    }),
    (He.prototype._setTranslate = function (t, e) {
      return (
        (this._tX !== t || this._tY !== e) &&
        ((this._tX = t),
        (this._tY = e),
        (this._element.style[Ft] = Ie(t, e)),
        !0)
      );
    }),
    (He.prototype._destroy = function (t) {
      if (!this._isDestroyed) {
        var i = this._element,
          s = this.getGrid()._settings;
        this._dragPlaceholder.destroy(),
          this._dragRelease.destroy(),
          this._migrate.destroy(),
          this._layout.destroy(),
          this._visibility.destroy(),
          this._drag && this._drag.destroy(),
          this._emitter.destroy(),
          ue(i, s.itemClass),
          t && i.parentNode.removeChild(i),
          e && e.delete(i),
          (this._isActive = !1),
          (this._isDestroyed = !0);
      }
    });
  var We = Ge(),
    Be = null,
    Ne = [];
  function Fe(t, e) {
    if (
      ((this._options = 0),
      (this._processor = null),
      (this._layoutQueue = []),
      (this._layouts = {}),
      (this._layoutCallbacks = {}),
      (this._layoutWorkers = {}),
      (this._layoutWorkerData = {}),
      (this._workers = []),
      (this._onWorkerMessage = this._onWorkerMessage.bind(this)),
      this.setOptions(e),
      (t = "number" == typeof t ? Math.max(0, t) : 0) &&
        window.Worker &&
        window.URL &&
        window.Blob)
    )
      try {
        this._workers = (function (t, e) {
          var i = [];
          if (t > 0) {
            Be ||
              (Be = URL.createObjectURL(
                new Blob(["(" + Ge.toString() + ")(true)"], {
                  type: "application/javascript",
                })
              ));
            for (var s, n = 0; n < t; n++)
              (s = new Worker(Be)),
                e && (s.onmessage = e),
                i.push(s),
                Ne.push(s);
          }
          return i;
        })(t, this._onWorkerMessage);
      } catch (t) {
        this._processor = new We();
      }
    else this._processor = new We();
  }
  (Fe.prototype._sendToWorker = function () {
    if (this._layoutQueue.length && this._workers.length) {
      var t = this._layoutQueue.shift(),
        e = this._workers.pop(),
        i = this._layoutWorkerData[t];
      delete this._layoutWorkerData[t],
        (this._layoutWorkers[t] = e),
        e.postMessage(i.buffer, [i.buffer]);
    }
  }),
    (Fe.prototype._onWorkerMessage = function (t) {
      var e = new Float32Array(t.data),
        i = e[0],
        s = this._layouts[i],
        n = this._layoutCallbacks[i],
        o = this._layoutWorkers[i];
      s && delete this._layouts[i],
        n && delete this._layoutCallbacks[i],
        o && delete this._layoutWorkers[i],
        s &&
          n &&
          ((s.width = e[1]),
          (s.height = e[2]),
          (s.slots = e.subarray(4, e.length)),
          this._finalizeLayout(s),
          n(s)),
        o && (this._workers.push(o), this._sendToWorker());
    }),
    (Fe.prototype._finalizeLayout = function (t) {
      var e = t._grid,
        i = 2 & t._settings,
        s = "border-box" === e._boxSizing;
      return (
        delete t._grid,
        delete t._settings,
        (t.styles = {}),
        i
          ? (t.styles.width =
              (s ? t.width + e._borderLeft + e._borderRight : t.width) + "px")
          : (t.styles.height =
              (s ? t.height + e._borderTop + e._borderBottom : t.height) +
              "px"),
        t
      );
    }),
    (Fe.prototype.setOptions = function (t) {
      var e, i, s, n, o;
      t &&
        ((e =
          "boolean" == typeof t.fillGaps
            ? t.fillGaps
              ? 1
              : 0
            : 1 & this._options),
        (i =
          "boolean" == typeof t.horizontal
            ? t.horizontal
              ? 2
              : 0
            : 2 & this._options),
        (s =
          "boolean" == typeof t.alignRight
            ? t.alignRight
              ? 4
              : 0
            : 4 & this._options),
        (n =
          "boolean" == typeof t.alignBottom
            ? t.alignBottom
              ? 8
              : 0
            : 8 & this._options),
        (o =
          "boolean" == typeof t.rounding
            ? t.rounding
              ? 16
              : 0
            : 16 & this._options),
        (this._options = e | i | s | n | o));
    }),
    (Fe.prototype.createLayout = function (t, e, i, s, n, o) {
      if (this._layouts[e])
        throw new Error(
          "A layout with the provided id is currently being processed."
        );
      var r = 2 & this._options,
        h = {
          id: e,
          items: i,
          slots: null,
          width: r ? 0 : s,
          height: r ? n : 0,
          _grid: t,
          _settings: this._options,
        };
      if (!i.length) return (h.slots = []), this._finalizeLayout(h), void o(h);
      if (this._processor)
        return (
          (h.slots = window.Float32Array
            ? new Float32Array(2 * i.length)
            : new Array(2 * i.length)),
          this._processor.computeLayout(h, h._settings),
          this._finalizeLayout(h),
          void o(h)
        );
      var a,
        _,
        l,
        d = new Float32Array(4 + 2 * i.length);
      for (
        d[0] = e,
          d[1] = h.width,
          d[2] = h.height,
          d[3] = h._settings,
          a = 0,
          _ = 3;
        a < i.length;
        a++
      )
        (l = i[a]),
          (d[++_] = l._width + l._marginLeft + l._marginRight),
          (d[++_] = l._height + l._marginTop + l._marginBottom);
      return (
        this._layoutQueue.push(e),
        (this._layouts[e] = h),
        (this._layoutCallbacks[e] = o),
        (this._layoutWorkerData[e] = d),
        this._sendToWorker(),
        this.cancelLayout.bind(this, e)
      );
    }),
    (Fe.prototype.cancelLayout = function (t) {
      if (
        this._layouts[t] &&
        (delete this._layouts[t],
        delete this._layoutCallbacks[t],
        this._layoutWorkerData[t])
      ) {
        delete this._layoutWorkerData[t];
        var e = this._layoutQueue.indexOf(t);
        e > -1 && this._layoutQueue.splice(e, 1);
      }
    }),
    (Fe.prototype.destroy = function () {
      for (var t in this._layoutWorkers)
        this._workers.push(this._layoutWorkers[t]);
      !(function (t) {
        for (var e, i, s = 0; s < t.length; s++)
          ((e = t[s]).onmessage = null),
            (e.onerror = null),
            (e.onmessageerror = null),
            e.terminate(),
            (i = Ne.indexOf(e)) > -1 && Ne.splice(i, 1);
        Be && !Ne.length && (URL.revokeObjectURL(Be), (Be = null));
      })(this._workers),
        (this._workers.length = 0),
        (this._layoutQueue.length = 0),
        (this._layouts = {}),
        (this._layoutCallbacks = {}),
        (this._layoutWorkers = {}),
        (this._layoutWorkerData = {});
    });
  var ze = 0;
  function Ve(t, e) {
    var i = ++ze,
      s = 0,
      n = 0,
      o = !1,
      r = function (e) {
        o ||
          (n && (s -= e - n),
          (n = e),
          s > 0
            ? (function (t, e) {
                it.add(0, et + t, e);
              })(i, r)
            : ((s = n = 0), t()));
      };
    return function (h) {
      if (!o) {
        if (!(e <= 0))
          return !0 === h
            ? ((o = !0),
              (s = n = 0),
              (r = void 0),
              void (function (t) {
                it.remove(0, et + t);
              })(i))
            : void (s <= 0 ? ((s = e), r(0)) : (s = e));
        !0 !== h && t();
      }
    };
  }
  function je(t) {
    var e = Object.prototype.toString.call(t);
    return "[object HTMLCollection]" === e || "[object NodeList]" === e;
  }
  var Qe = Object.prototype.toString;
  function Ue(t) {
    return "object" == typeof t && "[object Object]" === Qe.call(t);
  }
  function Ze() {}
  var Je,
    $e = "number",
    Ke = "string",
    ti = "instant",
    ei = 0;
  function ii(e, i) {
    if (
      (typeof e === Ke && (e = document.querySelector(e)),
      !(e.getRootNode
        ? e.getRootNode({ composed: !0 }) === document
        : document.body.contains(e)) || e === document.documentElement)
    )
      throw new Error("Container element must be an existing DOM element.");
    var s = (function (t, e) {
      var i = si({}, t);
      e && (i = si(i, e));
      e && e.visibleStyles
        ? (i.visibleStyles = e.visibleStyles)
        : t && t.visibleStyles && (i.visibleStyles = t.visibleStyles);
      e && e.hiddenStyles
        ? (i.hiddenStyles = e.hiddenStyles)
        : t && t.hiddenStyles && (i.hiddenStyles = t.hiddenStyles);
      return i;
    })(ii.defaultOptions, i);
    (s.visibleStyles = ni(s.visibleStyles)),
      (s.hiddenStyles = ni(s.hiddenStyles)),
      dt(s.dragSort) || (s.dragSort = !!s.dragSort),
      (this._id = Oe()),
      (this._element = e),
      (this._settings = s),
      (this._isDestroyed = !1),
      (this._items = []),
      (this._layout = { id: 0, items: [], slots: [] }),
      (this._isLayoutFinished = !0),
      (this._nextLayoutData = null),
      (this._emitter = new S()),
      (this._onLayoutDataReceived = this._onLayoutDataReceived.bind(this)),
      (t[this._id] = this),
      Ot(e, s.containerClass),
      (function (t, e) {
        typeof e !== $e && (e = !0 === e ? 0 : -1);
        e >= 0 &&
          ((t._resizeHandler = Ve(function () {
            t.refreshItems().layout();
          }, e)),
          window.addEventListener("resize", t._resizeHandler));
      })(this, s.layoutOnResize),
      this.add(
        (function (t, e) {
          if ("*" === e) return t.children;
          if (typeof e === Ke) {
            for (var i = [], s = t.children, n = 0; n < s.length; n++)
              qt(s[n], e) && i.push(s[n]);
            return i;
          }
          if (Array.isArray(e) || je(e)) return e;
          return [];
        })(e, s.items),
        { layout: !1 }
      ),
      s.layoutOnInit && this.layout(!0);
  }
  function si(t, e) {
    var i,
      s,
      n,
      o = Object.keys(e),
      r = o.length;
    for (n = 0; n < r; n++)
      (i = Ue(e[(s = o[n])])),
        Ue(t[s]) && i
          ? (t[s] = si(si({}, t[s]), e[s]))
          : i
          ? (t[s] = si({}, e[s]))
          : Array.isArray(e[s])
          ? (t[s] = e[s].slice(0))
          : (t[s] = e[s]);
    return t;
  }
  function ni(t) {
    var e,
      i,
      s = {},
      n = document.documentElement.style;
    for (e in t) t[e] && (i = E(n, e)) && (s[i] = t[e]);
    return s;
  }
  function oi(t) {
    for (var e = {}, i = 0; i < t.length; i++) e[t[i]._id] = i;
    return e;
  }
  function ri(t, e, i) {
    return t[e._id] - t[i._id];
  }
  return (
    (ii.Item = He),
    (ii.ItemLayout = Pe),
    (ii.ItemVisibility = Ye),
    (ii.ItemMigrate = Xe),
    (ii.ItemDrag = ye),
    (ii.ItemDragRelease = Me),
    (ii.ItemDragPlaceholder = Ce),
    (ii.Emitter = S),
    (ii.Animator = Le),
    (ii.Dragger = X),
    (ii.Packer = Fe),
    (ii.AutoScroller = Pt),
    (ii.defaultPacker = new Fe(2)),
    (ii.defaultOptions = {
      items: "*",
      showDuration: 300,
      showEasing: "ease",
      hideDuration: 300,
      hideEasing: "ease",
      visibleStyles: { opacity: "1", transform: "scale(1)" },
      hiddenStyles: { opacity: "0", transform: "scale(0.5)" },
      layout: {
        fillGaps: !1,
        horizontal: !1,
        alignRight: !1,
        alignBottom: !1,
        rounding: !1,
      },
      layoutOnResize: 150,
      layoutOnInit: !0,
      layoutDuration: 300,
      layoutEasing: "ease",
      sortData: null,
      dragEnabled: !1,
      dragContainer: null,
      dragHandle: null,
      dragStartPredicate: { distance: 0, delay: 0 },
      dragAxis: "xy",
      dragSort: !0,
      dragSortHeuristics: {
        sortInterval: 100,
        minDragDistance: 10,
        minBounceBackAngle: 1,
      },
      dragSortPredicate: { threshold: 50, action: s, migrateAction: s },
      dragRelease: { duration: 300, easing: "ease", useDragContainer: !0 },
      dragCssProps: {
        touchAction: "none",
        userSelect: "none",
        userDrag: "none",
        tapHighlightColor: "rgba(0, 0, 0, 0)",
        touchCallout: "none",
        contentZooming: "none",
      },
      dragPlaceholder: {
        enabled: !1,
        createElement: null,
        onCreate: null,
        onRemove: null,
      },
      dragAutoScroll: {
        targets: [],
        handle: null,
        threshold: 50,
        safeZone: 0.2,
        speed: Pt.smoothSpeed(1e3, 2e3, 2500),
        sortDuringScroll: !0,
        smoothStop: !1,
        onStart: null,
        onStop: null,
      },
      containerClass: "muuri",
      itemClass: "muuri-item",
      itemVisibleClass: "muuri-item-shown",
      itemHiddenClass: "muuri-item-hidden",
      itemPositioningClass: "muuri-item-positioning",
      itemDraggingClass: "muuri-item-dragging",
      itemReleasingClass: "muuri-item-releasing",
      itemPlaceholderClass: "muuri-item-placeholder",
    }),
    (ii.prototype.on = function (t, e) {
      return this._emitter.on(t, e), this;
    }),
    (ii.prototype.off = function (t, e) {
      return this._emitter.off(t, e), this;
    }),
    (ii.prototype.getElement = function () {
      return this._element;
    }),
    (ii.prototype.getItem = function (t) {
      if (this._isDestroyed || (!t && 0 !== t)) return null;
      if (typeof t === $e)
        return this._items[t > -1 ? t : this._items.length + t] || null;
      if (t instanceof He) return t._gridId === this._id ? t : null;
      if (e) {
        var i = e.get(t);
        return i && i._gridId === this._id ? i : null;
      }
      for (var s = 0; s < this._items.length; s++)
        if (this._items[s]._element === t) return this._items[s];
      return null;
    }),
    (ii.prototype.getItems = function (t) {
      if (this._isDestroyed || void 0 === t) return this._items.slice(0);
      var e,
        i,
        s = [];
      if (Array.isArray(t) || je(t))
        for (e = 0; e < t.length; e++) (i = this.getItem(t[e])) && s.push(i);
      else (i = this.getItem(t)) && s.push(i);
      return s;
    }),
    (ii.prototype.refreshItems = function (t, e) {
      if (this._isDestroyed) return this;
      var i,
        s,
        n,
        o,
        r = t || this._items;
      if (!0 === e)
        for (o = [], i = 0; i < r.length; i++)
          (s = r[i]).isVisible() ||
            s.isHiding() ||
            (((n = s.getElement().style).visibility = "hidden"),
            (n.display = ""),
            o.push(n));
      for (i = 0; i < r.length; i++) r[i]._refreshDimensions(e);
      if (!0 === e) {
        for (i = 0; i < o.length; i++)
          ((n = o[i]).visibility = ""), (n.display = "none");
        o.length = 0;
      }
      return this;
    }),
    (ii.prototype.refreshSortData = function (t) {
      if (this._isDestroyed) return this;
      for (var e = t || this._items, i = 0; i < e.length; i++)
        e[i]._refreshSortData();
      return this;
    }),
    (ii.prototype.synchronize = function () {
      if (this._isDestroyed) return this;
      var t,
        e,
        i = this._items;
      if (!i.length) return this;
      for (var s = 0; s < i.length; s++)
        (e = i[s]._element).parentNode === this._element &&
          (t = t || document.createDocumentFragment()).appendChild(e);
      return t
        ? (this._element.appendChild(t), this._emit("synchronize"), this)
        : this;
    }),
    (ii.prototype.layout = function (t, e) {
      if (this._isDestroyed) return this;
      var i = this._nextLayoutData;
      i && dt(i.cancel) && i.cancel();
      var s = (ei = (ei % 16777216) + 1);
      this._nextLayoutData = { id: s, instant: t, onFinish: e, cancel: null };
      for (var n = this._items, o = [], r = 0; r < n.length; r++)
        n[r]._isActive && o.push(n[r]);
      this._refreshDimensions();
      var h,
        a = this._width - this._borderLeft - this._borderRight,
        _ = this._height - this._borderTop - this._borderBottom,
        l = this._settings.layout;
      return (
        dt(l)
          ? (h = l(this, s, o, a, _, this._onLayoutDataReceived))
          : (ii.defaultPacker.setOptions(l),
            (h = ii.defaultPacker.createLayout(
              this,
              s,
              o,
              a,
              _,
              this._onLayoutDataReceived
            ))),
        dt(h) &&
          this._nextLayoutData &&
          this._nextLayoutData.id === s &&
          (this._nextLayoutData.cancel = h),
        this
      );
    }),
    (ii.prototype.add = function (t, e) {
      if (this._isDestroyed || !t) return [];
      var i,
        s = je((i = t))
          ? Array.prototype.slice.call(i)
          : Array.prototype.concat(i);
      if (!s.length) return s;
      var n,
        o,
        r,
        h,
        a = e || {},
        _ = a.layout ? a.layout : void 0 === a.layout,
        l = this._items,
        d = !1;
      for (h = 0; h < s.length; h++)
        (o = s[h]).parentNode !== this._element &&
          (n = n || document.createDocumentFragment()).appendChild(o);
      for (n && this._element.appendChild(n), h = 0; h < s.length; h++)
        (o = s[h]),
          (r = s[h] = new He(this, o, a.active))._isActive &&
            ((d = !0), (r._layout._skipNextAnimation = !0));
      for (h = 0; h < s.length; h++)
        (r = s[h])._refreshDimensions(), r._refreshSortData();
      return (
        Gt(l, s, a.index),
        this._hasListeners("add") && this._emit("add", s.slice(0)),
        d && _ && this.layout(_ === ti, dt(_) ? _ : void 0),
        s
      );
    }),
    (ii.prototype.remove = function (t, e) {
      if (this._isDestroyed || !t.length) return [];
      var i,
        s,
        n,
        o = e || {},
        r = o.layout ? o.layout : void 0 === o.layout,
        a = !1,
        _ = this.getItems(),
        l = [],
        d = [];
      for (n = 0; n < t.length; n++)
        (s = t[n])._isDestroyed ||
          (-1 !== (i = this._items.indexOf(s)) &&
            (s._isActive && (a = !0),
            l.push(s),
            d.push(_.indexOf(s)),
            s._destroy(o.removeElements),
            this._items.splice(i, 1)));
      return (
        this._hasListeners(h) && this._emit(h, l.slice(0), d),
        a && r && this.layout(r === ti, dt(r) ? r : void 0),
        l
      );
    }),
    (ii.prototype.show = function (t, e) {
      return (
        !this._isDestroyed && t.length && this._setItemsVisibility(t, !0, e),
        this
      );
    }),
    (ii.prototype.hide = function (t, e) {
      return (
        !this._isDestroyed && t.length && this._setItemsVisibility(t, !1, e),
        this
      );
    }),
    (ii.prototype.filter = function (t, e) {
      if (this._isDestroyed || !this._items.length) return this;
      var i,
        s,
        n = [],
        o = [],
        r = typeof t === Ke,
        h = dt(t),
        a = e || {},
        l = !0 === a.instant,
        d = a.syncWithLayout,
        u = a.layout ? a.layout : void 0 === a.layout,
        c = dt(a.onFinish) ? a.onFinish : null,
        f = -1,
        p = Ze;
      if (
        (c &&
          (p = function () {
            ++f && c(n.slice(0), o.slice(0));
          }),
        h || r)
      )
        for (s = 0; s < this._items.length; s++)
          (i = this._items[s]),
            (h ? t(i) : qt(i._element, t)) ? n.push(i) : o.push(i);
      return (
        n.length
          ? this.show(n, {
              instant: l,
              syncWithLayout: d,
              onFinish: p,
              layout: !1,
            })
          : p(),
        o.length
          ? this.hide(o, {
              instant: l,
              syncWithLayout: d,
              onFinish: p,
              layout: !1,
            })
          : p(),
        (n.length || o.length) &&
          (this._hasListeners(_) && this._emit(_, n.slice(0), o.slice(0)),
          u && this.layout(u === ti, dt(u) ? u : void 0)),
        this
      );
    }),
    (ii.prototype.sort = (function () {
      var t, e, i, s;
      function n(n, o) {
        for (var r, h, a, _, l = 0, d = 0; d < t.length; d++)
          if (
            ((r = t[d][0]),
            (h = t[d][1]),
            (a = (n._sortData ? n : n._refreshSortData())._sortData[r]),
            (_ = (o._sortData ? o : o._refreshSortData())._sortData[r]),
            (l =
              "desc" === h || (!h && e)
                ? _ < a
                  ? -1
                  : _ > a
                  ? 1
                  : 0
                : a < _
                ? -1
                : a > _
                ? 1
                : 0))
          )
            return l;
        return l || (s || (s = oi(i)), (l = e ? ri(s, o, n) : ri(s, n, o))), l;
      }
      function o(n, o) {
        var r = e ? -t(n, o) : t(n, o);
        return r || (s || (s = oi(i)), (r = e ? ri(s, o, n) : ri(s, n, o))), r;
      }
      return function (r, h) {
        if (this._isDestroyed || this._items.length < 2) return this;
        var a = this._items,
          _ = h || {},
          d = _.layout ? _.layout : void 0 === _.layout;
        if (((e = !!_.descending), (i = a.slice(0)), (s = null), dt(r)))
          (t = r), a.sort(o);
        else if (typeof r === Ke)
          (t = r
            .trim()
            .split(" ")
            .filter(function (t) {
              return t;
            })
            .map(function (t) {
              return t.split(":");
            })),
            a.sort(n);
        else {
          if (!Array.isArray(r))
            throw (
              ((t = e = i = s = null),
              new Error("Invalid comparer argument provided."))
            );
          (a.length = 0), a.push.apply(a, r);
        }
        return (
          this._hasListeners(l) && this._emit(l, a.slice(0), i),
          d && this.layout(d === ti, dt(d) ? d : void 0),
          (t = e = i = s = null),
          this
        );
      };
    })()),
    (ii.prototype.move = function (t, e, n) {
      if (this._isDestroyed || this._items.length < 2) return this;
      var o,
        r,
        h = this._items,
        a = n || {},
        _ = a.layout ? a.layout : void 0 === a.layout,
        l = a.action === i,
        u = l ? i : s,
        c = this.getItem(t),
        f = this.getItem(e);
      return (
        c &&
          f &&
          c !== f &&
          ((o = h.indexOf(c)),
          (r = h.indexOf(f)),
          l ? Nt(h, o, r) : Bt(h, o, r),
          this._hasListeners(d) &&
            this._emit(d, { item: c, fromIndex: o, toIndex: r, action: u }),
          _ && this.layout(_ === ti, dt(_) ? _ : void 0)),
        this
      );
    }),
    (ii.prototype.send = function (t, e, i, s) {
      if (this._isDestroyed || e._isDestroyed || this === e) return this;
      if (!(t = this.getItem(t))) return this;
      var n = s || {},
        o = n.appendTo || document.body,
        r = n.layoutSender ? n.layoutSender : void 0 === n.layoutSender,
        h = n.layoutReceiver ? n.layoutReceiver : void 0 === n.layoutReceiver;
      return (
        t._migrate.start(e, i, o),
        t._migrate._isActive &&
          t._isActive &&
          (r && this.layout(r === ti, dt(r) ? r : void 0),
          h && e.layout(h === ti, dt(h) ? h : void 0)),
        this
      );
    }),
    (ii.prototype.destroy = function (e) {
      if (this._isDestroyed) return this;
      var i,
        s,
        n,
        o = this._element,
        r = this._items.slice(0),
        h = (this._layout && this._layout.styles) || {};
      for (
        (n = this)._resizeHandler &&
          (n._resizeHandler(!0),
          window.removeEventListener("resize", n._resizeHandler),
          (n._resizeHandler = null)),
          i = 0;
        i < r.length;
        i++
      )
        r[i]._destroy(e);
      for (s in ((this._items.length = 0),
      ue(o, this._settings.containerClass),
      h))
        o.style[s] = "";
      return (
        this._emit("destroy"),
        this._emitter.destroy(),
        delete t[this._id],
        (this._isDestroyed = !0),
        this
      );
    }),
    (ii.prototype._emit = function () {
      this._isDestroyed || this._emitter.emit.apply(this._emitter, arguments);
    }),
    (ii.prototype._hasListeners = function (t) {
      return !this._isDestroyed && this._emitter.countListeners(t) > 0;
    }),
    (ii.prototype._updateBoundingRect = function () {
      var t = this._element.getBoundingClientRect();
      (this._width = t.width),
        (this._height = t.height),
        (this._left = t.left),
        (this._top = t.top),
        (this._right = t.right),
        (this._bottom = t.bottom);
    }),
    (ii.prototype._updateBorders = function (t, e, i, s) {
      var n = this._element;
      t && (this._borderLeft = ft(n, "border-left-width")),
        e && (this._borderRight = ft(n, "border-right-width")),
        i && (this._borderTop = ft(n, "border-top-width")),
        s && (this._borderBottom = ft(n, "border-bottom-width"));
    }),
    (ii.prototype._refreshDimensions = function () {
      this._updateBoundingRect(),
        this._updateBorders(1, 1, 1, 1),
        (this._boxSizing = ct(this._element, "box-sizing"));
    }),
    (ii.prototype._onLayoutDataReceived =
      ((Je = []),
      function (t) {
        if (
          !this._isDestroyed &&
          this._nextLayoutData &&
          this._nextLayoutData.id === t.id
        ) {
          var e,
            i,
            s,
            h,
            a = this,
            _ = this._nextLayoutData.instant,
            l = this._nextLayoutData.onFinish,
            d = t.items.length,
            u = d;
          for (
            this._nextLayoutData = null,
              !this._isLayoutFinished &&
                this._hasListeners(r) &&
                this._emit(r, this._layout.items.slice(0)),
              this._layout = t,
              Je.length = 0,
              h = 0;
            h < d;
            h++
          )
            (e = t.items[h])
              ? ((i = t.slots[2 * h]),
                (s = t.slots[2 * h + 1]),
                e._canSkipLayout(i, s)
                  ? --u
                  : ((e._left = i),
                    (e._top = s),
                    e.isActive() && !e.isDragging() ? Je.push(e) : --u))
              : --u;
          if (
            (t.styles && Ae(this._element, t.styles),
            !this._hasListeners(n) ||
              (this._emit(n, t.items.slice(0), !0 === _),
              this._layout.id === t.id))
          ) {
            var c = function () {
              if (!(--u > 0)) {
                var e = a._layout.id !== t.id,
                  i = dt(_) ? _ : l;
                e || (a._isLayoutFinished = !0),
                  dt(i) && i(t.items.slice(0), e),
                  !e && a._hasListeners(o) && a._emit(o, t.items.slice(0));
              }
            };
            if (!Je.length) return c(), this;
            for (
              this._isLayoutFinished = !1, h = 0;
              h < Je.length && this._layout.id === t.id;
              h++
            )
              Je[h]._layout.start(!0 === _, c);
            return this._layout.id === t.id && (Je.length = 0), this;
          }
        }
      })),
    (ii.prototype._setItemsVisibility = function (t, e, i) {
      var s,
        o,
        r = this,
        h = t.slice(0),
        _ = i || {},
        l = !0 === _.instant,
        d = _.onFinish,
        u = _.layout ? _.layout : void 0 === _.layout,
        c = h.length,
        f = e ? "showStart" : a,
        p = e ? "showEnd" : "hideEnd",
        m = e ? "show" : "hide",
        g = !1,
        v = [],
        y = [];
      if (c) {
        for (o = 0; o < h.length; o++)
          (s = h[o]),
            ((e && !s._isActive) || (!e && s._isActive)) && (g = !0),
            (s._layout._skipNextAnimation = !(!e || s._isActive)),
            e && s._visibility._isHidden && y.push(s),
            e ? s._addToLayout() : s._removeFromLayout();
        y.length && (this.refreshItems(y, !0), (y.length = 0)),
          g && !1 !== _.syncWithLayout ? this.on(n, S) : S(),
          g && u && this.layout(u === ti, dt(u) ? u : void 0);
      } else dt(d) && d(h);
      function S() {
        for (
          g && !1 !== _.syncWithLayout && r.off(n, S),
            r._hasListeners(f) && r._emit(f, h.slice(0)),
            o = 0;
          o < h.length;
          o++
        )
          h[o]._gridId === r._id
            ? h[o]._visibility[m](l, function (t, e) {
                t || v.push(e),
                  --c < 1 &&
                    (dt(d) && d(v.slice(0)),
                    r._hasListeners(p) && r._emit(p, v.slice(0)));
              })
            : --c < 1 &&
              (dt(d) && d(v.slice(0)),
              r._hasListeners(p) && r._emit(p, v.slice(0)));
      }
    }),
    ii
  );
});
