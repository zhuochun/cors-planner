/* ========================================
 * CORS Planner - Utils Tests
 *
 * Author: Wang Zhuochun
 * Last Edit: 22/Jul/2012 07:59 PM
 * ========================================
 * <License>
 * ======================================== */

define(function(require, exports) {

    "use strict";
    /*jshint browser:true, jquery:true, laxcomma:true, maxerr:50*/
    /*globals describe, xdescribe, it, xit, expect, beforeEach, afterEach*/

    var helper = require("util/helper")
      , colors = require("helper/colors");

/* Test Helper Util
 * ======================================== */
    describe("util/Helper", function() {
        it("can get the semester accordingly", function() {
            // Change it manually as time goes
            var current = "2012/2013", sem = 1
            , fromHelper = helper.getSemester();

            expect(fromHelper.acadYear).toEqual(current);
            expect(fromHelper.semester).toEqual(sem);
        });
    });

/* Test Colors Helper
 * ======================================== */
    describe("helper/colors", function() {
        it("has 0 colors used at the beginning", function() {
            expect(colors.used()).toEqual(0);
        });

        it("can retrieve colors", function() {
            expect(colors.get()).toEqual("#00CC00");
            expect(colors.used()).toEqual(1);
            expect(colors.get()).toEqual("#FFFF00");
            expect(colors.used()).toEqual(2);
        });

        it("can retrieve colors passed in and increment index", function() {
            expect(colors.get("#00CC00")).toEqual("#00CC00");
            expect(colors.used()).toEqual(3);
        });

        it("can retrieve colors in loop", function() {
            expect(colors.used()).toEqual(3);
        
            var length = colors.length();

            for (var i = 4; i < length; i++) {
                colors.get();
            }

            expect(colors.get()).toEqual("#CD0074");
        });
    });

});
