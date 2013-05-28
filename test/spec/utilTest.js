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
    /*globals planner, describe, xdescribe, it, xit, expect, beforeEach, afterEach*/

/* Test Global
 * ======================================== */

    describe("app/global", function() {
        require("app/global");

        it("is globally accessible", function() {
            expect(planner).not.toBe(null);
        });

        it("has setting publish", function() {
            $.subscribe("app:newKey", function(e, k) {
                expect(k).toEqual("newKeyContent");
            });

            planner.set("newKey", "newKeyContent");
        });
    });

/* Test Helper Util
 * ======================================== */

    describe("util/Helper", function() {
        var helper = require("util/helper");

        var cur_year = "2011/2012"
          , next_year = "2012/2013"
          , getSem = helper.getSemester, sem;

        it("can get year + sem 1 correctly", function() {
            // 2012/2013 Sem 1
            sem = getSem(new Date("Jul 13 2012 11:22:57 GMT+0800"));
            expect(sem.acadYear).toEqual(next_year);
            expect(sem.semester).toEqual(1);

            // 2012/2013 Sem 1
            sem = getSem(new Date("Aug 03 2012 11:22:57 GMT+0800"));
            expect(sem.acadYear).toEqual(next_year);
            expect(sem.semester).toEqual(1);

            // 2012/2013 Sem 1
            sem = getSem(new Date("Sep 11 2012 11:22:57 GMT+0800"));
            expect(sem.acadYear).toEqual(next_year);
            expect(sem.semester).toEqual(1);

            // 2012/2013 Sem 1
            sem = getSem(new Date("Nov 19 2012 11:22:57 GMT+0800"));
            expect(sem.acadYear).toEqual(next_year);
            expect(sem.semester).toEqual(1);
        });

        it("can get year + sem 2 correctly", function() {
            // 2011/2012 Sem 2
            sem = getSem(new Date("Jan 03 2012 11:22:57 GMT+0800"));
            expect(sem.acadYear).toEqual(cur_year);
            expect(sem.semester).toEqual(2);

            // 2011/2012 Sem 2
            sem = getSem(new Date("Jun 29 2012 11:22:57 GMT+0800"));
            expect(sem.acadYear).toEqual(cur_year);
            expect(sem.semester).toEqual(2);

            // 2012/2013 Sem 2 (End of Year)
            sem = getSem(new Date("Dec 03 2012 11:22:57 GMT+0800"));
            expect(sem.acadYear).toEqual(next_year);
            expect(sem.semester).toEqual(2);

            // 2012/2013 Sem 2 (Begin of Year)
            sem = getSem(new Date("Jan 03 2013 11:22:57 GMT+0800"));
            expect(sem.acadYear).toEqual(next_year);
            expect(sem.semester).toEqual(2);
        });
    });

/* Test Colors Helper
 * ======================================== */
 
    describe("helper/colors", function() {
        var colors = require("helper/colors");

        it("has 0 colors used at the beginning", function() {
            expect(colors.used()).toEqual(0);
        });

        it("can retrieve colors", function() {
            expect(colors.get()).toEqual("royalblue");
            expect(colors.used()).toEqual(1);
            expect(colors.get()).toEqual("orangered");
            expect(colors.used()).toEqual(2);
        });

        it("can retrieve colors in loop", function() {
            expect(colors.used()).toEqual(2);
        
            var length = colors.length();

            for (var i = 3; i < length; i++) {
                colors.get();
            }

            expect(colors.get()).toEqual("midnightblue");
        });
    });

});
