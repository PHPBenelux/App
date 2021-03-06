/**
 * @private
*/
Ext.define('Ext.dataview.element.List', {
    extend: 'Ext.dataview.element.Container',

    updateBaseCls: function(newBaseCls, oldBaseCls) {
        var me = this;
        me.callParent(arguments);
        me.itemClsShortCache = newBaseCls + '-item';

        me.headerClsShortCache = newBaseCls + '-header';
        me.headerClsCache = '.' + me.headerClsShortCache;

        me.headerItemClsShortCache = newBaseCls + '-header-item';

        me.footerClsShortCache = newBaseCls + '-footer-item';
        me.footerClsCache = '.' + me.footerClsShortCache;

        me.labelClsShortCache = newBaseCls + '-item-label';
        me.labelClsCache = '.' + me.labelClsShortCache;

        me.disclosureClsShortCache = newBaseCls + '-disclosure';
        me.disclosureClsCache = '.' + me.disclosureClsShortCache;

        me.iconClsShortCache = newBaseCls + '-icon';
        me.iconClsCache = '.' + me.iconClsShortCache;
    },

    hiddenDisplayCache: Ext.baseCSSPrefix + 'hidden-display',

    getItemElementConfig: function(index, data) {
        var me = this,
            dataview = me.dataview,
            config = {
                cls: me.itemClsShortCache,
                children: [{
                    cls: me.labelClsShortCache,
                    html: dataview.getItemTpl().apply(data)
                }]
            },
            iconSrc;

        if (dataview.getIcon()) {
            iconSrc = data.iconSrc;
            config.children.push({
                cls: me.iconClsShortCache,
                style: 'background-image: ' + iconSrc ? 'url("' + newSrc + '")' : ''
            });
        }

        if (dataview.getOnItemDisclosure()) {
            config.children.push({
                cls: me.disclosureClsShortCache + ((data.disclosure === false) ? me.hiddenDisplayCache : '')
            });
        }
        return config;
    },

    updateListItem: function(record, item) {
        var me = this,
            dataview = me.dataview,
            extItem = Ext.fly(item),
            innerItem = extItem.down(me.labelClsCache, true),
            data = record.data,
            disclosure = data && data.hasOwnProperty('disclosure'),
            iconSrc = data && data.hasOwnProperty('iconSrc'),
            disclosureEl, iconEl;

        innerItem.innerHTML = dataview.getItemTpl().apply(data);

        if (disclosure && dataview.getOnItemDisclosure()) {
            disclosureEl = extItem.down(me.disclosureClsCache);
            disclosureEl[disclosure ? 'removeCls' : 'addCls'](me.hiddenDisplayCache);
        }

        if (dataview.getIcon()) {
            iconEl = extItem.down(me.iconClsCache, true);
            iconEl.style.backgroundImage = iconSrc ? 'url("' + iconSrc + '")' : '';
        }
    },

    doRemoveHeaders: function() {
        var me = this,
            existingHeaders = me.element.query(me.headerClsCache),
            existingHeadersLn = existingHeaders.length,
            i = 0,
            item;

        for (; i < existingHeadersLn; i++) {
            item = existingHeaders[i];
            Ext.fly(item.parentNode).removeCls(me.headerItemClsShortCache);
            Ext.removeNode(item);
        }
    },

    doRemoveFooterCls: function() {
        var me = this,
            footerClsCache = me.footerClsCache,
            existingFooters = me.element.query(footerClsCache),
            existingFootersLn = existingFooters.length,
            i = 0;

        for (; i < existingFootersLn; i++) {
            Ext.fly(existingFooters[i]).removeCls(footerClsCache);
        }
    },

    doAddHeader: function(item, html) {
        item = Ext.fly(item);
        item.insertFirst(Ext.Element.create({
            cls: this.headerClsShortCache,
            html: html
        }));
        item.addCls(this.headerItemClsShortCache);
    }
});
