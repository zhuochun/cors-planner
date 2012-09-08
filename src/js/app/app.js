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

    // include global variable planner
    require("app/global");
    // include jQuery plugins
    require("jquery-ui");
    require("bootstrap");
    // include jQuery Pub/Sub plugin
    require("util/pubsub");
    // include jQuery dragDrop plugin
    require("helper/dragdrop");

    // include third party
    var store = require("util/store")
    // include controllers
    , modulesController = require("controller/modulesController")
    // include app view
    , appView = require("view/appView");

    // check the version between server and user, emits an message to all
    function _versionCheck() {
        // get user's version
        var _version = store.get("version");
        // set version again
        store.set("version", planner.version);
        // publish the app wide message related to user
        $.publish("app:user:" + ((!_version) ? "new" :
            (_version < planner.version) ? "updated" : "uptodate"));
    }

    // exports module
    exports.init = function(v) {
        // initial controller
        modulesController.init();
        // initial views
        appView.init();
        // other things
        _versionCheck();
    };

});
