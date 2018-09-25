

$(function () {
   login.phone();
   login.Keyup();

    $(".btn").on('click',function () {
        login.BtnUser();

    })

    $(window).bind('keyup', function(event) {
        if (event.keyCode == "13") {
            login.BtnUser();
        }
    });

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

    //自动登录
    var phone=$.cookie("phone");
    var password=$.cookie("password");
    if(phone && password)
    {
        $("#male").prop("checked",true);
        $("#auto-btn").removeClass('auto-btn').addClass('BtnActive');
        $(".phone").val(phone);
        $(".password").val(password);
        //调用登录
        login.login(phone,password);
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
             return false;
         }
         login.GetUser();

     },
     Keyup: function () {
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

         if($('#male').prop('checked')) {
             Helper.Cache.set("phone", phone,7);
             Helper.Cache.set("password", PassWord,7);
         }
         else {
             Helper.Cache.set("phone", phone,7);
             Helper.Cache.set("password", '',-1);
         }
        //调用登录
         login.login(phone,PassWord);
     },
     login:function (phone,PassWord) {
         var url = config.WebService()["userAccountInfo_Query"];
         var data = {
             "mobilephone": phone,
             "password": PassWord,
         };
         Requst.ajaxGet(url,data,true,function (data) {

             if (data.code ==99999){
                 $(".btn-err").removeClass('hide');
                 return false;
             } else if (data.code ==100001){
                 $(".user-err").removeClass('hide');
                 if (data.data.errorNum>10){
                     Message.show('提示','你已经尝试以错误的密码登录系统达到10次，为了你的安全，将进行人机验证，如果您忘记了密码，请联系管理员重置密码后再次登录',MsgState.Warning,2000)
                 }
                 return false;
             }
             else{
                 Helper.Cache.set('token',data.data.token,7);//token
                 Helper.Cache.set('mickName',data.data.mickName,7);//mickName
                 Helper.Cache.set('roleType',data.data.roleType,7);//roleType
                 Helper.Cache.set('userId',data.data.userId,7);//userId
                 window.location.href = '../workbench.html';
             }
         });
     }
 }
