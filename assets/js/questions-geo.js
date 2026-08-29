/* =======================================================================
   questions-geo.js — generateurs : donnees, geometrie, grandeurs, algo
   ======================================================================= */
(function () {
  'use strict';
  var ri = U.ri, pick = U.pick, chance = U.chance, riNo0 = U.riNo0;
  var fmt = U.fmt, frac = U.frac, math = U.math, expo = U.expo, par = U.par;
  var reg = Q.reg, qcm = Q.qcm;

  /* ---------- Petites figures SVG (sans image externe) ---------- */
  function sv(inner, w, h) {
    return '<svg class="q-fig" viewBox="0 0 ' + w + ' ' + h + '" width="' + w + '" height="' + h + '" ' +
      'fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round">' + inner + '</svg>';
  }
  function txt(x, y, s, anchor) {
    return '<text x="' + x + '" y="' + y + '" fill="currentColor" stroke="none" font-size="13" font-weight="700" ' +
      'text-anchor="' + (anchor || 'middle') + '">' + s + '</text>';
  }
  /** Triangle rectangle : angle droit en bas a gauche (sommet B). */
  function figTriRect(A, B, C, labAB, labBC, labAC) {
    var s = '<polygon points="30,25 30,135 205,135" stroke="currentColor" fill="rgba(127,127,255,.13)"/>' +
      '<path d="M30,120 L45,120 L45,135" stroke="currentColor" stroke-width="1.6"/>' +
      txt(24, 20, A, 'end') + txt(24, 148, B, 'end') + txt(212, 148, C, 'start') +
      txt(18, 84, labAB, 'end') + txt(117, 152, labBC) + txt(128, 72, labAC, 'start');
    return sv(s, 240, 160);
  }
  /** Configuration de Thales : triangle ABC coupe par (MN) parallele a (BC). */
  function figThales(k) {
    var Ax = 40, Ay = 18, Bx = 18, By = 145, Cx = 215, Cy = 145;
    var Mx = Ax + (Bx - Ax) * k, My = Ay + (By - Ay) * k;
    var Nx = Ax + (Cx - Ax) * k, Ny = Ay + (Cy - Ay) * k;
    var s = '<polygon points="' + Ax + ',' + Ay + ' ' + Bx + ',' + By + ' ' + Cx + ',' + Cy + '" fill="rgba(127,127,255,.1)"/>' +
      '<line x1="' + Mx + '" y1="' + My + '" x2="' + Nx + '" y2="' + Ny + '" stroke-dasharray="0"/>' +
      txt(Ax, Ay - 5, 'A') + txt(Bx - 6, By + 14, 'B', 'end') + txt(Cx + 6, Cy + 14, 'C', 'start') +
      txt(Mx - 8, My + 4, 'M', 'end') + txt(Nx + 9, Ny + 4, 'N', 'start');
    return sv(s, 245, 165);
  }

  /* ================================================================== */
  /* 9. PROPORTIONNALITE & POURCENTAGES                                  */
  /* ================================================================== */
  reg('pr-quatrieme', 'proport', [1, 3], function (L) {
    var pu = L === 1 ? ri(2, 9) : U.round(ri(15, 90) / 10, 1);
    var n1 = ri(2, 9), n2 = ri(3, 15);
    while (n2 === n1) n2 = ri(3, 15);
    var obj = pick(['croissants', 'cahiers', 'stylos', 'litres de peinture', 'kg de pommes']);
    var p1 = U.round(pu * n1, 2), p2 = U.round(pu * n2, 2);
    return { prompt: n1 + ' ' + obj + ' coutent ' + math(fmt(p1) + ' €') + '.<br>Combien coutent ' + n2 + ' ' + obj + ' ?',
             sub: 'Reponse en euros.', answer: fmt(p2), tol: 0.011,
             explain: 'Prix unitaire : ' + fmt(p1) + ' ÷ ' + n1 + ' = ' + fmt(pu) + ' €. Puis ' + fmt(pu) + ' × ' + n2 + ' = ' + fmt(p2) + ' €.' };
  });

  reg('pr-pourcent', 'proport', [1, 3], function (L) {
    var p = L === 1 ? pick([10, 25, 50, 20]) : pick([5, 12, 15, 18, 30, 35, 45, 60, 75]);
    var n = L === 1 ? ri(2, 40) * 10 : ri(20, 90) * ri(2, 10);
    var v = U.round(n * p / 100, 2);
    return { prompt: 'Calcule ' + math(p + ' % de ' + n), answer: fmt(v), tol: 0.011,
             explain: p + ' % de ' + n + ' = ' + n + ' × ' + fmt(p / 100) + ' = ' + fmt(v) + '.' };
  });

  reg('pr-augment', 'proport', [2, 4], function () {
    var p = pick([5, 8, 10, 12, 15, 20, 25, 30, 40]);
    var n = ri(20, 200) * pick([1, 5, 10]);
    var hausse = chance(0.5);
    var v = U.round(n * (1 + (hausse ? 1 : -1) * p / 100), 2);
    return { prompt: 'Un article coute ' + math(fmt(n) + ' €') + '. Son prix ' + (hausse ? 'augmente' : 'baisse') + ' de ' + math(p + ' %') + '.<br>Quel est le nouveau prix ?',
             answer: fmt(v), tol: 0.011,
             explain: 'Coefficient multiplicateur : ' + (hausse ? '1 + ' : '1 − ') + fmt(p / 100) + ' = ' + fmt(1 + (hausse ? 1 : -1) * p / 100) +
               '. Nouveau prix : ' + fmt(n) + ' × ' + fmt(1 + (hausse ? 1 : -1) * p / 100) + ' = ' + fmt(v) + ' €.' };
  });

  reg('pr-coef', 'proport', [3, 4], function () {
    var p = pick([4, 5, 8, 10, 12, 15, 20, 25, 30]);
    var hausse = chance(0.5);
    var c = U.round(1 + (hausse ? 1 : -1) * p / 100, 4);
    return qcm({ prompt: 'Quel est le coefficient multiplicateur associe a une ' + (hausse ? 'hausse' : 'baisse') + ' de ' + math(p + ' %') + ' ?',
                 explain: (hausse ? 'Hausse' : 'Baisse') + ' de ' + p + ' % → coefficient ' + (hausse ? '1 + ' : '1 − ') + fmt(p / 100) + ' = ' + fmt(c) + '.' },
               fmt(c), [fmt(U.round(1 - (hausse ? 1 : -1) * p / 100, 4)), fmt(p / 100), fmt(U.round(1 + p, 2))]);
  });

  reg('pr-taux', 'proport', [3, 4], function () {
    var p = pick([5, 10, 15, 20, 25, 40, 50]);
    var a = ri(2, 40) * 10;
    var b = U.round(a * (1 + p / 100 * (chance(0.5) ? 1 : -1)), 2);
    var taux = U.round((b - a) / a * 100, 2);
    return { prompt: 'Une population passe de ' + math(a) + ' a ' + math(fmt(b)) + ' habitants.<br>Quel est le taux d evolution en % ?',
             sub: 'Mets un signe − si c est une baisse.', answer: fmt(taux), tol: 0.06,
             explain: 'Taux = (valeur finale − valeur initiale) ÷ valeur initiale × 100 = (' + fmt(b) + ' − ' + a + ') ÷ ' + a + ' × 100 = ' + fmt(taux) + ' %.' };
  });

  reg('pr-successif', 'proport', [4, 5], function () {
    var p1 = pick([10, 20, 25, 30]), p2 = pick([10, 20, 25, 50]);
    var n = ri(10, 40) * 10;
    var v = U.round(n * (1 + p1 / 100) * (1 - p2 / 100), 2);
    return { prompt: 'Un prix de ' + math(n + ' €') + ' augmente de ' + math(p1 + ' %') + ', puis baisse de ' + math(p2 + ' %') + '.<br>Quel est le prix final ?',
             answer: fmt(v), tol: 0.011,
             explain: 'On multiplie les coefficients : ' + n + ' × ' + fmt(1 + p1 / 100) + ' × ' + fmt(1 - p2 / 100) + ' = ' + fmt(v) +
               ' €. Attention : les pourcentages ne s additionnent pas !' };
  });

  reg('pr-reciproque', 'proport', [4, 5], function () {
    var p = pick([10, 20, 25, 40, 50]);
    var init = ri(4, 30) * 10;
    var final = U.round(init * (1 - p / 100), 2);
    return { prompt: 'Apres une remise de ' + math(p + ' %') + ', un article coute ' + math(fmt(final) + ' €') + '.<br>Quel etait son prix avant remise ?',
             answer: fmt(init), tol: 0.011,
             explain: 'Prix final = prix initial × ' + fmt(1 - p / 100) + '. Donc prix initial = ' + fmt(final) + ' ÷ ' + fmt(1 - p / 100) + ' = ' + fmt(init) + ' €.' };
  });

  reg('pr-echelle', 'proport', [3, 4], function () {
    var ech = pick([100, 200, 500, 1000, 2000, 25000]);
    var cm = ri(2, 30);
    var reel = cm * ech / 100;                     // en metres
    return { prompt: 'Sur une carte a l echelle ' + math('1/' + ech) + ', une distance mesure ' + math(cm + ' cm') + '.<br>Quelle est la distance reelle en metres ?',
             answer: fmt(reel), tol: 0.011,
             explain: cm + ' cm sur la carte → ' + cm + ' × ' + ech + ' = ' + fmt(cm * ech) + ' cm en realite, soit ' + fmt(reel) + ' m.' };
  });

  /* ================================================================== */
  /* 10. STATISTIQUES                                                    */
  /* ================================================================== */
  function serie(n, min, max) { var s = []; for (var i = 0; i < n; i++) s.push(ri(min, max)); return s; }

  reg('st-moyenne', 'stats', [1, 3], function (L) {
    var n = L === 1 ? 4 : L === 2 ? 5 : 6;
    var s = serie(n, 2, 20);
    var som = s.reduce(function (a, b) { return a + b; }, 0);
    // on ajuste pour tomber juste
    s[0] += (n - som % n) % n;
    som = s.reduce(function (a, b) { return a + b; }, 0);
    var m = som / n;
    return { prompt: 'Calcule la moyenne de la serie :<br>' + math(s.join(' ; ')), answer: fmt(m), tol: 0.011,
             explain: 'Somme = ' + som + ', effectif = ' + n + '. Moyenne = ' + som + ' ÷ ' + n + ' = ' + fmt(m) + '.' };
  });

  reg('st-mediane', 'stats', [2, 3], function (L) {
    var n = L === 2 ? 5 : pick([6, 7]);
    var s = serie(n, 3, 30);
    var tri = s.slice().sort(function (a, b) { return a - b; });
    var med = n % 2 ? tri[(n - 1) / 2] : (tri[n / 2 - 1] + tri[n / 2]) / 2;
    return { prompt: 'Quelle est la mediane de la serie :<br>' + math(s.join(' ; ')) + ' ?', answer: fmt(med), tol: 0.011,
             explain: 'Serie rangee : ' + tri.join(' ; ') + '. ' +
               (n % 2 ? 'Effectif impair (' + n + ') → la mediane est la valeur centrale : ' + med + '.'
                      : 'Effectif pair (' + n + ') → moyenne des deux valeurs centrales : (' + tri[n / 2 - 1] + ' + ' + tri[n / 2] + ') ÷ 2 = ' + fmt(med) + '.') };
  });

  reg('st-etendue', 'stats', [1, 2], function () {
    var s = serie(ri(5, 7), 2, 45);
    var mx = Math.max.apply(null, s), mn = Math.min.apply(null, s);
    return { prompt: 'Quelle est l etendue de la serie :<br>' + math(s.join(' ; ')) + ' ?', answer: String(mx - mn),
             explain: 'Etendue = valeur max − valeur min = ' + mx + ' − ' + mn + ' = ' + (mx - mn) + '.' };
  });

  reg('st-moyenne-eff', 'stats', [4, 5], function () {
    var vals = [], effs = [], k = ri(3, 4), i, som = 0, tot = 0;
    for (i = 0; i < k; i++) { vals.push(ri(1, 6) + i * 3); effs.push(ri(2, 9)); }
    for (i = 0; i < k; i++) { som += vals[i] * effs[i]; tot += effs[i]; }
    var m = U.round(som / tot, 2);
    var tbl = '<div style="overflow-x:auto;margin:8px 0"><table style="margin:0 auto;border-collapse:collapse;font-size:14px">' +
      '<tr><td style="padding:5px 11px;border:1px solid currentColor;font-weight:700">Note</td>' + vals.map(function (v) { return '<td style="padding:5px 11px;border:1px solid currentColor">' + v + '</td>'; }).join('') + '</tr>' +
      '<tr><td style="padding:5px 11px;border:1px solid currentColor;font-weight:700">Effectif</td>' + effs.map(function (v) { return '<td style="padding:5px 11px;border:1px solid currentColor">' + v + '</td>'; }).join('') + '</tr></table></div>';
    return { prompt: 'Calcule la moyenne de cette serie :' + tbl, sub: 'Arrondis au centieme si besoin.',
             answer: fmt(m), tol: 0.011,
             explain: 'Somme ponderee = ' + vals.map(function (v, j) { return v + '×' + effs[j]; }).join(' + ') + ' = ' + som +
               '. Effectif total = ' + tot + '. Moyenne = ' + som + ' ÷ ' + tot + ' ≈ ' + fmt(m) + '.' };
  });

  reg('st-manquante', 'stats', [4, 5], function () {
    var n = ri(4, 5), s = serie(n - 1, 5, 18);
    var m = ri(8, 15);
    var manquant = m * n - s.reduce(function (a, b) { return a + b; }, 0);
    while (manquant < 0 || manquant > 20) { m = ri(8, 15); manquant = m * n - s.reduce(function (a, b) { return a + b; }, 0); }
    return { prompt: 'Un eleve a obtenu ' + math(s.join(' ; ')) + '.<br>Quelle note doit-il avoir au prochain devoir pour que sa moyenne sur ' + n + ' notes soit exactement ' + math(m) + ' ?',
             answer: String(manquant),
             explain: 'Il faut un total de ' + m + ' × ' + n + ' = ' + (m * n) + '. Il a deja ' + s.reduce(function (a, b) { return a + b; }, 0) +
               '. Il lui manque ' + manquant + '.' };
  });

  /* ================================================================== */
  /* 11. PROBABILITES                                                    */
  /* ================================================================== */
  reg('pb-de', 'proba', [1, 2], function () {
    var intro = 'On lance un de a 6 faces equilibre.<br>';
    var t = pick(['pair', 'sup', 'exact']);
    var n, question, exp;
    if (t === 'exact') {
      var f = ri(1, 6);
      n = 1;
      question = 'Quelle est la probabilite d obtenir ' + math(f) + ' ?';
      exp = 'Il y a 6 issues equiprobables et une seule donne ' + f + '.';
    } else if (t === 'pair') {
      n = 3;
      question = 'Quelle est la probabilite d obtenir un nombre pair ?';
      exp = 'Les faces paires sont 2, 4 et 6 : 3 cas favorables sur 6.';
    } else {
      var k = ri(2, 5);
      n = 6 - k + 1;
      question = 'Quelle est la probabilite d obtenir un nombre superieur ou egal a ' + math(k) + ' ?';
      exp = 'Les faces qui conviennent sont ' + k + ', ..., 6 : ' + n + ' cas favorables sur 6.';
    }
    var r = U.reduce(n, 6);
    return { prompt: intro + question, sub: 'Fraction irreductible.',
             answer: U.fracTxt(r[0], r[1]), exact: true, alt: [U.fracTxt(n, 6)],
             explain: exp + ' P = ' + n + '/6' + (n !== r[0] ? ' = ' + U.fracTxt(r[0], r[1]) : '') + '.' };
  });

  reg('pb-urne', 'proba', [2, 3], function () {
    var r = ri(2, 9), b = ri(2, 9), v = ri(1, 7);
    var tot = r + b + v;
    var coul = pick([['rouges', r], ['bleues', b], ['vertes', v]]);
    var red = U.reduce(coul[1], tot);
    return { prompt: 'Un sac contient ' + math(r + ' billes rouges') + ', ' + math(b + ' bleues') + ' et ' + math(v + ' vertes') +
               '.<br>On en tire une au hasard. Probabilite d obtenir une bille ' + coul[0] + ' ?',
             sub: 'Fraction irreductible.', answer: U.fracTxt(red[0], red[1]), exact: true, alt: [U.fracTxt(coul[1], tot)],
             explain: 'Cas favorables : ' + coul[1] + '. Cas possibles : ' + r + ' + ' + b + ' + ' + v + ' = ' + tot +
               '. P = ' + coul[1] + '/' + tot + (coul[1] !== red[0] ? ' = ' + U.fracTxt(red[0], red[1]) : '') + '.' };
  });

  reg('pb-contraire', 'proba', [2, 3], function () {
    var d = pick([4, 5, 8, 10, 20]), n = ri(1, d - 1);
    var r = U.reduce(d - n, d);
    return { prompt: 'La probabilite d un evenement ' + math('E') + ' est ' + frac(n, d) + '.<br>Quelle est la probabilite de l evenement contraire ?',
             sub: 'Fraction irreductible.', answer: U.fracTxt(r[0], r[1]), exact: true, alt: [U.fracTxt(d - n, d)],
             explain: 'P(non E) = 1 − P(E) = 1 − ' + n + '/' + d + ' = ' + (d - n) + '/' + d +
               (d - n !== r[0] ? ' = ' + U.fracTxt(r[0], r[1]) : '') + '.' };
  });

  reg('pb-carte', 'proba', [2, 3], function () {
    var t = pick([['un coeur', 13], ['un roi', 4], ['une carte rouge', 26], ['un as', 4], ['une figure', 12]]);
    var r = U.reduce(t[1], 52);
    return { prompt: 'On tire une carte dans un jeu de 52 cartes.<br>Quelle est la probabilite de tirer ' + t[0] + ' ?',
             sub: 'Fraction irreductible.', answer: U.fracTxt(r[0], r[1]), exact: true, alt: [U.fracTxt(t[1], 52)],
             explain: t[1] + ' cartes conviennent sur 52 : P = ' + t[1] + '/52 = ' + U.fracTxt(r[0], r[1]) + '.' };
  });

  reg('pb-deux-des', 'proba', [4, 5], function () {
    var s = ri(4, 10);
    var n = 0;
    for (var a = 1; a <= 6; a++) for (var b = 1; b <= 6; b++) if (a + b === s) n++;
    var r = U.reduce(n, 36);
    return { prompt: 'On lance deux des a 6 faces et on additionne les resultats.<br>Quelle est la probabilite d obtenir une somme egale a ' + math(s) + ' ?',
             sub: 'Fraction irreductible.', answer: U.fracTxt(r[0], r[1]), exact: true, alt: [U.fracTxt(n, 36)],
             explain: 'Il y a 6 × 6 = 36 issues possibles, et ' + n + ' donnent une somme de ' + s + '. P = ' + n + '/36 = ' + U.fracTxt(r[0], r[1]) + '.' };
  });

  reg('pb-successifs', 'proba', [4, 5], function () {
    var r = ri(2, 6), b = ri(2, 6), tot = r + b;
    var red = U.reduce(r * (r - 1), tot * (tot - 1));
    return { prompt: 'Une urne contient ' + math(r + ' boules rouges') + ' et ' + math(b + ' boules blanches') +
               '.<br>On tire 2 boules successivement <b>sans remise</b>. Probabilite d obtenir deux rouges ?',
             sub: 'Fraction irreductible.', answer: U.fracTxt(red[0], red[1]), exact: true,
             explain: 'P = ' + r + '/' + tot + ' × ' + (r - 1) + '/' + (tot - 1) + ' = ' + (r * (r - 1)) + '/' + (tot * (tot - 1)) +
               ' = ' + U.fracTxt(red[0], red[1]) + '.' };
  });

  /* ================================================================== */
  /* 12. PYTHAGORE                                                       */
  /* ================================================================== */
  reg('py-hypo', 'pythagore', [1, 3], function (L) {
    var t = pick(U.TRIPLETS), k = L >= 3 ? pick([1, 2]) : 1;
    var a = t[0] * k, b = t[1] * k, c = t[2] * k;
    return { prompt: 'Le triangle ' + math('ABC') + ' est rectangle en ' + math('B') + ', avec ' + math('AB = ' + a + ' cm') +
               ' et ' + math('BC = ' + b + ' cm') + '.<br>Combien vaut ' + math('AC') + ' (en cm) ?' +
               figTriRect('A', 'B', 'C', a, b, '?'),
             answer: String(c),
             explain: 'Pythagore : AC² = AB² + BC² = ' + a + '² + ' + b + '² = ' + a * a + ' + ' + b * b + ' = ' + c * c +
               '. Donc AC = √' + c * c + ' = ' + c + ' cm.' };
  });

  reg('py-cote', 'pythagore', [2, 4], function () {
    var t = pick(U.TRIPLETS);
    var a = t[0], b = t[1], c = t[2];
    return { prompt: 'Le triangle ' + math('ABC') + ' est rectangle en ' + math('B') + ', avec ' + math('AC = ' + c + ' cm') +
               ' (hypotenuse) et ' + math('BC = ' + b + ' cm') + '.<br>Combien vaut ' + math('AB') + ' (en cm) ?' +
               figTriRect('A', 'B', 'C', '?', b, c),
             answer: String(a),
             explain: 'Pythagore : AB² = AC² − BC² = ' + c + '² − ' + b + '² = ' + c * c + ' − ' + b * b + ' = ' + a * a +
               '. Donc AB = √' + a * a + ' = ' + a + ' cm.' };
  });

  reg('py-arrondi', 'pythagore', [3, 4], function () {
    var a = ri(3, 14), b = ri(3, 16);
    var c2 = a * a + b * b;
    while (Number.isInteger(Math.sqrt(c2))) { b = ri(3, 16); c2 = a * a + b * b; }
    var c = U.round(Math.sqrt(c2), 1);
    return { prompt: 'Triangle ' + math('ABC') + ' rectangle en ' + math('B') + ' : ' + math('AB = ' + a + ' cm') + ', ' + math('BC = ' + b + ' cm') +
               '.<br>Calcule ' + math('AC') + ' arrondi au dixieme de cm.' + figTriRect('A', 'B', 'C', a, b, '?'),
             answer: fmt(c), tol: 0.06,
             explain: 'AC² = ' + a * a + ' + ' + b * b + ' = ' + c2 + ', donc AC = √' + c2 + ' ≈ ' + fmt(U.round(Math.sqrt(c2), 3)) + ' ≈ ' + fmt(c) + ' cm.' };
  });

  reg('py-reciproque', 'pythagore', [3, 4], function () {
    var vrai = chance(0.5), t = pick(U.TRIPLETS);
    var a = t[0], b = t[1], c = vrai ? t[2] : t[2] + pick([1, 2, -1]);
    return qcm({ prompt: 'Un triangle a pour cotes ' + math(a + ' cm') + ', ' + math(b + ' cm') + ' et ' + math(c + ' cm') +
                   '.<br>Est-il rectangle ?',
                 sub: 'Utilise la reciproque de Pythagore.',
                 explain: 'Le plus grand cote est ' + Math.max(a, b, c) + '. On compare ' + c + '² = ' + c * c +
                   ' et ' + a + '² + ' + b + '² = ' + (a * a + b * b) + '. ' +
                   (c * c === a * a + b * b ? 'Egalite → le triangle EST rectangle.' : 'Pas d egalite → le triangle N EST PAS rectangle.') },
               (c * c === a * a + b * b) ? 'Oui' : 'Non', [(c * c === a * a + b * b) ? 'Non' : 'Oui']);
  });

  reg('py-3d', 'pythagore', [5, 5], function () {
    var t = pick([[3, 4, 12, 13], [6, 8, 24, 26], [2, 3, 6, 7], [1, 2, 2, 3], [4, 4, 7, 9]]);
    var L1 = t[0], l = t[1], h = t[2], d = t[3];
    var d2 = Math.sqrt(L1 * L1 + l * l + h * h);
    if (Math.abs(d2 - d) > 1e-6) { d = U.round(d2, 2); }
    return { prompt: 'Un pave droit mesure ' + math(L1 + ' cm') + ' × ' + math(l + ' cm') + ' × ' + math(h + ' cm') +
               '.<br>Quelle est la longueur de sa grande diagonale (en cm) ?',
             sub: 'Arrondis au centieme si besoin.', answer: fmt(d), tol: 0.011,
             explain: 'Diagonale de la base : √(' + L1 + '² + ' + l + '²) = √' + (L1 * L1 + l * l) +
               '. Puis grande diagonale = √(' + (L1 * L1 + l * l) + ' + ' + h + '²) = √' + (L1 * L1 + l * l + h * h) + ' ≈ ' + fmt(d) + ' cm.' };
  });

  /* ================================================================== */
  /* 13. THALES                                                          */
  /* ================================================================== */
  reg('th-longueur', 'thales', [2, 4], function () {
    var q = ri(2, 5), p = ri(1, q - 1);
    var a = ri(2, 6), b = ri(2, 6), c = ri(2, 5);
    var AB = q * a, AM = p * a, AC = q * b, AN = p * b, BC = q * c, MN = p * c;
    return { prompt: 'Sur la figure, ' + math('(MN) // (BC)') + '.<br>' + math('AM = ' + AM + ' cm') + ', ' + math('AB = ' + AB + ' cm') +
               ', ' + math('AC = ' + AC + ' cm') + '.<br>Combien vaut ' + math('AN') + ' (en cm) ?' + figThales(p / q),
             answer: fmt(AN), tol: 0.011,
             explain: 'Thales : AM/AB = AN/AC. Donc AN = AC × AM/AB = ' + AC + ' × ' + AM + ' ÷ ' + AB + ' = ' + fmt(AN) + ' cm.' };
  });

  reg('th-coef', 'thales', [2, 3], function () {
    var q = ri(2, 6), p = ri(1, q - 1), a = ri(2, 7);
    var AB = q * a, AM = p * a;
    var r = U.reduce(p, q);
    return { prompt: 'Sur la figure, ' + math('(MN) // (BC)') + ', ' + math('AM = ' + AM + ' cm') + ' et ' + math('AB = ' + AB + ' cm') +
               '.<br>Quel est le coefficient de reduction ' + math('AM/AB') + ' ?' + figThales(p / q),
             sub: 'Fraction irreductible.', answer: U.fracTxt(r[0], r[1]), exact: true, alt: [U.fracTxt(AM, AB)],
             explain: AM + '/' + AB + ' = ' + U.fracTxt(r[0], r[1]) + ' apres simplification.' };
  });

  reg('th-mn', 'thales', [3, 4], function () {
    var q = ri(2, 5), p = ri(1, q - 1), a = ri(2, 6), c = ri(2, 6);
    var AB = q * a, AM = p * a, BC = q * c, MN = p * c;
    return { prompt: math('(MN) // (BC)') + ', ' + math('AM = ' + AM + ' cm') + ', ' + math('AB = ' + AB + ' cm') + ', ' + math('BC = ' + BC + ' cm') +
               '.<br>Combien vaut ' + math('MN') + ' (en cm) ?' + figThales(p / q),
             answer: fmt(MN), tol: 0.011,
             explain: 'Thales : MN/BC = AM/AB = ' + AM + '/' + AB + '. Donc MN = ' + BC + ' × ' + AM + ' ÷ ' + AB + ' = ' + fmt(MN) + ' cm.' };
  });

  reg('th-parallele', 'thales', [4, 5], function () {
    var q = ri(2, 5), p = ri(1, q - 1), a = ri(2, 6), b = ri(2, 6);
    var AB = q * a, AM = p * a, AC = q * b, AN = p * b;
    var paralleles = chance(0.5);
    var ANaff = paralleles ? AN : AN + pick([1, 2, -1]);
    var ok = Math.abs(AM / AB - ANaff / AC) < 1e-9;
    return qcm({ prompt: 'Les points ' + math('A, M, B') + ' sont alignes, ainsi que ' + math('A, N, C') + '.<br>' +
                   math('AM = ' + AM) + ', ' + math('AB = ' + AB) + ', ' + math('AN = ' + ANaff) + ', ' + math('AC = ' + AC) +
                   '.<br>Les droites ' + math('(MN)') + ' et ' + math('(BC)') + ' sont-elles paralleles ?',
                 explain: 'On compare AM/AB = ' + fmt(U.round(AM / AB, 4)) + ' et AN/AC = ' + fmt(U.round(ANaff / AC, 4)) + '. ' +
                   (ok ? 'Les rapports sont egaux → par la reciproque de Thales, elles sont paralleles.'
                       : 'Les rapports sont differents → elles ne sont pas paralleles.') },
               ok ? 'Oui' : 'Non', [ok ? 'Non' : 'Oui']);
  });

  /* ================================================================== */
  /* 14. TRIGONOMETRIE                                                   */
  /* ================================================================== */
  reg('tr-ratio', 'trigo', [2, 3], function () {
    var f = pick(['cos', 'sin', 'tan']);
    var bonnes = { cos: 'AB/AC', sin: 'BC/AC', tan: 'BC/AB' };
    var defs = { cos: 'cote adjacent ÷ hypotenuse', sin: 'cote oppose ÷ hypotenuse', tan: 'cote oppose ÷ cote adjacent' };
    return qcm({ prompt: 'Dans le triangle ' + math('ABC') + ' rectangle en ' + math('B') + ', quelle egalite est correcte ?<br>' +
                   math(f + '(BAC)') + ' = ?' + figTriRect('A', 'B', 'C', '', '', ''),
                 sub: 'SOH-CAH-TOA : ' + defs[f] + '.',
                 explain: 'Pour l angle en A : le cote adjacent est [AB], le cote oppose est [BC], l hypotenuse est [AC]. Donc ' + f + '(BAC) = ' + bonnes[f] + '.' },
               bonnes[f], ['AB/AC', 'BC/AC', 'BC/AB', 'AC/AB'].filter(function (x) { return x !== bonnes[f]; }).slice(0, 3));
  });

  reg('tr-valeur', 'trigo', [2, 3], function () {
    var t = pick([['cos', 60, '0,5'], ['sin', 30, '0,5'], ['cos', 0, '1'], ['sin', 90, '1'], ['tan', 45, '1'], ['cos', 90, '0'], ['sin', 0, '0']]);
    return { prompt: 'Que vaut ' + math(t[0] + '(' + t[1] + '°)') + ' ?', answer: t[2], tol: 0.005,
             explain: t[0] + '(' + t[1] + '°) = ' + t[2] + ' : c est une valeur a connaitre par coeur.' };
  });

  reg('tr-cote', 'trigo', [3, 4], function () {
    var ang = pick([25, 30, 35, 40, 50, 55, 60, 65, 70]);
    var hyp = ri(5, 20);
    var adj = U.round(hyp * Math.cos(ang * Math.PI / 180), 1);
    return { prompt: 'Triangle ' + math('ABC') + ' rectangle en ' + math('B') + ' : ' + math('AC = ' + hyp + ' cm') + ' et l angle ' + math('BAC = ' + ang + '°') +
               '.<br>Calcule ' + math('AB') + ' arrondi au dixieme de cm.' + figTriRect('A', 'B', 'C', '?', '', hyp),
             answer: fmt(adj), tol: 0.06,
             explain: 'cos(BAC) = AB/AC donc AB = AC × cos(' + ang + '°) = ' + hyp + ' × ' + fmt(U.round(Math.cos(ang * Math.PI / 180), 4)) +
               ' ≈ ' + fmt(adj) + ' cm.' };
  });

  reg('tr-angle', 'trigo', [4, 5], function () {
    var t = pick(U.TRIPLETS);
    var opp = t[0], hyp = t[2];
    var ang = U.round(Math.asin(opp / hyp) * 180 / Math.PI, 0);
    return { prompt: 'Triangle ' + math('ABC') + ' rectangle en ' + math('B') + ' : ' + math('BC = ' + opp + ' cm') + ' et ' + math('AC = ' + hyp + ' cm') +
               '.<br>Calcule l angle ' + math('BAC') + ' arrondi au degre.' + figTriRect('A', 'B', 'C', '', opp, hyp),
             answer: String(ang), tol: 0.6,
             explain: 'sin(BAC) = cote oppose / hypotenuse = ' + opp + '/' + hyp + ' = ' + fmt(U.round(opp / hyp, 4)) +
               '. Donc BAC = sin⁻¹(' + fmt(U.round(opp / hyp, 4)) + ') ≈ ' + ang + '°.' };
  });

  /* ================================================================== */
  /* 15. GEOMETRIE & ANGLES                                              */
  /* ================================================================== */
  reg('ge-triangle', 'geo', [1, 2], function () {
    var a = ri(25, 90), b = ri(20, 180 - a - 10);
    return { prompt: 'Dans un triangle, deux angles mesurent ' + math(a + '°') + ' et ' + math(b + '°') + '.<br>Combien mesure le troisieme (en degres) ?',
             answer: String(180 - a - b),
             explain: 'La somme des angles d un triangle vaut 180°. Donc 180 − ' + a + ' − ' + b + ' = ' + (180 - a - b) + '°.' };
  });

  reg('ge-suppl', 'geo', [1, 2], function () {
    var a = ri(15, 165), t = chance(0.5) && a < 90;
    if (t) return { prompt: 'Quel est le complementaire d un angle de ' + math(a + '°') + ' ?', answer: String(90 - a),
             explain: 'Deux angles complementaires ont pour somme 90°. Donc 90 − ' + a + ' = ' + (90 - a) + '°.' };
    return { prompt: 'Quel est le supplementaire d un angle de ' + math(a + '°') + ' ?', answer: String(180 - a),
             explain: 'Deux angles supplementaires ont pour somme 180°. Donc 180 − ' + a + ' = ' + (180 - a) + '°.' };
  });

  reg('ge-paralleles', 'geo', [2, 3], function () {
    var a = ri(30, 150);
    var t = pick(['alternes', 'correspondants', 'opposes']);
    var noms = { alternes: 'alternes-internes', correspondants: 'correspondants', opposes: 'opposes par le sommet' };
    return { prompt: 'Deux droites paralleles sont coupees par une secante.<br>Un angle mesure ' + math(a + '°') +
               '. Combien mesure l angle ' + noms[t] + ' correspondant (en degres) ?',
             answer: String(a),
             explain: 'Les angles ' + noms[t] + ' ont la meme mesure : ' + a + '°.' };
  });

  reg('ge-polygone', 'geo', [2, 3], function () {
    var n = ri(4, 10);
    return { prompt: 'Quelle est la somme des angles d un polygone a ' + math(n + ' cotes') + ' (en degres) ?',
             answer: String((n - 2) * 180),
             explain: 'Formule : (n − 2) × 180° = (' + n + ' − 2) × 180 = ' + ((n - 2) * 180) + '°.' };
  });

  reg('ge-symetrie', 'geo', [2, 3], function () {
    var x = riNo0(-8, 8), y = riNo0(-8, 8);
    var t = pick(['origine', 'axeX', 'axeY']);
    var res = t === 'origine' ? [-x, -y] : t === 'axeX' ? [x, -y] : [-x, y];
    var nom = { origine: 'de l origine O', axeX: 'de l axe des abscisses', axeY: 'de l axe des ordonnees' }[t];
    return qcm({ prompt: 'Quelles sont les coordonnees du symetrique de ' + math('A(' + x + ' ; ' + y + ')') + ' par rapport a ' + nom + ' ?',
                 explain: 'Symetrie par rapport a ' + nom + ' : on obtient (' + res[0] + ' ; ' + res[1] + ').' },
               '(' + res[0] + ' ; ' + res[1] + ')',
               ['(' + (-res[0]) + ' ; ' + res[1] + ')', '(' + res[0] + ' ; ' + (-res[1]) + ')', '(' + res[1] + ' ; ' + res[0] + ')']);
  });

  reg('ge-translation', 'geo', [3, 3], function () {
    var x = riNo0(-8, 8), y = riNo0(-8, 8), a = riNo0(-6, 6), b = riNo0(-6, 6);
    return qcm({ prompt: 'On applique a ' + math('A(' + x + ' ; ' + y + ')') + ' la translation de vecteur ' + math('(' + a + ' ; ' + b + ')') +
                   '.<br>Quelles sont les coordonnees de l image ?',
                 explain: 'On ajoute les coordonnees du vecteur : (' + x + ' + ' + par(a) + ' ; ' + y + ' + ' + par(b) + ') = (' + (x + a) + ' ; ' + (y + b) + ').' },
               '(' + (x + a) + ' ; ' + (y + b) + ')',
               ['(' + (x - a) + ' ; ' + (y - b) + ')', '(' + (x * a) + ' ; ' + (y * b) + ')', '(' + (y + b) + ' ; ' + (x + a) + ')']);
  });

  reg('ge-rotation', 'geo', [3, 4], function () {
    var x = riNo0(-8, 8), y = riNo0(-8, 8);
    var t = pick([180, 90, -90]);
    var res = t === 180 ? [-x, -y] : t === 90 ? [-y, x] : [y, -x];
    var nom = t === 180 ? 'un demi-tour (180°)' : t === 90 ? 'un quart de tour dans le sens direct (90°)' : 'un quart de tour dans le sens horaire (−90°)';
    return qcm({ prompt: 'Image de ' + math('A(' + x + ' ; ' + y + ')') + ' par ' + nom + ' de centre ' + math('O') + ' ?',
                 explain: nom.charAt(0).toUpperCase() + nom.slice(1) + ' de centre O donne (' + res[0] + ' ; ' + res[1] + ').' },
               '(' + res[0] + ' ; ' + res[1] + ')',
               ['(' + (-res[0]) + ' ; ' + (-res[1]) + ')', '(' + res[1] + ' ; ' + res[0] + ')', '(' + x + ' ; ' + (-y) + ')']);
  });

  reg('ge-homothetie', 'geo', [4, 5], function () {
    var x = riNo0(-6, 6), y = riNo0(-6, 6), k = pick([2, 3, -2, -1, 4]);
    return qcm({ prompt: 'Image de ' + math('A(' + x + ' ; ' + y + ')') + ' par l homothetie de centre ' + math('O') + ' et de rapport ' + math(k) + ' ?',
                 explain: 'On multiplie les coordonnees par ' + k + ' : (' + x + ' × ' + par(k) + ' ; ' + y + ' × ' + par(k) + ') = (' + (x * k) + ' ; ' + (y * k) + ').' },
               '(' + (x * k) + ' ; ' + (y * k) + ')',
               ['(' + (x + k) + ' ; ' + (y + k) + ')', '(' + (-x * k) + ' ; ' + (-y * k) + ')', '(' + (y * k) + ' ; ' + (x * k) + ')']);
  });

  /* ================================================================== */
  /* 16. GRANDEURS & MESURES                                             */
  /* ================================================================== */
  reg('gr-conversion', 'grandeur', [1, 3], function (L) {
    var t;
    if (L === 1) t = pick([['km', 'm', 1000], ['m', 'cm', 100], ['kg', 'g', 1000], ['L', 'cL', 100], ['h', 'min', 60]]);
    else if (L === 2) t = pick([['cm', 'mm', 10], ['t', 'kg', 1000], ['m', 'mm', 1000], ['km', 'cm', 100000], ['min', 's', 60]]);
    else t = pick([['m²', 'cm²', 10000], ['dm³', 'cm³', 1000], ['m³', 'dm³', 1000], ['km²', 'm²', 1000000], ['cm²', 'mm²', 100]]);
    var v = U.round(ri(15, 950) / 10, 1);
    var r = U.round(v * t[2], 6);
    return { prompt: 'Convertis : ' + math(fmt(v) + ' ' + t[0]) + ' = ? ' + math(t[1]),
             answer: fmt(r), tol: Math.max(0.001, r * 1e-9),
             explain: '1 ' + t[0] + ' = ' + fmt(t[2]) + ' ' + t[1] + '. Donc ' + fmt(v) + ' × ' + fmt(t[2]) + ' = ' + fmt(r) + ' ' + t[1] + '.' };
  });

  reg('gr-perimetre', 'grandeur', [1, 2], function (L) {
    var t = pick(['rect', 'carre', 'cercle']);
    if (t === 'rect') { var a = ri(3, 25), b = ri(3, 25);
      return { prompt: 'Perimetre d un rectangle de ' + math(a + ' cm') + ' sur ' + math(b + ' cm') + ' (en cm) ?',
               answer: String(2 * (a + b)), explain: 'P = 2 × (L + l) = 2 × (' + a + ' + ' + b + ') = ' + 2 * (a + b) + ' cm.' }; }
    if (t === 'carre') { var c = ri(3, 30);
      return { prompt: 'Perimetre d un carre de cote ' + math(c + ' cm') + ' (en cm) ?', answer: String(4 * c),
               explain: 'P = 4 × c = 4 × ' + c + ' = ' + 4 * c + ' cm.' }; }
    var r = ri(2, 15);
    return { prompt: 'Perimetre d un cercle de rayon ' + math(r + ' cm') + ', arrondi au dixieme (en cm) ?',
             answer: fmt(U.round(2 * Math.PI * r, 1)), tol: 0.06,
             explain: 'P = 2 × π × r = 2 × π × ' + r + ' ≈ ' + fmt(U.round(2 * Math.PI * r, 2)) + ' cm.' };
  });

  reg('gr-aire', 'grandeur', [2, 3], function () {
    var t = pick(['rect', 'triangle', 'disque', 'trapeze']);
    if (t === 'rect') { var a = ri(3, 25), b = ri(3, 25);
      return { prompt: 'Aire d un rectangle de ' + math(a + ' cm') + ' sur ' + math(b + ' cm') + ' (en cm²) ?',
               answer: String(a * b), explain: 'A = L × l = ' + a + ' × ' + b + ' = ' + a * b + ' cm².' }; }
    if (t === 'triangle') { var base = ri(4, 24), h = ri(3, 18);
      var v = base * h / 2;
      return { prompt: 'Aire d un triangle de base ' + math(base + ' cm') + ' et de hauteur ' + math(h + ' cm') + ' (en cm²) ?',
               answer: fmt(v), tol: 0.011, explain: 'A = (base × hauteur) ÷ 2 = (' + base + ' × ' + h + ') ÷ 2 = ' + fmt(v) + ' cm².' }; }
    if (t === 'trapeze') { var B = ri(8, 20), b2 = ri(3, 7), h2 = ri(3, 12);
      var v2 = (B + b2) * h2 / 2;
      return { prompt: 'Aire d un trapeze de bases ' + math(B + ' cm') + ' et ' + math(b2 + ' cm') + ', de hauteur ' + math(h2 + ' cm') + ' (en cm²) ?',
               answer: fmt(v2), tol: 0.011, explain: 'A = ((B + b) × h) ÷ 2 = ((' + B + ' + ' + b2 + ') × ' + h2 + ') ÷ 2 = ' + fmt(v2) + ' cm².' }; }
    var r = ri(2, 14);
    return { prompt: 'Aire d un disque de rayon ' + math(r + ' cm') + ', arrondie au dixieme (en cm²) ?',
             answer: fmt(U.round(Math.PI * r * r, 1)), tol: 0.06,
             explain: 'A = π × r² = π × ' + r + '² = π × ' + r * r + ' ≈ ' + fmt(U.round(Math.PI * r * r, 2)) + ' cm².' };
  });

  reg('gr-volume', 'grandeur', [3, 4], function () {
    var t = pick(['pave', 'cylindre', 'boule', 'cone', 'pyramide']);
    if (t === 'pave') { var a = ri(2, 12), b = ri(2, 12), c = ri(2, 12);
      return { prompt: 'Volume d un pave droit de ' + math(a + ' × ' + b + ' × ' + c + ' cm') + ' (en cm³) ?',
               answer: String(a * b * c), explain: 'V = L × l × h = ' + a + ' × ' + b + ' × ' + c + ' = ' + a * b * c + ' cm³.' }; }
    if (t === 'cylindre') { var r = ri(2, 9), h = ri(3, 15);
      var v = U.round(Math.PI * r * r * h, 1);
      return { prompt: 'Volume d un cylindre de rayon ' + math(r + ' cm') + ' et de hauteur ' + math(h + ' cm') + ', arrondi au dixieme (en cm³) ?',
               answer: fmt(v), tol: 0.06, explain: 'V = π × r² × h = π × ' + r * r + ' × ' + h + ' ≈ ' + fmt(v) + ' cm³.' }; }
    if (t === 'boule') { var r2 = ri(2, 10);
      var v2 = U.round(4 / 3 * Math.PI * r2 * r2 * r2, 1);
      return { prompt: 'Volume d une boule de rayon ' + math(r2 + ' cm') + ', arrondi au dixieme (en cm³) ?',
               answer: fmt(v2), tol: 0.11, explain: 'V = (4/3) × π × r³ = (4/3) × π × ' + (r2 * r2 * r2) + ' ≈ ' + fmt(v2) + ' cm³.' }; }
    if (t === 'cone') { var r3 = ri(2, 9), h3 = ri(3, 15);
      var v3 = U.round(Math.PI * r3 * r3 * h3 / 3, 1);
      return { prompt: 'Volume d un cone de rayon ' + math(r3 + ' cm') + ' et de hauteur ' + math(h3 + ' cm') + ', arrondi au dixieme (en cm³) ?',
               answer: fmt(v3), tol: 0.06, explain: 'V = (1/3) × π × r² × h = (1/3) × π × ' + r3 * r3 + ' × ' + h3 + ' ≈ ' + fmt(v3) + ' cm³.' }; }
    var ab = ri(3, 12), h4 = ri(3, 15);
    var v4 = U.round(ab * ab * h4 / 3, 2);
    return { prompt: 'Volume d une pyramide a base carree de cote ' + math(ab + ' cm') + ' et de hauteur ' + math(h4 + ' cm') + ' (en cm³) ?',
             sub: 'Arrondis au centieme si besoin.', answer: fmt(v4), tol: 0.011,
             explain: 'V = (1/3) × aire de base × hauteur = (1/3) × ' + (ab * ab) + ' × ' + h4 + ' ≈ ' + fmt(v4) + ' cm³.' };
  });

  reg('gr-vitesse', 'grandeur', [2, 4], function (L) {
    var t = L <= 2 ? 'vitesse' : pick(['vitesse', 'distance', 'duree']);
    var v = pick([40, 50, 60, 72, 80, 90, 100, 120]);
    var h = pick([0.5, 1, 1.5, 2, 2.5, 3, 4]);
    var d = v * h;
    if (t === 'vitesse') return { prompt: 'Un train parcourt ' + math(fmt(d) + ' km') + ' en ' + math(fmt(h) + ' h') + '.<br>Quelle est sa vitesse moyenne (en km/h) ?',
             answer: fmt(v), tol: 0.011, explain: 'v = d ÷ t = ' + fmt(d) + ' ÷ ' + fmt(h) + ' = ' + fmt(v) + ' km/h.' };
    if (t === 'distance') return { prompt: 'Une voiture roule a ' + math(v + ' km/h') + ' pendant ' + math(fmt(h) + ' h') + '.<br>Quelle distance parcourt-elle (en km) ?',
             answer: fmt(d), tol: 0.011, explain: 'd = v × t = ' + v + ' × ' + fmt(h) + ' = ' + fmt(d) + ' km.' };
    return { prompt: 'Un cycliste parcourt ' + math(fmt(d) + ' km') + ' a ' + math(v + ' km/h') + '.<br>Combien de temps met-il (en heures) ?',
             answer: fmt(h), tol: 0.011, explain: 't = d ÷ v = ' + fmt(d) + ' ÷ ' + v + ' = ' + fmt(h) + ' h.' };
  });

  reg('gr-agrandissement', 'grandeur', [4, 5], function () {
    var k = pick([2, 3, 4, 5, 10, 0.5]);
    var t = pick(['aire', 'volume']);
    var base = ri(3, 40);
    var res = t === 'aire' ? U.round(base * k * k, 3) : U.round(base * k * k * k, 3);
    return { prompt: 'On agrandit un solide avec un rapport ' + math('k = ' + fmt(k)) + '.<br>Son ' + t + ' valait ' + math(base + (t === 'aire' ? ' cm²' : ' cm³')) +
               '. Que vaut-' + (t === 'aire' ? 'elle' : 'il') + ' apres ?',
             answer: fmt(res), tol: 0.011,
             explain: 'Les longueurs sont multipliees par k, les aires par k² et les volumes par k³. Ici : ' + base + ' × ' +
               fmt(k) + (t === 'aire' ? '² ' : '³ ') + '= ' + base + ' × ' + fmt(t === 'aire' ? k * k : k * k * k) + ' = ' + fmt(res) + '.' };
  });

  reg('gr-debit', 'grandeur', [4, 5], function () {
    var deb = pick([5, 8, 10, 12, 15, 20, 25]);
    var min = pick([4, 6, 8, 10, 12, 15, 20]);
    return { prompt: 'Un robinet a un debit de ' + math(deb + ' L/min') + '.<br>Quel volume (en litres) obtient-on en ' + math(min + ' minutes') + ' ?',
             answer: String(deb * min),
             explain: 'Volume = debit × duree = ' + deb + ' × ' + min + ' = ' + (deb * min) + ' L.' };
  });

  reg('gr-masse-vol', 'grandeur', [4, 5], function () {
    var rho = pick([0.8, 1, 1.2, 2.7, 7.8, 11.3]);
    var vol = ri(2, 40);
    var m = U.round(rho * vol, 2);
    return { prompt: 'Un materiau a une masse volumique de ' + math(fmt(rho) + ' g/cm³') + '.<br>Quelle est la masse (en g) d un echantillon de ' + math(vol + ' cm³') + ' ?',
             answer: fmt(m), tol: 0.011,
             explain: 'masse = masse volumique × volume = ' + fmt(rho) + ' × ' + vol + ' = ' + fmt(m) + ' g.' };
  });

  /* ================================================================== */
  /* 17. ALGORITHMIQUE (type Scratch)                                    */
  /* ================================================================== */
  reg('al-variable', 'algo', [2, 3], function () {
    var a = ri(2, 15), b = ri(2, 12), c = ri(2, 9);
    var r = (a + b) * c;
    return { prompt: 'Un script effectue :<br><code>mettre A a ' + a + '</code><br><code>ajouter ' + b + ' a A</code><br><code>mettre A a A × ' + c + '</code>' +
               '<br><br>Que vaut ' + math('A') + ' a la fin ?',
             answer: String(r),
             explain: 'A = ' + a + ', puis A = ' + a + ' + ' + b + ' = ' + (a + b) + ', puis A = ' + (a + b) + ' × ' + c + ' = ' + r + '.' };
  });

  reg('al-boucle', 'algo', [3, 4], function () {
    var n = ri(3, 7), a = ri(1, 8), pas = ri(2, 9);
    var r = a + n * pas;
    return { prompt: 'Un script effectue :<br><code>mettre N a ' + a + '</code><br><code>repeter ' + n + ' fois</code><br><code>&nbsp;&nbsp;ajouter ' + pas + ' a N</code>' +
               '<br><br>Que vaut ' + math('N') + ' a la fin ?',
             answer: String(r),
             explain: 'On ajoute ' + pas + ' au total ' + n + ' fois : ' + a + ' + ' + n + ' × ' + pas + ' = ' + r + '.' };
  });

  reg('al-boucle-mul', 'algo', [4, 5], function () {
    var n = ri(2, 5), a = ri(2, 4), k = ri(2, 3);
    var r = a * Math.pow(k, n);
    return { prompt: 'Un script effectue :<br><code>mettre N a ' + a + '</code><br><code>repeter ' + n + ' fois</code><br><code>&nbsp;&nbsp;mettre N a N × ' + k + '</code>' +
               '<br><br>Que vaut ' + math('N') + ' a la fin ?',
             answer: String(r),
             explain: 'On multiplie par ' + k + ' a chaque tour : ' + a + ' × ' + k + expo(n) + ' = ' + a + ' × ' + Math.pow(k, n) + ' = ' + r + '.' };
  });

  reg('al-deplacement', 'algo', [2, 4], function () {
    var x = ri(-8, 8), y = ri(-8, 8), dx = riNo0(-9, 9), dy = riNo0(-9, 9);
    return qcm({ prompt: 'Un lutin est en ' + math('(' + x + ' ; ' + y + ')') + '. Le script execute :<br>' +
                   '<code>ajouter ' + dx + ' a x</code><br><code>ajouter ' + dy + ' a y</code><br><br>Ou se trouve-t-il ?',
                 explain: 'Nouvelle abscisse : ' + x + ' + ' + par(dx) + ' = ' + (x + dx) + '. Nouvelle ordonnee : ' + y + ' + ' + par(dy) + ' = ' + (y + dy) + '.' },
               '(' + (x + dx) + ' ; ' + (y + dy) + ')',
               ['(' + (x - dx) + ' ; ' + (y - dy) + ')', '(' + (x + dy) + ' ; ' + (y + dx) + ')', '(' + dx + ' ; ' + dy + ')']);
  });

  reg('al-condition', 'algo', [3, 4], function () {
    var seuil = ri(5, 20), n = ri(1, 30), a = ri(2, 9), b = ri(2, 9);
    var r = n > seuil ? n * a : n + b;
    return { prompt: 'Script :<br><code>mettre N a ' + n + '</code><br><code>si N > ' + seuil + ' alors</code><br><code>&nbsp;&nbsp;mettre N a N × ' + a + '</code>' +
               '<br><code>sinon</code><br><code>&nbsp;&nbsp;ajouter ' + b + ' a N</code><br><br>Que vaut ' + math('N') + ' a la fin ?',
             answer: String(r),
             explain: n + (n > seuil ? ' > ' : ' ≤ ') + seuil + ' donc on execute la branche « ' + (n > seuil ? 'alors' : 'sinon') + ' » : N = ' + r + '.' };
  });

  /* ================================================================== */
  /* MOTEUR : fabrication d une question                                 */
  /* ================================================================== */
  Q.byId = {};
  Q.THEMES.forEach(function (t) { Q.byId[t.id] = t; });

  /** Liste des generateurs disponibles pour un theme et un niveau. */
  function pool(themeId, level) {
    return Q.GENS.filter(function (g) {
      return g.theme === themeId && level >= g.lv[0] && level <= g.lv[1];
    });
  }

  /**
   * Fabrique une question.
   * @param themeId  identifiant du theme
   * @param level    niveau vise (1 a 5)
   * @param eviter   liste d identifiants de generateurs a eviter (repetition)
   */
  Q.generate = function (themeId, level, eviter) {
    level = U.clamp(Math.round(level), 1, 5);
    var candidats = pool(themeId, level);
    var l = level;
    // si rien a ce niveau, on cherche le niveau disponible le plus proche
    for (var d = 1; d <= 4 && !candidats.length; d++) {
      candidats = pool(themeId, level - d);
      if (candidats.length) { l = level - d; break; }
      candidats = pool(themeId, level + d);
      if (candidats.length) { l = level + d; break; }
    }
    if (!candidats.length) { candidats = Q.GENS.filter(function (g) { return g.theme === themeId; }); l = 2; }
    if (!candidats.length) { candidats = Q.GENS; l = 2; }

    // on evite de reposer le meme type de question deux fois de suite
    if (eviter && eviter.length && candidats.length > 1) {
      var filtre = candidats.filter(function (g) { return eviter.indexOf(g.id) < 0; });
      if (filtre.length) candidats = filtre;
    }

    var g = pick(candidats);
    var q;
    try { q = g.f(U.clamp(l, g.lv[0], g.lv[1])); }
    catch (e) { q = { prompt: 'Calcule ' + math('7 × 8'), answer: '56', explain: '7 × 8 = 56.' }; g = { id: 'secours' }; }
    q.theme = themeId;
    q.themeName = (Q.byId[themeId] || {}).name || themeId;
    q.icon = (Q.byId[themeId] || {}).icon || '❓';
    q.level = l;
    q.gen = g.id;
    q.type = q.type || 'num';
    return q;
  };

  /** Nombre de generateurs par theme (utile pour l affichage). */
  Q.count = function (themeId) {
    return Q.GENS.filter(function (g) { return g.theme === themeId; }).length;
  };
})();
