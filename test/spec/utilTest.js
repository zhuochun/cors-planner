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
            expect(colors.get()).toEqual("forestgreen");
            expect(colors.used()).toEqual(1);
            expect(colors.get()).toEqual("royalblue");
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
