//导航栏
$(function(){
    initUser()
    getTypeData(function(data){
        var studyListTemplate = '<li><a href="javascript:;<%=list[i].type_id%>" class="nothing"><%=list[i].type_name%></a></li> \n'
        var html = ''
        data.forEach((item,i) => {
            html += studyListTemplate.replace('<%=list[i].type_name%>',item.type_name).replace('<%=list[i].type_id%>',item.type_id)
        })
        $('#study').html(html)
        $('.nothing').on('click',function(){
            alert('该功能尚未开放,敬请期待')
        })
    })
    //自动为登录连接添加返回地址
    $('.login a').attr('href',$('.login a').attr('href')+'?returnUrl='+location.href)
    $('.register a').attr('href',$('.register a').attr('href')+'?returnUrl='+location.href)
    //上线后可以删除
    $(window).on('resize',function(){
        InitnavBar();
    }).trigger('resize');
})
var initUser = function(){
    var checkLogin = function(callback){
        $.ajax({
            type:'get',
            url:'/api/user/checkLogin.php',
            dataType:'json',/*强制转成json对象,不成功则报错,不会执行success,执行error回调*/
            data:'',
            success:function(data) {
                callback && callback(data);
            }
        });
    };
    checkLogin(function(data){

        if (data.error !== 400){
            $('.user-center').removeClass('hidden')
            $('.user-center img').attr('src',data["user_img"])
            $('.user').addClass('hidden')
            window.user = data
        }
    })
    $('#logout').on('click',function(){
        $.ajax({
            type:'get',
            url:'/api/user/logout.php',
            dataType:'json',
            data:'',
            success:function(data){
                console.log(data);
                if (data.success === true){
                    location.reload();
                }
            }
        });

    })

}
var getTypeData = function(callback){
    $.ajax({
        type:'get',
        url:'/api/category/queryType.php',
        dataType:'json',/*强制转成json对象,不成功则报错,不会执行success,执行error回调*/
        data:"",
        success:function(data) {
            callback && callback(data);
        }
    });
};
var InitnavBar = function(){
    var deviceWidth = $(window).width()
    if (deviceWidth < 992){
        $('#logo').attr('src','/static/images/smallLogo.png')
    }else{
        //上线后删除,解决logo在resize的问题
        $('#logo').attr('src','/static/images/bigLogo.png')
    }

    if (deviceWidth < 768) {
        $('.navbar-right .user a').attr('class','')
    }else{
        //上线后删除,解决样式在resize的问题
        $('.navbar-right .login a').attr('class','btn btn-default btn-primary')
        $('.navbar-right .register a').attr('class','btn btn-default btn-danger')
    }
}