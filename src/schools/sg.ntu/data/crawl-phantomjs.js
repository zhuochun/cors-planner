// Author: Wang Zhuochun
// Last Edit: 20/Apr/2013 11:42 PM

// ========================================
// Require: phantomjs @ http://phantomjs.org/
// Usage:
//     phantomjs crawl-phantomjs.js [-o outputFilename] [-n]
// ========================================

/*jshint browser:true, jquery:true, laxcomma:true, maxerr:50 */

var page = require("webpage").create()
  , fs = require("fs")
  , sys = require("system")
  , list = require("./degrees").degrees;

// Route "console.log()" calls from within the Page context to the main Phantom context (i.e. current "this")
page.onConsoleMessage = function(msg) {
    console.log(msg);
};

// Heading
console.log("\n************* CORS PLANNER **************");
console.log("*** Crawl NTU Module Code and Titles ***");
console.log("*****************************************\n");

// Variables
var sem = (function(today) {
        var year = today.getFullYear()
          , month = today.getMonth(); // month is [0, 11]

        // Jan 0 - July 6 (this year sem 2)
        // Aug 7 - Nov 10 (next year sem 1)
        // Dec 11 (next year sem 2)
        if (month <= 6) {
            return (year - 1) + ";2";
        } else if (month >= 11) {
            return year + ";2";
        } else {
            return year + ";1";
        }
    })(new Date())
  , url = function(degree) {
        return "https://wish.wis.ntu.edu.sg/webexe/owa/AUS_SCHEDULE.main_display1?staff_access=false&r_course_yr=" +
            degree + "&boption=CLoad&ACADSEM=" + sem;
    }
  , school = "sg.ntu"
  , output = "list.js"//"src/schools/" + school + "/data/list.js"
  , update = true, global = "src/schools/" + school + "/info.js";

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

var i, llength = list.length;

console.log("list length = " + llength);

fs.write(output, "define(function(){return ", "w");

visitPage(0, []);

function visitPage(idx, rs) {
    // exit
    if (idx >= 2/*llength*/) {
        fs.write(output, "]});", "a");

        page.close();

        phantom.exit();

        return ;
    }

    // Open Each Degree Module Listings
    console.log("Visit page: " + url(list[idx]));

    page.open(encodeURI(url(list[idx])), function (status) {
        // Check for page load success
        if (status !== "success") {
            console.log("===! Unable to access network\n");
        } else {
            console.log("===> Page Loaded");

            // Execute some DOM inspection within the page context
            var result = page.evaluate(function() {
                var j, len, tbodys, tds, result = [];

                tbodys = document.getElementsByTagName("tbody");

                for (j = 0, len = tbodys.length; j < len; j++) {
                    tds = tbodys[j].firstChild.getElementsByTagName("font");

                    if (tds.length === 3)
                        result.push(tds[0].textContent.trim() + " " + tds[1].textContent.trim());
                }

                console.log("===> Found " + result.length + " Modules");

                return result;
            });

            var str = JSON.stringify(result);
            fs.write(output, str.substring(1, str.length - 1), "a");

            visitPage(idx + 1);
        }
    });
}

// update global information
function updateFile(global) {
    console.log("===> Update global Info [" + global + "]");

    var file = fs.open(global, "rw"), content = file.read();

    content = content.replace(/lastUpdate\s*:\s*(\".*\")/,
                              "lastUpdate: \"" + (new Date()) + "\"");

    file.write(content);
    file.flush();
    file.close();

    console.log("===> Update Completed");
}
