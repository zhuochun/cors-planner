(function($) {
  var $r = $("#result")
  , Js = JSON.stringify
  , Trim = function(str) {
    return str.replace(/\\n\s*/g, " ").trim();
  }
  , Module = {};

  $r.detach();
  $r.append("<h1>jQuery Starts</h1>");

  var process = function(result) {
    if (!result.query.results) {
      // TODO: try again
    }

    // basic variables
    var data = result.query.results.tr
    , length = data.length
    , tstr
    , tarr;

    // log
    $r.append("<h2>JSON Result - " + length + "</h2>");

    tstr = Js(data[length-1]);

    // check whether the module exists
    if ( (/currently.not.available/i).test(tstr) ) {
      $r.append("<p>---> Module not available <---</p>");
    } else {
      // start processing
      $r.append("<p>---> Module available <---</p>");
      // get Module last update time
      var table = data[0].td.table[0].tr;
      // module correct as
      tstr = Js(table[0]);
      tarr = (/Correct as at (\d\d \w{3} \d{4} \d\d:\d\d)\"/).exec(tstr);
      Module.correctAsAt = tarr[1];

      // 0 - info, 1 - lecture, 2 - lab/tutorial
      var ttable = table[1].td.table;
      // module info
      processInfo(ttable[0]);
      // module lecture
      processLectures(ttable[1]);
      // module tutorials
      processTutorials(ttable[2]);

      $r.append(Js(Module));
      $r.append("<br/>== Lecture : <br/>");
      for (lect in Module.lectures) { $r.append(Module.lectures[lect] + "<br/>"); }
      $r.append("<br/>== Tutorials : <br/>");
      for (tut in Module.tutorials) { $r.append(Module.tutorials[tut] + "<br/>"); }
      $r.append("<br/>== Lab : <br/>");
      for (lab in Module.labs) { $r.append(Module.labs[lab] + "<br/>"); }
    }

    $("body").append($r);
  }; 

  var processInfo = function(table) {
    // module information = ttable[0]
    var tfun = function(e) { return e.p; }
    , info = {
      "title" : tfun
      , "description" : tfun
      , "examinable" : tfun
      , "examdate" : function(e) {
        try {
          if (e.p.content) {
            return Trim(e.p.content);
          }
        } catch (exp) {
          return e.p;
        }
      }
      , "credits" : function(e) { 
        return parseInt(e.p, 10);
      }
      , "prerequisite" : tfun
      , "preclusion" : tfun
      , "workload" : tfun
    }
    , i = 1
    , len = table.tr.length;

    for (var k in info) {
      Module[k] = info[k](table.tr[i++].td[1]);
    }
  };

  var processLectures = function(table) {
      // module lecture - ttable[1]
      Module.lectures = [];

      var ttable = table.tr[2].td.div.table
      , len = ttable.length
      , i = 0
      , tstr
      , tarr
      , slot;

      if (ttable.length === undefined) {
        tstr = Js(ttable.tr);

        if (/no lectures/.test(tstr)) {
          // no lecture
        } else if (/LECTURE Class.+\[(\w+)\](.+)\\n/.test(tstr)) {
          slot = RegExp.$1;

          Module.lectures[slot] = [];

          tarr = Trim(RegExp.$2).split(".");
          // TUESDAY From 1400 hrs to 1600 hrs in LT2, Week(s): EVERY WEEK
          //tarr = (/\b(\w+)\b From (\d{4}) hrs to (\d{4}) hrs in ((\w+\s?)+)/g).exec(tstr);

          var llen = tarr.length, j = 0;
          for (; j < llen - 1; j++) {
            Module.lectures[slot].push(tarr[j].trim());
          }
        }
      } else {
        len = ttable.length;

        for (; i < len; i++) {
          tstr = Js(ttable[i].tr);

          if (/LECTURE Class.+\[(\w+)\](.+)\\n/.test(tstr)) {
            slot = RegExp.$1;

            Module.lectures[slot] = [];

            tarr = Trim(RegExp.$2).split(".");
            // TUESDAY From 1400 hrs to 1600 hrs in LT2, Week(s): EVERY WEEK
            //tarr = (/\b(\w+)\b From (\d{4}) hrs to (\d{4}) hrs in ((\w+\s?)+)/g).exec(tstr);

            var llen = tarr.length, j = 0;
            for (; j < llen - 1; j++) {
              Module.lectures[slot].push(tarr[j].trim());
            }
          }
        }
      }
  };

  var processTutorials = function(table) {
      // module tutorials and labs - ttable[2]
      Module.labs = [];
      Module.tutorials = [];

      var ttable = table.tr[1].td.div.table
      , i = 0
      , tstr
      , tarr
      , slot
      , len = 0;

      len = (ttable === undefined) ? 0 : ttable.length;

      for (; i < len; i++) {
        tstr = Js(ttable[i].tr);

        if (/LABORATORY Class.+\[(\w+)\](.+)\\n/.test(tstr)) {
          slot = RegExp.$1;
          Module.labs[slot] = [];
          tarr = Trim(RegExp.$2).split(".");

          var llen = tarr.length, j = 0;
          for (; j < llen - 1; j++) {
            Module.labs[slot].push(tarr[j].trim());
          }
        } else if (/TUTORIAL Class.+\[(\w+)\](.+)\\n/.test(tstr)){
          slot = RegExp.$1;
          Module.tutorials[slot] = [];
          tarr = Trim(RegExp.$2).split(".");

          var llen = tarr.length, j = 0;
          for (; j < llen - 1; j++) {
            Module.tutorials[slot].push(tarr[j].trim());
          }
        }
      }
  };

  $.getJSON("json/cg1413.json", process); // no lecture -- passed
  //$.getJSON("json/cg2007.json", process); // lect + tut + lab -- passed
  //$.getJSON("json/acc1002x.json", process); // 2 lects + tut -- passed
  //$.getJSON("json/gek1531.json", process); // no tut + no lab -- passed
  //$.getJSON("json/null.json", process); // no such module -- passed
})(jQuery);
