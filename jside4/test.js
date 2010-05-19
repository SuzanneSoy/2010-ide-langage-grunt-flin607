$(function() {
    var mFibo = new MBloc();
    var iFibo = new MInstanceBloc(mFibo);
    var vFibo = new VInstanceBloc(iFibo, $('#éditeur'));

    var mDéfinitionFibo = new MDéfinition();
    mFibo.mListeDéfinitions().addDéfinitions(mDéfinitionFibo);
    
    var mMoinsUn = new MBloc();
    mMoinsUn.mTitreBloc().titre('x - 1');
    mDéfinitionFibo.addInstancesBlocs(new MInstanceBloc(mMoinsUn));

    var mUn = new MBloc();
    mUn.mTitreBloc().titre('1');
    mDéfinitionFibo.addInstancesBlocs(new MInstanceBloc(mUn));

    window.setTimeout(function() {
        /*var mvic = new MVInstanceConnexion(null, vib.vue, vib2.vue); */
        /*new VInstanceConnexion(mvic, $('#éditeur')); */
    }, 2000);
});