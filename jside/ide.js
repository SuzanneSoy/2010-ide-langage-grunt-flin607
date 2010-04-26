$(document).ready(function () {
    setTimeout(init, 200);
});

function init() {
    $w = new world();
    
    $('#rechercher').click(uiRechercher);
    $('#nouveau-bloc').click(uiNouveauBloc);
    $('#serialiser').click(uiSerialiser);
    //$('#nouveau-lien').click(uiNouveauLien);
    logPause = false;
    $('#log-pause').click(logPauseToggle);

    log("Démarré.");
    log("Ajoutez des blocs à l'espace de travail pour construire un programme.");
    $('#nouveau-bloc').blink();

    test();
    
    var b = nouveauBloc("Scratch");
    editer(b.uid);
    rechercher('');
}

function test() {
    nouveauBloc("abcd");
    nouveauBloc("bc");
    nouveauBloc("xyz");
}

String.prototype.escapeXML = function() {
    return this
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
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
    }
});

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
        var res = $($('#modele-resultat-recherche').jqote(elem))
        .data("uid", elem.uid)
        .click(function() {
            log(elem.uid);
        });
        
        res.find('.editer').click(function() {
            arreterRecherche();
            uiEditer(elem.uid);
            return false;
        });
        
        res.find('.utiliser').click(function() {
            arreterRecherche();
            uiUtiliser(elem.uid);
            return false;
        });
        
        return res;
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

    $($('#modele-utilisation-bloc').jqote($w.blocs[uid]))
        /*.attr('id', "utilisation-" + uidParent + "-pour-" + uid)*/
        .draggable({ containment: '#edition-' + uidParent})
        .resizable()
        .find('.reduire')
            .click(uiReduireBloc)
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
    
    $("<div/>")
    .attr('id', "edition-" + b.uid)
    .hide()
    .appendTo('#edition-blocs');
    
    return b;
}

/* function uiShowBox() {
    var b = $w.addBloc();
    
    $('#edition').append("<div id=\"edition-" + b.uid + "\"></div>");
    var div = $('#edition-' + b.uid);
    
    div.addClass("bloc parent serialize");
    div.draggable({ containment: '#edition' });
    div.resizable();
    
    log("Nouveau bloc.");
} */

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
