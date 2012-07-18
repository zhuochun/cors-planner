/* ========================================
 * IVLE WaNDER! - Local Storage
 * 
 * Author: Wang Zhuochun
 * Last Edit: 11/Jul/2012 10:34 AM
 * ======================================== */

define(function(require, exports) {

    "use strict";
    /*jshint browser:true, jquery:true, laxcomma:true, maxerr:50 */

    var localStorage = window.localStorage
    , prefix = "ivle-wander-";

    // Export boolean whether localStorage is Supported
    exports.supported = (function isStorageSupported() {
        try {
            return "localStorage" in window && localStorage !== null;
        } catch (e) {
            return false;
        }
    })();

    // Export short strings for localStorage Name
    exports.key = function(key) {
        return prefix + key;
    };

    // Export Save (localStorage setItem)
    exports.save = function(key, data) {
        localStorage.setItem(prefix + key, JSON.stringify(data));
    };

    // Export Has (localStorage setItem)
    exports.has = function(key) {
        return localStorage.getItem(prefix + key) ? true : false;
    };

    // Export Get (localStorage getItem)
    exports.get = function(key) {
        return JSON.parse(localStorage.getItem(prefix + key));
    };

    // Export remvoe (localStorage removeItem)
    exports.remove = function(key) {
        localStorage.removeItem(prefix + key);
    };

    // Export clear (localStorage clear)
    exports.clear = function() {
        localStorage.clear();
    };

});
