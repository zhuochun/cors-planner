var fs = require('fs'), content = fs.readFileSync("src/index.html", "utf8");
// log
console.log("==> Start clean-up index.html");

// replace rel attribute for less file with rel for css
content = content.replace(/stylesheet\/less/gi, "stylesheet");
// replace file name
content = content.replace(/less\/style.less/gi, "css/style.css");
// log
console.log("Changed stylesheet style.less -> style.css");

// remove less runtime compiler (if needed)
content = content.replace(/<script.*?\bless\b[^"']*?\.js.*?<\/script>/g, "");
// log
console.log("Removed less runtime js compiler");

// change jQuery to google CDN
var CDN = "<script src=\"http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js\"></script><script>window.jQuery || document.write('<script src=\"js/libs/jquery-1.7.2.js\"><\\\/script>')</script>";
content = content.replace(/<script.*?\bjquery-\b[^"']*?\.js.*?<\/script>/g, CDN);
// log
console.log("Changed jQuery to use Google CDN jQuery");

// write file back
fs.writeFileSync("release/index.html", content, "utf8");
// log
console.log("==> Clean-up index.html Finished -> release/index.html updated");
