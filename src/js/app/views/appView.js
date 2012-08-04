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
      , basketView = require("view/basketView")
      , detailView = require("view/detailView")
      , plannerView = require("view/plannerView");

    // render initial all App Views
    exports.render = function() {
        // initial each view if they need
        addModuleView.init();
        plannerView.init();
        basketView.init();
        detailView.init();
        // initial app wide view
        initMisc();
    };

    // initial tooltips
    function initMisc() {
        // enable tooltips
        $("#nav").tooltip({placement:"bottom", selector:"a[rel=tooltip]"});
        $("#footer").tooltip({placement:"top", selector:"a[rel=tooltip]"});
        // detail height
        $(window).bind("resize", function(e) {
            $("#detail").css({
                "height" : $(this).height() - 138
              , "min-height" : $("#primary-panel").height()
            });
        }).trigger("resize");
    }

});
