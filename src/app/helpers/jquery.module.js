/* ========================================
 * CORS Planner - jQuery Module
 *
 * jQuery plugin for Module Interactions
 *
 * Author: Wang Zhuochun
 * Last Edit: 17/Nov/2012 11:04 PM
 * ========================================
 * <License>
 * ======================================== */

define(function(require, exports) {

    "use strict";
    /*jshint jquery:true, laxcomma:true, browser:true, maxerr:50*/

    (function($) {

        var _project = "planner_"
          , _pluginName = "modules"
          , $grid = $("#tt-grid")
        // Plugin constructor
          , Plugin = function(element, options) {
            this.$elem = $(element);
            this.init(options);
          };

        Plugin.prototype = {
            constructor: Plugin

            , init: function(opt) {
                this.$method = this.$elem.find(".method");
                this.$info = this.$elem.find(".info");

                // module data
                this.data = opt.data;
                // module id
                this.id = this.data.get("code");
                // clashing modules
                this.clash = [];
                // update ui
                this.updateElem();
                // attach events
                this.attachEvents();
                // bind subscription
                this.subscribeEvents();
            }

            , get: function(key) {
                return this.data.get(key);
            }

            , updateElem: function() {
                if (!this.data.is("visible")) {
                    this.showOnTimetable(false);
                }
            }

            , showOnTimetable: function(show, $elem, $this) {
                $elem = $elem || this.$method.find(".timetable i");
                $this = $this || this.$elem;

                if (show) {
                    // open eye, unmark inactive
                    $this.removeClass("inactive");
                    $elem.removeClass("icon-eye-close").addClass("icon-eye-open");
                } else {
                    // close eye, mark inactive
                    $this.addClass("inactive");
                    $elem.removeClass("icon-eye-open").addClass("icon-eye-close");
                }
            }

            , attachEvents: function(item, fun) {
                var self = this
                  , viewDetail = function() {
                    // view detail
                    $.publish("module:detail", self.data);
                    // switch to detail panel
                    $("#metro-pivot").data("controller").goToItemByName("Detail");
                };

                // elem events
                this.$elem.on("mouseenter", function() {
                    $grid.find(".slot[id^=" + self.id + "-]").addClass("hover");
                });

                this.$elem.on("mouseleave", function() {
                    $grid.find(".slot[id^=" + self.id + "-]").removeClass("hover");
                });

                // info events
                this.$info.on("click", ".icon-on-cors", function(e) {
                    var onCORS = self.$elem.hasClass("on-cors");

                    self.$elem.toggleClass("on-cors");
                    self.data.set("onCORS", !onCORS);

                    e.stopPropagation();
                });

                // method events
                this.$method.on("click", ".detail", viewDetail);

                this.$method.on("click", ".timetable", function() {
                    var $this = $(this).find("i");

                    if ($this.hasClass("icon-eye-open")) {
                        // remove slots on timetable
                        $this.removeClass("icon-eye-open").addClass("icon-eye-close");
                        // mark the slot inactive
                        self.$elem.addClass("inactive");
                        // update module status
                        self.data.set("visible", false);
                        // remove all the slots from timetable
                        $grid.find(".slot[id^=" + self.id + "-]").remove();
                    } else {
                        // add slots to timetable
                        $this.removeClass("icon-eye-close").addClass("icon-eye-open");
                        // remove the inactive
                        self.$elem.removeClass("inactive");
                        // update module status
                        self.data.set("visible", true);
                        // allocate the slots on timetable
                        $.publish("grid:module:reallocate", self.data);
                    }
                });

                this.$method.on("click", ".remove", function() {
                    // hide tooltip
                    $(this).tooltip("destroy");
                    // tell all clashing modules
                    self.removeClash();
                    // remove all the slots from timetable
                    $grid.find(".slot[id^=" + self.id + "-]").remove();
                    // check empty rows and remove it
                    $.publish("grid:rows:clearEmpty");
                    // remove the DOM
                    self.$elem.fadeOut(500, function() {
                        // remove DOM itself
                        self.$elem.remove();
                        // publish event
                        $.publish("module:remove", self.id);
                    });
                });
            }

            , subscribeEvents: function() {
                var self = this;

                $.subscribe("module:clean:all", function() {
                    self.$method.find(".remove").trigger("click");
                });

                this.$elem.on("clash.add", function(e, mod) {
                    if ($.isArray(mod)) {
                        if (mod.length === 0) {
                            return ;
                        }

                        self.clash = self.clash.concat(mod);
                    } else {
                        self.clash.push(mod);
                    }

                    self.handleClash();
                });

                this.$elem.on("clash.remove", function(e, mod) {
                    var idx = $.inArray(mod, self.clash);

                    if (idx >= 0) {
                        self.clash.splice(idx, 1);
                    }

                    self.handleClash();
                });
            }

            , handleClash: function() {
                if (this.clash.length > 0 && !this.$elem.hasClass("clashing")) {
                    this.$elem.addClass("clashing");
                } else if (this.clash.length === 0) {
                    this.$elem.removeClass("clashing");
                }
            }

            , removeClash: function() {
                var i, len = this.clash.length, fstId;

                if (len < 0) { return ; }

                // keep the first -> comes with great responsibility
                fstId = this.clash.splice(0, 1)[0];

                // remove self from the first, add other clashes to it
                $("#" + fstId)
                    .trigger("clash.remove", [this.id])
                    .trigger("clash.add", [this.clash]);

                for (i = 1; i < len; i++) {
                    // remove self, and add the first
                    $("#" + this.clash[i])
                        .trigger("clash.remove", [this.id])
                        .trigger("clash.add", [fstId]);
                }
            }
        };

        /* PLUGIN DEFINITION
         * ======================================== */
        $.fn.module = function(options) {
            return this.each(function () {
                if (!$.data(this, _project + _pluginName)) {
                    $.data(this, _project + _pluginName, new Plugin(this, options));
                }
            });
        };

    }(jQuery));

});
