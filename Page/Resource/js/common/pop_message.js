var layerIndex = 0;
//消息提醒
$(function () {

    //消息提醒*****************************
    //定义变量
    var msg = "", arr_msg = [];

    ///点击弹出新消息
    $(document).on("click", "p.newMessage_workstage span", function () {

        if (arr_msg.length != 0) {
            var str_msg = '<table class="pop-table"><thead>' + msg + '<button class="onekey_clear" style="float:right;">一键清空</button></thead>';
            str_msg += '<thead><td>消息创建时间</td><td>订单号</td><td>标题</td><!--<td>发起者昵称</td>--><td>消息内容</td></thead>';
            for (var i = 0; i <= arr_msg.length - 1; i++) {
                var nickname= $.cookie("roletype")==3?"客服":arr_msg[i].nickname;

                str_msg += '<tr class="newMess_work" data-customid = "' + arr_msg[i].customid
                    + '"data-type="' + arr_msg[i].msgtype + '"     data-orderid = "' + arr_msg[i].orderid + '" data-msgid = "' + arr_msg[i].msgid + '"><td>'
                    + arr_msg[i].msgsendtime + '</td><td>' + arr_msg[i].orderid + '</td><td>' + arr_msg[i].msgtitle
                    + '</td><td>' + arr_msg[i].msgcontent + '</td></tr>';
            };
            str_msg += '</table>';
            //边缘弹出弹出框
            try {

                layerIndex = layer.open({
                    'type': 1
                    , 'status': 1
                    , title: "动态消息"
                    , offset: 'center' //具体配置参考：offset参数项
                    , area: ['900px', '500px']
                    , content: str_msg
                    //, btn: '关闭'
                    , btnAlign: 'c' //按钮居中
                    , shade: 0.1 //不显示遮罩
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
        layer.msg('是否确定清空新消息？', {
            time: 0 //不自动关闭
            ,btn: ['确定', '取消']
            ,yes: function(index){
              layer.close(index);
              $.ajax({
                type: "get",
                url: Main.getUrl["order"] + "/zb-order-web/newmsginfo/empty.do",
                data: {
                    "userid": Main.userInfo.userid,
                    "roletype": Main.userInfo.roletype,
                    "token": Main.userInfo.token,
                    "commandcode": 100
                },
                success: function (res) {
                    Common.msg("操作成功！",200);
                    setTimeout(function () {
                        location.reload();
                    }, 1000);
                }
            });}
            ,no:function(index){
                layer.close(index);
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
        var data_type = $(this).attr("data-type");
        $.cookie("orderid", orderid);
        $.cookie("customid", customid);
        $.ajax({
            type: "get",
            url: Main.getUrl["order"] + "/zb-order-web/newmsginfo/disposemsg.do",
            data: {
                "userid": Main.userInfo.userid,
                "roletype": Main.userInfo.roletype,
                "token": Main.userInfo.token,
                "commandcode": 111,
                "msgid": msgid
            },
            success: function (res) {
                Main.designDraft(orderid, customid);
                getMessage();
        //         //关闭弹窗
                layer.close(layerIndex);
            }
        });

    });
    ///毫秒转化为date
    function makeDate(str) {
        var mydate = new Date(str);
        return mydate.toLocaleString();
    }
    //获取  新操作、数据  的变更消息
    function getMessage() {

        $.ajax({
            type: "get",
            url: Main.getUrl["order"] + "/zb-order-web/newmsginfo/obtain.do",
            //"async": true,
            data: {
                "userid": Main.userInfo.userid,
                "roletype": Main.userInfo.roletype,
                "token": Main.userInfo.token,
                "commandcode": 110,
                "isnew": 0
            },
            success: function (res) {
                //console.log(res);
                try {
                    if (res.status.code == 0) {
                        $("a.newMessageNum").text(res.status.msg);
                        $("p.newMessage_workstage").show();
                        msg = res.status.msg;
                        arr_msg = res.msginfo;

                        //显示或隐藏消息框start
                        if (arr_msg.length <= 0) {
                            $("#pop_msg").hide();
                            Main.setMainHeight();
                        }
                        else {
                            $("#pop_msg").show();
                            Main.setMainHeight();
                        }
                        //显示或隐藏消息框end

                        if (arr_msg.length != 0) {
                            //如果符合条件      msgtype   1、2/4/5/6/7、10/11/22
                            var flag = false;
                            for (var j = 0; j < arr_msg.length; j++) {
                                var msgtype = arr_msg[j].msgtype;
                                if (msgtype == 1 || msgtype == 2 || msgtype == 4 || msgtype == 5 ||
                                    msgtype == 6 || msgtype == 7 || msgtype == 10 || msgtype == 11 || msgtype == 22) {
                                    flag = true;
                                }
                            };
                            $("div#header embed").remove();
                            //添加新消息背景音
                            setTimeout(function () {
                                if (flag) {
                                    $("body").append('<embed src="../voice/71.mp3" loop="0" width="0" height="0" autostart="true" balance="0"></embed>');
                                }//背景音	
                            }, 600);
                        }
                    } else {
                        $("p.newMessage_workstage").hide();
                    }

                } catch (e) {
                    //TODO handle the exception
                }

            }
        });

    };

    getMessage();

    //每隔10s发一次请求
    setInterval(function () {
        getMessage();
    }, 10000);
});