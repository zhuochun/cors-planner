/* ========================================
 * CORS Planner - Crawler
 * 
 * Combine yql and query together
 *
 * Author: Wang Zhuochun
 * Last Edit: 20/Apr/2013 02:00 PM
 * ========================================
 * <License>
 * ======================================== */

define(function(require, exports) {

    "use strict";
    /*jshint browser:true, jquery:true, laxcomma:true, maxerr:50*/
    /*global planner*/

    // components
    var YQL = require("api/yql")
      , parser, query
    // local variables
      , fetching = {}
      , MAXTRIED = 3;

    // if school changed, reset parser and query url
    $.subscribe("app:school", function() {
        parser = null;
        query  = null;
    });

    function crawl(modCode, callback) {
        if (!query || !parser) {
            require(
                ["school/" + planner.school + "/url", "school/" + planner.school + "/parser"]
              , function(u, p) {
                    parser = p;
                    query = new YQL(u);

                    fetch(modCode, callback, 0);
                }
            );
        } else {
            fetch(modCode, callback, 0);
        }
    }

    function fetch(modCode, callback, tried) {
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

        // call yql query
        query.requestModule(modCode, function(result) {
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
    exports.crawl = crawl;

});
