﻿/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

(function(cfg, utils){
    var ajaxroot= window.cfg.ajaxroot;
    var userinfo = null;
    var userinfokey = 'userinfo';
    var key = 'uuid';
    var uid = 'uid';



    var process = function(result){
        switch(result.code){
            case 0:     //正确返回
                return true;
            case 10:    //没有登录
                sysmanager.alert('当前没有登录');
                return false;
            case 11:    //没有登录
                sysmanager.alert('登录失败');
                return false;
            case 100:   //错误警告信息
                sysmanager.alert(result.data);
                return false;
        }
    }
    var myajax = {
        get:function(model,control,data, success, error, myprocess){
            var url = ajaxroot+model+'/'+control+'/';
            console.log(url);
            sysmanager.loading.show();
            $.ajax({
                url:url,       
                type:'GET',                                //jsonp 类型下只能使用GET,不能用POST,这里不写默认为GET
                dataType:'jsonp',                          //指定为jsonp类型
                data:data,                //数据参数
                jsonp:'callback',                          //服务器端获取回调函数名的key，
                jsonpCallback:'myjsonpReturn',                   //回调函数名
                success:function(result){                  //成功执行处理，对应后台返回的getName(data)方法。
                    sysmanager.loading.hide();
                    console.log(result);
                    if(!!myprocess){
                        success && success(result);
                    }else if(process(result)){
                        success && success(result);
                    }
                },
                error:function(msg){
                    sysmanager.loading.hide();
                    console.log(msg);
                }
            }); 
        }
        ,userget:function(model,control,data, success, error){            //带用户身份的访问
            if(userinfo && uid && key){
                data = data || {};
                data.uid = this.uid();
                data.uuid = this.key();
            }
            this.get(model,control,data, success, error);

        }
        ,userinfo:function(_userinfo){      //获取或者设置用户信息
            if(arguments.length>0) {
                userinfo = _userinfo;
                window.localStorage.setItem(userinfokey,JSON.stringify(_userinfo));
            }else{

            }
            return userinfo;
        }
        ,key:function(){
            return userinfo && userinfo['uuid'];
        }
        ,uid:function(){
            return userinfo && userinfo['uid'];
        }
        ,clearInfo:function(){
            userinfo = null;
            window[key] = null;
            window[uid] = null;
        }
    }
    window.myajax =  myajax;

    userinfo = JSON.parse(window.localStorage.getItem(userinfokey));
})();

