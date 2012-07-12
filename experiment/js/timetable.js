(function($) {
  $("#cg2007-lect-1").on('draginit', function(ev, drag) {
    //drag.ghost();

    $("<div>").attr({"class" : "col col-3 span span-830"}).text("move here").appendTo("#wednesday").addClass("drop");
  });

  $(".drop").on({
    "dropover" : function(ev, drop, drag) {
      $(this).css("background-color", "green");
    },
    "dropout" : function(ev, drop, drag) {
      $(this).css("background-color", "grey");
    },
    "dropon" : function(ev, drop, drag) {
      $(this).html(drag.element.html());
      $(this).css("background-color", "navy");
    }
  });

  $("<div>").attr({"class" : "col col-3 span span-1230 drop"}).text("hello here").appendTo("#friday");
  $("#friday").append("<div class='col col-2 span span-830 drop'>A Here");
})(jQuery);
