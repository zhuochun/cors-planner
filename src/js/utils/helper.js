/* ========================================
 * IVLE WaNDER! - Helpers
 * 
 * Author: Wang Zhuochun
 * Last Edit: 01/Dec/2012 11:17 AM
 * ======================================== */

define(function(require, exports) {

    "use strict";
    /*jshint browser:true, jquery:true, laxcomma:true, maxerr:50 */

    /* ==============================
     * Semester Helpers */

    function getSemester(today) {
        var result = {
                startYear: 2012, endYear: 2013
              , acadYear: "2012/2013", semester: 2
            }
          , year = today.getFullYear()
          , month = today.getMonth(); // month is [0, 11]

        // Jan 0 - July 6 (this year sem 2)
        // Aug 7 - Nov 10 (next year sem 1)
        // Dec 11 (next year sem 2)
        if (month <= 6) {
            result.startYear = year - 1;
            result.endYear = year;
            result.semester = 2;
        } else if (month >= 11) {
            result.startYear = year;
            result.endYear = year + 1;
            result.semester = 2;
        } else {
            result.startYear = year;
            result.endYear = year + 1;
            result.semester = 1;
        }

        result.acadYear = result.startYear + "/" + result.endYear;

        return result;
    }

    // current academic year and semester object
    exports.Semester = getSemester(new Date());

    // return current academic year and semester
    exports.getSemester = function(date) {
        date = date || new Date();
        return getSemester(date);
    };

    /* ==============================
     * Timetable related Helpers */

    // return the index from 8 clock in grid
    exports.getTimeIndex = function(t) {
        t = parseInt(t, 10);
        return 2 + (Math.floor(t / 100) - 8) * 2 + (t % 100 ? 1 : 0) ;
    };

});
