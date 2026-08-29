/* =======================================================================
   progression.js — rangs, experience, pieces, adaptation du niveau, succes
   ======================================================================= */
(function (global) {
  'use strict';

  /* ------------------------------------------------------------------ */
  /* 1. LES RANGS                                                        */
  /* ------------------------------------------------------------------ */
  var FAMILLES = [
    { nom: 'Bois',     icon: '🪵', couleur: '#b08968', div: 4 },
    { nom: 'Bronze',   icon: '🥉', couleur: '#d38b4b', div: 4 },
    { nom: 'Argent',   icon: '🥈', couleur: '#cfd8e8', div: 4 },
    { nom: 'Or',       icon: '🥇', couleur: '#ffd24a', div: 4 },
    { nom: 'Platine',  icon: '💠', couleur: '#63e6e0', div: 4 },
    { nom: 'Diamant',  icon: '💎', couleur: '#8ea2ff', div: 4 },
    { nom: 'Maitre',   icon: '👑', couleur: '#ff77cf', div: 4 },
    { nom: 'Legende du Brevet', icon: '🏆', couleur: '#ffa62b', div: 1 }
  ];
  var ROMAINS = ['IV', 'III', 'II', 'I'];

  var RANGS = [];
  FAMILLES.forEach(function (f) {
    for (var d = 0; d < f.div; d++) {
      RANGS.push({
        idx: RANGS.length,
        nom: f.nom + (f.div > 1 ? ' ' + ROMAINS[d] : ''),
        famille: f.nom,
        icon: f.icon,
        couleur: f.couleur,
        xp: 100 + RANGS.length * 38          // XP a gagner DANS ce rang pour passer au suivant
      });
    }
  });
  var DERNIER = RANGS.length - 1;

  /* ------------------------------------------------------------------ */
  /* 2. NIVEAU ADAPTATIF (systeme de type Elo, un score par theme)        */
  /* ------------------------------------------------------------------ */
  var R_MIN = 550, R_MAX = 1850;
  /** Score de difficulte associe a un niveau de question. */
  function difficulteDe(niveau) { return 640 + niveau * 160; }
  /** Probabilite estimee de reussite. */
  function attendu(R, D) { return 1 / (1 + Math.pow(10, (D - R) / 400)); }

  /** Niveau (1 a 5) a proposer sur ce theme, avec un peu de variete. */
  function niveauPour(themeId, variation) {
    var p = Store.joueur();
    var c = (p && p.comp[themeId]) || { r: 1000, vus: 0 };
    var cible = c.r - 220;                               // vise ~78 % de reussite
    var n = Math.round((cible - 640) / 160);
    n = U.clamp(n, 1, 5);
    if (variation !== false) {
      var d = Math.random();
      if (d < 0.18) n += 1;                              // parfois un peu plus dur
      else if (d < 0.32) n -= 1;                         // parfois un palier de confiance
    }
    if (c.vus < 3) n = Math.min(n, 2);                   // demarrage en douceur
    return U.clamp(n, 1, 5);
  }

  /** Met a jour la memoire de competence apres une reponse. */
  function majCompetence(themeId, niveau, reussi, tempsMs, genId) {
    var p = Store.joueur();
    if (!p) return { avant: 1000, apres: 1000 };
    var c = p.comp[themeId] || (p.comp[themeId] = { r: 1000, vus: 0, ok: 0, serie: 0, temps: 0, maj: 0, gens: {} });
    var avant = c.r;
    var D = difficulteDe(niveau);
    var E = attendu(c.r, D);
    var K = c.vus < 10 ? 42 : c.vus < 30 ? 30 : 22;
    var S = reussi ? 1 : 0;
    // petite prime de rapidite : repondre juste et vite vaut un peu plus
    if (reussi && tempsMs && tempsMs < 6000) S = 1.08;
    if (reussi && tempsMs && tempsMs > 30000) S = 0.94;
    c.r = U.clamp(Math.round(c.r + K * (S - E)), R_MIN, R_MAX);
    c.vus++;
    if (reussi) { c.ok++; c.serie++; } else { c.serie = 0; }
    c.temps = Math.round((c.temps * (c.vus - 1) + (tempsMs || 0)) / c.vus);
    c.maj = Date.now();
    if (genId) {
      var g = c.gens[genId] || (c.gens[genId] = { vus: 0, ok: 0 });
      g.vus++; if (reussi) g.ok++;
    }
    return { avant: avant, apres: c.r, delta: c.r - avant };
  }

  /** Pourcentage de maitrise affichable pour un theme. */
  function maitrise(themeId) {
    var p = Store.joueur();
    var c = (p && p.comp[themeId]) || { r: 1000, vus: 0 };
    var m = (c.r - 700) / (1750 - 700) * 100;
    if (c.vus < 4) m = Math.min(m, c.vus * 6);           // pas de faux "maitrise" sans donnees
    return U.clamp(Math.round(m), 0, 100);
  }

  /** Maitrise globale (moyenne ponderee par le nombre de questions vues). */
  function maitriseGlobale() {
    var p = Store.joueur();
    if (!p) return 0;
    var som = 0, n = 0;
    Q.THEMES.forEach(function (t) { som += maitrise(t.id); n++; });
    return Math.round(som / n);
  }

  /* ------------------------------------------------------------------ */
  /* 3. EXPERIENCE ET RANGS                                              */
  /* ------------------------------------------------------------------ */
  function rangCourant() {
    var p = Store.joueur();
    return RANGS[U.clamp(p ? p.rangIdx : 0, 0, DERNIER)];
  }
  function xpRequis(idx) { return RANGS[U.clamp(idx, 0, DERNIER)].xp; }

  /** Ajoute de l XP. Renvoie la liste des rangs franchis. */
  function ajouterXp(n) {
    var p = Store.joueur();
    if (!p || n <= 0) return [];
    p.xp += n;
    p.xpTotal += n;
    var montees = [];
    while (p.rangIdx < DERNIER && p.xp >= xpRequis(p.rangIdx)) {
      p.xp -= xpRequis(p.rangIdx);
      p.rangIdx++;
      var gain = 60 + p.rangIdx * 18;
      p.pieces += gain;
      montees.push({ rang: RANGS[p.rangIdx], pieces: gain });
    }
    if (p.rangIdx >= DERNIER) p.xp = Math.min(p.xp, xpRequis(DERNIER));
    Store.sauver();
    return montees;
  }

  function ajouterPieces(n) {
    var p = Store.joueur();
    if (!p) return;
    p.pieces = Math.max(0, p.pieces + n);
    Store.sauver();
  }

  /* ------------------------------------------------------------------ */
  /* 4. RECOMPENSES                                                      */
  /* ------------------------------------------------------------------ */
  /** XP et pieces gagnes pour une bonne reponse. */
  function gainQuestion(niveau, combo) {
    var bonus = 1 + Math.min(combo, 10) * 0.06;
    return {
      xp: Math.round((5 + niveau * 3) * bonus),
      pieces: Math.round((1 + niveau) * bonus)
    };
  }

  /* ------------------------------------------------------------------ */
  /* 5. SUCCES                                                           */
  /* ------------------------------------------------------------------ */
  var SUCCES = [
    { id: 'premier-pas',  nom: 'Premiers pas',        desc: 'Terminer une partie',                   icon: '🎯', pieces: 50,   test: function (p) { return p.stats.parties >= 1; } },
    { id: 'habitue',      nom: 'Habitue',             desc: 'Terminer 10 parties',                   icon: '🎮', pieces: 120,  test: function (p) { return p.stats.parties >= 10; } },
    { id: 'acharne',      nom: 'Acharne',             desc: 'Terminer 50 parties',                   icon: '🔥', pieces: 400,  test: function (p) { return p.stats.parties >= 50; } },
    { id: 'centurion',    nom: 'Centurion',           desc: 'Repondre juste 100 fois',               icon: '💯', pieces: 200,  test: function (p) { return p.stats.ok >= 100; } },
    { id: 'millier',      nom: 'Millefeuille',        desc: 'Repondre juste 1000 fois',              icon: '🏅', pieces: 900,  test: function (p) { return p.stats.ok >= 1000; } },
    { id: 'serie-10',     nom: 'En serie',            desc: 'Enchainer 10 bonnes reponses',          icon: '⚡', pieces: 150,  test: function (p) { return p.stats.meilleureSerie >= 10; } },
    { id: 'serie-25',     nom: 'Increvable',          desc: 'Enchainer 25 bonnes reponses',          icon: '🌟', pieces: 500,  test: function (p) { return p.stats.meilleureSerie >= 25; } },
    { id: 'sprint-20',    nom: 'Eclair',              desc: '20 bonnes reponses dans un Sprint',     icon: '🏃', pieces: 250,  test: function (p) { return p.stats.meilleurSprint >= 20; } },
    { id: 'survie-20',    nom: 'Survivant',           desc: 'Atteindre 20 en mode Survie',           icon: '❤️', pieces: 300,  test: function (p) { return p.stats.meilleurSurvie >= 20; } },
    { id: 'jours-3',      nom: 'Regulier',            desc: '3 jours d affilee',                     icon: '📅', pieces: 150,  test: function (p) { return p.stats.serieJours >= 3; } },
    { id: 'jours-7',      nom: 'Semaine parfaite',    desc: '7 jours d affilee',                     icon: '🗓️', pieces: 400,  test: function (p) { return p.stats.serieJours >= 7; } },
    { id: 'jours-30',     nom: 'Marathonien',         desc: '30 jours d affilee',                    icon: '🏆', pieces: 1500, test: function (p) { return p.stats.serieJours >= 30; } },
    { id: 'explorateur',  nom: 'Explorateur',         desc: 'Toucher aux 17 themes',                 icon: '🧭', pieces: 350,
      test: function (p) { return Q.THEMES.every(function (t) { return p.comp[t.id] && p.comp[t.id].vus > 0; }); } },
    { id: 'specialiste',  nom: 'Specialiste',         desc: 'Atteindre 80 % de maitrise sur un theme', icon: '🎓', pieces: 400,
      test: function () { return Q.THEMES.some(function (t) { return maitrise(t.id) >= 80; }); } },
    { id: 'polymathe',    nom: 'Polymathe',           desc: '60 % de maitrise sur TOUS les themes',  icon: '🧠', pieces: 2000,
      test: function () { return Q.THEMES.every(function (t) { return maitrise(t.id) >= 60; }); } },
    { id: 'collection',   nom: 'Collectionneur',      desc: 'Posseder 15 objets',                    icon: '🛍️', pieces: 300,
      test: function (p) { return p.inventaire.length >= 15; } },
    { id: 'sans-faute',   nom: 'Sans faute',          desc: '100 % sur une partie de 10 questions',  icon: '✨', pieces: 300,
      test: function (p) { return p.hist.some(function (h) { return h.total >= 10 && h.score === h.total; }); } },
    { id: 'brevet-blanc', nom: 'Pret pour le brevet', desc: 'Reussir 80 % au Defi Brevet',           icon: '📜', pieces: 800,
      test: function (p) { return p.hist.some(function (h) { return h.mode === 'brevet' && h.total > 0 && h.score / h.total >= 0.8; }); } }
  ];

  /** Verifie les succes et renvoie ceux qui viennent d etre debloques. */
  function verifierSucces() {
    var p = Store.joueur();
    if (!p) return [];
    var nouveaux = [];
    SUCCES.forEach(function (s) {
      if (p.succes.indexOf(s.id) >= 0) return;
      var ok = false;
      try { ok = s.test(p); } catch (e) { ok = false; }
      if (ok) { p.succes.push(s.id); p.pieces += s.pieces; nouveaux.push(s); }
    });
    if (nouveaux.length) Store.sauver();
    return nouveaux;
  }

  /* ------------------------------------------------------------------ */
  /* 6. BOUTIQUE                                                         */
  /* ------------------------------------------------------------------ */
  function possede(itemId) {
    var p = Store.joueur();
    return !!p && p.inventaire.indexOf(itemId) >= 0;
  }
  function accessible(item) {
    var p = Store.joueur();
    return !item.rank || (p && p.rangIdx >= item.rank);
  }
  /** Achete un objet. Renvoie {ok, msg} */
  function acheter(itemId) {
    var p = Store.joueur(), it = SHOP.get(itemId);
    if (!p || !it) return { ok: false, msg: 'Objet introuvable.' };
    if (possede(itemId)) return { ok: false, msg: 'Tu possedes deja cet objet.' };
    if (!accessible(it)) return { ok: false, msg: 'Rang ' + RANGS[it.rank].nom + ' requis.' };
    if (p.pieces < it.price) return { ok: false, msg: 'Il te manque ' + (it.price - p.pieces) + ' pieces.' };
    p.pieces -= it.price;
    p.inventaire.push(itemId);
    Store.sauver(true);
    return { ok: true, msg: it.name + ' achete !' };
  }
  /** Equipe un objet possede. */
  function equiper(itemId) {
    var p = Store.joueur(), it = SHOP.get(itemId);
    if (!p || !it || !possede(itemId)) return false;
    p.equipe[it.cat] = itemId;
    Store.sauver(true);
    return true;
  }

  global.Prog = {
    RANGS: RANGS, DERNIER: DERNIER, SUCCES: SUCCES,
    rangCourant: rangCourant, xpRequis: xpRequis, ajouterXp: ajouterXp, ajouterPieces: ajouterPieces,
    niveauPour: niveauPour, majCompetence: majCompetence, maitrise: maitrise, maitriseGlobale: maitriseGlobale,
    difficulteDe: difficulteDe, gainQuestion: gainQuestion,
    verifierSucces: verifierSucces, possede: possede, accessible: accessible, acheter: acheter, equiper: equiper
  };
})(window);
