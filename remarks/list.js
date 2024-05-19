function getURLParam(name) {
    // 获取完整的URL
    const urlString = window.location.href;

    // 解析URL
    const url = new URL(urlString);

    return url.searchParams.get(name);
}

$(function () {
    const origin = getURLParam('origin');
    if (origin === 'qq') {
        $('body').addClass('show');
        $("#content").fadeIn(200);
        if (getURLParam('showHidden') === 'true') {
            window.showHidden = true;
            $("#shownHidden").show();
        }
    } else if (origin === 'index') {
        $('body').addClass('show');
        $("#askWho").fadeIn(200);
    } else {
        alert(`请勿刷新页面或复制网址，请使用原链接重新进入`);
        window.close();
    }
    document.addEventListener("click", function (event) {
        const $clickedElement = event.target;
        if ($clickedElement.dataset.target) {
            const newWindow = window.open(`${$clickedElement.dataset.target}?origin=${origin}`);
            // 在新窗口加载完成时执行脚本
            $(newWindow).on("load", function () {
                $(newWindow.document.body).addClass("show");
                if (window.showHidden) {
                    $(newWindow.document.body).addClass("show-hidden");
                }
            });
        }
        if ($clickedElement.dataset.details) {
            const details = JSON.parse($clickedElement.dataset.details);
            const target = $($clickedElement).parent().parent().find('[data-target]').attr('data-target');
            $('#myModalLabel').html(`<b>${$($clickedElement).parent().parent().find('td').eq(0).text().trim()}</b> 的摘要 <b>（AI生成）</b>`);
            const $ol = $(`<ol></ol>`);
            $('#myModalBody').empty().append($ol);
            for (const detail of details) {
                $ol.append(`<li>${detail}</li>`);
            }
            $('#viewComplete').attr('data-target', target);
            $('#myModal').modal('show');
        }
    });
    // 获取当前URL
    const currentUrl = window.location.href;

    // 清空URL参数
    const newUrl = currentUrl.split('?')[0];

    // 使用replaceState更新浏览器历史记录，不会触发页面刷新
    window.history.replaceState({}, document.title, newUrl);
});