(function($) {
    widget(tk, {
        hcontainer: function(_) {
            _.options(
                'class', '',
                'autoWidth', []
            );
            
            _(this.autoWidth).addClass('auto-width');
            this['class'] += ' tk hcontainer-table';
            
            _.table(_, this,
                    _.tr('tk hcontainer-tr',
                         _('rest').remap(_.hcontainerCell, 'tk hcontainer-td')));
        },
        hcontainerCell: function(_) {
            _.options('class', '');
            
            if (_('rest').is('.auto-width'))
                this['class'] += ' auto-width';
            
            _.td(_, this, _('rest'))
        },
        vcontainer: function(_) {
            _.options(
                'class', '',
                'autoHeight', []
            );
            
            _(this.autoHeight).addClass('auto-height');
            this['class'] += ' tk vcontainer-table';
            
            _.table(_, this,
                    _('rest').remap(_.vcontainerCell, 'tk vcontainer-tr'));
        },
        vcontainerCell: function(_) {
            _.options('class', '');
            
            if (_('rest').is('.auto-height'))
                this['class'] += ' auto-height';
            
            _.tr(_, this,
                 _.td('tk vcontainer-td',
                      _('rest')));
        },
        box: function(_) {
            _.options(
                null,
                'hpos', false,
                'vpos', false
            );
            
            css = {};
            if (this.hpos) { css['text-align']     = this.hpos; }
            if (this.vpos) { css['vertical-align'] = this.vpos; }
            
            _.table('tk box-table',
                    _.tr('tk box-tr',
                         _.td(_, {class: 'tk box-td box', css: css },
                              _('rest'))));
        }
    });
})(jQuery);