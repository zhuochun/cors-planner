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

    var store = require("util/store")
      , reserved = ["key", "user", "status"];

    // expose a planner variable in global namespace
    // 
    // Taken from: (in case window is not the point to the global object)
    //   http://stackoverflow.com/questions/3277182/how-to-get-the-global-object-in-javascript
    (function _initGlobalPlanner() {
        var Fn = Function, global = (new Fn('return this'))();

        if (!global.planner) {
            global.planner = {};
        }

        // planner set and get
        planner.get = function(key) { return this[key]; };
        planner.set = function(key, value) {
            if (reserved.indexOf(key) === -1) {
                this[key] = value;
                $.publish("app:" + key, [value]);
            }
        };

        // assign CORS Planner Version number
        planner.version = "0.3.4";
        // assign CORS Data latest update time
        planner.dataUpdate = "Thu Dec 20 2012 19:44:16 GMT+0800 (Malay Peninsula Standard Time)";
        // default module lists
        planner.list = planner.list || {};
        planner.list.modules  = "modules";
        planner.list.previews = "previews";
        // week days
        planner.weekDays = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"]; 

    })();

});
