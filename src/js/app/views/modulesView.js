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
    , $el = $("#basket-scroll");

    exports.init = function() {

    };

    function render() {
        var i = 0, length = modules.length(), items = [];

        for (; i < length; i++) {
            items[i] = moduleView.render(modules.get(i));
        }

        $el.empty().append(items.join("")).css("width", moduleView.getWidth(i));
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
                // re-render the basket
                render();
            });
        }
    };

    exports.preview = function(modCode) {
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
