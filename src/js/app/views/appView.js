/* ========================================
 * CORS Planner - AppView Main
 *
 * Author: Wang Zhuochun
 * Last Edit: 21/Jul/2012 05:29 PM
 * ========================================
 * <License>
 * ======================================== */

define(function(require, exports) {

    "use strict";
    /*jshint jquery:true, laxcomma:true, maxerr:50*/

    // get all the views
    var addModuleView = require("view/addModuleView")
    , modulesView = require("view/modulesView")
    , plannerView = require("view/plannerView")
    ;

    // initial App View
    exports.render = function() {
        initTooltips();
        addModuleView.init();
        plannerView.init();
    };

    // initial tooltips
    function initTooltips() {
        // enable tooltips
        $("#nav").tooltip({placement:"bottom", selector:"a[rel=tooltip]"});
    }

});
