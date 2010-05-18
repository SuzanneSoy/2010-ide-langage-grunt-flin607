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

function VPort(vPortsParente, modèle) {
    $.extend(this, (
        $('#vue-port')
            .jqote({})
            .toDom()));
    
    this.bind('dragstart', function(event){
        $.dropManage({ mode:'intersect', filter:'.port.target' });
        return $('#vue-port-drag').jqote({}).appendTo('body');
    });
    
    this.bind('drag', function(event){
        $(event.dragProxy).position({my: 'center', at: 'center', of: event});
        return true;
    });
    
    this.bind('dragend', function(event){
        $(event.dragProxy).fadeOut();
    });

    vPortsParente.addVPort(this, modèle);
}

function CPort(mPort, vPortsParente) {
    this.modèle = mPort;
    this.vue = new VPort(vPortsParente, this.modèle);
    
    this.vue[0].droppedOn = function(destination, insertBefore) { // unsing this.vue[0] is a bit of a hack…
        console.log("dropped on", destination, insertBefore);
    };
}
