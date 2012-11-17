/* ========================================
 * CORS Planner - AppModuleView
 *
 * View on Add Module
 *
 * Author: Wang Zhuochun
 * Last Edit: 23/Jul/2012 10:10 PM
 * ========================================
 * <License>
 * ======================================== */

define(function(require, exports) {

    "use strict";
    /*jshint browser:true, jquery:true, laxcomma:true, maxerr:50*/
    /*global planner*/

    // include components
    var store = require("util/store")
      , sem = require("util/helper").getSemester()
    // associated DOM elements
      , $input = $("#mod-code")
      , $addBtn = $("#add-btn");

    // init will attach all things related to #add
    exports.init = function() {
        updateSemester();
        attachTypeahead();
        attachEvents();
    };

    // resize on add-module width
    $.subscribe("app:window:resize", function() {
          var width = $("#add-module").width();
          $("#add-module").find("#mod-code").width(width - 60 - 14);
    });

    // update the semester text
    function updateSemester() {
        $("#semester").text("Year " + sem.acadYear + " SEM" + sem.semester);
    }

    // attach typeahead to input
    function attachTypeahead(cors) {
        cors = store.get("cors-modules");

        if (cors && cors.latestUpdate === planner.dataUpdate) {
            $input.typeahead({source:cors.data});
        } else {
            // require the latest modules data
            require(["corsModulesData"], function(data) {
                store.set("cors-modules", {
                      latestUpdate : planner.dataUpdate
                    , data : data
                });

                $input.typeahead({source:data});
            });
        }
    }

    // attach events to buttons
    function attachEvents() {
        // select input text when on focus
        $input.on("focus", function(e) {
            this.select();
        });

        // bind add module event
        $addBtn.on("click", _clickEvent(function(modCode) {
            $.publish("module:add", [modCode]);
        }));
    }

    function _clickEvent(callback) {
        return function(e, modCode) {
            e.preventDefault();
            // get the module code entered
            modCode = $input.val().split(" ")[0];
            // test validity of the modCode
            if (modCode && (/^[a-z]{2,3}\d{4}[a-z]?$/i).test(modCode)) {
                // empty the input val
                $input.val("");
                // callback decide what to do
                callback(modCode);
            } else {
                $.publish("message:error", ["The Module Code Entered is not Valid!"]);
            }
        };
    }

});
