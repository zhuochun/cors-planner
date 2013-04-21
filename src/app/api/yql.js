/* ========================================
 * CORS Planner - YQL Query Ajax
 * 
 * Yahoo Query Language
 * http://developer.yahoo.com/yql/
 *
 * Author: Wang Zhuochun
 * Last Edit: 20/Apr/2013 04:27 PM
 * ========================================
 * <License>
 * ======================================== */

define(function(require, exports) {

    "use strict";
    /*jshint browser:true, jquery:true, laxcomma:true, maxerr:50*/

    // YQL class wrapper
    function YQL(url) {
        this.url = url;
    }

    // YQL Prototype alias
    YQL.prototype = {
        // return a valid yql url
        yqlUrl: function(query) {
            return "http://query.yahooapis.com/v1/public/yql?q=" +
                encodeURIComponent(query) + "&format=json";
        }

        // a select query
      , querySelect: function(u) {
            return "select * from html where url='" + u + "' and xpath='//table'";
        }

        // a generalized request with a query
      , request: function(query, success) {
            return jsonp(this.yqlUrl(query)).success(success);
        }

        // a module request for yql, return a Module object
      , requestModule: function(mod, callback) {
            var link = this.url(mod);

            return this.request(this.querySelect(link), (function(u, cb) {
                // wrap users' callbacks and add the link
                return function(result) {
                    // add the query url to the JSON result
                    result.url = u;
                    // then call the actual user's callback
                    cb(result);
                };
            })(link, callback));
        }
    };

    // cross domain jsonp
    function jsonp(url) {
        return $.ajax({
            type : "GET"
          , dataType : "jsonp"
          , contentType :"application/x-javascript"
          , url : url
          , xhrFields : { widthCredentials : false }
        });
    }

    return YQL;
    
});
