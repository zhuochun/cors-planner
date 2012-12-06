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
        // elem pre-cache
          , $grid = $("#tt-grid")
          , $basket = $("#basket-scroll")
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
                this.slot = opt.slot;
                this.data = opt.module;
                // css id
                this.id = this.$elem.attr("id");
                // section lecture id
                this.sid = this.id.substr(0, this.id.lastIndexOf("-"));
                // attach events
                this.attachEvents();
                // draggable
                this.attachDragDrop(opt.droppable);
            }
            
            , get: function(key) { return this.data.get(key); }

            , attachEvents: function(item, fun) {
                var self = this;

                this.$elem.on("mouseenter", function() {
                    $grid.find(".slot[id^=" + self.sid + "-]").addClass("hover");
                    $grid.find(".slot[id^=" + self.code + "-]")
                         .not("[id^=" + self.sid + "-]").addClass("highlight");
                    $basket.find("[id=" + self.code + "]").addClass("hover");
                });

                this.$elem.on("mouseleave", function() {
                    $grid.find(".slot[id^=" + self.sid + "-]").removeClass("hover");
                    $grid.find(".slot[id^=" + self.code + "-]")
                         .not("[id^=" + self.sid + "-]").removeClass("highlight");
                    $basket.find("[id=" + self.code + "]").removeClass("hover");
                });
            }

            , attachDragDrop: function(droppable) {
                var self = this;
                // default drag/drop opts
                this.dragOpts = {
                    helper: "clone"
                  , opacity: 0.3
                  , revert: "invalid"
                  , revertDuration: 200
                  , zIndex : 1000
                  , start: $.proxy(self.dragStart, self)
                  , stop: $.proxy(self.dragStop, self)
                };
                this.dropOpts = {
                    activeClass: "highlight"
                  , hoverClass: "hover"
                  , tolerance: "pointer"
                  , drop: $.proxy(self.dropEvent, self)
                };

                if (droppable) {
                    this.$elem.droppable(this.dropOpts);
                } else {
                    this.$elem.draggable(this.dragOpts);
                }
            }

            , dragStart: function() {
                $.publish("grid:module:droppable",
                    [this.slot, this.type, this.data]);
            }

            , dragStop: function() {
                // remove temp drop slot
                $grid.find(".ui-droppable").remove();
                // clear rows
                $.publish("grid:rows:clearEmpty");
            }

            , dropEvent: function(e, ui) {
                (function(s, t, d) {
                    setTimeout(function() {
                        $.publish("grid:module:allocate", [s, t, d]);
                    }, 50);
                })(this.slot, this.type, this.data)

                // remove the original draggable
                ui.draggable.remove();
                // remove temp drop slot
                $grid.find(".ui-droppable").remove();
                // clear rows
                $.publish("grid:rows:clearEmpty");
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
