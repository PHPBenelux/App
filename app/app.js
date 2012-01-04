Ext.Loader.setConfig({
    enabled: true
});

Ext.application({
    name: 'PhpBnl',
    controllers: ['Home'],
    models: ['Room', 'Schedule', 'Talk', 'Tracklist']
    
});

var hsLink = function(el) {
    window.location = el.getAttribute("href");
    return false;
}