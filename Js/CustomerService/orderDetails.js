/**
 * Created by liyuanpeng on 2018/8/19.
 */

var customid = Helper.getUrlParam('customid') || "";//获取订单号
var dataDetail=null;
$(function () {

    $(".Edit").on('click', function () {//添加编辑弹窗
        var scrollH = top.Helper.getClientHeight();
        var popH = scrollH - 100 > 410 ? 410 : scrollH - 100;
        top.Popup.open("产品生产参数编辑", 900, popH, "./CustomerService/createOrder.html?operType=edit&customid=" + customid);
    })


    $(".address-add,.modify-addr").on('click', function () {//添加地址弹窗
        details.openress();
    });

    $(".edit").on('click', function () {//编辑设计费
        details.edit();
    })

    $(".deails-btn,.offer-btn").on('click', function () {//提交修改
        details.btnModify();
    });

    $(".server-btn").on('click', function () {//客服报价
        details.serverBtn();
    });

    $(".budget-btn").on('click', function () {//用户心理预算
        details.userValen();
    });

    $(".leav-btn .btn").on('click', function () {//回复留言
        details.leavBtn();
    });

    details.detailsDetdata();//请求详情

    details.editDetails();

    //粘贴复制
    var contbox = $(".cont-box").text();
    var cont = $(".cont").text();
    var phonebox = $('.phone-box').text();
    var phone = $(".phone").text();
    var zipcodebox = $(".zip-code-box").text();
    var zipcode = $(".zip-code").text();
    var areabox = $(".area-box").text();
    var area = $(".area").text();
    var detailedbox = $(".detailed-box").text();
    var detailed = $(".detailed").text();

    var Copy = contbox + cont + '\n' + phonebox + phone + '\n' + zipcodebox + zipcode + '\n' + areabox + area + '\n' + detailedbox + detailed;

    // Helper.CopyToClipboard(Copy,'copy');


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


    textArea.init('.design-rema', 300, '', '请输入订单设计要求，请留意：备注不允许出现产品价格，参数和旺旺等\n' +
        '各种联系方式', '');
    textArea.init('.offer-rema', 300, '', '请输入生产参考要求，请留意：备注不允许出现产品价格，参数和旺旺等\n' +
        '各种联系方式', '');

    details.leavShow();



});

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


var details = {
    openress: function () {//添加地址弹窗

        var url = encodeURI('../Pop-ups/addAddress.html?name=' + orderInfo.shippingAddress.name + '&mobilephone=' + orderInfo.shippingAddress.mobilephone + '&postcode=' + orderInfo.shippingAddress.postcode + '&province=' + orderInfo.shippingAddress.province + '&city=' + orderInfo.shippingAddress.city + '&county=' + orderInfo.shippingAddress.county + '&address=' + orderInfo.shippingAddress.address + '&customid=' + customid +'&operType=detail')
        var scrollH = document.documentElement.scrollHeight - 20;
        if (scrollH > 380) {
            scrollH = 380;
        }
        Popup.open('添加收货地址', 480, scrollH, url);
        //details.saveAddress();
    },
    edit: function () {
        // 编辑设计费
        top.Popup.open("调整设计费",423,286,"./Pop-ups/adjustDesi.html?customid="+dataDetail.customid+"&introduceprice="+dataDetail.introduceprice+"&designPrice="+dataDetail.designPrice);
    },
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
    saveAddress: function (name, mobilephone, postcode, province, city, county, address) {//保存收获地址
        orderInfo.shippingAddress.name = name ||"";
        orderInfo.shippingAddress.mobilephone = mobilephone||"";
        orderInfo.shippingAddress.province = province||"";
        orderInfo.shippingAddress.postcode = postcode||"";
        orderInfo.shippingAddress.city = city||"";
        orderInfo.shippingAddress.county = county||"";
        orderInfo.shippingAddress.address = address||"";
        //orderInfo.shippingAddress.customid = customid;
        details.initAddress();//初始化收件地址
    },
    initAddress: function () {
        $(".cont").html(orderInfo.shippingAddress.name);
        $(".zip-code").html(orderInfo.shippingAddress.postcode);
        $(".detailed").val(orderInfo.shippingAddress.address);
        $(".phone").html(orderInfo.shippingAddress.mobilephone);
        $(".area").html(orderInfo.shippingAddress.province + orderInfo.shippingAddress.city + orderInfo.shippingAddress.county);
        if (orderInfo.shippingAddress.name) {
            $('.address-empty').addClass('hide');
            $('.address-text-box').removeClass('hide');
            // layer.closeAll();
        }
    },
    detailsDetdata: function () {//请求接口
        var that = this;
        data = {
            "customId": customid,
        }

        var url = config.WebService()["orderSummaryInfo_Query"];
        Requst.ajaxGet(url, data, true, function (data) {
            if (data.data) {
                dataDetail=data.data;
                debugger
                if (localStorage.getItem('SysParam'))//从缓存获取字典
                {
                    try {
                        SysParam = JSON.parse(localStorage.getItem('SysParam'));
                    }
                    catch (e) {

                    }
                }

                if (data.data.name) {
                    $('.address-empty').addClass('hide');
                    $('.address-text-box').removeClass('hide');
                    $('.modify-addr').removeClass('hide');
                    // layer.closeAll();
                }

                // var province = data.data.province;
                // var
                $(".cont").text(data.data.name||"");
                $(".phone").text(data.data.mobilephone||"");
                $(".zip-code").text(data.data.postcode||"");
                $(".area").text(data.data.province+data.data.city+data.data.county||"");
                $(".detailed").text(data.data.detailAddress||"");


                var createTime = data.data.createTime || "";//订单创建时间
                var customerWang = data.data.customerWang || "";//旺旺号
                var shop = data.data.shop || "";//客源
                var initialGoodsImage = 'http://' + data.data.initialGoodsImage || "";//原始产品图中图
                //属性
                var goodsClass = data.data.goodsClass || "";//产品类别
                var material = data.data.material || "";//产品材质
                var accessories = data.data.accessories || "";//配件

                //工艺
                //var model = data.data.model || "";//开模
                //var technology = data.data.technology || "";//生产工艺
                //var color = data.data.color || "";//电镀色

                var number = data.data.number || "";//数量
                var length = data.data.length || "";//长
                var width = data.data.width || "";//宽
                var height = data.data.height || "";//高
                var userPeriod = data.data.userPeriod || "--";//要求工期
                var designPrice = data.data.designPrice || "";//设计费
                var introducePrice = data.data.introducePrice || "--";//设计引导费
                var userPrice = data.data.userPrice || "0.00";//预算
                var prePrice = data.data.prePrice || "0.00";//报价
                var designMemo = data.data.designMemo || "";//设计备注
                var produceMemo = data.data.produceMemo || "";//生产备注
                var currentPrice = data.data.currentPrice || "";//参考价格
                var currentPeriod = data.data.currentPeriod || "--";//参考工期
                var orderid = data.data.orderid || "";//订单ID
                that.id = data.data.id;//订单表id
                if (data.data.designInfo.length>=1) {
                    that.orderid = data.data.designInfo[0].orderid;//订单id

                    that.ordersummaryId = data.data.designInfo[0].ordersummaryId;//订单表id
                    that.version = data.data.designInfo[0].version;//设计方案版本号
                }


                if (top.SysParam.inquiryStatus[data.data.inquiryStatus]) {

                    $(".orderComp").text(top.SysParam.inquiryStatus[data.data.inquiryStatus].servicerTag);
                }
                if (top.SysParam.designStatus[data.data.designStatus]) {

                    $(".orderStat").text(top.SysParam.designStatus[data.data.designStatus].designerTag);
                }
                if (top.SysParam.produceStatus[data.data.produceStatus]) {

                    $(".orderNew").text(top.SysParam.produceStatus[data.data.produceStatus].workshopTag);
                }


                // var itemHead = $('<div class="item-head"></div>');
                // // itemDiv.append(itemHead);
                // // itemDiv.append(itemHead);
                // var itemHead_l = $('<div class="item-head-left fl"></div>');
                // itemHead.append(itemHead_l);
                // var itemHead_r = $('<div class="item-head-right fr"></div>');
                // itemHead.append(itemHead_r);

                var item=data.data;

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
                $(".limit").text(userPeriod);//工期
                $(".offer-money").text(designPrice);//设计费
                $(".offertime").text(introducePrice);//设计引导费
                $(".budget-text input").val(userPrice);//预算
                $(".quote-text input").val(prePrice);//报价
                $(".details-rema-box .design-rema textarea").text(designMemo);//设计备注
                $(".offer-rema textarea").text(produceMemo);//生产要求
                $(".quot-num").text(currentPrice);//参考价格
                $(".quot-day").text(currentPeriod);//参考工期


                //if (data.data.name){
                orderInfo.shippingAddress.name = data.data.name;//收货人姓名
                orderInfo.shippingAddress.mobilephone = data.data.mobilephone;//收货联系电话
                orderInfo.shippingAddress.postcode = data.data.postcode;//邮编
                orderInfo.shippingAddress.province = data.data.province;//省
                orderInfo.shippingAddress.city = data.data.city;//市
                orderInfo.shippingAddress.county = data.data.county;//县
                orderInfo.shippingAddress.address = data.data.detail_address;//详细地址
                //}


                if (userPeriod <= 5) {//急单
                    $(".emer").removeClass('hide');
                } else {
                    $(".emer").addClass('hide');
                }


                if (data.data.designStatus >= 2) {
                    $(".design-man").removeClass('hide');
                    $(".edit-right").removeClass('hide');
                }else{
                    $(".design-man").addClass('hide');
                    $(".edit-right").addClass('hide');
                }

                debugger
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
                    if(payStatus)
                    {
                        status.append($('<p>' + payStatus + '</p>'));
                    }
                }
                addStatus();
                var itemHead_r = $('<div class="item-head-right fr"></div>');

                var check = $('<span data-customid="' + item.customid + '">核对订单</span>');
                debugger
                check.on('click', function () {
                    var customid = $(this).attr('data-customid');
                    var scrollH = top.Helper.getClientHeight();
                    var popH = scrollH - 100 > 680 ? 680 : scrollH - 100;
                    top.Popup.open("核对订单",818,popH,"./Pop-ups/checkOrder.html?customid="+customid);
                });
                itemHead_r.append(check);

                //addHead();
                //添加更多按钮
                function addMore() {
                    //更多操作列表
                    var moreList = $('<div class="operlist" style="display: none;"><i class="arrow"></i></div>');
                    //发票收据
                    var moreItem_1 = $('<span data-customid="'+item.customid+'">发票/收据</span>');
                    moreItem_1.on('click', function () {
                        var customid = $(this).attr('data-customid');
                        var scrollH = top.Helper.getClientHeight();
                        var popH = scrollH - 100 > 680 ? 680 : scrollH - 100;
                        top.Popup.open("发票/收据",818,popH,"./Pop-ups/invoice.html?customid="+customid);
                    });
                    moreList.append(moreItem_1);

                    var moreItem_2 = $('<span data-orderid="' + item.orderid + '" data-ordersummaryId="' + item.id + '" data-customid="' + item.customid + '">产品包装</span>');
                    moreItem_2.on('click', function () {
                        var orderid = $(this).attr('data-orderid');
                        var customid=$(this).attr('data-customid');
                        var scrollH = top.Helper.getClientHeight();
                        var popH = scrollH - 100 > 510 ? 510 : scrollH - 100;
                        top.Popup.open("产品包装",545, popH,"./Pop-ups/box.html?orderid="+orderid+"&customid="+customid);
                    });
                    moreList.append(moreItem_2);

                    // var moreItem_3 = $('<span>订单备注</span>');
                    // moreItem_3.on('click', function () {
                    //     alert('弹出订单备注');
                    // });
                    // moreList.append(moreItem_3);

                    // 删除订单
                    var moreItem_4 = $('<span data-customid="'+item.customid+'" style="border-bottom: none;">删除订单</span>');
                    moreItem_4.on('click', function () {
                        var customid = $(this).attr('data-customid');
                        Confirm("删除订单","您确定要删除该订单吗？",423,203,null,function () {
                            var url=config.WebService()['orderSummaryInfo_Update'];
                            top.Requst.ajaxPost(url,{"customid":customid},true,function (data) {
                                if(data.code==200)
                                {
                                    top.Message.show("提示",data.message,MsgState.Success,2000,function () {
                                        classMain.loadOverview();
                                    });
                                }
                                else
                                {
                                    top.Message.show("提示",data.message,MsgState.Warning,3000,null,{"width":435,"height":75});
                                }
                            });
                        });
                    });
                    //moreList.append(moreItem_4);

                    var more = $('<span title="更多操作"><i class="more-icon"></i></span>');
                    more.on('click', function (e) {
                        $('.operlist').slideUp();
                        var dropList = $($(this).find('.operlist'));
                        dropList.slideDown('fast');
                        $(document).click(function () {
                            dropList.slideUp('fast');
                        });
                        //点击后自动关闭下拉
                        $(dropList.find('span')).click(function (e) {
                            dropList.slideUp('fast');
                            e.stopPropagation();
                        });
                        e.stopPropagation();
                    });
                    more.append(moreList);
                    $(".item-head-right").html("");
                    $(".item-head-right").append(more);
                }

                addMore();


                function operating() {
                    var operating = $('.operation');
                        operating.html("");
                    var command=item.command.split(',');
                    // 发起询价
                    if (command.indexOf("INQUIRY")>=0) {
                        var btn=$('<button class="btn" data-orderid="' + item.orderid + '" data-ordersummaryId="' + item.id + '" data-customid="' + item.customid + '" style="width: 66px; height: 23px;">发起询价</button>');
                        btn.on('click',function () {
                            var customid = $(this).attr('data-customid');
                            OPER.sendInquiry(customid);//发起询价
                        });
                        operating.append(btn);
                    }
                    //分配设计
                    if (command.indexOf("SEND_DESIGN")>=0) {
                        var btn=$('<button class="btn" data-orderid="' + item.orderid + '" data-ordersummaryId="' + item.id + '" data-customid="' + item.customid + '" style="width: 66px; height: 23px;">分配设计</button>');
                        btn.on('click',function () {
                            var customid = $(this).attr('data-customid');
                            var orderid = $(this).attr('data-orderid');
                            var ordersummaryId = $(this).attr('data-ordersummaryId');
                            var designPrice= $($(this).parent().parent()).find('.amount').find('.design-fee').find('span').eq(0).find('em');
                            OPER.distributionDesign(ordersummaryId,orderid,customid,$(designPrice).text());
                        });
                        operating.append(btn);
                    }
                    //定价
                    if (command.indexOf("PRICE")>=0) {
                        var btn=$('<button data-inquiryStatus="'+item.inquiryStatus+'" data-userPeriod="'+item.userPeriod+'" data-prePrice="'+parseFloat(item.prePrice).formatMoney(2, "", ",", ".")+'" data-currentPeriod="'+item.currentPeriod+'" data-currentPrice="'+parseFloat(item.currentPrice).formatMoney(2, "", ",", ".")+'" class="btn" data-orderid="' + item.orderid + '" data-ordersummaryId="' + item.id + '" data-customid="' + item.customid + '" style="width: 66px; height: 23px;">定价</button>');
                        btn.on('click',function () {
                            var customid = $(this).attr('data-customid');
                            var dataUserPeriod = $(this).attr('data-userPeriod');//客户要求工期
                            var currentPeriod = $(this).attr('data-currentPeriod');//当前车间工期
                            var currentPrice = $(this).attr('data-currentPrice');//当前车间报价
                            var quotePrice= $(this).attr('data-prePrice');//客服报价
                            var inquiryStatus= $(this).attr('data-inquiryStatus');//询价状态
                            if(parseInt(inquiryStatus)==4)
                            {
                                Confirm("注意","订单已经支付，确定要重新定价？",423,235,null,function () {
                                    OPER.pricing(customid,currentPeriod,currentPrice,quotePrice,dataUserPeriod,inquiryStatus);
                                });
                            }
                            else
                            {
                                OPER.pricing(customid,currentPeriod,currentPrice,quotePrice,dataUserPeriod,inquiryStatus);
                            }
                        });
                        operating.append(btn);
                    }
                    //确认支付
                    if (command.indexOf("PAYOFF")>=0) {
                        var btn=$('<button data-inquiryStatus="'+item.inquiryStatus+'" data-finalPrice="'+parseFloat(item.finalPrice).formatMoney(2, "", ",", ".")+'" data-prePrice="'+parseFloat(item.prePrice).formatMoney(2, "", ",", ".")+'" data-currentPeriod="'+item.currentPeriod+'" data-currentPrice="'+parseFloat(item.currentPrice).formatMoney(2, "", ",", ".")+'" class="btn" data-orderid="' + item.orderid + '" data-ordersummaryId="' + item.id + '" data-customid="' + item.customid + '" style="width: 66px; height: 23px;">订单支付</button>');
                        btn.on('click',function () {
                            var customid = $(this).attr('data-customid');
                            var finalPrice = $(this).attr('data-finalPrice');//定价金额
                            OPER.orderPrice(customid,finalPrice);
                        });
                        operating.append(btn);
                    }
                    //分配生产
                    if (command.indexOf("SEND_PRODUCE")>=0) {
                        var btn=$('<button data-inquiryStatus="'+item.inquiryStatus+'" data-finalPrice="'+parseFloat(item.finalPrice).formatMoney(2, "", ",", ".")+'" data-prePrice="'+parseFloat(item.prePrice).formatMoney(2, "", ",", ".")+'" data-currentPeriod="'+item.currentPeriod+'" data-currentPrice="'+parseFloat(item.currentPrice).formatMoney(2, "", ",", ".")+'" class="btn" data-orderid="' + item.orderid + '" data-ordersummaryId="' + item.id + '" data-customid="' + item.customid + '" style="width: 66px; height: 23px;">分配生产</button>');
                        btn.on('click',function () {
                            var customid = $(this).attr('data-customid');
                            OPER.distributionProduction(customid);
                        });
                        operating.append(btn);
                    }
                    //查看物流
                    if (item.produceStatus==4) {
                        var btn=$('<button class="btn" data-orderid="' + item.orderid + '" data-ordersummaryId="' + item.id + '" data-customid="' + item.customid + '" style="width: 66px; height: 23px;">查看物流</button>');
                        btn.on('click',function () {
                            var customid = $(this).attr('data-customid');
                            var orderId=$(this).attr('data-orderid');
                            window.open("./Pop-ups/logisticsInfo.html?customid="+customid+"&orderid="+orderId);
                        });
                        operating.append(btn);
                    }

                    //查看成品
                    if (item.smallFinishedProductsImage1||item.smallFinishedProductsImage2||item.smallFinishedProductsImage3) {
                        var btn=$('<button class="btn" data-orderid="' + item.orderid + '" data-ordersummaryId="' + item.id + '" data-customid="' + item.customid + '" style="width: 66px; height: 23px;">查看成品</button>');
                        btn.on('click',function () {
                            var customid = $(this).attr('data-customid');
                            OPER.productPicture(customid,'prev');
                        });
                        operating.append(btn);
                    }

                    //确认收货
                    if (item.produceStatus==4) {
                        var btn=$('<button class="btn" data-orderid="' + item.orderid + '" data-ordersummaryId="' + item.id + '" data-customid="' + item.customid + '" style="width: 66px; height: 23px;">确认收货</button>');
                        btn.on('click',function () {
                            var customid = $(this).attr('data-customid');
                            var url=config.WebService()["orderLogisticsStatus_Update"];
                            top.Requst.ajaxPost(url,{"customid":customid},true,function (data) {
                                if(data.code==200)
                                {
                                    top.Message.show("提示", data.message, MsgState.Success, 2000);
                                    if (top.classMain.loadOverview) {
                                        top.classMain.loadOverview(null, null, null, customid);
                                    }
                                }
                                else{
                                    top.Message.show("提示", data.message, MsgState.Warning, 2000);
                                }
                            })
                        });
                        operating.append(btn);
                    }
                }

                operating();

                for (var i = 0; i < data.data.designInfo.length; i++) {
                     var commit_time = data.data.designInfo[i].commitTime || "";
                     var design_memo = data.data.designInfo[i].designMemo || "";
                    var srcMan = [];//设计稿版本图片
                    var srcFile = [];//设计稿版本附件
                    var otherFile = [];//设计稿版本其他附件
                    var remaMan = [];//设计稿版本备注图片
                    // if (data.data.designInfo[i].status==3){//判断是否显示设计稿留言
                    //     $(".design-bg").removeClass('hide');
                    //     $(".EditButton").attr('disabled',"true").addClass('bg_color');
                    //
                    // }
                    if (data.data.designInfo[i].initialDesignImage1) {
                        srcMan.push({
                            "orgSrc": 'http://'+data.data.designInfo[i].initialDesignImage1,
                            "thumbnail": 'http://'+data.data.designInfo[i].smallDesignImage1,
                        });

                    }
                    if (data.data.designInfo[i].designFile) {
                        srcFile.push({
                            "uri": 'http://' + data.data.designInfo[i].designFile,
                            "name": data.data.designInfo[i].designFile,
                        });
                    }
                    if (data.data.designInfo[i].otherFile) {
                        otherFile.push({
                            "uri": 'http://' + data.data.designInfo[i].otherFile,
                            "name": data.data.designInfo[i].otherFile,
                        });
                    }
                    if (data.data.designInfo[i].middleRemarkImage1) {
                        remaMan.push({
                            "orgSrc": 'http://'+data.data.designInfo[i].middleRemarkImage1,
                            "thumbnail": 'http://'+data.data.designInfo[i].smallRemarkImage1,
                        });

                        remaMan.push({
                            "orgSrc": 'http://'+data.data.designInfo[i].middleRemarkImage2,
                            "thumbnail": 'http://'+data.data.designInfo[i].smallRemarkImage2,
                        });

                        remaMan.push({
                            "orgSrc": 'http://'+data.data.designInfo[i].middleRemarkImage3,
                            "thumbnail": 'http://'+data.data.designInfo[i].smallRemarkImage3,
                        });

                    }

                    var str = "<div class='for-design'>" +
                        "<div class='design-next-title'>" +
                        "<h3>版本" +
                        "<span>" + data.data.designInfo[i].version + "</span>" +
                        "</h3>" +
                        "<hr style='height:1px;border:none;border-top:2px solid #f5f5f5;display: inline-block;width: 827px;'>" +
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
                        "<button class='EditButton'>选定设计方案</button>" +
                        "</div>" +
                        "</div>" +
                        "</div>"

                    $(".for-design-box").append(str);
                    uploadfile.uploadPhoto('edit_desi_' + i, 1, srcMan, true);//设计稿版本图片
                    uploadfile.uploadFile('desi_encl_' + i, 1, srcFile, false, "", "", true);//设计稿版本附件回显
                    uploadfile.uploadFile('other_encl_' + i, 1, otherFile, false, "", "", true);//设计稿版本其他附件回显
                    uploadfile.uploadPhoto('planner_leav_' + i, 3, remaMan, false);//设计稿版本留言图片
                    $(".edit-right-button .EditButton").on('click', function () {
                        details.desiLeavBtn();
                    })
                }


                var srcArry = {//图片附件回显
                    details: function (srcArray) {
                        debugger
                        srcArray = [];//设计图
                        for (var i = 1; i <= 3; i++) {
                            if (data.data['initialReferenceImage' + i]) {
                                srcArray.push({
                                    "orgSrc": 'http://' + data.data['initialReferenceImage' + i],
                                    "thumbnail": 'http://' + data.data['smallReferenceImage' + i]
                                });

                            }

                        }
                        return srcArray
                    },
                    srcArryProd: function (srcArray) {
                        srcArray = [];//生产参考图
                        if (data.data.initialGoodsImage) {
                            srcArray.push({
                                "orgSrc": 'http://' + data.data['initialGoodsImage'],
                                "thumbnail": 'http://' + data.data['middleGoodsImage']
                            });
                        }
                        return srcArray
                    },
                    accessoryFile: function (accessoryArray) {
                        accessoryArray = [];//设计附件
                        if (data.data.accessoryFile) {
                            accessoryArray.push({
                                "uri": 'http://' + data.data['accessoryFile'],
                                "name": data.data['accessoryFile'],
                            });
                        }
                        return accessoryArray
                    }
                }

                uploadfile.uploadPhoto('details_diagram', 3, srcArry.details());//设计图回显
                uploadfile.uploadPhoto('prod_refe', 1, srcArry.srcArryProd());//生产参考图回显
                uploadfile.uploadFile('details_encl', 1, srcArry.accessoryFile(), true ,"", "", true)//设计附件回显


            }
        });
    },
    btnModify: function () {//设计提交修改
        debugger
        var url = config.WebService()["orderSummaryInfoAccessory_Update"];
        data = {
            "initialProducerefImage": $("#prod_refe .diagram-container .diagram").attr("data-mimageurl"),//生产参考图原图
            "smallProducerefImage": $("#prod_refe .diagram-container .diagram").attr("data-simageurl"),//生产参考图小
            "middleProducerefImage": $("#prod_refe .diagram-container .diagram").attr("data-mimageurl"),//生产参考图中
            "accessoryFile": $("#details_encl .accessory-container .fileitem").attr("data-url")||"",//上传附件
            "designMemo": $(".design-rema textarea").val(),//设计备注
            "produceMemo": $(".offer-rema .textarea textarea").val(),//生产要求
            "wCustomid": customid,
            "initialReferenceImage1": '',
            "middleReferenceImage1": '',
            "smallReferenceImage1": '',
            "initialReferenceImage2": '',
            "middleReferenceImage2": '',
            "smallReferenceImage2": '',
            "initialReferenceImage3": '',
            "middleReferenceImage3": '',
            "smallReferenceImage3": '',
        }
        //console.log(data);
        var diagramArray = $("#details_diagram .diagram-container .diagram");
        for (var i = 0; i < diagramArray.length; i++) {// 添加设计图片
            data['initialReferenceImage' + (i + 1)] = diagramArray[i].getAttribute('data-mimageurl');
            data['middleReferenceImage' + (i + 1)] = diagramArray[i].getAttribute('data-mimageurl');
            data['smallReferenceImage' + (i + 1)] = diagramArray[i].getAttribute('data-simageurl');
        }

        Requst.ajaxPost(url, data, true, function (data) {
            if (data.code ==200){
                Message.show('提示信息',data.message,1,2000,function () {

                });
            } 

        });

    },
    serverBtn: function () {//客服报价
        var url = config.WebService()["custom_Quotation"];
        var server = $(".quote-text input").val().replace(/[^0-9-.]/g, '');
        data = {
            "customid": customid,
            "prePrice": server,
        }
        if (!(server)) {
            Message.show('提示消息', '报价金额不能为空', 3);
            return false
        }
        Requst.ajaxGet(url, data, true, function (data) {
            if (data.code==200){
                Message.show('提示信息',data.message,1,2000,function () {
                    details.detailsDetdata();
                });

            }

        });

    },
    userValen: function () {//用户心理预算

        var url = config.WebService()["updatePrice"];
        var money = $(".budget-text input").val().replace(/[^0-9-.]/g, '');
        data = {
            "wCustomid": customid,
            "price": money,
            "type": 'userPrice',
        }
        if (!(money)) {
            Message.show('提示消息', '预算金额不能为空', 3);
            return false
        }
        Requst.ajaxPost(url, data, true, function (data) {
            if (data.code==200){
                Message.show('提示消息', data.message, 1,2000,function () {
                    details.detailsDetdata();
                });
            }if (data.code==100002){
                Message.show('提示消息', data.message, 3,2000,function () {

                });
            }

        });

    },
    leavShow: function () {//显示留言
        var that = this;
        var url = config.WebService()["orderDesignMessage_Query"];
        data = {
            "customid": customid,
        }

        Requst.ajaxGet(url, data, true, function (data) {
            $(".leav-content").html('');//清空
            if (data.data && data.data.length>0) {
                that.messageNo = data.data[0].messageNo;
                that.targetId = data.data[0].targetId;//设计师Id
                $(".leav-title-right-text em").text(data.data[0].version);//版本号沟通中
                for (var i = 0; i < data.data.length; i++) {
                    var srcMan = [];//留言显示图片
                    var messageFile = [];//留言显示附件
                    if (data.data[i].initialMessageImage1) {
                        srcMan.push({
                            "orgSrc": 'http://' + data.data[i].middleMessageImage1,
                            "thumbnail": 'http://' + data.data[i].smallMessageImage1,
                        });

                    }
                    if (data.data[i].messageFile) {
                        messageFile.push({
                            "uri": 'http://' + data.data[i].messageFile,
                            "name": data.data[i].messageFile,
                        });
                    }

                    str = "<div class='leav-reg'>" +
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
                        "</div>"

                    $(".leav-content").append(str);
                    uploadfile.uploadPhoto('leav_img_' + i, 1, srcMan, false);//留言显示图片
                    uploadfile.uploadFile('leav_file_' + i, 1, messageFile, false, "", "", true);//留言附件回显
                }

            }


        });
    },
    leavBtn: function () { //提交留言

        var url = config.WebService()["orderDesignMessage_Insert"];

        var messageContent = $(".leav-bottom-input input").val();//留言内容
        var needReDesign = $("input[type='checkbox']").is(':checked');
            if (needReDesign){
                data.needReDesign = 1;
            }else{
                data.needReDesign = 0;
            }
        data = {
            "customid": customid,
            "orderid": this.orderid,
            "designPatternId": this.id,
            "ordersummaryId": this.id,
            "version": this.version,
            "messageNo": this.messageNo + 1,
            "targetId": this.targetId,
            "messageContent": messageContent,
            "messageFile": $("#leav_bottom_file .accessory-container .fileitem").attr("data-url"),
            "initialMessageImage1": '',
            "middleMessageImage1": '',
            "smallMessageImage1": '',
            "initialMessageImage2": '',
            "middleMessageImage2": '',
            "smallMessageImage2": '',
            "initialMessageImage3": '',
            "middleMessageImage3": '',
            "smallMessageImage3": '',
            "needReDesign": '',
        }

        var imgContainer = $("#leav_bottom_img .diagram-container").children();
        var imgleng = imgContainer.length;
        for (var i = 0; i < imgleng; i++) {// 添加设计图片
            data['initialMessageImage' + (i + 1)] = imgContainer[i].getAttribute('data-oimageurl');
            data['middleMessageImage' + (i + 1)] = imgContainer[i].getAttribute('data-mimageurl');
            data['smallMessageImage' + (i + 1)] = imgContainer[i].getAttribute('data-simageurl');
        }
        var check_box = $(".check_box #male").is(':checked');

        if (check_box) {
            data.needReDesign = 1;
        } else {
            data.needReDesign = 0;
        }


        Requst.ajaxPost(url, data, true, function (data) {

            details.leavShow();

        });
    },
    desiLeavBtn: function () {//选定设计方案
        var url = config.WebService()["chooseDesign"];
        debugger
        data = {
            "wId": dataDetail.designInfo[0].id,
            "customId": customid,
        }

        Requst.ajaxPost(url, data, true, function (data) {
            if (data.code ==200){
                top.Message.show('提示信息',data.message,MsgState.Success,2000);
            }

        });
    },

}

