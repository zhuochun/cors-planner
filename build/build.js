// command: node r.js -o build.js
({
// basic build address setting
    appDir: "../src/"
  , baseUrl: "js"
  , dir: "../release/"

  , mainConfigFile: '../src/js/main.js'

//Set paths for modules. If relative paths, set relative to baseUrl above.
//If a special value of "empty:" is used for the path value, then that
//acts like mapping the path to an empty file. It allows the optimizer to
//resolve the dependency to path, but then does not include it in the output.
//Useful to map module names that are to resources on a CDN or other
//http: URL when running in the browser and during an optimization that
//file should be skipped because it has no dependencies.
  , paths: { }

// optimze all the JS files
  , optimize: "uglify"
// do not optimize css since we use less
  , optimizeCss: "none"

//Inlines the text for any text! dependencies, to avoid the separate
//async XMLHttpRequest calls to load those dependencies.
  , inlineText: true

//Allow "use strict"; be included in the RequireJS files.
//Default is false because there are not many browsers that can properly
//process and give errors on code for ES5 strict mode,
//and there is a lot of legacy code that will not work in strict mode.
  , useStrict: false

//Specify modules to stub out in the optimized file. The optimizer will
//use the source version of these modules for dependency tracing and for
//plugin use, but when writing the text into an optimized layer, these
//modules will get the following text instead:
  , stubModules: ['text', 'hgn']

// Optimize the application files.
  , modules: [
       {
           name: "main"
         , exclude: []
       }
    ]

// Exclude less folder
  , fileExclusionRegExp: /^.*(less).*$/

// License
  , preserveLicenseComments: false

})
