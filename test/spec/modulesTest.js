/* ========================================
 * CORS Planner - Modules modal Tests
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

/* Test Modules modal
 * ======================================== */
    describe("Modules modal", function() {

        var Module = require("modal/module")
        , modList = require("modal/modules")
        // include JSON test data
        , modACC1002 = require("json!testData/acc1002parsed.json")
        , modCS1020 = require("json!testData/cs1020parsed.json")
        , acc1002 = new Module(modACC1002)
        , cs1020 = new Module(modCS1020);

        afterEach(function() {
            modList.clean();
        });

        it("will be an empty list at start", function() {
            expect(modList.getSize()).toEqual(0);
        });

        it("can add a module to list", function() {
            // add acc1002
            expect(modList.add(acc1002)).toBe(true);
            expect(modList.getSize()).toEqual(1);

            // add acc1002 again
            expect(modList.add(acc1002)).toBe(false);
            expect(modList.getSize()).toEqual(1);

            // add cs1020
            expect(modList.add(cs1020)).toBe(true);
            expect(modList.getSize()).toEqual(2);
        });

        it("can remove a module from list", function() {
            // add modules
            expect(modList.add(acc1002)).toBe(true);
            expect(modList.add(cs1020)).toBe(true);
            // check size
            expect(modList.getSize()).toEqual(2);
            // remove acc1002x (not exists)
            expect(modList.remove("acc1002x")).toBeNull();
            // remove acc1002 (exists)
            expect(modList.remove("acc1002").get("code")).toEqual("ACC1002");
            // check size again
            expect(modList.getSize()).toEqual(1);
            // remove acc1002 (not exists) again
            expect(modList.remove("acc1002")).toBeNull();
        });

    });
    
});
