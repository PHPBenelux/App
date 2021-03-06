/**
 * A general sheet class. This renderable container provides base support for orientation-aware transitions for popup or
 * side-anchored sliding Panels. In most cases, you should use {@link Ext.ActionSheet}, {@link Ext.MessageBox}, {@link Ext.picker.Picker} or {@link Ext.picker.Date}.
 *
 * ## Example
 *
 *     @example preview
 *     var sheet = Ext.create('Ext.Sheet', {
 *         items: [
 *             {
 *                 docked: 'bottom',
 *                 xtype: 'button',
 *                 text: 'Click me'
 *             }
 *         ]
 *     });
 *     sheet.show();
 */
Ext.define('Ext.Sheet', {
    extend: 'Ext.Container',

    xtype: 'sheet',

    config: {
        // @inherited
        baseCls: Ext.baseCSSPrefix + 'sheet',

        /**
         * @inherit
         */
        hidden: true,

        /**
         * @inherit
         */
        modal: true,

        /**
         * @cfg {Boolean} centered
         * Whether or not this component is absolutely centered inside its container
         * @accessor
         * @evented
         */
        centered: true,

        /**
         * @cfg {Boolean} stretchX True to stretch this sheet horizontally.
         */
        stretchX: null,

        /**
         * @cfg {Boolean} stretchY True to stretch this sheet vertically.
         */
        stretchY: null

        //TODO Bring those configs back when animation is done
//        /**
//         * @cfg {String} enter
//         * The viewport side used as the enter point when shown (top, bottom, left, right)
//         * Applies to sliding animation effects only. Defaults to 'bottom'
//         */
//        enter: 'bottom',
//
//        /**
//         * @cfg {String} exit
//         * The viewport side used as the exit point when hidden (top, bottom, left, right)
//         * Applies to sliding animation effects only. Defaults to 'bottom'
//         */
//        exit: 'bottom',
//
//        /**
//         * @cfg {String/Object} enterAnimation
//         * the named Ext.anim effect or animation configuration object used for transitions
//         * when the component is shown. Defaults to 'slide'
//         */
//        enterAnimation: 'slide',
//
//        /**
//         * @cfg {String/Object} exitAnimation
//         * the named Ext.anim effect or animation configuration object used for transitions
//         * when the component is hidden. Defaults to 'slide'
//         */
//        exitAnimation: 'slide'
    },

    updateStretchX: function(newStretchX) {
        this.getLeft();
        this.getRight();

        if (newStretchX) {
            this.setLeft(0);
            this.setRight(0);
        }
    },

    updateStretchY: function(newStretchY) {
        this.getTop();
        this.getBottom();

        if (newStretchY) {
            this.setTop(0);
            this.setBottom(0);
        }
    }
});
