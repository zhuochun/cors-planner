var fs = require('fs'),
    content = fs.readFileSync("src/index.html", "utf8");

console.log("==> Start clean-up index.html");

// replace rel attribute for less file with rel for css
content = content.replace(/stylesheet\/less/gi, "stylesheet");
// replace file name
content = content.replace(/less\/style.less/gi, "css/style.css");

console.log("Changed stylesheet style.less -> style.css");

// remove less runtime compiler (if needed)
content = content.replace(/<script.*?\bless\b[^"']*?\.js.*?<\/script>/g, "");

console.log("Removed less runtime js compiler");

// change jQuery to google CDN
var CDN = "<script src=\"http://ajax.googleapis.com/ajax/libs/jquery/$1/jquery.min.js\"></script><script>window.jQuery || document.write('<script src=\"js/libs/jquery-$1.js\"><\\\/script>')</script>";
content = content.replace(/<script.*?\bjquery-\b([^"'u]*?)\.js.*?<\/script>/g, CDN);

console.log("Changed jQuery to use Google CDN jQuery");

// update build time in html for reference
content = content.replace(/<build-status>/g, new Date());

console.log("Build status date updated");

// write file back
fs.writeFileSync("release/index.html", content, "utf8");

console.log("==> Clean-up index.html Finished -> release/index.html updated");
