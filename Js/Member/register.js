
$(function () {
    Regi.Phone();
    Regi.InputPass();
    Regi.Keyup();
    Regi.VeriPass();

    $("#get-verify-code").on('click',function () {
        Regi.VerCode(this);

    });
    $("#btn").on('click',function () {//手机号下一步
        Regi.PhoneNext();
    });
    $("#btn_next").on('click',function () {//密码下一步
        Regi.PassVeri();
    });

    $("#del").on('click',function () {//清空
        $(".phone").val('');
    });
});



    var countdown = 60;

    var mobile = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;

    var Regi = {
        Phone: function () {//手机号验证
            $(".phone").keyup(function () {
                var val = $(this).val();
                if(!(mobile.test(val))){
                    $(".err-phone").removeClass("hide");
                }else {
                    $(".err-phone").addClass("hide");
                }
                if (val.length===0){
                    $("#del").addClass("delnone");
                }else {
                    $("#del").removeClass("delnone");
                }
            });
            
        },
        PhoneNext: function() {//手机号下一步验证
            $(".err-phone").focus(function () {
                $(".err-phone").addClass('hide');
            });
            var phval = $(".phone").val();
            if (phval == ''){
                $(".err-phone").text('请输入手机号').removeClass('hide');
                return false
            }
            else if (phval==''||!(mobile.test(phval))){
                $(".err-phone").text('手机号错误，请重新输入').removeClass("hide");
                return false
            }
                Regi.Phoneval();
                window.location.href = 'register_password.html';
        },
        VerCode:function (obj) {//验证码

            if (countdown == 0) {
                obj.removeAttribute("disabled");
                obj.value = "获取验证码";
                countdown = 60;
                return;
            } else {
                obj.setAttribute("disabled", true);
                obj.value = "" + countdown + "s后重新发送";
                countdown--;

            }
            setTimeout(function () {
                    Regi.VerCode(obj);
                }
                , 1000)
        },
        InputPass: function () {//输入密码
            $(".input-password").keyup(function() {
                $(".pass-format").addClass('hide');
                var val = $(this).val();
                //$("p").text(val.length);
                var num = Regi.Sterng(val);
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
                    default:
                        break;
                }
            })
        },
        VeriPass: function () {//再次输入密码
            $(".again-pass,.input-password").blur(function () {
                $(".pass-format").addClass('hide');
                $(".err-password").addClass('hide');
                $(".pass-six").addClass('hide');
            })
        },
        PassVeri: function () {//密码验证下一步
            var PassVal = $(".input-password").val();
            var PassValAga = $(".again-pass").val();

            if (PassVal==''){
                $(".pass-format").removeClass('hide');
                $(".err-password").addClass('hide');
                $(".pass-six").addClass('hide');
                return false
            }else if(PassValAga==''){
                $(".pass-format").removeClass('hide');
                $(".err-password").addClass('hide');
                $(".pass-six").addClass('hide');
                return false
            }else if ((PassVal||PassValAga).length<6){
                $(".pass-six").removeClass('hide');
                $(".pass-format").addClass('hide');
                $(".err-password").addClass('hide');
                return false
            }
            else if (PassValAga !=PassVal){
                $(".err-password").removeClass('hide');
                $(".pass-format").addClass('hide');
                $(".pass-six").addClass('hide');
                return false
            }
                Regi.PostRegi();
        },
        Sterng: function (val) {//密码强度
            var modes = 0;
            if (val.length < 6) return 0;
            if (/[a-z]/.test(val)||/\d/.test(val)||/[A-Z]/.test(val)||/[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/.test(val)) modes++; //数字或者字母
            if (/[a-z]/.test(val)&&/\d/.test(val)||/[A-Z]/.test(val)&&/\d/.test(val)||/\d/.test(val)&&/[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/.test(val)||/[a-z]/.test(val)&&/[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/.test(val)||/[a-z]/.test(val)&&/[A-Z]/.test(val)||/[A-Z]/.test(val)&&/[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/.test(val)) modes++;
            if (/\d/.test(val)&&/[a-z]/.test(val)&&/[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/.test(val)||/\d/.test(val)&&/[A-Z]/.test(val)&&/[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/.test(val)||/\d/.test(val)&&/[a-z]/.test(val)&&/[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/.test(val)&&/[A-Z]/.test(val)) modes++; //特殊字符
            return modes;
        },
        PostRegi: function () {//注册请求
            debugger
            var PhonVal = localStorage.getItem('phone');
            var PassWord = $(".again-pass").val();
            var content = '该手机号已被注册';
            var title = '提示';
            var time = 2000;
            var status = 3;
            data = {
                "mobilephone": PhonVal,
                "password": PassWord,
                "roletype": 0,
            };

            var url = config.WebService()["AccountInfo_Insert"];

            Requst.ajaxPost(url,data,true,function (data) {
                if (data.code ==200){
                    content = '注册成功';
                    status = 1;
                    Message.show(title,content,status,time,function () {
                        window.location.href = 'register_success.html';
                    });

                }else {
                    Message.show(title,content,status,time);
                }


            })
        },
        RegiSucc:function () { //注册成功跳转
                var number = 3;
                var i =  setInterval(function () {
                    number --
                    $("#timeTipBoxID").text(number);
                    if (number === 0){
                        setInterval(i)
                        window.location.href = 'login.html';
                    }
                },1000);

        },
        Phoneval:function () {//存手机号
            var phoneval = $(".phone").val();
            localStorage.setItem('phone',phoneval);
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
        }
        
    }
