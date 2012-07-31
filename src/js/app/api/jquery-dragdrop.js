/* ========================================
 * CORS Planner - jQuery DragDrop Plugin
 *
 * Author: Wang Zhuochun
 * Last Edit: 01/Aug/2012 12:26 AM
 * ========================================
 * <License>
 * ======================================== */

;(function($) {

    "use strict";
    /*jshint jquery:true, laxcomma:true, maxerr:50*/

    // draggable options
    var dragOpts = {
        cursor: "move"
        , opacity: 0.6
        , helper: "clone"
        , appendTo: "#primary-panel"
        , revert: "invalid"
        , revertDuration: 200
        , zIndex : 1000
        , containment: "#primary-panel"
        , start: dragStart
        , stop: dragStop
    }
    // droppable options
    , dropOpts = {

    }
    , $el = $("#timetable")
    , $grid = $("#table-grid"), $gridTr, $gridTd, $gridWidth
    , $slot = $("#table-slot")
    // local variables
    , weekDays = { "MONDAY" : 0, "TUESDAY" : 1, "WEDNESDAY" : 2, "THURSDAY" : 3, "FRIDAY": 4 }
    , types = { "lectures" : "(L)", "tutorials" : "(T)", "labs" : "(Lab)" };

    // create droppable slots
    var createDroppableSlot = function(code, type, klass) {
        var key, info, top, left, width, $div; 
      //var $width = $tbody[0].offsetWidth;
        // cache $grid related DOM if not defined
        $gridTr = $gridTr || $grid.find("tbody tr");
        $gridTd = $gridTd || $gridTr.find("td");
        $gridWidth = $gridWidth || $gridTr[0].offsetWidth;
        // detach $slot to append slot
        $slot.detach();

        // allocate klass to $slot
        for (key in klass) {
            info = key.split("-"); // key is in format: "MONDAY-0900-1000"
            // set top, according to its weekDay
            top = $gridTr[weekDays[info[0]]].offsetTop + 2;
            // set left and width, according to start and end time
            left = $gridTd[getTimeIndex(info[1])].offsetLeft + 1;
            width = $gridTd[getTimeIndex(info[2])].offsetLeft - left;
            // convert left and width to percentage
            left = (left / $gridWidth) * 100 + "%";
            width = (width / $gridWidth) * 100 + "%";
            // create the div to hold this slot
            $div = $("<div>").addClass("bar temp-slot " + type)
                .text(code + " " + types[type])
                .css({"top" : top, "left" : left, "width" : width})
                .droppable(dropOpts);
            // append div to slot
            $div.appendTo($slot);
        }
        // put $slot back
        $slot.appendTo($el);
    };

    // TODO: refactoring
    var dropOpts = {
        activeClass: "bar-active"
        , hoverClass: "bar-hover"
        , drop: function(event, ui) {
            ui.draggable.removeClass("draggable");
           // window.setTimeout(function() {
           //     ui.draggable("destroy");
           // }, 1000);
            $(this).css("background-color", "grey").removeClass("temp-slot");
            //$(this).draggable({
            //    cursor: "move"
            //    , opacity: 0.6
            //    , revert: "invalid"
            //    //, start: dragEvent(module1)
            //    , stop: function() {
            //        $("#events").find(".temp-slot").remove();
            //    }
            //});
            $slot.find(".temp-slot").remove();
        }
    };

    function getTimeIndex(t) {
        t = parseInt(t, 10);
        return (Math.floor(t / 100) - 8) * 2 + 1 + (t % 100 ? 1 : 0) ;
    }


    /* PLUGIN CLASS DEFINITION
     * ======================================== */

    function DragDrop(element, options) {
        this.elem = element;
        this.options = $.extend({}, dragOpts, options);

        this.init();
    }

    DragDrop.fn = DragDrop.prototype;

    DragDrop.fn.init = function() {
        var $elem = $(this.elem);

        $elem.on("mouseenter", ".draggable", function() {
            var $this = $(this);

            console.log("dragdrop here");
        });
    };

    function dragStart(event, ui) {
        //var $this = $(this)
//        , mod = $this.parents(".module").data("module")
//        , type = $this.attr("id").split("-")[1];
//
        //plannerView.createDroppableSlot(mod.get("code"), type, mod.get(type));
    }

    function dragStop(event, ui) {
        $(".temp-slot").remove();
    }

    /* PLUGIN DEFINITION
    * ======================================== */

    $.fn.dragdrop = function(options) {
        return this.each(function () {
            if (!$.data(this, "DragDrop")) {
                $.data(this, "DragDrop", new DragDrop(this, options));
            }
        });
    };

})(jQuery);
