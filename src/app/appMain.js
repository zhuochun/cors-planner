/* ========================================
 * CORS Planner - App Main
 *
 * Load all app components required
 *
 * Author: Wang Zhuochun
 * Last Edit: 05/Aug/2012 03:40 AM
 * ========================================
 * <License>
 * ======================================== */

define(function(require, exports) {

    "use strict";
    /*jshint jquery:true, laxcomma:true, maxerr:50*/
    /*globals planner*/

    // include jQuery plugins
    require("plugin/bootstrap");
    require("plugin/jquery.metro");
    require("util/pubsub");
    // include third party
    var store = require("util/store")
    // include controllers
      , controller = require("controller/modulesController")
    // include app view
      , views = require("view/appView");

    // check the version between server and user, emits an message to all
    function _versionCheck() {
        // get user's version
        var _version = store.get("version");
        // set version again
        store.set("version", planner.version);
        // publish the app wide message related to user
        $.publish("app:status:" + ((!_version) ? "new" :
            (_version < planner.version) ? "updated" : "uptodate"));
    }

    // track outbound link click
    function _trackOutbound() {
        $(document).on("click", "a", function(e) {
            e.currentTarget.hostname === "cors.bicrement.com" ||
                planner.trackPageView(e.currentTarget.href, "outbound");
        });
    }

    function _addThisEvent() {
        addthisevent.settings({
            mouse     : false,
            css       : false,
            dropdown  : false,
            outlook   : {show:false, text:"Outlook Calendar"},
            google    : {show:false, text:"Google Calendar"},
            yahoo     : {show:false, text:"Yahoo Calendar"},
            hotmail   : {show:false, text:"Hotmail Calendar"},
            ical      : {show:false, text:"iCal Calendar"},
            facebook  : {show:false, text:"Facebook Event"},
            callback  : ""
        });
    }

    // exports module
    exports.init = function(v) {
        // init components
        controller.init();
        views.init();
        // check app version
        _versionCheck();
        // outbound link click
        _trackOutbound();
        // init add this event
        _addThisEvent();
    };

});
