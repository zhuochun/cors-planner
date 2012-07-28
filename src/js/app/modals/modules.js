/* ========================================
 * CORS Planner - modules modal
 *
 * a modal (module list) to host all modules
 *
 * Author: Wang Zhuochun
 * Last Edit: 29/Jul/2012 12:03 AM
 * ========================================
 * <License>
 * ======================================== */

define(function(require, exports) {

    "use strict";
    /*jshint browser:true, jquery:true, laxcomma:true, maxerr:50*/

    // include components
    var yql = require("api/yql")
    , parser = require("api/parser")
    // include modal
    , Module = require("modal/module");

    // ModuleList default options
    var defaults = {
        mute : false // mute event publish
        , prefix : "module:" // event prefix
    };

    /* MODULELIST CLASS DEFINITION
     * ======================================== */

    // ModuleList Class
    function ModuleList(name, options) {
        this.name = name;
        this.list = [];

        defaults.prefix = this.name + ":";
        this.options = $.extend({}, defaults, options);
    }

    // fetch the module from CORS with callback
    function _fetch(modCode, callback) {
        yql.requestModule(modCode, function(result) {
            var mod = parser.parse(result);

            if (mod !== null) {
                if (mod.isAvailable) {
                    callback(new Module(mod));
                } else {
                    // TODO: move this to specific view component
                    window.alert("module : " + modCode + " is not available");
                }
            }
        });
    }

    /* MODULELIST CLASS METHODS
     * ======================================== */

    // ModuleList Prototypes alias
    ModuleList.fn = ModuleList.prototype;

    // find a module (instance or moduleCode) is inside the list
    // return the index or -1 (not found)
    ModuleList.fn.find = function(mod) {
        var i = 0, len = this.list.length;

        for (; i < len; i++) {
            if (this.list[i].isSame(mod)) {
                return i;
            }
        }

        return -1;
    };

    // get will return the module if it is found in list
    // otherwise, return null
    ModuleList.fn.get = function(mod) {
        if (typeof mod === "number" && mod >= 0 && mod < this.list.length) {
            return this.list[mod];
        } else if (typeof mod === "string" || typeof mod === "object") {
            return this.get(this.find(mod));
        } else {
            return null;
        }
    };

    // add a module instance or using module code
    ModuleList.fn.add = function(module, options) {
        options = $.extend({}, this.options, options);
        
        if (this.find(module) === -1) {
            if (typeof module === "object") {
                this.list.push(module);

                if (!options.mute) {
                    $.publish(options.prefix + "addOne", [module]);
                }
            } else if (typeof module === "string") {
                _fetch(module, $.proxy(function(m) {
                    this.list.push(m);

                    if (!options.mute) {
                        $.publish(options.prefix + "addOne", [m]);
                    }
                }, this));
            }
        } else {
            if (!options.mute) {
                $.publish(options.prefix + "addOne:duplicated", module);
            }
        }
    };

    // return the detail information about the module using module code
    ModuleList.fn.detail = function(modCode) {
        var module = this.get(modCode);

        if (module) {
            return module.format();
        } else {
            return null;
        }
    };

    // remove will remove a module from list
    // return the removed module if successful
    // return null otherwise
    ModuleList.fn.remove = function(mod, options) {
        var module;

        options = $.extend({}, this.options, options);

        if (typeof mod === "number" && mod >= 0 && mod < this.list.length) {
            module = this.list.splice(mod, 1)[0];

            if (!options.mute) {
                $.publish(options.prefix + "removeOne", [mod, module]);
            }
            
            return module;
        } else if (typeof mod === "string" || typeof mod === "object") {
            return this.remove(this.find(mod), options);
        } else {
            return null;
        }
    };

    // clean will remove all modules from list
    ModuleList.fn.clean = function(options) {
        options = $.extend({}, this.options, options);

        this.list = [];

        if (!options.mute) {
            $.publish(options.prefix + "clean");
        }
    };

    // length will return the number of modules in list
    ModuleList.fn.length = function() {
        return this.list.length;
    };

    // sort will sort the list according to compareFunction
    ModuleList.fn.sort = function(compareFun) {
        this.list.sort(compareFun);
    };

    // exports the constructor
    return ModuleList;

});
