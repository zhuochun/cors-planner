/* ========================================
 * CORS Planner - Change School View
 *
 * Author: Wang Zhuochun
 * Last Edit: 21/Apr/2013 04:18 PM
 * ========================================
 * <License>
 * ======================================== */

define(function(require, exports) {

    "use strict";
    /*jshint browser:true, jquery:true, laxcomma:true, maxerr:50*/
    /*global planner*/

    var $el = $("#select-school");

    // init check school
    exports.init = function() {
        attachEvent();

        if (!planner.school) {
            // load cardinjs as needed
            require(["plugin/chardinjs.min"]);
            // select a school
            $el.modal("show");
        } else {
            uiUpdate();
        }
    };

    // update ui associate
    function uiUpdate() {
        $("#school-abbr").text(planner.school.split('.')[1].toUpperCase());
    }

    // attach school change event
    function attachEvent() {
        $el.on("click", "a", function(e) {
            e.preventDefault();

            var newSchool = $(this).data("school");

            if (newSchool !== planner.school) {
                if (planner.school) {
                    $.publish("module:clean");
                } else {
                    $('body').chardinJs('start');
                }
                // update planner school
                planner.set("school", newSchool);
                // update ui
                uiUpdate();
            }

            $el.modal("hide");
        });
    }

});
