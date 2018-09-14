// //研发
var url_logistics = "http://192.168.1.150:8082",
    url_manager = "http://192.168.1.150:8082",
    url_order = "http://192.168.1.150:8082",
    url_sso = "http://192.168.1.150:8082";


// //正式
// var url_logistics = "http://118.126.116.76:8080",
//     url_manager = "http://118.126.116.76:8081",
//     url_order = "http://118.126.116.76:8082",
//     url_sso = "http://118.126.116.76:8083";



//预发布
var url_logistics = "http://119.27.172.55:8080",
    url_manager = "http://119.27.172.55:8081",
    url_order = "http://119.27.172.55:8082",
    url_sso = "http://119.27.172.55:8083";



var deadline = 0, offerPrice = 0,
    str_pic1_task = "",
    str_pic2_task = "",
    str_pic3_task = "";
$(function () {
    //如果未登录，自动跳转至登录页面
    // if ($.cookie("userid") == null) {
    //     window.location.href = 'login.html';
    // };
});

//获得随机代码并且  拼接  年月日
function getRandomName() {
    var mydate = new Date(),
        year = mydate.getFullYear(),
        month = mydate.getMonth() + 1,
        day = mydate.getDate(),
        hour = mydate.getHours(),
        mint = mydate.getMinutes(),
        secd = mydate.getSeconds();
    if (month <= 9) {
        month = "0" + month;
    }
    if (day <= 9) {
        day = "0" + day;
    }
    if (hour <= 9) {
        hour = "0" + hour;
    }
    if (mint <= 9) {
        mint = "0" + mint;
    }
    if (secd <= 9) {
        secd = "0" + secd;
    }
    var str_ran = (Math.random() * 2).toString(30).substr(2);
    return "order/" + year + month + day + "/" + year + month + day + "-" + hour + mint + secd + str_ran;
}
//定义函数，只输入数字和一位小数
function clearNoNum(obj) {
    
    obj.value = obj.value.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符
    obj.value = obj.value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
    obj.value = obj.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d).*$/, '$1$2.$3');//只能输入两个小数

    if (obj.value.indexOf(".") < 0 && obj.value != "") {//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
        obj.value = parseFloat(obj.value);
    }
}

///仿alert弹出框
function copyAlert(str1) {
    $("div.pop_copyAlert").show();
    $("span.message_copyAlert").text(str1);
};
function closeAlert() {
    $("div.pop_copyAlert").hide();
}
///跳转至素材库
function getResource() {

    window.location.href = 'resource.html';
}
//跳转到工作台页面、全部订单 
function getWorkstage() {
    setTimeout(function () {
        var uRoletype = $.cookie("roleType");
        if (uRoletype == 2)//设计师
        {
            window.location.href = './page/main.html';
        }
        else if (uRoletype == 1)//客服
        {
            window.location.href = './page_service/main.html';
        } else if (uRoletype == 3) {

            window.location.href = './page_factory/main.html';
        }
        else if (uRoletype == 4) {//经理角色

            window.location.href = './page_service/main.html';
        }
        else {
            window.location.href = './index.html';//首页
        }
    }, 100);
    /*window.open("workstage.html");*/
}
//跳转到  物流信息  界面
function getLogisticsMess() {
    window.location.href = 'logisticsMess.html';
}
//跳转到任务列表
function getTaskList() {
    window.location.href = 'taskList.html';
    //window.open("taskList.html");
}
//跳转到草稿箱
function getDraft() {
    window.location.href = 'draft.html';
    //window.open("draft.html");
}
//跳转到新建订单
function getNewOrder() {
    window.location.href = 'newOrder.html';
    /* window.open("newOrder.html");*/
}
//跳转到订单详情
function getOrderDetail() {
    window.location.href = 'orderdetail.html';
    /*window.open("orderdetail.html");*/
}
//跳转到意见反馈页面
function getFeednack() {
    window.location.href = "feednack.html";
}
//跳转至意见反馈
function getSpitslot() {
    window.location.href = "spitslot.html";
}
//显示新建任务
function show_newTask() {
    $("div.newTask").show();
};
//验证input输入数字
function checkNum(that) {
    var intPattern = /^0$|^[1-9]\d*$/; //验证整数
    return intPattern.test(that);
}
//跳转到工作台，并显示新建任务
function get_newTask() {
    getWorkstage();
    var timeout = setTimeout(function () {
        show_newTask();
    }, 1500);
    /* clearTimeout(timeout,1600);*/
}

//默认光标指向textarea的第一个字符
function toTextFirst(e, ele) {


    /*if ( e && e.preventDefault )
     e.preventDefault();
     else
     window.event.returnValue=false;
     ele.focus();*/

}
//定义延时函数
function delayTime(o, ti) {
    //转义 ti 变量为   数字
    var wait = parseInt(ti);

    function time(o) {

        if (wait == 0) {
            o.removeAttribute("disabled");
            o.value = "免费获取验证码";
            wait = parseInt(ti);

        } else {
            o.setAttribute("disabled", true);
            --wait;
            o.value = wait + "秒后可以重新发送";
            console.log(typeof wait, wait);

            setTimeout(function () {
                    time(o)
                },
                2000)
        }
    }

    time(o);
}
//将手机号转变成135****3456的格式
function changeTel(telNum) {
    var str = telNum.substr(3, 4);
    return telNum.replace(str, "****");
}

$(function () {
    /* 获取cookie并设置昵称 */
    var userid = $.cookie('userId'),
        token = $.cookie('token'),
        roletype = $.cookie('roleType'),
        uNickname = $.cookie("mickName");


    // if (roletype == "2" || roletype == "3") {
    //     /*console.log(typeof roletype);*/
    //     $("div.totop_box a.newOrderBtn").hide();
    //     $("div.totop_box a.shippingListBtn").hide();
    //     $("div.searSort ul li").eq(0).hide();
    //     $("input#searchCon").attr("placeholder", "请输入您要搜索的订单号等");
    // } else if (roletype == "1") {
    //     $("div.reviewArea").show();
    //     $("input#searchCon").attr("placeholder", "请输入您要搜索的旺旺号或订单号");
    // }
    // ;
    //当角色是工厂时，隐藏进入资源库的按钮
    if (roletype == "3") {
        $("#header h4 p").eq(1).hide();
    }
    ;

    $("dt.ddstyle").children("span").text(uNickname);

    //实现鼠标在用户名与个人中心 移动的样式效果
    $("#header dl").hover(function () {
        $("#header dl dt").css({"color": "#e84b4c"});
        $("#header dd.ddstyle").slideDown(100);
    }, function () {
        $("#header dl dt").css({"color": "#6a6868"});
        $("#header dd.ddstyle").slideUp(100);
    });


});
$(document).ready(function () {
    var userid = $.cookie('userid'),
        token = $.cookie('token'),
        roletype = $.cookie('roletype');
    //点击  × ，让任务的提示消失。
    $(document).on("click", ".icon-error-20170103", function () {
        $(this).parent(".notice_rig").hide();
    });

    //如果未登录，自动跳转至登录页面
    /*if( userid == null ){
     window.location.href = 'login.html';
     };*/
    ///当点击仿alert中的 关闭按钮时，仿alert框隐藏
    $(document).on("click", "button.close_copyAlert", function (e) {
        var oEvent = e || window.event;
        oEvent.cancelBubble = true;
        $(this).parent().parent().hide();
        $("div.pop_copyAlert").hide();
    });

    /*-------------点击退出，重新进入登录页面---------------*/
    $("dd.exitLoginBtn").click(function () {

        $.ajax({
            type: "GET",
            url: url_sso + "/zb-sso-web/user/exitDele.do",
            data: {
                "userid": userid,
                "token": token,
                "roletype": parseInt(roletype),
                "commandcode": 12,
                "logway": 0
            },
            dataType: "JSON",
            success: function (res) {
                console.log(res);
                if (res.status.code == 0) {
                    $.cookie("token", null);
                    $.cookie("mickName", null);
                    $.cookie("roleType", null);
                    $.cookie("userId", null);
                    $.cookie("phone", null);
                    $.cookie("password", null);
                    sessionStorage.setItem("Url", url_order + "/zb-order-web/order/waitHandle.do");
                    sessionStorage.setItem("pageNum", 1);
                    sessionStorage.setItem("code", 18);
                    setTimeout(function () {
                        window.location.href = '../Member/login.html';
                    }, 100);
                } else {

                }

            }
        });
        setTimeout(function () {
            window.location.href = '../Member/login.html';
        }, 500);

    });
    /*----------当点击新建订单时， 发起请求----------- */
    $(document).on("click", "a.newOrderBtn", function (event) {
        getNewOrder();

    });


    /* 点击取消订单，弹出取消订单页面 */
    $(document).on("click", "a.workstage_cancelOrder", function () {
        var customid = $(this).attr("data-customid");
        var orderid = $(this).attr("data-orderid");

        $.ajax({
            type: "GET",
            url: url_order + "/zb-order-web/order/orderCancellation.do",
            data: {
                "orderid": orderid,
                "userid": userid,
                "customid": customid,
                "roletype": parseInt(roletype),
                "token": token
            },
            dataType: "JSON",
            success: function (res) {
                console.log(res);
            }
        });
        $("div.cancel_order").show();
    });

    setTimeout(function () {
        //用localStorage获取用户列表
        var userList = ( JSON.parse(localStorage.getItem("user")) ), str_ul = "";
        if (userList)
            userList = userList.userlistinfo;
        else
            return;

        for (var i = 0; i < userList.length; i++) {
            str_ul += '<li data-userid=' + userList[i].userid + '>' + userList[i].nickname + '</li>';
        }
        $("ul.toReceiver_ul").html(str_ul);
    }, 5000);

    ///判断所点击选择的昵称，从而获取userid
    $(document).on("click", "ul.toReceiver_ul", function (eve) {
        var eve = eve || window.event;
        //console.log(eve.target);
        $("span.toReceiver_cont").attr("data-userid", $(eve.target).attr("data-userid"));
    })

    /*----------当点击新建任务的确认按钮时， 发起请求，上传数据------- */
    $(document).on("click", "button.newTaskBtn", function (event) {
        event.preventDefault();
        //console.log("abc", $userid);
        var orderId = $.trim($("input.newTask_orderId").val());
        var period = $.trim($("input.newTask_deadline").val());
        var receiverid = $("span.toReceiver_cont").attr("data-userid");
        var txt = $.trim($("textarea.newTask_text").val());
        //taskreceiver=10000024&tasktype=0&taskperiod=30&taskinfo=你好世界&
        //taskimageurl1=task/20180314/j4cGvR0Cb9TUiGAixqxXdYwojGRtWTjvZmLhrYC7uv8OAF7JPowZLVvyoJ70h5LlwPW1gEWZ.png&
        //taskimageurl2=task/20180314/j4cGvR0Cb9TUiGAixqxXdYwojGRtWTjvZmLhrYC7uv8OAF7JPowZLVvyoJ70h5LlwPW1gEWZ.png
        $.get(
            url_manager+"/zb-manager-web/task/createTasklist.do",
            {
                "userid": userid,
                "token": token,
                "roletype": roletype,
                "tasktype": 0,
                "commandcode": 90,
                "orderid": orderId,
                "taskreceiver": receiverid,
                "taskperiod": period,
                "taskinfo": txt,
                "taskimageurl1": str_pic1_task,
                "taskimageurl2": str_pic2_task,
                "taskimageurl3": str_pic3_task
            },
            function (res) {
                console.log(res);
                if (res.status.code == "0") {
                    console.log(res.status.msg);
                    //$.cookie("orderId", res.orderinfo.orderId);
                    //$.cookie("id", res.orderinfo.id);
                    $("div.newTask").hide();
                } else {
                    console.log(res.status.msg);
                }
            },
            "json"
        );
    });

    //发起询价
    $(document).on("click", ".workstage_enquiryBtn", function () {
        var $this = $(this),
            orderid = $(this).parent().attr("data-orderid"),
            customid = $(this).parent().attr("data-customid"),
            goodsid = $(this).parent().attr("data-goodsid"),
            paystate = $(this).parent().attr("data-paystate");
        $this.css({"background-color": "#e8e8e8"});
        $.ajax({
            type: "GET",
            url: url_order + "/zb-order-web/ordersummary/send.do",
            data: {
                "orderid": orderid,
                "userid": userid,
                "customid": customid,
                "roletype": parseInt(roletype),
                "commandcode": 140,
                "token": token,
                "goodsid": goodsid,
                "paystate": paystate

            },
            dataType: "JSON",
            success: function (res) {
                console.log(res);

                $this.css({"background-color": "#fff"});
                $this.hide();
                copyAlert(res.status.msg);
                setTimeout(function () {
                    location.reload();
                }, 500);
            }
        });
    });

    //分配设计
    $(document).on("click", ".workstage_designBtn", function () {
        var $this = $(this),
            orderid = $(this).parent().attr("data-orderid"),
            customid = $(this).parent().attr("data-customid"),
            goodsid = $(this).parent().attr("data-goodsid");
        $this.css({"background-color": "#e8e8e8"});
        $.ajax({
            type: "GET",
            url: url_order + "/zb-order-web/ordersummary/designpat.do",
            data: {
                "orderid": orderid,
                "userid": userid,
                "customid": customid,
                "roletype": parseInt(roletype),
                "commandcode": 142,
                "token": token,
                "goodsid": goodsid

            },
            dataType: "JSON",
            success: function (res) {
                console.log(res);
                $(this).hide();
                copyAlert(res.status.msg);
                setTimeout(function () {
                    location.reload();
                }, 500);
            }
        });
    });
    //催单、催设计稿    workstage_reminderBtn  /zb-order-web/designpattern/designerReminders.do?
    //    userid=10000026&token=1&roletype=1&commandcode=148&orderid=205176024112001
    $(document).on("click", ".workstage_reminderBtn", function () {
        var $this = $(this),
            orderid = $(this).parent().attr("data-orderid"),
            customid = $(this).parent().attr("data-customid"),
            goodsid = $(this).parent().attr("data-goodsid");
        $this.css({"background-color": "#e8e8e8"});
        $.ajax({
            type: "GET",
            url: url_order + "/zb-order-web/designpattern/designerReminders.do",
            data: {
                "orderid": orderid,
                "userid": userid,
                "customid": customid,
                "roletype": parseInt(roletype),
                "commandcode": 148,
                "token": token
            },
            dataType: "JSON",
            success: function (res) {
                console.log(res);
                if (res.status.code == 0) {
                    //$this.hide();
                    $this.css({"background-color": "#fff"});
                }

                copyAlert(res.status.msg);

                setTimeout(function () {
                    location.reload();
                }, 1000);
            }
        });
    });
    //确认收货的事件
    $(document).on("click", ".workstage_confirmDeliveryBtn", function () {
        var $this = $(this),
            orderid = $(this).parent().attr("data-orderid"),
            customid = $(this).parent().attr("data-customid"),
            goodsid = $(this).parent().attr("data-goodsid");
        $this.css({"background-color": "#e8e8e8"});
        //根据cookie发起请求，获取订单详情的具体内容
        $.ajax({
            type: "GET",
            url: url_order + "/zb-order-web/order/confirmReceipt.do",
            data: {
                "userid": userid,
                "orderid": orderid,
                "roletype": roletype,
                "token": token,
                "customid": customid,
                "goodsid": goodsid,
                "commandcode": 59
            },
            dataType: "JSON",
            success: function (res) {
                //console.log(res);
                copyAlert(res.status.msg);
                setTimeout(function () {
                    location.reload();
                }, 500);
            }
        });
    });
    var orderid, customid;
    ////当点击蓝色的框中的  “确定按键”时，发起对应的事件
    $(document).on("click", ".offerFee_btn", function () {
        orderid = $(this).parent().parent().parent().attr("data-orderid"),
            customid = $(this).parent().parent().parent().attr("data-customid");

        if (roletype == 1) {
            // 客服定价
            var finalprice = ($(this).parent().find("input.offerFee").val()).replace(/[^0-9]/ig, "");//.substr(1)
            $(this).parent().parent().parent().prev("ol").find("li.orderCont4")
                .children("p").text("￥" + finalprice);
            console.log(userid, orderid, customid, roletype, token, finalprice);
            //根据cookie发起请求，进行客服定价
            $.ajax({
                type: "GET",
                url: url_order + "/zb-order-web/order/updateInquiryRule.do",
                data: {
                    "userId": userid,
                    "orderid": orderid,
                    "roleType": roletype,
                    "token": token,
                    "customid": customid,
                    "finalprice": finalprice,
                    "commandcode": 141
                },
                dataType: "JSON",
                success: function (res) {
                    console.log(res);
                    if (res.status.code == 0) {
                        copyAlert(res.status.msg);
                        setTimeout(function () {
                            location.reload();
                        }, 500);
                    } else {
                        copyAlert(res.errormsg);
                        setTimeout(function () {
                            location.reload();
                        }, 500);
                    }
                }
            });

        } else if (roletype == 3) {
            orderid = $(this).parent().parent().attr("data-orderid"),
                customid = $(this).parent().parent().attr("data-customid");
            var paystate = $(this).attr("data-paystate");
            if (paystate == 1) {
                copyAlert("客户已支付，不能报价");
                setTimeout(function () {
                    closeAlert();
                }, 800);
            } else {
                $("div.offer_factory_add").show();
                $("button.confirmOffer_work").show();
                deadline = $(this).attr("data-deadline");  //期限
                offerPrice = ($.trim($(this).prev("input").val())).replace(/[^0-9]/ig, "");
                $("p.prevOffer_factory").text("￥" + offerPrice);
                //return;
            }
            //工厂报价
            /*var returnprice = $(this).parent().find("input.offerFee").val();
             console.log(userid,orderid,customid,token,returnprice);
             //根据cookie发起请求，
             $.ajax({
             type: "GET",
             url: url_order+"/zb-order-web/order/updateInquiryRule.do",
             data: {

             "userId": userid,
             "orderid": orderid,
             "roleType": roletype,
             "token": token,
             "customid": customid,
             "returnprice": parseInt(returnprice),
             "commandcode": 141
             },

             dataType: "JSON",
             success: function(res){
             console.log(res);
             if(res.status.code == 0){
             copyAlert(res.status.msg);
             setTimeout(function(){
             location.reload();
             },500);
             }

             }
             });*/

        }

    });

    //弹窗 订单报价  点击  确定      工厂报价
    $(document).on("click", "button.confirmOffer_work", function () {


        var returnprice = parseInt($.trim($("input.offerVal_factory").val()));
        var productionCycle = parseInt($.trim($("input.productionCycle_factory").val()).replace(/[^0-9]/ig, ""));
        console.log(returnprice, productionCycle, deadline);//productionCycle == ""
        if (parseInt(deadline) >= productionCycle || deadline == 0) {
            if (returnprice != 0) {//&& productionCycle != 0
                //发起http请求，
                $.ajax({
                    type: "GET",
                    url: url_order + "/zb-order-web/order/updateInquiryRule.do",
                    data: {
                        "userId": userid,
                        "orderid": orderid,
                        "roleType": roletype,
                        "token": token,
                        "customid": customid,
                        "returnprice": parseInt(returnprice),
                        "productioncycle": productionCycle,
                        "commandcode": 141
                    },
                    dataType: "JSON",
                    success: function (res) {
                        console.log(res);
                        if (res.status.code == 0) {
                            copyAlert("工厂报价设置成功！");
                            setTimeout(function () {
                                location.reload();
                            }, 500);
                            $("div.offer_factory_add").hide();
                        } else {
                            copyAlert(res.status.msg);
                            setTimeout(function () {
                                location.reload();
                            }, 900);
                        }

                    }
                });
            }

        } else {
            //如果输入的生产周期小于 客户要求的截止日期，弹出
            copyAlert("客户截至工期要求为" + deadline + "天，请修改您的生产周期！");
            setTimeout(function () {
                closeAlert();
            }, 2000);
        }
        //paystate  else

    });


    ///点击客户 预算 的  确认  按键，触发事件
    $(document).on("click", "button.customFee_btn", function () {
        var orderid = $(this).parent().parent().parent().attr("data-orderid"),
            customid = $(this).parent().parent().parent().attr("data-customid");
        var customPrice = ($(this).parent().find("input.customFee").val()).replace(/[^0-9]/ig, "");

        if (roletype == 1) {
            $.ajax({
                type: "get",
                url: url_order + "/zb-order-web/order/updateInquiryRule.do",
                data: {
                    "userId": userid,
                    "roleType": roletype,
                    "token": token,
                    "orderid": orderid,
                    "customid": customid,
                    "mindprice": parseInt(customPrice)
                },
                success: function (res) {
                    /*console.log(res.status.msg, customPrice);*/
                    copyAlert(res.status.msg);
                    setTimeout(function () {
                        location.reload();
                    }, 500);
                }
            });
        }
    });


    //点击接受设计的按钮，触发  接受设计的事件
    $(document).on("click", "em.workstage_acceptDesignBtn", function () {
        var orderid = $(this).parent().attr("data-orderid"),
            customid = $(this).parent().attr("data-customid"),
            goodsid = $(this).parent().attr("data-goodsid");
        var $this = $(this);
        console.log(userid, orderid, roletype, token);
        ///当接受设计时，显示设计的相关信息
        $("div.order_scheme_box").show();
        //根据cookie发起请求，获取订单详情的具体内容
        $.ajax({
            type: "GET",
            url: url_order + "/zb-order-web/designpattern/continue.do",
            data: {
                "userid": userid,
                "orderid": orderid,
                "customid": customid,
                "roletype": roletype,
                "token": token,
                "commandcode": 143,
                "isreceive": 1
            },

            dataType: "JSON",
            success: function (res) {
                console.log(res);
                $this.hide();
                copyAlert(res.status.msg);
                setTimeout(function () {
                    location.reload();
                }, 500);
            }
        });
    });

    //工厂的   接受生产事件
    var orderid, customid, goodsid, deadline, finalprice;
    $(document).on("click", "em.workstage_acceptProductionBtn", function () {
        orderid = $(this).parent().attr("data-orderid");
        customid = $(this).parent().attr("data-customid");
        goodsid = $(this).parent().attr("data-goodsid");
        deadline = $(this).parent().attr("data-deadline");
        finalprice = $(this).parent().attr("data-finalprice");
        $(this).css({"background-color": "#e8e8e8"});
        var $this = $(this);
        console.log(userid, orderid, roletype, token, deadline);
        $("em.price_acceptProduction").text("￥" + finalprice);
        $("div.acceptProduction_box").show();
        return false;

    });

    ///继续接受生产订单      continueProductionBtn
    $(document).on("click", "button.continueProductionBtn", function () {
        var cycle = $.trim($("input.cycle_acceptProduction").val());
        if (cycle <= deadline) {
            //根据cookie发起请求，获取订单详情的具体内容
            $.ajax({
                type: "GET",
                url: url_order + "/zb-order-web/productinfo/continue.do",
                data: {
                    "userid": userid,
                    "orderid": orderid,
                    "goodsid": goodsid,
                    "customid": customid,
                    "roletype": roletype,
                    "token": token,
                    "commandcode": 171,
                    "isreceive": 1
                },

                dataType: "JSON",
                success: function (res) {
                    //console.log(res);
                    $("em.workstage_acceptProductionBtn").hide();
                    try {
                        $("div.uploadExpress_orderDetail").hide();
                    } catch (e) {
                        //TODO handle the exception
                    }

                    copyAlert(res.status.msg);
                    setTimeout(function () {
                        location.reload();
                    }, 500);
                }
            });
        } else {
            copyAlert("客户截止工期要求为" + deadline + "天，请修改您的生产周期");
            setTimeout(function () {
                closeAlert();
            }, 1800);
        }


    });

//只有是客服角色，可以触发修改订单事件
    if (roletype == 1) {

        //点击确认支付按钮，显示支付金额输入的弹窗
        var constomid, orderid, goodsid;
        $(document).on("click", ".workstage_confirmPayBtn", function () {
            $("div.uploadPayPrice_orderDetail").show();
            orderid = $(this).parent().attr("data-orderid");
            customid = $(this).parent().attr("data-customid");
            goodsid = $(this).parent().attr("data-goodsid");
        });
        ///点击添加支付金额中 的  确认  按钮，触发事件
        $(document).on("click", "button.confirmBtn_PayPrice", function () {
            var price = parseInt($("input.payPrice_orderDetail").val());
            var orderprice = parseInt($.trim($("li.orderCont4 p").text()));
            console.log(price, orderprice);
            if (price == orderprice) {
                confirmPay(price);
            } else {
                copyAlert("您输入的价格和定价不一致，将变更订单价格！");
                $("button.continuePay_copyAlert").show();
                //点击  继续  ， 实现变更  定价
                $(document).on("click", "button.continuePay_copyAlert", function () {
                    $.ajax({
                        type: "GET",
                        url: url_order + "/zb-order-web/order/updateInquiryRule.do",
                        data: {
                            "userId": userid,
                            "orderid": orderid,
                            "roleType": roletype,
                            "token": token,
                            "customid": customid,
                            "finalprice": price,
                            "commandcode": 141
                        },
                        dataType: "JSON",
                        success: function (res) {
                            //
                            console.log(res);
                            if (res.status.code == 0) {
                                copyAlert(res.status.msg);
                                $("li.orderCont4 p").text("￥" + price);
                                confirmPay(price);
                            }
                        }
                    });
                });

            }
        });

        function confirmPay(price_) {
            //发起ajax，上传至后台    "commandcode": 240,
            $.ajax({
                type: "GET",
                url: url_order + "/zb-order-web/order/confirmPay.do",
                data: {
                    "userid": userid,
                    "orderid": orderid,
                    "roletype": roletype,
                    "token": token,
                    "customid": customid,
                    "goodsid": goodsid,
                    "commandcode": 240,
                    "payamout": price_
                },

                dataType: "JSON",
                success: function (res) {
                    console.log(res.status.msg);
                    $("div.uploadPayPrice_orderDetail").hide();
                    copyAlert(res.status.msg);
                    setTimeout(function () {
                        location.reload();
                    }, 500);
                }
            });
        };

        //当输入的产品数目发生变化，触发修改订单    ordernum_workstage
        $(document).on("blur", "input.ordernum_workstage", function () {
            var orderid = $(this).attr("data-orderid"),
                customid = $(this).attr("data-customid"),
                orderNum = $(this).val();
            console.log(orderid, orderNum);
            //调用修改订单事件

            $.ajax({
                type: "GET",
                url: url_order + "/zb-order-web/order/updateOrderSummary.do",
                data: {
                    "userId": userid,
                    "orderid": orderid,
                    "customid": customid,
                    "roleType": roletype,
                    "token": token,
                    "commandcode": 150,
                    "number": orderNum
                },

                dataType: "JSON",
                success: function (res) {
                    if (res.status.code == 0) {

                        //console.log(res.status.msg);
                        copyAlert(res.status.msg + ",请再次发起询价");
                        setTimeout(function () {
                            location.reload();
                        }, 2000);
                    }

                },
                error: function (err) {
                    //console.log(err);
                    copyAlert(err.status + "," + err.statusText);
                }
            });
        });

        //当输入的产品长度发生变化，触发修改订单
        $(document).on("blur", "input.orderLength_workstage", function () {
            var orderid = $(this).parent().attr("data-orderid"),
                customid = $(this).parent().attr("data-customid"),
                orderLength = $(this).val();
            console.log(orderid, orderLength);
            //调用修改订单事件

            $.ajax({
                type: "GET",
                url: url_order + "/zb-order-web/order/updateOrderSummary.do",
                data: {
                    "userId": userid,
                    "orderid": orderid,
                    "customid": customid,
                    "roleType": roletype,
                    "token": token,
                    "commandcode": 150,
                    "length": orderLength
                },

                dataType: "JSON",
                success: function (res) {
                    if (res.status.code == 0) {
                        //console.log(res.status.msg);
                        copyAlert(res.status.msg + ",请再次发起询价");
                        setTimeout(function () {
                            location.reload();
                        }, 2000);
                    }

                },
                error: function (err) {
                    console.log(err);
                    copyAlert(err.status + "," + err.statusText);
                }
            });

        });
        //当输入的产品宽度发生变化，触发修改订单
        $(document).on("blur", "input.orderWidth_workstage", function () {
            var orderid = $(this).parent().attr("data-orderid"),
                customid = $(this).parent().attr("data-customid"),
                orderWidth = $(this).val();
            console.log(orderid, orderWidth);

            //调用修改订单事件
            $.ajax({
                type: "GET",
                url: url_order + "/zb-order-web/order/updateOrderSummary.do",
                data: {
                    "userId": userid,
                    "orderid": orderid,
                    "customid": customid,
                    "roleType": roletype,
                    "token": token,
                    "commandcode": 150,
                    "width": orderWidth
                },
                dataType: "JSON",
                success: function (res) {
                    if (res.status.code == 0) {
                        copyAlert(res.status.msg + ",请再次发起询价");
                        setTimeout(function () {
                            location.reload();
                        }, 2000);
                    }

                },
                error: function (err) {
                    console.log(err);
                    copyAlert(err.status + "," + err.statusText);
                }
            });

        });
        //当输入的产品高度发生变化，触发修改订单
        $(document).on("blur", "input.orderHeight_workstage", function () {
            var orderid = $(this).parent().attr("data-orderid"),
                customid = $(this).parent().attr("data-customid"),
                orderheight = $(this).val();
            console.log(orderid, orderheight);
            //调用修改订单事件

            $.ajax({
                type: "GET",
                url: url_order + "/zb-order-web/order/updateOrderSummary.do",
                data: {
                    "userId": userid,
                    "orderid": orderid,
                    "customid": customid,
                    "roleType": roletype,
                    "token": token,
                    "commandcode": 150,
                    "height": orderheight
                },

                dataType: "JSON",
                success: function (res) {
                    if (res.status.code == 0) {
                        copyAlert(res.status.msg + ",请再次发起询价");
                        setTimeout(function () {
                            location.reload();
                        }, 2000);
                    }

                },
                error: function (err) {
                    console.log(err);
                    copyAlert(err.status + "," + err.statusText);
                }
            });
        });

        ///切换分类,保存数据，并上传
        $(document).on("click", "ul.workstage_classify", function (eve) {
            var eve = eve || window.event;
            var val = $(eve.target).text();
            var orderid = $(this).parent().parent().parent().attr("data-orderid");
            var customid = $(this).parent().parent().parent().attr("data-customid");
            //
            $.ajax({
                type: "GET",
                url: url_order + "/zb-order-web/order/updateOrderSummary.do",
                data: {
                    "userId": userid,
                    "orderid": orderid,
                    "customid": customid,
                    "roleType": roletype,
                    "token": token,
                    "commandcode": 150,
                    "goodsclass": val
                },

                dataType: "JSON",
                success: function (res) {
                    console.log(res);
                    if (res.status.code == 0) {
                        copyAlert(res.status.msg + ",请再次发起询价");
                        setTimeout(function () {
                            location.reload();
                        }, 2000);
                    }

                },
                error: function (err) {
                    console.log(err);
                    copyAlert(err.status + "," + err.statusText);
                }
            });

        });
        ///切换产品材质,保存数据并上传
        $(document).on("click", "ul.workstage_texture", function (eve) {
            var eve = eve || window.event;
            var val = $(eve.target).text();
            var orderid = $(this).parent().parent().parent().attr("data-orderid");
            var customid = $(this).parent().parent().parent().attr("data-customid");
            //
            $.ajax({
                type: "GET",
                url: url_order + "/zb-order-web/order/updateOrderSummary.do",
                data: {
                    "userId": userid,
                    "orderid": orderid,
                    "customid": customid,
                    "roleType": roletype,
                    "token": token,
                    "commandcode": 150,
                    "texturename": val
                },

                dataType: "JSON",
                success: function (res) {
                    console.log(res);
                    if (res.status.code == 0) {
                        copyAlert(res.status.msg + ",请再次发起询价");
                        setTimeout(function () {
                            location.reload();
                        }, 2000);
                    }

                },
                error: function (err) {
                    console.log(err);
                    copyAlert(err.status + "," + err.statusText);
                }
            });

        });
        ///切换产品配件,保存数据并上传
        $(document).on("click", "ul.workstage_accessories", function (eve) {
            var eve = eve || window.event;
            var val = $(eve.target).text();
            var orderid = $(this).parent().parent().parent().attr("data-orderid");
            var customid = $(this).parent().parent().parent().attr("data-customid");
            //
            $.ajax({
                type: "GET",
                url: url_order + "/zb-order-web/order/updateOrderSummary.do",
                data: {
                    "userId": userid,
                    "orderid": orderid,
                    "customid": customid,
                    "roleType": roletype,
                    "token": token,
                    "commandcode": 150,
                    "accessoriesname": val
                },

                dataType: "JSON",
                success: function (res) {
                    console.log(res);
                    if (res.status.code == 0) {
                        copyAlert(res.status.msg + ",请再次发起询价");
                        setTimeout(function () {
                            location.reload();
                        }, 2000);
                    }

                },
                error: function (err) {
                    console.log(err);
                    copyAlert(err.status + "," + err.statusText);
                }
            });

        });
        ///修改开模的选择,保存数据并上传
        $(document).on("click", "button.confirm_addMold_work", function () {
            var $this = $(this).parent().parent().parent();
            setTimeout(function () {
                var txt = $this.prev(".techTypeBtn").text();
                var orderid = $this.parent().parent().attr("data-orderid");
                var customid = $this.parent().parent().attr("data-customid");
                //
                $.ajax({
                    type: "GET",
                    url: url_order + "/zb-order-web/order/updateOrderSummary.do",
                    data: {
                        "userId": userid,
                        "orderid": orderid,
                        "customid": customid,
                        "roleType": roletype,
                        "token": token,
                        "commandcode": 150,
                        "shape": txt
                    },

                    dataType: "JSON",
                    success: function (res) {
                        console.log(res);
                        if (res.status.code == 0) {
                            copyAlert(res.status.msg + ",请再次发起询价");
                            setTimeout(function () {
                                location.reload();
                            }, 2000);
                        }
                    },
                    error: function (err) {
                        console.log(err);
                        copyAlert(err.status + "," + err.statusText);
                    }
                });
            }, 500);

        });
        ///修改电镀色的选择,保存数据并上传
        $(document).on("click", "button.confirm_addColor_work", function () {
            var $this = $(this).parent().parent().parent();
            setTimeout(function () {
                var txt = $this.prev(".techTypeBtn").text();
                var orderid = $this.parent().parent().attr("data-orderid");
                var customid = $this.parent().parent().attr("data-customid");
                //
                $.ajax({
                    type: "GET",
                    url: url_order + "/zb-order-web/order/updateOrderSummary.do",
                    data: {
                        "userId": userid,
                        "orderid": orderid,
                        "customid": customid,
                        "roleType": roletype,
                        "token": token,
                        "commandcode": 150,
                        "color": txt
                    },

                    dataType: "JSON",
                    success: function (res) {
                        console.log(res);
                        if (res.status.code == 0) {
                            copyAlert(res.status.msg + ",请再次发起询价");
                            setTimeout(function () {
                                location.reload();
                            }, 2000);
                        }
                    },
                    error: function (err) {
                        console.log(err);
                        copyAlert(err.status + "," + err.statusText);
                    }
                });
            }, 500);

        });
        ///修改工艺的选择,点击确定按钮，保存数据并上传
        $(document).on("click", "button.confirm_addCraft_work", function () {
            var $this = $(this).parent().parent().parent();
            setTimeout(function () {
                var txt = $this.prev(".techTypeBtn").text();
                var orderid = $this.parent().parent().attr("data-orderid");
                var customid = $this.parent().parent().attr("data-customid");
                //
                $.ajax({
                    type: "GET",
                    url: url_order + "/zb-order-web/order/updateOrderSummary.do",
                    data: {
                        "userId": userid,
                        "orderid": orderid,
                        "customid": customid,
                        "roleType": roletype,
                        "token": token,
                        "commandcode": 150,
                        "technology": txt
                    },

                    dataType: "JSON",
                    success: function (res) {
                        console.log(res);
                        if (res.status.code == 0) {
                            copyAlert(res.status.msg + ",请再次发起询价");
                            setTimeout(function () {
                                location.reload();
                            }, 2000);
                        }
                    },
                    error: function (err) {
                        console.log(err);
                        copyAlert(err.status + "," + err.statusText);
                    }
                });
            }, 300);

        });

        ///修改  截至工期  ,输入框blur， 保存数据并上传
        $(document).on("blur", "input#deadline_val", function () {
            var $val = $(this).val();
            var orderid = $(this).parent().attr("data-orderid");
            var customid = $(this).parent().attr("data-customid");
            setTimeout(function () {

                $.ajax({
                    type: "GET",
                    url: url_order + "/zb-order-web/order/updateOrderSummary.do",
                    data: {
                        "userId": userid,
                        "orderid": orderid,
                        "customid": customid,
                        "roleType": roletype,
                        "token": token,
                        "commandcode": 150,
                        "deadline": $val
                    },
                    dataType: "JSON",
                    success: function (res) {
                        console.log(res);
                        if (res.status.code == 0) {
                            copyAlert(res.status.msg + ",请再次发起询价");
                            setTimeout(function () {
                                location.reload();
                            }, 2000);
                        } else {
                            copyAlert(res.status.msg);
                            setTimeout(function () {
                                closeAlert();
                            }, 600);
                        }
                    },
                    error: function (err) {
                        console.log(err);
                        copyAlert(err.status + "," + err.statusText);
                    }
                });
            }, 100);

        });

    }
/////判断角色  结束	

});

//添加事件
$(document).ready(function () {
    /* 点击工艺、电镀、开模，弹出多选框，进行多选 */
    $(document).on("click", "span.techTypeBtn", function () {
        $(this).next("h5").toggle();
        //获取原选定的文本内容
        var techtext = $(this).text();
        ///获取所有选择项的数组集合
        var labels = $(this).parent().find("label");
        /*console.log(techtext, labels);*/
        //var numArr = new Array( labels.length ); //原选定的文本与选项重合的下标的数组集合

        for (var i = 0; i < labels.length; i++) {
            if (techtext.indexOf(labels[i].innerText) != -1) {
                /*numArr[i] = i;*/
                labels.eq(i).children("input").attr({"checked": true});
            }
        }

    });
    $(document).on("click", "button.cancel_addTech", function () {
        $(this).parent().parent().parent("h5").hide();
    });
    /* 点击工艺、电镀、开模中的确定按钮，添加到span中  */
    $(document).on("click", "button.confirm_addTech", function () {
        var $parent = $(this).parent().parent("div"),
            arr = $parent.find(":checked").parent("label"),
            str_txt = "";
        if (arr.length >= 1) {
            for (var i = 0; i < arr.length; i++) {
                str_txt += arr[i].innerText + ";";
            }
        }
        $parent.parent().parent().find(".techTypeBtn").text(str_txt);
        $parent.parent("h5").hide();
    });
    ///点击下拉多选框时，隐藏父级同辈元素的子级多选框
    $(document).click(function (eve) {
        var eve = eve || window.event;
        var eo = $(eve.target);
        ( eo.parent() ).siblings(".type_tech").find(".tech_label_box").hide();

    });

});
$(document).ready(function () {
    //材质的添加
    /*var data_texture = ["锌合金","铜合金","铁合金","铝合金","不锈钢","不锈铁","亚克力","ABS塑料",
     "贴纸","水晶","软硅胶","PVC背胶","纸质","马口铁","三维软标","软硅胶",
     "木制金箔","925银","24K金","薄金属"];
     var str_texture = "";
     for (var i=0;i<data_texture.length;i++) {
     str_texture += '<li>'+data_texture[i]+'</li>';
     }
     $(document).on("click","span.workstage_textureBtn",function(){
     $(this).next("ul.workstage_texture").html(str_texture);
     });*/

    //点击按钮，关闭弹窗
    $(document).on("click", "i.icon-guanbi", function () {
        $(this).parent().parent().hide();
    });

    /*模拟下拉菜单的效果*/
    $(document).on("click", ".select_box", function (event) {
        event.stopPropagation();
        $(this).find(".option_").toggle();
        $(this).parent().siblings().find(".option_").hide();
    });
    /* 当点击本页的其他地方时，下拉的部分会自动收起 */
    $(document).click(function (event) {
        var eo = $(event.target);
        if (eo.attr("class") != "option_" && !eo.parent(".option_").length) {
            $('.option_').hide();
        }

    });
    /*赋值给文本框*/
    $(document).on("click", ".option_ li", function () {
        var value = $(this).text();
        $(this).parent().siblings(".select_txt").text(value);
    });

    // //搜索框 边框获取焦点后，边框变红色
    // $("#searchCon").focus(function () {
    //     this.placeholder = '';
    //     /*当输入框处于焦点的时候文本设置为空*/
    //     $("#header .searchbar").addClass("active");
    // }).blur(function () {
    //     $("#header .searchbar").removeClass("active");
    // });

    //分页效果
    $(document).on("click", "div.page>p", function (eve) {
        var eve = eve || window.event;
        /*console.log(eve.target);*/
        $(eve.target).addClass("spanRed").siblings().removeClass("spanRed");
    })

});

$(document).ready(function () {
    //当鼠标移到图片上时， 出现  删除  的图标
    $(document).on("mouseenter", "div.piclist img", function () {
        $(this).parent().children("p.upload_float").show();
    }).on("mouseleave", "div.piclist", function () {
        $(this).children("p.upload_float").hide();
    });

    //消费者心里价位的标尺的拖动效果

    /*var move=false;  //移动标记
     var length_ruler = 720;  //标尺的长度
     var _x;    //鼠标离控件左上角的相对位置
     var maxprice = 15000; //标尺的最大价格
     var minprice = 0; //标尺的最小价格
     var orderid,customPrice,offerPrice,customid,
     $userid = $.cookie('userid'),
     $token = $.cookie('token'),
     $roletype = $.cookie('roletype');

     $(document).on("mousedown","ul.custom_ruler",function(e){

     if ( $roletype == "1") {
     move = true;
     _x = e.pageX-parseInt( $(this).css("left") );
     orderid = $(this).attr("data-orderid");
     customid = $(this).attr("data-customid");
     } else{
     move = false;
     }

     //console.log(orderid, customid);
     }).on("mousemove","ul.custom_ruler",function(e){
     var x=e.pageX-_x;//控件左上角到屏幕左上角的相对位置

     if(x < 0 || x > length_ruler){
     move = false;
     };
     if(move){
     //console.log(x);
     customPrice = Math.floor( (maxprice-minprice)/length_ruler*x + minprice );
     $(this).find("input").val(customPrice);
     $(this).css({"left":x});
     }
     }).on("mouseup","ul.custom_ruler",function(){
     //console.log(customPrice);
     move=false;
     if ($roletype == "1" ) {
     $.ajax({
     type:"get",
     url:"http://192.168.1.150:8082/zb-order-web/order/updateInquiryRule.do",
     data:{
     "userId": $userid,
     "roleType": $roletype,
     "token": $token,
     "orderid": orderid,
     "customid": customid,
     "mindprice": parseInt(customPrice)
     },
     success:function(res){
     console.log(res.status.msg, customPrice);
     alert(res.status.msg);
     }
     });
     }

     });

     //厂家报价的滑动标尺
     $(document).on("mousedown","ul.offer_ruler",function(e){
     move = true;
     _x = e.pageX-parseInt($(this).css("left"));
     }).on("mousemove","ul.offer_ruler",function(e){
     var x=e.pageX-_x;//控件左上角到屏幕左上角的相对位置

     if(x < 0 || x > length_ruler){
     move = false;
     };
     if(move){
     //console.log(x);
     offerPrice = Math.floor( (maxprice-minprice)/length_ruler*x + minprice );
     $(this).find("input").val(offerPrice);//"￥"+
     $(this).css({"left":x});


     }
     }).on("mouseup","ul.offer_ruler",function(){
     move=false;
     });*/

});

/* 设计费的滑动标尺 */
$(document).ready(function () {
    //设计费标价尺的拖动效果

    var move = false;  //移动标记
    var length_ruler = 430;  //标尺的长度
    var _x;    //鼠标离控件左上角的相对位置
    var maxprice = 8; //标尺的最大价格
    var minprice = 8; //标尺的最小价格
    var orderid, price, customid,
        $userid = $.cookie('userid'),
        $token = $.cookie('token'),
        $roletype = $.cookie('roletype');

    $(document).on("mousedown", "ul.design_ruler", function (e) {

        /*move = true;*/
        move = false;

        if ($roletype == 2) {
            move = false;
        } else {
            _x = e.pageX - parseInt($(this).css("left"));
            orderid = $(this).parent().attr("data-orderid");
            customid = $(this).parent().attr("data-customid");
            //console.log(orderid, customid);
        }

    }).on("mousemove", "ul.design_ruler", function (e) {
        var x = e.pageX - _x;//控件左上角到屏幕左上角的相对位置

        if (x < 0 || x > length_ruler) {
            move = false;
        }
        ;
        if (move) {
            //console.log(x);
            price = Math.floor((maxprice - minprice) / length_ruler * x + minprice);
            $(this).find("input").val(price);
            $(this).css({"left": x});


        }
    }).on("mouseup", "ul.design_ruler", function () {
        move = false;
        //console.log(price);
        if ($roletype == 1) {

            /*$.ajax({
             type:"get",
             url:"http://192.168.1.150:8082/zb-order-web/order/updateInquiryRule.do",
             data:{
             "userId": $userid,
             "roleType": $roletype,
             "token": $token,
             "orderid": orderid,
             "customid": customid,
             "designprice": parseInt(price)
             },
             success:function(res){
             console.log(res.status.msg, price);
             alert(res.status.msg);
             }
             });*/

        }
    });

    if ($roletype == 1) {
        ///如果角色为客服，可以触发点击事件

        $(document).on("click", "button.designFee_btn", function () {
            return false;  ///将设计费更改功能  注销
            price = $(this).parent().find("input.designFee").val();
            $.ajax({
                type: "get",
                url: url_order + "/zb-order-web/order/updateInquiryRule.do",
                data: {
                    "userId": $userid,
                    "roleType": $roletype,
                    "token": $token,
                    "orderid": orderid,
                    "customid": customid,
                    "designprice": parseInt(price)
                },
                success: function (res) {
                    console.log(res.status.msg, price);
                    copyAlert(res.status.msg);
                    setTimeout(function () {
                        location.reload();
                    }, 500);
                }
            });
        });
    }//角色判断结束

    ///定义变量
    var msg = "", arr_msg = [];

    ///点击弹出新消息
    $(document).on("click", "p.newMessage_workstage span", function () {

        if (arr_msg.length != 0) {
            var str_msg = '<table><thead>' + msg + '<button class="onekey_clear" style="float:right;">一键清空</button></thead>';
            str_msg += '<thead><td>消息创建时间</td><td>订单号</td><td>标题</td><td>发起者昵称</td><td>消息内容</td></thead>';
            for (var i = 0; i <= arr_msg.length - 1; i++) {
                str_msg += '<tr class="newMess_work" data-customid = "' + arr_msg[i].customid
                    + '" data-orderid = "' + arr_msg[i].orderid + '" data-msgid = "' + arr_msg[i].msgid + '"><td>'
                    + arr_msg[i].msgsendtime + '</td><td>' + arr_msg[i].orderid + '</td><td>' + arr_msg[i].msgtitle
                    + '</td><td>' + arr_msg[i].nickname + '</td><td>' + arr_msg[i].msgcontent + '</td></tr>';
            }
            ;
            str_msg += '</table>';
            //边缘弹出弹出框
            try {

                layer.open({
                    'type': 0
                    , 'status': 1
                    , title: "动态消息"
                    , offset: 'center' //具体配置参考：offset参数项
                    , area: ['900px', '500px']
                    , content: str_msg
                    , btn: '关闭'
                    , btnAlign: 'c' //按钮居中
                    , shade: 0 //不显示遮罩
                    , yes: function () {
                        layer.closeAll();
                    }
                });
            } catch (e) {
                //TODO handle the exception
            }
        }
    });


    //一键清空新消息  zb-order-web/newmsginfo/empty.do?userid=10000031&token=111111&roletype=1&commandcode=100
    $(document).on("click", "button.onekey_clear", function (ev) {
        $("div.layui-layer-dialog").hide();
        $("button.emptyMessage").show();
        copyAlert("是否确定清空新消息？");
    });
    ///确定   清空新消息   emptyMessage
    $(document).on("click", "button.emptyMessage", function (ev) {
        $.ajax({
            type: "get",
            url: url_order + "/zb-order-web/newmsginfo/empty.do",
            data: {
                "userid": $userid,
                "roletype": $roletype,
                "token": $token,
                "commandcode": 100
            },
            success: function (res) {
                closeAlert();
                copyAlert(res.status.msg);
                setTimeout(function () {
                    location.reload();
                }, 1000);
            }
        });
    });

    //查看消息，进入订单详情
    $(document).on("click", "tr.newMess_work", function (ev) {
        ///阻止冒泡事件
        var oEvent = ev || window.event;
        oEvent.cancelBubble = true;
        var orderid = $(this).attr("data-orderid");
        var customid = $(this).attr("data-customid");
        var msgid = $(this).attr("data-msgid");
        $.cookie("orderid", orderid);
        $.cookie("customid", customid);
        $.ajax({
            type: "get",
            url: url_order + "/zb-order-web/newmsginfo/disposemsg.do",
            data: {
                "userid": $userid,
                "roletype": $roletype,
                "token": $token,
                "commandcode": 111,
                "msgid": msgid
            },
            success: function (res) {
                //console.log(res);
                setTimeout(function () {
                    getOrderDetail();
                }, 500);
            }
        });

    });
    ///毫秒转化为date
    function makeDate(str) {
        var mydate = new Date(str);
        return mydate.toLocaleString();
    }

    //获取  新操作、数据  的变更消息
    // function getMessage() {
    //
    //     $.ajax({
    //         type: "get",
    //         url: url_order + "/zb-order-web/newmsginfo/obtain.do",
    //         //"async": true,
    //         data: {
    //             "userid": $userid,
    //             "roletype": $roletype,
    //             "token": $token,
    //             "commandcode": 110,
    //             "isnew": 0
    //         },
    //         success: function (res) {
    //             //console.log(res);
    //             try {
    //                 if (res.status.code == 0) {
    //                     $("a.newMessageNum").text(res.status.msg);
    //                     $("p.newMessage_workstage").show();
    //                     msg = res.status.msg;
    //                     arr_msg = res.msginfo;
    //
    //                     if (arr_msg.length != 0) {
    //                         //如果符合条件      msgtype   1、2/4/5/6/7、10/11/22
    //                         var flag = false;
    //                         for (var j = 0; j < arr_msg.length; j++) {
    //                             var msgtype = arr_msg[j].msgtype;
    //                             if (msgtype == 1 || msgtype == 2 || msgtype == 4 || msgtype == 5 ||
    //                                 msgtype == 6 || msgtype == 7 || msgtype == 10 || msgtype == 11 || msgtype == 22) {
    //                                 flag = true;
    //                             }
    //                         }
    //                         ;
    //                         $("div#header embed").remove();
    //                         //添加新消息背景音
    //                         setTimeout(function () {
    //                             if (flag) {
    //
    //                                 $("div#header div").append('<embed src="./voice/71.mp3" loop="0" width="0" height="0" autostart="true" balance="0"></embed>');
    //
    //                                 flag = false;
    //                             }//背景音
    //                         }, 600);
    //
    //
    //                     }
    //
    //
    //                 } else {
    //                     $("p.newMessage_workstage").hide();
    //                 }
    //
    //             } catch (e) {
    //                 //TODO handle the exception
    //             }
    //
    //         }
    //     });
    //
    // };
    //
    // getMessage();
    //
    // //每隔10s发一次请求
    // setInterval(function () {
    //     getMessage();
    // }, 10000);


});

//


$(function () {
    var topPosit = $("div.totop_box").css("position");
    /*console.log( topPosit );*/
    if (topPosit == "fixed") {
        $("div.totop_box").css({"top": 400});
    } else {
        //回到顶部按钮的伴随滚动
        $(window).scroll(function () {
            var scrY = $(this).scrollTop() + 110;//定义滚动条停止滚动后按钮的位置
            /*console.log($(this).scrollTop(),scrY);*/

            $("div.totop_box").css({"top": scrY});
        })
        //回到顶部的 模块
        $('.totop_box button').click(function () {
            $('html ,body').animate({scrollTop: 0}, 100);
            return false;
        });
    }


});


function rulerFun($obj, price, ruler) {
    var Y = $("div.orderCont7").eq(0).offset().left;
    price = parseInt(price);
    var start = 0,
        end = 100,
        length = 720;
    if (ruler == 1) {
        start = 5;
        end = 500;
    } else if (ruler == 2) {
        start = 0;
        end = 15000;
    }
    ;
    if (price > end) {
        price = end;
    } else {

    }
    var Y_ruler = parseInt((price / length) * (end - start));
    console.log(Y, Y_ruler);
    $obj.css({"left": Y + Y_ruler});
}
//年月日三级联动
(function ($) {
    $.extend({
        ms_DatePicker: function (options) {
            var defaults = {
                YearSelector: "#sel_year",
                MonthSelector: "#sel_month",
                DaySelector: "#sel_day",
                FirstText: "--",
                FirstValue: 0
            };
            var opts = $.extend({}, defaults, options);
            var $YearSelector = $(opts.YearSelector);
            var $MonthSelector = $(opts.MonthSelector);
            var $DaySelector = $(opts.DaySelector);
            var FirstText = opts.FirstText;
            var FirstValue = opts.FirstValue;

            // 初始化
            var str = "<option value=\"" + FirstValue + "\">" + FirstText + "</option>";
            $YearSelector.html(str);
            $MonthSelector.html(str);
            $DaySelector.html(str);

            // 年份列表
            //获取当前系统的年份
            var yearNow = new Date().getFullYear();
            var yearSel = $YearSelector.attr("rel");
            for (var i = yearNow + 1; i >= 1918; i--) {
                var sed = yearSel == i ? "selected" : "";
                var yearStr = "<option value=\"" + i + "\" " + sed + ">" + i + "</option>";
                $YearSelector.append(yearStr);
            }

            // 月份列表
            var monthSel = $MonthSelector.attr("rel");
            for (var i = 1; i <= 12; i++) {
                var sed = monthSel == i ? "selected" : "";
                var monthStr = "<option value=\"" + i + "\" " + sed + ">" + i + "</option>";
                $MonthSelector.append(monthStr);
            }

            // 日列表(仅当选择了年月)
            function BuildDay() {
                if ($YearSelector.val() == 0 || $MonthSelector.val() == 0) {
                    // 未选择年份或者月份
                    $DaySelector.html(str);
                } else {
                    $DaySelector.html(str);
                    var year = parseInt($YearSelector.val());
                    var month = parseInt($MonthSelector.val());
                    var dayCount = 0;
                    switch (month) {
                        case 1:
                        case 3:
                        case 5:
                        case 7:
                        case 8:
                        case 10:
                        case 12:
                            dayCount = 31;
                            break;
                        case 4:
                        case 6:
                        case 9:
                        case 11:
                            dayCount = 30;
                            break;
                        case 2:
                            dayCount = 28;
                            if ((year % 4 == 0) && (year % 100 != 0) || (year % 400 == 0)) {
                                dayCount = 29;
                            }
                            break;
                        default:
                            break;
                    }

                    var daySel = $DaySelector.attr("rel");
                    for (var i = 1; i <= dayCount; i++) {
                        var sed = daySel == i ? "selected" : "";
                        var dayStr = "<option value=\"" + i + "\" " + sed + ">" + i + "</option>";
                        $DaySelector.append(dayStr);
                    }
                }
            }

            $MonthSelector.change(function () {
                BuildDay();
            });
            $YearSelector.change(function () {
                BuildDay();
            });
            if ($DaySelector.attr("rel") != "") {
                BuildDay();
            }
        } // End ms_DatePicker
    });
})(jQuery);


(function ($) {
    // -------- 将以base64的图片url数据转换为Blob --------
    function convertBase64UrlToBlob(urlData, filetype) {
        //去掉url的头，并转换为byte
        var bytes = window.atob(urlData.split(',')[1]);

        //处理异常,将ascii码小于0的转换为大于0
        var ab = new ArrayBuffer(bytes.length);
        var ia = new Uint8Array(ab);
        var i;
        for (i = 0; i < bytes.length; i++) {
            ia[i] = bytes.charCodeAt(i);
        }

        return new Blob([ab], {type: filetype});
    }


})(jQuery);


$(document).ready(function () {
    //新建任务的  图片上传和预览的模块
    $("input.upload_input").each(function () {
        function uploadPic(_this) {

            _this.change(function () {

                var flag = false,
                    $upload_label = _this.parent(),
                    $upload_img = $upload_label.prev(),
                    $upload_float = $upload_label.next();

                //选择图片，马上预览
                function uploadImg(obj) {
                    var file = obj.files[0];
                    flag = file.size <= 2048000 ? true : false;

                    if (flag) {
                        var reader = new FileReader();

                        //读取文件过程方法
                        reader.onloadstart = function (e) {
                            //console.log("开始读取....");
                        }
                        reader.onprogress = function (e) {
                            //console.log("正在读取中....");
                        }
                        reader.onabort = function (e) {
                            console.log("中断读取....");
                        }
                        reader.onerror = function (e) {
                            //console.log("读取异常....");
                        }
                        reader.onload = function (e) {
                            //console.log(e.target.result,"1234");
                            $upload_img.attr("src", e.target.result).show();
                        }
                        //解析图片内容
                        reader.readAsDataURL(file);
                    }
                    ;
                }

                //调用函数            
                uploadImg(_this[0]);

                if (flag) {
                    $upload_label.hide();

                    //console.log(flag, $upload_img[0]);
                    /*$upload_img.mouseenter(function(){
                     $upload_float.show();
                     }).mouseleave(function(){
                     $upload_float.hide();
                     });*/
                    $upload_float.on("click", function () {
                        $upload_img.attr("src", "").hide();
                        $upload_float.hide();
                        $upload_label.show();

                        uploadPic(_this);
                    });
                }
            })
        }

        uploadPic($(this));

    })

});

/*文件下载模块*/
function downloadFile(fileName, content) {
    var blob = new Blob([content]);
    var evt = document.createEvent("HTMLEvents");
    //initEvent 不加后两个参数在FF下会报错, 感谢 Barret Lee 的反馈
    evt.initEvent("click", false, false);
    aLink.download = fileName;
    aLink.href = URL.createObjectURL(blob);
    aLink.dispatchEvent(evt);
}

//cos 的方法
(function ($) {
    // 请求用到的参数
    var Bucket = 'test-1255653994';//'resource-1255653994'
    var Region = 'ap-chengdu';
    var protocol = location.protocol === 'https:' ? 'https:' : 'http:';
    var prefix = protocol + '//' + Bucket + '.cos.' + Region + '.myqcloud.com/';

    // 计算签名
    var getAuthorization = function (options, callback) {
        // 方法一（适用于前端调试）
        var method = (options.Method || 'get').toLowerCase();
        var key = options.Key || '';
        var pathname = key.indexOf('/') === 0 ? key : '/' + key;
        var url = 'http://119.27.172.55/auth.php?method=' + method + '&pathname=' + encodeURIComponent(pathname);
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onload = function (e) {
            callback(null, e.target.responseText);
        };
        xhr.onerror = function (e) {
            callback('获取签名出错');
        };
        xhr.send();

    };

    // 上传文件
    var uploadFile = function (file, callback) {
        var fname = file.name;
        var filetype = fname.substr(fname.lastIndexOf("."));

        var Key = getRandomName() + filetype;
        //console.log(filetype, Key);
        getAuthorization({Method: 'PUT', Key: Key}, function (err, auth) {
            var url = prefix + Key;
            var xhr = new XMLHttpRequest();
            xhr.open('PUT', url, true);
            xhr.setRequestHeader('Authorization', auth);
            xhr.onload = function () {
                if (xhr.status === 200 || xhr.status === 206) {
                    var ETag = xhr.getResponseHeader('etag');
                    callback(null, {url: url, ETag: ETag});
                } else {
                    callback('文件 ' + Key + ' 上传失败，状态码：' + xhr.status);
                }
            };
            xhr.onerror = function () {
                callback('文件 ' + Key + ' 上传失败，请检查是否没配置 CORS 跨域规则');
            };
            xhr.send(file);
        });
    };

    try {
        // 新建任务   图片    提交
        document.getElementById('upload_pic1_task').onchange = function (e) {
            var fileArray = document.getElementById('upload_pic1_task').files;
            var file = fileArray[0];

            if (file.type == 'image/jpg' || file.type == 'image/gif' || file.type == "image/png" || file.type == 'image/jpeg') {
                file && uploadFile(file, function (err, data) {
                    //console.log(err || data);
                    console.log(err ? err : ('上传成功，url=' + data.url));
                    var str_url = (data.url).substr((data.url).indexOf(".com/") + 5);
                    str_pic1_task = str_url;

                });
            }
        }


        document.getElementById('upload_pic2_task').onchange = function (e) {
            var fileArray = document.getElementById('upload_pic2_task').files;
            var file = fileArray[0];

            if (file.type == 'image/jpg' || file.type == 'image/gif' || file.type == "image/png" || file.type == 'image/jpeg') {
                file && uploadFile(file, function (err, data) {
                    //console.log(err || data);
                    console.log(err ? err : ('上传成功，url=' + data.url));
                    var str_url = (data.url).substr((data.url).indexOf(".com/") + 5);
                    str_pic2_task = str_url;

                });
            }
        }


        document.getElementById('upload_pic3_task').onchange = function (e) {
            var fileArray = document.getElementById('upload_pic3_task').files;
            var file = fileArray[0];

            if (file.type == 'image/jpg' || file.type == 'image/gif' || file.type == "image/png" || file.type == 'image/jpeg') {
                file && uploadFile(file, function (err, data) {
                    //console.log(err || data);
                    console.log(err ? err : ('上传成功，url=' + data.url));
                    var str_url = (data.url).substr((data.url).indexOf(".com/") + 5);
                    str_pic3_task = str_url;

                });
            }
        }

    } catch (e) {
        //TODO handle the exception
    }


})($);