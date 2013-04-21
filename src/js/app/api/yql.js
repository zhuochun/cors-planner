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
      , querySelect: function(mod) {
            return "select * from html where url='" +
                this.url(mod) + "' and xpath='//table'";
        }

        // a generalized request with a query
      , request: function(query, success) {
            return jsonp(this.yqlUrl(query)).success(getCallback(query, success));
        }

        // a module request for yql, return a Module object
      , requestModule: function(mod, callback) {
            return this.request(this.querySelect(mod), callback);
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

    // to wrap users' callbacks
    function getCallback(query, callback) {
        return function(result) {
            // add the query url to the JSON result
            result.url = query;
            // then call user's callback
            callback(result);
        };
    }

    return YQL;
    
});
