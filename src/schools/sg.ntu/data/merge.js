// need to change list to `exports.codes = [];`

var oList = require("./list.old.js").codes
  , nList = require("./list.new.js").codes
  , fs = require("fs");

console.log("Old List Length:");
console.log(oList.length);

console.log("New List Length:");
console.log(nList.length);

for (var i = 0, len = nList.length; i < len; i++) {
    if (oList.indexOf(nList[i]) < 0) {
        oList.push(nList[i]);
        //console.log(nList[i]);
    }
}

console.log("Merged List Length:");
console.log(oList.length);

outputFile("./list.js", oList);

// ouput module information
function outputFile(output, result) {
    console.log("===> Output to file [" + output + "]");

    fs.writeFileSync(output, "define(function(){return " + JSON.stringify(result) + "});", "utf8");

    console.log("===> Output Completed");
}
