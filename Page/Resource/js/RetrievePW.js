$(document).ready(function(){
    //当输入邮箱，验证邮箱格式
    
    //点击发送验证码，向后台发送指令，给该邮箱发送验证信息
    
    //验证后台发回的验证码和  输入的验证码  比对
    
    //点击  验证邮箱部分的下一步按钮
    $("h5.retrieve_next").click(function(){
        $("dl.retrievePW_checkemail").hide();
        $("p.retrieve_Ptwo").addClass("redbgcolor");
        $("dl.retrievePW_newPW").show();
    });
});
