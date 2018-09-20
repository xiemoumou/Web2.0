/**
 * Created by liyuanpeng on 2018/8/19.
 */

var customid = Helper.getUrlParam('customid') || "";//获取订单号

var orderInfo = {
    shippingAddress: {//收货地址
        customid: customid,//定制号
        name: '',  //收件人
        mobilephone: '', //收件人电话
        postcode: '', //	邮编
        province: '', //省份
        city: '',  //城市
        county: '',  //县区
        address: '', //  收货地址
    },
    data: null,
};

$(function () {

    document.onkeydown = function (e) {
        e = window.event || e;
        var keycode = e.keyCode || e.which;
        if (keycode == 116) {
            if (window.event) {// ie
                try {
                    e.keyCode = 0;
                } catch (e) {
                }
                e.returnValue = false;
            } else {// firefox
                e.preventDefault();
            }
            window.location.reload(true);
        }
    }

    $(".Edit").on('click', function () {//添加编辑弹窗
        var scrollH = top.Helper.getClientHeight();
        var popH = scrollH - 100 > 410 ? 410 : scrollH - 100;
        top.Popup.open("产品生产参数编辑", 900, popH, "./CustomerService/createOrder.html?operType=edit&customid=" + customid);
    })

    //添加地址弹窗
    $(".address-add,.modify-addr").on('click', function () {
        var scrollH = document.documentElement.scrollHeight - 20;
        if (scrollH > 380) {
            scrollH = 380;
        }
        var title = "添加收货地址";
        top.Popup.open(title,
            480,
            scrollH,
            encodeURI('./Pop-ups/addAddress.html?title=' + title + '&name=' + orderInfo.shippingAddress.name + '&mobilephone=' + orderInfo.shippingAddress.mobilephone + '&postcode=' + orderInfo.shippingAddress.postcode + '&province=' + orderInfo.shippingAddress.province + '&city=' + orderInfo.shippingAddress.city + '&county=' + orderInfo.shippingAddress.county + '&address=' + orderInfo.shippingAddress.address + '&customid=' + customid + '&operType=detail'));
    });

    //设计相关-提交修改
    $(".deails-btn,.offer-btn").on('click', function () {
        details.btnModify();
    });

    //回复留言
    $(".leav-btn .btn").on('click', function () {
        details.leavBtn();
    });

    details.getData();//请求详情

    details.editDetails();

    //初始化上传组件
    function fileInit() {
        $("#details_diagram").attr("data-customid", customid);
        $("#details_encl").attr("data-customid", customid);
        $("#prod_refe").attr("data-customid", customid);

        $("#leav_bottom_img").attr("data-customid", customid);
        $("#leav_bottom_file").attr("data-customid", customid);

        uploadfile.uploadPhoto('leav_bottom_img', 3);//留言图片上传
        uploadfile.uploadFile('leav_bottom_file', 1);//留言附件上传

        uploadfile.uploadPhoto('details_diagram', 3);//图片上传
        uploadfile.uploadPhoto('prod_refe', 1);//生产参考图上传`
        uploadfile.uploadFile('details_encl', 1, null, true, null);//附件上传

        uploadfile.initDrag('details_diagram');//拖拽支持
        uploadfile.initDrag('details_encl');
        uploadfile.initDrag('prod_refe');
    }
    fileInit();
});


var dataDetail = null;//详情对象
var details = {
    editDetails: function () {
        $(".order-msg-box").mouseover(function () {
            $(".Edit").removeClass('hide');
        }).mouseout(function () {
            $(".Edit").addClass('hide');
        });

        $(".offer").hover(function () {
            $(".offer p").removeClass('hide');
        }, function () {
            $(".offer p").addClass('hide');
        });

        $(".edit").hover(function () {
            $(".offer p").removeClass('hide');
        }, function () {
            $(".offer p").addClass('hide');
        });

    },
    saveAddress: function (name, mobilephone, postcode, province, city, county, address) {
        //保存收获地址
        orderInfo.shippingAddress.name = name || "";
        orderInfo.shippingAddress.mobilephone = mobilephone || "";
        orderInfo.shippingAddress.province = province || "";
        orderInfo.shippingAddress.postcode = postcode || "";
        orderInfo.shippingAddress.city = city || "";
        orderInfo.shippingAddress.county = county || "";
        orderInfo.shippingAddress.address = address || "";

        $(".cont").html(orderInfo.shippingAddress.name);
        $(".zip-code").html(orderInfo.shippingAddress.postcode);
        $(".detailed").val(orderInfo.shippingAddress.address);
        $(".phone").html(orderInfo.shippingAddress.mobilephone);
        $(".area").html(orderInfo.shippingAddress.province + " " + orderInfo.shippingAddress.city + " " + orderInfo.shippingAddress.county);
        $(".detailed").text(orderInfo.shippingAddress.address);
        if (orderInfo.shippingAddress.name) {
            $('.address-empty').addClass('hide');
            $('.address-text-box').removeClass('hide');
        }

        var copy_code = "联系人： " + name + "\r\n";
        copy_code += "电话/手机： " + mobilephone + "\r\n";
        copy_code += "邮编：" + postcode + "\r\n";
        copy_code += "所在地区：" + province + " ";
        copy_code += city + " ";
        copy_code += county + "\r\n";
        copy_code += "详细地址：" + address + "\r\n";
        $("#copyContent").val(copy_code);
        if (dataDetail.name) {
            $('.address-empty').addClass('hide');
            $('.address-text-box').removeClass('hide');
            $('.modify-addr').removeClass('hide');
        }
    },
    getData: function (operType) {//请求接口
        var that = this;
        var url = config.WebService()["orderSummaryInfo_Query"];
        Requst.ajaxGet(url, {"customId": customid}, true, function (data) {
            if (data.data) {
                dataDetail = data.data;
                var command = dataDetail.command.split(',');
                if (localStorage.getItem('SysParam'))//从缓存获取字典
                {
                    try {
                        SysParam = JSON.parse(localStorage.getItem('SysParam'));
                    }
                    catch (e) {

                    }
                }

                // 订单基础信息++++++++++++++++++++++++++++++++++++ begin ++++++++++++++++++++++++++++++++++++++++++++++++
                if (operType == "base" || operType == null || operType=="designDraft") {

                    if (top.Cache.userInfo.roleType == 4) {
                        var manager = $('.item-head-left-manager');
                        manager.html('');
                        manager.append($('<div class="item-head-left-manager fl">' +
                            '<span>客服ID：<em>' + dataDetail.servicerNickName + '</em></span>' +
                            '<span>车间ID：<em>' + dataDetail.produceNickName + '</em></span>' +
                            '<span style="border-right: none;">方案师ID：<em>' + dataDetail.designNickName + '</em></span>'));

                        manager.removeClass('hide');
                    }

                    var createTime = data.data.createTime || "";//订单创建时间
                    var customerWang = data.data.customerWang || "";//旺旺号
                    var initialGoodsImage = 'http://' + dataDetail.smallGoodsImage || "";//原始产品图中图
                    var number = data.data.number || "";//数量
                    var length = data.data.length || "";//长
                    var width = data.data.width || "";//宽
                    var height = data.data.height || "";//高
                    var userPrice = data.data.userPrice || "0.00";//预算
                    var prePrice = data.data.prePrice || "0.00";//报价
                    var currentPrice = data.data.currentPrice || "";//参考价格
                    var currentPeriod = data.data.currentPeriod || "--";//参考工期
                    var orderid = data.data.orderid || "";//订单ID
                    that.id = data.data.id;//订单表id
                    var item = data.data;

                    //5要素
                    var element = SysParam.element;//元素
                    var model = ConvertIdToName(element.model, item.model).join(';');
                    var technology = ConvertIdToName(element.technology, item.technology).join(';');
                    var color = ConvertIdToName(element.color, item.color).join(';');

                    $(".time-num").text(createTime);//订单创建时间
                    $(".orderNum").text(orderid);//订单号
                    $(".orderWw").text(customerWang);//旺旺号
                    $(".orderCust").text(element.shop[item.shop].name);//客源
                    $(".order-img img").attr('src', initialGoodsImage);//产品图
                    $(".attr-1").text(SysParam.element.goodsClass[item.goodsClass].name);//属性 产品类别
                    $(".attr-2").text(SysParam.element.material[item.material].name);//属性 产品材质
                    $(".attr-3").text(SysParam.element.accessories[item.accessories].name);//属性 配件
                    $(".tech-1").text(model);//工艺开模
                    $(".tech-2").text(technology);//生产工艺
                    $(".tech-3").text(color);//电镀色
                    $(".ordNum").text(number);//数量
                    $(".length").text(length);//长
                    $(".width").text(width);//宽
                    $(".height").text(height);//高
                    $(".limit").html('<em>' + dataDetail.userPeriod + '</em>天</span> </br> <span>¥ <em>' + parseFloat(dataDetail.finalPrice).formatMoney(2, "", ",", ".") + '</em>');//工期
                    $(".quot-num").text(currentPrice);//参考价格
                    $(".quot-day").text(currentPeriod);//参考工期

                    //金额区域
                    function addMoney() {
                        var proposed = ' 参考价 ¥' + parseFloat(dataDetail.currentPrice).formatMoney(2, "", ",", ".") + ' / 工期' + dataDetail.currentPeriod + '天 ';
                        if (dataDetail.currentPrice <= 0) {
                            proposed = ' 参考价 ¥ - / 工期 - 天 ';
                        }

                        var tax = dataDetail.taxRate > 0 ? "含税" : "不含税";

                        var money = $('<div class="amount">' +
                            '<div class="design-fee"><!--设计费-->' +
                            '<span>设计费：¥ <em>' + dataDetail.designPrice.formatMoney(2, "", ",", ".") + ' </em></span>' +
                            '<span>引导费：¥ <em>' + dataDetail.introducePrice.formatMoney(2, "", ",", ".") + '</em></span>' +
                            '<i class="edit hide" data-designPrice="' + dataDetail.designPrice.formatMoney(2, "", ",", ".") + '" data-introducePrice="' + dataDetail.introducePrice.formatMoney(2, "", ",", ".") + '" data-customid="' + dataDetail.customid + '">编辑</i>' +
                            '</div>' +
                            '<!--预算-->' +
                            '<div class="budget">' +
                            '<i class="label fl">预算：</i>' +
                            '<input class="fl input-money" value="' + dataDetail.userPrice.formatMoney(2, "", ",", ".") + '">' +
                            '<button data-customid="' + dataDetail.customid + '" class="btn edit fl">确定</button>' +
                            '</div>' +
                            '<div class="bargain"><!--议价-->' +
                            '<span class="tax fl">' + tax + '</span>' +
                            '<span class="proposed-price fl">' + proposed + '</span>' +
                            '<span data-tax="' + tax + '" data-prePrice="' + dataDetail.prePrice + '" data-lastQuote="' + dataDetail.lastQuote + '" data-customid="' + dataDetail.customid + '" class="button fl hide">议价</span>' +
                            '<i class="arrow"></i>' +
                            '</div>' +
                            '<!--报价-->' +
                            '<div class="quoted">' +
                            '<i class="label fl">报价：</i>' +
                            '<input class="fl input-money" value="' + dataDetail.prePrice.formatMoney(2, "", ",", ".") + '">' +
                            '<button data-customid="' + dataDetail.customid + '" class="btn edit fl">确定</button>' +
                            '</div>' +
                            '</div>');

                        //议价
                        if (dataDetail.inquiryStatus == 6)//议价达成
                        {
                            var bargain = $(money.find('.bargain').find('.button'));
                            $(money.find('.bargain').find('.proposed-price')).css('color', ' #E84B4C');
                            $(bargain).text("议价达成");
                            // $(bargain.parent()).css('width', '238px');
                            bargain.removeClass('hide');
                        }
                        // else if(item.inquiryStatus==5)
                        // {
                        //     var bargain = $(money.find('.bargain').find('.button'));
                        //     $(money.find('.bargain').find('.proposed-price')).css('color', ' #5298FF');
                        //     $(bargain).text("议价中");
                        //     // $(bargain.parent()).css('width', '230px');
                        //     bargain.removeClass('hide');
                        // }
                        else if (command.indexOf("BARGIN") >= 0 && dataDetail.orderPrice > dataDetail.userPrice) //如果参考价低于客户预算，则不显示议价按钮
                        {
                            var bargain = $(money.find('.bargain').find('.button'));
                            $(money.find('.bargain').find('.proposed-price')).css('color', ' #5298FF');
                            bargain.removeClass('hide');
                            //议价
                            $(money.find('.bargain').find('.button')).on('click', function () {
                                var customid = $(this).attr('data-customid');
                                var lastQuote = $(this).attr('data-lastQuote');
                                var prePrice = $(this).attr('data-prePrice');
                                var tax = $(this).attr("data-tax");
                                top.Popup.open("发起议价", 423, 235, "./Pop-ups/launBarg.html?customid=" + customid + "&tax=" + tax + "&lastQuote=" + lastQuote + "&prePrice=" + prePrice);
                            });
                        }
                        else {
                            var bargain = $(money.find('.bargain').find('.bargain'));
                            $(money.find('.bargain').find('.proposed-price')).css('color', '#E84B4C');
                            // bargain.css('width', '185px');
                        }


                        // 编辑设计费
                        $(money.find('.design-fee').find('.edit')).on('click', function () {
                            var customid = $(this).attr('data-customid');
                            var introduceprice = $(this).attr('data-introduceprice');
                            var designPrice = $(this).attr("data-designPrice");
                            top.Popup.open("调整设计费", 423, 286, "./Pop-ups/adjustDesi.html?customid=" + customid + "&introduceprice=" + introduceprice + "&designPrice=" + designPrice);
                        });
                        // 编辑预算
                        $(money.find('.budget').find('.edit')).on('click', function () {
                            var customid = $(this).attr('data-customid');
                            var url = config.WebService()["updatePrice"];
                            var userPrice = $($(this).prev()).val().replace(/[^0-9-.]/g, '');

                            Requst.ajaxPost(url, {
                                "price": parseFloat(userPrice),
                                "wCustomid": customid,
                                "type": "userPrice"
                            }, true, function (data) {
                                if (data.code == 200) {
                                    top.Message.show("提示", data.message, MsgState.Success, 2000, function () {
                                        details.getData("base");
                                    });
                                }
                                else {
                                    top.Message.show("提示", data.message, MsgState.Fail, 2000, function () {
                                        details.getData("base");
                                    });
                                }
                            });
                        });

                        $(money.find('.design-fee')).hover(function () {
                            $($(this).find('i')).removeClass('hide');
                        }, function () {
                            $($(this).find('i')).addClass('hide');
                        });

                        // 编辑报价
                        $(money.find('.quoted').find('.edit')).on('click', function () {
                            var customid = $(this).attr('data-customid');
                            var url = config.WebService()["custom_Quotation"];
                            var prePrice = $($(this).prev()).val().replace(/[^0-9-.]/g, '');
                            Requst.ajaxGet(url, {
                                "prePrice": parseFloat(prePrice),
                                "customid": customid
                            }, true, function (data) {
                                if (data.code == 200) {
                                    top.Message.show("提示", data.message, MsgState.Success, 2000, function () {
                                        details.getData("base");
                                    });
                                }
                                else {
                                    top.Message.show("提示", data.message, MsgState.Fail, 2000, function () {
                                        details.getData("base");
                                    });
                                }
                            });
                        });

                        var moneyDom = $('.money');
                        moneyDom.html('');
                        moneyDom.append(money);
                    }

                    addMoney();
                    inputCheck();


                    //是否急单
                    var orderUrgencyDays = parseInt(top.SysParam.sysParam['order_urgency_days'].value);
                    if (dataDetail.userPeriod <= orderUrgencyDays) {
                        $(".emer").removeClass('hide');
                    }

                    //续订
                    if (dataDetail.isContinueOrder == 1) {
                        $(".renew").removeClass('hide');
                    }


                    var payStatus = item.inquiryStatus == 4 ? "" : "未支付";
                    //状态
                    function addStatus() {
                        var status = $('.orderstatus');
                        status.html("");
                        if (SysParam.inquiryStatus[item.inquiryStatus]) {
                            status.append($('<p>' + SysParam.inquiryStatus[item.inquiryStatus].servicerTag + '</p>'));
                        }
                        if (SysParam.designStatus[item.designStatus]) {
                            status.append($('<p>' + SysParam.designStatus[item.designStatus].servicerTag + '</p>'));
                        }
                        if (SysParam.produceStatus[item.produceStatus]) {
                            status.append($('<p>' + SysParam.produceStatus[item.produceStatus].servicerTag + '</p>'));
                        }
                        if (payStatus) {
                            status.append($('<p>' + payStatus + '</p>'));
                        }
                    }

                    addStatus();
                    var itemHead_r = $('.item-head-right');
                    itemHead_r.html('');

                    var check = $('<span data-customid="' + item.customid + '">核对订单</span>');
                    check.on('click', function () {
                        var customid = $(this).attr('data-customid');
                        var scrollH = top.Helper.getClientHeight();
                        var popH = scrollH - 100 > 680 ? 680 : scrollH - 100;
                        top.Popup.open("核对订单", 818, popH, "./Pop-ups/checkOrder.html?customid=" + customid);
                    });
                    itemHead_r.append(check);

                    var invoice = $('<span data-customid="' + dataDetail.customid + '">发票/收据</span>');
                    invoice.on('click', function () {
                        var customid = $(this).attr('data-customid');
                        var scrollH = top.Helper.getClientHeight();
                        var popH = scrollH - 100 > 680 ? 680 : scrollH - 100;
                        top.Popup.open("发票/收据", 818, popH, "./Pop-ups/invoice.html?customid=" + customid);
                    });
                    itemHead_r.append(invoice);

                    var box = $('<span data-customid="' + dataDetail.customid + '">产品包装</span>');
                    box.on('click', function () {
                        var customid = $(this).attr('data-customid');
                        var scrollH = top.Helper.getClientHeight();
                        var popH = scrollH - 100 > 510 ? 510 : scrollH - 100;
                        top.Popup.open("产品包装", 545, popH, "./Pop-ups/box.html?orderid=" + orderid + "&customid=" + customid);
                    });
                    itemHead_r.append(box);


                    //addHead();
                    //添加更多按钮
                    function addMore() {
                        // //更多操作列表
                        var moreList = $('<div class="operlist" style="display: none;"><i class="arrow"></i></div>');
                        // //发票收据
                        // var moreItem_1 = $('<span data-customid="' + item.customid + '">发票/收据</span>');
                        // moreItem_1.on('click', function () {
                        //     var customid = $(this).attr('data-customid');
                        //     var scrollH = top.Helper.getClientHeight();
                        //     var popH = scrollH - 100 > 680 ? 680 : scrollH - 100;
                        //     top.Popup.open("发票/收据", 818, popH, "./Pop-ups/invoice.html?customid=" + customid);
                        // });
                        // moreList.append(moreItem_1);
                        //
                        // var moreItem_2 = $('<span data-orderid="' + item.orderid + '" data-ordersummaryId="' + item.id + '" data-customid="' + item.customid + '">产品包装</span>');
                        // moreItem_2.on('click', function () {
                        //     var orderid = $(this).attr('data-orderid');
                        //     var customid = $(this).attr('data-customid');
                        //     var scrollH = top.Helper.getClientHeight();
                        //     var popH = scrollH - 100 > 510 ? 510 : scrollH - 100;
                        //     top.Popup.open("产品包装", 545, popH, "./Pop-ups/box.html?orderid=" + orderid + "&customid=" + customid);
                        // });
                        // moreList.append(moreItem_2);

                        // var moreItem_3 = $('<span>订单备注</span>');
                        // moreItem_3.on('click', function () {
                        //     alert('弹出订单备注');
                        // });
                        // moreList.append(moreItem_3);

                        // 删除订单
                        // var moreItem_4 = $('<span data-customid="' + item.customid + '" style="border-bottom: none;">删除订单</span>');
                        // moreItem_4.on('click', function () {
                        //     var customid = $(this).attr('data-customid');
                        //     Confirm("删除订单", "您确定要删除该订单吗？", 423, 203, null, function () {
                        //         var url = config.WebService()['orderSummaryInfo_Update'];
                        //         top.Requst.ajaxPost(url, {"customid": customid}, true, function (data) {
                        //             if (data.code == 200) {
                        //                 top.Message.show("提示", data.message, MsgState.Success, 2000, function () {
                        //                     classMain.loadOverview();
                        //                 });
                        //             }
                        //             else {
                        //                 top.Message.show("提示", data.message, MsgState.Warning, 3000, null, {
                        //                     "width": 435,
                        //                     "height": 75
                        //                 });
                        //             }
                        //         });
                        //     });
                        // });
                        //moreList.append(moreItem_4);

                        var more = $('<span title="更多操作"><!--<i class="more-icon"></i>--></span>');
                        // more.on('click', function (e) {
                        //     $('.operlist').slideUp();
                        //     var dropList = $($(this).find('.operlist'));
                        //     dropList.slideDown('fast');
                        //     $(document).click(function () {
                        //         dropList.slideUp('fast');
                        //     });
                        //     //点击后自动关闭下拉
                        //     $(dropList.find('span')).click(function (e) {
                        //         dropList.slideUp('fast');
                        //         e.stopPropagation();
                        //     });
                        //     e.stopPropagation();
                        // });
                        // more.append(moreList);
                        $(".item-head-right").append(more);
                    }

                    addMore();


                    function operating() {
                        var operating = $('.operation');
                        operating.html("");
                        var command = item.command.split(',');
                        // 发起询价
                        if (command.indexOf("INQUIRY") >= 0) {
                            var btn = $('<button class="btn" data-orderid="' + item.orderid + '" data-ordersummaryId="' + item.id + '" data-customid="' + item.customid + '" style="width: 66px; height: 23px;">发起询价</button>');
                            btn.on('click', function () {
                                var customid = $(this).attr('data-customid');
                                OPER.sendInquiry(customid);//发起询价
                            });
                            operating.append(btn);
                        }

                        //分配设计
                        if (command.indexOf("SEND_DESIGN") >= 0) {
                            var btn = $('<button class="btn" data-orderid="' + item.orderid + '" data-ordersummaryId="' + item.id + '" data-customid="' + item.customid + '" style="width: 66px; height: 23px;">分配设计</button>');
                            btn.on('click', function () {
                                var customid = $(this).attr('data-customid');
                                var orderid = $(this).attr('data-orderid');
                                var ordersummaryId = $(this).attr('data-ordersummaryId');
                                var designPrice = item.designPrice;
                                OPER.distributionDesign(ordersummaryId, orderid, customid, designPrice);
                            });
                            operating.append(btn);
                        }
                        //定价
                        if (command.indexOf("PRICE") >= 0) {
                            var btn = $('<button data-inquiryStatus="' + item.inquiryStatus + '" data-userPeriod="' + item.userPeriod + '" data-prePrice="' + parseFloat(item.prePrice).formatMoney(2, "", ",", ".") + '" data-currentPeriod="' + item.currentPeriod + '" data-currentPrice="' + parseFloat(item.currentPrice).formatMoney(2, "", ",", ".") + '" class="btn" data-orderid="' + item.orderid + '" data-ordersummaryId="' + item.id + '" data-customid="' + item.customid + '" style="width: 66px; height: 23px;">定价</button>');
                            btn.on('click', function () {
                                var customid = $(this).attr('data-customid');
                                var dataUserPeriod = $(this).attr('data-userPeriod');//客户要求工期
                                var currentPeriod = $(this).attr('data-currentPeriod');//当前车间工期
                                var currentPrice = $(this).attr('data-currentPrice');//当前车间报价
                                var quotePrice = $(this).attr('data-prePrice');//客服报价
                                var inquiryStatus = $(this).attr('data-inquiryStatus');//询价状态
                                if (parseInt(inquiryStatus) == 4) {
                                    Confirm("注意", "订单已经支付，确定要重新定价？", 423, 235, null, function () {
                                        OPER.pricing(customid, currentPeriod, currentPrice, quotePrice, dataUserPeriod, inquiryStatus);
                                    });
                                }
                                else {
                                    OPER.pricing(customid, currentPeriod, currentPrice, quotePrice, dataUserPeriod, inquiryStatus);
                                }
                            });
                            operating.append(btn);
                        }
                        //确认支付
                        if (command.indexOf("PAYOFF") >= 0) {
                            var btn = $('<button data-inquiryStatus="' + item.inquiryStatus + '" data-finalPrice="' + parseFloat(item.finalPrice).formatMoney(2, "", ",", ".") + '" data-prePrice="' + parseFloat(item.prePrice).formatMoney(2, "", ",", ".") + '" data-currentPeriod="' + item.currentPeriod + '" data-currentPrice="' + parseFloat(item.currentPrice).formatMoney(2, "", ",", ".") + '" class="btn" data-orderid="' + item.orderid + '" data-ordersummaryId="' + item.id + '" data-customid="' + item.customid + '" style="width: 66px; height: 23px;">订单支付</button>');
                            btn.on('click', function () {
                                var customid = $(this).attr('data-customid');
                                var finalPrice = $(this).attr('data-finalPrice');//定价金额
                                OPER.orderPrice(customid, finalPrice);
                            });
                            operating.append(btn);
                        }
                        //分配生产
                        if (command.indexOf("SEND_PRODUCE") >= 0) {
                            var btn = $('<button data-inquiryStatus="' + item.inquiryStatus + '" data-finalPrice="' + parseFloat(item.finalPrice).formatMoney(2, "", ",", ".") + '" data-prePrice="' + parseFloat(item.prePrice).formatMoney(2, "", ",", ".") + '" data-currentPeriod="' + item.currentPeriod + '" data-currentPrice="' + parseFloat(item.currentPrice).formatMoney(2, "", ",", ".") + '" class="btn" data-orderid="' + item.orderid + '" data-ordersummaryId="' + item.id + '" data-customid="' + item.customid + '" style="width: 66px; height: 23px;">分配生产</button>');
                            btn.on('click', function () {
                                var customid = $(this).attr('data-customid');
                                OPER.distributionProduction(customid);
                            });
                            operating.append(btn);
                        }
                        //查看物流
                        if (item.produceStatus == 4) {
                            var btn = $('<button class="btn" data-orderid="' + item.orderid + '" data-ordersummaryId="' + item.id + '" data-customid="' + item.customid + '" style="width: 66px; height: 23px;">查看物流</button>');
                            btn.on('click', function () {
                                var customid = $(this).attr('data-customid');
                                var orderId = $(this).attr('data-orderid');
                                window.open("./Pop-ups/logisticsInfo.html?customid=" + customid + "&orderid=" + orderId);
                            });
                            operating.append(btn);
                        }

                        //查看成品
                        if (item.smallFinishedProductsImage1 || item.smallFinishedProductsImage2 || item.smallFinishedProductsImage3) {
                            var btn = $('<button class="btn" data-orderid="' + item.orderid + '" data-ordersummaryId="' + item.id + '" data-customid="' + item.customid + '" style="width: 66px; height: 23px;">查看成品</button>');
                            btn.on('click', function () {
                                var customid = $(this).attr('data-customid');
                                OPER.productPicture(customid, 'prev');
                            });
                            operating.append(btn);
                        }

                        //确认收货
                        if (item.produceStatus == 4) {
                            var btn = $('<button class="btn" data-orderid="' + item.orderid + '" data-ordersummaryId="' + item.id + '" data-customid="' + item.customid + '" style="width: 66px; height: 23px;">确认收货</button>');
                            btn.on('click', function () {
                                var customid = $(this).attr('data-customid');
                                var url = config.WebService()["orderLogisticsStatus_Update"];
                                top.Requst.ajaxPost(url, {"customid": customid}, true, function (data) {
                                    if (data.code == 200) {
                                        top.Message.show("提示", data.message, MsgState.Success, 2000);
                                        if (top.classMain.loadOverview) {
                                            top.classMain.loadOverview(null, null, null, customid);
                                        }
                                    }
                                    else {
                                        top.Message.show("提示", data.message, MsgState.Warning, 2000);
                                    }
                                })
                            });
                            operating.append(btn);
                        }
                    }

                    operating();

                }
                // 订单基础信息+++++++++++++++++++++++++++++++++++++ end +++++++++++++++++++++++++++++++++++++++++++++++++

                //设计与生产相关
                if (operType == null) {
                    textArea.init('.design-rema', 300, dataDetail.designMemo, '请输入订单设计要求，请留意：备注不允许出现产品价格，参数和旺旺等\n' +
                        '各种联系方式', '');
                    textArea.init('.offer-rema', 300, dataDetail.produceMemo, '请输入生产参考要求，请留意：备注不允许出现产品价格，参数和旺旺等\n' +
                        '各种联系方式', '');

                    //收货地址
                    details.saveAddress(dataDetail.name, dataDetail.mobilephone, dataDetail.postcode, dataDetail.province, dataDetail.city, dataDetail.county, dataDetail.detailAddress);

                    var srcArry = {//图片附件回显
                        details: function () {
                            var srcArray = [];//参考图
                            for (var i = 1; i <= 3; i++) {
                                if (dataDetail['smallReferenceImage' + i]) {
                                    var orgSrc = dataDetail['middleReferenceImage' + i];
                                    orgSrc = orgSrc.indexOf('http:') >= 0 ? orgSrc : "http://" + orgSrc;
                                    var thumbnail = dataDetail['smallReferenceImage' + i];
                                    thumbnail = thumbnail.indexOf('http:') >= 0 ? thumbnail : "http://" + thumbnail;
                                    srcArray.push({"orgSrc": orgSrc, "thumbnail": thumbnail});
                                }
                            }
                            return srcArray
                        },
                        srcArryProd: function () {
                            var srcArray = [];//生产参考图
                            if (data.data.middleProducerefImage) {
                                var orgSrc = dataDetail['middleProducerefImage'];
                                orgSrc = orgSrc.indexOf('http:') >= 0 ? orgSrc : "http://" + orgSrc;
                                var thumbnail = dataDetail['smallProducerefImage'];
                                thumbnail = thumbnail.indexOf('http:') >= 0 ? thumbnail : "http://" + thumbnail;
                                srcArray.push({"orgSrc": orgSrc, "thumbnail": thumbnail});
                            }
                            return srcArray
                        },
                        accessoryFile: function () {
                            var accessoryArray = [];//设计附件
                            if (data.data.accessoryFile) {
                                var accessoryFile = dataDetail['accessoryFile'];
                                accessoryFile = accessoryFile.indexOf('http:') >= 0 ? accessoryFile : "http://" + accessoryFile;
                                accessoryArray.push({
                                    "uri": accessoryFile,
                                    "name": customid,
                                });
                            }
                            return accessoryArray
                        }
                    }

                    uploadfile.uploadPhoto('details_diagram', 3, srcArry.details());//设计图回显
                    uploadfile.uploadPhoto('prod_refe', 1, srcArry.srcArryProd());//生产参考图回显
                    uploadfile.uploadFile('details_encl', 1, srcArry.accessoryFile(), true, "", "", true)//设计附件回显
                }

                //是否显示设计留言区域
                if (operType == null) {
                    if (dataDetail.designStatus == 2 || dataDetail.designStatus == 3 || dataDetail.designStatus == 4 || dataDetail.designStatus == 5) {
                        if (dataDetail.designInfo.length >= 1) {
                            that.orderid = dataDetail.designInfo[0].orderid;//订单id

                            that.ordersummaryId = dataDetail.designInfo[0].ordersummaryId;//订单表id
                            that.version = dataDetail.designInfo[0].version;//设计方案版本号
                        }

                        $(".design-man").removeClass('hide');
                        $(".interaction").removeClass('hide');
                        details.leavShow();
                        $("#orderTime").text(dataDetail.designtime);
                    }
                }

                //设计方案
                if ( operType == null || operType=="designDraft") {
                    if (data.data.designInfo.length > 0) {
                        $('.interaction .oper').removeClass('hide');//设计稿选定与修正
                        $(".for-design-box").html('');
                        //经理修正设计
                        if (parseInt(top.Helper.Cache.get('roleType')) == 4) {
                            $('.interaction .modify').removeClass('hide');
                        }

                        for (var i = 0; i < dataDetail.designInfo.length; i++) {
                            var commit_time = dataDetail.designInfo[i].commitTime.replace(/\-/g, "/");
                            commit_time=new Date(commit_time);
                            commit_time=commit_time.Format("yyyy-MM-dd hh:mm:ss");
                            var design_memo = dataDetail.designInfo[i].designMemo || "";
                            var srcMan = [];//设计稿版本图片
                            var srcFile = [];//设计稿版本附件
                            var otherFile = [];//设计稿版本其他附件
                            var remaMan = [];//设计稿版本备注图片

                            if (dataDetail.designInfo[i].initialDesignImage1) {
                                srcMan.push({
                                    "orgSrc": 'http://' + dataDetail.designInfo[i].initialDesignImage1,
                                    "thumbnail": 'http://' + dataDetail.designInfo[i].smallDesignImage1,
                                });
                            }
                            if (data.data.designInfo[i].designFile) {
                                srcFile.push({
                                    "uri": 'http://' + data.data.designInfo[i].designFile,
                                    "name": customid,
                                });
                            }
                            if (data.data.designInfo[i].otherFile) {
                                otherFile.push({
                                    "uri": 'http://' + data.data.designInfo[i].otherFile,
                                    "name": customid,
                                });
                            }
                            if (data.data.designInfo[i].middleRemarkImage1) {
                                remaMan.push({
                                    "orgSrc": 'http://' + data.data.designInfo[i].middleRemarkImage1,
                                    "thumbnail": 'http://' + data.data.designInfo[i].smallRemarkImage1,
                                });

                                remaMan.push({
                                    "orgSrc": 'http://' + data.data.designInfo[i].middleRemarkImage2,
                                    "thumbnail": 'http://' + data.data.designInfo[i].smallRemarkImage2,
                                });

                                remaMan.push({
                                    "orgSrc": 'http://' + data.data.designInfo[i].middleRemarkImage3,
                                    "thumbnail": 'http://' + data.data.designInfo[i].smallRemarkImage3,
                                });

                            }
                            if(i==1) //历史版本 画线
                            {
                                var line=$("<div class='history-line fl'><span class='left  fl'></span> <span class='title  fl'> 查看历史版本 </span> <span class='right  fl'></span></div>");
                                $(".for-design-box").append(line);
                            }
                            var designDraft = $("<div class='for-design'>" +
                                "<div class='design-next-title'>" +
                                "<h3>版本" +
                                "<span>" + dataDetail.designInfo[i].version + "</span>" +
                                "</h3>" +
                                "<hr style='height:1px;border:none;border-top:2px solid #f5f5f5;display: inline-block;width: 842px;'>" +
                                "</div>" +
                                "<div class='design-bg hide'>" +
                                "</div>" +
                                "<div class='design-content'>" +
                                "<div class='edit-left'>" +
                                "<div class='planner'>方案师</div>" +
                                "<div class='time-status'>" +
                                "<span></span>" +
                                "<a>" + commit_time + "</a>" + '更新' +
                                "</div>" +
                                "<div class='desi-box'>" +
                                "<span class='list-1'>设计稿：</span>" +
                                "<div id='edit_desi_" + i + "' data-type='' data-customid='" + customid + "'></div>" +
                                "</div>" +
                                "<div class='desi-encl-box'>" +
                                "<span class='list-1'>设计附件：</span>" +
                                "<div id='desi_encl_" + i + "' data-type='' data-customid='" + customid + "'></div>" +
                                "</div>" +
                                "<div class='other-encl-box'>" +
                                "<span class='list-1'>其它附件：</span>" +
                                "<div id='other_encl_" + i + "' data-type=''></div>" +
                                "</div>" +
                                "<div class='planner-leav'>" +
                                "<div class='planner-leav-content'>" +
                                "<span class='list-1'>方案师留言：</span>" +
                                "<div class='planner-leav-text'>" + design_memo + "</div>" +
                                "<div id='planner_leav_" + i + "' class='planner-leav-last' data-type='' data-customid='" + customid + "'></div>" +
                                "</div>" +
                                "</div>" +
                                "</div>" +
                                "<div class='edit-right-button'>" +
                                "<span class='hide'>修正设计稿</span>" +
                                "<button data-index='"+dataDetail.designInfo[i].id+"' class='EditButton btn-h'>选定设计方案</button>" +
                                "</div>" +
                                "</div>" +
                                "</div>");
                            $(".for-design-box").append(designDraft);

                            uploadfile.uploadPhoto('edit_desi_' + i, 1, srcMan,false);//设计稿版本图片
                            uploadfile.uploadFile('desi_encl_' + i, 1, srcFile, false, "", "", true);//设计稿版本附件回显
                            uploadfile.uploadFile('other_encl_' + i, 1, otherFile, false, "", "", true);//设计稿版本其他附件回显
                            uploadfile.uploadPhoto('planner_leav_' + i, 3, remaMan, false);//设计稿版本留言图片

                            //方案已选定
                            if(dataDetail.designInfo[i].status==3)
                            {
                                $(designDraft.find('.design-bg')).removeClass('hide');
                                $(designDraft.find('.EditButton')).addClass("btn-gray");
                            }
                            else
                            {
                                $(designDraft.find('.EditButton')).on('click', function () {
                                    var index=$(this).attr("data-index");
                                    details.desiLeavBtn(index);
                                });
                            }
                        }
                    }
                }
            }
            $(".container").removeClass('hide');
        });
    },
    btnModify: function () {
        //设计+生产提交修改
        var url = config.WebService()["orderSummaryInfoAccessory_Update"];
        data = {
            "designMemo": $(".design-rema textarea").val(),//设计备注
            "produceMemo": $(".offer-rema .textarea textarea").val(),//生产要求
            "wCustomid": customid,
        }
        //上传附件
        var accessoryFile = $("#details_encl .accessory-container .fileitem");
        if (accessoryFile.length && accessoryFile.length > 0) {
            if (typeof $(accessoryFile[0]).attr('data-complete') != "undefined" && $(accessoryFile[0]).attr('data-complete') != "complete") {
                Message.show('提醒', "设计相关正在上传请等待...", MsgState.Fail, 2000);
                return;
            }

            accessoryFile = $(accessoryFile[0]).attr('data-url').replace("http://", "");
            data["accessoryFile"] = accessoryFile;
        }

        // 生产参考图
        var prod_refe = $("#prod_refe .diagram-container .diagram");
        if (prod_refe.length && prod_refe.length > 0) {
            if (typeof $(prod_refe[0]).attr('data-complete') != "undefined" && $(prod_refe[0]).attr('data-complete') != "complete") {
                Message.show('提醒', "生产参考图正在上传请等待...", MsgState.Fail, 2000);
                return;
            }

            data["initialProducerefImage"] = $(prod_refe[0]).attr("data-mimageurl").replace("http://", "");
            data["smallProducerefImage"] = $(prod_refe[0]).attr("data-simageurl").replace("http://", "");
            data["middleProducerefImage"] = $(prod_refe[0]).attr("data-mimageurl").replace("http://", "");
        }

        //参考图
        var diagramArray = $("#details_diagram .diagram-container .diagram");
        for (var i = 0; i < diagramArray.length; i++) {// 添加设计图片

            if (typeof $(diagramArray[i]).attr('data-complete') != "undefined" && $(diagramArray[i]).attr('data-complete') != "complete") {
                Message.show('提醒', "参考图正在上传请等待...", MsgState.Fail, 2000);
                return;
            }

            data['initialReferenceImage' + (i + 1)] = $(diagramArray[i]).attr('data-mimageurl').replace("http://", "");

            data['middleReferenceImage' + (i + 1)] = $(diagramArray[i]).attr('data-mimageurl').replace("http://", "");

            data['smallReferenceImage' + (i + 1)] = $(diagramArray[i]).attr('data-simageurl').replace("http://", "");
            
        }

        Requst.ajaxPost(url, data, true, function (data) {
            if (data.code == 200) {
                Message.show('提示信息', data.message, MsgState.Success, 2000);
            }
            else {
                Message.show('提示信息', data.message, MsgState.Warning, 2000);
            }
        });

    },
    leavShow: function () {
        //留言区域
        var url = config.WebService()["orderDesignMessage_Query"];
        Requst.ajaxGet(url, {"customid": customid}, true, function (data) {
            if (data.data && data.data.length > 0) {
                $("#interaction_ver").text(data.data[0].version);//版本号沟通中

                $('.leav-box .leav-content').html('');//清空留言区域

                for (var i = 0; i < data.data.length; i++) {
                    var srcMan = [];//留言显示图片
                    var messageFile = [];//留言显示附件
                    if (data.data[i].initialMessageImage1) {
                        var orgSrc = data.data[i].middleMessageImage1;
                        orgSrc = orgSrc.indexOf('http:') >= 0 ? orgSrc : "http://" + orgSrc;
                        var thumbnail = data.data[i].smallMessageImage1;
                        thumbnail = thumbnail.indexOf('http:') >= 0 ? thumbnail : "http://" + thumbnail;
                        srcMan.push({"orgSrc": orgSrc, "thumbnail": thumbnail});
                    }
                    if (data.data[i].messageFile) {
                        var accessoryFile = data.data[i].messageFile;
                        accessoryFile = accessoryFile.indexOf('http:') >= 0 ? accessoryFile : "http://" + accessoryFile;
                        messageFile.push({
                            "uri": accessoryFile,
                            "name": customid,
                        });
                    }

                    var plan = "<div class='leav-reg'>" +
                        "<div class='leav-reg-title'>" +
                        "<span class='line'></span>" +
                        "<span class='txt'>版本" + "<a class='txt-num'>" + data.data[i].version + "</a>" + "</span>" +
                        "<span class='line'></span>" +
                        "</div>" +
                        "<div class='leav-text-first'>" +
                        "<div class='TextList-left'>" +
                        "<span>我</span>回复" +
                        "<a>方案师</a>：" +
                        "</div>" +
                        "<div class='TextList-right'>" +
                        "<span>" + data.data[i].leaveTime + "</span>" +
                        "</div>" +
                        "</div>" +
                        "<div class='leav-text-second'>" + data.data[i].messageContent + "</div>" +
                        "<div class='leav-reg-img'>" +
                        "<div id='leav_img_" + i + "' data-type='reference_image' data-customid='" + customid + "'>" +
                        "</div>" +
                        "</div>" +
                        "<div class='leav-reg-file'>" +
                        "<div id='leav_file_" + i + "' data-type='' data-customid='" + customid + "'>" +
                        "</div>" +
                        "</div>" +
                        "</div>";

                    $(".leav-content").append(plan);
                    uploadfile.uploadPhoto('leav_img_' + i, 1, srcMan, false);//留言显示图片
                    uploadfile.uploadFile('leav_file_' + i, 1, messageFile, false, "", "", true);//留言附件回显
                }

            }
        }, null, true);
    },
    leavBtn: function () { //提交留言
        debugger

        //最新的一张设计稿
        var newDesign=dataDetail.designInfo && dataDetail.designInfo.length>0?dataDetail.designInfo[dataDetail.designInfo.length-1]:{"id":0,"version":1};

        var data = {
            "customid": dataDetail.customid,
            "orderid":dataDetail.orderid,
            "designPatternId": newDesign.id,
            "ordersummaryId": dataDetail.id,
            "version": newDesign.version,
            "messageContent": $.trim($(".leav-bottom-input input").val()),
            "needReDesign": $(".check_box #male").is(':checked')?1:0
        }

        //附件
        var messageFile= $("#leav_bottom_file .accessory-container .fileitem");
        if (messageFile && messageFile.length>0) {
            if (typeof $(messageFile[0]).attr('data-complete') != "undefined" && $(messageFile[0]).attr('data-complete') != "complete") {
                Message.show('提醒', "留言附件正在上传请等待...", MsgState.Fail, 2000);
                return;
            }
            messageFile = $(messageFile[0]).attr('data-url').indexOf('http:') >= 0 ? $(messageFile[0]).attr('data-url') : "http://" + $(messageFile[0]).attr('data-url');
            data["messageFile"]=messageFile;
        }

        //图片
        var diagram = $("#leav_bottom_img .diagram-container .diagram");
        for (var i = 0; i < diagram.length; i++) {// 添加设计图片

            if (typeof $(diagram[i]).attr('data-complete') != "undefined" && $(diagram[i]).attr('data-complete') != "complete") {
                Message.show('提醒', "留言图片正在上传请等待...", MsgState.Fail, 2000);
                return;
            }

            data['initialMessageImage' + (i + 1)] = diagram[i].getAttribute('data-oimageurl');
            data['middleMessageImage' + (i + 1)] = diagram[i].getAttribute('data-mimageurl');
            data['smallMessageImage' + (i + 1)] = diagram[i].getAttribute('data-simageurl');
        }

        var url = config.WebService()["orderDesignMessage_Insert"];
        Requst.ajaxPost(url, data, true, function (data) {

            details.leavShow();

        });
    },
    desiLeavBtn: function (index) {//选定设计方案
        var that=this;
        var url = config.WebService()["chooseDesign"];
        Requst.ajaxPost(url, { "wId": parseInt(index), "customId": customid }, true, function (data) {
            if (data.code == 200) {
                top.Message.show('提示信息', data.message, MsgState.Success, 2000);
                that.getData("designDraft");
            }
        });
    },

}

//复制操作
$(function () {
    //复制收货地址
    function address() {
        var clipboard = new ClipboardJS('.copy');
        clipboard.on('success', function (e) {
            e.clearSelection();
        });
    }

    address();

});

