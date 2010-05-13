function MConnexion(de, vers, définitionParente) {
    $.extend(this, {
        uid: singleton.uid(),
        // Propriétés
        de: de,
        vers: vers,
        // Parents
        définition: définitionParente,
        // Enfants
        // Modification
        modifierDe: function(nouveauDe) {
            this.de = nouveauDe;
        },
        modifierVers: function(nouveauVers) {
            this.vers = nouveauVers;
        }
    });
}

