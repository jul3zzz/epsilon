# ε Epsilon

Un site de maths ludique pour préparer le **brevet de 3<sup>e</sup>** : des mini-jeux de calcul
mental et d'exercices couvrant **tout le programme**, avec une difficulté qui s'adapte
automatiquement à chaque élève, un système de rangs, des pièces et une boutique de
personnalisations.

Le site fonctionne **hors ligne** : aucune connexion internet, aucun serveur, aucune inscription
en ligne. Tout est enregistré dans le navigateur, sur cet ordinateur.

---

## ▶ Comment le lancer

**Double-clique sur `index.html`.** C'est tout.

Si le site affiche un avertissement disant que la sauvegarde est impossible (cela arrive avec
certains réglages de navigateur), lance plutôt `demarrer.bat` : il ouvre le site via un petit
serveur local, ce qui garantit la sauvegarde. (Nécessite Python, déjà installé sur beaucoup de PC.)

---

## 👤 Le compte

Un **pseudo** et un **mot de passe** suffisent. Plusieurs élèves peuvent avoir leur compte sur le
même ordinateur : chacun retrouve sa progression, ses pièces et ses personnalisations.

Le mot de passe n'est jamais stocké en clair (empreinte SHA-256 avec sel). Cela dit, comme tout
est local, cette protection sert à séparer les comptes entre frères et sœurs, pas à résister à
une vraie attaque.

---

## 🎮 Les six modes de jeu

| Mode | Format | À quoi ça sert |
|---|---|---|
| ⚡ **Sprint 90 secondes** | 90 s, tous thèmes | Se mesurer, faire du volume |
| 💥 **Calcul flash** | 15 questions, 12 s chacune | Réflexes de calcul mental |
| 🎯 **Entraînement par thème** | 10 questions, un chapitre | Travailler un point précis |
| 🧠 **Révision ciblée** | 12 questions | **Rejoue tes erreurs passées** + tes chapitres faibles |
| ❤️ **Survie** | 3 vies, difficulté croissante | Aller le plus loin possible |
| 📜 **Défi Brevet** | 20 questions, 12 min, tout le programme | Se mettre en condition d'examen |

---

## 📚 Les 17 chapitres couverts (programme de 3<sup>e</sup>)

**Nombres et calculs** — calcul mental, fractions, puissances et notation scientifique,
racines carrées, calcul littéral (développement, factorisation, identités remarquables),
équations et inéquations, arithmétique (divisibilité, nombres premiers, PGCD).

**Fonctions** — images, antécédents, fonctions linéaires et affines, coefficient directeur,
programmes de calcul.

**Organisation et gestion de données** — proportionnalité, pourcentages (hausses, baisses,
évolutions successives, retour au prix initial), échelles, statistiques (moyenne, médiane,
étendue, effectifs), probabilités (dés, urnes, cartes, tirages successifs).

**Géométrie** — théorème de Pythagore et sa réciproque (avec figures), théorème de Thalès,
trigonométrie (cos, sin, tan), angles, transformations (symétries, translation, rotation,
homothétie).

**Grandeurs et mesures** — conversions, périmètres, aires, volumes (pavé, cylindre, cône,
pyramide, boule), vitesse, agrandissement-réduction, débit, masse volumique.

**Algorithmique** — scripts de type Scratch : variables, boucles, conditions, déplacements.

Chaque exercice est **généré aléatoirement** à 5 niveaux de difficulté, avec une **correction
détaillée** expliquant la méthode — pas seulement la réponse.

---

## 🧠 La mémoire et l'adaptation

Le site tient une fiche par élève **et par chapitre** :

- un **score de compétence** par chapitre (système de type Elo, entre 550 et 1850) qui monte
  quand l'élève réussit et descend quand il échoue, en tenant compte de la difficulté de la
  question et de la rapidité de la réponse ;
- le niveau des questions posées vise en permanence **environ 78 % de réussite** : assez dur pour
  progresser, assez accessible pour ne pas décourager ;
- les débutants commencent volontairement en douceur (niveaux 1-2) le temps que le site mesure
  leur niveau ;
- les **exercices ratés sont mémorisés** (jusqu'à 80) et reproposés à l'identique en Révision
  ciblée ; une fois réussis, ils sortent de la liste ;
- les modes Sprint et Survie piochent plus souvent dans les **chapitres les plus fragiles** ;
- l'accueil affiche un conseil personnalisé et les chapitres à travailler en priorité.

---

## 🏆 Rangs, pièces et boutique

**29 rangs** : Bois IV → Bronze → Argent → Or → Platine → Diamant → Maître → **Légende du Brevet**.
On gagne de l'XP à chaque bonne réponse (plus la question est difficile, plus ça rapporte), avec
des bonus de précision, de série et de partie quotidienne.

**Les pièces** se gagnent à chaque bonne réponse, à chaque montée de rang, avec la série de jours
consécutifs et les 18 succès.

**7 catégories dans la boutique** — bannières de profil, contours de photo (certains animés),
fonds de profil, avatars, titres, thèmes de couleurs du site, fonds d'écran du site.
**77 objets** au total, certains réservés aux rangs élevés.

---

## 🗂 Organisation des fichiers

```
maths-brevet/
├── index.html                    structure de la page
├── demarrer.bat                  lancement via un serveur local (optionnel)
└── assets/
    ├── css/style.css             styles, thèmes et fonds d'écran
    └── js/
        ├── utils.js              hasard, maths, formatage, comparaison des réponses, SHA-256
        ├── questions.js          thèmes + générateurs (nombres, calcul, algèbre)
        ├── questions-geo.js      générateurs (données, géométrie, grandeurs, algo) + moteur
        ├── shop.js               catalogue des personnalisations
        ├── store.js              comptes, sauvegarde locale, mémoire de l'élève
        ├── progression.js        rangs, XP, pièces, adaptation du niveau, succès
        ├── games.js              modes de jeu et déroulement d'une partie
        ├── ui.js                 rendu des pages et déroulement visuel
        └── app.js                connexion et démarrage
```

### Ajouter un exercice

Dans `questions.js` ou `questions-geo.js` :

```js
reg('mon-exo', 'fraction', [2, 4], function (L) {   // identifiant, thème, niveaux min/max
  var a = U.ri(2, 9);                                // entier aléatoire
  return {
    prompt: 'Calcule ' + U.math(a + ' × 3'),         // énoncé (HTML autorisé)
    answer: String(a * 3),                           // réponse attendue
    explain: a + ' × 3 = ' + (a * 3) + '.'           // correction affichée
  };
});
```

Pour un QCM, renvoyer `Q.qcm({prompt: ..., explain: ...}, bonneReponse, [mauvaises...])`.
Ajouter `exact: true` quand l'écriture compte (fraction irréductible), ou `tol: 0.06` pour
tolérer un arrondi.

---

## 💾 Sauvegarde

Tout est dans le `localStorage` du navigateur, sous la clé `epsilon.v1`. La progression est
donc liée à **ce navigateur sur cet ordinateur** : elle disparaît si l'on efface les données de
navigation. Le bouton **Profil → Exporter ma progression** permet d'en garder une copie.
