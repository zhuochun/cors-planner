/* ========================================
 * CORS Planner - module
 *
 * a Module class
 *
 * Author: Wang Zhuochun
 * Last Edit: 23/Mar/2013 01:03 AM
 * ========================================
 * <License>
 * ======================================== */

define(function(require, exports) {

    "use strict";
    /*jshint jquery:true, laxcomma:true, maxerr:50*/

    // require components
    var color = require("helper/colors");

    /* MODULE CLASS DEFINITION
     * ======================================== */

    // Module Class
    function Module(data, status) {
        if (!data) { throw new Error("Module data cannot be null!"); }

        this.id = data.code.replace(/[_\s\'\"]/gi, "-");
        this.data = data;
        this.data.color = color.get();
        
        this.status = $.extend({}, {visible: true, allocated : {}}, status);
    }

    /* MODULE STATIC METHODS
     * ======================================== */

    // Module Count will count the number of elements
    Module.Count = function(klass) {
        var key, count = 0;

        for (key in klass) {
            if (klass.hasOwnProperty(key)) {
                count += 1;
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

    // has will return the Modules's type
    Module.fn.has = function(type) {
        return !$.isEmptyObject(this.data[type]);
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

        $.publish("module:save");
    };

    // check the status
    Module.fn.is = function(key) {
        var i, keys = key.split(".")
          , length = keys.length, parent = this.status;

        for (i = 0; i < length - 1; i++) {
            parent[keys[i]] = parent[keys[i]] || {};
            parent = parent[keys[i]];
        }

        return parent[keys[i]];
    };

    // count the number of lect/tut/labs
    Module.fn.count = function(type) {
        return Module.Count(this.data.lessons[type]);
    };

    // isSame will check the module code is the same
    Module.fn.isSame = function(other) {
        if (typeof other === "object") {
            return this.data.code === other.get("code");
        } else if (typeof other === "string") {
            return this.data.code === other.toUpperCase();
        } else { return false; }
    };

    // allocated return the allocated classNo or null
    Module.fn.allocated = function(type) {
        return this.status.allocated[type];
    };

    // allocate will allocate the clasNo of type
    Module.fn.allocate = function(type, classNo) {
        this.status.allocated[type] = classNo;

        $.publish("module:" + this.get("code") + ":allocated", [type, classNo]);
        $.publish("module:save");
    };

    // toJSON will return a string contains all
    // the datas of the current Module
    Module.fn.toJSON = function() {
        return {
            data : this.data
          , status : this.status
        };
    };

    // compress will only return an object with id, visible, allocated
    Module.fn.compress = function() {
        return {
            id: this.get("code")
          , visible: this.status.visible
          , allocated: this.status.allocated
        };
    };

    // exports the constructor
    return Module;

});
