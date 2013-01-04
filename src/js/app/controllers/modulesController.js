/* ========================================
 * CORS Planner - modules controller
 *
 * modules controller
 *
 * Author: Wang Zhuochun
 * Last Edit: 05/Aug/2012 03:40 AM
 * ========================================
 * <License>
 * ======================================== */

define(function(require, exports) {

    "use strict";
    /*jshint browser:true, jquery:true, laxcomma:true, maxerr:50*/
    /*global planner*/

    // include ModalList modal
    var ModuleList = require("model/modules")
    // initial Module lists
      , modules = new ModuleList(planner.list.modules)
    // store
      , store = require("util/store");

    // controller initial
    exports.init = function() {
        setTimeout(function() {
            loadStorage();
        }, 500);
    };

    // populate storage modules
    function loadStorage() {
        modules.populate(store.get(planner.list.modules) || []);
    }

    // save modules to storage
    function saveStorage() {
        store.set(planner.list.modules, modules.toJSON());
    }

    // save modules to storage
    $.subscribe("module:save", function() {
        saveStorage();
    });

    // add a module event
    $.subscribe("module:add", function(e, m) {
        modules.add(m);
    });

    // modules sequence update
    $.subscribe("module:sequence", function(e, seq) {
        modules.inSequence(seq);
        saveStorage();
    });

    // preview a module event
    $.subscribe("module:preview", function(e, m) {
        var mod = modules.get(m);

        if (mod) {
            $.publish("module:detail", mod);
        }
    });

    // remove a module event
    $.subscribe("module:remove", function(e, m) {
        var mod = modules.remove(m);

        if (mod) {
            $.publish("message:success", "Module " + mod.get("code") + " is removed");
        }
    });

    // clear all modules
    $.subscribe("module:clean", function() {
        modules.clean();
        // notify module plugins
        $.publish("module:clean:all");
        // message
        $.publish("message:success", "All modules are removed");
    });

});
