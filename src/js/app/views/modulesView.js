/* ========================================
 * CORS Planner - modulesView
 *
 * modulesView
 *
 * Author: Wang Zhuochun
 * Last Edit: 21/Jul/2012 05:27 PM
 * ========================================
 * <License>
 * ======================================== */

// XXX this is a view + controller !!!

define(function(require, exports) {

    "use strict";
    /*jshint browser:true, jquery:true, laxcomma:true, maxerr:50*/

    // import components
    var modules = require("modal/modules")
    // import views
    , moduleView = require("view/moduleView")
    , detailView = require("view/detailView")
    // dom elements associated
    , $el = $("#basket-scroll")
    , $width = $el.find(".module").outerWidth();

    exports.init = function() {
        $el.tooltip({placement:"top", selector:"h3"});
        $el.on("click", "h3", function() {
            previewModule($(this).text());
        });
    };

    function render() {
        var i = 0, length = modules.length(), items = [];

        for (; i < length; i++) {
            items[i] = moduleView.render(modules.get(i));
        }

        $el.empty().append(items.join("")).css("width", getElWidth());
    }

    function renderNew(mod) {
        $el.prepend(moduleView.render(mod)).css("width", getElWidth());
    }

    function getElWidth() {
        $width = $width || $el.find(".module").outerWidth();
        return ($width + 10) * modules.length(); // 10 = margin of .module
    }

    exports.add = function(modCode) {
        // TODO: temporary box to show module loading
        var module = modules.get(modCode);

        if (module) {
            window.alert("Module " + module.get("code") +
                " - " + module.get("title") + " is already added");
        } else {
            modules.getModule(modCode, function(m) {
                // add modules to list
                modules.add(m);
                // render the module in basket
                renderNew(m);
            });
        }
    };

    exports.preview = previewModule;

    function previewModule(modCode) {
        var module = modules.get(modCode);

        if (module) {
            detailView.render(module);
        } else {
            modules.getModule(modCode, function(m) {
                detailView.render(m);
            });
        }
    };

});
