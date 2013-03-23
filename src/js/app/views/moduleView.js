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

    // jquery plugin
    require("helper/jquery.module");
    require("helper/jquery.loading");
    // template
    var template = require("hgn!template/module")
      , loading = require("hgn!template/loading");

    // render will return the html generated
    // according to the Module passed in
    exports.render = function(module) {
        var context = {
              id : module.id
            , color : module.get("color")
            , code : module.get("code")
            , title : module.get("title")
            , examDate : module.get("examDate")
        }, $module = $(template(context));

        $module.module({data: module});

        return $module;
    };

    // render a module loading html
    exports.loading = function(code) {
        var context = { id: code }
          , $elem = $(loading(context));

        $elem.loading(context);

        return $elem;
    };

});
