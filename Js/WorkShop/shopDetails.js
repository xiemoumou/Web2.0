var customid = Helper.getUrlParam('customid') || "";//获取订单号

$(function () {
    //workShop.workGet();

    $(".draft-title-left").on('click', function () {
        workShop.Exportsing();
    })

    //workShop.code();
});


var workShop = {
    workGet: function () {
        data = {
            "customId": customid,
        }


        var url = config.WebService()["orderSummaryInfo_Query"];
        Requst.ajaxGet(url, data, true, function (data) {
            var createTime = data.data.createTime || "";//订单创建时间
            var initialGoodsImage = data.data.initialGoodsImage || "";//原始产品图中图
            //属性
            var goodsClass = data.data.goodsClass || "";//产品类别
            var material = data.data.material || "";//产品材质
            var accessories = data.data.accessories || "";//配件

            //工艺
            var shape = data.data.shape || "";//开模
            var technology = data.data.technology || "";//生产工艺
            var color = data.data.color || "";//电镀色

            var number = data.data.number || "";//数量
            var length = data.data.length || "";//长
            var width = data.data.width || "";//宽
            var height = data.data.height || "";//高
            var deadline = data.data.deadline || "";//要求工期
            var producePrice = data.data.producePrice || "";//生产费用
            var user_period = data.data.user_period || "";//客服工期
            var lastQuote = data.data.lastQuote || "";//上次报价
            var lastPeriod = data.data.lastPeriod || "";//工期
            var designMemo = data.data.designMemo || "";//设计备注
            var produceMemo = data.data.produceMemo || "";//生产备注
            var currentPrice = data.data.currentPrice || "";//参考价格
            var currentPeriod = data.data.currentPeriod || "";//参考工期
            var orderid = data.data.orderid || "";//订单号


            $(".time-num").text(createTime);//订单创建时间
            $(".orderNum").text(orderid);//订单号
            $(".order-img img").attr('src', initialGoodsImage);//产品图
            $(".attr-1").text(goodsClass);//属性 产品类别
            $(".attr-2").text(material);//属性 产品材质
            $(".attr-3").text(accessories);//属性 配件
            $(".tech-1").text(shape);//工艺开模
            $(".tech-2").text(technology);//生产工艺
            $(".tech-3").text(color);//电镀色
            $(".ordNum").text(number);//数量
            $(".length").text(length);//长
            $(".width").text(width);//宽
            $(".height").text(height);//高
            //$(".limit").text(deadline);//工期
            $(".Money").text(producePrice);//生产费用
            $(".limit").text(user_period);//客服工期
            $(".offer-money").text(lastQuote);//上次报价
            $(".offertime").text(lastPeriod);//工期
            $(".design-rema textarea").text(designMemo);//设计备注
            $(".dist-text").text(produceMemo == '' ? '暂无' : true);//生产要求
            $(".quot-num").text(currentPrice);//参考价格
            $(".quot-day").text(currentPeriod);//参考工期
            $(".cont").text(data.data.name || "");//收货人姓名
            $(".phone").text(data.data.mobilephone || "");//收货联系电话
            $(".zip-code").text(data.data.postcode || "");//邮编
            $(".area").text(data.data.province + data.data.city + data.data.county || "");//省市县
            $(".detailed").text(data.data.detail_address || "");//详细地址
            $(".distRefe").attr('src', data.data.initialGoodsImage)//生产参考图
            $(".prod-text").text(produceMemo == '' ? '暂无' : true);//点详情显示生产要求

            if (deadline <= 5) {//急单
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

            uploadfile.uploadPhoto('details_diagram', '', details(), true);//参考图回显
            uploadfile.uploadPhoto('details_prod', '', detailsProd(), true);//生产参考图回显
            uploadfile.uploadPhoto('deta_prod', '', detaProd(), true);//点详情显示参考图
            uploadfile.uploadPhoto('deta_prod_refe', '', detaProdRefe(), true);//点详情显示生产参考图

        })
    },
    Exportsing: function () {//下载生产单
        data = {
            "customId": customid,
        }
        var url = config.WebService()["downManOrder"];
        Requst.ajaxGet(url, data, true, function (data) {
            if (data.code == 200) {
                Helper.download(data.data);
            }
        });
    },
    code: function () {//测试报价返回自动报价训练库
        data = {
            "customid": 2051778645010001,
            "quotePrice": 1000,
            "quotePeriod": 10,
            "rounds": 1,
        }

        var url = config.WebService()["orderQuoteInfo_Insert"];
        Requst.ajaxGet(url, data, true, function (data) {

        });
    }
}