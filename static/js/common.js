var WWX = {};
WWX.getParamByUrl = function(){
    var search = location.search;
    /*以对象存储地址栏信息*/
    var params = {};
    if (search){
        search = search.replace('?','');
        var arr = search.split('&');
        arr.forEach(function(item,i){
            var itemArr = item.split('=');
            params[itemArr[0]] = itemArr[1];
        })
    }
    //console.log(params);
    return params
};
/*JSON IE 6,7不支持  通过json2.js来解决*/
WWX.serialize2object = function(serializeStr){
    var params = {};
    if (serializeStr){
        var arr = serializeStr.split('&');
        arr.forEach(function(item,i){
            var itemArr = item.split('=');
            params[itemArr[0]] = itemArr[1];
        })
    }
    return params
};
WWX.getItemById = function(arr,id){
    var obj = null;
    arr.forEach(function(item,i){
        if (item.id == id){
            obj = item;
        }
    });
    return obj;
};
WWX.loginUrl = '/user/login.html';
WWX.indexUrl = '/';
WWX.loginAjax = function(params){
    $.ajax({
        url:params.url  || '#',
        type:params.type || 'get',
        data:params.data  || {},
        datatype:params.datatype  || 'json',
        success:function(data){
            if (data.error == 400){
                /*跳到登录页 把当前地址传递给登录页面 当登录成功按照这个地址跳转回来*/
                location.href = WWX.loginUrl + '?returnUrl=' +location.href;
                return false;
            }
            params.success && params.success(data);
        },
        error:function(){
            mui.toast('服务器繁忙,请稍后再试');
        }
    });
};
$(document)
    .ajaxStart(function(){
    NProgress.start();
})
    .ajaxStop(function(){
    NProgress.done();
})
