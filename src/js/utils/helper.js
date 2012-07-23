/* ========================================
 * IVLE WaNDER! - Helpers
 * 
 * Author: Wang Zhuochun
 * Last Edit: 21/Jul/2012 10:13 PM
 * ======================================== */

define(function(require, exports) {

    "use strict";
    /*jshint browser:true, jquery:true, laxcomma:true, maxerr:50 */

    // return current academic year and semester
    exports.getSemester = function() {
        var acadYear, semester
        , today = new Date()
        , year = today.getFullYear()
        , month = today.getMonth(); // month is 0 ~ 11

        if (month < 6) { // less than July (Month 6)
            acadYear = (year - 1) + "/" + year;
            semester = 2;
        } else {
            acadYear = year + "/" + (year + 1);
            semester = 1;
        }

        return {
            acadYear : acadYear
          , semester : semester
        };
    };

});
