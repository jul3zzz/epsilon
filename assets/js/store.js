/* =======================================================================
   store.js — comptes, sauvegarde locale et memoire de l eleve
   ======================================================================= */
(function (global) {
  'use strict';

  var CLE = 'epsilon.v1';
  var memoire = null;                // repli si localStorage est indisponible
  var dispo = (function () {
    try { localStorage.setItem('__t', '1'); localStorage.removeItem('__t'); return true; }
    catch (e) { return false; }
  })();

  function lire() {
    if (!dispo) return memoire || (memoire = { users: {}, dernier: null });
    try { return JSON.parse(localStorage.getItem(CLE)) || { users: {}, dernier: null }; }
    catch (e) { return { users: {}, dernier: null }; }
  }
  function ecrire(db) {
    if (!dispo) { memoire = db; return; }
    try { localStorage.setItem(CLE, JSON.stringify(db)); }
    catch (e) { console.warn('Sauvegarde impossible', e); }
  }

  var db = lire();
  var joueur = null;                 // joueur connecte

  /* ---------------- Modele de joueur ---------------- */
  function nouveauJoueur(pseudo, sel, hash, avatarId) {
    return {
      pseudo: pseudo,
      sel: sel,
      hash: hash,
      cree: Date.now(),
      pieces: 150,
      xp: 0,
      xpTotal: 0,
      rangIdx: 0,
      equipe: {
        banniere: 'ban-defaut', contour: 'con-defaut', fond: 'fond-defaut',
        avatar: avatarId || 'av-renard', titre: 'ti-debut', theme: 'theme-nuit', ecran: 'wp-aurore'
      },
      inventaire: SHOP.FREE.slice(),
      comp: {},                      // competences par theme (memoire adaptative)
      memoire: { erreurs: [], vues: {} },
      hist: [],
      stats: {
        parties: 0, ok: 0, ko: 0, temps: 0,
        meilleurSprint: 0, meilleurSurvie: 0, meilleureSerie: 0,
        serieJours: 0, dernierJour: null, joursJoues: 0
      },
      succes: [],
      params: { son: true }
    };
  }

  /** Complete un joueur charge depuis une ancienne sauvegarde. */
  function normaliser(p) {
    if (!p.equipe) p.equipe = {};
    Object.keys(SHOP.DEFAULTS).forEach(function (c) {
      if (!p.equipe[c] || !SHOP.get(p.equipe[c])) p.equipe[c] = SHOP.DEFAULTS[c];
    });
    if (!Array.isArray(p.inventaire)) p.inventaire = SHOP.FREE.slice();
    SHOP.FREE.forEach(function (id) { if (p.inventaire.indexOf(id) < 0) p.inventaire.push(id); });
    if (!p.comp) p.comp = {};
    if (!p.memoire) p.memoire = { erreurs: [], vues: {} };
    if (!p.memoire.erreurs) p.memoire.erreurs = [];
    if (!p.memoire.vues) p.memoire.vues = {};
    if (!Array.isArray(p.hist)) p.hist = [];
    if (!Array.isArray(p.succes)) p.succes = [];
    if (!Array.isArray(p.duelsRegles)) p.duelsRegles = [];  // duels amis deja regles (pieces attribuees)
    if (!p.params) p.params = { son: true };
    var s = p.stats = p.stats || {};
    ['parties', 'ok', 'ko', 'temps', 'meilleurSprint', 'meilleurSurvie', 'meilleureSerie', 'serieJours', 'joursJoues']
      .forEach(function (k) { if (typeof s[k] !== 'number') s[k] = 0; });
    if (typeof p.pieces !== 'number') p.pieces = 0;
    if (typeof p.xp !== 'number') p.xp = 0;
    if (typeof p.xpTotal !== 'number') p.xpTotal = p.xp;
    if (typeof p.rangIdx !== 'number') p.rangIdx = 0;
    // une fiche de competence par theme du programme
    Q.THEMES.forEach(function (t) {
      if (!p.comp[t.id]) p.comp[t.id] = { r: 1000, vus: 0, ok: 0, serie: 0, temps: 0, maj: 0, gens: {} };
      if (!p.comp[t.id].gens) p.comp[t.id].gens = {};
    });
    return p;
  }

  /* ---------------- Sauvegarde ---------------- */
  var tMaj = null;
  function sauver(immediat) {
    if (joueur) db.users[joueur.pseudo.toLowerCase()] = joueur;
    if (immediat) { ecrire(db); return; }
    clearTimeout(tMaj);
    tMaj = setTimeout(function () { ecrire(db); }, 250);
  }

  /* ---------------- Authentification ---------------- */
  function hacher(mdp, sel) { return U.sha256(sel + '|' + mdp + '|epsilon'); }

  var Store = {
    dispo: dispo,

    joueur: function () { return joueur; },
    pseudos: function () {
      return Object.keys(db.users).map(function (k) { return db.users[k].pseudo; }).sort();
    },
    dernier: function () { return db.dernier; },
    existe: function (pseudo) { return !!db.users[String(pseudo).toLowerCase()]; },

    /** Cree un compte. Renvoie {ok:bool, msg:string} */
    creer: function (pseudo, mdp, avatarId) {
      pseudo = String(pseudo || '').trim();
      if (pseudo.length < 3) return { ok: false, msg: 'Le pseudo doit faire au moins 3 caracteres.' };
      if (pseudo.length > 16) return { ok: false, msg: 'Le pseudo doit faire au plus 16 caracteres.' };
      if (!/^[\wÀ-ſ .-]+$/.test(pseudo)) return { ok: false, msg: 'Pseudo : lettres, chiffres, espace, - et _ uniquement.' };
      if (db.users[pseudo.toLowerCase()]) return { ok: false, msg: 'Ce pseudo est deja pris sur cet ordinateur.' };
      if (String(mdp || '').length < 4) return { ok: false, msg: 'Le mot de passe doit faire au moins 4 caracteres.' };

      var sel = U.uid();
      var p = nouveauJoueur(pseudo, sel, hacher(mdp, sel), avatarId);
      if (avatarId && p.inventaire.indexOf(avatarId) < 0) p.inventaire.push(avatarId);
      normaliser(p);
      db.users[pseudo.toLowerCase()] = p;
      db.dernier = pseudo;
      joueur = p;
      sauver(true);
      return { ok: true, msg: 'Compte cree.' };
    },

    /** Connexion. Renvoie {ok:bool, msg:string} */
    connecter: function (pseudo, mdp) {
      var p = db.users[String(pseudo || '').trim().toLowerCase()];
      if (!p) return { ok: false, msg: 'Aucun compte a ce pseudo sur cet ordinateur.' };
      if (hacher(mdp, p.sel) !== p.hash) return { ok: false, msg: 'Mot de passe incorrect.' };
      joueur = normaliser(p);
      db.dernier = p.pseudo;
      sauver(true);
      return { ok: true, msg: 'Bienvenue !' };
    },

    deconnecter: function () { sauver(true); joueur = null; },

    /** Change le mot de passe du joueur connecte. */
    changerMdp: function (nouveau) {
      if (!joueur || String(nouveau || '').length < 4) return false;
      joueur.sel = U.uid();
      joueur.hash = hacher(nouveau, joueur.sel);
      sauver(true);
      return true;
    },

    supprimer: function (pseudo) {
      delete db.users[String(pseudo).toLowerCase()];
      if (joueur && joueur.pseudo.toLowerCase() === String(pseudo).toLowerCase()) joueur = null;
      ecrire(db);
    },

    sauver: sauver,

    /* ---------------- Memoire de l eleve ---------------- */

    /** Enregistre une erreur pour la revoir plus tard. */
    noterErreur: function (q) {
      if (!joueur) return;
      var e = joueur.memoire.erreurs;
      // on evite d empiler 15 fois le meme exercice
      var deja = e.findIndex(function (x) { return x.q && x.q.gen === q.gen && x.q.prompt === q.prompt; });
      if (deja >= 0) e.splice(deja, 1);
      // on garde la question complete pour pouvoir la reproposer a l identique
      e.unshift({
        gen: q.gen, theme: q.theme, ts: Date.now(),
        q: { prompt: q.prompt, sub: q.sub, answer: q.answer, alt: q.alt, exact: q.exact, tol: q.tol,
             type: q.type, choices: q.choices, explain: q.explain, theme: q.theme, themeName: q.themeName,
             icon: q.icon, level: q.level, gen: q.gen }
      });
      if (e.length > 80) e.length = 80;
    },

    /** Retire une erreur de la liste quand elle est reussie en revision. */
    oublierErreur: function (gen, theme) {
      if (!joueur) return;
      var e = joueur.memoire.erreurs;
      var i = e.findIndex(function (x) { return x.gen === gen && (!theme || x.theme === theme); });
      if (i >= 0) e.splice(i, 1);
    },

    /** Themes les plus fragiles (ordre croissant de maitrise). */
    faiblesses: function (n) {
      if (!joueur) return [];
      var l = Q.THEMES.map(function (t) {
        var c = joueur.comp[t.id];
        return { theme: t, c: c, score: c.r - (c.vus < 4 ? 60 : 0) };
      });
      l.sort(function (a, b) { return a.score - b.score; });
      return l.slice(0, n || 3);
    },

    /** Themes les mieux maitrises. */
    forces: function (n) {
      if (!joueur) return [];
      var l = Q.THEMES.filter(function (t) { return joueur.comp[t.id].vus >= 3; })
        .map(function (t) { return { theme: t, c: joueur.comp[t.id] }; });
      l.sort(function (a, b) { return b.c.r - a.c.r; });
      return l.slice(0, n || 3);
    },

    /** Marque le passage du jour (serie de jours consecutifs). */
    pointerJour: function () {
      if (!joueur) return { nouveau: false, serie: joueur ? joueur.stats.serieJours : 0 };
      var s = joueur.stats, auj = U.dayKey();
      if (s.dernierJour === auj) return { nouveau: false, serie: s.serieJours };
      var ecart = s.dernierJour ? U.daysBetween(s.dernierJour, auj) : 999;
      s.serieJours = ecart === 1 ? s.serieJours + 1 : 1;
      s.dernierJour = auj;
      s.joursJoues = (s.joursJoues || 0) + 1;
      sauver();
      return { nouveau: true, serie: s.serieJours };
    }
  };

  global.Store = Store;
})(window);
