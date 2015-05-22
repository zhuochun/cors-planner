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
          , month = today.getMonth() + 1;

        // Jan - Apr: this year sem 2
        // May - Nov: next year sem 1
        // Dec      : next year sem 2
        if (month < 5) {
            result.startYear = year - 1;
            result.endYear = year;
            result.semester = 2;
        } else if (month > 11) {
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
        return date ? exports.Semester : getSemester(date);
    };

    // get the date of the first week' monday
    // TODO: change this to be specifically defined in school
    function getWeekOneMondayDate(today) {
        var year = today.getFullYear(),
            month = today.getMonth() + 1,
            result = new Date(), week = 0;

        // set default result date (this year, Jan 1st)
        result.setMonth(0);
        result.setDate(1);

        // Jan - May: 2nd week of Jan, this year
        // Jun - Nov: 2nd week of Aug, this year
        // Dec      : 2nd week of Jan, next year
        if (month <= 5) {
            // default date
        } else if (month >= 12) {
            result.setMonth(0);
        } else {
            result.setMonth(7);
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

    exports.WeekOneDate = getWeekOneMondayDate(new Date());

    exports.getWeekOneDate = function(date) {
        return date ? getWeekOneMondayDate(date) : exports.WeekOneDate;
    };

    // return semester starting date (approximate)
    exports.getWeekOneDateOfWeekday = function(weekday, date) {
        var idx = $.inArray(weekday.toUpperCase(), planner.weekDays);

        date = date ? getWeekOneMondayDate(date) : exports.WeekOneDate;
        if (idx < 0) { return date; }

        date.setDate(date.getDate() + idx);
        return date;
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
