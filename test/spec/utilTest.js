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

    var helper = require("util/helper")
      , colors = require("helper/colors");

/* Test Global
 * ======================================== */
    describe("app/global", function() {
        require("app/global");

        it("can set item and publish an app wide message", function() {
            var messages = 0;
            $.subscribe("app:hello", function() { messages += 1; });
            $.subscribe("app:world", function() { messages += 1; });

            planner.set("hello", "wah");
            expect(messages).toEqual(1);

            planner.set("hello", "yah");
            expect(messages).toEqual(2);

            planner.set("world", "mie");
            expect(messages).toEqual(3);
        });

        it("can get planner item", function() {
            planner.set("hello", "yah");
            expect(planner.get("hello")).toEqual("yah");

            planner.set("world", "mie");
            expect(planner.get("world")).toEqual("mie");
        });

        it("can set user key-value data and publish an app wide message", function() {
            var messages = 0;
            $.subscribe("app:user:hello", function() { messages += 1; });
            $.subscribe("app:user:world", function() { messages += 1; });

            planner.user.set("hello", null);
            expect(messages).toEqual(1);
            planner.user.set("hello", null);
            expect(messages).toEqual(2);
            planner.user.set("world", null);
            expect(messages).toEqual(3);
        });

        it("can set user key-pairs data and publish an app wide message", function() {
            var messages = 0;
            $.subscribe("app:user:hello", function() { messages += 1; });
            $.subscribe("app:user:world", function() { messages += 1; });

            planner.user.set({ "hello" : null, "world" : null });
            expect(messages).toEqual(2);
        });

        it("can get user data", function() {
            planner.user.set({ "hello" : "wah", "world" : "mie" });
            expect(planner.user.get("hello")).toEqual("wah");
            expect(planner.user.get("world")).toEqual("mie");
            planner.user.set("world", null);
            expect(planner.user.get("world")).toBeNull();
        });

    });

/* Test Helper Util
 * ======================================== */
    describe("util/Helper", function() {
        it("can get the semester accordingly", function() {
            var cur_year = "2011/2012"
              , next_year = "2012/2013"
              , getSem = helper.getSemester, sem;

            // 2011/2012 Sem 2
            sem = getSem(new Date("Jan 01 2012 11:22:57 GMT+0800"));
            expect(sem.acadYear).toEqual(cur_year);
            expect(sem.semester).toEqual(2);
            // 2011/2012 Sem 2
            sem = getSem(new Date("Jul 29 2012 11:22:57 GMT+0800"));
            expect(sem.acadYear).toEqual(cur_year);
            expect(sem.semester).toEqual(2);
            // 2012/2013 Sem 1
            sem = getSem(new Date("Aug 01 2012 11:22:57 GMT+0800"));
            expect(sem.acadYear).toEqual(next_year);
            expect(sem.semester).toEqual(1);
            // 2012/2013 Sem 1
            sem = getSem(new Date("Nov 28 2012 11:22:57 GMT+0800"));
            expect(sem.acadYear).toEqual(next_year);
            expect(sem.semester).toEqual(1);
            // 2012/2013 Sem 2
            sem = getSem(new Date("Dec 01 2012 11:22:57 GMT+0800"));
            expect(sem.acadYear).toEqual(next_year);
            expect(sem.semester).toEqual(2);
            // 2012/2013 Sem 2
            sem = getSem(new Date("Jan 03 2013 11:22:57 GMT+0800"));
            expect(sem.acadYear).toEqual(next_year);
            expect(sem.semester).toEqual(2);
        });
    });

/* Test Colors Helper
 * ======================================== */
    describe("helper/colors", function() {
        it("has 0 colors used at the beginning", function() {
            expect(colors.used()).toEqual(0);
        });

        it("can retrieve colors", function() {
            expect(colors.get()).toEqual("forestgreen");
            expect(colors.used()).toEqual(1);
            expect(colors.get()).toEqual("orangered");
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

            expect(colors.get()).toEqual("midnightblue");
        });
    });

});
