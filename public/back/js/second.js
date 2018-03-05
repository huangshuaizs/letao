$(function () {
    //渲染列表信息 分页
    var page = 1;
    var pageSize = 5;
    var render = function() {
        $.ajax({
            type:'get',
            url:'/category/querySecondCategoryPaging',
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
    };
    render();


    //3.点击添加分类按钮 显示模态框 加载一级菜单数据
    //模态框显示
    $('.btn_add').on('click',function () {
        $('#secondModal').modal('show');

        $.ajax({
            type:'GET',
            url:"/category/queryTopCategoryPaging",
            data: {
                page:1,
                pageSize:100
            },
            success:function (info) {
                // console.log(info);

                $(".dropdown-menu").html( template("tmp2",info) );
            }
        });
    });

    //4.点击一级下拉列表下的内容 显示到菜单栏上
    $('.dropdown-menu').on('click','a',function () {
        var text = $(this).text();

        $('.dropdown_text').text(text);

        var id = $(this).parent().data('id');
        // console.log(id);
        $("[name='categoryId']").val(id);

        //让categoryId的校验通过
        $form.data("bootstrapValidator").updateStatus("categoryId", "VALID");
    });

    //5. 初始化图片上传
    //5.1 引入js文件 （jquery、 ui.widgt.js 、fileupload）
    //5.2 准备一个input:file的文本框，   name和data-url
    //5.3 初始化  fileupload
    $("#fileupload").fileupload({
        dataType:"json",
        //e：事件对象
        //data：图片上传后的对象，通过e.result.picAddr可以获取上传后的图片地址
        done:function (e, data) {
            // console.log(data);
            //上传后的图片地址
            var pic = data.result.picAddr;
            // console.log(pic);
            //显示出来
            $('.img_box img').attr('src',pic);

            //把图片路径给brandLogo
            $("[name='brandLogo']").val(pic);

            //让brandLogo校验成功
            $form.data("bootstrapValidator").updateStatus("brandLogo", "VALID");

        }
    });

    //6.表单校验功能
    var $form = $("form");
    $form.bootstrapValidator({
        //小图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        //校验规则
        fields:{
            categoryId:{
                validators:{
                    notEmpty:{
                        message:'请选择一级分类'
                    }
                }
            },
            brandName:{
                validators:{
                    notEmpty:{
                        message:'请输入品牌的名称'
                    }
                }
            },
            brandLogo: {
                validators:{
                    notEmpty:{
                        message:'请上传品牌的图片'
                    }
                }
            }
        },
        excluded:[]
    });


    //7. 添加二级分类
    $form.on("success.form.bv", function (e) {
        e.preventDefault();


        $.ajax({
            type:'POST',
            url:"/category/addSecondCategory",
            data: $form.serialize(),
            success:function (info) {
                if(info.success) {
                    //关闭模态框
                    $("#secondModal").modal("hide");
                    //重新渲染第一页
                    page = 1;
                    render();

                    //重置样式
                    $form.data("bootstrapValidator").resetForm(true);
                    $(".dropdown_text").text("请选择一级分类");
                    $(".img_box img").attr("src", "images/none.png");
                }
            }
        })
    })
})