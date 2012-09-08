/* ========================================
 * CORS Planner - Message View
 *
 * Author: Wang Zhuochun
 * Last Edit: 08/Sep/2012 06:18 PM
 * ========================================
 * <License>
 * ======================================== */

define(function(require, exports) {

    "use strict";
    /*jshint browser:true, jquery:true, laxcomma:true, maxerr:50*/
    /*global planner*/
    
    var toastr = require("util/toastr");

    // render initial all App Views
    exports.init = function() { };

    $.subscribe("message:error", function(e, message) {
        toastr.error(message);
    });

    $.subscribe("message:info", function(e, message) {
        toastr.info(message);
    });

    $.subscribe("message:warning", function(e , message) {
        toastr.warning(message);
    });

    $.subscribe("message:success", function(e, message) {
        toastr.success(message);
    });

    $.subscribe(planner.list.modules + ":duplicatedExamDate", function(e, m1, m2) {
        toastr.warning("Exam Date (" + m1.get("examDate") + ") clashes between " +
            m2.get("code") + " " + m2.get("title") + " and " +
            m1.get("code") + " " + m1.get("title") + ".");
    });

});
