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
    /*jshint jquery:true, laxcomma:true, browser:true, maxerr:50*/
    /*global planner*/

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
                // elem opt info span
                this.$info = this.$elem.find(".opt-info");
                // opt info
                this.code = opt.code;
                this.type = opt.type;
                this.slot = opt.slot;
                this.data = opt.module;
                // css id
                this.id = this.$elem.attr("id");
                // section lecture id
                this.sid = this.id.substr(0, this.id.lastIndexOf("-"));
                // elem ui
                this.updateElem();
                // attach popover
                this.attachPopover();
                // attach events
                this.attachEvents(opt.droppable);
                // draggable
                this.attachDragDrop(opt.droppable);
            }

            , get: function(key) { return this.data.get(key); }

            , updateElem: function() {
                var self = this;

                if (this.$elem.data("span") < 3 && this.code.length > 7) {
                    // small font
                    this.$elem.addClass("small");
                    // subscribe print mode
                    $.subscribe("app:fullsize", function(e, fs) {
                        if (fs) {
                            self.$elem.removeClass("small");
                        } else {
                            self.$elem.addClass("small");
                        }
                    });
                }

                if (planner.slotType !== "location") {
                    switchInfoType(planner.slotType, self.$info, self.slot);
                }

                $.subscribe("app:slotType", function() {
                    switchInfoType(planner.slotType, self.$info, self.slot);
                });
            }

            , attachPopover: function() {
                var self = this;
                // popover setup
                function withPopover(enable) {
                    if (!enable) {
                        self.$elem.popover("destroy");
                    } else {
                        self.$elem.popover({
                            html: true
                          , trigger: 'hover'
                          , placement: self.$elem.data("offset") + self.$elem.data("span") > 24 ?
                                          "left" : "right"
                          , title: self.get("code") + " " + self.get("title")
                          , content: popoverContent(self.type, self.slot, self.data)
                        });
                    }
                }

                withPopover(planner.slotPopover);

                $.subscribe("app:slotPopover", function() {
                    withPopover(planner.slotPopover);
                });
            }

            , attachEvents: function(droppable) {
                var self = this;

                // following actions are not available in droppable
                if (droppable) { return ; }

                this.$elem.on("mouseenter", function() {
                    if (!self.$elem.hasClass("on-dragging")) {
                        $grid.find(".slot[id^=" + self.code + "-]").addClass("hover");
                        $basket.find(".module[id=" + self.code + "]").addClass("hover");
                    }
                });

                this.$elem.on("mouseleave", function() {
                    $grid.find(".slot[id^=" + self.code + "-]").removeClass("hover");
                    $basket.find(".module[id=" + self.code + "]").removeClass("hover");
                });

                // left click to toggle between module list and class detail
                this.$elem.on("click", function(e) {
                    var pivot = $("#metro-pivot").data("controller")
                      , current = pivot.headers.children(".current").text();

                    if (current === "Modules") {
                        $.publish("module:detail", self.data);
                        // switch to detail panel
                        pivot.goToItemByName("Detail");
                    } else {
                        if ($("#detail").data("module") === self.code) {
                            // switch to modules panel
                            pivot.goToItemByName("Modules");
                        } else {
                            $.publish("module:detail", self.data);
                            // switch to detail panel
                            pivot.goToItemByName("Detail");
                        }
                    }
                });
            }

            , attachDragDrop: function(droppable) {
                var self = this;
                // default drag/drop opts
                this.dragOpts = {
                    helper: "clone"
                  , opacity: 0.3
                  , cursorAt: {top:20,left:20}
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
                  , over: $.proxy(self.dropOver, self)
                  , out: $.proxy(self.dropOut, self)
                  , drop: $.proxy(self.dropEvent, self)
                };

                if (droppable) {
                    this.$elem.droppable(this.dropOpts);
                } else if (this.data.count(this.type) > 1){
                    this.$elem.draggable(this.dragOpts);
                } else {
                    this.$elem.addClass("nomove");
                }
            }

            , dragStart: function() {
                // section is on dragging
                $grid.find(".slot[id^=" + this.sid + "-]").addClass("on-dragging");
                // create droppable slots
                $.publish("grid:module:droppable",
                    [this.slot, this.type, this.data]);
            }

            , dragStop: function() {
                // section is not on dragging anymore
                $grid.find(".slot[id^=" + this.sid + "-]").removeClass("on-dragging");
                // remove temp drop slot
                $grid.find(".ui-droppable").remove();
                // clear rows
                $.publish("grid:rows:clearEmpty");
            }

            , dropEvent: function(e, ui) {
                // fix minor bug when mouse is not over the slot after drop
                // the module in basket is still on hover state
                this.$elem.trigger("mouseleave");
                // destroy the dragging helper elem
                ui.helper.remove();
                // remove all slots of this module + type
                $grid.find(".slot[id^=" + this.code + "-" + this.type + "-]").remove();
                // allocate the new slots
                $.publish("grid:module:allocate", [this.slot, this.type, this.data]);
                // clear rows
                setTimeout(function() {
                    $.publish("grid:rows:clearEmpty");
                }, 10);
            }

            , dropOver: function() {
                $grid.find(".slot[id^=" + this.sid + "-]").addClass("hover");

                this.$elem.popover("show");
            }

            , dropOut: function() {
                $grid.find(".slot[id^=" + this.sid + "-]").removeClass("hover");

                this.$elem.popover("hide");
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

        // helper function
        function popoverContent(type, slot, mod) {
            var i, result = [], slots = mod.get("lessons")[type][slot.index];

            result.push("<b>GROUP: </b>" + slot.classNo);
            result.push("<b>TYPE: </b>" + slot.type);
            result.push("<b>WEEK: </b>" + slot.weekType);
            // push slots time
            for (i = 0; i < slots.length; i++) {
                if (i === 0) {
                    result.push("<b>TIME: </b>" + slots[i].weekDay +
                        " " + slots[i].startTime + "-" + slots[i].endTime);
                } else {
                    result.push("<b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b>" +
                        slots[i].weekDay + " " + slots[i].startTime +
                        "-" + slots[i].endTime);
                }
            }
            result.push("<b>ROOM: </b>" + slot.room);

            return result.join("<br>");
        }

        function switchInfoType(info, $elem, slot) {
            if (info === "location") {
                $elem.text(slot.room);
            } else if (info === "group") {
                $elem.text("[" + slot.classNo + "]");
            } else if (info === "week") {
                $elem.text(slot.weekType);
            }
        }

    }(jQuery));

});
