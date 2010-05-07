function widget(nom, options) {
    if (options === undefined && typeof nom == 'object') {
        var ret = {};
        var widgets = nom;
        for (n in widgets) {
            ret[n] = (widget(n, widgets[n]));
        }
        return ret;
    } else {
        var w = function(opt) {
            return $('#tk-' + nom)
                .jqote($.extend(true, {}, options, opt));
        };
        
        w.options = options;
        w.nom = nom;
        
        return w;
    }
}


$(function () {
    var w = widget({
        bloc: function(_) {
            options({
                nom:         'Exemple',
                description: "Un bloc d'exemple"
            });
            return _.window(this.nom, this.description);
        },
        window: function(_) {
            options({
                titre:   'Titre',
                contenu: 'Contenu',
                pied:    ''
            });
            return _.div('tk window',
                         _.div('tk titre',   _.box(this.titre))
                         _.div('tk contenu', _.box(this.contenu))
                         _.div('tk pied',    _.box(this.pied)));
        },
        box: function(_) {
            options({ contenu: '' });
            return _.table('tk box-table',
                           _.tr('tk box-tr',
                                _.td({class: 'tk box-td box', css: {'text-align': _('hpos'), 'vertical-align': _('vpos')} },
                                     this.contenu)));
        }

        /*
        bloc: {
            window: {
                titre: _(nom),
                contenu: _(description),
            },
            options: {
                nom: '?',
                description: '?'
            }
        },
        window: {
            'div.tk.window': {
                'div.tk.titre': {
                    box: _('titre')
                },
                'div.tk.contenu.auto-height': {
                    box: _('contenu')
                },
                'div.tk.pied': {
                    box: _('pied')
                }
            },
            options: {
                title: 'Titre',
                contenu: 'Contenu',
                pied: ''
            }
        },
        box: {
            'table.tk.box-table': {
                'tr.tk.box-tr': {
                    'td.tk.box-td.box': {
                        css: {'text-align': _('hpos'), 'vertical-align': _('vpos')},
                        subwidget: {
                            _('contenu') }}}},
            options: {
                contenu: '',
                hpos: 'center',
                vpos: 'center'
            }
        }
        
        box3: {
            'table.tk.box-table': {
                'tr.tk.box-tr': {
                    'td.tk.box-td.box': {
                        css: {'text-align': _('hpos'), 'vertical-align': _('vpos')},
                        subwidget: {
                            _('contenu') }}}},
            options: {
                contenu: '',
                hpos: 'center',
                vpos: 'center'
            }
        },
        box2: {
            options: {
                contenu: '',
                hpos: 'center',
                vpos: 'center'
            },
            gen7:
            ['table.tk.box-table',
             ['tr.tk.box-tr',
              ['td.tk.box-td.box',
               {css: {'text-align': _('hpos'), 'vertical-align': _('vpos')}
                truc: {}}
               ['subwidget',
                _('contenu') ]]]
             {
                 contenu: '',
                 hpos: 'center',
                 vpos: 'center'
             }
            ],
            
            gen6: {
                'table.tk.box-table': {
                    'tr.tk.box-tr': {
                        'td.tk.box-td.box': {
                            css: {'text-align': _('hpos'), 'vertical-align': _('vpos')},
                            truc: {}
                            subwidget: _('contenu') }}}},
            gen5: function(_,$$) {
                return {
                    'table.tk.box-table': {
                        'tr.tk.box-tr': {
                            'td.tk.box-td.box': {
                                css: {'text-align': this.hpos, 'vertical-align': this.vpos},
                                subwidget: {
                                    this.contenu }}}}}
            },
            gen4: function() {
                return ['table', 'tk box-table',
                        ['tr', 'tk box-tr',
                         ['td', {class: 'tk, box-td', 'text-align', this.hpos, 'vertical-align', this.vpos},
                          ['subwidget', this.contenu]]];
            gen3: function() {
                return table('tk box-table',
                             tr('tk box-tr',
                                td({class: 'tk, box-td', 'text-align', this.hpos, 'vertical-align', this.vpos},
                                   this.contenu)))
            }
            gen2: function() {
                $('<table class="tk box-table"/>')
                    .append('<tr class="tk box-tr"/>')
                        .append('<td class="tk box-td box"/>')
                            .css('text-align', this.hpos, 'vertical-align', this.vpos)
                            .append(this.contenu)
                            .end()
                        .end()
                    .end();
            },
            gen: function() {
                return {
                    tag: 'table',
                    class: 'tk box-table',
                    content: {
                        tag: 'tr',
                        class:'tk box-tr',
                        content: {
                            tag: 'td',
                            class: 'tk box-td box',
                            css: {'text-align':this.hpos, 'vertical-align': this.vpos},
                            content: this.contenu
                        }
                    }
                }
            }
        },
        box: {
            contenu: '',
            hpos: 'center',
            vpos: 'center'
        },
        window: {
            
        }*/
    });
    
    var box = widget('box', {
        contenu: '',
        hpos: 'center',
        vpos: 'center'
    });
    
    w.box({
        contenu:'abc',
        hpos: 'left',
        vpos: 'top',
    }).appendTo('#test-tk-layout');
});
