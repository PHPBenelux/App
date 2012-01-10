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
                preventZooming: false,
                layout: 'vbox',
                data: [],
                tpl: new Ext.Template(
                    '<h3>PHPBenelux</h3>',
                    '<p>PHPBenelux is a non-profit usergroup for the Benelux. We organize meetings and conferences for PHP developers and companies using PHP. These events contain technical talks, workshops and best-practice sessions to share and improve the knowledge among developers. PHPBenelux also aims to promote PHP as a language to enterprises and software developers who are looking to incorporate an alternative technology.</p>',
                    '<h3>Conference</h3>',
                    '<p>Since 2010 the PHPBenelux anually organises it\'s own conference. Starting ',
                    'out as a one day event it soon grew out to a full-scaled conference which ',
                    'is well known around the world by both it\'s speakers and it\'s visitors.</p>',
                    '<h3>Sponsors 2012</h3>',
                    '<ul>',
                    '    <li><a href="http://conference.phpbenelux.eu/2012/sponsors/sugarcrm/">Sugar CRM</a></li>',
                    '    <li><a href="http://www.combell.com/">Combell</a></li>',
                    '    <li><a href="http://www.enrise.com/">Enrise</a></li>',
                    '    <li><a href="http://conference.phpbenelux.eu/2012/sponsors/microsoft/">Microsoft</a></li>',
                    '    <li><a href="http://conference.phpbenelux.eu/2012/sponsors/amazium/">Amazium</a></li>',
                    '    <li><a href="http://conference.phpbenelux.eu/2012/sponsors/dx-solutions/">DX Solutions</a></li>',
                    '    <li><a href="http://conference.phpbenelux.eu/2012/sponsors/10gen/">Mongo DB</a></li>',
                    '    <li><a href="http://www.netlash-bseen.be/">Netlash bSeen</a></li>',
                    '    <li><a href="http://conference.phpbenelux.eu/2012/sponsors/openminds/">Openminds</a></li>',
                    '    <li><a href="http://conference.phpbenelux.eu/2012/sponsors/techademy/">TechAdemy</a></li>',
                    '    <li><a href="http://conference.phpbenelux.eu/2012/sponsors/easytobook-com/">Easy to book</a></li>',
                    '    <li><a href="http://conference.phpbenelux.eu/2012/sponsors/in2it-vof-professional-php-services/">In2it</a></li>',
                    '    <li><a href="http://conference.phpbenelux.eu/2012/sponsors/inventis/">Inventis</a></li>',
                    '    <li><a href="http://www.cu.be/">Cu.be</a></li>',
                    '    <li><a href="http://www.ibuildings.com/">Ibuildings</a></li>',
                    '    <li><a href="http://www.myupcoming.com/">MyUpcoming.com</a></li>',
                    '    <li><a href="http://conference.phpbenelux.eu/2012/sponsors/orchestra/">Orchestra</a></li>',
                    '    <li><a href="http://www.phparch.com/">PHP|Architect</a></li>',
                    '    <li><a href="http://www.zend.com/">Zend</a></li>',
                    '</ul>',
                    '<h3>This app</h3>',
                    '<p>This app has been created by ',
                    '<a href="http://www.martindekeijzer.nl">Martin de Keijzer</a> ',
                    '<p>&copy; 2011/2012 PHPBenelux User Group</p>'
                ),
                listeners: {
                    painted: function() {
                        Ext.select('a').each(function(el) {
                            el.dom.addEventListener('click', function(el){
                                window.location = el.href;
                            }, false);
                        });
                    }
                }
            }
        ]
    }
});