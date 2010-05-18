function MMonde(nom) {
    $.extend(this, {
        uid: singleton.uid(),
        // Propriétés
        nom: nom,
        // Parents
        // Enfants
        log: null,
        recherche: null,
        barreOutils: null, // J'ai des doutes sur la présence de barreOutils…
        blocs: [],
        mBlocScratch: null,
        mDéfinitionScratch: null,
        // Ajout
        ajouterBloc: function(b) {
            b.monde = this;
            this.blocs.push(b);
            var that = this;
            b.onModification(function(b) {
                faireCallbacks(that.cbModificationBloc, b);
            });
            faireCallbacks(this.cbAjoutBloc, b);
        },
        cbAjoutBloc: [],
        onAjoutBloc: function(callback) {
            this.cbAjoutBloc.push(callback);
        },
        cbModificationBloc: [],
        onModificationBloc: function(callback) {
            this.cbModificationBloc.push(callback);
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
        instancesRecherche: [],
        ajouterInstanceRecherche: function(ir) {
            this.instancesRecherche.push(ir);
            faireCallbacks(this.cbAjoutInstanceRecherche, ir);
        },
        cbAjoutInstanceRecherche: [],
        onAjoutInstanceRecherche: function(callback) {
            this.cbAjoutInstanceRecherche.push(callback);
        },
        // Suppression
        supprimerBloc: function(b) {
            this.blocs.remove(b);
        }
    });

    var that = this;
    
    /* Actions */
    this.actionAucune = function() {};
    this.actionNouveauBloc = function(cDéfinition, rect, rectParent) {
        that.outilZone = that.actionAucune;
        if (rect.width < 10 || rect.height < 10) {
            return;
        }
        
        var mb = new MBloc();
        that.ajouterBloc(mb);
        var mib = mb.demanderInstance();
        mib.rect = rect;
        mib.rectParent = rectParent
        cDéfinition.modèle.ajouterInstanceBloc(mib);
    };

    this.actionInstanceBloc_mBloc = null;
    this.actionInstanceBloc = function(cDéfinition, rect, rectParent) {
        that.outilZone = that.actionAucune;
        if (rect.width < 10 || rect.height < 10 || that.actionInstanceBloc_mBloc === null) {
            return;
        }
        
        console.log(that);
        var mib = that.actionInstanceBloc_mBloc.demanderInstance();
        mib.rect = rect;
        mib.rectParent = rectParent
        cDéfinition.modèle.ajouterInstanceBloc(mib);
    };
    
    /* Outils */
    this.outilZone = this.actionNouveauBloc;
    
    /* Scratch */
    this.mBlocScratch = new MBloc();
    this.mBlocScratch.changeNom("Scratch");
    this.ajouterBloc(this.mBlocScratch);
    this.mDéfinitionScratch = new MDéfinition();
    this.mBlocScratch.ajouterDéfinition(this.mDéfinitionScratch);
    
    /* this.scratch = new MDéfinition(); // this.scratch.bloc == null; */
    this.barreOutils = new MBarreOutils();
    this.barreOutils.monde = this;
    this.recherche = new MRecherche();
    this.recherche.monde = this;
    this.log = new MLog();
    this.log.monde = this;
}

function VMonde(appendToElement) {
    $.extend(this, (
        $('#vue-monde')
            .jqote({})
            .appendTo(appendToElement)));
    
    this.vBarreOutils = null;
    this.vScratch = this.find('.scratch');
    
    this.ajoutVDéfinition = function(vTitreDéfinition, vCorpsDéfinition) {
        this.vScratch.replaceWith(vCorpsDéfinition);
        this.vScratch = vCorpsDéfinition;
    }
}

function CMonde(mMonde, appendToElement) {
    this.modèle = mMonde;
    this.vue = new VMonde(appendToElement, mMonde);
    this.vue.vBarreOutils = new CBarreOutils(this.modèle.barreOutils, this.vue);
    
    var that = this;
    
    CDéfinition(this.modèle.mDéfinitionScratch, this.vue);
    
    this.modèle.onAjoutInstanceLog(function (instanceLog) {
        var cil = new CInstanceLog(instanceLog, that.vue);
    });
    
    this.modèle.onAjoutInstanceRecherche(function (instanceRecherche) {
        var cil = new CInstanceRecherche(instanceRecherche, that.vue);
    });
}

