$(document).ready(function () {
    setTimeout(init, 200);
});

function init() {
    log("Démarré.");
    log("Ajoutez des blocs à l'espace de travail pour construire un programme.");
}

function log(msg) {
    $('#log-content').append("<p>"+msg+"</p>");
}
