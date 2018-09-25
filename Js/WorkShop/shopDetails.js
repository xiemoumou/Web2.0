var customid = Helper.getUrlParam('customid') || "";//获取订单号
//剩余发货时间
function shopCountdown() {
    var timeleft = $('.deliver b');
    for (var i = 0; i < timeleft.length; i++) {
        var domItem = timeleft.attr('data-deadlineTime');
        if (domItem && domItem != 'null') {
            var countdown = Helper.Date.countdown(domItem);
            $(timeleft.find('b')).text(countdown);
        }
    }
}

$(function () {
    details.getData();

    $(".draft-title-left").on('click', function () {
        details.Exportsing();
    });

    $("#details_diagram").attr("data-customid", customid);


    $("#details_encl").attr("data-customid", customid);
    $("#details_encl_next").attr("data-customid", customid);

    setInterval(function () {
        shopCountdown();
    }, 60000);

});


var details = {
    getData: function () {
        var url = config.WebService()["orderSummaryInfo_Query"];
        Requst.ajaxGet(url, {"customId": customid}, true, function (data) {
            if (data.code == 200) {
                var item = data.data;
                //5要素
                var element = top.SysParam.element;//元素
                var model = ConvertIdToName(element.model, item.model).join(';');
                var technology = ConvertIdToName(element.technology, item.technology).join(';');
                var color = ConvertIdToName(element.color, item.color).join(';');
                var producePrice = item.producePrice > 0 ? item.producePrice.formatMoney(2, "", ",", ".") : "-";

                $(".time-num").text(data.data.createTime);//订单创建时间
                $(".orderNum").text(data.data.orderid);//订单号
                $(".order-img img").attr('src', 'http://' + item.smallGoodsImage);//产品图
                $(".attr-1").text(top.SysParam.element.goodsClass[item.goodsClass].name);//属性 产品类别
                $(".attr-2").text(top.SysParam.element.material[item.material].name);//属性 产品材质
                $(".attr-3").text(top.SysParam.element.accessories[item.accessories].name);//属性 配件
                $(".tech-1").text(model);//工艺开模
                $(".tech-2").text(technology);//生产工艺
                $(".tech-3").text(color);//电镀色
                $(".ordNum").text(data.data.number);//数量
                $(".length").text(data.data.length);//长
                $(".width").text(data.data.width);//宽
                $(".height").text(data.data.height);//高
                $(".Money").text(producePrice);//生产费用
                $(".limit").text(data.data.userPeriod);//客服工期
                var lastQuote = item.lastQuote ? item.lastQuote.formatMoney(2, "", ",", ".") : "-";
                var lastPeriod = item.lastPeriod ? item.lastPeriod : "-";
                $(".offer-money").text(lastQuote);//上次报价
                $(".offertime").text(lastPeriod);//上次工期
                $(".quot-num").text(data.data.currentPrice);//参考价格
                $(".quot-day").text(data.data.currentPeriod);//参考工期

                if (item.lastPeriod > item.userPeriod) {
                    $(".order-img").append($("<i class='mark2'><s style='font-size: 12px; color:#ffffff; text-shadow: 1px 1px 1px rgba(174,64,16,0.50);'>超工期</s></i>"));
                }
                else if (item.inquiryStatus == 5 || item.inquiryStatus == 6) {
                    $(".order-img").append($("<i class='mark3'><s style='font-size: 12px; color:#ffffff; text-shadow: 1px 1px 1px rgba(24,38,111,0.50);'>议价中</s></i>"));
                }

                //是否急单
                var orderUrgencyDays = parseInt(top.SysParam.sysParam['order_urgency_days'].value);
                if (item.userPeriod <= orderUrgencyDays) {
                    $(".emer").removeClass('hide');
                }

                if (item.isContinueOrder == 1) {
                    $(".renew").removeClass('hide');
                }

                //剩余发货时间
                $(".deliver b").attr('data-deadlinetime', item.deadlineTime);
                var deadlineTime = item.deadlineTime;
                if (deadlineTime) {
                    deadlineTime = top.Helper.Date.countdown(deadlineTime);
                }
                else {
                    deadlineTime = "-  天  -  小时  -  分钟";
                }
                $(".deliver b").text(deadlineTime);
                shopCountdown();

                //状态
                function addStatus() {
                    $('.orderstatus').html('');
                    var status = $('<span>' + item.produceMessage + '</span>');
                    $('.orderstatus').append(status);
                }

                addStatus();

                //操作按钮
                function operating() {
                    var command = item.command.split(',');
                    var operating = $('.operation');
                    operating.html('');
                    //报价
                    if (command.indexOf("QUOTE") >= 0 && item.lastQuote == 0) {
                        var btn = $('<button class="btn" data-lastPeriod="' + item.lastPeriod + '" data-lastQuote="' + item.lastQuote + '" style="width: 76px; height: 23px;" data-inquiryRound="' + item.inquiryRound + '" data-orderid="' + item.orderid + '" data-ordersummaryId="' + item.id + '" data-customid="' + item.customid + '">报价</button>');
                        btn.on('click', function () {
                            var customid = $(this).attr('data-customid');
                            var orderid = $(this).attr('data-orderid');
                            var ordersummaryId = $(this).attr('data-ordersummaryId');
                            var inquiryRound = $(this).attr('data-inquiryRound');//询价轮次
                            var lastQuote = $(this).attr("data-lastQuote");//上次报价
                            var lastPeriod = $(this).attr("data-lastPeriod");//上次工期
                            top.Popup.open("报价", 423, 266, "./Pop-ups/orderOffer.html?customid=" + customid + "&inquiryRound=" + inquiryRound + "&lastQuote=" + lastQuote + "&lastPeriod=" + lastPeriod);
                        });
                        operating.append(btn);
                    }
                    //重新报价
                    if (command.indexOf("QUOTE") >= 0 && item.lastQuote > 0) {
                        var btn = $('<button class="btn" data-lastPeriod="' + item.lastPeriod + '"  data-lastQuote="' + item.lastQuote + '"  style="width: 76px; height: 23px;" data-inquiryRound="' + item.inquiryRound + '" data-orderid="' + item.orderid + '" data-ordersummaryId="' + item.id + '" data-customid="' + item.customid + '">重新报价</button>');
                        btn.on('click', function () {
                            var customid = $(this).attr('data-customid');
                            var orderid = $(this).attr('data-orderid');
                            var ordersummaryId = $(this).attr('data-ordersummaryId');
                            var inquiryRound = $(this).attr('data-inquiryRound');//询价轮次
                            var lastQuote = $(this).attr("data-lastQuote");//上次报价
                            var lastPeriod = $(this).attr("data-lastPeriod");//上次工期

                            top.Popup.open("重新报价", 423, 266, "./Pop-ups/orderOffer.html?customid=" + customid + "&inquiryRound=" + inquiryRound + "&lastQuote=" + lastQuote + "&lastPeriod=" + lastPeriod);

                        });
                        operating.append(btn);
                    }
                    //处理议价
                    if (command.indexOf("BARGIN_FEEDBACK") >= 0) {
                        var btn = $('<button class="btn" style="width: 76px; height: 23px;" data-userPeriod="' + item.workshopUserPeriod + '" data-basePrice="' + item.workshopBasePrice + '" data-orderid="' + item.orderid + '" data-ordersummaryId="' + item.id + '" data-customid="' + item.customid + '">处理议价</button>');
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
                    if (command.indexOf("ACCEPT_PRODUCE") >= 0) {
                        var btn = $('<button class="btn" style="width: 76px; height: 23px;" data-orderid="' + item.orderid + '" data-ordersummaryId="' + item.id + '" data-customid="' + item.customid + '">接受生产</button>');
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
                    if (command.indexOf("MAIL") >= 0) {
                        var btn = $('<button class="btn" style="width: 76px; height: 23px;" data-orderid="' + item.orderid + '" data-ordersummaryId="' + item.id + '" data-customid="' + item.customid + '">发货</button>');
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
                        var btn = $('<button class="btn" style="width: 76px; height: 23px;" data-orderid="' + item.orderid + '" data-ordersummaryId="' + item.id + '" data-customid="' + item.customid + '">查看物流</button>');
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
                            var btn = $('<button class="btn" style="width: 76px; height: 23px;" data-orderid="' + item.orderid + '" data-ordersummaryId="' + item.id + '" data-customid="' + item.customid + '">编辑成品图</button>');
                            btn.on('click', function () {
                                var customid = $(this).attr('data-customid');
                                var orderid = $(this).attr('data-orderid');
                                var ordersummaryId = $(this).attr('data-ordersummaryId');
                                OPER.productPicture(customid, 'edit');
                            });
                            operating.append(btn);
                        }
                        else {
                            var btn = $('<button class="btn" style="width: 76px; height: 23px;" data-orderid="' + item.orderid + '" data-ordersummaryId="' + item.id + '" data-customid="' + item.customid + '">上传成品图</button>');
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

                $(".dist-text").text(data.data.produceMemo=="" ? '暂无' : data.data.produceMemo);//生产要求


                //车间在没有接收生产之前，不能显示收货地址
                if (item.produceStatus == 3 || item.produceStatus == 4) {
                    $(".design-rema textarea").text(data.data.designMemo);//设计备注
                    $(".cont").text(data.data.name || "");//收货人姓名
                    $(".phone").text(data.data.mobilephone || "");//收货联系电话
                    $(".zip-code").text(data.data.postcode || "");//邮编
                    $(".area").text(data.data.province + data.data.city + data.data.county || "");//省市县
                    $(".detailed").text(data.data.detailAddress || "");//详细地址
                    $(".prod-text").text(data.data.produceMemo == '' ? '暂无' : true);//点详情显示生产要求

                    var copy_code = "联系人： " + data.data.name + "\r\n";
                    copy_code += "电话/手机： " + data.data.mobilephone + "\r\n";
                    copy_code += "邮编：" + data.data.postcode + "\r\n";
                    copy_code += "所在地区：" + data.data.province + data.data.city + data.data.county + "\r\n";
                    copy_code += "详细地址：" + data.data.detailAddress + "\r\n";
                    $("#copyContent").val(copy_code);

                    //复制收货地址
                    function addressCopy() {
                        var clipboard = new ClipboardJS('.copy');
                        clipboard.on('success', function (e) {
                            console.log("复制收货地址");
                            e.clearSelection();
                        });
                    }
                    addressCopy();

                    $(".dist-rece-address").removeClass("hide");
                    $(".desi-draft-requ").removeClass("hide");
                    $(".dist-prod").css("width", "500px");
                }
                else {
                    $(".dist-prod").css("width", "100%");
                }

                //参考图
                function details() {
                    var srcArray = [];
                    for (var i = 1; i <= 3; i++) {
                        if (data.data['smallReferenceImage' + i]) {
                            srcArray.push({
                                "orgSrc": 'http://' + data.data['middleReferenceImage' + i],
                                "thumbnail": 'http://' + data.data['smallReferenceImage' + i]
                            });
                        }
                    }
                    return srcArray;
                }

                //生产参考图
                function detailsProd() {
                    var srcArray = [];
                    if(data.data['middleProducerefImage'])
                    {
                        srcArray.push({
                            "orgSrc": 'http://' + data.data['middleProducerefImage'],
                            "thumbnail": 'http://' + data.data['smallProducerefImage']
                        });
                    }
                    return srcArray
                }

                uploadfile.uploadPhoto('details_diagram', 3, details(), false);//参考图
                if(detailsProd().length>0)
                {
                    $(".dist-refe").removeClass('hide');
                    uploadfile.uploadPhoto('details_prod', 3, detailsProd(), false);//生产参考图
                }

                // 设计稿
                Requst.ajaxGet(config.WebService()["orderDesignPattern_Query"], {"customid": customid}, true, function (data) {
                    var designDraft=data.data;
                    if (designDraft.length>0) {
                        for(var i=0;i<designDraft.length;i++)
                        {
                            var item = designDraft[i];
                            if(item.status==3)//定稿
                            {
                                function designAccessory(field) {
                                    var accessoryArray = [];//设计附件
                                    if (item[field]) {
                                        var accessoryFile = item[field];
                                        accessoryFile = accessoryFile.indexOf('http:') >= 0 ? accessoryFile : "http://" + accessoryFile;
                                        accessoryArray.push({
                                            "uri": accessoryFile,
                                            "name": customid,
                                        });
                                    }
                                    return accessoryArray;
                                }

                                function designPhoto() {
                                    var srcArray = [];
                                    if(item['middleDesignImage1'])
                                    {
                                        srcArray.push({
                                            "orgSrc": 'http://' + item['middleDesignImage1'],
                                            "thumbnail": 'http://' + item['smallDesignImage1']
                                        });
                                    }
                                    return srcArray
                                }

                                //设计附件
                                uploadfile.uploadFile('details_encl', 1, designAccessory("designFile"), false, "", "", true);
                                
                                //其他设计附件
                                if(designAccessory("otherFile").length>0)
                                {
                                    $('.other-annex').removeClass('hide');
                                    uploadfile.uploadFile('details_encl_next', 1, designAccessory("otherFile"), false, "", "", true);
                                }
                                uploadfile.uploadPhoto('draftImg',1,designPhoto(),false);
                                $(".rema-text").text(item.designMemo||"暂无");
                            }
                        }
                    }
                });
            }
            $('.workshop-content').removeClass("hide");
        })
    },
    Exportsing: function () {//下载生产单
        var url = config.WebService()["downManOrder"];
        Requst.ajaxGet(url,{"customid": customid}, true, function (data) {
            if (data.code == 200) {
                Helper.download(data.data);
            }
        });
    }
}