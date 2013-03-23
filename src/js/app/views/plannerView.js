/* ========================================
 * CORS Planner - Planner View
 *
 * Timetable Planner As All
 *
 * Author: Wang Zhuochun
 * Last Edit: 23/Mar/2013 02:07 AM
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
        var classNo = slot.classNo, slots = mod.get("lessons")[type], key;

        for (key in slots) {
            if (slots.hasOwnProperty(key) && key !== classNo) {
                allocate(slots[key], type, mod, true); // droppable = true
            }
        }
    });

    // allocate a single slot and its section slot
    $.subscribe("grid:module:allocate", function(e, slot, type, mod) {
        _allocateSlot(slot, type, mod);
    });

    // allocate a single slot and its section slot
    function _allocateSlot(slot, type, mod) {
        var classNo = slot.classNo, slots = mod.get("lessons")[type][classNo];

        // allocate and mark the classNo allocated
        allocate(slots, type, mod);
        mod.allocate(type, classNo);
    }

    // re-allocate a module's slots
    $.subscribe("grid:module:reallocate", function(e, mod) {
        var type, lessons = mod.get("lessons"), classNo;

        for (type in lessons) {
            if (lessons.hasOwnProperty(type)) {
                classNo = mod.allocated(type);
                
                if (classNo) {
                    _allocateSlot(lessons[type][classNo][0], type, mod);
                }
            }
        }
    });

    // subscribe to module add event
    $.subscribe(planner.list.modules + ":addOne", function(e, mod) {
        if (!mod.is("visible")) { return; }

        var type, lessons = mod.get("lessons"), succAllocated, klasses, key;// allocated, types = ["lectures", "tutorials", "labs"];

        for (type in lessons) {
            if (lessons.hasOwnProperty(type)) {
                if (mod.allocated(type)) {
                    _allocateSlot(lessons[type][mod.allocated(type)][0], type, mod);
                } else {
                    succAllocated = false;

                    // try to allocate any of the klass in an empty slot
                    klasses = lessons[type];

                    for (key in klasses) {
                        if (klasses.hasOwnProperty(key) && canAllocate(klasses[key])) {
                            // allocate and mark the classNo allocated
                            allocate(klasses[key], type, mod);
                            mod.allocate(type, key);
                            // next type
                            succAllocated = true;
                            break;
                        }
                    }

                    if (!succAllocated) {
                        key = Object.keys(klasses)[0];
                        // force allocate it, with a new row created
                        allocate(klasses[key], type, mod);
                        // make the classNo allocated
                        mod.allocate(type, key);
                    }
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
            // can be allocated to the 1st row only
            if (weekdays[klass[i].weekDay].hasEmptySlots(offset, span) !== 0) {
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
