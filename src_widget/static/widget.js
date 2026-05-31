var Va = Object.defineProperty;
var ja = (t, e, n) => e in t ? Va(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var Tt = (t, e, n) => ja(t, typeof e != "symbol" ? e + "" : e, n);
class Ga {
  constructor() {
    Tt(this, "handlers", /* @__PURE__ */ new Map());
  }
  on(e, n) {
    let r = this.handlers.get(e);
    return r || (r = /* @__PURE__ */ new Set(), this.handlers.set(e, r)), r.add(n), () => this.off(e, n);
  }
  once(e, n) {
    const r = (s) => {
      this.off(e, r), n(s);
    };
    return this.on(e, r);
  }
  off(e, n) {
    const r = this.handlers.get(e);
    r && (r.delete(n), r.size === 0 && this.handlers.delete(e));
  }
  emit(e, n) {
    const r = this.handlers.get(e);
    if (r)
      for (const s of [...r])
        s(n);
  }
  clear() {
    this.handlers.clear();
  }
}
const As = new Ga();
class Ha {
  constructor(e) {
    Tt(this, "stream", null);
    Tt(this, "currentDeviceId", null);
    this.video = e;
  }
  get isActive() {
    return this.stream !== null;
  }
  get activeDeviceId() {
    return this.currentDeviceId;
  }
  /**
   * Enumerate available video input devices. Labels are only populated
   * after permission has been granted at least once.
   */
  async listDevices() {
    return (await navigator.mediaDevices.enumerateDevices()).filter((n) => n.kind === "videoinput").map((n, r) => ({
      deviceId: n.deviceId,
      label: n.label || `Camera ${r + 1}`
    }));
  }
  /** Start (or restart) the stream, optionally on a specific device. */
  async start(e) {
    await this.stop();
    const n = {
      width: { ideal: 1280 },
      height: { ideal: 720 },
      frameRate: { ideal: 30 }
    };
    e ? n.deviceId = { exact: e } : n.facingMode = "user";
    const r = { video: n, audio: !1 };
    this.stream = await navigator.mediaDevices.getUserMedia(r), this.video.srcObject = this.stream;
    const s = this.stream.getVideoTracks()[0];
    this.currentDeviceId = (s == null ? void 0 : s.getSettings().deviceId) ?? e ?? null, await this.waitForVideoReady(), await this.video.play(), As.emit("cameraStarted", {
      deviceId: this.currentDeviceId ?? ""
    });
  }
  async stop() {
    if (this.stream) {
      for (const e of this.stream.getTracks())
        e.stop();
      this.stream = null, this.currentDeviceId = null, this.video.srcObject = null, As.emit("cameraStopped", void 0);
    }
  }
  setMirror(e) {
    this.video.style.transform = e ? "scaleX(-1)" : "none";
  }
  waitForVideoReady() {
    return new Promise((e) => {
      if (this.video.readyState >= 2 && this.video.videoWidth > 0) {
        e();
        return;
      }
      const n = () => {
        this.video.removeEventListener("loadeddata", n), e();
      };
      this.video.addEventListener("loadeddata", n);
    });
  }
}
var ve = typeof self < "u" ? self : {};
function Fi(t, e) {
  t: {
    for (var n = ["CLOSURE_FLAGS"], r = ve, s = 0; s < n.length; s++) if ((r = r[n[s]]) == null) {
      n = null;
      break t;
    }
    n = r;
  }
  return (t = n && n[t]) != null ? t : e;
}
function Jt() {
  throw Error("Invalid UTF8");
}
function Es(t, e) {
  return e = String.fromCharCode.apply(null, e), t == null ? e : t + e;
}
let un, $n;
const za = typeof TextDecoder < "u";
let Wa;
const Ka = typeof TextEncoder < "u";
function Pi(t) {
  if (Ka) t = (Wa || (Wa = new TextEncoder())).encode(t);
  else {
    let n = 0;
    const r = new Uint8Array(3 * t.length);
    for (let s = 0; s < t.length; s++) {
      var e = t.charCodeAt(s);
      if (e < 128) r[n++] = e;
      else {
        if (e < 2048) r[n++] = e >> 6 | 192;
        else {
          if (e >= 55296 && e <= 57343) {
            if (e <= 56319 && s < t.length) {
              const i = t.charCodeAt(++s);
              if (i >= 56320 && i <= 57343) {
                e = 1024 * (e - 55296) + i - 56320 + 65536, r[n++] = e >> 18 | 240, r[n++] = e >> 12 & 63 | 128, r[n++] = e >> 6 & 63 | 128, r[n++] = 63 & e | 128;
                continue;
              }
              s--;
            }
            e = 65533;
          }
          r[n++] = e >> 12 | 224, r[n++] = e >> 6 & 63 | 128;
        }
        r[n++] = 63 & e | 128;
      }
    }
    t = n === r.length ? r : r.subarray(0, n);
  }
  return t;
}
function Oi(t) {
  ve.setTimeout((() => {
    throw t;
  }), 0);
}
var ir, qa = Fi(610401301, !1), ks = Fi(748402147, !0);
function Ss() {
  var t = ve.navigator;
  return t && (t = t.userAgent) ? t : "";
}
const Ts = ve.navigator;
function Sn(t) {
  return Sn[" "](t), t;
}
ir = Ts && Ts.userAgentData || null, Sn[" "] = function() {
};
const Ii = {};
let ze = null;
function $a(t) {
  const e = t.length;
  let n = 3 * e / 4;
  n % 3 ? n = Math.floor(n) : "=.".indexOf(t[e - 1]) != -1 && (n = "=.".indexOf(t[e - 2]) != -1 ? n - 2 : n - 1);
  const r = new Uint8Array(n);
  let s = 0;
  return (function(i, o) {
    function a(u) {
      for (; c < i.length; ) {
        const h = i.charAt(c++), l = ze[h];
        if (l != null) return l;
        if (!/^[\s\xa0]*$/.test(h)) throw Error("Unknown base64 encoding at char: " + h);
      }
      return u;
    }
    Ci();
    let c = 0;
    for (; ; ) {
      const u = a(-1), h = a(0), l = a(64), _ = a(64);
      if (_ === 64 && u === -1) break;
      o(u << 2 | h >> 4), l != 64 && (o(h << 4 & 240 | l >> 2), _ != 64 && o(l << 6 & 192 | _));
    }
  })(t, (function(i) {
    r[s++] = i;
  })), s !== n ? r.subarray(0, s) : r;
}
function Ci() {
  if (!ze) {
    ze = {};
    var t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split(""), e = ["+/=", "+/", "-_=", "-_.", "-_"];
    for (let n = 0; n < 5; n++) {
      const r = t.concat(e[n].split(""));
      Ii[n] = r;
      for (let s = 0; s < r.length; s++) {
        const i = r[s];
        ze[i] === void 0 && (ze[i] = s);
      }
    }
  }
}
var Xa = typeof Uint8Array < "u", Ni = !(!(qa && ir && ir.brands.length > 0) && (Ss().indexOf("Trident") != -1 || Ss().indexOf("MSIE") != -1)) && typeof btoa == "function";
const Ls = /[-_.]/g, Ya = { "-": "+", _: "/", ".": "=" };
function Ja(t) {
  return Ya[t] || "";
}
function Ri(t) {
  if (!Ni) return $a(t);
  t = Ls.test(t) ? t.replace(Ls, Ja) : t, t = atob(t);
  const e = new Uint8Array(t.length);
  for (let n = 0; n < t.length; n++) e[n] = t.charCodeAt(n);
  return e;
}
function Er(t) {
  return Xa && t != null && t instanceof Uint8Array;
}
var we = {};
function oe() {
  return Za || (Za = new Ft(null, we));
}
function kr(t) {
  Bi(we);
  var e = t.g;
  return (e = e == null || Er(e) ? e : typeof e == "string" ? Ri(e) : null) == null ? e : t.g = e;
}
var Ft = class {
  h() {
    return new Uint8Array(kr(this) || 0);
  }
  constructor(t, e) {
    if (Bi(e), this.g = t, t != null && t.length === 0) throw Error("ByteString should be constructed with non-empty values");
  }
};
let Za, Qa;
function Bi(t) {
  if (t !== we) throw Error("illegal external caller");
}
function Di(t, e) {
  t.__closure__error__context__984382 || (t.__closure__error__context__984382 = {}), t.__closure__error__context__984382.severity = e;
}
function or(t) {
  return Di(t = Error(t), "warning"), t;
}
function be(t, e) {
  if (t != null) {
    var n = Qa ?? (Qa = {}), r = n[t] || 0;
    r >= e || (n[t] = r + 1, Di(t = Error(), "incident"), Oi(t));
  }
}
function Fe() {
  return typeof BigInt == "function";
}
var Pe = typeof Symbol == "function" && typeof Symbol() == "symbol";
function Ot(t, e, n = !1) {
  return typeof Symbol == "function" && typeof Symbol() == "symbol" ? n && Symbol.for && t ? Symbol.for(t) : t != null ? Symbol(t) : Symbol() : e;
}
var t2 = Ot("jas", void 0, !0), xs = Ot(void 0, "0di"), He = Ot(void 0, "1oa"), ot = Ot(void 0, Symbol()), e2 = Ot(void 0, "0ub"), n2 = Ot(void 0, "0ubs"), ar = Ot(void 0, "0ubsb"), r2 = Ot(void 0, "0actk"), Ae = Ot("m_m", "Pa", !0), Ms = Ot();
const Ui = { Ga: { value: 0, configurable: !0, writable: !0, enumerable: !1 } }, Vi = Object.defineProperties, d = Pe ? t2 : "Ga";
var he;
const Fs = [];
function Qe(t, e) {
  Pe || d in t || Vi(t, Ui), t[d] |= e;
}
function W(t, e) {
  Pe || d in t || Vi(t, Ui), t[d] = e;
}
function tn(t) {
  return Qe(t, 34), t;
}
function Xe(t) {
  return Qe(t, 8192), t;
}
W(Fs, 7), he = Object.freeze(Fs);
var Ee = {};
function ct(t, e) {
  return e === void 0 ? t.h !== ae && !!(2 & (0 | t.v[d])) : !!(2 & e) && t.h !== ae;
}
const ae = {};
function Sr(t, e) {
  if (t != null) {
    if (typeof t == "string") t = t ? new Ft(t, we) : oe();
    else if (t.constructor !== Ft) if (Er(t)) t = t.length ? new Ft(new Uint8Array(t), we) : oe();
    else {
      if (!e) throw Error();
      t = void 0;
    }
  }
  return t;
}
class Ps {
  constructor(e, n, r) {
    this.g = e, this.h = n, this.l = r;
  }
  next() {
    const e = this.g.next();
    return e.done || (e.value = this.h.call(this.l, e.value)), e;
  }
  [Symbol.iterator]() {
    return this;
  }
}
var s2 = Object.freeze({});
function ji(t, e, n) {
  const r = 128 & e ? 0 : -1, s = t.length;
  var i;
  (i = !!s) && (i = (i = t[s - 1]) != null && typeof i == "object" && i.constructor === Object);
  const o = s + (i ? -1 : 0);
  for (e = 128 & e ? 1 : 0; e < o; e++) n(e - r, t[e]);
  if (i) {
    t = t[s - 1];
    for (const a in t) !isNaN(a) && n(+a, t[a]);
  }
}
var Gi = {};
function Oe(t) {
  return 128 & t ? Gi : void 0;
}
function Tn(t) {
  return t.Na = !0, t;
}
var i2 = Tn(((t) => typeof t == "number")), Os = Tn(((t) => typeof t == "string")), o2 = Tn(((t) => typeof t == "boolean")), Ln = typeof ve.BigInt == "function" && typeof ve.BigInt(0) == "bigint";
function at(t) {
  var e = t;
  if (Os(e)) {
    if (!/^\s*(?:-?[1-9]\d*|0)?\s*$/.test(e)) throw Error(String(e));
  } else if (i2(e) && !Number.isSafeInteger(e)) throw Error(String(e));
  return Ln ? BigInt(t) : t = o2(t) ? t ? "1" : "0" : Os(t) ? t.trim() || "0" : String(t);
}
var cr = Tn(((t) => Ln ? t >= c2 && t <= u2 : t[0] === "-" ? Is(t, a2) : Is(t, h2)));
const a2 = Number.MIN_SAFE_INTEGER.toString(), c2 = Ln ? BigInt(Number.MIN_SAFE_INTEGER) : void 0, h2 = Number.MAX_SAFE_INTEGER.toString(), u2 = Ln ? BigInt(Number.MAX_SAFE_INTEGER) : void 0;
function Is(t, e) {
  if (t.length > e.length) return !1;
  if (t.length < e.length || t === e) return !0;
  for (let n = 0; n < t.length; n++) {
    const r = t[n], s = e[n];
    if (r > s) return !1;
    if (r < s) return !0;
  }
}
const l2 = typeof Uint8Array.prototype.slice == "function";
let f2, F = 0, U = 0;
function Cs(t) {
  const e = t >>> 0;
  F = e, U = (t - e) / 4294967296 >>> 0;
}
function ke(t) {
  if (t < 0) {
    Cs(-t);
    const [e, n] = xr(F, U);
    F = e >>> 0, U = n >>> 0;
  } else Cs(t);
}
function Tr(t) {
  const e = f2 || (f2 = new DataView(new ArrayBuffer(8)));
  e.setFloat32(0, +t, !0), U = 0, F = e.getUint32(0, !0);
}
function Hi(t, e) {
  const n = 4294967296 * e + (t >>> 0);
  return Number.isSafeInteger(n) ? n : Ye(t, e);
}
function d2(t, e) {
  return at(Fe() ? BigInt.asUintN(64, (BigInt(e >>> 0) << BigInt(32)) + BigInt(t >>> 0)) : Ye(t, e));
}
function zi(t, e) {
  return Fe() ? at(BigInt.asIntN(64, (BigInt.asUintN(32, BigInt(e)) << BigInt(32)) + BigInt.asUintN(32, BigInt(t)))) : at(Lr(t, e));
}
function Ye(t, e) {
  if (t >>>= 0, (e >>>= 0) <= 2097151) var n = "" + (4294967296 * e + t);
  else Fe() ? n = "" + (BigInt(e) << BigInt(32) | BigInt(t)) : (t = (16777215 & t) + 6777216 * (n = 16777215 & (t >>> 24 | e << 8)) + 6710656 * (e = e >> 16 & 65535), n += 8147497 * e, e *= 2, t >= 1e7 && (n += t / 1e7 >>> 0, t %= 1e7), n >= 1e7 && (e += n / 1e7 >>> 0, n %= 1e7), n = e + Ns(n) + Ns(t));
  return n;
}
function Ns(t) {
  return t = String(t), "0000000".slice(t.length) + t;
}
function Lr(t, e) {
  if (2147483648 & e) if (Fe()) t = "" + (BigInt(0 | e) << BigInt(32) | BigInt(t >>> 0));
  else {
    const [n, r] = xr(t, e);
    t = "-" + Ye(n, r);
  }
  else t = Ye(t, e);
  return t;
}
function xn(t) {
  if (t.length < 16) ke(Number(t));
  else if (Fe()) t = BigInt(t), F = Number(t & BigInt(4294967295)) >>> 0, U = Number(t >> BigInt(32) & BigInt(4294967295));
  else {
    const e = +(t[0] === "-");
    U = F = 0;
    const n = t.length;
    for (let r = e, s = (n - e) % 6 + e; s <= n; r = s, s += 6) {
      const i = Number(t.slice(r, s));
      U *= 1e6, F = 1e6 * F + i, F >= 4294967296 && (U += Math.trunc(F / 4294967296), U >>>= 0, F >>>= 0);
    }
    if (e) {
      const [r, s] = xr(F, U);
      F = r, U = s;
    }
  }
}
function xr(t, e) {
  return e = ~e, t ? t = 1 + ~t : e += 1, [t, e];
}
function wt(t) {
  return Array.prototype.slice.call(t);
}
const en = typeof BigInt == "function" ? BigInt.asIntN : void 0, p2 = typeof BigInt == "function" ? BigInt.asUintN : void 0, ce = Number.isSafeInteger, Mn = Number.isFinite, Se = Math.trunc, g2 = at(0);
function We(t) {
  if (t != null && typeof t != "number") throw Error(`Value of float/double field must be a number, found ${typeof t}: ${t}`);
  return t;
}
function Mt(t) {
  return t == null || typeof t == "number" ? t : t === "NaN" || t === "Infinity" || t === "-Infinity" ? Number(t) : void 0;
}
function Je(t) {
  if (t != null && typeof t != "boolean") {
    var e = typeof t;
    throw Error(`Expected boolean but got ${e != "object" ? e : t ? Array.isArray(t) ? "array" : e : "null"}: ${t}`);
  }
  return t;
}
function Wi(t) {
  return t == null || typeof t == "boolean" ? t : typeof t == "number" ? !!t : void 0;
}
const m2 = /^-?([1-9][0-9]*|0)(\.[0-9]+)?$/;
function nn(t) {
  switch (typeof t) {
    case "bigint":
      return !0;
    case "number":
      return Mn(t);
    case "string":
      return m2.test(t);
    default:
      return !1;
  }
}
function Ie(t) {
  if (t == null) return t;
  if (typeof t == "string" && t) t = +t;
  else if (typeof t != "number") return;
  return Mn(t) ? 0 | t : void 0;
}
function Ki(t) {
  if (t == null) return t;
  if (typeof t == "string" && t) t = +t;
  else if (typeof t != "number") return;
  return Mn(t) ? t >>> 0 : void 0;
}
function qi(t) {
  const e = t.length;
  return (t[0] === "-" ? e < 20 || e === 20 && t <= "-9223372036854775808" : e < 19 || e === 19 && t <= "9223372036854775807") ? t : (xn(t), Lr(F, U));
}
function Mr(t) {
  if (t = Se(t), !ce(t)) {
    ke(t);
    var e = F, n = U;
    (t = 2147483648 & n) && (n = ~n >>> 0, (e = 1 + ~e >>> 0) == 0 && (n = n + 1 >>> 0)), t = typeof (e = Hi(e, n)) == "number" ? t ? -e : e : t ? "-" + e : e;
  }
  return t;
}
function $i(t) {
  var e = Se(Number(t));
  return ce(e) ? String(e) : ((e = t.indexOf(".")) !== -1 && (t = t.substring(0, e)), qi(t));
}
function Xi(t) {
  var e = Se(Number(t));
  return ce(e) ? at(e) : ((e = t.indexOf(".")) !== -1 && (t = t.substring(0, e)), Fe() ? at(en(64, BigInt(t))) : at(qi(t)));
}
function Yi(t) {
  return ce(t) ? t = at(Mr(t)) : (t = Se(t), ce(t) ? t = String(t) : (ke(t), t = Lr(F, U)), t = at(t)), t;
}
function _n(t) {
  const e = typeof t;
  return t == null ? t : e === "bigint" ? at(en(64, t)) : nn(t) ? e === "string" ? Xi(t) : Yi(t) : void 0;
}
function Ji(t) {
  if (typeof t != "string") throw Error();
  return t;
}
function rn(t) {
  if (t != null && typeof t != "string") throw Error();
  return t;
}
function X(t) {
  return t == null || typeof t == "string" ? t : void 0;
}
function Fr(t, e, n, r) {
  return t != null && t[Ae] === Ee ? t : Array.isArray(t) ? ((r = (n = 0 | t[d]) | 32 & r | 2 & r) !== n && W(t, r), new e(t)) : (n ? 2 & r ? ((t = e[xs]) || (tn((t = new e()).v), t = e[xs] = t), e = t) : e = new e() : e = void 0, e);
}
function y2(t, e, n) {
  if (e) t: {
    if (!nn(e = t)) throw or("int64");
    switch (typeof e) {
      case "string":
        e = Xi(e);
        break t;
      case "bigint":
        e = at(en(64, e));
        break t;
      default:
        e = Yi(e);
    }
  }
  else e = _n(t);
  return (t = e) == null ? n ? g2 : void 0 : t;
}
const _2 = {};
let v2 = (function() {
  try {
    return Sn(new class extends Map {
      constructor() {
        super();
      }
    }()), !1;
  } catch {
    return !0;
  }
})();
class Xn {
  constructor() {
    this.g = /* @__PURE__ */ new Map();
  }
  get(e) {
    return this.g.get(e);
  }
  set(e, n) {
    return this.g.set(e, n), this.size = this.g.size, this;
  }
  delete(e) {
    return e = this.g.delete(e), this.size = this.g.size, e;
  }
  clear() {
    this.g.clear(), this.size = this.g.size;
  }
  has(e) {
    return this.g.has(e);
  }
  entries() {
    return this.g.entries();
  }
  keys() {
    return this.g.keys();
  }
  values() {
    return this.g.values();
  }
  forEach(e, n) {
    return this.g.forEach(e, n);
  }
  [Symbol.iterator]() {
    return this.entries();
  }
}
const w2 = v2 ? (Object.setPrototypeOf(Xn.prototype, Map.prototype), Object.defineProperties(Xn.prototype, { size: { value: 0, configurable: !0, enumerable: !0, writable: !0 } }), Xn) : class extends Map {
  constructor() {
    super();
  }
};
function Rs(t) {
  return t;
}
function Yn(t) {
  if (2 & t.J) throw Error("Cannot mutate an immutable Map");
}
var Dt = class extends w2 {
  constructor(t, e, n = Rs, r = Rs) {
    super(), this.J = 0 | t[d], this.K = e, this.S = n, this.fa = this.K ? b2 : r;
    for (let s = 0; s < t.length; s++) {
      const i = t[s], o = n(i[0], !1, !0);
      let a = i[1];
      e ? a === void 0 && (a = null) : a = r(i[1], !1, !0, void 0, void 0, this.J), super.set(o, a);
    }
  }
  V(t) {
    return Xe(Array.from(super.entries(), t));
  }
  clear() {
    Yn(this), super.clear();
  }
  delete(t) {
    return Yn(this), super.delete(this.S(t, !0, !1));
  }
  entries() {
    if (this.K) {
      var t = super.keys();
      t = new Ps(t, A2, this);
    } else t = super.entries();
    return t;
  }
  values() {
    if (this.K) {
      var t = super.keys();
      t = new Ps(t, Dt.prototype.get, this);
    } else t = super.values();
    return t;
  }
  forEach(t, e) {
    this.K ? super.forEach(((n, r, s) => {
      t.call(e, s.get(r), r, s);
    })) : super.forEach(t, e);
  }
  set(t, e) {
    return Yn(this), (t = this.S(t, !0, !1)) == null ? this : e == null ? (super.delete(t), this) : super.set(t, this.fa(e, !0, !0, this.K, !1, this.J));
  }
  Ma(t) {
    const e = this.S(t[0], !1, !0);
    t = t[1], t = this.K ? t === void 0 ? null : t : this.fa(t, !1, !0, void 0, !1, this.J), super.set(e, t);
  }
  has(t) {
    return super.has(this.S(t, !1, !1));
  }
  get(t) {
    t = this.S(t, !1, !1);
    const e = super.get(t);
    if (e !== void 0) {
      var n = this.K;
      return n ? ((n = this.fa(e, !1, !0, n, this.ra, this.J)) !== e && super.set(t, n), n) : e;
    }
  }
  [Symbol.iterator]() {
    return this.entries();
  }
};
function b2(t, e, n, r, s, i) {
  return t = Fr(t, r, n, i), s && (t = Or(t)), t;
}
function A2(t) {
  return [t, this.get(t)];
}
let E2;
function Bs() {
  return E2 || (E2 = new Dt(tn([]), void 0, void 0, void 0, _2));
}
function Fn(t) {
  return ot ? t[ot] : void 0;
}
function vn(t, e) {
  for (const n in t) !isNaN(n) && e(t, +n, t[n]);
}
Dt.prototype.toJSON = void 0;
var hr = class {
};
const k2 = { Ka: !0 };
function S2(t, e) {
  e < 100 || be(n2, 1);
}
function Pn(t, e, n, r) {
  const s = r !== void 0;
  r = !!r;
  var i, o = ot;
  !s && Pe && o && (i = t[o]) && vn(i, S2), o = [];
  var a = t.length;
  let c;
  i = 4294967295;
  let u = !1;
  const h = !!(64 & e), l = h ? 128 & e ? 0 : -1 : void 0;
  1 & e || (c = a && t[a - 1], c != null && typeof c == "object" && c.constructor === Object ? i = --a : c = void 0, !h || 128 & e || s || (u = !0, i = i - l + l)), e = void 0;
  for (var _ = 0; _ < a; _++) {
    let w = t[_];
    if (w != null && (w = n(w, r)) != null) if (h && _ >= i) {
      const B = _ - l;
      (e ?? (e = {}))[B] = w;
    } else o[_] = w;
  }
  if (c) for (let w in c) {
    if ((a = c[w]) == null || (a = n(a, r)) == null) continue;
    let B;
    _ = +w, h && !Number.isNaN(_) && (B = _ + l) < i ? o[B] = a : (e ?? (e = {}))[w] = a;
  }
  return e && (u ? o.push(e) : o[i] = e), s && ot && (t = Fn(t)) && t instanceof hr && (o[ot] = (function(w) {
    const B = new hr();
    return vn(w, ((kt, St, Yt) => {
      B[St] = wt(Yt);
    })), B.da = w.da, B;
  })(t)), o;
}
function T2(t) {
  return t[0] = Ze(t[0]), t[1] = Ze(t[1]), t;
}
function Ze(t) {
  switch (typeof t) {
    case "number":
      return Number.isFinite(t) ? t : "" + t;
    case "bigint":
      return cr(t) ? Number(t) : "" + t;
    case "boolean":
      return t ? 1 : 0;
    case "object":
      if (Array.isArray(t)) {
        var e = 0 | t[d];
        return t.length === 0 && 1 & e ? void 0 : Pn(t, e, Ze);
      }
      if (t != null && t[Ae] === Ee) return Zi(t);
      if (t instanceof Ft) {
        if ((e = t.g) == null) t = "";
        else if (typeof e == "string") t = e;
        else {
          if (Ni) {
            for (var n = "", r = 0, s = e.length - 10240; r < s; ) n += String.fromCharCode.apply(null, e.subarray(r, r += 10240));
            n += String.fromCharCode.apply(null, r ? e.subarray(r) : e), e = btoa(n);
          } else {
            n === void 0 && (n = 0), Ci(), n = Ii[n], r = Array(Math.floor(e.length / 3)), s = n[64] || "";
            let u = 0, h = 0;
            for (; u < e.length - 2; u += 3) {
              var i = e[u], o = e[u + 1], a = e[u + 2], c = n[i >> 2];
              i = n[(3 & i) << 4 | o >> 4], o = n[(15 & o) << 2 | a >> 6], a = n[63 & a], r[h++] = c + i + o + a;
            }
            switch (c = 0, a = s, e.length - u) {
              case 2:
                a = n[(15 & (c = e[u + 1])) << 2] || s;
              case 1:
                e = e[u], r[h] = n[e >> 2] + n[(3 & e) << 4 | c >> 4] + a + s;
            }
            e = r.join("");
          }
          t = t.g = e;
        }
        return t;
      }
      return t instanceof Dt ? t = t.size !== 0 ? t.V(T2) : void 0 : void 0;
  }
  return t;
}
let L2, x2;
function Zi(t) {
  return Pn(t = t.v, 0 | t[d], Ze);
}
function ee(t, e) {
  return Qi(t, e[0], e[1]);
}
function Qi(t, e, n, r = 0) {
  if (t == null) {
    var s = 32;
    n ? (t = [n], s |= 128) : t = [], e && (s = -16760833 & s | (1023 & e) << 14);
  } else {
    if (!Array.isArray(t)) throw Error("narr");
    if (s = 0 | t[d], ks && 1 & s) throw Error("rfarr");
    if (2048 & s && !(2 & s) && (function() {
      if (ks) throw Error("carr");
      be(r2, 5);
    })(), 256 & s) throw Error("farr");
    if (64 & s) return (s | r) !== s && W(t, s | r), t;
    if (n && (s |= 128, n !== t[0])) throw Error("mid");
    t: {
      s |= 64;
      var i = (n = t).length;
      if (i) {
        var o = i - 1;
        const c = n[o];
        if (c != null && typeof c == "object" && c.constructor === Object) {
          if ((o -= e = 128 & s ? 0 : -1) >= 1024) throw Error("pvtlmt");
          for (var a in c) (i = +a) < o && (n[i + e] = c[a], delete c[a]);
          s = -16760833 & s | (1023 & o) << 14;
          break t;
        }
      }
      if (e) {
        if ((a = Math.max(e, i - (128 & s ? 0 : -1))) > 1024) throw Error("spvt");
        s = -16760833 & s | (1023 & a) << 14;
      }
    }
  }
  return W(t, 64 | s | r), t;
}
function M2(t, e) {
  if (typeof t != "object") return t;
  if (Array.isArray(t)) {
    var n = 0 | t[d];
    return t.length === 0 && 1 & n ? void 0 : Ds(t, n, e);
  }
  if (t != null && t[Ae] === Ee) return Us(t);
  if (t instanceof Dt) {
    if (2 & (e = t.J)) return t;
    if (!t.size) return;
    if (n = tn(t.V()), t.K) for (t = 0; t < n.length; t++) {
      const r = n[t];
      let s = r[1];
      s = s == null || typeof s != "object" ? void 0 : s != null && s[Ae] === Ee ? Us(s) : Array.isArray(s) ? Ds(s, 0 | s[d], !!(32 & e)) : void 0, r[1] = s;
    }
    return n;
  }
  return t instanceof Ft ? t : void 0;
}
function Ds(t, e, n) {
  return 2 & e || (!n || 4096 & e || 16 & e ? t = Ce(t, e, !1, n && !(16 & e)) : (Qe(t, 34), 4 & e && Object.freeze(t))), t;
}
function Pr(t, e, n) {
  return t = new t.constructor(e), n && (t.h = ae), t.m = ae, t;
}
function Us(t) {
  const e = t.v, n = 0 | e[d];
  return ct(t, n) ? t : Ir(t, e, n) ? Pr(t, e) : Ce(e, n);
}
function Ce(t, e, n, r) {
  return r ?? (r = !!(34 & e)), t = Pn(t, e, M2, r), r = 32, n && (r |= 2), W(t, e = 16769217 & e | r), t;
}
function Or(t) {
  const e = t.v, n = 0 | e[d];
  return ct(t, n) ? Ir(t, e, n) ? Pr(t, e, !0) : new t.constructor(Ce(e, n, !1)) : t;
}
function Ne(t) {
  if (t.h !== ae) return !1;
  var e = t.v;
  return Qe(e = Ce(e, 0 | e[d]), 2048), t.v = e, t.h = void 0, t.m = void 0, !0;
}
function Re(t) {
  if (!Ne(t) && ct(t, 0 | t.v[d])) throw Error();
}
function ue(t, e) {
  e === void 0 && (e = 0 | t[d]), 32 & e && !(4096 & e) && W(t, 4096 | e);
}
function Ir(t, e, n) {
  return !!(2 & n) || !(!(32 & n) || 4096 & n) && (W(e, 2 | n), t.h = ae, !0);
}
const to = at(0), Gt = {};
function P(t, e, n, r, s) {
  if ((e = Ut(t.v, e, n, s)) !== null || r && t.m !== ae) return e;
}
function Ut(t, e, n, r) {
  if (e === -1) return null;
  const s = e + (n ? 0 : -1), i = t.length - 1;
  let o, a;
  if (!(i < 1 + (n ? 0 : -1))) {
    if (s >= i) if (o = t[i], o != null && typeof o == "object" && o.constructor === Object) n = o[e], a = !0;
    else {
      if (s !== i) return;
      n = o;
    }
    else n = t[s];
    if (r && n != null) {
      if ((r = r(n)) == null) return r;
      if (!Object.is(r, n)) return a ? o[e] = r : t[s] = r, r;
    }
    return n;
  }
}
function S(t, e, n, r) {
  Re(t), H(t = t.v, 0 | t[d], e, n, r);
}
function H(t, e, n, r, s) {
  const i = n + (s ? 0 : -1);
  var o = t.length - 1;
  if (o >= 1 + (s ? 0 : -1) && i >= o) {
    const a = t[o];
    if (a != null && typeof a == "object" && a.constructor === Object) return a[n] = r, e;
  }
  return i <= o ? (t[i] = r, e) : (r !== void 0 && (n >= (o = (e ?? (e = 0 | t[d])) >> 14 & 1023 || 536870912) ? r != null && (t[o + (s ? 0 : -1)] = { [n]: r }) : t[i] = r), e);
}
function Qt() {
  return s2 === void 0 ? 2 : 4;
}
function te(t, e, n, r, s) {
  let i = t.v, o = 0 | i[d];
  r = ct(t, o) ? 1 : r, s = !!s || r === 3, r === 2 && Ne(t) && (i = t.v, o = 0 | i[d]);
  let a = (t = Cr(i, e)) === he ? 7 : 0 | t[d], c = Nr(a, o);
  var u = !(4 & c);
  if (u) {
    4 & c && (t = wt(t), a = 0, c = re(c, o), o = H(i, o, e, t));
    let h = 0, l = 0;
    for (; h < t.length; h++) {
      const _ = n(t[h]);
      _ != null && (t[l++] = _);
    }
    l < h && (t.length = l), n = -513 & (4 | c), c = n &= -1025, c &= -4097;
  }
  return c !== a && (W(t, c), 2 & c && Object.freeze(t)), eo(t, c, i, o, e, r, u, s);
}
function eo(t, e, n, r, s, i, o, a) {
  let c = e;
  return i === 1 || i === 4 && (2 & e || !(16 & e) && 32 & r) ? ne(e) || ((e |= !t.length || o && !(4096 & e) || 32 & r && !(4096 & e || 16 & e) ? 2 : 256) !== c && W(t, e), Object.freeze(t)) : (i === 2 && ne(e) && (t = wt(t), c = 0, e = re(e, r), r = H(n, r, s, t)), ne(e) || (a || (e |= 16), e !== c && W(t, e))), 2 & e || !(4096 & e || 16 & e) || ue(n, r), t;
}
function Cr(t, e, n) {
  return t = Ut(t, e, n), Array.isArray(t) ? t : he;
}
function Nr(t, e) {
  return 2 & e && (t |= 2), 1 | t;
}
function ne(t) {
  return !!(2 & t) && !!(4 & t) || !!(256 & t);
}
function no(t) {
  return Sr(t, !0);
}
function ro(t) {
  t = wt(t);
  for (let e = 0; e < t.length; e++) {
    const n = t[e] = wt(t[e]);
    Array.isArray(n[1]) && (n[1] = tn(n[1]));
  }
  return Xe(t);
}
function zt(t, e, n, r) {
  Re(t), H(t = t.v, 0 | t[d], e, (r === "0" ? Number(n) === 0 : n === r) ? void 0 : n);
}
function Be(t, e, n) {
  if (2 & e) throw Error();
  const r = Oe(e);
  let s = Cr(t, n, r), i = s === he ? 7 : 0 | s[d], o = Nr(i, e);
  return (2 & o || ne(o) || 16 & o) && (o === i || ne(o) || W(s, o), s = wt(s), i = 0, o = re(o, e), H(t, e, n, s, r)), o &= -13, o !== i && W(s, o), s;
}
function Jn(t, e) {
  var n = Xo;
  return Br(Rr(t = t.v), t, void 0, n) === e ? e : -1;
}
function Rr(t) {
  if (Pe) return t[He] ?? (t[He] = /* @__PURE__ */ new Map());
  if (He in t) return t[He];
  const e = /* @__PURE__ */ new Map();
  return Object.defineProperty(t, He, { value: e }), e;
}
function so(t, e, n, r, s) {
  const i = Rr(t), o = Br(i, t, e, n, s);
  return o !== r && (o && (e = H(t, e, o, void 0, s)), i.set(n, r)), e;
}
function Br(t, e, n, r, s) {
  let i = t.get(r);
  if (i != null) return i;
  i = 0;
  for (let o = 0; o < r.length; o++) {
    const a = r[o];
    Ut(e, a, s) != null && (i !== 0 && (n = H(e, n, i, void 0, s)), i = a);
  }
  return t.set(r, i), i;
}
function Dr(t, e, n) {
  let r = 0 | t[d];
  const s = Oe(r), i = Ut(t, n, s);
  let o;
  if (i != null && i[Ae] === Ee) {
    if (!ct(i)) return Ne(i), i.v;
    o = i.v;
  } else Array.isArray(i) && (o = i);
  if (o) {
    const a = 0 | o[d];
    2 & a && (o = Ce(o, a));
  }
  return o = ee(o, e), o !== i && H(t, r, n, o, s), o;
}
function io(t, e, n, r, s) {
  let i = !1;
  if ((r = Ut(t, r, s, ((o) => {
    const a = Fr(o, n, !1, e);
    return i = a !== o && a != null, a;
  }))) != null) return i && !ct(r) && ue(t, e), r;
}
function E(t, e, n, r) {
  let s = t.v, i = 0 | s[d];
  if ((e = io(s, i, e, n, r)) == null) return e;
  if (i = 0 | s[d], !ct(t, i)) {
    const o = Or(e);
    o !== e && (Ne(t) && (s = t.v, i = 0 | s[d]), i = H(s, i, n, e = o, r), ue(s, i));
  }
  return e;
}
function oo(t, e, n, r, s, i, o, a) {
  var c = ct(t, n);
  i = c ? 1 : i, o = !!o || i === 3, c = a && !c, (i === 2 || c) && Ne(t) && (n = 0 | (e = t.v)[d]);
  var u = (t = Cr(e, s)) === he ? 7 : 0 | t[d], h = Nr(u, n);
  if (a = !(4 & h)) {
    var l = t, _ = n;
    const w = !!(2 & h);
    w && (_ |= 2);
    let B = !w, kt = !0, St = 0, Yt = 0;
    for (; St < l.length; St++) {
      const fe = Fr(l[St], r, !1, _);
      if (fe instanceof r) {
        if (!w) {
          const Ge = ct(fe);
          B && (B = !Ge), kt && (kt = Ge);
        }
        l[Yt++] = fe;
      }
    }
    Yt < St && (l.length = Yt), h |= 4, h = kt ? -4097 & h : 4096 | h, h = B ? 8 | h : -9 & h;
  }
  if (h !== u && (W(t, h), 2 & h && Object.freeze(t)), c && !(8 & h || !t.length && (i === 1 || i === 4 && (2 & h || !(16 & h) && 32 & n)))) {
    for (ne(h) && (t = wt(t), h = re(h, n), n = H(e, n, s, t)), r = t, c = h, u = 0; u < r.length; u++) (l = r[u]) !== (h = Or(l)) && (r[u] = h);
    c |= 8, W(t, h = c = r.length ? 4096 | c : -4097 & c);
  }
  return eo(t, h, e, n, s, i, a, o);
}
function Vt(t, e, n) {
  const r = t.v;
  return oo(t, r, 0 | r[d], e, n, Qt(), !1, !0);
}
function ao(t) {
  return t == null && (t = void 0), t;
}
function y(t, e, n, r, s) {
  return S(t, n, r = ao(r), s), r && !ct(r) && ue(t.v), t;
}
function Ke(t, e, n, r) {
  t: {
    var s = r = ao(r);
    Re(t);
    const i = t.v;
    let o = 0 | i[d];
    if (s == null) {
      const a = Rr(i);
      if (Br(a, i, o, n) !== e) break t;
      a.set(n, 0);
    } else o = so(i, o, n, e);
    H(i, o, e, s);
  }
  r && !ct(r) && ue(t.v);
}
function re(t, e) {
  return -273 & (2 & e ? 2 | t : -3 & t);
}
function Ur(t, e, n, r) {
  var s = r;
  Re(t), t = oo(t, r = t.v, 0 | r[d], n, e, 2, !0), s = s ?? new n(), t.push(s), e = n = t === he ? 7 : 0 | t[d], (s = ct(s)) ? (n &= -9, t.length === 1 && (n &= -4097)) : n |= 4096, n !== e && W(t, n), s || ue(r);
}
function yt(t, e, n) {
  return Ie(P(t, e, void 0, n));
}
function D(t, e) {
  return P(t, e, void 0, void 0, Mt) ?? 0;
}
function jt(t, e, n) {
  if (n != null) {
    if (typeof n != "number" || !Mn(n)) throw or("int32");
    n |= 0;
  }
  S(t, e, n);
}
function m(t, e, n) {
  S(t, e, We(n));
}
function ht(t, e, n) {
  zt(t, e, rn(n), "");
}
function wn(t, e, n) {
  {
    Re(t);
    const o = t.v;
    let a = 0 | o[d];
    if (n == null) H(o, a, e);
    else {
      var r = t = n === he ? 7 : 0 | n[d], s = ne(t), i = s || Object.isFrozen(n);
      for (s || (t = 0), i || (n = wt(n), r = 0, t = re(t, a), i = !1), t |= 5, t |= (4 & t ? 512 & t ? 512 : 1024 & t ? 1024 : 0 : void 0) ?? 1024, s = 0; s < n.length; s++) {
        const c = n[s], u = Ji(c);
        Object.is(c, u) || (i && (n = wt(n), r = 0, t = re(t, a), i = !1), n[s] = u);
      }
      t !== r && (i && (n = wt(n), t = re(t, a)), W(n, t)), H(o, a, e, n);
    }
  }
}
function On(t, e, n) {
  Re(t), te(t, e, X, 2, !0).push(Ji(n));
}
var de = class {
  constructor(t, e, n) {
    if (this.buffer = t, n && !e) throw Error();
    this.g = e;
  }
};
function Vr(t, e) {
  if (typeof t == "string") return new de(Ri(t), e);
  if (Array.isArray(t)) return new de(new Uint8Array(t), e);
  if (t.constructor === Uint8Array) return new de(t, !1);
  if (t.constructor === ArrayBuffer) return t = new Uint8Array(t), new de(t, !1);
  if (t.constructor === Ft) return e = kr(t) || new Uint8Array(0), new de(e, !0, t);
  if (t instanceof Uint8Array) return t = t.constructor === Uint8Array ? t : new Uint8Array(t.buffer, t.byteOffset, t.byteLength), new de(t, !1);
  throw Error();
}
function jr(t, e) {
  let n, r = 0, s = 0, i = 0;
  const o = t.h;
  let a = t.g;
  do
    n = o[a++], r |= (127 & n) << i, i += 7;
  while (i < 32 && 128 & n);
  if (i > 32) for (s |= (127 & n) >> 4, i = 3; i < 32 && 128 & n; i += 7) n = o[a++], s |= (127 & n) << i;
  if (se(t, a), !(128 & n)) return e(r >>> 0, s >>> 0);
  throw Error();
}
function Gr(t) {
  let e = 0, n = t.g;
  const r = n + 10, s = t.h;
  for (; n < r; ) {
    const i = s[n++];
    if (e |= i, (128 & i) == 0) return se(t, n), !!(127 & e);
  }
  throw Error();
}
function qt(t) {
  const e = t.h;
  let n = t.g, r = e[n++], s = 127 & r;
  if (128 & r && (r = e[n++], s |= (127 & r) << 7, 128 & r && (r = e[n++], s |= (127 & r) << 14, 128 & r && (r = e[n++], s |= (127 & r) << 21, 128 & r && (r = e[n++], s |= r << 28, 128 & r && 128 & e[n++] && 128 & e[n++] && 128 & e[n++] && 128 & e[n++] && 128 & e[n++]))))) throw Error();
  return se(t, n), s;
}
function Pt(t) {
  return qt(t) >>> 0;
}
function bn(t) {
  var e = t.h;
  const n = t.g;
  var r = e[n], s = e[n + 1];
  const i = e[n + 2];
  return e = e[n + 3], se(t, t.g + 4), t = 2 * ((s = (r << 0 | s << 8 | i << 16 | e << 24) >>> 0) >> 31) + 1, r = s >>> 23 & 255, s &= 8388607, r == 255 ? s ? NaN : t * (1 / 0) : r == 0 ? 1401298464324817e-60 * t * s : t * Math.pow(2, r - 150) * (s + 8388608);
}
function F2(t) {
  return qt(t);
}
function se(t, e) {
  if (t.g = e, e > t.l) throw Error();
}
function co(t, e) {
  if (e < 0) throw Error();
  const n = t.g;
  if ((e = n + e) > t.l) throw Error();
  return t.g = e, n;
}
function ho(t, e) {
  if (e == 0) return oe();
  var n = co(t, e);
  return t.Y && t.j ? n = t.h.subarray(n, n + e) : (t = t.h, n = n === (e = n + e) ? new Uint8Array(0) : l2 ? t.slice(n, e) : new Uint8Array(t.subarray(n, e))), n.length == 0 ? oe() : new Ft(n, we);
}
var Vs = [];
function uo(t, e, n, r) {
  if (An.length) {
    const s = An.pop();
    return s.o(r), s.g.init(t, e, n, r), s;
  }
  return new P2(t, e, n, r);
}
function lo(t) {
  t.g.clear(), t.l = -1, t.h = -1, An.length < 100 && An.push(t);
}
function fo(t) {
  var e = t.g;
  if (e.g == e.l) return !1;
  t.m = t.g.g;
  var n = Pt(t.g);
  if (e = n >>> 3, !((n &= 7) >= 0 && n <= 5) || e < 1) throw Error();
  return t.l = e, t.h = n, !0;
}
function mn(t) {
  switch (t.h) {
    case 0:
      t.h != 0 ? mn(t) : Gr(t.g);
      break;
    case 1:
      se(t = t.g, t.g + 8);
      break;
    case 2:
      if (t.h != 2) mn(t);
      else {
        var e = Pt(t.g);
        se(t = t.g, t.g + e);
      }
      break;
    case 5:
      se(t = t.g, t.g + 4);
      break;
    case 3:
      for (e = t.l; ; ) {
        if (!fo(t)) throw Error();
        if (t.h == 4) {
          if (t.l != e) throw Error();
          break;
        }
        mn(t);
      }
      break;
    default:
      throw Error();
  }
}
function sn(t, e, n) {
  const r = t.g.l;
  var s = Pt(t.g);
  let i = (s = t.g.g + s) - r;
  if (i <= 0 && (t.g.l = s, n(e, t, void 0, void 0, void 0), i = s - t.g.g), i) throw Error();
  return t.g.g = s, t.g.l = r, e;
}
function Hr(t) {
  var e = Pt(t.g), n = co(t = t.g, e);
  if (t = t.h, za) {
    var r, s = t;
    (r = $n) || (r = $n = new TextDecoder("utf-8", { fatal: !0 })), e = n + e, s = n === 0 && e === s.length ? s : s.subarray(n, e);
    try {
      var i = r.decode(s);
    } catch (a) {
      if (un === void 0) {
        try {
          r.decode(new Uint8Array([128]));
        } catch {
        }
        try {
          r.decode(new Uint8Array([97])), un = !0;
        } catch {
          un = !1;
        }
      }
      throw !un && ($n = void 0), a;
    }
  } else {
    e = (i = n) + e, n = [];
    let a, c = null;
    for (; i < e; ) {
      var o = t[i++];
      o < 128 ? n.push(o) : o < 224 ? i >= e ? Jt() : (a = t[i++], o < 194 || (192 & a) != 128 ? (i--, Jt()) : n.push((31 & o) << 6 | 63 & a)) : o < 240 ? i >= e - 1 ? Jt() : (a = t[i++], (192 & a) != 128 || o === 224 && a < 160 || o === 237 && a >= 160 || (192 & (r = t[i++])) != 128 ? (i--, Jt()) : n.push((15 & o) << 12 | (63 & a) << 6 | 63 & r)) : o <= 244 ? i >= e - 2 ? Jt() : (a = t[i++], (192 & a) != 128 || a - 144 + (o << 28) >> 30 != 0 || (192 & (r = t[i++])) != 128 || (192 & (s = t[i++])) != 128 ? (i--, Jt()) : (o = (7 & o) << 18 | (63 & a) << 12 | (63 & r) << 6 | 63 & s, o -= 65536, n.push(55296 + (o >> 10 & 1023), 56320 + (1023 & o)))) : Jt(), n.length >= 8192 && (c = Es(c, n), n.length = 0);
    }
    i = Es(c, n);
  }
  return i;
}
function po(t) {
  const e = Pt(t.g);
  return ho(t.g, e);
}
function In(t, e, n) {
  var r = Pt(t.g);
  for (r = t.g.g + r; t.g.g < r; ) n.push(e(t.g));
}
var P2 = class {
  constructor(t, e, n, r) {
    if (Vs.length) {
      const s = Vs.pop();
      s.init(t, e, n, r), t = s;
    } else t = new class {
      constructor(s, i, o, a) {
        this.h = null, this.j = !1, this.g = this.l = this.m = 0, this.init(s, i, o, a);
      }
      init(s, i, o, { Y: a = !1, ea: c = !1 } = {}) {
        this.Y = a, this.ea = c, s && (s = Vr(s, this.ea), this.h = s.buffer, this.j = s.g, this.m = i || 0, this.l = o !== void 0 ? this.m + o : this.h.length, this.g = this.m);
      }
      clear() {
        this.h = null, this.j = !1, this.g = this.l = this.m = 0, this.Y = !1;
      }
    }(t, e, n, r);
    this.g = t, this.m = this.g.g, this.h = this.l = -1, this.o(r);
  }
  o({ ha: t = !1 } = {}) {
    this.ha = t;
  }
}, An = [];
function js(t) {
  return t ? /^\d+$/.test(t) ? (xn(t), new ur(F, U)) : null : O2 || (O2 = new ur(0, 0));
}
var ur = class {
  constructor(t, e) {
    this.h = t >>> 0, this.g = e >>> 0;
  }
};
let O2;
function Gs(t) {
  return t ? /^-?\d+$/.test(t) ? (xn(t), new lr(F, U)) : null : I2 || (I2 = new lr(0, 0));
}
var lr = class {
  constructor(t, e) {
    this.h = t >>> 0, this.g = e >>> 0;
  }
};
let I2;
function ye(t, e, n) {
  for (; n > 0 || e > 127; ) t.g.push(127 & e | 128), e = (e >>> 7 | n << 25) >>> 0, n >>>= 7;
  t.g.push(e);
}
function De(t, e) {
  for (; e > 127; ) t.g.push(127 & e | 128), e >>>= 7;
  t.g.push(e);
}
function Cn(t, e) {
  if (e >= 0) De(t, e);
  else {
    for (let n = 0; n < 9; n++) t.g.push(127 & e | 128), e >>= 7;
    t.g.push(1);
  }
}
function zr(t) {
  var e = F;
  t.g.push(e >>> 0 & 255), t.g.push(e >>> 8 & 255), t.g.push(e >>> 16 & 255), t.g.push(e >>> 24 & 255);
}
function Te(t, e) {
  e.length !== 0 && (t.l.push(e), t.h += e.length);
}
function _t(t, e, n) {
  De(t.g, 8 * e + n);
}
function Wr(t, e) {
  return _t(t, e, 2), e = t.g.end(), Te(t, e), e.push(t.h), e;
}
function Kr(t, e) {
  var n = e.pop();
  for (n = t.h + t.g.length() - n; n > 127; ) e.push(127 & n | 128), n >>>= 7, t.h++;
  e.push(n), t.h++;
}
function Nn(t, e, n) {
  _t(t, e, 2), De(t.g, n.length), Te(t, t.g.end()), Te(t, n);
}
function En(t, e, n, r) {
  n != null && (e = Wr(t, e), r(n, t), Kr(t, e));
}
function It() {
  const t = class {
    constructor() {
      throw Error();
    }
  };
  return Object.setPrototypeOf(t, t.prototype), t;
}
var qr = It(), go = It(), $r = It(), Xr = It(), Yr = It(), mo = It(), C2 = It(), Rn = It(), yo = It(), _o = It();
function Ct(t, e, n) {
  var r = t.v;
  ot && ot in r && (r = r[ot]) && delete r[e.g], e.h ? e.j(t, e.h, e.g, n, e.l) : e.j(t, e.g, n, e.l);
}
var p = class {
  constructor(t, e) {
    this.v = Qi(t, e, void 0, 2048);
  }
  toJSON() {
    return Zi(this);
  }
  j() {
    var s;
    var t = g1, e = this.v, n = t.g, r = ot;
    if (Pe && r && ((s = e[r]) == null ? void 0 : s[n]) != null && be(e2, 3), e = t.g, Ms && ot && Ms === void 0 && (r = (n = this.v)[ot]) && (r = r.da)) try {
      r(n, e, k2);
    } catch (i) {
      Oi(i);
    }
    return t.h ? t.m(this, t.h, t.g, t.l) : t.m(this, t.g, t.defaultValue, t.l);
  }
  clone() {
    const t = this.v, e = 0 | t[d];
    return Ir(this, t, e) ? Pr(this, t, !0) : new this.constructor(Ce(t, e, !1));
  }
};
p.prototype[Ae] = Ee, p.prototype.toString = function() {
  return this.v.toString();
};
var Ue = class {
  constructor(t, e, n) {
    this.g = t, this.h = e, t = qr, this.l = !!t && n === t || !1;
  }
};
function Bn(t, e) {
  return new Ue(t, e, qr);
}
function vo(t, e, n, r, s) {
  En(t, n, Eo(e, r), s);
}
const N2 = Bn((function(t, e, n, r, s) {
  return t.h === 2 && (sn(t, Dr(e, r, n), s), !0);
}), vo), R2 = Bn((function(t, e, n, r, s) {
  return t.h === 2 && (sn(t, Dr(e, r, n), s), !0);
}), vo);
var Dn = Symbol(), Un = Symbol(), fr = Symbol(), Hs = Symbol(), zs = Symbol();
let wo, bo;
function le(t, e, n, r) {
  var s = r[t];
  if (s) return s;
  (s = {}).qa = r, s.T = (function(l) {
    switch (typeof l) {
      case "boolean":
        return L2 || (L2 = [0, void 0, !0]);
      case "number":
        return l > 0 ? void 0 : l === 0 ? x2 || (x2 = [0, void 0]) : [-l, void 0];
      case "string":
        return [0, l];
      case "object":
        return l;
    }
  })(r[0]);
  var i = r[1];
  let o = 1;
  i && i.constructor === Object && (s.ba = i, typeof (i = r[++o]) == "function" && (s.ma = !0, wo ?? (wo = i), bo ?? (bo = r[o + 1]), i = r[o += 2]));
  const a = {};
  for (; i && Array.isArray(i) && i.length && typeof i[0] == "number" && i[0] > 0; ) {
    for (var c = 0; c < i.length; c++) a[i[c]] = i;
    i = r[++o];
  }
  for (c = 1; i !== void 0; ) {
    let l;
    typeof i == "number" && (c += i, i = r[++o]);
    var u = void 0;
    if (i instanceof Ue ? l = i : (l = N2, o--), l == null ? void 0 : l.l) {
      i = r[++o], u = r;
      var h = o;
      typeof i == "function" && (i = i(), u[h] = i), u = i;
    }
    for (h = c + 1, typeof (i = r[++o]) == "number" && i < 0 && (h -= i, i = r[++o]); c < h; c++) {
      const _ = a[c];
      u ? n(s, c, l, u, _) : e(s, c, l, _);
    }
  }
  return r[t] = s;
}
function Ao(t) {
  return Array.isArray(t) ? t[0] instanceof Ue ? t : [R2, t] : [t, void 0];
}
function Eo(t, e) {
  return t instanceof p ? t.v : Array.isArray(t) ? ee(t, e) : void 0;
}
function Jr(t, e, n, r) {
  const s = n.g;
  t[e] = r ? (i, o, a) => s(i, o, a, r) : s;
}
function Zr(t, e, n, r, s) {
  const i = n.g;
  let o, a;
  t[e] = (c, u, h) => i(c, u, h, a || (a = le(Un, Jr, Zr, r).T), o || (o = Qr(r)), s);
}
function Qr(t) {
  let e = t[fr];
  if (e != null) return e;
  const n = le(Un, Jr, Zr, t);
  return e = n.ma ? (r, s) => wo(r, s, n) : (r, s) => {
    for (; fo(s) && s.h != 4; ) {
      var i = s.l, o = n[i];
      if (o == null) {
        var a = n.ba;
        a && (a = a[i]) && (a = D2(a)) != null && (o = n[i] = a);
      }
      if (o == null || !o(s, r, i)) {
        if (o = (a = s).m, mn(a), a.ha) var c = void 0;
        else c = a.g.g - o, a.g.g = o, c = ho(a.g, c);
        o = void 0, a = r, c && ((o = a[ot] ?? (a[ot] = new hr()))[i] ?? (o[i] = [])).push(c);
      }
    }
    return (r = Fn(r)) && (r.da = n.qa[zs]), !0;
  }, t[fr] = e, t[zs] = B2.bind(t), e;
}
function B2(t, e, n, r) {
  var s = this[Un];
  const i = this[fr], o = ee(void 0, s.T), a = Fn(t);
  if (a) {
    var c = !1, u = s.ba;
    if (u) {
      if (s = (h, l, _) => {
        if (_.length !== 0) if (u[l]) for (const w of _) {
          h = uo(w);
          try {
            c = !0, i(o, h);
          } finally {
            lo(h);
          }
        }
        else r == null || r(t, l, _);
      }, e == null) vn(a, s);
      else if (a != null) {
        const h = a[e];
        h && s(a, e, h);
      }
      if (c) {
        let h = 0 | t[d];
        if (2 & h && 2048 & h && !(n != null && n.Ka)) throw Error();
        const l = Oe(h), _ = (w, B) => {
          if (Ut(t, w, l) != null) {
            if ((n == null ? void 0 : n.Qa) === 1) return;
            throw Error();
          }
          B != null && (h = H(t, h, w, B, l)), delete a[w];
        };
        e == null ? ji(o, 0 | o[d], ((w, B) => {
          _(w, B);
        })) : _(e, Ut(o, e, l));
      }
    }
  }
}
function D2(t) {
  const e = (t = Ao(t))[0].g;
  if (t = t[1]) {
    const n = Qr(t), r = le(Un, Jr, Zr, t).T;
    return (s, i, o) => e(s, i, o, r, n);
  }
  return e;
}
function Vn(t, e, n) {
  t[e] = n.h;
}
function jn(t, e, n, r) {
  let s, i;
  const o = n.h;
  t[e] = (a, c, u) => o(a, c, u, i || (i = le(Dn, Vn, jn, r).T), s || (s = ko(r)));
}
function ko(t) {
  let e = t[Hs];
  if (!e) {
    const n = le(Dn, Vn, jn, t);
    e = (r, s) => So(r, s, n), t[Hs] = e;
  }
  return e;
}
function So(t, e, n) {
  ji(t, 0 | t[d], ((r, s) => {
    if (s != null) {
      var i = (function(o, a) {
        var c = o[a];
        if (c) return c;
        if ((c = o.ba) && (c = c[a])) {
          var u = (c = Ao(c))[0].h;
          if (c = c[1]) {
            const h = ko(c), l = le(Dn, Vn, jn, c).T;
            c = o.ma ? bo(l, h) : (_, w, B) => u(_, w, B, l, h);
          } else c = u;
          return o[a] = c;
        }
      })(n, r);
      i ? i(e, s, r) : r < 500 || be(ar, 3);
    }
  })), (t = Fn(t)) && vn(t, ((r, s, i) => {
    for (Te(e, e.g.end()), r = 0; r < i.length; r++) Te(e, kr(i[r]) || new Uint8Array(0));
  }));
}
const U2 = at(0);
function Ve(t, e) {
  if (Array.isArray(e)) {
    var n = 0 | e[d];
    if (4 & n) return e;
    for (var r = 0, s = 0; r < e.length; r++) {
      const i = t(e[r]);
      i != null && (e[s++] = i);
    }
    return s < r && (e.length = s), (t = -1537 & (5 | n)) !== n && W(e, t), 2 & t && Object.freeze(e), e;
  }
}
function Q(t, e, n) {
  return new Ue(t, e, n);
}
function je(t, e, n) {
  return new Ue(t, e, n);
}
function tt(t, e, n) {
  H(t, 0 | t[d], e, n, Oe(0 | t[d]));
}
var V2 = Bn((function(t, e, n, r, s) {
  if (t.h !== 2) return !1;
  if (t = wt(t = sn(t, ee([void 0, void 0], r), s)), s = Oe(r = 0 | e[d]), 2 & r) throw Error();
  let i = Ut(e, n, s);
  if (i instanceof Dt) (2 & i.J) != 0 ? (i = i.V(), i.push(t), H(e, r, n, i, s)) : i.Ma(t);
  else if (Array.isArray(i)) {
    var o = 0 | i[d];
    8192 & o || W(i, o |= 8192), 2 & o && (i = ro(i), H(e, r, n, i, s)), i.push(t);
  } else H(e, r, n, Xe([t]), s);
  return !0;
}), (function(t, e, n, r, s) {
  if (e instanceof Dt) e.forEach(((i, o) => {
    En(t, n, ee([o, i], r), s);
  }));
  else if (Array.isArray(e)) {
    for (let i = 0; i < e.length; i++) {
      const o = e[i];
      Array.isArray(o) && En(t, n, ee(o, r), s);
    }
    Xe(e);
  }
}));
function To(t, e, n) {
  (e = Mt(e)) != null && (_t(t, n, 5), t = t.g, Tr(e), zr(t));
}
function Lo(t, e, n) {
  if (e = (function(r) {
    if (r == null) return r;
    const s = typeof r;
    if (s === "bigint") return String(en(64, r));
    if (nn(r)) {
      if (s === "string") return $i(r);
      if (s === "number") return Mr(r);
    }
  })(e), e != null && (typeof e == "string" && Gs(e), e != null))
    switch (_t(t, n, 0), typeof e) {
      case "number":
        t = t.g, ke(e), ye(t, F, U);
        break;
      case "bigint":
        n = BigInt.asUintN(64, e), n = new lr(Number(n & BigInt(4294967295)), Number(n >> BigInt(32))), ye(t.g, n.h, n.g);
        break;
      default:
        n = Gs(e), ye(t.g, n.h, n.g);
    }
}
function xo(t, e, n) {
  (e = Ie(e)) != null && e != null && (_t(t, n, 0), Cn(t.g, e));
}
function Mo(t, e, n) {
  (e = Wi(e)) != null && (_t(t, n, 0), t.g.g.push(e ? 1 : 0));
}
function Fo(t, e, n) {
  (e = X(e)) != null && Nn(t, n, Pi(e));
}
function Po(t, e, n, r, s) {
  En(t, n, Eo(e, r), s);
}
function Oo(t, e, n) {
  (e = e == null || typeof e == "string" || e instanceof Ft ? e : void 0) != null && Nn(t, n, Vr(e, !0).buffer);
}
function Io(t, e, n) {
  (e = Ki(e)) != null && e != null && (_t(t, n, 0), De(t.g, e));
}
function Co(t, e, n) {
  return (t.h === 5 || t.h === 2) && (e = Be(e, 0 | e[d], n), t.h == 2 ? In(t, bn, e) : e.push(bn(t.g)), !0);
}
var V = Q((function(t, e, n) {
  return t.h === 5 && (tt(e, n, bn(t.g)), !0);
}), To, Rn), j2 = je(Co, (function(t, e, n) {
  if ((e = Ve(Mt, e)) != null) for (let o = 0; o < e.length; o++) {
    var r = t, s = n, i = e[o];
    i != null && (_t(r, s, 5), r = r.g, Tr(i), zr(r));
  }
}), Rn), ts = je(Co, (function(t, e, n) {
  if ((e = Ve(Mt, e)) != null && e.length) {
    _t(t, n, 2), De(t.g, 4 * e.length);
    for (let r = 0; r < e.length; r++) n = t.g, Tr(e[r]), zr(n);
  }
}), Rn), G2 = Q((function(t, e, n) {
  return t.h === 5 && (tt(e, n, (t = bn(t.g)) === 0 ? void 0 : t), !0);
}), To, Rn), $t = Q((function(t, e, n) {
  return t.h !== 0 ? t = !1 : (tt(e, n, jr(t.g, zi)), t = !0), t;
}), Lo, mo), Zn = Q((function(t, e, n) {
  return t.h !== 0 ? e = !1 : (tt(e, n, (t = jr(t.g, zi)) === U2 ? void 0 : t), e = !0), e;
}), Lo, mo), H2 = Q((function(t, e, n) {
  return t.h !== 0 ? t = !1 : (tt(e, n, jr(t.g, d2)), t = !0), t;
}), (function(t, e, n) {
  if (e = (function(r) {
    if (r == null) return r;
    var s = typeof r;
    if (s === "bigint") return String(p2(64, r));
    if (nn(r)) {
      if (s === "string") return s = Se(Number(r)), ce(s) && s >= 0 ? r = String(s) : ((s = r.indexOf(".")) !== -1 && (r = r.substring(0, s)), (s = r[0] !== "-" && ((s = r.length) < 20 || s === 20 && r <= "18446744073709551615")) || (xn(r), r = Ye(F, U))), r;
      if (s === "number") return (r = Se(r)) >= 0 && ce(r) || (ke(r), r = Hi(F, U)), r;
    }
  })(e), e != null && (typeof e == "string" && js(e), e != null))
    switch (_t(t, n, 0), typeof e) {
      case "number":
        t = t.g, ke(e), ye(t, F, U);
        break;
      case "bigint":
        n = BigInt.asUintN(64, e), n = new ur(Number(n & BigInt(4294967295)), Number(n >> BigInt(32))), ye(t.g, n.h, n.g);
        break;
      default:
        n = js(e), ye(t.g, n.h, n.g);
    }
}), C2), G = Q((function(t, e, n) {
  return t.h === 0 && (tt(e, n, qt(t.g)), !0);
}), xo, Xr), on = je((function(t, e, n) {
  return (t.h === 0 || t.h === 2) && (e = Be(e, 0 | e[d], n), t.h == 2 ? In(t, qt, e) : e.push(qt(t.g)), !0);
}), (function(t, e, n) {
  if ((e = Ve(Ie, e)) != null && e.length) {
    n = Wr(t, n);
    for (let r = 0; r < e.length; r++) Cn(t.g, e[r]);
    Kr(t, n);
  }
}), Xr), me = Q((function(t, e, n) {
  return t.h === 0 && (tt(e, n, (t = qt(t.g)) === 0 ? void 0 : t), !0);
}), xo, Xr), O = Q((function(t, e, n) {
  return t.h === 0 && (tt(e, n, Gr(t.g)), !0);
}), Mo, go), ie = Q((function(t, e, n) {
  return t.h === 0 && (tt(e, n, (t = Gr(t.g)) === !1 ? void 0 : t), !0);
}), Mo, go), J = je((function(t, e, n) {
  return t.h === 2 && (t = Hr(t), Be(e, 0 | e[d], n).push(t), !0);
}), (function(t, e, n) {
  if ((e = Ve(X, e)) != null) for (let o = 0; o < e.length; o++) {
    var r = t, s = n, i = e[o];
    i != null && Nn(r, s, Pi(i));
  }
}), $r), Wt = Q((function(t, e, n) {
  return t.h === 2 && (tt(e, n, (t = Hr(t)) === "" ? void 0 : t), !0);
}), Fo, $r), T = Q((function(t, e, n) {
  return t.h === 2 && (tt(e, n, Hr(t)), !0);
}), Fo, $r), q = (function(t, e, n = qr) {
  return new Ue(t, e, n);
})((function(t, e, n, r, s) {
  return t.h === 2 && (r = ee(void 0, r), Be(e, 0 | e[d], n).push(r), sn(t, r, s), !0);
}), (function(t, e, n, r, s) {
  if (Array.isArray(e)) {
    for (let i = 0; i < e.length; i++) Po(t, e[i], n, r, s);
    1 & (t = 0 | e[d]) || W(e, 1 | t);
  }
})), x = Bn((function(t, e, n, r, s, i) {
  if (t.h !== 2) return !1;
  let o = 0 | e[d];
  return so(e, o, i, n, Oe(o)), sn(t, e = Dr(e, r, n), s), !0;
}), Po), No = Q((function(t, e, n) {
  return t.h === 2 && (tt(e, n, po(t)), !0);
}), Oo, yo), z2 = je((function(t, e, n) {
  return (t.h === 0 || t.h === 2) && (e = Be(e, 0 | e[d], n), t.h == 2 ? In(t, Pt, e) : e.push(Pt(t.g)), !0);
}), (function(t, e, n) {
  if ((e = Ve(Ki, e)) != null) for (let o = 0; o < e.length; o++) {
    var r = t, s = n, i = e[o];
    i != null && (_t(r, s, 0), De(r.g, i));
  }
}), Yr), W2 = Q((function(t, e, n) {
  return t.h === 0 && (tt(e, n, (t = Pt(t.g)) === 0 ? void 0 : t), !0);
}), Io, Yr), Z = Q((function(t, e, n) {
  return t.h === 0 && (tt(e, n, qt(t.g)), !0);
}), (function(t, e, n) {
  (e = Ie(e)) != null && (e = parseInt(e, 10), _t(t, n, 0), Cn(t.g, e));
}), _o);
class K2 {
  constructor(e, n) {
    var r = lt;
    this.g = e, this.h = n, this.m = E, this.j = y, this.defaultValue = void 0, this.l = r.Oa != null ? Gi : void 0;
  }
  register() {
    Sn(this);
  }
}
function Nt(t, e) {
  return new K2(t, e);
}
function Xt(t, e) {
  return (n, r) => {
    {
      const i = { ea: !0 };
      r && Object.assign(i, r), n = uo(n, void 0, void 0, i);
      try {
        const o = new t(), a = o.v;
        Qr(e)(a, n);
        var s = o;
      } finally {
        lo(n);
      }
    }
    return s;
  };
}
function Gn(t) {
  return function() {
    const e = new class {
      constructor() {
        this.l = [], this.h = 0, this.g = new class {
          constructor() {
            this.g = [];
          }
          length() {
            return this.g.length;
          }
          end() {
            const o = this.g;
            return this.g = [], o;
          }
        }();
      }
    }();
    So(this.v, e, le(Dn, Vn, jn, t)), Te(e, e.g.end());
    const n = new Uint8Array(e.h), r = e.l, s = r.length;
    let i = 0;
    for (let o = 0; o < s; o++) {
      const a = r[o];
      n.set(a, i), i += a.length;
    }
    return e.l = [n], n;
  };
}
var Ws = class extends p {
  constructor(t) {
    super(t);
  }
}, Ks = [0, Wt, Q((function(t, e, n) {
  return t.h === 2 && (tt(e, n, (t = po(t)) === oe() ? void 0 : t), !0);
}), (function(t, e, n) {
  if (e != null) {
    if (e instanceof p) {
      const r = e.Ra;
      return void (r ? (e = r(e), e != null && Nn(t, n, Vr(e, !0).buffer)) : be(ar, 3));
    }
    if (Array.isArray(e)) return void be(ar, 3);
  }
  Oo(t, e, n);
}), yo)];
let Qn, qs = globalThis.trustedTypes;
function $s(t) {
  var e;
  return Qn === void 0 && (Qn = (function() {
    let n = null;
    if (!qs) return n;
    try {
      const r = (s) => s;
      n = qs.createPolicy("goog#html", { createHTML: r, createScript: r, createScriptURL: r });
    } catch {
    }
    return n;
  })()), t = (e = Qn) ? e.createScriptURL(t) : t, new class {
    constructor(n) {
      this.g = n;
    }
    toString() {
      return this.g + "";
    }
  }(t);
}
function ln(t, ...e) {
  if (e.length === 0) return $s(t[0]);
  let n = t[0];
  for (let r = 0; r < e.length; r++) n += encodeURIComponent(e[r]) + t[r + 1];
  return $s(n);
}
var Ro = [0, G, Z, O, -1, on, Z, -1, O], q2 = class extends p {
  constructor(t) {
    super(t);
  }
}, Bo = [0, O, T, O, Z, -1, je((function(t, e, n) {
  return (t.h === 0 || t.h === 2) && (e = Be(e, 0 | e[d], n), t.h == 2 ? In(t, F2, e) : e.push(qt(t.g)), !0);
}), (function(t, e, n) {
  if ((e = Ve(Ie, e)) != null && e.length) {
    n = Wr(t, n);
    for (let r = 0; r < e.length; r++) Cn(t.g, e[r]);
    Kr(t, n);
  }
}), _o), T, -1, [0, O, -1], Z, O, -1], Do = [0, 3, O, -1, 2, [0, [2], G, x, [0, Q((function(t, e, n) {
  return t.h === 0 && (tt(e, n, Pt(t.g)), !0);
}), Io, Yr)]], [0, Z, O, Z, O, Z, O, T, -1], [0, [3, 4], T, -1, x, [0, G], x, [0, Z]], [0]], Uo = [0, T, -2], Xs = class extends p {
  constructor(t) {
    super(t);
  }
}, Vo = [0], jo = [0, G, O, 1, O, -4], lt = class extends p {
  constructor(t) {
    super(t, 2);
  }
}, z = {};
z[336783863] = [0, T, O, -1, G, [0, [1, 2, 3, 4, 5, 6, 7, 8, 9], x, Vo, x, Bo, x, Uo, x, jo, x, Ro, x, [0, T, -2], x, [0, T, Z], x, Do, x, [0, Z, -1, O]], [0, T], O, [0, [1, 3], [2, 4], x, [0, on], -1, x, [0, J], -1, q, [0, T, -1]], T];
var Ys = [0, Zn, -1, ie, -3, Zn, on, Wt, me, Zn, -1, ie, me, ie, -2, Wt];
function M(t, e) {
  On(t, 3, e);
}
function b(t, e) {
  On(t, 4, e);
}
var nt = class extends p {
  constructor(t) {
    super(t, 500);
  }
  o(t) {
    return y(this, 0, 7, t);
  }
}, qe = [-1, {}], Js = [0, T, 1, qe], Zs = [0, T, J, qe];
function vt(t, e) {
  Ur(t, 1, nt, e);
}
function I(t, e) {
  On(t, 10, e);
}
function k(t, e) {
  On(t, 15, e);
}
var ft = class extends p {
  constructor(t) {
    super(t, 500);
  }
  o(t) {
    return y(this, 0, 1001, t);
  }
}, Go = [-500, q, [-500, Wt, -1, J, -3, [-2, z, O], q, Ks, me, -1, Js, Zs, q, [0, Wt, ie], Wt, Ys, me, J, 987, J], 4, q, [-500, T, -1, [-1, {}], 998, T], q, [-500, T, J, -1, [-2, {}, O], 997, J, -1], me, q, [-500, T, J, qe, 998, J], J, me, Js, Zs, q, [0, Wt, -1, qe], J, -2, Ys, Wt, -1, ie, [0, ie, W2], 978, qe, q, Ks];
ft.prototype.g = Gn(Go);
var $2 = Xt(ft, Go), X2 = class extends p {
  constructor(t) {
    super(t);
  }
}, Ho = class extends p {
  constructor(t) {
    super(t);
  }
  g() {
    return Vt(this, X2, 1);
  }
}, zo = [0, q, [0, G, V, T, -1]], Hn = Xt(Ho, zo), Y2 = class extends p {
  constructor(t) {
    super(t);
  }
}, J2 = class extends p {
  constructor(t) {
    super(t);
  }
}, tr = class extends p {
  constructor(t) {
    super(t);
  }
  l() {
    return E(this, Y2, 2);
  }
  g() {
    return Vt(this, J2, 5);
  }
}, Wo = Xt(class extends p {
  constructor(t) {
    super(t);
  }
}, [0, J, on, ts, [0, Z, [0, G, -3], [0, V, -3], [0, G, -1, [0, q, [0, G, -2]]], q, [0, V, -1, T, V]], T, -1, $t, q, [0, G, V], J, $t]), Ko = class extends p {
  constructor(t) {
    super(t);
  }
}, _e = Xt(class extends p {
  constructor(t) {
    super(t);
  }
}, [0, q, [0, V, -4]]), qo = class extends p {
  constructor(t) {
    super(t);
  }
}, an = Xt(class extends p {
  constructor(t) {
    super(t);
  }
}, [0, q, [0, V, -4]]), Z2 = class extends p {
  constructor(t) {
    super(t);
  }
}, Q2 = [0, G, -1, ts, Z], $o = class extends p {
  constructor(t) {
    super(t);
  }
};
$o.prototype.g = Gn([0, V, -4, $t]);
var t1 = class extends p {
  constructor(t) {
    super(t);
  }
}, e1 = Xt(class extends p {
  constructor(t) {
    super(t);
  }
}, [0, q, [0, 1, G, T, zo], $t]), Qs = class extends p {
  constructor(t) {
    super(t);
  }
}, n1 = class extends p {
  constructor(t) {
    super(t);
  }
  na() {
    const t = P(this, 1, void 0, void 0, no);
    return t ?? oe();
  }
}, r1 = class extends p {
  constructor(t) {
    super(t);
  }
}, Xo = [1, 2], s1 = Xt(class extends p {
  constructor(t) {
    super(t);
  }
}, [0, q, [0, Xo, x, [0, ts], x, [0, No], G, T], $t]), es = class extends p {
  constructor(t) {
    super(t);
  }
}, Yo = [0, T, G, V, J, -1], ti = class extends p {
  constructor(t) {
    super(t);
  }
}, i1 = [0, O, -1], ei = class extends p {
  constructor(t) {
    super(t);
  }
}, yn = [1, 2, 3, 4, 5, 6], kn = class extends p {
  constructor(t) {
    super(t);
  }
  g() {
    return P(this, 1, void 0, void 0, no) != null;
  }
  l() {
    return X(P(this, 2)) != null;
  }
}, R = class extends p {
  constructor(t) {
    super(t);
  }
  g() {
    return Wi(P(this, 2)) ?? !1;
  }
}, Jo = [0, No, T, [0, G, $t, -1], [0, H2, $t]], j = [0, Jo, O, [0, yn, x, jo, x, Bo, x, Ro, x, Vo, x, Uo, x, Do], Z], zn = class extends p {
  constructor(t) {
    super(t);
  }
}, ns = [0, j, V, -1, G], o1 = Nt(502141897, zn);
z[502141897] = ns;
var a1 = Xt(class extends p {
  constructor(t) {
    super(t);
  }
}, [0, [0, Z, -1, j2, z2], Q2]), Zo = class extends p {
  constructor(t) {
    super(t);
  }
}, Qo = class extends p {
  constructor(t) {
    super(t);
  }
}, dr = [0, j, V, [0, j], O], c1 = Nt(508968150, Qo);
z[508968150] = [0, j, ns, dr, V, [0, [0, Jo]]], z[508968149] = dr;
var pe = class extends p {
  constructor(t) {
    super(t);
  }
  l() {
    return E(this, es, 2);
  }
  g() {
    S(this, 2);
  }
}, ta = [0, j, Yo];
z[478825465] = ta;
var h1 = class extends p {
  constructor(t) {
    super(t);
  }
}, ea = class extends p {
  constructor(t) {
    super(t);
  }
}, rs = class extends p {
  constructor(t) {
    super(t);
  }
}, ss = class extends p {
  constructor(t) {
    super(t);
  }
}, na = class extends p {
  constructor(t) {
    super(t);
  }
}, ni = [0, j, [0, j], ta, -1], ra = [0, j, V, G], is = [0, j, V], sa = [0, j, ra, is, V], u1 = Nt(479097054, na);
z[479097054] = [0, j, sa, ni], z[463370452] = ni, z[464864288] = ra;
var l1 = Nt(462713202, ss);
z[462713202] = sa, z[474472470] = is;
var f1 = class extends p {
  constructor(t) {
    super(t);
  }
}, ia = class extends p {
  constructor(t) {
    super(t);
  }
}, oa = class extends p {
  constructor(t) {
    super(t);
  }
}, aa = class extends p {
  constructor(t) {
    super(t);
  }
}, os = [0, j, V, -1, G], pr = [0, j, V, O];
aa.prototype.g = Gn([0, j, is, [0, j], ns, dr, os, pr]);
var ca = class extends p {
  constructor(t) {
    super(t);
  }
}, d1 = Nt(456383383, ca);
z[456383383] = [0, j, Yo];
var ha = class extends p {
  constructor(t) {
    super(t);
  }
}, p1 = Nt(476348187, ha);
z[476348187] = [0, j, i1];
var ua = class extends p {
  constructor(t) {
    super(t);
  }
}, ri = class extends p {
  constructor(t) {
    super(t);
  }
}, la = [0, Z, -1], g1 = Nt(458105876, class extends p {
  constructor(t) {
    super(t);
  }
  g() {
    let t;
    var e = this.v;
    const n = 0 | e[d];
    return t = ct(this, n), e = (function(r, s, i, o) {
      var a = ri;
      !o && Ne(r) && (i = 0 | (s = r.v)[d]);
      var c = Ut(s, 2);
      if (r = !1, c == null) {
        if (o) return Bs();
        c = [];
      } else if (c.constructor === Dt) {
        if (!(2 & c.J) || o) return c;
        c = c.V();
      } else Array.isArray(c) ? r = !!(2 & (0 | c[d])) : c = [];
      if (o) {
        if (!c.length) return Bs();
        r || (r = !0, tn(c));
      } else r && (r = !1, Xe(c), c = ro(c));
      return !r && 32 & i && Qe(c, 32), i = H(s, i, 2, o = new Dt(c, a, y2, void 0)), r || ue(s, i), o;
    })(this, e, n, t), !t && ri && (e.ra = !0), e;
  }
});
z[458105876] = [0, la, V2, [!0, $t, [0, T, -1, J]], [0, on, O, Z]];
var as = class extends p {
  constructor(t) {
    super(t);
  }
}, fa = Nt(458105758, as);
z[458105758] = [0, j, T, la];
var er = class extends p {
  constructor(t) {
    super(t);
  }
}, si = [0, G2, -1, ie], m1 = class extends p {
  constructor(t) {
    super(t);
  }
}, da = class extends p {
  constructor(t) {
    super(t);
  }
}, gr = [1, 2];
da.prototype.g = Gn([0, gr, x, si, x, [0, q, si]]);
var pa = class extends p {
  constructor(t) {
    super(t);
  }
}, y1 = Nt(443442058, pa);
z[443442058] = [0, j, T, G, V, J, -1, O, V], z[514774813] = os;
var ga = class extends p {
  constructor(t) {
    super(t);
  }
}, _1 = Nt(516587230, ga);
function mr(t, e) {
  return e = e ? e.clone() : new es(), t.displayNamesLocale !== void 0 ? S(e, 1, rn(t.displayNamesLocale)) : t.displayNamesLocale === void 0 && S(e, 1), t.maxResults !== void 0 ? jt(e, 2, t.maxResults) : "maxResults" in t && S(e, 2), t.scoreThreshold !== void 0 ? m(e, 3, t.scoreThreshold) : "scoreThreshold" in t && S(e, 3), t.categoryAllowlist !== void 0 ? wn(e, 4, t.categoryAllowlist) : "categoryAllowlist" in t && S(e, 4), t.categoryDenylist !== void 0 ? wn(e, 5, t.categoryDenylist) : "categoryDenylist" in t && S(e, 5), e;
}
function ma(t) {
  const e = Number(t);
  return Number.isSafeInteger(e) ? e : String(t);
}
function cs(t, e = -1, n = "") {
  return { categories: t.map(((r) => ({ index: yt(r, 1) ?? 0 ?? -1, score: D(r, 2) ?? 0, categoryName: X(P(r, 3)) ?? "" ?? "", displayName: X(P(r, 4)) ?? "" ?? "" }))), headIndex: e, headName: n };
}
function v1(t) {
  const e = { classifications: Vt(t, t1, 1).map(((n) => {
    var r;
    return cs(((r = E(n, Ho, 4)) == null ? void 0 : r.g()) ?? [], yt(n, 2) ?? 0, X(P(n, 3)) ?? "");
  })) };
  return (function(n) {
    return n == null ? n : typeof n == "bigint" ? (cr(n) ? n = Number(n) : (n = en(64, n), n = cr(n) ? Number(n) : String(n)), n) : nn(n) ? typeof n == "number" ? Mr(n) : $i(n) : void 0;
  })(P(t, 2, void 0, void 0, _n)) != null && (e.timestampMs = ma(P(t, 2, void 0, void 0, _n) ?? to)), e;
}
function ya(t) {
  var o, a;
  var e = te(t, 3, Mt, Qt()), n = te(t, 2, Ie, Qt()), r = te(t, 1, X, Qt()), s = te(t, 9, X, Qt());
  const i = { categories: [], keypoints: [] };
  for (let c = 0; c < e.length; c++) i.categories.push({ score: e[c], index: n[c] ?? -1, categoryName: r[c] ?? "", displayName: s[c] ?? "" });
  if ((e = (o = E(t, tr, 4)) == null ? void 0 : o.l()) && (i.boundingBox = { originX: yt(e, 1, Gt) ?? 0, originY: yt(e, 2, Gt) ?? 0, width: yt(e, 3, Gt) ?? 0, height: yt(e, 4, Gt) ?? 0, angle: 0 }), (a = E(t, tr, 4)) == null ? void 0 : a.g().length) for (const c of E(t, tr, 4).g()) i.keypoints.push({ x: P(c, 1, void 0, Gt, Mt) ?? 0, y: P(c, 2, void 0, Gt, Mt) ?? 0, score: P(c, 4, void 0, Gt, Mt) ?? 0, label: X(P(c, 3, void 0, Gt)) ?? "" });
  return i;
}
function Wn(t) {
  const e = [];
  for (const n of Vt(t, qo, 1)) e.push({ x: D(n, 1) ?? 0, y: D(n, 2) ?? 0, z: D(n, 3) ?? 0, visibility: D(n, 4) ?? 0 });
  return e;
}
function $e(t) {
  const e = [];
  for (const n of Vt(t, Ko, 1)) e.push({ x: D(n, 1) ?? 0, y: D(n, 2) ?? 0, z: D(n, 3) ?? 0, visibility: D(n, 4) ?? 0 });
  return e;
}
function ii(t) {
  return Array.from(t, ((e) => e > 127 ? e - 256 : e));
}
function oi(t, e) {
  if (t.length !== e.length) throw Error(`Cannot compute cosine similarity between embeddings of different sizes (${t.length} vs. ${e.length}).`);
  let n = 0, r = 0, s = 0;
  for (let i = 0; i < t.length; i++) n += t[i] * e[i], r += t[i] * t[i], s += e[i] * e[i];
  if (r <= 0 || s <= 0) throw Error("Cannot compute cosine similarity on embedding with 0 norm.");
  return n / Math.sqrt(r * s);
}
let fn;
z[516587230] = [0, j, os, pr, V], z[518928384] = pr;
const w1 = new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 96, 0, 1, 123, 3, 2, 1, 0, 10, 10, 1, 8, 0, 65, 0, 253, 15, 253, 98, 11]);
async function _a(t) {
  if (t) return !0;
  if (fn === void 0) try {
    await WebAssembly.instantiate(w1), fn = !0;
  } catch {
    fn = !1;
  }
  return fn;
}
async function dn(t, e, n) {
  return { wasmLoaderPath: `${e}/${t}_${n = `wasm${n ? "_module" : ""}${await _a(n) ? "" : "_nosimd"}_internal`}.js`, wasmBinaryPath: `${e}/${t}_${n}.wasm` };
}
var ge = class {
};
function va() {
  var t = navigator;
  return typeof OffscreenCanvas < "u" && (!(function(e = navigator) {
    return (e = e.userAgent).includes("Safari") && !e.includes("Chrome");
  })(t) || !!((t = t.userAgent.match(/Version\/([\d]+).*Safari/)) && t.length >= 1 && Number(t[1]) >= 17));
}
async function ai(t) {
  if (typeof importScripts != "function") {
    const e = document.createElement("script");
    return e.src = t.toString(), e.crossOrigin = "anonymous", new Promise(((n, r) => {
      e.addEventListener("load", (() => {
        n();
      }), !1), e.addEventListener("error", ((s) => {
        r(s);
      }), !1), document.body.appendChild(e);
    }));
  }
  try {
    importScripts(t.toString());
  } catch (e) {
    if (!(e instanceof TypeError)) throw e;
    {
      const n = self.import;
      n ? await n(t.toString()) : await import(t.toString());
    }
  }
}
function wa(t) {
  return t.videoWidth !== void 0 ? [t.videoWidth, t.videoHeight] : t.naturalWidth !== void 0 ? [t.naturalWidth, t.naturalHeight] : t.displayWidth !== void 0 ? [t.displayWidth, t.displayHeight] : [t.width, t.height];
}
function g(t, e, n) {
  t.m || console.error("No wasm multistream support detected: ensure dependency inclusion of :gl_graph_runner_internal_multi_input target"), n(e = t.i.stringToNewUTF8(e)), t.i._free(e);
}
function ci(t, e, n) {
  if (!t.i.canvas) throw Error("No OpenGL canvas configured.");
  if (n ? t.i._bindTextureToStream(n) : t.i._bindTextureToCanvas(), !(n = t.i.canvas.getContext("webgl2") || t.i.canvas.getContext("webgl"))) throw Error("Failed to obtain WebGL context from the provided canvas. `getContext()` should only be invoked with `webgl` or `webgl2`.");
  t.i.gpuOriginForWebTexturesIsBottomLeft && n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL, !0), n.texImage2D(n.TEXTURE_2D, 0, n.RGBA, n.RGBA, n.UNSIGNED_BYTE, e), t.i.gpuOriginForWebTexturesIsBottomLeft && n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL, !1);
  const [r, s] = wa(e);
  return !t.l || r === t.i.canvas.width && s === t.i.canvas.height || (t.i.canvas.width = r, t.i.canvas.height = s), [r, s];
}
function hi(t, e, n) {
  t.m || console.error("No wasm multistream support detected: ensure dependency inclusion of :gl_graph_runner_internal_multi_input target");
  const r = new Uint32Array(e.length);
  for (let s = 0; s < e.length; s++) r[s] = t.i.stringToNewUTF8(e[s]);
  e = t.i._malloc(4 * r.length), t.i.HEAPU32.set(r, e >> 2), n(e);
  for (const s of r) t.i._free(s);
  t.i._free(e);
}
function Lt(t, e, n) {
  t.i.simpleListeners = t.i.simpleListeners || {}, t.i.simpleListeners[e] = n;
}
function Ht(t, e, n) {
  let r = [];
  t.i.simpleListeners = t.i.simpleListeners || {}, t.i.simpleListeners[e] = (s, i, o) => {
    i ? (n(r, o), r = []) : r.push(s);
  };
}
ge.forVisionTasks = function(t, e = !1) {
  return dn("vision", t ?? ln``, e);
}, ge.forTextTasks = function(t, e = !1) {
  return dn("text", t ?? ln``, e);
}, ge.forGenAiTasks = function(t, e = !1) {
  return dn("genai", t ?? ln``, e);
}, ge.forAudioTasks = function(t, e = !1) {
  return dn("audio", t ?? ln``, e);
}, ge.isSimdSupported = function(t = !1) {
  return _a(t);
};
async function b1(t, e, n, r) {
  return t = await (async (s, i, o, a, c) => {
    if (i && await ai(i), !self.ModuleFactory || o && (await ai(o), !self.ModuleFactory)) throw Error("ModuleFactory not set.");
    return self.Module && c && ((i = self.Module).locateFile = c.locateFile, c.mainScriptUrlOrBlob && (i.mainScriptUrlOrBlob = c.mainScriptUrlOrBlob)), c = await self.ModuleFactory(self.Module || c), self.ModuleFactory = self.Module = void 0, new s(c, a);
  })(t, n.wasmLoaderPath, n.assetLoaderPath, e, { locateFile: (s) => s.endsWith(".wasm") ? n.wasmBinaryPath.toString() : n.assetBinaryPath && s.endsWith(".data") ? n.assetBinaryPath.toString() : s }), await t.o(r), t;
}
function nr(t, e) {
  const n = E(t.baseOptions, kn, 1) || new kn();
  typeof e == "string" ? (S(n, 2, rn(e)), S(n, 1)) : e instanceof Uint8Array && (S(n, 1, Sr(e, !1)), S(n, 2)), y(t.baseOptions, 0, 1, n);
}
function ui(t) {
  try {
    const e = t.H.length;
    if (e === 1) throw Error(t.H[0].message);
    if (e > 1) throw Error("Encountered multiple errors: " + t.H.map(((n) => n.message)).join(", "));
  } finally {
    t.H = [];
  }
}
function f(t, e) {
  t.C = Math.max(t.C, e);
}
function Kn(t, e) {
  t.B = new nt(), ht(t.B, 2, "PassThroughCalculator"), M(t.B, "free_memory"), b(t.B, "free_memory_unused_out"), I(e, "free_memory"), vt(e, t.B);
}
function Le(t, e) {
  M(t.B, e), b(t.B, e + "_unused_out");
}
function qn(t) {
  t.g.addBoolToStream(!0, "free_memory", t.C);
}
var yr = class {
  constructor(t) {
    this.g = t, this.H = [], this.C = 0, this.g.setAutoRenderToScreen(!1);
  }
  l(t, e = !0) {
    var n, r, s, i, o, a;
    if (e) {
      const c = t.baseOptions || {};
      if ((n = t.baseOptions) != null && n.modelAssetBuffer && ((r = t.baseOptions) != null && r.modelAssetPath)) throw Error("Cannot set both baseOptions.modelAssetPath and baseOptions.modelAssetBuffer");
      if (!((s = E(this.baseOptions, kn, 1)) != null && s.g() || (i = E(this.baseOptions, kn, 1)) != null && i.l() || (o = t.baseOptions) != null && o.modelAssetBuffer || (a = t.baseOptions) != null && a.modelAssetPath)) throw Error("Either baseOptions.modelAssetPath or baseOptions.modelAssetBuffer must be set");
      if ((function(u, h) {
        let l = E(u.baseOptions, ei, 3);
        if (!l) {
          var _ = l = new ei(), w = new Xs();
          Ke(_, 4, yn, w);
        }
        "delegate" in h && (h.delegate === "GPU" ? (h = l, _ = new q2(), Ke(h, 2, yn, _)) : (h = l, _ = new Xs(), Ke(h, 4, yn, _))), y(u.baseOptions, 0, 3, l);
      })(this, c), c.modelAssetPath) return fetch(c.modelAssetPath.toString()).then(((u) => {
        if (u.ok) return u.arrayBuffer();
        throw Error(`Failed to fetch model: ${c.modelAssetPath} (${u.status})`);
      })).then(((u) => {
        try {
          this.g.i.FS_unlink("/model.dat");
        } catch {
        }
        this.g.i.FS_createDataFile("/", "model.dat", new Uint8Array(u), !0, !1, !1), nr(this, "/model.dat"), this.m(), this.L();
      }));
      if (c.modelAssetBuffer instanceof Uint8Array) nr(this, c.modelAssetBuffer);
      else if (c.modelAssetBuffer) return (async function(u) {
        const h = [];
        for (var l = 0; ; ) {
          const { done: _, value: w } = await u.read();
          if (_) break;
          h.push(w), l += w.length;
        }
        if (h.length === 0) return new Uint8Array(0);
        if (h.length === 1) return h[0];
        u = new Uint8Array(l), l = 0;
        for (const _ of h) u.set(_, l), l += _.length;
        return u;
      })(c.modelAssetBuffer).then(((u) => {
        nr(this, u), this.m(), this.L();
      }));
    }
    return this.m(), this.L(), Promise.resolve();
  }
  L() {
  }
  ca() {
    let t;
    if (this.g.ca(((e) => {
      t = $2(e);
    })), !t) throw Error("Failed to retrieve CalculatorGraphConfig");
    return t;
  }
  setGraph(t, e) {
    this.g.attachErrorListener(((n, r) => {
      this.H.push(Error(r));
    })), this.g.Ja(), this.g.setGraph(t, e), this.B = void 0, ui(this);
  }
  finishProcessing() {
    this.g.finishProcessing(), ui(this);
  }
  close() {
    this.B = void 0, this.g.closeGraph();
  }
};
function Kt(t, e) {
  if (!t) throw Error(`Unable to obtain required WebGL resource: ${e}`);
  return t;
}
yr.prototype.close = yr.prototype.close;
class A1 {
  constructor(e, n, r, s) {
    this.g = e, this.h = n, this.m = r, this.l = s;
  }
  bind() {
    this.g.bindVertexArray(this.h);
  }
  close() {
    this.g.deleteVertexArray(this.h), this.g.deleteBuffer(this.m), this.g.deleteBuffer(this.l);
  }
}
function li(t, e, n) {
  const r = t.g;
  if (n = Kt(r.createShader(n), "Failed to create WebGL shader"), r.shaderSource(n, e), r.compileShader(n), !r.getShaderParameter(n, r.COMPILE_STATUS)) throw Error(`Could not compile WebGL shader: ${r.getShaderInfoLog(n)}`);
  return r.attachShader(t.h, n), n;
}
function fi(t, e) {
  const n = t.g, r = Kt(n.createVertexArray(), "Failed to create vertex array");
  n.bindVertexArray(r);
  const s = Kt(n.createBuffer(), "Failed to create buffer");
  n.bindBuffer(n.ARRAY_BUFFER, s), n.enableVertexAttribArray(t.O), n.vertexAttribPointer(t.O, 2, n.FLOAT, !1, 0, 0), n.bufferData(n.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), n.STATIC_DRAW);
  const i = Kt(n.createBuffer(), "Failed to create buffer");
  return n.bindBuffer(n.ARRAY_BUFFER, i), n.enableVertexAttribArray(t.L), n.vertexAttribPointer(t.L, 2, n.FLOAT, !1, 0, 0), n.bufferData(n.ARRAY_BUFFER, new Float32Array(e ? [0, 1, 0, 0, 1, 0, 1, 1] : [0, 0, 0, 1, 1, 1, 1, 0]), n.STATIC_DRAW), n.bindBuffer(n.ARRAY_BUFFER, null), n.bindVertexArray(null), new A1(n, r, s, i);
}
function hs(t, e) {
  if (t.g) {
    if (e !== t.g) throw Error("Cannot change GL context once initialized");
  } else t.g = e;
}
function E1(t, e, n, r) {
  return hs(t, e), t.h || (t.m(), t.D()), n ? (t.u || (t.u = fi(t, !0)), n = t.u) : (t.A || (t.A = fi(t, !1)), n = t.A), e.useProgram(t.h), n.bind(), t.l(), t = r(), n.g.bindVertexArray(null), t;
}
function ba(t, e, n) {
  return hs(t, e), t = Kt(e.createTexture(), "Failed to create texture"), e.bindTexture(e.TEXTURE_2D, t), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_S, e.CLAMP_TO_EDGE), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_T, e.CLAMP_TO_EDGE), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, n ?? e.LINEAR), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAG_FILTER, n ?? e.LINEAR), e.bindTexture(e.TEXTURE_2D, null), t;
}
function Aa(t, e, n) {
  hs(t, e), t.B || (t.B = Kt(e.createFramebuffer(), "Failed to create framebuffe.")), e.bindFramebuffer(e.FRAMEBUFFER, t.B), e.framebufferTexture2D(e.FRAMEBUFFER, e.COLOR_ATTACHMENT0, e.TEXTURE_2D, n, 0);
}
function k1(t) {
  var e;
  (e = t.g) == null || e.bindFramebuffer(t.g.FRAMEBUFFER, null);
}
var Ea = class {
  H() {
    return `
  precision mediump float;
  varying vec2 vTex;
  uniform sampler2D inputTexture;
  void main() {
    gl_FragColor = texture2D(inputTexture, vTex);
  }
 `;
  }
  m() {
    const t = this.g;
    if (this.h = Kt(t.createProgram(), "Failed to create WebGL program"), this.X = li(this, `
  attribute vec2 aVertex;
  attribute vec2 aTex;
  varying vec2 vTex;
  void main(void) {
    gl_Position = vec4(aVertex, 0.0, 1.0);
    vTex = aTex;
  }`, t.VERTEX_SHADER), this.W = li(this, this.H(), t.FRAGMENT_SHADER), t.linkProgram(this.h), !t.getProgramParameter(this.h, t.LINK_STATUS)) throw Error(`Error during program linking: ${t.getProgramInfoLog(this.h)}`);
    this.O = t.getAttribLocation(this.h, "aVertex"), this.L = t.getAttribLocation(this.h, "aTex");
  }
  D() {
  }
  l() {
  }
  close() {
    if (this.h) {
      const t = this.g;
      t.deleteProgram(this.h), t.deleteShader(this.X), t.deleteShader(this.W);
    }
    this.B && this.g.deleteFramebuffer(this.B), this.A && this.A.close(), this.u && this.u.close();
  }
};
function Bt(t, e) {
  switch (e) {
    case 0:
      return t.g.find(((n) => n instanceof Uint8Array));
    case 1:
      return t.g.find(((n) => n instanceof Float32Array));
    case 2:
      return t.g.find(((n) => typeof WebGLTexture < "u" && n instanceof WebGLTexture));
    default:
      throw Error(`Type is not supported: ${e}`);
  }
}
function _r(t) {
  var e = Bt(t, 1);
  if (!e) {
    if (e = Bt(t, 0)) e = new Float32Array(e).map(((r) => r / 255));
    else {
      e = new Float32Array(t.width * t.height);
      const r = xe(t);
      var n = us(t);
      if (Aa(n, r, ka(t)), "iPad Simulator;iPhone Simulator;iPod Simulator;iPad;iPhone;iPod".split(";").includes(navigator.platform) || navigator.userAgent.includes("Mac") && "document" in self && "ontouchend" in self.document) {
        n = new Float32Array(t.width * t.height * 4), r.readPixels(0, 0, t.width, t.height, r.RGBA, r.FLOAT, n);
        for (let s = 0, i = 0; s < e.length; ++s, i += 4) e[s] = n[i];
      } else r.readPixels(0, 0, t.width, t.height, r.RED, r.FLOAT, e);
    }
    t.g.push(e);
  }
  return e;
}
function ka(t) {
  let e = Bt(t, 2);
  if (!e) {
    const n = xe(t);
    e = Ta(t);
    const r = _r(t), s = Sa(t);
    n.texImage2D(n.TEXTURE_2D, 0, s, t.width, t.height, 0, n.RED, n.FLOAT, r), vr(t);
  }
  return e;
}
function xe(t) {
  if (!t.canvas) throw Error("Conversion to different image formats require that a canvas is passed when initializing the image.");
  return t.h || (t.h = Kt(t.canvas.getContext("webgl2"), "You cannot use a canvas that is already bound to a different type of rendering context.")), t.h;
}
function Sa(t) {
  if (t = xe(t), !pn) if (t.getExtension("EXT_color_buffer_float") && t.getExtension("OES_texture_float_linear") && t.getExtension("EXT_float_blend")) pn = t.R32F;
  else {
    if (!t.getExtension("EXT_color_buffer_half_float")) throw Error("GPU does not fully support 4-channel float32 or float16 formats");
    pn = t.R16F;
  }
  return pn;
}
function us(t) {
  return t.l || (t.l = new Ea()), t.l;
}
function Ta(t) {
  const e = xe(t);
  e.viewport(0, 0, t.width, t.height), e.activeTexture(e.TEXTURE0);
  let n = Bt(t, 2);
  return n || (n = ba(us(t), e, t.m ? e.LINEAR : e.NEAREST), t.g.push(n), t.j = !0), e.bindTexture(e.TEXTURE_2D, n), n;
}
function vr(t) {
  t.h.bindTexture(t.h.TEXTURE_2D, null);
}
var pn, K = class {
  constructor(t, e, n, r, s, i, o) {
    this.g = t, this.m = e, this.j = n, this.canvas = r, this.l = s, this.width = i, this.height = o, this.j && --di === 0 && console.error("You seem to be creating MPMask instances without invoking .close(). This leaks resources.");
  }
  Fa() {
    return !!Bt(this, 0);
  }
  ka() {
    return !!Bt(this, 1);
  }
  R() {
    return !!Bt(this, 2);
  }
  ja() {
    return (e = Bt(t = this, 0)) || (e = _r(t), e = new Uint8Array(e.map(((n) => Math.round(255 * n)))), t.g.push(e)), e;
    var t, e;
  }
  ia() {
    return _r(this);
  }
  N() {
    return ka(this);
  }
  clone() {
    const t = [];
    for (const e of this.g) {
      let n;
      if (e instanceof Uint8Array) n = new Uint8Array(e);
      else if (e instanceof Float32Array) n = new Float32Array(e);
      else {
        if (!(e instanceof WebGLTexture)) throw Error(`Type is not supported: ${e}`);
        {
          const r = xe(this), s = us(this);
          r.activeTexture(r.TEXTURE1), n = ba(s, r, this.m ? r.LINEAR : r.NEAREST), r.bindTexture(r.TEXTURE_2D, n);
          const i = Sa(this);
          r.texImage2D(r.TEXTURE_2D, 0, i, this.width, this.height, 0, r.RED, r.FLOAT, null), r.bindTexture(r.TEXTURE_2D, null), Aa(s, r, n), E1(s, r, !1, (() => {
            Ta(this), r.clearColor(0, 0, 0, 0), r.clear(r.COLOR_BUFFER_BIT), r.drawArrays(r.TRIANGLE_FAN, 0, 4), vr(this);
          })), k1(s), vr(this);
        }
      }
      t.push(n);
    }
    return new K(t, this.m, this.R(), this.canvas, this.l, this.width, this.height);
  }
  close() {
    this.j && xe(this).deleteTexture(Bt(this, 2)), di = -1;
  }
};
K.prototype.close = K.prototype.close, K.prototype.clone = K.prototype.clone, K.prototype.getAsWebGLTexture = K.prototype.N, K.prototype.getAsFloat32Array = K.prototype.ia, K.prototype.getAsUint8Array = K.prototype.ja, K.prototype.hasWebGLTexture = K.prototype.R, K.prototype.hasFloat32Array = K.prototype.ka, K.prototype.hasUint8Array = K.prototype.Fa;
var di = 250;
function bt(...t) {
  return t.map((([e, n]) => ({ start: e, end: n })));
}
const S1 = /* @__PURE__ */ (function(t) {
  return class extends t {
    Ja() {
      this.i._registerModelResourcesGraphService();
    }
  };
})((pi = class {
  constructor(t, e) {
    this.l = !0, this.i = t, this.g = null, this.h = 0, this.m = typeof this.i._addIntToInputStream == "function", e !== void 0 ? this.i.canvas = e : va() ? this.i.canvas = new OffscreenCanvas(1, 1) : (console.warn("OffscreenCanvas not supported and GraphRunner constructor glCanvas parameter is undefined. Creating backup canvas."), this.i.canvas = document.createElement("canvas"));
  }
  async initializeGraph(t) {
    const e = await (await fetch(t)).arrayBuffer();
    t = !(t.endsWith(".pbtxt") || t.endsWith(".textproto")), this.setGraph(new Uint8Array(e), t);
  }
  setGraphFromString(t) {
    this.setGraph(new TextEncoder().encode(t), !1);
  }
  setGraph(t, e) {
    const n = t.length, r = this.i._malloc(n);
    this.i.HEAPU8.set(t, r), e ? this.i._changeBinaryGraph(n, r) : this.i._changeTextGraph(n, r), this.i._free(r);
  }
  configureAudio(t, e, n, r, s) {
    this.i._configureAudio || console.warn('Attempting to use configureAudio without support for input audio. Is build dep ":gl_graph_runner_audio" missing?'), g(this, r || "input_audio", ((i) => {
      g(this, s = s || "audio_header", ((o) => {
        this.i._configureAudio(i, o, t, e ?? 0, n);
      }));
    }));
  }
  setAutoResizeCanvas(t) {
    this.l = t;
  }
  setAutoRenderToScreen(t) {
    this.i._setAutoRenderToScreen(t);
  }
  setGpuBufferVerticalFlip(t) {
    this.i.gpuOriginForWebTexturesIsBottomLeft = t;
  }
  ca(t) {
    Lt(this, "__graph_config__", ((e) => {
      t(e);
    })), g(this, "__graph_config__", ((e) => {
      this.i._getGraphConfig(e, void 0);
    })), delete this.i.simpleListeners.__graph_config__;
  }
  attachErrorListener(t) {
    this.i.errorListener = t;
  }
  attachEmptyPacketListener(t, e) {
    this.i.emptyPacketListeners = this.i.emptyPacketListeners || {}, this.i.emptyPacketListeners[t] = e;
  }
  addAudioToStream(t, e, n) {
    this.addAudioToStreamWithShape(t, 0, 0, e, n);
  }
  addAudioToStreamWithShape(t, e, n, r, s) {
    const i = 4 * t.length;
    this.h !== i && (this.g && this.i._free(this.g), this.g = this.i._malloc(i), this.h = i), this.i.HEAPF32.set(t, this.g / 4), g(this, r, ((o) => {
      this.i._addAudioToInputStream(this.g, e, n, o, s);
    }));
  }
  addGpuBufferToStream(t, e, n) {
    g(this, e, ((r) => {
      const [s, i] = ci(this, t, r);
      this.i._addBoundTextureToStream(r, s, i, n);
    }));
  }
  addBoolToStream(t, e, n) {
    g(this, e, ((r) => {
      this.i._addBoolToInputStream(t, r, n);
    }));
  }
  addDoubleToStream(t, e, n) {
    g(this, e, ((r) => {
      this.i._addDoubleToInputStream(t, r, n);
    }));
  }
  addFloatToStream(t, e, n) {
    g(this, e, ((r) => {
      this.i._addFloatToInputStream(t, r, n);
    }));
  }
  addIntToStream(t, e, n) {
    g(this, e, ((r) => {
      this.i._addIntToInputStream(t, r, n);
    }));
  }
  addUintToStream(t, e, n) {
    g(this, e, ((r) => {
      this.i._addUintToInputStream(t, r, n);
    }));
  }
  addStringToStream(t, e, n) {
    g(this, e, ((r) => {
      g(this, t, ((s) => {
        this.i._addStringToInputStream(s, r, n);
      }));
    }));
  }
  addStringRecordToStream(t, e, n) {
    g(this, e, ((r) => {
      hi(this, Object.keys(t), ((s) => {
        hi(this, Object.values(t), ((i) => {
          this.i._addFlatHashMapToInputStream(s, i, Object.keys(t).length, r, n);
        }));
      }));
    }));
  }
  addProtoToStream(t, e, n, r) {
    g(this, n, ((s) => {
      g(this, e, ((i) => {
        const o = this.i._malloc(t.length);
        this.i.HEAPU8.set(t, o), this.i._addProtoToInputStream(o, t.length, i, s, r), this.i._free(o);
      }));
    }));
  }
  addEmptyPacketToStream(t, e) {
    g(this, t, ((n) => {
      this.i._addEmptyPacketToInputStream(n, e);
    }));
  }
  addBoolVectorToStream(t, e, n) {
    g(this, e, ((r) => {
      const s = this.i._allocateBoolVector(t.length);
      if (!s) throw Error("Unable to allocate new bool vector on heap.");
      for (const i of t) this.i._addBoolVectorEntry(s, i);
      this.i._addBoolVectorToInputStream(s, r, n);
    }));
  }
  addDoubleVectorToStream(t, e, n) {
    g(this, e, ((r) => {
      const s = this.i._allocateDoubleVector(t.length);
      if (!s) throw Error("Unable to allocate new double vector on heap.");
      for (const i of t) this.i._addDoubleVectorEntry(s, i);
      this.i._addDoubleVectorToInputStream(s, r, n);
    }));
  }
  addFloatVectorToStream(t, e, n) {
    g(this, e, ((r) => {
      const s = this.i._allocateFloatVector(t.length);
      if (!s) throw Error("Unable to allocate new float vector on heap.");
      for (const i of t) this.i._addFloatVectorEntry(s, i);
      this.i._addFloatVectorToInputStream(s, r, n);
    }));
  }
  addIntVectorToStream(t, e, n) {
    g(this, e, ((r) => {
      const s = this.i._allocateIntVector(t.length);
      if (!s) throw Error("Unable to allocate new int vector on heap.");
      for (const i of t) this.i._addIntVectorEntry(s, i);
      this.i._addIntVectorToInputStream(s, r, n);
    }));
  }
  addUintVectorToStream(t, e, n) {
    g(this, e, ((r) => {
      const s = this.i._allocateUintVector(t.length);
      if (!s) throw Error("Unable to allocate new unsigned int vector on heap.");
      for (const i of t) this.i._addUintVectorEntry(s, i);
      this.i._addUintVectorToInputStream(s, r, n);
    }));
  }
  addStringVectorToStream(t, e, n) {
    g(this, e, ((r) => {
      const s = this.i._allocateStringVector(t.length);
      if (!s) throw Error("Unable to allocate new string vector on heap.");
      for (const i of t) g(this, i, ((o) => {
        this.i._addStringVectorEntry(s, o);
      }));
      this.i._addStringVectorToInputStream(s, r, n);
    }));
  }
  addBoolToInputSidePacket(t, e) {
    g(this, e, ((n) => {
      this.i._addBoolToInputSidePacket(t, n);
    }));
  }
  addDoubleToInputSidePacket(t, e) {
    g(this, e, ((n) => {
      this.i._addDoubleToInputSidePacket(t, n);
    }));
  }
  addFloatToInputSidePacket(t, e) {
    g(this, e, ((n) => {
      this.i._addFloatToInputSidePacket(t, n);
    }));
  }
  addIntToInputSidePacket(t, e) {
    g(this, e, ((n) => {
      this.i._addIntToInputSidePacket(t, n);
    }));
  }
  addUintToInputSidePacket(t, e) {
    g(this, e, ((n) => {
      this.i._addUintToInputSidePacket(t, n);
    }));
  }
  addStringToInputSidePacket(t, e) {
    g(this, e, ((n) => {
      g(this, t, ((r) => {
        this.i._addStringToInputSidePacket(r, n);
      }));
    }));
  }
  addProtoToInputSidePacket(t, e, n) {
    g(this, n, ((r) => {
      g(this, e, ((s) => {
        const i = this.i._malloc(t.length);
        this.i.HEAPU8.set(t, i), this.i._addProtoToInputSidePacket(i, t.length, s, r), this.i._free(i);
      }));
    }));
  }
  addBoolVectorToInputSidePacket(t, e) {
    g(this, e, ((n) => {
      const r = this.i._allocateBoolVector(t.length);
      if (!r) throw Error("Unable to allocate new bool vector on heap.");
      for (const s of t) this.i._addBoolVectorEntry(r, s);
      this.i._addBoolVectorToInputSidePacket(r, n);
    }));
  }
  addDoubleVectorToInputSidePacket(t, e) {
    g(this, e, ((n) => {
      const r = this.i._allocateDoubleVector(t.length);
      if (!r) throw Error("Unable to allocate new double vector on heap.");
      for (const s of t) this.i._addDoubleVectorEntry(r, s);
      this.i._addDoubleVectorToInputSidePacket(r, n);
    }));
  }
  addFloatVectorToInputSidePacket(t, e) {
    g(this, e, ((n) => {
      const r = this.i._allocateFloatVector(t.length);
      if (!r) throw Error("Unable to allocate new float vector on heap.");
      for (const s of t) this.i._addFloatVectorEntry(r, s);
      this.i._addFloatVectorToInputSidePacket(r, n);
    }));
  }
  addIntVectorToInputSidePacket(t, e) {
    g(this, e, ((n) => {
      const r = this.i._allocateIntVector(t.length);
      if (!r) throw Error("Unable to allocate new int vector on heap.");
      for (const s of t) this.i._addIntVectorEntry(r, s);
      this.i._addIntVectorToInputSidePacket(r, n);
    }));
  }
  addUintVectorToInputSidePacket(t, e) {
    g(this, e, ((n) => {
      const r = this.i._allocateUintVector(t.length);
      if (!r) throw Error("Unable to allocate new unsigned int vector on heap.");
      for (const s of t) this.i._addUintVectorEntry(r, s);
      this.i._addUintVectorToInputSidePacket(r, n);
    }));
  }
  addStringVectorToInputSidePacket(t, e) {
    g(this, e, ((n) => {
      const r = this.i._allocateStringVector(t.length);
      if (!r) throw Error("Unable to allocate new string vector on heap.");
      for (const s of t) g(this, s, ((i) => {
        this.i._addStringVectorEntry(r, i);
      }));
      this.i._addStringVectorToInputSidePacket(r, n);
    }));
  }
  attachBoolListener(t, e) {
    Lt(this, t, e), g(this, t, ((n) => {
      this.i._attachBoolListener(n);
    }));
  }
  attachBoolVectorListener(t, e) {
    Ht(this, t, e), g(this, t, ((n) => {
      this.i._attachBoolVectorListener(n);
    }));
  }
  attachIntListener(t, e) {
    Lt(this, t, e), g(this, t, ((n) => {
      this.i._attachIntListener(n);
    }));
  }
  attachIntVectorListener(t, e) {
    Ht(this, t, e), g(this, t, ((n) => {
      this.i._attachIntVectorListener(n);
    }));
  }
  attachUintListener(t, e) {
    Lt(this, t, e), g(this, t, ((n) => {
      this.i._attachUintListener(n);
    }));
  }
  attachUintVectorListener(t, e) {
    Ht(this, t, e), g(this, t, ((n) => {
      this.i._attachUintVectorListener(n);
    }));
  }
  attachDoubleListener(t, e) {
    Lt(this, t, e), g(this, t, ((n) => {
      this.i._attachDoubleListener(n);
    }));
  }
  attachDoubleVectorListener(t, e) {
    Ht(this, t, e), g(this, t, ((n) => {
      this.i._attachDoubleVectorListener(n);
    }));
  }
  attachFloatListener(t, e) {
    Lt(this, t, e), g(this, t, ((n) => {
      this.i._attachFloatListener(n);
    }));
  }
  attachFloatVectorListener(t, e) {
    Ht(this, t, e), g(this, t, ((n) => {
      this.i._attachFloatVectorListener(n);
    }));
  }
  attachStringListener(t, e) {
    Lt(this, t, e), g(this, t, ((n) => {
      this.i._attachStringListener(n);
    }));
  }
  attachStringVectorListener(t, e) {
    Ht(this, t, e), g(this, t, ((n) => {
      this.i._attachStringVectorListener(n);
    }));
  }
  attachProtoListener(t, e, n) {
    Lt(this, t, e), g(this, t, ((r) => {
      this.i._attachProtoListener(r, n || !1);
    }));
  }
  attachProtoVectorListener(t, e, n) {
    Ht(this, t, e), g(this, t, ((r) => {
      this.i._attachProtoVectorListener(r, n || !1);
    }));
  }
  attachAudioListener(t, e, n) {
    this.i._attachAudioListener || console.warn('Attempting to use attachAudioListener without support for output audio. Is build dep ":gl_graph_runner_audio_out" missing?'), Lt(this, t, ((r, s) => {
      r = new Float32Array(r.buffer, r.byteOffset, r.length / 4), e(r, s);
    })), g(this, t, ((r) => {
      this.i._attachAudioListener(r, n || !1);
    }));
  }
  finishProcessing() {
    this.i._waitUntilIdle();
  }
  closeGraph() {
    this.i._closeGraph(), this.i.simpleListeners = void 0, this.i.emptyPacketListeners = void 0;
  }
}, class extends pi {
  get ga() {
    return this.i;
  }
  pa(t, e, n) {
    g(this, e, ((r) => {
      const [s, i] = ci(this, t, r);
      this.ga._addBoundTextureAsImageToStream(r, s, i, n);
    }));
  }
  Z(t, e) {
    Lt(this, t, e), g(this, t, ((n) => {
      this.ga._attachImageListener(n);
    }));
  }
  aa(t, e) {
    Ht(this, t, e), g(this, t, ((n) => {
      this.ga._attachImageVectorListener(n);
    }));
  }
}));
var pi, At = class extends S1 {
};
async function A(t, e, n) {
  return (async function(r, s, i, o) {
    return b1(r, s, i, o);
  })(t, n.canvas ?? (va() ? void 0 : document.createElement("canvas")), e, n);
}
function La(t, e, n, r) {
  if (t.U) {
    const i = new $o();
    if (n != null && n.regionOfInterest) {
      if (!t.oa) throw Error("This task doesn't support region-of-interest.");
      var s = n.regionOfInterest;
      if (s.left >= s.right || s.top >= s.bottom) throw Error("Expected RectF with left < right and top < bottom.");
      if (s.left < 0 || s.top < 0 || s.right > 1 || s.bottom > 1) throw Error("Expected RectF values to be in [0,1].");
      m(i, 1, (s.left + s.right) / 2), m(i, 2, (s.top + s.bottom) / 2), m(i, 4, s.right - s.left), m(i, 3, s.bottom - s.top);
    } else m(i, 1, 0.5), m(i, 2, 0.5), m(i, 4, 1), m(i, 3, 1);
    if (n != null && n.rotationDegrees) {
      if ((n == null ? void 0 : n.rotationDegrees) % 90 != 0) throw Error("Expected rotation to be a multiple of 90°.");
      if (m(i, 5, -Math.PI * n.rotationDegrees / 180), (n == null ? void 0 : n.rotationDegrees) % 180 != 0) {
        const [o, a] = wa(e);
        n = D(i, 3) * a / o, s = D(i, 4) * o / a, m(i, 4, n), m(i, 3, s);
      }
    }
    t.g.addProtoToStream(i.g(), "mediapipe.NormalizedRect", t.U, r);
  }
  t.g.pa(e, t.X, r ?? performance.now()), t.finishProcessing();
}
function Et(t, e, n) {
  var r;
  if ((r = t.baseOptions) != null && r.g()) throw Error("Task is not initialized with image mode. 'runningMode' must be set to 'IMAGE'.");
  La(t, e, n, t.C + 1);
}
function Rt(t, e, n, r) {
  var s;
  if (!((s = t.baseOptions) != null && s.g())) throw Error("Task is not initialized with video mode. 'runningMode' must be set to 'VIDEO'.");
  La(t, e, n, r);
}
function Me(t, e, n, r) {
  var s = e.data;
  const i = e.width, o = i * (e = e.height);
  if ((s instanceof Uint8Array || s instanceof Float32Array) && s.length !== o) throw Error("Unsupported channel count: " + s.length / o);
  return t = new K([s], n, !1, t.g.i.canvas, t.P, i, e), r ? t.clone() : t;
}
var ut = class extends yr {
  constructor(t, e, n, r) {
    super(t), this.g = t, this.X = e, this.U = n, this.oa = r, this.P = new Ea();
  }
  l(t, e = !0) {
    if ("runningMode" in t && S(this.baseOptions, 2, Je(!!t.runningMode && t.runningMode !== "IMAGE")), t.canvas !== void 0 && this.g.i.canvas !== t.canvas) throw Error("You must create a new task to reset the canvas.");
    return super.l(t, e);
  }
  close() {
    this.P.close(), super.close();
  }
};
ut.prototype.close = ut.prototype.close;
var pt = class extends ut {
  constructor(t, e) {
    super(new At(t, e), "image_in", "norm_rect_in", !1), this.j = { detections: [] }, y(t = this.h = new zn(), 0, 1, e = new R()), m(this.h, 2, 0.5), m(this.h, 3, 0.3);
  }
  get baseOptions() {
    return E(this.h, R, 1);
  }
  set baseOptions(t) {
    y(this.h, 0, 1, t);
  }
  o(t) {
    return "minDetectionConfidence" in t && m(this.h, 2, t.minDetectionConfidence ?? 0.5), "minSuppressionThreshold" in t && m(this.h, 3, t.minSuppressionThreshold ?? 0.3), this.l(t);
  }
  F(t, e) {
    return this.j = { detections: [] }, Et(this, t, e), this.j;
  }
  G(t, e, n) {
    return this.j = { detections: [] }, Rt(this, t, n, e), this.j;
  }
  m() {
    var t = new ft();
    I(t, "image_in"), I(t, "norm_rect_in"), k(t, "detections");
    const e = new lt();
    Ct(e, o1, this.h);
    const n = new nt();
    ht(n, 2, "mediapipe.tasks.vision.face_detector.FaceDetectorGraph"), M(n, "IMAGE:image_in"), M(n, "NORM_RECT:norm_rect_in"), b(n, "DETECTIONS:detections"), n.o(e), vt(t, n), this.g.attachProtoVectorListener("detections", ((r, s) => {
      for (const i of r) r = Wo(i), this.j.detections.push(ya(r));
      f(this, s);
    })), this.g.attachEmptyPacketListener("detections", ((r) => {
      f(this, r);
    })), t = t.g(), this.setGraph(new Uint8Array(t), !0);
  }
};
pt.prototype.detectForVideo = pt.prototype.G, pt.prototype.detect = pt.prototype.F, pt.prototype.setOptions = pt.prototype.o, pt.createFromModelPath = async function(t, e) {
  return A(pt, t, { baseOptions: { modelAssetPath: e } });
}, pt.createFromModelBuffer = function(t, e) {
  return A(pt, t, { baseOptions: { modelAssetBuffer: e } });
}, pt.createFromOptions = function(t, e) {
  return A(pt, t, e);
};
var ls = bt([61, 146], [146, 91], [91, 181], [181, 84], [84, 17], [17, 314], [314, 405], [405, 321], [321, 375], [375, 291], [61, 185], [185, 40], [40, 39], [39, 37], [37, 0], [0, 267], [267, 269], [269, 270], [270, 409], [409, 291], [78, 95], [95, 88], [88, 178], [178, 87], [87, 14], [14, 317], [317, 402], [402, 318], [318, 324], [324, 308], [78, 191], [191, 80], [80, 81], [81, 82], [82, 13], [13, 312], [312, 311], [311, 310], [310, 415], [415, 308]), fs = bt([263, 249], [249, 390], [390, 373], [373, 374], [374, 380], [380, 381], [381, 382], [382, 362], [263, 466], [466, 388], [388, 387], [387, 386], [386, 385], [385, 384], [384, 398], [398, 362]), ds = bt([276, 283], [283, 282], [282, 295], [295, 285], [300, 293], [293, 334], [334, 296], [296, 336]), xa = bt([474, 475], [475, 476], [476, 477], [477, 474]), ps = bt([33, 7], [7, 163], [163, 144], [144, 145], [145, 153], [153, 154], [154, 155], [155, 133], [33, 246], [246, 161], [161, 160], [160, 159], [159, 158], [158, 157], [157, 173], [173, 133]), gs = bt([46, 53], [53, 52], [52, 65], [65, 55], [70, 63], [63, 105], [105, 66], [66, 107]), Ma = bt([469, 470], [470, 471], [471, 472], [472, 469]), ms = bt([10, 338], [338, 297], [297, 332], [332, 284], [284, 251], [251, 389], [389, 356], [356, 454], [454, 323], [323, 361], [361, 288], [288, 397], [397, 365], [365, 379], [379, 378], [378, 400], [400, 377], [377, 152], [152, 148], [148, 176], [176, 149], [149, 150], [150, 136], [136, 172], [172, 58], [58, 132], [132, 93], [93, 234], [234, 127], [127, 162], [162, 21], [21, 54], [54, 103], [103, 67], [67, 109], [109, 10]), Fa = [...ls, ...fs, ...ds, ...ps, ...gs, ...ms], Pa = bt([127, 34], [34, 139], [139, 127], [11, 0], [0, 37], [37, 11], [232, 231], [231, 120], [120, 232], [72, 37], [37, 39], [39, 72], [128, 121], [121, 47], [47, 128], [232, 121], [121, 128], [128, 232], [104, 69], [69, 67], [67, 104], [175, 171], [171, 148], [148, 175], [118, 50], [50, 101], [101, 118], [73, 39], [39, 40], [40, 73], [9, 151], [151, 108], [108, 9], [48, 115], [115, 131], [131, 48], [194, 204], [204, 211], [211, 194], [74, 40], [40, 185], [185, 74], [80, 42], [42, 183], [183, 80], [40, 92], [92, 186], [186, 40], [230, 229], [229, 118], [118, 230], [202, 212], [212, 214], [214, 202], [83, 18], [18, 17], [17, 83], [76, 61], [61, 146], [146, 76], [160, 29], [29, 30], [30, 160], [56, 157], [157, 173], [173, 56], [106, 204], [204, 194], [194, 106], [135, 214], [214, 192], [192, 135], [203, 165], [165, 98], [98, 203], [21, 71], [71, 68], [68, 21], [51, 45], [45, 4], [4, 51], [144, 24], [24, 23], [23, 144], [77, 146], [146, 91], [91, 77], [205, 50], [50, 187], [187, 205], [201, 200], [200, 18], [18, 201], [91, 106], [106, 182], [182, 91], [90, 91], [91, 181], [181, 90], [85, 84], [84, 17], [17, 85], [206, 203], [203, 36], [36, 206], [148, 171], [171, 140], [140, 148], [92, 40], [40, 39], [39, 92], [193, 189], [189, 244], [244, 193], [159, 158], [158, 28], [28, 159], [247, 246], [246, 161], [161, 247], [236, 3], [3, 196], [196, 236], [54, 68], [68, 104], [104, 54], [193, 168], [168, 8], [8, 193], [117, 228], [228, 31], [31, 117], [189, 193], [193, 55], [55, 189], [98, 97], [97, 99], [99, 98], [126, 47], [47, 100], [100, 126], [166, 79], [79, 218], [218, 166], [155, 154], [154, 26], [26, 155], [209, 49], [49, 131], [131, 209], [135, 136], [136, 150], [150, 135], [47, 126], [126, 217], [217, 47], [223, 52], [52, 53], [53, 223], [45, 51], [51, 134], [134, 45], [211, 170], [170, 140], [140, 211], [67, 69], [69, 108], [108, 67], [43, 106], [106, 91], [91, 43], [230, 119], [119, 120], [120, 230], [226, 130], [130, 247], [247, 226], [63, 53], [53, 52], [52, 63], [238, 20], [20, 242], [242, 238], [46, 70], [70, 156], [156, 46], [78, 62], [62, 96], [96, 78], [46, 53], [53, 63], [63, 46], [143, 34], [34, 227], [227, 143], [123, 117], [117, 111], [111, 123], [44, 125], [125, 19], [19, 44], [236, 134], [134, 51], [51, 236], [216, 206], [206, 205], [205, 216], [154, 153], [153, 22], [22, 154], [39, 37], [37, 167], [167, 39], [200, 201], [201, 208], [208, 200], [36, 142], [142, 100], [100, 36], [57, 212], [212, 202], [202, 57], [20, 60], [60, 99], [99, 20], [28, 158], [158, 157], [157, 28], [35, 226], [226, 113], [113, 35], [160, 159], [159, 27], [27, 160], [204, 202], [202, 210], [210, 204], [113, 225], [225, 46], [46, 113], [43, 202], [202, 204], [204, 43], [62, 76], [76, 77], [77, 62], [137, 123], [123, 116], [116, 137], [41, 38], [38, 72], [72, 41], [203, 129], [129, 142], [142, 203], [64, 98], [98, 240], [240, 64], [49, 102], [102, 64], [64, 49], [41, 73], [73, 74], [74, 41], [212, 216], [216, 207], [207, 212], [42, 74], [74, 184], [184, 42], [169, 170], [170, 211], [211, 169], [170, 149], [149, 176], [176, 170], [105, 66], [66, 69], [69, 105], [122, 6], [6, 168], [168, 122], [123, 147], [147, 187], [187, 123], [96, 77], [77, 90], [90, 96], [65, 55], [55, 107], [107, 65], [89, 90], [90, 180], [180, 89], [101, 100], [100, 120], [120, 101], [63, 105], [105, 104], [104, 63], [93, 137], [137, 227], [227, 93], [15, 86], [86, 85], [85, 15], [129, 102], [102, 49], [49, 129], [14, 87], [87, 86], [86, 14], [55, 8], [8, 9], [9, 55], [100, 47], [47, 121], [121, 100], [145, 23], [23, 22], [22, 145], [88, 89], [89, 179], [179, 88], [6, 122], [122, 196], [196, 6], [88, 95], [95, 96], [96, 88], [138, 172], [172, 136], [136, 138], [215, 58], [58, 172], [172, 215], [115, 48], [48, 219], [219, 115], [42, 80], [80, 81], [81, 42], [195, 3], [3, 51], [51, 195], [43, 146], [146, 61], [61, 43], [171, 175], [175, 199], [199, 171], [81, 82], [82, 38], [38, 81], [53, 46], [46, 225], [225, 53], [144, 163], [163, 110], [110, 144], [52, 65], [65, 66], [66, 52], [229, 228], [228, 117], [117, 229], [34, 127], [127, 234], [234, 34], [107, 108], [108, 69], [69, 107], [109, 108], [108, 151], [151, 109], [48, 64], [64, 235], [235, 48], [62, 78], [78, 191], [191, 62], [129, 209], [209, 126], [126, 129], [111, 35], [35, 143], [143, 111], [117, 123], [123, 50], [50, 117], [222, 65], [65, 52], [52, 222], [19, 125], [125, 141], [141, 19], [221, 55], [55, 65], [65, 221], [3, 195], [195, 197], [197, 3], [25, 7], [7, 33], [33, 25], [220, 237], [237, 44], [44, 220], [70, 71], [71, 139], [139, 70], [122, 193], [193, 245], [245, 122], [247, 130], [130, 33], [33, 247], [71, 21], [21, 162], [162, 71], [170, 169], [169, 150], [150, 170], [188, 174], [174, 196], [196, 188], [216, 186], [186, 92], [92, 216], [2, 97], [97, 167], [167, 2], [141, 125], [125, 241], [241, 141], [164, 167], [167, 37], [37, 164], [72, 38], [38, 12], [12, 72], [38, 82], [82, 13], [13, 38], [63, 68], [68, 71], [71, 63], [226, 35], [35, 111], [111, 226], [101, 50], [50, 205], [205, 101], [206, 92], [92, 165], [165, 206], [209, 198], [198, 217], [217, 209], [165, 167], [167, 97], [97, 165], [220, 115], [115, 218], [218, 220], [133, 112], [112, 243], [243, 133], [239, 238], [238, 241], [241, 239], [214, 135], [135, 169], [169, 214], [190, 173], [173, 133], [133, 190], [171, 208], [208, 32], [32, 171], [125, 44], [44, 237], [237, 125], [86, 87], [87, 178], [178, 86], [85, 86], [86, 179], [179, 85], [84, 85], [85, 180], [180, 84], [83, 84], [84, 181], [181, 83], [201, 83], [83, 182], [182, 201], [137, 93], [93, 132], [132, 137], [76, 62], [62, 183], [183, 76], [61, 76], [76, 184], [184, 61], [57, 61], [61, 185], [185, 57], [212, 57], [57, 186], [186, 212], [214, 207], [207, 187], [187, 214], [34, 143], [143, 156], [156, 34], [79, 239], [239, 237], [237, 79], [123, 137], [137, 177], [177, 123], [44, 1], [1, 4], [4, 44], [201, 194], [194, 32], [32, 201], [64, 102], [102, 129], [129, 64], [213, 215], [215, 138], [138, 213], [59, 166], [166, 219], [219, 59], [242, 99], [99, 97], [97, 242], [2, 94], [94, 141], [141, 2], [75, 59], [59, 235], [235, 75], [24, 110], [110, 228], [228, 24], [25, 130], [130, 226], [226, 25], [23, 24], [24, 229], [229, 23], [22, 23], [23, 230], [230, 22], [26, 22], [22, 231], [231, 26], [112, 26], [26, 232], [232, 112], [189, 190], [190, 243], [243, 189], [221, 56], [56, 190], [190, 221], [28, 56], [56, 221], [221, 28], [27, 28], [28, 222], [222, 27], [29, 27], [27, 223], [223, 29], [30, 29], [29, 224], [224, 30], [247, 30], [30, 225], [225, 247], [238, 79], [79, 20], [20, 238], [166, 59], [59, 75], [75, 166], [60, 75], [75, 240], [240, 60], [147, 177], [177, 215], [215, 147], [20, 79], [79, 166], [166, 20], [187, 147], [147, 213], [213, 187], [112, 233], [233, 244], [244, 112], [233, 128], [128, 245], [245, 233], [128, 114], [114, 188], [188, 128], [114, 217], [217, 174], [174, 114], [131, 115], [115, 220], [220, 131], [217, 198], [198, 236], [236, 217], [198, 131], [131, 134], [134, 198], [177, 132], [132, 58], [58, 177], [143, 35], [35, 124], [124, 143], [110, 163], [163, 7], [7, 110], [228, 110], [110, 25], [25, 228], [356, 389], [389, 368], [368, 356], [11, 302], [302, 267], [267, 11], [452, 350], [350, 349], [349, 452], [302, 303], [303, 269], [269, 302], [357, 343], [343, 277], [277, 357], [452, 453], [453, 357], [357, 452], [333, 332], [332, 297], [297, 333], [175, 152], [152, 377], [377, 175], [347, 348], [348, 330], [330, 347], [303, 304], [304, 270], [270, 303], [9, 336], [336, 337], [337, 9], [278, 279], [279, 360], [360, 278], [418, 262], [262, 431], [431, 418], [304, 408], [408, 409], [409, 304], [310, 415], [415, 407], [407, 310], [270, 409], [409, 410], [410, 270], [450, 348], [348, 347], [347, 450], [422, 430], [430, 434], [434, 422], [313, 314], [314, 17], [17, 313], [306, 307], [307, 375], [375, 306], [387, 388], [388, 260], [260, 387], [286, 414], [414, 398], [398, 286], [335, 406], [406, 418], [418, 335], [364, 367], [367, 416], [416, 364], [423, 358], [358, 327], [327, 423], [251, 284], [284, 298], [298, 251], [281, 5], [5, 4], [4, 281], [373, 374], [374, 253], [253, 373], [307, 320], [320, 321], [321, 307], [425, 427], [427, 411], [411, 425], [421, 313], [313, 18], [18, 421], [321, 405], [405, 406], [406, 321], [320, 404], [404, 405], [405, 320], [315, 16], [16, 17], [17, 315], [426, 425], [425, 266], [266, 426], [377, 400], [400, 369], [369, 377], [322, 391], [391, 269], [269, 322], [417, 465], [465, 464], [464, 417], [386, 257], [257, 258], [258, 386], [466, 260], [260, 388], [388, 466], [456, 399], [399, 419], [419, 456], [284, 332], [332, 333], [333, 284], [417, 285], [285, 8], [8, 417], [346, 340], [340, 261], [261, 346], [413, 441], [441, 285], [285, 413], [327, 460], [460, 328], [328, 327], [355, 371], [371, 329], [329, 355], [392, 439], [439, 438], [438, 392], [382, 341], [341, 256], [256, 382], [429, 420], [420, 360], [360, 429], [364, 394], [394, 379], [379, 364], [277, 343], [343, 437], [437, 277], [443, 444], [444, 283], [283, 443], [275, 440], [440, 363], [363, 275], [431, 262], [262, 369], [369, 431], [297, 338], [338, 337], [337, 297], [273, 375], [375, 321], [321, 273], [450, 451], [451, 349], [349, 450], [446, 342], [342, 467], [467, 446], [293, 334], [334, 282], [282, 293], [458, 461], [461, 462], [462, 458], [276, 353], [353, 383], [383, 276], [308, 324], [324, 325], [325, 308], [276, 300], [300, 293], [293, 276], [372, 345], [345, 447], [447, 372], [352, 345], [345, 340], [340, 352], [274, 1], [1, 19], [19, 274], [456, 248], [248, 281], [281, 456], [436, 427], [427, 425], [425, 436], [381, 256], [256, 252], [252, 381], [269, 391], [391, 393], [393, 269], [200, 199], [199, 428], [428, 200], [266, 330], [330, 329], [329, 266], [287, 273], [273, 422], [422, 287], [250, 462], [462, 328], [328, 250], [258, 286], [286, 384], [384, 258], [265, 353], [353, 342], [342, 265], [387, 259], [259, 257], [257, 387], [424, 431], [431, 430], [430, 424], [342, 353], [353, 276], [276, 342], [273, 335], [335, 424], [424, 273], [292, 325], [325, 307], [307, 292], [366, 447], [447, 345], [345, 366], [271, 303], [303, 302], [302, 271], [423, 266], [266, 371], [371, 423], [294, 455], [455, 460], [460, 294], [279, 278], [278, 294], [294, 279], [271, 272], [272, 304], [304, 271], [432, 434], [434, 427], [427, 432], [272, 407], [407, 408], [408, 272], [394, 430], [430, 431], [431, 394], [395, 369], [369, 400], [400, 395], [334, 333], [333, 299], [299, 334], [351, 417], [417, 168], [168, 351], [352, 280], [280, 411], [411, 352], [325, 319], [319, 320], [320, 325], [295, 296], [296, 336], [336, 295], [319, 403], [403, 404], [404, 319], [330, 348], [348, 349], [349, 330], [293, 298], [298, 333], [333, 293], [323, 454], [454, 447], [447, 323], [15, 16], [16, 315], [315, 15], [358, 429], [429, 279], [279, 358], [14, 15], [15, 316], [316, 14], [285, 336], [336, 9], [9, 285], [329, 349], [349, 350], [350, 329], [374, 380], [380, 252], [252, 374], [318, 402], [402, 403], [403, 318], [6, 197], [197, 419], [419, 6], [318, 319], [319, 325], [325, 318], [367, 364], [364, 365], [365, 367], [435, 367], [367, 397], [397, 435], [344, 438], [438, 439], [439, 344], [272, 271], [271, 311], [311, 272], [195, 5], [5, 281], [281, 195], [273, 287], [287, 291], [291, 273], [396, 428], [428, 199], [199, 396], [311, 271], [271, 268], [268, 311], [283, 444], [444, 445], [445, 283], [373, 254], [254, 339], [339, 373], [282, 334], [334, 296], [296, 282], [449, 347], [347, 346], [346, 449], [264, 447], [447, 454], [454, 264], [336, 296], [296, 299], [299, 336], [338, 10], [10, 151], [151, 338], [278, 439], [439, 455], [455, 278], [292, 407], [407, 415], [415, 292], [358, 371], [371, 355], [355, 358], [340, 345], [345, 372], [372, 340], [346, 347], [347, 280], [280, 346], [442, 443], [443, 282], [282, 442], [19, 94], [94, 370], [370, 19], [441, 442], [442, 295], [295, 441], [248, 419], [419, 197], [197, 248], [263, 255], [255, 359], [359, 263], [440, 275], [275, 274], [274, 440], [300, 383], [383, 368], [368, 300], [351, 412], [412, 465], [465, 351], [263, 467], [467, 466], [466, 263], [301, 368], [368, 389], [389, 301], [395, 378], [378, 379], [379, 395], [412, 351], [351, 419], [419, 412], [436, 426], [426, 322], [322, 436], [2, 164], [164, 393], [393, 2], [370, 462], [462, 461], [461, 370], [164, 0], [0, 267], [267, 164], [302, 11], [11, 12], [12, 302], [268, 12], [12, 13], [13, 268], [293, 300], [300, 301], [301, 293], [446, 261], [261, 340], [340, 446], [330, 266], [266, 425], [425, 330], [426, 423], [423, 391], [391, 426], [429, 355], [355, 437], [437, 429], [391, 327], [327, 326], [326, 391], [440, 457], [457, 438], [438, 440], [341, 382], [382, 362], [362, 341], [459, 457], [457, 461], [461, 459], [434, 430], [430, 394], [394, 434], [414, 463], [463, 362], [362, 414], [396, 369], [369, 262], [262, 396], [354, 461], [461, 457], [457, 354], [316, 403], [403, 402], [402, 316], [315, 404], [404, 403], [403, 315], [314, 405], [405, 404], [404, 314], [313, 406], [406, 405], [405, 313], [421, 418], [418, 406], [406, 421], [366, 401], [401, 361], [361, 366], [306, 408], [408, 407], [407, 306], [291, 409], [409, 408], [408, 291], [287, 410], [410, 409], [409, 287], [432, 436], [436, 410], [410, 432], [434, 416], [416, 411], [411, 434], [264, 368], [368, 383], [383, 264], [309, 438], [438, 457], [457, 309], [352, 376], [376, 401], [401, 352], [274, 275], [275, 4], [4, 274], [421, 428], [428, 262], [262, 421], [294, 327], [327, 358], [358, 294], [433, 416], [416, 367], [367, 433], [289, 455], [455, 439], [439, 289], [462, 370], [370, 326], [326, 462], [2, 326], [326, 370], [370, 2], [305, 460], [460, 455], [455, 305], [254, 449], [449, 448], [448, 254], [255, 261], [261, 446], [446, 255], [253, 450], [450, 449], [449, 253], [252, 451], [451, 450], [450, 252], [256, 452], [452, 451], [451, 256], [341, 453], [453, 452], [452, 341], [413, 464], [464, 463], [463, 413], [441, 413], [413, 414], [414, 441], [258, 442], [442, 441], [441, 258], [257, 443], [443, 442], [442, 257], [259, 444], [444, 443], [443, 259], [260, 445], [445, 444], [444, 260], [467, 342], [342, 445], [445, 467], [459, 458], [458, 250], [250, 459], [289, 392], [392, 290], [290, 289], [290, 328], [328, 460], [460, 290], [376, 433], [433, 435], [435, 376], [250, 290], [290, 392], [392, 250], [411, 416], [416, 433], [433, 411], [341, 463], [463, 464], [464, 341], [453, 464], [464, 465], [465, 453], [357, 465], [465, 412], [412, 357], [343, 412], [412, 399], [399, 343], [360, 363], [363, 440], [440, 360], [437, 399], [399, 456], [456, 437], [420, 456], [456, 363], [363, 420], [401, 435], [435, 288], [288, 401], [372, 383], [383, 353], [353, 372], [339, 255], [255, 249], [249, 339], [448, 261], [261, 255], [255, 448], [133, 243], [243, 190], [190, 133], [133, 155], [155, 112], [112, 133], [33, 246], [246, 247], [247, 33], [33, 130], [130, 25], [25, 33], [398, 384], [384, 286], [286, 398], [362, 398], [398, 414], [414, 362], [362, 463], [463, 341], [341, 362], [263, 359], [359, 467], [467, 263], [263, 249], [249, 255], [255, 263], [466, 467], [467, 260], [260, 466], [75, 60], [60, 166], [166, 75], [238, 239], [239, 79], [79, 238], [162, 127], [127, 139], [139, 162], [72, 11], [11, 37], [37, 72], [121, 232], [232, 120], [120, 121], [73, 72], [72, 39], [39, 73], [114, 128], [128, 47], [47, 114], [233, 232], [232, 128], [128, 233], [103, 104], [104, 67], [67, 103], [152, 175], [175, 148], [148, 152], [119, 118], [118, 101], [101, 119], [74, 73], [73, 40], [40, 74], [107, 9], [9, 108], [108, 107], [49, 48], [48, 131], [131, 49], [32, 194], [194, 211], [211, 32], [184, 74], [74, 185], [185, 184], [191, 80], [80, 183], [183, 191], [185, 40], [40, 186], [186, 185], [119, 230], [230, 118], [118, 119], [210, 202], [202, 214], [214, 210], [84, 83], [83, 17], [17, 84], [77, 76], [76, 146], [146, 77], [161, 160], [160, 30], [30, 161], [190, 56], [56, 173], [173, 190], [182, 106], [106, 194], [194, 182], [138, 135], [135, 192], [192, 138], [129, 203], [203, 98], [98, 129], [54, 21], [21, 68], [68, 54], [5, 51], [51, 4], [4, 5], [145, 144], [144, 23], [23, 145], [90, 77], [77, 91], [91, 90], [207, 205], [205, 187], [187, 207], [83, 201], [201, 18], [18, 83], [181, 91], [91, 182], [182, 181], [180, 90], [90, 181], [181, 180], [16, 85], [85, 17], [17, 16], [205, 206], [206, 36], [36, 205], [176, 148], [148, 140], [140, 176], [165, 92], [92, 39], [39, 165], [245, 193], [193, 244], [244, 245], [27, 159], [159, 28], [28, 27], [30, 247], [247, 161], [161, 30], [174, 236], [236, 196], [196, 174], [103, 54], [54, 104], [104, 103], [55, 193], [193, 8], [8, 55], [111, 117], [117, 31], [31, 111], [221, 189], [189, 55], [55, 221], [240, 98], [98, 99], [99, 240], [142, 126], [126, 100], [100, 142], [219, 166], [166, 218], [218, 219], [112, 155], [155, 26], [26, 112], [198, 209], [209, 131], [131, 198], [169, 135], [135, 150], [150, 169], [114, 47], [47, 217], [217, 114], [224, 223], [223, 53], [53, 224], [220, 45], [45, 134], [134, 220], [32, 211], [211, 140], [140, 32], [109, 67], [67, 108], [108, 109], [146, 43], [43, 91], [91, 146], [231, 230], [230, 120], [120, 231], [113, 226], [226, 247], [247, 113], [105, 63], [63, 52], [52, 105], [241, 238], [238, 242], [242, 241], [124, 46], [46, 156], [156, 124], [95, 78], [78, 96], [96, 95], [70, 46], [46, 63], [63, 70], [116, 143], [143, 227], [227, 116], [116, 123], [123, 111], [111, 116], [1, 44], [44, 19], [19, 1], [3, 236], [236, 51], [51, 3], [207, 216], [216, 205], [205, 207], [26, 154], [154, 22], [22, 26], [165, 39], [39, 167], [167, 165], [199, 200], [200, 208], [208, 199], [101, 36], [36, 100], [100, 101], [43, 57], [57, 202], [202, 43], [242, 20], [20, 99], [99, 242], [56, 28], [28, 157], [157, 56], [124, 35], [35, 113], [113, 124], [29, 160], [160, 27], [27, 29], [211, 204], [204, 210], [210, 211], [124, 113], [113, 46], [46, 124], [106, 43], [43, 204], [204, 106], [96, 62], [62, 77], [77, 96], [227, 137], [137, 116], [116, 227], [73, 41], [41, 72], [72, 73], [36, 203], [203, 142], [142, 36], [235, 64], [64, 240], [240, 235], [48, 49], [49, 64], [64, 48], [42, 41], [41, 74], [74, 42], [214, 212], [212, 207], [207, 214], [183, 42], [42, 184], [184, 183], [210, 169], [169, 211], [211, 210], [140, 170], [170, 176], [176, 140], [104, 105], [105, 69], [69, 104], [193, 122], [122, 168], [168, 193], [50, 123], [123, 187], [187, 50], [89, 96], [96, 90], [90, 89], [66, 65], [65, 107], [107, 66], [179, 89], [89, 180], [180, 179], [119, 101], [101, 120], [120, 119], [68, 63], [63, 104], [104, 68], [234, 93], [93, 227], [227, 234], [16, 15], [15, 85], [85, 16], [209, 129], [129, 49], [49, 209], [15, 14], [14, 86], [86, 15], [107, 55], [55, 9], [9, 107], [120, 100], [100, 121], [121, 120], [153, 145], [145, 22], [22, 153], [178, 88], [88, 179], [179, 178], [197, 6], [6, 196], [196, 197], [89, 88], [88, 96], [96, 89], [135, 138], [138, 136], [136, 135], [138, 215], [215, 172], [172, 138], [218, 115], [115, 219], [219, 218], [41, 42], [42, 81], [81, 41], [5, 195], [195, 51], [51, 5], [57, 43], [43, 61], [61, 57], [208, 171], [171, 199], [199, 208], [41, 81], [81, 38], [38, 41], [224, 53], [53, 225], [225, 224], [24, 144], [144, 110], [110, 24], [105, 52], [52, 66], [66, 105], [118, 229], [229, 117], [117, 118], [227, 34], [34, 234], [234, 227], [66, 107], [107, 69], [69, 66], [10, 109], [109, 151], [151, 10], [219, 48], [48, 235], [235, 219], [183, 62], [62, 191], [191, 183], [142, 129], [129, 126], [126, 142], [116, 111], [111, 143], [143, 116], [118, 117], [117, 50], [50, 118], [223, 222], [222, 52], [52, 223], [94, 19], [19, 141], [141, 94], [222, 221], [221, 65], [65, 222], [196, 3], [3, 197], [197, 196], [45, 220], [220, 44], [44, 45], [156, 70], [70, 139], [139, 156], [188, 122], [122, 245], [245, 188], [139, 71], [71, 162], [162, 139], [149, 170], [170, 150], [150, 149], [122, 188], [188, 196], [196, 122], [206, 216], [216, 92], [92, 206], [164, 2], [2, 167], [167, 164], [242, 141], [141, 241], [241, 242], [0, 164], [164, 37], [37, 0], [11, 72], [72, 12], [12, 11], [12, 38], [38, 13], [13, 12], [70, 63], [63, 71], [71, 70], [31, 226], [226, 111], [111, 31], [36, 101], [101, 205], [205, 36], [203, 206], [206, 165], [165, 203], [126, 209], [209, 217], [217, 126], [98, 165], [165, 97], [97, 98], [237, 220], [220, 218], [218, 237], [237, 239], [239, 241], [241, 237], [210, 214], [214, 169], [169, 210], [140, 171], [171, 32], [32, 140], [241, 125], [125, 237], [237, 241], [179, 86], [86, 178], [178, 179], [180, 85], [85, 179], [179, 180], [181, 84], [84, 180], [180, 181], [182, 83], [83, 181], [181, 182], [194, 201], [201, 182], [182, 194], [177, 137], [137, 132], [132, 177], [184, 76], [76, 183], [183, 184], [185, 61], [61, 184], [184, 185], [186, 57], [57, 185], [185, 186], [216, 212], [212, 186], [186, 216], [192, 214], [214, 187], [187, 192], [139, 34], [34, 156], [156, 139], [218, 79], [79, 237], [237, 218], [147, 123], [123, 177], [177, 147], [45, 44], [44, 4], [4, 45], [208, 201], [201, 32], [32, 208], [98, 64], [64, 129], [129, 98], [192, 213], [213, 138], [138, 192], [235, 59], [59, 219], [219, 235], [141, 242], [242, 97], [97, 141], [97, 2], [2, 141], [141, 97], [240, 75], [75, 235], [235, 240], [229, 24], [24, 228], [228, 229], [31, 25], [25, 226], [226, 31], [230, 23], [23, 229], [229, 230], [231, 22], [22, 230], [230, 231], [232, 26], [26, 231], [231, 232], [233, 112], [112, 232], [232, 233], [244, 189], [189, 243], [243, 244], [189, 221], [221, 190], [190, 189], [222, 28], [28, 221], [221, 222], [223, 27], [27, 222], [222, 223], [224, 29], [29, 223], [223, 224], [225, 30], [30, 224], [224, 225], [113, 247], [247, 225], [225, 113], [99, 60], [60, 240], [240, 99], [213, 147], [147, 215], [215, 213], [60, 20], [20, 166], [166, 60], [192, 187], [187, 213], [213, 192], [243, 112], [112, 244], [244, 243], [244, 233], [233, 245], [245, 244], [245, 128], [128, 188], [188, 245], [188, 114], [114, 174], [174, 188], [134, 131], [131, 220], [220, 134], [174, 217], [217, 236], [236, 174], [236, 198], [198, 134], [134, 236], [215, 177], [177, 58], [58, 215], [156, 143], [143, 124], [124, 156], [25, 110], [110, 7], [7, 25], [31, 228], [228, 25], [25, 31], [264, 356], [356, 368], [368, 264], [0, 11], [11, 267], [267, 0], [451, 452], [452, 349], [349, 451], [267, 302], [302, 269], [269, 267], [350, 357], [357, 277], [277, 350], [350, 452], [452, 357], [357, 350], [299, 333], [333, 297], [297, 299], [396, 175], [175, 377], [377, 396], [280, 347], [347, 330], [330, 280], [269, 303], [303, 270], [270, 269], [151, 9], [9, 337], [337, 151], [344, 278], [278, 360], [360, 344], [424, 418], [418, 431], [431, 424], [270, 304], [304, 409], [409, 270], [272, 310], [310, 407], [407, 272], [322, 270], [270, 410], [410, 322], [449, 450], [450, 347], [347, 449], [432, 422], [422, 434], [434, 432], [18, 313], [313, 17], [17, 18], [291, 306], [306, 375], [375, 291], [259, 387], [387, 260], [260, 259], [424, 335], [335, 418], [418, 424], [434, 364], [364, 416], [416, 434], [391, 423], [423, 327], [327, 391], [301, 251], [251, 298], [298, 301], [275, 281], [281, 4], [4, 275], [254, 373], [373, 253], [253, 254], [375, 307], [307, 321], [321, 375], [280, 425], [425, 411], [411, 280], [200, 421], [421, 18], [18, 200], [335, 321], [321, 406], [406, 335], [321, 320], [320, 405], [405, 321], [314, 315], [315, 17], [17, 314], [423, 426], [426, 266], [266, 423], [396, 377], [377, 369], [369, 396], [270, 322], [322, 269], [269, 270], [413, 417], [417, 464], [464, 413], [385, 386], [386, 258], [258, 385], [248, 456], [456, 419], [419, 248], [298, 284], [284, 333], [333, 298], [168, 417], [417, 8], [8, 168], [448, 346], [346, 261], [261, 448], [417, 413], [413, 285], [285, 417], [326, 327], [327, 328], [328, 326], [277, 355], [355, 329], [329, 277], [309, 392], [392, 438], [438, 309], [381, 382], [382, 256], [256, 381], [279, 429], [429, 360], [360, 279], [365, 364], [364, 379], [379, 365], [355, 277], [277, 437], [437, 355], [282, 443], [443, 283], [283, 282], [281, 275], [275, 363], [363, 281], [395, 431], [431, 369], [369, 395], [299, 297], [297, 337], [337, 299], [335, 273], [273, 321], [321, 335], [348, 450], [450, 349], [349, 348], [359, 446], [446, 467], [467, 359], [283, 293], [293, 282], [282, 283], [250, 458], [458, 462], [462, 250], [300, 276], [276, 383], [383, 300], [292, 308], [308, 325], [325, 292], [283, 276], [276, 293], [293, 283], [264, 372], [372, 447], [447, 264], [346, 352], [352, 340], [340, 346], [354, 274], [274, 19], [19, 354], [363, 456], [456, 281], [281, 363], [426, 436], [436, 425], [425, 426], [380, 381], [381, 252], [252, 380], [267, 269], [269, 393], [393, 267], [421, 200], [200, 428], [428, 421], [371, 266], [266, 329], [329, 371], [432, 287], [287, 422], [422, 432], [290, 250], [250, 328], [328, 290], [385, 258], [258, 384], [384, 385], [446, 265], [265, 342], [342, 446], [386, 387], [387, 257], [257, 386], [422, 424], [424, 430], [430, 422], [445, 342], [342, 276], [276, 445], [422, 273], [273, 424], [424, 422], [306, 292], [292, 307], [307, 306], [352, 366], [366, 345], [345, 352], [268, 271], [271, 302], [302, 268], [358, 423], [423, 371], [371, 358], [327, 294], [294, 460], [460, 327], [331, 279], [279, 294], [294, 331], [303, 271], [271, 304], [304, 303], [436, 432], [432, 427], [427, 436], [304, 272], [272, 408], [408, 304], [395, 394], [394, 431], [431, 395], [378, 395], [395, 400], [400, 378], [296, 334], [334, 299], [299, 296], [6, 351], [351, 168], [168, 6], [376, 352], [352, 411], [411, 376], [307, 325], [325, 320], [320, 307], [285, 295], [295, 336], [336, 285], [320, 319], [319, 404], [404, 320], [329, 330], [330, 349], [349, 329], [334, 293], [293, 333], [333, 334], [366, 323], [323, 447], [447, 366], [316, 15], [15, 315], [315, 316], [331, 358], [358, 279], [279, 331], [317, 14], [14, 316], [316, 317], [8, 285], [285, 9], [9, 8], [277, 329], [329, 350], [350, 277], [253, 374], [374, 252], [252, 253], [319, 318], [318, 403], [403, 319], [351, 6], [6, 419], [419, 351], [324, 318], [318, 325], [325, 324], [397, 367], [367, 365], [365, 397], [288, 435], [435, 397], [397, 288], [278, 344], [344, 439], [439, 278], [310, 272], [272, 311], [311, 310], [248, 195], [195, 281], [281, 248], [375, 273], [273, 291], [291, 375], [175, 396], [396, 199], [199, 175], [312, 311], [311, 268], [268, 312], [276, 283], [283, 445], [445, 276], [390, 373], [373, 339], [339, 390], [295, 282], [282, 296], [296, 295], [448, 449], [449, 346], [346, 448], [356, 264], [264, 454], [454, 356], [337, 336], [336, 299], [299, 337], [337, 338], [338, 151], [151, 337], [294, 278], [278, 455], [455, 294], [308, 292], [292, 415], [415, 308], [429, 358], [358, 355], [355, 429], [265, 340], [340, 372], [372, 265], [352, 346], [346, 280], [280, 352], [295, 442], [442, 282], [282, 295], [354, 19], [19, 370], [370, 354], [285, 441], [441, 295], [295, 285], [195, 248], [248, 197], [197, 195], [457, 440], [440, 274], [274, 457], [301, 300], [300, 368], [368, 301], [417, 351], [351, 465], [465, 417], [251, 301], [301, 389], [389, 251], [394, 395], [395, 379], [379, 394], [399, 412], [412, 419], [419, 399], [410, 436], [436, 322], [322, 410], [326, 2], [2, 393], [393, 326], [354, 370], [370, 461], [461, 354], [393, 164], [164, 267], [267, 393], [268, 302], [302, 12], [12, 268], [312, 268], [268, 13], [13, 312], [298, 293], [293, 301], [301, 298], [265, 446], [446, 340], [340, 265], [280, 330], [330, 425], [425, 280], [322, 426], [426, 391], [391, 322], [420, 429], [429, 437], [437, 420], [393, 391], [391, 326], [326, 393], [344, 440], [440, 438], [438, 344], [458, 459], [459, 461], [461, 458], [364, 434], [434, 394], [394, 364], [428, 396], [396, 262], [262, 428], [274, 354], [354, 457], [457, 274], [317, 316], [316, 402], [402, 317], [316, 315], [315, 403], [403, 316], [315, 314], [314, 404], [404, 315], [314, 313], [313, 405], [405, 314], [313, 421], [421, 406], [406, 313], [323, 366], [366, 361], [361, 323], [292, 306], [306, 407], [407, 292], [306, 291], [291, 408], [408, 306], [291, 287], [287, 409], [409, 291], [287, 432], [432, 410], [410, 287], [427, 434], [434, 411], [411, 427], [372, 264], [264, 383], [383, 372], [459, 309], [309, 457], [457, 459], [366, 352], [352, 401], [401, 366], [1, 274], [274, 4], [4, 1], [418, 421], [421, 262], [262, 418], [331, 294], [294, 358], [358, 331], [435, 433], [433, 367], [367, 435], [392, 289], [289, 439], [439, 392], [328, 462], [462, 326], [326, 328], [94, 2], [2, 370], [370, 94], [289, 305], [305, 455], [455, 289], [339, 254], [254, 448], [448, 339], [359, 255], [255, 446], [446, 359], [254, 253], [253, 449], [449, 254], [253, 252], [252, 450], [450, 253], [252, 256], [256, 451], [451, 252], [256, 341], [341, 452], [452, 256], [414, 413], [413, 463], [463, 414], [286, 441], [441, 414], [414, 286], [286, 258], [258, 441], [441, 286], [258, 257], [257, 442], [442, 258], [257, 259], [259, 443], [443, 257], [259, 260], [260, 444], [444, 259], [260, 467], [467, 445], [445, 260], [309, 459], [459, 250], [250, 309], [305, 289], [289, 290], [290, 305], [305, 290], [290, 460], [460, 305], [401, 376], [376, 435], [435, 401], [309, 250], [250, 392], [392, 309], [376, 411], [411, 433], [433, 376], [453, 341], [341, 464], [464, 453], [357, 453], [453, 465], [465, 357], [343, 357], [357, 412], [412, 343], [437, 343], [343, 399], [399, 437], [344, 360], [360, 440], [440, 344], [420, 437], [437, 456], [456, 420], [360, 420], [420, 363], [363, 360], [361, 401], [401, 288], [288, 361], [265, 372], [372, 353], [353, 265], [390, 339], [339, 249], [249, 390], [339, 448], [448, 255], [255, 339]);
function gi(t) {
  t.j = { faceLandmarks: [], faceBlendshapes: [], facialTransformationMatrixes: [] };
}
var N = class extends ut {
  constructor(t, e) {
    super(new At(t, e), "image_in", "norm_rect", !1), this.j = { faceLandmarks: [], faceBlendshapes: [], facialTransformationMatrixes: [] }, this.outputFacialTransformationMatrixes = this.outputFaceBlendshapes = !1, y(t = this.h = new Qo(), 0, 1, e = new R()), this.A = new Zo(), y(this.h, 0, 3, this.A), this.u = new zn(), y(this.h, 0, 2, this.u), jt(this.u, 4, 1), m(this.u, 2, 0.5), m(this.A, 2, 0.5), m(this.h, 4, 0.5);
  }
  get baseOptions() {
    return E(this.h, R, 1);
  }
  set baseOptions(t) {
    y(this.h, 0, 1, t);
  }
  o(t) {
    return "numFaces" in t && jt(this.u, 4, t.numFaces ?? 1), "minFaceDetectionConfidence" in t && m(this.u, 2, t.minFaceDetectionConfidence ?? 0.5), "minTrackingConfidence" in t && m(this.h, 4, t.minTrackingConfidence ?? 0.5), "minFacePresenceConfidence" in t && m(this.A, 2, t.minFacePresenceConfidence ?? 0.5), "outputFaceBlendshapes" in t && (this.outputFaceBlendshapes = !!t.outputFaceBlendshapes), "outputFacialTransformationMatrixes" in t && (this.outputFacialTransformationMatrixes = !!t.outputFacialTransformationMatrixes), this.l(t);
  }
  F(t, e) {
    return gi(this), Et(this, t, e), this.j;
  }
  G(t, e, n) {
    return gi(this), Rt(this, t, n, e), this.j;
  }
  m() {
    var t = new ft();
    I(t, "image_in"), I(t, "norm_rect"), k(t, "face_landmarks");
    const e = new lt();
    Ct(e, c1, this.h);
    const n = new nt();
    ht(n, 2, "mediapipe.tasks.vision.face_landmarker.FaceLandmarkerGraph"), M(n, "IMAGE:image_in"), M(n, "NORM_RECT:norm_rect"), b(n, "NORM_LANDMARKS:face_landmarks"), n.o(e), vt(t, n), this.g.attachProtoVectorListener("face_landmarks", ((r, s) => {
      for (const i of r) r = an(i), this.j.faceLandmarks.push(Wn(r));
      f(this, s);
    })), this.g.attachEmptyPacketListener("face_landmarks", ((r) => {
      f(this, r);
    })), this.outputFaceBlendshapes && (k(t, "blendshapes"), b(n, "BLENDSHAPES:blendshapes"), this.g.attachProtoVectorListener("blendshapes", ((r, s) => {
      if (this.outputFaceBlendshapes) for (const i of r) r = Hn(i), this.j.faceBlendshapes.push(cs(r.g() ?? []));
      f(this, s);
    })), this.g.attachEmptyPacketListener("blendshapes", ((r) => {
      f(this, r);
    }))), this.outputFacialTransformationMatrixes && (k(t, "face_geometry"), b(n, "FACE_GEOMETRY:face_geometry"), this.g.attachProtoVectorListener("face_geometry", ((r, s) => {
      if (this.outputFacialTransformationMatrixes) for (const i of r) (r = E(r = a1(i), Z2, 2)) && this.j.facialTransformationMatrixes.push({ rows: yt(r, 1) ?? 0 ?? 0, columns: yt(r, 2) ?? 0 ?? 0, data: te(r, 3, Mt, Qt()).slice() ?? [] });
      f(this, s);
    })), this.g.attachEmptyPacketListener("face_geometry", ((r) => {
      f(this, r);
    }))), t = t.g(), this.setGraph(new Uint8Array(t), !0);
  }
};
N.prototype.detectForVideo = N.prototype.G, N.prototype.detect = N.prototype.F, N.prototype.setOptions = N.prototype.o, N.createFromModelPath = function(t, e) {
  return A(N, t, { baseOptions: { modelAssetPath: e } });
}, N.createFromModelBuffer = function(t, e) {
  return A(N, t, { baseOptions: { modelAssetBuffer: e } });
}, N.createFromOptions = function(t, e) {
  return A(N, t, e);
}, N.FACE_LANDMARKS_LIPS = ls, N.FACE_LANDMARKS_LEFT_EYE = fs, N.FACE_LANDMARKS_LEFT_EYEBROW = ds, N.FACE_LANDMARKS_LEFT_IRIS = xa, N.FACE_LANDMARKS_RIGHT_EYE = ps, N.FACE_LANDMARKS_RIGHT_EYEBROW = gs, N.FACE_LANDMARKS_RIGHT_IRIS = Ma, N.FACE_LANDMARKS_FACE_OVAL = ms, N.FACE_LANDMARKS_CONTOURS = Fa, N.FACE_LANDMARKS_TESSELATION = Pa;
var ys = bt([0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 8], [5, 9], [9, 10], [10, 11], [11, 12], [9, 13], [13, 14], [14, 15], [15, 16], [13, 17], [0, 17], [17, 18], [18, 19], [19, 20]);
function mi(t) {
  t.gestures = [], t.landmarks = [], t.worldLandmarks = [], t.handedness = [];
}
function yi(t) {
  return t.gestures.length === 0 ? { gestures: [], landmarks: [], worldLandmarks: [], handedness: [], handednesses: [] } : { gestures: t.gestures, landmarks: t.landmarks, worldLandmarks: t.worldLandmarks, handedness: t.handedness, handednesses: t.handedness };
}
function _i(t, e = !0) {
  const n = [];
  for (const s of t) {
    var r = Hn(s);
    t = [];
    for (const i of r.g()) r = e && yt(i, 1) != null ? yt(i, 1) ?? 0 : -1, t.push({ score: D(i, 2) ?? 0, index: r, categoryName: X(P(i, 3)) ?? "" ?? "", displayName: X(P(i, 4)) ?? "" ?? "" });
    n.push(t);
  }
  return n;
}
var Y = class extends ut {
  constructor(t, e) {
    super(new At(t, e), "image_in", "norm_rect", !1), this.gestures = [], this.landmarks = [], this.worldLandmarks = [], this.handedness = [], y(t = this.j = new na(), 0, 1, e = new R()), this.u = new ss(), y(this.j, 0, 2, this.u), this.D = new rs(), y(this.u, 0, 3, this.D), this.A = new ea(), y(this.u, 0, 2, this.A), this.h = new h1(), y(this.j, 0, 3, this.h), m(this.A, 2, 0.5), m(this.u, 4, 0.5), m(this.D, 2, 0.5);
  }
  get baseOptions() {
    return E(this.j, R, 1);
  }
  set baseOptions(t) {
    y(this.j, 0, 1, t);
  }
  o(t) {
    var s, i, o, a;
    if (jt(this.A, 3, t.numHands ?? 1), "minHandDetectionConfidence" in t && m(this.A, 2, t.minHandDetectionConfidence ?? 0.5), "minTrackingConfidence" in t && m(this.u, 4, t.minTrackingConfidence ?? 0.5), "minHandPresenceConfidence" in t && m(this.D, 2, t.minHandPresenceConfidence ?? 0.5), t.cannedGesturesClassifierOptions) {
      var e = new pe(), n = e, r = mr(t.cannedGesturesClassifierOptions, (s = E(this.h, pe, 3)) == null ? void 0 : s.l());
      y(n, 0, 2, r), y(this.h, 0, 3, e);
    } else t.cannedGesturesClassifierOptions === void 0 && ((i = E(this.h, pe, 3)) == null || i.g());
    return t.customGesturesClassifierOptions ? (y(n = e = new pe(), 0, 2, r = mr(t.customGesturesClassifierOptions, (o = E(this.h, pe, 4)) == null ? void 0 : o.l())), y(this.h, 0, 4, e)) : t.customGesturesClassifierOptions === void 0 && ((a = E(this.h, pe, 4)) == null || a.g()), this.l(t);
  }
  Ha(t, e) {
    return mi(this), Et(this, t, e), yi(this);
  }
  Ia(t, e, n) {
    return mi(this), Rt(this, t, n, e), yi(this);
  }
  m() {
    var t = new ft();
    I(t, "image_in"), I(t, "norm_rect"), k(t, "hand_gestures"), k(t, "hand_landmarks"), k(t, "world_hand_landmarks"), k(t, "handedness");
    const e = new lt();
    Ct(e, u1, this.j);
    const n = new nt();
    ht(n, 2, "mediapipe.tasks.vision.gesture_recognizer.GestureRecognizerGraph"), M(n, "IMAGE:image_in"), M(n, "NORM_RECT:norm_rect"), b(n, "HAND_GESTURES:hand_gestures"), b(n, "LANDMARKS:hand_landmarks"), b(n, "WORLD_LANDMARKS:world_hand_landmarks"), b(n, "HANDEDNESS:handedness"), n.o(e), vt(t, n), this.g.attachProtoVectorListener("hand_landmarks", ((r, s) => {
      for (const i of r) {
        r = an(i);
        const o = [];
        for (const a of Vt(r, qo, 1)) o.push({ x: D(a, 1) ?? 0, y: D(a, 2) ?? 0, z: D(a, 3) ?? 0, visibility: D(a, 4) ?? 0 });
        this.landmarks.push(o);
      }
      f(this, s);
    })), this.g.attachEmptyPacketListener("hand_landmarks", ((r) => {
      f(this, r);
    })), this.g.attachProtoVectorListener("world_hand_landmarks", ((r, s) => {
      for (const i of r) {
        r = _e(i);
        const o = [];
        for (const a of Vt(r, Ko, 1)) o.push({ x: D(a, 1) ?? 0, y: D(a, 2) ?? 0, z: D(a, 3) ?? 0, visibility: D(a, 4) ?? 0 });
        this.worldLandmarks.push(o);
      }
      f(this, s);
    })), this.g.attachEmptyPacketListener("world_hand_landmarks", ((r) => {
      f(this, r);
    })), this.g.attachProtoVectorListener("hand_gestures", ((r, s) => {
      this.gestures.push(..._i(r, !1)), f(this, s);
    })), this.g.attachEmptyPacketListener("hand_gestures", ((r) => {
      f(this, r);
    })), this.g.attachProtoVectorListener("handedness", ((r, s) => {
      this.handedness.push(..._i(r)), f(this, s);
    })), this.g.attachEmptyPacketListener("handedness", ((r) => {
      f(this, r);
    })), t = t.g(), this.setGraph(new Uint8Array(t), !0);
  }
};
function vi(t) {
  return { landmarks: t.landmarks, worldLandmarks: t.worldLandmarks, handednesses: t.handedness, handedness: t.handedness };
}
Y.prototype.recognizeForVideo = Y.prototype.Ia, Y.prototype.recognize = Y.prototype.Ha, Y.prototype.setOptions = Y.prototype.o, Y.createFromModelPath = function(t, e) {
  return A(Y, t, { baseOptions: { modelAssetPath: e } });
}, Y.createFromModelBuffer = function(t, e) {
  return A(Y, t, { baseOptions: { modelAssetBuffer: e } });
}, Y.createFromOptions = function(t, e) {
  return A(Y, t, e);
}, Y.HAND_CONNECTIONS = ys;
var rt = class extends ut {
  constructor(t, e) {
    super(new At(t, e), "image_in", "norm_rect", !1), this.landmarks = [], this.worldLandmarks = [], this.handedness = [], y(t = this.h = new ss(), 0, 1, e = new R()), this.u = new rs(), y(this.h, 0, 3, this.u), this.j = new ea(), y(this.h, 0, 2, this.j), jt(this.j, 3, 1), m(this.j, 2, 0.5), m(this.u, 2, 0.5), m(this.h, 4, 0.5);
  }
  get baseOptions() {
    return E(this.h, R, 1);
  }
  set baseOptions(t) {
    y(this.h, 0, 1, t);
  }
  o(t) {
    return "numHands" in t && jt(this.j, 3, t.numHands ?? 1), "minHandDetectionConfidence" in t && m(this.j, 2, t.minHandDetectionConfidence ?? 0.5), "minTrackingConfidence" in t && m(this.h, 4, t.minTrackingConfidence ?? 0.5), "minHandPresenceConfidence" in t && m(this.u, 2, t.minHandPresenceConfidence ?? 0.5), this.l(t);
  }
  F(t, e) {
    return this.landmarks = [], this.worldLandmarks = [], this.handedness = [], Et(this, t, e), vi(this);
  }
  G(t, e, n) {
    return this.landmarks = [], this.worldLandmarks = [], this.handedness = [], Rt(this, t, n, e), vi(this);
  }
  m() {
    var t = new ft();
    I(t, "image_in"), I(t, "norm_rect"), k(t, "hand_landmarks"), k(t, "world_hand_landmarks"), k(t, "handedness");
    const e = new lt();
    Ct(e, l1, this.h);
    const n = new nt();
    ht(n, 2, "mediapipe.tasks.vision.hand_landmarker.HandLandmarkerGraph"), M(n, "IMAGE:image_in"), M(n, "NORM_RECT:norm_rect"), b(n, "LANDMARKS:hand_landmarks"), b(n, "WORLD_LANDMARKS:world_hand_landmarks"), b(n, "HANDEDNESS:handedness"), n.o(e), vt(t, n), this.g.attachProtoVectorListener("hand_landmarks", ((r, s) => {
      for (const i of r) r = an(i), this.landmarks.push(Wn(r));
      f(this, s);
    })), this.g.attachEmptyPacketListener("hand_landmarks", ((r) => {
      f(this, r);
    })), this.g.attachProtoVectorListener("world_hand_landmarks", ((r, s) => {
      for (const i of r) r = _e(i), this.worldLandmarks.push($e(r));
      f(this, s);
    })), this.g.attachEmptyPacketListener("world_hand_landmarks", ((r) => {
      f(this, r);
    })), this.g.attachProtoVectorListener("handedness", ((r, s) => {
      var i = this.handedness, o = i.push;
      const a = [];
      for (const c of r) {
        r = Hn(c);
        const u = [];
        for (const h of r.g()) u.push({ score: D(h, 2) ?? 0, index: yt(h, 1) ?? 0 ?? -1, categoryName: X(P(h, 3)) ?? "" ?? "", displayName: X(P(h, 4)) ?? "" ?? "" });
        a.push(u);
      }
      o.call(i, ...a), f(this, s);
    })), this.g.attachEmptyPacketListener("handedness", ((r) => {
      f(this, r);
    })), t = t.g(), this.setGraph(new Uint8Array(t), !0);
  }
};
rt.prototype.detectForVideo = rt.prototype.G, rt.prototype.detect = rt.prototype.F, rt.prototype.setOptions = rt.prototype.o, rt.createFromModelPath = function(t, e) {
  return A(rt, t, { baseOptions: { modelAssetPath: e } });
}, rt.createFromModelBuffer = function(t, e) {
  return A(rt, t, { baseOptions: { modelAssetBuffer: e } });
}, rt.createFromOptions = function(t, e) {
  return A(rt, t, e);
}, rt.HAND_CONNECTIONS = ys;
var Oa = bt([0, 1], [1, 2], [2, 3], [3, 7], [0, 4], [4, 5], [5, 6], [6, 8], [9, 10], [11, 12], [11, 13], [13, 15], [15, 17], [15, 19], [15, 21], [17, 19], [12, 14], [14, 16], [16, 18], [16, 20], [16, 22], [18, 20], [11, 23], [12, 24], [23, 24], [23, 25], [24, 26], [25, 27], [26, 28], [27, 29], [28, 30], [29, 31], [30, 32], [27, 31], [28, 32]);
function wi(t) {
  t.h = { faceLandmarks: [], faceBlendshapes: [], poseLandmarks: [], poseWorldLandmarks: [], poseSegmentationMasks: [], leftHandLandmarks: [], leftHandWorldLandmarks: [], rightHandLandmarks: [], rightHandWorldLandmarks: [] };
}
function bi(t) {
  try {
    if (!t.D) return t.h;
    t.D(t.h);
  } finally {
    qn(t);
  }
}
function gn(t, e) {
  t = an(t), e.push(Wn(t));
}
var L = class extends ut {
  constructor(t, e) {
    super(new At(t, e), "input_frames_image", null, !1), this.h = { faceLandmarks: [], faceBlendshapes: [], poseLandmarks: [], poseWorldLandmarks: [], poseSegmentationMasks: [], leftHandLandmarks: [], leftHandWorldLandmarks: [], rightHandLandmarks: [], rightHandWorldLandmarks: [] }, this.outputPoseSegmentationMasks = this.outputFaceBlendshapes = !1, y(t = this.j = new aa(), 0, 1, e = new R()), this.I = new rs(), y(this.j, 0, 2, this.I), this.W = new f1(), y(this.j, 0, 3, this.W), this.u = new zn(), y(this.j, 0, 4, this.u), this.O = new Zo(), y(this.j, 0, 5, this.O), this.A = new ia(), y(this.j, 0, 6, this.A), this.M = new oa(), y(this.j, 0, 7, this.M), m(this.u, 2, 0.5), m(this.u, 3, 0.3), m(this.O, 2, 0.5), m(this.A, 2, 0.5), m(this.A, 3, 0.3), m(this.M, 2, 0.5), m(this.I, 2, 0.5);
  }
  get baseOptions() {
    return E(this.j, R, 1);
  }
  set baseOptions(t) {
    y(this.j, 0, 1, t);
  }
  o(t) {
    return "minFaceDetectionConfidence" in t && m(this.u, 2, t.minFaceDetectionConfidence ?? 0.5), "minFaceSuppressionThreshold" in t && m(this.u, 3, t.minFaceSuppressionThreshold ?? 0.3), "minFacePresenceConfidence" in t && m(this.O, 2, t.minFacePresenceConfidence ?? 0.5), "outputFaceBlendshapes" in t && (this.outputFaceBlendshapes = !!t.outputFaceBlendshapes), "minPoseDetectionConfidence" in t && m(this.A, 2, t.minPoseDetectionConfidence ?? 0.5), "minPoseSuppressionThreshold" in t && m(this.A, 3, t.minPoseSuppressionThreshold ?? 0.3), "minPosePresenceConfidence" in t && m(this.M, 2, t.minPosePresenceConfidence ?? 0.5), "outputPoseSegmentationMasks" in t && (this.outputPoseSegmentationMasks = !!t.outputPoseSegmentationMasks), "minHandLandmarksConfidence" in t && m(this.I, 2, t.minHandLandmarksConfidence ?? 0.5), this.l(t);
  }
  F(t, e, n) {
    const r = typeof e != "function" ? e : {};
    return this.D = typeof e == "function" ? e : n, wi(this), Et(this, t, r), bi(this);
  }
  G(t, e, n, r) {
    const s = typeof n != "function" ? n : {};
    return this.D = typeof n == "function" ? n : r, wi(this), Rt(this, t, s, e), bi(this);
  }
  m() {
    var t = new ft();
    I(t, "input_frames_image"), k(t, "pose_landmarks"), k(t, "pose_world_landmarks"), k(t, "face_landmarks"), k(t, "left_hand_landmarks"), k(t, "left_hand_world_landmarks"), k(t, "right_hand_landmarks"), k(t, "right_hand_world_landmarks");
    const e = new lt(), n = new Ws();
    ht(n, 1, "type.googleapis.com/mediapipe.tasks.vision.holistic_landmarker.proto.HolisticLandmarkerGraphOptions"), (function(s, i) {
      if (i != null) if (Array.isArray(i)) S(s, 2, Pn(i, 0, Ze));
      else {
        if (!(typeof i == "string" || i instanceof Ft || Er(i))) throw Error("invalid value in Any.value field: " + i + " expected a ByteString, a base64 encoded string, a Uint8Array or a jspb array");
        zt(s, 2, Sr(i, !1), oe());
      }
    })(n, this.j.g());
    const r = new nt();
    ht(r, 2, "mediapipe.tasks.vision.holistic_landmarker.HolisticLandmarkerGraph"), Ur(r, 8, Ws, n), M(r, "IMAGE:input_frames_image"), b(r, "POSE_LANDMARKS:pose_landmarks"), b(r, "POSE_WORLD_LANDMARKS:pose_world_landmarks"), b(r, "FACE_LANDMARKS:face_landmarks"), b(r, "LEFT_HAND_LANDMARKS:left_hand_landmarks"), b(r, "LEFT_HAND_WORLD_LANDMARKS:left_hand_world_landmarks"), b(r, "RIGHT_HAND_LANDMARKS:right_hand_landmarks"), b(r, "RIGHT_HAND_WORLD_LANDMARKS:right_hand_world_landmarks"), r.o(e), vt(t, r), Kn(this, t), this.g.attachProtoListener("pose_landmarks", ((s, i) => {
      gn(s, this.h.poseLandmarks), f(this, i);
    })), this.g.attachEmptyPacketListener("pose_landmarks", ((s) => {
      f(this, s);
    })), this.g.attachProtoListener("pose_world_landmarks", ((s, i) => {
      var o = this.h.poseWorldLandmarks;
      s = _e(s), o.push($e(s)), f(this, i);
    })), this.g.attachEmptyPacketListener("pose_world_landmarks", ((s) => {
      f(this, s);
    })), this.outputPoseSegmentationMasks && (b(r, "POSE_SEGMENTATION_MASK:pose_segmentation_mask"), Le(this, "pose_segmentation_mask"), this.g.Z("pose_segmentation_mask", ((s, i) => {
      this.h.poseSegmentationMasks = [Me(this, s, !0, !this.D)], f(this, i);
    })), this.g.attachEmptyPacketListener("pose_segmentation_mask", ((s) => {
      this.h.poseSegmentationMasks = [], f(this, s);
    }))), this.g.attachProtoListener("face_landmarks", ((s, i) => {
      gn(s, this.h.faceLandmarks), f(this, i);
    })), this.g.attachEmptyPacketListener("face_landmarks", ((s) => {
      f(this, s);
    })), this.outputFaceBlendshapes && (k(t, "extra_blendshapes"), b(r, "FACE_BLENDSHAPES:extra_blendshapes"), this.g.attachProtoListener("extra_blendshapes", ((s, i) => {
      var o = this.h.faceBlendshapes;
      this.outputFaceBlendshapes && (s = Hn(s), o.push(cs(s.g() ?? []))), f(this, i);
    })), this.g.attachEmptyPacketListener("extra_blendshapes", ((s) => {
      f(this, s);
    }))), this.g.attachProtoListener("left_hand_landmarks", ((s, i) => {
      gn(s, this.h.leftHandLandmarks), f(this, i);
    })), this.g.attachEmptyPacketListener("left_hand_landmarks", ((s) => {
      f(this, s);
    })), this.g.attachProtoListener("left_hand_world_landmarks", ((s, i) => {
      var o = this.h.leftHandWorldLandmarks;
      s = _e(s), o.push($e(s)), f(this, i);
    })), this.g.attachEmptyPacketListener("left_hand_world_landmarks", ((s) => {
      f(this, s);
    })), this.g.attachProtoListener("right_hand_landmarks", ((s, i) => {
      gn(s, this.h.rightHandLandmarks), f(this, i);
    })), this.g.attachEmptyPacketListener("right_hand_landmarks", ((s) => {
      f(this, s);
    })), this.g.attachProtoListener("right_hand_world_landmarks", ((s, i) => {
      var o = this.h.rightHandWorldLandmarks;
      s = _e(s), o.push($e(s)), f(this, i);
    })), this.g.attachEmptyPacketListener("right_hand_world_landmarks", ((s) => {
      f(this, s);
    })), t = t.g(), this.setGraph(new Uint8Array(t), !0);
  }
};
L.prototype.detectForVideo = L.prototype.G, L.prototype.detect = L.prototype.F, L.prototype.setOptions = L.prototype.o, L.createFromModelPath = function(t, e) {
  return A(L, t, { baseOptions: { modelAssetPath: e } });
}, L.createFromModelBuffer = function(t, e) {
  return A(L, t, { baseOptions: { modelAssetBuffer: e } });
}, L.createFromOptions = function(t, e) {
  return A(L, t, e);
}, L.HAND_CONNECTIONS = ys, L.POSE_CONNECTIONS = Oa, L.FACE_LANDMARKS_LIPS = ls, L.FACE_LANDMARKS_LEFT_EYE = fs, L.FACE_LANDMARKS_LEFT_EYEBROW = ds, L.FACE_LANDMARKS_LEFT_IRIS = xa, L.FACE_LANDMARKS_RIGHT_EYE = ps, L.FACE_LANDMARKS_RIGHT_EYEBROW = gs, L.FACE_LANDMARKS_RIGHT_IRIS = Ma, L.FACE_LANDMARKS_FACE_OVAL = ms, L.FACE_LANDMARKS_CONTOURS = Fa, L.FACE_LANDMARKS_TESSELATION = Pa;
var gt = class extends ut {
  constructor(t, e) {
    super(new At(t, e), "input_image", "norm_rect", !0), this.j = { classifications: [] }, y(t = this.h = new ca(), 0, 1, e = new R());
  }
  get baseOptions() {
    return E(this.h, R, 1);
  }
  set baseOptions(t) {
    y(this.h, 0, 1, t);
  }
  o(t) {
    return y(this.h, 0, 2, mr(t, E(this.h, es, 2))), this.l(t);
  }
  sa(t, e) {
    return this.j = { classifications: [] }, Et(this, t, e), this.j;
  }
  ta(t, e, n) {
    return this.j = { classifications: [] }, Rt(this, t, n, e), this.j;
  }
  m() {
    var t = new ft();
    I(t, "input_image"), I(t, "norm_rect"), k(t, "classifications");
    const e = new lt();
    Ct(e, d1, this.h);
    const n = new nt();
    ht(n, 2, "mediapipe.tasks.vision.image_classifier.ImageClassifierGraph"), M(n, "IMAGE:input_image"), M(n, "NORM_RECT:norm_rect"), b(n, "CLASSIFICATIONS:classifications"), n.o(e), vt(t, n), this.g.attachProtoListener("classifications", ((r, s) => {
      this.j = v1(e1(r)), f(this, s);
    })), this.g.attachEmptyPacketListener("classifications", ((r) => {
      f(this, r);
    })), t = t.g(), this.setGraph(new Uint8Array(t), !0);
  }
};
gt.prototype.classifyForVideo = gt.prototype.ta, gt.prototype.classify = gt.prototype.sa, gt.prototype.setOptions = gt.prototype.o, gt.createFromModelPath = function(t, e) {
  return A(gt, t, { baseOptions: { modelAssetPath: e } });
}, gt.createFromModelBuffer = function(t, e) {
  return A(gt, t, { baseOptions: { modelAssetBuffer: e } });
}, gt.createFromOptions = function(t, e) {
  return A(gt, t, e);
};
var st = class extends ut {
  constructor(t, e) {
    super(new At(t, e), "image_in", "norm_rect", !0), this.h = new ha(), this.embeddings = { embeddings: [] }, y(t = this.h, 0, 1, e = new R());
  }
  get baseOptions() {
    return E(this.h, R, 1);
  }
  set baseOptions(t) {
    y(this.h, 0, 1, t);
  }
  o(t) {
    var e = this.h, n = E(this.h, ti, 2);
    return n = n ? n.clone() : new ti(), t.l2Normalize !== void 0 ? S(n, 1, Je(t.l2Normalize)) : "l2Normalize" in t && S(n, 1), t.quantize !== void 0 ? S(n, 2, Je(t.quantize)) : "quantize" in t && S(n, 2), y(e, 0, 2, n), this.l(t);
  }
  za(t, e) {
    return Et(this, t, e), this.embeddings;
  }
  Aa(t, e, n) {
    return Rt(this, t, n, e), this.embeddings;
  }
  m() {
    var t = new ft();
    I(t, "image_in"), I(t, "norm_rect"), k(t, "embeddings_out");
    const e = new lt();
    Ct(e, p1, this.h);
    const n = new nt();
    ht(n, 2, "mediapipe.tasks.vision.image_embedder.ImageEmbedderGraph"), M(n, "IMAGE:image_in"), M(n, "NORM_RECT:norm_rect"), b(n, "EMBEDDINGS:embeddings_out"), n.o(e), vt(t, n), this.g.attachProtoListener("embeddings_out", ((r, s) => {
      r = s1(r), this.embeddings = (function(i) {
        return { embeddings: Vt(i, r1, 1).map(((o) => {
          var u, h;
          const a = { headIndex: yt(o, 3) ?? 0 ?? -1, headName: X(P(o, 4)) ?? "" ?? "" };
          var c = o.v;
          return io(c, 0 | c[d], Qs, Jn(o, 1)) !== void 0 ? (o = te(o = E(o, Qs, Jn(o, 1), void 0), 1, Mt, Qt()), a.floatEmbedding = o.slice()) : (c = new Uint8Array(0), a.quantizedEmbedding = ((h = (u = E(o, n1, Jn(o, 2), void 0)) == null ? void 0 : u.na()) == null ? void 0 : h.h()) ?? c), a;
        })), timestampMs: ma(P(i, 2, void 0, void 0, _n) ?? to) };
      })(r), f(this, s);
    })), this.g.attachEmptyPacketListener("embeddings_out", ((r) => {
      f(this, r);
    })), t = t.g(), this.setGraph(new Uint8Array(t), !0);
  }
};
st.cosineSimilarity = function(t, e) {
  if (t.floatEmbedding && e.floatEmbedding) t = oi(t.floatEmbedding, e.floatEmbedding);
  else {
    if (!t.quantizedEmbedding || !e.quantizedEmbedding) throw Error("Cannot compute cosine similarity between quantized and float embeddings.");
    t = oi(ii(t.quantizedEmbedding), ii(e.quantizedEmbedding));
  }
  return t;
}, st.prototype.embedForVideo = st.prototype.Aa, st.prototype.embed = st.prototype.za, st.prototype.setOptions = st.prototype.o, st.createFromModelPath = function(t, e) {
  return A(st, t, { baseOptions: { modelAssetPath: e } });
}, st.createFromModelBuffer = function(t, e) {
  return A(st, t, { baseOptions: { modelAssetBuffer: e } });
}, st.createFromOptions = function(t, e) {
  return A(st, t, e);
};
var wr = class {
  constructor(t, e, n) {
    this.confidenceMasks = t, this.categoryMask = e, this.qualityScores = n;
  }
  close() {
    var t, e;
    (t = this.confidenceMasks) == null || t.forEach(((n) => {
      n.close();
    })), (e = this.categoryMask) == null || e.close();
  }
};
function T1(t) {
  var n, r;
  const e = (function(s) {
    return Vt(s, nt, 1);
  })(t.ca()).filter(((s) => (X(P(s, 1)) ?? "").includes("mediapipe.tasks.TensorsToSegmentationCalculator")));
  if (t.u = [], e.length > 1) throw Error("The graph has more than one mediapipe.tasks.TensorsToSegmentationCalculator.");
  e.length === 1 && (((r = (n = E(e[0], lt, 7)) == null ? void 0 : n.j()) == null ? void 0 : r.g()) ?? /* @__PURE__ */ new Map()).forEach(((s, i) => {
    t.u[Number(i)] = X(P(s, 1)) ?? "";
  }));
}
function Ai(t) {
  t.categoryMask = void 0, t.confidenceMasks = void 0, t.qualityScores = void 0;
}
function Ei(t) {
  try {
    const e = new wr(t.confidenceMasks, t.categoryMask, t.qualityScores);
    if (!t.j) return e;
    t.j(e);
  } finally {
    qn(t);
  }
}
wr.prototype.close = wr.prototype.close;
var et = class extends ut {
  constructor(t, e) {
    super(new At(t, e), "image_in", "norm_rect", !1), this.u = [], this.outputCategoryMask = !1, this.outputConfidenceMasks = !0, this.h = new as(), this.A = new ua(), y(this.h, 0, 3, this.A), y(t = this.h, 0, 1, e = new R());
  }
  get baseOptions() {
    return E(this.h, R, 1);
  }
  set baseOptions(t) {
    y(this.h, 0, 1, t);
  }
  o(t) {
    return t.displayNamesLocale !== void 0 ? S(this.h, 2, rn(t.displayNamesLocale)) : "displayNamesLocale" in t && S(this.h, 2), "outputCategoryMask" in t && (this.outputCategoryMask = t.outputCategoryMask ?? !1), "outputConfidenceMasks" in t && (this.outputConfidenceMasks = t.outputConfidenceMasks ?? !0), super.l(t);
  }
  L() {
    T1(this);
  }
  segment(t, e, n) {
    const r = typeof e != "function" ? e : {};
    return this.j = typeof e == "function" ? e : n, Ai(this), Et(this, t, r), Ei(this);
  }
  La(t, e, n, r) {
    const s = typeof n != "function" ? n : {};
    return this.j = typeof n == "function" ? n : r, Ai(this), Rt(this, t, s, e), Ei(this);
  }
  Da() {
    return this.u;
  }
  m() {
    var t = new ft();
    I(t, "image_in"), I(t, "norm_rect");
    const e = new lt();
    Ct(e, fa, this.h);
    const n = new nt();
    ht(n, 2, "mediapipe.tasks.vision.image_segmenter.ImageSegmenterGraph"), M(n, "IMAGE:image_in"), M(n, "NORM_RECT:norm_rect"), n.o(e), vt(t, n), Kn(this, t), this.outputConfidenceMasks && (k(t, "confidence_masks"), b(n, "CONFIDENCE_MASKS:confidence_masks"), Le(this, "confidence_masks"), this.g.aa("confidence_masks", ((r, s) => {
      this.confidenceMasks = r.map(((i) => Me(this, i, !0, !this.j))), f(this, s);
    })), this.g.attachEmptyPacketListener("confidence_masks", ((r) => {
      this.confidenceMasks = [], f(this, r);
    }))), this.outputCategoryMask && (k(t, "category_mask"), b(n, "CATEGORY_MASK:category_mask"), Le(this, "category_mask"), this.g.Z("category_mask", ((r, s) => {
      this.categoryMask = Me(this, r, !1, !this.j), f(this, s);
    })), this.g.attachEmptyPacketListener("category_mask", ((r) => {
      this.categoryMask = void 0, f(this, r);
    }))), k(t, "quality_scores"), b(n, "QUALITY_SCORES:quality_scores"), this.g.attachFloatVectorListener("quality_scores", ((r, s) => {
      this.qualityScores = r, f(this, s);
    })), this.g.attachEmptyPacketListener("quality_scores", ((r) => {
      this.categoryMask = void 0, f(this, r);
    })), t = t.g(), this.setGraph(new Uint8Array(t), !0);
  }
};
et.prototype.getLabels = et.prototype.Da, et.prototype.segmentForVideo = et.prototype.La, et.prototype.segment = et.prototype.segment, et.prototype.setOptions = et.prototype.o, et.createFromModelPath = function(t, e) {
  return A(et, t, { baseOptions: { modelAssetPath: e } });
}, et.createFromModelBuffer = function(t, e) {
  return A(et, t, { baseOptions: { modelAssetBuffer: e } });
}, et.createFromOptions = function(t, e) {
  return A(et, t, e);
};
var br = class {
  constructor(t, e, n) {
    this.confidenceMasks = t, this.categoryMask = e, this.qualityScores = n;
  }
  close() {
    var t, e;
    (t = this.confidenceMasks) == null || t.forEach(((n) => {
      n.close();
    })), (e = this.categoryMask) == null || e.close();
  }
};
br.prototype.close = br.prototype.close;
var xt = class extends ut {
  constructor(t, e) {
    super(new At(t, e), "image_in", "norm_rect_in", !1), this.outputCategoryMask = !1, this.outputConfidenceMasks = !0, this.h = new as(), this.u = new ua(), y(this.h, 0, 3, this.u), y(t = this.h, 0, 1, e = new R());
  }
  get baseOptions() {
    return E(this.h, R, 1);
  }
  set baseOptions(t) {
    y(this.h, 0, 1, t);
  }
  o(t) {
    return "outputCategoryMask" in t && (this.outputCategoryMask = t.outputCategoryMask ?? !1), "outputConfidenceMasks" in t && (this.outputConfidenceMasks = t.outputConfidenceMasks ?? !0), super.l(t);
  }
  segment(t, e, n, r) {
    const s = typeof n != "function" ? n : {};
    if (this.j = typeof n == "function" ? n : r, this.qualityScores = this.categoryMask = this.confidenceMasks = void 0, n = this.C + 1, r = new da(), e.keypoint && e.scribble) throw Error("Cannot provide both keypoint and scribble.");
    if (e.keypoint) {
      var i = new er();
      zt(i, 3, Je(!0), !1), zt(i, 1, We(e.keypoint.x), 0), zt(i, 2, We(e.keypoint.y), 0), Ke(r, 1, gr, i);
    } else {
      if (!e.scribble) throw Error("Must provide either a keypoint or a scribble.");
      {
        const a = new m1();
        for (i of e.scribble) zt(e = new er(), 3, Je(!0), !1), zt(e, 1, We(i.x), 0), zt(e, 2, We(i.y), 0), Ur(a, 1, er, e);
        Ke(r, 2, gr, a);
      }
    }
    this.g.addProtoToStream(r.g(), "mediapipe.tasks.vision.interactive_segmenter.proto.RegionOfInterest", "roi_in", n), Et(this, t, s);
    t: {
      try {
        const a = new br(this.confidenceMasks, this.categoryMask, this.qualityScores);
        if (!this.j) {
          var o = a;
          break t;
        }
        this.j(a);
      } finally {
        qn(this);
      }
      o = void 0;
    }
    return o;
  }
  m() {
    var t = new ft();
    I(t, "image_in"), I(t, "roi_in"), I(t, "norm_rect_in");
    const e = new lt();
    Ct(e, fa, this.h);
    const n = new nt();
    ht(n, 2, "mediapipe.tasks.vision.interactive_segmenter.InteractiveSegmenterGraphV2"), M(n, "IMAGE:image_in"), M(n, "ROI:roi_in"), M(n, "NORM_RECT:norm_rect_in"), n.o(e), vt(t, n), Kn(this, t), this.outputConfidenceMasks && (k(t, "confidence_masks"), b(n, "CONFIDENCE_MASKS:confidence_masks"), Le(this, "confidence_masks"), this.g.aa("confidence_masks", ((r, s) => {
      this.confidenceMasks = r.map(((i) => Me(this, i, !0, !this.j))), f(this, s);
    })), this.g.attachEmptyPacketListener("confidence_masks", ((r) => {
      this.confidenceMasks = [], f(this, r);
    }))), this.outputCategoryMask && (k(t, "category_mask"), b(n, "CATEGORY_MASK:category_mask"), Le(this, "category_mask"), this.g.Z("category_mask", ((r, s) => {
      this.categoryMask = Me(this, r, !1, !this.j), f(this, s);
    })), this.g.attachEmptyPacketListener("category_mask", ((r) => {
      this.categoryMask = void 0, f(this, r);
    }))), k(t, "quality_scores"), b(n, "QUALITY_SCORES:quality_scores"), this.g.attachFloatVectorListener("quality_scores", ((r, s) => {
      this.qualityScores = r, f(this, s);
    })), this.g.attachEmptyPacketListener("quality_scores", ((r) => {
      this.categoryMask = void 0, f(this, r);
    })), t = t.g(), this.setGraph(new Uint8Array(t), !0);
  }
};
xt.prototype.segment = xt.prototype.segment, xt.prototype.setOptions = xt.prototype.o, xt.createFromModelPath = function(t, e) {
  return A(xt, t, { baseOptions: { modelAssetPath: e } });
}, xt.createFromModelBuffer = function(t, e) {
  return A(xt, t, { baseOptions: { modelAssetBuffer: e } });
}, xt.createFromOptions = function(t, e) {
  return A(xt, t, e);
};
var mt = class extends ut {
  constructor(t, e) {
    super(new At(t, e), "input_frame_gpu", "norm_rect", !1), this.j = { detections: [] }, y(t = this.h = new pa(), 0, 1, e = new R());
  }
  get baseOptions() {
    return E(this.h, R, 1);
  }
  set baseOptions(t) {
    y(this.h, 0, 1, t);
  }
  o(t) {
    return t.displayNamesLocale !== void 0 ? S(this.h, 2, rn(t.displayNamesLocale)) : "displayNamesLocale" in t && S(this.h, 2), t.maxResults !== void 0 ? jt(this.h, 3, t.maxResults) : "maxResults" in t && S(this.h, 3), t.scoreThreshold !== void 0 ? m(this.h, 4, t.scoreThreshold) : "scoreThreshold" in t && S(this.h, 4), t.categoryAllowlist !== void 0 ? wn(this.h, 5, t.categoryAllowlist) : "categoryAllowlist" in t && S(this.h, 5), t.categoryDenylist !== void 0 ? wn(this.h, 6, t.categoryDenylist) : "categoryDenylist" in t && S(this.h, 6), this.l(t);
  }
  F(t, e) {
    return this.j = { detections: [] }, Et(this, t, e), this.j;
  }
  G(t, e, n) {
    return this.j = { detections: [] }, Rt(this, t, n, e), this.j;
  }
  m() {
    var t = new ft();
    I(t, "input_frame_gpu"), I(t, "norm_rect"), k(t, "detections");
    const e = new lt();
    Ct(e, y1, this.h);
    const n = new nt();
    ht(n, 2, "mediapipe.tasks.vision.ObjectDetectorGraph"), M(n, "IMAGE:input_frame_gpu"), M(n, "NORM_RECT:norm_rect"), b(n, "DETECTIONS:detections"), n.o(e), vt(t, n), this.g.attachProtoVectorListener("detections", ((r, s) => {
      for (const i of r) r = Wo(i), this.j.detections.push(ya(r));
      f(this, s);
    })), this.g.attachEmptyPacketListener("detections", ((r) => {
      f(this, r);
    })), t = t.g(), this.setGraph(new Uint8Array(t), !0);
  }
};
mt.prototype.detectForVideo = mt.prototype.G, mt.prototype.detect = mt.prototype.F, mt.prototype.setOptions = mt.prototype.o, mt.createFromModelPath = async function(t, e) {
  return A(mt, t, { baseOptions: { modelAssetPath: e } });
}, mt.createFromModelBuffer = function(t, e) {
  return A(mt, t, { baseOptions: { modelAssetBuffer: e } });
}, mt.createFromOptions = function(t, e) {
  return A(mt, t, e);
};
var Ar = class {
  constructor(t, e, n) {
    this.landmarks = t, this.worldLandmarks = e, this.segmentationMasks = n;
  }
  close() {
    var t;
    (t = this.segmentationMasks) == null || t.forEach(((e) => {
      e.close();
    }));
  }
};
function ki(t) {
  t.landmarks = [], t.worldLandmarks = [], t.segmentationMasks = void 0;
}
function Si(t) {
  try {
    const e = new Ar(t.landmarks, t.worldLandmarks, t.segmentationMasks);
    if (!t.u) return e;
    t.u(e);
  } finally {
    qn(t);
  }
}
Ar.prototype.close = Ar.prototype.close;
var it = class extends ut {
  constructor(t, e) {
    super(new At(t, e), "image_in", "norm_rect", !1), this.landmarks = [], this.worldLandmarks = [], this.outputSegmentationMasks = !1, y(t = this.h = new ga(), 0, 1, e = new R()), this.A = new oa(), y(this.h, 0, 3, this.A), this.j = new ia(), y(this.h, 0, 2, this.j), jt(this.j, 4, 1), m(this.j, 2, 0.5), m(this.A, 2, 0.5), m(this.h, 4, 0.5);
  }
  get baseOptions() {
    return E(this.h, R, 1);
  }
  set baseOptions(t) {
    y(this.h, 0, 1, t);
  }
  o(t) {
    return "numPoses" in t && jt(this.j, 4, t.numPoses ?? 1), "minPoseDetectionConfidence" in t && m(this.j, 2, t.minPoseDetectionConfidence ?? 0.5), "minTrackingConfidence" in t && m(this.h, 4, t.minTrackingConfidence ?? 0.5), "minPosePresenceConfidence" in t && m(this.A, 2, t.minPosePresenceConfidence ?? 0.5), "outputSegmentationMasks" in t && (this.outputSegmentationMasks = t.outputSegmentationMasks ?? !1), this.l(t);
  }
  F(t, e, n) {
    const r = typeof e != "function" ? e : {};
    return this.u = typeof e == "function" ? e : n, ki(this), Et(this, t, r), Si(this);
  }
  G(t, e, n, r) {
    const s = typeof n != "function" ? n : {};
    return this.u = typeof n == "function" ? n : r, ki(this), Rt(this, t, s, e), Si(this);
  }
  m() {
    var t = new ft();
    I(t, "image_in"), I(t, "norm_rect"), k(t, "normalized_landmarks"), k(t, "world_landmarks"), k(t, "segmentation_masks");
    const e = new lt();
    Ct(e, _1, this.h);
    const n = new nt();
    ht(n, 2, "mediapipe.tasks.vision.pose_landmarker.PoseLandmarkerGraph"), M(n, "IMAGE:image_in"), M(n, "NORM_RECT:norm_rect"), b(n, "NORM_LANDMARKS:normalized_landmarks"), b(n, "WORLD_LANDMARKS:world_landmarks"), n.o(e), vt(t, n), Kn(this, t), this.g.attachProtoVectorListener("normalized_landmarks", ((r, s) => {
      this.landmarks = [];
      for (const i of r) r = an(i), this.landmarks.push(Wn(r));
      f(this, s);
    })), this.g.attachEmptyPacketListener("normalized_landmarks", ((r) => {
      this.landmarks = [], f(this, r);
    })), this.g.attachProtoVectorListener("world_landmarks", ((r, s) => {
      this.worldLandmarks = [];
      for (const i of r) r = _e(i), this.worldLandmarks.push($e(r));
      f(this, s);
    })), this.g.attachEmptyPacketListener("world_landmarks", ((r) => {
      this.worldLandmarks = [], f(this, r);
    })), this.outputSegmentationMasks && (b(n, "SEGMENTATION_MASK:segmentation_masks"), Le(this, "segmentation_masks"), this.g.aa("segmentation_masks", ((r, s) => {
      this.segmentationMasks = r.map(((i) => Me(this, i, !0, !this.u))), f(this, s);
    })), this.g.attachEmptyPacketListener("segmentation_masks", ((r) => {
      this.segmentationMasks = [], f(this, r);
    }))), t = t.g(), this.setGraph(new Uint8Array(t), !0);
  }
};
it.prototype.detectForVideo = it.prototype.G, it.prototype.detect = it.prototype.F, it.prototype.setOptions = it.prototype.o, it.createFromModelPath = function(t, e) {
  return A(it, t, { baseOptions: { modelAssetPath: e } });
}, it.createFromModelBuffer = function(t, e) {
  return A(it, t, { baseOptions: { modelAssetBuffer: e } });
}, it.createFromOptions = function(t, e) {
  return A(it, t, e);
}, it.POSE_CONNECTIONS = Oa;
const L1 = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18/wasm", Ti = "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task";
class x1 {
  constructor() {
    Tt(this, "recognizer", null);
    Tt(this, "lastVideoTime", -1);
  }
  get isReady() {
    return this.recognizer !== null;
  }
  async initialize(e = {}) {
    const { numHands: n = 2, delegate: r = "GPU" } = e, s = await ge.forVisionTasks(L1);
    try {
      this.recognizer = await Y.createFromOptions(s, {
        baseOptions: { modelAssetPath: Ti, delegate: r },
        runningMode: "VIDEO",
        numHands: n
      });
    } catch (i) {
      if (r === "GPU")
        console.warn("GPU delegate failed, retrying on CPU.", i), this.recognizer = await Y.createFromOptions(s, {
          baseOptions: { modelAssetPath: Ti, delegate: "CPU" },
          runningMode: "VIDEO",
          numHands: n
        });
      else
        throw i;
    }
  }
  /**
   * Run recognition on the current video frame. Returns `null` when the
   * frame is unchanged (avoids the recognizer throwing on duplicate
   * timestamps) or when the recognizer is not initialized.
   */
  recognize(e, n) {
    if (!this.recognizer || e.currentTime === this.lastVideoTime) return null;
    this.lastVideoTime = e.currentTime;
    const r = performance.now(), s = this.recognizer.recognizeForVideo(e, n), i = performance.now() - r;
    return {
      timestamp: n,
      inferenceTimeMs: i,
      hands: this.mapResult(s)
    };
  }
  close() {
    var e;
    (e = this.recognizer) == null || e.close(), this.recognizer = null, this.lastVideoTime = -1;
  }
  mapResult(e) {
    var s, i;
    const n = [], r = e.landmarks.length;
    for (let o = 0; o < r; o++) {
      const a = (e.landmarks[o] ?? []).map((h) => ({
        x: h.x,
        y: h.y,
        z: h.z,
        visibility: h.visibility
      })), c = (s = e.gestures[o]) == null ? void 0 : s[0], u = (i = e.handedness[o]) == null ? void 0 : i[0];
      n.push({
        index: o,
        gesture: (c == null ? void 0 : c.categoryName) ?? "None",
        confidence: (c == null ? void 0 : c.score) ?? 0,
        handedness: (u == null ? void 0 : u.categoryName) ?? "Unknown",
        landmarks: a
      });
    }
    return n;
  }
}
const Li = [
  "wrist",
  "thumb_cmc",
  "thumb_mcp",
  "thumb_ip",
  "thumb_tip",
  "index_finger_mcp",
  "index_finger_pip",
  "index_finger_dip",
  "index_finger_tip",
  "middle_finger_mcp",
  "middle_finger_pip",
  "middle_finger_dip",
  "middle_finger_tip",
  "ring_finger_mcp",
  "ring_finger_pip",
  "ring_finger_dip",
  "ring_finger_tip",
  "pinky_mcp",
  "pinky_pip",
  "pinky_dip",
  "pinky_tip"
], M1 = Y.HAND_CONNECTIONS, rr = {
  Left: "#00e5ff",
  Right: "#ff4f81",
  default: "#7cffb2"
};
class F1 {
  constructor(e, n) {
    Tt(this, "ctx");
    Tt(this, "mirror", !1);
    Tt(this, "cssWidth", 0);
    Tt(this, "cssHeight", 0);
    this.canvas = e, this.video = n;
    const r = e.getContext("2d");
    if (!r) throw new Error("Unable to acquire 2D canvas context.");
    this.ctx = r;
  }
  setMirror(e) {
    this.mirror = e;
  }
  /** Match the backing store to the displayed video size and DPR. */
  resize() {
    const e = window.devicePixelRatio || 1, n = this.video.getBoundingClientRect();
    this.cssWidth = n.width, this.cssHeight = n.height;
    const r = Math.round(n.width * e), s = Math.round(n.height * e);
    (this.canvas.width !== r || this.canvas.height !== s) && (this.canvas.width = r, this.canvas.height = s), this.canvas.style.width = `${n.width}px`, this.canvas.style.height = `${n.height}px`, this.ctx.setTransform(e, 0, 0, e, 0, 0);
  }
  clear() {
    this.ctx.save(), this.ctx.setTransform(1, 0, 0, 1, 0, 0), this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height), this.ctx.restore();
  }
  draw(e) {
    this.resize(), this.clear();
    for (const n of e) {
      const r = n.handedness === "Left" ? rr.Left : n.handedness === "Right" ? rr.Right : rr.default;
      this.drawConnections(n.landmarks, r), this.drawLandmarks(n.landmarks), this.drawLabel(n, r);
    }
  }
  px(e) {
    return { x: (this.mirror ? 1 - e.x : e.x) * this.cssWidth, y: e.y * this.cssHeight };
  }
  drawConnections(e, n) {
    this.ctx.lineWidth = 4, this.ctx.strokeStyle = n;
    for (const { start: r, end: s } of M1) {
      const i = e[r], o = e[s];
      if (!i || !o) continue;
      const a = this.px(i), c = this.px(o);
      this.ctx.beginPath(), this.ctx.moveTo(a.x, a.y), this.ctx.lineTo(c.x, c.y), this.ctx.stroke();
    }
  }
  drawLandmarks(e) {
    this.ctx.fillStyle = "#ffffff";
    for (const n of e) {
      const r = this.px(n);
      this.ctx.beginPath(), this.ctx.arc(r.x, r.y, 4, 0, Math.PI * 2), this.ctx.fill();
    }
  }
  drawLabel(e, n) {
    const r = e.landmarks[0];
    if (!r) return;
    const s = this.px(r), i = `${e.handedness} · ${e.gesture}`;
    this.ctx.font = "600 16px system-ui, sans-serif";
    const o = this.ctx.measureText(i), a = 8, c = 6, u = o.width + a * 2, h = 24, l = Math.min(Math.max(s.x - u / 2, 0), this.cssWidth - u), _ = Math.max(s.y - 40, 0);
    this.ctx.fillStyle = "rgba(0,0,0,0.65)", this.ctx.fillRect(l, _, u, h), this.ctx.fillStyle = n, this.ctx.fillText(i, l + a, _ + h - c);
  }
}
function xi(t, e, n) {
  const r = t.get(e);
  return typeof r == "number" ? r : n;
}
function Zt(t, e, n) {
  const r = t.get(e);
  return typeof r == "boolean" ? r : n;
}
function sr(t) {
  return t ? [t.x, t.y, t.z] : [];
}
function P1(t) {
  t.classList.add("grw"), t.innerHTML = `
    <div class="grw-stage">
      <video class="grw-video" autoplay playsinline muted></video>
      <canvas class="grw-canvas"></canvas>
      <div class="grw-msg">Camera is off</div>
    </div>
    <div class="grw-controls">
      <button class="grw-btn grw-start">Start Camera</button>
      <select class="grw-select" disabled></select>
      <label class="grw-check"><input type="checkbox" class="grw-mirror" checked /> Mirror</label>
      <span class="grw-status"><span class="grw-dot"></span><span class="grw-status-text">idle</span></span>
      <span class="grw-readout">No hand</span>
    </div>
  `;
  const e = (n) => {
    const r = t.querySelector(n);
    if (!r) throw new Error(`widget DOM missing ${n}`);
    return r;
  };
  return {
    video: e(".grw-video"),
    canvas: e(".grw-canvas"),
    message: e(".grw-msg"),
    startBtn: e(".grw-start"),
    select: e(".grw-select"),
    mirrorInput: e(".grw-mirror"),
    statusEl: e(".grw-status"),
    readout: e(".grw-readout")
  };
}
function Mi(t) {
  return t.length === 0 ? null : t.reduce((e, n) => n.confidence > e.confidence ? n : e);
}
function O1({ model: t, el: e }) {
  const n = P1(e), r = new Ha(n.video), s = new F1(n.canvas, n.video), i = new x1();
  let o = null, a = !1, c = !1, u = 0, h = [], l = performance.now();
  const _ = "requestVideoFrameCallback" in n.video, w = () => {
    o = _ ? n.video.requestVideoFrameCallback(fe) : requestAnimationFrame(fe);
  }, B = () => {
    o !== null && (_ ? n.video.cancelVideoFrameCallback(o) : cancelAnimationFrame(o), o = null);
  }, kt = (v) => {
    n.statusEl.dataset.state = v;
    const $ = n.statusEl.querySelector(".grw-status-text");
    $ && ($.textContent = v), t.set("status", v), t.save_changes();
  }, St = async () => {
    c = !1, kt("loading"), i.close(), await i.initialize({
      numHands: xi(t, "max_num_hands", 2),
      delegate: "GPU"
    }), c = !0, kt(a ? "streaming" : "ready");
  }, Yt = (v, $) => {
    const C = Mi(v.hands);
    for (let dt = 0; dt < Li.length; dt++) {
      const cn = Li[dt];
      cn && t.set(cn, sr(C == null ? void 0 : C.landmarks[dt]));
    }
    t.set("gesture", (C == null ? void 0 : C.gesture) ?? "None"), t.set("confidence", (C == null ? void 0 : C.confidence) ?? 0), t.set("handedness", (C == null ? void 0 : C.handedness) ?? ""), t.set("num_hands", v.hands.length), t.set("inference_ms", v.inferenceTimeMs), t.set("fps", $), t.set(
      "landmarks",
      C ? C.landmarks.map(sr) : []
    ), t.set(
      "hands",
      v.hands.map((dt) => ({
        gesture: dt.gesture,
        confidence: dt.confidence,
        handedness: dt.handedness,
        landmarks: dt.landmarks.map(sr)
      }))
    ), t.save_changes();
  }, fe = () => {
    if (!a || (w(), !c)) return;
    const v = i.recognize(n.video, performance.now());
    if (!v) return;
    const $ = performance.now(), C = $ - l;
    l = $, C > 0 && h.push(C), h.length > 60 && h.shift();
    const dt = h.reduce((Da, Ua) => Da + Ua, 0) / (h.length || 1), cn = dt > 0 ? 1e3 / dt : 0;
    s.draw(v.hands);
    const hn = Mi(v.hands);
    n.readout.textContent = hn ? `${hn.handedness} · ${hn.gesture} (${hn.confidence.toFixed(2)})` : "No hand";
    const Ba = xi(t, "sync_interval_ms", 100);
    $ - u >= Ba && (u = $, Yt(v, cn));
  }, Ge = async () => {
    if (!a)
      try {
        c || await St(), await r.start(), r.setMirror(Zt(t, "mirror", !0)), s.setMirror(Zt(t, "mirror", !0)), await Ia(), a = !0, n.message.style.display = "none", n.startBtn.textContent = "Stop Camera", n.startBtn.classList.add("grw-btn-danger"), kt("streaming"), Zt(t, "streaming", !1) || (t.set("streaming", !0), t.save_changes()), w();
      } catch (v) {
        const $ = v instanceof Error ? v.message : String(v);
        kt("error"), n.readout.textContent = `Error: ${$}`;
      }
  }, _s = async () => {
    a = !1, B(), await r.stop(), s.clear(), h = [], n.message.style.display = "", n.startBtn.textContent = "Start Camera", n.startBtn.classList.remove("grw-btn-danger"), kt(c ? "ready" : "idle"), Zt(t, "streaming", !1) && (t.set("streaming", !1), t.save_changes());
  }, Ia = async () => {
    const v = await r.listDevices();
    n.select.innerHTML = "";
    for (const $ of v) {
      const C = document.createElement("option");
      C.value = $.deviceId, C.textContent = $.label, $.deviceId === r.activeDeviceId && (C.selected = !0), n.select.appendChild(C);
    }
    n.select.disabled = v.length === 0;
  }, Ca = () => {
    a ? _s() : Ge();
  }, Na = () => {
    a && (async () => await r.start(n.select.value))();
  }, Ra = () => {
    const v = n.mirrorInput.checked;
    r.setMirror(v), s.setMirror(v), t.set("mirror", v), t.save_changes();
  };
  n.startBtn.addEventListener("click", Ca), n.select.addEventListener("change", Na), n.mirrorInput.addEventListener("change", Ra);
  const vs = () => {
    const v = Zt(t, "streaming", !1);
    v && !a ? Ge() : !v && a && _s();
  }, ws = () => {
    const v = Zt(t, "mirror", !0);
    n.mirrorInput.checked = v, r.setMirror(v), s.setMirror(v);
  }, bs = () => {
    c && St();
  };
  return t.on("change:streaming", vs), t.on("change:mirror", ws), t.on("change:max_num_hands", bs), n.mirrorInput.checked = Zt(t, "mirror", !0), St().catch((v) => {
    const $ = v instanceof Error ? v.message : String(v);
    kt("error"), n.readout.textContent = `Model load failed: ${$}`;
  }), () => {
    a = !1, B(), t.off("change:streaming", vs), t.off("change:mirror", ws), t.off("change:max_num_hands", bs), r.stop(), i.close();
  };
}
const C1 = { render: O1 };
export {
  C1 as default
};
