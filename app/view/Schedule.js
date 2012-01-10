Ext.define('PhpBnl.view.Schedule', {
    extend: 'Ext.Panel',
    xtype: 'schedule',
    config: {
        title: 'Schedule',
        iconCls: 'calendar',
        items: [
            { xtype: 'toolbar', title: 'Schedule', docked: 'top' },
            {
                xtype: 'tabpanel',
                id: 'scheduleTabs',
                ui: 'light',
                items: [
                    {
                        title: 'January 27',
                        id: '27',
                        xtype: 'list',
                        grouped: true,
                        store: 'Schedule',
                        itemTpl: new Ext.XTemplate(
                            '{name}&nbsp;',
                            '<tpl if="speaker != \'\'">',
                            '({speaker})',
                            '</tpl>')
                    },
                    {
                        title: 'January 28',
                        id: '28',
                        xtype: 'list',
                        grouped: true,
                        store: 'Schedule',
                        itemTpl: new Ext.XTemplate(
                            '{name}&nbsp;',
                            '<tpl if="speaker != \'\'">',
                            '({speaker})',
                            '</tpl>')
                    }
                ]
            }
        ]
    }
});