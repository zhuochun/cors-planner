/* ========================================
 * CORS Planner - module
 *
 * a Module class
 *
 * Author: Wang Zhuochun
 * Last Edit: 21/Jul/2012 05:27 PM
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
            if (klass.hasOwnProperty(key) && $.isArray(klass[key])) {
                count += klass[key].length;
            }
        }

        return count;
    };

    // Module Format will return the modules data formatted
    // according to classNo instead of timeslot
    Module.Format = function(data) {
        var m = $.extend({}, data); // avoid modify original data

        if (!$.isEmptyObject(m.lectures)) {
            m.hasLecture = true;
            m.lectures = convertClass(m.lectures);
        }

        if (!$.isEmptyObject(m.tutorials)) {
            m.hasTutorial = true;
            m.tutorials = convertClass(m.tutorials);
        }

        if (!$.isEmptyObject(m.labs)) {
            m.hasLab = true;
            m.labs = convertClass(m.labs);
        }

        return m;
    };

    function convertClass(klass) {
        var i, j = 0, length, key, result = [];

        for (key in klass) {
            if (klass.hasOwnProperty(key)) {
                length = klass[key].length;

                for (i = 0; i < length; i++) {
                    result[j++] = klass[key][i];
                }
            }
        }

        return result;
    }
    

    /* MODULE CLASS METHODS
     * ======================================== */

    // Module Prototypes alias
    Module.fn = Module.prototype;

    // get will return the Module's data
    Module.fn.get = function(key) {
        return this.data[key];
    };

    // set will change the Module's status
    // key could be "allocated.lecture"
    Module.fn.set = function(key, val) {
        var i, keys = key.split(".")
        , length = keys.length, parent = this.status;

        for (i = 0; i < length - 1; i++) {
            parent[keys[i]] = parent[keys[i]] || {};
            parent = parent[keys[i]];
        }
        parent[keys[i]] = val;
    };

    // count the number of lect/tut/labs
    Module.fn.count = function(type) {
        type = type.toLowerCase();

        if (type === "lectures") {
            return Module.Count(this.data.lectures);
        } else if (type === "tutorials") {
            return Module.Count(this.data.tutorials);
        } else if (type === "labs") {
            return Module.Count(this.data.labs);
        }
    };

    // format the module
    Module.fn.format = function() {
        return Module.Format(this.data);
    };

    // isSame will check the module code is the same
    Module.fn.isSame = function(other) {
        if (typeof other === "object") {
            return this.data.code === other.get("code");
        } else if (typeof other === "string") {
            return this.data.code === other.toUpperCase();
        } else { return false; }
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
        return {
            data : this.data
          , status : this.status
        };
    };

    // exports the constructor
    return Module;

});
