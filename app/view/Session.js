Ext.define('PhpBnl.view.Session', {
    extend: 'Ext.Panel',
    xtype: 'session',
    config: {
        layout: 'vbox',
        scrollable: true,
        items: [
            {
                xtype: 'toolbar',
                id: 'sessionToolbar',
                title: '...',
                docked: 'top',
                items: [
                    {
                        xtype: 'button',
                        text: 'Back',
                        ui: 'back',
                        id: 'backbutton',
                        align: 'left'
                    }
                ]
            },
            {
                xtype: 'panel',
                id: 'sessionDetail',
                styleHtmlContent: true,
                data: [],
                tpl: new Ext.XTemplate([
                    '<div><h3>{name}</h3>',
                    '<strong>Time: </strong>{time}<br>',
                    '<tpl if="speaker != \'\'">',
                        '<strong>Speaker: </strong>{speaker}<br>',
                    '</tpl>',
                    '<tpl if="room != \'\'">',
                        '<strong>Room: </strong>{room}<br><br>',
                    '</tpl>',
                    '<tpl if="talkAbstract != \'\'">',
                        '<h4>Abstract</h4><p>{talkAbstract}</p>',
                    '</tpl>',
                    '<tpl if="speakerBio != \'\'">',
                        '<h4>Speaker biography</h4><p>{speakerBio}</p>',
                    '</tpl>',
                    '<tpl if="speakerImage != \'\'">',
                        '<img src="{speakerImage}" class="speakerimg" alt="picture of {speaker}"></div>',
                    '</tpl>'
                ])
            }//,
//            {
//                xtype: 'button',
//                text: 'Add to My Tracklist',
//                id: 'addbutton',
//                margin: 10
//            }
        ]
    }
});