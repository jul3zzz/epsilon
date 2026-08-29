/* =======================================================================
   utils.js — outils generiques : hasard, maths, formatage, DOM, hachage
   ======================================================================= */
(function (global) {
  'use strict';

  /* ---------------- Hasard ---------------- */
  function ri(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }          // entier dans [a,b]
  function rf(a, b) { return Math.random() * (b - a) + a; }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function chance(p) { return Math.random() < p; }
  function sign() { return Math.random() < 0.5 ? -1 : 1; }
  function riNo0(a, b) { var v = 0; while (v === 0) { v = ri(a, b); } return v; }     // jamais zero
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function sample(arr, n) { return shuffle(arr).slice(0, n); }
  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }

  /* ---------------- Maths ---------------- */
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = b; b = a % b; a = t; } return a || 1; }
  function ppcm(a, b) { return Math.abs(a * b) / gcd(a, b); }

  /** Reduit n/d et remet le signe au numerateur. Renvoie [n, d]. */
  function reduce(n, d) {
    if (d < 0) { n = -n; d = -d; }
    var g = gcd(n, d);
    return [n / g, d / g];
  }
  function isPrime(n) {
    if (n < 2) return false;
    if (n % 2 === 0) return n === 2;
    for (var i = 3; i * i <= n; i += 2) if (n % i === 0) return false;
    return true;
  }
  function primesUpTo(n) { var r = []; for (var i = 2; i <= n; i++) if (isPrime(i)) r.push(i); return r; }
  function divisors(n) { var r = []; for (var i = 1; i <= n; i++) if (n % i === 0) r.push(i); return r; }
  function factorize(n) {
    var f = [], d = 2;
    while (n > 1) { while (n % d === 0) { f.push(d); n /= d; } d++; if (d * d > n && n > 1) { f.push(n); break; } }
    return f;
  }
  /** Ecrit la decomposition en facteurs premiers : 2² × 3 × 5 */
  function factorStr(n) {
    var f = factorize(n), out = [], i = 0;
    while (i < f.length) {
      var p = f[i], c = 0;
      while (i < f.length && f[i] === p) { c++; i++; }
      out.push(c > 1 ? p + expo(c) : String(p));
    }
    return out.join(' × ');
  }
  var EXPO = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹',
               '-': '⁻', n: 'ⁿ', a: 'ᵃ', b: 'ᵇ', k: 'ᵏ', p: 'ᵖ' };
  function expo(n) { return String(n).split('').map(function (c) { return EXPO[c] || c; }).join(''); }

  function round(x, dec) { var p = Math.pow(10, dec || 0); return Math.round(x * p) / p; }
  function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }

  /** Triplets pythagoriciens usuels (pour des reponses entieres). */
  var TRIPLETS = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17], [7, 24, 25],
                  [12, 16, 20], [20, 21, 29], [10, 24, 26], [15, 20, 25], [9, 40, 41], [12, 35, 37]];

  /* ---------------- Formatage ---------------- */
  /** Nombre a la francaise : virgule decimale, pas de -0. */
  function fmt(x) {
    if (typeof x !== 'number') return String(x);
    if (!isFinite(x)) return '?';
    var s = String(round(x, 6));
    if (s === '-0') s = '0';
    return s.replace('.', ',');
  }
  /** Fraction en HTML empile (numerateur sur denominateur). */
  function frac(n, d) {
    if (d === 1) return '<span class="math">' + n + '</span>';
    return '<span class="frac"><span>' + n + '</span><span>' + d + '</span></span>';
  }
  /** Fraction en texte simple : "3/4" */
  function fracTxt(n, d) { return d === 1 ? String(n) : n + '/' + d; }
  function math(s) { return '<span class="math">' + s + '</span>'; }

  /** Ecrit un monome joliment : 1x -> x, -1x -> -x, 0x -> "" */
  function mono(coef, varName, exp) {
    if (coef === 0) return '';
    var v = varName + (exp && exp > 1 ? expo(exp) : '');
    if (coef === 1) return v;
    if (coef === -1) return '-' + v;
    return coef + v;
  }
  /** Additionne des morceaux en gerant les signes : ["3x","-5"] -> "3x - 5" */
  function poly(parts) {
    var out = '';
    parts.forEach(function (p) {
      if (!p) return;
      p = String(p);
      if (out === '') { out = p.charAt(0) === '-' ? '−' + p.slice(1) : p; }
      else if (p.charAt(0) === '-') { out += ' − ' + p.slice(1); }
      else { out += ' + ' + p; }
    });
    return out === '' ? '0' : out;
  }
  /** Ecrit "ax + b" a partir des coefficients. */
  function linear(a, b, v) {
    v = v || 'x';
    return poly([mono(a, v), b === 0 ? '' : String(b)]);
  }
  /** Ecrit "ax² + bx + c" */
  function quad(a, b, c, v) {
    v = v || 'x';
    return poly([mono(a, v, 2), mono(b, v), c === 0 ? '' : String(c)]);
  }
  /** Nombre entre parentheses si negatif : (-5) */
  function par(n) { return n < 0 ? '(' + fmt(n) + ')' : fmt(n); }

  /* ---------------- Comparaison de reponses ---------------- */
  /** Nettoie une saisie utilisateur. */
  function norm(s) {
    return String(s == null ? '' : s)
      .trim().toLowerCase()
      .replace(/\s+/g, '')
      .replace(/,/g, '.')
      .replace(/×/g, '*').replace(/÷/g, '/')
      .replace(/−|–|—/g, '-')
      .replace(/^\+/, '');
  }
  /** Convertit "3/4", "2.5", "-7" en nombre. NaN si impossible. */
  function toNum(s) {
    var t = norm(s);
    if (t === '') return NaN;
    if (/^-?\d+(\.\d+)?\/-?\d+(\.\d+)?$/.test(t)) {
      var p = t.split('/');
      var d = parseFloat(p[1]);
      if (d === 0) return NaN;
      return parseFloat(p[0]) / d;
    }
    if (/^-?\d+(\.\d+)?$/.test(t)) return parseFloat(t);
    return NaN;
  }
  /**
   * Evalue une expression arithmetique tapee par l eleve (parentheses, + − × ÷, ² et ^, √).
   * Accepte par exemple "9²+40²", "(5+3)×2" ou "√81". Renvoie NaN si l ecriture n est pas valide
   * (aucune exception ne remonte : c est toujours sans risque a appeler).
   */
  function evalExpr(s) {
    var t = norm(s);
    if (t === '' || !/^[-+*/0-9.()²√^]+$/.test(t)) return NaN;
    var i = 0;
    function peek() { return t.charAt(i); }
    function bad() { throw new Error('expr'); }
    function nombre() {
      var d = i;
      while (i < t.length && /[0-9.]/.test(t.charAt(i))) i++;
      if (i === d) bad();
      return parseFloat(t.slice(d, i));
    }
    function facteur() {
      var v;
      if (peek() === '-') { i++; v = -facteur(); }
      else if (peek() === '(') { i++; v = expr(); if (peek() !== ')') bad(); i++; }
      else if (peek() === '√') { i++; v = Math.sqrt(facteur()); }
      else { v = nombre(); }
      while (peek() === '²' || peek() === '^') {
        if (peek() === '²') { i++; v = v * v; }
        else { i++; v = Math.pow(v, facteur()); }
      }
      return v;
    }
    function terme() {
      var v = facteur();
      while (peek() === '*' || peek() === '/') {
        var op = t.charAt(i++);
        v = op === '*' ? v * facteur() : v / facteur();
      }
      return v;
    }
    function expr() {
      var v = terme();
      while (peek() === '+' || peek() === '-') {
        var op = t.charAt(i++);
        v = op === '+' ? v + terme() : v - terme();
      }
      return v;
    }
    try {
      var r = expr();
      if (i !== t.length || isNaN(r) || !isFinite(r)) return NaN;
      return r;
    } catch (e) { return NaN; }
  }
  /**
   * Compare la reponse de l eleve a la solution.
   * opts.exact  : exige la meme ecriture (fraction irreductible par ex.)
   * opts.tol    : tolerance numerique (defaut 1e-6, ou 0.02 si arrondi demande)
   * opts.alt    : autres ecritures acceptees
   */
  function checkAnswer(user, expected, opts) {
    opts = opts || {};
    var u = norm(user);
    if (u === '') return false;
    var accepted = [expected].concat(opts.alt || []);
    for (var i = 0; i < accepted.length; i++) {
      if (u === norm(accepted[i])) return true;
    }
    if (opts.exact) return false;
    var un = toNum(u);
    if (isNaN(un)) un = evalExpr(u);
    if (isNaN(un)) return false;
    var tol = opts.tol == null ? 1e-6 : opts.tol;
    for (var j = 0; j < accepted.length; j++) {
      var en = toNum(accepted[j]);
      if (!isNaN(en) && Math.abs(un - en) <= tol + Math.abs(en) * 1e-9) return true;
    }
    return false;
  }

  /* ---------------- Dates ---------------- */
  function dayKey(d) {
    d = d || new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function daysBetween(k1, k2) {
    var a = new Date(k1 + 'T00:00:00'), b = new Date(k2 + 'T00:00:00');
    return Math.round((b - a) / 86400000);
  }
  function relDate(ts) {
    var diff = Date.now() - ts;
    var m = Math.floor(diff / 60000);
    if (m < 1) return 'a l instant';
    if (m < 60) return 'il y a ' + m + ' min';
    var h = Math.floor(m / 60);
    if (h < 24) return 'il y a ' + h + ' h';
    var j = Math.floor(h / 24);
    if (j === 1) return 'hier';
    if (j < 7) return 'il y a ' + j + ' jours';
    var d = new Date(ts);
    return String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth() + 1).padStart(2, '0');
  }
  function mmss(sec) {
    var m = Math.floor(sec / 60), s = Math.floor(sec % 60);
    return m + ':' + String(s).padStart(2, '0');
  }

  /* ---------------- DOM ---------------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ---------------- Hachage SHA-256 (pur JS, marche hors ligne) ---------------- */
  var K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2];

  function utf8Bytes(str) {
    var out = [], i, c;
    for (i = 0; i < str.length; i++) {
      c = str.charCodeAt(i);
      if (c < 128) out.push(c);
      else if (c < 2048) { out.push(192 | (c >> 6), 128 | (c & 63)); }
      else if (c < 55296 || c >= 57344) { out.push(224 | (c >> 12), 128 | ((c >> 6) & 63), 128 | (c & 63)); }
      else { i++; c = 65536 + (((c & 1023) << 10) | (str.charCodeAt(i) & 1023));
             out.push(240 | (c >> 18), 128 | ((c >> 12) & 63), 128 | ((c >> 6) & 63), 128 | (c & 63)); }
    }
    return out;
  }

  function sha256(message) {
    var H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
    var bytes = utf8Bytes(message);
    var bitLen = bytes.length * 8;
    bytes.push(0x80);
    while (bytes.length % 64 !== 56) bytes.push(0);
    var hi = Math.floor(bitLen / 4294967296), lo = bitLen >>> 0;
    bytes.push((hi >>> 24) & 255, (hi >>> 16) & 255, (hi >>> 8) & 255, hi & 255);
    bytes.push((lo >>> 24) & 255, (lo >>> 16) & 255, (lo >>> 8) & 255, lo & 255);

    var w = new Array(64), i, t;
    function rotr(x, n) { return (x >>> n) | (x << (32 - n)); }

    for (i = 0; i < bytes.length; i += 64) {
      for (t = 0; t < 16; t++) {
        w[t] = (bytes[i + t * 4] << 24) | (bytes[i + t * 4 + 1] << 16) | (bytes[i + t * 4 + 2] << 8) | bytes[i + t * 4 + 3];
      }
      for (t = 16; t < 64; t++) {
        var s0 = rotr(w[t - 15], 7) ^ rotr(w[t - 15], 18) ^ (w[t - 15] >>> 3);
        var s1 = rotr(w[t - 2], 17) ^ rotr(w[t - 2], 19) ^ (w[t - 2] >>> 10);
        w[t] = (w[t - 16] + s0 + w[t - 7] + s1) | 0;
      }
      var a = H[0], b = H[1], c = H[2], d = H[3], e = H[4], f = H[5], g = H[6], h = H[7];
      for (t = 0; t < 64; t++) {
        var S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
        var ch = (e & f) ^ (~e & g);
        var t1 = (h + S1 + ch + K[t] + w[t]) | 0;
        var S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
        var maj = (a & b) ^ (a & c) ^ (b & c);
        var t2 = (S0 + maj) | 0;
        h = g; g = f; f = e; e = (d + t1) | 0; d = c; c = b; b = a; a = (t1 + t2) | 0;
      }
      H[0] = (H[0] + a) | 0; H[1] = (H[1] + b) | 0; H[2] = (H[2] + c) | 0; H[3] = (H[3] + d) | 0;
      H[4] = (H[4] + e) | 0; H[5] = (H[5] + f) | 0; H[6] = (H[6] + g) | 0; H[7] = (H[7] + h) | 0;
    }
    return H.map(function (x) { return ('00000000' + (x >>> 0).toString(16)).slice(-8); }).join('');
  }

  global.U = {
    ri: ri, rf: rf, pick: pick, chance: chance, sign: sign, riNo0: riNo0, shuffle: shuffle, sample: sample, uid: uid,
    gcd: gcd, ppcm: ppcm, reduce: reduce, isPrime: isPrime, primesUpTo: primesUpTo, divisors: divisors,
    factorize: factorize, factorStr: factorStr, expo: expo, round: round, clamp: clamp, TRIPLETS: TRIPLETS,
    fmt: fmt, frac: frac, fracTxt: fracTxt, math: math, mono: mono, poly: poly, linear: linear, quad: quad, par: par,
    norm: norm, toNum: toNum, evalExpr: evalExpr, checkAnswer: checkAnswer,
    dayKey: dayKey, daysBetween: daysBetween, relDate: relDate, mmss: mmss,
    $: $, $$: $$, esc: esc, sha256: sha256
  };
})(window);
