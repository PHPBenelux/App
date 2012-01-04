Ext.define('PhpBnl.model.Schedule', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'name',    type: 'string' },
        {name: 'time',    type: 'string' },
        {name: 'speaker', type: 'string' },
        {name: 'room', type: 'string' },
        {name: 'talkAbstract', type: 'string' },
        {name: 'speakerBio', type: 'string' },
        {name: 'speakerImage', type: 'string' }
    ],
    proxy: {
        type: 'ajax',
        url: 'data/schedule27.json',
        reader: {
            type: 'json',
            root: 'schedule'
        }
    }
});