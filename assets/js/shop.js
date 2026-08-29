/* =======================================================================
   shop.js — catalogue des personnalisations achetables avec les pieces
   ======================================================================= */
(function (global) {
  'use strict';

  /* Categories de la boutique */
  var CATS = [
    { id: 'banniere', name: 'Bannieres',        icon: '🎏', desc: 'Le bandeau en haut de ton profil' },
    { id: 'contour',  name: 'Contours de photo', icon: '⭕', desc: 'Le cercle autour de ta photo de profil' },
    { id: 'fond',     name: 'Fonds de profil',   icon: '🎨', desc: 'La couleur de fond de ta carte de profil' },
    { id: 'avatar',   name: 'Avatars',           icon: '🙂', desc: 'Ton personnage' },
    { id: 'titre',    name: 'Titres',            icon: '🏷️', desc: 'Le petit texte sous ton pseudo' },
    { id: 'theme',    name: 'Themes du site',    icon: '🌈', desc: 'Les couleurs de tout le site' },
    { id: 'ecran',    name: 'Fonds d ecran',     icon: '🖼️', desc: 'L arriere-plan du site' }
  ];

  /* i.id, i.cat, i.name, i.price, i.val (valeur CSS ou texte), i.rank (rang minimum) */
  var ITEMS = [
    /* ---------------- Bannieres ---------------- */
    { id: 'ban-defaut',   cat: 'banniere', name: 'Classique',     price: 0,    val: 'linear-gradient(120deg,#6c7bff,#c86bff)' },
    { id: 'ban-menthe',   cat: 'banniere', name: 'Menthe',        price: 120,  val: 'linear-gradient(120deg,#35d39a,#19c3d6)' },
    { id: 'ban-flamme',   cat: 'banniere', name: 'Flamme',        price: 150,  val: 'linear-gradient(120deg,#ff512f,#f09819)' },
    { id: 'ban-ocean',    cat: 'banniere', name: 'Grand bleu',    price: 150,  val: 'linear-gradient(120deg,#2193b0,#6dd5ed)' },
    { id: 'ban-bonbon',   cat: 'banniere', name: 'Barbe a papa',  price: 200,  val: 'linear-gradient(120deg,#ff6ec7,#ffc93c)' },
    { id: 'ban-nuit',     cat: 'banniere', name: 'Nuit etoilee',  price: 250,  val: 'linear-gradient(160deg,#0f2027,#203a43,#2c5364)' },
    { id: 'ban-foret',    cat: 'banniere', name: 'Foret',         price: 250,  val: 'linear-gradient(120deg,#134e5e,#71b280)' },
    { id: 'ban-lave',     cat: 'banniere', name: 'Lave',          price: 400,  val: 'linear-gradient(120deg,#870000,#190a05)' },
    { id: 'ban-aurore',   cat: 'banniere', name: 'Aurore boreale',price: 500,  val: 'linear-gradient(120deg,#00c9ff,#92fe9d,#c86bff)' },
    { id: 'ban-galaxie',  cat: 'banniere', name: 'Galaxie',       price: 700,  val: 'radial-gradient(circle at 25% 40%,#fff 0 1.5px,transparent 2px),radial-gradient(circle at 70% 25%,#fff 0 1.5px,transparent 2px),radial-gradient(circle at 55% 75%,#fff 0 2px,transparent 3px),linear-gradient(120deg,#2b1055,#7597de)' },
    { id: 'ban-arcenciel',cat: 'banniere', name: 'Arc-en-ciel',   price: 900,  val: 'linear-gradient(90deg,#ff6b81,#ffc93c,#35d39a,#19c3d6,#6c7bff,#c86bff)' },
    { id: 'ban-or',       cat: 'banniere', name: 'Or massif',     price: 1400, rank: 9,  val: 'linear-gradient(120deg,#b8860b,#ffd700,#fff3b0,#ffd700,#b8860b)' },
    { id: 'ban-diamant',  cat: 'banniere', name: 'Diamant',       price: 2200, rank: 17, val: 'linear-gradient(120deg,#a1c4fd,#c2e9fb,#fff,#c2e9fb,#a1c4fd)' },
    { id: 'ban-brevet',   cat: 'banniere', name: 'Champion 2026', price: 4000, rank: 25, val: 'linear-gradient(120deg,#f7971e,#ffd200,#f7971e,#ffd200)' },

    /* ---------------- Contours de photo ---------------- */
    { id: 'con-defaut',   cat: 'contour', name: 'Simple',        price: 0,    val: 'var(--accent)' },
    { id: 'con-vert',     cat: 'contour', name: 'Emeraude',      price: 100,  val: '#35d39a' },
    { id: 'con-rose',     cat: 'contour', name: 'Rose bonbon',   price: 100,  val: '#ff6ec7' },
    { id: 'con-cyan',     cat: 'contour', name: 'Cyan',          price: 120,  val: '#19c3d6' },
    { id: 'con-degrade',  cat: 'contour', name: 'Degrade',       price: 300,  val: 'linear-gradient(120deg,#6c7bff,#c86bff)' },
    { id: 'con-feu',      cat: 'contour', name: 'Braise',        price: 400,  val: 'linear-gradient(120deg,#ff512f,#ffc93c)' },
    { id: 'con-glace',    cat: 'contour', name: 'Glace',         price: 400,  val: 'linear-gradient(120deg,#a1c4fd,#e2f6ff)' },
    { id: 'con-arcenciel',cat: 'contour', name: 'Prisme',        price: 800,  val: 'conic-gradient(#ff6b81,#ffc93c,#35d39a,#19c3d6,#6c7bff,#c86bff,#ff6b81)', anim: true },
    { id: 'con-or',       cat: 'contour', name: 'Couronne d or',  price: 1500, rank: 12, val: 'conic-gradient(#8a6d00,#ffd700,#fff6c2,#ffd700,#8a6d00)', anim: true },
    { id: 'con-legende',  cat: 'contour', name: 'Legende',       price: 3000, rank: 22, val: 'conic-gradient(#ff004d,#ffd200,#00f5d4,#f038ff,#ff004d)', anim: true },

    /* ---------------- Fonds de profil ---------------- */
    { id: 'fond-defaut',  cat: 'fond', name: 'Standard',    price: 0,    val: 'var(--card)' },
    { id: 'fond-encre',   cat: 'fond', name: 'Encre',       price: 120,  val: 'rgba(10,12,30,.55)' },
    { id: 'fond-lait',    cat: 'fond', name: 'Brume',       price: 120,  val: 'rgba(255,255,255,.14)' },
    { id: 'fond-violet',  cat: 'fond', name: 'Violet doux', price: 220,  val: 'linear-gradient(180deg,rgba(140,90,255,.28),rgba(20,10,40,.35))' },
    { id: 'fond-vert',    cat: 'fond', name: 'Vert doux',   price: 220,  val: 'linear-gradient(180deg,rgba(53,211,154,.25),rgba(8,30,22,.35))' },
    { id: 'fond-corail',  cat: 'fond', name: 'Corail',      price: 300,  val: 'linear-gradient(180deg,rgba(255,110,129,.28),rgba(40,10,18,.35))' },
    { id: 'fond-cosmos',  cat: 'fond', name: 'Cosmos',      price: 600,  val: 'linear-gradient(180deg,rgba(120,80,255,.35),rgba(255,110,199,.2),rgba(5,5,20,.5))' },

    /* ---------------- Avatars ---------------- */
    { id: 'av-renard',  cat: 'avatar', name: 'Renard',     price: 0,   val: '🦊' },
    { id: 'av-chat',    cat: 'avatar', name: 'Chat',       price: 0,   val: '🐱' },
    { id: 'av-panda',   cat: 'avatar', name: 'Panda',      price: 0,   val: '🐼' },
    { id: 'av-grenouille', cat: 'avatar', name: 'Grenouille', price: 0, val: '🐸' },
    { id: 'av-hibou',   cat: 'avatar', name: 'Hibou',      price: 80,  val: '🦉' },
    { id: 'av-licorne', cat: 'avatar', name: 'Licorne',    price: 150, val: '🦄' },
    { id: 'av-dragon',  cat: 'avatar', name: 'Dragon',     price: 250, val: '🐲' },
    { id: 'av-robot',   cat: 'avatar', name: 'Robot',      price: 250, val: '🤖' },
    { id: 'av-alien',   cat: 'avatar', name: 'Alien',      price: 300, val: '👽' },
    { id: 'av-ninja',   cat: 'avatar', name: 'Ninja',      price: 400, val: '🥷' },
    { id: 'av-savant',  cat: 'avatar', name: 'Savant',     price: 500, val: '🧑‍🔬' },
    { id: 'av-magicien',cat: 'avatar', name: 'Magicien',   price: 600, val: '🧙' },
    { id: 'av-fusee',   cat: 'avatar', name: 'Fusee',      price: 700, val: '🚀' },
    { id: 'av-couronne',cat: 'avatar', name: 'Roi du calcul', price: 1200, rank: 13, val: '👑' },
    { id: 'av-cerveau', cat: 'avatar', name: 'Super cerveau', price: 2000, rank: 20, val: '🧠' },

    /* ---------------- Titres ---------------- */
    { id: 'ti-debut',    cat: 'titre', name: 'Debutant',            price: 0,    val: 'Debutant' },
    { id: 'ti-curieux',  cat: 'titre', name: 'Curieux',             price: 60,   val: 'Curieux des maths' },
    { id: 'ti-rapide',   cat: 'titre', name: 'Calculateur rapide',  price: 150,  val: 'Calculateur rapide' },
    { id: 'ti-fraction', cat: 'titre', name: 'Dompteur de fractions', price: 250, val: 'Dompteur de fractions' },
    { id: 'ti-pythagore',cat: 'titre', name: 'Ami de Pythagore',    price: 250,  val: 'Ami de Pythagore' },
    { id: 'ti-machine',  cat: 'titre', name: 'Machine a calculer',  price: 400,  val: 'Machine a calculer' },
    { id: 'ti-serein',   cat: 'titre', name: 'Serein pour le brevet', price: 600, val: 'Serein pour le brevet' },
    { id: 'ti-flamme',   cat: 'titre', name: 'En feu',              price: 800,  val: 'En feu 🔥' },
    { id: 'ti-genie',    cat: 'titre', name: 'Petit genie',         price: 1200, rank: 11, val: 'Petit genie' },
    { id: 'ti-mentor',   cat: 'titre', name: 'Mentor',              price: 1800, rank: 16, val: 'Mentor des maths' },
    { id: 'ti-legende',  cat: 'titre', name: 'Legende du brevet',   price: 3500, rank: 24, val: 'Legende du brevet' },

    /* ---------------- Themes du site ---------------- */
    { id: 'theme-nuit',   cat: 'theme', name: 'Nuit',        price: 0,    val: 'theme-nuit' },
    { id: 'theme-ocean',  cat: 'theme', name: 'Ocean',       price: 300,  val: 'theme-ocean' },
    { id: 'theme-foret',  cat: 'theme', name: 'Foret',       price: 300,  val: 'theme-foret' },
    { id: 'theme-bonbon', cat: 'theme', name: 'Bonbon',      price: 450,  val: 'theme-bonbon' },
    { id: 'theme-retro',  cat: 'theme', name: 'Retro',       price: 450,  val: 'theme-retro' },
    { id: 'theme-clair',  cat: 'theme', name: 'Jour',        price: 500,  val: 'theme-clair' },
    { id: 'theme-neon',   cat: 'theme', name: 'Neon',        price: 1000, rank: 10, val: 'theme-neon' },

    /* ---------------- Fonds d ecran ---------------- */
    { id: 'wp-aurore',    cat: 'ecran', name: 'Aurore',       price: 0,    val: 'wp-aurore' },
    { id: 'wp-uni',       cat: 'ecran', name: 'Uni',          price: 0,    val: 'wp-uni' },
    { id: 'wp-grille',    cat: 'ecran', name: 'Papier quadrille', price: 150, val: 'wp-grille' },
    { id: 'wp-vagues',    cat: 'ecran', name: 'Ondes',        price: 200,  val: 'wp-vagues' },
    { id: 'wp-bulles',    cat: 'ecran', name: 'Bulles',       price: 250,  val: 'wp-bulles' },
    { id: 'wp-etoiles',   cat: 'ecran', name: 'Ciel etoile',  price: 350,  val: 'wp-etoiles' },
    { id: 'wp-maths',     cat: 'ecran', name: 'Pluie de symboles', price: 450, val: 'wp-maths' },
    { id: 'wp-papier',    cat: 'ecran', name: 'Cahier',       price: 500,  val: 'wp-papier' },
    { id: 'wp-coucher',   cat: 'ecran', name: 'Coucher de soleil', price: 700, val: 'wp-coucher' },
    { id: 'wp-espace',    cat: 'ecran', name: 'Espace',       price: 900,  val: 'wp-espace' },
    { id: 'wp-matrix',    cat: 'ecran', name: 'Code',         price: 1300, rank: 14, val: 'wp-matrix' },
    { id: 'wp-arcenciel', cat: 'ecran', name: 'Arc-en-ciel',  price: 2000, rank: 19, val: 'wp-arcenciel' }
  ];

  var BY_ID = {};
  ITEMS.forEach(function (i) { BY_ID[i.id] = i; });

  /* Objets possedes des le depart */
  var DEFAULTS = {
    banniere: 'ban-defaut', contour: 'con-defaut', fond: 'fond-defaut',
    avatar: 'av-renard', titre: 'ti-debut', theme: 'theme-nuit', ecran: 'wp-aurore'
  };
  var FREE = ITEMS.filter(function (i) { return i.price === 0; }).map(function (i) { return i.id; });

  global.SHOP = {
    CATS: CATS, ITEMS: ITEMS, BY_ID: BY_ID, DEFAULTS: DEFAULTS, FREE: FREE,
    get: function (id) { return BY_ID[id] || null; },
    /** Valeur equipee d une categorie, avec repli sur la valeur par defaut. */
    valOf: function (equipe, cat) {
      var it = BY_ID[equipe && equipe[cat]] || BY_ID[DEFAULTS[cat]];
      return it ? it.val : '';
    },
    itemOf: function (equipe, cat) {
      return BY_ID[equipe && equipe[cat]] || BY_ID[DEFAULTS[cat]];
    },
    byCat: function (cat) { return ITEMS.filter(function (i) { return i.cat === cat; }); }
  };
})(window);
