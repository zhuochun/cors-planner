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

    // include moduleView component
    var moduleView = require("view/moduleView")
    // dom elements associated
    , $el = $("#basket-scroll");

    exports.init = function() {
        $el.tooltip({placement:"top", selector:"h3"});
        $el.on("click", "h3", function() {
            $.publish("module:preview", $(this).text());
        });
    };

    // subscribe modules add one event
    $.subscribe("modules:addOne", function(e, mod) {
        $el.prepend(moduleView.render(mod)).css("width", _getElWidth());
    });

    // render all modules in list
    //function _render() {
    //    var i = 0, length = modules.length(), items = [];

    //    for (; i < length; i++) {
    //        items[i] = moduleView.render(modules.get(i));
    //    }

    //    $el.empty().append(items.join("")).css("width", getElWidth());
    //}

    // get the basket width
    function _getElWidth() {
        var $modules = $el.find(".module")
        , len = $modules.length
        , width = $modules.outerWidth();

        return (width + 10) * len; // 10 = margin of .module
    }

});
