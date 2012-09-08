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
        // double click to add module to basket
        $el.on("dblclick", "h3", function() {
            var code = $(this).closest("#module-detail").data("modcode");
            // send the message adding module
            $.publish("module:add", [code]);
        });
    };

    // subscribe app wide user message
    // new user
    $.subscribe("app:status:new", function() {
        $el.empty().append("<p>Welcome! Your are using Version " + planner.version + "</p>");
    });
    // user just have their version updated
    $.subscribe("app:status:updated", function() {
        $el.empty().append("<p>Your just updated to Version " + planner.version + "</p>");
    });
    // user using the latest version
    $.subscribe("app:status:uptodate", function() {
        $el.empty().append("<p>Welcome come back! Version " + planner.version + "</p>");
    });

    // subscribe to public resize
    $.subscribe("app:window:resize", function(e, height, width) {
        $el.css({
              "height" : height - 138
            , "min-height" : $("#primary-panel").height()
        });
    });

    // module display
    function _showModuleDetail(e, module) {
        if (module) {
            $el.html(template(module.format()));
        } else {
            $el.html("<p>Module Details are not found. :(</p>");
        }
    }

    // subscribe to module detail display event
    $.subscribe("module:detail", _showModuleDetail);

    // subscribe to preview list add event
    $.subscribe(planner.list.previews + ":addOne", _showModuleDetail);

});
