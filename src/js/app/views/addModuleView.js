/* ========================================
 * CORS Planner - AppModuleView
 *
 * Author: Wang Zhuochun
 * Last Edit: 21/Jul/2012 06:27 PM
 * ========================================
 * <License>
 * ======================================== */

define(function(require, exports) {

    "use strict";
    /*jshint browser:true, jquery:true, laxcomma:true, maxerr:50*/

    // include components
    var storage = require("util/storage")
    , helper = require("util/helper")
    // include other views
    , modulesView = require("view/modulesView")
    // associated $elements
    , $input = $("#mod-code")
    , $addBtn = $("#add-btn")
    , $prevBtn = $("#preview-btn");

    // init will attach all things related to #add
    exports.init = function() {
        updateSemester();
        attachTypeahead();
        attachEvents();
    };

    // update the semester text
    function updateSemester() {
        var sem = helper.getSemester();
        $("#semester").text("Year " + sem.acadYear + " SEM" + sem.semester);
    }

    // attach typeahead to input
    function attachTypeahead() {
        var cors = storage.get("cors-modules");

        if (cors) {
            $input.typeahead({source:cors});
        } else {
            $.getScript("js/data/corsmodules.min.js", function() {
                storage.save("cors-modules", window.corsModules);
                $input.typeahead({source:window.corsModules});
            });
        }
    }

    // attach events to buttons
    function attachEvents() {
        // select input text when on focus
        $input.on("focus", function() { this.select(); });

        // XXX use modulesView or modules controller to handle clickEvent??

        // bind add module event
        $addBtn.on("click", clickEvent(function(m) { modulesView.add(m); }));
        
        // bind preview module event
        $prevBtn.on("click", clickEvent(function(m) { modulesView.preview(m); }));
    }

    function clickEvent(callback) {
        return function(e) {
            e.preventDefault();
            // get the module code entered
            var modCode = $input.val().split(" ")[0];
            // test validity of the modCode
            if (modCode && (/^[a-z]{2,3}\d{4}[a-z]?$/i).test(modCode)) {
                $input.val(""); // empty the val
                callback(modCode); // callback
            } else {
                window.alert("The module code entered is not valid!");
            }
        };
    }

});
