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
    };

    // switch to module panel
    function onModulePanel() {
        $("#metro-pivot").data("controller").goToItemByName("Modules");
    }

    // subscribe modules add one event
    $.subscribe(planner.list.modules + ":addOne", function(e, mod) {
        onModulePanel();
        $el.append(moduleView.render(mod));
    });

    // subscribe module add loading event
    $.subscribe("module:fetching", function(e, code) {
        onModulePanel();
        $el.prepend(moduleView.loading(code));
    });

});
