/* ========================================
 * CORS Planner - YQL Query Ajax
 * 
 * Yahoo Query Language
 * http://developer.yahoo.com/yql/
 *
 * Author: Wang Zhuochun
 * Last Edit: 09/Dec/2012 08:32 PM
 * ========================================
 * <License>
 * ======================================== */

define(function(require, exports) {

    "use strict";
    /*jshint browser:true, jquery:true, laxcomma:true, maxerr:50*/

    // include components
    var helper = require("util/helper")
    // module default options
      , defaults = $.extend({}, { modCode : "ACC1002" }, helper.getSemester());

    // return a valid CORS url
    function getCORSurl(mod) {
        return "https://aces01.nus.edu.sg/cors/jsp/report/ModuleDetailedInfo.jsp?" +
            "acad_y=" + mod.acadYear + "&sem_c=" + mod.semester +
            "&mod_c=" + mod.modCode.toUpperCase();
    }

    // return a valid yql url with query
    function getYQLurl(query) {
        return "http://query.yahooapis.com/v1/public/yql?q=" +
            encodeURIComponent(query) + "&format=json"; //"&callback=";
    }

    // wrap the user's callback
    function getCallback(query, callback) {
        return function(result) {
            // add the query url to the JSON result
            result.url = query;
            // then call user's callback
            callback(result);
        };
    }
    
    // cross domain jsonp
    function jsonp(url) {
        return $.ajax({
            type : "GET"
          , dataType : "jsonp"
          , contentType :"application/x-javascript"
          , url : url
          , xhrFields : { widthCredentials : false }
        });
    }

    // a generalized request
    exports.request = function(query, callback) {
        return jsonp(getYQLurl(query)).success(getCallback(query, callback));
    };

    // a module request for yql, return a Module object
    exports.requestModule = function(mod, callback) {
        if (typeof mod === "string") {
            mod = { modCode : mod };
        }

        var cors = getCORSurl($.extend({}, defaults, mod))
          , query = "select * from html where url='" + cors + "' and xpath='//table'";

        jsonp(getYQLurl(query)).success(getCallback(cors, callback));
    };

});
