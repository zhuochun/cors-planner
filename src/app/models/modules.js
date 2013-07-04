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
    var Module = require("model/module")
      , Crawler = require("api/crawler");

    /* MODULELIST CLASS DEFINITION
     * ======================================== */

    // ModuleList Class
    function ModuleList(name, options) {
        this.name = name;
        this.list = [];

        this.options = $.extend({}, {
            mute : false
          , prefix : this.name + ":"
        }, options);
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
    ModuleList.fn.add = function(module, options, status) {
        options = $.extend({}, this.options, options);

        if (this.find(module) === -1) {
            if (typeof module === "object") {
                this._add(module, options);
            } else if (typeof module === "string") {
                Crawler.crawl(module, $.proxy(function(m) {
                    this._add(new Module(m, status), options);
                }, this));
            }
        } else {
            if (!options.mute) {
                $.publish(options.prefix + "addOne:duplicated", this.get(module));
            }
        }
    };

    // add a list of modules
    ModuleList.fn.populate = function(list, options) {
        var i, len = list.length;

        for (i = 0; i < len; i++) {
            this._add(new Module(list[i].data, list[i].status), options);
        }
    };

    // private _add
    ModuleList.fn._add = function(module, options) {
        var idx = this.duplicated("examDate", module.get("examDate"));

        options = $.extend({}, this.options, options);

        // set module's status list
        module.set("list", this.name);
        // then push to the list
        this.list.push(module);
        // save list
        $.publish("module:save");

        if (!options.mute) {
            $.publish(options.prefix + "addOne", [module]);

            if (idx >= 0 && module.get("examDate").indexOf("No Exam") < 0) {
                $.publish(options.prefix + "duplicatedExamDate", [this.get(idx), module]);
            }
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

            $.publish("module:save");

            if (!options.mute) {
                $.publish(options.prefix + "removeOne", [module]);
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

        $.publish("module:save");

        if (!options.mute) {
            $.publish(options.prefix + "clean");
        }
    };

    // length will return the number of modules in list
    ModuleList.fn.length = function() {
        return this.list.length;
    };

    // check duplicate item
    ModuleList.fn.duplicated = function(key, val) {
        if (val === '-') { return -1; }

        var i, length = this.list.length;

        for (i = 0; i < length; i++) {
            if (this.list[i].get(key) === val) { return i; }
        }

        return -1;
    };

    // sort modules in new order
    ModuleList.fn.inSequence = function(seq) {
        var result = [], i, len = seq.length;

        for (i = 0; i < len; i++) {
            result.push(this.get(seq[i]));
        }

        this.list = result;
    };

    // to JSON
    ModuleList.fn.toJSON = function() {
        var result = [], i, len = this.list.length;

        for (i = 0; i < len; i++) {
            result.push(this.list[i].toJSON());
        }

        return result;
    };

    // to link params
    ModuleList.fn.compress = function() {
        var result = [], i, len = this.list.length;

        for (i = 0; i < len; i++) {
            result.push(this.list[i].compress());
        }

        return result;
    }

    // exports the constructor
    return ModuleList;

});
