/**
 * @author Ed Spencer
 *
 * Represents a single read or write operation performed by a {@link Ext.data.proxy.Proxy Proxy}. Operation objects are
 * used to enable communication between Stores and Proxies. Application developers should rarely need to interact with
 * Operation objects directly.
 *
 * Several Operations can be batched together in a {@link Ext.data.Batch batch}.
 */
Ext.define('Ext.data.Operation', {
    config: {
        /**
         * @cfg {Boolean} synchronous
         * True if this Operation is to be executed synchronously. This property is inspected by a
         * {@link Ext.data.Batch Batch} to see if a series of Operations can be executed in parallel or not.
         */
        synchronous: true,

        /**
         * @cfg {String} action
         * The action being performed by this Operation. Should be one of 'create', 'read', 'update' or 'destroy'.
         */
        action: null,

        /**
         * @cfg {Ext.util.Filter[]} filters
         * Optional array of filter objects. Only applies to 'read' actions.
         */
        filters: null,

        /**
         * @cfg {Ext.util.Sorter[]} sorters
         * Optional array of sorter objects. Only applies to 'read' actions.
         */
        sorters: null,

        /**
         * @cfg {Ext.util.Grouper[]} groupers
         * Optional grouping configuration. Only applies to 'read' actions where grouping is desired.
         */
        groupers: null,

        /**
         * @cfg {Number} start
         * The start index (offset), used in paging when running a 'read' action.
         */
        start: null,

        /**
         * @cfg {Number} limit
         * The number of records to load. Used on 'read' actions when paging is being used.
         */
        limit: null,

        /**
         * @cfg {Ext.data.Batch} batch
         * The batch that this Operation is a part of.
         */
        batch: null,

        /**
         * @cfg {Function} callback
         * Function to execute when operation completed.
         * @cfg {Ext.data.Model[]} callback.records Array of records.
         * @cfg {Ext.data.Operation} callback.operation The Operation itself.
         * @cfg {Boolean} callback.success True when operation completed successfully.
         */
        callback: null,

        /**
         * @cfg {Object} scope
         * Scope for the {@link #callback} function.
         */
        scope: null,

        /**
         * @cfg {Ext.data.ResultSet} resultSet
         * The ResultSet for this operation.
         */
        resultSet: null,

        records: null,

        /**
         * @cfg {Ext.data.Request} request
         * The request used for this Operation. Operations don't usually care about Request and Response data, but in the
         * ServerProxy and any of its subclasses they may be useful for further processing.
         */
        request: null,

        /**
         * @cfg {Object} response
         * The response that was gotten from the server if there was one.
         */
        response: null,

        params: null,
        url: null,
        page: null,

        model: undefined,

        node: null,

        addRecords: false
    },

    /**
     * @property {Boolean} started
     * Read-only property tracking the start status of this Operation. Use {@link #isStarted}.
     * @private
     */
    started: false,

    /**
     * @property {Boolean} running
     * Read-only property tracking the run status of this Operation. Use {@link #isRunning}.
     * @private
     */
    running: false,

    /**
     * @property {Boolean} complete
     * Read-only property tracking the completion status of this Operation. Use {@link #isComplete}.
     * @private
     */
    complete: false,

    /**
     * @property {Boolean} success
     * Read-only property tracking whether the Operation was successful or not. This starts as undefined and is set to true
     * or false by the Proxy that is executing the Operation. It is also set to false by {@link #setException}. Use
     * {@link #wasSuccessful} to query success status.
     * @private
     */
    success: undefined,

    /**
     * @property {Boolean} exception
     * Read-only property tracking the exception status of this Operation. Use {@link #hasException} and see {@link #getError}.
     * @private
     */
    exception: false,

    /**
     * @property {String/Object} error
     * The error object passed when {@link #setException} was called. This could be any object or primitive.
     * @private
     */
    error: undefined,

    /**
     * Creates new Operation object.
     * @param {Object} config (optional) Config object.
     */
    constructor: function(config) {
        this.initConfig(config);
    },

    applyModel: function(model) {
        if (typeof model == 'string') {
            model = Ext.data.ModelManager.getModel(model);

            if (!model) {
                Ext.Logger.error('Model with name ' + arguments[0] + ' doesnt exist.');
            }
        }

        if (model && !model.prototype.isModel && Ext.isObject(model)) {
            model = Ext.data.ModelManager.registerType(model.storeId || model.id || Ext.id(), model);
        }

        // <debug>
        if (!model) {
            Ext.Logger.error('An Operation needs to have a model defined.');
        }
        // </debug>

        return model;
    },

    /**
     * Marks the Operation as started.
     */
    setStarted: function() {
        this.started = true;
        this.running = true;
    },

    /**
     * Marks the Operation as completed.
     */
    setCompleted: function() {
        this.complete = true;
        this.running  = false;
    },

    /**
     * Marks the Operation as successful.
     */
    setSuccessful: function() {
        this.success = true;
    },

    /**
     * Marks the Operation as having experienced an exception. Can be supplied with an option error message/object.
     * @param {String/Object} error (optional) error string/object
     */
    setException: function(error) {
        this.exception = true;
        this.success = false;
        this.running = false;
        this.error = error;
    },

    /**
     * Returns true if this Operation encountered an exception (see also {@link #getError})
     * @return {Boolean} True if there was an exception
     */
    hasException: function() {
        return this.exception === true;
    },

    /**
     * Returns the error string or object that was set using {@link #setException}
     * @return {String/Object} The error object
     */
    getError: function() {
        return this.error;
    },
    
    /**
     * Returns true if the Operation has been started. Note that the Operation may have started AND completed, see
     * {@link #isRunning} to test if the Operation is currently running.
     * @return {Boolean} True if the Operation has started
     */
    isStarted: function() {
        return this.started === true;
    },

    /**
     * Returns true if the Operation has been started but has not yet completed.
     * @return {Boolean} True if the Operation is currently running
     */
    isRunning: function() {
        return this.running === true;
    },

    /**
     * Returns true if the Operation has been completed
     * @return {Boolean} True if the Operation is complete
     */
    isComplete: function() {
        return this.complete === true;
    },

    /**
     * Returns true if the Operation has completed and was successful
     * @return {Boolean} True if successful
     */
    wasSuccessful: function() {
        return this.isComplete() && this.success === true;
    },

    /**
     * Checks whether this operation should cause writing to occur.
     * @return {Boolean} Whether the operation should cause a write to occur.
     */
    allowWrite: function() {
        return this.getAction() != 'read';
    },

    process: function(action, resultSet, request, response) {
        if (resultSet.getSuccess() !== false) {
            this.setResponse(response);
            this.setResultSet(resultSet);
            this.setCompleted();
            this.setSuccessful();
        } else {
            return false;
        }

        return this['process' + Ext.String.capitalize(action)].call(this, resultSet, request, response);
    },

    processRead: function(resultSet) {
        var records = resultSet.getRecords(),
            processedRecords = [],
            Model = this.getModel(),
            ln = records.length,
            i, record;

        for (i = 0; i < ln; i++) {
            record = records[i];
            processedRecords.push(new Model(record.data, record.id, record.node));
        }

        this.setRecords(processedRecords);
        return true;
    },

    processCreate: function(resultSet) {
        var updatedRecords = resultSet.getRecords(),
            ln = updatedRecords.length,
            i, currentRecord, updatedRecord;

        for (i = 0; i < ln; i++) {
            updatedRecord = updatedRecords[i];
            currentRecord = this.findCurrentRecord(updatedRecord);

            if (currentRecord) {
                this.updateRecord(currentRecord, updatedRecord);
            }
            // <debug>
            else {
                Ext.Logger.warn('Unable to match the record that came back from the server.');
            }
            // </debug>
        }

        return true;
    },

    processUpdate: function(resultSet) {
        var updatedRecords = resultSet.getRecords(),
            currentRecords = this.getRecords(),
            ln = updatedRecords.length,
            i, currentRecord, updatedRecord;

        for (i = 0; i < ln; i++) {
            updatedRecord = updatedRecords[i];
            currentRecord = currentRecords[i];

            if (currentRecord) {
                this.updateRecord(currentRecord, updatedRecord);
            }
            // <debug>
            else {
                Ext.Logger.warn('Unable to match the updated record that came back from the server.');
            }
            // </debug>
        }

        return true;
    },

    processDestroy: function() {

    },

    findCurrentRecord: function(updatedRecord) {
        var currentRecords = this.getRecords(),
            ln = currentRecords.length,
            i, currentRecord;

        for (i = 0; i < ln; i++) {
            currentRecord = currentRecords[i];
            if (currentRecord.getId() === updatedRecord.clientId) {
                return currentRecord;
            }
        }
    },

    updateRecord: function(currentRecord, updatedRecord) {
        var recordData = updatedRecord.data,
            recordId = updatedRecord.id;

        currentRecord.beginEdit();

        currentRecord.set(recordData);
        if (recordId !== null) {
            currentRecord.setId(recordId);
        }

        // We call endEdit with silent: true because the commit below already makes
        // sure any store is notified of the record being updated.
        currentRecord.endEdit(true);
        
        currentRecord.commit();
    }
});
