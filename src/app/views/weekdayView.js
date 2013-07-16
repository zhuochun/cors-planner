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
    // slot template
    var template = require("hgn!template/timeSlot");

    /* WEEKDAY CLASS DEFINITION
     * ======================================== */

    // Weekday Class
    function Weekday(name) {
        this.name = name;
        // cache elem
        this.$elem = $("#" + this.name.toLowerCase());
        // init rows
        this.$rows = [];
        // cache the rows
        var i, len, rows = this.$elem.find(".row-fluid");
        // jquery the rows
        for (i = 0, len = rows.length; i < len; i++) {
            this.$rows.push($(rows[i]));
        }
        // init occupied slots
        this.occupied  = [];
        this.$occupied = this.$rows[0];
        // listen toggle event
        this.$occupied.on("click", ".span1", $.proxy(this.toggleOccupiedSpan, this));
        // subscribe some events
        $.subscribe("grid:rows:clearEmpty", $.proxy(this.compressRows, this));
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
        type = lectures/tutorials/labs;
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
          , shortType: getShortType(slot.type)
          , index: idx
          , offset: offset
          , span: span
          , slot: slot
          , data: mod.data
          , module: mod
          , droppable: droppable || false
        };

        this.$rows[row].append(createSlot(context));

        // special to saturday
        if (this.$elem.hasClass("hidden")) {
            this.$elem.removeClass("hidden");
            // resize is necessary
            $(window).resize();
        }
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

    Weekday.fn.compressRows = function() {
        // do a quick clean up
        this.removeEmptyRows();

        // merge rows bottom up
        if (this.$rows[0].find(".slot, .occupied").length > 0) {
            this.mergeRows();
        } else if (this.name === "SATURDAY") {
            this.$elem.addClass("hidden");
        }

        $(window).resize();
    };

    Weekday.fn.removeEmptyRows = function() {
        var i, $slots;

        // remove empty rows with index > 1
        for (i = this.$rows.length - 1; i > 1; i--) {
            if (this.$rows[i].find(".slot").length === 0) {
                this.$rows[i].remove();
                this.$rows.splice(i, 1);
            }
        }

        // if 1st row is empty and no occupied grid
        if (this.$rows[0].find(".slot, .occupied").length === 0) {
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
    };

    // check whether the rows up to the limit have empty slot at {offset, span}
    // return the row number, otherwise -1
    Weekday.fn._hasEmptySlots = function(offset, span, limit) {
        var rowIsEmpty, i, j, slotLen, slots, $slot;

        for (i = 0; i < limit; i++) {
            rowIsEmpty = true;

            // should not overlap with any slots added
            if (isSlotsOverlop(this.$rows[i].find(".slot"), offset, span)) {
                continue;
            }
            // should not overlap with any slots marked occupied
            if (i === 0 && isSlotsOverlop(this.$occupied.find(".occupied"), offset, span)) {
                continue;
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

    // on span click event
    Weekday.fn.toggleOccupiedSpan = function(e) {
        var $this = $(e.currentTarget);

        if (!$this.hasClass("slot")) {
            this._toggleOccupiedGrid($this.find(".grid"), $this.index() + 1);
        }
    };

    // toggle a grid between occupied or not
    Weekday.fn._toggleOccupiedGrid = function($grid, offset) {
        $grid.toggleClass("occupied");

        if ($grid.hasClass("occupied")) {
            // associate some general data
            $grid.data("offset", offset).data("span", 1);
        } else if (isSlotsOverlop(this.$rows[1].find(".slot"), $this.index() + 1, 1)) {
            // if 2nd row has slot overlap, do a compress
            this.compressRows();
        }
    };

    // toggle slots[] between occupied or not
    Weekday.fn.addOccupiedSlots = function(slots) {
        var i, idx, $grids = this.$occupied.find(".grid");

        for (i = 0; (idx = slots[i]); i++) {
            this._toggleOccupiedGrid($($grids[idx]), idx);
        }
    };

    // save occupied slots to object
    Weekday.fn.getOccupiedSlots = function() {
        var result = {}, i, grid, $grids = this.$occupied.find(".occupied");
        // create result
        result[this.name] = [];
        // push grids
        for (i = 0; (grid = $grids[i]); i++) {
            result[this.name].push($(grid).data("offset"));
        }
    };

    /* HELPERS
     * ======================================== */

    // check slot with offset and span overlaps
    // any slot in slots
    function isSlotsOverlop(slots, offset, span) {
        var i, len = slots.length, $slot;

        for (i = 0; i < len; i++) {
            $slot = $(slots[i]);

            if (isSlotOverlap($slot.data("offset"), $slot.data("span"), offset, span)) {
                return true;
            }
        }
    }

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

    function getShortType(type) {
        var name = type.toUpperCase().split("-");

        if (name[0].indexOf("LAB") >= 0) {
            return "(LB)";
        }

        if (name.length === 3) {
            return "(" + name[0].charAt(0) + name[2].charAt(0) + ")";
        } else if (name.length === 2) {
            return "(" + name[0].charAt(0) + name[1].charAt(0) + ")";
        } else {
            return "(" + name[0].charAt(0) + ")";
        }
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
