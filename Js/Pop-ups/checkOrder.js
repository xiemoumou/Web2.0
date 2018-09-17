
var customid = Helper.getUrlParam('customid') || "";//获取订单号

//分配生产检查
$(function () {

    OrderCheck.getData();

    $(".see").on('click',function () {//查看发票
        $(".invoice-text").removeClass("acvive_none");
        $(this).addClass("acvive_none");
    })
    var allocationProduce= Helper.getUrlParam("allocationProduce",true);

    var customid=Helper.getUrlParam("customid",true);
    var orderid=Helper.getUrlParam("orderid",true);
    if(allocationProduce)
    {
        $(".ok").removeClass('hide');
        $(".ok").on('click',function () {//分配生产

            var data={
                "customid": customid,
            };

            var url = config.WebService()["continue_Production"];
            top.Requst.ajaxGet(url, data, true, function (data) {

            });
        });
    }
    

});

OrderCheck = {

    getData: function () {
        data = {
             "customid":customid,
        };

        var url = config.WebService()["logistics_Check"];
        top.Requst.ajaxGet(url, data, true, function (data) {
            if (data) {
                var imgsrc = '../../Image/Pop-ups/nothing.png';

                if (data.data.boxData.length>=1){
                    for (var i=0; i<data.data.boxData.length; i++){
                        $(".box-text").text(data.data[i].boxData);//包装详情
                    }
                }


                var dict=  top.SysParam.element;
                //$(".type").text(dict.goodsClass[data.data.goodsClass].name);//产品类型
                $(".check-length").text(data.data.size);//张宽高
                // $(".check-width").text(data.data.width);//宽
                // $(".check-height").text(data.data.height);//高
                $(".parts").text(data.data.goodsClass);//配件名称
                $(".deliver-time").text(data.data.lastestDate);//最迟发货时间
                $(".num").text(data.data.number);//数量
                $(".money").text(data.data.finalPrice);//订单金额
                $(".requ").text(data.data.designMemo);//设计要求
                $(".prod").text(data.data.produceMemo);//生产要求
                $(".collect-user-text").text(data.data.name);//收件人
                $(".collect-phone-text").text(data.data.mobilephone);//收件人电话
                $(".collect-code-text").text(data.data.postcode);//邮编
                $(".invoice-money-text").text(data.data.detailsValue1);//发票金额
                $(".invoice-tax-text").text(data.data.taxRate);//税率
                $(".invoice-title-text").text(data.data.invoiceTitle);//抬头
                $(".texture").text(data.data.productDescription);//材质
                $(".type").text(data.data.accessories);//类型
                // $(".tech").text(data.data.technology);//工艺
                // $(".tech-attr").text(data.data.model);//开模方式
                // $(".elec-color").text(data.data.color);//电镀色

                
                $("#refe-first").attr('src',(data.data.initialReferenceImage1==''?imgsrc:('http://' + data.data.initialReferenceImage1)));//参考图1
                $("#refe-second").attr('src',(data.data.initialReferenceImage2==''?imgsrc:('http://' + data.data.initialReferenceImage2)));//参考图2
                $("#refe-third").attr('src',(data.data.initialReferenceImage3==''?imgsrc:('http://' + data.data.initialReferenceImage3)));//参考图3
                $("#design-first").attr('src',(data.data.f_middleDesignImage1==''?imgsrc:('http://' + data.data.f_middleDesignImage1)));//设计图
                $("#refe-fourth").attr('src',(data.data.f_initialWorkShopImage1==''?imgsrc:( data.data.f_initialWorkShopImage1)))//生产前参考图
                $(".address-text").text(data.data.address);//详细地址

                //参考图与设计图放大
                if(data.data.referencepictureurl)
                {
                    $("#refe-first").next().on('click',function () {
                        top.previewImg.create(top.Main.getUrl['cosImgUrl'] + data.data.referencepictureurl);
                        top.previewImg.show();
                    });
                }

                if(data.data.referencepictureurl2)
                {
                    $("#refe-second").next().on('click',function () {
                        top.previewImg.create(top.Main.getUrl['cosImgUrl'] + data.data.referencepictureurl2);
                        top.previewImg.show();
                    });
                }

                if(data.data.referencepictureurl3)
                {
                    $("#refe-third").next().on('click',function () {
                        top.previewImg.create(top.Main.getUrl['cosImgUrl'] + data.data.referencepictureurl3);
                        top.previewImg.show();
                    });
                }
                if(data.data.factorypictureurl1)
                {
                    $("#refe-fourth").next().on('click',function () {
                        top.previewImg.create(top.Main.getUrl['cosImgUrl'] + data.data.factorypictureurl1);
                        top.previewImg.show();
                    });
                }
                if(data.data.patternimageurl)
                {
                    $("#design-first").next().on('click',function () {
                        top.previewImg.create(top.Main.getUrl['cosImgUrl'] + data.data.patternimageurl);
                        top.previewImg.show();
                    });
                }
                //参考图与设计图放大end


                // if (data.data.invoicetype==''){//判断发票类型
                //     invoice_val.text('');
                //     $(".invoice").text('不开发票');
                //     $(".see").addClass("acvive_none");
                // }if (data.data.invoicetype==1){
                //     invoice_val.text('增值税普通发票')
                // }if (data.data.invoicetype==2){
                //     invoice_val.text('增值税专用发票')
                // }


                // $(".texture,.tech,.elec-color").text(function(index, text) {
                //     
                //     return text.replace(/;/g,"");
                //
                // });

                if (JSON.stringify(data.logistics) == '{}') {
                    $(".address-text").text('');
                }

                
                var docHeight= $(".check-content").height();
                top.setPopSize(0,docHeight);


            }
        });
    }
}