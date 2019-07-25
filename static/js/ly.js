$(function () {
    ly()
    getMore()
    initAddFirstComment()
    initSecondFirstComment()
    login()
})
var ly = function () {

    var getComments = function (callback) {
        $.ajax({
            url: '/api/comments/queryComments.php',
            type: 'get',
            dataType: 'json',
            data: {art_id: 0, page: 1, pageSize: 5},
            success: function (data) {
                callback && callback(data)
            }
        })

    }

        getComments(function (comments) {
            console.log(comments)
            var commentHtml = template('firstComentTemplate', {comments: comments.data})
            $('#comment').html(commentHtml)
            var moreBtnHtml = template('moreTemplate', {count:comments.count})
            $('.more').html(moreBtnHtml)
        })
}
var getMore = function () {
    var getMulti = function (params, callback) {
        $.ajax({
            url: '/api/comments/querySecondComments.php',
            type: 'get',
            datatype: 'json',
            data: params,
            success: function (data) {
                callback && callback(data)
            }
        })
    }
    var getComment = function (params, callback) {
        $.ajax({
            url: '/api/comments/queryComments.php',
            type: 'get',
            datatype: 'json',
            data: params,
            success: function (data) {
                callback && callback(data)
            }
        })
    }
    $('.wwx_article')
        .on('click', '.getMulti', function () {
            var count = $(this).data('count');
            var comId = $(this).data('com-id');
            var page = $(this).data('page') + 1;


            getMulti({com_id: comId, page: page, pageSize: 5,}, (data) => {
                $('.multi_comment[data-com-id='+comId+'] .multi_excerpt').each(function(){
                    data.forEach(t => {
                        if ($(this).data('multi-id') == t.com_multi_id){
                            $(this).remove()
                        }
                    })
                })
                var html = template('secondComentTemplate', {list: data})
                $(this).siblings('ul').append(html)
                $(this).data('page', page);
                if (page * 5 - 2 >= count) {
                    $(this).hide()
                }
            })
        })
        .on('click', '#getComment', function () {
            var count = $(this).data('count');
            var artId = $(this).data('art-id');
            var page = $(this).data('page') + 1;
            getComment({art_id: artId, page: page, pageSize: 5,}, (comments) => {
                $('#comment .excerpt').each(function(){
                    comments.data.forEach(t => {
                        if ($(this).data('com-id') == t.com_id){
                            $(this).remove()
                        }
                    })
                })
                var html = template('firstComentTemplate', {comments: comments.data})
                $(this).parent().siblings('ul').append(html)
                $(this).data('page', page);
                if (page * 5 >= count) {
                    $(this).hide()
                }
            })
        })
}
var initAddFirstComment = function(){
    var addFirstComment = function(params,callback){
        $.ajax({
            url:'/api/comments/addComments.php',
            type:'post',
            data:params,
            dataType:'json',
            success:function(data){
                callback && callback(data)
            }
        })
    }

    $('.wwx_article')
        .on('click','#postComment',function(){
            var content = $.trim($('.art_footer .comment_textarea').val())
            if (!content) {
                return $('.art_footer>div>.alert').show(200)
            }
            if (!window.user){
                return $('#loginModal').modal('show')
            }

            addFirstComment({art_id:0,content},function(data){
                console.log(data)
                if (data.success === true){

                    var $getCom = $('#getComment')
                    $getCom .data('count',$getCom.data('count')+1)

                    var html = template('firstComentTemplate', {comments: [{com_id:data.id,user_img:window.user.user_img,user_name:window.user.user_name,com_content:content,com_multi:{count:0}}]})
                    $('#comment').append(html)
                    $('.art_footer .comment_textarea').val('')
                }
            })
        })
        .on('keyup','.comment_textarea',function(){
            if ($.trim($(this).val())){
                $('.art_footer>div>.alert').hide(200)
            }
        })
        .on('click','.postMulti',function(){
            if (!window.user){
                return $('#loginModal').modal('show')
            }
            $('#postMultiModal').modal('show')
            var btn = $('#postMultiModal .modal-footer button')
            //动态的给模态框数据
            btn.data({
                'com-id':$(this).data('com-id'),
                'user-id':$(this).data('user-id'),
                'user-name':$(this).data('user-name')
            })
        })



}
var initSecondFirstComment = function(){
    var addSecondComment = function(params,callback){
        $.ajax({
            url:'/api/comments/addSecondComments.php',
            type:'post',
            data:params,
            dataType:'json',
            success:function(data){
                callback && callback(data)
            }
        })
    }
    //注册模态框消失隐藏警告事件
    $('#postMultiModal').on('hidden.bs.modal',function(){
        $('#postMultiModal .modal-body>.alert').addClass('hidden')
    })
    //注册键入内容隐藏警告事件
    $('#postMultiModal .modal-body textarea').on('keyup',function(){
        if ($.trim($(this).val())){
            $('#postMultiModal .modal-body>.alert').addClass('hidden')
        }
    })
    //注册模态框提交回复内容事件
    $('#postMultiModal .modal-footer button').on('click',function(){

        var content = $.trim($('#postMultiModal .modal-body textarea').val())
        //获取回复键传递过来的数据
        var com_id = $(this).data('com-id')
        var parent_user_id = $(this).data('user-id')
        var parent_user_name = $(this).data('user-name')
        if (!com_id) {
            return $('#postMultiModal').modal('hide')
        }
        $(this).data({
            'com-id':'',
            'user-id':'',
            'user-name':''
        })

        if (!content){
            return $('#postMultiModal .modal-body>.alert').removeClass('hidden')
        }

        var params = {com_id:com_id,com_multi_content:content}
        if (parent_user_id){
            params['com_parent_multi_id'] = parent_user_id;
        }
        addSecondComment(params,function(data){
            console.log(data);
            if (data.success === true){

                var $secondCommentBox = $('.multi_comment[data-com-id='+com_id+'] ul')
                var obj = {
                    com_multi_id:data.id,
                    com_id,
                    com_multi_content:content,
                    user_id:window.user.user_id,
                    user_img:window.user.user_img,
                    user_name:window.user.user_name,
                }
                if (parent_user_name) {
                    obj['parent_user_name'] = parent_user_name;
                }


                var html = template('secondComentTemplate', {list: [obj]})
                $secondCommentBox.append(html)
                $('#postMultiModal .modal-body textarea').val('')
                $('#postMultiModal').modal('hide')

                var multi = $('.multi_comment[data-com-id='+com_id+'] .getMulti')
                multi .data('count',multi.data('count')+1)
            }
        })

        //清空模态框按钮的数据



    })
}
var login = function(){
    var loginAjax = function(params,callback){
        $.ajax({
            url:'/api/user/login.php',
            type:'post',
            data:params,
            dataType:'json',
            success:function(data){
                callback && callback(data)
            }
        })
    }
    $('#loginModal .modal-footer button')
        .on('click',function(){
            var $form = $('#form');
            var params = $form.serialize()
            var paramsObj = WWX.serialize2object(params)
            if (!$.trim(paramsObj.user_email) || !$.trim(paramsObj.password)){
                return $form.siblings('.alert').removeClass('hidden').html('邮箱或密码不能为空')
            }
            loginAjax(params,(data)=>{
                //自己内部有个去空格的过程
                if (data.error === 400){

                    return $form.siblings('.alert').removeClass('hidden').html(data.message)
                }
                initUser()
                $('#loginModal').modal('hide')
            })
        })


    $('#form input').on('keyup',function(e){
        if (e.keyCode === 13){
            $('#loginModal .modal-footer button').trigger('click')
        }
        var $form = $('#form');
        var params = $form.serialize()
        var paramsObj = WWX.serialize2object(params)
        if (paramsObj.user_email && paramsObj.password){
            $form.siblings('.alert').addClass('hidden')
        }
    })
}
