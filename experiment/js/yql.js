(function($, window) {
    var $module = $("#module")
    , tryAgain = 3
    , moduleName
    , Module = {};

    function log(msg) {
        $module.append("<p>" + msg + "</p>");
    }
    
    $("#submit").click(function(e) {
        e.preventDefault();

        tryAgain = 3;
        Module = {};

        moduleName = $("#input").val();
        getModule(moduleName);
    });

    function getModule(module) {
        log("search for " + module);

        // cors
        var acadYear = "2012/2013"
        , sem = "1"
        , cors = "https://aces01.nus.edu.sg/cors/jsp/report/ModuleDetailedInfo.jsp?"
        , corsGet = "acad_y=" + acadYear + "&sem_c=" + sem + "&mod_c=" + module.toUpperCase()
        // yql
        , yql = "http://query.yahooapis.com/v1/public/yql?q="
        , query = "select * from html where url='" + cors + corsGet + "' and xpath='//table'"
        , yqlGet = "&format=json&callback="
        , finalUrl;

        $module.empty();

        log("<b>CORS</b> = " + query);

        finalUrl = yql + encodeURIComponent(query) + yqlGet;

        log("<b>URL</b> = " + finalUrl);

        //$.getJSON(finalUrl, processRaw);
        $.getJSON("jsonNew/" + module + ".json", processRaw);
    }

    function processRaw(result) {
        if (!result.query.results && tryAgain--) {
            log("Request Failed");
            //getModule(moduleName);
            return ;
        }

        result = result.query.results.table;

        log("Request Succeed = " + result.length);
        log(JSON.stringify(result));

        /* ========================================
            result[0] - -
            result[1] - Module Head - Module Availibility
            result[2] - Module Information
            result[3] - Lecture Availibility + Workload Explain
            result[4] - Lectures
            result[5] - Tutorial Availibility
            result[6] - Tutorials/Labs
         * ======================================== */


        // check whether the module exists
        if (moduleExist(result[1].tr[1])) {
            setLatestUpdate(result[1].tr[0]);

            setModuleInfo(result[2].tr);

            Module.lectures = {};
            Module.tutorials = {};
            Module.labs = {};

            if (moduleHasLecture(result[3].tr))
                setModuleLecture(result[4].tr);

            if (moduleHasTutorial(result[5].tr))
                setModuleTutorial(result[6].tr);

            log("===================");
            log("--> Lectures : " + Object.size(Module.lectures));
            log("--> Tutorials : " + Object.size(Module.tutorials));
            log("--> Labs : " + Object.size(Module.labs));
            log("===================");
            log(JSON.stringify(Module));
        } else {
            log("** module not available **");
        }


window.Module = Module;

    }

    Object.size = function(obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    };

    function Trim(str) {
        return $.trim(str.replace(/\\n\s*/g, " "));
    }

    function moduleExist(data) {
        return !(/currently not available/i.test(JSON.stringify(data)));
    }

    function setLatestUpdate(data) {
        //var tStr, tArr;
        //// set data latest update date
        //tStr = JSON.stringify(data);
        //tArr = (/Correct as at (\d\d \w{3} \d{4} \d\d:\d\d)\"/).exec(tStr);
        //Module.correctAsAt = tArr[1];
        //Module.correctAsAt = (/Correct as at (\d\d \w{3} \d{4} \d\d:\d\d)\"/).exec(JSON.stringify(data))[1];
        var result = (/Correct as at (\d\d \w{3} \d{4} \d\d:\d\d)\"/).exec(JSON.stringify(data));
        Module.correctAsAt = result ? result[1] : undefined;
        log("Correct As At = " + Module.correctAsAt);
    }

    function setModuleInfo(data) {
        // get module information
        var tFun = function(data) { return data.p; }
        , infos = {
            "code" : tFun
            , "title" : tFun
            , "description" : tFun
            , "examinable" : tFun
            , "examdate" : function(data) {
                // TODO : better to allow exam data crash analysis
                if (data.p.content) {
                    return Trim(data.p.content);
                } else {
                    return data.p;
                }
            }
            , "credits" : function(e) { 
                return parseInt(e.p, 10);
            }
            , "prerequisite" : tFun
            , "preclusion" : tFun
            , "workload" : tFun
        }, i = 1;

        //log(JSON.stringify(data));

        for (var k in infos) {
          Module[k] = infos[k](data[i++].td[1]);
          log("==> " + k + " : " + Module[k]);
        }
    }

    function moduleHasLecture(data) {
        return !(/No Lecture Class/i.test(JSON.stringify(data)));
    }

    function setModuleLecture(data) {
        var lectures = Module.lectures
        , info = [ "classNo", "type", "weekType", "weekDay", "startTime", "endTime", "room" ]
        , i, j, dataLength = data.length, infoLength = info.length;

        //log(JSON.stringify(data));

        for (i = 1; i < dataLength; i++) {
            var lecture = {}, lectGroup;

            for (j = 0; j < infoLength; j++) {
                lecture[info[j]] = data[i].td[j].p;
            }

            log("LECTURE " + i + " : " + JSON.stringify(lecture));

            lectGroup = lecture.weekDay + "-" + lecture.startTime + "-" + lecture.endTime;

            if (!lectures[lectGroup]) {
                lectures[lectGroup] = [];
            }

            lectures[lectGroup].push(lecture);
        }
    }

    function moduleHasTutorial(data) {
        return !(/No Tutorial Class or to be announced/i.test(JSON.stringify(data)));
    }

    function setModuleTutorial(data) {
        var tutorials = Module.tutorials
        , labs = Module.labs
        , info = [ "classNo", "type", "weekType", "weekDay", "startTime", "endTime", "room" ]
        , i, j, dataLength = data.length, infoLength = info.length;
    
        for (i = 1; i < dataLength; i++) {
            var tutorial = {}
            , classGroup, type = data[i].td[1].p;

            for (j = 0; j < infoLength; j++) {
                tutorial[info[j]] = data[i].td[j].p;
            }

            log(type + " " + i + " : " + JSON.stringify(tutorial));

            classGroup = tutorial.weekDay + "-" + tutorial.startTime + "-" + tutorial.endTime;

            if (type === "TUTORIAL") {
                tutorials[classGroup] = tutorials[classGroup] || [];
                tutorials[classGroup].push(tutorial);
            } else {
                labs[classGroup] = labs[classGroup] || [];
                labs[classGroup].push(tutorial);
            }
        }
    }

})(jQuery, window);
