/* ========================================
 * CORS Planner - API Units Tests
 *
 * Author: Wang Zhuochun
 * Last Edit: 19/Jul/2012 02:55 PM
 * ========================================
 * <License>
 * ======================================== */

define(function(require, exports) {

    "use strict";
    /*jshint browser:true, jquery:true, laxcomma:true, maxerr:50*/
    /*globals describe, xdescribe, it, xit, expect, beforeEach, afterEach*/

/* Test yql API
 * ======================================== */
    describe("yql API Unit", function() {
        var yql = require("api/yql"), getJSON;

        // overwrite jQuery getJSON
        beforeEach(function() {
            // store jQuery getJSON
            getJSON = $.getJSON;
            // write own getJSON will use callback to test data
            $.getJSON = function(data, callback) {
                callback( { results : data } );
            };
        });

        // write back jQuery's getJSON
        afterEach(function() {
            $.getJSON = getJSON;
            getJSON = null;
        });

        it("will have a correct yql query url", function() {
            yql.request("query", function(data) {
                expect(data.results).toEqual("http://query.yahooapis.com/v1/public/yql?q=query&format=json&callback=");
            });
        });

        // This test may failed when defaults changed. Now is 2012/2013 SEM 1
        xit("will have a correct module (string) request yql url", function() {
            yql.requestModule("ACC1002", function(data) {
                expect(data.results).toEqual("http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D'https%3A%2F%2Faces01.nus.edu.sg%2Fcors%2Fjsp%2Freport%2FModuleDetailedInfo.jsp%3Facad_y%3D2012%2F2013%26sem_c%3D1%26mod_c%3DACC1002'%20and%20xpath%3D'%2F%2Ftable'&format=json&callback=");
            });
        });

        it("will have a correct module (object) request yql url", function() {
            yql.requestModule({modCode: "ACC1002", acadYear: "2011/2012", semester: "1"}, function(data) {
                expect(data.results).toEqual("http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D'https%3A%2F%2Faces01.nus.edu.sg%2Fcors%2Fjsp%2Freport%2FModuleDetailedInfo.jsp%3Facad_y%3D2011%2F2012%26sem_c%3D1%26mod_c%3DACC1002'%20and%20xpath%3D'%2F%2Ftable'&format=json&callback=");
            });
        });

        it("will attach the query url in the return result", function() {
            yql.requestModule({modCode: "ACC1002", acadYear: "2011/2012", semester: "1"}, function(data) {
                expect(data.url).toEqual("https://aces01.nus.edu.sg/cors/jsp/report/ModuleDetailedInfo.jsp?acad_y=2011/2012&sem_c=1&mod_c=ACC1002");
            });
        });

        // XXX: have a getJSON test?

    });

/* Test parser API
 * ======================================== */
    describe("parser API Unit", function() {

        var parser = require("api/parser")
        // include JSON test data
        , modNull = require("json!testData/null.json")
        , modACC1002 = require("json!testData/acc1002.json")
        , modACC1002parsed = require("json!testData/acc1002parsed.json")
        , modCS1010 = require("json!testData/cs1010.json");

        describe("Parser tryParse() method", function() {
            it("will return FALSE if data object passed in is invalid", function() {
                expect(parser.tryParse({})).toBe(false);
            });

            it("will return FALSE if no results data given", function() {
                expect(parser.tryParse({query : {results:null}})).toBe(false);
            });

            it("will return FALSE if module is not available", function() {
                expect(parser.tryParse(modNull)).toBe(false);
            });

            it("will return TRUE if module exists", function() {
                expect(parser.tryParse(modACC1002)).toBe(true);
                expect(parser.tryParse(modCS1010)).toBe(true);
            });
        });

        describe("Parser Parse() method", function() {
            function getObjSize(obj) {
                var size = 0, key;
                for (key in obj) {
                    if (obj.hasOwnProperty(key)) size++;
                }
                return size;
            }

            it("will return NULL if data object passed in is invalid", function() {
                expect(parser.parse({})).toBe(null);
            });

            it("will return NULL if no results data given", function() {
                expect(parser.parse({query : {results:null}})).toBe(null);
            });

            it("will return Module is not available if module is not available", function() {
                expect(parser.parse(modNull).isAvailable).toBe(false);
            });

            it("will return Module is available if module exists", function() {
                expect(parser.parse(modACC1002).isAvailable).toBe(true);
                expect(parser.parse(modCS1010).isAvailable).toBe(true);
            });

            it("will return a Module object if module exists (I) - general", function() {
                var cs1010 = parser.parse(modCS1010);
                // module is defined
                expect(cs1010).toBeDefined();
                // some basic checking
                expect(cs1010.code).toEqual("CS1010");
                expect(cs1010.examDate).toEqual("27-11-2012 AM");
                // cs1010 lects = 4
                expect(getObjSize(cs1010.lectures)).toEqual(4);
                // check some specific lects
                expect(cs1010.lectures["TUESDAY-1200-1500"].length).toEqual(3);
                expect(cs1010.lectures["WEDNESDAY-900-1200"][0].room).toEqual("COM1-B109");
                // cs1010 labs = 0
                expect(getObjSize(cs1010.labs)).toEqual(0);
                // cs1010 tuts = 4
                expect(getObjSize(cs1010.tutorials)).toEqual(4);
                // cs1010 actual tutorial nums = 24
                var tut, size = 0;
                for (tut in cs1010.tutorials) {
                    size += cs1010.tutorials[tut].length;
                }
                expect(size).toEqual(24);
            });

            it("will return a Module object if module exists (II) - lect + tut", function() {
                var acc1002 = parser.parse(modACC1002);
                // module is defined
                expect(acc1002).toBeDefined();
                // module is correct
                expect(acc1002).toEqual(modACC1002parsed);
            });

        });

    });
    
});
