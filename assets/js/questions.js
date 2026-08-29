/* =======================================================================
   questions.js — registre des themes + generateurs (nombres, calcul, algebre)
   Chaque generateur produit une question adaptee au niveau demande (1 a 5).
   ======================================================================= */
(function (global) {
  'use strict';
  var ri = U.ri, pick = U.pick, chance = U.chance, shuffle = U.shuffle, riNo0 = U.riNo0;
  var fmt = U.fmt, frac = U.frac, math = U.math, expo = U.expo, par = U.par;

  /* ------------------------------------------------------------------ */
  /* Les 16 themes du programme de 3e                                    */
  /* ------------------------------------------------------------------ */
  var THEMES = [
    { id: 'calcul',   name: 'Calcul mental',        icon: '⚡', dom: 'Nombres et calculs' },
    { id: 'fraction', name: 'Fractions',            icon: '🍰', dom: 'Nombres et calculs' },
    { id: 'puissance',name: 'Puissances',           icon: '🔟', dom: 'Nombres et calculs' },
    { id: 'racine',   name: 'Racines carrees',      icon: '√',  dom: 'Nombres et calculs' },
    { id: 'litteral', name: 'Calcul litteral',      icon: '🔤', dom: 'Nombres et calculs' },
    { id: 'equation', name: 'Equations',            icon: '⚖️', dom: 'Nombres et calculs' },
    { id: 'arithm',   name: 'Arithmetique',         icon: '🔢', dom: 'Nombres et calculs' },
    { id: 'fonction', name: 'Fonctions',            icon: '📉', dom: 'Fonctions' },
    { id: 'proport',  name: 'Proportionnalite',     icon: '⚗️', dom: 'Donnees' },
    { id: 'stats',    name: 'Statistiques',         icon: '📊', dom: 'Donnees' },
    { id: 'proba',    name: 'Probabilites',         icon: '🎲', dom: 'Donnees' },
    { id: 'pythagore',name: 'Pythagore',            icon: '📐', dom: 'Geometrie' },
    { id: 'thales',   name: 'Thales',               icon: '🔺', dom: 'Geometrie' },
    { id: 'trigo',    name: 'Trigonometrie',        icon: '🧭', dom: 'Geometrie' },
    { id: 'geo',      name: 'Geometrie & angles',   icon: '📏', dom: 'Geometrie' },
    { id: 'grandeur', name: 'Grandeurs & mesures',  icon: '🧪', dom: 'Grandeurs' },
    { id: 'algo',     name: 'Algorithmique',        icon: '💻', dom: 'Algorithmique' }
  ];

  var GENS = [];
  /** Enregistre un generateur. lv = [niveau min, niveau max] */
  function reg(id, theme, lv, f) { GENS.push({ id: id, theme: theme, lv: lv, f: f }); }

  /** Construit une question a choix multiples (doublons retires). */
  function qcm(o, correct, wrongs) {
    o.type = 'qcm';
    o.answer = String(correct);
    var seen = [o.answer], i;
    for (i = 0; i < wrongs.length; i++) {
      var w = String(wrongs[i]);
      if (seen.indexOf(w) < 0) seen.push(w);
    }
    o.choices = shuffle(seen);
    return o;
  }
  /** Genere des distracteurs numeriques plausibles autour de la bonne reponse. */
  function nearby(v, n, step) {
    var out = [], tries = 0;
    step = step || Math.max(1, Math.round(Math.abs(v) * 0.15)) || 1;
    while (out.length < n && tries++ < 60) {
      var c = v + riNo0(-3, 3) * step;
      if (c !== v && out.indexOf(c) < 0) out.push(c);
    }
    while (out.length < n) out.push(v + out.length + 1);
    return out;
  }

  /* ================================================================== */
  /* 1. CALCUL MENTAL                                                    */
  /* ================================================================== */
  reg('cm-add', 'calcul', [1, 3], function (L) {
    var a, b;
    if (L === 1) { a = ri(11, 89); b = ri(11, 89); }
    else if (L === 2) { a = ri(120, 890); b = ri(110, 690); }
    else { a = U.round(ri(20, 300) / 10, 1); b = U.round(ri(15, 250) / 10, 1); }
    var op = chance(0.5) ? '+' : '−';
    var r = op === '+' ? a + b : a - b;
    return { prompt: math(fmt(a) + ' ' + op + ' ' + fmt(b)), answer: fmt(r),
             explain: 'Calcul direct : ' + fmt(a) + ' ' + op + ' ' + fmt(b) + ' = ' + fmt(r) + '.' };
  });

  reg('cm-mul', 'calcul', [1, 4], function (L) {
    var a, b;
    if (L === 1) { a = ri(2, 9); b = ri(2, 9); }
    else if (L === 2) { a = ri(11, 29); b = ri(3, 9); }
    else if (L === 3) { a = ri(12, 49); b = pick([11, 15, 20, 25, 50]); }
    else { a = ri(12, 39); b = ri(12, 29); }
    return { prompt: math(a + ' × ' + b), answer: String(a * b),
             explain: a + ' × ' + b + ' = ' + (a * b) + '.' +
               (L >= 3 ? ' Astuce : decompose, par exemple ' + a + ' × ' + b + ' = ' + a + ' × ' + (b - b % 10) + ' + ' + a + ' × ' + (b % 10) + '.' : '') };
  });

  reg('cm-div', 'calcul', [1, 3], function (L) {
    var b = L === 1 ? ri(2, 9) : ri(3, 15);
    var q = L === 1 ? ri(2, 9) : ri(6, 30);
    var a = b * q;
    return { prompt: math(a + ' ÷ ' + b), answer: String(q),
             explain: a + ' ÷ ' + b + ' = ' + q + ' car ' + b + ' × ' + q + ' = ' + a + '.' };
  });

  reg('cm-relatifs', 'calcul', [2, 4], function (L) {
    var a = riNo0(-15, 15), b = riNo0(-15, 15), op;
    if (L === 2) op = chance(0.5) ? '+' : '−';
    else if (L === 3) op = pick(['+', '−', '×']);
    else op = pick(['×', '−', '+']);
    if (L === 4) { a = riNo0(-13, 13); b = riNo0(-13, 13); }
    var r = op === '+' ? a + b : op === '−' ? a - b : a * b;
    var reg1 = op === '×'
      ? 'Signes identiques → resultat positif ; signes differents → resultat negatif.'
      : 'Attention : soustraire un nombre negatif revient a additionner son oppose.';
    return { prompt: math(par(a) + ' ' + op + ' ' + par(b)), answer: fmt(r),
             explain: reg1 + ' Resultat : ' + fmt(r) + '.' };
  });

  reg('cm-priorites', 'calcul', [2, 5], function (L) {
    var a = ri(2, 12), b = ri(2, 9), c = ri(2, 9), d = ri(2, 12), s, r;
    if (L === 2) { s = a + ' + ' + b + ' × ' + c; r = a + b * c; }
    else if (L === 3) { s = '(' + a + ' + ' + b + ') × ' + c; r = (a + b) * c; }
    else if (L === 4) { s = a + ' × ' + b + ' − ' + c + ' × ' + d; r = a * b - c * d; }
    else { var e = ri(2, 6); s = a + ' + ' + b + ' × (' + c + ' − ' + d + ') ÷ ' + e;
           r = a + b * (c - d) / e;
           if (Math.abs(r - Math.round(r)) > 1e-9) { e = 1; r = a + b * (c - d); s = a + ' + ' + b + ' × (' + c + ' − ' + d + ')'; } }
    return { prompt: math(s), answer: fmt(r),
             explain: 'Ordre : parentheses, puis × et ÷, puis + et −. On obtient ' + fmt(r) + '.' };
  });

  reg('cm-carres', 'calcul', [1, 3], function (L) {
    if (L >= 3 && chance(0.4)) { var c = ri(2, 10); return { prompt: math(c + expo(3)), answer: String(c * c * c),
      explain: c + '³ = ' + c + ' × ' + c + ' × ' + c + ' = ' + (c * c * c) + '.' }; }
    var n = L === 1 ? ri(2, 12) : L === 2 ? ri(11, 20) : ri(13, 30);
    return { prompt: math(n + expo(2)), answer: String(n * n), explain: n + '² = ' + n + ' × ' + n + ' = ' + n * n + '.' };
  });

  reg('cm-complement', 'calcul', [1, 2], function (L) {
    var cible = L === 1 ? 100 : pick([100, 200, 1000]);
    var a = L === 1 ? ri(11, 89) : ri(120, cible - 20);
    return { prompt: math(a + ' + ? = ' + cible), sub: 'Quel nombre manque ?', answer: String(cible - a),
             explain: cible + ' − ' + a + ' = ' + (cible - a) + '.' };
  });

  reg('cm-astuce', 'calcul', [3, 5], function (L) {
    var t = pick(['x99', 'x101', 'x98', 'moitie', 'double']);
    var a = ri(12, 89);
    if (t === 'x99') return { prompt: math(a + ' × 99'), answer: String(a * 99),
      explain: a + ' × 99 = ' + a + ' × 100 − ' + a + ' = ' + a * 100 + ' − ' + a + ' = ' + a * 99 + '.' };
    if (t === 'x101') return { prompt: math(a + ' × 101'), answer: String(a * 101),
      explain: a + ' × 101 = ' + a + ' × 100 + ' + a + ' = ' + a * 101 + '.' };
    if (t === 'x98') return { prompt: math(a + ' × 98'), answer: String(a * 98),
      explain: a + ' × 98 = ' + a + ' × 100 − ' + a + ' × 2 = ' + a * 100 + ' − ' + a * 2 + ' = ' + a * 98 + '.' };
    if (t === 'moitie') { var b = ri(20, 99) * 2; return { prompt: 'La moitie de ' + math(b), answer: String(b / 2),
      explain: b + ' ÷ 2 = ' + b / 2 + '.' }; }
    var d = ri(25, 249); return { prompt: 'Le double de ' + math(d), answer: String(d * 2), explain: d + ' × 2 = ' + d * 2 + '.' };
  });

  reg('cm-ordre', 'calcul', [3, 4], function () {
    var a = ri(18, 95), b = ri(18, 95);
    var v = a * b;
    var mags = [10, 100, 1000, 10000];
    var good = mags.reduce(function (best, m) { return Math.abs(Math.log10(v) - Math.log10(m)) < Math.abs(Math.log10(v) - Math.log10(best)) ? m : best; });
    return qcm({ prompt: 'Quel est l ordre de grandeur de ' + math(a + ' × ' + b) + ' ?',
                 sub: 'Sans poser l operation.',
                 explain: a + ' × ' + b + ' = ' + v + ', donc environ ' + good + '.' },
               String(good), mags.filter(function (m) { return m !== good; }).slice(0, 3));
  });

  /* ================================================================== */
  /* 2. FRACTIONS                                                        */
  /* ================================================================== */
  reg('fr-add-same', 'fraction', [1, 2], function () {
    var d = ri(3, 12), a = ri(1, d - 1), b = ri(1, d - 1);
    var op = chance(0.5) ? '+' : '−';
    var n = op === '+' ? a + b : a - b;
    var r = U.reduce(n, d);
    return { prompt: frac(a, d) + math(' ' + op + ' ') + frac(b, d), sub: 'Donne le resultat sous forme de fraction irreductible.',
             answer: U.fracTxt(r[0], r[1]), exact: true, alt: [U.fracTxt(n, d)],
             explain: 'Meme denominateur : on ' + (op === '+' ? 'ajoute' : 'soustrait') + ' les numerateurs. ' +
               a + '/' + d + ' ' + op + ' ' + b + '/' + d + ' = ' + n + '/' + d +
               (n / d !== r[0] / r[1] || n !== r[0] ? ' = ' + U.fracTxt(r[0], r[1]) : '') + '.' };
  });

  reg('fr-add-mult', 'fraction', [2, 3], function () {
    var d1 = ri(2, 7), k = ri(2, 4), d2 = d1 * k;
    var a = ri(1, d1 - 1 || 1), b = ri(1, d2 - 1);
    var op = chance(0.6) ? '+' : '−';
    var n = op === '+' ? a * k + b : a * k - b;
    var r = U.reduce(n, d2);
    return { prompt: frac(a, d1) + math(' ' + op + ' ') + frac(b, d2), sub: 'Resultat en fraction irreductible.',
             answer: U.fracTxt(r[0], r[1]), exact: true, alt: [U.fracTxt(n, d2)],
             explain: 'On met au meme denominateur ' + d2 + ' : ' + a + '/' + d1 + ' = ' + (a * k) + '/' + d2 +
               '. Puis ' + (a * k) + '/' + d2 + ' ' + op + ' ' + b + '/' + d2 + ' = ' + U.fracTxt(r[0], r[1]) + '.' };
  });

  reg('fr-add-any', 'fraction', [3, 5], function () {
    var d1 = ri(3, 9), d2 = ri(3, 9);
    while (d2 === d1 || d2 % d1 === 0 || d1 % d2 === 0) d2 = ri(3, 11);
    var a = ri(1, d1 - 1), b = ri(1, d2 - 1);
    var op = chance(0.55) ? '+' : '−';
    var den = U.ppcm(d1, d2);
    var n = op === '+' ? a * (den / d1) + b * (den / d2) : a * (den / d1) - b * (den / d2);
    var r = U.reduce(n, den);
    return { prompt: frac(a, d1) + math(' ' + op + ' ') + frac(b, d2), sub: 'Resultat en fraction irreductible.',
             answer: U.fracTxt(r[0], r[1]), exact: true, alt: [U.fracTxt(n, den)],
             explain: 'Denominateur commun : ' + den + '. ' + a + '/' + d1 + ' = ' + a * (den / d1) + '/' + den +
               ' et ' + b + '/' + d2 + ' = ' + b * (den / d2) + '/' + den + '. Resultat : ' + U.fracTxt(r[0], r[1]) + '.' };
  });

  reg('fr-mul', 'fraction', [2, 4], function (L) {
    var a = ri(1, 9), b = ri(2, 9), c = ri(1, 9), d = ri(2, 9);
    if (L >= 3) { a = ri(2, 12); b = ri(2, 12); c = ri(2, 12); d = ri(2, 12); }
    var r = U.reduce(a * c, b * d);
    return { prompt: frac(a, b) + math(' × ') + frac(c, d), sub: 'Fraction irreductible.',
             answer: U.fracTxt(r[0], r[1]), exact: true, alt: [U.fracTxt(a * c, b * d)],
             explain: 'On multiplie les numerateurs entre eux et les denominateurs entre eux : ' +
               (a * c) + '/' + (b * d) + ' = ' + U.fracTxt(r[0], r[1]) + '.' };
  });

  reg('fr-div', 'fraction', [3, 5], function () {
    var a = ri(1, 9), b = ri(2, 9), c = ri(1, 9), d = ri(2, 9);
    var r = U.reduce(a * d, b * c);
    return { prompt: frac(a, b) + math(' ÷ ') + frac(c, d), sub: 'Fraction irreductible.',
             answer: U.fracTxt(r[0], r[1]), exact: true, alt: [U.fracTxt(a * d, b * c)],
             explain: 'Diviser, c est multiplier par l inverse : ' + a + '/' + b + ' × ' + d + '/' + c +
               ' = ' + (a * d) + '/' + (b * c) + ' = ' + U.fracTxt(r[0], r[1]) + '.' };
  });

  reg('fr-simplify', 'fraction', [2, 3], function (L) {
    var r = U.reduce(ri(1, 11), ri(2, 13));
    var k = L === 2 ? ri(2, 6) : ri(4, 15);
    var n = r[0] * k, d = r[1] * k;
    var g = U.gcd(n, d);
    return { prompt: 'Rends irreductible : ' + frac(n, d), answer: U.fracTxt(r[0], r[1]), exact: true,
             explain: 'En decomposant en facteurs premiers : ' + n + ' = ' + U.factorStr(n) + ' et ' + d + ' = ' + U.factorStr(d) +
               '. On repere ainsi que PGCD(' + n + ' ; ' + d + ') = ' + g + '. On divise en haut et en bas par ' + g + ' : ' + U.fracTxt(r[0], r[1]) + '.' };
  });

  reg('fr-decompo', 'fraction', [2, 4], function (L) {
    var n = L <= 3 ? ri(12, 90) : ri(60, 300);
    while (U.isPrime(n)) n = L <= 3 ? ri(12, 90) : ri(60, 300);
    var good = U.factorStr(n);
    var f = U.factorize(n);
    return qcm({ prompt: 'Avant de simplifier une fraction, on peut decomposer en facteurs premiers.<br>Quelle est la decomposition de ' + math(n) + ' en produit de facteurs premiers ?',
                 explain: n + ' = ' + f.join(' × ') + ' = ' + good + '. Cette decomposition permet ensuite de reperer les facteurs communs au numerateur et au denominateur pour simplifier une fraction.' },
               good, [U.factorStr(n + 1), U.factorStr(n - 1), f.join(' + ')]);
  });

  reg('fr-simplify-decompo', 'fraction', [3, 5], function () {
    var primes = [2, 3, 5, 7];
    var commun = pick(primes);
    var autres = primes.filter(function (p) { return p !== commun; });
    var pn = pick(autres);
    var pd = pick(autres.filter(function (p) { return p !== pn; }));
    var kn = ri(1, 2), kd = ri(1, 2);
    var n = Math.pow(commun, kn) * pn, d = Math.pow(commun, kd) * pd;
    var r = U.reduce(n, d);
    var kMin = Math.min(kn, kd);
    return { prompt: 'Simplifie ' + frac(n, d) + ' en decomposant le numerateur et le denominateur en facteurs premiers.',
             sub: 'Fraction irreductible.',
             answer: U.fracTxt(r[0], r[1]), exact: true, alt: [U.fracTxt(n, d)],
             explain: n + ' = ' + U.factorStr(n) + ' et ' + d + ' = ' + U.factorStr(d) +
               '. Le facteur commun est ' + commun + (kMin > 1 ? expo(kMin) : '') +
               ' : en simplifiant par ' + commun + (kMin > 1 ? expo(kMin) : '') + ' des deux cotes, on obtient ' + U.fracTxt(r[0], r[1]) + '.' };
  });

  reg('fr-compare', 'fraction', [2, 3], function () {
    var a = ri(1, 9), b = ri(2, 11), c = ri(1, 9), d = ri(2, 11);
    while (a / b === c / d) { c = ri(1, 9); d = ri(2, 11); }
    var big = a / b > c / d ? U.fracTxt(a, b) : U.fracTxt(c, d);
    var small = a / b > c / d ? U.fracTxt(c, d) : U.fracTxt(a, b);
    return qcm({ prompt: 'Quelle fraction est la plus grande ?<br>' + frac(a, b) + math('   ou   ') + frac(c, d),
                 explain: 'Au meme denominateur ' + U.ppcm(b, d) + ' : ' + a * (U.ppcm(b, d) / b) + '/' + U.ppcm(b, d) +
                   ' contre ' + c * (U.ppcm(b, d) / d) + '/' + U.ppcm(b, d) + '. La plus grande est ' + big + '.' },
               big, [small]);
  });

  reg('fr-of', 'fraction', [2, 3], function (L) {
    var d = pick([3, 4, 5, 6, 8]), n = ri(1, d - 1);
    var q = d * ri(L === 2 ? 3 : 6, L === 2 ? 12 : 30);
    var ctx = pick([
      ['Dans un college de ' + q + ' eleves, ', ' sont demi-pensionnaires. Combien cela fait-il d eleves ?'],
      ['Un sac contient ' + q + ' billes, ', ' sont rouges. Combien y a-t-il de billes rouges ?'],
      ['Une commande de ' + q + ' articles : ', ' sont deja livres. Combien d articles livres ?']
    ]);
    return { prompt: ctx[0] + frac(n, d) + ctx[1], answer: String(q * n / d),
             explain: n + '/' + d + ' de ' + q + ' = ' + q + ' ÷ ' + d + ' × ' + n + ' = ' + (q / d) + ' × ' + n + ' = ' + (q * n / d) + '.' };
  });

  reg('fr-inverse', 'fraction', [2, 3], function () {
    var a = ri(2, 12), b = ri(2, 12);
    while (a === b) b = ri(2, 12);
    return { prompt: 'Quel est l inverse de ' + frac(a, b) + ' ?', answer: U.fracTxt(b, a), exact: true,
             explain: 'L inverse de a/b est b/a, soit ' + b + '/' + a + '.' };
  });

  reg('fr-mixed', 'fraction', [4, 5], function () {
    var a = ri(1, 5), b = ri(2, 6), c = ri(1, 5), d = ri(2, 6), e = ri(1, 5), f = ri(2, 6);
    var num = a * d * f + b * c * e, den = b * d * f;
    var r = U.reduce(num, den);
    return { prompt: frac(a, b) + math(' + ') + frac(c, d) + math(' × ') + frac(e, f),
             sub: 'Attention aux priorites. Fraction irreductible.',
             answer: U.fracTxt(r[0], r[1]), exact: true,
             explain: 'D abord la multiplication : ' + c + '/' + d + ' × ' + e + '/' + f + ' = ' + (c * e) + '/' + (d * f) +
               '. Puis on additionne : resultat ' + U.fracTxt(r[0], r[1]) + '.' };
  });

  /* ================================================================== */
  /* 3. PUISSANCES                                                       */
  /* ================================================================== */
  reg('pu-base', 'puissance', [1, 3], function (L) {
    var a = L === 1 ? ri(2, 5) : ri(2, 7), n = L === 1 ? ri(2, 3) : ri(2, 4);
    if (L >= 3 && chance(0.45)) a = -a;
    var v = Math.pow(a, n);
    return { prompt: 'Calcule ' + math(par(a) + expo(n)), answer: String(v),
             explain: par(a) + expo(n) + ' = ' + new Array(n + 1).join(par(a) + ' × ').slice(0, -3) + ' = ' + v + '.' +
               (a < 0 ? ' Exposant ' + (n % 2 ? 'impair' : 'pair') + ' → resultat ' + (n % 2 ? 'negatif' : 'positif') + '.' : '') };
  });

  reg('pu-dix', 'puissance', [1, 3], function (L) {
    var n = L === 1 ? ri(2, 5) : ri(-5, 6);
    if (n === 0) n = 3;
    if (n > 0) return { prompt: 'Ecris ' + math('10' + expo(n)) + ' en ecriture decimale.', answer: String(Math.pow(10, n)),
             explain: '10' + expo(n) + ' = 1 suivi de ' + n + ' zeros = ' + Math.pow(10, n) + '.' };
    var v = Math.pow(10, n);
    return { prompt: 'Ecris ' + math('10' + expo(n)) + ' en ecriture decimale.', answer: fmt(v), tol: 0,
             explain: '10' + expo(n) + ' = 1/10' + expo(-n) + ' = ' + fmt(v) + ' (le 1 est a la ' + (-n) + 'e decimale).' };
  });

  reg('pu-prod', 'puissance', [2, 3], function () {
    var a = pick([2, 3, 5, 10]), m = ri(2, 8), n = ri(2, 8);
    return { prompt: math(a + expo(m) + ' × ' + a + expo(n)) + ' = ' + math(a + expo('n')) + '.<br>Que vaut ' + math('n') + ' ?',
             answer: String(m + n),
             explain: 'Meme base : on ADDITIONNE les exposants. ' + m + ' + ' + n + ' = ' + (m + n) + '.' };
  });

  reg('pu-quot', 'puissance', [3, 4], function () {
    var a = pick([2, 3, 5, 10]), m = ri(3, 12), n = ri(2, 9);
    return { prompt: math(a + expo(m) + ' ÷ ' + a + expo(n)) + ' = ' + math(a + expo('n')) + '.<br>Que vaut ' + math('n') + ' ?',
             answer: String(m - n),
             explain: 'Quotient de meme base : on SOUSTRAIT les exposants. ' + m + ' − ' + n + ' = ' + (m - n) + '.' };
  });

  reg('pu-puiss', 'puissance', [3, 4], function () {
    var a = pick([2, 3, 5, 10]), m = ri(2, 6), n = ri(2, 5);
    return { prompt: math('(' + a + expo(m) + ')' + expo(n)) + ' = ' + math(a + expo('n')) + '.<br>Que vaut ' + math('n') + ' ?',
             answer: String(m * n),
             explain: 'Puissance de puissance : on MULTIPLIE les exposants. ' + m + ' × ' + n + ' = ' + (m * n) + '.' };
  });

  reg('pu-neg', 'puissance', [3, 4], function () {
    var a = ri(2, 6), n = ri(2, 3);
    return { prompt: 'Ecris ' + math(a + expo(-n)) + ' sous forme de fraction.', answer: U.fracTxt(1, Math.pow(a, n)), exact: true,
             explain: a + expo(-n) + ' = 1/' + a + expo(n) + ' = 1/' + Math.pow(a, n) + '.' };
  });

  reg('pu-scientifique', 'puissance', [3, 4], function () {
    var chiffres = ri(2, 4);                                  // nombre de chiffres significatifs
    var digits = String(ri(Math.pow(10, chiffres - 1), Math.pow(10, chiffres) - 1));
    var mantTxt = digits.charAt(0) + (chiffres > 1 ? ',' + digits.slice(1) : '');
    var e = riNo0(-5, 6);
    // ecriture decimale du nombre
    var val = parseFloat(digits) * Math.pow(10, e - (chiffres - 1));
    var decimales = Math.max(0, (chiffres - 1) - e);
    var txt = fmt(U.round(val, Math.min(12, decimales)));
    var good = mantTxt + ' × 10' + expo(e);
    return qcm({ prompt: 'Quelle est l ecriture scientifique de ' + math(txt) + ' ?',
                 sub: 'Un seul chiffre non nul avant la virgule.',
                 explain: 'On place la virgule apres le premier chiffre : ' + mantTxt +
                   ', puis on compte le decalage de la virgule → exposant ' + e + '. Donc ' + good + '.' },
               good, [mantTxt + ' × 10' + expo(-e), mantTxt + ' × 10' + expo(e + 1),
                      digits.charAt(0) + digits.charAt(1) + (chiffres > 2 ? ',' + digits.slice(2) : '') + ' × 10' + expo(e - 1)]);
  });

  reg('pu-calc-sci', 'puissance', [4, 5], function () {
    var a = ri(2, 9), m = riNo0(-4, 6), b = ri(2, 9), n = riNo0(-4, 6);
    var mant = a * b, e = m + n;
    while (mant >= 10) { mant /= 10; e++; }
    var good = fmt(U.round(mant, 3)) + ' × 10' + expo(e);
    return qcm({ prompt: 'Ecris en notation scientifique :<br>' + math('(' + a + ' × 10' + expo(m) + ') × (' + b + ' × 10' + expo(n) + ')'),
                 explain: 'Mantisses : ' + a + ' × ' + b + ' = ' + (a * b) + '. Exposants : ' + m + ' + ' + n + ' = ' + (m + n) +
                   '. On ajuste pour obtenir ' + good + '.' },
               good, [fmt(a * b) + ' × 10' + expo(m + n), fmt(U.round(mant, 3)) + ' × 10' + expo(e + 1), fmt(a + b) + ' × 10' + expo(m * n)]);
  });

  /* ================================================================== */
  /* 4. RACINES CARREES                                                  */
  /* ================================================================== */
  reg('ra-parfait', 'racine', [1, 2], function (L) {
    var n = L === 1 ? ri(2, 12) : ri(10, 25);
    return { prompt: 'Calcule ' + math('√' + (n * n)), answer: String(n),
             explain: '√' + (n * n) + ' = ' + n + ' car ' + n + '² = ' + n * n + '.' };
  });

  reg('ra-carre', 'racine', [2, 3], function () {
    var n = ri(2, 40);
    return { prompt: 'Calcule ' + math('(√' + n + ')' + expo(2)), answer: String(n),
             explain: 'Pour tout nombre positif a, (√a)² = a. Donc le resultat est ' + n + '.' };
  });

  reg('ra-prod', 'racine', [2, 3], function () {
    var a = ri(2, 12), k = ri(2, 8);
    var b = a * k * k;
    return { prompt: 'Calcule ' + math('√' + a + ' × √' + b), sub: 'Le resultat est un entier.',
             answer: String(a * k),
             explain: '√a × √b = √(a×b). Ici √(' + a + ' × ' + b + ') = √' + (a * b) + ' = ' + (a * k) + '.' };
  });

  reg('ra-simplifier', 'racine', [3, 4], function () {
    var k = ri(2, 7), a = pick([2, 3, 5, 6, 7, 10, 11, 13]);
    var n = k * k * a;
    var good = k + '√' + a;
    return qcm({ prompt: 'Ecris ' + math('√' + n) + ' sous la forme ' + math('a√b') + ' avec ' + math('b') + ' le plus petit possible.',
                 explain: '√' + n + ' = √(' + (k * k) + ' × ' + a + ') = √' + (k * k) + ' × √' + a + ' = ' + good + '.' },
               good, [(k + 1) + '√' + a, k + '√' + (a + 1), (k * a) + '√' + k]);
  });

  reg('ra-somme', 'racine', [3, 4], function () {
    var a = ri(2, 9), b = ri(2, 9), r = pick([2, 3, 5, 7, 11]);
    var good = (a + b) + '√' + r;
    return qcm({ prompt: 'Reduis ' + math(a + '√' + r + ' + ' + b + '√' + r),
                 explain: 'On additionne les coefficients devant la meme racine : (' + a + ' + ' + b + ')√' + r + ' = ' + good + '.' },
               good, [(a + b) + '√' + (r * 2), (a * b) + '√' + r, (a + b) + '√' + (r + r)]);
  });

  reg('ra-equation', 'racine', [3, 4], function () {
    var n = ri(2, 15), c = n * n;
    return { prompt: 'Resous ' + math('x' + expo(2) + ' = ' + c) + '.<br>Donne la solution positive.',
             answer: String(n),
             explain: 'x² = ' + c + ' donne x = √' + c + ' ou x = −√' + c + ', soit x = ' + n + ' ou x = −' + n + '. La solution positive est ' + n + '.' };
  });

  reg('ra-approx', 'racine', [2, 3], function () {
    var n = ri(20, 199);
    while (Number.isInteger(Math.sqrt(n))) n = ri(20, 199);
    var v = U.round(Math.sqrt(n), 1);
    return { prompt: 'Donne ' + math('√' + n) + ' arrondi au dixieme.', answer: fmt(v), tol: 0.051,
             explain: '√' + n + ' ≈ ' + fmt(U.round(Math.sqrt(n), 3)) + ', soit ' + fmt(v) + ' au dixieme.' };
  });

  reg('ra-encadre', 'racine', [2, 3], function () {
    var k = ri(3, 14), n = ri(k * k + 1, (k + 1) * (k + 1) - 1);
    return qcm({ prompt: math('√' + n) + ' est compris entre deux entiers consecutifs. Lesquels ?',
                 explain: k + '² = ' + k * k + ' et ' + (k + 1) + '² = ' + (k + 1) * (k + 1) + '. Comme ' + k * k + ' < ' + n + ' < ' + (k + 1) * (k + 1) + ', on a ' + k + ' < √' + n + ' < ' + (k + 1) + '.' },
               k + ' et ' + (k + 1), [(k - 1) + ' et ' + k, (k + 1) + ' et ' + (k + 2), (k * 2) + ' et ' + (k * 2 + 1)]);
  });

  /* ================================================================== */
  /* 5. CALCUL LITTERAL                                                  */
  /* ================================================================== */
  reg('cl-eval', 'litteral', [1, 3], function (L) {
    var a = riNo0(-6, 8), b = riNo0(-9, 9), x = L === 1 ? ri(1, 6) : riNo0(-6, 6);
    if (L >= 3) {
      var c = riNo0(-5, 5);
      var v3 = a * x * x + b * x + c;
      return { prompt: 'Calcule ' + math('A = ' + U.quad(a, b, c)) + ' pour ' + math('x = ' + x) + '.',
               answer: String(v3),
               explain: 'A = ' + a + ' × (' + x + ')² + ' + b + ' × (' + x + ') + ' + c + ' = ' + a * x * x + ' + ' + b * x + ' + ' + c + ' = ' + v3 + '.' };
    }
    var v = a * x + b;
    return { prompt: 'Calcule ' + math('A = ' + U.linear(a, b)) + ' pour ' + math('x = ' + x) + '.',
             answer: String(v),
             explain: 'A = ' + a + ' × ' + par(x) + ' + ' + par(b) + ' = ' + a * x + ' + ' + par(b) + ' = ' + v + '.' };
  });

  reg('cl-reduire', 'litteral', [2, 3], function () {
    var a = riNo0(-6, 8), b = riNo0(-9, 9), c = riNo0(-6, 8), d = riNo0(-9, 9);
    if (a + c === 0) c = -a + 1;
    if (b + d === 0) d = -b + 2;
    var good = U.linear(a + c, b + d);
    return qcm({ prompt: 'Reduis ' + math('(' + U.linear(a, b) + ') + (' + U.linear(c, d) + ')'),
                 sub: 'Regroupe les termes semblables.',
                 explain: 'On additionne les x entre eux : ' + a + ' + ' + par(c) + ' = ' + (a + c) + ' ; puis les nombres : ' + b + ' + ' + par(d) + ' = ' + (b + d) + '. Donc ' + good + '.' },
               good, [U.linear(a + c, b - d), U.linear(a - c, b + d), U.linear(a + b, c + d)]);
  });

  reg('cl-dev-simple', 'litteral', [1, 2], function () {
    var k = riNo0(-7, 9), a = riNo0(-6, 8), b = riNo0(-9, 9);
    var good = U.linear(k * a, k * b);
    return qcm({ prompt: 'Developpe ' + math(par(k) + '(' + U.linear(a, b) + ')'),
                 explain: 'Distributivite : ' + k + ' × ' + a + 'x = ' + (k * a) + 'x et ' + k + ' × ' + par(b) + ' = ' + (k * b) + '. Donc ' + good + '.' },
               good, [U.linear(k * a, b), U.linear(a, k * b), U.linear(k + a, k + b)]);
  });

  reg('cl-dev-double', 'litteral', [3, 4], function () {
    var a = riNo0(-4, 5), b = riNo0(-7, 8), c = riNo0(-4, 5), d = riNo0(-7, 8);
    var A = a * c, B = a * d + b * c, C = b * d;
    var good = U.quad(A, B, C);
    return qcm({ prompt: 'Developpe et reduis ' + math('(' + U.linear(a, b) + ')(' + U.linear(c, d) + ')'),
                 explain: 'Double distributivite : ' + a + 'x × ' + c + 'x = ' + A + 'x² ; ' + a + 'x × ' + par(d) + ' + ' + par(b) + ' × ' + c + 'x = ' + B + 'x ; ' +
                   par(b) + ' × ' + par(d) + ' = ' + C + '. Donc ' + good + '.' },
               good, [U.quad(A, a * d - b * c, C), U.quad(A, B, C + 1), U.quad(A, a * c + b * d, C)]);
  });

  reg('cl-identite', 'litteral', [3, 5], function () {
    var a = ri(1, 6), b = ri(2, 9), t = pick(['plus', 'moins', 'conj']);
    var good, prompt, exp;
    if (t === 'plus') {
      good = U.quad(a * a, 2 * a * b, b * b);
      prompt = '(' + U.linear(a, b) + ')' + expo(2);
      exp = '(a+b)² = a² + 2ab + b² avec a = ' + (a === 1 ? '' : a) + 'x et b = ' + b + '.';
    } else if (t === 'moins') {
      good = U.quad(a * a, -2 * a * b, b * b);
      prompt = '(' + U.linear(a, -b) + ')' + expo(2);
      exp = '(a−b)² = a² − 2ab + b² avec a = ' + (a === 1 ? '' : a) + 'x et b = ' + b + '.';
    } else {
      good = U.quad(a * a, 0, -b * b);
      prompt = '(' + U.linear(a, b) + ')(' + U.linear(a, -b) + ')';
      exp = '(a+b)(a−b) = a² − b² avec a = ' + (a === 1 ? '' : a) + 'x et b = ' + b + '.';
    }
    return qcm({ prompt: 'Developpe ' + math(prompt), explain: exp + ' Resultat : ' + good + '.' },
               good, [U.quad(a * a, 0, b * b), U.quad(a * a, a * b, b * b), U.quad(a * a, -2 * a * b, -b * b)]);
  });

  reg('cl-facto-commun', 'litteral', [2, 3], function () {
    var k = ri(2, 9), a = riNo0(-6, 7), b = riNo0(-8, 8);
    var good = k + '(' + U.linear(a, b) + ')';
    return qcm({ prompt: 'Factorise ' + math(U.linear(k * a, k * b)),
                 explain: 'Le facteur commun est ' + k + ' : ' + U.linear(k * a, k * b) + ' = ' + good + '.' },
               good, [k + '(' + U.linear(a, k * b) + ')', (k * a) + '(' + U.linear(1, b) + ')', k + '(' + U.linear(a * k, b) + ')']);
  });

  reg('cl-facto-x', 'litteral', [3, 4], function () {
    var a = ri(2, 8), b = riNo0(-9, 9);
    var good = 'x(' + U.linear(a, b) + ')';
    return qcm({ prompt: 'Factorise ' + math(U.quad(a, b, 0)),
                 explain: 'x est en facteur dans les deux termes : ' + U.quad(a, b, 0) + ' = ' + good + '.' },
               good, ['x(' + U.linear(a, b * 2) + ')', a + 'x(' + U.linear(1, b) + ')', 'x' + expo(2) + '(' + U.linear(a, b) + ')']);
  });

  reg('cl-facto-identite', 'litteral', [4, 5], function () {
    var a = ri(1, 5), b = ri(2, 9);
    var A = a === 1 ? 'x' : a + 'x';
    var good = '(' + U.linear(a, b) + ')(' + U.linear(a, -b) + ')';
    return qcm({ prompt: 'Factorise ' + math(U.quad(a * a, 0, -b * b)),
                 sub: 'Pense a une identite remarquable.',
                 explain: 'a² − b² = (a+b)(a−b) avec a = ' + A + ' et b = ' + b + '. Donc ' + good + '.' },
               good, ['(' + U.linear(a, b) + ')' + expo(2), '(' + U.linear(a, -b) + ')' + expo(2),
                      '(' + U.linear(a, b * 2) + ')(' + U.linear(a, -b * 2) + ')']);
  });

  reg('cl-test', 'litteral', [3, 4], function () {
    var a = riNo0(-5, 6), b = riNo0(-9, 9), x = riNo0(-5, 5);
    var v = a * x + b;
    var ok = chance(0.5);
    var cible = ok ? v : v + riNo0(-4, 4);
    return qcm({ prompt: 'Est-ce que ' + math('x = ' + x) + ' verifie ' + math(U.linear(a, b) + ' = ' + cible) + ' ?',
                 explain: 'On remplace : ' + a + ' × ' + par(x) + ' + ' + par(b) + ' = ' + v + '. ' +
                   (v === cible ? 'C est bien egal a ' + cible + ' : oui.' : 'Or on voulait ' + cible + ' : non.') },
               v === cible ? 'Oui' : 'Non', [v === cible ? 'Non' : 'Oui']);
  });

  /* ================================================================== */
  /* 6. EQUATIONS                                                        */
  /* ================================================================== */
  reg('eq-ax', 'equation', [1, 2], function (L) {
    var a = riNo0(2, 9) * (L === 1 ? 1 : U.sign()), x = riNo0(-9, 12);
    return { prompt: 'Resous ' + math(U.mono(a, 'x') + ' = ' + a * x), sub: 'Donne la valeur de x.',
             answer: String(x),
             explain: 'On divise les deux membres par ' + a + ' : x = ' + (a * x) + ' ÷ ' + par(a) + ' = ' + x + '.' };
  });

  reg('eq-axb', 'equation', [2, 3], function () {
    var a = riNo0(-9, 9), b = riNo0(-12, 12), x = riNo0(-9, 12);
    if (a === 0) a = 3;
    var c = a * x + b;
    return { prompt: 'Resous ' + math(U.linear(a, b) + ' = ' + c), answer: String(x),
             explain: 'On enleve ' + par(b) + ' : ' + U.mono(a, 'x') + ' = ' + c + ' − ' + par(b) + ' = ' + (a * x) +
               '. Puis on divise par ' + a + ' : x = ' + x + '.' };
  });

  reg('eq-2membres', 'equation', [3, 4], function () {
    var a = riNo0(-8, 9), c = riNo0(-8, 9);
    while (a === c) c = riNo0(-8, 9);
    var x = riNo0(-8, 10), b = riNo0(-12, 12);
    var d = (a - c) * x + b;
    return { prompt: 'Resous ' + math(U.linear(a, b) + ' = ' + U.linear(c, d)), answer: String(x),
             explain: 'On regroupe les x a gauche : ' + U.mono(a - c, 'x') + ' = ' + d + ' − ' + par(b) + ' = ' + ((a - c) * x) +
               '. Donc x = ' + ((a - c) * x) + ' ÷ ' + par(a - c) + ' = ' + x + '.' };
  });

  reg('eq-produit', 'equation', [3, 4], function () {
    var a = riNo0(-9, 9), b = riNo0(-9, 9);
    while (a === b) b = riNo0(-9, 9);
    var mini = Math.min(a, b);
    return { prompt: 'Resous ' + math('(x ' + (a >= 0 ? '− ' + a : '+ ' + (-a)) + ')(x ' + (b >= 0 ? '− ' + b : '+ ' + (-b)) + ') = 0') +
               '<br>Donne la plus petite solution.',
             answer: String(mini),
             explain: 'Un produit est nul si un facteur est nul : x = ' + a + ' ou x = ' + b + '. La plus petite est ' + mini + '.' };
  });

  reg('eq-frac', 'equation', [3, 4], function (L) {
    if (L >= 4 && chance(0.5)) {
      // equation en croix : x/b = c/d
      var b = ri(2, 9), d = ri(2, 9), c = ri(2, 12);
      var x = U.round(b * c / d, 4);
      return { prompt: 'Resous ' + frac('x', b) + math(' = ') + frac(c, d),
               answer: fmt(x), tol: 0.001,
               explain: 'Produit en croix : x × ' + d + ' = ' + b + ' × ' + c + ' = ' + (b * c) +
                 ', donc x = ' + (b * c) + ' ÷ ' + d + ' = ' + fmt(x) + '.' };
    }
    var dd = ri(2, 9), q = riNo0(-8, 12);
    return { prompt: 'Resous ' + frac('x', dd) + math(' = ' + q),
             answer: String(dd * q),
             explain: 'On multiplie les deux membres par ' + dd + ' : x = ' + par(q) + ' × ' + dd + ' = ' + (dd * q) + '.' };
  });

  reg('eq-carre', 'equation', [3, 4], function () {
    var n = ri(2, 13), c = n * n;
    return qcm({ prompt: 'Quelles sont les solutions de ' + math('x' + expo(2) + ' = ' + c) + ' ?',
                 explain: 'x² = ' + c + ' admet deux solutions opposees : ' + n + ' et −' + n + '.' },
               n + ' et −' + n, [String(n), c / 2 + ' et −' + c / 2, 'Aucune solution']);
  });

  reg('eq-inequation', 'equation', [4, 5], function () {
    var a = ri(2, 8), b = riNo0(-10, 10), x = riNo0(-6, 9);
    var c = a * x + b;
    return qcm({ prompt: 'Resous ' + math(U.linear(a, b) + ' ≤ ' + c),
                 explain: 'On isole x : ' + U.mono(a, 'x') + ' ≤ ' + (a * x) + ', puis on divise par ' + a + ' (positif, le sens ne change pas) : x ≤ ' + x + '.' },
               'x ≤ ' + x, ['x ≥ ' + x, 'x ≤ ' + (-x), 'x < ' + (x + 1)]);
  });

  reg('eq-probleme', 'equation', [4, 5], function () {
    var x = ri(4, 25), a = ri(2, 6), b = ri(3, 20);
    var t = pick(['nombre-mystere', 'prix', 'consecutifs']);
    if (t === 'nombre-mystere') {
      return { prompt: 'Je pense a un nombre. Je le multiplie par ' + a + ', puis j ajoute ' + b + ' : j obtiens ' + (a * x + b) + '.<br>Quel est ce nombre ?',
               answer: String(x),
               explain: 'On pose ' + a + 'x + ' + b + ' = ' + (a * x + b) + '. Alors ' + a + 'x = ' + (a * x) + ' puis x = ' + x + '.' };
    }
    if (t === 'prix') {
      var p = ri(3, 12);
      return { prompt: 'Marc achete ' + a + ' cahiers identiques et un stylo a ' + b + ' €. Il paie ' + (a * p + b) + ' € au total.<br>Quel est le prix d un cahier (en €) ?',
               answer: String(p), explain: a + 'x + ' + b + ' = ' + (a * p + b) + ' donc ' + a + 'x = ' + (a * p) + ' et x = ' + p + ' €.' };
    }
    return { prompt: 'La somme de deux nombres consecutifs vaut ' + (2 * x + 1) + '.<br>Quel est le plus petit ?',
             answer: String(x), explain: 'x + (x+1) = ' + (2 * x + 1) + ' donne 2x = ' + (2 * x) + ' donc x = ' + x + '.' };
  });

  /* ================================================================== */
  /* 7. ARITHMETIQUE                                                     */
  /* ================================================================== */
  reg('ar-divisible', 'arithm', [1, 2], function () {
    var d = pick([2, 3, 4, 5, 9, 10]);
    var n = chance(0.5) ? d * ri(11, 99) : ri(100, 999);
    var ok = n % d === 0;
    var regles = { 2: 'se termine par 0, 2, 4, 6 ou 8', 3: 'la somme des chiffres est un multiple de 3',
                   4: 'les deux derniers chiffres forment un multiple de 4', 5: 'se termine par 0 ou 5',
                   9: 'la somme des chiffres est un multiple de 9', 10: 'se termine par 0' };
    return qcm({ prompt: 'Est-ce que ' + math(n) + ' est divisible par ' + math(d) + ' ?',
                 sub: 'Critere de divisibilite.',
                 explain: 'Un nombre est divisible par ' + d + ' si ' + regles[d] + '. Ici ' + n + ' ÷ ' + d + (ok ? ' = ' + n / d + ' : oui.' : ' n est pas entier : non.') },
               ok ? 'Oui' : 'Non', [ok ? 'Non' : 'Oui']);
  });

  reg('ar-premier', 'arithm', [2, 3], function () {
    var n = chance(0.5) ? pick([11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97])
                        : pick([21, 27, 33, 39, 49, 51, 57, 63, 77, 81, 87, 91, 93, 99, 119, 121]);
    var ok = U.isPrime(n);
    return qcm({ prompt: math(n) + ' est-il un nombre premier ?',
                 sub: 'Un nombre premier a exactement deux diviseurs : 1 et lui-meme.',
                 explain: ok ? n + ' n est divisible que par 1 et ' + n + ' : il est premier.'
                             : n + ' = ' + U.factorStr(n) + ' : il n est pas premier.' },
               ok ? 'Oui' : 'Non', [ok ? 'Non' : 'Oui']);
  });

  reg('ar-diviseurs', 'arithm', [2, 3], function (L) {
    var n = L === 2 ? ri(12, 60) : ri(60, 150);
    var d = U.divisors(n);
    return { prompt: 'Combien ' + math(n) + ' a-t-il de diviseurs (positifs) ?',
             answer: String(d.length),
             explain: 'Diviseurs de ' + n + ' : ' + d.join(' ; ') + '. Il y en a ' + d.length + '.' };
  });

  reg('ar-decompo', 'arithm', [3, 4], function () {
    var n = ri(40, 400);
    while (U.isPrime(n)) n = ri(40, 400);
    var good = U.factorStr(n);
    var f = U.factorize(n);
    return qcm({ prompt: 'Decomposition en produit de facteurs premiers de ' + math(n) + ' ?',
                 explain: n + ' = ' + f.join(' × ') + ' = ' + good + '.' },
               good, [U.factorStr(n + 1), U.factorStr(n - 1), f.join(' + ')]);
  });

  reg('ar-pgcd', 'arithm', [3, 4], function (L) {
    var g = ri(2, L === 3 ? 12 : 24);
    var a = g * ri(2, 12), b = g * ri(2, 12);
    while (U.gcd(a, b) !== g || a === b) { a = g * ri(2, 12); b = g * ri(2, 12); }
    return { prompt: 'Calcule ' + math('PGCD(' + a + ' ; ' + b + ')'), answer: String(g),
             explain: 'Algorithme d Euclide : ' + a + ' = ' + b + ' × ' + Math.floor(a / b) + ' + ' + (a % b) +
               '... on poursuit jusqu au reste nul. PGCD = ' + g + '.' };
  });

  reg('ar-irreductible', 'arithm', [4, 5], function () {
    var g = ri(3, 14), a = g * ri(2, 11), b = g * ri(2, 11);
    while (U.gcd(a, b) !== g || a === b) { a = g * ri(2, 11); b = g * ri(2, 11); }
    var r = U.reduce(a, b);
    return { prompt: 'Rends ' + frac(a, b) + ' irreductible.', answer: U.fracTxt(r[0], r[1]), exact: true,
             explain: 'En decomposant en facteurs premiers : ' + a + ' = ' + U.factorStr(a) + ' et ' + b + ' = ' + U.factorStr(b) +
               '. On repere ainsi que PGCD(' + a + ' ; ' + b + ') = ' + g + '. On divise par ' + g + ' : ' + U.fracTxt(r[0], r[1]) + '.' };
  });

  reg('ar-probleme', 'arithm', [4, 5], function () {
    var g = ri(4, 15), a = g * ri(2, 8), b = g * ri(2, 8);
    while (U.gcd(a, b) !== g) { a = g * ri(2, 8); b = g * ri(2, 8); }
    var ctx = pick([
      'Un fleuriste dispose de ' + a + ' roses et ' + b + ' tulipes. Il veut composer des bouquets identiques en utilisant toutes les fleurs.<br>Quel est le nombre maximal de bouquets ?',
      'Un professeur a ' + a + ' crayons et ' + b + ' gommes a repartir en lots identiques, sans reste.<br>Combien de lots au maximum ?'
    ]);
    return { prompt: ctx, answer: String(g),
             explain: 'On cherche le PGCD de ' + a + ' et ' + b + ', qui vaut ' + g + '. On peut faire ' + g + ' groupes.' };
  });

  /* ================================================================== */
  /* 8. FONCTIONS                                                        */
  /* ================================================================== */
  reg('fn-image', 'fonction', [1, 3], function (L) {
    var a = riNo0(-6, 8), b = riNo0(-9, 9), x = L === 1 ? ri(1, 8) : riNo0(-7, 8);
    return { prompt: 'Soit ' + math('f(x) = ' + U.linear(a, b)) + '.<br>Calcule ' + math('f(' + x + ')') + '.',
             answer: String(a * x + b),
             explain: 'On remplace x par ' + par(x) + ' : f(' + x + ') = ' + a + ' × ' + par(x) + ' + ' + par(b) + ' = ' + (a * x + b) + '.' };
  });

  reg('fn-antecedent', 'fonction', [2, 4], function () {
    var a = riNo0(-7, 8), b = riNo0(-9, 9), x = riNo0(-8, 9);
    var y = a * x + b;
    return { prompt: 'Soit ' + math('f(x) = ' + U.linear(a, b)) + '.<br>Quel est l antecedent de ' + math(y) + ' ?',
             answer: String(x),
             explain: 'On resout ' + U.linear(a, b) + ' = ' + y + ' : ' + U.mono(a, 'x') + ' = ' + (a * x) + ' donc x = ' + x + '.' };
  });

  reg('fn-carre', 'fonction', [2, 3], function () {
    var a = ri(1, 5), x = riNo0(-6, 6);
    return { prompt: 'Soit ' + math('g(x) = ' + (a === 1 ? '' : a) + 'x' + expo(2)) + '.<br>Calcule ' + math('g(' + x + ')') + '.',
             answer: String(a * x * x),
             explain: 'g(' + x + ') = ' + (a === 1 ? '' : a + ' × ') + '(' + x + ')² = ' + (a === 1 ? '' : a + ' × ') + (x * x) + ' = ' + (a * x * x) + '. Le carre est toujours positif.' };
  });

  reg('fn-type', 'fonction', [2, 3], function () {
    var a = riNo0(-6, 7), b = chance(0.5) ? 0 : riNo0(-8, 8);
    var good = b === 0 ? 'Lineaire' : 'Affine non lineaire';
    return qcm({ prompt: 'La fonction ' + math('f(x) = ' + U.linear(a, b)) + ' est :',
                 explain: 'Une fonction affine s ecrit ax + b. Elle est LINEAIRE quand b = 0. Ici b = ' + b + ' donc : ' + good.toLowerCase() + '.' },
               good, [b === 0 ? 'Affine non lineaire' : 'Lineaire', 'Une fonction carre', 'Constante']);
  });

  reg('fn-coef', 'fonction', [4, 5], function () {
    var a = riNo0(-5, 6), b = riNo0(-8, 8), x1 = riNo0(-6, 6), x2 = riNo0(-6, 6);
    while (x2 === x1) x2 = riNo0(-6, 6);
    var y1 = a * x1 + b, y2 = a * x2 + b;
    return { prompt: 'Une fonction affine ' + math('f') + ' verifie ' + math('f(' + x1 + ') = ' + y1) + ' et ' + math('f(' + x2 + ') = ' + y2) + '.<br>Quel est son coefficient directeur ' + math('a') + ' ?',
             answer: String(a),
             explain: 'a = (f(x₂) − f(x₁)) / (x₂ − x₁) = (' + y2 + ' − ' + par(y1) + ') / (' + x2 + ' − ' + par(x1) + ') = ' + (y2 - y1) + ' / ' + (x2 - x1) + ' = ' + a + '.' };
  });

  reg('fn-programme', 'fonction', [2, 4], function (L) {
    var a = ri(2, 9), b = ri(2, 15), x = L <= 3 ? ri(2, 12) : riNo0(-9, 12);
    var r = (x + b) * a;
    return { prompt: 'Programme de calcul :<br>• Choisir un nombre<br>• Ajouter ' + b + '<br>• Multiplier par ' + a +
               '<br><br>Quel resultat obtient-on avec ' + math(x) + ' ?',
             answer: String(r),
             explain: '(' + x + ' + ' + b + ') × ' + a + ' = ' + (x + b) + ' × ' + a + ' = ' + r + '.' };
  });

  /* ------------------------------------------------------------------ */
  global.Q = { THEMES: THEMES, GENS: GENS, reg: reg, qcm: qcm, nearby: nearby };
})(window);
