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
    , plannerView = require("view/plannerView")
    // draggable options
    , dragOpts = {
        cursor: "move"
        , opacity: 0.6
        , helper: "clone"
        , appendTo: "#primary-panel"
        , revert: "invalid"
        , revertDuration: 200
        , zIndex : 1000
        , containment: "#primary-panel"
        , start: dragStart
        , stop: dragStop
    }
    // droppable options
    , dropOpts = {
    
    };

    function dragStart(event, ui) {
        var $this = $(this)
        , mod = $this.parents(".module").data("module")
        , type = $this.attr("id").split("-")[1];

        plannerView.createDroppableSlot(mod.get("code"), type, mod.get(type));
    }

    function dragStop(event, ui) {
        $(".temp-slot").remove();
    }


    // render will return the html generated
    // according to the Module passed in
    exports.render = function(module) {
        var context = {
            "id" : module.id
            , "code" : module.get("code")
            , "title" : module.get("title")
            , "lectures" : module.count("lectures")
            , "tutorials" : module.count("tutorials")
            , "labs" : module.count("labs")
        },
        // get the jquery object
        $module = $(template(context)).data("module", module);
        // assign draggable events
        $module.find(".draggable").draggable(dragOpts);
        // return $module DOM
        return $module;
    };

});
