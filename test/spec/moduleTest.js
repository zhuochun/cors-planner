/* ========================================
 * CORS Planner - Module Class modal Tests
 *
 * Author: Wang Zhuochun
 * Last Edit: 23/Jul/2012 09:21 PM
 * ========================================
 * <License>
 * ======================================== */

define(function(require, exports) {

    "use strict";
    /*jshint browser:true, jquery:true, laxcomma:true, maxerr:50*/
    /*globals describe, xdescribe, it, xit, expect, beforeEach, afterEach*/

/* Test Module class
 * ======================================== */
    describe("model Module", function() {

        var Module = require("model/module")
        // include JSON test data
        , modACC1002 = require("json!testData/acc1002parsed.json")
        , modCS1020 = require("json!testData/cs1020parsed.json");

        it("will throw error if null data provided", function() {
            var aMod = function() { return new Module(); }
              , bMod = function() { return new Module(null); };

            expect(aMod).toThrow();
        });

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

        it("will assign color and alter format to new Module created", function() {
            var acc1002 = new Module(modACC1002);
            expect(acc1002.get("color")).toEqual("forestgreen");
            expect(acc1002.get("alterFormat")).toBeTruthy();

            var cs1020 = new Module(modCS1020);
            expect(cs1020.get("color")).toEqual("orangered");
            expect(cs1020.get("alterFormat")).toBeTruthy();
            expect(cs1020.get("hasLecture")).toBeTruthy();
        });

        it("status can be set using set()", function() {
            var cs1020 = new Module(modCS1020);

            cs1020.set("test-status", "set");
            expect(cs1020.status["test-status"]).toEqual("set");

            cs1020.set("test.status", "set");
            expect(cs1020.status.test.status).toEqual("set");

            cs1020.set("list", "listTest");
            expect(cs1020.status.list).toEqual("listTest");
        });

        it("status can be checked using is()", function() {
            var cs1020 = new Module(modCS1020);

            cs1020.set("test-status", "set");
            expect(cs1020.is("test-status", "set")).toBeTruthy();
            expect(cs1020.is("test-status", "notset")).toBeFalsy();

            cs1020.set("test.status", "set");
            expect(cs1020.is("test.status", "set")).toBeTruthy();

            cs1020.set("list.name.aa.bb", "listTest");
            expect(cs1020.is("list.name.aa.bb", "listTest")).toBeTruthy();
        });

        it("can count the number of its lect/tut/labs", function() {
            var cs1020 = new Module(modCS1020)
            , acc1002 = new Module(modACC1002);

            // lowercase
            expect(cs1020.count("lectures")).toEqual(1);
            expect(cs1020.count("tutorials")).toEqual(8);
            expect(cs1020.count("labs")).toEqual(8);
            // uppercase
            expect(acc1002.count("LECTURES")).toEqual(1);
            expect(acc1002.count("TUTORIALS")).toEqual(13);
            expect(acc1002.count("LABS")).toEqual(0);
        });

        it("can detect whether another Module instance is the same (using Module code)", function() {
            var acc1002 = new Module(modACC1002);

            expect(acc1002.isSame(new Module({ code : "ACC1002" }))).toBe(true);
            expect(acc1002.isSame(new Module({ code : "CS1020" }))).toBe(false);
        });

        it("can detect whether the module code is the same as the instance", function() {
            var cs1020 = new Module(modCS1020);

            expect(cs1020.isSame("CS1020")).toBe(true);
            expect(cs1020.isSame("cs1020")).toBe(true);
            expect(cs1020.isSame("ACC1002")).toBe(false);
            expect(cs1020.isSame("acc1002")).toBe(false);
        });

        it("can be re-used using toJSON()", function() {
            var cs1020 = new Module(modCS1020);

            cs1020.set("hello", "world");

            var jsonObj = JSON.parse(JSON.stringify(cs1020.toJSON()));
            var newCS1020 = new Module(jsonObj.data, jsonObj.status);

            expect(cs1020).toEqual(newCS1020);
            expect(newCS1020.status.hello).toEqual("world");
        });

        it("will initialize allocated classes to null", function() {
            var cs1020 = new Module(modCS1020)
              , acc1002 = new Module(modACC1002);
               
            expect(cs1020.allocated("lectures")).toBe(null);
            expect(cs1020.allocated("tutorials")).toBe(null);
            expect(cs1020.allocated("labs")).toBe(null);

            expect(acc1002.allocated("lectures")).toBe(null);
            expect(acc1002.allocated("tutorials")).toBe(null);
            expect(acc1002.allocated("labs")).toBe(null);
        });

        it("can allocate and find allocated classes", function() {
            var cs1020 = new Module(modCS1020)
              , acc1002 = new Module(modACC1002);
               
            // allocate lect/tutorial/lab
            cs1020.allocate("lectures", 1);
            cs1020.allocate("tutorials", 7);
            cs1020.allocate("labs", 3);
            // go inside and check
            expect(cs1020.status.allocated.lectures).toBe(1);
            expect(cs1020.status.allocated.tutorials).toBe(7);
            expect(cs1020.status.allocated.labs).toBe(3);
            // use api provided to check
            expect(cs1020.allocated("lectures")).toBe(1);
            expect(cs1020.allocated("tutorials")).toBe(7);
            expect(cs1020.allocated("labs")).toBe(3);
            // check acc1002 is not affected
            expect(acc1002.allocated("lectures")).toBe(null);
            expect(acc1002.allocated("tutorials")).toBe(null);
            expect(acc1002.allocated("labs")).toBe(null);
        });

    });

});
