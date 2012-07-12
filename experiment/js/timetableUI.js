(function($) {
  var module1 = {
    lectures : {
      "A1" :  
        { day : "monday",  time : 10, hour : 2 }
      ,
      "A2" : 
        { day : "wednesday", time : 10, hour : 2 }
      // TODO: array not working yet
    }
  };

  function dragEvent(module) {
      return function() {
        var lect = module.lectures;

        for (var i in lect) {
          var div = $("<div>").addClass("event temp-slot lect-" + i).attr({ "data-day": lect[i].day, "data-time": lect[i].time, "data-hour": lect[i].hour }).text("Drop Here 1");

          $("#events").append(div);

          $("#events").find(".temp-slot").droppable({
            activeClass: "hover-event"
            , hoverClass: "active-event"
            , drop: function(event, ui) {
              ui.draggable.remove();

              $(this).css("background-color", "grey").removeClass("temp-slot");
              $(this).draggable({
                cursor: "move"
                , opacity: 0.6
                , revert: "invalid"
                , start: dragEvent(module1)
                , stop: function() {
                  $("#events").find(".temp-slot").remove();
                }
              });

              $("#events").find(".temp-slot").remove();
            }
          });
        }
    }
  }

  $(".draggable").draggable({
    cursor: "move"
    , opacity: 0.6
    , revert: "invalid"
    , start: dragEvent(module1)
    , stop: function() {
      $("#events").find(".temp-slot").remove();
    }
  });

})(jQuery);
