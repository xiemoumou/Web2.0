// //研发环境
// var url_sso = "http://192.168.1.150:8082";

//正式
// var url_sso = "http://118.126.116.76:8083";

//预发布
var url_sso = "http://119.27.172.55:8083";


url_regist = "192.168.1.150";//不用管
//开始加载即执行
$(function () {
    $("#tip_login").html("");
    var email_coo = $.cookie("email");
    var password_coo = $.cookie("passWord");

    if (email_coo != undefined && password_coo != undefined) {
        $("input#email").val(email_coo);
        $("input#passwor").val(password_coo);
    } else {
        $("input#email").val(email_coo);
    }
});
var oSpan = $(".loginCon span.tog");
var lis = $("li.cont_li");
var exBtns = $("button.exBtn");
//默认用户注册模块隐藏
lis.eq(1).hide();
//定义tab菜单的函数
function exLoginPage() {
    $(this).addClass("active").siblings().removeClass("active");
    lis.eq($(this).index()).show().siblings().hide();
}
//创建点击按钮，切换登陆与注册页面
function exLoginReverse(tem) {
    oSpan.eq(tem).removeClass("active").siblings().addClass("active");
    lis.eq(tem).hide().siblings().show();
}
//
oSpan.click(exLoginPage);
//
$("#exLogin").click(function () {
    exLoginReverse(1);
});
$("#exRegis").click(function () {
    exLoginReverse(0);
});
//获取 登陆、注册的相关节点
var tipLogin = $("#tip_login"),  //登录信息的提示消息
    tipRegis = $("#tip_register"), //注册信息的提示信息

    email = $("#email"),
    passw = $("#passwor"),
    loginBtn = $("#loginBtn"),

    emailRegis = $("#emailRegis"), //输入的注册邮箱
    passwordRegis = $("#passwordRegis"), //输入的注册密码
    passwordMore = $("#passwordMore"), //再次输入的密码


    registerBtn = $("#registerBtn");  //确认注册信息按钮 
// if (email.val() == '') {
//     blur_(email, '请输入邮箱名称');
// }
// if (passw.val() == '') {
//     blur_(passw, '请输入密码');
// }
//失焦的时候把placeholder展示
function blur_(dom, val) {
    dom.on('blur', function () {
        dom.attr('placeholder', val);
    })
}

//验证是否是手机号
function checkPhpne (pone) {
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!myreg.test(pone)) {
        return false;
    } else {
        return true;
    }
}

//验证邮箱
function checkEmail(str){
    var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
    if(re.test(str)){
        return true;
    }else{
        return false;
    }
}


//定义验证输入的密码的格式
function checkPW(passw1, tip) {
    var pass = $.trim(passw1.value);
    if (pass == "") {
        tip.innerHTML = '<embed type="image/svg+xml" src="./images/icon/error.svg"></embed>'
            + '<span >密码不能为空</span>';
        return false;
    } else {
        var regex = /^[\w\.-?<>!@#$%^&*,./]{6,50}$/;
        if (regex.test(pass)) {
            tip.innerHTML = '';
            return true;
        } else {
            tip.innerHTML = '<embed type="image/svg+xml" src="./images/icon/error.svg"></embed>'
                + '<span >密码格式不正确</span>';
            return false;
        }
    }

}
//验证注册时两次输入的密码是否一致
function checkPwMore() {

    var account=$("#emailRegis").val();
    account=$.trim(account);
    if(!account)
    {
        $("#tip_register").text("账号不允许为空");
        setTimeout(function () {
            $("#tip_register").text("");
        },3000);
        return false;
    }

    if(!checkPhpne(account)&&!checkEmail(account))
    {
        $("#tip_register").text("请输入正确的邮箱或手机号");
        setTimeout(function () {
            $("#tip_register").text("");
        },3000);
        return false;
    }

    if(!$.trim(passwordRegis.val()))
    {
        $("#tip_register").text("密码不能为空");
        setTimeout(function () {
            $("#tip_register").text("");
        },3000);
        return false;
    }

    if (( $.trim(passwordRegis.val()) ) == ( $.trim(passwordMore.val()) )) {
        return true;
    } else {
        $("#tip_register").text("两次输入的密码不一致");
        setTimeout(function () {
            $("#tip_register").text("");
        },3000);
        return false;
    }
}

//
// email[0].onfocus = function () {
//     this.placeholder = "";
// };
//
// passw[0].onfocus = function () {
//     this.placeholder = "";
// };

//登录时，验证邮箱  和  密码  格式是否符合格式
function subm1() {
    //var res1 = checkEmail(email[0],tipLogin[0]);
    var res2 = checkPW(passw[0], tipLogin[0]);
    return res2;
};
//记住用户名密码  
function Save() {
    if ($("#autoLogin").attr("checked")) {
        var str_email = email.val();
        var str_password = passw.val();
        $.cookie("autoLogin", "true", {expires: 30}); //存储一个带30天期限的cookie

        $.cookie('email', str_email);


        $.cookie("email", str_email, {expires: 30});
        $.cookie("password", str_password, {expires: 30});
    }
    else {
        $.cookie("autoLogin", "false", {expire: -1});
        $.cookie("email", "", {expires: -1});
        $.cookie("password", "", {expires: -1});
    }
};

///验证密码强度
$('#passwordRegis').keyup(function (e) {
    var strongRegex = new RegExp("^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");
    var mediumRegex = new RegExp("^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");
    var enoughRegex = new RegExp("(?=.{6,}).*", "g");
    if (false == enoughRegex.test($(this).val())) {
        $('#word_password').html('请输入6个字符以上');
        $('div#strength_password span.strength1_password').removeClass('active1');
        $('div#strength_password span.strength2_password').removeClass('active2');
        $('div#strength_password span.strength3_password').removeClass('active3');
    } else if (strongRegex.test($(this).val())) {
        $('div#strength_password span.strength3_password').addClass('active3');
        $('#word_password').html('强');
    } else if (mediumRegex.test($(this).val())) {
        $('div#strength_password span.strength3_password').removeClass('active3');
        $('div#strength_password span.strength2_password').addClass('active2');
        $('#word_password').html('中');
    } else {
        $('div#strength_password span.strength2_password').removeClass('active2');
        $('div#strength_password span.strength3_password').removeClass('active3');
        $('div#strength_password span.strength1_password').addClass('active1');

        $('#word_password').html('弱');
    }
    return true;
});
//登录按钮的事件   验证登陆状态
// function verifyLogFun() {
//     var emailVal = $.trim(email.val());
//     var passwordVal = $.trim(passw.val());
//
//
//     //if( checkEmail(email[0],tipLogin[0]) ){
//
//     if (checkPW(passw[0], tipLogin[0])) {
//         if (subm1()) {
//             console.log("678");
//             Save();
//             //验证方法    'loginip': '192.168.1.1'
//             $.ajax({
//                 type: "POST",
//                 url: url_sso + "/zb-sso-web/user/SinglePointlogin.do",
//                 data: {
//                     'email': emailVal,
//                     'password': passwordVal,
//                     'commandcode': 11,
//                     'logway': 0
//                 },
//                 dataType: 'JSON',
//                 success: function (res) {
//                     console.log(res);
//                     tipLogin.text("");
//                     if (res.status.code == 0) {
//                         setTimeout(function () {
//                             loginFun();
//                         }, 300);
//
//                     } else if (res.status.code == 1 || res.status.code == 3) {
//                         tipLogin.text(res.status.msg);
//                         copyAlert(res.status.msg + "是否继续登录？");
//                     } else {
//                         tipLogin.text(res.status.msg);
//                     }
//                     ;
//
//
//                     /*}else if(res.status.code != 0){
//                      tipLogin.text(res.status.msg);
//                      }; */
//
//                 },
//                 error: function (err) {
//                     copyAlert("当前服务器连接不上！");
//                     setTimeout(function () {
//                         closeAlert();
//                     }, 3000);
//                 }
//             })
//
//         }
//         ;
//     }
//     // }
//
// }

//登录方法
function loginFun() {
    var emailVal = $.trim(email.val());
    var passwordVal = $.trim(passw.val());
    $.ajax({
        type: "POST",
        url: url_sso + "/zb-sso-web/user/SinglePointloginAndCreateToken.do",
        data: {
            'email': emailVal,
            'password': passwordVal,
            'commandcode': 14,
            'logway': 0
        },
        dataType: 'JSON',
        success: function (res) {
            console.log(res);
            if (res.status.code == 0) {
                tipLogin.text("");
                console.log(res);
                var userid = res.userinfo.userid;
                console.log(res.userinfo.userid, res.userinfo.roletype, res.userinfo.token);

                $.cookie('email', emailVal, {path: "/", expires: 30});
                $.cookie('passWord', passwordVal, {path: "/", expires: 7});
                $.cookie('token', res.userinfo.token, {path: "/", expires: 1});
                $.cookie('userid', res.userinfo.userid, {path: "/", expires: 30});
                $.cookie('nickname', res.userinfo.nickname, {path: "/"});
                $.cookie('token', res.userinfo.token);
                $.cookie('userid', res.userinfo.userid);
                $.cookie('roletype', res.userinfo.roletype);
                $.cookie('roletype', res.userinfo.roletype, {path: "/", expires: 1});
                //页面跳转
                sessionStorage.removeItem("modeName");
                sessionStorage.removeItem("src");
                sessionStorage.removeItem("modeName_service");
                sessionStorage.removeItem("src_service");
                sessionStorage.removeItem("modeName_factory");
                sessionStorage.removeItem("src_factory");

                /* if( res.userinfo.roletype != 0 ){}*/
                // setTimeout(function(){
                // 	window.location.href = './loginSuccess.html';
                // },600);
                getWorkstage();

            } else {
                tipLogin.text(res.status.msg);
            }

            /*if ( userid == 10000005 || userid == 10000006 || userid == 10000007 ) {

             $.cookie('email', emailVal, { expires: 30, path: "/orderSuper" });
             $.cookie('userid', res.userinfo.userid, { expires: 30, path: "/orderSuper"});
             $.cookie('nickname', res.userinfo.nickname,{ expires: 30, path: "/orderSuper" });
             $.cookie('token', res.userinfo.token,{ expires: 1, path: "/orderSuper" });
             $.cookie('roletype', res.userinfo.roletype,{ expires: 1, path: "/orderSuper" });

             window.location.href = './orderSuper/loginSuccess.html';
             } else{
             window.location.href = './loginSuccess.html';
             }*/

        },
        error: function (err) {
            copyAlert(err.status + "," + err.statusText);
            setTimeout(function () {
                closeAlert();
            }, 3000);
        }
    });


}

///仿alert弹出框
function copyAlert(str1) {
    $("div.pop_copyAlert").show();
    $("span.message_copyAlert").text(str1);
};
$(document).on("click", ".close_Alert", function () {
    $("div.pop_copyAlert").hide();
});
///继续登录   continueLogin_copyAlert
$(document).on("click", ".continueLogin_copyAlert", function () {
    loginFun();
});
//点击登录按钮，触发验证事件
loginBtn.click(function () {
    //verifyLogFun();
    loginFun();

});
//敲击enter键(回车键)，  触发登录按钮，触发验证事件
$(document).keydown(function (eve) {
    var eve = eve || window.event;
    if (eve.keyCode == 13) {
        //verifyLogFun();
        loginFun();
    }

});

//验证注册邮箱的格式
// emailRegis[0].onfocus = function () {
//     this.placeholder = "";
// };
// emailRegis[0].onblur = function(){
//     checkEmail(emailRegis[0],tipRegis[0]);
// };
//验证密码格式
// passwordRegis[0].onfocus = function () {
//     this.placeholder = "";
// };
// passwordRegis[0].onblur = function () {
//     checkPW(passwordRegis[0], tipRegis[0]);
// };
//验证两次输入的密码是否一致
// passwordMore[0].onfocus = function () {
//     this.placeholder = "";
// };
// passwordMore[0].onblur = function () {
//     checkPwMore();
// };

//验证注册的三条信息是否符合规则
function subm2() {
    //var res1 = checkEmail(emailRegis[0],tipRegis[0]);
    var res2 = checkPW(passwordRegis[0], tipRegis[0]);
    var res3 = checkPwMore();
    return res2 && res3;
}
//注册按钮的事件
registerBtn.click(function () {
    //去除前后的空白字符
    var emailRegisVal = $.trim(emailRegis.val());
    var passwordRegisVal = $.trim(passwordRegis.val());
    
    if (checkPwMore()) {
        /*console.log(789, emailRegis.val(), passwordRegis.val() );*/

        $.cookie('email', emailRegisVal, {expires: 30, path: "/"});
        $.cookie('password', passwordRegisVal, {expires: 30, path: "/"});


        //发起http请求,发起注册申请
        $.ajax({
            type: "POST",
            url: url_sso + "/zb-sso-web/user/register.do",
            data: {
                'email': emailRegisVal,
                'password': passwordRegisVal,
                'loginip': url_regist
            },
            dataType: 'JSON',
            success: function (res) {
                if (res.status.code === "0") {
                    console.log(res.userinfo.userid);
                    tipRegis.text(res.status.msg);
                    /* 设置cookie */
                    $.cookie('email', emailRegisVal, {expires: 30});
                    $.cookie('password', passwordRegisVal, {expires: 1});
                    console.log(789, $.cookie('email'), $.cookie('password'));
                    //exLoginReverse(1);
                    $("#email").val(emailRegisVal);
                    $("#passwor").val(passwordRegisVal);
                    // setTimeout(function () {
                    //     verifyLogFun();
                    // }, 1000);

                } else if (res.status.code != "0") {
                    tipRegis.text(res.status.msg);
                }

            },
            error: function (err) {
                copyAlert(err.status + "," + err.statusText);
                setTimeout(function () {
                    closeAlert();
                }, 3000);
            }
        });
    }
});

/* $(document).ready(function () {  
 if ($.cookie("autoLogin") == "true") {  
 $("#autoLogin").attr("checked", true);  
 $("#email").val($.cookie("email"));  
 $("#passwor").val($.cookie("password")); 
 loginFun();
 } 

 });*/  
      
        