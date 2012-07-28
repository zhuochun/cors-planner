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

    // include Modal component
    var ModuleList = require("modal/modules")
    // create Modal instances
    , modules = new ModuleList("modules")
    , previews = new ModuleList("previews");

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
    $.subscribe("previews:addOne", function() {
        if (previews.length() > 20) {
            previews.clean();
        }
    });

});
