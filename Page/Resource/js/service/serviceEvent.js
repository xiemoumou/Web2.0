//客服---订单概览的事件
var orderid, customid, goodsid, finalprice, ordersheetstate, orderstate; //定义变量  -- 定价
var prdNumber,	//---订单的产品数量
    deadline,	//---订单工期
    length,		// --产品长度
    width,		//  ----产品宽度
    height,		//  ----产品高度
    goodsclass,		//   --- 修改产品类别
    texturename,	//   -----产品材质
    accessoriesname,//---  产品配件名称
    shape,		//  ----  开模参数
    color,		//    --- 电镀色参数
    technology;	//   --- 修改  工艺参数
var designFee = 0, guideFee = 0, finalPrice = 0, mindPrice = 0;//定义变量--设计费--引导费--定价--心理价
$(function () {
    //分配设计
    $(document).on("click", ".workstage_designBtn", function () {

        orderid = $(this).parent().attr("data-orderid");
        customid = $(this).parent().attr("data-customid");
        goodsid = $(this).parent().attr("data-goodsid");
        OrderOverview.statusClick.distributionDesign(this);
    });
    //分配生产
    $(document).on("click", ".allocationProduce", function () {
        orderid = $(this).parent().attr("data-orderid");
        customid = $(this).parent().attr("data-customid");
        goodsid = $(this).parent().attr("data-goodsid");
        orderstate = $(this).parent().attr("data-orderstate");
        ordersheetstate = $(this).parent().attr("ordersheetstate");
        OrderOverview.statusClick.allocationProduce(orderstate);
    });
    //发起询价
    $(document).on("click", ".workstage_enquiryBtn", function () {
        orderid = $(this).parent().attr("data-orderid");
        customid = $(this).parent().attr("data-customid");
        goodsid = $(this).parent().attr("data-goodsid");
        OrderOverview.statusClick.doEnquiry();
    });
    //催设计稿  催稿
    $(document).on("click", ".workstage_reminderBtn", function () {

        orderid = $(this).parent().attr("data-orderid");
        customid = $(this).parent().attr("data-customid");
        goodsid = $(this).parent().attr("data-goodsid");
        OrderOverview.statusClick.doReminder();
    });
    //进入订单详情
    $(document).on("click", ".figure_orderCont", function () {
        orderid = $(this).parent().attr("data-orderid");
        customid = $(this).parent().attr("data-customid");
        window.location.href = "../../page_service/service/order_details.html?orderid=" + orderid + "&customid=" + customid;
    });
    //查看物流信息
    $(document).on("click", "button.checkLogist", function () {

        orderid = $(this).parent().attr("data-orderid");
        customid = $(this).parent().attr("data-customid");
        window.location.href = "../../page_factory/factory/logistics_info.html?orderid=" + orderid + "&customid=" + customid;

    });
    //修改订单产品的数量
    $(document).on("change", ".prdNum", function () {
        var $parent = $(this).parent().parent().parent();
        orderid = $parent.attr("data-orderid");
        customid = $parent.attr("data-customid");
        prdNumber = $.trim($(this).val());//---订单的产品数量
        deadline = $.trim($parent.find(".prdDeadline").val());//---订单工期
        length = $.trim($parent.find(".prdLength").val());//    --产品长度
        width = $.trim($parent.find(".prdWidth").val());//     ----产品宽度
        height = $.trim($parent.find(".prdHeight").val());//  ----产品高度
        //调用并触发更新订单内容的事件
        OrderOverview.updateOrderSummary(3);
    });
    //修改订单产品的长度
    $(document).on("change", ".prdLength", function () {
        var $parent = $(this).parent().parent().parent();
        orderid = $parent.attr("data-orderid");
        customid = $parent.attr("data-customid");
        prdNumber = $.trim($parent.find(".prdNum").val());//---订单的产品数量
        deadline = $.trim($parent.find(".prdDeadline").val());//---订单工期
        length = $.trim($parent.find(".prdLength").val());//    --产品长度
        width = $.trim($parent.find(".prdWidth").val());//     ----产品宽度
        height = $.trim($parent.find(".prdHeight").val());//  ----产品高度
        //调用并触发更新订单内容的事件
        OrderOverview.updateOrderSummary(3);
    });
    //修改订单产品的宽度
    $(document).on("change", ".prdWidth", function () {
        var $parent = $(this).parent().parent().parent();
        orderid = $parent.attr("data-orderid");
        customid = $parent.attr("data-customid");
        prdNumber = $.trim($parent.find(".prdNum").val());//---订单的产品数量
        deadline = $.trim($parent.find(".prdDeadline").val());//---订单工期
        length = $.trim($parent.find(".prdLength").val());//    --产品长度
        width = $.trim($parent.find(".prdWidth").val());//     ----产品宽度
        height = $.trim($parent.find(".prdHeight").val());//  ----产品高度
        //调用并触发更新订单内容的事件
        OrderOverview.updateOrderSummary(3);
    });
    //修改订单产品的高度
    $(document).on("change", ".prdHeight", function () {
        var $parent = $(this).parent().parent().parent();
        orderid = $parent.attr("data-orderid");
        customid = $parent.attr("data-customid");
        prdNumber = $.trim($parent.find(".prdNum").val());//---订单的产品数量
        deadline = $.trim($parent.find(".prdDeadline").val());//---订单工期
        length = $.trim($parent.find(".prdLength").val());//    --产品长度
        width = $.trim($parent.find(".prdWidth").val());//     ----产品宽度
        height = $.trim($parent.find(".prdHeight").val());//  ----产品高度
        //调用并触发更新订单内容的事件
        OrderOverview.updateOrderSummary(3);
    });
    //修改订单产品的工期
    $(document).on("change", ".prdDeadline", function () {
        var $parent = $(this).parent().parent().parent();
        orderid = $parent.attr("data-orderid");
        customid = $parent.attr("data-customid");
        prdNumber = $.trim($parent.find(".prdNum").val());//---订单的产品数量
        deadline = $.trim($parent.find(".prdDeadline").val());//---订单工期
        length = $.trim($parent.find(".prdLength").val());//    --产品长度
        width = $.trim($parent.find(".prdWidth").val());//     ----产品宽度
        height = $.trim($parent.find(".prdHeight").val());//  ----产品高度
        //调用并触发更新订单内容的事件
        OrderOverview.updateOrderSummary(4);
    });
    //修改订单产品的类别
    $(document).on("click", "ul.productType_service li", function () {

        var $parent = $(this).parent().parent().parent().parent().parent();
        orderid = $parent.attr("data-orderid");
        customid = $parent.attr("data-customid");
        goodsclass = $.trim($parent.find(".productTypeBtn_service").text());	//   --- 修改产品类别
        texturename = $.trim($parent.find(".textureBtn_service").text());	//   -----产品材质
        accessoriesname = $.trim($parent.find(".partsBtn_service").text());//---  产品配件名称
        //调用并触发更新订单内容的事件
        setTimeout(function () {
            OrderOverview.updateOrderSummary(1);
        }, 150);

    });
    //修改订单产品的材质
    $(document).on("click", "ul.texture_service li", function () {

        var $parent = $(this).parent().parent().parent().parent().parent();
        orderid = $parent.attr("data-orderid");
        customid = $parent.attr("data-customid");
        goodsclass = $.trim($parent.find(".productTypeBtn_service").text());	//   --- 修改产品类别
        texturename = $.trim($parent.find(".textureBtn_service").text());	//   -----产品材质
        accessoriesname = $.trim($parent.find(".partsBtn_service").text());//---  产品配件名称
        //调用并触发更新订单内容的事件
        setTimeout(function () {
            OrderOverview.updateOrderSummary(1);
        }, 150);
    });
    //修改订单产品的配件
    $(document).on("click", "ul.parts_service li", function () {

        var $parent = $(this).parent().parent().parent().parent().parent();
        orderid = $parent.attr("data-orderid");
        customid = $parent.attr("data-customid");
        goodsclass = $.trim($parent.find(".productTypeBtn_service").text());	//   --- 修改产品类别
        texturename = $.trim($parent.find(".textureBtn_service").text());	//   -----产品材质
        accessoriesname = $.trim($parent.find(".partsBtn_service").text());//---  产品配件名称
        //调用并触发更新订单内容的事件
        setTimeout(function () {
            OrderOverview.updateOrderSummary(1);
        }, 150);
    });
    //修改订单产品的开模方法  参数
    $(document).on("click", "button.confirm_addMold_work", function () {

        var $parent = $(this).parent().parent().parent().parent().parent().parent();
        orderid = $parent.attr("data-orderid");
        customid = $parent.attr("data-customid");
        shape = $.trim($parent.find(".moldOpenBtn").text());//  ----  开模参数
        color = $.trim($parent.find(".craftBtn").text());//    --- 电镀色参数
        technology = $.trim($parent.find(".electroplateBtn").text());//   --- 修改  工艺参数
        //调用并触发更新订单内容的事件
        setTimeout(function () {
            OrderOverview.updateOrderSummary(2);
        }, 150);
    });
    //修改订单产品的工艺  参数
    $(document).on("click", "button.confirm_addCraft_work", function () {

        var $parent = $(this).parent().parent().parent().parent().parent().parent();
        orderid = $parent.attr("data-orderid");
        customid = $parent.attr("data-customid");
        shape = $.trim($parent.find(".moldOpenBtn").text());//  ----  开模参数
        color = $.trim($parent.find(".craftBtn").text());//    --- 电镀色参数
        technology = $.trim($parent.find(".electroplateBtn").text());//   --- 修改  工艺参数
        //调用并触发更新订单内容的事件
        setTimeout(function () {
            OrderOverview.updateOrderSummary(2);
        }, 150);
    });
    //修改订单产品的电镀色  参数
    $(document).on("click", "button.confirm_addColor_work", function () {

        var $parent = $(this).parent().parent().parent().parent().parent().parent();
        orderid = $parent.attr("data-orderid");
        customid = $parent.attr("data-customid");
        shape = $.trim($parent.find(".moldOpenBtn").text());//  ----  开模参数
        color = $.trim($parent.find(".craftBtn").text());//    --- 电镀色参数
        technology = $.trim($parent.find(".electroplateBtn").text());//   --- 修改  工艺参数
        //调用并触发更新订单内容的事件
        setTimeout(function () {
            OrderOverview.updateOrderSummary(2);
        }, 150);
    });
    //客服确认收货   workstage_confirmDeliveryBtn
    $(document).on("click", "button.workstage_confirmDeliveryBtn", function () {
        orderid = $(this).parent().attr("data-orderid");
        customid = $(this).parent().attr("data-customid");
        goodsid = $(this).parent().attr("data-goodsid");
        //调用并触发  确认收货  事件
        OrderOverview.statusClick.confirmRecp();
    });
    //客服确认支付  
    $(document).on("click", "button.workstage_confirmPayBtn", function () {
        orderid = $(this).parent().attr("data-orderid");
        customid = $(this).parent().attr("data-customid");
        goodsid = $(this).parent().attr("data-goodsid");
        finalprice = $(this).parent().attr("data-finalprice");

        var url = encodeURI('./confirmPay.html?orderid=' + orderid + '&customid=' + customid + '&goodsid=' + goodsid + '&finalprice=' + finalprice);
        OrderOverview.layerIndex = layer.open({
            type: 2,
            title: '确认客户支付',
            shadeClose: false,
            shade: 0.1,
            area: ['400px', '232px'],
            content: url
        });


    });

    //开发票
    $(document).on('click', '.js-invoice', function () {
        orderid = $(this).parent().attr("data-orderid");
        var taxrate = $(this).parent().attr("data-taxrate");
        var url = encodeURI('./service/invoice.html?orderid=' + orderid + '&taxrate=' + taxrate);
        var scrollH = parent.document.documentElement.scrollHeight - 20;
        if (scrollH > 698) {
            scrollH = 698;
        }

        OrderOverview.layerIndex = parent.layer.open({
            type: 2,
            title: '开票据',
            shadeClose: false,
            shade: 0.1,
            area: ['698px', scrollH + 'px'],
            content: url
        });
    });

    //盒子
    $(document).on('click',".box", function () {
        orderid = $(this).parent().attr("data-orderid");
        //确认发票
        var url = encodeURI('./service/box.html?orderid='+ orderid);
        var scrollH= parent.document.documentElement.scrollHeight-20;
        if(scrollH>500)
        {
            scrollH=500;
        }
        parent.layer.open({
            type: 2,
            title: '配置包装',
            shadeClose: false,
            shade: 0.1,
            area: ['550px', scrollH +'px'],
            content: url
        });
    });

    //删除订单
    $(document).on('click', '.js-delete', function () {
        orderid = $(this).parent().attr("data-orderid");
        customid = $(this).parent().attr("data-customid");

        var url = encodeURI('./deleteOrder.html?orderid=' + orderid + '&customid=' + customid);
        OrderOverview.layerIndex = layer.open({
            type: 2,
            title: '删除订单',
            shadeClose: false,
            shade: 0.1,
            area: ['300px', '260px'],
            content: url
        });
    });
    //核对订单
    $(document).on('click', '.order_check', function () {
        orderid = $(this).parent().attr("data-orderid");
        customid = $(this).parent().attr("data-customid");
        var url = encodeURI('../page_service/service/order_check.html?orderid=' + orderid);
        var scrollH = parent.$(window).height() - 20;
        if (scrollH >540) {
            scrollH = 540;
        }
        
        parent.layer.open({
            type: 2,
            title: '核对订单',
            shadeClose: false,
            shade: 0.1,
            area: ['818px', scrollH + 'px'],
            content: url
        });
    });

    //操作成品图
    $(document).on('click', '.up-finished', function () {
        orderid = $(this).parent().attr("data-orderid");
        customid = $(this).parent().attr("data-customid");
        var url = encodeURI('../page_service/service/upload_Deliver.html?orderid=' + orderid + "&customid=" + customid);
        var scrollH = parent.$(window).height();
        -20;
        if (scrollH > 245) {
            scrollH = 245;
        }

        parent.layer.open({
            type: 2,
            title: '成品图',
            shadeClose: false,
            shade: 0.1,
            area: ['416px', scrollH + 'px'],
            content: url
        });
    });
});


var OrderOverview = {
    layerIndex: 0,
    getUrl: {},//请求接口的URL
    getDataInterface: {},//请求数据的接口
    functionalInterface: {},//操作功能的接口
    userInfo: {
        "userid": $.cookie("userid"),
        "roletype": parseInt($.cookie("roletype")),
        "token": $.cookie("token")
    },//用户信息
    request: function (data, callback, getDataInterface, functionalInterface) {
        var url = Common.getUrl()['order'];
        if (getDataInterface) {
            url += Common.getDataInterface()[getDataInterface];
        }
        if (functionalInterface) {
            url += Common.functionalInterface()[functionalInterface];
        }
        Common.ajax(url, data, true, callback, function (error) {
            //接口调用错误处理
        });
    },
    updateOrderSummary: function (status, lockbtn) {//修改订单的信息, 修改产品类别、产品材质、产品配件

        var data = {};
        if (status == 1) {
            data = {
                "userId": OrderOverview.userInfo.userid,
                "orderid": orderid,
                "customid": customid,
                "roleType": OrderOverview.userInfo.roletype,
                "token": OrderOverview.userInfo.token,
                "commandcode": 150,
                "goodsclass": goodsclass,//   --- 修改产品类别
                "texturename": texturename,//   -----产品材质
                "accessoriesname": accessoriesname,//---  产品配件名称
            }
        } else if (status == 2) {
            data = {
                "userId": OrderOverview.userInfo.userid,
                "orderid": orderid,
                "customid": customid,
                "roleType": OrderOverview.userInfo.roletype,
                "token": OrderOverview.userInfo.token,
                "commandcode": 150,
                "shape": shape,//  ----  开模参数
                "color": technology,//    --- 电镀色参数
                "technology": color//   --- 修改  工艺参数
            }
        } else if (status == 3) {
            data = {
                "userId": OrderOverview.userInfo.userid,
                "orderid": orderid,
                "customid": customid,
                "roleType": OrderOverview.userInfo.roletype,
                "token": OrderOverview.userInfo.token,
                "commandcode": 150,
                "number": prdNumber,//---订单的产品数量
                "deadline": deadline,//---订单工期
                "length": length,//    --产品长度
                "width": width,//     ----产品宽度
                "height": height,//  ----产品高度
            }
        }
        else if (status == 4) {
            data = {
                "userId": OrderOverview.userInfo.userid,
                "orderid": orderid,
                "customid": customid,
                "roleType": OrderOverview.userInfo.roletype,
                "token": OrderOverview.userInfo.token,
                "commandcode": 150,
                "deadline": deadline,//---订单工期
            }
        }

        //经理角色commandcode特殊处理
        if (OrderOverview.userInfo.roletype == 4) {
            data.commandcode = 101;
        }

        OrderOverview.request(data, function (data) {
            if (data && data.status && data.status.msg) {
                Common.msg(data.status.msg, data.status.code == 1 ? 200 : null, 2000, function () {
                    if (base && base.init) {
                        base.init();
                    }
                });
            }
        }, 'updateOrderSummary', null);
    },
    statusClick: {
        distributionDesign: function (obj) {//分配设计
            if (obj) {
                var axio = $(obj).parent().parent().next();
                var design = axio.find('.blue-value').val();//设计费
                var guidefee = axio.find('.guide-fee-value').html();//引导费
                guidefee = guidefee.slice(1, guidefee.length);
                layer.open(
                    {
                        type: 2,
                        title: '分配设计',
                        shadeClose: false,
                        shade: 0.1,
                        area: ['465px', '200px'],
                        content: "./distributionDesignConfirm.html?design=" + design + "&guidefee=" + guidefee,
                    }
                );
            }
            else {
                // console.log(orderid, customid, goodsid);
                OrderOverview.request({
                    "orderid": orderid,
                    "userid": OrderOverview.userInfo.userid,
                    "customid": customid,
                    "roletype": OrderOverview.userInfo.roletype,
                    "token": OrderOverview.userInfo.token,
                    "commandcode": 142,
                    "goodsid": goodsid
                }, function (data) {
                    console.log(data)
                    if (data && data.status && data.status.msg) {
                        Common.msg(data.status.msg, data.status.code == 0 ? 200 : "", 2000, function () {
                            if (data.status.code == 0) {
                                base.init();
                            }
                        });
                    }
                }, 'designpat', null);
            }
        },
        allocationProduce: function (orderstate) {//分配生产
            
            //分配生产前检查begin
            OrderOverview.request({
                "orderId": orderid,
                "userId": OrderOverview.userInfo.userid,
                "roleType": OrderOverview.userInfo.roletype,
                "token": OrderOverview.userInfo.token,
                "commandCode": 302,
            }, function (data) {
            // var data={};
            // data.status={"code":3};
                if (data && data.status) {
                    if (data.status.code == 1)//弹出对账单，在对账单中点去定调用分配生产
                    {
                        var url = encodeURI('../page_service/service/order_check.html?allocationProduce=true&orderid=' + orderid+"&customid="+customid);
                        var scrollH = parent.$(window).height() - 20;
                        if (scrollH > 400) {
                            scrollH = 400;
                        }

                        parent.layer.open({
                            type: 2,
                            title: '分配生产前核对订单',
                            shadeClose: false,
                            shade: 0.1,
                            area: ['818px', scrollH + 'px'],
                            content: url
                        });
                    }
                    else if (data.status.code == 7)//发票信息不完整
                    {
                        //确认发票
                        var url = encodeURI('./service/invoice.html?orderid=' + orderid + "&allocationProduce=true&strict=true");
                        var scrollH = parent.$(window).height() - 20;
                        if (scrollH > 639) {
                            scrollH = 639;
                        }
                        parent.layer.open({
                            type: 2,
                            title: '完善发票',
                            shadeClose: false,
                            shade: 0.1,
                            area: ['639px', scrollH + 'px'],
                            content: url
                        });
                    }
                    else if (data.status.code == 1003)//没有设计稿
                    {
                        var url = encodeURI('./uploadDesign.html?orderid=' + orderid + '&customid=' + customid + '&goodsid=' + goodsid);
                        layer.open({
                            type: 2,
                            title: '上传设计稿',
                            shadeClose: false,
                            shade: 0.1,
                            area: ['565px', '570px'],
                            content: url
                        });
                        return true;
                    }
                    else if (data.status.code == 3)//没有收货地址
                    {
                        var url = encodeURI('./add-address.html?orderid=' + orderid + '&customid=' + customid + '&goodsid=' + goodsid)
                        layer.open({
                            type: 2,
                            title: '添加收货地址',
                            shadeClose: false,
                            shade: 0.1,
                            area: ['400px', '420px'],
                            content: url
                        });
                        return true;
                    }
                    else {
                        Common.msg(data.status.msg, null, 2000, function () {
                            return false;
                        });
                    }
                }
            }, 'beforeAllocation', null);//分配生产前检查end
        },
        doEnquiry: function () {//发起询价
            //console.log(orderid, customid, goodsid);
            OrderOverview.request({
                "orderid": orderid,
                "userid": OrderOverview.userInfo.userid,
                "customid": customid,
                "roletype": OrderOverview.userInfo.roletype,
                "token": OrderOverview.userInfo.token,
                "commandcode": 140,
                "goodsid": goodsid
            }, function (data) {
                console.log(data)
                if (data && data.status && data.status.msg) {
                    if (data.status.code == 0) {
                        base.init();
                    }
                    Common.msg(data.status.msg);
                }
            }, 'enquiry', null);
        },
        doReminder: function () {//催稿  催设计稿
            //console.log(orderid, customid, goodsid);
            OrderOverview.request({
                "orderid": orderid,
                "userid": OrderOverview.userInfo.userid,
                "customid": customid,
                "roletype": OrderOverview.userInfo.roletype,
                "token": OrderOverview.userInfo.token,
                "commandcode": 148
            }, function (data) {
                if (data && data.status && data.status.msg) {
                    Common.msg(data.status.msg);
                }
            }, 'reminder', null);
        },
        confirmRecp: function () {//确认收货---客服
            //console.log(orderid, customid, goodsid);
            OrderOverview.request({
                "orderid": orderid,
                "userid": OrderOverview.userInfo.userid,
                "customid": customid,
                "roletype": OrderOverview.userInfo.roletype,
                "token": OrderOverview.userInfo.token,
                "commandcode": 59,
                "goodsid": goodsid
            }, function (data) {
                if (data && data.status && data.status.msg) {
                    Common.msg(data.status.msg, data.status.code == 0 ? 200 : null);
                    setTimeOut(function () {
                        if (data.status.code == 0) {
                            base.init();
                        }
                    }, 2000);
                }
            }, 'confirmReceipt', null);
        },
        changePrice: function (temp) { //改变价格--设计费--引导费--报价--预算价格
            if (temp == 1) {//修改设计费--引导费
                var data = {
                    "orderid": orderid,
                    "userId": OrderOverview.userInfo.userid,
                    "customid": customid,
                    "roleType": OrderOverview.userInfo.roletype,
                    "token": OrderOverview.userInfo.token,
                    "designprice": designFee,
                    "designGuideFee": guideFee,
                    "commandcode": 141
                }
            } else if (temp == 2) {//修改客户预算价格--心理价
                var data = {
                    "orderid": orderid,
                    "userId": OrderOverview.userInfo.userid,
                    "customid": customid,
                    "roleType": OrderOverview.userInfo.roletype,
                    "token": OrderOverview.userInfo.token,
                    "mindprice": mindPrice,
                    "commandcode": 141
                }
            } else if (temp == 3) {//修改订单定价
                var data = {
                    "orderid": orderid,
                    "userId": OrderOverview.userInfo.userid,
                    "customid": customid,
                    "roleType": OrderOverview.userInfo.roletype,
                    "token": OrderOverview.userInfo.token,
                    "finalprice": finalPrice,
                    "commandcode": 141
                }
            }

            OrderOverview.request(data,
                function (res) {
                    if (res) {
                        Common.msg(res.status.msg, res.status.code == 0 ? 200 : "");
                    }
                }, 'priceRuler', null);
            return true;

        }
        //statusClick-------END 
    }


}

var distribution = function () {//确定分配设计

    layer.closeAll();
    OrderOverview.statusClick.distributionDesign(null);
}
