

$(function () {
   login.phone();
   login.Keyup();

    $(".btn").on('click',function () {
        login.BtnUser();

    })

    $(".pass-del").on('click',function () {
        $(".password").val('');
    })

    $(".num-id").on('click',function () {
        $(".phone").val('');
    })

    $("#auto-btn").on('click',function () {//自动登录
        var num = $("#auto-btn").hasClass('BtnActive');
        if (num===true){
            $("#auto-btn").removeClass('BtnActive').addClass('auto-btn');
        }else{
            $("#auto-btn").removeClass('auto-btn').addClass('BtnActive');


        }


    });

    var pas = $.cookie('password');//记住密码自动登录
    if (pas!=undefined){
        $("#male").prop("checked",true);
        $("#auto-btn").removeClass('auto-btn').addClass('BtnActive');
        $(".phone").val($.cookie("phone"));
        $(".password").val($.cookie("password"));
        var phone = $(".phone").val();
        var PassWord = $(".password").val();
        data = {
            "mobilephone": phone,
            "password": PassWord,
        };
        var url = config.WebService()["userAccountInfo_Query"];
        Requst.ajaxGet(url,data,true,function (data) {
            //$.cookie('token', data.data.token, {path: "/"});
           // sessionStorage.setItem('token',data.data.token);
            Helper.Cache.set('token',data.data.token,7);//token
            window.location.href = '../workbench.html';

        })
    }


});



var mobile = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89] )\d{8}$/;
var mail = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;

 var login = {

     phone:function () {//账号验证

         $(".phone").keyup(function () {

             var val = $(this).val();

             if (val.length===0){
                 $(".num-id").addClass("delnone");
             }else {
                 $(".num-id").removeClass("delnone");
             }

         });
         
         $(".phone").focus(function () {
             $(".err-phone").addClass("hide");
             $(".pass-format").addClass("hide");
             $(".user-err").addClass('hide');
         })
         

         $(".password").keyup(function () {

             var val = $(this).val();
             if (val.length===0){
                 $(".pass-del").addClass("delnone");
             }else {
                 $(".pass-del").removeClass("delnone");
             }
         })

         $(".password").focus(function () {
             $(".pass-error").addClass("hide");
             $(".pass-for").addClass("hide");
         })
     },

     BtnUser: function () {//验证账号密码
         
         var phone = $(".phone").val();
         var password = $(".password").val();
         if (phone==''){
             $(".pass-format").removeClass("hide");
             $(".err-phone").addClass("hide");
             $(".user-err").addClass("hide");
             return false
         }else if (phone.length<6){
             $(".err-phone").removeClass("hide");
             return false
         }
         else if (!(mail.test(phone)||mobile.test(phone))){
             $(".err-phone").removeClass("hide");
             return false
         }
         else if (password==''){
             $(".pass-for").removeClass("hide");
             return false
         }
         else if (password.length<6){
             $(".pass-error").removeClass("hide");
             return false
         }
         login.GetUser();

     },
     Keyup: function () {
         // $(".modify-box input").keyup(function () {
         //     $(this).val().replace(/^[\u4e00-\u9fa5 ]{1,20}$/, ' ');
         // })
         $('.num_pass-box input').on('keyup change', function () {
             var that = $(this);
             var val = that.val();
             var temp = ""
             for(var i = 0; i < val.length; i++) {
                 var char = val.charCodeAt(i);
                 if (char > 0 && char < 255 && char !== 32) {
                     temp += val.charAt(i)
                 }
             }
             that.val(temp);
         });
     },
     GetUser: function () {//登录用户
         
         var phone = $(".phone").val();
         var PassWord = $(".password").val();
         data = {
             "mobilephone": phone,
             "password": PassWord,
         };

         if($('#male').prop('checked')) {
             //存储一个带7天期限的cookie
             //$.cookie("phone", phone, { expires: 7, path: '/' });
             //$.cookie("password", PassWord, { expires: 7, path: '/' });
             Helper.Cache.set("phone", phone,7);
             Helper.Cache.set("password", PassWord,7);
         }
         else {
            // $.cookie("phone", phone, { expires: 7, path: '/' });
            // $.cookie("password", '', { expires: -1 , path: '/'});
             Helper.Cache.set("phone", phone,7);
             Helper.Cache.set("password", '',-1);
         }
         var url = config.WebService()["userAccountInfo_Query"];

         Requst.ajaxGet(url,data,true,function (data) {

           if (data.code ==99999){
               $(".btn-err").removeClass('hide');
               return false
           } else if (data.code ==100001){
               $(".user-err").removeClass('hide');
               if (data.data.errorNum>10){
                  //人机验证
               }
               return false
           }
           else{
               //$.cookie('token', data.data.token, {path: "/"});
               Helper.Cache.set('token',data.data.token,7);//token
               Helper.Cache.set('mickName',data.data.mickName,7);//mickName
               Helper.Cache.set('roleType',data.data.roleType,7);//roleType
               Helper.Cache.set('userId',data.data.userId,7);//userId
               window.location.href = '../workbench.html';
           }


         })
     }
     
 }
