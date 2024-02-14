function getURLParam(name) {
    // 获取完整的URL
    const urlString = window.location.href;

    // 解析URL
    const url = new URL(urlString);

    return url.searchParams.get(name);
}

$(function () {
    $("ul").addClass("collapse in");
    $("#details").parent().collapse("hide");
    $(".panel-heading").mousedown(function () {
        $(this).next().collapse("toggle");
    });
    $("#showAll").click(function () {
        $(".panel-heading").next().collapse("show");
    });
    $("#hideAll").click(function () {
        $(".panel-heading").next().collapse("hide");
    });
    $("img").addClass("img-thumbnail").addClass("img-responsive").click(function () {
        window.open($(this).attr("src"));
    }).each(function () {
        if (this.height > 500) {
            // 如果是，将其display属性设置为block
            $(this).css({"display": "block"});
        }
    });
    $("[data-id] .bg-id").each(function () {
        $(this).html($(this).parent().attr("data-id"));
    });
    $(".hidden-content").click(function () {
        alert(`此内容（[ID: ${$(this).parent().parent().attr("data-id")}] “${$(this).parent().parent().find(".content").text().replace(/[\s\n]+/g, ' ').trim()}”）默认隐藏，你能看到此内容是由于特殊的打开途径。
        
查看隐藏内容需要确保你对我本人足够熟悉，同时，查看隐藏内容意味着您必须保证不在未经myworldzycpc允许的情况下传播或曲解隐藏内容中的一切内容，包括但不限于文字传播、口头传播、截屏、录屏、拍照、直播、链接、网页以及通过其他媒体渠道散播于众或转告他人。

任何未经授权（包括但不限于通过F12、view-source等途径查看隐藏内容等）的人不得承认隐藏内容在此网页上存在。

如果对自己此方面的能力存在质疑，或者你并没有经过我的授权而是通过其他人转发链接等途径看到此隐藏内容，请立刻返回首页并通过首页开放链接进入。`);
    });
    const origin = getURLParam('origin');
    if (origin !== 'qq' && origin !== 'index') {
        alert(`请勿刷新页面或复制网址，请使用原链接重新进入`);
        window.close();
    }
    // 获取当前URL
    const currentUrl = window.location.href;

    // 清空URL参数
    const newUrl = currentUrl.split('?')[0];

    // 使用replaceState更新浏览器历史记录，不会触发页面刷新
    window.history.replaceState({}, document.title, newUrl);
});
