/* ========================================
 * CORS Planner - NUS Url APIs for YQL
 * 
 * Author: Wang Zhuochun
 * Last Edit: 20/Apr/2013 02:01 PM
 * ========================================
 * <License>
 * ======================================== */

define(function(require, exports) {

    "use strict";
    /*jshint browser:true, jquery:true, laxcomma:true, maxerr:50*/

    // include components
    var helper = require("util/helper")
    // module default options
      , defaults = $.extend({}, { modCode : "ACC1002" }, helper.Semester);

    // return a valid CORS url
    function corsUrl(mod) {
        return "https://myaces.nus.edu.sg/cors/jsp/report/ModuleDetailedInfo.jsp?" +
            "acad_y=" + mod.acadYear + "&sem_c=" + mod.semester +
            "&mod_c=" + mod.modCode.toUpperCase();
    }

    return function(mod) {
        if (typeof mod === "string") {
            mod = { modCode : mod };
        }

        return corsUrl($.extend({}, defaults, mod));
    };

});
