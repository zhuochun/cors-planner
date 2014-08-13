/* ========================================
 * CORS Planner - App Main
 *
 * Load all app components required
 *
 * Author: Wang Zhuochun
 * Last Edit: 16/Jul/2013 12:25 AM
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

        // assign CORS Planner Version number
        planner.version = "0.7.9";
        // CORS Planner for schools
        planner.school = store.get("app:school") || null;
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
            if ($.inArray(key, reserved) === -1) {
                this[key] = val;
                // save to localStorage
                store.set("app:" + key, val);
                // publish it
                $.publish("app:" + key, [val]);
            }
        };
        // load css
        planner.loadCss = function(href) {
            var link = document.createElement("link");
            link.type = "text/css";
            link.rel = "stylesheet";
            link.href = href;
            document.getElementsByTagName("head")[0].appendChild(link);
        };
        // track usages and events using google analytics
        // https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide
        planner.analytics = function() {
            if (global._gaq) {
                global._gaq.push($.makeArray(arguments));
            }
        };
        // some help functions
        planner.trackEvent = function(category, action) {
            planner.analytics("_trackEvent", category, action);
        };
        planner.trackPageView = function(url, prefix) {
            planner.analytics("_trackPageview", prefix ? prefix + "=" + url : url);
        };

    })();

});
