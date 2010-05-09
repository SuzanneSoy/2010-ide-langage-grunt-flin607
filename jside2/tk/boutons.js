(function($) {
    widget(tk, {
        bouton: function(_) {
            _.options('class', '');
            _.div(_, this, _('rest'));

            _().square();
        },
        boutonReduire: function(_) {
            _.options('class', '');
            this['class'] += ' tk bouton fermer';
            _.bouton(_, this,'-');
        },
        boutonFermer: function(_) {
            _.options('class', '');
            this['class'] += ' tk bouton reduire';
            _.bouton(_, this,'×');
        }
    });
})(jQuery);