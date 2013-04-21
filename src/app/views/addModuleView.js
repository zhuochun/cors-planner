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
        $("#add-module").find("#mod-code").width(width - 74);
    });

    // update the semester text
    function updateSemester() {
        $("#semester")
            .text("Year " + sem.acadYear + " SEM" + sem.semester)
            .on("dblclick", function() {
                $.publish("module:clean");
            });
    }

    // term control buttons
    function attachTermControls() {
        // typeahead
        $("#term-ctrls").tooltip({placement:"bottom", selector:"li[rel=tooltip]"});
        // term clean
        $("#term-clear").on("click", function() {
            $.publish("module:clean");
        });
        // term undo
        $("#term-undo").on("click", function() {
            $.publish("undo:pop");
        });
        // subscribe to undo title change
        $.subscribe("undo:title", function(e, title) {
            $("#term-undo").attr("data-original-title", title);
        });
    }

    // attach typeahead to input
    function attachTypeahead() {
        var cors = store.get("cors-modules");

        require(["school/" + planner.school + "/info"], function(info) {
            if (cors && cors.lastUpdate === info.lastUpdate) {
                $input.typeahead({source:cors.data, items:59, updater:addModule});
            } else {
                // require the latest modules data
                require(["school/" + planner.school + "/data/list"], function(data) {
                    store.set("cors-modules", {
                        lastUpdate : planner.dataUpdate
                      , data : data
                    });

                    $input.typeahead({source:data, items:59, updater:addModule});
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
        if (modCode && (/^[a-z]{2,4}\d{4}[a-z]?$/i).test(modCode)) {
            // empty the input val
            $input.val("");
            // callback decide what to do
            $.publish("module:add", [modCode.toUpperCase()]);
        } else {
            $.publish("message:error", 
                ["The Module Code '" + modCode.toUpperCase() + "' is not Valid!"]);
        }
    }

});
