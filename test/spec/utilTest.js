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

/* Test Helper Util
 * ======================================== */
    describe("Util/Helper", function() {

        var helper = require("util/helper")
        , acc1002 = require("json!testData/acc1002parsed.json")
        , cs1020 = require("json!testData/cs1020parsed.json");

        it("can get the semester accordingly", function() {
            // Change it manually as time goes
            var current = "2012/2013", sem = 1
            , fromHelper = helper.getSemester();

            expect(fromHelper.acadYear).toEqual(current);
            expect(fromHelper.semester).toEqual(sem);
        });

    });

});
