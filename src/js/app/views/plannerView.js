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
    var timetableView = require("view/timetableView");

    // initial timetable grids
    exports.init = function() {
        timetableView.init(planner.timetable);
    };

    // subscribe to start/end time change, re-render table
    $.subscribe("app:timetable:range", function(e, start, end) {
		timetableView.render(planner.timetable, start, end);
    });

	// subscribe to timetable orientation change
	$.subscribe("app:timetable:type", function(e, type) {
		timetableView.render(type);
	});

});
