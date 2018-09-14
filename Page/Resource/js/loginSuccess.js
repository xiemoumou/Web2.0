

$(document).ready(function(){
	var userid = $.cookie("userid");	
	var uToken = $.cookie("token");
	var uRoletype = $.cookie("roletype");
	roleId=uRoletype;
	console.log(userid, uToken, uRoletype);	
	if( uRoletype == 0){
		$("p.myWorkstage").parent().hide();
	}
	if( uRoletype == 1 || uRoletype == 2 || uRoletype == 3 ){
		$("h4.goback_workstage").click(function(){
			/* 跳转至工作台页面 */
			getWorkstage();
		});
	}

	var surplus=192;
	$("#content").css("height", $(window).height()-surplus+"px");
	window.onresize=function () {
		$("#content").css("height", $(window).height()-surplus+"px");
	}
});

var loginSuccess={
	PopResetPasswords:function () {//弹出重置密码窗口
		layer.open({
			type: 2,
			title: '',
			shadeClose: false,
			shade: 0.1,
			area: ['360px', '240px'],
			content: './resetPassword.html'
		});
	}
};

