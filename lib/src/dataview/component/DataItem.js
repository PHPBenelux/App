/**
 * A DataItem is a container for {@link Ext.dataview.DataView} with useComponents: true. It ties together
 * {@link Ext.data.Model records} to its contained Components via a {@link #dataMap dataMap} configuration.
 *
 * For example, lets say you have a `text configuration which, when applied, gets turned into an instance of an
 * Ext.Component. We want to update the {@link #html} of a sub-component when the 'text' field of the record gets
 * changed.
 *
 * As you can see below, it is simply a matter of setting the key of the object to be the getter of the config
 * (getText), and then give that property a value of an object, which then has 'setHtml' (the html setter) as the key,
 * and 'text' (the field name) as the value. You can continue this for a as many sub-components as you wish.
 *
 *        dataMap: {
 *           // When the record is updated, get the text configuration, and
 *           // call {@link #setHtml} with the 'text' field of the record.
 *           getText: {
 *              setHtml: 'text'
 *          },
 *
 *          // When the record is updated, get the userName configuration, and
 *          // call {@link #setHtml} with the 'from_user' field of the record.
 *          getUserName: {
 *              setHtml: 'from_user'
 *          },
 *
 *          // When the record is updated, get the avatar configuration, and
 *          // call `setSrc` with the 'profile_image_url' field of the record.
 *          getAvatar: {
 *              setSrc: 'profile_image_url'
 *          }
 *      },
 */
Ext.define('Ext.dataview.component.DataItem', {
    extend: 'Ext.Container',
    xtype : 'dataitem',

    config: {
        baseCls: Ext.baseCSSPrefix + 'data-item',

        defaultType: 'component',

        /**
         * @cfg {Ext.data.Model} record The model instance of this DataItem. It is controlled by the Component DataView
         * @accessor
         */
        record: null,

        /**
         * @cfg dataMap
         * The dataMap allows you to map {@link #record} fields to specific configurations in this component.
         *
         * For example, lets say you have a `text` configuration which, when applied, gets turned into an instance of an Ext.Component.
         * We want to update the {@link #html} of this component when the 'text' field of the record gets changed.
         * For example:
         *
         *      dataMap: {
         *          getText: {
         *              setHtml: 'text'
         *          }
         *      }
         *
         * In this example, it is simply a matter of setting the key of the object to be the getter of the config (getText), and then give that
         * property a value of an object, which then has 'setHtml' (the html setter) as the key, and 'text' (the field name) as the value.
         */
        dataMap: {},

        items: [{
            xtype: 'component'
        }]
    },

    /**
     * Updates this container's child items, passing through the dataMap.
     * @param newRecord
     * @private
     */
    updateRecord: function(newRecord) {
        var me = this,
            dataview = me.dataview,
            data = dataview.prepareData(newRecord.getData(true), dataview.getStore().indexOf(newRecord), newRecord),
            items = me.getItems(),
            item = items.first(),
            dataMap = me.getDataMap(),
            componentName, component, setterMap, setterName;

        if (!item) {
            return;
        }
        for (componentName in dataMap) {
            setterMap = dataMap[componentName];
            component = me[componentName]();
            if (component) {
                for (setterName in setterMap) {
                    if (component[setterName]) {
                        component[setterName](data[setterMap[setterName]]);
                    }
                }
            }
        }
        // Bypassing setter because sometimes we pass the same object (different properties)
        item.updateData(data);
    }
});
