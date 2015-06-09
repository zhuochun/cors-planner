// Author: Wang Zhuochun
// Last Edit: 10/Jun/2015 00:39 PM

// ========================================
// Require: phantomjs @ http://phantomjs.org/
// Usage:
//     phantomjs crawl-degrees.js
// ========================================

/*jshint browser:true, jquery:true, laxcomma:true, maxerr:50 */

var page = require("webpage").create()
  , fs = require("fs");

// Route "console.log()" calls from within the Page context to the main Phantom context (i.e. current "this")
page.onConsoleMessage = function(msg) {
    console.log(msg);
};

// Heading
console.log("\n************* CORS PLANNER **************");
console.log("*** Crawl NTU Degrees Provided ***");
console.log("*****************************************\n");

// Variables
var url = 'http://wish.wis.ntu.edu.sg/webexe/owa/aus_schedule.main'
  , output = 'degrees.js'

var timeStart = new Date();

// Open Degrees Listing
page.open(encodeURI(url), function (status) {
    // Check for page load success
    if (status !== "success") {
        console.log("===! Unable to access network\n");
    } else {
        console.log("===> Page Loaded");

        // Execute some DOM inspection within the page context
        var result = page.evaluate(function() {
            var options = document.getElementsByTagName("option")
              , i, option, result = [];

            console.log("===> Options " + options.length);

            // loop through options to get degrees
            for (i = 0; (option = options[i]); i++) {
              if (option.textContent && option.value && option.value.match(/(?:[A-Z0-9]*;){3}[A-Z0-9]*/)) {
                result.push(option.value);
              }
            }

            console.log("===> Found " + result.length + " Degrees");

            return result;
        });

        outputFile(output, result);

        var totalTime = new Date() - timeStart;
        console.log("Spent " + (totalTime / 1000).toFixed(2) + "s");
    }

    phantom.exit();

    // ouput module information
    function outputFile(output, result) {
        console.log("===> Output to file [" + output + "]");

        fs.write(output, "exports.degrees=" + JSON.stringify(result), "w");

        console.log("===> Output Completed");
    }
});
