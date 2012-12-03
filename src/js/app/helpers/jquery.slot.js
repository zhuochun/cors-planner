/* ========================================
 * CORS Planner - jQuery Slot
 *
 * jQuery plugin for Module Slot Interactions
 *
 * Author: Wang Zhuochun
 * Last Edit: 03/Dec/2012 10:14 AM
 * ========================================
 * <License>
 * ======================================== */

define(function(require, exports) {

    "use strict";
    /*jshint jquery:true, laxcomma:true, maxerr:50*/

    (function($) {

        var _project = "planner_"
          , _pluginName = "slot"
          , $grid = $("#tt-grid")
        // Plugin constructor
          , Plugin = function(element, options) {
            this.$elem = $(element);
            this.init(options);
          };

        Plugin.prototype = {
            constructor: Plugin

            , init: function(opt) {
                // opt info
                this.code = opt.code;
                this.type = opt.type;
                this.data = opt.data;
                this.slot = opt.slot;
                // css id
                this.id = this.$elem.attr("id");
                // section lecture id
                this.sid = this.id.substr(0, this.id.lastIndexOf("-"));
                // attach events
                this.attachEvent();
                // draggable
                // TODO
            }
            
            , get: function(key) { return this.data.get(key); }

            , attachEvent: function(item, fun) {
                var self = this;

                this.$elem.on("mouseenter", function() {
                    $grid.find(".slot[id^=" + self.sid + "-]").addClass("hover");
                    $grid.find(".slot[id^=" + self.code + "-]")
                         .not("[id^=" + self.sid + "-]").addClass("highlight");
                });

                this.$elem.on("mouseleave", function() {
                    $grid.find(".slot[id^=" + self.sid + "-]").removeClass("hover");
                    $grid.find(".slot[id^=" + self.code + "-]")
                         .not("[id^=" + self.sid + "-]").removeClass("highlight");
                });
            }
        };

        /* PLUGIN DEFINITION
         * ======================================== */
        $.fn.slot = function(options) {
            return this.each(function () {
                if (!$.data(this, _project + _pluginName)) {
                    $.data(this, _project + _pluginName, new Plugin(this, options));
                }
            });
        };

    }(jQuery));

});
