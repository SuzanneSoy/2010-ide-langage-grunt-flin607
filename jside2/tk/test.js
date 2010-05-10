$(function () {
    tk.bloc('Un bloc')
        .attr('id', 'test-tk-widget')
        .topY(200)
        .appendTo('body');
    
    tk.bloc('Un bloc', tk.onglets())
        .attr('id', 'test-tk-widget')
        .leftX(200)
        .appendTo('body');
});
