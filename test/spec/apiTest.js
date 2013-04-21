/* ========================================
 * CORS Planner - API Units Tests
 *
 * Author: Wang Zhuochun
 * Last Edit: 20/Apr/2013 08:15 PM
 * ========================================
 * <License>
 * ======================================== */

define(function(require, exports) {

    "use strict";
    /*jshint browser:true, jquery:true, laxcomma:true, maxerr:50*/
    /*globals describe, xdescribe, it, xit, expect, beforeEach, afterEach*/

    /* Test yql API
     * ======================================== */
    describe("YQL api Unit", function() {
        var YQL = require("api/yql")
          , query = new YQL(function(u) { return "URL"; })
          , link = "http://cors.bicrement.com";

        it("will have correct select query", function() {
            var correctQuery = "select * from html where url=" + 
                    "'http://cors.bicrement.com' and xpath='//table'";

            expect(query.querySelect(link)).toEqual(correctQuery);
        });

        it("will attach the url in requestModule", function() {
            // stub the request
            query.request = function(q, s) {
                s({});
            };

            // call requestModule
            query.requestModule("MOD", function(r) {
                expect(r.url).toEqual("URL");
            });
        });

    });

    // TODO: test Crawler
    // TODO: need to make Crawler testable

});
