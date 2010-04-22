$(document).ready(function () {
    setTimeout(init, 200);
});

$(function() {
    $("#resizable").resizable();
});

function init() {
    $w = new world();
    
    $('#rechercher').click(uiRechercher);
    $('#nouveau-bloc').click(uiNouveauBloc);
    $('#serialiser').click(uiSerialiser);
    //$('#nouveau-lien').click(uiNouveauLien);
    logPause = false;
    $('#log-pause').click(logPauseToggle);

    $('#test').resizable();
    
    log("Démarré.");
    log("Ajoutez des blocs à l'espace de travail pour construire un programme.");
    $('#nouveau-bloc').blink();

    test();
}

function test() {
    $w.addBloc("abcd");
    $w.addBloc("bc");
    $w.addBloc("xyz");
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

function bloc(uid, nom) {
    this.uid = uid;
    this.nom = nom || "Nouveau bloc";
    this.definitions = [];
    log("Nouveau bloc \"" + this.nom + "\"");
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
        this.map(function(e) {
            return $([e]).attr(value)
        });
    }
});

function uiRechercher() {
    log("Recherche…");
    var terme = $('#nom-bloc').val()
    var res = $.grep($w.blocs, function (b) {
        return b.nom.indexOf(terme) >= 0;
    });

    $(res).appendTo('#edition');
    log("ok");
}

function uiSerialiser() {
    log($('#edition').serializeDOM());
}

function uiNouveauBloc() {
    $w.addBloc($('#nom-bloc').val());
}

function uiShowBox() {
    var b = $w.addBloc();
    
    $('#edition').append("<div id=\"edition-" + b.uid + "\"></div>");
    var div = $('#edition-' + b.uid);
    
    div.addClass("bloc parent serialize");
    div.draggable({ containment: '#edition' });
    div.resizable();
    
    log("Nouveau bloc.");
}

jQuery.fn.extend({
    blink: function (count, speed) {
        elem = this;
        count = count || 10;
        speed = speed || 1000;
        
        // Mouseover
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
        $('#log-contenu').stop().scrollTo($('#log-contenu :last'), 200);
        logPause = false;
        $('#log-pause').text("pause");
    } else {
        logPause = true;
        $('#log-contenu').stop();
        $('#log-pause').text("play");
    }
}

function log(msg) {
    var elem = $('#log-contenu').append("<p>"+msg+"</p>");
    if (!logPause) {
        $('#log-contenu').stop().scrollTo($('#log-contenu :last'), 100);
    }
}
