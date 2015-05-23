/* ========================================
 * CORS Planner - Parser (NTU)
 *
 * Parse result come from YQL query
 * Return an object contains all data, null if failed
 *
 * Author: Wang Zhuochun
 * Last Edit: 23/May/2015 11:23 AM
 * ========================================
 * <License>
 * ======================================== */

define(function(require, exports) {

    "use strict";
    /*jshint laxcomma:true, maxerr:50*/

    var Module, GROUP = "group"
    , commFun = function(data) {
        var text = data.strong || data.b
        return text ?
            (text.font ? (text.font.content || text.font) : text) : "-";
      }
    // for module detail parsing
    , details = {
          "code" : commFun
        , "title" : commFun
        , "credits" : commFun
      }
    // weekDay short -> full
    , WEEKDAY = {
        MON: "MONDAY",
        TUE: "TUESDAY",
        WED: "WEDNESDAY",
        THU: "THURSDAY",
        FRI: "FRIDAY",
        SAT: "SATURDAY"
      };

    // check whether data passed in is valid
    function isDataValid(data) {
        return (data &&
            data.query &&
            data.query.results &&
            data.query.results.table) ? true : false;
    }

    // check whether nus cors website is functioning
    function isCorsWorking(data) {
        return data.query.count !== 2;
    }

    // check whether module is available in the semester
    function moduleIsAvailable(data) {
        return !(/No Courses found/i.test(JSON.stringify(data)));
    }

    // retrieve and set the basic info of module
    function setModuleInfo(data) {
        var td = data[0].td, i = 0, k;

        // init must-have empty data
        Module.correctAsAt = (new Date()).toDateString();
        Module.description = "-";
        Module.examinable = "-";
        Module.examDate = "-";
        Module.preclusion = "-";
        Module.workload = "-";
        Module.prerequisite = "";

        // data[0] - basic info
        for (k in details) {
            if (details.hasOwnProperty(k))
                Module[k] = details[k](td[i++]);
        }

        // data[1] - prerequisite
        for (i = 1, k = data.length; i < k; i++) {
            Module.prerequisite += commFun(data[i].td[1]) || " ";
        }
    }

    // retrieve and set the module lesson according to type
    function setModuleLesson(data) {
        var addTo = Module.lessons[GROUP], index, klass
          , i, time, td, dataLen = data.length;

        for (i = 1; i < dataLen; i++) {
            td = data[i].td;

            /* Td Contents
             *
             * [0] -> index
             * [1] -> Type
             * [2] -> ClassNo/Group
             * [3] -> WeekDay
             * [4] -> Time
             * [5] -> Room/Venue
             * [6] -> Remarks (WeekType)
             * ======================================== */

            index = (td[0] && td[0].b) ? commFun(td[0]) : index;

            // create the index in group
            if (!addTo[index]) {
                addTo[index] = [];
            }

            // create a klass
            klass = {};
            // to identify this klass
            klass.parent = GROUP;
            klass.index = index;
            // klass information
            klass.type = commFun(td[1]);
            klass.classNo = "#" + index + " " + commFun(td[2]);
            klass.weekDay = WEEKDAY[commFun(td[3])];
            time = commFun(td[4]).split("-");
            klass.startTime = time[0];
            klass.endTime = time[1];
            klass.room = commFun(td[5]);
            klass.weekType = td[6] ? commFun(td[6]) : "ALL";

            // save the klass
            addTo[index].push(klass);
        }
    }


    // ========================================
    // Return true if module exists and available
    // ========================================
    exports.tryParse = function(data) {
        return isDataValid(data) && moduleIsAvailable(data.query.results.table[1].tr[1]);
    };

    // ========================================
    // Parse will return an formed Module object
    //
    // if yql data has no result
    //      -> return NULL
    // if module is not provided this semester
    //      -> return Module.isAvailable = false
    // else -> return Module
    // ========================================
    exports.parse = function(data) {
        // check whether data has wanted results
        if (!isDataValid(data)) {
            return null;
        }

        // ready to parse data
        var result = data.query.results.table;

        // ========================================
        // result[0] - Module Information
        // result[1] - Module Classes
        // ========================================

        Module = {}; // initialize a new Module object

        Module.url = data.url; // set the CORS url

        // check whether the module exists
        if (moduleIsAvailable(result)) {
            Module.isAvailable = true;

            setModuleInfo(result[0].tbody.tr);

            Module.lessons = {};
            Module.lessons[GROUP] = {};

            setModuleLesson(result[1].tbody.tr);
        } else {
            Module.isAvailable = false;
        }

        return Module;
    };

});
