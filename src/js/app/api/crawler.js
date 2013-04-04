/* ========================================
 * CORS Planner - Crawler
 * 
 * Combine yql and query together
 *
 * Author: Wang Zhuochun
 * Last Edit: 22/Dec/2012 09:57 PM
 * ========================================
 * <License>
 * ======================================== */

define(function(require, exports) {

    "use strict";
    /*jshint browser:true, jquery:true, laxcomma:true, maxerr:50*/

    // components
    var yql = require("api/yql")
      , parser = require("api/parser")
    // local variables
      , fetching = {}
      , MAXTRIED = 3;

    function fetch(modCode, callback, tried) {
        // initial # of times tried fetching
        tried = tried || 0;
        // pre-condition check
        if (tried === 0) {
            // prevent fetching the same module if it is on fetching
            if (fetching[modCode]) {
                return ;
            } else {
                fetching[modCode] = true;
                // start fetching
                $.publish("module:fetching", modCode);
            }
        } else if (tried === MAXTRIED) {
            // tried 3 times before give up on fetching
            $.publish("module:" + modCode + ":fetched");
            $.publish("message:error", "Fetching data for Module " + modCode + " failed, Please try again later.");
            return;
        }

        // call yql
        yql.requestModule(modCode, function(result) {
            var mod, closeFetch = true;

            try {
                mod = parser.parse(result);

                if (mod !== null) {
                    if (mod.isAvailable) {
                        callback(mod);
                    } else {
                        $.publish("message:error", "Module " + modCode + " is not available now.");
                    }
                } else {
                    // try fetch again
                    closeFetch = false;
                    fetch(modCode, callback, tried + 1);
                }
            } catch (e) {
                $.publish("message:error", e.toString());
            }

            if (closeFetch) {
                // clear this module in fetching
                delete fetching[modCode];
                // module fetched
                $.publish("module:" + modCode + ":fetched");
            }
        });
    }

    // export in another name
    exports.crawl = fetch;

});
