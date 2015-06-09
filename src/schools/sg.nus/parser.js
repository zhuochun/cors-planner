/* ========================================
 * CORS Planner - Parser (NUS)
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

    var Module
    , commFun = function(data) {
        return trim(data.p ? data.p : data);
      }
    , contentFun = function(data) {
        var result = data.content || data.p;

        if (typeof result === "object") {
            return contentFun(result); // do recursively
        } else if (typeof result === "string") {
            return trim(result);
        } else {
            throw "ERROR PARSE FAILED: " + JSON.stringify(data).substr(0, 10);
        }
      }
    // for module detail parsing
    , details = {
          "code" : contentFun
        , "title" : contentFun
        , "description" : contentFun
        , "examinable" : contentFun
        , "examDate" : contentFun
        , "credits" : function(data) {
              return parseInt(contentFun(data), 10); // eg. 4 (MC)
          }
        , "prerequisite" : contentFun
        , "preclusion" : contentFun
        , "workload" : contentFun
      }
    // for lecture/modules/labs info parsing
    , infoLen = 7
    , info = {
          "classNo" : commFun
        , "type" : function(data) {
              return commFun(data).replace(/\s/g, "-");
          }
        , "weekType" : commFun
        , "weekDay" : commFun
        , "startTime" : commFun
        , "endTime" : commFun
        , "room" : contentFun
      }
    // regex for trim
    , trimLeft = /^\s+/, trimRight = /(,?)\s+$/;

    // trim unwanted \n and ,\s
    function trim(str) {
        if (typeof str === "object") {
            str = JSON.stringify(str);
        }

        return str ? str.replace(trimLeft, "").replace(trimRight, "") : "";
    }

    // check whether data passed in is valid
    function isDataValid(data) {
        return data && data.query && data.query.results &&
            data.query.results.tbody;
    }

    // check whether nus cors website is functioning
    function isCorsWorking(data) {
        return data.query.count !== 2;
    }

    // check whether module is available in the semester
    function moduleIsAvailable(data) {
        return !(/currently not available/i.test(JSON.stringify(data)));
    }

    // get and set the latest module data update time
    function setLatestUpdate(data) {
        var result = (/Correct as at (\d\d \w{3} \d{4} \d\d:\d\d)\"/).exec(JSON.stringify(data));
        Module.correctAsAt = result ? result[1] : undefined;
    }

    // retrieve and set the basic info of module
    function setModuleInfo(data) {
        var i = 1, k; // starting from 2nd td

        for (k in details) {
            if (details.hasOwnProperty(k)) {
                Module[k] = details[k](data[i++].td[1]);
            }
        }
    }

    // check whether the module has lecture
    function moduleHasLecture(data) {
        return !(/No Lecture Class/i.test(JSON.stringify(data)));
    }

    // check whether the module has tutorial
    function moduleHasTutorial(data) {
        return !(/No Tutorial Class or to be announced/i.test(JSON.stringify(data)));
    }

    // retrieve and set the module lesson according to type
    function setModuleLesson(data) {
        var addTo = Module.lessons, type, grp, klass
          , i, j, k, dataLen = data.length;

        for (i = 1; i < dataLen; i++) {
            if (data[i].td && data[i].td.length >= infoLen) {
                // type = lecture/tutorial/lab
                type = info.type(data[i].td[1]).toLowerCase();

                // create the type in lessons
                if (!addTo[type]) {
                    addTo[type] = {};
                }

                klass = {}; j = 0;
                // get klass values
                for (k in info) {
                    if (info.hasOwnProperty(k)) {
                        klass[k] = info[k](data[i].td[j++]);
                    }
                }

                // get klass group
                grp = klass.classNo;
                // create the group array
                if (!addTo[type][grp]) {
                    addTo[type][grp] = [];
                }

                // to identify the klass position
                klass.parent = type;
                klass.index = grp;

                // save the klass
                addTo[type][grp].push(klass);
            }
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
        } else if (!isCorsWorking(data)) {
            throw new Error("NUS CORS Module Website is Down.");
        }

        // ready to parse data
        var result = data.query.results.tbody;

        // ========================================
        // result[0] - -
        // result[1] - Module Availability
        // result[2] - Module Information
        // result[3] - Lectures' Availibility
        // result[4] - Lectures Header (ignored)
        // result[5] - Lectures
        // result[6] - Tutorials' Availibility
        // result[7] - Tutorials/Labs
        // ========================================

        Module = {}; // initialize a new Module object

        Module.url = data.url; // set the CORS url

        // check whether the module exists
        if (moduleIsAvailable(result[1].tr[1])) {
            Module.isAvailable = true;

            setLatestUpdate(result[1].tr[0]);
            setModuleInfo(result[2].tr);

            Module.lessons = {};

            if (moduleHasLecture(result[3].tr)) {
                setModuleLesson(result[5].tr);
            }

            if (moduleHasTutorial(result[6].tr)) {
                setModuleLesson(result[7].tr);
            }
        } else {
            Module.isAvailable = false;
        }

        return Module;
    };

});
