/* ========================================
 * IVLE WaNDER! - Helpers
 *
 * Author: Wang Zhuochun
 * Last Edit: 12/Aug/2014 11:58 PM
 * ======================================== */

define(function(require, exports) {

    "use strict";
    /*jshint browser:true, jquery:true, laxcomma:true, maxerr:50 */

    /* ==============================
     * Semester Helpers */

    // get the semester based on current date
    // TODO: change this to be specifically defined in school
    function getSemester(today) {
        var result = {
                startYear: 2012, endYear: 2013
              , acadYear: "2012/2013", semester: 2
            }
          , year = today.getFullYear()
          , month = today.getMonth(); // month is [0, 11]

        // Jan 0 - May 4 (this year sem 2)
        // Jun 5 - Nov 10 (next year sem 1)
        // Dec 11 (next year sem 2)
        if (month <= 4) {
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
        return getSemester(date || new Date());
    };

    // get the date of the first week' monday
    // TODO: change this to be specifically defined in school
    function getWeekOneMondayDate(today) {
        var year = today.getFullYear(),
            month = today.getMonth(),
            result, week = 0;

        // Jan  0 - May  4, guess the 2nd week of Jan, this year
        // Jun  5 - Nov 10, guess the 2nd week of Aug, this year
        // Dec 11, guess the 2nd week of Jan, next year
        if (month <= 4) {
            result = new Date(year + "-01-01 00:00:00 GMT+0800");
        } else if (month >= 11) {
            result = new Date((year + 1) + "-01-01 00:00:00 GMT+0800");
        } else {
            result = new Date(year + "-08-01 00:00:00 GMT+0800");
        }

        // find first monday of the month
        while (true) {
            if (result.getDay() === 1) {
                break;
            } else {
                result.setDate(result.getDate() + 1);
            }
        }
        // set to the second week
        result.setDate(result.getDate() + 7);

        return result;
    }

    exports.getWeekOneDate = function(date) {
        return getWeekOneMondayDate(date || new Date());
    };

    // return semester starting date (approximate)
    exports.getWeekOneDateOfWeekday = function(weekday, date) {
        var monday = getWeekOneMondayDate(date || new Date()),
            idx = $.inArray(weekday.toUpperCase(), planner.weekDays);

        if (idx < 0) {
            return monday;
        }

        // add weekday
        monday.setDate(monday.getDate() + idx);

        return monday;
    };

    // format date time
    exports.getDateFormatted = function(date) {
        var year = "" + date.getFullYear(),
            month = ("0" + (date.getMonth() + 1)).slice(-2),
            day = ("0" + date.getDate()).slice(-2),
            hour = ("0" + date.getHours()).slice(-2),
            minute = ("0" + date.getMinutes()).slice(-2);

        return day + "-" + month + "-" + year + " " +
               hour + ":" + minute + ":00";
    };

    /* ==============================
     * Timetable related Helpers */

    // return the index from 8 clock in grid
    exports.getTimeIndex = function(t) {
        t = parseInt(t, 10);
        return 2 + (Math.floor(t / 100) - 8) * 2 + (t % 100 ? 1 : 0) ;
    };

});
