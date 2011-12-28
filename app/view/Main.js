Ext.define('PhpBnl.view.Main', {
    extend: 'Ext.TabPanel',
    xtype: 'mainview',
    config: {
        fullscreen: true,
        layout: {
            type: 'card'
        },
        tabBarPosition: 'bottom',
        defaults: {
            scrollable: false,
            layout: 'fit'
        },
        items: [
            {xtype: 'home'},
            {xtype: 'schedule'},
            {xtype: 'mytracklist'},
            {xtype: 'travel'},
            {xtype: 'about'}
        ]
    }
});