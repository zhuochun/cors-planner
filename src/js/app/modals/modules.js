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
    /*jshint jquery:true, laxcomma:true, maxerr:50*/

    // a private list to host all Modules
    var moduleList = [];

    // add will add the module to list
    // return true if the module is new in list
    // return false if the module already in list
    exports.add = function(module) {
        var i = 0, length = moduleList.length;

        for (; i < length; i++) {
            // if module already in list
            if (moduleList[i].isSame(module)) {
                return false;
            }
        }

        moduleList.push(module);

        return true;
    };

    // remove will remove a module from list
    // return the removed module if successful
    // return null otherwise
    exports.remove = function(moduleCode) {
        var i = 0, length = moduleList.length;

        for (; i < length; i++) {
            if (moduleList[i].isSame(moduleCode)) {
                return moduleList.splice(i, 1)[0];
            }
        }

        return null;
    };

    // clean will remove all modules from list
    exports.clean = function() {
        moduleList = [];
    };

    // getSize will return the number of modules in list
    exports.getSize = function() {
        return moduleList.length;
    };

    // sort will sort the list according to compareFunction
    exports.sort = function(compareFun) {
        moduleList.sort(compareFun);
    };

});
