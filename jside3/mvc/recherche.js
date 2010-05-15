function MRecherche() {
    $.extend(this, {
        uid: singleton.uid(),
        
        // Parents
        monde: null,
        
        // Enfants
        
        // Instanciation
        instances: [],
        demanderInstance: function() {
            var mir = new MInstanceRecherche();
            mir.mRecherche = this;
            this.instances.push(mir);
            return mir;
        },
        
        // Ajout
        
        // Évènements
    });
}
