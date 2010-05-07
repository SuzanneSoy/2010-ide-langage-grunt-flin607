/* Blocs côté système */
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

/* Blocs côté affichage */

/* Création d'un bloc */

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
        .preparerBlocConnexions('edition')
        .appendTo('#edition-blocs');
    
    return b;
}

/* Édition d'un bloc */

function uiEditer(uid) {
    log("Édition de " + uid);
    editer(uid);
}

function editer(uid) {
    arreterRecherche();
    $('#edition-' + $w.blocActif).hide();
    $w.blocActif = uid;
    $('#edition-' + uid).show();
}

/* Utilisation d'un bloc */

function uiUtiliser(uid) {
    var uidParent = $w.blocActif;
    log("Utilisation de " + $w.blocs[uid].nom + " pour " + $w.blocs[uidParent].nom);
    utiliser(uid, uidParent);
}

function utiliser(uid, uidParent) {
    $('#modele-utilisation-bloc')
        .jqote($w.blocs[uid])
        .toDom()
        .draggable({ containment: '#edition-' + uidParent + ' .contenu:first'})
        .resizable({ containment: '#edition-' + uidParent + ' .contenu:first'}) /* Small bug here… */
        .find('.reduire')
            .click(uiReduireBloc)
            .end()
        .preparerBlocConnexions()
        .css('position', 'absolute') // Chrome seems to ignore this in the css file.
        .appendTo($('#edition-' + uidParent + ' .contenu').first());
}

function uiReduireBloc () {
    $(this)
        /*.toggleClass('icone-moins')
        .toggleClass('icone-plus')*/
        .parents('.bloc:first')
        .find('.tete')
            .toggle()
            .end()
        .find('.contenu .description')
            .toggle()
            .end()
        .find('.contenu .titre')
            .toggle()
            .end()
        .toggleResizable()
        // TODO : devrait envoyer 'reduire' un coup sur deux, et 'agrandir' sinon
        .trigger('reduire');
}
