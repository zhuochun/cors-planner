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

    var $el = $("#timetable")
    , $grid = $("#table-grid"), $gridTr, $gridTd, $gridWidth
    , $slot = $("#table-slot")
    // local variables
    , weekDays = { "MONDAY" : 0, "TUESDAY" : 1, "WEDNESDAY" : 2, "THURSDAY" : 3, "FRIDAY": 4 }
    , types = { "lectures" : "(L)", "tutorials" : "(T)", "labs" : "(Lab)" };

    // initial timetable grids
    exports.init = function() {
        initTimetable();
    };

    // create droppable slots
    exports.createDroppableSlot = function(code, type, klass) {
        var key, info, top, left, width, $div; 
      //var $width = $tbody[0].offsetWidth;
        // cache $grid related DOM if not defined
        $gridTr = $gridTr || $grid.find("tbody tr");
        $gridTd = $gridTd || $gridTr.find("td");
        $gridWidth = $gridWidth || $gridTr[0].offsetWidth;
        // detach $slot to append slot
        $slot.detach();

        // allocate klass to $slot
        for (key in klass) {
            info = key.split("-"); // key is in format: "MONDAY-0900-1000"
            // set top, according to its weekDay
            top = $gridTr[weekDays[info[0]]].offsetTop + 2;
            // set left and width, according to start and end time
            left = $gridTd[getTimeIndex(info[1])].offsetLeft + 1;
            width = $gridTd[getTimeIndex(info[2])].offsetLeft - left;
            // convert left and width to percentage
            left = (left / $gridWidth) * 100 + "%";
            width = (width / $gridWidth) * 100 + "%";
            // create the div to hold this slot
            $div = $("<div>").addClass("bar temp-slot " + type)
                .text(code + " " + types[type])
                .css({"top" : top, "left" : left, "width" : width})
                .droppable(dropOpts);
            // append div to slot
            $div.appendTo($slot);
        }
        // put $slot back
        $slot.appendTo($el);
    };

    // TODO: refactoring
    var dropOpts = {
        activeClass: "bar-active"
        , hoverClass: "bar-hover"
        , drop: function(event, ui) {
            ui.draggable.removeClass("draggable");
           // window.setTimeout(function() {
           //     ui.draggable("destroy");
           // }, 1000);
            $(this).css("background-color", "grey").removeClass("temp-slot");
            //$(this).draggable({
            //    cursor: "move"
            //    , opacity: 0.6
            //    , revert: "invalid"
            //    //, start: dragEvent(module1)
            //    , stop: function() {
            //        $("#events").find(".temp-slot").remove();
            //    }
            //});
            $slot.find(".temp-slot").remove();
        }
    };

    function getTimeIndex(t) {
        t = parseInt(t, 10);
        return (Math.floor(t / 100) - 8) * 2 + 1 + (t % 100 ? 1 : 0) ;
    }

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
        j = 0;
        for (i in weekDays) {
            tbody[j] = "<tr><td class='weekday'>" + i + "</td>";

            for (k = startHour; k <= endHour; k++)
                tbody[j] += "<td></td><td></td>";

            tbody[j] += "</tr>";
            j++;
        }
        // push tbody to table
        table.push("<tbody>" + tbody.join(" ") + "</tbody");

        // append table to html
        $grid.html(table.join(""));
    }

});
