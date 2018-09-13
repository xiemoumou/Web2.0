var tabstatus = 3;
$(function () {
    //选项卡切换
    $('.nav ul li').on('click', function () {
        $('.nav ul li').removeClass('active');
        var li = $(this);
        li.addClass('active');
        $("#showtype").val(li.attr('data-status'));
        tabstatus = parseInt(li.attr("data-status"));
        $("#datalist").html("");//清空列表
        //$("#search").val("");//清空搜索框
        orderAdmin.getData();
        $("#order_num").text("");
        orderAdmin.getnum();
        if(tabstatus==3)//更新订单总数分类
        {
            $(".order-list-msg").text('待接受生产订单总数');
            $('.order-list-num').removeClass('hide');
        }
        else if(tabstatus==2) {
            $(".order-list-msg").text('待接受设计订单总数');
            $('.order-list-num').removeClass('hide');
        }
        else if(tabstatus==1) {
            $('.order-list-num').addClass('hide');
        }
    });
    orderAdmin.getnum();


    //拉取列表
    $(".btn-list").on('click',function () {
        if(tabstatus==3)//车间拉取列表
        {
            pop.PullList("待接受生产列表",tabstatus);
            $(".order-list-msg").text('待接受生产订单总数');
        }
        else if(tabstatus==2) {
            pop.PullList("待接受设计列表",tabstatus);
            $(".order-list-msg").text('待接受设计订单总数');
        }

    });

    //按会车搜索
    document.onkeyup = function (e) {
        var code = e.charCode || e.keyCode;
        if (code == 13) {
            orderAdmin.search();
        }
    }


});

var orderAdmin = {
    render: function () {//渲染列表
        var that = this;
        var dataList = $("#datalist");
        dataList.html("");
        for (var i = 0; i < top.Cache["orderAdmin"].length; i++) {
            var itemData = top.Cache["orderAdmin"][i];
            var item = $("<div class='order-model' data-index='"+i+"'>" +
                "<div class='order-modu-content'>" +
                "<div class='order-img-box'>" +
                "<img onerror='this.src=\"../../Image/imageError.png\"' src='http://" + itemData.smallGoodsImage + "' class='order-img'>" +
                "</div>" +
                "<div class='order-text'>" +
                "<div class='order-first'>" +
                "<p class='first-left'>订单号：" + "<span>" + itemData.orderid + "</span>" + "</p>" +
                "<p class='first-right'>车间：" + "<span>" + itemData.workshopname + "</span>" + "</p>" +
                "</div>" +
                "<div class='order-second'>" +
                "<p>旺旺号：" + "<span>" + itemData.wangid + "</span>" + "</p>" +
                "</div>" +
                "<div class='order-third'>" +
                "<p>客服：" + "<span>" + itemData.servicername + "</span>" + "</p>" +
                "</div>" +
                "<div class='order-fourth'>" +
                "<p class='fourth-left'>设计师：" + "<span>" + itemData.disignername + "</span>" + "</p>" +
                "<div class='btn-tran'>转接订单</div>" +
                "</div>" +
                "</div>" +
                "</div>" +
                "</div>");
            item.on('click', function () {
                var index=$(this).attr("data-index");
                top.Popup.open("转接订单",448,312,'./Pop-ups/tranOrder.html?tabstatus='+tabstatus+'&index='+index);
            });
            dataList.append(item);
        }
    },
    getData: function (orderid) {
        if(!orderid)
            return;
        var data = {
            "orderid": orderid,
            "roletype":tabstatus
        }
        //获取订单列表
        var url = config.WebService()["orderDesignInfoSearch_Query"];
        debugger
        top.Requst.ajaxGet(url, data,true, function (data) {
            if (data.code==200) {
                top.Cache["orderAdmin"]=  data.data;
                if(top.Cache["orderAdmin"].length==0)
                {
                    top.Message.show("提醒","无相关订单",MsgState.Warning,2000);
                }
                orderAdmin.render();
            }
        });
    },
    getnum:function(){
        //待接受生产订单总数
        url = config.WebService()["orderProductInfoWaitProduct"];
        var data={
            "status":tabstatus
        };

        top.Requst.ajaxGet(url, data, true, function (data) {
            if(data.code==200)
            {
                var data= data.data;
                var totalnum=0;
                for(var i=0;i<data.length;i++)
                {
                    totalnum+=data[i].num;
                }
                $("#order_num").text(totalnum);
            }
        },null,null,false);
    },
    search: function () {
        var that = this;
        var OrderId = $("#search").val();
        if(!$.trim(OrderId))
        {
            Common.shake($("#search"), "border-red", 10);
            return;
        }
        that.getData(OrderId);
    }
};


var pop = {
    PullList: function (title,status) {//拉取列表
        top.Popup.open("拉取列表",416,347,'./CustomerService/pullList.html?status='+status);
    }
};






