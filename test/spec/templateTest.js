/* ========================================
 * CORS Planner - Templates Tests
 *
 * Author: Wang Zhuochun
 * Last Edit: 21/Jul/2012 10:38 PM
 * ========================================
 * <License>
 * ======================================== */

define(function(require, exports) {

    "use strict";
    /*jshint browser:true, jquery:true, laxcomma:true, maxerr:50*/
    /*globals describe, xdescribe, it, xit, expect, beforeEach, afterEach*/

    var template = require("hgn!template/module");

/* Test Module Template
 * ======================================== */
    describe("Module Template", function() {


        it("template should be loaded", function() {
            expect(template).toBeDefined();

            console.log(template);
        });

    });

});
