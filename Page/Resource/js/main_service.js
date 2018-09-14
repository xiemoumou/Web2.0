var Main = {
	layerIndex: 0,
    userInfo: {},//获取用户信息
    currentClickObj: null,
    getUrl: Common.getUrl(),//请求接口的URL
    iframe: $("#cont_iframe"),
    ifrDocument: {},//子页面
    functionalInterface: Common.functionalInterface(),//功能接口
    dropList:{},
    init: function () {//初始化
        var that=this;
        that.getDropListtData();//获取下拉菜单
        Main.userInfo = Main.getUserInfo();
        $(".exit").on("click", function () { Main.exitSystem(); });//绑定推出系统按钮事件
        $("#nickname").html(Main.userInfo.nickname);//显示昵称
		
		//点击新建订单，弹出 新建订单 的 弹窗
		$(document).on("click",".createOrder",function(){
			var url = encodeURI('../page_service/newOrder.html');
	        Main.layerIndex = layer.open({
	            type: 2,
	            title: '',
	            shadeClose: false,
	            shade: 0.1,
	            area: ['920px', '640px'],
	            content: url
	        });

		});
		
        //点击空白隐藏搜索下拉菜单或个人中心下拉菜单
        $(window).click(function () {
            if (Main.currentClickObj) {
                $(Main.currentClickObj).hide();
                Main.currentClickObj = null;
            }
        })
        $("#cont_iframe").click(function () {
            if (Main.currentClickObj) {
                $(Main.currentClickObj).hide();
                Main.currentClickObj = null;
            }
        })

        $("#resource").click(function () { window.location.href = '../resource.html'; });//点击素材库
        Main.navInit();//左侧导航初始化
        Main.search.init();//初始化搜索框
        Main.personal.init();//个人中心

        Main.ifrDocument = document.getElementById("cont_iframe").contentWindow;//获取子页面

        var nav_handle= $("#nav_handle");
        var nav_business= $("#nav_business");
        //显示经理角色事务处理
        if(that.userInfo.roletype==4)
        {
            $(".createOrder").addClass("hide");
            nav_handle.removeClass('hide');
            nav_business.removeClass('top-115');
            nav_business.addClass("top-218");


            //设置左侧导航高度
            var offsetHeight=$(window).height();
            var surplus=477;
            if(offsetHeight>=913)
            {
                offsetHeight=913;
            }
            var height=offsetHeight-surplus;
            $("#nav_business ul").css("height",height+"px");
            $("#nav_business ul").css("overflow-y","scroll");
            $("#nav_business ul").css("overflow-x","hidden");

            window.onresize=function () {
                offsetHeight=$(window).height();
                if(offsetHeight>=913)
                {
                    offsetHeight=913;
                }
                height=offsetHeight-surplus;
                $("#nav_business ul").css("height",height+"px");
            }
        }

        Main.setMainHeight(); $(window).resize(function () { Main.setMainHeight(); });//设置内容展示区域的高度
        //Main.redDot();//获取导航信息  因为首次加载由子页面调用了所以此处不用再调

        //修改密码
        $(".modifyPwd").on("click",function () {
            Common.PopResetPasswords();
        });

    },
    getDropListtData:function () {
        var that=this;
        var url=Common.getUrl()['order']+Common.getDataInterface()["material"];
        var data={
            "product":"product",
            "technology":"technology",
            "mold":"mold",
            "color":"mold",
            "material":"material",
            "fitting":"fitting"
        };
        Common.ajax(url,data,false,function (data) {
            
            var product="";
            var material="";
            var fitting="";
            var technology="";
            var color="";
            $.each(data.product,function (i,item) {
                product+="<li>"+item+"</li>";
            });
            $.each(data.material,function (i,item) {
                material+="<li>"+item+"</li>";
            });
            $.each(data.fitting,function (i,item) {
                fitting+="<li>"+item+"</li>";
            });
            $.each(data.technology,function (i,item) {
                var a = $.inArray('无',item);
                if (a !=0){
                    technology+="<label>"+"<input class='drop-cbx' value ='"+item+"' type ='checkbox' >"+item+"</label>";
                }else {
                    technology+="<label>"+"<input class='cbx-none' value = '"+item+"' type ='checkbox' >"+item+"</label>";
                }
            });
            $.each(data.color,function (i,item) {
                var b = $.inArray('无',item);
                if (b !=0){
                    color+="<label>"+"<input class='drop-cbx' value = '"+item+"' type ='checkbox' >"+item+"</label>";
                }else {
                    color+="<label>"+"<input class='cbx-none' value = '"+item+"' type ='checkbox' >"+item+"</label>";
                }
            });
            that.dropList["productType"]=product;
            that.dropList["texturename"]=material;
            that.dropList["accessoriesname"]=fitting;
            that.dropList["machining"]=technology;
            that.dropList["color"]=color;
        },null,null,false);
    },
    navInit: function () {//左侧导航初始化
        if (sessionStorage.getItem("src_service")&&sessionStorage.getItem("src_service")!="null") { //页面刷新仍保持原页面
            Main.iframe.attr("src", sessionStorage.getItem("src_service"));
            var modeClass = sessionStorage.getItem("modeName_service");
            $('.' + modeClass).addClass("active");
        }
        else { //新打开页面走这里默认加载全部订单
            $(".nav-customer ul li").removeClass("active"); $(".nav-customer ul li").eq(0).addClass("active");//选中全部订单按钮
            Main.iframe.attr("src", "./service/waiting_handle.html");
            sessionStorage.setItem("modeName_service", "all-order");
            sessionStorage.setItem("src_service", "./service/waiting_handle.html");
        }

        //导航点击事件绑定
        $(".thing-handle").click(function () {//事物处理
            navClick(this, './service/thing_handle.html', 'thing-handle');
        });
        $(".invoice").click(function () {//开发票
            navClick(this, './service/invoice_list.html', 'invoice');
        });
        $(".order-admin").click(function () {//开发票
            navClick(this, './service/order_admin.html', 'order-admin');
        });
        $(".packing").click(function () {//包装
            navClick(this, './service/packing.html', 'packing');
        });
        $(".all-order").click(function () {//全部订单
            navClick(this, './service/waiting_handle.html', 'all-order');
        });
        $(".consulting").click(function () {//咨询中订单
            navClick(this, './service/consulting.html', 'consulting');
        });
        $(".waiting-design").click(function () {//设计中订单
            navClick(this, './service/waiting_design.html', 'waiting-design');
        });
        $(".wait-pay").click(function () {//待支付订单
            navClick(this, './service/wait_pay.html', 'wait-pay');
        });
        $(".wait-distriProduct").click(function () {//待分配生产
            navClick(this, './service/wait_distriProduct.html', 'wait-distriProduct');
        });
        $(".production").click(function () {//生产中
            navClick(this, './service/workshop.html', 'inProduct');
        });
        $(".mail").click(function () {//邮寄中
            navClick(this, './service/inMail.html', 'inProduct');
        });
        $(".after-processing").click(function () {//售后处理中
            navClick(this, './service/after_processing.html', 'after-processing');
        });
        
        $(".cancelled").click(function () {//已取消订单
            navClick(this, './service/cancelled.html', 'cancelled');
        });
        $(".completed").click(function () {//已完成订单
            navClick(this, './service/completed.html', 'completed');
        });

        $(".invoice").hover(function(){//开发票
            $(".invoice span").css("background","url('../images/icon/view.png') no-repeat -24px -2px");
        },function(){
            $(".invoice span").css("background","url('../images/icon/view.png') no-repeat -2px -2px");
        });
        $(".thing-handle").hover(function(){//事务处理
            $(".thing-handle span").css("background","url('../images/icon/view.png') no-repeat -46px -2px");
        },function(){
            $(".thing-handle span").css("background","url('../images/icon/view.png') no-repeat -68px -2px");
        });

        $(".packing").hover(function(){//包装
            $(".packing span").css("background","url('../images/icon/view.png') no-repeat -46px -2px");
        },function(){
            $(".packing span").css("background","url('../images/icon/view.png') no-repeat -68px -2px");
        });

        //导航点击事件
        function navClick(obj, path, listItemName) {

            sessionStorage.setItem('pageIndex','');//分页保持
            $(".nav-customer ul li").removeClass("active");
            $(obj).addClass("active");
            Main.iframe.attr("src", path);
            sessionStorage.setItem("modeName_service", listItemName);
            sessionStorage.setItem("src_service", path);
        }
    },
    uncheckedNav: function () {//取消导航选中状态
        $(".nav-customer ul li").removeClass("active");
    },
    getUserInfo: function () { //从cookie中获取用户基础信息
        var userid = $.cookie('userid');
        var token = $.cookie('token');
        var roletype = $.cookie('roletype');
        var nickname = $.cookie("nickname");
        if (userid == "null" || !userid) {
            window.location.href = '../login.html';//如果userid没有拿到则退出系统
        }
        return { "userid": userid, "token": token, "roletype": roletype, "nickname": nickname };
    },
    exitSystem: function () { //退出系统
        var url = Main.getUrl["sso"] + Common.functionalInterface()["exit_system"];
        Common.ajax(url, {
            "userid": Main.userInfo.userid,
            "token": Main.userInfo.token,
            "roletype": Main.userInfo.roletype,
            "commandcode": 12,
            "logway": 0
        },
            true,
            function (data) {
                if (data.status.code == 0) {
                    $.cookie("userid", null, { path: "/" });
                    $.cookie("token", null, { path: "/" });
                    $.cookie("roletype", null, { path: "/" });
                    $.cookie('nickname', null, { path: "/" });
                    setTimeout(function () {
                        window.location.href = '../login.html';
                    }, 100);
                }
            },function (err) {
                window.location.href = '../login.html';
            }
        );
    },
    setMainHeight: function () {//设置内容展示区域的高度
        var winH = window.innerHeight;
        var aa= $(window).height();
        if (winH) {
            winH -= 200;
        }
        $(".main").css("height", winH + "px");

        var pop_msg = $("#pop_msg");//ifream的高度
        if (pop_msg.css("display") == "block") {
            $(".content").css("height", winH - pop_msg[0].scrollHeight + "px");
        }
        else {
            $(".content").css("height", winH + "px");
        }
    },
    search: {//初始化搜索框
        init: function () {
            $(".searBtn").on("click", function () {
                var seaVal = $("#searchCon").val();
                var searchType = $.trim( $(".search .select_txt").text() );
                var type = "orderId";
                if ($.trim(seaVal) == "") {
                    $("#searchCon").val("");
                    Common.msg('不能搜索空内容');
                    return;
                };
                //判断搜索内容的类型
                if(searchType == "订单号"){
                	type = "orderId";
                }else if(searchType == "旺旺号"){
                	type = "wangwId";
                }
                
                Main.iframe.attr("src", "./service/search.html?type="+ type +"&value=" + seaVal);
                Main.uncheckedNav();//取消导航选中状态
            });

            document.onkeyup = function (e) {
                var code = e.charCode || e.keyCode;
                if (code == 13) {
                    var seaVal = $("#searchCon").val();
                    var searchType = $.trim( $(".search .select_txt").text() );
                    var type = "orderId";
                    if ($.trim(seaVal) == "") {
                        $("#searchCon").val("");
                        Common.msg('不能搜索空内容');
                        return;
                    };
                    //判断搜索内容的类型
                    if(searchType == "订单号"){
                        type = "orderId";
                    }else if(searchType == "旺旺号"){
                        type = "wangwId";
                    }

                    Main.iframe.attr("src", "./service/search.html?type="+ type +"&value=" + seaVal);
                    Main.uncheckedNav();//取消导航选中状态
                }
            }
        },
        typeSelect: function () {//类型选择列表

        }
    },
    personal: {//个人中心
        init: function () {
            $(".userinfo").click(function (e) {
                $(".userinfo .user-select").toggle();
                Main.currentClickObj = $(".userinfo .user-select");
                e.stopPropagation();//阻止冒泡
            });
        },
        bindClick: function () {
            //处理个人中心列表点击事件
            // var li = $(".search .mod_select .select_box .option").find('li');;
            // $.each(li, function (i, item) {
            //     $(item).on('click', function (e) {
            //         //$(this).ht 
            //     });
            // });
        }
    },
    robbery: function (orderId, customid, callback) {//抢单
        var url = Main.getUrl["order"] + Main.functionalInterface["robbery"];
        var requestData = {
            "userid": Main.userInfo.userid,
            "orderid": orderId,
            "customid": customid,
            "roletype": Main.userInfo.roletype,
            "token": Main.userInfo.token,
            "commandcode": 143,
            "isreceive": 1
        };
        callback(url, requestData, orderId, customid);//执行回调
    },
    demandDetails: function (orderId, customid, isRobbery) {//需求详情
        Main.uncheckedNav();//取消导航选中状态
        Main.iframe.attr("src", "./design/demand_details.html?orderId=" + orderId + "&customid=" + customid + "&isrobbery=" + isRobbery);
    },
    designDraft: function (orderId, customid) {//消息跳转
        Main.uncheckedNav();//取消导航选中状态
        Main.iframe.attr("src", "./service/order_details.html?orderid=" + orderId + "&customid=" + customid);
    },
    redDot: function (callback) {//更新导航数据
        var all_order = $(".all-order i");//全部订单
        var consulting = $(".consulting i");//咨询中
        var waiting_design = $(".waiting-design i");//设计中
        var wait_pay = $(".wait-pay i");//待支付
        var wait_distriProduct = $(".wait-distriProduct i");//待分配生产
        var production = $(".production i");//生产中
        var mail = $(".mail i");//邮寄中
        var after_processing = $(".after-processing i");//售后处理中
        var cancelled = $(".cancelled i");//已取消订单
        var completed = $(".completed i");//已完成订单

        //var navObjList = { "0": all_order, "2": waiting_list, "3": waiting_design, 
        				   //"5": waiting_modification, "7": cancelled, "8": completed };

        var url = Main.getUrl["manager"] + Common.getDataInterface()["update_nav"];//更新导航数据单接口地址
        Common.ajax(url, {
            "userid": Main.userInfo.userid,
            "token": Main.userInfo.token,
            "roletype": Main.userInfo.roletype
        },
            true,
            function (data) {
                if (data != null && data.workflow != null && data.workflow.length > 0) {
                    var orderCount = data.workflow;
                    //全部订单的数目
                    if (orderCount[0].num == 0) {
                    	all_order.hide();
                    }else{
                    	all_order.text( orderCount[0].num ).show();
                    }
                    //咨询中订单的数目
                    if (orderCount[2].num == 0) {
                    	consulting.hide();
                    }else{
                    	consulting.text( orderCount[2].num ).show();
                    }
                    //设计中订单的数目
                    if ((orderCount[3].num + orderCount[4].num) == 0) {
                    	waiting_design.hide();
                    }else{
                    	waiting_design.text( orderCount[3].num + orderCount[4].num).show();
                    }
                    //待支付订单的数目
                    if (orderCount[5].num == 0) {
                    	wait_pay.hide();
                    }else{
                    	wait_pay.text( orderCount[5].num ).show();
                    }
                    //待分配生产订单的数目
                    if (orderCount[6].num == 0) {
                    	wait_distriProduct.hide();
                    }else{
                    	wait_distriProduct.text( orderCount[6].num ).show();
                    }
                    //生产中
                    if ((orderCount[7].num) == 0) {
                        production.hide();
                    }else{
                        production.text( orderCount[7].num).show();
                    }
                    //邮寄中
                    if ((orderCount[8].num) == 0) {
                        mail.hide();
                    }else{
                        mail.text( orderCount[8].num).show();
                    }

                    //售后处理中订单的数目
                    if ((orderCount[9].num + orderCount[10].num + orderCount[11].num) == 0) {
                    	after_processing.hide();
                    }else{
                    	after_processing.text( orderCount[9].num + orderCount[10].num + orderCount[11].num ).show();
                    }
                    //已取消订单的数目
                    if (orderCount[12].num == 0) {
                    	cancelled.hide();
                    }else{
                    	cancelled.text( orderCount[12].num ).show();
                    }
                    //已完成订单的数目
                    if (orderCount[13].num == 0) {
                    	completed.hide();
                    }else{
                    	completed.text( orderCount[13].num ).show();
                    }
                    /*$.each(orderCount, function (i, item) {
                        var k = i.toString();
                        if (navObjList[k] != null) {
                            if (item.num > 0) {
                                navObjList[k].show();
                                navObjList[k].html(item.num);
                            }
                            else {
                                navObjList[k].hide();
                            }
                        }
                    });*/
                    if (callback) {//回调
                        callback(data.workflow);
                    }
                }
            },
            function (error) {
                console.error('获取导航信息失败!');
            },
            null,
            false
        );
    }
};

//初始化
$(function () {
    Main.init();
    $("body").append($('<ul id="previewImg"></ul>'));//图片预览用
    checkScreen();
});

function checkScreen() {//检查屏幕分辨率
    var height= window.screen.height;
    var width=window.screen.width;
    if(height<768||width<1200) {

        layer.confirm('分辨率低于：1366 x 768 , 将影响页面显示，建议使用高于此分辨率的显示器', {
            btn: ['我知道了']//按钮
        }, function (index) {
            layer.close(index);
        });
    }
}

//图片预览
var previewImg={
    insert:function (url) {
        $('#previewImg').html("");
        var li=$('<li style="display: none;"><img src="'+url+'" data-original="'+url+'"/></li>');
        $('#previewImg').append(li);
        $('#previewImg').viewer({
            url: 'data-original',
        });
        $("#previewImg").viewer('update');
    },
    show:function () {
        var img=$('#previewImg').find('li').find('img');
        $(img[0]).click();
    }
};

//设置弹出窗体高度
var setPopSize=function (width,height) {
    var iframe=$(".layui-layer-iframe");
    iframe.css("height",height+73+"px");
    iframe.find('iframe').css("height",height+28+"px");
}


