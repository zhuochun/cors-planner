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
        // declare global
        if (!global.planner) {
            global.planner = {};
        }

        /* Defaults Values
        /* ======================================== */

        // assign CORS Planner Version number
        planner.version = "0.5.0";
        // CORS Planner for schools
        planner.school = store.get("app:school") || "sg.ntu";
        // default module lists
        planner.list = {
            modules  : "modules"
          , previews : "previews"
        };
        // week days
        planner.weekDays = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"]; 
        // enable or disable popover on slot
        planner.slotPopover = store.get("app:slotPopover") || true;
        // slot type, e.g. location, week, group
        planner.slotType = store.get("app:slotType") || "location";

        // planner set and get
        planner.get = function(key) { return this[key]; };
        planner.set = function(key, val) {
            if (reserved.indexOf(key) === -1) {
                this[key] = val;
                // save to localStorage
                store.set("app:" + key, val);
                // publish it
                $.publish("app:" + key, [val]);
            }
        };

    })();

});
