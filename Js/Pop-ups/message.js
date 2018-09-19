var isRead = 0;
var roleType=0;
$(function () {
    roleType = top.Helper.Cache.get('roleType');
    roleType =parseInt(roleType);//获取角色

    message.init();
    //选项卡切换
    $('.tab').on('click',function () {
        $('.tab').removeClass('active');
        $('.tab .top').addClass('hide');
        $(this).addClass("active");
        $($(this).find(".top")).removeClass("hide");
        isRead=parseInt($(this).attr("data-read"));
        if(isRead==1)
        {
            $(".sign").addClass('hide');
        }
        else
        {
            $(".sign").removeClass('hide');
        }
        message.pagePrams.isInit=-1;
        message.getData(1);
    });

    $(".sign").on('click',function () {
        var url=config.WebService()["batchMarkedUpRead"];
        top.Requst.ajaxPost(url,{},true,function (data) {
         if(data.code==200)
         {
             top.Message.show("提示",data.message,MsgState.Success,2000,function () {
                 message.pagePrams.isInit=-1;
                 message.getData(1);
             });
         }
        });
    });
})

var message = {
    pagePrams: {'curIndex': 1, 'totalPage': 2, 'pageSize': 10, 'isInit': -1, 'dataType': ''},//分页参数
    init: function () {
        message.getData(1);
    },
    initPage: function () {//初始化分页插件
        var that = this;
        if (that.pagePrams.isInit > 0)
            return;
        that.pagePrams.isInit = 1;
        that.pagePrams.curIndex = 1;
        $(".page-box").html("");
        $(".page-box").append($("<div id=\"pagination\" class=\"page fr\"></div>"));
        $("#pagination").pagination({
            currentPage: that.pagePrams.curIndex,
            totalPage: that.pagePrams.totalPage,
            isShow: true,
            count: that.pagePrams.pageSize,
            callback: function (currIndex) {
                that.pagePrams.curIndex = currIndex;//分页保持
                message.getData(currIndex);
            }
        });
    },
    getData: function (currIndex) {
        var url = config.WebService()["messageSummary_Query"];
        var data = {
            "sortField": "createtime",
            "sortType": "desc",
            "isRead": isRead,
            "pageNum": currIndex,
            "pageSize": message.pagePrams.pageSize
        };
        top.Requst.ajaxGet(url, data, true, function (data) {
            if(data.code==200)
            {
                var dataList=$('#dataList');dataList.html('');
                for(var i=0;i<data.data.pageData.length;i++)
                {
                    var item=data.data.pageData[i];
                    var dom=$('<div data-msgId="'+item.id+'" data-customid="'+item.customid+'" class="message-msg-box">'+
                                    '<span class="message-msg-1">'+item.title+'</span>'+
                                    '<span class="message-msg-2">'+item.msgContent+'</span>'+
                                    '<span class="message-msg-3">'+item.orderid+'</span>'+
                                    '<span class="message-msg-4">'+item.createtime+'</span>'+
                                '</div>');
                    if(item.isVisit==1)//跳转详情
                    {
                        dom.on('click',function () {
                            var customid=$(this).attr('data-customid');
                            var msgId=$(this).attr('data-msgId');
                            if(roleType==1||roleType==4)
                            {
                                top.classMain.addTab(customid, './CustomerService/orderDetails.html?customid=' + customid);
                            }
                            else if(roleType==2)
                            {
                                top.classMain.addTab(customid, './Designer/designDetails.html?customid=' + customid);
                            }
                            else if(roleType==3)
                            {
                                top.classMain.addTab(customid, './WorkShop/shopDetails.html?customid=' + customid);
                            }
                            var url=config.WebService()["markedUpRead"];
                            top.Requst.ajaxPost(url,{'wId':msgId},true,function (data) {
                                if(data.code==200)
                                {
                                    console.log("消息标记已读"+data.message);
                                }
                            },null,true);
                            top.Popup.close("消息列表");
                        });
                    }
                    dataList.append(dom);
                }

                message.pagePrams.totalPage=Math.ceil(data.data.pageMessage.rowCount / message.pagePrams.pageSize);
                message.initPage();

                //各行变色
                $(".message-msg-box-pre").children("div:first").css("background-color", "#fcfcfc");
                $(".message-msg-box-pre").children("div:even").addClass("one");
                $(".message-msg-box-pre").children("div:odd").addClass("two");
            }
        });
    }
}