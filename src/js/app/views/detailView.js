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

    // render the detail pannel
    exports.render = function(module) {
        if (module) {
            $el.empty().append(template(module.format()));
        } else {
            $el.empty().append("<p>Module Details are not found. :(</p>");
        }
    };

});
