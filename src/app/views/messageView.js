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
        planner.trackEvent("message-error", message);
    });

    $.subscribe("message:warning", function(e , message) {
        toastr.warning(message);
        planner.trackEvent("message-warn", message);
    });

    $.subscribe("message:info", function(e, message) {
        toastr.info(message);
    });

    $.subscribe("message:success", function(e, message) {
        toastr.success(message);
    });

    $.subscribe(planner.list.modules + ":addOne:duplicated", function(e, m) {
        toastr.error("Module " + m.get("code") + " " + m.get("title") + " is in your module list.");
    });

});
