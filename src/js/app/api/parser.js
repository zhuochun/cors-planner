/* ========================================
 * CORS Planner - Parser
 * 
 * Parse result come from YQL query
 * Return an object contains all data, null if failed
 *
 * Author: Wang Zhuochun
 * Last Edit: 22/Mar/2013 08:42 PM
 * ========================================
 * <License>
 * ======================================== */

define(function(require, exports) {

    "use strict";
    /*jshint laxcomma:true, maxerr:50*/

    var Module
    , commFun = function(data) {
        return data.p ? data.p : trim(data);
      }
    , contentFun = function(data) {
        var result = data.content || data.p;

        if (typeof result === "object") {
            return contentFun(result); // do it recursive
        } else if (typeof result === "string") {
            return trim(result);
        } else {
            throw "ERROR PARSE FAILED: " + JSON.stringify(data).substr(0, 10);
        }
      }
    // for module detail parsing
    , details = {
          "code" : function(data) {
              return commFun(data).split(" ")[0];
          }
        , "title" : commFun
        , "description" : commFun
        , "examinable" : commFun
        , "examDate" : contentFun
        , "credits" : function(data) { 
              return parseInt(data.p, 10); // eg. 4 (MC)
          }
        , "prerequisite" : commFun
        , "preclusion" : commFun
        , "workload" : commFun
      }
    // for lecture/modules/labs info parsing
    , infoLen = 7
    , info = {
          "classNo" : commFun
        , "type" : commFun
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
        return (data &&
            data.query &&
            data.query.results &&
            data.query.results.table) ? true : false;
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
            if (details.hasOwnProperty(k))
                Module[k] = details[k](data[i++].td[1]);
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
                // type = Lecture/Tutorial/Lab
                type = info.type(data[i].td[1]);

                // create the type in lessons
                if (!addTo[type]) {
                    addTo[type] = {};
                }
                    
                klass = {}; j = 0;
                // get klass values
                for (k in info) {
                    if (info.hasOwnProperty(k))
                        klass[k] = info[k](data[i].td[j++]);
                }

                // get klass group
                grp = klass.classNo;
                // create the group array
                if (!addTo[type][grp]) {
                    addTo[type][grp] = [];
                }
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
        }

        // ready to parse data 
        var result = data.query.results.table;

        // ========================================
        // result[0] - -
        // result[1] - Module Head - Module's Availability
        // result[2] - Module Information
        // result[3] - Lectures' Availibility + Workload Description
        // result[4] - Lectures
        // result[5] - Tutorials' Availibility
        // result[6] - Tutorials/Labs
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
                setModuleLesson(result[4].tr);
            }

            if (moduleHasTutorial(result[5].tr)) {
                setModuleLesson(result[5].tr); // Design Lecture
                setModuleLesson(result[6].tr);
            }
        } else {
            Module.isAvailable = false;
        }

        return Module;
    };

});
