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

    var template = require("hgn!template/module");

    // render will return the html generated
    // according to the Module passed in
    exports.render = function(module) {
        var context = {
              "id" : module.id
            , "color" : module.get("color")
            , "code" : module.get("code")
            , "title" : module.get("title")
            , "examDate" : module.get("examDate")
            , "lectures" : module.count("lectures")
            , "tutorials" : module.count("tutorials")
            , "labs" : module.count("labs")
        },
        // get the jquery object
        $module = $(template(context)).data("module", module);
        // lazy draggable events loading
        $module.dragdrop();
        // return $module DOM
        return $module;
    };

});
