/* API :
 * widget(définitions); // Renvoie une nouvelle famille avec plusieurs widgets
 * widget(nom, définition); // Renvoie une nouvelle famille avec un seul widget
 * widget(Famille, définitions); // Ajoute les widgets à la famille et la renvoie
 * widget(Famille, nom, définition); // Ajoute un widget à la famille et la renvoie
 * 
 * *******************************
 * *      /!\ Attention /!\      *
 * * Les formes 2 et 3 modifient *
 * *  la famille d'origine !!!!  *
 * *******************************
 * 
 * Famille := un objet renvoyé par widget(…).
 * 
 * définitions := {
 *  définition0,
 *  définition1,
 *  …,
 *  définitionN
 * }
 *
 * défintion :=
 *  nomWidget1: function(_) {
 *      _.options(
 *          'monOption', 'valeur par défaut 1', // option positionnelle 1
 *          'truc',      'valeur par défaut 2', // option positionnelle 2
 *          'etc',       'valeur par défaut n', // option positionnelle n
 *          null, // ou false
 *          'uneOption', 'valeur par défaut A', // option nommée uneOption
 *          'uneAutre',  'valeur par défaut B', // option nommée uneAutre
 *      );
 *      // Chaque widget doit renvoyer un élément, créé par ex. avec $('<div/>'),
 *      // ou avec un autre widget.
 *      return _.autreWidget('Titre', 'Blabla', // On params positionnels de autreWidget
 *                           // Mettre _ juste avant le hash d'options nommées.
 *                           _.encoreUnAutreWidget(_, {sonOptionNommée: 3, sonTrucPositionnel: 5}),
 *                           $("<div>un élément</div>"),
 *                           // _('rest') contient le reste des options
 *                           _('rest'));
 *  }
 *
 */

tk = {};

(function($) {
    /* Création du hash des options et
 * du tableau des options positionnelles. */
    function makeOptionsHash(defpos) {
        var positions = [];
        var defauts = {};
        var positionnel = true;
        
        for (var i = 0; i < defpos.length; i += 2) {
            var k = defpos[i];
            var v = defpos[i+1];
            
            if (k === false || k === null) {
                positionnel = false;
                i--; // ne pas prendre la valeur
                continue;
            }
            
            if (positionnel)
                positions.push(k);
            
            defauts[k] = v;
        }
        
        return {
            positions: positions,
            defauts:   defauts
        };
    }

    function _options(h, defpos) {
        var defposhash = makeOptionsHash(defpos);
        var positions = defposhash.positions;
        var defauts = defposhash.defauts;
        var params = {};
        var firstRest = 0;
        
        if (h.realArgs[0] && h.realArgs[0].singleton === h.singleton) {
            // Hash de paramètres nommés dans realArgs[2]
            params = h.realArgs[1];
            firstRest = 2;
        } else {
            // Paramètres positionnels
            for (var i = 0; i < Math.min(h.realArgs.length, positions.length); i++) {
                params[positions[i]] = h.realArgs[i];
            }
            firstRest = i;
        }
        
        // Reste des arguments
        for (var i = firstRest; i < h.realArgs.length; i++) {
            elem = h.realArgs[i];
            if (elem === null || elem === false) {
                continue;
            }
            if (typeof elem == "string")
                elem = $('<span/>').text(elem); // $(document.createTextNode(elem)) ne marche pas
            
            h.rest = h.rest.add(elem);
        }
        
        $.extend(h.futurethis, defauts, params);
    }

    var singleton = { ans: $() };
    
    function _uscore(h, args) {
        if (args.length == 0) {
            return h.singleton.ans;
        } else if (args[0] == 'rest') {
            return h.rest;
        } else if (args.length == 1) {
            var sel = args[0];
            var ret = $();
            for (var i = 0; i < sel.length; i++) {
                ret = ret.add(h.rest[sel[i]]); // TODO : vérifier si ça serait pas ret.add($(...))
            }
            return ret;
        }
    }
    
    __widget = function (famille, nom, defwidget) {
        famille[nom] = function() {
            var h = {
                singleton: singleton,
                nom: nom,
                realArgs: $.makeArray(arguments),
                newArgs: [], // $.makeArray(arguments) 
                futurethis: {},
                rest: $(),
                uscore: function() {
                    return _uscore(h, arguments);
                }
            }
            
            h.uscore.singleton = h.singleton;
            h.newArgs.unshift(h.uscore);
            
            $.extend(h.uscore, famille, {
                options: function() {
                    return _options(h, arguments);
                }
            });
            
            var ret = defwidget.apply(h.futurethis, h.newArgs);
            if (ret === undefined) { ret = h.singleton.ans; }
            h.singleton.ans = ret;
            return ret;
        };
    }
    
    function _widget(famille, defs) {
        $.each(defs, function(nom, def) {
            __widget(famille, nom, def);
        });
        
        return famille;
    }

    function paire(k,v) {
        var r = {};
        r[k] = v;
        return r;
    }

    function fn_widget(a, b, c) {
        var is_fn = (arguments[1] instanceof Function);
        
        if (arguments.length == 1) return _widget({}, a);
        if (arguments.length == 2) return _widget(is_fn ? {}         : a,
                                                  is_fn ? paire(a,b) : b);
        if (arguments.length == 3) return _widget(a, paire(b,c));
    }

    widget = fn_widget;
})(jQuery);

jQuery.fn.extend({
    autoWidth: function() {
        var that = this;
        window.setTimeout(function() { $(that)._autoSize('width'); }, 0);
        $(this).bind('sizeChange posChange', function() {
            $(this)._autoSize('width');
            return true;
        });
    },
    autoHeight: function() {
        var that = this;
        window.setTimeout(function() { $(that)._autoSize('height'); }, 0);
        $(this).bind('sizeChange posChange', function() {
            $(this)._autoSize('height');
            return true;
        });
    },
    _autoSize: function(dimension) {
        var Dimension = dimension.charAt(0).toUpperCase()
            + dimension.substring(1);
        var total = this[0]['client'+Dimension];
        var scope = $(this)
            .children(':visible')
            .not('.tk.hcontainer-clear')
            .not('.ui-resizable-handle');
        var minus = (scope)
            .not('.auto-'+dimension)
            .invoke('outer'+Dimension, true)
            .sum();
        var nbshares = (scope)
            .filter('.auto-'+dimension)
            .size();
        
        (scope)
            .filter('.auto-'+dimension)
            [dimension]((total - minus) / nbshares);
        
        return this;
    },
    square: function() {
        var that = this;
        window.setTimeout(function() { $(that)._square(); });
    },
    _square: function() {
        if ($(this).width() < $(this).height()) {
            $(this.width($(this).height()));
        } else {
            $(this.height($(this).width()));
        }
        return this;
    }
});
