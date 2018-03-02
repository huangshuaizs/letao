$(function () {
    //1.校验表单
    $('form').bootstrapValidator({
        //要求：用户名不能为空  2-6
        //     密码不能为空  密码的长度在6-12为
        //配置校验的规则
        fields:{
            //对应了form中的name属性
            username:{
                //给username配置校验规则
                validators:{
                    //非空的规则
                    notEmpty:{
                        message:'用户名不能为空'
                    },
                    stringLength:{
                        min:2,
                        max:6,
                        message:'长度应该在2-6位'
                    }
                }
            },
            password:{
                validators:{
                    //非空的规则
                    notEmpty:{
                        message:'密码不能为空'
                    },
                    stringLength:{
                        min:2,
                        max:6,
                        message:'长度应该在2-6位'
                    }
                }
            }
        }
    })
})