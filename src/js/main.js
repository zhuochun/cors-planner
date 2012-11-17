/* ========================================
 * Require Configurations for CORS Planner
 *
 * Author: Wang Zhuochun
 * Last Edit: 21/Jul/2012 04:35 PM
 * ======================================== */

    /*jshint browser:true, jquery:true, laxcomma:true, maxerr:50*/

/* RequireJs Configurations */
require.config({

    baseUrl : "js/libs"

  , paths : {
    // jQuery plugins
        "jquery.ui" : "jquery-ui-1.8.23.custom"
    // RequireJS plugins
      , "hgn" : "requirejs-plugins/hgn"
      , "text" : "requirejs-plugins/text"
      , "hogan" : "requirejs-plugins/hogan"
    // App directories
      , "app" : "../app"
      , "api" : "../app/api"
      , "modal" : "../app/modals"
      , "view" : "../app/views"
      , "controller" : "../app/controllers"
      , "helper" : "../app/helpers"
    // App data
      , "corsModulesData" : "../data/corsModuleCodes"
    // Helper Utils
      , "util" : "../utils"
    // Templates
      , "template" : "../../templates"
    }

    // configure hgn! plugin
  , hgn : {
        templateExtension : '.mustache'
    }
});

/* Require Start */
require(["app/app"], function(App) {
    $(function() {
        App.init();
    });
});
