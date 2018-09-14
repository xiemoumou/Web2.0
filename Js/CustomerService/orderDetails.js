/**
 * Created by liyuanpeng on 2018/8/19.
 */

var customid = Helper.getUrlParam('customid') || "";//获取订单号

$(function () {

    $(".Edit").on('click', function () {//添加编辑弹窗
        var scrollH = top.Helper.getClientHeight();
        var popH = scrollH - 100 > 410 ? 410 : scrollH - 100;
        top.Popup.open("产品生产参数编辑", 900, popH, "./CustomerService/createOrder.html?operType=edit&customid=" + customid);
    })


    $(".address-add").on('click', function () {//添加地址弹窗
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
    textArea.init('.offer-rema', 300, '', '请输入订单设计要求，请留意：备注不允许出现产品价格，参数和旺旺等\n' +
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
        var url = encodeURI('../Pop-ups/addAddress.html?name=' + orderInfo.shippingAddress.name + '&mobilephone=' + orderInfo.shippingAddress.mobilephone + '&postcode=' + orderInfo.shippingAddress.postcode + '&province=' + orderInfo.shippingAddress.province + '&city=' + orderInfo.shippingAddress.city + '&county=' + orderInfo.shippingAddress.county + '&address=' + orderInfo.shippingAddress.address + '&customid=' + customid)
        var scrollH = document.documentElement.scrollHeight - 20;
        if (scrollH > 380) {
            scrollH = 380;
        }
        Popup.open('添加收货地址', 480, scrollH, url);
        details.saveAddress();
    },
    edit: function () {
        var url = encodeURI('../Pop-ups/adjustDesi.html');
        Popup.open('订单定价', 423, 286, url);
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
        orderInfo.shippingAddress.name = name;
        orderInfo.shippingAddress.mobilephone = mobilephone;
        orderInfo.shippingAddress.province = province;
        orderInfo.shippingAddress.postcode = postcode;
        orderInfo.shippingAddress.city = city;
        orderInfo.shippingAddress.county = county;
        orderInfo.shippingAddress.address = address;
        //orderInfo.shippingAddress.customid = customid;
        details.initAddress();//初始化收件地址
    },
    initAddress: function () {
        $(".cont").html(orderInfo.shippingAddress.name);
        $(".zip-code").html(orderInfo.shippingAddress.postcode);
        $(".detailed").html(orderInfo.shippingAddress.address);
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

                if (localStorage.getItem('SysParam'))//从缓存获取字典
                {
                    try {
                        SysParam = JSON.parse(localStorage.getItem('SysParam'));
                    }
                    catch (e) {

                    }
                }







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
                var deadline = data.data.deadline || "";//要求工期
                var designPrice = data.data.designPrice || "";//设计费
                var introducePrice = data.data.introducePrice || "";//设计引导费
                var userPrice = data.data.userPrice || "";//预算
                var prePrice = data.data.prePrice || "";//报价
                var designMemo = data.data.designMemo || "";//设计备注
                var produceMemo = data.data.produceMemo || "";//生产备注
                var currentPrice = data.data.currentPrice || "";//参考价格
                var currentPeriod = data.data.currentPeriod || "";//参考工期
                var orderid = data.data.orderid || "";//订单ID
                that.id = data.data.id;//设计方案表id
                if (data.data.designInfo.length>=1) {
                    that.orderid = data.data.designInfo[0].orderid;//订单id

                    that.ordersummaryId = data.data.designInfo[0].ordersummaryId;//订单表id
                    that.version = data.data.designInfo[0].version;//设计方案版本号
                }

                if (top.SysParam.inquiryStatus[data.data.inquiryStatus]) {
                    debugger
                    $(".orderComp").text(top.SysParam.inquiryStatus[data.data.inquiryStatus].servicerTag);
                }
                if (top.SysParam.designStatus[data.data.designStatus].designerTag) {
                    $(".orderStat").text(top.SysParam.designStatus[data.data.designStatus]);
                }
                if (top.SysParam.produceStatus[data.data.produceStatus].workshopTag) {
                    $(".orderNew").text(top.SysParam.produceStatus[data.data.produceStatus]);
                }


                var item = data.data;

                function operating() {
                    debugger
                    var operating = $('.operation');
                    //未报价
                    if ((item.inquiryStatus == 1 || item.inquiryStatus == 2) && item.lastQuote == 0) {
                        var btn = $('<button class="btn" data-lastQuote="' + item.lastQuote + '" style="width: 66px; height: 23px;" data-inquiryRound="' + item.inquiryRound + '" data-orderid="' + item.orderid + '" data-ordersummaryId="' + item.id + '" data-customid="' + item.customid + '">报价</button>');
                        btn.on('click', function () {
                            var customid = $(this).attr('data-customid');
                            var orderid = $(this).attr('data-orderid');
                            var ordersummaryId = $(this).attr('data-ordersummaryId');
                            var inquiryRound = $(this).attr('data-inquiryRound');//询价轮次
                            var lastQuote = $(this).attr("data-lastQuote");//上次报价
                            top.Popup.open("报价", 423, 266, "./Pop-ups/orderOffer.html?customid=" + customid + "&inquiryRound=" + inquiryRound + "&lastQuote=" + lastQuote);
                        });
                        operating.append(btn);
                    }
                    //重新报价
                    if (item.inquiryStatus == 2 && item.lastQuote > 0) {
                        var btn = $('<button class="btn" data-lastQuote="' + item.lastQuote + '" style="width: 66px; height: 23px;" data-inquiryRound="' + item.inquiryRound + '" data-orderid="' + item.orderid + '" data-ordersummaryId="' + item.id + '" data-customid="' + item.customid + '">重新报价</button>');
                        btn.on('click', function () {
                            var customid = $(this).attr('data-customid');
                            var orderid = $(this).attr('data-orderid');
                            var ordersummaryId = $(this).attr('data-ordersummaryId');
                            var inquiryRound = $(this).attr('data-inquiryRound');//询价轮次
                            var lastQuote = $(this).attr("data-lastQuote");//上次报价

                            top.Popup.open("重新报价", 423, 266, "./Pop-ups/orderOffer.html?customid=" + customid + "&inquiryRound=" + inquiryRound + "&lastQuote=" + lastQuote);

                        });
                        operating.append(btn);
                    }
                    //处理议价
                    if (item.inquiryStatus == 5 || (item.inquiryStatus == 6 && item.lastQuote == 0)) {
                        var btn = $('<button class="btn" style="width: 66px; height: 23px;" data-userPeriod="' + item.workshopUserPeriod + '" data-basePrice="' + item.workshopBasePrice + '" data-orderid="' + item.orderid + '" data-ordersummaryId="' + item.id + '" data-customid="' + item.customid + '">处理议价</button>');
                        btn.on('click', function () {
                            var customid = $(this).attr('data-customid');
                            var orderid = $(this).attr('data-orderid');
                            var ordersummaryId = $(this).attr('data-ordersummaryId');
                            var userPeriod = $(this).attr("data-userPeriod");//客户期望工期
                            var basePrice = $(this).attr("data-basePrice");//客户低价

                            top.Popup.open("处理议价", 423, 266, "./Pop-ups/handBarg.html?customid=" + customid + "&userPeriod=" + userPeriod + "&basePrice=" + basePrice);

                        });
                        operating.append(btn);
                    }
                    //接受生产
                    if (item.produceStatus == 2) {
                        var btn = $('<button class="btn" style="width: 66px; height: 23px;" data-orderid="' + item.orderid + '" data-ordersummaryId="' + item.id + '" data-customid="' + item.customid + '">接受生产</button>');
                        btn.on('click', function () {
                            var customid = $(this).attr('data-customid');
                            var orderid = $(this).attr('data-orderid');
                            var ordersummaryId = $(this).attr('data-ordersummaryId');

                            var url = config.WebService()["orderProductInfoAccept_Update"];
                            top.Requst.ajaxPost(url, {"customid": customid}, true, function (data) {
                                if (data.code == 200) {
                                    top.Message.show("提示", data.message, MsgState.Success, 2000, function () {
                                        top.classMain.loadOverview(null, null, null, customid);
                                    });
                                }
                                else {
                                    top.Message.show("提示", data.message, MsgState.Warning, 2000);
                                }
                            });
                        });
                        operating.append(btn);
                    }
                    //发货
                    if (item.produceStatus == 3) {
                        var btn = $('<button class="btn" style="width: 66px; height: 23px;" data-orderid="' + item.orderid + '" data-ordersummaryId="' + item.id + '" data-customid="' + item.customid + '">发货</button>');
                        btn.on('click', function () {
                            var customid = $(this).attr('data-customid');
                            var orderid = $(this).attr('data-orderid');
                            var ordersummaryId = $(this).attr('data-ordersummaryId');
                            top.Popup.open("发货", 423, 230, "./Pop-ups/uploadLogist.html?customid=" + customid);
                        });
                        operating.append(btn);
                    }

                    //查看物流
                    if (item.produceStatus == 4) {
                        var btn = $('<button class="btn" style="width: 66px; height: 23px;" data-orderid="' + item.orderid + '" data-ordersummaryId="' + item.id + '" data-customid="' + item.customid + '">查看物流</button>');
                        btn.on('click', function () {
                            var customid = $(this).attr('data-customid');
                            var orderid = $(this).attr('data-orderid');
                            var ordersummaryId = $(this).attr('data-ordersummaryId');
                            window.open("./Pop-ups/logisticsInfo.html?customid=" + customid + "&orderid=" + orderid);
                        });
                        operating.append(btn);
                    }

                    //上传成品图
                    if (item.produceStatus == 3 || item.produceStatus == 4) {

                        if (item.smallFinishedProductsImage1 || item.smallFinishedProductsImage2 || item.smallFinishedProductsImage3) {
                            var btn = $('<button class="btn" style="width: 66px; height: 23px;" data-orderid="' + item.orderid + '" data-ordersummaryId="' + item.id + '" data-customid="' + item.customid + '">编辑成品图</button>');
                            btn.on('click', function () {
                                var customid = $(this).attr('data-customid');
                                var orderid = $(this).attr('data-orderid');
                                var ordersummaryId = $(this).attr('data-ordersummaryId');
                                OPER.productPicture(customid, 'edit');
                            });
                            operating.append(btn);
                        }
                        else {
                            var btn = $('<button class="btn" style="width: 66px; height: 23px;" data-orderid="' + item.orderid + '" data-ordersummaryId="' + item.id + '" data-customid="' + item.customid + '">上传成品图</button>');
                            btn.on('click', function () {
                                var customid = $(this).attr('data-customid');
                                var orderid = $(this).attr('data-orderid');
                                var ordersummaryId = $(this).attr('data-ordersummaryId');
                                OPER.productPicture(customid, 'edit', "上传成品图");
                            });
                            operating.append(btn);
                        }

                    }

                    //itemBody.append(operating);
                }

                operating();

                //5要素
                var element = SysParam.element;//元素
                var model = ConvertIdToName(element.model, item.model).join(';');
                var technology = ConvertIdToName(element.technology, item.technology).join(';');
                var color = ConvertIdToName(element.color, item.color).join(';');



                var payStatus = data.data.inquiryStatus == 4 ? "" : "未支付";
                if (payStatus) {
                    $(".orderNewNext").text(payStatus);
                }

                $(".time-num").text(createTime);//订单创建时间
                $(".orderNum").text(orderid);//订单号
                $(".orderWw").text(customerWang);//旺旺号
                $(".orderCust").text(shop);//客源
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
                $(".limit").text(deadline);//工期
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


                if (deadline <= 5) {//急单
                    $(".emer").removeClass('hide');
                } else {
                    $(".emer").addClass('hide');
                }

                if (data.data.designstatus >= 2) {
                    $(".design-man").removeClass('hide');
                    $(".edit-right").removeClass('hide');
                }else{
                    $(".design-man").addClass('hide');
                    $(".edit-right").addClass('hide');
                }


                for (var i = 0; i < data.data.designInfo.length; i++) {
                    // var commit_time = data.data.designInfo[i].commitTime || "";
                    //var design_memo = data.data.designInfo[i].designMemo || "";
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
                            "orgSrc": data.data.designInfo[i].initialDesignImage1,
                            "thumbnail": data.data.designInfo[i].smallDesignImage1,
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
                    if (data.data.designInfo[i].initialRemarkImage1) {
                        remaMan.push({
                            "orgSrc": data.data.designInfo[i].middleDesignImage1,
                            "thumbnail": data.data.designInfo[i].smallDesignImage1,
                        });

                        remaMan.push({
                            "orgSrc": data.data.designInfo[i].middleDesignImage2,
                            "thumbnail": data.data.designInfo[i].smallDesignImage2,
                        });

                        remaMan.push({
                            "orgSrc": data.data.designInfo[i].middleDesignImage3,
                            "thumbnail": data.data.designInfo[i].smallDesignImage3,
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
                        "<span>修正设计稿</span>" +
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
                uploadfile.uploadFile('details_encl', 1, srcArry.accessoryFile(), true)//设计附件回显


            }
        });
    },
    btnModify: function () {//设计提交修改
        var url = config.WebService()["orderSummaryInfoAccessory_Update"];
        data = {
            "initialProducerefImage": $("#prod_refe .diagram-container .diagram").attr("data-mimageurl"),//生产参考图原图
            "smallProducerefImage": $("#prod_refe .diagram-container .diagram").attr("data-simageurl"),//生产参考图小
            "middleProducerefImage": $("#prod_refe .diagram-container .diagram").attr("data-mimageurl"),//生产参考图中
            "accessoryFile": $("#details_encl .accessory-container .fileitem").attr('http://' + "data-url")||"",//上传附件
            "designMemo": $(".design-rema textarea").text(),//设计备注
            "produceMemo": $(".offer-rema .textarea textarea").text(),//生产要求
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
            debugger
            data['initialReferenceImage' + (i + 1)] = diagramArray[i].getAttribute('data-mimageurl');
            data['middleReferenceImage' + (i + 1)] = diagramArray[i].getAttribute('data-mimageurl');
            data['smallReferenceImage' + (i + 1)] = diagramArray[i].getAttribute('data-simageurl');
        }

        Requst.ajaxPost(url, data, true, function (data) {

        });

    },
    serverBtn: function () {//客服报价
        var url = config.WebService()["custom_Quotation"];
        var server = $(".quote-text input").val();
        data = {
            "customid": 2051777045010001,
            "prePrice": server,
        }
        if (!(server)) {
            Message.show('提示消息', '报价金额不能为空', 3);
            return false
        }
        Requst.ajaxGet(url, data, true, function (data) {

        });

    },
    userValen: function () {//用户心理预算

        var url = config.WebService()["updatePrice"];
        var money = $(".budget-text input").val();
        data = {
            "wCustomid": 2051777045010001,
            "price": money,
            "type": 'payPrice',
        }
        if (!(money)) {
            Message.show('提示消息', '预算金额不能为空', 3);
            return false
        }
        Requst.ajaxPost(url, data, true, function (data) {

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
            debugger
            if (data.data.length>0) {
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
        console.log(check_box);
        console.log(data);


        Requst.ajaxPost(url, data, true, function (data) {

            details.leavShow();

        });
    },
    desiLeavBtn: function () {//选定设计方案
        var url = config.WebService()["chooseDesign"];

        data = {
            "wId": this.id,
        }

        Requst.ajaxPost(url, data, true, function (data) {

        });
    }


}


