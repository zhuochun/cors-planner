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

    // colors http://147colors.com/ 
    // TODO: convert to HEX code
    var colors = [
        "midnightblue"
      , "royalblue"
      , "orangered"
      , "forestgreen"
      , "dimgray"
      , "saddlebrown"
      , "indigo"
      , "deeppink"
      , "navy"
      , "maroon"
      , "goldenrod"
      , "purple"
      , "darkslateblue"
      , "olive"
      , "dodgerblue"
      , "seagreen"
      , "steelblue"
      , "darkorange"
      , "green"
      , "mediumvioletred"
      , "teal"
    ]
    , index = 0
    , length = colors.length;

    exports.get = function() {
        index = (index + 1) % length;
        return colors[index];
    };

    exports.length = function() { return length; };
    exports.used = function() { return index; };
});
