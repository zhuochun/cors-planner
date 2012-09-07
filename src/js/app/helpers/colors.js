/* ========================================
 * CORS Planner - colors assign
 *
 * assign a color
 *
 * Author: Wang Zhuochun
 * Last Edit: 07/Sep/2012 10:24 PM
 * ========================================
 * <License>
 * ======================================== */

define(function(require, exports) {

    "use strict";
    /*jshint jquery:true, laxcomma:true, maxerr:50*/

    // colors [lect, tut, lab]
    var colors = [
        "#CD0074", "#00CC00", "#FFFF00", "#FF4040"
      , "#E6C5B9", "#F45A98", "#5DB377", "#6AA620"
      , "#E667AF", "#67E667", "#FFFF73", "#FF7373"
    ]
    , index = 0
    , length = colors.length;

    exports.get = function(c) {
        index = (index + 1) % length;
        return c ? c : colors[index];
    };

    exports.length = function() { return length; }
    exports.used = function() { return index; }
});
