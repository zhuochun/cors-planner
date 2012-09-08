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
    /*global window*/

    // render initial all App Views
    exports.init = function() { };

    $.subscribe("message:alert", function(e, message) {
        window.alert("ALERT: " + message);
    });

    $.subscribe("message:info", function(e, message) {
        window.alert("NOTICE: " + message);
    });

});
