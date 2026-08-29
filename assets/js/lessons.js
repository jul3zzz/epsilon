/* =======================================================================
   lessons.js — fiches de lecon (cours, techniques de pro, pieges) par theme
   Chaque fiche : accroche, sections (cours), astuces, pieges, recap.
   ======================================================================= */
(function (global) {
  'use strict';
  var L = {};
  function lesson(id, data) { L[id] = data; }

  /* ================================================================== */
  /* 1. CALCUL MENTAL */
  /* ================================================================== */
  lesson('calcul', {
    accroche: 'Le calcul mental rapporte gros au brevet : pas de calculatrice sur une bonne partie de l epreuve. Ce sont surtout des automatismes a construire.',
    sections: [
      { titre: 'Les priorites operatoires', html:
        '<p>Dans un calcul sans parentheses, on effectue toujours dans cet ordre :</p>' +
        '<ul><li>1. Ce qui est entre parentheses</li>' +
        '<li>2. Les puissances (x², x³...)</li>' +
        '<li>3. Les multiplications et divisions, de gauche a droite</li>' +
        '<li>4. Les additions et soustractions, de gauche a droite</li></ul>' +
        '<p>Exemple : <span class="math">5 + 3 × 4</span> = 5 + 12 = 17 (et surtout pas 8 × 4 = 32).</p>' },
      { titre: 'Additionner et soustraire par paliers', html:
        '<p>Pour additionner 47 + 38, on peut arrondir : 47 + 40 − 2 = 85. C est souvent plus rapide que l addition posee mentale.</p>' +
        '<p>Pour soustraire, chercher le complement : 82 − 47, c est « combien pour aller de 47 a 82 » : 3 (pour 50) + 32 (pour 82) = 35.</p>' },
      { titre: 'Multiplier par decomposition', html:
        '<p>On utilise la distributivite pour casser un nombre en morceaux faciles.</p>' +
        '<p>Exemple : <span class="math">47 × 8</span> = (50 − 3) × 8 = 50×8 − 3×8 = 400 − 24 = 376.</p>' }
    ],
    astuces: [
      'Multiplier par 5 : multiplier par 10 puis diviser par 2 (47×5 = 470÷2 = 235).',
      'Multiplier par 25 : multiplier par 100 puis diviser par 4 (12×25 = 1200÷4 = 300).',
      'Multiplier par 99 : multiplier par 100 puis soustraire le nombre (36×99 = 3600−36 = 3564).',
      'Multiplier par 101 : multiplier par 100 puis ajouter le nombre (36×101 = 3600+36 = 3636).',
      'Pour un carre proche d un carre connu : 21² = 20² + 2×20 + 1 = 400+40+1 = 441.'
    ],
    pieges: [
      'Faire l addition avant la multiplication quand il n y a pas de parentheses.',
      'Confondre « diviser par 2 » (moitie) et « diviser par 4 » (quart) en allant trop vite.'
    ],
    recap: 'Priorites : parentheses, puissances, × ÷, puis + −. Pour aller vite : decompose les nombres (47 = 50−3) et connais par coeur ×5, ×25, ×99, ×101.'
  });

  /* ================================================================== */
  /* 2. FRACTIONS */
  /* ================================================================== */
  lesson('fraction', {
    accroche: 'Les fractions reviennent partout au brevet : calcul, probabilites, proportionnalite. Quatre operations a maitriser a fond.',
    sections: [
      { titre: 'Simplifier une fraction', html:
        '<p>On divise le numerateur ET le denominateur par leur PGCD (plus grand diviseur commun).</p>' +
        '<p>Exemple : <span class="math">24/36</span>, PGCD(24,36)=12, donc 24/36 = 2/3.</p>' },
      { titre: 'Additionner et soustraire', html:
        '<p>Il faut le MEME denominateur. Si les denominateurs sont differents, on cherche un denominateur commun (souvent le PPCM), on transforme chaque fraction, puis on additionne les numerateurs.</p>' +
        '<p>Exemple : <span class="math">1/4 + 1/6</span> : denominateur commun 12 → 3/12 + 2/12 = 5/12.</p>' },
      { titre: 'Multiplier et diviser', html:
        '<p>Multiplier : numerateurs entre eux, denominateurs entre eux.<br>' +
        'Diviser : on multiplie par l inverse de la seconde fraction (on « retourne » a/b en b/a).</p>' +
        '<p>Exemple : <span class="math">2/3 ÷ 4/5</span> = 2/3 × 5/4 = 10/12 = 5/6.</p>' }
    ],
    astuces: [
      'Avant de multiplier deux fractions, simplifie en croix (un numerateur avec l autre denominateur) : les nombres deviennent plus petits, moins de risque d erreur.',
      'Pour comparer deux fractions sans les convertir en decimaux, fais un produit en croix : a/b et c/d, compare a×d et b×c.',
      'Si un denominateur est un multiple de l autre (ex. 4 et 12), pas besoin de PPCM complique : le plus grand denominateur suffit comme denominateur commun.'
    ],
    pieges: [
      'Additionner numerateurs ET denominateurs directement (1/2 + 1/3 n est PAS 2/5).',
      'Oublier de simplifier le resultat final alors que la consigne le demande.',
      'Diviser sans inverser la deuxieme fraction.'
    ],
    recap: 'Meme denominateur pour + et − ; numerateurs et denominateurs separement pour × ; multiplier par l inverse pour ÷. Toujours simplifier a la fin (PGCD).'
  });

  /* ================================================================== */
  /* 3. PUISSANCES */
  /* ================================================================== */
  lesson('puissance', {
    accroche: 'Les puissances servent a ecrire des grands ou petits nombres simplement, et preparent la notation scientifique tres testee au brevet.',
    sections: [
      { titre: 'Definitions de base', html:
        '<p><span class="math">a<sup>n</sup></span> = a × a × ... × a (n fois). Cas particuliers : a<sup>1</sup> = a, a<sup>0</sup> = 1 (si a≠0), et a<sup>−n</sup> = 1/a<sup>n</sup>.</p>' },
      { titre: 'Les 4 regles a connaitre par coeur', html:
        '<ul><li><span class="math">a<sup>m</sup> × a<sup>n</sup> = a<sup>m+n</sup></span> (meme base : on ADDITIONNE les exposants)</li>' +
        '<li><span class="math">a<sup>m</sup> ÷ a<sup>n</sup> = a<sup>m−n</sup></span> (on SOUSTRAIT les exposants)</li>' +
        '<li><span class="math">(a<sup>m</sup>)<sup>n</sup> = a<sup>m×n</sup></span> (on MULTIPLIE les exposants)</li>' +
        '<li><span class="math">(a×b)<sup>n</sup> = a<sup>n</sup> × b<sup>n</sup></span></li></ul>' },
      { titre: 'Notation scientifique', html:
        '<p>Un nombre s ecrit <span class="math">a × 10<sup>n</sup></span> avec 1 ≤ a &lt; 10 et n un entier relatif.</p>' +
        '<p>Exemple : 742 800 = 7,428 × 10⁵. On compte de combien de rangs on a deplace la virgule.</p>' }
    ],
    astuces: [
      'Les 4 regles ne marchent QUE si les puissances ont la meme base. Sinon, il faut d abord tout ramener a la meme base si possible.',
      'Pour l ecriture scientifique, compte simplement le nombre de chiffres avant la virgule pour trouver l exposant.',
      'Retenir que 2¹⁰ = 1024 ≈ 10³ aide a estimer vite un ordre de grandeur.'
    ],
    pieges: [
      '(a+b)^n N EST PAS EGAL a a^n + b^n (piege tres frequent).',
      'a^m × a^n N EST PAS a^(m×n) : c est une addition des exposants, pas une multiplication.',
      '−3² = −9 (le signe n est pas eleve au carre) alors que (−3)² = 9 (la parenthese, elle, met le signe au carre aussi).'
    ],
    recap: 'Meme base : × additionne les exposants, ÷ les soustrait, puissance de puissance les multiplie. Notation scientifique : un seul chiffre non nul avant la virgule.'
  });

  /* ================================================================== */
  /* 4. RACINES CARREES */
  /* ================================================================== */
  lesson('racine', {
    accroche: 'La racine carree est l operation inverse du carre. Elle est indispensable pour Pythagore et pour resoudre certaines equations.',
    sections: [
      { titre: 'Definition', html:
        '<p>Pour a positif, <span class="math">√a</span> est le nombre positif dont le carre vaut a. Donc <span class="math">(√a)² = a</span> et <span class="math">√(a²) = a</span> (si a ≥ 0).</p>' },
      { titre: 'Regles de calcul', html:
        '<ul><li><span class="math">√(a×b) = √a × √b</span></li>' +
        '<li><span class="math">√(a/b) = √a / √b</span> (b ≠ 0)</li>' +
        '<li>Attention : <span class="math">√(a+b) ≠ √a + √b</span> — cette regle n existe pas.</li></ul>' },
      { titre: 'Simplifier une racine', html:
        '<p>On cherche le plus grand carre parfait qui divise le nombre sous la racine.</p>' +
        '<p>Exemple : <span class="math">√75</span> = √(25×3) = √25 × √3 = 5√3.</p>' }
    ],
    astuces: [
      'Connaitre les carres parfaits jusqu a 20² (1, 4, 9, 16, 25... 400) permet de reperer une simplification en un coup d oeil.',
      'Pour simplifier √n, teste les carres parfaits dans l ordre decroissant (4, 9, 16, 25...) jusqu a en trouver un qui divise n.',
      'Pour additionner des racines, elles doivent avoir le MEME nombre sous le radical : 3√2 + 5√2 = 8√2, mais 3√2 + 5√3 ne se simplifie pas.'
    ],
    pieges: [
      '√(a+b) ≠ √a + √b : erreur tres classique a l ecrit.',
      'Croire que √n est toujours un nombre entier — la plupart du temps ce n est pas le cas.'
    ],
    recap: '√a × √b = √(a×b). Pour simplifier, extraire le plus grand carre parfait possible. Jamais de somme sous deux racines separees.'
  });

  /* ================================================================== */
  /* 5. CALCUL LITTERAL */
  /* ================================================================== */
  lesson('litteral', {
    accroche: 'Developper, factoriser, utiliser les identites remarquables : la boite a outils de l algebre, indispensable pour resoudre des equations.',
    sections: [
      { titre: 'Developper', html:
        '<p>Distributivite simple : <span class="math">k(a+b) = ka + kb</span>.</p>' +
        '<p>Double distributivite : <span class="math">(a+b)(c+d) = ac + ad + bc + bd</span> — quatre produits a ne pas oublier.</p>' },
      { titre: 'Les identites remarquables', html:
        '<ul><li><span class="math">(a+b)² = a² + 2ab + b²</span></li>' +
        '<li><span class="math">(a−b)² = a² − 2ab + b²</span></li>' +
        '<li><span class="math">(a+b)(a−b) = a² − b²</span></li></ul>' +
        '<p>Elles servent aussi bien a developper qu a factoriser (dans l autre sens).</p>' },
      { titre: 'Factoriser', html:
        '<p>Chercher un facteur commun a tous les termes, ou reconnaitre une identite remarquable a l envers.</p>' +
        '<p>Exemple : <span class="math">9x² − 25 = (3x)² − 5² = (3x−5)(3x+5)</span>.</p>' }
    ],
    astuces: [
      'Pour reperer une identite remarquable, cherche deux carres et un double produit qui correspond : a²+2ab+b² saute aux yeux si tu connais la formule.',
      'Pour factoriser a²−b², cherche deux carres separes par un signe moins : c est presque toujours (a−b)(a+b).',
      'Verifie toujours un developpement ou une factorisation en remplacant x par une valeur simple (x=1 par exemple) des deux cotes : les resultats doivent etre egaux.'
    ],
    pieges: [
      '(a+b)² N EST PAS a² + b² : il manque le double produit 2ab.',
      'Oublier un des quatre termes en developpant (a+b)(c+d), en particulier les deux termes croises.',
      'Confondre developper (on enleve les parentheses) et factoriser (on en remet).'
    ],
    recap: '(a+b)²=a²+2ab+b², (a−b)²=a²−2ab+b², (a+b)(a−b)=a²−b². Pour factoriser : facteur commun d abord, identite remarquable ensuite.'
  });

  /* ================================================================== */
  /* 6. EQUATIONS */
  /* ================================================================== */
  lesson('equation', {
    accroche: 'Resoudre une equation, c est trouver la ou les valeurs de x qui rendent une egalite vraie. C est LA competence centrale du brevet.',
    sections: [
      { titre: 'Le principe de la balance', html:
        '<p>Une equation est comme une balance equilibree : ce qu on fait a un membre (ajouter, soustraire, multiplier, diviser par un nombre non nul), il faut le faire aussi a l autre pour garder l equilibre.</p>' },
      { titre: 'Resoudre ax + b = c', html:
        '<p>On isole x en deux etapes : d abord on enleve b (on soustrait b des deux cotes), puis on divise par a.</p>' +
        '<p>Exemple : <span class="math">3x + 5 = 20</span> → 3x = 15 → x = 5.</p>' },
      { titre: 'Equation produit nul', html:
        '<p><span class="math">A × B = 0</span> si et seulement si A = 0 ou B = 0. Tres utile quand l equation est deja factorisee : pas besoin de developper.</p>' }
    ],
    astuces: [
      'Verifie systematiquement ta solution en la remplacant dans l equation de depart : les deux membres doivent donner le meme nombre.',
      'Si l equation est deja sous forme de produit (x−2)(x+5)=0, resous directement avec « produit nul » — inutile de developper.',
      'En inequation, imagine une droite graduee : ca aide a visualiser dans quel sens va la solution.'
    ],
    pieges: [
      'Diviser (ou multiplier) une inequation par un nombre NEGATIF sans inverser le sens de l inegalite.',
      'Diviser par une expression qui contient x sans etre sur qu elle n est jamais nulle.',
      'Oublier une des deux solutions dans une equation produit (A=0 ET B=0 sont deux cas a examiner).'
    ],
    recap: 'Isoler x en faisant la meme operation des deux cotes. Produit nul : A×B=0 → A=0 ou B=0. En inequation, diviser par un negatif inverse le sens.'
  });

  /* ================================================================== */
  /* 7. ARITHMETIQUE */
  /* ================================================================== */
  lesson('arithm', {
    accroche: 'Diviseurs, nombres premiers, PGCD : des outils pour comprendre la structure des nombres entiers, souvent utilises dans des problemes concrets.',
    sections: [
      { titre: 'Divisibilite', html:
        '<p>Criteres pratiques : divisible par 2 (chiffre des unites pair), par 5 (se termine par 0 ou 5), par 10 (se termine par 0), par 3 ou 9 (somme des chiffres divisible par 3 ou 9).</p>' },
      { titre: 'Nombres premiers', html:
        '<p>Un nombre premier a exactement deux diviseurs : 1 et lui-meme (2, 3, 5, 7, 11, 13...). Tout nombre entier se decompose de facon unique en produit de facteurs premiers.</p>' },
      { titre: 'PGCD et l algorithme d Euclide', html:
        '<p>Le PGCD (plus grand diviseur commun) sert a simplifier une fraction ou a repartir des objets en lots identiques.</p>' +
        '<p>Algorithme d Euclide : on divise le plus grand nombre par le plus petit, on note le reste, on remplace le plus grand par le plus petit et le plus petit par le reste, et on recommence jusqu a obtenir un reste nul. Le dernier reste non nul est le PGCD.</p>' }
    ],
    astuces: [
      'Critere de 3 et de 9 : additionne les chiffres du nombre ; si la somme est un multiple de 3 (ou de 9), le nombre l est aussi.',
      'Un probleme du type « repartir en lots identiques sans rien laisser » se resout presque toujours avec un PGCD.',
      'Pour trouver rapidement le PGCD de petits nombres, compare directement leurs listes de diviseurs.'
    ],
    pieges: [
      'Confondre PGCD (pour repartir/simplifier) et PPCM (pour des evenements qui se repetent en meme temps).',
      'Oublier 1 et le nombre lui-meme dans la liste de ses diviseurs.'
    ],
    recap: 'Nombre premier = exactement 2 diviseurs. PGCD via l algorithme d Euclide : diviser, garder le reste, recommencer. PGCD sert a simplifier une fraction ou repartir en lots identiques.'
  });

  /* ================================================================== */
  /* 8. FONCTIONS */
  /* ================================================================== */
  lesson('fonction', {
    accroche: 'Une fonction associe a chaque nombre un unique resultat. Comprendre le vocabulaire (image, antecedent) debloque la moitie des exercices.',
    sections: [
      { titre: 'Vocabulaire de base', html:
        '<p><span class="math">f(x)</span> se lit « l image de x par f ». Si f(3) = 7, on dit que 7 est l image de 3, et que 3 est UN antecedent de 7.</p>' },
      { titre: 'Fonctions lineaires et affines', html:
        '<p>Fonction lineaire : <span class="math">f(x) = ax</span>. Sa representation graphique est une droite qui passe par l origine (situation de proportionnalite).</p>' +
        '<p>Fonction affine : <span class="math">f(x) = ax + b</span>. Sa representation graphique est une droite qui ne passe pas forcement par l origine.</p>' },
      { titre: 'Le coefficient directeur', html:
        '<p>Il se calcule avec deux points de la droite : <span class="math">a = (y₂ − y₁) / (x₂ − x₁)</span>. Il indique de combien monte (ou descend) la droite quand x avance de 1.</p>' }
    ],
    astuces: [
      'Pour trouver un antecedent, on resout une equation : « antecedent de 7 par f » revient a resoudre f(x) = 7.',
      'b, dans f(x)=ax+b, est l ordonnee a l origine : c est la valeur de f(0), l endroit ou la droite coupe l axe vertical.',
      'a positif : la droite monte. a negatif : la droite descend. a = 0 : la droite est horizontale.'
    ],
    pieges: [
      'Confondre image et antecedent (le sens de lecture change tout).',
      'Croire que toute fonction affine est lineaire : c est faux des que b est different de 0.'
    ],
    recap: 'f(x) = image de x. Antecedent = valeur qui donne cette image (on resout une equation). Fonction affine f(x)=ax+b ; lineaire seulement si b=0.'
  });

  /* ================================================================== */
  /* 9. PROPORTIONNALITE */
  /* ================================================================== */
  lesson('proport', {
    accroche: 'Pourcentages, echelles, recettes de cuisine : la proportionnalite est partout dans la vie courante, et tres presente au brevet.',
    sections: [
      { titre: 'Tableau de proportionnalite', html:
        '<p>Deux grandeurs sont proportionnelles si on passe de l une a l autre en multipliant toujours par le meme nombre (le coefficient de proportionnalite). On peut aussi utiliser un produit en croix.</p>' },
      { titre: 'Pourcentages', html:
        '<p><span class="math">p % de n</span> se calcule avec <span class="math">n × p / 100</span>.</p>' +
        '<p>Exemple : 15 % de 80 = 80 × 0,15 = 12.</p>' },
      { titre: 'Evolutions et coefficient multiplicateur', html:
        '<p>Hausse de p % : on multiplie par <span class="math">(1 + p/100)</span>.<br>' +
        'Baisse de p % : on multiplie par <span class="math">(1 − p/100)</span>.</p>' +
        '<p>Pour des evolutions successives, on MULTIPLIE les coefficients entre eux (jamais on n additionne les pourcentages).</p>' }
    ],
    astuces: [
      'Le coefficient multiplicateur permet de calculer le resultat final en une seule operation, sans passer par une etape intermediaire.',
      'Pour retrouver le prix AVANT une remise, on DIVISE par le coefficient (pas l inverse).',
      'Une hausse de 20 % suivie d une baisse de 20 % ne redonne PAS le prix de depart (car les 20 % ne portent pas sur la meme valeur).'
    ],
    pieges: [
      'Additionner les pourcentages d evolutions successives au lieu de multiplier les coefficients.',
      'Confondre « diminuer de 20 % » (coefficient 0,8) et « diminuer a 20 % » (coefficient 0,2).'
    ],
    recap: 'p % de n = n×p/100. Coefficient multiplicateur : hausse = 1+p/100, baisse = 1−p/100. Evolutions successives : on multiplie les coefficients.'
  });

  /* ================================================================== */
  /* 10. STATISTIQUES */
  /* ================================================================== */
  lesson('stats', {
    accroche: 'Resumer une serie de donnees avec quelques nombres cles : moyenne, mediane, etendue. Simple, mais des pieges classiques a eviter.',
    sections: [
      { titre: 'La moyenne', html:
        '<p><span class="math">moyenne = somme des valeurs ÷ effectif total</span>.</p>' +
        '<p>Avec des effectifs (moyenne ponderee), on multiplie chaque valeur par son effectif avant de sommer, puis on divise par l effectif TOTAL (pas par le nombre de categories).</p>' },
      { titre: 'La mediane', html:
        '<p>La mediane partage la serie RANGEE en deux groupes de meme taille. Si l effectif est impair, c est la valeur centrale. Si l effectif est pair, c est la moyenne des deux valeurs centrales.</p>' },
      { titre: 'L etendue', html:
        '<p><span class="math">etendue = valeur maximale − valeur minimale</span>. Elle mesure la dispersion de la serie.</p>' }
    ],
    astuces: [
      'Toujours RANGER la serie dans l ordre croissant avant de chercher la mediane — c est l erreur numero un.',
      'Pour reperer vite si l effectif est pair ou impair, compte le nombre total de valeurs avant de chercher la mediane.',
      'Dans un tableau d effectifs, l effectif total est la somme de la LIGNE effectif, pas le nombre de valeurs differentes.'
    ],
    pieges: [
      'Chercher la mediane sans avoir range les valeurs.',
      'Diviser par le nombre de valeurs distinctes au lieu de l effectif total pour une moyenne ponderee.'
    ],
    recap: 'Moyenne = somme ÷ effectif total. Mediane = valeur centrale d une serie RANGEE (moyenne des 2 valeurs du milieu si effectif pair). Etendue = max − min.'
  });

  /* ================================================================== */
  /* 11. PROBABILITES */
  /* ================================================================== */
  lesson('proba', {
    accroche: 'Calculer la chance qu un evenement se produise. Des situations tres concretes (des, cartes, urnes) avec une formule simple au coeur.',
    sections: [
      { titre: 'La formule de base', html:
        '<p>Si toutes les issues sont equiprobables : <span class="math">P(evenement) = nombre de cas favorables ÷ nombre de cas possibles</span>.</p>' +
        '<p>P vaut toujours entre 0 (impossible) et 1 (certain).</p>' },
      { titre: 'L evenement contraire', html:
        '<p><span class="math">P(non A) = 1 − P(A)</span>. Tres utile des que l enonce contient « au moins un » : il est souvent plus simple de calculer le contraire (« aucun »).</p>' },
      { titre: 'Tirages successifs', html:
        '<p>Avec remise : les probabilites ne changent pas d un tirage a l autre, on multiplie directement.<br>' +
        'Sans remise : il faut actualiser le nombre total d objets a chaque tirage avant de multiplier.</p>' }
    ],
    astuces: [
      'Verifie que la somme des probabilites de TOUS les evenements possibles fait bien 1 : ca permet de detecter une erreur de calcul.',
      'Pour deux des, un tableau a double entree (6×6 = 36 cases) evite d oublier des issues.',
      'Des que l enonce dit « au moins un », pense a passer par l evenement contraire.'
    ],
    pieges: [
      'Oublier de diminuer le nombre total d objets apres un tirage sans remise.',
      'Croire qu un evenement a toujours 1 chance sur 2 (« ca passe ou ca ne passe pas » n est pas un argument mathematique).'
    ],
    recap: 'P = cas favorables ÷ cas possibles. P(contraire) = 1 − P(A). Sans remise : le nombre total change a chaque tirage, il faut le mettre a jour.'
  });

  /* ================================================================== */
  /* 12. PYTHAGORE */
  /* ================================================================== */
  lesson('pythagore', {
    accroche: 'Le theoreme le plus utilise du brevet en geometrie. Il relie les longueurs des cotes d un triangle RECTANGLE, uniquement.',
    sections: [
      { titre: 'Le theoreme', html:
        '<p>Si un triangle ABC est rectangle en B, alors <span class="math">AC² = AB² + BC²</span>, ou AC est l hypotenuse (le cote le plus long, en face de l angle droit).</p>' },
      { titre: 'La reciproque', html:
        '<p>Elle sert a PROUVER qu un triangle est rectangle : si le carre du plus grand cote est egal a la somme des carres des deux autres, alors le triangle est rectangle (l angle droit etant en face du plus grand cote).</p>' +
        '<p>Si l egalite n est pas verifiee, le triangle n est pas rectangle.</p>' },
      { titre: 'Trouver un cote de l angle droit', html:
        '<p>Si on connait l hypotenuse et un cote de l angle droit, on SOUSTRAIT les carres (au lieu d additionner) pour trouver le cote manquant.</p>' }
    ],
    astuces: [
      'Connaitre les triplets pythagoriciens classiques (3-4-5, 6-8-10, 5-12-13, 8-15-17) permet de reconnaitre un triangle rectangle sans calcul.',
      'Identifie toujours l angle droit EN PREMIER sur la figure : ca dit immediatement quel cote est l hypotenuse.',
      'Pour verifier une reponse, remplace les longueurs trouvees dans l egalite de Pythagore : ca doit tomber juste.'
    ],
    pieges: [
      'Appliquer Pythagore sur un triangle qui n est pas rectangle (ca ne marche que dans ce cas).',
      'Additionner les carres au lieu de les soustraire quand on cherche un cote de l angle droit (et non l hypotenuse).'
    ],
    recap: 'Triangle rectangle en B : AC² = AB² + BC² (AC = hypotenuse). Pour un cote de l angle droit, on soustrait. La reciproque prouve qu un triangle est rectangle.'
  });

  /* ================================================================== */
  /* 13. THALES */
  /* ================================================================== */
  lesson('thales', {
    accroche: 'Thales relie les longueurs dans une configuration de triangles avec une parallele. Il faut surtout bien reperer la figure et l ordre des rapports.',
    sections: [
      { titre: 'La configuration', html:
        '<p>Deux droites (AB) et (AC) se coupent en A. M est sur (AB), N est sur (AC), et (MN) est PARALLELE a (BC). C est la condition indispensable pour utiliser Thales.</p>' },
      { titre: 'L egalite de Thales', html:
        '<p><span class="math">AM/AB = AN/AC = MN/BC</span>.</p>' +
        '<p>On l utilise pour calculer une longueur manquante des qu on en connait trois parmi les six.</p>' },
      { titre: 'La reciproque', html:
        '<p>Elle sert a prouver que deux droites sont paralleles : on compare AM/AB et AN/AC. Si les deux rapports sont EGAUX, alors (MN) et (BC) sont paralleles.</p>' }
    ],
    astuces: [
      'Ecris toujours les trois rapports dans le MEME ordre (le petit triangle en haut, le grand en bas, ou l inverse mais toujours pareil).',
      'Pour calculer une longueur inconnue, isole-la avec un produit en croix apres avoir pose l egalite des rapports.',
      'Pour la reciproque, ne compare QUE les deux rapports que tu peux calculer avec les donnees de l enonce (souvent AM/AB et AN/AC, jamais celui avec MN/BC si MN est inconnue).'
    ],
    pieges: [
      'Melanger l ordre des sommets dans les rapports (AM/AB doit correspondre a AN/AC, pas a AC/AN).',
      'Utiliser Thales sans que l enonce ait precise que les droites sont paralleles.'
    ],
    recap: 'Si (MN)//(BC) : AM/AB = AN/AC = MN/BC. Pour la reciproque, comparer AM/AB et AN/AC : egaux → paralleles.'
  });

  /* ================================================================== */
  /* 14. TRIGONOMETRIE */
  /* ================================================================== */
  lesson('trigo', {
    accroche: 'La trigonometrie relie les angles et les longueurs dans un triangle rectangle, avec trois formules a connaitre par coeur.',
    sections: [
      { titre: 'SOH-CAH-TOA', html:
        '<p>Dans un triangle rectangle, pour un angle donne :</p>' +
        '<ul><li><span class="math">cos(angle) = cote adjacent / hypotenuse</span></li>' +
        '<li><span class="math">sin(angle) = cote oppose / hypotenuse</span></li>' +
        '<li><span class="math">tan(angle) = cote oppose / cote adjacent</span></li></ul>' },
      { titre: 'Reperer les cotes', html:
        '<p>L hypotenuse est toujours le cote le plus long, en face de l angle droit. Le cote OPPOSE est en face de l angle etudie. Le cote ADJACENT touche l angle etudie (sans etre l hypotenuse).</p>' +
        '<p>Attention : oppose et adjacent changent si on change d angle !</p>' },
      { titre: 'Trouver un angle', html:
        '<p>Si on connait un rapport (par exemple sin = 0,5), on utilise la fonction inverse a la calculatrice : sin⁻¹, cos⁻¹ ou tan⁻¹.</p>' }
    ],
    astuces: [
      'Repere d abord l angle droit, puis l angle etudie, puis identifie hypotenuse / oppose / adjacent dans cet ordre.',
      'Si tu cherches une longueur, choisis la formule qui contient les deux cotes que tu connais/cherches.',
      'Si tu cherches un angle, choisis la formule avec les deux cotes DONT TU CONNAIS LES LONGUEURS.'
    ],
    pieges: [
      'Confondre cote oppose et cote adjacent (ils dependent de l angle choisi).',
      'Utiliser la trigonometrie sur un triangle qui n est pas rectangle.'
    ],
    recap: 'cos = adjacent/hypotenuse, sin = oppose/hypotenuse, tan = oppose/adjacent. Pour un angle : fonction inverse (cos⁻¹, sin⁻¹, tan⁻¹) a la calculatrice.'
  });

  /* ================================================================== */
  /* 15. GEOMETRIE & ANGLES */
  /* ================================================================== */
  lesson('geo', {
    accroche: 'Angles et transformations : des regles de base tres rentables au brevet, faciles a securiser avec un peu de methode.',
    sections: [
      { titre: 'Angles dans un triangle', html:
        '<p>La somme des angles d un triangle vaut toujours <span class="math">180°</span>. Pour un polygone a n cotes, la somme des angles vaut <span class="math">(n−2) × 180°</span>.</p>' },
      { titre: 'Angles particuliers', html:
        '<p>Complementaires : leur somme fait 90°. Supplementaires : leur somme fait 180°. Avec deux droites paralleles coupees par une secante : les angles alternes-internes sont egaux, et les angles correspondants sont egaux.</p>' },
      { titre: 'Les transformations', html:
        '<p>Symetrie centrale, translation, rotation, homothetie : chacune transforme les coordonnees d un point selon une regle precise (par exemple, la symetrie par rapport a l origine change (x;y) en (−x;−y)).</p>' +
        '<p>Translation et rotation conservent les longueurs et les angles. L homothetie multiplie toutes les longueurs par son rapport k.</p>' }
    ],
    astuces: [
      'Verifie toujours si les droites sont paralleles AVANT d utiliser une propriete d angles alternes-internes ou correspondants — c est une condition obligatoire.',
      'Pour les transformations, retiens simplement l effet sur les coordonnees (x;y) plutot que d essayer de visualiser a chaque fois.',
      'Un dessin, meme approximatif, permet souvent de verifier si une reponse est plausible.'
    ],
    pieges: [
      'Confondre angles alternes-internes et angles correspondants.',
      'Croire que la translation change la taille ou la forme d une figure — c est faux, seule l homothetie le fait.'
    ],
    recap: 'Triangle : somme des angles = 180°. Complementaires → 90°, supplementaires → 180°. Translation/rotation conservent tout ; homothetie multiplie les longueurs par k.'
  });

  /* ================================================================== */
  /* 16. GRANDEURS & MESURES */
  /* ================================================================== */
  lesson('grandeur', {
    accroche: 'Conversions, aires, volumes, vitesse : des formules a connaitre et un piege tres classique sur les unites d aires et de volumes.',
    sections: [
      { titre: 'Conversions d unites', html:
        '<p>Pour les longueurs, chaque unite du tableau de conversion vaut 10 fois la suivante. Pour les AIRES, chaque unite vaut 100 fois la suivante (on saute 2 colonnes a la fois). Pour les VOLUMES, chaque unite vaut 1000 fois la suivante (3 colonnes a la fois).</p>' },
      { titre: 'Formules essentielles', html:
        '<ul><li>Aire du disque : <span class="math">π × r²</span> — Perimetre du cercle : <span class="math">2 × π × r</span></li>' +
        '<li>Volume du cylindre : <span class="math">π × r² × h</span></li>' +
        '<li>Volume du cone et de la pyramide : <span class="math">(1/3) × aire de base × hauteur</span></li>' +
        '<li>Volume de la boule : <span class="math">(4/3) × π × r³</span></li></ul>' },
      { titre: 'Vitesse et agrandissement', html:
        '<p>Vitesse = distance ÷ temps. Pour un agrandissement (ou une reduction) de rapport k : les longueurs sont multipliees par k, les AIRES par k², les VOLUMES par k³.</p>' }
    ],
    astuces: [
      'En cas de doute sur une conversion, ecris l unite complete (cm², cm³) et raisonne colonne par colonne dans le tableau plutot que de deviner.',
      'Retiens « aires en k², volumes en k³ » : c est l une des erreurs les plus frequentes au brevet.',
      'Verifie toujours l unite demandee dans la question (cm, cm², cm³...) avant de rendre ta reponse finale.'
    ],
    pieges: [
      'Utiliser le meme facteur de conversion pour une longueur, une aire et un volume.',
      'Oublier π dans une formule de disque, cylindre, cone ou boule.'
    ],
    recap: 'Longueurs ×10 par cran, aires ×100, volumes ×1000. Agrandissement de rapport k : longueurs ×k, aires ×k², volumes ×k³. Ne jamais oublier π.'
  });

  /* ================================================================== */
  /* 17. ALGORITHMIQUE */
  /* ================================================================== */
  lesson('algo', {
    accroche: 'Lire et suivre un script (type Scratch) pas a pas : variables, boucles et conditions. Une competence recente mais bien presente au brevet.',
    sections: [
      { titre: 'Les variables', html:
        '<p>Une variable est une boite qui stocke une valeur. Cette valeur peut changer au cours du script (« mettre A a 5 », puis « ajouter 3 a A » → A vaut maintenant 8).</p>' },
      { titre: 'Les boucles', html:
        '<p>« Repeter n fois » execute le bloc d instructions n fois de suite, sans s arreter. Chaque tour de boucle part de la valeur laissee par le tour precedent : les variables gardent leur valeur.</p>' },
      { titre: 'Les conditions', html:
        '<p>« Si...alors...sinon » fait choisir au script une branche selon un test. Il faut d abord evaluer si la condition est vraie ou fausse, puis executer UNIQUEMENT la branche correspondante.</p>' }
    ],
    astuces: [
      'Pour suivre un script, fais un tableau avec une colonne par variable et une ligne par etape : tu notes la nouvelle valeur a chaque instruction.',
      'Dans une boucle, compte precisement le nombre de tours effectues — c est la source d erreur numero un.',
      'Evalue toujours la condition AVANT d executer une instruction dans un si...alors...sinon.'
    ],
    pieges: [
      'Oublier qu une variable garde sa valeur d un tour de boucle a l autre (elle ne se remet pas a zero toute seule).',
      'Executer les deux branches d un si...sinon au lieu d une seule.'
    ],
    recap: 'Variable = boite qui garde sa valeur. Boucle « repeter n fois » = n tours consecutifs. Condition : on teste, puis on execute UNE SEULE branche. Un tableau de suivi evite les erreurs.'
  });

  global.LECONS = L;
})(window);
