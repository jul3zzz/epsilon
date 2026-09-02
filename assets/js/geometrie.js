/* =======================================================================
   geometrie.js — outil de geometrie dynamique et de traces de fonctions
   (mini-GeoGebra maison : points, segments, droites, cercles, courbes)
   ======================================================================= */
(function (global) {
  'use strict';

  var COULEURS = ['#6c7bff', '#ff6b81', '#35d39a', '#ffc93c', '#c86bff', '#19c3d6', '#ff8177'];
  var LETTRES = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  /* ------------------------------------------------------------------ */
  /* Etat                                                                 */
  /* ------------------------------------------------------------------ */
  var vue = { x: -10, y: -10, w: 20, h: 20 };   // viewBox en unites du graphe (convention y vers le haut, voir toSvg)
  var grille = true;
  var outil = 'select';
  var points = [];        // {id, x, y, nom}
  var segments = [];      // {id, a, b}
  var droites = [];       // {id, type:'libre', a, b} ou {id, type:'perp'|'parallele', ref:{kind,id}, point}
  var cercles = [];       // {id, centre, bord}  (bord = id d un point sur le cercle, definit le rayon)
  var angles = [];        // {id, a, b, c}  (b = sommet, angle mesure entre les rayons BA et BC)
  var fonctions = [];     // {id, expr, couleur}
  var nextId = 1;
  var enAttente = null;   // etat d attente pour un outil a plusieurs clics (forme variable selon l outil)
  var glisse = null;      // point en cours de deplacement
  var panDepart = null;   // {sx, sy, vx, vy} pour le glisser du fond

  var svgEl = null;

  function reinitialiser() {
    vue = { x: -10, y: -10, w: 20, h: 20 };
    grille = true; outil = 'select';
    points = []; segments = []; droites = []; cercles = []; angles = []; fonctions = [];
    nextId = 1; enAttente = null; glisse = null; panDepart = null;
  }

  /* ------------------------------------------------------------------ */
  /* Evaluateur d expression a une variable x (independant de U.evalExpr) */
  /* ------------------------------------------------------------------ */
  function compilerFonction(entree) {
    var t = String(entree || '')
      .trim().toLowerCase()
      .replace(/\s+/g, '')
      .replace(/,/g, '.')
      .replace(/×/g, '*').replace(/÷/g, '/')
      .replace(/−|–|—/g, '-')
      .replace(/\^/g, '^');
    if (!/^[-+*/0-9.()x²√^a-z]+$/.test(t)) return null;
    var i = 0;
    function peek() { return t.charAt(i); }
    function bad() { throw new Error('expr'); }
    function motCle(mot) { return t.slice(i, i + mot.length) === mot; }
    function nombre() {
      var d = i;
      while (i < t.length && /[0-9.]/.test(t.charAt(i))) i++;
      if (i === d) bad();
      return parseFloat(t.slice(d, i));
    }
    function facteur(x) {
      var v;
      if (peek() === '-') { i++; v = -facteur(x); }
      else if (peek() === '(') { i++; v = expr(x); if (peek() !== ')') bad(); i++; }
      else if (peek() === '√') { i++; v = Math.sqrt(facteur(x)); }
      else if (motCle('sqrt(')) { i += 5; v = Math.sqrt(expr(x)); if (peek() !== ')') bad(); i++; }
      else if (motCle('sin(')) { i += 4; v = Math.sin(expr(x)); if (peek() !== ')') bad(); i++; }
      else if (motCle('cos(')) { i += 4; v = Math.cos(expr(x)); if (peek() !== ')') bad(); i++; }
      else if (motCle('abs(')) { i += 4; v = Math.abs(expr(x)); if (peek() !== ')') bad(); i++; }
      else if (peek() === 'x') { i++; v = x; }
      else { v = nombre(); }
      // exposant
      while (peek() === '²' || peek() === '^') {
        if (peek() === '²') { i++; v = v * v; }
        else { i++; v = Math.pow(v, facteur(x)); }
      }
      // multiplication implicite : 2x, 3(x+1), 2√x...
      if (peek() === 'x' || peek() === '(' || peek() === '√') v = v * facteur(x);
      return v;
    }
    function terme(x) {
      var v = facteur(x);
      while (peek() === '*' || peek() === '/') {
        var op = t.charAt(i++);
        v = op === '*' ? v * facteur(x) : v / facteur(x);
      }
      return v;
    }
    function expr(x) {
      var v = terme(x);
      while (peek() === '+' || peek() === '-') {
        var op = t.charAt(i++);
        v = op === '+' ? v + terme(x) : v - terme(x);
      }
      return v;
    }
    // verifie que l expression est valide en la testant a x=1
    try {
      i = 0; expr(1);
    } catch (e) { return null; }
    return function (x) {
      i = 0;
      try {
        var r = expr(x);
        if (i !== t.length || isNaN(r) || !isFinite(r)) return null;
        return r;
      } catch (e) { return null; }
    };
  }

  /* ------------------------------------------------------------------ */
  /* Conversions graphe <-> svg (axe y invente vers le haut)              */
  /* ------------------------------------------------------------------ */
  function toSvg(gx, gy) { return [gx, -gy]; }
  function toGraph(sx, sy) { return [sx, -sy]; }

  function pointDepuisEvenement(e) {
    var pt = svgEl.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    var m = svgEl.getScreenCTM();
    if (!m) return [0, 0];
    var p = pt.matrixTransform(m.inverse());
    var g = toGraph(p.x, p.y);
    return g; // [gx, gy]
  }

  function nomLibre() {
    for (var i = 0; i < LETTRES.length; i++) {
      var n = LETTRES[i];
      if (!points.some(function (p) { return p.nom === n; })) return n;
    }
    return 'P' + nextId;
  }

  function trouverPoint(id) { return points.filter(function (p) { return p.id === id; })[0] || null; }

  function ajouterPoint(gx, gy) {
    var p = { id: nextId++, x: U.round(gx, 2), y: U.round(gy, 2), nom: nomLibre() };
    points.push(p);
    return p;
  }

  /* ------------------------------------------------------------------ */
  /* Interactions                                                        */
  /* ------------------------------------------------------------------ */
  function distancePixels(e, p) {
    var m = svgEl.getScreenCTM();
    var s = toSvg(p.x, p.y);
    var pt = svgEl.createSVGPoint(); pt.x = s[0]; pt.y = s[1];
    var ecran = pt.matrixTransform(m);
    var dx = e.clientX - ecran.x, dy = e.clientY - ecran.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function pointProche(e) {
    var meilleur = null, meilleureDist = 24; // rayon de detection en pixels ecran (genereux pour le doigt sur mobile)
    points.forEach(function (p) {
      var d = distancePixels(e, p);
      if (d < meilleureDist) { meilleureDist = d; meilleur = p; }
    });
    return meilleur;
  }

  /**
   * Point de passage + vecteur directeur d une "ligne" (segment, droite libre,
   * ou droite construite perpendiculaire/parallele a une autre — recursif).
   * ref = {kind:'segment'|'droite', id}
   */
  function ligneInfo(ref) {
    if (!ref) return null;
    if (ref.kind === 'segment') {
      var s = segments.filter(function (x) { return x.id === ref.id; })[0];
      if (!s) return null;
      var a = trouverPoint(s.a), b = trouverPoint(s.b);
      if (!a || !b) return null;
      return { p: a, dir: { dx: b.x - a.x, dy: b.y - a.y } };
    }
    var d = droites.filter(function (x) { return x.id === ref.id; })[0];
    if (!d) return null;
    if (d.type === 'perp' || d.type === 'parallele') {
      var base = ligneInfo(d.ref);
      var pt = trouverPoint(d.point);
      if (!base || !pt) return null;
      var dir = d.type === 'perp' ? { dx: -base.dir.dy, dy: base.dir.dx } : base.dir;
      return { p: pt, dir: dir };
    }
    var a2 = trouverPoint(d.a), b2 = trouverPoint(d.b);
    if (!a2 || !b2) return null;
    return { p: a2, dir: { dx: b2.x - a2.x, dy: b2.y - a2.y } };
  }

  /** Distance en pixels ecran entre le clic et le segment [A,B] (bornee aux extremites). */
  function distanceSegmentPixels(e, ax, ay, bx, by) {
    var g = pointDepuisEvenement(e);
    var dx = bx - ax, dy = by - ay;
    var len2 = dx * dx + dy * dy || 1;
    var t = Math.max(0, Math.min(1, ((g[0] - ax) * dx + (g[1] - ay) * dy) / len2));
    return distanceGraphePixels(g, ax + t * dx, ay + t * dy);
  }
  /** Distance en pixels ecran entre le clic et la droite infinie passant par (ax,ay), direction (dx,dy). */
  function distanceDroitePixels(e, ax, ay, dx, dy) {
    var g = pointDepuisEvenement(e);
    var len2 = dx * dx + dy * dy || 1;
    var t = ((g[0] - ax) * dx + (g[1] - ay) * dy) / len2;
    return distanceGraphePixels(g, ax + t * dx, ay + t * dy);
  }
  function distanceGraphePixels(g, cx, cy) {
    var distGraphe = Math.sqrt((g[0] - cx) * (g[0] - cx) + (g[1] - cy) * (g[1] - cy));
    var echelle = (svgEl.clientWidth || 600) / vue.w; // pixels ecran par unite de graphe
    return distGraphe * echelle;
  }

  /** Cherche le segment ou la droite le plus proche du clic (segment/droite/perpendiculaire/parallele). */
  function ligneProche(e) {
    var seuil = 18, meilleur = null, meilleureDist = seuil;
    segments.forEach(function (s) {
      var a = trouverPoint(s.a), b = trouverPoint(s.b);
      if (!a || !b) return;
      var d = distanceSegmentPixels(e, a.x, a.y, b.x, b.y);
      if (d < meilleureDist) { meilleureDist = d; meilleur = { kind: 'segment', id: s.id }; }
    });
    droites.forEach(function (d) {
      var info = ligneInfo({ kind: 'droite', id: d.id });
      if (!info) return;
      var dist = distanceDroitePixels(e, info.p.x, info.p.y, info.dir.dx, info.dir.dy);
      if (dist < meilleureDist) { meilleureDist = dist; meilleur = { kind: 'droite', id: d.id }; }
    });
    return meilleur;
  }

  function onPointerDown(e) {
    e.preventDefault();
    var cible = pointProche(e);
    if (outil === 'select') {
      if (cible) { glisse = cible; }
      else {
        var g = pointDepuisEvenement(e);
        panDepart = { sx: g[0], sy: g[1], vx: vue.x, vy: vue.y };
      }
      return;
    }
    if (outil === 'point') {
      var gp = pointDepuisEvenement(e);
      ajouterPoint(gp[0], gp[1]);
      redessiner();
      return;
    }
    if (outil === 'perp' || outil === 'parallele') {
      if (!enAttente) {
        var ligne = ligneProche(e);
        if (ligne) enAttente = { ligne: ligne };
        redessiner();
        return;
      }
      var ptPassage = cible || ajouterPoint.apply(null, pointDepuisEvenement(e));
      droites.push({ id: nextId++, type: outil, ref: enAttente.ligne, point: ptPassage.id });
      enAttente = null;
      redessiner();
      return;
    }
    if (outil === 'angle') {
      var ptAngle = cible || ajouterPoint.apply(null, pointDepuisEvenement(e));
      if (!enAttente) enAttente = { a: ptAngle.id };
      else if (!enAttente.b) enAttente = { a: enAttente.a, b: ptAngle.id };
      else { angles.push({ id: nextId++, a: enAttente.a, b: enAttente.b, c: ptAngle.id }); enAttente = null; }
      redessiner();
      return;
    }
    // outils a deux points : segment, droite, cercle
    var choisi = cible || ajouterPoint.apply(null, pointDepuisEvenement(e));
    if (!enAttente) {
      enAttente = choisi;
    } else if (enAttente.id !== choisi.id) {
      if (outil === 'segment') segments.push({ id: nextId++, a: enAttente.id, b: choisi.id });
      else if (outil === 'droite') droites.push({ id: nextId++, type: 'libre', a: enAttente.id, b: choisi.id });
      else if (outil === 'cercle') cercles.push({ id: nextId++, centre: enAttente.id, bord: choisi.id });
      enAttente = null;
    }
    redessiner();
  }

  function onPointerMove(e) {
    if (glisse) {
      var g = pointDepuisEvenement(e);
      glisse.x = U.round(g[0], 2); glisse.y = U.round(g[1], 2);
      redessiner();
    } else if (panDepart) {
      var g2 = pointDepuisEvenement(e);
      vue.x = panDepart.vx - (g2[0] - panDepart.sx);
      vue.y = panDepart.vy - (g2[1] - panDepart.sy);
      appliquerViewBox();
      redessiner();
    }
  }
  function onPointerUp() { glisse = null; panDepart = null; }

  function zoom(facteur) {
    var cx = vue.x + vue.w / 2, cy = vue.y + vue.h / 2;
    vue.w *= facteur; vue.h *= facteur;
    vue.x = cx - vue.w / 2; vue.y = cy - vue.h / 2;
    appliquerViewBox();
    redessiner();
  }
  function appliquerViewBox() {
    if (svgEl) svgEl.setAttribute('viewBox', vue.x + ' ' + vue.y + ' ' + vue.w + ' ' + vue.h);
  }

  /* ------------------------------------------------------------------ */
  /* Rendu                                                                */
  /* ------------------------------------------------------------------ */
  function svgNS(tag) { return document.createElementNS('http://www.w3.org/2000/svg', tag); }

  function dessinerGrille() {
    var g = svgNS('g');
    if (!grille) return g;
    var pas = choisirPas(vue.w);
    var xDebut = Math.floor(vue.x / pas) * pas;
    var xFin = vue.x + vue.w;
    for (var x = xDebut; x <= xFin; x += pas) {
      var l = svgNS('line');
      var s1 = toSvg(x, vue.y - 1000), s2 = toSvg(x, vue.y + vue.h + 1000);
      l.setAttribute('x1', s1[0]); l.setAttribute('y1', -1000);
      l.setAttribute('x2', s2[0]); l.setAttribute('y2', vue.h + vue.y + 1000);
      l.setAttribute('class', Math.abs(x) < 1e-9 ? 'geo-axe' : 'geo-grille');
      g.appendChild(l);
    }
    var yDebut = Math.floor(vue.y / pas) * pas;
    var yFin = vue.y + vue.h;
    for (var y = yDebut; y <= yFin; y += pas) {
      var l2 = svgNS('line');
      l2.setAttribute('x1', vue.x - 1000); l2.setAttribute('y1', -y);
      l2.setAttribute('x2', vue.x + vue.w + 1000); l2.setAttribute('y2', -y);
      l2.setAttribute('class', Math.abs(y) < 1e-9 ? 'geo-axe' : 'geo-grille');
      g.appendChild(l2);
    }
    return g;
  }
  function choisirPas(largeur) {
    var brut = largeur / 12;
    var puissance = Math.pow(10, Math.floor(Math.log10(brut)));
    var n = brut / puissance;
    var pas = n < 1.5 ? 1 : n < 3.5 ? 2 : n < 7.5 ? 5 : 10;
    return pas * puissance;
  }

  function dessinerFonctions() {
    var g = svgNS('g');
    fonctions.forEach(function (f) {
      var fn = compilerFonction(f.expr);
      if (!fn) return;
      var n = 240;
      var d = '';
      var dernierValide = false;
      for (var k = 0; k <= n; k++) {
        var gx = vue.x + (vue.w * k) / n;
        var gy = fn(gx);
        if (gy === null || Math.abs(gy) > 1e6) { dernierValide = false; continue; }
        var s = toSvg(gx, gy);
        d += (dernierValide ? ' L ' : ' M ') + s[0].toFixed(3) + ' ' + s[1].toFixed(3);
        dernierValide = true;
      }
      var path = svgNS('path');
      path.setAttribute('d', d);
      path.setAttribute('class', 'geo-fonction');
      path.setAttribute('stroke', f.couleur);
      g.appendChild(path);
    });
    return g;
  }

  /** Deux points tres eloignes le long d une droite passant par p, de vecteur directeur dir : couvre toute la vue. */
  function etendreDepuis(p, dir) {
    var norme = Math.sqrt(dir.dx * dir.dx + dir.dy * dir.dy) || 1;
    var k = 1000;
    return [
      { x: p.x - (dir.dx / norme) * k, y: p.y - (dir.dy / norme) * k },
      { x: p.x + (dir.dx / norme) * k, y: p.y + (dir.dy / norme) * k }
    ];
  }

  function dessinerObjets() {
    var g = svgNS('g');

    droites.forEach(function (d) {
      var info = ligneInfo({ kind: 'droite', id: d.id });
      if (!info) return;
      var ext = etendreDepuis(info.p, info.dir);
      var l = svgNS('line');
      var s1 = toSvg(ext[0].x, ext[0].y), s2 = toSvg(ext[1].x, ext[1].y);
      l.setAttribute('x1', s1[0]); l.setAttribute('y1', s1[1]);
      l.setAttribute('x2', s2[0]); l.setAttribute('y2', s2[1]);
      var classe = 'geo-droite' + (d.type === 'perp' ? ' geo-perp' : d.type === 'parallele' ? ' geo-parallele' : '');
      if (enAttente && enAttente.ligne && enAttente.ligne.kind === 'droite' && enAttente.ligne.id === d.id) classe += ' geo-ligne-selectionnee';
      l.setAttribute('class', classe);
      g.appendChild(l);
    });

    segments.forEach(function (s) {
      var a = trouverPoint(s.a), b = trouverPoint(s.b);
      if (!a || !b) return;
      var l = svgNS('line');
      var s1 = toSvg(a.x, a.y), s2 = toSvg(b.x, b.y);
      l.setAttribute('x1', s1[0]); l.setAttribute('y1', s1[1]);
      l.setAttribute('x2', s2[0]); l.setAttribute('y2', s2[1]);
      var classe = 'geo-segment';
      if (enAttente && enAttente.ligne && enAttente.ligne.kind === 'segment' && enAttente.ligne.id === s.id) classe += ' geo-ligne-selectionnee';
      l.setAttribute('class', classe);
      g.appendChild(l);
      var longueur = Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
      var mid = toSvg((a.x + b.x) / 2, (a.y + b.y) / 2);
      var texte = svgNS('text');
      texte.setAttribute('x', mid[0]); texte.setAttribute('y', mid[1] - 0.25);
      texte.setAttribute('class', 'geo-mesure');
      texte.setAttribute('font-size', '0.4');
      texte.textContent = U.round(longueur, 2) + '';
      g.appendChild(texte);
    });

    cercles.forEach(function (c) {
      var centre = trouverPoint(c.centre), bord = trouverPoint(c.bord);
      if (!centre || !bord) return;
      var rayon = Math.sqrt(Math.pow(bord.x - centre.x, 2) + Math.pow(bord.y - centre.y, 2));
      var cc = svgNS('circle');
      var sc = toSvg(centre.x, centre.y);
      cc.setAttribute('cx', sc[0]); cc.setAttribute('cy', sc[1]); cc.setAttribute('r', rayon);
      cc.setAttribute('class', 'geo-cercle');
      g.appendChild(cc);
    });

    angles.forEach(function (ang) {
      var A = trouverPoint(ang.a), B = trouverPoint(ang.b), C = trouverPoint(ang.c);
      if (!A || !B || !C) return;
      var v1 = { x: A.x - B.x, y: A.y - B.y }, v2 = { x: C.x - B.x, y: C.y - B.y };
      var n1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y) || 1e-6, n2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y) || 1e-6;
      var cosA = Math.max(-1, Math.min(1, (v1.x * v2.x + v1.y * v2.y) / (n1 * n2)));
      var angleDeg = Math.acos(cosA) * 180 / Math.PI;
      var rayon = Math.max(0.28, Math.min(0.7, n1 * 0.35, n2 * 0.35));
      var a1 = Math.atan2(v1.y, v1.x), a2 = Math.atan2(v2.y, v2.x);
      var diff = a2 - a1;
      while (diff > Math.PI) diff -= 2 * Math.PI;
      while (diff < -Math.PI) diff += 2 * Math.PI;
      var n = 20, d = '';
      for (var k = 0; k <= n; k++) {
        var a = a1 + diff * (k / n);
        var s = toSvg(B.x + rayon * Math.cos(a), B.y + rayon * Math.sin(a));
        d += (k === 0 ? 'M ' : 'L ') + s[0].toFixed(3) + ' ' + s[1].toFixed(3) + ' ';
      }
      var arc = svgNS('path');
      arc.setAttribute('d', d);
      arc.setAttribute('class', 'geo-angle-arc');
      g.appendChild(arc);
      var amid = a1 + diff * 0.5;
      var lp = toSvg(B.x + (rayon + 0.32) * Math.cos(amid), B.y + (rayon + 0.32) * Math.sin(amid));
      var texte = svgNS('text');
      texte.setAttribute('x', lp[0]); texte.setAttribute('y', lp[1]);
      texte.setAttribute('class', 'geo-mesure geo-angle-label');
      texte.setAttribute('font-size', '0.38');
      texte.textContent = U.round(angleDeg, 1) + '°';
      g.appendChild(texte);
    });

    points.forEach(function (p) {
      var s = toSvg(p.x, p.y);
      var cc = svgNS('circle');
      cc.setAttribute('cx', s[0]); cc.setAttribute('cy', s[1]); cc.setAttribute('r', 0.18);
      var actif = (enAttente && enAttente.id === p.id) ||
        (outil === 'angle' && enAttente && (enAttente.a === p.id || enAttente.b === p.id));
      cc.setAttribute('class', 'geo-point' + (actif ? ' geo-point-actif' : ''));
      g.appendChild(cc);
      var texte = svgNS('text');
      texte.setAttribute('x', s[0] + 0.22); texte.setAttribute('y', s[1] - 0.18);
      texte.setAttribute('class', 'geo-label');
      texte.setAttribute('font-size', '0.42');
      texte.textContent = p.nom + ' (' + U.round(p.x, 2) + ' ; ' + U.round(p.y, 2) + ')';
      g.appendChild(texte);
    });

    return g;
  }

  function redessiner() {
    if (!svgEl) return;
    while (svgEl.firstChild) svgEl.removeChild(svgEl.firstChild);
    svgEl.appendChild(dessinerGrille());
    svgEl.appendChild(dessinerFonctions());
    svgEl.appendChild(dessinerObjets());
    majConsigne();
  }

  /* ------------------------------------------------------------------ */
  /* API publique                                                        */
  /* ------------------------------------------------------------------ */
  var OUTILS = [
    { id: 'select', icon: '🖐️', nom: 'Deplacer' },
    { id: 'point', icon: '•', nom: 'Point' },
    { id: 'segment', icon: '📏', nom: 'Segment' },
    { id: 'droite', icon: '📈', nom: 'Droite' },
    { id: 'cercle', icon: '⭕', nom: 'Cercle' },
    { id: 'angle', icon: '∠', nom: 'Angle' },
    { id: 'perp', icon: '⊥', nom: 'Perpendiculaire' },
    { id: 'parallele', icon: '∥', nom: 'Parallele' }
  ];
  var CONSIGNES = {
    select: 'Tire un point pour le deplacer, ou le fond pour te promener dans le plan.',
    point: 'Clique sur le plan pour poser un point.',
    segment: 'Clique deux points (existants ou nouveaux) pour tracer le segment entre eux.',
    droite: 'Clique deux points (existants ou nouveaux) pour tracer la droite qui passe par eux.',
    cercle: 'Clique le centre, puis un point du bord, pour tracer le cercle.',
    angle: 'Clique 3 points dans l ordre : un premier cote, le sommet, puis le second cote.',
    perp: 'Clique une droite ou un segment de reference, puis le point par lequel doit passer la perpendiculaire.',
    parallele: 'Clique une droite ou un segment de reference, puis le point par lequel doit passer la parallele.'
  };
  function consigneActuelle() {
    if ((outil === 'perp' || outil === 'parallele') && enAttente) return 'Clique maintenant le point de passage (existant ou nouveau).';
    if (outil === 'angle' && enAttente && !enAttente.b) return 'Clique maintenant le sommet de l angle.';
    if (outil === 'angle' && enAttente && enAttente.b) return 'Clique maintenant le second cote de l angle.';
    return CONSIGNES[outil] || '';
  }
  function majConsigne() {
    var el = document.getElementById('geo-consigne');
    if (el) el.textContent = consigneActuelle();
  }

  function pageHTML() {
    var h = '<h1 class="page-title">📐 Geometrie</h1>' +
      '<p class="page-sub">Trace des points, des droites, des cercles, ou des courbes de fonctions comme sur une calculatrice graphique.</p>';
    h += '<div class="geo-toolbar">';
    OUTILS.forEach(function (o) {
      h += '<button class="geo-outil-btn' + (outil === o.id ? ' active' : '') + '" data-act="geo-outil:' + o.id + '" title="' + esc2(o.nom) + '">' +
        '<span>' + o.icon + '</span>' + esc2(o.nom) + '</button>';
    });
    h += '<button class="geo-outil-btn" data-act="geo-zoom:0.8" title="Zoomer">➕</button>';
    h += '<button class="geo-outil-btn" data-act="geo-zoom:1.25" title="Dezoomer">➖</button>';
    h += '<button class="geo-outil-btn" data-act="geo-grille" title="Grille">' + (grille ? '▦' : '▢') + ' Grille</button>';
    h += '<button class="geo-outil-btn" data-act="geo-reset" title="Tout effacer">🗑️ Effacer</button>';
    h += '</div>';

    h += '<div class="geo-fonctions-bar">' +
      '<input id="geo-expr" type="text" placeholder="Ex: x^2-2x+1, ou 2x+3, ou sqrt(x)" autocomplete="off">' +
      '<button class="btn btn-primary btn-sm" data-act="geo-tracer">Tracer f(x)</button></div>';
    h += '<div class="geo-fonctions-liste" id="geo-fonctions-liste">' + listeFonctionsHTML() + '</div>';

    h += '<p class="geo-consigne" id="geo-consigne">' + esc2(consigneActuelle()) + '</p>';
    h += '<div class="geo-canvas-wrap"><svg id="geo-svg" class="geo-svg" viewBox="' + vue.x + ' ' + vue.y + ' ' + vue.w + ' ' + vue.h + '"></svg></div>';
    h += '<p class="geo-aide">💡 Choisis un outil puis clique sur le plan. Avec « Deplacer », tire un point existant pour le bouger ' +
      '(les segments, droites, cercles, perpendiculaires/paralleles et angles qui en dependent se recalculent tout seuls). ' +
      'Clique-glisse sur le fond pour te deplacer dans le plan.</p>';
    return h;
  }
  function esc2(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  function listeFonctionsHTML() {
    if (!fonctions.length) return '<span style="color:var(--muted);font-size:12px">Aucune fonction tracee pour l instant.</span>';
    return fonctions.map(function (f) {
      return '<span class="geo-fonction-chip" style="border-color:' + f.couleur + '"><i style="background:' + f.couleur + '"></i>f(x) = ' + esc2(f.expr) +
        '<button data-act="geo-suppr-fonction:' + f.id + '" title="Retirer">✕</button></span>';
    }).join('');
  }

  function init() {
    svgEl = document.getElementById('geo-svg');
    if (!svgEl) return;
    svgEl.addEventListener('pointerdown', onPointerDown);
    svgEl.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    svgEl.addEventListener('wheel', function (e) {
      e.preventDefault();
      zoom(e.deltaY > 0 ? 1.1 : 0.9);
    }, { passive: false });
    var champ = document.getElementById('geo-expr');
    if (champ) champ.addEventListener('keydown', function (e) { if (e.key === 'Enter') tracerFonction(); });
    redessiner();
  }

  function choisirOutil(id) { outil = id; enAttente = null; majBarreOutils(); majConsigne(); redessiner(); }
  function majBarreOutils() {
    var barre = document.querySelector('.geo-toolbar');
    if (!barre) return;
    OUTILS.forEach(function (o) {
      var btn = barre.querySelector('[data-act="geo-outil:' + o.id + '"]');
      if (btn) btn.classList.toggle('active', outil === o.id);
    });
  }

  function tracerFonction() {
    var champ = document.getElementById('geo-expr');
    if (!champ) return { ok: false };
    var expr = champ.value.trim();
    if (!expr) return { ok: false, msg: 'Ecris une expression.' };
    var fn = compilerFonction(expr);
    if (!fn) return { ok: false, msg: 'Expression non reconnue. Essaie par exemple x^2-2x+1.' };
    fonctions.push({ id: nextId++, expr: expr, couleur: COULEURS[fonctions.length % COULEURS.length] });
    champ.value = '';
    var liste = document.getElementById('geo-fonctions-liste');
    if (liste) liste.innerHTML = listeFonctionsHTML();
    redessiner();
    return { ok: true };
  }
  function supprimerFonction(id) {
    fonctions = fonctions.filter(function (f) { return f.id !== Number(id); });
    var liste = document.getElementById('geo-fonctions-liste');
    if (liste) liste.innerHTML = listeFonctionsHTML();
    redessiner();
  }
  function toggleGrille() {
    grille = !grille;
    var btn = document.querySelector('[data-act="geo-grille"]');
    if (btn) btn.innerHTML = (grille ? '▦' : '▢') + ' Grille';
    redessiner();
  }
  function effacerTout() { reinitialiser(); }

  global.Geo = {
    pageHTML: pageHTML, init: init, choisirOutil: choisirOutil,
    zoom: zoom, tracerFonction: tracerFonction, supprimerFonction: supprimerFonction,
    toggleGrille: toggleGrille, effacerTout: effacerTout, reinitialiser: reinitialiser
  };
})(window);
