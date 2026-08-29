/* =======================================================================
   shop.js — catalogue des personnalisations achetables avec les pieces
   ======================================================================= */
(function (global) {
  'use strict';

  /* Categories de la boutique */
  var CATS = [
    { id: 'banniere', name: 'Bannieres',         icon: '🎏', desc: 'Le bandeau en haut de ton profil' },
    { id: 'contour',  name: 'Contours de photo',  icon: '⭕', desc: 'Le cercle autour de ta photo de profil' },
    { id: 'fond',     name: 'Fonds de profil',    icon: '🎨', desc: 'La couleur de fond de ta carte de profil' },
    { id: 'avatar',   name: 'Avatars',            icon: '🙂', desc: 'Ton personnage' },
    { id: 'titre',    name: 'Titres',             icon: '🏷️', desc: 'Le petit texte sous ton pseudo' },
    { id: 'theme',    name: 'Themes du site',     icon: '🌈', desc: 'Les couleurs de tout le site' },
    { id: 'ecran',    name: 'Fonds d ecran',      icon: '🖼️', desc: 'L arriere-plan du site' },
    { id: 'effet',    name: 'Effets de reponse',  icon: '🎆', desc: 'L animation qui apparait quand tu reponds juste' }
  ];

  /* i.id, i.cat, i.name, i.price, i.val (valeur CSS/texte/emoji), i.rank (rang minimum) */
  var ITEMS = [
    /* ---------------- Bannieres ---------------- */
    { id: 'ban-defaut',    cat: 'banniere', name: 'Classique',      price: 0,    val: 'linear-gradient(120deg,#6c7bff,#c86bff)' },
    { id: 'ban-peche',     cat: 'banniere', name: 'Peche',          price: 90,   val: 'linear-gradient(120deg,#ffafbd,#ffc3a0)' },
    { id: 'ban-menthe',    cat: 'banniere', name: 'Menthe',         price: 120,  val: 'linear-gradient(120deg,#35d39a,#19c3d6)' },
    { id: 'ban-miel',      cat: 'banniere', name: 'Miel',           price: 130,  val: 'linear-gradient(120deg,#f7971e,#ffd200)' },
    { id: 'ban-flamme',    cat: 'banniere', name: 'Flamme',         price: 150,  val: 'linear-gradient(120deg,#ff512f,#f09819)' },
    { id: 'ban-ocean',     cat: 'banniere', name: 'Grand bleu',     price: 150,  val: 'linear-gradient(120deg,#2193b0,#6dd5ed)' },
    { id: 'ban-bonbon',    cat: 'banniere', name: 'Barbe a papa',   price: 200,  val: 'linear-gradient(120deg,#ff6ec7,#ffc93c)' },
    { id: 'ban-emeraude',  cat: 'banniere', name: 'Emeraude',       price: 220,  val: 'linear-gradient(120deg,#0f9b6c,#1fd1a3)' },
    { id: 'ban-nuit',      cat: 'banniere', name: 'Nuit etoilee',   price: 250,  val: 'linear-gradient(160deg,#0f2027,#203a43,#2c5364)' },
    { id: 'ban-foret',     cat: 'banniere', name: 'Foret',          price: 250,  val: 'linear-gradient(120deg,#134e5e,#71b280)' },
    { id: 'ban-glacier',   cat: 'banniere', name: 'Glacier',        price: 280,  val: 'linear-gradient(120deg,#83a4d4,#b6fbff)' },
    { id: 'ban-vin',       cat: 'banniere', name: 'Vin profond',    price: 320,  val: 'linear-gradient(120deg,#4a0d1f,#8e2140)' },
    { id: 'ban-lave',      cat: 'banniere', name: 'Lave',           price: 400,  val: 'linear-gradient(120deg,#870000,#190a05)' },
    { id: 'ban-recif',     cat: 'banniere', name: 'Recif corail',   price: 420,  val: 'linear-gradient(120deg,#ff8177,#ff867a,#ff8c7f,#f99185,#cf556c,#b12a5b)' },
    { id: 'ban-aurore',    cat: 'banniere', name: 'Aurore boreale', price: 500,  val: 'linear-gradient(120deg,#00c9ff,#92fe9d,#c86bff)' },
    { id: 'ban-neon-rose', cat: 'banniere', name: 'Neon rose',      price: 550,  val: 'linear-gradient(120deg,#f900bf,#00c3ff)', rank: 3 },
    { id: 'ban-eclipse',   cat: 'banniere', name: 'Eclipse',        price: 650,  val: 'radial-gradient(circle at 50% 50%,#0b0b0f 0 30%,#ff8a00 32%,#0b0b0f 60%)', rank: 6 },
    { id: 'ban-galaxie',   cat: 'banniere', name: 'Galaxie',        price: 700,  val: 'radial-gradient(circle at 25% 40%,#fff 0 1.5px,transparent 2px),radial-gradient(circle at 70% 25%,#fff 0 1.5px,transparent 2px),radial-gradient(circle at 55% 75%,#fff 0 2px,transparent 3px),linear-gradient(120deg,#2b1055,#7597de)' },
    { id: 'ban-arcenciel', cat: 'banniere', name: 'Arc-en-ciel',    price: 900,  val: 'linear-gradient(90deg,#ff6b81,#ffc93c,#35d39a,#19c3d6,#6c7bff,#c86bff)' },
    { id: 'ban-supernova', cat: 'banniere', name: 'Supernova',      price: 1100, rank: 11, val: 'radial-gradient(circle at 30% 50%,#fff,#ffd6f7 20%,#c86bff 45%,#2b1055 80%)' },
    { id: 'ban-or',        cat: 'banniere', name: 'Or massif',      price: 1400, rank: 9,  val: 'linear-gradient(120deg,#b8860b,#ffd700,#fff3b0,#ffd700,#b8860b)' },
    { id: 'ban-platine',   cat: 'banniere', name: 'Platine',        price: 1800, rank: 18, val: 'linear-gradient(120deg,#7a7d82,#d7d9dc,#fff,#d7d9dc,#7a7d82)' },
    { id: 'ban-diamant',   cat: 'banniere', name: 'Diamant',        price: 2200, rank: 17, val: 'linear-gradient(120deg,#a1c4fd,#c2e9fb,#fff,#c2e9fb,#a1c4fd)' },
    { id: 'ban-phenix',    cat: 'banniere', name: 'Phenix',         price: 3000, rank: 21, val: 'linear-gradient(120deg,#ff0844,#ffb199,#ffd700,#ffb199,#ff0844)' },
    { id: 'ban-brevet',    cat: 'banniere', name: 'Champion 2026',  price: 4000, rank: 25, val: 'linear-gradient(120deg,#f7971e,#ffd200,#f7971e,#ffd200)' },

    /* ---------------- Bannieres (inspiration manga) ---------------- */
    { id: 'ban-shonen',    cat: 'banniere', name: 'Style Shonen',      price: 380,  val: 'linear-gradient(115deg,#e2001a,#141414 50%,#e2001a)' },
    { id: 'ban-aura-ki',   cat: 'banniere', name: 'Aura de combat',    price: 620,  val: 'radial-gradient(circle at 50% 55%,#fff,#ffdd00 28%,#ff6a00 58%,#1a0500 100%)' },
    { id: 'ban-dragon-sceau', cat: 'banniere', name: 'Sceau du dragon', price: 850, rank: 7, val: 'linear-gradient(120deg,#7a0000,#c9a227,#7a0000)' },
    { id: 'ban-lame-esprit', cat: 'banniere', name: 'Lame spirituelle', price: 1050, rank: 10, val: 'linear-gradient(120deg,#001e3c,#00b4d8,#e8fbff)' },
    { id: 'ban-transformation', cat: 'banniere', name: 'Transformation finale', price: 3500, rank: 20,
      val: 'radial-gradient(circle at 50% 42%,#fff,#ffd700 22%,#ff2e63 52%,#5b0e91 78%,#0a001a 100%)' },

    /* ---------------- Contours de photo ---------------- */
    { id: 'con-defaut',    cat: 'contour', name: 'Simple',        price: 0,    val: 'var(--accent)' },
    { id: 'con-jaune',     cat: 'contour', name: 'Soleil',        price: 80,   val: '#ffc93c' },
    { id: 'con-vert',      cat: 'contour', name: 'Emeraude',      price: 100,  val: '#35d39a' },
    { id: 'con-rose',      cat: 'contour', name: 'Rose bonbon',   price: 100,  val: '#ff6ec7' },
    { id: 'con-turquoise', cat: 'contour', name: 'Turquoise',     price: 110,  val: '#19c3d6' },
    { id: 'con-cyan',      cat: 'contour', name: 'Cyan',          price: 120,  val: '#19c3d6' },
    { id: 'con-corail',    cat: 'contour', name: 'Corail',        price: 130,  val: '#ff8177' },
    { id: 'con-nuit',      cat: 'contour', name: 'Nuit',          price: 220,  val: 'linear-gradient(120deg,#0f2027,#2c5364)' },
    { id: 'con-degrade',   cat: 'contour', name: 'Degrade',       price: 300,  val: 'linear-gradient(120deg,#6c7bff,#c86bff)' },
    { id: 'con-feu',       cat: 'contour', name: 'Braise',        price: 400,  val: 'linear-gradient(120deg,#ff512f,#ffc93c)' },
    { id: 'con-glace',     cat: 'contour', name: 'Glace',         price: 400,  val: 'linear-gradient(120deg,#a1c4fd,#e2f6ff)' },
    { id: 'con-aurora',    cat: 'contour', name: 'Aurore',        price: 450,  val: 'linear-gradient(120deg,#00c9ff,#92fe9d,#c86bff)', rank: 2 },
    { id: 'con-arcenciel', cat: 'contour', name: 'Prisme',        price: 800,  val: 'conic-gradient(#ff6b81,#ffc93c,#35d39a,#19c3d6,#6c7bff,#c86bff,#ff6b81)', anim: true },
    { id: 'con-laser',     cat: 'contour', name: 'Laser',         price: 950,  rank: 8,  val: 'conic-gradient(#00f5d4,#0b0b0f,#00f5d4,#0b0b0f,#00f5d4)', anim: true },
    { id: 'con-or',        cat: 'contour', name: 'Couronne d or', price: 1500, rank: 12, val: 'conic-gradient(#8a6d00,#ffd700,#fff6c2,#ffd700,#8a6d00)', anim: true },
    { id: 'con-cristal',   cat: 'contour', name: 'Cristal',       price: 1700, rank: 14, val: 'conic-gradient(#a1c4fd,#fff,#c2e9fb,#fff,#a1c4fd)', anim: true },
    { id: 'con-phenix',    cat: 'contour', name: 'Phenix',        price: 2400, rank: 16, val: 'conic-gradient(#ff0844,#ffb199,#ffd700,#ff512f,#ff0844)', anim: true },
    { id: 'con-legende',   cat: 'contour', name: 'Legende',       price: 3000, rank: 22, val: 'conic-gradient(#ff004d,#ffd200,#00f5d4,#f038ff,#ff004d)', anim: true },

    /* ---------------- Contours (inspiration manga) ---------------- */
    { id: 'con-katana',    cat: 'contour', name: 'Lame d acier',  price: 520,  val: 'linear-gradient(120deg,#8e9aa8,#e8edf2,#8e9aa8)' },
    { id: 'con-dragon',    cat: 'contour', name: 'Sceau du dragon', price: 1350, rank: 10, val: 'conic-gradient(#7a0000,#c9a227,#7a0000,#c9a227,#7a0000)', anim: true },

    /* ---------------- Fonds de profil ---------------- */
    { id: 'fond-defaut',  cat: 'fond', name: 'Standard',      price: 0,    val: 'var(--card)' },
    { id: 'fond-sable',   cat: 'fond', name: 'Sable',         price: 100,  val: 'linear-gradient(180deg,rgba(255,214,153,.22),rgba(60,40,10,.35))' },
    { id: 'fond-encre',   cat: 'fond', name: 'Encre',         price: 120,  val: 'rgba(10,12,30,.55)' },
    { id: 'fond-lait',    cat: 'fond', name: 'Brume',         price: 120,  val: 'rgba(255,255,255,.14)' },
    { id: 'fond-poudre',  cat: 'fond', name: 'Rose poudre',   price: 150,  val: 'linear-gradient(180deg,rgba(255,175,189,.25),rgba(40,15,25,.35))' },
    { id: 'fond-violet',  cat: 'fond', name: 'Violet doux',   price: 220,  val: 'linear-gradient(180deg,rgba(140,90,255,.28),rgba(20,10,40,.35))' },
    { id: 'fond-vert',    cat: 'fond', name: 'Vert doux',     price: 220,  val: 'linear-gradient(180deg,rgba(53,211,154,.25),rgba(8,30,22,.35))' },
    { id: 'fond-jade',    cat: 'fond', name: 'Jade',          price: 250,  val: 'linear-gradient(180deg,rgba(15,155,108,.3),rgba(5,20,15,.4))' },
    { id: 'fond-corail',  cat: 'fond', name: 'Corail',        price: 300,  val: 'linear-gradient(180deg,rgba(255,110,129,.28),rgba(40,10,18,.35))' },
    { id: 'fond-ambre',   cat: 'fond', name: 'Ambre',         price: 320,  val: 'linear-gradient(180deg,rgba(255,193,7,.25),rgba(40,25,5,.4))' },
    { id: 'fond-glacier', cat: 'fond', name: 'Glacier',       price: 380,  val: 'linear-gradient(180deg,rgba(131,164,212,.3),rgba(10,20,35,.4))' },
    { id: 'fond-onyx',    cat: 'fond', name: 'Onyx',          price: 500,  val: 'linear-gradient(180deg,rgba(60,20,80,.35),rgba(5,5,10,.55))' },
    { id: 'fond-cosmos',  cat: 'fond', name: 'Cosmos',        price: 600,  val: 'linear-gradient(180deg,rgba(120,80,255,.35),rgba(255,110,199,.2),rgba(5,5,20,.5))' },
    { id: 'fond-aurore',  cat: 'fond', name: 'Aurore',        price: 800,  rank: 5, val: 'linear-gradient(180deg,rgba(0,201,255,.3),rgba(146,254,157,.2),rgba(200,107,255,.25),rgba(5,5,20,.5))' },

    /* ---------------- Fonds de profil (inspiration manga) ---------------- */
    { id: 'fond-dojo',    cat: 'fond', name: 'Dojo',          price: 280,  val: 'linear-gradient(180deg,rgba(201,162,39,.25),rgba(30,20,10,.4))' },
    { id: 'fond-ombre',   cat: 'fond', name: 'Ombre ecarlate', price: 420, val: 'linear-gradient(180deg,rgba(226,0,26,.28),rgba(10,5,5,.5))' },

    /* ---------------- Avatars ---------------- */
    { id: 'av-renard',      cat: 'avatar', name: 'Renard',        price: 0,    val: '🦊' },
    { id: 'av-chat',        cat: 'avatar', name: 'Chat',          price: 0,    val: '🐱' },
    { id: 'av-panda',       cat: 'avatar', name: 'Panda',         price: 0,    val: '🐼' },
    { id: 'av-grenouille',  cat: 'avatar', name: 'Grenouille',    price: 0,    val: '🐸' },
    { id: 'av-ourson',      cat: 'avatar', name: 'Ourson',        price: 80,   val: '🐻' },
    { id: 'av-koala',       cat: 'avatar', name: 'Koala',         price: 80,   val: '🐨' },
    { id: 'av-hibou',       cat: 'avatar', name: 'Hibou',         price: 80,   val: '🦉' },
    { id: 'av-papillon',    cat: 'avatar', name: 'Papillon',      price: 90,   val: '🦋' },
    { id: 'av-tigre',       cat: 'avatar', name: 'Tigre',         price: 100,  val: '🐯' },
    { id: 'av-pieuvre',     cat: 'avatar', name: 'Pieuvre',       price: 100,  val: '🐙' },
    { id: 'av-fantome',     cat: 'avatar', name: 'Fantome',       price: 130,  val: '👻' },
    { id: 'av-perroquet',   cat: 'avatar', name: 'Perroquet',     price: 140,  val: '🦜' },
    { id: 'av-licorne',     cat: 'avatar', name: 'Licorne',       price: 150,  val: '🦄' },
    { id: 'av-loup',        cat: 'avatar', name: 'Loup',          price: 150,  val: '🐺' },
    { id: 'av-dauphin',     cat: 'avatar', name: 'Dauphin',       price: 180,  val: '🐬' },
    { id: 'av-aigle',       cat: 'avatar', name: 'Aigle',         price: 200,  val: '🦅' },
    { id: 'av-lion',        cat: 'avatar', name: 'Lion',          price: 220,  val: '🦁' },
    { id: 'av-dragon',      cat: 'avatar', name: 'Dragon',        price: 250,  val: '🐲' },
    { id: 'av-robot',       cat: 'avatar', name: 'Robot',         price: 250,  val: '🤖' },
    { id: 'av-vampire',     cat: 'avatar', name: 'Vampire',       price: 280,  val: '🧛' },
    { id: 'av-alien',       cat: 'avatar', name: 'Alien',         price: 300,  val: '👽' },
    { id: 'av-ninja',       cat: 'avatar', name: 'Ninja',         price: 400,  val: '🥷' },
    { id: 'av-genie',       cat: 'avatar', name: 'Genie',         price: 450,  rank: 4, val: '🧞' },
    { id: 'av-savant',      cat: 'avatar', name: 'Savant',        price: 500,  val: '🧑‍🔬' },
    { id: 'av-magicien',    cat: 'avatar', name: 'Magicien',      price: 600,  val: '🧙' },
    { id: 'av-fusee',       cat: 'avatar', name: 'Fusee',         price: 700,  val: '🚀' },
    { id: 'av-superheros',  cat: 'avatar', name: 'Super-heros',   price: 900,  rank: 9,  val: '🦸' },
    { id: 'av-couronne',    cat: 'avatar', name: 'Roi du calcul', price: 1200, rank: 13, val: '👑' },
    { id: 'av-envahisseur', cat: 'avatar', name: 'Envahisseur',   price: 1500, rank: 15, val: '👾' },
    { id: 'av-cerveau',     cat: 'avatar', name: 'Super cerveau', price: 2000, rank: 20, val: '🧠' },

    /* ---------------- Avatars (inspiration manga) ---------------- */
    { id: 'av-neko',        cat: 'avatar', name: 'Neko',          price: 150,  val: '😼' },
    { id: 'av-oni',         cat: 'avatar', name: 'Oni',           price: 220,  val: '👹' },
    { id: 'av-tengu',       cat: 'avatar', name: 'Tengu',         price: 240,  val: '👺' },
    { id: 'av-carte',       cat: 'avatar', name: 'Carte mystique', price: 260, val: '🎴' },
    { id: 'av-guerrier',    cat: 'avatar', name: 'Guerrier',      price: 320,  val: '🥋' },
    { id: 'av-chevalier',   cat: 'avatar', name: 'Chevalier',     price: 360,  val: '⚔️' },
    { id: 'av-samourai',    cat: 'avatar', name: 'Lame du samourai', price: 400, val: '🗡️' },
    { id: 'av-dragonlegend', cat: 'avatar', name: 'Dragon legendaire', price: 1300, rank: 8, val: '🐉' },

    /* ---------------- Titres ---------------- */
    { id: 'ti-debut',        cat: 'titre', name: 'Debutant',              price: 0,    val: 'Debutant' },
    { id: 'ti-explorateur',  cat: 'titre', name: 'Explorateur',           price: 90,   val: 'Explorateur des maths' },
    { id: 'ti-curieux',      cat: 'titre', name: 'Curieux',               price: 60,   val: 'Curieux des maths' },
    { id: 'ti-precision',    cat: 'titre', name: 'Precision',             price: 200,  val: 'Precision chirurgicale' },
    { id: 'ti-rapide',       cat: 'titre', name: 'Calculateur rapide',    price: 150,  val: 'Calculateur rapide' },
    { id: 'ti-geometre',     cat: 'titre', name: 'As de la geometrie',    price: 300,  val: 'As de la geometrie' },
    { id: 'ti-fraction',     cat: 'titre', name: 'Dompteur de fractions', price: 250,  val: 'Dompteur de fractions' },
    { id: 'ti-pythagore',    cat: 'titre', name: 'Ami de Pythagore',      price: 250,  val: 'Ami de Pythagore' },
    { id: 'ti-probabiliste', cat: 'titre', name: 'Joueur de probas',      price: 300,  val: 'Joueur de probabilites' },
    { id: 'ti-statisticien', cat: 'titre', name: 'Statisticien en chef',  price: 300,  val: 'Statisticien en chef' },
    { id: 'ti-algo',         cat: 'titre', name: 'Codeur en herbe',       price: 350,  val: 'Codeur en herbe' },
    { id: 'ti-marathon',     cat: 'titre', name: 'Marathonien',           price: 350,  val: 'Marathonien du calcul' },
    { id: 'ti-machine',      cat: 'titre', name: 'Machine a calculer',    price: 400,  val: 'Machine a calculer' },
    { id: 'ti-serein',       cat: 'titre', name: 'Serein pour le brevet', price: 600,  val: 'Serein pour le brevet' },
    { id: 'ti-eclair',       cat: 'titre', name: 'Eclair de genie',       price: 650,  val: 'Eclair de genie' },
    { id: 'ti-flamme',       cat: 'titre', name: 'En feu',                price: 800,  val: 'En feu 🔥' },
    { id: 'ti-invincible',   cat: 'titre', name: 'Invincible',            price: 850,  val: 'Invincible' },
    { id: 'ti-sage',         cat: 'titre', name: 'Sage des nombres',      price: 950,  val: 'Sage des nombres' },
    { id: 'ti-genie',        cat: 'titre', name: 'Petit genie',           price: 1200, rank: 11, val: 'Petit genie' },
    { id: 'ti-oracle',       cat: 'titre', name: 'Oracle du brevet',      price: 1450, rank: 12, val: 'Oracle du brevet' },
    { id: 'ti-mentor',       cat: 'titre', name: 'Mentor',                price: 1800, rank: 16, val: 'Mentor des maths' },
    { id: 'ti-immortel',     cat: 'titre', name: 'Immortel',              price: 2200, rank: 18, val: 'Immortel des maths' },
    { id: 'ti-empereur',     cat: 'titre', name: 'Empereur',              price: 3000, rank: 21, val: 'Empereur du calcul' },
    { id: 'ti-legende',      cat: 'titre', name: 'Legende du brevet',     price: 3500, rank: 24, val: 'Legende du brevet' },
    { id: 'ti-mythique',     cat: 'titre', name: 'Mythique',              price: 5000, rank: 27, val: 'Mythique ✦' },

    /* ---------------- Titres (inspiration manga) ---------------- */
    { id: 'ti-disciple',    cat: 'titre', name: 'Disciple du dojo',     price: 220,  val: 'Disciple du dojo' },
    { id: 'ti-sensei',      cat: 'titre', name: 'Sensei',               price: 750,  val: 'Sensei' },
    { id: 'ti-bushido',     cat: 'titre', name: 'Ame du Bushido',       price: 950,  val: 'Ame du Bushido' },
    { id: 'ti-auracombat',  cat: 'titre', name: 'Aura de combat',       price: 1150, rank: 6, val: 'Aura de combat' },
    { id: 'ti-dragonesprit', cat: 'titre', name: 'Esprit du dragon',    price: 1650, rank: 14, val: 'Esprit du dragon' },
    { id: 'ti-legendemanga', cat: 'titre', name: 'Legende ecarlate',    price: 4200, rank: 26, val: 'Legende ecarlate' },

    /* ---------------- Themes du site ---------------- */
    { id: 'theme-nuit',      cat: 'theme', name: 'Nuit',        price: 0,    val: 'theme-nuit' },
    { id: 'theme-ocean',     cat: 'theme', name: 'Ocean',       price: 300,  val: 'theme-ocean' },
    { id: 'theme-foret',     cat: 'theme', name: 'Foret',       price: 300,  val: 'theme-foret' },
    { id: 'theme-bonbon',    cat: 'theme', name: 'Bonbon',      price: 450,  val: 'theme-bonbon' },
    { id: 'theme-retro',     cat: 'theme', name: 'Retro',       price: 450,  val: 'theme-retro' },
    { id: 'theme-sakura',    cat: 'theme', name: 'Sakura',      price: 550,  val: 'theme-sakura' },
    { id: 'theme-lavande',   cat: 'theme', name: 'Lavande',     price: 600,  val: 'theme-lavande' },
    { id: 'theme-clair',     cat: 'theme', name: 'Jour',        price: 500,  val: 'theme-clair' },
    { id: 'theme-automne',   cat: 'theme', name: 'Automne',     price: 650,  val: 'theme-automne' },
    { id: 'theme-mono',      cat: 'theme', name: 'Monochrome',  price: 800,  rank: 6,  val: 'theme-mono' },
    { id: 'theme-neon',      cat: 'theme', name: 'Neon',        price: 1000, rank: 10, val: 'theme-neon' },
    { id: 'theme-cyberpunk', cat: 'theme', name: 'Cyberpunk',   price: 1300, rank: 13, val: 'theme-cyberpunk' },

    /* ---------------- Themes (inspiration manga) ---------------- */
    { id: 'theme-shonen', cat: 'theme', name: 'Shonen', price: 900, rank: 5, val: 'theme-shonen' },
    { id: 'theme-dojo',   cat: 'theme', name: 'Dojo',   price: 750, val: 'theme-dojo' },

    /* ---------------- Fonds d ecran ---------------- */
    { id: 'wp-aurore',     cat: 'ecran', name: 'Aurore',            price: 0,    val: 'wp-aurore' },
    { id: 'wp-uni',        cat: 'ecran', name: 'Uni',               price: 0,    val: 'wp-uni' },
    { id: 'wp-grille',     cat: 'ecran', name: 'Papier quadrille',  price: 150,  val: 'wp-grille' },
    { id: 'wp-vagues',     cat: 'ecran', name: 'Ondes',             price: 200,  val: 'wp-vagues' },
    { id: 'wp-bulles',     cat: 'ecran', name: 'Bulles',            price: 250,  val: 'wp-bulles' },
    { id: 'wp-etoiles',    cat: 'ecran', name: 'Ciel etoile',       price: 350,  val: 'wp-etoiles' },
    { id: 'wp-neige',      cat: 'ecran', name: 'Neige',             price: 400,  val: 'wp-neige' },
    { id: 'wp-maths',      cat: 'ecran', name: 'Pluie de symboles', price: 450,  val: 'wp-maths' },
    { id: 'wp-desert',     cat: 'ecran', name: 'Desert',            price: 450,  val: 'wp-desert' },
    { id: 'wp-papier',     cat: 'ecran', name: 'Cahier',            price: 500,  val: 'wp-papier' },
    { id: 'wp-abysse',     cat: 'ecran', name: 'Abysse',            price: 550,  val: 'wp-abysse' },
    { id: 'wp-confettis',  cat: 'ecran', name: 'Confettis',         price: 600,  val: 'wp-confettis' },
    { id: 'wp-coucher',    cat: 'ecran', name: 'Coucher de soleil', price: 700,  val: 'wp-coucher' },
    { id: 'wp-espace',     cat: 'ecran', name: 'Espace',            price: 900,  val: 'wp-espace' },
    { id: 'wp-circuit',    cat: 'ecran', name: 'Circuit',           price: 1100, rank: 11, val: 'wp-circuit' },
    { id: 'wp-matrix',     cat: 'ecran', name: 'Code',              price: 1300, rank: 14, val: 'wp-matrix' },
    { id: 'wp-marbre',     cat: 'ecran', name: 'Marbre',            price: 1600, rank: 15, val: 'wp-marbre' },
    { id: 'wp-arcenciel',  cat: 'ecran', name: 'Arc-en-ciel',       price: 2000, rank: 19, val: 'wp-arcenciel' },

    /* ---------------- Fonds d ecran (inspiration manga) ---------------- */
    { id: 'wp-vitesse',    cat: 'ecran', name: 'Lignes de vitesse', price: 700, rank: 4, val: 'wp-vitesse' },
    { id: 'wp-petales',    cat: 'ecran', name: 'Tempete de petales', price: 850, val: 'wp-petales' },

    /* ---------------- Effets de reponse (a la bonne reponse) ---------------- */
    { id: 'eff-defaut',     cat: 'effet', name: 'Aucun effet',        price: 0,    val: '' },
    { id: 'eff-etincelles', cat: 'effet', name: 'Etincelles',         price: 100,  val: '✨' },
    { id: 'eff-coeurs',     cat: 'effet', name: 'Pluie de coeurs',    price: 180,  val: '💖 💗 💕' },
    { id: 'eff-confettis',  cat: 'effet', name: 'Confettis',          price: 200,  val: '🎉 🎊' },
    { id: 'eff-feuilles',   cat: 'effet', name: 'Feuilles d automne', price: 250,  val: '🍁 🍂' },
    { id: 'eff-bulles',     cat: 'effet', name: 'Bulles',             price: 280,  val: '🫧' },
    { id: 'eff-eclair',     cat: 'effet', name: 'Eclair',             price: 350,  val: '⚡' },
    { id: 'eff-feu',        cat: 'effet', name: 'Explosion de feu',   price: 400,  val: '🔥' },
    { id: 'eff-etoiles',    cat: 'effet', name: 'Pluie d etoiles',    price: 500,  val: '🌟 ⭐' },
    { id: 'eff-feudartifice', cat: 'effet', name: 'Feu d artifice',   price: 750,  rank: 4, val: '🎆 🎇' },
    { id: 'eff-arcenciel',  cat: 'effet', name: 'Arc-en-ciel',        price: 1000, rank: 7,  val: '🌈 ✨' },
    { id: 'eff-couronnes',  cat: 'effet', name: 'Pluie de couronnes', price: 1700, rank: 15, val: '👑' },
    { id: 'eff-legendaire', cat: 'effet', name: 'Explosion legendaire', price: 3200, rank: 23, val: '🏆 👑 ✨ 💎' },

    /* ---------------- Effets (inspiration manga) ---------------- */
    { id: 'eff-ki',       cat: 'effet', name: 'Explosion de ki', price: 480, val: '💥 ⚡' },
    { id: 'eff-petales',  cat: 'effet', name: 'Petales de sakura', price: 320, val: '🌸' },
    { id: 'eff-lame',     cat: 'effet', name: 'Coup de lame',    price: 580, rank: 3, val: '⚔️ ✨' }
  ];

  var BY_ID = {};
  ITEMS.forEach(function (i) { BY_ID[i.id] = i; });

  /* Objets possedes des le depart */
  var DEFAULTS = {
    banniere: 'ban-defaut', contour: 'con-defaut', fond: 'fond-defaut',
    avatar: 'av-renard', titre: 'ti-debut', theme: 'theme-nuit', ecran: 'wp-aurore',
    effet: 'eff-defaut'
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
