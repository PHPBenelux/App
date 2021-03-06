/**
 * List is a custom styled DataView which allows Grouping, Indexing, Icons, and a Disclosure.
 *
 * # Example:
 *
 * Here is an example of the usage in a {@link Ext.List}:
 *
 *     @example miniphone preview
 *     Ext.define('Contact', {
 *        extend: 'Ext.data.Model',
 *        fields: ['firstName', 'lastName']
 *     });
 *
 *     var store = Ext.create('Ext.data.Store', {
 *        model: 'Contact',
 *        sorters: 'lastName',
 *
 *        getGroupString: function(record) {
 *            return record.get('lastName')[0];
 *        },
 *
 *        data: [
 *            {firstName: 'Tommy',   lastName: 'Maintz'},
 *            {firstName: 'Rob',     lastName: 'Dougan'},
 *            {firstName: 'Ed',      lastName: 'Spencer'},
 *            {firstName: 'Jamie',   lastName: 'Avins'},
 *            {firstName: 'Aaron',   lastName: 'Conran'},
 *            {firstName: 'Dave',    lastName: 'Kaneda'},
 *            {firstName: 'Jacky',   lastName: 'Nguyen'},
 *            {firstName: 'Abraham', lastName: 'Elias'},
 *            {firstName: 'Jay',     lastName: 'Robinson'},
 *            {firstName: 'Nigel',   lastName: 'White'},
 *            {firstName: 'Don',     lastName: 'Griffin'},
 *            {firstName: 'Nico',    lastName: 'Ferrero'},
 *            {firstName: 'Nicolas', lastName: 'Belmonte'},
 *            {firstName: 'Jason',   lastName: 'Johnston'}
 *        ]
 *     });
 *
 *     var list = Ext.create('Ext.List', {
 *        fullscreen: true,
 *        itemTpl: '<div class="contact">{firstName} <strong>{lastName}</strong></div>',
 *        store: store
 *     });
 *
*/
Ext.define('Ext.dataview.List', {
    alternateClassName: 'Ext.List',
    extend: 'Ext.dataview.DataView',
    xtype : 'list',

    requires: [
        'Ext.dataview.element.List',
        'Ext.dataview.IndexBar',
        'Ext.dataview.ListItemHeader'
    ],

    /**
     * @event disclose
     * @preventable doDisclose
     * Fires whenever a disclosure is handled
     * @param {Ext.dataview.List} this The List instance
     * @param {Ext.data.Model} record The record assisciated to the item
     * @param {HTMLElement} target The element doubletapped
     * @param {Number} index The index of the item doubletapped
     * @param {Ext.EventObject} e The event object
     */

    config: {
        /**
         * @cfg {Boolean/Object} indexBar
         * True to render an alphabet IndexBar docked on the right.
         * This can also be a config object that will be passed to {@link Ext.IndexBar}
         * (defaults to false)
         * @accessor
         */
        indexBar: false,

        icon: null,

        /**
         * @cfg {Boolean} clearSelectionOnDeactivate
         * True to clear any selections on the list when the list is deactivated (defaults to true).
         * @accessor
         */
        clearSelectionOnDeactivate: true,

        /**
         * @cfg {Boolean} preventSelectionOnDisclose True to prevent the item selection when the user
         * taps a disclose icon. Defaults to <tt>true</tt>
         * @accessor
         */
        preventSelectionOnDisclose: true,

        // @inherit
        baseCls: Ext.baseCSSPrefix + 'list',

        /**
         * @cfg {Boolean} pinHeaders
         * Whether or not to pin headers on top of item groups while scrolling for an iPhone native list experience.
         * @accessor
         */
        pinHeaders: true,

        /**
         * @cfg {Boolean} grouped
         * Whether or not to group items in the provided Store with a header for each item.
         * @accessor
         */
        grouped: null,

        /**
         * @cfg {Boolean/Function/Object} onItemDisclosure
         * True to display a disclosure icon on each list item.
         * This won't bind a listener to the tap event. The list
         * will still fire the disclose event though.
         * By setting this config to a function, it will automatically
         * add a tap event listeners to the disclosure buttons which
         * will fire your function.
         * Finally you can specify an object with a 'scope' and 'handler'
         * property defined. This will also be bound to the tap event listener
         * and is useful when you want to change the scope of the handler.
         * @accessor
         */
        onItemDisclosure: null
    },

    constructor: function() {
        this.translateHeader = (Ext.os.is.Android2) ? this.translateHeaderCssPosition : this.translateHeaderTransform;
        this.callParent(arguments);
    },

    // apply to the selection model to maintain visual UI cues
    onItemTrigger: function(container, target, index, e) {
        if (!(this.getPreventSelectionOnDisclose() && Ext.fly(e.target).hasCls(this.getBaseCls() + '-disclosure'))) {
            this.callParent(arguments);
        }
    },

    doInitialize: function() {
        var me = this,
            container;

        me.on(me.getTriggerCtEvent(), me.onContainerTrigger, me);

        container = me.container = this.add(new Ext.dataview.element.List({
            baseCls: this.getBaseCls()
        }));
        container.dataview = me;

        container.on(me.getTriggerEvent(), me.onItemTrigger, me);

        container.element.on({
            delegate: '.' + this.getBaseCls() + '-disclosure',
            tap: 'handleItemDisclosure',
            scope: me
        });

        container.on({
            itemtouchstart: 'onItemTouchStart',
            itemtouchend: 'onItemTouchEnd',
            itemtap: 'onItemTap',
            itemtaphold: 'onItemTapHold',
            itemtouchmove: 'onItemTouchMove',
            itemdoubletap: 'onItemDoubleTap',
            itemswipe: 'onItemSwipe',
            scope: me
        });

        if (this.getStore()) {
            this.refresh();
        }
    },

    applyIndexBar: function(indexBar) {
        return Ext.factory(indexBar, Ext.dataview.IndexBar, this.getIndexBar());
    },

    updateIndexBar: function(indexBar) {
        if (indexBar && this.getScrollable()) {
            this.getScrollableBehavior().getScrollView().getElement().appendChild(indexBar.renderElement);

            indexBar.on({
                index: 'onIndex',
                scope: this
            });

            this.element.addCls(this.getBaseCls() + '-indexed');
        }
    },

    updateGrouped: function(grouped) {
        if (grouped) {
            this.doRefreshHeaders();
            this.updatePinHeaders(this.getPinHeaders());
        }
        else {
            this.doRemoveHeaders();
            this.updatePinHeaders(null);
        }
    },

    updatePinHeaders: function(pinnedHeaders) {
        var scrollable = this.getScrollable(),
            scroller;

        if (scrollable) {
            scroller = scrollable.getScroller();
        }

        if (!scrollable) {
            return;
        }

        if (pinnedHeaders && this.getGrouped()) {
            scroller.on({
                refresh: 'doRefreshHeaders',
                scroll: 'onScroll',
                scope: this
            });

            if (!this.header || !this.header.renderElement.dom) {
                this.createHeader();
            }
        } else {
            scroller.un({
                refresh: 'onScrollerRefresh',
                scroll: 'onScroll',
                scope: this
            });

            if (this.header) {
                this.header.destroy();
            }
        }
    },

    createHeader: function() {
        var header,
            scrollable = this.getScrollable(),
            scroller, scrollView, scrollViewElement;

        if (scrollable) {
            scroller = scrollable.getScroller();
            scrollView = this.getScrollableBehavior().getScrollView();
            scrollViewElement = scrollView.getElement();
        }
        else {
            return;
        }

        this.header = header = Ext.create('Ext.dataview.ListItemHeader', {
            html: ' ',
            cls: 'x-list-header-swap'
        });
        scrollViewElement.dom.insertBefore(header.element.dom, scroller.getContainer().dom.nextSibling);
        this.translateHeader(1000);
    },

    // We need to use the same events as the DataView so we are sure we run AFTER the list populates
    refresh: function() {
        this.callParent();
        this.doRefreshHeaders();
    },

    onStoreAdd: function() {
        this.callParent(arguments);
        this.doRefreshHeaders();
    },

    onStoreRemove: function() {
        this.callParent(arguments);
        this.doRefreshHeaders();
    },

    onStoreUpdate: function() {
        this.callParent(arguments);
        this.doRefreshHeaders();
    },

    onStoreClear: function() {
        this.callParent();
        if (this.header) {
            this.header.destroy();
        }
        this.doRefreshHeaders();
    },

    // @private
    getClosestGroups : function() {
        var groups = this.pinHeaderInfo.offsets,
            scrollable = this.getScrollable(),
            ln = groups.length,
            i = 0,
            pos, group, current, next;

        if (scrollable) {
            pos = scrollable.getScroller().position;
        }
        else {
            return {
                current: 0,
                next: 0
            };
        }

        for (; i < ln; i++) {
            group = groups[i];
            if (group.offset > pos.y) {
                next = group;
                break;
            }
            current = group;
        }

        return {
            current: current,
            next: next
        };
    },

    doRefreshHeaders: function() {
        if (!this.getGrouped() || !this.container) {
            return false;
        }

        var headerIndices = this.findGroupHeaderIndices(),
            ln = headerIndices.length,
            items = this.container.getViewItems(),
            headerInfo = this.pinHeaderInfo = {offsets: []},
            headerOffsets = headerInfo.offsets,
            scrollable = this.getScrollable(),
            scroller, scrollPosition, i, headerItem, header;

        if (ln) {
            for (i = 0; i < ln; i++) {
                headerItem = items[headerIndices[i]];
                if (headerItem) {
                    header = this.getItemHeader(headerItem);

                    headerOffsets.push({
                        header: header,
                        offset: headerItem.offsetTop
                    });
                }
            }

            headerInfo.closest = this.getClosestGroups();
            this.setActiveGroup(headerInfo.closest.current);
            if (header) {
                headerInfo.headerHeight = Ext.fly(header).getHeight();
            }

            // Ensure the pinned header is positioned correctly
            if (scrollable) {
                scroller = scrollable.getScroller();
                scrollPosition = scroller.position;
                this.onScroll(scroller, scrollPosition.x, scrollPosition.y);
            }
        }
    },

    getItemHeader: function(item) {
        return item.childNodes[0];
    },

    onScroll: function(scroller, x, y) {
        var me = this,
            headerInfo = me.pinHeaderInfo,
            closest = headerInfo.closest,
            activeGroup = me.activeGroup,
            headerHeight = headerInfo.headerHeight,
            next, current;

        if (!closest) {
            return;
        }

        next = closest.next;
        current = closest.current;

        if (!this.header || !this.header.renderElement.dom) {
            this.createHeader();
        }

        if (y <= 0) {
            if (activeGroup) {
                me.setActiveGroup(false);
                closest.next = current;
            }
            this.translateHeader(1000);
            return;
        }
        else if ((next && y > next.offset) || (current && y < current.offset)) {
            closest = headerInfo.closest = this.getClosestGroups();
            next = closest.next;
            current = closest.current;
            this.setActiveGroup(current);
        }

        if (next && y > 0 && next.offset - y <= headerHeight) {
            var headerOffset = headerHeight - (next.offset - y);
            this.translateHeader(headerOffset);
        }
        else {
            this.translateHeader(null);
        }
    },

    translateHeaderTransform: function(offset) {
        this.header.renderElement.dom.style.webkitTransform = (offset === null) ? null : 'translate3d(0px, -' + offset + 'px, 0px)';
    },

    translateHeaderCssPosition: function(offset) {
        this.header.renderElement.dom.style.top = (offset === null) ? null : '-' + Math.round(offset) + 'px';
    },

    /**
     * Set the current active group
     * @param {Object} group The group to set active
     * @private
     */
    setActiveGroup : function(group) {
        var me = this,
            header = me.header;
        if (header) {
            if (group) {
                if (!me.activeGroup || me.activeGroup.header != group.header) {
                    header.setHtml(group.header.innerHTML);
                    header.show();
                }
            } else if (header && header.dom) {
                header.hide();
            }
        }

        this.activeGroup = group;
    },

    onIndex: function(indexBar, index) {
        var me = this,
            key = index.toLowerCase(),
            store = me.getStore(),
            groups = store.getGroups(),
            ln = groups.length,
            scrollable = me.getScrollable(),
            scroller, group, i, closest, id, item;

        if (scrollable) {
            scroller = me.getScrollable().getScroller();
        }
        else {
            return;
        }

        for (i = 0; i < ln; i++) {
            group = groups[i];
            id = group.name.toLowerCase();
            if (id == key || id > key) {
                closest = group;
                break;
            }
            else {
                closest = group;
            }
        }

        if (scrollable && closest) {
            item = me.container.getViewItems()[store.indexOf(closest.children[0])];

            //stop the scroller from scrolling
            scroller.stopAnimation();

            //make sure the new offsetTop is not out of bounds for the scroller
            var containerSize = scroller.getContainerSize().y,
                size = scroller.getSize().y,
                maxOffset = size - containerSize,
                offset = (item.offsetTop > maxOffset) ? maxOffset : item.offsetTop;

            scroller.scrollTo(0, offset);
        }
    },

    applyOnItemDisclosure: function(config) {
        if (Ext.isFunction(config)) {
            return {
                scope: this,
                handler: config
            };
        }
        return config;
    },

    handleItemDisclosure: function(e) {
        var me = this,
            item = e.getTarget().parentNode,
            index = me.container.getViewItems().indexOf(item),
            record = me.getStore().getAt(index);

        me.fireAction('disclose', [me, record, item, index, e], 'doDisclose');
    },

    doDisclose: function(me, record, item, index, e) {
        var onItemDisclosure = me.getOnItemDisclosure();

        if (onItemDisclosure && onItemDisclosure.handler) {
            onItemDisclosure.handler.call(me, record, item, index);
        }
    },

    findGroupHeaderIndices: function() {
        if (!this.getGrouped()) {
            return [];
        }
        var me = this,
            store = me.getStore();
        if (!store) {
            return [];
        }

        var container = me.container,
            groups = store.getGroups(),
            groupLn = groups.length,
            items = container.getViewItems(),
            newHeaderItems = [],
            footerClsShortCache = container.footerClsShortCache,
            i, firstGroupedRecord, index, item, bottomItem;

        container.doRemoveHeaders();
        container.doRemoveFooterCls();

        if (items.length) {
            for (i = 0; i < groupLn; i++) {
                firstGroupedRecord = groups[i].children[0];
                index = store.indexOf(firstGroupedRecord);
                item = items[index];
                container.doAddHeader(item, store.getGroupString(firstGroupedRecord));
                // Skip footer before the first Header
                if (i) {
                    Ext.fly(item.previousSibling).addCls(footerClsShortCache);
                }
                newHeaderItems.push(index);
            }
            bottomItem = Math.max(items.length - 2, 0);
            Ext.fly(items[bottomItem]).addCls(footerClsShortCache);

        }

        return newHeaderItems;
    }
}, function() {
    //TODO This is hacky, find a better way @Jacky
    var prototype = this.prototype;

    prototype.cachedConfigList = prototype.cachedConfigList.slice();
    Ext.Array.remove(prototype.cachedConfigList, 'baseCls');
});
