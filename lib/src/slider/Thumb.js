/**
 * @ignore
 * Utility class used by Ext.slider.Slider - should never need to be used directly.
 */
Ext.define('Ext.slider.Thumb', {
    extend: 'Ext.Component',
    xtype : 'thumb',

    config: {
        // @inherit
        baseCls: Ext.baseCSSPrefix + 'thumb',

        // @inherit
        draggable: {
            direction: 'horizontal'
        }
    },

    elementWidth: 0,

    initialize: function() {
        this.callParent();

        this.getDraggable().onBefore({
            dragstart: 'onDragStart',
            drag: 'onDrag',
            dragend: 'onDragEnd',
            scope: this
        });

        this.on('painted', 'onPainted');
    },

    onDragStart: function() {
        this.relayEvent(arguments);
    },

    onDrag: function() {
        this.relayEvent(arguments);
    },

    onDragEnd: function() {
        this.relayEvent(arguments);
    },

    onPainted: function() {
        this.elementWidth = this.element.dom.offsetWidth;
    },

    getElementWidth: function() {
        return this.elementWidth;
    }
});
