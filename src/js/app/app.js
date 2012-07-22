/* ========================================
 * CORS Planner - App Main
 *
 * Author: Wang Zhuochun
 * Last Edit: 22/Jul/2012 04:46 PM
 * ========================================
 * <License>
 * ======================================== */

define(function(require, exports) {

    "use strict";
    /*jshint browser:true, jquery:true, laxcomma:true, maxerr:50*/

    // include jQuery plugins
    require("jquery-ui");
    require("bootstrap");

    // include app view
    var version = "0.0.5", appView = require("view/appView");

    // exports module
    exports.init = function() {
        appView.render(); // initial app views
    };

});
