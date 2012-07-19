/* ========================================
 * CORS Planner - Module Class modal Tests
 *
 * Author: Wang Zhuochun
 * Last Edit: 19/Jul/2012 03:48 PM
 * ========================================
 * <License>
 * ======================================== */

define(function(require, exports) {

    "use strict";
    /*jshint browser:true, jquery:true, laxcomma:true, maxerr:50*/
    /*globals describe, xdescribe, it, xit, expect, beforeEach, afterEach*/

/* Test Module class
 * ======================================== */
    describe("Module Class modal", function() {

        var Module = require("modal/module")
        // include JSON test data
        , modACC1002 = require("json!testData/acc1002parsed.json")
        , modCS1020 = require("json!testData/cs1020parsed.json");

        it("will create a Module class", function() {
            var acc1002 = new Module(modACC1002);
            expect(acc1002).toBeDefined();

            var cs1020 = new Module(modCS1020);
            expect(cs1020).toBeDefined();
        });

        it("data can be retrieved using get()", function() {
            var acc1002 = new Module(modACC1002);

            expect(acc1002.data.code).toEqual("ACC1002");
            expect(acc1002.get("code")).toEqual("ACC1002");
        });

        it("status can be set using set()", function() {
            var cs1020 = new Module(modCS1020);

            cs1020.set("test-status", "set");
            expect(cs1020.status["test-status"]).toEqual("set");

            cs1020.set("test.status", "set");
            expect(cs1020.status.test.status).toEqual("set");
        });

        it("can count the number of its lect/tut/labs", function() {
            var cs1020 = new Module(modCS1020)
            , acc1002 = new Module(modACC1002);

            // lowercase
            expect(cs1020.count("lecture")).toEqual(1);
            expect(cs1020.count("tutorial")).toEqual(8);
            expect(cs1020.count("lab")).toEqual(8);
            // uppercase
            expect(acc1002.count("LECTURE")).toEqual(1);
            expect(acc1002.count("TUTORIAL")).toEqual(13);
            expect(acc1002.count("LAB")).toEqual(0);
        });

        it("only return TRUE is another module has the same code", function() {
            var acc1002 = new Module(modACC1002);

            expect(acc1002.isSame(new Module({ code : "ACC1002" }))).toBe(true);
            expect(acc1002.isSame(new Module({ code : "CS1020" }))).toBe(false);
        });

        it("only return TRUE is code string is the same", function() {
            var cs1020 = new Module(modCS1020);

            expect(cs1020.isSame("CS1020")).toBe(true);
            expect(cs1020.isSame("cs1020")).toBe(true);
            expect(cs1020.isSame("ACC1002")).toBe(false);
            expect(cs1020.isSame("acc1002")).toBe(false);
        });

        it("can be re-used using toJSON()", function() {
            var cs1020 = new Module(modCS1020);

            cs1020.set("hello", "world");

            var jsonObj = JSON.parse(cs1020.toJSON());
            var newCS1020 = new Module(jsonObj.data, jsonObj.status);

            expect(cs1020).toEqual(newCS1020);
            expect(newCS1020.status.hello).toEqual("world");
        });

        it("can find allocated lect/tut/labs and set class to be allocated", function() {
            var cs1020 = new Module(modCS1020);
            // check initial condition
            expect(cs1020.isAllocated("lecture", 1)).toBe(false);
            expect(cs1020.isAllocated("tutorial", 7)).toBe(false);
            expect(cs1020.isAllocated("lab", 3)).toBe(false);
            // allocate lect/tutorial/lab
            cs1020.allocate("lecture", 1);
            cs1020.allocate("tutorial", 7);
            cs1020.allocate("lab", 3);
            // go inside and check
            expect(cs1020.status.allocated.lecture).toBe(1);
            expect(cs1020.status.allocated.tutorial).toBe(7);
            expect(cs1020.status.allocated.lab).toBe(3);
            // use api provided to check
            expect(cs1020.isAllocated("lecture", 1)).toBe(true);
            expect(cs1020.isAllocated("lecture", "1")).toBe(true);
            expect(cs1020.isAllocated("tutorial", 7)).toBe(true);
            expect(cs1020.isAllocated("tutorial", "7")).toBe(true);
            expect(cs1020.isAllocated("lab", 3)).toBe(true);
            expect(cs1020.isAllocated("lab", "3")).toBe(true);
            expect(cs1020.isAllocated("tutorial", 3)).toBe(false);
            expect(cs1020.isAllocated("tutorial", "3")).toBe(false);
        });

    });

});
