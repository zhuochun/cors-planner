/* ========================================
 * CORS Planner - App Main
 *
 * Author: Wang Zhuochun
 * Last Edit: 23/Jul/2012 09:33 PM
 * ========================================
 * <License>
 * ======================================== */

define(function(require, exports) {

    "use strict";
    /*jshint jquery:true, laxcomma:true, maxerr:50*/

    // include jQuery plugins
    require("jquery-ui");
    require("bootstrap");
    // include the jQuery Pub/Sub plugin
    require("util/pubsub");

    // include app view
    var version = "0.0.5"
    // include components
      , store = require("util/store")
      , appView = require("view/appView");

    // exports module
    exports.init = function(v) {
        // send greeting messages
        greetUser();
        // initial app views
        appView.render();
    };

    // greeting user according to version
    function greetUser(_version) {
        _version = store.get("version");

        if (!_version) { // new user
            $.publish("app:newUser", [version]);
        } else if (_version < version) { // on older version
            $.publish("app:update", [version]);
        } else { // existing user
            $.publish("app:intro", [version]);
        }

        store.set("version", version); // set version
    }

});
