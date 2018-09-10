
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
                "orderid": orderid,
                "userid": $.cookie("userid"),
                "customid": customid,
                "roletype": $.cookie("roletype"),
                "token": $.cookie("token"),
                "commandcode": 170,
                "goodsid": "abdc123456"
            };
            
            var url = Common.getUrl()['order'] + Common.getDataInterface()["allocation"];
            Common.ajax(url, data, false, function (data) {
                if (data && data.status.code==0) {
                    Common.msg(data.status.msg,200,2000,function () {
                        if (parent.document.getElementById("cont_iframe").contentWindow.base) {
                            parent.document.getElementById("cont_iframe").contentWindow.base.init();
                            parent.layer.closeAll();
                        }
                    });
                }
                else {
                    Common.msg(data.status.msg,null,2000);
                }
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
        Requst.ajaxGet(url, data, true, function (data) {
            if (data) {
                var imgsrc = '../../images/icon/nothing.png';

                var invoice_val =  $(".invoice-type");//发票类型
                   
                $(".type").text(data.data.goodsclass);//产品类型
                $(".check-length").text(data.data.size);//张宽高
                // $(".check-width").text(data.data.width);//宽
                // $(".check-height").text(data.data.height);//高
                $(".parts").text(data.data.accessories);//配件名称
                $(".deliver-time").text(data.data.lastestDate)//最迟发货时间
                $(".num").text(data.data.number);//数量
                $(".money").text(data.data.finalprice==0?'还未定价':data.data.finalprice)//订单金额
                $(".requ").text(data.data.designmemo);//设计要求
                $(".prod").text(data.data.produceMemo);//生产要求
                $(".collect-user-text").text(data.logistics.name);//收件人
                $(".collect-phone-text").text(data.logistics.mobilephone);//收件人电话
                $(".collect-code-text").text(data.logistics.postcode);//邮编
                $(".invoice-money-text").text(data.data.detailsValue1);//发票金额
                $(".invoice-tax-text").text(data.data.taxRate*100);//税率
                $(".invoice-title-text").text(data.data.invoiceTitle);//抬头
                $(".texture").text(data.data.material);//材质
                $(".tech").text(data.data.technology);//工艺
                $(".tech-attr").text(data.data.model);//工艺属性
                $(".elec-color").text(data.data.color);//电镀色
                //***$(".box-text").text(data.orderboxs.packing);//包装详情
                debugger
                $("#refe-first").attr('src',(data.data.referencepictureurl==''?imgsrc:('http://' + data.data.referencepictureurl)));//参考图1
                $("#refe-second").attr('src',(data.data.referencepictureurl2==''?imgsrc:('http://' + data.data.referencepictureurl2)));//参考图2
                $("#refe-third").attr('src',(data.data.referencepictureurl3==''?imgsrc:('http://' + data.data.referencepictureurl3)));//参考图3
                $("#design-first").attr('src',(data.data.patternimageurl==''?imgsrc:('http://' + data.data.patternimageurl)));//设计图
                $("#refe-fourth").attr('src',(data.data.factorypictureurl1==''?imgsrc:( data.data.factorypictureurl1)))//生产前参考图
                $(".address-text").text(data.data.address);//详细地址

                //参考图与设计图放大
                if(data.data.referencepictureurl)
                {
                    $("#refe-first").next().on('click',function () {
                        top.previewImg.insert(top.Main.getUrl['cosImgUrl'] + data.data.referencepictureurl);
                        top.previewImg.show();
                    });
                }

                if(data.data.referencepictureurl2)
                {
                    $("#refe-second").next().on('click',function () {
                        top.previewImg.insert(top.Main.getUrl['cosImgUrl'] + data.data.referencepictureurl2);
                        top.previewImg.show();
                    });
                }

                if(data.data.referencepictureurl3)
                {
                    $("#refe-third").next().on('click',function () {
                        top.previewImg.insert(top.Main.getUrl['cosImgUrl'] + data.data.referencepictureurl3);
                        top.previewImg.show();
                    });
                }
                if(data.data.factorypictureurl1)
                {
                    $("#refe-fourth").next().on('click',function () {
                        top.previewImg.insert(top.Main.getUrl['cosImgUrl'] + data.data.factorypictureurl1);
                        top.previewImg.show();
                    });
                }
                if(data.data.patternimageurl)
                {
                    $("#design-first").next().on('click',function () {
                        top.previewImg.insert(top.Main.getUrl['cosImgUrl'] + data.data.patternimageurl);
                        top.previewImg.show();
                    });
                }
                //参考图与设计图放大end


                if (data.data.invoicetype==''){//判断发票类型
                    invoice_val.text('');
                    $(".invoice").text('不开发票');
                    $(".see").addClass("acvive_none");
                }if (data.data.invoicetype==1){
                    invoice_val.text('增值税普通发票')
                }if (data.data.invoicetype==2){
                    invoice_val.text('增值税专用发票')
                }


                // $(".texture,.tech,.elec-color").text(function(index, text) {
                //     
                //     return text.replace(/;/g,"");
                //
                // });

                if (JSON.stringify(data.logistics) == '{}') {
                    $(".address-text").text('');
                }

                debugger
                var docHeight= $(".check-content").height();
                top.setPopSize(0,docHeight);
            }
        });
    }
}