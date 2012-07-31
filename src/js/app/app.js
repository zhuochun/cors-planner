/* ========================================
 * CORS Planner - App Main
 * 
 * Load all app components required
 *
 * Author: Wang Zhuochun
 * Last Edit: 28/Jul/2012 10:41 PM
 * ========================================
 * <License>
 * ======================================== */

define(function(require, exports) {

    "use strict";
    /*jshint jquery:true, laxcomma:true, maxerr:50*/
    /*globals planner*/

    // include jQuery plugins
    require("jquery-ui");
    require("bootstrap");
    // include jQuery Pub/Sub plugin
    require("util/pubsub");
    // include jQuery dragDrop plugin
    require("api/jquery-dragdrop");

    // include third party
    var store = require("util/store")
    // include controllers
    , modulesController = require("controller/modulesController")
    , plannerController = require("controller/plannerController")
    // include app view
    , appView = require("view/appView");


    // expose a planner variable in global namespace
    // 
    // Taken from: (in case window is not the point to the global object)
    //   http://stackoverflow.com/questions/3277182/how-to-get-the-global-object-in-javascript
    function _initGlobalPlanner() {
        var Fn = Function, global = (new Fn('return this'))();

        if (!global.planner) {
            global.planner = {};
        }

        // planner set and get
        planner.get = function(key) { return this[key]; };
        planner.set = function(key, value) {
            this[key] = value;
            $.publish("planner:" + key, [value]);
        };

        // assign CORS Planner Version number
        planner.version = "0.0.6";
        // assign CORS Data latest update time
        planner.dataUpdate = "24 Jul 2012 11:29";
        // default timetable view
        planner.timetable = "horizontal";
    }

    // check the version between server and user, emits an message to all
    function _versionCheck(_version) {
        // get user's version
        _version = store.get("version");
        // set version again
        store.set("version", planner.version);
        // publish the app wide message related to user
        $.publish("app:user:" + ((!_version) ? "new" :
            (_version < planner.version) ? "updated" : "uptodate"));
    }

    // exports module
    exports.init = function(v) {
        // init app itself
        _initGlobalPlanner();
        // render all the app views
        appView.render();
        // version check
        _versionCheck();
    };

});
