function init() {
    // Monde
    $w = new world();
    
    // Connexions
    lienBlocsActif = { pret: true, actif: false, elems: $([])};
    
    // Barre d'outils
    $('#rechercher').click(uiRechercher);
    $('#nouveau-bloc').click(uiNouveauBloc);
    $('#serialiser').click(uiSerialiser);

    // Log
    logPause = false;
    $('#log-pause').click(logPauseToggle);
    $('#log-eval').click(logEval);
    
    // Panneau principal (édition).
    // Évitons que tout soit sélectionné lorsqu'on clique sur une zone vide:
    $('#edition').disableSelection();

    // Bienvenue
    log("Démarré.");
    log("Ajoutez des blocs à l'espace de travail pour construire un programme.");
    $('#nouveau-bloc').blink();
    rechercher('');
    
    demo();
}

function demo() {
    var a = nouveauBloc("abcd");
    var b = nouveauBloc("bc");
    var c = nouveauBloc("xyz");
    var d = nouveauBloc("Scratch");
    utiliser(a.uid, d.uid);
    utiliser(b.uid, d.uid);
    
    editer(d.uid);
}

$(document).ready(init);
