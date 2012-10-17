$(function() {

    var $planner = $("#planner")
      , $detail = $("#detail")

      $(window).on("resize", function() {

        // height
        var height = $(this).height();
        $planner.height(height - 200); // 200 = detail height

        // addmodule width
        var width = $("#addmodule").width();
        $("#addmodule").find("input[type=text]").width(width - 60 - 14);

      }).trigger("resize");

});
