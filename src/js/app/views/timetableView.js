/* ========================================
 * CORS Planner - timetableView
 *
 * It is a view simply make a timetable
 *
 * Author: Wang Zhuochun
 * Last Edit: 28/Jul/2012 02:07 PM
 * ========================================
 * <License>
 * ======================================== */

define(function(require, exports) {

    "use strict";
    /*jshint browser:true, jquery:true, laxcomma:true, maxerr:50*/

    // private variables
    var _type = "horizontal"
    , _tableRender = _renderHorizontal
    , _startHour = 8 // default: 8AM
    , _endHour = 21 // default: 9PM
    // grid
    , $grid = $("#table-grid")
    , weekDays = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];

    // render
    function _render(type, start, end) {
        // write type
        _type = type || _type;
        // do render
        if (_type === "vertical")
            _renderVertical(start, end);
        else
            _renderHorizontal(start, end);
    }

    // initial timetable grids
    exports.init = _render;
    // exports render
    exports.render = _render;
    // subscribe window resize
    $.subscribe("app:window:resize", function(e, height) {
        if (_type === "horizontal")
            $grid.find("table").css({"height" : height - 360});
    });

    function _tableHead() {
        return "<table class='" + _type + " table table-striped table-bordered' " +
            "data-type='" + _type + "' data-starthour='" + _startHour + "' data-endhour='" + _endHour + "'>";
    }

    // generate a timetable
    function _renderHorizontal(start, end) {
        // update table hour range
        _startHour = start || _startHour;
        _endHour   = end || _endHour;

        // set table variables
        var i, j, k, len, thead = [], tbody = [], table = [_tableHead()];

        // generate thead
        for (i = _startHour, j = 0; i <= _endHour; i++, j++) {
            thead[j] = "<th colspan='2'>" + (i < 10 ? "0" + i : i) + "</th>";
        }
        // push thead to table
        table.push("<thead><tr><th></th>" + thead.join("") + "</tr></thead>");

        // generate tbody
        for (i = 0, j = 0, len = weekDays.length; i < len; i++, j++) {
            tbody[j] = "<tr><td class='weekday'>" + weekDays[i] + "</td>";

            for (k = _startHour; k <= _endHour; k++) {
                tbody[j] += "<td></td><td></td>";
            }

            tbody[j] += "</tr>";
        }
        // push tbody to table
        table.push("<tbody>" + tbody.join(" ") + "</tbody");

        // append table to html
        $grid.html(table.join(""));
    }

    function _renderVertical(start, end) {
        // update table hour range
        _startHour = start || _startHour;
        _endHour   = end || _endHour;

        // set table variables
        var i, j, k, len, thead = [], tbody = [], table = [_tableHead()];

        // generate thead
        for (i = 0, len = weekDays.length; i < len; i++) {
            thead[i] = "<th>" + weekDays[i] + "</th>";
        }
        // push thead to table
        table.push("<thead><tr><th></th>" + thead.join("") + "</tr></thead>");

        // generate table body
        for (i = _startHour, j = 0; i <= _endHour; i++, j++) {
            // rowspan 2 weekday head
            tbody[j] = "<tr><td class='weekday' rowspan='2'>" + (i < 10 ? "0" + i : i) + ":00 - " +
                (i+1 < 10 ? "0" + (i+1) : (i+1)) +  ":00</td>";

            // upper half hour row
            for (k = 0; k < len; k++) {
                tbody[j] += "<td></td>";
            }
            tbody[j] += "</tr><tr>";

            // lower half hour row
            for (k = 0; k < len; k++) {
                tbody[j] += "<td></td>";
            }
            tbody[j] += "</tr>";
        }
        // push tbody to table
        table.push("<tbody>" + tbody.join(" ") + "</tbody>");

        // append table to html
        $grid.html(table.join(""));
    }

});
