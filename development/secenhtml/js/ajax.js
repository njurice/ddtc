﻿/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

define(['cfg', 'utils'], function(cfg, utils){
    var ajaxroot= cfg.ajaxroot;
    var userinfo = null;
    var key = 'user_key';
    var uid = 'user_uid';
    var process = function(result){
        switch(result.code){
            case 0:     //正确返回
                return true;
            case 10:    //没有登录
                utils.sys.alert('当前没有登录');
                return false;
            case 11:    //没有登录
                utils.sys.alert('登录失败');
                return false;
            case 100:   //错误警告信息
                utils.sys.alert(result.data);
                return false;
        }
    }
    var myajax = {
        get:function(model,control,data, success, error){
            var url = ajaxroot+model+'/'+control+'/';
            console.log(url);
            utils.sys.loading.show();
            $.ajax({
                url:url,       
                type:'GET',                                //jsonp 类型下只能使用GET,不能用POST,这里不写默认为GET
                dataType:'jsonp',                          //指定为jsonp类型
                data:data,                //数据参数
                jsonp:'callback',                          //服务器端获取回调函数名的key，
                jsonpCallback:'myjsonpReturn',                   //回调函数名
                success:function(result){                  //成功执行处理，对应后台返回的getName(data)方法。
                    utils.sys.loading.hide();
                    console.log(result);
                    if(process(result)){
                        success && success(result);
                    }
                },
                error:function(msg){
                    utils.sys.loading.hide();
                    console.log(msg);
                }
            }); 
        }
        ,userget:function(model,control,data, success, error){            //带用户身份的访问
            if(userinfo && uid && key){
                data = data || {};
                data.uid = this.uid();
                data.key = this.key();
            }
            this.get(model,control,data, success, error);

        }
        ,userinfo:function(_userinfo){      //获取或者设置用户信息
            userinfo = _userinfo || userinfo;
            return userinfo;
        }
        ,key:function(_key){
            window[key] = _key || window[key];
            return window[key];
        }
        ,uid:function(_uid){
            window[uid] = _uid || window[uid];
            return window[uid];
        }
        ,clearInfo:function(){
            userinfo = null;
            window[key] = null;
            window[uid] = null;
        }
    }
    return myajax;
});

