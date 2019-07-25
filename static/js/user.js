$(function(){
    InitCanvas();
    if (location.href.indexOf('register') !== -1){
        checkRegisterData();
        $('.vcode img').on('click',function(){
            $(this).attr('src',$(this).attr('src')+'?'+Math.random())
        })
    } else if (location.href.indexOf('login') !== -1) {
        checkLoginData();
    }
})

var checkRegisterData = function(){
    $('#register').bootstrapValidator({
        /*配置校验的不同状态下显示的图标,合格,不合格,正在检验*/
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        /*需要校验的表单*/
        fields: {
            /*对应的是表单的name*/
            user_name: {
                message: '昵称验证失败',
                /*校验规则 多个教研规则*/
                validators: {
                    notEmpty: {
                        message: '昵称不能为空'
                    },
                    stringLength: {  //长度限制
                        min: 2,
                        max: 16,
                        message: '昵称长度必须在2到20位之间'
                    }

                }
            },
            user_email: {
                message: '邮箱验证失败',
                /*校验规则 多个教研规则*/
                validators: {
                    notEmpty: {
                        message: '邮箱不能为空'
                    },
                    stringLength: {  //长度限制
                        min: 6,
                        max: 30,
                        message: '邮箱长度必须在6到50位之间'
                    },
                    regexp: { //正则表达式
                        regexp: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
                        message: '邮箱名不正确'
                    },
                    callback:{
                        message:'邮箱或密码有误'
                    }


                }
            },

            password: {
                message: '密码验证失败',
                /*校验规则 多个教研规则*/
                validators: {
                    notEmpty: {
                        message: '密码不能为空'
                    },
                    stringLength: {  //长度限制
                        min: 6,
                        max: 16,
                        message: '密码长度必须在6到18位之间'
                    },
                    regexp: { //正则表达式
                        regexp: /^[a-zA-Z0-9_]+$/,
                        message: '密码只能包含大写、小写、数字和下划线'
                    },
                    callback:{
                        message:'邮箱或密码有误'
                    },
                    identical: {
                        field: 'comfirmPassword',
                        message: '两次输入的密码不相符'
                    }

                }
            },
            comfirmPassword:{
                message: '两次输入密码不一致',
                validators: {
                    identical: {
                        field: 'password',
                        message: '两次输入的密码不相符'
                    }

                }

            },
            vcode:{
                message: '两次输入密码不一致',
                validators: {
                    notEmpty: {
                        message: '数字'
                    },
                    stringLength: {  //长度限制
                        min: 4,
                        max: 4,
                        message: '验证码长度必须为4'
                    },
                    regexp: { //正则表达式
                        regexp: /^[0-9]+$/,
                        message: '验证码只能是数字'
                    },
                }

            }
        },

    }).on('success.form.bv', function (e) {
        /*验证成功后,可以提交了,这是验证成功的事件*/
        e.preventDefault();
        /*后台校验用户名和密码,是后台自动拦截的,因为所有的操作都需要登录*/

        var $form = $(e.target);
        $.ajax({
            type:'post',
            url:'/api/user/register.php',
            data:$form.serialize(),
            datatype:'json',
            success:function(data){
                /*业务成功*/
                if (data.error === 400){
                    $('#alert').removeClass('hidden').html(data.message)
                    $('.vcode img').trigger('click');
                    return false;
                }
                var returnUrl = location.search.replace('?returnUrl=','') || WWX.indexUrl ;
                location.href = returnUrl;
            }
        })
    });
}
var checkLoginData = function(){
    $('#login').bootstrapValidator({
        /*配置校验的不同状态下显示的图标,合格,不合格,正在检验*/
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        /*需要校验的表单*/
        fields: {
            /*对应的是表单的name*/
            user_email: {
                message: '邮箱验证失败',
                /*校验规则 多个教研规则*/
                validators: {
                    notEmpty: {
                        message: '邮箱不能为空'
                    },
                    stringLength: {  //长度限制
                        min: 6,
                        max: 30,
                        message: '邮箱长度必须在6到50位之间'
                    },
                    regexp: { //正则表达式
                        regexp: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
                        message: '邮箱名不正确'
                    },
                    callback:{
                        message:'邮箱或密码有误'
                    }


                }
            },

            password: {
                message: '密码验证失败',
                /*校验规则 多个教研规则*/
                validators: {
                    notEmpty: {
                        message: '密码不能为空'
                    },
                    stringLength: {  //长度限制
                        min: 6,
                        max: 16,
                        message: '密码长度必须在6到18位之间'
                    },
                    regexp: { //正则表达式
                        regexp: /^[a-zA-Z0-9_]+$/,
                        message: '密码只能包含大写、小写、数字和下划线'
                    },
                    callback:{
                        message:'邮箱或密码有误'
                    }

                }
            },
        },

    }).on('success.form.bv', function (e) {
        /*验证成功后,可以提交了,这是验证成功的事件*/
        e.preventDefault();
        /*后台校验用户名和密码,是后台自动拦截的,因为所有的操作都需要登录*/

        var $form = $(e.target);
        $.ajax({
            type:'post',
            url:'/api/user/login.php',
            data:$form.serialize(),
            datatype:'json',
            success:function(data){
                /*业务成功*/
                   if (data.error === 400){
                        $form.data('bootstrapValidator').updateStatus('user_email','INVALID','callback')
                        $form.data('bootstrapValidator').updateStatus('password','INVALID','callback')
                       return false;

                    }
                   var returnUrl = location.search.replace('?returnUrl=','') || WWX.indexUrl ;
                   location.href = returnUrl;
            }
        })
    });

    $('[name="user_email"]').on('keyup',function(){
        var bootstrapValidator =  $('#login').data('bootstrapValidator');
        bootstrapValidator.resetForm();
        bootstrapValidator.revalidateField('user_email')
        bootstrapValidator.revalidateField('password')
    })
    $('[name="password"]').on('keyup',function(e){
        var bootstrapValidator =  $('#login').data('bootstrapValidator');
        bootstrapValidator.resetForm();
        bootstrapValidator.revalidateField('user_email')
        bootstrapValidator.revalidateField('password')
    })
}
var InitCanvas = function(){
    var canvas = document.getElementById("cas");

    var ctx = canvas.getContext("2d");




    resize();

    window.onresize = resize;




    function resize() {

        canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

        canvas.height = document.documentElement.offsetHeight || document.body.offsetHeight;

    }




    var RAF = (function() {

        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {

            window.setTimeout(callback, 1000 / 60);

        };

    })();




    // 鼠标活动时，获取鼠标坐标

    var warea = {x: null, y: null, max: 20000};

    window.onmousemove = function(e) {

        e = e || window.event;




        warea.x = e.clientX;

        warea.y = e.clientY;

    };

    window.onmouseout = function(e) {

        warea.x = null;

        warea.y = null;

    };




    // 添加粒子

    // x，y为粒子坐标，xa, ya为粒子xy轴加速度，max为连线的最大距离

    var dots = [];

    for (var i = 0; i < 300; i++) {

        var x = Math.random() * canvas.width;

        var y = Math.random() * canvas.height;

        var xa = Math.random() * 2 - 1;

        var ya = Math.random() * 2 - 1;




        dots.push({

            x: x,

            y: y,

            xa: xa,

            ya: ya,

            max: 6000

        })

    }




    // 延迟100秒开始执行动画，如果立即执行有时位置计算会出错

    setTimeout(function() {

        animate();

    }, 100);




    // 每一帧循环的逻辑

    function animate() {

        ctx.clearRect(0, 0, canvas.width, canvas.height);




        // 将鼠标坐标添加进去，产生一个用于比对距离的点数组

        var ndots = [warea].concat(dots);




        dots.forEach(function(dot) {




            // 粒子位移

            dot.x += dot.xa;

            dot.y += dot.ya;




            // 遇到边界将加速度反向

            dot.xa *= (dot.x > canvas.width || dot.x < 0) ? -1 : 1;

            dot.ya *= (dot.y > canvas.height || dot.y < 0) ? -1 : 1;




            // 绘制点

            ctx.fillRect(dot.x - 0.5, dot.y - 0.5, 1, 1);




            // 循环比对粒子间的距离

            for (var i = 0; i < ndots.length; i++) {

                var d2 = ndots[i];




                if (dot === d2 || d2.x === null || d2.y === null) continue;




                var xc = dot.x - d2.x;

                var yc = dot.y - d2.y;




                // 两个粒子之间的距离

                var dis = xc * xc + yc * yc;




                // 距离比

                var ratio;




                // 如果两个粒子之间的距离小于粒子对象的max值，则在两个粒子间画线

                if (dis < d2.max) {




                    // 如果是鼠标，则让粒子向鼠标的位置移动

                    if (d2 === warea && dis > (d2.max / 2)) {

                        dot.x -= xc * 0.03;

                        dot.y -= yc * 0.03;

                    }




                    // 计算距离比

                    ratio = (d2.max - dis) / d2.max;




                    // 画线

                    ctx.beginPath();

                    ctx.lineWidth = ratio / 2;

                    ctx.strokeStyle = 'rgba(135,206,235,' + (ratio + 0.2) + ')';

                    ctx.moveTo(dot.x, dot.y);

                    ctx.lineTo(d2.x, d2.y);

                    ctx.stroke();

                }

            }




            // 将已经计算过的粒子从数组中删除

            ndots.splice(ndots.indexOf(dot), 1);

        });




        RAF(animate);

    }

}