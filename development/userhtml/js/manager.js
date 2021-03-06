/**
 * Created with JetBrains WebStorm.
 * User: kk
 * Date: 15-1-9
 * Time: 上午11:45
 * To change this template use File | Settings | File Templates.
 */
window.sysmanager = {
       pagecontainerManager:(function(){
           var toppg = $('#topheardpagecontainer');
           var toppghead =  toppg.find('header>h1');
           var topmenubut =  toppg.find('header>button').aclick(function(){
               topmenuMnager.showMenu();
           });
           var toppghead_html = toppghead.html;
           toppghead.title = (function(){
               var titleslist = [];
               return function(title){
                   if(title){
                       titleslist.push(title);
                       toppg.show();
                   }else{
                       titleslist.pop();
                       title = titleslist[titleslist.length-1];
                   }
                   toppghead.html(title);
               }
           })();
           var topmenuMnager = (function(topmenubut){
               var top_menu = $('#top_menu');
              var list = top_menu.find('[name=list]');
                var row = top_menu.find('.template>li');
              var make = top_menu.find('[name=make]').aclick(function(){
                      top_menu.hide();
                  });
               var obj  = {
                    setMenu:function(view){
                        var menu = view.obj.menuinfo && view.obj.menuinfo();        //获取菜单信息
                       if(menu){
                           topmenubut.show();
                           list.empty();
                           for(var i=0;i<menu.length;i++){
                               var menudata = menu[i];
                               (function(menudata){
                                   var newrow = row.clone();
                                  newrow.html(menudata.name).aclick(function(){
                                      top_menu.hide();
                                      view.obj.menuaction(menudata.action);
                                  });
                                  list.append(newrow);
                               })(menudata);
                           }
                       }else{
                           topmenubut.hide();
                       }
                    }
                   ,showMenu:function(){
                        top_menu.show();
                   }
               };
               return obj;
           })(topmenubut);

           var list = [];
           list.push($('#main_contaion'));
           var showend = function(e){
               //console.log('显示动画结束', this, e);
               $(this).removeClass(e.animationName);
               this.removeEventListener('webkitAnimationEnd', showend);
               list.push($(this));
           }
           var showend_child = function(e){
                  //console.log('显示动画结束_子', this, e);
                  $(this).removeClass(e.animationName);
                  this.removeEventListener('webkitAnimationEnd', showend_child);
              }
           var hideend = function(e){
              //console.log('关闭动画结束', this, e);
              $(this).removeClass(e.animationName).hide();
              this.removeEventListener('webkitAnimationEnd', hideend);
              list.pop();
           }
           var obj = {
               showToptitle:function(title){
                   toppghead.title(title);
               }
               ,setTopmenu:function(view){
                   topmenuMnager.setMenu(view);
               }
               ,show:function(pagecaontaion){            //显示一个数据容器
                   var animname = pagecaontaion.attr('animname');

                   if(animname){
                       pagecaontaion.show().addClass(animname);
                      pagecaontaion[0].addEventListener('webkitAnimationEnd', showend);
                       if(list.length>0){
                              var child = list[list.length-1];
                              child.addClass(animname+'_child');
                              child[0].addEventListener('webkitAnimationEnd', showend_child);
                        }
                   }else{
                       pagecaontaion.show();
                   }
               }
               ,hide:function(pagecaontaion){                    //隐藏最上层的数据容器
                   if(!pagecaontaion){
                       pagecaontaion = list[list.length-1];
                       var view = pagecaontaion.data('view');
                       view.obj.close();
                       if(2 == list.length){
                           toppg.hide();
                       }else{
                           var lastpage = list[list.length-2];
                           var lastpagev = lastpage.data('view');
                           topmenuMnager.setMenu(lastpagev);
                       }
                   }
                  var animname = pagecaontaion.attr('animname');
                   if(animname){
                       animname = animname+ '_un';
                       pagecaontaion.show().addClass(animname);
                       pagecaontaion[0].addEventListener('webkitAnimationEnd', hideend);
                       if(list.length>1){
                             var child = list[list.length-2];
                             child.addClass(animname+'_child');
                             child[0].addEventListener('webkitAnimationEnd', showend_child);
                        }
                   }else{
                       pagecaontaion.hide();
                   }
               }
           }
           return obj;
       })()
       ,loadpage:function(viewroot, viewname, pagecontainer, name, callback, arg){      //加载只 Dion 过的page 在指定的page容器中
           var me = this;
           var viewmanager = viewManager;
           viewmanager.viewroot(viewroot);
           var title = null;
           var generalpanel = false;                //默认面板
           if(!pagecontainer){
               pagecontainer = $('.toppagecontainer:hidden:first');
               this.pagecontainerManager.showToptitle(name || '');
               generalpanel = true;
           }else{
               title = pagecontainer.find('header>h1');
               title.html(name || '');
           }
           var body = pagecontainer.find('.page');
           var animname = pagecontainer.attr('animname');

           body.empty();
           this.pagecontainerManager.show(pagecontainer);
           viewmanager.loadview(viewname,function(v){
               v.renderer(body, arg);
               callback && callback(v);
               pagecontainer.data('view', v);
               me.pagecontainerManager.setTopmenu(v);
           });
       }
       ,init:function(){
           var me = this;
           //var pagecpntainer = ['#login_pagecontaion', '#pagecontaion'];
           $('#topheardpagecontainer').each(function(){
                var c = $(this);
               c.find('[name=btupclose]').bind('click', function(){
                   me.pagecontainerManager.hide();
                   me.pagecontainerManager.showToptitle();
               });
           });
           $('.pagecontainer').each(function(){
               var c = $(this);
               c.find('>header [name=btclose]').click(function(){
                    var view = c.data('view');
                    view.obj.close();
                    me.pagecontainerManager.hide(c);
               }).end().find('>header [name=btcloseok]').click(function(){
                   var view = c.data('view');
                   view.obj.close(true);
                   me.pagecontainerManager.hide(c);
               });
           });
           /**
           $('#pagecontaion>header>a').aclick(function(){
               var view = $('#pagecontaion').data('view');
               $('#pagecontaion').hide();
               view.obj.close();
           });
            */
           setTimeout(function(){
               //me.checklogin();
           })
           return this;
       }
    ,login:function(phone, carid, callback){
        window.myajax.get('Public','login',{'phone':phone,'carid':carid},function(result){
            if(0 == result.code){
                var userinfo = {
                    uid:result.data.uid
                    ,uuid:result.data.uuid
                }
                window.myajax.userinfo(userinfo);
                callback && callback();
            }
        });
    }
    ,checkLogin:function(callback){
        var userinfo = myajax.userinfo() || {};
        var uid = userinfo.uid;
        var uuid = userinfo.uuid;
        window.myajax.get('Public','checkLogin',{'uid':uid,'uuid':uuid},function(result){
            if(0 == result.code){
                callback && callback(true);
            }else{
                callback && callback(false);
            }
        },null,true);
    }
       ,loading:(function(){
           var loading = $('#loading');
          var obj = {
              show:function(){
                  loading.show();
              }
              ,hide:function(){
                  loading.hide();
              }
          };
           return obj;
       })()
       ,alert:(function(){
           var alertpanel = $('#alert_pagecontainer');
           var titledom = alertpanel.find('[name=title]');
           var msgdom = alertpanel.find('[name=msg]');
           var make = alertpanel.find('[name=make]').click(function(){
               alertpanel.hide();
           });
           var obj = function(msg, title){
               var t = title || '错误信息';
               titledom.html(t);
               msgdom.html(msg);
               alertpanel.show();
           }
           return obj;
       })()
       ,imgpath:function(imgname){
           return cfg.imgpath + imgname;
       }
   }
