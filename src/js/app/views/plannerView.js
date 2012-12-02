/* ========================================
 * CORS Planner - Planner View
 *
 * Author: Wang Zhuochun
 * Last Edit: 22/Jul/2012 12:28 AM
 * ========================================
 * <License>
 * ======================================== */

define(function(require, exports) {

    "use strict";
    /*jshint browser:true, jquery:true, laxcomma:true, maxerr:50*/
    /*global planner*/

	// get components
    var Weekday = require("view/weekdayView")
      , weekdays = {};

    // initial timetable grids
    exports.init = function() {
        var i, len = planner.weekDays.length;

        for (i = 0; i < len; i++) {
            weekdays[planner.weekDays[i]] = new Weekday(planner.weekDays[i]);
        }
    };

    // subscribe to module add event
    $.subscribe(planner.list.modules + ":addOne", function(e, mod) {
        var lectures = mod.get("_lectures");

        for (var key in lectures) {
            if (lectures.hasOwnProperty(key)) {
                var lects = lectures[key];

                for (var i = 0, len = lects.length; i < len; i++) {
                    weekdays[lects[i].weekDay].add(lects[i], "lectures", mod);
                }

                break;
            }
        }
    });

    // subscribe modules remove event
    $.subscribe(planner.list.modules + ":removeOne", function(e, mod) {

    });

});
