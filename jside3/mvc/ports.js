/* Pas de modèle pour ports: c'est juste une partie de définitions */

function VPorts(vDéfinitionsParente) {
    this.vPortsEntrée = $('#vue-ports-entrée')
        .jqote({})
        .toDom();
    this.vPortsSortie = $('#vue-ports-sortie')
        .jqote({})
        .toDom();

    $.extend(this, this.vPortsEntrée.add(this.vPortsSortie));
    
    this.vPortsSortie.sortable({
        revert:true,
        placeholder: 'port-placeholder'
    });
    
    vDéfinitionsParente.setVPortsEntrée(this.vPortsEntrée);
    vDéfinitionsParente.setVPortsSortie(this.vPortsSortie);
}

function CPorts(mInstanceBloc, vDéfinitionsParente) {
    this.modèle = mInstanceBloc;
    this.vue = new VPorts(vDéfinitionsParente);
    
    this.modèle.bloc.onAjoutPortEntrée(function(port) {
        that.modèle.bloc.monde.log.envoiMessage("Ajout de port d'entrée", port);
    });
    this.modèle.bloc.onAjoutPortSortie(function(port) {
        that.modèle.bloc.monde.log.envoiMessage("Ajout de port de sortie", port);
    });

    new CPort(null, this.vue.vPortsEntrée);
    new CPort(null, this.vue.vPortsEntrée);
    new CPort(null, this.vue.vPortsEntrée);
    
    new CPort(null, this.vue.vPortsSortie);
    new CPort(null, this.vue.vPortsSortie);
}
