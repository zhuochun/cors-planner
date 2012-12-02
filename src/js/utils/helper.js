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
        var acadYear, semester
          , year = today.getFullYear()
          , month = today.getMonth(); // month is 0 ~ 11

        // Jan 0 - July 6 (this year sem 2)
        // Aug 7 - Nov 10 (next year sem 1)
        // Dec 11 (next year sem 2)
        if (month <= 6) {
            acadYear = (year - 1) + "/" + year;
            semester = 2;
        } else if (month >= 11) {
            acadYear = year + "/" + (year + 1);
            semester = 2;
        } else {
            acadYear = year + "/" + (year + 1);
            semester = 1;
        }

        return {
            acadYear : acadYear
          , semester : semester
        };
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
