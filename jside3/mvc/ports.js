/* Pas de modèle pour ports: c'est juste une partie de définitions */

function VPorts(vDéfinitionsParente, sens) {
    $.extend(this,(
        $('#vue-ports-'+sens)
            .jqote({})
            .toDom()));
    
    /*this.sortable({
        revert:true,
        placeholder: 'port-placeholder'
    });*/
    
    this.addVPort = function(vPort, modèle) {
        new VPortInPorts(this, vPort, modèle);
    };
    
    vDéfinitionsParente.setVPorts(this, sens);
}

function CPorts(mInstanceBloc, vDéfinitionsParente) {
    this.modèle = mInstanceBloc;
    this.vueEntrée = new VPorts(vDéfinitionsParente, 'entrée');
    this.vueSortie = new VPorts(vDéfinitionsParente, 'sortie');
    
    this.modèle.bloc.onAjoutPortEntrée(function(port) {
        that.modèle.bloc.monde.log.envoiMessage("Ajout de port d'entrée", port);
    });
    this.modèle.bloc.onAjoutPortSortie(function(port) {
        that.modèle.bloc.monde.log.envoiMessage("Ajout de port de sortie", port);
    });
    
    new CPort('a', this.vueEntrée);
    new CPort('b', this.vueEntrée);
    new CPort('c', this.vueEntrée);
    
    new CPort('d', this.vueSortie);
    new CPort('e', this.vueSortie);
}
