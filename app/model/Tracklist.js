Ext.define('PhpBnl.model.Tracklist', {
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
    idProperty: 'time',
    proxy: {
        type: 'localstorage',
        id: 'mytracklist'
    }
});