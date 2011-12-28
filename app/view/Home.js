Ext.define('PhpBnl.view.Home', {
    extend: 'Ext.Panel',
    xtype: 'home',
    config: {
        title: 'Home',
        iconCls: 'home',
        cls: 'phpbnl-card',
        items: [
            { xtype: 'toolbar', title: 'PHPBenelux 2012', docked: 'top' },
            {
                xtype: 'panel',
                scrollable: {
                    type: 'horizontal'
                },
                cls: 'homepanel',
                styleHtmlContent: true,
                html: new Ext.Template(
                        '<div id="homeContainer">',
                            '<img src="resources/images/phpbnl2012.png">',
                            '<h2>January 27 & 28</h2>',
                            '<h3>Antwerp, Belgium</h3>',
                        '</div>',
                        '<div id="tweet"></div>',
                        '<div id="news"></div>'
                    ).html,
                listeners: {
                    painted: function(){
                        getTwitters('tweet', {
                          id: '#phpbnl12 OR phpbenelux',
                          count: 10,
                          enableLinks: true,
                          ignoreReplies: true,
                          clearContents: true,
                          template: '<div class="tweetheader"><a href="http://www.twitter.com/%user_screen_name%">%user_screen_name%</a> said on  <a href="http://twitter.com/%user_screen_name%/statuses/%id_str%/">%time%</a></div><div class="tweettext">%text%</div>'
                        });
                    }
                }
            }
        ]
    }
});