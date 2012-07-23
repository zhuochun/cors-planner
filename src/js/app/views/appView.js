/* ========================================
 * CORS Planner - AppView Main
 *
 * Author: Wang Zhuochun
 * Last Edit: 22/Jul/2012 09:19 PM
 * ========================================
 * <License>
 * ======================================== */

define(function(require, exports) {

    "use strict";
    /*jshint browser:true, jquery:true, laxcomma:true, maxerr:50*/

    // load all the views
    var addModuleView = require("view/addModuleView")
      , modulesView = require("view/modulesView")
      , plannerView = require("view/plannerView")
      ;

    // initial App View
    exports.render = function() {
        addModuleView.init();
        modulesView.init();
        plannerView.init();
        initMisc();
    };

    // initial tooltips
    function initMisc() {
        // enable tooltips
        $("#nav").tooltip({placement:"bottom", selector:"a[rel=tooltip]"});
        $("#footer").tooltip({placement:"top", selector:"a[rel=tooltip]"});
        // detail height
        $(window).bind("resize", function() {
            $("#detail").css("height", $(window).height() - 108);
        }).trigger("resize");
    }

});
