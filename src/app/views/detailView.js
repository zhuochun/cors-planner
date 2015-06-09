/* ========================================
 * CORS Planner - detailView
 *
 * detail view
 *
 * Author: Wang Zhuochun
 * Last Edit: 29/Jul/2012 02:16 AM
 * ========================================
 * <License>
 * ======================================== */

define(function(require, exports) {

    "use strict";
    /*jshint jquery:true, laxcomma:true, maxerr:50*/
    /*global planner*/

    // dom elements associated
    var $el = $("#detail")
    // load template
      , template = require("hgn!template/moduleDetail");

    // init detail panel
    exports.init = function() {
        $("#metro-pivot").metroPivot();
        // go back to modules page
        $el.on("dblclick", function() {
            $("#metro-pivot").data("controller").goToItemByName("Modules");
        });
    };

    // subscribe app wide user message
    // new user
    $.subscribe("app:status:new", function() {
        $("#metro-pivot").data("controller").goToItemByName("Detail");
    });
    // user just have their version updated
    //$.subscribe("app:status:updated", function() { });
    // user using the latest version
    //$.subscribe("app:status:uptodate", function() { });

    // module display
    function _showModuleDetail(e, mod) {
        if (mod) {
            $el.html(template(mod.data));
            $el.data("module", mod.get("code"));
        } else {
            $el.html("<p>Module's detail is not found. :(</p>");
        }

        planner.trackEvent("view-module-detail", mod.get("code"));
    }

    // subscribe to module detail display event
    $.subscribe("module:detail", _showModuleDetail);

    // subscribe to preview list add event
    $.subscribe(planner.list.previews + ":addOne", _showModuleDetail);

});
