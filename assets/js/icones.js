/* =======================================================================
   icones.js — petit systeme d icones vectorielles (trait fin, sobre),
   pour remplacer les emojis dans l interface. Aucune dependance externe.
   ======================================================================= */
(function (global) {
  'use strict';

  function svg(trace, taille, epaisseur) {
    taille = taille || 20;
    epaisseur = epaisseur || 1.6;
    return '<svg class="icone" width="' + taille + '" height="' + taille + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + epaisseur + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + trace + '</svg>';
  }

  var TRACES = {
    accueil: '<path d="M4 11 12 4 20 11"/><path d="M6 10V20H18V10"/>',
    livre: '<path d="M4 5c2-1 5-1 8 0v14c-3-1-6-1-8 0z"/><path d="M20 5c-2-1-5-1-8 0v14c3-1 6-1 8 0z"/>',
    cible: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4.3"/><circle cx="12" cy="12" r=".9" fill="currentColor" stroke="none"/>',
    sac: '<path d="M6.5 8h11l-1 12h-9z"/><path d="M9 8V6.3a3 3 0 0 1 6 0V8"/>',
    utilisateur: '<circle cx="12" cy="8.3" r="3.4"/><path d="M5 20c1.1-4 3.8-6 7-6s5.9 2 7 6"/>',
    graphique: '<line x1="5" y1="20" x2="5" y2="12"/><line x1="12" y1="20" x2="12" y2="7"/><line x1="19" y1="20" x2="19" y2="15"/><line x1="3" y1="20.5" x2="21" y2="20.5"/>',
    compas: '<path d="M12 4v3"/><path d="M9.3 4h5.4"/><path d="M12 7 6 20"/><path d="M12 7l6 13"/><path d="M8 17h8"/>',
    amis: '<circle cx="8.5" cy="9" r="3"/><circle cx="16" cy="10" r="2.5"/><path d="M3.2 20c1-3.3 2.9-5 5.3-5s4.3 1.7 5.3 5"/><path d="M14.2 15.3c1.9.4 3.2 1.9 3.9 4.6"/>',
    flamme: '<path d="M12 3.2c1.8 2.6-2.4 4-2.6 7.3a2.6 2.6 0 0 0 5.2.2c.1-1.1-.5-1.8-.5-2.9 1.6 1 2.4 3 2.3 4.6a4.4 4.4 0 0 1-8.8-.3c-.2-3.7 2.7-5.8 4.4-8.9z"/>',
    bouclier: '<path d="M12 3.3l6.5 2.4v5.4c0 4.3-2.7 7.1-6.5 8.6-3.8-1.5-6.5-4.3-6.5-8.6V5.7z"/>',
    cycle: '<path d="M4.5 12a7.5 7.5 0 0 1 13-5.2"/><path d="M17.5 4.3v3.5H14"/><path d="M19.5 12a7.5 7.5 0 0 1-13 5.2"/><path d="M6.5 19.7v-3.5H10"/>',
    eclair: '<path d="M13 3 5.5 13h4.7l-1.2 8 7.5-10h-4.7z"/>',
    horloge: '<circle cx="12" cy="12" r="8.3"/><path d="M12 7.7V12l2.8 1.8"/>',
    coche: '<polyline points="5,13 10,18 19,7"/>',
    croix: '<line x1="6.5" y1="6.5" x2="17.5" y2="17.5"/><line x1="17.5" y1="6.5" x2="6.5" y2="17.5"/>',
    etoile: '<polygon points="12,3.2 14.6,9 21,9.6 16.2,13.8 17.6,20.1 12,16.8 6.4,20.1 7.8,13.8 3,9.6 9.4,9"/>',
    diamant: '<polygon points="12,2.3 20.5,9 12,21.7 3.5,9"/>',
    cadenas: '<rect x="5.2" y="11" width="13.6" height="9" rx="1.6"/><path d="M8.2 11V7.3a3.8 3.8 0 0 1 7.6 0V11"/>',
    chevronGauche: '<polyline points="15,5 8,12 15,19"/>',
    plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
    corbeille: '<line x1="4.5" y1="7" x2="19.5" y2="7"/><path d="M6.5 7l1 13h9l1-13"/><path d="M10 7V4.3h4V7"/>',
    diplome: '<path d="M2.2 9 12 4.2 21.8 9 12 13.8z"/><path d="M6.3 11.3V16c0 1.7 2.6 3 5.7 3s5.7-1.3 5.7-3v-4.7"/>',
    calculatrice: '<rect x="5.2" y="3" width="13.6" height="18" rx="2"/><rect x="7.4" y="5.4" width="9.2" height="3.6" rx=".6"/><circle cx="8.3" cy="13.2" r=".85" fill="currentColor" stroke="none"/><circle cx="12" cy="13.2" r=".85" fill="currentColor" stroke="none"/><circle cx="15.7" cy="13.2" r=".85" fill="currentColor" stroke="none"/><circle cx="8.3" cy="17" r=".85" fill="currentColor" stroke="none"/><circle cx="12" cy="17" r=".85" fill="currentColor" stroke="none"/><circle cx="15.7" cy="17" r=".85" fill="currentColor" stroke="none"/>',
    note: '<path d="M6.3 3h8.7l3 3v15H6.3z"/><path d="M15 3v3h3"/><line x1="8.7" y1="12" x2="15.3" y2="12"/><line x1="8.7" y1="15.5" x2="15.3" y2="15.5"/>',
    medaille: '<circle cx="12" cy="14.3" r="5.7"/><path d="M9.2 3.3l2 5.6"/><path d="M14.8 3.3l-2 5.6"/><circle cx="12" cy="14.3" r="2.1"/>',
    engrenage: '<circle cx="12" cy="12" r="2.8"/><path d="M12 3.5v3M12 17.5v3M3.5 12h3M17.5 12h3M6 6l2.1 2.1M15.9 15.9 18 18M18 6l-2.1 2.1M8.1 15.9 6 18"/>',
    interrogation: '<circle cx="12" cy="12" r="8.7"/><path d="M9.3 9.5a2.7 2.7 0 1 1 3.8 2.5c-.9.5-1.1 1-1.1 2"/><circle cx="12" cy="16.7" r=".85" fill="currentColor" stroke="none"/>',
    fleche: '<line x1="4" y1="12" x2="20" y2="12"/><polyline points="14,6 20,12 14,18"/>',
    ligneCourbe: '<path d="M3 19c3 0 4-13 8-13s5 13 8 13"/>',
    rectangle: '<rect x="3" y="8" width="18" height="8" rx="1"/>',
    cercle: '<circle cx="12" cy="12" r="7"/>',
    palette: '<circle cx="9" cy="9" r="4"/><circle cx="15" cy="9" r="4"/><circle cx="12" cy="15.5" r="4"/>',
    image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.5"/><path d="M3 17 9 11 13 15 16 12 21 17"/>',
    etincelle: '<path d="M12 3 13.5 9.5 20 11 13.5 12.5 12 19 10.5 12.5 4 11 10.5 9.5Z"/>',
    coeur: '<circle cx="8.3" cy="9" r="4"/><circle cx="15.7" cy="9" r="4"/><path d="M4.6 11.5 12 20.5 19.4 11.5"/>',
    lecture: '<polygon points="7,4 20,12 7,20"/>',
    segment: '<line x1="4" y1="18" x2="20" y2="6"/><circle cx="4" cy="18" r="1.6" fill="currentColor" stroke="none"/><circle cx="20" cy="6" r="1.6" fill="currentColor" stroke="none"/>',
    droite: '<line x1="2" y1="19" x2="22" y2="5"/>',
    moins: '<line x1="5" y1="12" x2="19" y2="12"/>',
    grille: '<rect x="3" y="3" width="18" height="18" rx="1"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/>'
  };

  function icone(nom, taille, epaisseur) { return svg(TRACES[nom] || TRACES.interrogation, taille, epaisseur); }
  global.Icone = { rendre: icone, TRACES: TRACES };
})(window);
