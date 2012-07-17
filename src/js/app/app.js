/* ========================================
 * CORS Planner - App Main
 *
 * Author: Wang Zhuochun
 * Last Edit: 14/Jul/2012 04:13 PM
 * ========================================
 * <License>
 * ======================================== */

// Features: (No place to track, put here temporary)
// TODO: [HIGH] separate functions into modules soon after prototyping
// TODO: [HIGH] duplicated module slot over-lapping detection!!
// TODO: [HIGH] right side bar for information display
// TODO: [NORMAL] re-draw slots when browser resized
// TODO: [LOW] tabs for holding different plans
// TODO: [LOW] allow user to save plans online -> more coding :(

define(function(require, exports) {

    "use strict";
    /*jshint browser:true, jquery:true, laxcomma:true, maxerr:50*/

    // include jQuery plugins
    require("bootstrap");

    // include other components
    var yql = require("api/yql")
        , parser = require("api/parser");
    
    // declare private variables
    var version = "0.0.1";

    // TODO: replace this, just for testing
    var modules = [], $basket = $("#basket"), $board = $("#board");

    // exports module
    exports.init = function() {
        // code here
        initInterface();
        bindEvents();
    };

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

      $slot.detach();

      for (key in mod.lectures) {
        // TODO test key is property of lectures

        length = mod.lectures[key].length;

        for (i = 0; i < length; i++) {
          lecture = mod.lectures[key][i];

          $div = $("<div>").addClass("bar lecture").text(mod.code + " (L) " + lecture.room);

          top = $tbody[weekDays[lecture.weekDay]].offsetTop + 2;

          // TODO: deal with class at same time but different room
          time = parseInt(lecture.startTime, 10);
          left = time % 100 === 30 ? $tbody.find("td")[(time/100 - 8) * 2 + 1].offsetLeft : $tbody.find("td")[(time/100 - 8) * 2 + 2].offsetLeft;

          time = parseInt(lecture.endTime, 10);
          width = time % 100 === 30 ? $tbody.find("td")[(time/100 - 8) * 2 + 1].offsetLeft : $tbody.find("td")[(time/100 - 8) * 2 + 2].offsetLeft;
          width = width - left;

          $div.css({"top" : top, "left" : left, "width" : width});
          $div.appendTo($slot);
        }
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

          var modCode = $("#mod-code").val();

          // TODO: check modCode is valid

          yql.request(modCode, function(result) {
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
      });
        

    }

    function initInterface() {
        // enable tooltips
        $("#nav").tooltip({placement:"bottom", selector:"a[rel=tooltip]"});

        // generate table
        var i, j, k, table = ["<table class='table table-striped table-bordered'><thead>"], thead = [], tbody = [];
        // generate table head
        for (i = 8, j = 0; i < 21; i++) {
          thead[j++] = "<th colspan='2'>" + ((i < 10) ? "0" + i : i) +
            "<span class='visible-desktop'> " + ((i < 13) ? "AM" : "PM") + "</span></th>";
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
