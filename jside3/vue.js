function VMonde(m) {
    this.modèle = m;
    var elem = $.extend(this, (
        $('#vue-monde')
            .jqote(m)
            .appendTo('#editeur')));
    
    this.modèle.ajouterVue(this);
    
    new VBarreOutils(m.barreOutils);
    new VLog(m.log);
}

function VBarreOutils(b) {
    this.modèle = b;
    var elem = $.extend(this,(
        $('#vue-barre-outils')
            .jqote(b)
            .appendTo(b.monde.vues)));
    
    (elem)
        .draggable()
        .resizable()
        .find('.nouveau-bloc')
        .click(function() {
            elem.modèle.monde.log.envoiMessage("Nouveau bloc.");
            
            var b = new Bloc("Bloc 2");
            elem.modèle.monde.ajouterBloc(b);
            
            var ib = new InstanceBloc(b, elem.modèle.monde.scratch);
            b.ajouterInstance(ib);
            new VInstanceBloc(ib);
        })
        .end();
    
    this.modèle.ajouterVue(this);
}

function VLog(l) {
    this.modèle = l;
    var elem = $.extend(this,(
        $('#vue-log')
            .jqote(this.modèle)
            .appendTo(this.modèle.monde.vues)));

    (elem)
        .draggable()
        .resizable()
        .find('.log-pause')
        .click(function() {
            if (elem.modèle.pause) {
                elem.modèle.pause = false;
                elem.find('.messages')
                    .stop()
                    .scrollTo(elem.find('.messages :last'), 200);
                elem.find('.log-pause').val("pause");
            } else {
                elem.modèle.pause = true;
                elem.find('.messages').stop();
                elem.find('.log-pause').val("play");
            }
        })
        .end();
    
    elem.modèle.onMessage(function(msg) {
        var m = elem.find('.messages');
        m.append($('<div/>').text(msg));
        if (!elem.modèle.pause) {
            elem.find('.messages')
                .stop()
                .scrollTo(elem.find('.messages :last-child'), 100);
        }
    });
    
    elem.find('.messages')
        .css('top', elem.find('.titre').outerHeight());
    
    elem.modèle.ajouterVue(this);
}

function VInstanceBloc(ib) {
    debug2 = ib;
    this.modèle = ib;
    var elem = $.extend(this,(
        $('#vue-bloc')
            .jqote(ib)
            .appendTo(ib.définition.vues)));
    
    elem.draggable()
        .resizable()
        .find('.bloc.tabs.titres')
            .css('top', elem.find('.bloc.titre').outerHeight())
        .end()
        .find('.nouvelle-définition')
        .click(function() {
            elem.modèle.bloc.monde.log.envoiMessage("Nouvelle définition.");
            var d = new Définition();
            elem.modèle.bloc.ajouterDéfinition(d);
        })
        .end();
    
    elem.modèle.bloc.onAjoutInstanceBloc(function(instanceBloc) {
        
    });
    
    elem.modèle.ajouterVue(this);
}

function VDéfinition(d, vueInstanceBloc) {
    this.modèle = d;
    this.vueInstanceBloc = vueInstanceBloc;
    var elem = $.extend(this,(
        $('#vue-définition')
            .jqote(d)
            .appendTo(vueInstanceBloc)));
    
    //d.bloc.instances[0].vues.titres
    
    this.modèle.ajouterVue(this);
}

function test() {
    var m = new Monde("Le Monde");
    
    new VMonde(m);
    
    var b = new Bloc("Bloc 1");
    m.ajouterBloc(b);
    
    var ib = new InstanceBloc(b, m.scratch);
    b.ajouterInstance(ib);
    
    new VInstanceBloc(ib);
    
    testlog(m, 6);
}

$(function(){ test(); });
