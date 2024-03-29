/**
 * Created by wen on 2019/6/11.
 */
$(function () {
    /*轮播图*/
    banner();
    navBars();
    news();
    //解决
    //注册防止fix引起window滑动事件
    $('.wwx_nav').on('touchmove', function(event) {
        event.preventDefault();
    });
    //滚动把下来菜单收起
    $(window).on('scroll',function(){
        $('.wwx_nav .navbar-collapse').removeClass('in');
    })

});
var banner = function(){
    /*1.获取轮播图数据   ajax*/
    /*2.根据数据动态渲染   根据当前设备   屏幕宽度判断*/
    /*2.1准备数据*/
    /*2.2把数据转换成html格式的字符串(动态创建元素,字符串拼接,模板引擎[artTemplate,])*/
    /*2.3把字符渲染页面当中*/
    /*3.测试功能*/
    /*4.移动端手势切换*/
    /*ui框架:bootstrap,妹子UI,jqueryUI,easyUI,jqueryMobile,mUI,framework7*/
    /*关于移动端的UI框架:bootstrap,jqueryMobile,mUI,framework7*/
    /*模板引擎artTemplate,hangdlers,mustache,baiduTemplate,velocity,underscore*/
    /*做数据缓存*/
    var getData = function(callback){
        if (window.data){
            callback && callback(window.data);
        }else{
            $.ajax({
                type:'get',
                url:'/api/banner/queryBanner.php',
                dataType:'json',/*强制转成json对象,不成功则报错,不会执行success,执行error回调*/
                data:"",
                success:function(data) {
                    window.data = data;
                    callback && callback(window.data);
                }
            });
        }
    };
   var render = function(){
               /*2.根据数据动态渲染   根据当前设备   屏幕宽度判断*/
       var deviceWidth = $(window).width()
       getData(function(data){
           var isMobile = deviceWidth < 768 ? true:false;
           /*2.1准备数据*/
           /*2.2把数据转换成html格式的字符串(动态创建元素,字符串拼接,模板引擎[artTemplate,])*/
           /*使用模板引擎:哪些html内容需要动态的*/
           /*发现:点容器,模板容器 新建模板*/
           /*    <% console.log(list); %>模板引擎内不可使用外部变量*/
           var pointHtml = template('pointTemplate',{list:data});
           //console.log(pointHtml);
           var imageHtml = template('imageTemplate',{list:data,isMobile:isMobile});
           //console.log(imageHtml);
           /*2.3把字符渲染页面当中*/
           $('.carousel-indicators').html(pointHtml);
           $('.carousel-inner').html(imageHtml);
       });

   };
    // render();
    /*3.测试功能,上线后删除*/
    $(window).on('resize',function(){
        render();
    }).trigger('resize');

    /*4.移动端手势切换*/
    var startX = 0;
    var distanceX = 0;
    var isMove = false;
    /*originalEvent代表的js原生事件,因为jquery对事件e进行了封装*/
    $('.wwx_banner').on('touchstart',function(e){
        startX = e.originalEvent.touches[0].clientX;
    }).on('touchmove',function(e){
        var moveX = e.originalEvent.touches[0].clientX;
        distanceX = moveX - startX ;
        isMove = true;
    }).on('touchend',function(e){
        /*距离足够50px 一定要滑动过*/
        if (isMove && Math.abs(distanceX)>50){
            /*手势*/
            /*左滑手势*/
            if (distanceX<0){
                $('.carousel').carousel('next')
            }
            /*右滑手势*/
            else{
                $('.carousel').carousel('prev')
            }
        }
        startX = 0;
        distanceX = 0;
        isMove = false;
    })
};
/*
width();内容
innerWidth();c+p
outerWidth();c+p+b
outerWidth(true)c+p+b+m
*/
var navBars = function(){
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
    var getArtByType = function(params,callback){
        $.ajax({
            type:'get',
            url:'/api/article/queryArticle.php',
            dataType:'json',/*强制转成json对象,不成功则报错,不会执行success,执行error回调*/
            data:params,
            success:function(data) {
                callback && callback(data);
            }
        });
    };
    var render = function(){
        getTypeData(function(data){
            var navBarsHtml = template('navTabsTemplate',{list:data});
            $('.wwx_product .nav-tabs').append(navBarsHtml);
            var productContentBoxList = template('productContentBoxTemplate',{list:data});
            $('#product_content_box').append(productContentBoxList);
            //动态生成navBar后再进行isscroll初始化
            iniMobileTab();
        })
        var params = {page:1,pageSize:6,art_view:1}
        if ($(window).width()<768){params.pageSize = 4;}
        getArtByType(params,function(data){
            var navBarContent = template('navTabContentTemplate',{list:data.data})
            $('#product_nav01').html(navBarContent);
        })
    };
    render()
    //为navBar注册点击事件
    $('.wwx_product .nav-tabs').on('click','a',function(){
        var art_type_id = $(this).data('type-id')
        var ContentBox =  $(this).attr('href')
        var params = {page:1,pageSize:6,art_view:1,art_type_id}
        if ($(window).width()<768){params.pageSize = 4;}
        getArtByType(params,function(data){
            var navBarContent = template('navTabContentTemplate',{list:data.data})
            $(ContentBox).html(navBarContent);
        })
    })

}
var iniMobileTab = function(){
    /*1.解决换行问题*/
    var $navTabs = $('.wwx_product .nav-tabs');
    var width = 0;
    $navTabs.find('li').each(function(i,item){
        width += $(this).outerWidth(true);
    });
    $navTabs.width(width);
    /*2.修改结构,使之满足区域滑动*/
    //加了一个父容器给 .nav-tabs
    /*3.自己实现滑动效果 或者使用 iscroll*/
    new IScroll($navTabs.parent().get(0),{
        scrollX:true,
        scrollY:false,
        click:true
    });
};
var news = function(){
    var getArtByCre = function(callback){
        $.ajax({
            type:'get',
            url:'/api/article/queryArticle.php',
            dataType:'json',/*强制转成json对象,不成功则报错,不会执行success,执行error回调*/
            data:{
                page:1,
                pageSize:5
            },
            success:function(data) {
                callback && callback(data);
            }
        });
    };
    getArtByCre(function(data){
        var newsHtml = template('newsTemplate',{list:data.data})
        $('.wwx_news').append(newsHtml)
    })
}