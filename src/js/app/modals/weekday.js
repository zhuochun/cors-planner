/* ========================================
 * CORS Planner - weekday
 *
 * a weekday grids
 *
 * Author: Wang Zhuochun
 * Last Edit:
 * ========================================
 * <License>
 * ======================================== */

define(function(require, exports) {

    "use strict";
    /*jshint jquery:true, laxcomma:true, maxerr:50*/

    var TYPES = { "lectures" : "(L)", "tutorials" : "(T)", "labs" : "(Lab)" };

    /* WEEKDAY CLASS DEFINITION
     * ======================================== */

    // Weekday Class
    function Weekday(name) {
        this.$elem = $("#" + name.toLowerCase());
        // init rows
        this.$rows = [];
        var i, len, rows = this.$elem.find(".row-fluid");
        // jquery the rows
        for (i = 0, len = rows.length; i < len; i++) {
            this.$rows.push($(rows[i]));
        }
    }

    /* WEEKDAY CLASS METHODS
     * ======================================== */

    // Weekday Prototypes alias
    Weekday.fn = Weekday.prototype;

    /*
        slot = {
            "classNo": "A3",
            "type": "SECTIONAL TEACHING",
            "weekType": "EVERY WEEK",
            "weekDay": "THURSDAY",
            "startTime": "1400",
            "endTime": "1600",
            "room": "BIZ2-0303"
        };
        type = lecture/tutorial/lab;
        mod  = module
    */
    Weekday.fn.add = function(slot, type, mod) {
        var offset = getTimeIndex(slot.startTime)
          , span = getTimeIndex(slot.endTime) - offset;

        var $div = $("<div>").addClass("grid slot " + type + " offset" + offset + " span" + span)
                //.data("slot", data)
                .text(mod.get("code") + " " + TYPES[type]);

        this.$rows[0].append($div);
    };

    /* HELPERS
     * ======================================== */

    function getTimeIndex(t) {
        t = parseInt(t, 10);
        return 2 + (Math.floor(t / 100) - 8) * 2 + (t % 100 ? 1 : 0) ;
    }

    // exports the constructor
    return Weekday;

});
