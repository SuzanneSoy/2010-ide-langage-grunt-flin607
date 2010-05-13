function MBloc() {
    $.extend(this, {
        uid: singleton.uid(),
        
        // Propriétés
        nom: "Nouveau bloc",
        description: '', /* Est une définition ? */
        
        // Parents
        monde: null,
        
        // Enfants
        définitions: [],
        portsEntree: [],
        portsSortie: [],
        
        // Instanciation
        instances: [],
        demanderInstance: function() {
            var mib = new MInstanceBloc();
            mib.bloc = this;
            this.instances.push(mib);
            return mib;
        },
        
        // Modification
        /*déplacerDéfinition: function(def, position) {
            var pos = définitions.remove(def);
            if (pos < position) position--;
            définitions.insert(def,position);
        },
        déplacerPortEntree: function(port, position) {
            var pos = portsEntree.remove(port);
            if (pos < position) position--;
            portsEntree.insert(port,position);
        },
        déplacerPortSortie: function(port, position) {
            var pos = portsSortie.remove(port);
            if (pos < position) position--;
            portsSortie.insert(port,position);
        },*/
        
        // Ajout
        ajouterDéfinition: function(d) {
            d.bloc = this;
            this.définitions.push(d);
            faireCallbacks(this.cbAjoutDéfinition, d);
        },
        cbAjoutDéfinition: [],
        onAjoutDéfinition: function(callback) {
            this.cbAjoutDéfinition.push(callback);
        }
    });
}
