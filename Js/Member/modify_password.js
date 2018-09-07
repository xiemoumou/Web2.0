

$(function() {
    Veri.InputPass();
    //Veri.VeriPass();
    Veri.init();
    Veri.Keyup();
});

$(".modi-pass").on('click',function () {
    window.location.href = 'modify_password.html';
})


var Veri ={
    currentClickObj: null,

    InputPass: function () {//输入密码
        $(".input-password").keyup(function() {
            var val = $(this).val();
            var num = Veri.Sterng(val);
            if (num==''){
                $(".strong span").css('background', '#D5D5D5');
            }
            switch (num) {
                case 1:
                    $(".strong span").css('background', '#D5D5D5').eq(num - 1).css('background', '#E84B4C')
                    break;
                case 2:
                    $(".strong span").css('background', '#D5D5D5').eq(num - 1).css('background', '#E84B4C')
                    break;
                case 3:
                    $(".strong span").css('background', '#D5D5D5').eq(num - 1).css('background', '#E84B4C')
                    break;
                case 4:
                    $(".strong span").css('background', '#D5D5D5').eq(num - 1).css('background', '#E84B4C')
                    break;
                default:
                    break;
            }

        })

        $("#old_pass,.input-password,#again_pass").focus(function () {
            $(".pass-used").addClass('hide');
            $(".pass-format").addClass('hide');
        })
    },
    // VeriPass: function () {//再次输入密码
    //     $(".new-password-again input").keyup(function () {
    //         var password  = $(".input-password").val();
    //         if (password !=$(this).val()){
    //             $(".err-password").removeClass('hide');
    //         }else{
    //             $(".err-password").addClass('hide');
    //         }
    //     })
    // },
    Sterng: function (val) {//密码强度
        var modes = 0;
        if (val.length < 6) return 0;
        if (/[a-z]/.test(val)||/\d/.test(val)||/[A-Z]/.test(val)||/[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/.test(val)) modes++; //数字或者字母
        if (/[a-z]/.test(val)&&/\d/.test(val)||/[A-Z]/.test(val)&&/\d/.test(val)||/\d/.test(val)&&/[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/.test(val)||/[a-z]/.test(val)&&/[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/.test(val)||/[a-z]/.test(val)&&/[A-Z]/.test(val)||/[A-Z]/.test(val)&&/[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/.test(val)) modes++;
        if (/\d/.test(val)&&/[a-z]/.test(val)&&/[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/.test(val)||/\d/.test(val)&&/[A-Z]/.test(val)&&/[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/.test(val)||/\d/.test(val)&&/[a-z]/.test(val)&&/[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/.test(val)&&/[A-Z]/.test(val)) modes++; //特殊字符
        return modes;
    },
    PostUser: function () {
        debugger
        var old_pass = $("#old_pass").val();
        var newpass = $("#new_pass").val();
        var PassWord = $("#again_pass").val();
        var content = '用户名或密码错误';
        var wMobilephone = $.cookie('phone');
        var title = '提示';
        var time = 2000;
        var status = 3;
        data = {
            "wMobilephone": wMobilephone,
            "password": PassWord,
            "wPassword": old_pass,
        };
        if (old_pass==''){
            $(".pass-used").text('请输入旧密码').removeClass('hide');
            return false
        }else if (newpass==''){
            $(".pass-format").text('请输入新密码').removeClass('hide');
            return false
        }else if (PassWord==''){
            $(".pass-format").text('请输入新密码').removeClass('hide');
            return false
        }else if ((newpass||PassWord).length<6){
            $(".pass-format").text('新密码小于六位').removeClass('hide');
            return false
        }else if (newpass!=PassWord){
            $(".pass-format").text('两次密码不一致请重新输入').removeClass('hide');
            return false
        }
        var url = config.WebService()["userPassword_Update"];


        Requst.ajaxPost(url,data,true,function (data) {

            if (data.code ==100001){
                Message.show(title,content,status,time);
            } else if (data.code ==100003) {
                $(".pass-used").text('旧密码错误').removeClass('hide');
            }
            else{
                content = '修改成功';
                status = 1;
                Message.show(title,content,status,time,function () {
                    window.location.href = 'modify_success.html';
                });
            }


        })
    },
    init: function () { //用户信息下拉
        $(".user-title").click(function (e) {
            $(".user-core .user-box").toggle();
            Veri.currentClickObj = $(".user-core .user-box");
            e.stopPropagation();//阻止冒泡
        });

        //点击空白隐藏搜索下拉菜单或个人中心下拉菜单
        $(window).click(function () {
            if (Veri.currentClickObj) {
                $(Veri.currentClickObj).hide();
                Veri.currentClickObj = null;
            }
        })
    },
    Keyup: function () {
        // $(".modify-box input").keyup(function () {
        //     $(this).val().replace(/^[\u4e00-\u9fa5 ]{1,20}$/, ' ');
        // })
        $('.modify-box input').on('keyup change', function () {
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
    }

}

