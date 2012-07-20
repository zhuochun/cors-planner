/* ========================================
 * CORS Planner - App Main
 *
 * Author: Wang Zhuochun
 * Last Edit: 19/Jul/2012 09:51 PM
 * ========================================
 * <License>
 * ======================================== */

// Features: (No place to track, put here temporary)
// TODO: [HIGH] separate functions into modules soon after prototyping
// TODO: [HIGH] duplicated module slot over-lapping detection!!
// TODO: [HIGH] right side bar for information display
// TODO: [LOW] tabs on table for holding different plans
// TODO: [LOW] FUTURE: allow user to save plans online -> more coding :(

define(function(require, exports) {

    "use strict";
    /*jshint browser:true, jquery:true, laxcomma:true, maxerr:50*/

    // include jQuery plugins
    require("bootstrap");

    // include other components
    var yql = require("api/yql")
        , parser = require("api/parser")
        , storage = require("util/storage");
    
    // declare private variables
    var version = "0.0.1";

    // TODO: replace this, just for testing
    var modules = [], $basket = $("#basket"), $board = $("#board");

    // exports module
    exports.init = function() {
        // code here
        initTypeahead();
        initInterface();
        bindEvents();
    };

    function initTypeahead() {
        var cors = storage.get("cors-modules");

        if (cors) {
            $("#mod-code").typeahead({source:cors});
        } else {
            $.getScript("js/data/corsmodules.min.js", function() {
                storage.save("cors-modules", window.corsModules);
                $("#mod-code").typeahead({source:window.corsModules});
            });
        }
    }

    function allocateModuleSlots(mod) {
      var $div, $tr, i, length, key, lecture, top, left, width, time;

      // Cached variables for allocating module slots
      var $tbody = $("#table-grid tbody").find("tr"), $slot = $("#table-slot");

      var weekDays = {
        "MONDAY" : 0
        , "TUESDAY" : 1
        , "WEDNESDAY" : 2
        , "THURSDAY" : 3
        , "FRIDAY": 4
      };

      var getIndex = function(t) {
          t = parseInt(t, 10);
          return (Math.floor(t / 100) - 8) * 2 + 1 + (t % 100 ? 1 : 0) ;
      };

      $slot.detach();

      var $width = $tbody[0].offsetWidth;

      for (key in mod.lectures) {
          var info = key.split("-"); // key is in format: "MONDAY-0900-1000"

          // create the div to hold this lecture slot
          $div = $("<div>").addClass("bar lecture").text(mod.code + " (L)");

          // set top, according to its weekDay
          top = $tbody[weekDays[info[0]]].offsetTop + 2;

          left = $tbody.find("td")[getIndex(info[1])].offsetLeft;
          width = $tbody.find("td")[getIndex(info[2])].offsetLeft - left;

          left = (left / $width) * 100 + "%";
          width = (width / $width) * 100 + "%";

          $div.css({"top" : top, "left" : left, "width" : width});
          $div.appendTo($slot);
      }

      $slot.appendTo("#timetable");
    }

    function bindEvents() {
      // update method
      $basket.bind("update", function() {
        $basket.detach().empty();

        var i, len = modules.length;

        for (i = 0; i < len; i++) {
          $("<li>").append($("<div>").text(modules[i].code + " -> " + modules[i].title)).appendTo($basket);
        }

      $("#table-slot").empty();

        for (i = 0; i < len; i++) {
          allocateModuleSlots(modules[i]);
        }

        $basket.appendTo($board);
      });

      $("#add-btn").on("click", function(e) {
          e.preventDefault();

          var modCode = $("#mod-code").val().split(" ")[0];

          if (modCode && /^[a-zA-Z]{2,3}\d{4}$/.test(modCode)) {
              $("#mod-code").val(""); // empty the val

              yql.requestModule(modCode, function(result) {
                  var module = parser.parse(result);

                  if (module !== null) {
                      if (module.isAvailable) {
                          // TODO: should not allow duplicated module
                          modules.push(module);
                          $basket.trigger("update");
                      } else {
                          window.alert("module : " + modCode + " is not available");
                      }
                  }
              });
          }
      });
        

    }

    function initInterface() {
        // enable tooltips
        $("#nav").tooltip({placement:"bottom", selector:"a[rel=tooltip]"});

        // generate table
        var i, j, k, table = ["<table class='table table-striped table-bordered'><thead>"], thead = [], tbody = [];
        // generate table head
        for (i = 8, j = 0; i < 21; i++) {
          thead[j++] = "<th colspan='2'>" + ((i < 10) ? "0" + i : i) + "</th>";
            //"<span class='visible-desktop'> " + ((i < 13) ? "AM" : "PM") + "</span></th>";
        }

        table.push("<tr><th></th>" + thead.join(" ") + "</tr></thead>");

        // generate table body
        var weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
        for (i = 0, j = 0; i < 5; i++) {
          tbody[j] = "<tr><td class='weekday'>" + weekdays[i] + "</td>";

          for (k = 8; k < 21; k++)
            tbody[j] += "<td></td><td></td>";
        
          j++;
        }

        table.push("<tbody>" + tbody.join(" ") + "</tbody");

        // append table to html
        $("#table-grid").html(table.join(""));
    }

});
