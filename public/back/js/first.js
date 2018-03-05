$(function () {
    //渲染列表信息 分页
    var page = 1;
    var pageSize = 5;
    function render() {

        $.ajax({
            type:'get',
            url:'/category/queryTopCategoryPaging',
            data:{
                page:page,
                pageSize:pageSize
            },
            success:function (info) {
                // console.log(info);
                //渲染数据
                $('tbody').html(template('tmp',info));

                //2.渲染分页
                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion:3,//默认是2，如果是bootstrap3版本，这个参数必填
                    currentPage:page,//当前页
                    totalPages:Math.ceil(info.total/info.size),//总页数
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

    //3.添加分类功能
    //模态框显示
    $('.btn_add').on('click',function () {
        $('#firstModal').modal('show');
    })

    //表单校验
    var $form = $('form');
    $form.bootstrapValidator({
        //小图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        //配置校验的规则
        fields:{
            categoryName:{
                validators:{
                    notEmpty:{
                        message:'一级分类不能为空'
                    }
                }
            }
        }
    });

    //给表单注册一个校验成功的时间 成功的时候阻止表单的提交 使用ajax进行
    $form.on('success.form.bv',function (e) {
        e.preventDefault();

        $.ajax({
            type:'post',
            url:'/category/addTopCategory',
            data:$form.serialize(),
            success:function (info) {
                console.log(info);

                if(info.success){
                    //模态框消失
                    $('#firstModal').modal('hide');
                    //重置表单的样式和内容
                    $form.data("bootstrapValidator").resetForm(true);
                    //重新渲染
                    page = 1;
                    render();
                }
            }
        })

    })
})