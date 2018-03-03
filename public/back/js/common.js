$(function () {
    //禁用进度环
    NProgress.configure({
        showSpinner: false
    });

    $(document).ajaxStart(function () {
        //进度条加载效果
        NProgress.start();
    });
    $(document).ajaxStart(function () {
        NProgress.done();
    })
})