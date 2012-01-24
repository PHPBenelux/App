Ext.define('PhpBnl.controller.Home', {
    extend: 'Ext.app.Controller',

    config: {
        profile: Ext.os.deviceType.toLowerCase()
    },
    
    views: [
        'Main',
        'Home',
        'About',
        'MyTracklist',
        'Schedule',
        'Session',
        'Travel'
    ],

    stores: [
        'Schedule',
        'Tracklist'
    ],

    refs: [
        {
            ref: 'main',
            selector  : 'mainview',
            autoCreate: true,
            xtype     : 'mainview'
        }
    ],
    
    init: function() {
        if (!this.mainView) {
            this.mainView = this.getMainView().create();
        }

        this.control({
            'mainview > travel': {
                show: this.createMap
            },
            'mainview list' : {
                itemtap: this.onSessionTap
            },
            '#backbutton' : {
                tap: this.onBackTap,
                scope: this
            },
            '#addbutton' : {
                tap: this.onAddTap,
                scope: this
            },
            '#scheduleTabs list' : {
                show: this.onScheduleTabChange,
                scope: this
            }
        });
    },

    onScheduleTabChange: function(component, options) {
        var itemId = component.getItemId();
        var proxyUrl = 'data/schedule' + itemId.toString() + '.json';
        var scheduleProxy = this.getScheduleStore().getProxy();
        scheduleProxy.url = proxyUrl;
        this.getScheduleStore().load();
    },

    onAddTap: function() {
        var record = Ext.ComponentQuery.query('#sessionDetail')[0].getData();
        var tracklistStore = this.getTracklistStore();
        console.log(tracklistStore);
        tracklistStore.add(record);
        tracklistStore.sync();
        Ext.Msg.alert('Added the session to your tracklist');
    },

    onBackTap: function(item) {
        Ext.Viewport.setActiveItem(this.mainView);
    },

    onSessionTap: function(item, index) {
        var store = this.getScheduleStore();
        var record = store.getAt(index);
        if (!this.sessionView) {
            this.sessionView = this.getSessionView().create();
        }
        Ext.Viewport.getLayout().setAnimation({
            type: 'slide'
        });
        var title = Ext.util.Format.ellipsis(record.data.name,15,false);
        Ext.ComponentQuery.query('#sessionToolbar')[0].setTitle(title);
        Ext.ComponentQuery.query('#sessionDetail')[0].setData(record.data);
        Ext.Viewport.setActiveItem(this.sessionView, {type: 'slide', direction: 'right'});
    },

    startPos: (new google.maps.LatLng(52.22, 4.53)),
    map: null,
    directionsDisplay: null,
    /**
     * Create the map and call the directions service
     */
    createMap : function () {
        var myOptions = {
            center: this.startPos,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            zoom: 7
        };
        this.map = new google.maps.Map(document.getElementById("mapPanel"), myOptions);
        this.directionsDisplay = new google.maps.DirectionsRenderer();
        var me = this;
        var watchId = navigator.geolocation.getCurrentPosition(function(pos) {
            if (pos) {
                me.startPos = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
                me.directionsDisplay.setMap(null);
                me.scrollMap();
            }
        }, null, {timeOut: 3000});
        this.scrollMap();
    },
    /**
     * Create the directions to the venus
     * @param {Object} pos Geolocation position object
     */
    scrollMap: function(pos) {
        var start = this.startPos,
            end = 'kattenbroek 1 edegem';
        this.directionsDisplay.setMap(this.map);
        this.directionsDisplay.setPanel(document.getElementById('directionsPanel'));

        var directionService = new google.maps.DirectionsService();
        var request = {
            origin: start,
            destination: end,
            travelMode: google.maps.DirectionsTravelMode.DRIVING
        };
        var me = this;
        directionService.route(request, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                me.directionsDisplay.setDirections(response);
            }
        });
    }
});