/* ========================================
 * CORS Planner - weekday
 *
 * a weekday grids
 *
 * Author: Wang Zhuochun
 * Last Edit: 02/Dec/2012 04:49 PM
 * ========================================
 * <License>
 * ======================================== */

define(function(require, exports) {

    "use strict";
    /*jshint jquery:true, laxcomma:true, browser:true, maxerr:50*/

    // require components
    require("helper/jquery.slot");
    // constants
    var TYPES = { "lectures" : "(L)", "tutorials" : "(T)", "labs" : "(Lab)" }
    // slot template
      , template = require("hgn!template/timeSlot");

    /* WEEKDAY CLASS DEFINITION
     * ======================================== */

    // Weekday Class
    function Weekday(name) {
        this.name = name.toLowerCase();
        // cache elem
        this.$elem = $("#" + this.name);
        // init rows
        this.$rows = [];
        var i, len, rows = this.$elem.find(".row-fluid");
        // jquery the rows
        for (i = 0, len = rows.length; i < len; i++) {
            this.$rows.push($(rows[i]));
        }
        // subscribe some events
        $.subscribe("grid:rows:clearEmpty", $.proxy(this.removeEmptyRows, this));
    }

    /* WEEKDAY CLASS METHODS
     * ======================================== */

    // Weekday Prototypes alias
    Weekday.fn = Weekday.prototype;

    /*
        slot = {
            "classNo": "A3",
            "type": "SECTIONAL TEACHING",
            "weekType": "EVERY WEEK",
            "weekDay": "THURSDAY",
            "startTime": "1400",
            "endTime": "1600",
            "room": "BIZ2-0303"
        };
        type = lecture/tutorial/lab;
        mod  = module
        droppable = true/false
    */
    Weekday.fn.allocate = function(idx, slot, type, mod, droppable) {
        var offset = getTimeIndex(slot.startTime)
          , span = getTimeIndex(slot.endTime) - offset
          , row = this.hasEmptySlots(offset, span);

        if (row === -1) {
            this.createNewRow();
            row = this.$rows.length - 1;
        }

        var context = {
            code: mod.get("code")
          , type: type
          , shortType: TYPES[type]
          , index: idx
          , offset: offset
          , span: span
          , slot: slot
          , data: mod.data
          , module: mod
          , droppable: droppable || false
        };

        this.$rows[row].append(createSlot(context));
    };

    Weekday.fn.createNewRow = function() {
        var newRow = this.$rows[1].clone();
        // clear unwanted row
        newRow.find(".slot").remove();
        // add it to rows
        this.$rows.push(newRow);
        // append it
        this.$elem.append(newRow);
        // trigger resize
        $(window).resize();
    };

    Weekday.fn.removeEmptyRows = function() {
        var i, $slots;

        for (i = this.$rows.length - 1; i > 1; i--) {
            if (this.$rows[i].find(".slot").length === 0) {
                this.$rows[i].remove();
                this.$rows.splice(i, 1);
            }
        }

        // if 1st row is empty
        if (this.$rows[0].find(".slot").length === 0) {
            // case 1: only 2 rows left, swap the slots in 1st/2nd row
            // case 2: > 2 rows, swap the slots in 1st/3rd row
            i = this.$rows.length === 2 ? 1 : 2;
            
            $slots = this.$rows[i].find(".slot").detach();
            this.$rows[0].append($slots);

            // remove the 3rd row
            if (i === 2) {
                this.$rows[2].remove();
                this.$rows.splice(i, 1);
            }
        }

        // if 2nd row is empty
        if (this.$rows[1].find(".slot").length === 0) {
            // case 1: only 2 rows left, do nothing
            // case 2: > 2 rows, swap the 3rd row (2)
            if (this.$rows.length > 2) {
                $slots = this.$rows[2].find(".slot").detach();
                this.$rows[1].append($slots);
                // remove the 3rd row
                this.$rows[2].remove();
                this.$rows.splice(2, 1);
            }
        }

        this.mergeRows();
    };

    Weekday.fn.mergeRows = function() {
        var i, j, moved, row, slots, $slot;

        for (i = this.$rows.length - 1; i > 0; i--) {
            slots = this.$rows[i].find(".slot");

            for (j = slots.length - 1, moved = 0; j >= 0; j--) {
                $slot = $(slots[j]);

                row = this._hasEmptySlots($slot.data("offset"), $slot.data("span"), i);
                if (row !== -1) {
                    $slot.detach();
                    this.$rows[row].append($slot);
                    moved++;
                }
            }

            if (moved !== 0 && i !== 1 && moved === slots.length) {
                this.$rows[i].remove();
                this.$rows.splice(i, 1);
            }
        }

        $(window).resize();
    };

    // check whether the rows up to the limit have empty slot at {offset, span}
    // return the row number, otherwise -1
    Weekday.fn._hasEmptySlots = function(offset, span, limit) {
        var rowIsEmpty, i, j, slotLen, slots, $slot;

        for (i = 0; i < limit; i++) {
            rowIsEmpty = true;

            slots = this.$rows[i].find(".slot");
            for (j = 0, slotLen = slots.length; j < slotLen; j++) {
                $slot = $(slots[j]);

                if (isSlotOverlap($slot.data("offset"), $slot.data("span"), offset, span)) {
                    rowIsEmpty = false;
                    break;
                }
            }

            if (rowIsEmpty) { return i; }
        }

        return -1;
    };

    // check whether the rows have empty slot at {offset, span}
    // return the row number, otherwise -1
    Weekday.fn.hasEmptySlots = function(offset, span) {
        return this._hasEmptySlots(offset, span, this.$rows.length);
    };

    /* HELPERS
     * ======================================== */

    // slot1 = offset, span
    // slot2 = _offset, _span
    // true if slot2 overlaps on slot1
    function isSlotOverlap(offset, span, _offset, _span) {
        var end = offset + span, _end = _offset + _span;

        // _offset is within slot1 endgth
        if (_offset >= offset && _offset < end) {
            return true;
        }
        
        // _span is within slot1 endgth
        if (_end > offset && _end <= end) {
            return true;
        }

        // slot1 is in slot2 endgth
        if (_offset <= offset && _end >= end) {
            return true;
        }

        return false;
    }

    function getTimeIndex(t) {
        t = parseInt(t, 10);
        return 2 + (Math.floor(t / 100) - 8) * 2 + (t % 100 ? 1 : 0) ;
    }

    /*
        var context = {
            "code": mod.get("code")
          , "type": type
          , "shortType": TYPES[type]
          , "index": idx
          , "offset": offset
          , "span": span
          , "slot": slot
          , "data": mod.data
          , "module": mod
          , "droppable": droppable || false
        };
     */
    function createSlot(context) {
        var $slot = $(template(context));

        $slot.slot(context);

        return $slot;
    }

    // exports the constructor
    return Weekday;

});
