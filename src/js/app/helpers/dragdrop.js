/* ========================================
 * CORS Planner - DragDrop for Slots
 *
 * Expose the jQuery DragDrop
 *
 * Author: Wang Zhuochun
 * Last Edit: 11/Aug/2012 04:45 PM
 * ========================================
 * <License>
 * ======================================== */

define(function(require, exports) {

    "use strict";
    /*jshint jquery:true, laxcomma:true, maxerr:50*/

    var solver = require("helper/solver");

    (function($) {

        var $el = $("#timetable")
        , $slot = $("#table-slot")
        , $grid = $("#table-grid")
        , $gridTr, $gridTd, $gridWidth
        // local variables
        , weekDays = { "MONDAY" : 0, "TUESDAY" : 1, "WEDNESDAY" : 2, "THURSDAY" : 3, "FRIDAY": 4 }
        , types = { "lectures" : "(L)", "tutorials" : "(T)", "labs" : "(Lab)" };

        // get the slot index
        function getTimeIndex(t) {
            t = parseInt(t, 10);
            return (Math.floor(t / 100) - 8) * 2 + 1 + (t % 100 ? 1 : 0) ;
        }

        // create droppable slots
        function createDroppableSlots(code, type, klass, that) {
            var key, info, top, left, width, $div, data;
            // cache $grid related DOM if not defined
            $gridTr = $gridTr || $grid.find("tbody").find("tr");
            $gridTd = $gridTd || $($gridTr[0]).find("td");
            $gridWidth = $gridTr[0].offsetWidth;

            // detach $slot to append slot
            $slot.detach();

            // allocate klass to $slot
            for (key in klass) {
                if (klass.hasOwnProperty(key) && that.slotKey !== key) {
                    data = $.extend({}, that, { slotKey : key });

                    info = key.split("-"); // key = "MONDAY-0900-1000"

                    // set top, according to its weekDay
                    top = $gridTr[weekDays[info[0]]].offsetTop + 2;

                    // set left and width, according to start and end time
                    left = $gridTd[getTimeIndex(info[1])].offsetLeft + 1;
                    width = $gridTd[getTimeIndex(info[2]) - 1].offsetLeft +
                            $gridTd[getTimeIndex(info[2]) - 1].offsetWidth - left;

                    // convert left and width to percentage
                    left = (left / $gridWidth) * 100 + "%";
                    width = (width / $gridWidth) * 100 + "%";

                    // create the div to hold this slot
                    $div = $("<div>").addClass("bar temp-slot " + type)
                            .data("slot", data)
                            .text(code + " " + types[type])
                            .css({"top" : top, "left" : left, "width" : width})
                            .droppable(that.dropOpts);

                    // append div to slot
                    $div.appendTo($slot);
                }
            }

            // put $slot back
            $slot.appendTo($el);
        }

        /* PLUGIN CLASS DEFINITION
         * ======================================== */

        function DragDrop(element) {
            this.elem  = element;
            this.$elem = $(element);
            // initial
            this.init();
        }

        DragDrop.fn = DragDrop.prototype;

        DragDrop.fn.init = function() {
            // set a reference to DragDrop context
            var that = this;
            // get the module information
            this.module = $.data(this.elem, "module");
            // set drag options
            this.dragOpts = {
                  opacity: 0.6
                , helper: "clone"
                , appendTo: "#primary-panel"
                , revert: "invalid"
                , revertDuration: 200
                , zIndex : 1000
                , containment: "#primary-panel"
                , start: $.proxy(that.dragStart, that)
                , stop: $.proxy(that.dragStop, that)
            };
            // set drop options
            this.dropOpts = {
                  activeClass: "bar-active"
                , hoverClass: "bar-hover"
                , drop: $.proxy(that.dropEvent, that)
            };

            // lazy bidding draggable event
            this.$elem.on("mouseenter", ".draggable", function() {
                var $this = $(this);

                if (!$this.hasClass("ui-draggable")) {
                    that.bindDragEvent($this);
                }
            });
        };

        // assign drag event
        DragDrop.fn.bindDragEvent = function(elem) {
            elem.draggable(this.dragOpts);
        };

        // drag start, create slots
        DragDrop.fn.dragStart = function(event, ui) {
            var
              $this = $(event.target)
            , id  = $this.attr("id") // id = "ACC1002-lectures"
            , info = id ? id.split("-") : undefined // deal with drag slot
            , data = info ? {
                  id : info[0]
                , type : info[1]
                , module : this.module
                , slots : this.module.get(info[1])
                , elem : $this
                , dropOpts : this.dropOpts
            } : $this.data("slot");

            // create slots
            createDroppableSlots(data.id, data.type, data.slots, data);
        };

        DragDrop.fn.dragStop = function(event, ui) {
            // remove all temporary droppable slots created
            $slot.find(".temp-slot").remove();
        };

        DragDrop.fn.dropEvent = function(event, ui) {
            var
              $this = $(event.target)
            , $that = ui.draggable;

            // remove helper
            ui.helper.remove();
            // remove original bar or disable the original
            if ($that.hasClass("bar")) {
                $that.remove();
            } else {
                $that.removeClass("draggable").draggable("disable");
            }

            // set down this dropped slot
            $this.css("background-color", "grey")
                 .attr("id", "AAA") // TODO assign it ACC1002-lecture
                 .removeClass("temp-slot")
                 .addClass("draggable")
                 .droppable("destroy")
                 .draggable(this.dragOpts);
            // remove other temporary droppable slots
            $slot.find(".temp-slot").remove();
        };

        /* PLUGIN DEFINITION
        * ======================================== */

        $.fn.dragdrop = function() {
            return this.each(function () {
                if (!$.data(this, "DragDrop")) {
                    $.data(this, "DragDrop", new DragDrop(this));
                }
            });
        };

    })(jQuery);

});
