// command: node r.js -o build.js
({
// basic build address setting
    appDir: "../src/"
  , baseUrl: "js"
  , dir: "../release"
  , mainConfigFile: "../src/js/main.js"

// optimze all the JS files
  , optimize: "uglify"
// do not optimize css since we use less
  , optimizeCss: "none"

//Inlines the text for any text! dependencies, to avoid the separate
//async XMLHttpRequest calls to load those dependencies.
  , inlineText: true

// If you want to exclude files from being included,
// and just need to map "dependency" for the build,
// then use the special "empty:" paths config:
  , paths: {
        
    }

//Specify modules to stub out in the optimized file. The optimizer will
//use the source version of these modules for dependency tracing and for
//plugin use, but when writing the text into an optimized layer, these
//modules will get the following text instead:
  , stubModules: ['text', 'hgn']

// Optimize the application files.
  , modules: [
        {
            name: "main"
          , exclude: ["bootstrap", "jquery-ui", "moduleCodes"]
        }
    ]

// Exclude less folder
  , fileExclusionRegExp: /^.*(less|modernizr).*$/

// License
  , preserveLicenseComments: false

})
