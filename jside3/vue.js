/* function MQuelqueChose() */
/* function VQuelqueChose(vueParente) */
/* function CQuelqueChose(modèle, vueParente) */

/*
Règles :
Le modèle ne fait que des callbacks.
La vue ne peut que s'ajouter à sa vue parente.
Le contrôleur peut dialoguer avec son modèle, sa vue, et les enfants de sa vue.
Le contrôleur peut transmettre la vue parente reçue en paramètre à sa vue.
*/

function VMonde(appendToElement) {
    $.extend(this, (
        $('#vue-monde')
            .jqote({})
            .appendTo(appendToElement)));
    
    this.vBarreOutils = null;
    this.vLog = null;
    this.vScratch = this.find('.scratch');
}

function CMonde(mMonde, appendToElement) {
    this.modèle = mMonde;
    this.modèle.définirBarreOutils(new BarreOutils());
    this.modèle.définirLog(new Log());
    this.vue = new VMonde(appendToElement, mMonde);

    this.vue.vBarreOutils = new CBarreOutils(this.modèle.barreOutils, this.vue);
    this.vue.vLog = new CLog(this.modèle.log, this.vue);
    
    var that = this;
    this.modèle.scratch.onAjoutInstanceBloc(function(instanceBloc) {
        var cib = new CInstanceBloc(instanceBloc, that.vue.vScratch);
    })
}

function VBarreOutils(vMondeParente) {
    $.extend(this,(
        $('#vue-barre-outils')
            .jqote({})
            .appendTo(vMondeParente)));
    
    this.vBarreTitre = this.find('.barre-titre');
    this.vTitre = this.find('.titre');
    this.vBoutonNouveauBloc = this.find('.nouveau-bloc');
    
    this.draggable();
    this.resizable();
}

function CBarreOutils(mBarreOutils, vMondeParente) {
    this.modèle = mBarreOutils;
    this.vue = new VBarreOutils(vMondeParente);
    
    var that = this;
    (this.vue.vBoutonNouveauBloc)
        .click(function() {
            that.modèle.monde.log.envoiMessage("Nouveau bloc.");
            var b = new Bloc("Bloc 2");
            var ib = b.demanderInstance();
            that.modèle.monde.scratch.ajouterInstanceBloc(ib);
            
            /* new CInstanceBloc(null, ib); // TODO */
        });
}

function VLog(vMondeParente) {
    $.extend(this,(
        $('#vue-log')
            .jqote({})
            .appendTo(vMondeParente)));
    
    this.vBarreTitre = this.find('.barre-titre');
    this.vTitre = this.find('.titre');
    this.vBoutonPause = this.find('.log.pause');
    this.vBoutonPlay = this.find('.log.play');
    this.vMessages = this.find('.messages');
    
    this.doPlay = function() {
        this.vMessages.stop().scrollToLast(200);
        this.vBoutonPause.show();
        this.vBoutonPlay.hide();
    };
    this.doPause = function() {
        this.vMessages.stop();
        this.vBoutonPause.hide();
        this.vBoutonPlay.show();
    };
    
    this.draggable();
    this.resizable();
    this.vMessages.css('top', this.vBarreTitre.outerHeight());
    this.doPlay();
}

function CLog(mLog, vMondeParente) {
    this.modèle = mLog;
    this.vue = new VLog(vMondeParente);
    
    var that = this;
    this.vue.vBoutonPause.add(this.vue.vBoutonPlay)
        .click(function() {
            if (that.modèle.pause) {
                that.modèle.pause = false;
                that.vue.doPlay();
            } else {
                that.modèle.pause = true;
                that.vue.doPause();
            }
        });

    this.modèle.onMessage(function(msg) {
        that.vue.vMessages.append($('<div/>').text(msg));
        if (!that.modèle.pause) {
            that.vue.vMessages.stop().scrollToLast(100);
        }
    });
}

function VInstanceBloc(vDéfinitionParente) {
    $.extend(this,(
        $('#vue-bloc')
            .jqote({})
            .appendTo(vDéfinitionParente)));

    this.vBarreTitre = this.find('.barre-titre');
    this.vTitre = this.find('.titre');
    this.vTitresTabs = this.find('.bloc.tabs.titres');
    this.vBoutonNouvelleDéfinition = this.find('.nouvelle-définition');

    this.draggable();
    this.resizable();
    this.vTitresTabs.css('top', this.vBarreTitre.outerHeight());
}

function CInstanceBloc(mInstanceBloc, vDéfinitionParente) {
    this.modèle = mInstanceBloc;
    this.vue = new VInstanceBloc(vDéfinitionParente);
    
    (this.vue.vBoutonNouvelleDéfinition)
        .click(function() {
            elem.modèle.bloc.monde.log.envoiMessage("Nouvelle définition.");
            var d = new Définition();
            elem.modèle.bloc.ajouterDéfinition(d);
        });
    
    this.modèle.bloc.onAjoutDéfinition(function(définition) {
        console.log("Ajout de définition", définition);
    });
}

function VDéfinition(d, vInstanceBlocParente) {
    this.modèle = d;
    this.vInstanceBloc = vInstanceBlocParente;
    var elem = $.extend(this,(
        $('#vue-définition')
            .jqote(d)
            .appendTo(vueInstanceBloc)));
    
    //d.bloc.instances[0].vues.titres
    
    this.modèle.ajouterVue(this);
}

function test() {
    var m = new Monde("Le Monde");
    var cm = new CMonde(m, '#editeur');
    
/*    var b = new Bloc("Bloc 1");
    m.ajouterBloc(b);
    
    var ib = new InstanceBloc(b, m.scratch);
    b.ajouterInstance(ib);
    
    new VInstanceBloc(null, ib); // TODO
    */
    testlog(m, 6);
}

$(function(){ test(); });
