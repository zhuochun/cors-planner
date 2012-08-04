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
            this[key] = value;
            $.publish("planner:" + key, [value]);
        };

        // assign CORS Planner Version number
        planner.version = "0.0.6";
        // assign CORS Data latest update time
        planner.dataUpdate = "24 Jul 2012 11:29";
        // default timetable view
        planner.timetable = "horizontal";
        // default module lists
        planner.list = planner.list || {};
        planner.list.modules  = "modules";
        planner.list.previews = "previews";
    })();

});
