/* ========================================
 * CORS Planner - module
 *
 * a Module class
 *
 * Author: Wang Zhuochun
 * Last Edit: 18/Jul/2012 03:48 PM
 * ========================================
 * <License>
 * ======================================== */

define(function(require, exports) {

    "use strict";
    /*jshint jquery:true, laxcomma:true, maxerr:50*/

    // Module default status
    var defaultStatus = {
        allocated : { lecture : "", tutorial : "", lab : "" }
    };

    /* MODULE CLASS DEFINITION
     * ======================================== */

    // Module Class
    function Module(data, status) {
        this.id = data.code.replace(/[_\s\'\"]/gi, "-"); // replace unwanted chars
        this.data = data;
        this.status = $.extend({}, defaultStatus, status);
    }

    /* MODULE STATIC METHODS
     * ======================================== */

    // Module Count will count the number of elements
    Module.Count = function(klass) {
        var key, count = 0;

        for (key in klass) {
            if (klass.hasOwnProperty(key)) {
                if ($.isArray(klass[key])) {
                    count += klass[key].length;
                }
            }
        }

        return count;
    };

    /* MODULE CLASS METHODS
     * ======================================== */

    // Module Prototypes alias
    Module.fn = Module.prototype;

    // get will return the Module's data
    Module.fn.get = function(key) {
        return this.data[key];
    };

    // set will change the Module's status
    Module.fn.set = function(key, val) {
        var i, keys = key.split("."), length = keys.length, parent;

        parent = this.status;
        for (i = 0; i < length - 1; i++) {
            parent[keys[i]] = parent[keys[i]] || {};
            parent = parent[keys[i]];
        }
        parent[keys[i]] = val;
    };

    // count the number of lect/tut/labs
    Module.fn.count = function(type) {
        type = type.toLowerCase();

        if (type === "lecture") {
            return Module.Count(this.data.lectures);
        } else if (type === "tutorial") {
            return Module.Count(this.data.tutorials);
        } else if (type === "lab") {
            return Module.Count(this.data.labs);
        }
    };

    // update will cause the the Module to render
    Module.fn.update = function() {
        // TODO: 
    };

    // isSame will check the module code is the same
    Module.fn.isSame = function(other) {
        if (typeof other === "object") {
            return this.data.code === other.get("code");
        } else if (typeof other === "string") {
            return this.data.code === other.toUpperCase();
        }
    };

    // isAllocated will check whether the klass is allocated
    Module.fn.isAllocated = function(type, classNo) {
        return this.status.allocated[type] == classNo;
    };

    // allocate will allocate the clasNo of type
    Module.fn.allocate = function(type, classNo) {
        this.status.allocated[type] = classNo;
    };

    // toJSON will return a string contains all
    // the datas of the current Module
    Module.fn.toJSON = function() {
        return JSON.stringify({
            data : this.data
            , status : this.status
        });
    };

    // return the Constructor
    return Module;

});
