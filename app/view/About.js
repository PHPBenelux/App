Ext.define('PhpBnl.view.About', {
    extend: 'Ext.Panel',
    xtype: 'about',
    config: {
        title: 'About',
        iconCls: 'info',
        cls: 'phpbnl-card',
        items: [
            { xtype: 'toolbar', title: 'About', docked: 'top' },
            {
                xtype: 'panel',
                scrollable: true,
                styleHtmlContent: true,
                layout: 'vbox',
                html:  new Ext.Template(
                    '<h3>PHPBenelux</h3>',
                    '<p>PHPBenelux is a non-profit usergroup for the Benelux. We organize meetings and conferences for PHP developers and companies using PHP. These events contain technical talks, workshops and best-practice sessions to share and improve the knowledge among developers. PHPBenelux also aims to promote PHP as a language to enterprises and software developers who are looking to incorporate an alternative technology.</p>',
                    '<h3>Conference</h3>',
                    '<p>Since 2010 the PHPBenelux anually organises it\'s own conference. Starting ',
                    'out as a one day event it soon grew out to a full-scaled conference which ',
                    'is well known around the world by both it\'s speakers and it\'s visitors.</p>',
                    '<h3>Sponsors 2012</h3>',
                    '<ul>',
                    '    <li>Sugar CRM</li>',
                    '    <li>Combell</li>',
                    '    <li>Enrise</li>',
                    '    <li>Microsoft</li>',
                    '    <li>Amazium</li>',
                    '    <li>DX Solutions</li>',
                    '    <li>Mongo DB</li>',
                    '    <li>Netlash bSeen</li>',
                    '    <li>Openminds</li>',
                    '    <li>Easy to book</li>',
                    '    <li>In2it</li>',
                    '    <li>Inventis</li>',
                    '    <li>Cu.be</li>',
                    '    <li>Ibuildings</li>',
                    '    <li>MyUpcoming.com</li>',
                    '    <li>PHP|Architect</li>',
                    '</ul>',
                    '<h3>This app</h3>',
                    '<p>This app has been created by ',
                    '<a href="http://www.martindekeijzer.nl" target="_blank">Martin de Keijzer</a> ',
                    '<p>&copy; 2011 PHPBenelux User Group</p>'
                ).html
            }
        ]
    }
});