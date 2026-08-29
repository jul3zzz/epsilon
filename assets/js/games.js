/* =======================================================================
   games.js — les modes de jeu et le deroulement d une partie
   ======================================================================= */
(function (global) {
  'use strict';

  /* ------------------------------------------------------------------ */
  /* Les modes                                                           */
  /* ------------------------------------------------------------------ */
  var MODES = {
    sprint: {
      id: 'sprint', nom: 'Sprint 90 secondes', icon: '⚡',
      desc: 'Un maximum de bonnes reponses en 90 secondes. Tous les themes, niveau adapte a toi.',
      tag: '90 s', grad: 'linear-gradient(120deg,#ffc93c,#ff6b81)',
      duree: 90, questions: null, vies: null, tempsQuestion: null, correction: 'courte'
    },
    survie: {
      id: 'survie', nom: 'Survie', icon: '❤️',
      desc: '3 vies. Les questions deviennent de plus en plus difficiles. Jusqu ou vas-tu tenir ?',
      tag: '3 vies', grad: 'linear-gradient(120deg,#ff6b81,#c86bff)',
      duree: null, questions: null, vies: 3, tempsQuestion: null, correction: 'complete'
    },
    theme: {
      id: 'theme', nom: 'Entrainement par theme', icon: '🎯',
      desc: 'Choisis un chapitre du programme et travaille-le en 10 questions, sans chrono.',
      tag: '10 questions', grad: 'linear-gradient(120deg,#35d39a,#19c3d6)',
      duree: null, questions: 10, vies: null, tempsQuestion: null, correction: 'complete'
    },
    brevet: {
      id: 'brevet', nom: 'Defi Brevet', icon: '📜',
      desc: '20 questions couvrant tout le programme de 3e, comme une epreuve. Chronometre a 12 minutes.',
      tag: '20 questions', grad: 'linear-gradient(120deg,#6c7bff,#c86bff)',
      duree: 720, questions: 20, vies: null, tempsQuestion: null, correction: 'complete'
    },
    revision: {
      id: 'revision', nom: 'Revision ciblee', icon: '🧠',
      desc: 'Tes erreurs passees et tes chapitres les plus fragiles. Le mode qui fait progresser le plus.',
      tag: '12 questions', grad: 'linear-gradient(120deg,#19c3d6,#6c7bff)',
      duree: null, questions: 12, vies: null, tempsQuestion: null, correction: 'complete'
    },
    flash: {
      id: 'flash', nom: 'Calcul flash', icon: '💥',
      desc: 'Du calcul mental pur, 12 secondes par question. Ideal pour se chauffer.',
      tag: '12 s / question', grad: 'linear-gradient(120deg,#f038ff,#00f5d4)',
      duree: null, questions: 15, vies: null, tempsQuestion: 12, correction: 'courte'
    }
  };
  var ORDRE_MODES = ['sprint', 'flash', 'theme', 'revision', 'survie', 'brevet'];

  /* ------------------------------------------------------------------ */
  /* Une partie                                                          */
  /* ------------------------------------------------------------------ */
  function Partie(modeId, opts) {
    opts = opts || {};
    this.mode = MODES[modeId] || MODES.sprint;
    this.opts = opts;
    this.themeChoisi = opts.theme || null;

    this.index = 0;
    this.bonnes = 0;
    this.fausses = 0;
    this.combo = 0;
    this.meilleurCombo = 0;
    this.vies = this.mode.vies;
    this.xp = 0;
    this.pieces = 0;
    this.debut = Date.now();
    this.finPrevue = this.mode.duree ? this.debut + this.mode.duree * 1000 : null;
    this.termine = false;
    this.recents = [];              // generateurs recemment poses
    this.journal = [];              // trace de la partie (pour le recap)
    this.q = null;
    this.tQuestion = 0;
    this.fileRevision = [];

    if (modeId === 'revision') this.preparerRevision();
  }

  /** Construit la file du mode revision : erreurs passees + themes fragiles. */
  Partie.prototype.preparerRevision = function () {
    var p = Store.joueur();
    if (!p) return;
    var erreurs = p.memoire.erreurs.slice(0, 8);
    var faibles = Store.faiblesses(4).map(function (f) { return f.theme.id; });
    var file = [];
    erreurs.forEach(function (e) { if (e.q) file.push({ rejeu: true, q: e.q }); });
    // on complete avec des questions neuves sur les themes fragiles
    var manque = Math.max(0, (this.mode.questions || 12) - file.length);
    for (var i = 0; i < manque; i++) file.push({ rejeu: false, theme: faibles[i % faibles.length] });
    this.fileRevision = U.shuffle(file).slice(0, this.mode.questions || 12);
  };

  /** Choisit le theme de la prochaine question. */
  Partie.prototype.choisirTheme = function () {
    if (this.themeChoisi) return this.themeChoisi;
    if (this.mode.id === 'flash') return U.pick(['calcul', 'calcul', 'fraction', 'puissance', 'racine']);
    if (this.mode.id === 'brevet') {
      // on balaie tout le programme, sans repeter trop vite
      var vus = this.journal.slice(-4).map(function (j) { return j.theme; });
      var libres = Q.THEMES.filter(function (t) { return vus.indexOf(t.id) < 0; });
      return U.pick(libres.length ? libres : Q.THEMES).id;
    }
    // sprint / survie : ponderation vers les themes a travailler
    if (Math.random() < 0.45) {
      var f = Store.faiblesses(5);
      if (f.length) return U.pick(f).theme.id;
    }
    return U.pick(Q.THEMES).id;
  };

  /** Niveau de la prochaine question. */
  Partie.prototype.choisirNiveau = function (themeId) {
    var n = Prog.niveauPour(themeId);
    if (this.mode.id === 'survie') {
      // la difficulte monte avec le nombre de reussites
      var palier = 1 + Math.floor(this.bonnes / 4);
      n = U.clamp(Math.max(n, Math.min(palier, 5)), 1, 5);
    }
    if (this.mode.id === 'flash') n = U.clamp(n - 1, 1, 3);
    if (this.mode.id === 'brevet') n = U.clamp(n, 1, 5);
    return n;
  };

  /** Prepare la question suivante. Renvoie null si la partie doit s arreter. */
  Partie.prototype.suivante = function () {
    if (this.termine) return null;
    if (this.mode.questions && this.index >= this.mode.questions) return null;
    if (this.finPrevue && Date.now() >= this.finPrevue) return null;
    if (this.vies !== null && this.vies <= 0) return null;

    var q;
    if (this.mode.id === 'revision' && this.fileRevision.length) {
      var e = this.fileRevision.shift();
      if (e.rejeu && e.q) {
        q = JSON.parse(JSON.stringify(e.q));
        q.rejeu = true;
      } else {
        q = Q.generate(e.theme || this.choisirTheme(), Prog.niveauPour(e.theme || 'calcul'), this.recents);
      }
    } else {
      var t = this.choisirTheme();
      q = Q.generate(t, this.choisirNiveau(t), this.recents);
    }
    this.recents.push(q.gen);
    if (this.recents.length > 5) this.recents.shift();
    this.q = q;
    this.index++;
    this.tQuestion = Date.now();
    return q;
  };

  /**
   * Traite la reponse de l eleve.
   * @param saisie  chaine saisie, ou null si le temps est ecoule
   * @returns {correct, attendu, gains, combo, vies, explain}
   */
  Partie.prototype.repondre = function (saisie) {
    var q = this.q;
    if (!q) return null;
    var duree = Date.now() - this.tQuestion;
    var correct = saisie !== null && saisie !== undefined &&
      U.checkAnswer(saisie, q.answer, { exact: q.exact, tol: q.tol, alt: q.alt });

    // memoire adaptative : on ne fait pas evoluer le score sur un simple rejeu rate deux fois
    Prog.majCompetence(q.theme, q.level, correct, duree, q.gen);

    var gains = { xp: 0, pieces: 0 };
    if (correct) {
      this.bonnes++;
      this.combo++;
      this.meilleurCombo = Math.max(this.meilleurCombo, this.combo);
      gains = Prog.gainQuestion(q.level, this.combo);
      this.xp += gains.xp;
      this.pieces += gains.pieces;
      if (q.rejeu) Store.oublierErreur(q.gen, q.theme);
    } else {
      this.fausses++;
      this.combo = 0;
      if (this.vies !== null) this.vies--;
      Store.noterErreur(q);
    }

    this.journal.push({
      theme: q.theme, themeName: q.themeName, icon: q.icon, level: q.level,
      prompt: q.prompt, attendu: q.answer, donne: saisie, correct: correct,
      explain: q.explain, duree: duree
    });

    var p = Store.joueur();
    if (p) {
      p.stats[correct ? 'ok' : 'ko']++;
      p.stats.temps += duree;
      p.stats.meilleureSerie = Math.max(p.stats.meilleureSerie || 0, this.meilleurCombo);
    }

    return {
      correct: correct, attendu: q.answer, explain: q.explain,
      gains: gains, combo: this.combo, vies: this.vies, duree: duree
    };
  };

  /** Reste-t-il quelque chose a jouer ? */
  Partie.prototype.encore = function () {
    if (this.termine) return false;
    if (this.vies !== null && this.vies <= 0) return false;
    if (this.mode.questions && this.index >= this.mode.questions) return false;
    if (this.finPrevue && Date.now() >= this.finPrevue) return false;
    return true;
  };

  Partie.prototype.tempsRestant = function () {
    if (!this.finPrevue) return null;
    return Math.max(0, Math.round((this.finPrevue - Date.now()) / 1000));
  };

  /** Cloture la partie, distribue les recompenses et renvoie le bilan. */
  Partie.prototype.fin = function () {
    if (this.termine) return this.bilan;
    this.termine = true;
    var p = Store.joueur();
    var total = this.bonnes + this.fausses;
    var precision = total ? this.bonnes / total : 0;
    var duree = Math.round((Date.now() - this.debut) / 1000);

    // primes de fin de partie
    var bonusXp = 0, bonusPieces = 0, raisons = [];
    if (total >= 5 && precision >= 0.9) { bonusXp += Math.round(this.xp * 0.3); bonusPieces += 40; raisons.push('Precision excellente (+30 % XP)'); }
    else if (total >= 5 && precision >= 0.75) { bonusXp += Math.round(this.xp * 0.15); bonusPieces += 20; raisons.push('Bonne precision (+15 % XP)'); }
    if (this.meilleurCombo >= 10) { bonusPieces += 30; raisons.push('Serie de ' + this.meilleurCombo + ' (+30 pieces)'); }
    if (this.mode.id === 'brevet' && precision >= 0.8) { bonusXp += 120; bonusPieces += 80; raisons.push('Defi Brevet reussi (+120 XP)'); }

    var jour = Store.pointerJour();
    if (jour.nouveau) {
      var bj = 20 + Math.min(jour.serie, 10) * 10;
      bonusPieces += bj;
      raisons.push('1re partie du jour, serie de ' + jour.serie + ' jour' + (jour.serie > 1 ? 's' : '') + ' (+' + bj + ' pieces)');
    }

    var xpTotal = this.xp + bonusXp;
    var piecesTotal = this.pieces + bonusPieces;

    if (p) {
      p.stats.parties++;
      if (this.mode.id === 'sprint') p.stats.meilleurSprint = Math.max(p.stats.meilleurSprint, this.bonnes);
      if (this.mode.id === 'survie') p.stats.meilleurSurvie = Math.max(p.stats.meilleurSurvie, this.bonnes);
      p.hist.unshift({
        ts: Date.now(), mode: this.mode.id, modeNom: this.mode.nom, icon: this.mode.icon,
        score: this.bonnes, total: total, xp: xpTotal, pieces: piecesTotal,
        duree: duree, precision: Math.round(precision * 100), theme: this.themeChoisi || null
      });
      if (p.hist.length > 60) p.hist.length = 60;
      p.pieces += piecesTotal;
    }

    var montees = Prog.ajouterXp(xpTotal);
    var succes = Prog.verifierSucces();
    Store.sauver(true);

    this.bilan = {
      mode: this.mode, bonnes: this.bonnes, fausses: this.fausses, total: total,
      precision: Math.round(precision * 100), duree: duree,
      xp: xpTotal, pieces: piecesTotal, bonusXp: bonusXp, bonusPieces: bonusPieces,
      raisons: raisons, meilleurCombo: this.meilleurCombo, montees: montees, succes: succes,
      journal: this.journal
    };
    return this.bilan;
  };

  global.Jeu = { MODES: MODES, ORDRE_MODES: ORDRE_MODES, Partie: Partie };
})(window);
