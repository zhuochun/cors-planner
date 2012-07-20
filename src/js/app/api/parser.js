/* ========================================
 * CORS Planner - Parser
 * 
 * Parse result come from YQL query
 * Return an object contains all data, null if failed
 *
 * Author: Wang Zhuochun
 * Last Edit: 18/Jul/2012 10:46 PM
 * ========================================
 * <License>
 * ======================================== */

define(function(require, exports) {

    "use strict";
    /*jshint jquery:true, laxcomma:true, maxerr:50*/

    var Module;

    // trim unwanted \n and \s
    function trim(str) {
        return $.trim(str.replace(/\\n\s*/g, " "));
    }

    // check whether data passed in is valid
    function isDataValid(data) {
        return (data && data.query && data.query.results && data.query.results.table) ? true : false;
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
        var i = 1 // starting from 2nd td
        , tFun = function(data) { return data.p; }
        , infos = {
            "code" : function(data) {
                return data.p.split(" ")[0];
            }
            , "title" : tFun
            , "description" : tFun
            , "examinable" : tFun
            , "examdate" : function(data) {
                if (data.p.content) {
                    return trim(data.p.content); // eg. 03-12-2012 EVENING
                } else {
                    return data.p; // NO EXAM
                }
            }
            , "credits" : function(e) { 
                return parseInt(e.p, 10); // eg. 4 (MC)
            }
            , "prerequisite" : tFun
            , "preclusion" : tFun
            , "workload" : tFun
        };

        for (var k in infos) {
          Module[k] = infos[k](data[i++].td[1]);
        }
    }

    // check whether the module has lecture
    function moduleHasLecture(data) {
        return !(/No Lecture Class/i.test(JSON.stringify(data)));
    }

    // retrieve and set the module lectures
    function setModuleLecture(data) {
        var lect, lectGrp, lects = Module.lectures
        , info = [ "classNo", "type", "weekType", "weekDay", "startTime", "endTime", "room" ]
        , i, j, dataLen = data.length, infoLen = info.length;

        for (i = 1; i < dataLen; i++) {
            lect = {};
            // assign values to this lecture
            for (j = 0; j < infoLen; j++) {
                lect[info[j]] = data[i].td[j].p;
            }
            // find this lecture's group weekday-startTime-endTime
            lectGrp = lect.weekDay + "-" + lect.startTime + "-" + lect.endTime;
            // if the lecture group does not exist, create it
            if (!lects[lectGrp]) {
                lects[lectGrp] = [];
            }
            // push lecture to its group
            lects[lectGrp].push(lect);
        }
    }

    // check whether the module has tutorial
    function moduleHasTutorial(data) {
        return !(/No Tutorial Class or to be announced/i.test(JSON.stringify(data)));
    }

    // retrieve and set the module tutorials and labs
    function setModuleTutorial(data) {
        var klass, classType, classGrp, tuts = Module.tutorials, labs = Module.labs
        , info = [ "classNo", "type", "weekType", "weekDay", "startTime", "endTime", "room" ]
        , i, j, dataLen = data.length, infoLen = info.length;

        for (i = 1; i < dataLen; i++) {
            klass = {};
            classType = data[i].td[1].p; // Tutorial or Labs
            // assign values to this class
            for (j = 0; j < infoLen; j++) {
                klass[info[j]] = data[i].td[j].p;
            }
            // find this class's group weekday-startTime-endTime
            classGrp = klass.weekDay + "-" + klass.startTime + "-" + klass.endTime;
            // add class to its type group
            if (classType === "TUTORIAL") {
                tuts[classGrp] = tuts[classGrp] || [];
                tuts[classGrp].push(klass);
            } else {
                labs[classGrp] = labs[classGrp] || [];
                labs[classGrp].push(klass);
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
        // result[1] - Module Head - Module Availibility
        // result[2] - Module Information
        // result[3] - Lecture Availibility + Workload Explain
        // result[4] - Lectures
        // result[5] - Tutorial Availibility
        // result[6] - Tutorials/Labs
        // ========================================

        Module = {}; // initialize a new Module object

        // check whether the module exists
        if (moduleIsAvailable(result[1].tr[1])) {
            Module.isAvailable = true;

            setLatestUpdate(result[1].tr[0]);
            setModuleInfo(result[2].tr);

            Module.lectures = {};
            Module.tutorials = {};
            Module.labs = {};

            if (moduleHasLecture(result[3].tr))
                setModuleLecture(result[4].tr);

            if (moduleHasTutorial(result[5].tr))
                setModuleTutorial(result[6].tr);
        } else {
            Module.isAvailable = false;
        }

        return Module;
    };

});
