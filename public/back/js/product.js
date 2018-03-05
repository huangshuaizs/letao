$(function () {

    //1.渲染列表信息 分页
    var page = 1;
    var pageSize = 5;

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
    })
})