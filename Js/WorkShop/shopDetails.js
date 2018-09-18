var customid = Helper.getUrlParam('customid') || "";//获取订单号

$(function () {
    workShop.workGet();
    workShop.Design();

    $(".draft-title-left").on('click', function () {
        workShop.Exportsing();
    });

    $("#details_diagram").attr("data-customid", customid);


    $("#details_encl").attr("data-customid", customid);
    $("#details_encl_next").attr("data-customid", customid);

    //workShop.code();
});



var workShop = {
    workGet: function () {
        data = {
            "customId": customid,
        }

        if (localStorage.getItem('SysParam'))//从缓存获取字典
        {
            try {
                SysParam = JSON.parse(localStorage.getItem('SysParam'));
            }
            catch (e) {

            }
        }


        var url = config.WebService()["orderSummaryInfo_Query"];
        Requst.ajaxGet(url, data, true, function (data) {

            var item=data.data;
            function operating() {

                var operating = $('.operation');
                //未报价
                if((item.inquiryStatus==1||item.inquiryStatus==2)&& item.lastQuote==0)
                {
                    var btn=$('<button class="btn" data-lastQuote="'+item.lastQuote+'" style="width: 66px; height: 23px;" data-inquiryRound="'+item.inquiryRound+'" data-orderid="' + item.orderid + '" data-ordersummaryId="' + item.id + '" data-customid="' + item.customid + '">报价</button>');
                    btn.on('click',function () {
                        var customid = $(this).attr('data-customid');
                        var orderid = $(this).attr('data-orderid');
                        var ordersummaryId = $(this).attr('data-ordersummaryId');
                        var inquiryRound=$(this).attr('data-inquiryRound');//询价轮次
                        var lastQuote=$(this).attr("data-lastQuote");//上次报价
                        top.Popup.open("报价",423,266,"./Pop-ups/orderOffer.html?customid="+customid+"&inquiryRound="+inquiryRound+"&lastQuote="+lastQuote);
                    });
                    operating.append(btn);
                }
                //重新报价
                if(item.inquiryStatus==2 && item.lastQuote>0)
                {
                    var btn=$('<button class="btn" data-lastQuote="'+item.lastQuote+'" style="width: 66px; height: 23px;" data-inquiryRound="'+item.inquiryRound+'" data-orderid="' + item.orderid + '" data-ordersummaryId="' + item.id + '" data-customid="' + item.customid + '">重新报价</button>');
                    btn.on('click',function () {
                        var customid = $(this).attr('data-customid');
                        var orderid = $(this).attr('data-orderid');
                        var ordersummaryId = $(this).attr('data-ordersummaryId');
                        var inquiryRound=$(this).attr('data-inquiryRound');//询价轮次
                        var lastQuote=$(this).attr("data-lastQuote");//上次报价

                        top.Popup.open("重新报价",423,266,"./Pop-ups/orderOffer.html?customid="+customid+"&inquiryRound="+inquiryRound+"&lastQuote="+lastQuote);

                    });
                    operating.append(btn);
                }
                //处理议价
                if(item.inquiryStatus==5 || (item.inquiryStatus==6 && item.lastQuote==0))
                {
                    var btn=$('<button class="btn" style="width: 66px; height: 23px;" data-userPeriod="'+item.workshopUserPeriod+'" data-basePrice="'+item.workshopBasePrice+'" data-orderid="' + item.orderid + '" data-ordersummaryId="' + item.id + '" data-customid="' + item.customid + '">处理议价</button>');
                    btn.on('click',function () {
                        var customid = $(this).attr('data-customid');
                        var orderid = $(this).attr('data-orderid');
                        var ordersummaryId = $(this).attr('data-ordersummaryId');
                        var userPeriod=$(this).attr("data-userPeriod");//客户期望工期
                        var basePrice=$(this).attr("data-basePrice");//客户低价

                        top.Popup.open("处理议价",423,266,"./Pop-ups/handBarg.html?customid="+customid+"&userPeriod="+userPeriod+"&basePrice="+basePrice);

                    });
                    operating.append(btn);
                }
                //接受生产
                if(item.produceStatus==2)
                {
                    var btn=$('<button class="btn" style="width: 66px; height: 23px;" data-orderid="' + item.orderid + '" data-ordersummaryId="' + item.id + '" data-customid="' + item.customid + '">接受生产</button>');
                    btn.on('click',function () {
                        var customid = $(this).attr('data-customid');
                        var orderid = $(this).attr('data-orderid');
                        var ordersummaryId = $(this).attr('data-ordersummaryId');

                        var url=config.WebService()["orderProductInfoAccept_Update"];
                        top.Requst.ajaxPost(url,{"customid":customid},true,function (data) {
                            if(data.code==200)
                            {
                                top.Message.show("提示",data.message,MsgState.Success,2000,function () {
                                    top.classMain.loadOverview(null,null,null,customid);
                                });
                            }
                            else
                            {
                                top.Message.show("提示",data.message,MsgState.Warning,2000);
                            }
                        });
                    });
                    operating.append(btn);
                }
                //发货
                if(item.produceStatus==3)
                {
                    var btn=$('<button class="btn" style="width: 66px; height: 23px;" data-orderid="' + item.orderid + '" data-ordersummaryId="' + item.id + '" data-customid="' + item.customid + '">发货</button>');
                    btn.on('click',function () {
                        var customid = $(this).attr('data-customid');
                        var orderid = $(this).attr('data-orderid');
                        var ordersummaryId = $(this).attr('data-ordersummaryId');
                        top.Popup.open("发货",423,230,"./Pop-ups/uploadLogist.html?customid="+customid);
                    });
                    operating.append(btn);
                }

                //查看物流
                if(item.produceStatus==4)
                {
                    var btn=$('<button class="btn" style="width: 66px; height: 23px;" data-orderid="' + item.orderid + '" data-ordersummaryId="' + item.id + '" data-customid="' + item.customid + '">查看物流</button>');
                    btn.on('click',function () {
                        var customid = $(this).attr('data-customid');
                        var orderid = $(this).attr('data-orderid');
                        var ordersummaryId = $(this).attr('data-ordersummaryId');
                        window.open("./Pop-ups/logisticsInfo.html?customid="+customid+"&orderid="+orderid);
                    });
                    operating.append(btn);
                }

                //上传成品图
                if(item.produceStatus==3 || item.produceStatus==4)
                {

                    if (item.smallFinishedProductsImage1||item.smallFinishedProductsImage2||item.smallFinishedProductsImage3)
                    {
                        var btn=$('<button class="btn" style="width: 66px; height: 23px;" data-orderid="' + item.orderid + '" data-ordersummaryId="' + item.id + '" data-customid="' + item.customid + '">编辑成品图</button>');
                        btn.on('click',function () {
                            var customid = $(this).attr('data-customid');
                            var orderid = $(this).attr('data-orderid');
                            var ordersummaryId = $(this).attr('data-ordersummaryId');
                            OPER.productPicture(customid,'edit');
                        });
                        operating.append(btn);
                    }
                    else
                    {
                        var btn=$('<button class="btn" style="width: 66px; height: 23px;" data-orderid="' + item.orderid + '" data-ordersummaryId="' + item.id + '" data-customid="' + item.customid + '">上传成品图</button>');
                        btn.on('click',function () {
                            var customid = $(this).attr('data-customid');
                            var orderid = $(this).attr('data-orderid');
                            var ordersummaryId = $(this).attr('data-ordersummaryId');
                            OPER.productPicture(customid,'edit',"上传成品图");
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



            //剩余发货时间
            $(".deliver b").attr('data-deadlinetime',data.data.deadlineTime);
            setInterval(function () {
                var timeleft = $('.deliver');
                for (var i = 0; i < timeleft.length; i++) {
                    var domItem=timeleft.attr('data-deadlineTime');
                    if(domItem && domItem!='null')
                    {
                        var countdown=Helper.Date.countdown(domItem);
                        $(timeleft.find('b')).text(countdown);
                    }
                }
            }, 100);



            var createTime = data.data.createTime || "";//订单创建时间
            var initialGoodsImage = data.data.initialGoodsImage || "";//原始产品图中图
            //属性
            var goodsClass = data.data.goodsClass || "";//产品类别
            var material = data.data.material || "";//产品材质
            var accessories = data.data.accessories || "";//配件

            //工艺
            var shape = data.data.shape || "";//开模
            //var technology = data.data.technology || "";//生产工艺
            //var color = data.data.color || "";//电镀色

            var number = data.data.number || "";//数量
            var length = data.data.length || "";//长
            var width = data.data.width || "";//宽
            var height = data.data.height || "";//高
            var userPeriod = data.data.userPeriod || "";//要求工期
            var producePrice = data.data.producePrice || "";//生产费用
           // var lastPeriod = data.data.lastPeriod || "";//客服工期
            var lastQuote = data.data.lastQuote || "";//上次报价
            var lastPeriod = data.data.lastPeriod || "";//工期
            var designMemo = data.data.designMemo || "";//设计备注
            var produceMemo = data.data.produceMemo || "";//生产备注
            var currentPrice = data.data.currentPrice || "";//参考价格
            var currentPeriod = data.data.currentPeriod || "";//参考工期
            var orderid = data.data.orderid || "";//订单号


            $(".time-num").text(createTime);//订单创建时间
            $(".orderNum").text(orderid);//订单号
            $(".order-img img").attr('src', 'http://'+initialGoodsImage);//产品图
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
            //$(".limit").text(deadline);//工期
            $(".Money").text(producePrice);//生产费用
            $(".limit").text(userPeriod);//客服工期
            $(".offer-money").text(lastQuote);//上次报价
            $(".offertime").text(lastPeriod);//上次工期
            $(".design-rema textarea").text(designMemo);//设计备注
            $(".dist-text").text(produceMemo == '' ? '暂无' : produceMemo);//生产要求
            $(".quot-num").text(currentPrice);//参考价格
            $(".quot-day").text(currentPeriod);//参考工期
            $(".cont").text(data.data.name || "");//收货人姓名
            $(".phone").text(data.data.mobilephone || "");//收货联系电话
            $(".zip-code").text(data.data.postcode || "");//邮编
            $(".area").text(data.data.province + data.data.city + data.data.county || "");//省市县
            $(".detailed").text(data.data.detail_address || "");//详细地址
            $(".distRefe").attr('src', data.data.initialGoodsImage)//生产参考图
            $(".prod-text").text(produceMemo == '' ? '暂无' : true);//点详情显示生产要求

            if (userPeriod <= 5) {//急单
                $(".emer").removeClass('hide');
            } else {
                $(".emer").addClass('hide');
            }

            function details(srcArray) {
                srcArray = [];//参考图
                for (var i = 1; i <= 3; i++) {
                    if (data.data['initialReferenceImage' + i]) {
                        srcArray.push({
                            "orgSrc": 'http://' + data.data['initialReferenceImage' + i],
                            "thumbnail": 'http://' + data.data['smallReferenceImage' + i]
                        });

                    }
                    return srcArray
                }

            }

            function detailsProd(srcArray) {
                srcArray = [];//生产参考图
                for (var i = 1; i <= 3; i++) {
                    if (data.data['initialReferenceImage' + i]) {
                        srcArray.push({
                            "orgSrc": 'http://' + data.data['initialReferenceImage' + i],
                            "thumbnail": 'http://' + data.data['smallReferenceImage' + i]
                        });

                    }
                    return srcArray
                }

            }

            function detaProd(srcArray) {
                srcArray = [];//详情参考图
                for (var i = 1; i <= 3; i++) {
                    if (data.data['initialReferenceImage' + i]) {
                        srcArray.push({
                            "orgSrc": 'http://' + data.data['initialReferenceImage' + i],
                            "thumbnail": 'http://' + data.data['smallReferenceImage' + i]
                        });

                    }
                    return srcArray
                }

            }

            function detaProdRefe(srcArray) {
                srcArray = [];//详情生产参考图
                for (var i = 1; i <= 3; i++) {
                    if (data.data['initialReferenceImage' + i]) {
                        srcArray.push({
                            "orgSrc": 'http://' + data.data['initialReferenceImage' + i],
                            "thumbnail": 'http://' + data.data['smallReferenceImage' + i]
                        });

                    }
                    return srcArray
                }

            }

            uploadfile.uploadPhoto('details_diagram', 3, details(), false);//参考图回显
            uploadfile.uploadPhoto('details_prod', 3, detailsProd(), false);//生产参考图回显
            uploadfile.uploadPhoto('deta_prod', 3, detaProd(), false);//点详情显示参考图
            uploadfile.uploadPhoto('deta_prod_refe', 3, detaProdRefe(), false);//点详情显示生产参考图

            debugger
            //刘刚加-车间在没有接收生产之前，不能显示收货地址
            if(item.produceStatus>=3 && item.produceStatus<=7)
            {
               $(".dist-rece-address").removeClass("hide");
            }
        })
    },
    Exportsing: function () {//下载生产单
        data = {
            "customid": customid,
        }
        var url = config.WebService()["downManOrder"];
        Requst.ajaxGet(url, data, true, function (data) {
            if (data.code == 200) {
                Helper.download(data.data);
            }
        });
    },

    Design: function () {
        data = {
            "customid": customid,
        }
        var url = config.WebService()["orderDesignPattern_Query"];
        Requst.ajaxGet(url, data, true, function (data) {
            if (data.data){
                function designFile (accessoryArray) {
                    accessoryArray = [];//设计附件
                    if (data.data.designFile) {
                        accessoryArray.push({
                            "uri": 'http://' + data.data['designFile'],
                            "name": data.data['designFile'],
                        });
                    }
                    return accessoryArray
                }

                function otherFile (accessoryArray) {
                    accessoryArray = [];//设计附件
                    if (data.data.otherFile) {
                        accessoryArray.push({
                            "uri": 'http://' + data.data['otherFile'],
                            "name": data.data['otherFile'],
                        });
                    }
                    return accessoryArray
                }


                uploadfile.uploadFile('details_encl', 1,designFile(), false, "", "", true)//设计附件回显
                uploadfile.uploadFile('details_encl_next', 1,otherFile(), false, "", "", true)//其他设计附件回显
            }
           $(".draftImg").attr('src','http://'+data.data.middleDesignImage1);
           $(".rema-text").text(data.data.designMemo);

        });
    }

}