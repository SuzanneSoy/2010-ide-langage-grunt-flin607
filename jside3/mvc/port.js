function MPort(sens, blocParent) {
    $.extend(this, {
        uid: singleton.uid(),
        // Propriétés
        entrée: true, /* entrée / sortie */
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

function VPort(vPortsParente) {
    $.extend(this, (
        $('#vue-port')
            .jqote({})
            .toDom()));

    this.appendTo(vPortsParente);
}

function CPort(mPort, vPortsParente) {
    this.modèle = mPort;
    this.vue = new VPort(vPortsParente);
}
