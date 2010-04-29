$(document).ready(function () {
    setTimeout(init, 200);
});

function init() {
    $w = new world();
    
    // Lier les blocs
    lienBlocsActif = { actif: false, elems: $([])};
    
    $('#rechercher').click(uiRechercher);
    $('#nouveau-bloc').click(uiNouveauBloc);
    $('#serialiser').click(uiSerialiser);
    //$('#nouveau-lien').click(uiNouveauLien);
    logPause = false;
    $('#log-pause').click(logPauseToggle);
    
    log("Démarré.");
    log("Ajoutez des blocs à l'espace de travail pour construire un programme.");
    $('#nouveau-bloc').blink();
    
    // Test
    var a = nouveauBloc("abcd");
    var b = nouveauBloc("bc");
    var c = nouveauBloc("xyz");
    var d = nouveauBloc("Scratch");
    utiliser(a.uid, d.uid);
    
    arreterRecherche();
    editer(d.uid);
    //rechercher('');
}

String.prototype.escapeXML = function() {
    return this
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

String.prototype.toDom = function() {
    return $("" + this);
}

function world() {
    this.blocs = [];
    this.maxuid = 0;
    this.addBloc = function (nom) {
        var uid = this.maxuid++;
        var b = new bloc(uid, nom);
        this.blocs[uid] = b;
        return b;
    }
}

function bloc(uid, nom, description) {
    this.uid = uid;
    this.nom = nom || "Nouveau bloc";
    this.description = description || "Aucune description.";
    this.definitions = [];
    this.entrees = 3;
    this.sorties = 2;
    b = this;
}

function blocDefJs() {
    this.code = "";
}

function blocDefGraphe() {
    this.blocs = [];
    this.connexions = [];
}

jQuery.fn.extend({
    serializeDOM: function(value) {
        /* get the DOM of this node, serialized as HTML.
         * with value, set the DOM of this node to the
         * serialized HTML value (Not Implemented Yet) */
        if ( value === undefined ) {
	    return this.html().escapeXML();
	}
    },
    attrs: function(value) {
        return this.map(function(idx, elem) {
            return $([elem]).attr(value);
        });
    },
    toggleResizable: function() {
        // TODO : devrait enregistrer les options.
        
        if (this.data('notResizable')) {
            this.resizable();
            this.height(this.data('oldHeight'));
        } else {
            this.resizable('destroy');
            this.data('oldHeight', this.height());
            this.height('auto');
        }
        
        this.data('notResizable', ! this.data('notResizable'))
        
        return this;
    },
    offX: function(value) {
        if (value === undefined) {
            return this.offset().left;
        } else {
            return this.offset({left: value});
        }
    },
    offY: function(value) {
        if (value === undefined) {
            return this.offset().top;
        } else {
            return this.offset({top: value});
        }
    },
    leftX: function() {
        return this.offX.apply(this, arguments);
    },
    topY: function() {
        return this.offY.apply(this, arguments);
    },
    centerX: function() {
        debug = this;
        return this.offX() + (this.width() / 2);
    },
    centerY: function() {
        return this.offY() + (this.height() / 2);
    },
    rightX: function() {
        return this.offX() + this.width();
    },
    bottomY: function() {
        return this.offY() + this.height();
    }
});

function surchargeAccesseur(nom, type, get, set) {
    var _old = $.fn[nom];
    $.fn[nom] = function(options) {
        var args = arguments;
        if (options !== undefined) {
            var that = this;
            return this.each(function (i) {
                if (that[i] instanceof type) {
                    set(that[i], options)
                } else {
                    _old.apply($(that[i]), args);
                }
            });
        } else {
            if (this[0] instanceof type) {
                return get(this);
            } else {
	        return _old.call(this);
            }
        }
    };
    
}

function surchargeAccesseurSimple(nom, defaut, type) {
    surchargeAccesseur(
        nom,
        type,
        function (obj) { ret = obj[0][nom]; return (ret !== undefined) ? ret : defaut; },
        function (obj, val) { obj[nom] = val; }
    );
}

// This is the beauty of JavaScript ♥
surchargeAccesseurSimple('height', 0, $.Event);
surchargeAccesseurSimple('width', 0, $.Event);
surchargeAccesseurSimple('scrollLeft', 0, $.Event);
surchargeAccesseurSimple('scrollTop', 0, $.Event);
surchargeAccesseurSimple('outerWidth', 0, $.Event);
surchargeAccesseurSimple('outerHeight', 0, $.Event);
surchargeAccesseur(
    'offset',
    $.Event,
    function (obj) {
        return {
            left: obj[0].pageX,
            top:  obj[0].pageY
        };
    },
    function (obj, val) {
        if ('left' in val) { that[i].pageX = val.left; }
        if ('top'  in val) { that[i].pageY = val.top;  }
    }
);

// Fix firefox bug : when top or left are set to a non-integer value, flicker occurs. 
(function ($) {
    var _offset = $.fn.offset;
    
    $.fn.offset = function(options) {
        var args = arguments;
        if (options !== undefined) {
            if ('left' in options) { args[0].left = Math.floor(options.left); }
            if ('top'  in options) { args[0].top  = Math.floor(options.top);  }
        }
        
        return _offset.apply(this, args);
    }
}(jQuery));

function uiRechercher() { 
    log("Recherche…");
    rechercher($('#nom-bloc').val());
}

function arreterRecherche() {
    $('#resultats-recherche').hide();
    $('#edition-blocs').show();
}

function demarrerRecherche() {
    $('#resultats-recherche tbody').empty();
    $('#resultats-recherche').show();
    $('#edition-blocs').hide();
}

function rechercher(terme) {
    demarrerRecherche();
    
    $(
        $.grep($w.blocs, function (b) {
            return b.nom.indexOf(terme) >= 0;
        })
    )
    
    .map(function(idx, elem) {
        return $('#modele-resultat-recherche')
            .jqote(elem)
            .toDom()
            .data("uid", elem.uid)
            .click(function() {
                log(elem.uid);
            })
            
            .find('.editer')
            .click(function() {
                arreterRecherche();
                uiEditer(elem.uid);
                return false;
            })
            .end()
        
            .find('.utiliser')
            .click(function() {
                arreterRecherche();
                uiUtiliser(elem.uid);
                return false;
            })
            .end();
    })
    
    .appendTo('#resultats-recherche tbody');
}

function uiEditer(uid) {
    log("Édition de " + uid);
    editer(uid);
}

function editer(uid) {
    /* $('#edition-blocs').children().hide(); */
    $('#edition-' + $w.blocActif).hide();
    $w.blocActif = uid;
    $('#edition-' + uid).show();
}

function uiReduireBloc () {
    $(this)
        .toggleClass('icone-moins')
        .toggleClass('icone-plus')
        .parents('.bloc')
        .find('.contenu')
            .toggle()
            .end()
        .toggleResizable();
}

function uiUtiliser(uid) {
    var uidParent = $w.blocActif;
    log("Utilisation de " + $w.blocs[uid].nom + " pour " + $w.blocs[uidParent].nom);
    utiliser(uid, uidParent);
}

function utiliser(uid, uidParent) {
    $('#modele-utilisation-bloc')
        .jqote($w.blocs[uid])
        .toDom()
        .draggable({ containment: '#edition-' + uidParent + ' > .contenu'})
        .resizable({ containment: '#edition-' + uidParent + ' > .contenu'}) /* Small bug here… */
        .find('.reduire')
            .click(uiReduireBloc)
            .end()
        .find('.port')
            .click(uiLierBlocs)
            .end()
        .appendTo('#edition-' + uidParent);
}

function uiSerialiser() {
    log($('#edition').serializeDOM());
}

function uiNouveauBloc() {
    var nom = $('#nom-bloc').val();
    log("Nouveau bloc \"" + nom + "\"");
    nouveauBloc(nom);
}

function nouveauBloc(nom) {
    var b = $w.addBloc(nom);
    
    $('#modele-edition-bloc')
        .jqote(b)
        .toDom()
        .attr('id', "edition-" + b.uid)
        .hide()
        .appendTo('#edition-blocs');
    
    return b;
}

function uiActualiserLien(_de, _vers, segments) {
    if ($(_de).centerX() < $(_vers).centerX()) {
        de = $(_de);
        vers = $(_vers);
    } else {
        de = $(_vers);
        vers = $(_de);
    }
    segments = $(segments);
    var segment1 = segments.find('.segment-1');
    var segment2 = segments.find('.segment-2');
    var segment3 = segments.find('.segment-3');
    
    $(segment1)
        .width((vers.centerX() - de.centerX()) / 2)
        .position({my: 'left center', at: 'center', of: de});
    $(segment3)
        .width((vers.centerX() - de.centerX()) / 2)
        .position({my: 'right center', at: 'center', of: vers});
    $w.debug = [$(segment3), vers];
    
    var neg = segment3.centerY() - segment1.centerY();
    
    $(segment2)
        .height((neg > 0) ? segment3.bottomY() - segment1.topY() : segment1.bottomY() - segment3.topY())
        .position({
            my: (neg > 0) ? 'center top' : 'center bottom',
            at: (neg > 0) ? 'right top'  : 'right bottom',
            of: (neg > 0) ? segment1     : segment1
        });
}

function uiLierBlocs() {
    if (!lienBlocsActif.actif) {
        log("Début lien blocs");
        lienBlocsActif.actif = true;
        
        var segments = $('#modele-lien-blocs')
            .jqote()
            .toDom()
            .appendTo($('body'));
        
        var start = $(this);
        
        var elems = $(this)
            .parents(".editionBloc")
            .add(segments);
        
        lienBlocsActif.start = start;
        lienBlocsActif.elems = elems;
        lienBlocsActif.segments = segments;
        
        elems.bind('mousemove.creerLien', function (event) {
            uiActualiserLien(start, event, segments);
        });
        elems.bind('click.creerLien', function (event) {
            log("Fin lien blocs");
            lienBlocsActif.elems.unbind('.creerLien');
            segments.remove();
            lienBlocsActif.actif = false;
        });
    } else {
        log("Connexion lien blocs");
        with (lienBlocsActif) {
            elems.unbind('.creerLien');
            actif = false;
            debug = this;
            uiActualiserLien(start, this, segments);
        }
    }
    
    return false;
}

jQuery.fn.extend({
    blink: function (count, speed) {
        elem = this;
        count = count || 10;
        speed = speed || 1000;
        
        // Mouseover
        // Todo : il y a des bugs graphiques ici,
        // et il faudrait enlever ce hook "mouseover"
        // après la première fois.
        elem.mouseover(function () {
            elem.clearQueue("blink");
            elem.queue("blink", function() {
                elem.removeClass('boutonHover', 1000);
            });
        });
        
        // Enqueue blinks
        for (; count > 0; count--) {
            elem.queue("blink", function () {
                elem.toggleClass('boutonHover', 1000, function() { elem.dequeue("blink"); });
            });
        }
        elem.queue("blink", function() {
            elem.removeClass('boutonHover', 1000);
        });
        
        // Start first blink
        elem.dequeue("blink");
    }
});

function logPauseToggle() {
    if (logPause) {
        $('.log .contenu').stop().scrollTo($('.log .contenu :last'), 200);
        logPause = false;
        $('#log-pause').text("pause");
    } else {
        logPause = true;
        $('.log .contenu').stop();
        $('#log-pause').text("play");
    }
}

function log(msg) {
    var elem = $('.log .contenu').append("<p>"+msg+"</p>");
    if (!logPause) {
        $('.log .contenu').stop().scrollTo($('.log .contenu :last'), 100);
    }
}
