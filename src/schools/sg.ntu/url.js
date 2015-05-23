/* ========================================
 * CORS Planner - NUS Url APIs for YQL
 * 
 * Author: Wang Zhuochun
 * Last Edit: 23/May/2015 11:16 AM
 * ========================================
 * <License>
 * ======================================== */

define(function(require, exports) {

    "use strict";
    /*jshint browser:true, jquery:true, laxcomma:true, maxerr:50*/

    // include components
    var helper = require("util/helper")
    // module default options
      , defaults = $.extend({}, { r_subj_code : "CE0001" }, helper.Semester);

    // return a valid ntu module url
    function corsUrl(mod) {
        return "http://wish.wis.ntu.edu.sg/webexe/owa/AUS_SCHEDULE.main_display1?" +
            "staff_access=false&acadsem=" + mod.startYear + ";" + mod.semester +
            "&r_subj_code=" + mod.modCode.toUpperCase() +
            "&boption=Search&r_search_type=F";
    }

    return function(mod) {
        if (typeof mod === "string") {
            mod = { modCode : mod };
        }

        return {
            url: corsUrl($.extend({}, defaults, mod))
          , xpath: "//table"
        };
    };

});
