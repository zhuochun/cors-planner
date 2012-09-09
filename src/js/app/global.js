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
        planner.version = "0.0.6";
        // assign CORS Data latest update time
        planner.dataUpdate = "27 Aug 2012 17:57";
        // default timetable view
        planner.timetableType = "horizontal";
        planner.timetableRange = { start : 8, end : 22 };
        // default module lists
        planner.list = planner.list || {};
        planner.list.modules  = "modules";
        planner.list.previews = "previews";
        // week days
        planner.weekDays = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"]; 

        // default user info
        planner.user = {};
        // planner user
        planner.user = (function() {
            var user = {};

            user.data = store.get("user") || {};

            user.get = function(key) { return user.data[key]; };
            user.set = function(key, value) {
                if (typeof key === "object") {
                    for (var i in key) {
                        if (key.hasOwnProperty(i)) {
                            user.set(i, key[i]);
                        }
                    }
                } else {
                    user.data[key] = value;

                    store.set("user", user.data);

                    $.publish("app:user:" + key, [value]);
                }
            };

            return {
                get : user.get
              , set : user.set
            };
        })();

    })();

});
