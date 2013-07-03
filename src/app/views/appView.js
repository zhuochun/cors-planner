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
    /*global planner*/

    // load all the views
    var schoolView = require("view/schoolView")
      , addModuleView = require("view/addModuleView")
      , basketView = require("view/basketView")
      , detailView = require("view/detailView")
      , messageView = require("view/messageView")
      , shareView = require("view/shareView")
      , plannerView = require("view/plannerView");

    // render initial all App Views
    exports.init = function() {
        // initial each view if they need
        schoolView.init();
        addModuleView.init();
        plannerView.init();
        basketView.init();
        detailView.init();
        messageView.init();
        shareView.init();
        // initial app wide view
        initMisc();
    };

    // toggle between fullsize timetable
    $.subscribe("app:fullsize", function(e, fullsize) {
        var $primary = $("#primary"), $secondary = $("#secondary");

        if (fullsize) {
            $secondary.hide();
            $primary.removeClass("span26").addClass("offset1 span32");
        } else {
            $secondary.show();
            $primary.removeClass("offset1 span32").addClass("span26");
        }

        $(window).resize();
    });

    // initial tooltips
    function initMisc() {
        // enable tooltips
        $("#nav").tooltip({placement:"bottom", selector:"a[rel=tooltip]"});
        $("#misc-btns").tooltip({placement:"bottom", selector:"a[rel=tooltip]"});
        $("#footer").tooltip({placement:"top", selector:"a[rel=tooltip]"});
        // version text
        $("#version").text(planner.version);
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

                pivotItems.height(highest - h1 - 138);
                pivotItems.find(".info").width(pivotItems.width() - 43);

            $.publish("app:window:resize", [height, $(this).width()]);
        }).trigger("resize");
        // bind print button
        $("#fullsize").on("click", (function() {
            var fs = false; // fullsize next = true
            return function() {
                $.publish("app:fullsize", (fs = !fs));
            };
        })());
        // bind share btns
        $(".share-btn").on("click", function(e) {
            if(!e) return;
            e.preventDefault();
            window.open(e.target.href, "intent", "scrollbars=yes,resizable=yes,toolbar=no,location=yes,width=550,height=420,left=" + (window.screen ? Math.round(screen.width / 2 - 275) : 50) + ",top=" + 100);
        });
    }
});
