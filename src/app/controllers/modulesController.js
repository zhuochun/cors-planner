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
        }, 190);
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

    // module share
    $.subscribe("module:share", function() {
        var list = modules.compress(), params = [], i, len = list.length;

        for (i = 0; i < len; i++) {
            params.push(list[i].id + "|" +
                        (list[i].visible ? 1 : 0) + "|" +
                        JSON.stringify(list[i].allocated));
        }

        $.publish("app:share:get", [params.join("&")]);
    });

    // module parse share
    $.subscribe("module:readFromShare", function(e, mods) {
        var i, len = mods.length, m;

        for (i = 0; i < len; i++) {
            m = mods[i].split("|");

            modules.add(m[0], null, {visible: m[1] === '1', allocated: JSON.parse(m[2])});
        }
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
            // undo remove module
            //$.publish("undo:push", ["module:remove", {
            //    mod: mod,
            //    undo: function() {
            //        $.publish("module:add", mod);
            //    }
            //}]);
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
