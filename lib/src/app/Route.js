/**
 * @author Ed Spencer
 * @ignore
 * @private
 * 
 * Represents a mapping between a url and a controller/action pair. May also contain additional params. This is a 
 * private internal class that should not need to be used by end-developer code. Its API and existence are subject to 
 * change so use at your own risk.
 * 
 * For information on how to use routes we suggest reading the following guides:
 * 
 * * <a href="#!/guide/apps_intro">Intro to Applications</a>
 * * <a href="#!/guide/controllers">Using Controllers</a>
 * 
 */
Ext.define('Ext.app.Route', {
    
    config: {
        conditions: {},
        
        /**
         * @cfg {String} url The url regex to match against. Required
         */
        url: null,
        
        /**
         * @cfg {String} controller The name of the Controller whose {@link #action} will be called if this route is
         * matched
         */
        controller: null,
        
        /**
         * @cfg {String} action The name of the action that will be called on the {@link #controller} if this route is
         * matched
         */
        action: null,
        
        /**
         * @private
         * @cfg {Boolean} initialized Indicates whether or not this Route has been initialized. We don't initialize 
         * straight away so as to save unnecessary processing.
         */
        initialized: false
    },
    
    constructor: function(config) {
        this.initConfig(config);
    },
    
    /**
     * Attempts to recognize a given url string and return controller/action pair for it
     * @param {String} url The url to recognize
     * @return {Object} The matched data, or false if no match
     */
    recognize: function(url) {
        if (!this.getInitialized()) {
            this.initialize();
        }
        
        if (this.recognizes(url)) {
            var matches = this.matchesFor(url),
                args    = url.match(this.matcherRegex);
            
            args.shift();
            
            return Ext.applyIf(matches, {
                controller: this.getController(),
                action    : this.getAction(),
                historyUrl: url,
                args      : args
            });
        }
    },
    
    /**
     * @private
     * Sets up the relevant regular expressions used to match against this route
     */
    initialize: function() {
        /*
         * The regular expression we use to match a segment of a route mapping
         * this will recognise segments starting with a colon,
         * e.g. on 'namespace/:controller/:action', :controller and :action will be recognised
         */
        this.paramMatchingRegex = new RegExp(/:([0-9A-Za-z\_]*)/g);
        
        /*
         * Converts a route string into an array of symbols starting with a colon. e.g.
         * ":controller/:action/:id" => [':controller', ':action', ':id']
         */
        this.paramsInMatchString = this.getUrl().match(this.paramMatchingRegex) || [];
        
        this.matcherRegex = this.createMatcherRegex(this.getUrl());
        
        this.setInitialized(true);
    },
    
    /**
     * @private
     * Returns true if this Route matches the given url string
     * @param {String} url The url to test
     * @return {Boolean} True if this Route recognizes the url
     */
    recognizes: function(url) {
        return this.matcherRegex.test(url);
    },
    
    /**
     * @private
     * Returns a hash of matching url segments for the given url.
     * @param {String} url The url to extract matches for
     * @return {Object} matching url segments
     */
    matchesFor: function(url) {
        var params = {},
            keys   = this.paramsInMatchString,
            values = url.match(this.matcherRegex),
            length = keys.length,
            i;
        
        //first value is the entire match so reject
        values.shift();

        for (i = 0; i < length; i++) {
            params[keys[i].replace(":", "")] = values[i];
        }

        return params;
    },
    
    /**
     * @private
     * Returns an array of matching url segments for the given url.
     * @param {String} url The url to extract matches for
     * @return {Array} matching url segments
     */
    argsFor: function(url) {
        var args   = [],
            keys   = this.paramsInMatchString,
            values = url.match(this.matcherRegex),
            length = keys.length,
            i;
        
        //first value is the entire match so reject
        values.shift();

        for (i = 0; i < length; i++) {
            args.push(keys[i].replace(':', ""));
            params[keys[i].replace(":", "")] = values[i];
        }

        return params;
    },
    
    /**
     * @private
     * Constructs a url for the given config object by replacing wildcard placeholders in the Route's url
     * @param {Object} config The config object
     * @return {String} The constructed url
     */
    urlFor: function(config) {
        var url = this.getUrl();
        
        for (var key in config) {
            url = url.replace(":" + key, config[key]);
        }
        
        return url;
    },
    
    /**
     * @private
     * Takes the configured url string including wildcards and returns a regex that can be used to match
     * against a url
     * @param {String} url The url string
     * @return {RegExp} The matcher regex
     */
    createMatcherRegex: function(url) {
        /**
         * Converts a route string into an array of symbols starting with a colon. e.g.
         * ":controller/:action/:id" => [':controller', ':action', ':id']
         */
        var paramsInMatchString = this.paramsInMatchString,
            length = paramsInMatchString.length,
            i, cond, matcher;
        
        for (i = 0; i < length; i++) {
            cond    = this.getConditions()[paramsInMatchString[i]];
            matcher = Ext.util.Format.format("({0})", cond || "[%a-zA-Z0-9\-\\_\\s,]+");

            url = url.replace(new RegExp(paramsInMatchString[i]), matcher);
        }

        //we want to match the whole string, so include the anchors
        return new RegExp("^" + url + "$");
    }
});