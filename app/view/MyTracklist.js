Ext.define('PhpBnl.view.MyTracklist', {
    extend: 'Ext.Panel',
    xtype: 'mytracklist',
    config: {
        title: "My tracklist",
        iconCls: "sign_leftright2",
        items: [
            { xtype: 'toolbar', title: 'My Tracklist', docked: 'top' },
            {
                xtype: 'list',
                itemTpl: '{time} - {name}',
                store: 'Tracklist'
            }
        ]
    }
});