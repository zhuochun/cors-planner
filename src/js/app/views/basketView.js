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
    , $el = $("#basket-scroll")
    , $basket = $("#basket");

    exports.init = function() {
        $el.tooltip({placement:"right", selector:"span[rel=tooltip]"});
    };

    // subscribe modules add one event
    $.subscribe(planner.list.modules + ":addOne", function(e, mod) {
        $el.prepend(moduleView.render(mod));
    });

    // subscribe modules remove event
    $.subscribe(planner.list.modules + ":removeOne", function(e, mod) {
        $el.find("#" + mod.get("code")).remove();
        // remove any slots TODO remove from slot list if any
        $("#table-slot").find("[id^=" + mod.get("code") + "-]").remove();
    });

});
