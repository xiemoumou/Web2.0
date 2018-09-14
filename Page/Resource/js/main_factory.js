var Main = {
    userInfo: {},//获取用户信息
    currentClickObj: null,
    getUrl: Common.getUrl(),//请求接口的URL
    iframe: $("#cont_iframe"),
    ifrDocument: {},//子页面
    functionalInterface: Common.functionalInterface(),//功能接口
    init: function () {//初始化
        Main.userInfo = Main.getUserInfo();
        $(".exit").on("click", function () { Main.exitSystem(); });//绑定推出系统按钮事件
        $("#nickname").html(Main.userInfo.nickname);//显示昵称
        Main.setMainHeight(); window.onresize = function () { Main.setMainHeight(); }//设置内容展示区域的高度

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

        //$("#resource").click(function () { window.location.href = '../resource.html'; });//点击素材库
        Main.navInit();//左侧导航初始化
        Main.search.init();//初始化搜索框
        Main.personal.init();//个人中心

        Main.ifrDocument = document.getElementById("cont_iframe").contentWindow;//获取子页面

        //Main.redDot();//获取导航信息  因为首次加载由子页面调用了所以此处不用再调

        //修改密码
        $(".modifyPwd").on("click",function () {
            Common.PopResetPasswords();
        });

    },
    navInit: function () {//左侧导航初始化
        if (sessionStorage.getItem("src_factory")&&sessionStorage.getItem("src_factory")!="null") { //页面刷新仍保持原页面
            Main.iframe.attr("src", sessionStorage.getItem("src_factory"));
            var modeClass = sessionStorage.getItem("modeName_factory");
            $('.' + modeClass).addClass("active");
        }
        else { //新打开页面走这里默认加载全部订单
            $(".nav ul li").removeClass("active"); $(this).addClass("active");//选中全部订单按钮
            Main.iframe.attr("src", "./factory/waiting_handle.html");
            sessionStorage.setItem("modeName_factory", "all-order");
            sessionStorage.setItem("src_factory", "./factory/waiting_handle.html");
        }

        //导航点击事件绑定
        $(".all-order").click(function () {//全部订单
            navClick(this, './factory/waiting_handle.html', 'all-order');
        });
        
        $(".quotation").click(function () {//未报价订单
            navClick(this, './factory/quotation.html', 'quotation');
        });
        $(".hasQuotation").click(function () {//已报价订单
            navClick(this, './factory/hasQuotation.html', 'hasQuotation');
        });
        $(".newFactoryOrder").click(function () {//待接受生产
            navClick(this, './factory/newFactoryOrder.html', 'newFactoryOrder');
        });
        $(".inProduct").click(function () {//生产中订单
            navClick(this, './factory/inProduct.html', 'inProduct');
        });
        $(".inMail").click(function () {//邮寄中订单
            navClick(this, './factory/inMail.html', 'inMail');
        });
        $(".after-processing").click(function () {//售后处理中
            navClick(this, './factory/after_processing.html', 'after-processing');
        });
        
        $(".cancelled").click(function () {//已取消订单
            navClick(this, './factory/cancelled.html', 'cancelled');
        });
        $(".completed").click(function () {//已完成订单
            navClick(this, './factory/completed.html', 'completed');
        });

        //导航点击事件
        function navClick(obj, path, listItemName) {
            sessionStorage.setItem('pageIndex','');//分页保持
            $(".nav ul li").removeClass("active");
            $(obj).addClass("active");
            Main.iframe.attr("src", path);
            sessionStorage.setItem("modeName_factory", listItemName);
            sessionStorage.setItem("src_factory", path);
        }
    },
    uncheckedNav: function () {//取消导航选中状态
        $(".nav ul li").removeClass("active");
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

                Main.iframe.attr("src", "./factory/search.html?type="+ type +"&value=" + seaVal);
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
                    
                    Main.iframe.attr("src", "./factory/search.html?type="+ type +"&value=" + seaVal);
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
        Main.iframe.attr("src", "./factory/order_details.html?orderid=" + orderId + "&customid=" + customid);
    },
    redDot: function (callback) {//更新导航数据
        var all_order = $(".all-order i");//全部订单
        var quotation = $(".quotation i");//未报价
        var hasQuotation = $(".hasQuotation i");//已报价
        var newFactoryOrder = $(".newFactoryOrder i");//待接受生产
        var inProduct = $(".inProduct i");//生产中订单
        var inMail = $(".inMail i");//邮寄中订单
        var after_processing = $(".after-processing i");//售后处理中
        var cancelled = $(".cancelled i");//已取消订单
        var completed = $(".completed i");//已完成订单


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
                    //未报价订单的数目
                    if (orderCount[2].num == 0) {
                    	quotation.hide();
                    }else{
                    	quotation.text( orderCount[2].num ).show();
                    }
                    //已报价订单的数目
                    if ( orderCount[3].num== 0 ) {
                    	hasQuotation.hide();
                    }else{
                    	hasQuotation.text( orderCount[3].num ).show();
                    }
                    //待接受生产订单的数目
                    if (orderCount[4].num == 0) {
                    	newFactoryOrder.hide();
                    }else{
                    	newFactoryOrder.text( orderCount[4].num ).show();
                    }
                    //生产中订单的数目
                    if ( orderCount[5].num == 0) {
                    	inProduct.hide();
                    }else{
                    	inProduct.text( orderCount[5].num ).show();
                    }
                    //邮寄中订单的数目
                    if ( orderCount[6].num == 0) {
                    	inMail.hide();
                    }else{
                    	inMail.text( orderCount[6].num ).show();
                    }
                    //售后处理中订单的数目
                    if ((orderCount[7].num + orderCount[8].num + orderCount[9].num) == 0) {
                    	after_processing.hide();
                    }else{
                    	after_processing.text( orderCount[7].num + orderCount[8].num + orderCount[9].num ).show();
                    }
                    //已取消订单的数目
                    if (orderCount[10].num == 0) {
                    	cancelled.hide();
                    }else{
                    	cancelled.text( orderCount[10].num ).show();
                    }
                    //已完成订单的数目
                    if (orderCount[11].num == 0) {
                    	completed.hide();
                    }else{
                    	completed.text( orderCount[11].num ).show();
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
    $("body").append($('<ul id="previewImg"></ul>'));
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