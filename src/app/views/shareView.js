/* ========================================
 * CORS Planner - Generate Share Url
 *
 * Author: Wang Zhuochun
 * Last Edit: 04/Jul/2013 12:35 AM
 * ========================================
 * <License>
 * ======================================== */

define(function(require, exports) {

    "use strict";
    /*jshint browser:true, jquery:true, laxcomma:true, maxerr:50*/
    /*global planner*/

    var $el = $("#short-link-modal"),
        token = "fe44adc346767b3234c5231a0b8cfb4f12c3ed69",
        bitly = "https://api-ssl.bitly.com/v3/shorten?access_token=" + token + "&longUrl=",
        baseUrl = "http://cors.bicrement.com";

    // init check school
    exports.init = function() {
        
    };

    function generateBitly(e, mods) {
        var longUrl = baseUrl + "?" + mods;

        $.get(bitly + encodeURIComponent(longUrl), function(data) {
            var shortUrl = data.url;

            console.log(data);
        });
    }

    $.subscribe("app:share:get", generateBitly);

});
