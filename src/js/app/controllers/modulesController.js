/* ========================================
 * CORS Planner - modules controller
 *
 * modules controller
 *
 * Author: Wang Zhuochun
 * Last Edit: 29/Jul/2012 01:38 AM
 * ========================================
 * <License>
 * ======================================== */

define(function(require, exports) {

    "use strict";
    /*jshint browser:true, jquery:true, laxcomma:true, maxerr:50*/
    /*global planner*/

    // default module lists
    planner.list = planner.list || {};
    planner.list.modules  = "modules";
    planner.list.previews = "previews";

    // include Modal component
    var ModuleList = require("modal/modules")
    // create Modal instances
    , modules = new ModuleList(planner.list.modules)
    , previews = new ModuleList(planner.list.previews);

    // add a module event
    $.subscribe("module:add", function(e, m) {
        var mod = previews.get(m);

        if (mod) {
            previews.remove(mod);
            modules.add(mod);
        } else {
            modules.add(m);
        }
    });

    // preview a module event
    $.subscribe("module:preview", function(e, m) {
        var mod = modules.get(m) || previews.get(m);

        if (mod) { 
            $.publish("module:detail", mod);
        } else {
            previews.add(m);
        }
    });

    // to control the size of previews list
    $.subscribe(planner.list.previews + ":addOne", function() {
        if (previews.length() > 20) {
            previews.clean();
        }
    });

});
