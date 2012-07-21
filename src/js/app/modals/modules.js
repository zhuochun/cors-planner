/* ========================================
 * CORS Planner - modules modal
 *
 * a modal (module list) to host all modules
 *
 * Author: Wang Zhuochun
 * Last Edit: 18/Jul/2012 03:48 PM
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
    , Module = require("modal/module")
    // a private list to host all Modules
    , moduleList = [];

    // return the module index if it is found
    function find(module) {
        var i = 0, length = moduleList.length;

        for (; i < length; i++) {
            // if module already in list
            if (moduleList[i].isSame(module)) {
                return i;
            }
        }

        return -1;
    }

    // wipe-up request module with callback
    function getModule(modCode, callback) {
        yql.requestModule(modCode, function(result) {
            var mod = parser.parse(result);

            if (mod !== null) {
                if (mod.isAvailable) {
                    callback(new Module(mod));
                } else {
                    window.alert("module : " + modCode + " is not available");
                }
            }
        });
    }

    // add will add the module to list
    exports.add = function(module) {
        if (find(module) === -1) { // check module is in the list
            if (typeof module === "object") {
                moduleList.push(module);
            } else if (typeof module === "string") {
                getModule(module, function(m) { moduleList.push(m); });
            }
        }
    };

    // get will return the module if it is found in list
    // otherwise, return null
    exports.get = function(mod) {
        if (typeof mod === "number") {
            return moduleList[mod];
        } else {
            var i = find(mod);
            return i >= 0 ? moduleList[i] : null;
        }
    };

    // get the module info from the internet
    exports.getModule = getModule;

    // remove will remove a module from list
    // return the removed module if successful
    // return null otherwise
    exports.remove = function(modCode) {
        var i = find(modCode);
        return i >= 0 ? moduleList.splice(i, 1)[0] : null;
    };

    // clean will remove all modules from list
    exports.clean = function() {
        moduleList = [];
    };

    // length will return the number of modules in list
    exports.length = function() {
        return moduleList.length;
    };

    // sort will sort the list according to compareFunction
    exports.sort = function(compareFun) {
        moduleList.sort(compareFun);
    };

});
