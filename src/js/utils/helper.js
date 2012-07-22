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

    // convert module lectures/modules/labs sequences
    exports.convertModule = function(mod) {
        var m = $.extend({}, mod); // duplicate

        if (!$.isEmptyObject(m.lectures)) {
            m.hasLecture = true;
            m.lectures = convertClass(m.lectures);
        }

        if (!$.isEmptyObject(m.tutorials)) {
            m.hasTutorial = true;
            m.tutorials = convertClass(m.tutorials);
        }

        if (!$.isEmptyObject(m.labs)) {
            m.hasLab = true;
            m.labs = convertClass(m.labs);
        }

        return m;
    };

    function convertClass(klass) {
        var i, j = 0, length, key, result = [];

        for (key in klass) {
            length = klass[key].length;

            for (i = 0; i < length; i++) {
                result[j++] = klass[key][i];
            }
        }

        return result;
    }

});
