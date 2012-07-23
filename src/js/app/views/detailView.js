/* ========================================
 * CORS Planner - detailView
 *
 * detail view
 *
 * Author: Wang Zhuochun
 * Last Edit: 22/Jul/2012 08:00 PM
 * ========================================
 * <License>
 * ======================================== */

define(function(require, exports) {

    "use strict";
    /*jshint jquery:true, laxcomma:true, maxerr:50*/

    // load template
    var template = require("hgn!template/moduleDetail")
    // dom elements associated
    , $el = $("#detail");

    // subscribe to app greeting events
    // TODO: separate to specific view
    $.subscribe("app:newUser", function(e, version) {
        // TODO
        $el.empty().append("<p>Welcome! Your are using version " + version + "</p>");
    });

    $.subscribe("app:update", function(e, version) {
        // TODO
        $el.empty().append("<p>Welcome! Your just updated to version " + version + "</p>");
    });

    $.subscribe("app:intro", function(e, version) {
        // TODO
        $el.empty().append("<p>Welcome! Normal Intro message you will read from version " + version + "</p>");
    });

    // subscribe to module detail display event
    $.subscribe("module:detail", function(m) {
        if (m) {
            $el.empty().append(template(m.format()));
        } else {
            $el.empty().append("<p>Module Details are not found. :(</p>");
        }
    });

});
