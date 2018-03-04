$(function () {
    //1.禁用进度环
    NProgress.configure({
        showSpinner: false
    });

    $(document).ajaxStart(function () {
        //进度条加载效果
        NProgress.start();
    });
    $(document).ajaxStart(function () {
        setTimeout(function () {
            NProgress.done();
        }, 500);
    });


    //2.二级菜单的显示与隐藏
    $('.second').prev().on('click',function () {
        $(this).next().slideToggle();
    })

    //3.侧边栏隐藏
    $('.icon_menu').on('click',function () {
        console.log('111');
        $('.lt_aside').toggleClass('now');
        $('.lt_main').toggleClass('now');
    })

    //4.退出功能
    $('.icon_logout').on('click',function () {

        //显示模态框
        $('#logoutModal').modal('toggle');
    });

    //4-1.//告诉服务器销毁session
    $('.btn-logout').on('click',function () {
        //告诉服务器销毁session
        $.ajax({
            type:'get',
            url:'/employee/employeeLogout',
            success:function (info) {
                console.log(info);
                if(info.success){
                    location.href = 'login.html';
                }
            }
        })
    })

    //4-2.登录页面之外的页面访问时服务器要验证是否登录
    if(location.href.indexOf('login.html')==-1) {
        $.ajax({
            type: 'get',
            url: '/employee/checkRootLogin',
            dataType: 'json',
            success: function (info) {
                // console.log(info);

                if(info.error == 400){
                    location.href = 'login.html';
                }
            }
        })
    }
})