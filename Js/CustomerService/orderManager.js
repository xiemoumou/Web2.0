var tabstatus = 1;
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
        //orderAdmin.getData();
        $("#order_num").text("");
        orderAdmin.getnum();
        if(tabstatus==1)//更新订单总数分类
        {
            $(".order-list-msg").text('待接受生产订单总数');
        }
        else if(tabstatus==2) {
            $(".order-list-msg").text('待接受设计订单总数');

        }
    });
    orderAdmin.getnum();


    //拉取列表
    $(".btn-list").on('click',function () {
        if(tabstatus==1)//车间拉取列表
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
    data: {},
    render: function () {//渲染列表
        var that = this;
        var dataList = $("#datalist");
        dataList.html("");
        for (var i = 0; i < that.data.length; i++) {
            var itemData = that.data[i];
            var item = $("<div class='order-model' data-index='"+i+"'>" +
                "<div class='order-modu-content'>" +
                "<div class='order-img-box'>" +
                "<img src='" + Common.getUrl().cosImgUrl+itemData.goodsimage + "' class='order-img'>" +
                "</div>" +
                "<div class='order-text'>" +
                "<div class='order-first'>" +
                "<p class='first-left'>订单号：" + "<span>" + itemData.orderid + "</span>" + "</p>" +
                "<p class='first-right'>车间：" + "<span>" + itemData.workshopname + "</span>" + "</p>" +
                "</div>" +
                "<div class='order-second'>" +
                "<p>旺旺号：" + "<span>" + itemData.customerid + "</span>" + "</p>" +
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
                var url = encodeURI('../page_service/service/tran_order.html?tabstatus='+tabstatus+'&index='+index);
                parent.layer.open({
                    type: 2,
                    title: '转接订单',
                    shadeClose: false,
                    shade: 0.1,
                    area: ['448px', 312 + 'px'],
                    content: url
                });
            });
            dataList.append(item);
        }
    },
    getData: function (orderid) {
        var that = this;
        var userInfo = top.Main.userInfo;//获取用户信息
        var data = {
            "orderid": orderid,
            "userId": userInfo.userid,
            "token": userInfo.token,
            "roleType": parseInt(userInfo.roletype),
            "commandCode":1,
            "status":tabstatus,
        }
        //获取订单列表
        var url = Common.getUrl()['order'] + Common.getDataInterface()["managerOrderSerach"];
        Common.ajax(url, data,true, function (data) {
            if (data) {
                //that.data = [$.parseJSON(data.data.data)];
                that.data =  data.data.data;
                if(that.data.length==0)
                {
                    top.Common.msg("无相关订单",405,2000);
                }
                orderAdmin.render();

            }
        });
    },
    getnum:function(){
        //待接受生产订单总数
        url = Common.getUrl()['order'] + Common.getDataInterface()["managerOrder"];
        var data={
            "commandCode":100,
            "userId":$.cookie("userid"),
            "token":$.cookie("token"),
            "roleType":$.cookie("roletype"),
            "status":tabstatus,
        };

        Common.ajax(url, data, true, function (data) {
            var data= data.data;
            //var data=$.parseJSON(data);
            //var datalist=data.workshop?data.workshop:data.list;
            $("#order_num").text(data.totalnum);
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
        var url = encodeURI('../page_service/service/pullList.html?status='+status);
        var scrollH = 347;
        parent.layer.open({
            type: 2,
            title: title,
            shadeClose: false,
            shade: 0.1,
            area: ['416px', scrollH + 'px'],
            content: url
        });
    }
};






