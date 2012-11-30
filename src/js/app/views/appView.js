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
      , messageView = require("view/messageView")
      , plannerView = require("view/plannerView");

    // render initial all App Views
    exports.init = function() {
        // initial each view if they need
        addModuleView.init();
        plannerView.init();
        basketView.init();
        detailView.init();
        messageView.init();
        // initial app wide view
        initMisc();
    };

    // initial tooltips
    function initMisc() {
        // enable tooltips
        $("#nav").tooltip({placement:"bottom", selector:"a[rel=tooltip]"});
        $("#footer").tooltip({placement:"top", selector:"a[rel=tooltip]"});
        // metro tab
        $("#metro-pivot").metroPivot();
        // min height
        $("#planner").css("min-height", $("#primary").height());
        // window resize
        $(window).bind("resize", function(e) {
            var height = $(this).height(),
                primary = $("#primary").height(),
                highest = height > primary ? height : primary;

            $("#sidebar").height(highest - 20);

            var h1 = $("h1").first().height(),
                pivotItems = $("#metro-pivot").find(".pivotItem");

                pivotItems.height(highest - h1 - 143);
                pivotItems.find(".info").width(pivotItems.width() - 43);

            $.publish("app:window:resize", [height, $(this).width()]);
        }).trigger("resize");
    }
});
