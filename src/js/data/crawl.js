// Author: Wang Zhuochun
// Last Edit: 06/Sep/2012 03:24 AM

/* ========================================
 * Steps:
 *
 * 0. Use Chrome or Firefox
 * 1. Go to CORS Module Listing Page:
 *      https://aces01.nus.edu.sg/cors/jsp/report/ModuleInfoListing.jsp
 * 2. Open Console, Copy and paste below code and run it.
 * 3. The data will be appended at the end of the page.
 *    Copy it and replace all the code in `corsModuleCodes.js`
 * 4. Remember to change `planner.dataUpdate` content in
 *      `js/app/global.js`
 * ======================================== */

var i, length, table, trs, tds, result = [];

table = document.getElementsByClassName("tableframe")[0];

// get all rows
trs = table.getElementsByTagName("tr");

// loop through rows to get information
for (i = 1, length = trs.length; i < length; i++) {
    tds = trs[i].getElementsByTagName("td");
    result.push(tds[1].textContent.trim() + " " + tds[2].textContent.trim());
}

// create div to contain result
i = document.createElement("div");
i.textContent = "define(function(){return" + JSON.stringify(result) + "});";

// append to body
document.getElementsByTagName("body")[0].appendChild(i);
