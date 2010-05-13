function MMonde(nom) {
    $.extend(this, {
        uid: singleton.uid(),
        // Propriétés
        nom: nom,
        // Parents
        // Enfants
        log: null,
        barreOutils: null, // J'ai des doutes sur la présence de barreOutils…
        blocs: [],
        scratch: null,
        // Ajout
        ajouterBloc: function(b) {
            b.monde = this;
            this.blocs.push(b);
        },
        définirBarreOutils: function(bo) {
            bo.monde = this;
            this.barreOutils = bo;
        },
        définirLog: function(l) {
            l.monde = this;
            this.log = l;
        },
        instancesLog: [],
        ajouterInstanceLog: function(il) {
            this.instancesLog.push(il);
            faireCallbacks(this.cbAjoutInstanceLog, il);
        },
        cbAjoutInstanceLog: [],
        onAjoutInstanceLog: function(callback) {
            this.cbAjoutInstanceLog.push(callback);
        },
        // Suppression
        supprimerBloc: function(b) {
            this.blocs.remove(b);
        }
    });
    /*this.scratch = new Bloc("Scratch");
    this.ajouterBloc(this.scratch);
    var iscratch = new InstanceBloc(this.scratch, {vues: this.vues}); // Attention, devrait utiliser une définition !!!
    this.scratch.ajouterInstance(iscratch);*/
    this.scratch = new MDéfinition(); // this.scratch.bloc == null;
    this.définirBarreOutils(new MBarreOutils());
    this.définirLog(new MLog());
}

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
    this.vue = new VMonde(appendToElement, mMonde);
    this.vue.vBarreOutils = new CBarreOutils(this.modèle.barreOutils, this.vue);
    //this.vue.vLog = new CLog(this.modèle.log, this.vue);
    
    var that = this;
    this.modèle.scratch.onAjoutInstanceBloc(function(instanceBloc) {
        var cib = new CInstanceBloc(instanceBloc, that.vue.vScratch);
    });
    
    this.modèle.onAjoutInstanceLog(function (instanceLog) {
        var cil = new CInstanceLog(instanceLog, that.vue);
    });
}

