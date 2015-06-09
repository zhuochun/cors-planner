// Author: Wang Zhuochun
// Last Edit: 16/Sep/2012 04:52 PM

// ========================================
// Require: phantomjs @ http://phantomjs.org/
// Usage:
//     phantomjs crawl-phantomjs.js [-o outputFilename] [-n]
// ========================================

var page = require("webpage").create()
  , fs = require("fs")
  , sys = require("system");

// Route "console.log()" calls from within the Page context to the main Phantom context (i.e. current "this")
page.onConsoleMessage = function(msg) {
    console.log(msg);
};

// Heading
console.log("\n************* CORS PLANNER **************");
console.log("*** Crawl CORS Module Code and Titles ***");
console.log("*****************************************\n");

// Variables
var url = "https://myaces.nus.edu.sg/cors/jsp/report/ModuleInfoListing.jsp"
  , output = "list.js"
  , update = true, global = "../info.js";

// Args
if (sys.args.length > 1) {
    for (var i = 1; i < sys.args.length; i++) {
        if (sys.args[i] === "-o") {
            output = sys.args[i+1] + ".js";
        } else if (sys.args[i] === "-n") {
            update = false;
        }
    }
}

var timeStart = new Date();

// Open CORS Module Listings
page.open(encodeURI(url), function (status) {
    // Check for page load success
    if (status !== "success") {
        console.log("===! Unable to access network\n");
    } else {
        console.log("===> Page Loaded");

        // Execute some DOM inspection within the page context
        var result = page.evaluate(function() {
            var i, len, table, trs, tds, result = [];

            table = document.getElementsByClassName("tableframe")[0];

            // get all rows
            trs = table.getElementsByTagName("tr");

            // loop through rows to get information
            for (i = 1, len = trs.length; i < len; i++) {
                tds = trs[i].getElementsByTagName("td");
                result.push(tds[1].textContent.trim() + " " + tds[2].textContent.trim());
            }

            console.log("===> Found " + result.length + " Modules");

            return result;
        });

        outputFile(output, result);

        if (update) {
            updateFile(global, result.length);
        }

        var totalTime = new Date() - timeStart;
        console.log("Spent " + (totalTime / 1000).toFixed(2) + "s");
    }

    phantom.exit();

    // ouput module information
    function outputFile(output, result) {
        console.log("===> Output to file [" + output + "]");

        fs.write(output, "define(function(){return " + JSON.stringify(result) + "});", "w");

        console.log("===> Output Completed");
    }

    // update global information
    function updateFile(global, length) {
        console.log("===> Update global Info [" + global + "]");

        var file = fs.open(global, "rw"), content = file.read();

        content = content.replace(/lastUpdate\s*:\s*(\".*\")/,
                                  "lastUpdate: \"" + (new Date()) + "\"");
        content = content.replace(/modules\s*:\s*(\d*)/,
                                  "modules: " + length);

        file.write(content);
        file.flush();
        file.close();

        console.log("===> Update Completed");
    }
});
