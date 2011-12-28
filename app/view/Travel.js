Ext.define('PhpBnl.view.Travel', {
    extend: 'Ext.Panel',
    xtype: 'travel',
    config: {
        title: 'Travel',
        iconCls: 'globe2',
        items: [
            { xtype: 'toolbar', title: 'Travel', docked: 'top' },
            {
                xtype: 'tabpanel',
                ui: 'light',
                items: [
                    {
                        title: 'Map',
                        xtype : 'panel',
                        styleHtmlContent: true,
                        id: 'mapPanel'
                    },
                    {
                        title: 'Directions',
                        id: 'directionsWrapper',
                        scrollable: true,
                        xtype: 'panel',
                        styleHtmlContent: true,
                        html: '<div id="directionsPanel">&nbsp;</div>'
                    }
                ]
            }
        ]
    }
});