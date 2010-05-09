(function($) {
    widget(tk, {
        window: function(_) {
            _.options(
                'titre',   'Titre',
                'contenu', 'Contenu',
                'pied',    '',
                null,
                'width', 300,
                'height', 150,
                'canReduce', true,
                'canClose',  true,
                'canDock',   true
            );
            
            _.vcontainer('tk window', [1],
                         _.barreTitre(this.titre, this.canClose, this.canReduce),
                         _.div('tk contenu', _.box(this.contenu)),
                         _.div('tk pied',    _.box(this.pied)))
                
                .width(this.width)
                .height(this.height)
                .draggable()
                .resizable({
                    resize: function(i,e) {
                        return $(this)
                            .trigger('sizeChange')
                            .find('*')
                            .trigger('sizeChange')
                            .trigger('posChange');
                    }
                });
            
            if (!this.canClose) {
                fermer.hide();
            }
        },
        barreTitre: function(_) {
            _.options(
                'titre', 'Titre',
                'canClose',  true,
                'canReduce', true
            );
            
            _.hcontainer('tk barre-titre', [1],
                         fermer  = _.boutonFermer('tk fermer'),
                         titre   = _.div('tk titre',   this.titre),
                         reduire = _.boutonReduire('tk reduire'));
        },
    });
})(jQuery);
