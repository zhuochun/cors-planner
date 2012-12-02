/* ========================================
 * CORS Planner - timeslotView
 *
 * module timeslot view on timetable
 *
 * Author: Wang Zhuochun
 * Last Edit: 01/Dec/2012 03:54 PM
 * ========================================
 * <License>
 * ======================================== */

define(function(require, exports) {

    "use strict";
    /*jshint jquery:true, laxcomma:true, maxerr:50*/

    // template
    var template = require("hgn!template/timeSlot");

    // render will return the html generated
    // according to the Module passed in
    exports.render = function(data) {
        var context = {
                
            }
        // create the jquery object
          , $slot = $(template(context));

        // return $module DOM
        return $slot;
    };

});
