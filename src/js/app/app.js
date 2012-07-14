/* ========================================
 * CORS Planner - App Main
 *
 * Author: Wang Zhuochun
 * Last Edit: 14/Jul/2012 04:13 PM
 * ========================================
 * <License>
 * ======================================== */

define(function(require, exports) {

    "use strict";
    /*jshint jquery:true, laxcomma:true, maxerr:50*/

    // include jQuery plugins
    require("bootstrap");

    // include other components
    var yql = require("api/yql")
        , parser = require("api/parser");
    
    // declare private variables
    var version = "0.0.1";

    // exports module
    exports.init = function() {
        // code here
        initInterface();
    };

    function initInterface() {
        // enable tooltips
        $("#nav").tooltip({placement:"bottom", selector:"a[rel=tooltip]"});
    }

});
