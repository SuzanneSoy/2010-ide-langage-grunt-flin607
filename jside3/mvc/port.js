function MPort(sens, blocParent) {
    $.extend(this, {
        uid: singleton.uid(),
        // Propriétés
        sens: sens, /* entrée / sortie */
        nom: '',
        description: '',
        // ?
        instances: [],
        // Parents
        bloc: blocParent,
        // Enfants
        connexions: []
    });
}
