/* ========================================
 * CORS Planner - moduleView
 *
 * ModuleView for Module
 *
 * Author: Wang Zhuochun
 * Last Edit: 21/Jul/2012 05:27 PM
 * ========================================
 * <License>
 * ======================================== */

define(function(require, exports) {

    "use strict";
    /*jshint jquery:true, laxcomma:true, maxerr:50*/

    var template = require("hgn!template/module")
    , defaultWidth = $("#basket-scroll").find(".module").outerWidth();

    // render will return the html generated
    // according to the Module passed in
    exports.render = function(module) {
        var context = {
            "code" : module.get("code")
            , "title" : module.get("title")
            , "lectures" : module.count("lectures")
            , "tutorials" : module.count("tutorials")
            , "labs" : module.count("labs")
        };

        return template(context);
    };

    // get the width of .module * i
    exports.getWidth = function(i) {
        defaultWidth = defaultWidth || $("#basket-scroll").find(".module").outerWidth();
        return (defaultWidth + 10) * i; // 10 = margin of .module
    };

});
