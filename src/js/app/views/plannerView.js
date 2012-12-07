/* ========================================
 * CORS Planner - Planner View
 *
 * Timetable Planner As All
 *
 * Author: Wang Zhuochun
 * Last Edit: 02/Dec/2012 04:57 PM
 * ========================================
 * <License>
 * ======================================== */

define(function(require, exports) {

    "use strict";
    /*jshint browser:true, jquery:true, laxcomma:true, maxerr:50*/
    /*global planner*/

	// get components
    var Weekday = require("view/weekdayView")
      , Util = require("util/helper")
      , weekdays = {};

    // initial timetable grids
    exports.init = function() {
        var i, len = planner.weekDays.length;

        for (i = 0; i < len; i++) {
            weekdays[planner.weekDays[i]] = new Weekday(planner.weekDays[i]);
        }
    };

    // allocate temporary droppable slot
    $.subscribe("grid:module:droppable", function(e, slot, type, mod) {
        var classNo = slot.classNo, slots = mod.get("_" + type), key;

        for (key in slots) {
            if (slots.hasOwnProperty(key) && key !== classNo) {
                allocate(slots[key], type, mod, true); // droppable = true
            }
        }
    });

    // allocate a single slot and its section slot
    $.subscribe("grid:module:allocate", function(e, slot, type, mod) {
        var classNo = slot.classNo, slots = mod.get("_" + type)[classNo];

        // allocate and mark the classNo allocated
        allocate(slots, type, mod);
        mod.allocate(type, classNo);
    });

    // subscribe to module add event
    $.subscribe(planner.list.modules + ":addOne", function(e, mod) {
        var klasses, i, len, key, allocated, types = ["lectures", "tutorials", "labs"];

        for (i = 0, len = types.length; i < len; i++) {
            if (mod.has(types[i])) {
                // initial allocate
                allocated = false;

                // try to allocate any of the klass in an empty slot
                klasses = mod.get("_" + types[i]);
                for (key in klasses) {
                    if (klasses.hasOwnProperty(key) && canAllocate(klasses[key])) {
                        // allocate and mark the classNo allocated
                        allocate(klasses[key], types[i], mod);
                        mod.allocate(types[i], key);
                        // next type
                        allocated = true;
                        break;
                    }
                }

                if (!allocated) {
                    key = Object.keys(klasses)[0];
                    // force allocate it, with a new row created
                    allocate(klasses[key], types[i], mod);
                    // make the classNo allocated
                    mod.allocate(klasses[key].classNo);
                }
            }
        }
    });

    // check wether the klass[...] can be allocated
    function canAllocate(klass) {
        var result, i, len, offset, span;

        // check all klass can be allocated
        result = true;
        for (i = 0, len = klass.length; i < len; i++) {
            offset = Util.getTimeIndex(klass[i].startTime);
            span = Util.getTimeIndex(klass[i].endTime) - offset;

            if (weekdays[klass[i].weekDay].hasEmptySlots(offset, span) == -1) {
                result = false;
                break;
            }
        }

        return result;
    }

    // allocate the klass[...]
    function allocate(klass, type, mod, droppable) {
        var i, len;

        for (i = 0, len = klass.length; i < len; i++) {
            weekdays[klass[i].weekDay].allocate(i, klass[i], type, mod, droppable);
        }
    }

});
