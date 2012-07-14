/* ========================================
 * CORS Planner - YQL Query Ajax
 * 
 * Yahoo Query Language
 * http://developer.yahoo.com/yql/
 *
 * Author: Wang Zhuochun
 * Last Edit: 14/Jul/2012 04:35 PM
 * ========================================
 * <License>
 * ======================================== */

define(function(require, exports) {

    "use strict";
    /*jshint browser:true, jquery:true, laxcomma:true, maxerr:50*/

    // module default options
    var defaults = (function() {
        var acadYear, semester
          , today = new Date()
          , year = today.getFullYear()
          , month = today.getMonth() // month is 0 ~ 11
          ;

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
          , modCode : "ACC1002X"
        };
    })();

    // a generalized request
    function request(query, callback) {
        var yql = "http://query.yahooapis.com/v1/public/yql?q=" +
            encodeURIComponent(query) + "&format=json&callback=";

        $.getJSON(yql, callback);
    }

    // return a valid CORS url
    function getCORSurl(module) {
        return "https://aces01.nus.edu.sg/cors/jsp/report/ModuleDetailedInfo.jsp?" +
            "acad_y=" + module.acadYear + "&sem_c=" + module.semester +
            "&mod_c=" + module.modCode.toUpperCase();
    }

    // a module request for yql, return a Module object
    exports.request = function(module, callback) {
        if (typeof module === "string") {
            module = { modCode : module };
        }

        var mod = $.extend({}, defaults, module)
          , cors = getCORSurl(mod)
          , query = "select * from html where url='" + cors + "' and xpath='//table'";

        request(query, callback);
    };

});
