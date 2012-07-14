/* ========================================
 * Require Configurations for CORS Planner
 *
 * Author: Wang Zhuochun
 * Last Edit: 14/Jul/2012 04:09 PM
 * ======================================== */

/* RequireJs Configurations */
require.config({
    baseUrl : "js/libs"

  , paths : {
        "bootstrap" : "bootstrap/bootstrap.min"
      , "app" : "../app"
      , "api" : "../app/api"
      , "modal" : "../app/modals"
      , "util" : "../utils"
      , "test" : "../../../test"
    }
});

/* Require Start */
require(["app/app"], function(App) {
    $(function() {
        App.init();
    });
});
