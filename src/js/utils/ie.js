/* ========================================
 * IVLE WaNDER! - IE Helpers
 * 
 * Add some missing stuffs necessary
 * 
 * Author: Wang Zhuochun
 * Last Edit: 06/Jun/2013 10:08 PM
 * ======================================== */

define(function(require, exports) {

    "use strict";
    /*jshint browser:true, jquery:true, laxcomma:true, maxerr:50 */

    var ArrayProto = Array.prototype;

    if (!ArrayProto.indexOf) {
        ArrayProto.indexOf = function(item, from) {
            var i = from || this.length;

            while (i--) {
                if (this[i] === item)
                    return i;
            }

            return -1;
        };
    }

});
