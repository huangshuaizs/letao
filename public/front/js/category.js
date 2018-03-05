$(function () {
    //1.一级分类渲染
    $.ajax({
        type:'get',
        url:'/category/queryTopCategory',
        success:function (info) {
            console.log(info);

            //渲染数据
            $('.first').html(template('tmp',info));

            //一级分类渲染之后渲染二级分类
            renderSecond(info.rows[0].id);
        }
    });

    //2.点击一级分类 渲染二级分类
    $('.first').on('click','li',function () {
        $(this).addClass('now').siblings().removeClass('now');
        //获取id
        var id = $(this).data('id');
        //重新渲染二级分类
        renderSecond(id);

    })
    

    //渲染二级分类的函数
    function renderSecond(id) {
        $.ajax({
            type:'get',
            url:'/category/querySecondCategory',
            data:{id:id},
            success:function (info) {
                console.log(info);
                $('.second').html(template('tmp2',info));
            }
        })
    }
})