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

// Optimize the application files.
  , modules: [
        {
            name: "main"
          , exclude: ["bootstrap"]
        }
    ]

// Exclude less folder
  , fileExclusionRegExp: /^.*(less|modernizr|data).*$/

})
