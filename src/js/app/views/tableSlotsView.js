/* ========================================
 * CORS Planner - tableSlotsView
 *
 * Author: Wang Zhuochun
 * Last Edit: 09/Sep/2012 06:06 PM
 * ========================================
 * <License>
 * ======================================== */

define(function(require, exports) {

    "use strict";
    /*jshint browser:true, jquery:true, laxcomma:true, maxerr:50*/
    /*global planner*/

    // private variables
    var _type = "horizontal"
      , weekDays = planner.weekDays
    // DOM
      , $daySlots = []
      , $grid, $gridTrs, $gridTds;

    exports.init = function() {};

    exports.render = function(type) {
        $grid = $grid || $("#table-grid");
        $gridTrs = $gridTrs || $grid.find("tr").slice(1);
        $gridTds = $gridTds || $gridTrs[0].getElementsByTagName("td");

        return _render();
    };

    exports.resize = function(type) {
        _type = type || _type;

        if (_type === "vertical") {
            _resizeSlotsVertical();
        } else {
            _resizeSlotsHorizontal();
        }
    };

    function _render() {
        var i, length = weekDays.length;

        for (i = 0; i < length; i++) {
            $daySlots[i] = $("<div id='" + weekDays[i] + "-slot'>")
                            .addClass("slots");
        }

        return $daySlots;
    }

    function _resizeSlotsVertical() {
        var i, length = weekDays.length;

        for (i = 0; i < length; i++) {
            $daySlots[i].css({ "top" : $grid[0].offsetTop + 1
                           ,  "left" : $gridTds[i+1].offsetLeft + 1
                           , "width" : $gridTds[i+1].offsetWidth - 1
                           , "height": $grid[0].offsetHeight - 2});
        }
    }

    function _resizeSlotsHorizontal() {
        var i, length = weekDays.length;

        for (i = 0; i < length; i++) {
            $daySlots[i].css({ "top" : $gridTrs[i].offsetTop + 2
                           ,  "left" : "1px"
                           , "width" : $gridTrs[i].offsetWidth - 1
                           , "height": $gridTrs[i].offsetHeight - 1});
        }
    }

});
