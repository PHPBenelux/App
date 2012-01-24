Ext.Loader.setConfig({
    enabled: true
});

Ext.application({
    name: 'PhpBnl',
    controllers: ['Home'],
    models: ['Schedule', 'Tracklist']
    
});