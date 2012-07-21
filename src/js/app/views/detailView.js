/* ========================================
 * CORS Planner - detailView
 *
 * detail view
 *
 * Author: Wang Zhuochun
 * Last Edit: 21/Jul/2012 06:39 PM
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
            // TODO: edited template
            $el.append("<p>Render Module : " +
                module.get("code") + " : " + module.get("title") + "</p>");
            //template(module.data);
        } else {
            $el.append("<p>Render Default Detail Page</p>");
            // TODO: if not module passed in will render the default page
        }
    };

});
