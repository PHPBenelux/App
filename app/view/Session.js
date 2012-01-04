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
                margin: 10
            }
        ]
    }
});