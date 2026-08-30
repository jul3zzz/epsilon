/* =======================================================================
   ui.js — rendu de toutes les pages et deroulement visuel des parties
   ======================================================================= */
(function (global) {
  'use strict';
  var $ = U.$, $$ = U.$$, esc = U.esc;

  var V;                       // conteneur principal
  var page = 'accueil';
  var partie = null;           // partie en cours
  var quiz = null;             // etat de l ecran de jeu
  var chronos = [];            // minuteurs a nettoyer
  var catBoutique = 'banniere';
  var leconCourante = null;    // theme affiche sur la page lecon-detail
  var calc = { cur: '0', prev: null, op: null, reset: false };  // etat de la calculatrice
  var calcVisible = false;

  /* ---------- Systeme d amis / duels ---------- */
  var amisPretResolu = false, amisPretOk = false;
  var amisEtat = { amis: [], duels: [], arretAmis: null, arretDuels: null };
  var duelCourant = null;      // duel en cours de jeu : {id, doc, monRole, index, bonnes, repondu}

  function nettoyerChronos() { chronos.forEach(clearInterval); chronos.forEach(clearTimeout); chronos = []; }
  function minuteur(f, ms) { var id = setInterval(f, ms); chronos.push(id); return id; }
  function delai(f, ms) { var id = setTimeout(f, ms); chronos.push(id); return id; }

  /* ---------- Apercus de la boutique ---------- */
  var APERCU_THEME = {
    'theme-nuit': 'linear-gradient(120deg,#0e1020 40%,#6c7bff,#c86bff)',
    'theme-ocean': 'linear-gradient(120deg,#04202e 40%,#19c3d6,#3ee6a5)',
    'theme-foret': 'linear-gradient(120deg,#0d1c12 40%,#4ec96f,#c9e04b)',
    'theme-bonbon': 'linear-gradient(120deg,#2a0f2e 40%,#ff6ec7,#ffb46e)',
    'theme-retro': 'linear-gradient(120deg,#1b1408 40%,#ffa62b,#ff5f40)',
    'theme-neon': 'linear-gradient(120deg,#05060f 40%,#00f5d4,#f038ff)',
    'theme-clair': 'linear-gradient(120deg,#eef1fa 40%,#4356e0,#9c3cf0)',
    'theme-sakura': 'linear-gradient(120deg,#fff5f7 40%,#ff6fa5,#ffb6c9)',
    'theme-lavande': 'linear-gradient(120deg,#f3f0fb 40%,#8b6fef,#c58bf2)',
    'theme-mono': 'linear-gradient(120deg,#121212 40%,#e8e8e8,#9a9a9a)',
    'theme-cyberpunk': 'linear-gradient(120deg,#0a0014 40%,#ff00c8,#f9f002)',
    'theme-automne': 'linear-gradient(120deg,#241209 40%,#e2703a,#c4471f)',
    'theme-shonen': 'linear-gradient(120deg,#0d0d0d 40%,#e2001a,#ff5b6e)',
    'theme-dojo': 'linear-gradient(120deg,#1b140d 40%,#c9a227,#8b3a3a)'
  };
  var APERCU_WP = {
    'wp-aurore': 'radial-gradient(circle at 20% 20%,#6c7bff,transparent 60%),radial-gradient(circle at 80% 30%,#c86bff,transparent 60%),#12142a',
    'wp-uni': 'linear-gradient(160deg,#0e1020,#161a35)',
    'wp-grille': 'linear-gradient(transparent 0 11px,rgba(255,255,255,.25) 11px 12px),linear-gradient(90deg,transparent 0 11px,rgba(255,255,255,.25) 11px 12px),#161a35',
    'wp-vagues': 'repeating-radial-gradient(circle at 50% 130%,transparent 0 9px,rgba(108,123,255,.5) 9px 11px),#12142a',
    'wp-bulles': 'radial-gradient(circle at 25% 35%,#c86bff 0 16px,transparent 17px),radial-gradient(circle at 75% 65%,#6c7bff 0 22px,transparent 23px),#12142a',
    'wp-etoiles': 'radial-gradient(1.5px 1.5px at 20% 30%,#fff,transparent),radial-gradient(1.5px 1.5px at 70% 60%,#fff,transparent),radial-gradient(2px 2px at 45% 80%,#fff,transparent),linear-gradient(200deg,#0a0c1c,#1b1f3a)',
    'wp-maths': 'linear-gradient(160deg,#12142a,#22264a)',
    'wp-papier': 'linear-gradient(90deg,transparent 0 14px,#ff9aa2 14px 16px,transparent 16px),repeating-linear-gradient(0deg,#fdfcf5 0 9px,#cfe3f7 9px 10px)',
    'wp-coucher': 'linear-gradient(180deg,#2b1055,#7b2d8e 45%,#ff7b54 78%,#ffc93c)',
    'wp-espace': 'radial-gradient(circle at 70% 30%,rgba(255,120,220,.7),transparent 60%),radial-gradient(circle at 25% 70%,rgba(90,160,255,.6),transparent 60%),#05030f',
    'wp-matrix': 'repeating-linear-gradient(90deg,transparent 0 7px,rgba(53,211,154,.5) 7px 8px),#020806',
    'wp-arcenciel': 'linear-gradient(135deg,#ff6b81,#ffc93c,#35d39a,#19c3d6,#6c7bff,#c86bff)',
    'wp-neige': 'radial-gradient(2px 2px at 25% 30%,#fff,transparent),radial-gradient(2px 2px at 65% 60%,#fff,transparent),radial-gradient(2.5px 2.5px at 45% 80%,#fff,transparent),linear-gradient(200deg,#0d1b2a,#1b2f45)',
    'wp-desert': 'linear-gradient(200deg,rgba(255,200,120,.4),transparent 55%),linear-gradient(160deg,#3a2410,#7a4a1e 55%,#c9863f)',
    'wp-abysse': 'radial-gradient(circle at 30% 80%,rgba(80,200,220,.35) 0 18px,transparent 20px),radial-gradient(circle at 70% 40%,rgba(80,200,220,.25) 0 12px,transparent 14px),linear-gradient(180deg,#020a14,#0a3f5c)',
    'wp-confettis': 'radial-gradient(circle at 25% 30%,#ff6b81 0 4px,transparent 5px),radial-gradient(circle at 60% 60%,#ffc93c 0 3px,transparent 4px),radial-gradient(circle at 80% 25%,#35d39a 0 4px,transparent 5px),#12142a',
    'wp-circuit': 'repeating-linear-gradient(90deg,transparent 0 11px,rgba(53,211,154,.4) 11px 12px),repeating-linear-gradient(0deg,transparent 0 11px,rgba(53,211,154,.25) 11px 12px),#05080a',
    'wp-marbre': 'linear-gradient(125deg,transparent 40%,rgba(255,255,255,.3) 42% 44%,transparent 46%),linear-gradient(160deg,#1c1a22,#2e2a38)',
    'wp-vitesse': 'repeating-conic-gradient(from 0deg,rgba(255,255,255,.14) 0deg 2deg,transparent 2deg 10deg),#0d0d0d',
    'wp-petales': 'radial-gradient(3px 3px at 25% 30%,#ffb7d5,transparent),radial-gradient(3px 3px at 65% 60%,#ff8fb8,transparent),radial-gradient(3.5px 3.5px at 45% 80%,#ffb7d5,transparent),linear-gradient(200deg,#2a0f2e,#4a1f4e)'
  };

  /* ------------------------------------------------------------------ */
  /* Elements reutilisables                                              */
  /* ------------------------------------------------------------------ */
  /**
   * Valeur affichee pour une categorie : si l objet equipe est "personnalisable"
   * (emoji libre, titre libre, photo perso...), on renvoie ce que le joueur a
   * lui-meme choisi plutot que la valeur fixe de l objet.
   */
  function valAffichee(equipe, cat) {
    var it = SHOP.itemOf(equipe, cat);
    if (it && it.perso) {
      var p = Store.joueur();
      var v = p && p.perso && p.perso[cat];
      return v || it.val;
    }
    return SHOP.valOf(equipe, cat);
  }

  function avatarHTML(taille) {
    var p = Store.joueur();
    return '<span style="font-size:' + (taille || 22) + 'px">' + valAffichee(p.equipe, 'avatar') + '</span>';
  }
  /** Photo de profil entouree de son contour achete. */
  function ppHTML(taille) {
    var p = Store.joueur();
    var it = SHOP.itemOf(p.equipe, 'contour');
    return '<span class="pp-ring" style="background:' + it.val + '"' + (it.anim ? ' data-anim="1"' : '') + '>' +
      '<span class="pp" style="width:' + taille + 'px;height:' + taille + 'px;font-size:' + Math.round(taille * 0.5) + 'px">' +
      valAffichee(p.equipe, 'avatar') + '</span></span>';
  }
  function barre(pct, sm) {
    return '<div class="bar' + (sm ? ' sm' : '') + '"><i style="width:' + U.clamp(pct, 0, 100) + '%"></i></div>';
  }
  function statCard(val, lbl) {
    return '<div class="stat"><div class="stat-val">' + val + '</div><div class="stat-lbl">' + lbl + '</div></div>';
  }

  /* ------------------------------------------------------------------ */
  /* Barre du haut / apparence                                           */
  /* ------------------------------------------------------------------ */
  function appliquerApparence() {
    var p = Store.joueur();
    if (!p) return;
    document.body.setAttribute('data-theme', SHOP.valOf(p.equipe, 'theme'));
    document.body.setAttribute('data-wallpaper', SHOP.valOf(p.equipe, 'ecran'));
    var wp = $('#wallpaper');
    if (wp) {
      var ecranItem = SHOP.itemOf(p.equipe, 'ecran');
      if (ecranItem && ecranItem.perso && p.perso && p.perso.ecran) {
        wp.style.backgroundImage = 'url(' + p.perso.ecran + ')';
      } else {
        wp.style.backgroundImage = '';
      }
    }
  }

  function rafraichirBarre() {
    var p = Store.joueur();
    if (!p) return;
    var r = Prog.rangCourant();
    $('#chip-rank').innerHTML = '<span>' + r.icon + '</span>' + esc(r.nom);
    $('#chip-rank').style.color = r.couleur;
    $('#chip-coins').innerHTML = '<span>🪙</span>' + p.pieces;
    var s = p.stats.serieJours || 0;
    $('#chip-streak').innerHTML = '<span>🔥</span>' + s + ' j';
    $('#chip-streak').style.opacity = s > 0 ? 1 : .5;
    $('#topbar-avatar').innerHTML = valAffichee(p.equipe, 'avatar');
    $('#topbar-avatar').style.borderColor = r.couleur;
  }

  /* ------------------------------------------------------------------ */
  /* Notifications                                                       */
  /* ------------------------------------------------------------------ */
  function toast(msg, type, duree) {
    var d = document.createElement('div');
    d.className = 'toast ' + (type || '');
    d.innerHTML = msg;
    $('#toasts').appendChild(d);
    setTimeout(function () {
      d.style.transition = '.3s'; d.style.opacity = 0; d.style.transform = 'translateY(-10px)';
      setTimeout(function () { d.remove(); }, 320);
    }, duree || 2600);
  }

  function modale(html, onClose) {
    var m = $('#modal');
    $('#modal-box').innerHTML = html;
    m.classList.remove('hidden');
    m.onclick = function (e) {
      if (e.target === m || (e.target.dataset && e.target.dataset.close !== undefined)) {
        m.classList.add('hidden'); m.onclick = null; if (onClose) onClose();
      }
    };
  }

  /* ================================================================== */
  /* PAGE : ACCUEIL                                                      */
  /* ================================================================== */
  function pageAccueil() {
    var p = Store.joueur();
    var r = Prog.rangCourant();
    var req = Prog.xpRequis(p.rangIdx);
    var pct = p.rangIdx >= Prog.DERNIER ? 100 : Math.round(p.xp / req * 100);
    var total = p.stats.ok + p.stats.ko;
    var prec = total ? Math.round(p.stats.ok / total * 100) : 0;

    // conseil personnalise, base sur la memoire
    var conseil, modeConseille = 'sprint';
    if (p.stats.parties === 0) {
      conseil = 'Commence par un <b>Sprint</b> : le site va mesurer ton niveau et adapter les questions.';
    } else if (p.memoire.erreurs.length >= 5) {
      conseil = 'Tu as <b>' + p.memoire.erreurs.length + ' exercices rates</b> en memoire. La revision ciblee te les repropose.';
      modeConseille = 'revision';
    } else {
      var f = Store.faiblesses(1)[0];
      conseil = 'Ton chapitre le plus fragile est <b>' + esc(f.theme.name) + '</b> (' + Prog.maitrise(f.theme.id) + ' % de maitrise).';
      modeConseille = 'theme';
    }

    var faiblesses = Store.faiblesses(3);
    var forces = Store.forces(3);

    var h = '';
    h += '<div class="hero">' +
      '<div class="hero-avatar">' + valAffichee(p.equipe, 'avatar') + '</div>' +
      '<div class="hero-info">' +
        '<div class="hero-hello">Salut ' + esc(p.pseudo) + ' !</div>' +
        '<div class="hero-title-text">' + r.icon + ' ' + esc(r.nom) + ' · ' + esc(valAffichee(p.equipe, 'titre')) + '</div>' +
        '<div style="margin-top:10px">' + barre(pct) +
        '<div style="font-size:11px;color:var(--muted);margin-top:5px;font-weight:600">' +
          (p.rangIdx >= Prog.DERNIER ? 'Rang maximal atteint !' : p.xp + ' / ' + req + ' XP avant ' + esc(Prog.RANGS[p.rangIdx + 1].nom)) +
        '</div></div>' +
      '</div>' +
      '<div class="hero-cta">' +
        '<button class="btn btn-primary btn-lg" data-act="mode:' + modeConseille + '">▶ Jouer maintenant</button>' +
        '<button class="btn btn-lg" data-act="nav:jouer">Tous les modes</button>' +
      '</div></div>';

    h += '<div class="card" style="display:flex;gap:12px;align-items:flex-start;margin-bottom:20px">' +
      '<div style="font-size:22px">💡</div><div style="flex:1"><b>Conseil du jour</b><br>' +
      '<span style="color:var(--muted);font-size:14px">' + conseil + '</span></div></div>';

    h += '<div class="grid g4">' +
      statCard(p.stats.parties, 'parties jouees') +
      statCard(prec + ' %', 'de reussite') +
      statCard(Prog.maitriseGlobale() + ' %', 'du programme') +
      statCard(p.stats.serieJours + ' 🔥', 'jours d affilee') +
      '</div>';

    h += '<h3 class="section-title">🎮 Reprendre l entrainement</h3><div class="grid g3">';
    ['sprint', 'revision', 'theme'].forEach(function (id) {
      var m = Jeu.MODES[id];
      h += '<button class="mode" data-act="mode:' + id + '" style="--mode-grad:' + m.grad + '">' +
        '<span class="mode-icon">' + m.icon + '</span><span class="mode-name">' + esc(m.nom) + '</span>' +
        '<span class="mode-desc">' + esc(m.desc) + '</span><span class="mode-tag">' + esc(m.tag) + '</span></button>';
    });
    h += '</div>';

    h += '<div class="grid g2" style="margin-top:8px">';
    h += '<div><h3 class="section-title">🎯 A travailler <span class="pill">memoire</span></h3><div class="grid" style="gap:9px">';
    faiblesses.forEach(function (f) {
      h += themeRow(f.theme, 'play-theme:' + f.theme.id);
    });
    h += '</div></div>';
    h += '<div><h3 class="section-title">💪 Tes points forts</h3><div class="grid" style="gap:9px">';
    if (!forces.length) h += '<div class="card" style="font-size:13px;color:var(--muted)">Joue quelques parties pour voir apparaitre tes points forts.</div>';
    forces.forEach(function (f) { h += themeRow(f.theme, 'play-theme:' + f.theme.id); });
    h += '</div></div></div>';

    if (p.hist.length) {
      h += '<h3 class="section-title">🕐 Dernieres parties</h3><div class="grid" style="gap:8px">';
      p.hist.slice(0, 5).forEach(function (x) {
        h += '<div class="hist"><span class="hist-ico">' + x.icon + '</span><div class="hist-main">' +
          '<div class="hist-mode">' + esc(x.modeNom || x.mode) + '</div>' +
          '<div class="hist-date">' + U.relDate(x.ts) + ' · ' + x.precision + ' % · +' + x.xp + ' XP</div></div>' +
          '<div class="hist-score">' + x.score + '/' + x.total + '</div></div>';
      });
      h += '</div>';
    }
    return h;
  }

  function themeRow(t, act) {
    var m = Prog.maitrise(t.id);
    var p = Store.joueur();
    var c = p.comp[t.id];
    var niv = Prog.niveauPour(t.id, false);
    return '<div class="theme-row">' +
      '<button class="theme-row-play" data-act="' + act + '">' +
      '<span class="theme-ico">' + t.icon + '</span>' +
      '<span class="theme-body"><span class="theme-name">' + esc(t.name) + '</span>' +
      '<span class="theme-meta">' + m + ' % de maitrise · ' + c.vus + ' question' + (c.vus > 1 ? 's' : '') + '</span>' +
      '<span style="display:block;margin-top:6px">' + barre(m, true) + '</span></span>' +
      '<span class="theme-lvl">Niv. ' + niv + '</span></button>' +
      '<button class="theme-row-lesson" data-act="lecon:' + t.id + '" title="Voir la leçon">📖</button>' +
      '</div>';
  }

  /** Ligne utilisee sur le hub des lecons : priorite au cours, entrainement en raccourci. */
  function lessonRow(t) {
    var m = Prog.maitrise(t.id);
    return '<div class="theme-row">' +
      '<button class="theme-row-play" data-act="lecon:' + t.id + '">' +
      '<span class="theme-ico">' + t.icon + '</span>' +
      '<span class="theme-body"><span class="theme-name">' + esc(t.name) + '</span>' +
      '<span class="theme-meta">Cours, techniques de pro et pièges à éviter</span></span>' +
      '<span class="theme-lvl">' + m + ' %</span></button>' +
      '<button class="theme-row-lesson" data-act="play-theme:' + t.id + '" title="S\'entraîner">🎮</button>' +
      '</div>';
  }

  /* ================================================================== */
  /* PAGES : LEÇONS                                                      */
  /* ================================================================== */
  function pageLecons() {
    var h = '<h1 class="page-title">📖 Leçons</h1>' +
      '<p class="page-sub">Le cours, les techniques de pro et les pièges classiques, chapitre par chapitre — à lire avant de t\'entraîner.</p>';
    var doms = {};
    Q.THEMES.forEach(function (t) { (doms[t.dom] = doms[t.dom] || []).push(t); });
    Object.keys(doms).forEach(function (d) {
      h += '<div style="font-size:12px;font-weight:800;color:var(--muted);margin:22px 0 8px;text-transform:uppercase;letter-spacing:.5px">' + esc(d) + '</div>';
      h += '<div class="grid g2" style="gap:9px">';
      doms[d].forEach(function (t) { h += lessonRow(t); });
      h += '</div>';
    });
    return h;
  }

  function pageLeconDetail(themeId) {
    var t = Q.byId[themeId];
    if (!t) return '<p>Chapitre introuvable.</p><button class="btn" data-act="nav:lecons">← Toutes les leçons</button>';
    var d = (global.LECONS || {})[themeId];

    var h = '<button class="btn btn-sm" data-act="nav:lecons" style="margin-bottom:14px">← Toutes les leçons</button>';
    h += '<div class="lesson-hero">' +
      '<div class="lesson-icon">' + t.icon + '</div>' +
      '<div class="lesson-hero-body">' +
      '<div class="page-title" style="margin-bottom:4px">' + esc(t.name) + '</div>' +
      '<span class="q-theme">' + esc(t.dom) + '</span>' +
      (d ? '<p class="lesson-hook">' + d.accroche + '</p>' : '<p class="lesson-hook">La fiche de leçon pour ce chapitre arrive bientôt.</p>') +
      '<button class="btn btn-primary" data-act="play-theme:' + t.id + '">🎮 S\'entraîner sur ce chapitre</button>' +
      '</div></div>';

    if (!d) return h;

    if (d.vocabulaire && d.vocabulaire.length) {
      h += '<h3 class="section-title" style="margin-top:0">🔤 Vocabulaire a connaitre</h3><div class="lesson-vocab">' +
        d.vocabulaire.map(function (v) {
          return '<div class="lesson-vocab-item"><b>' + esc(v.mot) + '</b><span>' + v.def + '</span></div>';
        }).join('') + '</div>';
    }

    d.sections.forEach(function (s) {
      h += '<div class="lesson-section"><h3>📌 ' + esc(s.titre) + '</h3>' + s.html + '</div>';
    });

    if (d.exemples && d.exemples.length) {
      h += '<h3 class="section-title">✏️ Exemples resolus pas a pas</h3>';
      d.exemples.forEach(function (e) {
        h += '<div class="example-box"><h3>' + esc(e.titre) + '</h3>' +
          '<div class="example-enonce">' + e.enonce + '</div>' +
          '<ol class="example-etapes">' +
          e.etapes.map(function (et, i) { return '<li><span class="num">' + (i + 1) + '</span><span>' + et + '</span></li>'; }).join('') +
          '</ol>' +
          '<div class="example-reponse">✔ ' + e.reponse + '</div></div>';
      });
    }

    if (d.methode && d.methode.etapes && d.methode.etapes.length) {
      h += '<div class="method-box"><h3>🧭 ' + esc(d.methode.titre) + '</h3><ol>' +
        d.methode.etapes.map(function (et) { return '<li>' + et + '</li>'; }).join('') + '</ol></div>';
    }

    if (d.astuces && d.astuces.length) {
      h += '<div class="tip-panel"><h3>⭐ Techniques de pro</h3><ul>' +
        d.astuces.map(function (a) { return '<li>' + a + '</li>'; }).join('') + '</ul></div>';
    }
    if (d.pieges && d.pieges.length) {
      h += '<div class="pitfall-panel"><h3>⚠️ Pièges classiques</h3><ul>' +
        d.pieges.map(function (a) { return '<li>' + a + '</li>'; }).join('') + '</ul></div>';
    }
    if (d.recap) {
      h += '<div class="recap-box"><b>✅ À retenir en 30 secondes —</b> ' + d.recap + '</div>';
    }

    h += '<button class="btn btn-primary btn-lg btn-block" data-act="play-theme:' + t.id + '">🎮 S\'entraîner sur ' + esc(t.name) + '</button>';
    return h;
  }

  /** Ouvre la fiche de lecon d un chapitre (page parametree, hors table PAGES). */
  function voirLecon(themeId) {
    if (partie && !partie.termine && page === 'quiz') {
      if (partie.journal.length) partie.fin(); else partie.termine = true;
      partie = null;
    }
    nettoyerChronos();
    page = 'lecon-detail';
    leconCourante = themeId;
    V.innerHTML = pageLeconDetail(themeId);
    V.scrollTop = 0;
    window.scrollTo(0, 0);
    majNav();
    $('#nav').classList.remove('open');
  }

  /* ================================================================== */
  /* SYSTEME D AMIS ET DUELS (Firebase, hors apercu Claude)              */
  /* ================================================================== */

  /** Tente de rejoindre le service et de se reconnecter a l identifiant en ligne deja choisi. */
  function amisDemarrer() {
    if (!global.Amis) { amisPretResolu = true; amisPretOk = false; return; }
    Amis.pret().then(function (ok) {
      amisPretResolu = true;
      amisPretOk = ok;
      var p = Store.joueur();
      if (ok && p && p.amisId) {
        Amis.inscrire(p.amisPseudo || p.amisId, valAffichee(p.equipe, 'avatar')).then(function (r) {
          if (r.ok) amisDemarrerEcoutes();
          if (page === 'amis') V.innerHTML = pageAmis();
        });
      } else if (page === 'amis') {
        V.innerHTML = pageAmis();
      }
    });
  }

  function amisDemarrerEcoutes() {
    if (amisEtat.arretAmis) amisEtat.arretAmis();
    if (amisEtat.arretDuels) amisEtat.arretDuels();
    amisEtat.arretAmis = Amis.ecouterAmis(function (liste) {
      amisEtat.amis = liste;
      if (page === 'amis') V.innerHTML = pageAmis();
    });
    amisEtat.arretDuels = Amis.ecouterDuels(function (liste) {
      var avant = amisEtat.duels;
      amisEtat.duels = liste;
      amisSignalerNouveaux(avant, liste);
      amisAppliquerResultats(liste);
      if (page === 'amis') V.innerHTML = pageAmis();
    });
  }

  /** Petit toast quand un defi vient d arriver, pour que ca se remarque meme hors de la page Amis. */
  function amisSignalerNouveaux(avant, apres) {
    var monId = Amis.monId();
    var idsAvant = {}; avant.forEach(function (d) { idsAvant[d.id] = d; });
    apres.forEach(function (d) {
      if (d.to === monId && d.status === 'attente' && !idsAvant[d.id]) {
        toast('⚔️ ' + esc(d.fromPseudo || d.from) + ' te defie ! (' + d.mise + ' 🪙)', 'gold');
      }
    });
  }

  /** Applique une seule fois les gains/pertes de pieces des duels resolus depuis la derniere fois. */
  function amisAppliquerResultats(liste) {
    var p = Store.joueur();
    if (!p) return;
    if (!p.duelsRegles) p.duelsRegles = [];
    var monId = Amis.monId();
    var change = false;
    liste.forEach(function (d) {
      if (d.status !== 'termine' || p.duelsRegles.indexOf(d.id) >= 0) return;
      p.duelsRegles.push(d.id);
      change = true;
      var adversaire = d.from === monId ? (d.toPseudo || d.to) : (d.fromPseudo || d.from);
      if (d.winner === monId) {
        p.pieces += d.mise;
        toast('🏆 Duel gagne contre ' + esc(adversaire) + ' ! +' + d.mise + ' 🪙', 'gold');
      } else if (d.winner === 'egalite') {
        toast('🤝 Duel nul contre ' + esc(adversaire) + '. Mise remboursee.', 'good');
      } else {
        p.pieces = Math.max(0, p.pieces - d.mise);
        toast('💔 Duel perdu contre ' + esc(adversaire) + '... -' + d.mise + ' 🪙', 'bad');
      }
    });
    if (change) { Store.sauver(true); rafraichirBarre(); }
  }

  function pageAmis() {
    var p = Store.joueur();
    var h = '<h1 class="page-title">👥 Amis & Duels</h1>' +
      '<p class="page-sub">Ajoute des amis avec leur pseudo en ligne, defie-les sur le theme de ton choix, et parie des pieces sur le resultat.</p>';

    if (!global.Amis) return h + '<div class="card">Chargement du systeme d amis...</div>';
    if (!amisPretResolu) return h + '<div class="card">🔌 Connexion en cours...</div>';
    if (!amisPretOk) {
      return h + '<div class="card" style="text-align:center;padding:32px 20px">' +
        '<div style="font-size:34px">🚫</div>' +
        '<p style="margin-top:10px;font-weight:800">Le systeme d amis n est pas disponible ici.</p>' +
        '<p style="color:var(--muted);font-size:13px;max-width:44ch;margin:6px auto 0">Ca fonctionne sur GitHub Pages et en local (index.html), ' +
        'mais pas dans cet apercu — le bac a sable bloque les connexions vers l exterieur.</p></div>';
    }
    if (!p.amisId) return h + amisPageInscription();

    h += amisPageDuelsActifs();
    h += '<h3 class="section-title">👥 Tes amis <span class="pill">' + amisEtat.amis.length + '</span></h3>';
    if (!amisEtat.amis.length) {
      h += '<div class="card" style="color:var(--muted);font-size:13px">Pas encore d ami en ligne. Ajoute-en un juste en dessous !</div>';
    } else {
      h += '<div class="grid" style="gap:8px">' + amisEtat.amis.map(amisLigneAmi).join('') + '</div>';
    }
    h += '<h3 class="section-title">➕ Ajouter un ami</h3><div class="card">' +
      '<div class="answer-box"><input type="text" id="amis-recherche" autocomplete="off" placeholder="pseudo en ligne de ton ami">' +
      '<button class="btn btn-primary" data-act="amis-ajouter">Ajouter</button></div>' +
      '<p class="form-msg" id="amis-ajout-msg"></p>' +
      '<p style="font-size:12px;color:var(--muted);margin-top:6px">Ton pseudo en ligne : <b>' + esc(p.amisPseudo || p.amisId) + '</b> — donne-le a tes amis pour qu ils t ajoutent.</p></div>';
    h += amisPageHistorique();
    return h;
  }

  function amisPageInscription() {
    var p = Store.joueur();
    return '<div class="card" style="max-width:440px">' +
      '<h3 style="margin-bottom:6px">Choisis ton pseudo en ligne</h3>' +
      '<p style="color:var(--muted);font-size:13px;margin-bottom:14px">Tes amis te retrouveront grace a ce pseudo. Il peut etre different de ton pseudo local, et doit etre unique parmi tous les joueurs.</p>' +
      '<label class="field"><span>Pseudo en ligne</span><input type="text" id="amis-pseudo" maxlength="18" value="' + esc(p.pseudo) + '" autocomplete="off"></label>' +
      '<p class="form-msg" id="amis-msg"></p>' +
      '<button class="btn btn-primary btn-block" data-act="amis-inscrire" style="margin-top:8px">C est parti !</button></div>';
  }

  function amisLigneAmi(a) {
    return '<div class="hist"><span class="hist-ico">' + (a.avatar || '🙂') + '</span>' +
      '<div class="hist-main"><div class="hist-mode">' + esc(a.pseudo || a.id) + '</div>' +
      '<div class="hist-date">🪙 ' + (a.pieces != null ? a.pieces : '?') + '</div></div>' +
      '<button class="btn btn-sm btn-primary" data-act="duel-proposer:' + a.id + '">⚔️ Defier</button></div>';
  }

  function amisPageDuelsActifs() {
    var monId = Amis.monId();
    var actifs = amisEtat.duels.filter(function (d) { return d.status === 'attente' || d.status === 'encours'; });
    if (!actifs.length) return '';
    var h = '<h3 class="section-title">⚔️ Duels en cours <span class="pill">' + actifs.length + '</span></h3><div class="grid" style="gap:9px">';
    actifs.forEach(function (d) {
      var monRole = d.from === monId ? 'from' : 'to';
      var adversaire = monRole === 'from' ? (d.toPseudo || d.to) : (d.fromPseudo || d.from);
      var theme = Amis.THEMES_DUEL.filter(function (t) { return t.id === d.theme; })[0] || { icon: '🎲', name: d.theme };
      h += '<div class="card" style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">' +
        '<div style="flex:1;min-width:180px"><b>' + theme.icon + ' ' + esc(theme.name) + '</b>' +
        '<div style="color:var(--muted);font-size:13px;margin-top:3px">contre ' + esc(adversaire) + ' · mise ' + d.mise + ' 🪙 · ' + d.nbQuestions + ' questions</div></div>';
      if (d.status === 'attente' && monRole === 'to') {
        h += '<button class="btn btn-sm btn-primary" data-act="duel-accepter:' + d.id + '">✅ Accepter</button>' +
          '<button class="btn btn-sm" data-act="duel-refuser:' + d.id + '">❌ Refuser</button>';
      } else if (d.status === 'attente' && monRole === 'from') {
        h += '<span class="chip">⏳ en attente de reponse</span>' +
          '<button class="btn btn-sm" data-act="duel-annuler:' + d.id + '">Annuler</button>';
      } else if (d.status === 'encours') {
        var fini = monRole === 'from' ? d.finishedFrom : d.finishedTo;
        h += fini ? '<span class="chip">⏳ en attente de ' + esc(adversaire) + '</span>'
                  : '<button class="btn btn-sm btn-primary" data-act="duel-jouer:' + d.id + '">🎮 Jouer</button>';
      }
      h += '</div>';
    });
    return h + '</div>';
  }

  function amisPageHistorique() {
    var monId = Amis.monId();
    var termines = amisEtat.duels.filter(function (d) { return d.status === 'termine'; }).slice(0, 12);
    if (!termines.length) return '';
    var h = '<h3 class="section-title">🏁 Duels termines</h3><div class="grid" style="gap:8px">';
    termines.forEach(function (d) {
      var monRole = d.from === monId ? 'from' : 'to';
      var monScore = monRole === 'from' ? d.scoreFrom : d.scoreTo;
      var scoreAdv = monRole === 'from' ? d.scoreTo : d.scoreFrom;
      var adversaire = monRole === 'from' ? (d.toPseudo || d.to) : (d.fromPseudo || d.from);
      var gagne = d.winner === monId, egalite = d.winner === 'egalite';
      h += '<div class="hist"><span class="hist-ico">' + (gagne ? '🏆' : egalite ? '🤝' : '💔') + '</span>' +
        '<div class="hist-main"><div class="hist-mode">contre ' + esc(adversaire) + '</div>' +
        '<div class="hist-date">' + monScore + ' - ' + scoreAdv + ' points</div></div>' +
        '<div class="hist-score" style="color:' + (gagne ? 'var(--good)' : egalite ? 'var(--muted)' : 'var(--bad)') + '">' +
        (egalite ? '±0' : gagne ? '+' + d.mise : '-' + d.mise) + ' 🪙</div></div>';
    });
    return h + '</div>';
  }

  /* ---------- Deroulement d un duel ---------- */
  function jouerDuel(duelId) {
    var d = amisEtat.duels.filter(function (x) { return x.id === duelId; })[0];
    if (!d || !d.questions || !d.questions.length) { toast('Duel introuvable.', 'bad'); return; }
    duelCourant = { id: duelId, doc: d, monRole: d.from === Amis.monId() ? 'from' : 'to', index: 0, bonnes: 0, repondu: false };
    nettoyerChronos();
    page = 'duel';
    majNav();
    duelDessinerQuestion();
  }

  function duelDessinerQuestion() {
    var qs = duelCourant.doc.questions;
    var i = duelCourant.index;
    if (i >= qs.length) return duelFin();
    var q = qs[i];
    duelCourant.repondu = false;

    var h = '<div class="quiz-wrap"><div class="quiz-head">' +
      '<span class="chip">⚔️ Duel</span><span class="chip">Question ' + (i + 1) + ' / ' + qs.length + '</span>' +
      '<span class="chip">✅ ' + duelCourant.bonnes + '</span>' +
      '<button class="btn btn-sm" data-act="duel-quitter">Arreter</button></div>';

    h += '<div class="qcard"><div class="q-topline"><span class="q-theme">' + q.icon + ' ' + esc(q.themeName) + '</span>' +
      '<span class="q-diff">Niveau ' + q.level + '</span></div>';
    h += '<div class="q-text">' + q.prompt + '</div>';
    if (q.sub) h += '<div class="q-sub">' + q.sub + '</div>';

    if (q.type === 'qcm') {
      h += '<div class="choices" id="zone-rep">' +
        q.choices.map(function (c, idx) { return '<button class="choice" data-act="duel-choix:' + idx + '">' + c + '</button>'; }).join('') +
        '</div>';
    } else {
      h += '<div class="answer-box"><input id="rep" type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="ta reponse">' +
        '<button class="btn btn-primary" data-act="duel-valider">OK</button></div>';
      h += '<div class="keypad">' +
        ['7', '8', '9', '/', '⌫', '4', '5', '6', '-', ',', '1', '2', '3', '0', '√', '×', '²', '(', ')']
          .map(function (k) { return '<button data-act="duel-touche:' + k + '">' + k + '</button>'; }).join('') + '</div>';
    }
    h += '<div id="zone-feedback"></div></div></div>';
    V.innerHTML = h;
    var inp = $('#rep');
    if (inp) { inp.focus(); inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); duelValider(); } }); }
  }

  function duelValider() {
    var inp = $('#rep');
    if (!inp || !inp.value.trim()) { if (inp) inp.focus(); return; }
    duelTraiterReponse(inp.value);
  }

  function duelTraiterReponse(saisie) {
    if (duelCourant.repondu) return;
    duelCourant.repondu = true;
    var q = duelCourant.doc.questions[duelCourant.index];
    var correct = saisie !== null && U.checkAnswer(saisie, q.answer, { exact: q.exact, tol: q.tol, alt: q.alt });

    if (q.type === 'qcm') {
      $$('#zone-rep .choice').forEach(function (b) {
        b.disabled = true;
        if (b.textContent === q.answer) b.classList.add('good');
        else if (b.textContent === String(saisie)) b.classList.add('bad');
      });
    } else {
      var inp = $('#rep');
      if (inp) { inp.classList.add(correct ? 'good' : 'bad'); inp.blur(); }
    }
    if (correct) duelCourant.bonnes++;

    var suite = duelCourant.index + 1 < duelCourant.doc.questions.length;
    $('#zone-feedback').innerHTML =
      '<div class="feedback ' + (correct ? 'good' : 'bad') + '"><b>' + (correct ? '✅ Bravo !' : '❌ Rate') + '</b>' +
      (correct ? '' : ' — la reponse etait <b>' + esc(q.answer) + '</b>') +
      '<span class="sol">' + (q.explain || '') + '</span></div>' +
      '<button class="btn btn-primary btn-block" data-act="duel-suivant" style="margin-top:12px">' +
      (suite ? 'Question suivante →' : 'Terminer →') + '</button>';
  }

  function duelSuivant() { duelCourant.index++; duelDessinerQuestion(); }

  function duelFin() {
    var d = duelCourant.doc, bonnes = duelCourant.bonnes, total = d.questions.length;
    Amis.soumettreScore(duelCourant.id, duelCourant.monRole, bonnes).then(function (r) {
      if (!r.ok) toast(r.msg, 'bad');
      duelCourant = null;
      page = 'amis';
      majNav();
      V.innerHTML = '<div class="quiz-wrap"><div class="result-hero"><div class="result-emoji">⚔️</div>' +
        '<div class="result-score">' + bonnes + ' / ' + total + '</div>' +
        '<p style="color:var(--muted)">Score envoye ! Le resultat final s affiche des que ton adversaire a fini.</p></div>' +
        '<button class="btn btn-primary btn-block" data-act="nav:amis">Retour aux amis</button></div>';
    });
  }

  /* ================================================================== */
  /* PAGE : JOUER                                                        */
  /* ================================================================== */
  function pageJouer() {
    var h = '<h1 class="page-title">Choisis ton mode</h1>' +
      '<p class="page-sub">La difficulte s ajuste automatiquement a ton niveau, chapitre par chapitre.</p>' +
      '<div class="grid g2">';
    Jeu.ORDRE_MODES.forEach(function (id) {
      var m = Jeu.MODES[id];
      h += '<button class="mode" data-act="mode:' + id + '" style="--mode-grad:' + m.grad + '">' +
        '<span class="mode-icon">' + m.icon + '</span><span class="mode-name">' + esc(m.nom) + '</span>' +
        '<span class="mode-desc">' + esc(m.desc) + '</span><span class="mode-tag">' + esc(m.tag) + '</span></button>';
    });
    h += '</div>';
    h += '<h3 class="section-title">📚 Ou choisis un chapitre precis</h3><div class="grid g2" style="gap:9px">';
    Q.THEMES.forEach(function (t) { h += themeRow(t, 'play-theme:' + t.id); });
    h += '</div>';
    return h;
  }

  function pageChoixTheme() {
    var h = '<button class="btn btn-sm" data-act="nav:jouer" style="margin-bottom:14px">← Retour</button>' +
      '<h1 class="page-title">Entrainement par theme</h1>' +
      '<p class="page-sub">10 questions sur le chapitre de ton choix, a ton niveau.</p><div class="grid g2" style="gap:9px">';
    Q.THEMES.forEach(function (t) { h += themeRow(t, 'play-theme:' + t.id); });
    h += '</div>';
    return h;
  }

  /* ================================================================== */
  /* ECRAN DE JEU                                                        */
  /* ================================================================== */
  function lancerPartie(modeId, opts) {
    partie = new Jeu.Partie(modeId, opts);
    quiz = { repondu: false, verrou: false };
    page = 'quiz';
    calcReinit();
    calcVisible = false;
    majNav();
    questionSuivante();
  }

  function questionSuivante() {
    nettoyerChronos();
    if (!partie.encore()) return finPartie();
    var q = partie.suivante();
    if (!q) return finPartie();
    quiz.repondu = false;
    quiz.verrou = false;
    quiz.tempsQuestion = partie.mode.tempsQuestion;
    quiz.debutQ = Date.now();
    dessinerQuestion(q);
    lancerChronos();
  }

  /* ---------- Calculatrice (autorisee hors calcul mental pur) ---------- */

  /** La calculatrice est masquee en Calcul flash et sur le theme Calcul mental : la ca doit rester du calcul a la main. */
  function calcEligible(q) {
    return !!q && q.theme !== 'calcul' && !(partie && partie.mode && partie.mode.id === 'flash');
  }

  function calcReinit() { calc = { cur: '0', prev: null, op: null, reset: false }; }

  function calcAppliquer() {
    if (calc.prev === null || calc.op === null) return;
    var a = parseFloat(calc.prev), b = parseFloat(calc.cur), r;
    if (calc.op === '+') r = a + b;
    else if (calc.op === '−') r = a - b;
    else if (calc.op === '×') r = a * b;
    else r = b === 0 ? NaN : a / b;
    calc.cur = isNaN(r) || !isFinite(r) ? 'Erreur' : String(U.round(r, 9));
    calc.prev = null; calc.op = null;
  }

  function majCalcAffichage() {
    var d = $('#calc-display');
    if (d) d.textContent = calc.cur.replace('.', ',');
    var o = $('#calc-op-indic');
    if (o) o.textContent = calc.op ? (String(calc.prev).replace('.', ',') + ' ' + calc.op) : ' ';
  }

  function calcDigit(k) {
    if (k === ',') k = '.';
    if (calc.cur === 'Erreur' || calc.reset) { calc.cur = k === '.' ? '0.' : k; calc.reset = false; majCalcAffichage(); return; }
    if (k === '.' && calc.cur.indexOf('.') >= 0) return;
    calc.cur = calc.cur === '0' && k !== '.' ? k : calc.cur + k;
    majCalcAffichage();
  }
  function calcOp(o) {
    if (calc.cur === 'Erreur') return;
    if (calc.prev !== null && !calc.reset) calcAppliquer();
    else calc.prev = calc.cur;
    calc.op = o;
    calc.reset = true;
    majCalcAffichage();
  }
  function calcEgal() { if (calc.cur === 'Erreur') return; calcAppliquer(); calc.reset = true; majCalcAffichage(); }
  function calcClear() { calcReinit(); majCalcAffichage(); }
  function calcBack() {
    if (calc.cur === 'Erreur' || calc.reset) calc.cur = '0';
    else calc.cur = calc.cur.length > 1 ? calc.cur.slice(0, -1) : '0';
    majCalcAffichage();
  }
  function calcPourcent() { if (calc.cur === 'Erreur') return; calc.cur = String(U.round(parseFloat(calc.cur) / 100, 9)); calc.reset = true; majCalcAffichage(); }
  function calcRacine() {
    if (calc.cur === 'Erreur') return;
    var v = parseFloat(calc.cur);
    calc.cur = v < 0 ? 'Erreur' : String(U.round(Math.sqrt(v), 9));
    calc.reset = true; majCalcAffichage();
  }
  function calcCarre() { if (calc.cur === 'Erreur') return; var v = parseFloat(calc.cur); calc.cur = String(U.round(v * v, 9)); calc.reset = true; majCalcAffichage(); }
  function calcSigne() {
    if (calc.cur === '0' || calc.cur === 'Erreur') return;
    calc.cur = calc.cur.charAt(0) === '-' ? calc.cur.slice(1) : '-' + calc.cur;
    majCalcAffichage();
  }

  function calcPanelHTML() {
    var keys = [
      { k: 'C', act: 'calc-clear' }, { k: '⌫', act: 'calc-back' }, { k: '√', act: 'calc-sqrt' }, { k: 'x²', act: 'calc-square' },
      { k: '7', act: 'calc-digit:7' }, { k: '8', act: 'calc-digit:8' }, { k: '9', act: 'calc-digit:9' }, { k: '÷', act: 'calc-op:÷', op: true },
      { k: '4', act: 'calc-digit:4' }, { k: '5', act: 'calc-digit:5' }, { k: '6', act: 'calc-digit:6' }, { k: '×', act: 'calc-op:×', op: true },
      { k: '1', act: 'calc-digit:1' }, { k: '2', act: 'calc-digit:2' }, { k: '3', act: 'calc-digit:3' }, { k: '−', act: 'calc-op:−', op: true },
      { k: '±', act: 'calc-sign' }, { k: '0', act: 'calc-digit:0' }, { k: ',', act: 'calc-digit:,' }, { k: '+', act: 'calc-op:+', op: true }
    ];
    var grid = keys.map(function (b) {
      return '<button class="calc-btn' + (b.op ? ' calc-btn-op' : '') + '" data-act="' + b.act + '">' + b.k + '</button>';
    }).join('') + '<button class="calc-btn calc-btn-eq" data-act="calc-eq">=</button>';

    return '<div class="calc-panel' + (calcVisible ? '' : ' hidden') + '" id="calc-panel">' +
      '<div class="calc-head">🧮 Calculatrice<button class="calc-close" data-act="calc-toggle" title="Fermer">✕</button></div>' +
      '<div class="calc-screen"><div class="calc-op-indic" id="calc-op-indic">' + (calc.op ? esc(String(calc.prev).replace('.', ',') + ' ' + calc.op) : ' ') + '</div>' +
      '<div class="calc-display" id="calc-display">' + esc(calc.cur.replace('.', ',')) + '</div></div>' +
      '<div class="calc-grid">' + grid + '</div></div>';
  }

  function dessinerQuestion(q) {
    var m = partie.mode;
    var calcOk = calcEligible(q);
    var h = '<div class="quiz-wrap">';

    /* --- entete --- */
    h += '<div class="quiz-head">';
    h += '<span class="chip">' + m.icon + ' ' + esc(m.nom) + '</span>';
    if (m.questions) h += '<span class="chip">Question ' + partie.index + ' / ' + m.questions + '</span>';
    else h += '<span class="chip">Question ' + partie.index + '</span>';
    if (m.vies !== null) h += '<span class="lives">' + new Array(partie.vies + 1).join('❤️') +
      new Array(m.vies - partie.vies + 1).join('🖤') + '</span>';
    h += '<span class="chip">✅ ' + partie.bonnes + '</span>';
    if (partie.combo >= 3) h += '<span class="chip" style="color:var(--warn)">🔥 ' + partie.combo + '</span>';
    if (calcOk) h += '<button class="btn btn-sm calc-toggle-btn" data-act="calc-toggle" title="Calculatrice">🧮</button>';
    h += '<button class="btn btn-sm" data-act="quitter">Arreter</button>';
    h += '</div>';

    /* --- chrono --- */
    if (m.duree || m.tempsQuestion) {
      h += '<div class="timer-bar" id="tbar"><i style="width:100%"></i></div>';
    }

    /* --- carte question --- */
    h += '<div class="qcard">';
    h += '<div class="q-topline"><span class="q-theme">' + q.icon + ' ' + esc(q.themeName) + '</span>' +
      '<span class="q-diff">Niveau ' + q.level + '</span>' +
      (calcOk ? '' : '<span class="q-theme calc-off">🧠 sans calculatrice</span>') +
      (q.rejeu ? '<span class="q-theme">🔁 deja ratee</span>' : '') +
      '<span id="chrono-txt" style="margin-left:auto;font-size:12px;font-weight:800;color:var(--muted)"></span></div>';
    h += '<div class="q-text">' + q.prompt + '</div>';
    if (q.sub) h += '<div class="q-sub">' + q.sub + '</div>';

    if (q.type === 'qcm') {
      h += '<div class="choices" id="zone-rep">';
      q.choices.forEach(function (c, i) {
        h += '<button class="choice" data-act="choix:' + i + '">' + c + '</button>';
      });
      h += '</div>';
    } else {
      h += '<div class="answer-box"><input id="rep" type="text" autocomplete="off" autocapitalize="off" ' +
        'autocorrect="off" spellcheck="false" placeholder="ta reponse">' +
        '<button class="btn btn-primary" data-act="valider">OK</button></div>';
      h += '<div class="answer-hint">Tu peux taper directement le calcul, par exemple 9²+40² ou (5+3)×2.</div>';
      h += '<div class="keypad">' +
        ['7', '8', '9', '/', '⌫', '4', '5', '6', '-', ',', '1', '2', '3', '0', '√', '×', '²', '(', ')']
          .map(function (k) { return '<button data-act="touche:' + k + '">' + k + '</button>'; }).join('') +
        '</div>';
    }
    h += '<div id="zone-feedback"></div>';
    h += '</div></div>';
    if (calcOk) h += calcPanelHTML();

    V.innerHTML = h;
    var inp = $('#rep');
    if (inp) {
      inp.focus();
      inp.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); valider(); }
      });
    }
  }

  function lancerChronos() {
    var m = partie.mode;
    if (!m.duree && !m.tempsQuestion) return;
    minuteur(function () {
      if (quiz.repondu && m.tempsQuestion) return;
      var pct, txt;
      if (m.tempsQuestion) {
        var reste = m.tempsQuestion - (Date.now() - quiz.debutQ) / 1000;
        pct = reste / m.tempsQuestion * 100;
        txt = Math.max(0, Math.ceil(reste)) + ' s';
        if (reste <= 0 && !quiz.repondu) { traiterReponse(null); return; }
      } else {
        var r = partie.tempsRestant();
        pct = r / m.duree * 100;
        txt = U.mmss(r);
        if (r <= 0) { finPartie(); return; }
      }
      var bar = $('#tbar');
      if (bar) {
        bar.firstChild.style.width = U.clamp(pct, 0, 100) + '%';
        bar.classList.toggle('danger', pct < 30);
      }
      var t = $('#chrono-txt');
      if (t) t.textContent = txt;
    }, 200);
  }

  function valider() {
    if (quiz.repondu || quiz.verrou) return;
    var inp = $('#rep');
    if (!inp) return;
    if (!inp.value.trim()) { inp.focus(); return; }
    traiterReponse(inp.value);
  }

  function traiterReponse(saisie) {
    if (quiz.repondu) return;
    quiz.repondu = true;
    var q = partie.q;
    var res = partie.repondre(saisie);

    /* --- retour visuel --- */
    if (q.type === 'qcm') {
      $$('#zone-rep .choice').forEach(function (b) {
        b.disabled = true;
        if (b.textContent === q.answer) b.classList.add('good');
        else if (saisie !== null && b.textContent === String(saisie)) b.classList.add('bad');
      });
    } else {
      var inp = $('#rep');
      if (inp) { inp.classList.add(res.correct ? 'good' : 'bad'); inp.blur(); }
    }

    var fb = $('#zone-feedback');
    var html = '<div class="feedback ' + (res.correct ? 'good' : 'bad') + '">';
    if (res.correct) {
      html += '<b>✅ Bravo !</b> +' + res.gains.xp + ' XP · +' + res.gains.pieces + ' 🪙';
      if (res.combo >= 3) html += ' · serie de ' + res.combo + ' 🔥';
      jouerEffet();
    } else {
      html += '<b>' + (saisie === null ? '⏱️ Temps ecoule' : '❌ Raté') + '</b> — la reponse etait <b>' + esc(q.answer) + '</b>';
    }
    if (!res.correct || partie.mode.correction === 'complete') {
      html += '<span class="sol">' + (q.explain || '') + '</span>';
    }
    html += '</div>';
    if (partie.mode.correction === 'complete' || !res.correct) {
      html += '<button class="btn btn-primary btn-block" data-act="suivant" style="margin-top:12px">' +
        (partie.encore() ? 'Question suivante →' : 'Voir mon resultat →') + '</button>';
    }
    fb.innerHTML = html;
    fb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    if (partie.combo >= 5 && res.correct) montrerCombo(partie.combo);

    // enchainement automatique dans les modes rapides
    if (partie.mode.correction === 'courte' && res.correct) {
      delai(questionSuivante, 750);
    }
    majNav();
  }

  function montrerCombo(n) {
    var d = document.createElement('div');
    d.className = 'combo';
    d.textContent = '🔥 Serie de ' + n + ' !';
    document.body.appendChild(d);
    setTimeout(function () { d.style.transition = '.3s'; d.style.opacity = 0; setTimeout(function () { d.remove(); }, 320); }, 900);
  }

  /** Fait pleuvoir de petites particules (l effet de reponse equipe en boutique). */
  function jouerEffet() {
    var p = Store.joueur();
    if (!p) return;
    var it = SHOP.itemOf(p.equipe, 'effet');
    if (!it || !it.val) return;
    var emojis = it.val.split(' ');
    var n = 14;
    for (var i = 0; i < n; i++) {
      var s = document.createElement('span');
      s.className = 'fx-particle';
      s.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      s.style.left = (30 + Math.random() * 40) + 'vw';
      s.style.setProperty('--dx', Math.round(Math.random() * 220 - 110) + 'px');
      s.style.setProperty('--dur', (0.9 + Math.random() * 0.6).toFixed(2) + 's');
      s.style.fontSize = (16 + Math.random() * 16) + 'px';
      document.body.appendChild(s);
      (function (el) { setTimeout(function () { el.remove(); }, 1700); })(s);
    }
  }

  /* ---------- Fin de partie ---------- */
  function finPartie() {
    nettoyerChronos();
    var b = partie.fin();
    page = 'resultat';
    rafraichirBarre();
    appliquerApparence();

    var emoji = b.precision >= 90 ? '🏆' : b.precision >= 70 ? '🎉' : b.precision >= 50 ? '💪' : '📚';
    var mot = b.precision >= 90 ? 'Excellent !' : b.precision >= 70 ? 'Bien joue !' : b.precision >= 50 ? 'Continue comme ca !' : 'On progresse en s entrainant !';

    var h = '<div class="quiz-wrap">';
    h += '<div class="result-hero"><div class="result-emoji">' + emoji + '</div>' +
      '<div class="result-score">' + b.bonnes + ' / ' + b.total + '</div>' +
      '<div style="color:var(--muted);font-weight:700">' + mot + ' · ' + b.precision + ' % de reussite · ' + U.mmss(b.duree) + '</div>' +
      '<div class="reward-row"><span class="reward">+' + b.xp + ' XP</span><span class="reward">+' + b.pieces + ' 🪙</span>' +
      (b.meilleurCombo >= 3 ? '<span class="reward">🔥 serie de ' + b.meilleurCombo + '</span>' : '') + '</div></div>';

    if (b.raisons.length) {
      h += '<div class="card" style="margin-bottom:16px"><b style="font-size:14px">Bonus obtenus</b><ul style="margin:8px 0 0;padding-left:20px;color:var(--muted);font-size:13px;line-height:1.7">' +
        b.raisons.map(function (r) { return '<li>' + esc(r) + '</li>'; }).join('') + '</ul></div>';
    }

    // progression des chapitres travailles
    var themes = {};
    b.journal.forEach(function (j) {
      if (!themes[j.theme]) themes[j.theme] = { nom: j.themeName, icon: j.icon, ok: 0, n: 0 };
      themes[j.theme].n++; if (j.correct) themes[j.theme].ok++;
    });
    h += '<h3 class="section-title">📈 Ce que tu viens de travailler</h3><div class="grid" style="gap:8px">';
    Object.keys(themes).forEach(function (k) {
      var t = themes[k];
      h += '<div class="hist"><span class="hist-ico">' + t.icon + '</span><div class="hist-main">' +
        '<div class="hist-mode">' + esc(t.nom) + '</div>' +
        '<div class="hist-date">Maitrise : ' + Prog.maitrise(k) + ' % · niveau propose : ' + Prog.niveauPour(k, false) + '</div></div>' +
        '<div class="hist-score">' + t.ok + '/' + t.n + '</div></div>';
    });
    h += '</div>';

    var rates = b.journal.filter(function (j) { return !j.correct; });
    if (rates.length) {
      h += '<h3 class="section-title">🔎 A revoir <span class="pill">garde en memoire</span></h3><div class="grid" style="gap:8px">';
      rates.slice(0, 8).forEach(function (j) {
        h += '<div class="recap"><span class="recap-ico">' + j.icon + '</span><div>' +
          '<div style="font-weight:700">' + j.prompt + '</div>' +
          '<div style="color:var(--muted);margin-top:4px">Reponse attendue : <b>' + esc(j.attendu) + '</b>' +
          (j.donne ? ' · tu avais mis « ' + esc(j.donne) + ' »' : ' · pas de reponse') + '</div>' +
          '<div style="color:var(--muted);margin-top:4px">' + (j.explain || '') + '</div></div></div>';
      });
      h += '</div>';
    }

    h += '<div class="grid g2" style="margin-top:22px">' +
      '<button class="btn btn-primary btn-lg" data-act="rejouer">🔁 Rejouer</button>' +
      '<button class="btn btn-lg" data-act="nav:accueil">🏠 Accueil</button></div>';
    h += '</div>';
    V.innerHTML = h;
    majNav();

    // montees de rang et succes
    var files = [];
    b.montees.forEach(function (m) {
      files.push('<div class="big">' + m.rang.icon + '</div><h2 style="color:' + m.rang.couleur + ';margin-top:10px">Nouveau rang !</h2>' +
        '<p style="font-size:19px;font-weight:800">' + esc(m.rang.nom) + '</p>' +
        '<p style="color:var(--muted)">Recompense : <b>+' + m.pieces + ' 🪙</b></p>' +
        '<button class="btn btn-primary btn-block" data-close>Super !</button>');
    });
    b.succes.forEach(function (s) {
      files.push('<div class="big">' + s.icon + '</div><h2 style="margin-top:10px">Succes debloque</h2>' +
        '<p style="font-size:19px;font-weight:800">' + esc(s.nom) + '</p><p style="color:var(--muted)">' + esc(s.desc) + '</p>' +
        '<p style="color:var(--warn);font-weight:800">+' + s.pieces + ' 🪙</p>' +
        '<button class="btn btn-primary btn-block" data-close>Genial !</button>');
    });
    (function enchainer() {
      if (!files.length) { rafraichirBarre(); return; }
      modale(files.shift(), function () { rafraichirBarre(); enchainer(); });
    })();
  }

  /* ================================================================== */
  /* PAGE : PROGRESSION                                                  */
  /* ================================================================== */
  function pageProgression() {
    var p = Store.joueur();
    var r = Prog.rangCourant();
    var req = Prog.xpRequis(p.rangIdx);
    var pct = p.rangIdx >= Prog.DERNIER ? 100 : Math.round(p.xp / req * 100);

    var h = '<h1 class="page-title">Ta progression</h1><p class="page-sub">Le site retient ton niveau chapitre par chapitre et adapte chaque question.</p>';

    h += '<div class="rank-card" style="--rank-color:' + r.couleur + '">' +
      '<div class="rank-emblem">' + r.icon + '</div>' +
      '<div style="flex:1;min-width:200px"><div class="rank-name">' + esc(r.nom) + '</div>' +
      '<div class="rank-next">' + (p.rangIdx >= Prog.DERNIER ? 'Tu es au sommet du classement !' :
        p.xp + ' / ' + req + ' XP avant <b>' + esc(Prog.RANGS[p.rangIdx + 1].nom) + '</b>') + '</div>' +
      '<div style="margin-top:10px">' + barre(pct) + '</div></div>' +
      '<div style="text-align:center"><div class="stat-val">' + p.xpTotal + '</div><div class="stat-lbl">XP au total</div></div>' +
      '</div>';

    h += '<div class="rank-ladder">';
    Prog.RANGS.forEach(function (x) {
      h += '<div class="rl ' + (x.idx < p.rangIdx ? 'done' : x.idx === p.rangIdx ? 'cur' : '') + '" style="color:' +
        (x.idx <= p.rangIdx ? x.couleur : 'inherit') + '"><i>' + x.icon + '</i>' + esc(x.nom) + '</div>';
    });
    h += '</div>';

    /* --- maitrise par chapitre --- */
    h += '<h3 class="section-title">📚 Maitrise du programme de 3<sup>e</sup> <span class="pill">' + Prog.maitriseGlobale() + ' % global</span></h3>';
    var doms = {};
    Q.THEMES.forEach(function (t) { (doms[t.dom] = doms[t.dom] || []).push(t); });
    Object.keys(doms).forEach(function (d) {
      h += '<div style="font-size:12px;font-weight:800;color:var(--muted);margin:16px 0 8px;text-transform:uppercase;letter-spacing:.5px">' + esc(d) + '</div>';
      h += '<div class="grid g2" style="gap:9px">';
      doms[d].forEach(function (t) { h += themeRow(t, 'play-theme:' + t.id); });
      h += '</div>';
    });

    /* --- courbe des dernieres parties --- */
    if (p.hist.length >= 2) {
      var derniers = p.hist.slice(0, 15).reverse();
      h += '<h3 class="section-title">📉 Reussite des dernieres parties</h3><div class="card">' +
        '<div class="spark">' + derniers.map(function (x) {
          return '<i style="height:' + Math.max(4, x.precision) + '%" title="' + x.precision + ' %"></i>';
        }).join('') + '</div>' +
        '<div style="display:flex;justify-content:space-between;font-size:11px;color:var(--muted);margin-top:8px">' +
        '<span>il y a ' + derniers.length + ' parties</span><span>maintenant</span></div></div>';
    }

    /* --- succes --- */
    h += '<h3 class="section-title">🏅 Succes <span class="pill">' + p.succes.length + ' / ' + Prog.SUCCES.length + '</span></h3><div class="grid g3">';
    Prog.SUCCES.forEach(function (s) {
      var ok = p.succes.indexOf(s.id) >= 0;
      h += '<div class="card" style="text-align:center;opacity:' + (ok ? 1 : .42) + '">' +
        '<div style="font-size:28px">' + s.icon + '</div><div style="font-weight:800;font-size:14px;margin-top:6px">' + esc(s.nom) + '</div>' +
        '<div style="font-size:12px;color:var(--muted);margin-top:3px">' + esc(s.desc) + '</div>' +
        '<div style="font-size:12px;font-weight:800;color:var(--warn);margin-top:6px">' + (ok ? '✔ obtenu' : '+' + s.pieces + ' 🪙') + '</div></div>';
    });
    h += '</div>';

    /* --- historique --- */
    if (p.hist.length) {
      h += '<h3 class="section-title">🕐 Historique</h3><div class="grid" style="gap:8px">';
      p.hist.slice(0, 20).forEach(function (x) {
        h += '<div class="hist"><span class="hist-ico">' + x.icon + '</span><div class="hist-main">' +
          '<div class="hist-mode">' + esc(x.modeNom || x.mode) + '</div>' +
          '<div class="hist-date">' + U.relDate(x.ts) + ' · ' + U.mmss(x.duree) + ' · +' + x.xp + ' XP · +' + x.pieces + ' 🪙</div></div>' +
          '<div class="hist-score">' + x.precision + ' %</div></div>';
      });
      h += '</div>';
    }
    return h;
  }

  /* ================================================================== */
  /* PAGE : BOUTIQUE                                                     */
  /* ================================================================== */

  /**
   * Redimensionne et compresse une photo choisie par l eleve pour qu elle tienne
   * dans le stockage local du navigateur (max ~1600 px de large, JPEG).
   */
  function persoTraiterPhoto(file, callback) {
    if (!file) { callback(null, 'Choisis un fichier image.'); return; }
    var nom = (file.name || '').toLowerCase();
    var estHeic = /^image\/hei[cf]/.test(file.type) || /\.hei[cf]$/.test(nom);
    if (estHeic) {
      callback(null, 'Les photos au format HEIC (iPhone) ne sont pas lisibles par les navigateurs. ' +
        'Sur iPhone : Reglages > Appareil photo > Formats > choisis « Le plus compatible », puis reprends la photo ' +
        '(ou choisis une photo deja en JPEG/PNG, par exemple une capture d ecran).');
      return;
    }
    if (!/^image\//.test(file.type) && !/\.(jpe?g|png|gif|webp|bmp)$/.test(nom)) {
      callback(null, 'Choisis un fichier image (JPEG ou PNG).');
      return;
    }

    var fini = false;
    function terminer(url, err) { if (fini) return; fini = true; clearTimeout(securite); callback(url, err); }
    var securite = setTimeout(function () {
      terminer(null, 'Cette image met trop de temps a se charger. Essaie une autre photo (idealement une capture d ecran ou une image deja en JPEG/PNG).');
    }, 10000);

    var reader = new FileReader();
    reader.onload = function (e) {
      var img = new Image();
      img.onload = function () {
        try {
          var maxW = 1600;
          var echelle = Math.min(1, maxW / img.width);
          var w = Math.max(1, Math.round(img.width * echelle)), h = Math.max(1, Math.round(img.height * echelle));
          var canvas = document.createElement('canvas');
          canvas.width = w; canvas.height = h;
          var ctx = canvas.getContext('2d');
          if (!ctx) { terminer(null, 'Impossible de traiter cette image sur cet appareil.'); return; }
          ctx.drawImage(img, 0, 0, w, h);
          var url = canvas.toDataURL('image/jpeg', 0.75);
          if (url.length > 3500000) url = canvas.toDataURL('image/jpeg', 0.5);
          if (url.length > 3500000) { terminer(null, 'Cette image reste trop volumineuse meme compressee. Essaie une photo plus simple.'); return; }
          terminer(url, null);
        } catch (err) {
          terminer(null, 'Impossible de traiter cette image (format non pris en charge par ce navigateur).');
        }
      };
      img.onerror = function () {
        terminer(null, 'Ce format d image n est pas lisible par le navigateur. Essaie une photo en JPEG ou PNG.');
      };
      img.src = e.target.result;
    };
    reader.onerror = function () { terminer(null, 'Lecture du fichier impossible.'); };
    reader.readAsDataURL(file);
  }

  /** Ouvre une modale de choix de photo et appelle onDataUrl(dataUrl) une fois traitee. */
  function ouvrirPersoPhoto(titre, description, onDataUrl) {
    modale('<h2>✏️ ' + esc(titre) + '</h2>' +
      '<p style="color:var(--muted);font-size:13px;margin:8px 0 14px">' + description + ' Elle est redimensionnee automatiquement et enregistree uniquement sur cet ordinateur, dans ce navigateur.</p>' +
      '<div class="auth-form" style="text-align:left">' +
      '<input type="file" id="perso-photo-file" accept="image/*">' +
      '<p class="form-msg" id="perso-photo-msg"></p>' +
      '<button class="btn btn-block" data-close>Fermer</button></div>');
    var inpF = $('#perso-photo-file');
    inpF.addEventListener('change', function () {
      var f = inpF.files && inpF.files[0];
      if (!f) return;
      var msgEl = $('#perso-photo-msg');
      msgEl.className = 'form-msg';
      msgEl.textContent = 'Traitement en cours...';
      persoTraiterPhoto(f, function (dataUrl, err) {
        if (err) { msgEl.textContent = err; return; }
        onDataUrl(dataUrl);
        $('#modal').classList.add('hidden');
      });
    });
  }

  /** Apercu commun aux objets "photo perso" (banniere/fond/ecran) : la photo si deja choisie, sinon un repere 📷. */
  function apercuPhotoPerso(valeurCss) {
    if (valeurCss) return '<div style="position:absolute;inset:0;background:' + valeurCss + ';background-size:cover;background-position:center"></div>';
    return '<div style="position:absolute;inset:0;display:grid;place-items:center;font-size:24px;background:var(--card-hi)">📷</div>';
  }

  function apercuItem(it) {
    var p = Store.joueur();
    if (it.cat === 'banniere') {
      if (it.perso) return apercuPhotoPerso(Prog.possede(it.id) && p.perso.banniere);
      return '<div style="position:absolute;inset:0;background:' + it.val + '"></div>';
    }
    if (it.cat === 'contour') return '<span class="pp-ring" style="background:' + it.val + '"' + (it.anim ? ' data-anim="1"' : '') +
      '><span class="pp" style="width:46px;height:46px;font-size:24px">' + valAffichee(p.equipe, 'avatar') + '</span></span>';
    if (it.cat === 'fond') {
      if (it.perso) return apercuPhotoPerso(Prog.possede(it.id) && p.perso.fond);
      return '<div style="position:absolute;inset:0;background:' + it.val + '"></div>';
    }
    if (it.cat === 'avatar') {
      if (it.perso) {
        var pa = Prog.possede(it.id) && p.perso.avatar;
        return pa ? pa : '<span style="font-size:24px">' + it.val + '</span><span style="font-size:12px;margin-left:4px">✏️</span>';
      }
      return it.val;
    }
    if (it.cat === 'titre') {
      if (it.perso) {
        var pt = Prog.possede(it.id) && p.perso.titre;
        return '<span style="font-size:13px;font-weight:800;padding:0 8px;text-align:center">' + esc(pt || it.val) + (pt ? '' : ' ✏️') + '</span>';
      }
      return '<span style="font-size:14px;font-weight:800;padding:0 10px;text-align:center">' + esc(it.val) + '</span>';
    }
    if (it.cat === 'theme') return '<div style="position:absolute;inset:0;background:' + (APERCU_THEME[it.val] || '#333') + '"></div>';
    if (it.cat === 'ecran') {
      if (it.perso) {
        var pe = Prog.possede(it.id) && p.perso.ecran;
        if (pe) return '<div style="position:absolute;inset:0;background-image:url(' + pe + ');background-size:cover;background-position:center"></div>';
        return '<div style="position:absolute;inset:0;display:grid;place-items:center;font-size:24px;background:var(--card-hi)">📷</div>';
      }
      return '<div style="position:absolute;inset:0;background:' + (APERCU_WP[it.val] || '#333') +
        ';background-size:' + (it.val === 'wp-grille' ? '12px 12px,12px 12px,cover' : 'cover') + '"></div>';
    }
    if (it.cat === 'effet') return it.val ? '<span style="font-size:26px">' + it.val.split(' ').slice(0, 3).join(' ') + '</span>' : '<span style="font-size:13px;color:var(--muted);font-weight:700">Aucun</span>';
    return '';
  }

  function pageBoutique() {
    var p = Store.joueur();
    var h = '<h1 class="page-title">Boutique</h1>' +
      '<p class="page-sub">Tu as <b style="color:var(--warn)">' + p.pieces + ' 🪙</b>. Les pieces se gagnent en repondant juste, en montant de rang et en jouant chaque jour.</p>';

    h += '<div class="shop-tabs">';
    SHOP.CATS.forEach(function (c) {
      h += '<button class="shop-tab ' + (c.id === catBoutique ? 'active' : '') + '" data-act="cat:' + c.id + '">' + c.icon + ' ' + esc(c.name) + '</button>';
    });
    h += '</div>';

    var cat = SHOP.CATS.filter(function (c) { return c.id === catBoutique; })[0];
    h += '<p class="page-sub">' + esc(cat.desc) + '</p>';

    h += '<div class="grid g3">';
    SHOP.byCat(catBoutique).forEach(function (it) {
      var possede = Prog.possede(it.id);
      var equipe = p.equipe[it.cat] === it.id;
      var ouvert = Prog.accessible(it);
      h += '<div class="item">' +
        '<div class="item-preview">' + apercuItem(it) + '</div>' +
        '<div class="item-info"><div class="item-name">' + esc(it.name) + '</div>';
      if (!ouvert) h += '<div class="item-lock">🔒 Rang ' + esc(Prog.RANGS[it.rank].nom) + ' requis</div>';
      else if (possede) h += '<div class="item-price owned">✔ possede</div>';
      else h += '<div class="item-price">🪙 ' + it.price + '</div>';

      if (equipe) h += '<button class="btn btn-sm" disabled>Equipe</button>';
      else if (possede) h += '<button class="btn btn-sm btn-primary" data-act="equiper:' + it.id + '">Equiper</button>';
      else if (!ouvert) h += '<button class="btn btn-sm" disabled>Verrouille</button>';
      else h += '<button class="btn btn-sm ' + (p.pieces >= it.price ? 'btn-primary' : '') + '" data-act="acheter:' + it.id + '"' +
        (p.pieces >= it.price ? '' : ' disabled') + '>Acheter</button>';
      if (it.perso && possede) h += '<button class="btn btn-sm" data-act="perso-' + it.cat + '" style="margin-top:6px">✏️ Personnaliser</button>';
      h += '</div></div>';
    });
    h += '</div>';
    return h;
  }

  /* ================================================================== */
  /* PAGE : PROFIL                                                       */
  /* ================================================================== */
  function pageProfil() {
    var p = Store.joueur();
    var r = Prog.rangCourant();
    var total = p.stats.ok + p.stats.ko;

    var h = '<div class="profile-card" style="background:' + valAffichee(p.equipe, 'fond') + '">' +
      '<div class="profile-banner" style="background:' + valAffichee(p.equipe, 'banniere') + '"></div>' +
      '<div class="profile-body">' + ppHTML(92) +
      '<div class="profile-name">' + esc(p.pseudo) + '</div>' +
      '<div class="profile-title">' + esc(valAffichee(p.equipe, 'titre')) + '</div>' +
      '<div class="profile-badges">' +
        '<span class="badge" style="color:' + r.couleur + '">' + r.icon + ' ' + esc(r.nom) + '</span>' +
        '<span class="badge">🪙 ' + p.pieces + '</span>' +
        '<span class="badge">⭐ ' + p.xpTotal + ' XP</span>' +
        '<span class="badge">🔥 ' + p.stats.serieJours + ' jours</span>' +
        '<span class="badge">📅 membre depuis le ' + new Date(p.cree).toLocaleDateString('fr-FR') + '</span>' +
      '</div></div></div>';

    h += '<div class="grid g4">' +
      statCard(p.stats.parties, 'parties') +
      statCard(p.stats.ok, 'bonnes reponses') +
      statCard(total ? Math.round(p.stats.ok / total * 100) + ' %' : '—', 'reussite') +
      statCard(p.stats.meilleureSerie, 'meilleure serie') +
      '</div>';
    h += '<div class="grid g4" style="margin-top:12px">' +
      statCard(p.stats.meilleurSprint, 'record Sprint') +
      statCard(p.stats.meilleurSurvie, 'record Survie') +
      statCard(p.inventaire.length, 'objets possedes') +
      statCard(U.mmss(Math.round(p.stats.temps / 1000)), 'temps de jeu') +
      '</div>';

    /* --- personnalisation rapide (objets deja possedes) --- */
    h += '<h3 class="section-title">🎨 Personnaliser mon profil</h3>';
    SHOP.CATS.forEach(function (c) {
      var possedes = SHOP.byCat(c.id).filter(function (i) { return Prog.possede(i.id); });
      h += '<div class="card" style="margin-bottom:12px"><div style="font-weight:800;font-size:14px;margin-bottom:10px">' +
        c.icon + ' ' + esc(c.name) + ' <span style="color:var(--muted);font-weight:600;font-size:12px">— ' + esc(c.desc) + '</span></div>';
      h += '<div style="display:flex;flex-wrap:wrap;gap:9px">';
      possedes.forEach(function (it) {
        var actif = p.equipe[c.id] === it.id;
        h += '<button class="btn btn-sm" data-act="equiper:' + it.id + '" style="' +
          (actif ? 'border-color:var(--accent);background:color-mix(in srgb,var(--accent) 22%,transparent)' : '') + '">' +
          (actif ? '✔ ' : '') + esc(it.name) + '</button>';
      });
      h += '<button class="btn btn-sm btn-ghost" data-act="boutique-cat:' + c.id + '">+ Boutique</button>';
      h += '</div></div>';
    });

    h += '<h3 class="section-title">⚙️ Mon compte</h3><div class="card">' +
      '<p style="font-size:13px;color:var(--muted)">Ton compte et ta progression sont enregistres <b>uniquement sur cet ordinateur</b>, dans ce navigateur. ' +
      (Store.dispo ? '' : '<b style="color:var(--bad)">Attention : la sauvegarde est impossible dans ce navigateur, ta progression sera perdue en fermant l onglet.</b>') + '</p>' +
      '<div style="display:flex;gap:9px;flex-wrap:wrap;margin-top:10px">' +
      '<button class="btn btn-sm" data-act="mdp">🔑 Changer de mot de passe</button>' +
      '<button class="btn btn-sm" data-act="export">💾 Exporter ma progression</button>' +
      '<button class="btn btn-sm" data-act="deconnexion">🚪 Se deconnecter</button>' +
      '<button class="btn btn-sm" data-act="supprimer" style="color:var(--bad)">🗑️ Supprimer mon compte</button>' +
      '</div></div>';
    return h;
  }

  /* ================================================================== */
  /* Routage                                                             */
  /* ================================================================== */
  var PAGES = {
    accueil: pageAccueil, lecons: pageLecons, jouer: pageJouer, 'choix-theme': pageChoixTheme,
    progression: pageProgression, boutique: pageBoutique, profil: pageProfil, amis: pageAmis
  };

  function majNav() {
    $$('.nav-item').forEach(function (b) {
      var actif = b.dataset.nav === page ||
        (b.dataset.nav === 'lecons' && page === 'lecon-detail') ||
        (b.dataset.nav === 'amis' && page === 'duel');
      b.classList.toggle('active', actif);
    });
  }

  function aller(p) {
    if (partie && !partie.termine && page === 'quiz' && p !== 'quiz') {
      // on ne compte la partie que si au moins une question a ete traitee
      if (partie.journal.length) partie.fin(); else partie.termine = true;
      partie = null;
    }
    if (duelCourant && page === 'duel' && p !== 'duel') duelCourant = null;
    nettoyerChronos();
    page = p;
    if (PAGES[p]) {
      V.innerHTML = PAGES[p]();
      V.scrollTop = 0;
      window.scrollTo(0, 0);
    }
    majNav();
    rafraichirBarre();
    $('#nav').classList.remove('open');
  }

  /* ================================================================== */
  /* Actions (delegation d evenements)                                   */
  /* ================================================================== */
  function agir(act) {
    var i = act.indexOf(':');
    var nom = i < 0 ? act : act.slice(0, i);
    var arg = i < 0 ? null : act.slice(i + 1);
    var p = Store.joueur();

    switch (nom) {
      case 'nav': aller(arg); break;

      case 'mode':
        if (arg === 'theme') { aller('choix-theme'); }
        else if (arg === 'revision' && (!p.memoire.erreurs.length && p.stats.parties === 0)) {
          toast('Joue d abord une partie : la revision utilise tes erreurs passees.', 'bad');
          aller('jouer');
        } else lancerPartie(arg);
        break;

      case 'play-theme': lancerPartie('theme', { theme: arg }); break;
      case 'lecon': voirLecon(arg); break;

      /* ---------- Amis ---------- */
      case 'amis-inscrire': {
        var champId = $('#amis-pseudo'), msgId = $('#amis-msg');
        Amis.inscrire(champId.value, valAffichee(p.equipe, 'avatar')).then(function (r) {
          if (r.ok) {
            p.amisId = r.id; p.amisPseudo = champId.value.trim();
            Store.sauver(true);
            amisDemarrerEcoutes();
            toast('👥 Inscrit ! Donne ton pseudo en ligne a tes amis.', 'good');
            if (page === 'amis') V.innerHTML = pageAmis();
          } else { msgId.textContent = r.msg; }
        });
        break;
      }
      case 'amis-ajouter': {
        var champR = $('#amis-recherche'), msgR = $('#amis-ajout-msg');
        var saisie = champR.value;
        Amis.chercherJoueur(saisie).then(function (res) {
          if (!res.ok) { msgR.textContent = res.msg; msgR.className = 'form-msg'; return; }
          return Amis.ajouterAmi(res.id).then(function (r2) {
            msgR.textContent = r2.msg;
            msgR.className = 'form-msg' + (r2.ok ? ' ok' : '');
            if (r2.ok) champR.value = '';
          });
        });
        break;
      }

      /* ---------- Duels ---------- */
      case 'duel-proposer': {
        var ami = amisEtat.amis.filter(function (a) { return a.id === arg; })[0];
        if (!ami) break;
        var opts = Amis.THEMES_DUEL.map(function (t) { return '<option value="' + t.id + '">' + t.icon + ' ' + esc(t.name) + '</option>'; }).join('');
        var miseDefaut = Math.max(1, Math.min(50, p.pieces));
        modale('<h2>⚔️ Defier ' + esc(ami.pseudo) + '</h2>' +
          '<div class="auth-form" style="margin-top:14px;text-align:left">' +
          '<label class="field"><span>Theme</span><select id="duel-theme" class="duel-select">' + opts + '</select></label>' +
          '<label class="field"><span>Mise (tu as ' + p.pieces + ' 🪙)</span><input type="number" id="duel-mise" min="1" max="' + p.pieces + '" value="' + miseDefaut + '"></label>' +
          '<p class="form-msg" id="duel-msg"></p>' +
          '<button class="btn btn-primary btn-block" data-act="duel-envoyer:' + arg + '">Envoyer le defi</button>' +
          '<button class="btn btn-block" data-close>Annuler</button></div>');
        break;
      }
      case 'duel-envoyer': {
        var mise = parseInt($('#duel-mise').value, 10);
        var themeD = $('#duel-theme').value;
        var msgD = $('#duel-msg');
        if (!p.pieces || mise < 1 || isNaN(mise)) { msgD.textContent = 'Mise invalide.'; break; }
        if (mise > p.pieces) { msgD.textContent = 'Tu n as pas assez de pieces.'; break; }
        Amis.proposerDuel(arg, themeD, mise, 8).then(function (r) {
          if (r.ok) { $('#modal').classList.add('hidden'); toast('⚔️ Defi envoye !', 'good'); }
          else msgD.textContent = r.msg;
        });
        break;
      }
      case 'duel-accepter': Amis.accepterDuel(arg).then(function (r) { if (!r.ok) toast(r.msg, 'bad'); }); break;
      case 'duel-refuser': Amis.refuserDuel(arg).then(function (r) { if (r.ok) toast('Duel refuse', 'good'); }); break;
      case 'duel-annuler': Amis.annulerDuel(arg).then(function (r) { if (r.ok) toast('Duel annule', 'good'); }); break;
      case 'duel-jouer': jouerDuel(arg); break;
      case 'duel-choix':
        if (duelCourant && !duelCourant.repondu) duelTraiterReponse($$('#zone-rep .choice')[parseInt(arg, 10)].textContent);
        break;
      case 'duel-valider': duelValider(); break;
      case 'duel-suivant': duelSuivant(); break;
      case 'duel-touche': {
        var inpD = $('#rep');
        if (!inpD || !duelCourant || duelCourant.repondu) break;
        if (arg === '⌫') inpD.value = inpD.value.slice(0, -1); else inpD.value += arg;
        inpD.focus();
        break;
      }
      case 'duel-quitter':
        modale('<div class="big">🤔</div><h2 style="margin-top:8px">Quitter le duel ?</h2>' +
          '<p style="color:var(--muted)">Si tu reviens, il faudra recommencer les questions depuis le debut.</p>' +
          '<div style="display:flex;gap:9px;margin-top:14px"><button class="btn btn-block" data-close>Continuer</button>' +
          '<button class="btn btn-primary btn-block" data-act="duel-confirmer-quitter">Quitter</button></div>');
        break;
      case 'duel-confirmer-quitter':
        $('#modal').classList.add('hidden');
        duelCourant = null;
        aller('amis');
        break;

      case 'quitter':
        if (partie && partie.index > 1) {
          modale('<div class="big">🤔</div><h2 style="margin-top:8px">Arreter la partie ?</h2>' +
            '<p style="color:var(--muted)">Ta progression sur les questions deja faites est conservee.</p>' +
            '<div style="display:flex;gap:9px;margin-top:14px"><button class="btn btn-block" data-close>Continuer</button>' +
            '<button class="btn btn-primary btn-block" data-act="confirmer-quitter">Arreter</button></div>');
        } else { partie.termine = true; partie = null; aller('jouer'); }
        break;
      case 'confirmer-quitter':
        $('#modal').classList.add('hidden');
        finPartie();
        break;

      case 'valider': valider(); break;
      case 'suivant': questionSuivante(); break;
      case 'rejouer':
        lancerPartie(partie.mode.id, partie.opts);
        break;

      case 'choix':
        if (!quiz.repondu) traiterReponse($$('#zone-rep .choice')[parseInt(arg, 10)].textContent);
        break;

      case 'touche': {
        var inp = $('#rep');
        if (!inp || quiz.repondu) break;
        if (arg === '⌫') inp.value = inp.value.slice(0, -1);
        else inp.value += arg;
        inp.focus();
        break;
      }

      case 'calc-toggle':
        calcVisible = !calcVisible;
        var panel = $('#calc-panel');
        if (panel) panel.classList.toggle('hidden', !calcVisible);
        break;
      case 'calc-digit': calcDigit(arg); break;
      case 'calc-op': calcOp(arg); break;
      case 'calc-eq': calcEgal(); break;
      case 'calc-clear': calcClear(); break;
      case 'calc-back': calcBack(); break;
      case 'calc-percent': calcPourcent(); break;
      case 'calc-sqrt': calcRacine(); break;
      case 'calc-square': calcCarre(); break;
      case 'calc-sign': calcSigne(); break;

      case 'cat': catBoutique = arg; V.innerHTML = pageBoutique(); break;
      case 'boutique-cat': catBoutique = arg; aller('boutique'); break;

      /* ---------- Personnalisations libres (emoji, titre, photo) ---------- */
      case 'perso-avatar': {
        var curA = p.perso.avatar || '';
        modale('<h2>✏️ Emoji personnalise</h2>' +
          '<p style="color:var(--muted);font-size:13px;margin:8px 0 14px">Colle ou tape n importe quel emoji : il remplacera ton avatar partout sur le site.</p>' +
          '<div class="auth-form" style="text-align:left">' +
          '<label class="field"><span>Ton emoji</span><input type="text" id="perso-avatar-val" maxlength="8" value="' + esc(curA) + '" style="font-size:28px;text-align:center"></label>' +
          '<button class="btn btn-primary btn-block" data-act="perso-avatar-save">Enregistrer</button>' +
          '<button class="btn btn-block" data-close>Annuler</button></div>');
        break;
      }
      case 'perso-avatar-save': {
        var valA = $('#perso-avatar-val').value.trim();
        if (!valA) { toast('Choisis un emoji.', 'bad'); break; }
        p.perso.avatar = valA;
        Prog.equiper('av-perso');
        Store.sauver(true);
        appliquerApparence(); rafraichirBarre();
        $('#modal').classList.add('hidden');
        toast('✔ Avatar personnalise !', 'good');
        if (page === 'boutique') V.innerHTML = pageBoutique();
        break;
      }

      case 'perso-titre': {
        var curT = p.perso.titre || '';
        modale('<h2>✏️ Titre personnalise</h2>' +
          '<p style="color:var(--muted);font-size:13px;margin:8px 0 14px">Ecris le titre de ton choix (26 caracteres max) : il s affichera sous ton pseudo.</p>' +
          '<div class="auth-form" style="text-align:left">' +
          '<label class="field"><span>Ton titre</span><input type="text" id="perso-titre-val" maxlength="26" value="' + esc(curT) + '"></label>' +
          '<button class="btn btn-primary btn-block" data-act="perso-titre-save">Enregistrer</button>' +
          '<button class="btn btn-block" data-close>Annuler</button></div>');
        break;
      }
      case 'perso-titre-save': {
        var valT = $('#perso-titre-val').value.trim();
        if (!valT) { toast('Ecris un titre.', 'bad'); break; }
        p.perso.titre = valT;
        Prog.equiper('ti-perso');
        Store.sauver(true);
        rafraichirBarre();
        $('#modal').classList.add('hidden');
        toast('✔ Titre personnalise !', 'good');
        if (page === 'boutique') V.innerHTML = pageBoutique();
        break;
      }

      case 'perso-ecran':
        ouvrirPersoPhoto('Photo personnalisee', 'Choisis une photo depuis ton appareil pour l arriere-plan du site.', function (dataUrl) {
          p.perso.ecran = dataUrl;
          Prog.equiper('wp-perso');
          Store.sauver(true);
          appliquerApparence();
          toast('✔ Fond d ecran personnalise !', 'good');
          if (page === 'boutique') V.innerHTML = pageBoutique();
        });
        break;

      case 'perso-banniere':
        ouvrirPersoPhoto('Banniere personnalisee', 'Choisis une photo depuis ton appareil pour la banniere de ton profil.', function (dataUrl) {
          p.perso.banniere = 'linear-gradient(rgba(6,6,14,.18),rgba(6,6,14,.18)), url(' + dataUrl + ') center/cover no-repeat';
          Prog.equiper('ban-perso');
          Store.sauver(true);
          toast('✔ Banniere personnalisee !', 'good');
          if (page === 'boutique') V.innerHTML = pageBoutique();
          if (page === 'profil') V.innerHTML = pageProfil();
        });
        break;

      case 'perso-fond':
        ouvrirPersoPhoto('Fond de profil personnalise', 'Choisis une photo depuis ton appareil pour le fond de ta carte de profil.', function (dataUrl) {
          p.perso.fond = 'linear-gradient(rgba(6,6,14,.55),rgba(6,6,14,.55)), url(' + dataUrl + ') center/cover no-repeat';
          Prog.equiper('fond-perso');
          Store.sauver(true);
          toast('✔ Fond de profil personnalise !', 'good');
          if (page === 'boutique') V.innerHTML = pageBoutique();
          if (page === 'profil') V.innerHTML = pageProfil();
        });
        break;

      case 'acheter': {
        var r = Prog.acheter(arg);
        toast(r.ok ? '🎉 ' + r.msg : '❌ ' + r.msg, r.ok ? 'gold' : 'bad');
        if (r.ok) { Prog.equiper(arg); appliquerApparence(); }
        rafraichirBarre();
        V.innerHTML = page === 'profil' ? pageProfil() : pageBoutique();
        break;
      }

      case 'equiper':
        if (Prog.equiper(arg)) {
          appliquerApparence();
          rafraichirBarre();
          toast('✔ ' + esc(SHOP.get(arg).name) + ' equipe', 'good', 1500);
          V.innerHTML = page === 'profil' ? pageProfil() : pageBoutique();
        }
        break;

      case 'deconnexion':
        Store.deconnecter();
        location.reload();
        break;

      case 'supprimer':
        modale('<div class="big">⚠️</div><h2 style="margin-top:8px">Supprimer le compte ?</h2>' +
          '<p style="color:var(--muted)">Toute ta progression, tes pieces et tes achats seront perdus. C est definitif.</p>' +
          '<div style="display:flex;gap:9px;margin-top:14px"><button class="btn btn-block" data-close>Annuler</button>' +
          '<button class="btn btn-block" style="background:var(--bad);color:#fff" data-act="confirmer-suppression">Supprimer</button></div>');
        break;
      case 'confirmer-suppression':
        Store.supprimer(p.pseudo);
        location.reload();
        break;

      case 'mdp': {
        modale('<h2>Changer de mot de passe</h2>' +
          '<div class="auth-form" style="margin-top:12px;text-align:left">' +
          '<label class="field"><span>Mot de passe actuel</span><input type="password" id="mdp-1"></label>' +
          '<label class="field"><span>Nouveau mot de passe</span><input type="password" id="mdp-2"></label>' +
          '<p class="form-msg" id="mdp-msg"></p>' +
          '<button class="btn btn-primary btn-block" data-act="confirmer-mdp">Valider</button>' +
          '<button class="btn btn-block" data-close>Annuler</button></div>');
        break;
      }
      case 'confirmer-mdp': {
        var res = Store.connecter(p.pseudo, $('#mdp-1').value);
        if (!res.ok) { $('#mdp-msg').textContent = 'Mot de passe actuel incorrect.'; break; }
        if ($('#mdp-2').value.length < 4) { $('#mdp-msg').textContent = '4 caracteres minimum.'; break; }
        Store.changerMdp($('#mdp-2').value);
        $('#modal').classList.add('hidden');
        toast('🔑 Mot de passe modifie', 'good');
        break;
      }

      case 'export': {
        var data = JSON.stringify(Store.joueur(), null, 2);
        modale('<h2>Ta progression</h2><p style="color:var(--muted);font-size:13px">Copie ce texte et garde-le : il contient toute ta sauvegarde.</p>' +
          '<textarea readonly style="width:100%;height:180px;border-radius:12px;padding:10px;background:var(--card);color:var(--text);border:1px solid var(--line);font-size:11px">' +
          esc(data) + '</textarea><button class="btn btn-primary btn-block" data-close style="margin-top:12px">Fermer</button>');
        break;
      }
    }
  }

  /* ================================================================== */
  /* Initialisation                                                      */
  /* ================================================================== */
  function init() {
    V = $('#view');

    document.addEventListener('click', function (e) {
      var b = e.target.closest('[data-act]');
      if (b) { e.preventDefault(); agir(b.dataset.act); return; }
      var n = e.target.closest('[data-nav]');
      if (n) {
        e.preventDefault();
        if (n.dataset.nav === 'deconnexion') agir('deconnexion'); else aller(n.dataset.nav);
      }
    });

    $('#burger').addEventListener('click', function () { $('#nav').classList.toggle('open'); });

    document.addEventListener('keydown', function (e) {
      if (page !== 'quiz' || !quiz) return;
      // reponses au clavier dans les QCM : touches 1 a 4
      if (!quiz.repondu && partie && partie.q && partie.q.type === 'qcm' && /^[1-4]$/.test(e.key)) {
        var b = $$('#zone-rep .choice')[parseInt(e.key, 10) - 1];
        if (b) { e.preventDefault(); traiterReponse(b.textContent); }
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        if (quiz.repondu) { if ($('[data-act="suivant"]')) questionSuivante(); }
        else if ($('#rep')) valider();
        return;
      }
      if (quiz.repondu && e.key === ' ' && $('[data-act="suivant"]')) { e.preventDefault(); questionSuivante(); }
    });

    appliquerApparence();
    rafraichirBarre();
    aller('accueil');
    amisDemarrer();

    // le pointage du jour se fait en fin de partie (pour la prime) : ici on salue seulement
    var p = Store.joueur();
    if (p && p.stats.serieJours > 1 && p.stats.dernierJour === U.dayKey()) {
      toast('🔥 Serie de ' + p.stats.serieJours + ' jours ! Continue comme ca.', 'gold', 3200);
    }
  }

  global.UI = { init: init, toast: toast, aller: aller, rafraichirBarre: rafraichirBarre, appliquerApparence: appliquerApparence };
})(window);
