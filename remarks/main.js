$(function () {
    $("[data-to]").each(function () {
        const to = $(this).attr("data-to");
        const $heading = $(`<div class="panel-heading">To: </div>`);
        for (const toOne of to.split(",")) {
            $heading.append(`<span class="badge to-${toOne}">${toOne}</span> `);
        }
        $(this).removeClass("panel-default").addClass("panel-warning").prepend($heading);
    });
    $("img").addClass("img-thumbnail").addClass("img-responsive").click(function () {
        window.open($(this).attr("src"));
    });
});