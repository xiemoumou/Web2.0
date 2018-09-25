
var customid = "";

//分配生产检查
$(function () {
    customid=Helper.getUrlParam("customid",true);
    checkOrder.getData();

    //分配生产
    var allocationProduce= Helper.getUrlParam("allocationProduce",true);
    if(allocationProduce)
    {
        $(".ok").removeClass('hide');
        $(".ok").on('click',function () {
            var url = config.WebService()["continue_Production"];
            top.Requst.ajaxGet(url, {"customid": customid}, true, function (data) {
                if(data.code==200)
                {
                    top.classMain.loadOverview(null,null,null,customid);//更新概览数据
                    //更新详情数据
                    top.Message.show("提示",data.message,MsgState.Success,2000,function () {
                        if (top.document.getElementById("iframe_"+customid).contentWindow.details) {
                            top.document.getElementById("iframe_"+customid).contentWindow.details.getData("base");
                        }
                    });
                    top.Popup.close("核对订单");
                }
            });
        });
    }
});

var checkOrder = {
    getData: function () {
        var url = config.WebService()["logistics_Check"];
        top.Requst.ajaxGet(url, {"customid":customid}, true, function (data) {
            if (data.code==200 && data.data) {
                data=data.data;
                debugger
                if (data.boxData.length>=1){
                    var boxData="";
                    for (var i=0; i<data.boxData.length; i++){
                        boxData+=data.boxData[i]+"\r\n";//包装详情
                    }
                    $(".box-text").text(boxData);//包装详情
                }

                $(".check-length").text(data.size);//产品尺寸
                $(".parts").text(data.accessories);//配件名称
                $(".deliver-time").text(data.lastestDate);//最迟发货时间
                $(".num").text(data.number);//数量
                $(".money").text(data.finalPrice);//订单金额
                $(".requ").text(data.designMemo);//设计要求
                $(".prod").text(data.produceMemo);//生产要求
                $(".collect-user-text").text(data.name);//收件人
                $(".collect-phone-text").text(data.mobilephone);//收件人电话
                $(".collect-code-text").text(data.postcode);//邮编
                var invoiceMoney=data.detailsValue1?data.detailsValue1.formatMoney(2, "", ",", "."):"0.00";
                $(".invoice-money-text").text(invoiceMoney);//发票金额
                var taxRate=data.taxRate?data.taxRate:0;
                $(".invoice-tax-text").text(taxRate*100);//税率
                $(".invoice-title-text").text(data.invoiceTitle);//抬头
                $(".texture").text(data.productDescription);//材质
                $(".type").text(data.goodsClass);//类型
                $(".address-text").text(data.address);//详细地址

                var invoiceTypeVal=data.invoice_type?data.invoice_type:0;
                var invoiceType=["不开发票","增值税普通发票","增值税专用发票","收据"];
                $(".invoice").text(invoiceType[invoiceTypeVal]);

                if(invoiceTypeVal!=0)
                {
                    $(".see").removeClass('hide');
                    $(".see").on('click',function () {//查看发票
                        $(".invoice-text").removeClass("acvive_none");
                        $(this).addClass("acvive_none");
                    });
                }

                //参考图
                var arrayPhoto=[];
                for(var i=1;i<3;i++)
                {
                    if (data["middleReferenceImage"+i]) {
                        var orgSrc = data["middleReferenceImage"+i];
                        orgSrc = orgSrc.indexOf('http:') >= 0 ? orgSrc : "http://" + orgSrc;

                        var thumbnail = data['smallReferenceImage' + i];
                        thumbnail = thumbnail.indexOf('http:') >= 0 ? thumbnail : "http://" + thumbnail;
                        arrayPhoto.push({"orgSrc": orgSrc, "thumbnail": thumbnail});
                    }
                }
                uploadfile.uploadPhoto("details_diagram",3,arrayPhoto,false);

                //生产参考图
                var arrayProduct=[];
                if (data["f_middleWorkShopImage1"]) {
                    var orgSrc = data["f_middleWorkShopImage1"];
                    orgSrc = orgSrc.indexOf('http:') >= 0 ? orgSrc : "http://" + orgSrc;

                    var thumbnail = data['f_smallWorkShopImage1'];
                    thumbnail = thumbnail.indexOf('http:') >= 0 ? thumbnail : "http://" + thumbnail;
                    arrayPhoto.push({"orgSrc": orgSrc, "thumbnail": thumbnail});
                }
                if(arrayProduct.length>0)
                {
                    $(".prod_refe").removeClass('hide');
                    uploadfile.uploadPhoto("prod_refe",1,arrayProduct,false);
                }

                // 设计图
                var designPhoto=[];
                if (data["f_middleDesignImage1"]) {
                    var orgSrc = data["f_middleDesignImage1"];
                    orgSrc = orgSrc.indexOf('http:') >= 0 ? orgSrc : "http://" + orgSrc;

                    var thumbnail = data['f_smallDesignImage1'];
                    thumbnail = thumbnail.indexOf('http:') >= 0 ? thumbnail : "http://" + thumbnail;
                    designPhoto.push({"orgSrc": orgSrc, "thumbnail": thumbnail});
                }
                if(designPhoto.length>0)
                {
                    uploadfile.uploadPhoto("designPhoto",1,designPhoto,false);
                }


                if (JSON.stringify(data.logistics) == '{}') {
                    $(".address-text").text('');
                }

                $(".container").removeClass("hide");
                var docHeight= $(".check-content").height();
                top.setPopSize(0,docHeight);
            }
        });
    }
}