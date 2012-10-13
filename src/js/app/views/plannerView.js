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
    var timetable = require("view/timetableView")
      , tableSlots = require("view/tableSlotsView")
      , $grid = $("#table-grid")
      , $slot = $("#table-slot")

    // initial timetable grids
    exports.init = function() {
        //planner.timetableType = "vertical";
        $grid.html(timetable.render(planner.timetableType));
        $slot.html(tableSlots.render(planner.timetableType));
    };

    // subscribe window resize
    $.subscribe("app:window:resize", function(e, height) {
        timetable.resize(height);
        tableSlots.resize(planner.timetableType);
    });

    // subscribe to start/end time change, re-render table
    $.subscribe("app:timetable:range", function(e, start, end) {
		timetableView.render(planner.timetableType, start, end);
    });

	// subscribe to timetable orientation change
	$.subscribe("app:timetable:type", function(e, type) {
		timetableView.render(type);
	});

});
