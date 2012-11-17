$(function() {

    var $planner = $("#planner")
      , $detail = $("#detail")
      ;

    $(window).on("resize", function() {

      // height
      var height = $(this).height();
      $planner.height(height - 200); // 200 = detail height

      // addmodule width
      var width = $("#addmodule").width();
      $("#addmodule").find("input[type=text]").width(width - 60 - 14);

      // module
      $(".module").width(Math.floor((width - 10) / 2) - 21);

    }).trigger("resize");

    $("#detail-title").click(function() {
        
        $detail.fadeOut("slow", function() {
            $planner.height($(window).height());
        });

    });

    $("div.metro-pivot").metroPivot();

});
