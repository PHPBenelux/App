Ext.define('PhpBnl.view.Session', {
    extend: 'Ext.Panel',
    xtype: 'session',
    config: {
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
                xtype: 'dataview',
                id: 'sessionDetail',
                scrollable: true,
                layout: 'vbox',
                data: {},
                tpl: [
                    '<div><h3>{name}</h3>',
                    '<strong>Time: </strong>{time}<br>',
                    '<strong>Speaker: </strong>{speaker}<br>',
                    '<strong>Room: </strong>{room}<br><br>',
                    '<h4>Abstract</h4><p>{talkAbstract}</p>',
                    '<h4>Speaker biography</h4><p>{speakerBio}</p>',
                    '<img src="{speakerImage}" class="speakerimg" alt="picture of {speaker}"></div>'
                ]
            },
            {
                xtype: 'button',
                text: 'Add to My Tracklist',
                id: 'addbutton',
                align: 'right'
            }
        ]
    }
});