/* ========================================
 * CORS Planner - YQL Query Ajax
 *
 * Yahoo Query Language
 * http://developer.yahoo.com/yql/
 *
 * Author: Wang Zhuochun
 * Last Edit: 23/May/2015 11:21 AM
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
      , querySelect: function(url, xpath) {
            xpath = xpath || "//table";
            return "select * from html where url='" + url + "' and xpath='" + xpath + "'";
        }

        // a generalized request with a query
      , request: function(query, success) {
            return jsonp(this.yqlUrl(query)).success(success);
        }

        // a module request for yql, return a Module object
      , requestModule: function(mod, callback) {
            var link = this.url(mod); // { url, xpath }

            return this.request(this.querySelect(link.url, link.xpath),
                requestCallback(link.url, callback));
        }
    };

    // wrap the callback, so to add link to the result
    function requestCallback(url, cb) {
        return function(result) {
            // add the query url to the JSON result
            result.url = url;
            // then call the actual user's callback
            cb(result);
        }
    }

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
