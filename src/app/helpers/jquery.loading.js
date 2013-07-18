/* ========================================
 * CORS Planner - jQuery Loading
 *
 * jQuery plugin for Loading effects
 *
 * Author: Wang Zhuochun
 * Last Edit: 10/Dec/2012 01:10 PM
 * ========================================
 * <License>
 * ======================================== */

define(function(require, exports) {

    "use strict";
    /*jshint jquery:true, laxcomma:true, browser:true, maxerr:50*/

    (function($) {

        var _project = "planner_"
          , _pluginName = "loading"
        // Plugin constructor
          , Plugin = function(element, options) {
            this.$elem = $(element);
            this.init(options);
          };

        Plugin.prototype = {
            constructor: Plugin

            , init: function(opt) {
                this.id = opt.id;
                this.animate = true;
                // select elem
                this.$method = this.$elem.find(".method");
                this.$load = this.$method.find("i");
                this.$info = this.$elem.find(".info");
                // attach animations
                this.attachAnimations();
                // subscribe events
                this.subscribeEvents();
            }

            , attachAnimations: function() {
                var self = this;

                (function loading() {
                    if (!self.animate) { return ; }

                    setTimeout(function() {
                        self.$load
                            .animate({"margin-top":"-5px"}, 100)
                            .animate({"margin-top":"25px"}, 900, function() {
                                self.$load.css("margin-top", "-20px");
                            })
                            .animate({"margin-top":"0px"}, 1000, function() {
                                loading();
                            });
                    }, 500);
                })();
            }

            , subscribeEvents: function() {
                var self = this;

                $.subscribeOnce("module:" + this.id + ":fetched", function() {
                    self.animate = false;
                    self.$elem.slideUp(function() {
                        self.$elem.remove();
                    });
                });
            }
        };

        /* PLUGIN DEFINITION
         * ======================================== */
        $.fn.loading = function(options) {
            return this.each(function () {
                if (!$.data(this, _project + _pluginName)) {
                    $.data(this, _project + _pluginName, new Plugin(this, options));
                }
            });
        };

    }(jQuery));

});
