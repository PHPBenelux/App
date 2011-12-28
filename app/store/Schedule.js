Ext.define('PhpBnl.store.Schedule', {
    extend: 'Ext.data.Store',
    model: 'PhpBnl.model.Schedule',
    requires: ['PhpBnl.model.Schedule'],
    autoLoad: true,
    sorters: 'time',
    getGroupString: function(record) {
        var splitted = record.get('time');
        return splitted;
    }
});