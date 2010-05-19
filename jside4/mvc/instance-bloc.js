function MInstanceBloc(mBloc) {
    makeUid(this);
    makeField(this, 'mBloc', mBloc);
    makeField(this, 'dansDéfinition', null);
}

function VInstanceBloc(mInstanceBloc, emplacement) {
    makeView(this, 'vInstanceBloc', emplacement, 'vBloc');
    this.vBloc = new VBloc(mInstanceBloc.mBloc(), this.parties.vBloc, mInstanceBloc);

    this.vue.draggable().resizable();
}