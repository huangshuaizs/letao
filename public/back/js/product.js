$(function () {

    //1.渲染列表信息 分页
    var page = 1;
    var pageSize = 5;
    var result = [];

    var render = function () {
        $.ajax({
            type:'get',
            url:'/product/queryProductDetailList',
            data:{
                page:page,
                pageSize:pageSize
            },
            success:function (info) {
                // console.log(info);
                //渲染数据
                $('tbody').html(template('tmp',info));

                //渲染分页
                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion:3,//默认是2，如果是bootstrap3版本，这个参数必填
                    currentPage:page,//当前页
                    totalPages:Math.ceil(info.total/info.size),//总页数
                    itemTexts:function (type,page,current) {
                        // console.log(type, page, current);

                        switch (type){
                            case 'first':
                                return '首页';
                            case 'prev':
                                return '上一页';
                            case 'next':
                                return '下一页';
                            case 'last':
                                return '尾页';
                            default:
                                return '第'+page+'页';
                        }
                    },
                    tooltipTitles:function (type,page,current) {
                        // console.log(type, page, current);
                        switch (type){
                            case 'first':
                                return '首页';
                            case 'prev':
                                return '上一页';
                            case 'next':
                                return '下一页';
                            case 'last':
                                return '尾页';
                            default:
                                return '第'+page+'页';
                        }
                    },
                    useBootstrapTooltip:true,
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

    //2.添加商品
    $('.btn_add').on('click',function () {
        //显示模态框
        $('#productModal').modal('show');

        //发送ajax 查询二级分类

        $.ajax({
            type:'get',
            url:'/category/querySecondCategoryPaging',
            data:{
                page:1,
                pageSize:100
            },
            success:function (info) {
                // console.log(info);
                //渲染二级分类
                $('.dropdown-menu').html(template('tmp2',info));
            }
        })
    });

    //3.给dropdown-menu下的a注册事件
    $('.dropdown-menu').on('click','a',function () {
        //改变内容
        $('.dropdown_text').text($(this).text());
        //获取id
        $('[name="brandId"]').val($(this).parent().data('id'));

        //让brandId校验成功
        $('form').data('bootstrapValidator').updateStatus("brandId", "VALID");
    });

    //4.初始化图片上传
    $("#fileupload").fileupload({
        dataType:'json',
        //e：事件对象
        //data：图片上传后的对象，通过e.result.picAddr可以获取上传后的图片地址
        done:function (e,data) {
            // console.log(data.result);
            var pic = data.result.picAddr;
            $('<img src="'+pic+'" width="100" height="100" alt="">').appendTo('.img_box');

            //将图片信息储存到数组中
            result.push(data.result);
            // console.log(result);
            if(result.length===3){
                //校验成功
                $("form").data("bootstrapValidator").updateStatus("productLogo", "VALID");
            }else{
                //校验失败
                $("form").data("bootstrapValidator").updateStatus("productLogo", "VALID");
            }
        }
    });

    //5.表单校验
    var $form = $('form');
    $form.bootstrapValidator({
        //让隐藏的也校验
        excluded:[],
        //小图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },

        //校验规则
        fields:{
            brandId:{
                validators:{
                    notEmpty:{
                        message:'请选择品牌'
                    }
                }
            },
            proName:{
                validators:{
                    notEmpty:{
                        message:'请输入商品名称'
                    }
                }
            },
            proDesc:{
                validators:{
                    notEmpty:{
                        message:'请输入商品描述'
                    }
                }
            },
            num:{
                validators:{
                    notEmpty:{
                        message:'请输入商品库存'
                    },
                    //必须是非0开头的数字
                    regexp:{
                        regexp:/^[1-9]\d*$/,
                        message:'请输入一个有效的商品库存'
                    }
                }
            },
            size:{
                validators:{
                    notEmpty:{
                        message:'请输入商品尺码'
                    },
                    //要求：2位数字-2位数字
                    regexp:{
                        regexp:/^\d{2}-\d{2}$/,
                        message:'请输入一个合法的尺码（例如32-44）'
                    }
                }
            },
            oldPrice:{
                validators:{
                    notEmpty:{
                        message:"请输入商品原价"
                    }
                }
            },
            price:{
                validators:{
                    notEmpty:{
                        message:"请输入商品价格"
                    }
                }
            },
            productLogo:{
                validators:{
                    notEmpty:{
                        message:"请传入三张图片"
                    }
                }
            }
        }


    });

    //6.给表单注册校验成功的事件
    $('form').on('success.form.bv',function (e) {
        e.preventDefault();

        var param = $form.serialize();
        // console.log(param);
        param += '&picName1='+result[0].picName+'&picAddr1='+result[0].picAddr;
        param += '&picName2='+result[1].picName+'&picAddr2='+result[1].picAddr;
        param += '&picName3='+result[2].picName+'&picAddr3='+result[2].picAddr;

        console.log(param);

        $.ajax({
            type:'post',
            url:'/product/addProduct',
            data:param,
            success:function (info) {
                // console.log(info);

                //关闭模态框
                $('#productModal').modal('hide');

                //重新渲染
                page = 1;
                render();

                //重置表单
                $('form').data('bootstrapValidator').resetForm(true);
                $('.dropdown_text').text('请输入二级分类');
                $('.img_box img').remove();
                //清空储存图片的数组
                result = [];
            }
        })
    })
})