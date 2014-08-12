/* ========================================
 * CORS Planner - AppModuleView
 *
 * View on Add Module
 *
 * Author: Wang Zhuochun
 * Last Edit: 12/Aug/2014 08:48 PM
 * ========================================
 * <License>
 * ======================================== */

define(function(require, exports) {

    "use strict";
    /*jshint browser:true, jquery:true, laxcomma:true, maxerr:50*/
    /*global planner*/

    // include components
    var store = require("util/store")
      , sem = require("util/helper").Semester
    // associated DOM elements
      , $input = $("#mod-code")
      , $addBtn = $("#add-btn");

    // init will attach all things related to #add
    exports.init = function() {
        updateSemester();
        attachTypeahead();
        attachEvents();
        attachTermControls();
    };

    // resize on add-module width
    $.subscribe("app:window:resize", function() {
        var width = $("#add-module").width();
        $("#add-module").find("#mod-code").width(width - 84);
    });

    // update the semester text
    function updateSemester() {
        $("#semester")
            .text("Year " + sem.acadYear + " SEM" + sem.semester);
    }

    // term control buttons
    function attachTermControls() {
        $("#term-ctrls").tooltip({
            placement:"bottom",
            selector:"li[rel=tooltip]"
        });
    }

    // attach typeahead to input
    function attachTypeahead() {
        // attach an empty source by default
        $input.typeahead({source: [], items: 59, updater: addModule});

        if (planner.school) {
            updateTypeahead();
        }

        $.subscribe("app:school", updateTypeahead);
    }

    // typeahead update
    function updateTypeahead() {
        var key = planner.school + "-module-data"
          , mod = store.get(key);

        require(["school/" + planner.school + "/info"], function(info) {
            if (mod && mod.lastUpdate === info.lastUpdate) {
                $input.data("typeahead").source = mod.data;
            } else {
                // require the latest modules data
                require(["school/" + planner.school + "/data/list"], function(list) {
                    store.set(key, {
                        lastUpdate : info.lastUpdate
                      , data : list
                    });

                    $input.data("typeahead").source = list;
                });
            }
        });
    }

    // attach events to buttons
    function attachEvents() {
        // select input text when on focus
        $input.on("focus", function(e) {
            this.select();
        });
        // bind add module event
        $addBtn.on("click", function(e) {
            e.preventDefault();
            // perform add module code entered
            addModule($input.val());
        });
    }

    function addModule(modCode) {
        modCode = modCode.split(" ")[0];
        // test validity of the modCode
        if (modCode && (/^[a-z]{1,4}\d{3,4}[a-z]{0,2}$/i).test(modCode)) {
            // empty the input val
            $input.val("");
            // callback decide what to do
            $.publish("module:add", [modCode.toUpperCase()]);
            // track module code
            planner.trackEvent('add-module', modCode.toUpperCase());
        } else {
            $.publish("message:error",
                ["The Module Code '" + modCode.toUpperCase() + "' is not Valid!"]);
        }
    }

});
