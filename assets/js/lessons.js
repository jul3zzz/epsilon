/* =======================================================================
   lessons.js — fiches de lecon approfondies par theme
   Chaque fiche : accroche, vocabulaire, sections (cours), exemples resolus
   pas a pas, methode a suivre, astuces de pro, pieges classiques, recap.
   ======================================================================= */
(function (global) {
  'use strict';
  var L = {};
  function lesson(id, data) { L[id] = data; }

  /* ================================================================== */
  /* 1. CALCUL MENTAL */
  /* ================================================================== */
  lesson('calcul', {
    accroche: 'Le calcul mental rapporte gros au brevet : pas de calculatrice sur une bonne partie de l epreuve. Ce sont surtout des automatismes a construire, pas un don inne.',
    vocabulaire: [
      { mot: 'Priorites operatoires', def: 'Ordre obligatoire pour effectuer les operations d un calcul : parentheses, puissances, × et ÷, puis + et −.' },
      { mot: 'Terme', def: 'Chacun des nombres separes par + ou − dans une somme.' },
      { mot: 'Facteur', def: 'Chacun des nombres separes par × dans un produit.' },
      { mot: 'Complement', def: 'Nombre qu il faut ajouter a un autre pour atteindre une valeur ronde (le complement de 47 a 100 est 53).' }
    ],
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
        '<p>Exemple : <span class="math">47 × 8</span> = (50 − 3) × 8 = 50×8 − 3×8 = 400 − 24 = 376.</p>' },
      { titre: 'Diviser par paliers', html:
        '<p>Pour diviser un grand nombre, on peut le decouper en tranches faciles a diviser puis additionner les resultats.</p>' +
        '<p>Exemple : <span class="math">satisfait 448 ÷ 4</span> = (400 + 48) ÷ 4 = 100 + 12 = 112.</p>' },
      { titre: 'Reperer un ordre de grandeur', html:
        '<p>Avant de calculer precisement, arrondir chaque nombre permet d estimer le resultat et de detecter une erreur enorme.</p>' +
        '<p>Exemple : 312 × 48 est proche de 300 × 50 = 15 000, donc un resultat comme 1 500 ou 150 000 serait suspect.</p>' }
    ],
    exemples: [
      { titre: 'Un calcul avec priorites et parentheses', enonce: 'Calcule 8 + 2 × (11 − 6)',
        etapes: ['On calcule d abord la parenthese : 11 − 6 = 5', 'On effectue la multiplication : 2 × 5 = 10', 'On termine par l addition : 8 + 10 = 18'],
        reponse: '8 + 2 × (11 − 6) = 18' },
      { titre: 'Multiplier vite par decomposition', enonce: 'Calcule 63 × 8 mentalement',
        etapes: ['On decompose 63 en 60 + 3', '60 × 8 = 480', '3 × 8 = 24', 'On additionne : 480 + 24 = 504'],
        reponse: '63 × 8 = 504' }
    ],
    methode: { titre: 'Le reflexe a avoir devant tout calcul', etapes: [
      'Repere s il y a des parentheses : elles passent toujours en premier.',
      'Cherche les puissances eventuelles.',
      'Fais les × et ÷ de gauche a droite.',
      'Termine par les + et − de gauche a droite.',
      'Verifie que ton resultat a un ordre de grandeur coherent.'
    ] },
    astuces: [
      'Multiplier par 5 : multiplier par 10 puis diviser par 2 (47×5 = 470÷2 = 235).',
      'Multiplier par 25 : multiplier par 100 puis diviser par 4 (12×25 = 1200÷4 = 300).',
      'Multiplier par 99 : multiplier par 100 puis soustraire le nombre (36×99 = 3600−36 = 3564).',
      'Multiplier par 101 : multiplier par 100 puis ajouter le nombre (36×101 = 3600+36 = 3636).',
      'Pour un carre proche d un carre connu : 21² = 20² + 2×20 + 1 = 400+40+1 = 441.',
      'Diviser par 5 : multiplier par 2 puis diviser par 10 (85÷5 = 170÷10 = 17).',
      'Pour additionner plusieurs nombres, regroupe ceux qui font un compte rond (7+8+3 : fais 7+3=10 d abord, puis +8).',
      'Double puis double encore pour multiplier par 4 ; triple pour multiplier par 3 : souvent plus rapide qu une multiplication posee.'
    ],
    pieges: [
      'Faire l addition avant la multiplication quand il n y a pas de parentheses.',
      'Confondre « diviser par 2 » (moitie) et « diviser par 4 » (quart) en allant trop vite.',
      'Oublier qu une soustraction ou une division ne sont pas commutatives : 8 − 3 ≠ 3 − 8.',
      'Se tromper de sens en cherchant un complement (47 + ? = 100, pas 100 + ? = 47).'
    ],
    recap: 'Priorites : parentheses, puissances, × ÷, puis + −. Pour aller vite : decompose les nombres (47 = 50−3) et connais par coeur ×5, ×25, ×99, ×101.'
  });

  /* ================================================================== */
  /* 2. FRACTIONS */
  /* ================================================================== */
  lesson('fraction', {
    accroche: 'Les fractions reviennent partout au brevet : calcul, probabilites, proportionnalite. Quatre operations a maitriser a fond, et une regle d or : simplifier au bon moment.',
    vocabulaire: [
      { mot: 'Numerateur', def: 'Le nombre du haut dans une fraction (dans 3/4, c est 3).' },
      { mot: 'Denominateur', def: 'Le nombre du bas dans une fraction (dans 3/4, c est 4). Il ne doit jamais etre nul.' },
      { mot: 'Fraction irreductible', def: 'Fraction que l on ne peut plus simplifier : le numerateur et le denominateur n ont plus de diviseur commun (a part 1).' },
      { mot: 'PGCD', def: 'Plus Grand Diviseur Commun de deux nombres : sert a simplifier une fraction en une seule etape.' },
      { mot: 'Fraction inverse', def: 'La fraction b/a est l inverse de a/b. Leur produit vaut toujours 1.' }
    ],
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
        '<p>Exemple : <span class="math">2/3 ÷ 4/5</span> = 2/3 × 5/4 = 10/12 = 5/6.</p>' },
      { titre: 'Comparer deux fractions', html:
        '<p>Deux methodes possibles : les mettre au meme denominateur et comparer les numerateurs, ou faire un produit en croix (a/b et c/d : comparer a×d et b×c).</p>' },
      { titre: 'La fraction d une quantite', html:
        '<p>« Les 3/4 de 60 » se calcule en multipliant : 60 × 3/4 = 60 × 3 ÷ 4 = 180 ÷ 4 = 45. On peut aussi diviser d abord, puis multiplier : 60 ÷ 4 × 3 = 15 × 3 = 45.</p>' }
    ],
    exemples: [
      { titre: 'Addition de fractions a denominateurs differents', enonce: 'Calcule 2/3 + 3/5',
        etapes: ['Le denominateur commun est 3×5 = 15', '2/3 = (2×5)/15 = 10/15', '3/5 = (3×3)/15 = 9/15', 'On additionne : 10/15 + 9/15 = 19/15'],
        reponse: '2/3 + 3/5 = 19/15' },
      { titre: 'Division de deux fractions', enonce: 'Calcule 5/6 ÷ 2/3, resultat simplifie',
        etapes: ['On multiplie par l inverse : 5/6 × 3/2', 'On multiplie numerateurs et denominateurs : (5×3)/(6×2) = 15/12', 'PGCD(15,12) = 3, on simplifie : 15/12 = 5/4'],
        reponse: '5/6 ÷ 2/3 = 5/4' }
    ],
    methode: { titre: 'Methode pour additionner ou soustraire des fractions', etapes: [
      'Verifie si les denominateurs sont deja identiques.',
      'Sinon, trouve un denominateur commun (le PPCM des deux, ou leur produit si tu ne le trouves pas).',
      'Transforme chaque fraction pour qu elle ait ce denominateur.',
      'Additionne ou soustrais uniquement les numerateurs.',
      'Simplifie le resultat si possible (PGCD).'
    ] },
    astuces: [
      'Avant de multiplier deux fractions, simplifie en croix (un numerateur avec l autre denominateur) : les nombres deviennent plus petits, moins de risque d erreur.',
      'Pour comparer deux fractions sans les convertir en decimaux, fais un produit en croix : a/b et c/d, compare a×d et b×c.',
      'Si un denominateur est un multiple de l autre (ex. 4 et 12), pas besoin de PPCM complique : le plus grand denominateur suffit comme denominateur commun.',
      'Pour transformer une fraction en nombre decimal, fais simplement la division du numerateur par le denominateur.',
      'Une fraction egale a 1 a le meme numerateur et denominateur ; une fraction superieure a 1 a un numerateur plus grand que son denominateur.',
      'Pour multiplier un entier par une fraction, ecris l entier sous forme n/1 : ca rend le calcul plus systematique.'
    ],
    pieges: [
      'Additionner numerateurs ET denominateurs directement (1/2 + 1/3 n est PAS 2/5).',
      'Oublier de simplifier le resultat final alors que la consigne le demande.',
      'Diviser sans inverser la deuxieme fraction.',
      'Simplifier en soustrayant un meme nombre au numerateur et au denominateur au lieu de diviser (faux : (5−2)/(10−2) ≠ 5/10).',
      'Oublier que le denominateur ne peut jamais etre zero.'
    ],
    recap: 'Meme denominateur pour + et − ; numerateurs et denominateurs separement pour × ; multiplier par l inverse pour ÷. Toujours simplifier a la fin (PGCD).'
  });

  /* ================================================================== */
  /* 3. PUISSANCES */
  /* ================================================================== */
  lesson('puissance', {
    accroche: 'Les puissances servent a ecrire des grands ou petits nombres simplement, et preparent la notation scientifique tres testee au brevet.',
    vocabulaire: [
      { mot: 'Puissance', def: 'Ecriture a<sup>n</sup> qui represente a multiplie par lui-meme n fois. a est la base, n est l exposant.' },
      { mot: 'Notation scientifique', def: 'Ecriture d un nombre sous la forme a × 10<sup>n</sup>, avec 1 ≤ a &lt; 10 et n un entier relatif.' },
      { mot: 'Exposant negatif', def: 'a<sup>−n</sup> represente l inverse de a<sup>n</sup>, soit 1/a<sup>n</sup>.' }
    ],
    sections: [
      { titre: 'Definitions de base', html:
        '<p><span class="math">a<sup>n</sup></span> = a × a × ... × a (n fois). Cas particuliers : a<sup>1</sup> = a, a<sup>0</sup> = 1 (si a≠0), et a<sup>−n</sup> = 1/a<sup>n</sup>.</p>' },
      { titre: 'Les 4 regles a connaitre par coeur', html:
        '<ul><li><span class="math">a<sup>m</sup> × a<sup>n</sup> = a<sup>m+n</sup></span> (meme base : on ADDITIONNE les exposants)</li>' +
        '<li><span class="math">a<sup>m</sup> ÷ a<sup>n</sup> = a<sup>m−n</sup></span> (on SOUSTRAIT les exposants)</li>' +
        '<li><span class="math">(a<sup>m</sup>)<sup>n</sup> = a<sup>m×n</sup></span> (on MULTIPLIE les exposants)</li>' +
        '<li><span class="math">(a×b)<sup>n</sup> = a<sup>n</sup> × b<sup>n</sup></span></li></ul>' },
      { titre: 'Le signe d une puissance', html:
        '<p>Une puissance d exposant PAIR est toujours positive (ou nulle), meme si la base est negative : (−3)² = 9. Une puissance d exposant IMPAIR garde le signe de la base : (−3)³ = −27.</p>' },
      { titre: 'Notation scientifique', html:
        '<p>Un nombre s ecrit <span class="math">a × 10<sup>n</sup></span> avec 1 ≤ a &lt; 10 et n un entier relatif.</p>' +
        '<p>Exemple : 742 800 = 7,428 × 10⁵. On compte de combien de rangs on a deplace la virgule.</p>' +
        '<p>Pour un petit nombre : 0,00divide521 = 5,21 × 10⁻³ (la virgule avance, l exposant est negatif).</p>' },
      { titre: 'Multiplier deux ecritures scientifiques', html:
        '<p>On multiplie les mantisses entre elles et on additionne les exposants, puis on rajuste si la mantisse depasse 10.</p>' +
        '<p>Exemple : (4×10³) × (3×10⁵) = 12×10⁸ = 1,2×10⁹ (on a du deplacer la virgule d un rang de plus).</p>' }
    ],
    exemples: [
      { titre: 'Utiliser les regles de calcul', enonce: 'Simplifie A = (2³)² × 2⁴ ÷ 2⁵',
        etapes: ['Puissance de puissance : (2³)² = 2⁶', 'Produit de meme base : 2⁶ × 2⁴ = 2¹⁰', 'Quotient de meme base : 2¹⁰ ÷ 2⁵ = 2⁵', 'On calcule : 2⁵ = 32'],
        reponse: 'A = 32' },
      { titre: 'Ecrire en notation scientifique', enonce: 'Ecris 0,0004821 en notation scientifique',
        etapes: ['On deplace la virgule pour n avoir qu un chiffre non nul devant : 4,821', 'On compte les rangs deplaces vers la droite : 4 rangs', 'L exposant est donc negatif : 10⁻⁴'],
        reponse: '0,0004821 = 4,821 × 10⁻⁴' }
    ],
    methode: { titre: 'Pour passer un nombre en notation scientifique', etapes: [
      'Repere le premier chiffre non nul du nombre.',
      'Place la virgule juste apres ce chiffre : tu obtiens la mantisse (entre 1 et 10).',
      'Compte le nombre de rangs dont tu as deplace la virgule.',
      'Si tu as deplace la virgule vers la GAUCHE (nombre etait grand), l exposant est POSITIF.',
      'Si tu as deplace la virgule vers la DROITE (nombre etait petit), l exposant est NEGATIF.'
    ] },
    astuces: [
      'Les 4 regles ne marchent QUE si les puissances ont la meme base. Sinon, il faut d abord tout ramener a la meme base si possible.',
      'Pour l ecriture scientifique, compte simplement le nombre de chiffres avant la virgule pour trouver l exposant.',
      'Retenir que 2¹⁰ = 1024 ≈ 10³ aide a estimer vite un ordre de grandeur.',
      'a⁻¹ est toujours l inverse de a, quel que soit a (sauf 0) : 5⁻¹ = 1/5.',
      'Pour verifier un calcul de puissance rapidement, compte le nombre de facteurs : 3⁴ a bien 4 facteurs « 3 ».',
      'Une puissance de 10 positive donne un nombre avec des zeros a droite ; une puissance de 10 negative donne un nombre avec des zeros apres la virgule.'
    ],
    pieges: [
      '(a+b)^n N EST PAS EGAL a a^n + b^n (piege tres frequent).',
      'a^m × a^n N EST PAS a^(m×n) : c est une addition des exposants, pas une multiplication.',
      '−3² = −9 (le signe n est pas eleve au carre) alors que (−3)² = 9 (la parenthese, elle, met le signe au carre aussi).',
      'Confondre 10⁻³ (un petit nombre, 0,001) et −10³ (un grand nombre negatif, −1000).',
      'Oublier de rajuster la mantisse quand un produit depasse 10 en notation scientifique (ex. 8×10² × 5×10³ = 40×10⁵ = 4×10⁶, pas 40×10⁵).'
    ],
    recap: 'Meme base : × additionne les exposants, ÷ les soustrait, puissance de puissance les multiplie. Notation scientifique : un seul chiffre non nul avant la virgule.'
  });

  /* ================================================================== */
  /* 4. RACINES CARREES */
  /* ================================================================== */
  lesson('racine', {
    accroche: 'La racine carree est l operation inverse du carre. Elle est indispensable pour Pythagore et pour resoudre certaines equations.',
    vocabulaire: [
      { mot: 'Racine carree', def: 'Pour a positif, √a est le nombre positif dont le carre vaut a.' },
      { mot: 'Carre parfait', def: 'Un nombre qui est le carre d un entier (1, 4, 9, 16, 25, 36...). Sa racine carree est un entier.' },
      { mot: 'Radical', def: 'Le symbole √, et par extension l expression qui se trouve sous ce symbole.' }
    ],
    sections: [
      { titre: 'Definition', html:
        '<p>Pour a positif, <span class="math">√a</span> est le nombre positif dont le carre vaut a. Donc <span class="math">(√a)² = a</span> et <span class="math">√(a²) = a</span> (si a ≥ 0).</p>' },
      { titre: 'Regles de calcul', html:
        '<ul><li><span class="math">√(a×b) = √a × √b</span></li>' +
        '<li><span class="math">√(a/b) = √a / √b</span> (b ≠ 0)</li>' +
        '<li>Attention : <span class="math">√(a+b) ≠ √a + √b</span> — cette regle n existe pas.</li></ul>' },
      { titre: 'Simplifier une racine', html:
        '<p>On cherche le plus grand carre parfait qui divise le nombre sous la racine.</p>' +
        '<p>Exemple : <span class="math">√75</span> = √(25×3) = √25 × √3 = 5√3.</p>' },
      { titre: 'Additionner des racines', html:
        '<p>On ne peut additionner que des racines qui ont le MEME nombre sous le radical, en additionnant les coefficients devant.</p>' +
        '<p>Exemple : <span class="math">3√2 + 5√2 = 8√2</span>, mais 3√2 + 5√3 ne peut pas se simplifier davantage.</p>' },
      { titre: 'Encadrer une racine', html:
        '<p>Pour encadrer √n entre deux entiers consecutifs, on cherche les deux carres parfaits qui entourent n.</p>' +
        '<p>Exemple : 49 &lt; 60 &lt; 64 donc 7 &lt; √60 &lt; 8.</p>' }
    ],
    exemples: [
      { titre: 'Simplifier une racine carree', enonce: 'Simplifie √180',
        etapes: ['On decompose 180 en produit avec un carre parfait : 180 = 36 × 5', '√180 = √36 × √5', '√36 = 6, donc √180 = 6√5'],
        reponse: '√180 = 6√5' },
      { titre: 'Reduire une expression avec des racines', enonce: 'Reduis 2√12 + 3√27',
        etapes: ['√12 = √(4×3) = 2√3, donc 2√12 = 4√3', '√27 = √(9×3) = 3√3, donc 3√27 = 9√3', 'On additionne : 4√3 + 9√3 = 13√3'],
        reponse: '2√12 + 3√27 = 13√3' }
    ],
    methode: { titre: 'Pour simplifier une racine carree', etapes: [
      'Liste les carres parfaits que tu connais (4, 9, 16, 25, 36, 49, 64, 81, 100...).',
      'Cherche le plus GRAND carre parfait qui divise le nombre sous la racine.',
      'Ecris le nombre comme un produit de ce carre parfait et d un autre facteur.',
      'Applique √(a×b) = √a × √b pour sortir la racine du carre parfait.',
      'Verifie qu il ne reste plus de carre parfait cache dans ce qui reste sous la racine.'
    ] },
    astuces: [
      'Connaitre les carres parfaits jusqu a 20² (1, 4, 9, 16, 25... 400) permet de reperer une simplification en un coup d oeil.',
      'Pour simplifier √n, teste les carres parfaits dans l ordre decroissant (4, 9, 16, 25...) jusqu a en trouver un qui divise n.',
      'Pour additionner des racines, elles doivent avoir le MEME nombre sous le radical : 3√2 + 5√2 = 8√2, mais 3√2 + 5√3 ne se simplifie pas.',
      'Pour multiplier deux racines simplifiees comme 2√3 × 5√7, multiplie les coefficients entre eux (2×5=10) et les nombres sous les racines entre eux (3×7=21) : ca donne 10√21.',
      'Une racine carree d un nombre entre 0 et 1 donne un resultat PLUS GRAND que le nombre de depart (√0,25 = 0,5).'
    ],
    pieges: [
      '√(a+b) ≠ √a + √b : erreur tres classique a l ecrit.',
      'Croire que √n est toujours un nombre entier — la plupart du temps ce n est pas le cas.',
      'Multiplier les nombres sous deux racines differentes sans utiliser la regle √a × √b = √(a×b).',
      'Oublier de simplifier completement (s arreter a √20 = 2√5 est bon, mais 2√20 pas simplifie est une erreur si la consigne demande la forme la plus simple).'
    ],
    recap: '√a × √b = √(a×b). Pour simplifier, extraire le plus grand carre parfait possible. Jamais de somme sous deux racines separees.'
  });

  /* ================================================================== */
  /* 5. CALCUL LITTERAL */
  /* ================================================================== */
  lesson('litteral', {
    accroche: 'Developper, factoriser, utiliser les identites remarquables : la boite a outils de l algebre, indispensable pour resoudre des equations.',
    vocabulaire: [
      { mot: 'Developper', def: 'Transformer un produit en une somme (on enleve les parentheses).' },
      { mot: 'Factoriser', def: 'Transformer une somme en un produit (on fait apparaitre des parentheses) — l operation inverse de developper.' },
      { mot: 'Identite remarquable', def: 'Egalite algebrique toujours vraie, a connaitre par coeur, qui accelere developpement et factorisation.' },
      { mot: 'Facteur commun', def: 'Expression presente dans tous les termes d une somme, que l on peut mettre en facteur.' }
    ],
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
        '<p>Exemple : <span class="math">9x² − 25 = (3x)² − 5² = (3x−5)(3x+5)</span>.</p>' },
      { titre: 'Reduire une expression', html:
        '<p>Reduire, c est regrouper les termes qui se ressemblent (meme lettre a la meme puissance) en additionnant leurs coefficients.</p>' +
        '<p>Exemple : <span class="math">5x + 3 − 2x + 7 = 3x + 10</span> (on a regroupe les x d un cote, les nombres de l autre).</p>' },
      { titre: 'Tester une egalite', html:
        '<p>Pour verifier qu une egalite litterale est correcte, on peut remplacer la lettre par une valeur simple (par exemple 1 ou 2) dans les deux membres : ils doivent donner le meme resultat.</p>' }
    ],
    exemples: [
      { titre: 'Developper une double distributivite', enonce: 'Developpe et reduis (2x+3)(x−5)',
        etapes: ['On distribue chaque terme : 2x×x + 2x×(−5) + 3×x + 3×(−5)', 'On calcule chaque produit : 2x² − 10x + 3x − 15', 'On reduit les termes en x : −10x + 3x = −7x'],
        reponse: '(2x+3)(x−5) = 2x² − 7x − 15' },
      { titre: 'Factoriser avec une identite remarquable', enonce: 'Factorise 16x² − 9',
        etapes: ['On reconnait deux carres : 16x² = (4x)² et 9 = 3²', 'C est de la forme a² − b² avec a=4x et b=3', 'On applique a²−b² = (a−b)(a+b)'],
        reponse: '16x² − 9 = (4x−3)(4x+3)' }
    ],
    methode: { titre: 'Pour factoriser une expression', etapes: [
      'Cherche d abord un facteur commun evident a tous les termes.',
      'Si aucun facteur commun, regarde si l expression ressemble a a²+2ab+b², a²−2ab+b² ou a²−b².',
      'Identifie a et b dans cette identite.',
      'Ecris directement la forme factorisee correspondante.',
      'Verifie en redeveloppant que tu retombes bien sur l expression de depart.'
    ] },
    astuces: [
      'Pour reperer une identite remarquable, cherche deux carres et un double produit qui correspond : a²+2ab+b² saute aux yeux si tu connais la formule.',
      'Pour factoriser a²−b², cherche deux carres separes par un signe moins : c est presque toujours (a−b)(a+b).',
      'Verifie toujours un developpement ou une factorisation en remplacant x par une valeur simple (x=1 par exemple) des deux cotes : les resultats doivent etre egaux.',
      'Dans une double distributivite, organise-toi avec un tableau 2×2 pour ne rater aucun des quatre produits.',
      'Un facteur commun peut etre un nombre, une lettre, ou une expression complete entre parentheses.',
      'Pour developper (a−b)², pense-le comme (a+(−b))² et applique directement (a+b)²=a²+2ab+b² avec b remplace par −b.'
    ],
    pieges: [
      '(a+b)² N EST PAS a² + b² : il manque le double produit 2ab.',
      'Oublier un des quatre termes en developpant (a+b)(c+d), en particulier les deux termes croises.',
      'Confondre developper (on enleve les parentheses) et factoriser (on en remet).',
      'Oublier de distribuer le signe moins devant une parenthese : −(x−3) = −x+3, pas −x−3.',
      'Additionner des termes qui ne se ressemblent pas (3x et 3x² ne se regroupent jamais ensemble).'
    ],
    recap: '(a+b)²=a²+2ab+b², (a−b)²=a²−2ab+b², (a+b)(a−b)=a²−b². Pour factoriser : facteur commun d abord, identite remarquable ensuite.'
  });

  /* ================================================================== */
  /* 6. EQUATIONS */
  /* ================================================================== */
  lesson('equation', {
    accroche: 'Resoudre une equation, c est trouver la ou les valeurs de x qui rendent une egalite vraie. C est LA competence centrale du brevet.',
    vocabulaire: [
      { mot: 'Equation', def: 'Egalite contenant une inconnue (souvent x), vraie seulement pour certaines valeurs.' },
      { mot: 'Solution', def: 'Valeur de l inconnue qui rend l equation vraie.' },
      { mot: 'Membre', def: 'Chacune des deux expressions separees par le signe = dans une equation.' },
      { mot: 'Inequation', def: 'Comme une equation, mais avec un signe d inegalite (≤, ≥, &lt;, &gt;) au lieu de =.' }
    ],
    sections: [
      { titre: 'Le principe de la balance', html:
        '<p>Une equation est comme une balance equilibree : ce qu on fait a un membre (ajouter, soustraire, multiplier, diviser par un nombre non nul), il faut le faire aussi a l autre pour garder l equilibre.</p>' },
      { titre: 'Resoudre ax + b = c', html:
        '<p>On isole x en deux etapes : d abord on enleve b (on soustrait b des deux cotes), puis on divise par a.</p>' +
        '<p>Exemple : <span class="math">3x + 5 = 20</span> → 3x = 15 → x = 5.</p>' },
      { titre: 'Equation avec x des deux cotes', html:
        '<p>On regroupe tous les termes en x d un cote et tous les nombres de l autre, en changeant de signe a chaque fois qu on fait passer un terme de l autre cote.</p>' +
        '<p>Exemple : 5x + 2 = 2x + 11 → 5x − 2x = 11 − 2 → 3x = 9 → x = 3.</p>' },
      { titre: 'Equation produit nul', html:
        '<p><span class="math">A × B = 0</span> si et seulement si A = 0 ou B = 0. Tres utile quand l equation est deja factorisee : pas besoin de developper.</p>' },
      { titre: 'Les inequations', html:
        '<p>On resout une inequation comme une equation, avec UNE regle en plus : si on multiplie ou divise les deux membres par un nombre NEGATIF, le sens de l inegalite s inverse.</p>' +
        '<p>Exemple : −2x &lt; 8 se resout en divisant par −2, donc x &gt; −4 (le signe a change de sens).</p>' }
    ],
    exemples: [
      { titre: 'Resoudre une equation avec x des deux cotes', enonce: 'Resous 7x − 4 = 3x + 12',
        etapes: ['On regroupe les x a gauche : 7x − 3x = 12 + 4', 'On calcule : 4x = 16', 'On divise par 4 : x = 4'],
        reponse: 'x = 4' },
      { titre: 'Resoudre une equation produit nul', enonce: 'Resous (x−3)(2x+6) = 0',
        etapes: ['Un produit est nul si un facteur est nul', 'Premier cas : x − 3 = 0 donc x = 3', 'Second cas : 2x + 6 = 0 donc 2x = −6 donc x = −3'],
        reponse: 'Les solutions sont x = 3 et x = −3' }
    ],
    methode: { titre: 'Pour resoudre une equation du type ax+b = cx+d', etapes: [
      'Regroupe tous les termes en x dans le membre de gauche (en changeant leur signe s ils changent de cote).',
      'Regroupe tous les nombres seuls dans le membre de droite.',
      'Reduis chaque membre pour n avoir plus qu un seul terme en x et un seul nombre.',
      'Divise les deux membres par le coefficient devant x.',
      'Verifie la solution en la remplacant dans l equation de depart.'
    ] },
    astuces: [
      'Verifie systematiquement ta solution en la remplacant dans l equation de depart : les deux membres doivent donner le meme nombre.',
      'Si l equation est deja sous forme de produit (x−2)(x+5)=0, resous directement avec « produit nul » — inutile de developper.',
      'En inequation, imagine une droite graduee : ca aide a visualiser dans quel sens va la solution.',
      'Pour une equation avec des fractions, multiplie d abord tous les termes par le denominateur commun pour t en debarrasser.',
      'Une equation sans solution ou avec une infinite de solutions arrive parfois : si tu obtiens 0=5 (faux), pas de solution ; si tu obtiens 0=0 (vrai), toutes les valeurs conviennent.',
      'Isoler x, c est toujours annuler d abord les additions/soustractions, puis les multiplications/divisions.'
    ],
    pieges: [
      'Diviser (ou multiplier) une inequation par un nombre NEGATIF sans inverser le sens de l inegalite.',
      'Diviser par une expression qui contient x sans etre sur qu elle n est jamais nulle.',
      'Oublier une des deux solutions dans une equation produit (A=0 ET B=0 sont deux cas a examiner).',
      'Se tromper de signe en faisant passer un terme de l autre cote de l egalite (oublier de l inverser).',
      'Melanger les etapes : diviser avant d avoir isole completement le terme en x.'
    ],
    recap: 'Isoler x en faisant la meme operation des deux cotes. Produit nul : A×B=0 → A=0 ou B=0. En inequation, diviser par un negatif inverse le sens.'
  });

  /* ================================================================== */
  /* 7. ARITHMETIQUE */
  /* ================================================================== */
  lesson('arithm', {
    accroche: 'Diviseurs, nombres premiers, PGCD : des outils pour comprendre la structure des nombres entiers, souvent utilises dans des problemes concrets.',
    vocabulaire: [
      { mot: 'Multiple', def: 'Un nombre obtenu en multipliant un nombre donne par un entier (les multiples de 4 sont 4, 8, 12, 16...).' },
      { mot: 'Diviseur', def: 'Un nombre qui divise un autre nombre exactement, sans reste.' },
      { mot: 'Nombre premier', def: 'Un nombre qui a exactement deux diviseurs : 1 et lui-meme.' },
      { mot: 'PGCD', def: 'Plus Grand Diviseur Commun a deux nombres.' }
    ],
    sections: [
      { titre: 'Divisibilite', html:
        '<p>Criteres pratiques : divisible par 2 (chiffre des unites pair), par 5 (se termine par 0 ou 5), par 10 (se termine par 0), par 3 ou 9 (somme des chiffres divisible par 3 ou 9), par 4 (les deux derniers chiffres forment un multiple de 4).</p>' },
      { titre: 'Nombres premiers', html:
        '<p>Un nombre premier a exactement deux diviseurs : 1 et lui-meme (2, 3, 5, 7, 11, 13...). Tout nombre entier se decompose de facon unique en produit de facteurs premiers.</p>' +
        '<p>Pour verifier si un nombre est premier, on teste sa divisibilite par les nombres premiers plus petits jusqu a atteindre sa racine carree.</p>' },
      { titre: 'PGCD et l algorithme d Euclide', html:
        '<p>Le PGCD (plus grand diviseur commun) sert a simplifier une fraction ou a repartir des objets en lots identiques.</p>' +
        '<p>Algorithme d Euclide : on divise le plus grand nombre par le plus petit, on note le reste, on remplace le plus grand par le plus petit et le plus petit par le reste, et on recommence jusqu a obtenir un reste nul. Le dernier reste non nul est le PGCD.</p>' },
      { titre: 'Decomposition en facteurs premiers', html:
        '<p>Tout entier superieur a 1 s ecrit comme un produit unique de nombres premiers.</p>' +
        '<p>Exemple : 360 = 2³ × 3² × 5. Utile pour trouver rapidement tous les diviseurs d un nombre ou calculer un PGCD/PPCM.</p>' }
    ],
    exemples: [
      { titre: 'Calculer un PGCD avec l algorithme d Euclide', enonce: 'Calcule le PGCD de 84 et 36',
        etapes: ['84 = 36 × 2 + 12 (reste 12)', '36 = 12 × 3 + 0 (reste 0)', 'Le dernier reste non nul est 12'],
        reponse: 'PGCD(84 ; 36) = 12' },
      { titre: 'Simplifier une fraction avec le PGCD', enonce: 'Rends 84/36 irreductible',
        etapes: ['On calcule PGCD(84,36) = 12 (voir exemple precedent)', 'On divise le numerateur par 12 : 84 ÷ 12 = 7', 'On divise le denominateur par 12 : 36 ÷ 12 = 3'],
        reponse: '84/36 = 7/3' }
    ],
    methode: { titre: 'L algorithme d Euclide pas a pas', etapes: [
      'Identifie le plus grand des deux nombres (a) et le plus petit (b).',
      'Effectue la division euclidienne de a par b, note le reste r.',
      'Si r = 0, le PGCD est b : tu as fini.',
      'Sinon, remplace a par b et b par r, et recommence l etape 2.',
      'Le dernier reste non nul obtenu est le PGCD cherche.'
    ] },
    astuces: [
      'Critere de 3 et de 9 : additionne les chiffres du nombre ; si la somme est un multiple de 3 (ou de 9), le nombre l est aussi.',
      'Un probleme du type « repartir en lots identiques sans rien laisser » se resout presque toujours avec un PGCD.',
      'Pour trouver rapidement le PGCD de petits nombres, compare directement leurs listes de diviseurs.',
      'Pour tester si un nombre est premier, il suffit de tester les diviseurs jusqu a sa racine carree (inutile d aller plus loin).',
      'La decomposition en facteurs premiers permet de compter tous les diviseurs d un nombre : (exposant1+1)×(exposant2+1)×...',
      'Deux nombres consecutifs (n et n+1) ont toujours un PGCD egal a 1 : ils sont premiers entre eux.'
    ],
    pieges: [
      'Confondre PGCD (pour repartir/simplifier) et PPCM (pour des evenements qui se repetent en meme temps).',
      'Oublier 1 et le nombre lui-meme dans la liste de ses diviseurs.',
      'Croire que tous les nombres impairs sont premiers (9, 15, 21... sont impairs mais pas premiers).',
      'Arreter l algorithme d Euclide trop tot, avant d obtenir un reste nul.'
    ],
    recap: 'Nombre premier = exactement 2 diviseurs. PGCD via l algorithme d Euclide : diviser, garder le reste, recommencer. PGCD sert a simplifier une fraction ou repartir en lots identiques.'
  });

  /* ================================================================== */
  /* 8. FONCTIONS */
  /* ================================================================== */
  lesson('fonction', {
    accroche: 'Une fonction associe a chaque nombre un unique resultat. Comprendre le vocabulaire (image, antecedent) debloque la moitie des exercices.',
    vocabulaire: [
      { mot: 'Fonction', def: 'Un procede qui associe a chaque nombre x un unique resultat, note f(x).' },
      { mot: 'Image', def: 'Le resultat f(x) obtenu a partir de x par la fonction f.' },
      { mot: 'Antecedent', def: 'Un nombre x dont l image par f vaut une valeur donnee.' },
      { mot: 'Coefficient directeur', def: 'Le nombre a dans f(x)=ax+b, qui indique la pente de la droite representant f.' },
      { mot: 'Ordonnee a l origine', def: 'Le nombre b dans f(x)=ax+b : c est la valeur de f(0), la ou la droite coupe l axe vertical.' }
    ],
    sections: [
      { titre: 'Vocabulaire de base', html:
        '<p><span class="math">f(x)</span> se lit « l image de x par f ». Si f(3) = 7, on dit que 7 est l image de 3, et que 3 est UN antecedent de 7.</p>' },
      { titre: 'Fonctions lineaires et affines', html:
        '<p>Fonction lineaire : <span class="math">f(x) = ax</span>. Sa representation graphique est une droite qui passe par l origine (situation de proportionnalite).</p>' +
        '<p>Fonction affine : <span class="math">f(x) = ax + b</span>. Sa representation graphique est une droite qui ne passe pas forcement par l origine.</p>' },
      { titre: 'Le coefficient directeur', html:
        '<p>Il se calcule avec deux points de la droite : <span class="math">a = (y₂ − y₁) / (x₂ − x₁)</span>. Il indique de combien monte (ou descend) la droite quand x avance de 1.</p>' },
      { titre: 'Lire un graphique', html:
        '<p>Pour lire l image d un nombre sur un graphique, on part de x sur l axe horizontal, on monte jusqu a la courbe, puis on lit l ordonnee correspondante.</p>' +
        '<p>Pour lire un antecedent, on fait l inverse : on part de y sur l axe vertical, on avance jusqu a la courbe, puis on lit l abscisse.</p>' },
      { titre: 'Fonction carre', html:
        '<p>La fonction carre associe a x le nombre x². Sa courbe (une parabole) est toujours au-dessus de l axe horizontal, et symetrique par rapport a l axe vertical. Un nombre positif et son oppose ont la meme image.</p>' }
    ],
    exemples: [
      { titre: 'Calculer une image', enonce: 'Soit f(x) = 3x − 5. Calcule f(4)',
        etapes: ['On remplace x par 4 dans l expression', 'f(4) = 3 × 4 − 5', 'f(4) = 12 − 5'],
        reponse: 'f(4) = 7' },
      { titre: 'Trouver un antecedent', enoncE: '', enonce: 'Soit f(x) = 3x − 5. Trouve l antecedent de 13',
        etapes: ['On cherche x tel que f(x) = 13', 'On resout 3x − 5 = 13', '3x = 18 donc x = 6'],
        reponse: 'L antecedent de 13 est 6' }
    ],
    methode: { titre: 'Pour trouver un coefficient directeur avec deux points', etapes: [
      'Repere les coordonnees des deux points A(x₁;y₁) et B(x₂;y₂).',
      'Calcule la difference des ordonnees : y₂ − y₁.',
      'Calcule la difference des abscisses : x₂ − x₁.',
      'Divise le premier resultat par le second : a = (y₂−y₁)/(x₂−x₁).',
      'Trouve b en remplacant a et les coordonnees d un point dans y = ax + b.'
    ] },
    astuces: [
      'Pour trouver un antecedent, on resout une equation : « antecedent de 7 par f » revient a resoudre f(x) = 7.',
      'b, dans f(x)=ax+b, est l ordonnee a l origine : c est la valeur de f(0), l endroit ou la droite coupe l axe vertical.',
      'a positif : la droite monte. a negatif : la droite descend. a = 0 : la droite est horizontale.',
      'Pour verifier qu un point appartient a une droite d equation y=ax+b, remplace x et verifie que tu retrouves bien y.',
      'Deux droites paralleles ont exactement le meme coefficient directeur a.',
      'Une fonction lineaire est un cas particulier de fonction affine, avec b = 0 : son graphique passe toujours par l origine.'
    ],
    pieges: [
      'Confondre image et antecedent (le sens de lecture change tout).',
      'Croire que toute fonction affine est lineaire : c est faux des que b est different de 0.',
      'Inverser x et y en calculant le coefficient directeur (toujours y₂−y₁ au numerateur, x₂−x₁ au denominateur).',
      'Oublier qu un nombre peut avoir plusieurs antecedents (cas de la fonction carre par exemple : 2 et −2 ont la meme image 4).'
    ],
    recap: 'f(x) = image de x. Antecedent = valeur qui donne cette image (on resout une equation). Fonction affine f(x)=ax+b ; lineaire seulement si b=0.'
  });

  /* ================================================================== */
  /* 9. PROPORTIONNALITE */
  /* ================================================================== */
  lesson('proport', {
    accroche: 'Pourcentages, echelles, recettes de cuisine : la proportionnalite est partout dans la vie courante, et tres presente au brevet.',
    vocabulaire: [
      { mot: 'Proportionnalite', def: 'Situation ou deux grandeurs varient toujours dans le meme rapport : multiplier l une par un nombre multiplie l autre par ce meme nombre.' },
      { mot: 'Coefficient de proportionnalite', def: 'Le nombre par lequel on multiplie toujours une grandeur pour obtenir l autre.' },
      { mot: 'Coefficient multiplicateur', def: 'Nombre qui traduit une evolution (hausse ou baisse) en une seule multiplication.' },
      { mot: 'Produit en croix', def: 'Technique pour trouver une valeur manquante dans un tableau de proportionnalite.' }
    ],
    sections: [
      { titre: 'Tableau de proportionnalite', html:
        '<p>Deux grandeurs sont proportionnelles si on passe de l une a l autre en multipliant toujours par le meme nombre (le coefficient de proportionnalite). On peut aussi utiliser un produit en croix.</p>' },
      { titre: 'Pourcentages', html:
        '<p><span class="math">p % de n</span> se calcule avec <span class="math">n × p / 100</span>.</p>' +
        '<p>Exemple : 15 % de 80 = 80 × 0,15 = 12.</p>' },
      { titre: 'Evolutions et coefficient multiplicateur', html:
        '<p>Hausse de p % : on multiplie par <span class="math">(1 + p/100)</span>.<br>' +
        'Baisse de p % : on multiplie par <span class="math">(1 − p/100)</span>.</p>' +
        '<p>Pour des evolutions successives, on MULTIPLIE les coefficients entre eux (jamais on n additionne les pourcentages).</p>' },
      { titre: 'Retrouver une valeur de depart', html:
        '<p>Si on connait le resultat apres une evolution, on retrouve la valeur de depart en DIVISANT par le coefficient multiplicateur (et non en multipliant).</p>' +
        '<p>Exemple : un article a 68 € apres une baisse de 15 % (coefficient 0,85) coutait 68 ÷ 0,85 = 80 € avant.</p>' },
      { titre: 'Vitesse, une situation de proportionnalite', html:
        '<p>La distance parcourue a vitesse constante est proportionnelle au temps ecoule : d = v × t. C est une application tres frequente au brevet.</p>' }
    ],
    exemples: [
      { titre: 'Completer un tableau de proportionnalite', enonce: '8 stylos coutent 12 €. Combien coutent 20 stylos ?',
        etapes: ['On cherche le coefficient : 12 ÷ 8 = 1,5 € par stylo', 'On multiplie ce prix unitaire par 20', '20 × 1,5 = 30'],
        reponse: '20 stylos coutent 30 €' },
      { titre: 'Une evolution en pourcentage', enonce: 'Un prix de 250 € augmente de 8 %, puis baisse de 8 %. Quel est le prix final ?',
        etapes: ['Coefficient de la hausse : 1 + 0,08 = 1,08', 'Coefficient de la baisse : 1 − 0,08 = 0,92', 'Prix final : 250 × 1,08 × 0,92 = 248,4'],
        reponse: 'Le prix final est 248,40 € (pas 250 € : les deux 8 % ne s annulent pas)' }
    ],
    methode: { titre: 'Pour resoudre un probleme de pourcentage d evolution', etapes: [
      'Identifie s il s agit d une hausse ou d une baisse.',
      'Calcule le coefficient multiplicateur correspondant (1+p/100 ou 1−p/100).',
      'Si tu connais la valeur de depart, multiplie-la par ce coefficient.',
      'Si tu connais la valeur d arrivee et cherches le depart, divise par ce coefficient.',
      'Pour plusieurs evolutions successives, multiplie tous les coefficients entre eux.'
    ] },
    astuces: [
      'Le coefficient multiplicateur permet de calculer le resultat final en une seule operation, sans passer par une etape intermediaire.',
      'Pour retrouver le prix AVANT une remise, on DIVISE par le coefficient (pas l inverse).',
      'Une hausse de 20 % suivie d une baisse de 20 % ne redonne PAS le prix de depart (car les 20 % ne portent pas sur la meme valeur).',
      'Pour verifier un calcul de pourcentage, estime d abord un ordre de grandeur (10 % d un nombre, c est juste le diviser par 10).',
      'Un coefficient multiplicateur superieur a 1 traduit toujours une hausse ; inferieur a 1 traduit toujours une baisse.',
      'Dans un tableau de proportionnalite, le produit en croix marche dans les deux sens (ligne du haut × colonne du bas = ligne du bas × colonne du haut).'
    ],
    pieges: [
      'Additionner les pourcentages d evolutions successives au lieu de multiplier les coefficients.',
      'Confondre « diminuer de 20 % » (coefficient 0,8) et « diminuer a 20 % » (coefficient 0,2).',
      'Multiplier par le coefficient au lieu de diviser quand on cherche la valeur de depart.',
      'Oublier de convertir le pourcentage en nombre decimal (15 % = 0,15, pas 15).'
    ],
    recap: 'p % de n = n×p/100. Coefficient multiplicateur : hausse = 1+p/100, baisse = 1−p/100. Evolutions successives : on multiplie les coefficients.'
  });

  /* ================================================================== */
  /* 10. STATISTIQUES */
  /* ================================================================== */
  lesson('stats', {
    accroche: 'Resumer une serie de donnees avec quelques nombres cles : moyenne, mediane, etendue. Simple, mais des pieges classiques a eviter.',
    vocabulaire: [
      { mot: 'Effectif', def: 'Le nombre de fois qu une valeur apparait dans une serie de donnees.' },
      { mot: 'Effectif total', def: 'La somme de tous les effectifs, c est a dire le nombre total de donnees de la serie.' },
      { mot: 'Moyenne', def: 'La somme de toutes les valeurs divisee par l effectif total.' },
      { mot: 'Mediane', def: 'La valeur qui separe une serie rangee en deux groupes de meme taille.' },
      { mot: 'Etendue', def: 'La difference entre la plus grande et la plus petite valeur d une serie.' }
    ],
    sections: [
      { titre: 'La moyenne', html:
        '<p><span class="math">moyenne = somme des valeurs ÷ effectif total</span>.</p>' +
        '<p>Avec des effectifs (moyenne ponderee), on multiplie chaque valeur par son effectif avant de sommer, puis on divise par l effectif TOTAL (pas par le nombre de categories).</p>' },
      { titre: 'La mediane', html:
        '<p>La mediane partage la serie RANGEE en deux groupes de meme taille. Si l effectif est impair, c est la valeur centrale. Si l effectif est pair, c est la moyenne des deux valeurs centrales.</p>' },
      { titre: 'L etendue', html:
        '<p><span class="math">etendue = valeur maximale − valeur minimale</span>. Elle mesure la dispersion de la serie.</p>' },
      { titre: 'Lire un diagramme ou un tableau d effectifs', html:
        '<p>Un tableau d effectifs presente une ligne de valeurs et une ligne d effectifs correspondants. L effectif total s obtient en additionnant TOUTE la ligne des effectifs.</p>' },
      { titre: 'Moyenne, mediane : que choisir ?', html:
        '<p>La moyenne est sensible aux valeurs extremes (une tres grande ou tres petite valeur la deforme). La mediane est plus robuste : elle ne bouge pas si une valeur extreme change, tant qu elle reste la plus grande ou la plus petite.</p>' }
    ],
    exemples: [
      { titre: 'Calculer une moyenne ponderee', enonce: 'Notes : 8 (effectif 2), 12 (effectif 5), 16 (effectif 3). Calcule la moyenne.',
        etapes: ['Somme ponderee : 8×2 + 12×5 + 16×3 = 16 + 60 + 48 = 124', 'Effectif total : 2 + 5 + 3 = 10', 'Moyenne : 124 ÷ 10 = 12,4'],
        reponse: 'La moyenne est 12,4' },
      { titre: 'Trouver la mediane d une serie', enonce: 'Trouve la mediane de la serie : 15 ; 3 ; 9 ; 22 ; 7 ; 11',
        etapes: ['On range la serie : 3 ; 7 ; 9 ; 11 ; 15 ; 22', 'Effectif total = 6 (pair), donc on prend la moyenne des 3e et 4e valeurs', 'Les 3e et 4e valeurs sont 9 et 11 : (9+11)÷2 = 10'],
        reponse: 'La mediane est 10' }
    ],
    methode: { titre: 'Pour trouver la mediane d une serie', etapes: [
      'Range toutes les valeurs de la serie dans l ordre croissant.',
      'Compte l effectif total de la serie.',
      'Si l effectif est impair, la mediane est la valeur exactement au milieu.',
      'Si l effectif est pair, prends les deux valeurs centrales et calcule leur moyenne.',
      'Verifie qu il y a bien autant de valeurs avant qu apres la mediane trouvee.'
    ] },
    astuces: [
      'Toujours RANGER la serie dans l ordre croissant avant de chercher la mediane — c est l erreur numero un.',
      'Pour reperer vite si l effectif est pair ou impair, compte le nombre total de valeurs avant de chercher la mediane.',
      'Dans un tableau d effectifs, l effectif total est la somme de la LIGNE effectif, pas le nombre de valeurs differentes.',
      'Pour verifier une moyenne ponderee, l ordre de grandeur du resultat doit se situer entre la plus petite et la plus grande valeur de la serie.',
      'La position de la mediane dans une serie de n valeurs rangees se trouve avec (n+1)/2 si n est impair.'
    ],
    pieges: [
      'Chercher la mediane sans avoir range les valeurs.',
      'Diviser par le nombre de valeurs distinctes au lieu de l effectif total pour une moyenne ponderee.',
      'Confondre mediane et moyenne : ce ne sont pas la meme information et elles peuvent etre tres differentes.',
      'Oublier de diviser par 2 quand l effectif est pair et qu il faut la moyenne des deux valeurs centrales.'
    ],
    recap: 'Moyenne = somme ÷ effectif total. Mediane = valeur centrale d une serie RANGEE (moyenne des 2 valeurs du milieu si effectif pair). Etendue = max − min.'
  });

  /* ================================================================== */
  /* 11. PROBABILITES */
  /* ================================================================== */
  lesson('proba', {
    accroche: 'Calculer la chance qu un evenement se produise. Des situations tres concretes (des, cartes, urnes) avec une formule simple au coeur.',
    vocabulaire: [
      { mot: 'Experience aleatoire', def: 'Une experience dont on ne peut pas prevoir le resultat a l avance (lancer un de, tirer une carte...).' },
      { mot: 'Issue', def: 'Un resultat possible d une experience aleatoire.' },
      { mot: 'Evenement', def: 'Un ensemble d issues qui partagent une caracteristique commune (« obtenir un nombre pair »).' },
      { mot: 'Equiprobabilite', def: 'Situation ou toutes les issues ont la meme chance de se produire.' },
      { mot: 'Evenement contraire', def: 'L evenement qui se realise exactement quand l evenement de depart ne se realise pas.' }
    ],
    sections: [
      { titre: 'La formule de base', html:
        '<p>Si toutes les issues sont equiprobables : <span class="math">P(evenement) = nombre de cas favorables ÷ nombre de cas possibles</span>.</p>' +
        '<p>P vaut toujours entre 0 (impossible) et 1 (certain).</p>' },
      { titre: 'L evenement contraire', html:
        '<p><span class="math">P(non A) = 1 − P(A)</span>. Tres utile des que l enonce contient « au moins un » : il est souvent plus simple de calculer le contraire (« aucun »).</p>' },
      { titre: 'Tirages successifs', html:
        '<p>Avec remise : les probabilites ne changent pas d un tirage a l autre, on multiplie directement.<br>' +
        'Sans remise : il faut actualiser le nombre total d objets a chaque tirage avant de multiplier.</p>' },
      { titre: 'Deux experiences combinees', html:
        '<p>Quand on combine deux experiences (deux des, une piece et un de...), un tableau a double entree ou un arbre de probabilite permet de lister toutes les issues possibles sans en oublier.</p>' },
      { titre: 'La somme des probabilites', html:
        '<p>La somme des probabilites de TOUS les evenements possibles d une experience vaut toujours 1. C est un excellent moyen de verifier un calcul.</p>' }
    ],
    exemples: [
      { titre: 'Utiliser l evenement contraire', enonce: 'On lance 2 des. Quelle est la probabilite d obtenir au moins un 6 ?',
        etapes: ['Le contraire de « au moins un 6 » est « aucun 6 »', 'P(aucun 6 sur un de) = 5/6, donc sur les deux des : 5/6 × 5/6 = 25/36', 'P(au moins un 6) = 1 − 25/36 = 11/36'],
        reponse: 'La probabilite est 11/36' },
      { titre: 'Tirage sans remise', enonce: 'Une urne contient 3 boules rouges et 2 boules bleues. On tire 2 boules sans remise. Probabilite de tirer deux boules rouges ?',
        etapes: ['Au premier tirage : P(rouge) = 3/5', 'Au second tirage, il ne reste que 4 boules dont 2 rouges : P(rouge) = 2/4', 'On multiplie : 3/5 × 2/4 = 6/20 = 3/10'],
        reponse: 'La probabilite est 3/10' }
    ],
    methode: { titre: 'Pour aborder un exercice de probabilites', etapes: [
      'Liste toutes les issues possibles de l experience (un tableau ou un arbre si besoin).',
      'Verifie si elles sont equiprobables.',
      'Compte le nombre de cas favorables a l evenement demande.',
      'Applique P = cas favorables ÷ cas possibles.',
      'Si l enonce contient « au moins un », pense a passer par l evenement contraire.'
    ] },
    astuces: [
      'Verifie que la somme des probabilites de TOUS les evenements possibles fait bien 1 : ca permet de detecter une erreur de calcul.',
      'Pour deux des, un tableau a double entree (6×6 = 36 cases) evite d oublier des issues.',
      'Des que l enonce dit « au moins un », pense a passer par l evenement contraire.',
      'Une probabilite peut toujours s exprimer en fraction, en decimal ou en pourcentage : ce sont trois ecritures de la meme chose.',
      'Dans un tirage AVEC remise, les tirages sont independants : les memes probabilites reviennent a chaque fois.'
    ],
    pieges: [
      'Oublier de diminuer le nombre total d objets apres un tirage sans remise.',
      'Croire qu un evenement a toujours 1 chance sur 2 (« ca passe ou ca ne passe pas » n est pas un argument mathematique).',
      'Confondre la probabilite d un evenement avec le nombre de ses issues favorables (il faut toujours diviser par le nombre total de cas).',
      'Additionner des probabilites d evenements qui ne sont pas incompatibles (attention aux doubles comptages).'
    ],
    recap: 'P = cas favorables ÷ cas possibles. P(contraire) = 1 − P(A). Sans remise : le nombre total change a chaque tirage, il faut le mettre a jour.'
  });

  /* ================================================================== */
  /* 12. PYTHAGORE */
  /* ================================================================== */
  lesson('pythagore', {
    accroche: 'Le theoreme le plus utilise du brevet en geometrie. Il relie les longueurs des cotes d un triangle RECTANGLE, uniquement.',
    vocabulaire: [
      { mot: 'Triangle rectangle', def: 'Un triangle qui possede un angle droit (90°).' },
      { mot: 'Hypotenuse', def: 'Le cote le plus long d un triangle rectangle, toujours en face de l angle droit.' },
      { mot: 'Triplet pythagoricien', def: 'Trois nombres entiers qui verifient le theoreme de Pythagore (comme 3, 4, 5).' }
    ],
    sections: [
      { titre: 'Le theoreme', html:
        '<p>Si un triangle ABC est rectangle en B, alors <span class="math">AC² = AB² + BC²</span>, ou AC est l hypotenuse (le cote le plus long, en face de l angle droit).</p>' },
      { titre: 'La reciproque', html:
        '<p>Elle sert a PROUVER qu un triangle est rectangle : si le carre du plus grand cote est egal a la somme des carres des deux autres, alors le triangle est rectangle (l angle droit etant en face du plus grand cote).</p>' +
        '<p>Si l egalite n est pas verifiee, le triangle n est pas rectangle.</p>' },
      { titre: 'Trouver un cote de l angle droit', html:
        '<p>Si on connait l hypotenuse et un cote de l angle droit, on SOUSTRAIT les carres (au lieu d additionner) pour trouver le cote manquant.</p>' },
      { titre: 'Pythagore dans l espace', html:
        '<p>Le theoreme s applique aussi en 3D pour calculer une grande diagonale : on l applique d abord sur une face (souvent la base) pour obtenir une diagonale intermediaire, puis une seconde fois avec la hauteur.</p>' },
      { titre: 'Les triplets a connaitre', html:
        '<p>Certains triangles rectangles ont des longueurs entieres, appelees triplets pythagoriciens : (3,4,5), (6,8,10), (5,12,13), (8,15,17), (7,24,25). Tous les multiples de ces triplets fonctionnent aussi (ex. 9,12,15 est le double de 3,4,5).</p>' }
    ],
    exemples: [
      { titre: 'Calculer une hypotenuse', enonce: 'Triangle ABC rectangle en B, AB = 6 cm, BC = 8 cm. Calcule AC.',
        etapes: ['On applique le theoreme : AC² = AB² + BC²', 'AC² = 6² + 8² = 36 + 64 = 100', 'AC = √100'],
        reponse: 'AC = 10 cm' },
      { titre: 'Verifier avec la reciproque', enonce: 'Un triangle a pour cotes 5 cm, 12 cm et 13 cm. Est-il rectangle ?',
        etapes: ['Le plus grand cote est 13 : on compare 13² et 5²+12²', '13² = 169', '5² + 12² = 25 + 144 = 169'],
        reponse: 'Les deux resultats sont egaux (169=169), le triangle est donc rectangle' }
    ],
    methode: { titre: 'Pour utiliser la reciproque de Pythagore', etapes: [
      'Identifie le plus grand cote du triangle : c est le candidat hypotenuse.',
      'Calcule le carre de ce plus grand cote.',
      'Calcule la somme des carres des deux autres cotes.',
      'Compare les deux resultats.',
      'S ils sont egaux, le triangle est rectangle (angle droit en face du plus grand cote) ; sinon, il ne l est pas.'
    ] },
    astuces: [
      'Connaitre les triplets pythagoriciens classiques (3-4-5, 6-8-10, 5-12-13, 8-15-17) permet de reconnaitre un triangle rectangle sans calcul.',
      'Identifie toujours l angle droit EN PREMIER sur la figure : ca dit immediatement quel cote est l hypotenuse.',
      'Pour verifier une reponse, remplace les longueurs trouvees dans l egalite de Pythagore : ca doit tomber juste.',
      'Dans un probleme de la vie courante (echelle contre un mur, diagonale d un ecran...), reformule toujours la situation en triangle rectangle avant de calculer.',
      'Un carre ou un rectangle peut se couper par une diagonale pour faire apparaitre deux triangles rectangles.'
    ],
    pieges: [
      'Appliquer Pythagore sur un triangle qui n est pas rectangle (ca ne marche que dans ce cas).',
      'Additionner les carres au lieu de les soustraire quand on cherche un cote de l angle droit (et non l hypotenuse).',
      'Confondre l hypotenuse avec un autre cote (l hypotenuse est toujours le plus long, en face de l angle droit).',
      'Oublier de prendre la racine carree a la fin du calcul (s arreter a AC² = 100 sans conclure AC = 10).'
    ],
    recap: 'Triangle rectangle en B : AC² = AB² + BC² (AC = hypotenuse). Pour un cote de l angle droit, on soustrait. La reciproque prouve qu un triangle est rectangle.'
  });

  /* ================================================================== */
  /* 13. THALES */
  /* ================================================================== */
  lesson('thales', {
    accroche: 'Thales relie les longueurs dans une configuration de triangles avec une parallele. Il faut surtout bien reperer la figure et l ordre des rapports.',
    vocabulaire: [
      { mot: 'Configuration de Thales', def: 'Deux droites secantes en A, coupees par deux paralleles (MN) et (BC).' },
      { mot: 'Rapport', def: 'Le quotient de deux longueurs, comme AM/AB.' },
      { mot: 'Reduction / agrandissement', def: 'Le petit triangle AMN est une reduction du grand triangle ABC (ou l inverse), avec le meme rapport pour tous les cotes.' }
    ],
    sections: [
      { titre: 'La configuration', html:
        '<p>Deux droites (AB) et (AC) se coupent en A. M est sur (AB), N est sur (AC), et (MN) est PARALLELE a (BC). C est la condition indispensable pour utiliser Thales.</p>' },
      { titre: 'L egalite de Thales', html:
        '<p><span class="math">AM/AB = AN/AC = MN/BC</span>.</p>' +
        '<p>On l utilise pour calculer une longueur manquante des qu on en connait trois parmi les six.</p>' },
      { titre: 'La reciproque', html:
        '<p>Elle sert a prouver que deux droites sont paralleles : on compare AM/AB et AN/AC. Si les deux rapports sont EGAUX, alors (MN) et (BC) sont paralleles.</p>' },
      { titre: 'Le cas du papillon', html:
        '<p>Une autre configuration existe : les droites (MB) et (NC) se coupent en A, avec M, A, B alignes et N, A, C alignes dans des sens opposes. Les triangles AMN et ABC sont alors symetriques par rapport a A, mais l egalite des rapports reste la meme.</p>' },
      { titre: 'Calculer une longueur inconnue', html:
        '<p>Une fois l egalite des rapports posee, on isole la longueur cherchee avec un produit en croix, exactement comme pour un tableau de proportionnalite.</p>' }
    ],
    exemples: [
      { titre: 'Calculer une longueur avec Thales', enonce: '(MN) // (BC), AM = 4 cm, AB = 10 cm, AC = 15 cm. Calcule AN.',
        etapes: ['On pose l egalite des rapports : AM/AB = AN/AC', 'On remplace : 4/10 = AN/15', 'On fait le produit en croix : AN = 15 × 4 ÷ 10 = 6'],
        reponse: 'AN = 6 cm' },
      { titre: 'Prouver un parallelisme avec la reciproque', enonce: 'AM=3, AB=9, AN=4, AC=12. (MN) et (BC) sont-elles paralleles ?',
        etapes: ['On calcule AM/AB = 3/9 = 1/3', 'On calcule AN/AC = 4/12 = 1/3', 'Les deux rapports sont egaux'],
        reponse: 'Les rapports etant egaux, (MN) et (BC) sont paralleles' }
    ],
    methode: { titre: 'Pour calculer une longueur avec Thales', etapes: [
      'Verifie que la figure montre bien deux droites secantes coupees par deux paralleles.',
      'Repere les trois couples de longueurs correspondants : AM/AB, AN/AC, MN/BC.',
      'Ecris l egalite des trois rapports.',
      'Remplace les longueurs connues, en laissant l inconnue de cote.',
      'Isole l inconnue avec un produit en croix.'
    ] },
    astuces: [
      'Ecris toujours les trois rapports dans le MEME ordre (le petit triangle en haut, le grand en bas, ou l inverse mais toujours pareil).',
      'Pour calculer une longueur inconnue, isole-la avec un produit en croix apres avoir pose l egalite des rapports.',
      'Pour la reciproque, ne compare QUE les deux rapports que tu peux calculer avec les donnees de l enonce (souvent AM/AB et AN/AC, jamais celui avec MN/BC si MN est inconnue).',
      'Si le rapport AM/AB est superieur a 1, verifie ta figure : ca signifierait que M est plus loin de A que B, ce qui est rare dans les exercices classiques.',
      'Un exercice de Thales cache souvent un calcul de PGCD ou de simplification de fraction dans la meme copie : reste attentif aux liens entre chapitres.'
    ],
    pieges: [
      'Melanger l ordre des sommets dans les rapports (AM/AB doit correspondre a AN/AC, pas a AC/AN).',
      'Utiliser Thales sans que l enonce ait precise que les droites sont paralleles.',
      'Confondre le triangle ABC (le grand) et le triangle AMN (le petit) dans les rapports.',
      'Oublier qu il existe deux configurations differentes (en triangle, ou en papillon).'
    ],
    recap: 'Si (MN)//(BC) : AM/AB = AN/AC = MN/BC. Pour la reciproque, comparer AM/AB et AN/AC : egaux → paralleles.'
  });

  /* ================================================================== */
  /* 14. TRIGONOMETRIE */
  /* ================================================================== */
  lesson('trigo', {
    accroche: 'La trigonometrie relie les angles et les longueurs dans un triangle rectangle, avec trois formules a connaitre par coeur.',
    vocabulaire: [
      { mot: 'Cote oppose', def: 'Le cote du triangle rectangle qui ne touche pas l angle etudie.' },
      { mot: 'Cote adjacent', def: 'Le cote du triangle rectangle qui touche l angle etudie, sans etre l hypotenuse.' },
      { mot: 'Cosinus, sinus, tangente', def: 'Trois rapports de longueurs associes a un angle dans un triangle rectangle.' }
    ],
    sections: [
      { titre: 'SOH-CAH-TOA', html:
        '<p>Dans un triangle rectangle, pour un angle donne :</p>' +
        '<ul><li><span class="math">cos(angle) = cote adjacent / hypotenuse</span></li>' +
        '<li><span class="math">sin(angle) = cote oppose / hypotenuse</span></li>' +
        '<li><span class="math">tan(angle) = cote oppose / cote adjacent</span></li></ul>' },
      { titre: 'Reperer les cotes', html:
        '<p>L hypotenuse est toujours le cote le plus long, en face de l angle droit. Le cote OPPOSE est en face de l angle etudie. Le cote ADJACENT touche l angle etudie (sans etre l hypotenuse).</p>' +
        '<p>Attention : oppose et adjacent changent si on change d angle !</p>' },
      { titre: 'Trouver une longueur', html:
        '<p>Si on connait un angle et une longueur, on choisit la formule (cos, sin ou tan) qui relie ces deux donnees a la longueur cherchee, puis on isole cette longueur.</p>' },
      { titre: 'Trouver un angle', html:
        '<p>Si on connait un rapport (par exemple sin = 0,5), on utilise la fonction inverse a la calculatrice : sin⁻¹, cos⁻¹ ou tan⁻¹.</p>' },
      { titre: 'Valeurs remarquables', html:
        '<p>Certains angles ont des valeurs de trigonometrie a connaitre : cos(60°)=0,5, sin(30°)=0,5, cos(0°)=1, sin(90°)=1, tan(45°)=1.</p>' }
    ],
    exemples: [
      { titre: 'Calculer une longueur avec le cosinus', enonce: 'Triangle ABC rectangle en B. AC = 12 cm (hypotenuse), angle BAC = 40°. Calcule AB.',
        etapes: ['AB est adjacent a l angle et AC est l hypotenuse : on utilise le cosinus', 'cos(40°) = AB / AC donc AB = AC × cos(40°)', 'AB = 12 × cos(40°) ≈ 12 × 0,766'],
        reponse: 'AB ≈ 9,2 cm' },
      { titre: 'Calculer un angle', enonce: 'Triangle ABC rectangle en B. BC = 5 cm (oppose), AC = 13 cm (hypotenuse). Calcule l angle BAC.',
        etapes: ['On utilise le sinus : sin(BAC) = BC / AC', 'sin(BAC) = 5 / 13 ≈ 0,385', 'BAC = sin⁻¹(0,385)'],
        reponse: 'BAC ≈ 22,6°' }
    ],
    methode: { titre: 'Pour choisir la bonne formule trigonometrique', etapes: [
      'Repere l angle droit, puis l angle etudie sur la figure.',
      'Identifie les trois cotes : hypotenuse (en face de l angle droit), oppose (en face de l angle etudie), adjacent (le troisieme).',
      'Regarde quelles longueurs tu connais et laquelle tu cherches.',
      'Choisis la formule (cos, sin ou tan) qui relie exactement ces trois elements.',
      'Isole l element cherche et calcule.'
    ] },
    astuces: [
      'Repere d abord l angle droit, puis l angle etudie, puis identifie hypotenuse / oppose / adjacent dans cet ordre.',
      'Si tu cherches une longueur, choisis la formule qui contient les deux cotes que tu connais/cherches.',
      'Si tu cherches un angle, choisis la formule avec les deux cotes DONT TU CONNAIS LES LONGUEURS.',
      'Verifie que ta calculatrice est bien en mode DEGRES (et non radians) avant de calculer un angle.',
      'Le cosinus et le sinus d un angle aigu sont toujours compris entre 0 et 1.',
      'Plus un angle est grand (en dessous de 90°), plus son sinus se rapproche de 1 et son cosinus se rapproche de 0.'
    ],
    pieges: [
      'Confondre cote oppose et cote adjacent (ils dependent de l angle choisi).',
      'Utiliser la trigonometrie sur un triangle qui n est pas rectangle.',
      'Oublier la fonction inverse (cos⁻¹) quand on cherche un angle, et laisser cos(angle) = valeur sans le resoudre.',
      'Melanger degres et radians sur la calculatrice, ce qui donne des resultats totalement faux.'
    ],
    recap: 'cos = adjacent/hypotenuse, sin = oppose/hypotenuse, tan = oppose/adjacent. Pour un angle : fonction inverse (cos⁻¹, sin⁻¹, tan⁻¹) a la calculatrice.'
  });

  /* ================================================================== */
  /* 15. GEOMETRIE & ANGLES */
  /* ================================================================== */
  lesson('geo', {
    accroche: 'Angles et transformations : des regles de base tres rentables au brevet, faciles a securiser avec un peu de methode.',
    vocabulaire: [
      { mot: 'Angles complementaires', def: 'Deux angles dont la somme des mesures vaut 90°.' },
      { mot: 'Angles supplementaires', def: 'Deux angles dont la somme des mesures vaut 180°.' },
      { mot: 'Angles alternes-internes', def: 'Paire d angles situes de part et d autre d une secante, entre deux droites, formant un Z.' },
      { mot: 'Angles correspondants', def: 'Paire d angles situes du meme cote de la secante, a la meme position, formant un F.' },
      { mot: 'Homothetie', def: 'Transformation qui agrandit ou reduit une figure selon un rapport k, en conservant les angles.' }
    ],
    sections: [
      { titre: 'Angles dans un triangle', html:
        '<p>La somme des angles d un triangle vaut toujours <span class="math">180°</span>. Pour un polygone a n cotes, la somme des angles vaut <span class="math">(n−2) × 180°</span>.</p>' },
      { titre: 'Angles particuliers', html:
        '<p>Complementaires : leur somme fait 90°. Supplementaires : leur somme fait 180°. Avec deux droites paralleles coupees par une secante : les angles alternes-internes sont egaux, et les angles correspondants sont egaux.</p>' },
      { titre: 'Les symetries', html:
        '<p>La symetrie axiale (par rapport a une droite) et la symetrie centrale (par rapport a un point) conservent les longueurs, les angles et les aires. Par rapport a l origine du repere, le point (x;y) devient (−x;−y).</p>' },
      { titre: 'Translation et rotation', html:
        '<p>La translation « glisse » une figure sans la tourner ni changer sa taille : on ajoute les memes coordonnees a chaque point. La rotation fait tourner une figure autour d un centre d un certain angle, sans changer sa taille non plus.</p>' },
      { titre: 'L homothetie', html:
        '<p>L homothetie de rapport k multiplie toutes les longueurs par k (et les coordonnees, en partant du centre, aussi par k). Si k &gt; 1, la figure est agrandie ; si 0 &lt; k &lt; 1, elle est reduite ; si k est negatif, la figure est aussi retournee.</p>' }
    ],
    exemples: [
      { titre: 'Trouver un angle manquant dans un triangle', enonce: 'Un triangle a des angles de 55° et 72°. Calcule le troisieme.',
        etapes: ['La somme des angles d un triangle vaut 180°', 'On additionne les deux angles connus : 55 + 72 = 127', 'On soustrait : 180 − 127'],
        reponse: 'Le troisieme angle mesure 53°' },
      { titre: 'Image par une symetrie centrale', enonce: 'Quelle est l image de A(3 ; −5) par la symetrie de centre O (origine) ?',
        etapes: ['La symetrie de centre O change (x;y) en (−x;−y)', 'On applique a x = 3 : −3', 'On applique a y = −5 : 5'],
        reponse: 'L image de A est le point (−3 ; 5)' }
    ],
    methode: { titre: 'Pour utiliser les angles formes par deux paralleles', etapes: [
      'Verifie d abord que les deux droites sont bien annoncees comme paralleles dans l enonce.',
      'Repere la secante qui coupe les deux paralleles.',
      'Identifie si les deux angles etudies sont alternes-internes (en Z) ou correspondants (en F).',
      'Applique l egalite : ces angles ont la meme mesure.',
      'Utilise cette mesure pour continuer le calcul demande.'
    ] },
    astuces: [
      'Verifie toujours si les droites sont paralleles AVANT d utiliser une propriete d angles alternes-internes ou correspondants — c est une condition obligatoire.',
      'Pour les transformations, retiens simplement l effet sur les coordonnees (x;y) plutot que d essayer de visualiser a chaque fois.',
      'Un dessin, meme approximatif, permet souvent de verifier si une reponse est plausible.',
      'Pour un polygone regulier a n cotes, chaque angle mesure (n−2)×180°÷n.',
      'La translation se repere par un vecteur (deux nombres) qui indique de combien on se deplace horizontalement et verticalement.',
      'Une homothetie de rapport k=1 ne change rien a la figure ; un rapport k=−1 correspond exactement a une symetrie centrale.'
    ],
    pieges: [
      'Confondre angles alternes-internes et angles correspondants.',
      'Croire que la translation change la taille ou la forme d une figure — c est faux, seule l homothetie le fait.',
      'Oublier qu une rotation conserve les longueurs alors qu une homothetie les multiplie par k.',
      'Melanger les coordonnees x et y en appliquant une transformation.'
    ],
    recap: 'Triangle : somme des angles = 180°. Complementaires → 90°, supplementaires → 180°. Translation/rotation conservent tout ; homothetie multiplie les longueurs par k.'
  });

  /* ================================================================== */
  /* 16. GRANDEURS & MESURES */
  /* ================================================================== */
  lesson('grandeur', {
    accroche: 'Conversions, aires, volumes, vitesse : des formules a connaitre et un piege tres classique sur les unites d aires et de volumes.',
    vocabulaire: [
      { mot: 'Perimetre', def: 'La longueur totale du contour d une figure.' },
      { mot: 'Aire', def: 'La mesure de la surface occupee par une figure.' },
      { mot: 'Volume', def: 'La mesure de l espace occupe par un solide.' },
      { mot: 'Debit', def: 'Le volume de liquide qui s ecoule par unite de temps.' }
    ],
    sections: [
      { titre: 'Conversions d unites', html:
        '<p>Pour les longueurs, chaque unite du tableau de conversion vaut 10 fois la suivante. Pour les AIRES, chaque unite vaut 100 fois la suivante (on saute 2 colonnes a la fois). Pour les VOLUMES, chaque unite vaut 1000 fois la suivante (3 colonnes a la fois).</p>' },
      { titre: 'Perimetres et aires usuels', html:
        '<ul><li>Rectangle : perimetre = 2×(L+l), aire = L×l</li>' +
        '<li>Triangle : aire = (base×hauteur)÷2</li>' +
        '<li>Disque : perimetre = 2×π×r, aire = π×r²</li>' +
        '<li>Trapeze : aire = (grande base+petite base)×hauteur÷2</li></ul>' },
      { titre: 'Volumes usuels', html:
        '<ul><li>Pave droit : volume = L×l×h</li>' +
        '<li>Cylindre : volume = π×r²×h</li>' +
        '<li>Cone et pyramide : volume = (1/3)×aire de base×hauteur</li>' +
        '<li>Boule : volume = (4/3)×π×r³</li></ul>' },
      { titre: 'Vitesse, distance, temps', html:
        '<p><span class="math">vitesse = distance ÷ temps</span>, d ou aussi <span class="math">distance = vitesse × temps</span> et <span class="math">temps = distance ÷ vitesse</span>. Attention a toujours utiliser des unites coherentes (km/h avec des heures, m/s avec des secondes).</p>' },
      { titre: 'Effet d un agrandissement', html:
        '<p>Pour un agrandissement (ou une reduction) de rapport k : les longueurs sont multipliees par k, les AIRES par k², les VOLUMES par k³. C est une consequence directe du fait qu une aire se calcule avec un produit de deux longueurs, et un volume avec un produit de trois.</p>' }
    ],
    exemples: [
      { titre: 'Convertir une aire', enonce: 'Convertis 3,5 m² en cm²',
        etapes: ['1 m² = 10 000 cm² (on saute 2 colonnes, donc ×100×100)', 'On multiplie : 3,5 × 10 000'],
        reponse: '3,5 m² = 35 000 cm²' },
      { titre: 'Calculer un volume de cylindre', enonce: 'Calcule le volume d un cylindre de rayon 4 cm et de hauteur 10 cm (arrondi au dixieme)',
        etapes: ['On applique la formule : V = π × r² × h', 'V = π × 4² × 10 = π × 16 × 10 = 160π', 'On calcule : 160 × π ≈ 502,7'],
        reponse: 'Le volume est environ 502,7 cm³' }
    ],
    methode: { titre: 'Pour convertir une unite d aire ou de volume', etapes: [
      'Identifie s il s agit d une longueur, d une aire ou d un volume.',
      'Pour une longueur, chaque colonne du tableau de conversion vaut ×10.',
      'Pour une aire, chaque colonne vaut ×100 (deux colonnes de longueur a la fois).',
      'Pour un volume, chaque colonne vaut ×1000 (trois colonnes de longueur a la fois).',
      'Compte le nombre de colonnes entre l unite de depart et l unite d arrivee, et applique la puissance de 10 correspondante.'
    ] },
    astuces: [
      'En cas de doute sur une conversion, ecris l unite complete (cm², cm³) et raisonne colonne par colonne dans le tableau plutot que de deviner.',
      'Retiens « aires en k², volumes en k³ » : c est l une des erreurs les plus frequentes au brevet.',
      'Verifie toujours l unite demandee dans la question (cm, cm², cm³...) avant de rendre ta reponse finale.',
      'Pour un probleme de vitesse, convertis toujours toutes les grandeurs dans le meme systeme d unites avant de calculer.',
      '1 litre correspond exactement a 1 dm³ : un lien pratique entre volumes et contenances.',
      'Pour verifier un volume, compare-le a un objet du quotidien de taille connue : ca permet de reperer une erreur d unite enorme.'
    ],
    pieges: [
      'Utiliser le meme facteur de conversion pour une longueur, une aire et un volume.',
      'Oublier π dans une formule de disque, cylindre, cone ou boule.',
      'Confondre perimetre (une longueur) et aire (une surface) dans un enonce.',
      'Oublier de diviser par 3 dans le volume d un cone ou d une pyramide.'
    ],
    recap: 'Longueurs ×10 par cran, aires ×100, volumes ×1000. Agrandissement de rapport k : longueurs ×k, aires ×k², volumes ×k³. Ne jamais oublier π.'
  });

  /* ================================================================== */
  /* 17. ALGORITHMIQUE */
  /* ================================================================== */
  lesson('algo', {
    accroche: 'Lire et suivre un script (type Scratch) pas a pas : variables, boucles et conditions. Une competence recente mais bien presente au brevet.',
    vocabulaire: [
      { mot: 'Variable', def: 'Un espace de memoire nomme qui contient une valeur, modifiable au cours du programme.' },
      { mot: 'Boucle', def: 'Une instruction qui repete un bloc de code plusieurs fois.' },
      { mot: 'Condition', def: 'Un test (vrai ou faux) qui determine quelle instruction executer.' },
      { mot: 'Algorithme', def: 'Une suite finie et ordonnee d instructions permettant de resoudre un probleme.' }
    ],
    sections: [
      { titre: 'Les variables', html:
        '<p>Une variable est une boite qui stocke une valeur. Cette valeur peut changer au cours du script (« mettre A a 5 », puis « ajouter 3 a A » → A vaut maintenant 8).</p>' },
      { titre: 'Les boucles', html:
        '<p>« Repeter n fois » execute le bloc d instructions n fois de suite, sans s arreter. Chaque tour de boucle part de la valeur laissee par le tour precedent : les variables gardent leur valeur.</p>' },
      { titre: 'Les conditions', html:
        '<p>« Si...alors...sinon » fait choisir au script une branche selon un test. Il faut d abord evaluer si la condition est vraie ou fausse, puis executer UNIQUEMENT la branche correspondante.</p>' },
      { titre: 'Deplacements et coordonnees', html:
        '<p>Dans un script de type Scratch, un lutin a une position (x;y). Les instructions « ajouter... a x » ou « ajouter... a y » deplacent le lutin en modifiant directement ces coordonnees.</p>' },
      { titre: 'Combiner boucles et conditions', html:
        '<p>Une boucle peut contenir une condition, et inversement. Il faut alors suivre le script avec encore plus de rigueur, en notant a chaque tour si la condition est vraie ou fausse a ce moment precis.</p>' }
    ],
    exemples: [
      { titre: 'Suivre une boucle simple', enonce: 'N vaut 2 au depart. Le script repete 4 fois : « multiplier N par 3 ». Que vaut N a la fin ?',
        etapes: ['Tour 1 : N = 2 × 3 = 6', 'Tour 2 : N = 6 × 3 = 18', 'Tour 3 : N = 18 × 3 = 54', 'Tour 4 : N = 54 × 3 = 162'],
        reponse: 'N vaut 162 a la fin' },
      { titre: 'Suivre une condition', enonce: 'N vaut 15. Si N > 10 alors N devient N−7, sinon N devient N+7. Que vaut N a la fin ?',
        etapes: ['On teste la condition : 15 > 10 est VRAI', 'On execute la branche « alors »', 'N devient 15 − 7'],
        reponse: 'N vaut 8 a la fin' }
    ],
    methode: { titre: 'Pour suivre un script pas a pas', etapes: [
      'Dessine un tableau avec une colonne par variable utilisee.',
      'Note la valeur initiale de chaque variable sur la premiere ligne.',
      'Avance instruction par instruction, en ajoutant une ligne a chaque changement de valeur.',
      'Pour une boucle, repete ce suivi autant de fois que demande, sans remettre les variables a zero.',
      'Pour une condition, teste-la avec les valeurs ACTUELLES avant de choisir la branche a executer.'
    ] },
    astuces: [
      'Pour suivre un script, fais un tableau avec une colonne par variable et une ligne par etape : tu notes la nouvelle valeur a chaque instruction.',
      'Dans une boucle, compte precisement le nombre de tours effectues — c est la source d erreur numero un.',
      'Evalue toujours la condition AVANT d executer une instruction dans un si...alors...sinon.',
      'Une variable qui n est jamais modifiee dans la boucle garde la meme valeur a chaque tour.',
      'Pour verifier ton suivi de script, recompte le nombre total d executions attendu (nombre de tours × nombre d instructions par tour).'
    ],
    pieges: [
      'Oublier qu une variable garde sa valeur d un tour de boucle a l autre (elle ne se remet pas a zero toute seule).',
      'Executer les deux branches d un si...sinon au lieu d une seule.',
      'Se tromper dans le nombre de tours d une boucle (en faire un de trop ou un de moins).',
      'Oublier de mettre a jour une variable utilisee dans la condition, ce qui peut faire boucler le test different a chaque tour.'
    ],
    recap: 'Variable = boite qui garde sa valeur. Boucle « repeter n fois » = n tours consecutifs. Condition : on teste, puis on execute UNE SEULE branche. Un tableau de suivi evite les erreurs.'
  });

  global.LECONS = L;
})(window);
