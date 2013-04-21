/* ========================================
 * CORS Planner - basketView
 *
 * It is the basket to hold all modules
 *
 * Author: Wang Zhuochun
 * Last Edit: 29/Jul/2012 01:38 AM
 * ========================================
 * <License>
 * ======================================== */

define(function(require, exports) {

    "use strict";
    /*jshint browser:true, jquery:true, laxcomma:true, maxerr:50*/
    /*global planner*/

    // include moduleView component
    var moduleView = require("view/moduleView")
    // dom elements associated
      , $el = $("#basket-scroll");

    exports.init = function() {
        $el.tooltip({placement:"right", selector:"span[rel=tooltip]"});
        // sortable
        $el.sortable({
            containment: "parent"
          , tolerance: "pointer"
          , handle: ".info"
          , forcePlaceholderSize: true
          , update: function(e, ui) {
                $.publish("module:sequence", [$el.sortable("toArray")]);
          }
        });
    };

    // switch to module panel
    function onModulePanel() {
        $("#metro-pivot").data("controller").goToItemByName("Modules");
    }

    // subscribe modules add one event
    $.subscribe(planner.list.modules + ":addOne", function(e, mod) {
        onModulePanel();
        moduleView.render(mod).hide().appendTo($el).slideDown();
    });

    // subscribe module add loading event
    $.subscribe("module:fetching", function(e, code) {
        onModulePanel();
        moduleView.loading(code).hide().prependTo($el).slideDown();
    });

    // subscribe to module exam clash
    $.subscribe(planner.list.modules + ":duplicatedExamDate", function(e, m1, m2) {
        var c1 = m1.get("code"), c2 = m2.get("code");

        $("#" + c1).trigger("clash.add", [c2]);
        $("#" + c2).trigger("clash.add", [c1]);

        $.publish("message:warning", ["Exam Date (" + m1.get("examDate") + ") clashes between " +
            c2 + " " + m2.get("title") + " and " +
            c1 + " " + m1.get("title") + "."]);
    });

});
