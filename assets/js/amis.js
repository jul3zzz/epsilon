/* =======================================================================
   amis.js — systeme d amis en ligne et duels 1v1 (via Firebase / Firestore)
   Module ES : c est le seul fichier du site qui parle a un serveur externe.
   Expose window.Amis, une API simple utilisable depuis ui.js (script classique).
   NE FONCTIONNE PAS dans un apercu Claude (bac a sable sans acces reseau
   externe) : ca marche sur GitHub Pages et en local (index.html).
   ======================================================================= */
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js';
import {
  getAuth, signInAnonymously, onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js';
import {
  getFirestore, doc, getDoc, setDoc, updateDoc, deleteField,
  collection, query, where, onSnapshot, serverTimestamp, runTransaction
} from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js';

var firebaseConfig = {
  apiKey: "AIzaSyC_vIPoawHU_5Hvrm4jzp_H-cYEmFYTcb4",
  authDomain: "epsilon-48e88.firebaseapp.com",
  projectId: "epsilon-48e88",
  storageBucket: "epsilon-48e88.firebasestorage.app",
  messagingSenderId: "711230757002",
  appId: "1:711230757002:web:7415af79514f936977f573"
};

var THEMES_DUEL = [
  { id: 'mixte', name: 'Tous themes melanges', icon: '🎲' },
  { id: 'calcul', name: 'Calcul mental', icon: '⚡' },
  { id: 'fraction', name: 'Fractions', icon: '🍰' },
  { id: 'puissance', name: 'Puissances', icon: '🔟' },
  { id: 'racine', name: 'Racines carrees', icon: '√' },
  { id: 'litteral', name: 'Calcul litteral', icon: '🔤' },
  { id: 'equation', name: 'Equations', icon: '⚖️' },
  { id: 'arithm', name: 'Arithmetique', icon: '🔢' },
  { id: 'fonction', name: 'Fonctions', icon: '📉' },
  { id: 'proport', name: 'Proportionnalite', icon: '⚗️' },
  { id: 'stats', name: 'Statistiques', icon: '📊' },
  { id: 'proba', name: 'Probabilites', icon: '🎲' },
  { id: 'pythagore', name: 'Pythagore', icon: '📐' },
  { id: 'thales', name: 'Thales', icon: '🔺' },
  { id: 'trigo', name: 'Trigonometrie', icon: '🧭' },
  { id: 'geo', name: 'Geometrie & angles', icon: '📏' },
  { id: 'grandeur', name: 'Grandeurs & mesures', icon: '🧪' },
  { id: 'algo', name: 'Algorithmique', icon: '💻' }
];

var app = null, auth = null, db = null;
var uid = null;
var monId = null;              // identifiant en ligne (pseudo en ligne, en minuscules) une fois inscrit
var monPseudoAffiche = null;
var disponible = false;         // firebase a pu s initialiser
var connecte = false;           // authentification anonyme reussie

var ecouteursActifs = [];       // desabonnements en cours a nettoyer si besoin

function normaliseId(pseudo) {
  return String(pseudo || '').trim().toLowerCase().replace(/\s+/g, '');
}

/* ---------------- Initialisation ---------------- */
var pretResolve;
var pret = new Promise(function (resolve) { pretResolve = resolve; });

function demarrer() {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (e) {
    disponible = false;
    pretResolve(false);
    return;
  }
  disponible = true;

  // delai de secours : si rien ne repond (ex. reseau bloque, cas de l apercu Claude), on abandonne proprement
  var secours = setTimeout(function () { connecte = false; pretResolve(false); }, 6000);

  onAuthStateChanged(auth, function (user) {
    if (user) {
      clearTimeout(secours);
      uid = user.uid;
      connecte = true;
      pretResolve(true);
    }
  });

  signInAnonymously(auth).catch(function () {
    clearTimeout(secours);
    connecte = false;
    pretResolve(false);
  });
}
demarrer();

/* ---------------- Inscription (choix du pseudo en ligne) ---------------- */
function inscrire(pseudoSouhaite, avatarEmoji) {
  return pret.then(function (ok) {
    if (!ok) return { ok: false, msg: 'Le systeme d amis n est pas disponible ici (essaie sur GitHub Pages ou en local).' };
    var id = normaliseId(pseudoSouhaite);
    if (id.length < 3) return { ok: false, msg: 'Le pseudo en ligne doit faire au moins 3 caracteres.' };
    if (id.length > 18) return { ok: false, msg: 'Le pseudo en ligne doit faire au plus 18 caracteres.' };
    if (!/^[a-z0-9_.-]+$/.test(id)) return { ok: false, msg: 'Utilise seulement lettres, chiffres, - . et _ (sans accents ni espaces).' };

    var ref = doc(db, 'players', id);
    return getDoc(ref).then(function (snap) {
      if (snap.exists() && snap.data().uid !== uid) {
        return { ok: false, msg: 'Ce pseudo en ligne est deja pris par quelqu un d autre. Essaie une variante.' };
      }
      return setDoc(ref, {
        uid: uid, pseudo: String(pseudoSouhaite).trim(), avatar: avatarEmoji || '🙂',
        pieces: 0, updatedAt: serverTimestamp()
      }, { merge: true }).then(function () {
        monId = id;
        monPseudoAffiche = String(pseudoSouhaite).trim();
        return { ok: true, msg: 'Inscrit !', id: id };
      });
    }).catch(function (e) {
      return { ok: false, msg: 'Erreur de connexion : ' + (e && e.message ? e.message : 'reessaie plus tard.') };
    });
  });
}

/** Republie mon pseudo/avatar/pieces actuels (appelle regulierement pour que les amis voient un etat a jour). */
function publierProfil(pseudoAffiche, avatarEmoji, pieces) {
  if (!connecte || !monId) return Promise.resolve();
  return setDoc(doc(db, 'players', monId), {
    pseudo: pseudoAffiche, avatar: avatarEmoji, pieces: pieces, updatedAt: serverTimestamp()
  }, { merge: true }).catch(function () {});
}

/* ---------------- Amis ---------------- */
function chercherJoueur(pseudo) {
  var id = normaliseId(pseudo);
  return getDoc(doc(db, 'players', id)).then(function (snap) {
    if (!snap.exists()) return { ok: false, msg: 'Aucun joueur avec ce pseudo en ligne.' };
    var d = snap.data();
    return { ok: true, id: id, pseudo: d.pseudo, avatar: d.avatar, pieces: d.pieces };
  });
}

function pairKey(a, b) { return [a, b].sort().join('__'); }

function ajouterAmi(idAmi) {
  if (!connecte || !monId) return Promise.resolve({ ok: false, msg: 'Non connecte.' });
  if (idAmi === monId) return Promise.resolve({ ok: false, msg: 'Tu ne peux pas t ajouter toi-meme.' });
  return getDoc(doc(db, 'players', idAmi)).then(function (snap) {
    if (!snap.exists()) return { ok: false, msg: 'Ce joueur n existe pas.' };
    return setDoc(doc(db, 'friendships', pairKey(monId, idAmi)), {
      players: [monId, idAmi], createdAt: serverTimestamp()
    }).then(function () { return { ok: true, msg: 'Ami ajoute !' }; });
  }).catch(function (e) { return { ok: false, msg: 'Erreur : ' + (e && e.message || '?') }; });
}

/** Ecoute la liste d amis en temps reel. callback recoit un tableau de {id, pseudo, avatar, pieces}. */
function ecouterAmis(callback) {
  if (!connecte || !monId) { callback([]); return function () {}; }
  var q = query(collection(db, 'friendships'), where('players', 'array-contains', monId));
  var amisIds = [];
  var arretJoueurs = null;

  var arret = onSnapshot(q, function (snap) {
    var ids = [];
    snap.forEach(function (d) {
      var joueurs = d.data().players || [];
      var autre = joueurs.find(function (p) { return p !== monId; });
      if (autre) ids.push(autre);
    });
    amisIds = ids;
    if (arretJoueurs) arretJoueurs();
    if (!ids.length) { callback([]); arretJoueurs = null; return; }
    // on ecoute chaque fiche joueur individuellement pour avoir pseudo/avatar/pieces a jour
    var etats = {};
    var arrets = ids.map(function (id) {
      return onSnapshot(doc(db, 'players', id), function (s) {
        if (s.exists()) etats[id] = Object.assign({ id: id }, s.data());
        callback(ids.map(function (i) { return etats[i]; }).filter(Boolean));
      });
    });
    arretJoueurs = function () { arrets.forEach(function (f) { f(); }); };
  });

  return function () { arret(); if (arretJoueurs) arretJoueurs(); };
}

/* ---------------- Duels ---------------- */

/** Genere le meme lot de questions pour les deux joueurs (le defieur les tire, elles sont figees dans le duel). */
function genererQuestions(themeId, n) {
  var out = [];
  var recents = [];
  for (var i = 0; i < n; i++) {
    var t = themeId === 'mixte' ? U.pick(Q.THEMES).id : themeId;
    var q = Q.generate(t, U.ri(2, 4), recents);
    recents.push(q.gen);
    if (recents.length > 4) recents.shift();
    out.push({
      prompt: q.prompt, sub: q.sub || null, type: q.type, choices: q.choices || null,
      answer: q.answer, exact: !!q.exact, tol: q.tol == null ? null : q.tol, alt: q.alt || null,
      explain: q.explain || '', theme: q.theme, themeName: q.themeName, icon: q.icon, level: q.level
    });
  }
  return out;
}

function proposerDuel(idAmi, themeId, mise, nbQuestions) {
  if (!connecte || !monId) return Promise.resolve({ ok: false, msg: 'Non connecte.' });
  var questions = genererQuestions(themeId, nbQuestions || 8);
  var ref = doc(collection(db, 'duels'));
  return setDoc(ref, {
    from: monId, fromPseudo: monPseudoAffiche, to: idAmi,
    theme: themeId, mise: mise, nbQuestions: questions.length,
    questions: questions,
    status: 'attente',
    scoreFrom: null, scoreTo: null, finishedFrom: false, finishedTo: false,
    winner: null, resolved: false,
    createdAt: serverTimestamp()
  }).then(function () { return { ok: true, id: ref.id }; })
    .catch(function (e) { return { ok: false, msg: 'Erreur : ' + (e && e.message || '?') }; });
}

/** Ecoute tous les duels qui me concernent (recus + envoyes), tries du plus recent au plus ancien. */
function ecouterDuels(callback) {
  if (!connecte || !monId) { callback([]); return function () {}; }
  var recus = {}, envoyes = {};
  function emettre() {
    var tous = Object.keys(recus).map(function (k) { return recus[k]; })
      .concat(Object.keys(envoyes).map(function (k) { return envoyes[k]; }));
    tous.sort(function (a, b) { return (b._ts || 0) - (a._ts || 0); });
    callback(tous);
  }
  var a1 = onSnapshot(query(collection(db, 'duels'), where('to', '==', monId)), function (snap) {
    recus = {};
    snap.forEach(function (d) { recus[d.id] = Object.assign({ id: d.id }, d.data(), { _ts: d.data().createdAt ? d.data().createdAt.toMillis() : Date.now() }); });
    emettre();
  });
  var a2 = onSnapshot(query(collection(db, 'duels'), where('from', '==', monId)), function (snap) {
    envoyes = {};
    snap.forEach(function (d) { envoyes[d.id] = Object.assign({ id: d.id }, d.data(), { _ts: d.data().createdAt ? d.data().createdAt.toMillis() : Date.now() }); });
    emettre();
  });
  return function () { a1(); a2(); };
}

function ecouterDuel(duelId, callback) {
  return onSnapshot(doc(db, 'duels', duelId), function (snap) {
    callback(snap.exists() ? Object.assign({ id: snap.id }, snap.data()) : null);
  });
}

function accepterDuel(duelId) {
  return updateDoc(doc(db, 'duels', duelId), { status: 'encours' })
    .then(function () { return { ok: true }; })
    .catch(function (e) { return { ok: false, msg: 'Erreur : ' + (e && e.message || '?') }; });
}
function refuserDuel(duelId) {
  return updateDoc(doc(db, 'duels', duelId), { status: 'refuse' })
    .then(function () { return { ok: true }; })
    .catch(function (e) { return { ok: false, msg: 'Erreur : ' + (e && e.message || '?') }; });
}
function annulerDuel(duelId) {
  return updateDoc(doc(db, 'duels', duelId), { status: 'annule' })
    .then(function () { return { ok: true }; })
    .catch(function (e) { return { ok: false, msg: 'Erreur : ' + (e && e.message || '?') }; });
}

/**
 * Soumet mon score final. Si les deux scores sont presents, resout le duel
 * (gagnant, egalite) de facon atomique pour eviter une double resolution.
 */
function soumettreScore(duelId, monRole, score) {
  var ref = doc(db, 'duels', duelId);
  return runTransaction(db, function (tx) {
    return tx.get(ref).then(function (snap) {
      if (!snap.exists()) throw new Error('Duel introuvable.');
      var d = snap.data();
      var champScore = monRole === 'from' ? 'scoreFrom' : 'scoreTo';
      var champFini = monRole === 'from' ? 'finishedFrom' : 'finishedTo';
      var maj = {};
      maj[champScore] = score;
      maj[champFini] = true;
      var autreScore = monRole === 'from' ? d.scoreTo : d.scoreFrom;
      var autreFini = monRole === 'from' ? d.finishedTo : d.finishedFrom;
      if (autreFini && autreScore !== null && autreScore !== undefined) {
        var sFrom = monRole === 'from' ? score : d.scoreFrom;
        var sTo = monRole === 'to' ? score : d.scoreTo;
        maj.status = 'termine';
        maj.resolved = true;
        maj.winner = sFrom === sTo ? 'egalite' : (sFrom > sTo ? d.from : d.to);
      }
      tx.update(ref, maj);
    });
  }).then(function () { return { ok: true }; })
    .catch(function (e) { return { ok: false, msg: 'Erreur : ' + (e && e.message || '?') }; });
}

/* ---------------- API publique ---------------- */
window.Amis = {
  THEMES_DUEL: THEMES_DUEL,
  pret: function () { return pret; },
  estDisponible: function () { return disponible; },
  estConnecte: function () { return connecte; },
  monId: function () { return monId; },
  inscrire: inscrire,
  publierProfil: publierProfil,
  chercherJoueur: chercherJoueur,
  ajouterAmi: ajouterAmi,
  ecouterAmis: ecouterAmis,
  proposerDuel: proposerDuel,
  ecouterDuels: ecouterDuels,
  ecouterDuel: ecouterDuel,
  accepterDuel: accepterDuel,
  refuserDuel: refuserDuel,
  annulerDuel: annulerDuel,
  soumettreScore: soumettreScore
};
