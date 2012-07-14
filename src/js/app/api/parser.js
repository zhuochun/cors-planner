/* ========================================
 * CORS Planner - Parser
 * 
 * Parse result come from YQL query
 * Return a module object, null if failed
 *
 * Author: Wang Zhuochun
 * Last Edit: 14/Jul/2012 04:35 PM
 * ========================================
 * <License>
 * ======================================== */

define(function(require, exports) {

    "use strict";
    /*jshint jquery:true, laxcomma:true, maxerr:50*/

    var Module = {};

    // trim unwanted \n and \s
    function trim(str) {
        return $.trim(str.replace(/\\n\s*/g, " "));
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
            "code" : tFun
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
        var lectures = Module.lectures
        , info = [ "classNo", "type", "weekType", "weekDay", "startTime", "endTime", "room" ]
        , i, j, dataLength = data.length, infoLength = info.length;

        //log(JSON.stringify(data));

        for (i = 1; i < dataLength; i++) {
            var lecture = {}, lectureClass = data[i].td[0].p;

            for (j = 0; j < infoLength; j++) {
                lecture[info[j]] = data[i].td[j].p;
            }

            if (!lectures[lectureClass]) {
                lectures[lectureClass] = [];
            }

            lectures[lectureClass].push(lecture);
        }
    }

    // check whether the module has tutorial
    function moduleHasTutorial(data) {
        return !(/No Tutorial Class or to be announced/i.test(JSON.stringify(data)));
    }

    // retrieve and set the module tutorials and labs
    function setModuleTutorial(data) {
        var tutorials = Module.tutorials, labs = Module.labs
        , info = [ "classNo", "type", "weekType", "weekDay", "startTime", "endTime", "room" ]
        , i, j, dataLength = data.length, infoLength = info.length;
    
        for (i = 1; i < dataLength; i++) {
            var tutorial = {} // here tutorial = tutorial/lab
            , classNo = data[i].td[0].p
            , type = data[i].td[1].p;

            for (j = 0; j < infoLength; j++) {
                tutorial[info[j]] = data[i].td[j].p;
            }

            if (type === "TUTORIAL") {
                tutorials[classNo] = tutorials[classNo] || [];
                tutorials[classNo].push(tutorial);
            } else {
                labs[classNo] = labs[classNo] || [];
                labs[classNo].push(tutorial);
            }
        }
    }

    // ========================================
    // Return true if module available and exists
    // ========================================
    exports.tryParse = function(data) {
        if (!data.query.results) {
            return false;
        }
        
        return moduleIsAvailable(data.query.results.table[1].tr[1]);
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
        if (!data.query.results) {
            return null;
        }

        // ready to parse data 
        var result = data.query.results.table;

        /* ========================================
            result[0] - -
            result[1] - Module Head - Module Availibility
            result[2] - Module Information
            result[3] - Lecture Availibility + Workload Explain
            result[4] - Lectures
            result[5] - Tutorial Availibility
            result[6] - Tutorials/Labs
         * ======================================== */

         Module = {};

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
