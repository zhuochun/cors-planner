/* ========================================
 * Require Configurations for CORS Planner
 *
 * Author: Wang Zhuochun
 * Last Edit: 21/Jul/2012 04:35 PM
 * ======================================== */

    /*jshint browser:true, jquery:true, laxcomma:true, maxerr:50*/
    console.log("require main.test");

/* RequireJs Configurations */
require.config({

    baseUrl : "../src/js"

  , paths : {
          "bootstrap" : "libs/bootstrap"
        , "jquery-ui" : "libs/jquery-ui-1.8.23.custom"
        // App directories
        , "api" : "app/api"
        , "modal" : "app/modals"
        , "view" : "app/views"
        , "controller" : "app/controllers"
        , "helper" : "app/helpers"
        , "util" : "utils"
        , "template" : "templates"
        // RequireJS Plugins
        , "hgn" : "libs/requirejs-plugins/hgn"
        , "text" : "libs/requirejs-plugins/text"
        , "json" : "libs/requirejs-plugins/json"
        , "hogan" : "libs/requirejs-plugins/hogan"
        // Jasmine Specs
        , "spec" : "../../test/spec"
        , "testData" : "../../test/json"
    }

});
