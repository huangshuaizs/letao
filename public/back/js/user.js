$(function () {
    //1.发送ajax请求 渲染数据

    var page = 1;
    var pageSize = 20;
    function render() {
        $.ajax({
            type:'get',
            url:'/user/queryUser',
            data:{
                page:page,
                pageSize:pageSize
            },
            success:function (info) {
                // console.log(info);
                //渲染数据
                var html = template('tmp',info);
                $('tbody').html(html);


                //2.渲染分页
                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion:3,//默认是2，如果是bootstrap3版本，这个参数必填
                    currentPage:page,//当前页
                    totalPages:Math.ceil(info.total/info.size),//总页数
                    numberOfPages:5,//设置显示5页
                    onPageClicked:function (a,b,c,p) {
                        // console.log(p);
                        //修改p的值
                        page = p;
                        // console.log(page);
                        //重新渲染
                        render();
                    }
                });

            }
        })
    }
    render();

    //3.启用禁用用户
    $('tbody').on('click','.btn',function () {
        // alert('qq');
        //显示模态框
        $('#userModal').modal('show');
        //获取点击的用户的id和isDelete
        var id = $(this).parent().data('id');
        var isDelete = $(this).hasClass('btn-success')?1:0;
        // console.log(isDelete);
        //发送ajax请求
        //点击确定 发送请求
        $('.btn_confirm').off().on('click',function () {
            // alert('111');
            $.ajax({
                type:'post',
                url:'/user/updateUser',
                data:{
                    id:id,
                    isDelete:isDelete
                },
                success:function (info) {
                    console.log(info);
                    if(info.success){
                        //关闭模态框
                        $('#userModal').modal('hide');
                        //重新渲染
                        render();
                    }
                }
            })
        })

    })
})