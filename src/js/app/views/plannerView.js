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
    /*jshint jquery:true, laxcomma:true, maxerr:50*/

    var $el = $("#timetable")
    , $grid = $("#table-grid")
    , $slot = $("#table-slot")
    // local variables
    , weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

    // initial timetable grids
    exports.init = function() {
        initTimetable();
    };

    // generate a timetable
    function initTimetable(startHour, endHour) {
        // set default variables
        startHour = startHour || 8; // startHour default = 8AM
        endHour = endHour || 21; // endHour default = 21PM

        // set table variables
        var i, j, k, thead = [], tbody = []
        , table = ["<table class='table table-striped table-bordered'>"];

        // generate thead
        for (i = startHour, j = 0; i <= endHour; i++, j++) {
            thead[j] = "<th colspan='2'>" + (i < 10 ? "0" + i : i) + "</th>";
        }
        // push thead to table
        table.push("<thead><tr><th></th>" + thead.join("") + "</tr></thead>");

        // generate tbody
        for (i = 0, j = 0; i < 5; i++, j++) { // 5 = No. of Weekdays
            tbody[j] = "<tr><td class='weekday'>" + weekdays[i] + "</td>";

            for (k = startHour; k <= endHour; k++)
                tbody[j] += "<td></td><td></td>";

            tbody[j] += "</tr>";
        }
        // push tbody to table
        table.push("<tbody>" + tbody.join(" ") + "</tbody");

        // append table to html
        $grid.html(table.join(""));
    }

});
