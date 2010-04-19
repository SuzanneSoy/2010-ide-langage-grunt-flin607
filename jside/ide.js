$(document).ready(function () {
    setTimeout(init, 200);
});

function init() {
    $w = new world();
    
    $('#nouveau-bloc').click(uiNouveauBloc);
    $('#nouveau-lien').click(uiNouveauLien);
    logPause = false;
    $('#log-pause').click(logPauseToggle);
    
    log("Démarré.");
    log("Ajoutez des blocs à l'espace de travail pour construire un programme.");
}

function world() {
    this.blocs = [];
    this.maxuid = 0;
    this.addBloc = function () {
        var b = new bloc(this.maxuid++);
        this.blocs.push(b);
        return b;
    }
}

function bloc(uid) {
    this.uid = uid;
    this.nom = "Nouveau bloc";
    this.blocs = [];
    this.connexions = [];
}

function uiNouveauBloc() {
    var b = $w.addBloc();
    $('#edition').append("<div id=\"edition-" + b.uid + "\"></div>");
    var div = $('#edition-' + b.uid);
    div.width(250);
    div.height(100);
    div.css('top', 100);
    div.css('left', 200);
/*    div.left(100); */
    div.addClass("bloc parent");
    log("Nouveau bloc.");
}

function uiNouveauLien() {
    log("Nouveau lien.");
}

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
