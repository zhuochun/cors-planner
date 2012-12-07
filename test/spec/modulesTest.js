/* ========================================
 * CORS Planner - Modules modal Tests
 *
 * Author: Wang Zhuochun
 * Last Edit: 29/Jul/2012 12:58 AM
 * ========================================
 * <License>
 * ======================================== */

define(function(require, exports) {

    "use strict";
    /*jshint browser:true, jquery:true, laxcomma:true, maxerr:50*/
    /*globals describe, xdescribe, it, xit, expect, beforeEach, afterEach*/

/* Test Modules model
 * ======================================== */
    describe("model ModuleList", function() {

        var Module = require("model/module")
        , ModuleList = require("model/modules")
        // include JSON test data
        , rawCS1020 = require("json!testData/cs1020.json")
        , modACC1002 = require("json!testData/acc1002parsed.json")
        , modCS1020 = require("json!testData/cs1020parsed.json")
        , acc1002 = new Module(modACC1002)
        , cs1020 = new Module(modCS1020);

        it("is an empty list at creation", function() {
            var list = new ModuleList("testList");

            expect(list.length()).toEqual(0);
            expect(list.options.mute).toBeFalsy();
            expect(list.options.prefix).toBe("testList:");

            var list2 = new ModuleList("testList2", { mute : true });

            expect(list2.length()).toEqual(0);
            expect(list2.options.mute).toBeTruthy();
            expect(list2.options.prefix).toBe("testList2:");
        });

        it("can add a module using module code", function() {
            // overwrite JSON so it return the defined result for testing
            var getJSON = $.getJSON;
            $.getJSON = function(query, callback) {
                callback(rawCS1020);
            };

            // some subscribe to test it emits messages correctly
            var listSub = 0, list2Sub = 0;
            $.subscribe("testList:addOne", function(e, mod) {
                listSub++;
            });

            $.subscribe("testList2:addOne", function(e, mod) {
                list2Sub++;
            });

            // new list
            var list = new ModuleList("testList");
            // add using module code
            list.add("CS1020");
            expect(list.length()).toEqual(1);
            expect(listSub).toEqual(1);

            var list2 = new ModuleList("testList2");
            // add using module code but muted
            list2.add("CS1020", { mute : true });
            expect(list2.length()).toEqual(1);
            expect(list2Sub).toEqual(0);

            // write back the getJSON to jQuery
            $.getJSON = getJSON;
        });

        it("can add a module using Module instance", function() {
            // some subscribe to test it emits messages correctly
            var listSub = 0, list2Sub = 0;
            $.subscribe("testList:addOne", function(e, mod) {
                listSub++;
            });

            $.subscribe("testList2:addOne", function(e, mod) {
                list2Sub++;
            });

            // new list
            var list = new ModuleList("testList");
            // add one
            list.add(cs1020);
            expect(list.length()).toEqual(1);
            expect(listSub).toEqual(1);
            // add another
            list.add(acc1002);
            expect(list.length()).toEqual(2);
            expect(listSub).toEqual(2);

            var list2 = new ModuleList("testList2");
            // add one
            list2.add(cs1020, { mute : true });
            expect(list2.length()).toEqual(1);
            expect(list2Sub).toEqual(0);
            // add another
            list2.add(acc1002, { mute : true });
            expect(list2.length()).toEqual(2);
            expect(list2Sub).toEqual(0);
        });

        it("does not allow duplicated Module to be added", function() {
            var list, msg, getJSON = $.getJSON;
            // overwrite JSON so it return the defined result for testing
            $.getJSON = function(query, callback) {
                callback(rawCS1020);
            };

            // subscribe to add failed
            $.subscribe("testList:addOne:duplicated", function(e, m) {
                msg = (typeof m === "string") ? m : m.get("code");
            });

            list = new ModuleList("testList");
            // add one
            list.add(cs1020);
            expect(list.length()).toEqual(1);
            // add another
            list.add(acc1002);
            expect(list.length()).toEqual(2);
            // add duplicated using instance
            list.add(acc1002);
            expect(list.length()).toEqual(2);
            expect(msg).toEqual("ACC1002");
            // add duplicated using module code
            list.add("cs1020");
            expect(list.length()).toEqual(2);
            expect(msg).toEqual("CS1020");

            // write back
            $.getJSON = getJSON;
        });

        it("can find the index of a module in the list", function() {
            var list = new ModuleList("testList");

            // add one module on list
            list.add(acc1002);

            expect(list.length()).toEqual(1);
            // find using module code
            expect(list.find("acc1002")).toEqual(0);
            // find some module code that does not exist
            expect(list.find("cs1020")).toEqual(-1);
            expect(list.find("cg1413")).toEqual(-1);
            // find using Module instance
            expect(list.find(acc1002)).toEqual(0);
            // find some module instance does not exist
            expect(list.find(cs1020)).toEqual(-1);

            // add another module on list
            list.add(cs1020);

            expect(list.length()).toEqual(2);
            // check whether it is on list now
            expect(list.find("cs1020")).toEqual(1);
            expect(list.find(cs1020)).toEqual(1);
        });

        it("can get a module using index or module code or Module instance", function() {
            var list = new ModuleList("testList");

            // add one and get it
            list.add(cs1020);
            expect(list.get("CS1020")).toEqual(cs1020);
            expect(list.get("cs1020")).toEqual(cs1020);
            expect(list.get(cs1020)).toEqual(cs1020);
            expect(list.get(0)).toEqual(cs1020);

            // get some thing that does not exist
            expect(list.get(2)).toBeNull();
            expect(list.get(3)).toBeNull();
            expect(list.get("acc1002")).toBeNull();
            expect(list.get(acc1002)).toBeNull();

            // add another and try get it
            list.add(acc1002);
            expect(list.get("ACC1002")).toEqual(acc1002);
            expect(list.get("acc1002")).toEqual(acc1002);
            expect(list.get(acc1002)).toEqual(acc1002);
            expect(list.get(1)).toEqual(acc1002);
        });

        it("can remove a module from list using index or module code or Module instance", function() {
            var list = new ModuleList("testList");

            // remove using index
            list.add(cs1020);
            // check size
            expect(list.length()).toEqual(1);
            // remove it
            expect(list.remove(0)).toEqual(cs1020);
            // check size
            expect(list.length()).toEqual(0);
            // remove something not exists
            expect(list.remove(0)).toBeNull();
            expect(list.remove(1)).toBeNull();

            // remove using module code
            list.add(cs1020);
            // check size
            expect(list.length()).toEqual(1);
            // remove it
            expect(list.remove("cs1020")).toEqual(cs1020);
            // check size
            expect(list.length()).toEqual(0);
            // remove something not exists
            expect(list.remove("cs1020")).toBeNull();
            expect(list.remove("acc1002")).toBeNull();

            // remove using Module instance
            list.add(cs1020);
            // check size
            expect(list.length()).toEqual(1);
            // remove it
            expect(list.remove(cs1020)).toEqual(cs1020);
            // check size
            expect(list.length()).toEqual(0);
            // remove something not exists
            expect(list.remove(cs1020)).toBeNull();
            expect(list.remove(acc1002)).toBeNull();
        });

        it("can clean up the list", function() {
            var list = new ModuleList("testList");
            // add modules
            list.add(acc1002);
            list.add(cs1020);
            // check size
            expect(list.length()).toEqual(2);
            // clean
            list.clean();
            // check size
            expect(list.length()).toEqual(0);
        });

        it("can check duplicated data in modules", function() {
            var list = new ModuleList("testList");
            // add modules
            list.add(acc1002);
            list.add(cs1020);
            // check
            expect(list.duplicated("examDate", "AAA")).toEqual(-1);
            expect(list.duplicated("examDate", "03-12-2012 EVENING")).toEqual(0);
            expect(list.duplicated("examDate", "04-12-2012 EVENING")).toEqual(1);

            // test publish
            var message = 0;

            $.subscribe("testList:duplicatedExamDate", function(e, mod, modAdd) {
                message += 1;
                expect(mod.get("code")).toEqual("CS1020");
                expect(modAdd.get("code")).toEqual("CS1020TEST");
            });

            var cs1020test = $.extend(true, {}, modCS1020, {code : "CS1020TEST"});

            list.add(new Module(cs1020test));

            expect(message).toEqual(1);
        });

    });
    
});
