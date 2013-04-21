/* ========================================
 * Require Configurations for CORS Planner
 *
 * Author: Wang Zhuochun
 * Last Edit: 20/Apr/2013 06:11 PM
 * ======================================== */

    /*jshint browser:true, jquery:true, laxcomma:true, maxerr:50*/

/* RequireJs Configurations */
require.config({

    baseUrl : "js"

  , paths : {
    // RequireJS plugins
        "hgn" : "libs/requirejs-plugins/hgn"
      , "text" : "libs/requirejs-plugins/text"
      , "hogan" : "libs/requirejs-plugins/hogan"
    // jQuery plugins
      , "plugin" : "libs"
    // App directories
      , "appMain" : "../app/appMain"
      , "global" : "../app/global"
      , "api" : "../app/api"
      , "model" : "../app/models"
      , "view" : "../app/views"
      , "controller" : "../app/controllers"
      , "helper" : "../app/helpers"
    // App data
      , "school" : "../schools"
    // Helper Utils
      , "util" : "utils"
    // Templates
      , "template" : "../app/templates"
    }

    // configure hgn! plugin
  , hgn : {
        templateExtension : '.mustache'
    }
});

/* Require Start */
require(["global", "appMain"], function(g, App) {
    $(function() {
        App.init();
    });
});
