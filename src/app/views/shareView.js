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
        checkShare();
        attachEvents();
    };

    function checkShare() {
        var share = /#share=(.*)&school=(.*)/ig.exec(decodeURIComponent(location.hash));

        if (share && share.length === 3) {
            location.hash = "";

            planner.set("school", share[2]);

            $.publish("module:readFromShare", [share[1].split("&")]);
        }

        planner.trackEvent("open-from-share", share && share.length === 3);
    }

    function generateBitly(e, mods) {
        var longUrl = baseUrl + "#share=" + mods + "&school=" + planner.get("school");

        $.get(bitly + encodeURIComponent(longUrl), function(result) {
            var shortUrl = result.data.url;

            $el.find("#short-link-url").val(shortUrl);
            $el.find(".share-btn").attr("href", $el.find(".share-btn").attr("href") + shortUrl);
        });

        $el.modal("show");

        planner.trackEvent("share", "bitly");
    }

    function attachEvents() {
        $el.find(".black.m-btn").on("click", function() {
            $(this).html("Ctrl + C to copy");
            $("#short-link-url").focus();
        });

        $("#short-link-url").on("focus", function() {
            $(this).select();
        });
    }

    $.subscribe("app:share:get", generateBitly);

    // for tracking purpose
    $.subscribe("module:calendar", function() {
        planner.trackEvent("share", "calendar");
    });

});
