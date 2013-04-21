/* ========================================
 * CORS Planner - undo controller
 *
 * handle undo actions in a session
 *   -> undo remove module
 *   -> undo class drag and drop
 *
 * Author: Wang Zhuochun
 * Last Edit: 23/Dec/2012 12:07 PM
 * ========================================
 * <License>
 * ======================================== */

define(function(require, exports) {

    "use strict";
    /*jshint browser:true, jquery:true, laxcomma:true, maxerr:50*/
    /*global planner*/

    var Undos = [], // store undo objects
        MAXUNDOS = 10, // max number of undos
        MSG = { // undo messages
            "empty": function() { return "No Action to Undo Yet"; }
          , "module:remove": function(o) {
                return "Undo Remove Module " + o.mod.get("code");
            }
          , "module:change": function(code, type) {
                return "Undo Drag + Drop of " + code + " " + type;
            }
        };

    // undo push and pop
    $.subscribe("undo:pop", function(e, type, o) {
        if (Undos.length === MAXUNDOS) {
        
        }

        Undos.push(o);

        $.publish("undo:title", MSG[type](o));
    });

    $.subscribe("undo:push", function() {

    });

});
