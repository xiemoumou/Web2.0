
var customid = Helper.getUrlParam('customid') || "";//获取订单号
$(function () {
    uploadfile.uploadPhoto('prod_refe',1);//设计稿
    uploadfile.uploadPhoto('details_encl_textarea',3);//设计备注上传
    uploadfile.uploadFile('details_encl',1,null,true,null);//附件上传
    uploadfile.uploadFile('details_encl_next',1,null,true,null);//附件上传

    uploadfile.initDrag('prod_refe');//设计稿拖拽
    uploadfile.initDrag('details_encl');//附件拖拽
    uploadfile.initDrag('details_encl_next');//附件拖拽


    textArea.init('.design-rema',300,'','请输入订单设计要求，请留意：备注不允许出现产品价格，参数和旺旺等\n' +
        '各种联系方式','');
    textArea.init('.offer-rema',300,'','请输入订单设计要求，请留意：备注不允许出现产品价格，参数和旺旺等\n' +
        '各种联系方式','');

    $("#details_encl_textarea .dia-remind-1").text('点击上传')
    $("#details_encl_textarea .dia-remind-2").text('备注图片(最多3张）')

    desigDetails.desiGet();
    
    
    $(".dest-btn").on('click',function () {
        desigDetails.desiSub();
    })
})

var desigDetails = {
    orderid:null,
    designerId:null,
    desiGet: function () {
        data = {
            "customId": 2051774640610011,
        }
        var url = config.WebService()["orderSummaryInfo_Query"];
        Requst.ajaxGet(url, data, true, function (data) {
            var createTime = data.data.createTime || "";//订单创建时间
            var designPrice = data.data.designPrice || "";//设计费

            var length = data.data.length || "";//长
            var width = data.data.width || "";//宽
            var height = data.data.height || "";//高
            //属性
            var goodsClass = data.data.goodsClass || "";//产品类别
            var material = data.data.material || "";//产品材质
            var accessories = data.data.accessories || "";//配件

            //工艺
            var shape = data.data.shape || "";//开模
            var technology = data.data.technology || "";//生产工艺
            var color = data.data.color || "";//电镀色
            var deadline = data.data.deadline || "";//要求工期
            var produceMemo = data.data.produceMemo || "";//生产备注
            this.orderid = data.data.orderid;//orderid
            this.designerId = data.data.designerId//设计师id

            if (deadline <= 5) {//急单
                $(".emer").removeClass('hide');
            } else {
                $(".emer").addClass('hide');
            }


            $(".order-time").text(createTime);//订单创建时间
            $(".order-num").text('2051777045010001');//订单号
            $(".order-money").text(designPrice);//设计费
            $(".length").text(length);//长
            $(".width").text(width);//宽
            $(".height").text(height);//高
            $(".attr-text").text(goodsClass+material+accessories+shape+technology+color)//产品属性
            $(".order-requ").text(produceMemo)//生产备注


            function detaProdRefe (srcArray) {
                srcArray = [];//参考图
                for (var i = 1; i <= 3; i++) {
                    if (data.data['initialReferenceImage' + i]) {
                        srcArray.push({
                            "orgSrc": data.data['initialReferenceImage' + i],
                            "thumbnail": data.data['smallReferenceImage' + i]
                        });

                    }
                    return srcArray
                }

            }

            function detaProdRefes (srcArray) {
                srcArray = [];//详情参考图
                for (var i = 1; i <= 3; i++) {
                    if (data.data['initialReferenceImage' + i]) {
                        srcArray.push({
                            "orgSrc": data.data['initialReferenceImage' + i],
                            "thumbnail": data.data['smallReferenceImage' + i]
                        });

                    }
                    return srcArray
                }

            }

            uploadfile.uploadPhoto('deta_prod', '', detaProdRefe(), false);//参考图
            uploadfile.uploadPhoto('detas_prod', '', detaProdRefes(), false);//点详情显示参考图
        })
    },
    desiSub: function () {//提交设计单
        var url = config.WebService()["orderDesignPattern_Insert"];
        data = {
            "initialDesignImage1": $("#prod_refe .diagram-container .diagram").attr("data-oimageurl"),//设计单原图
            "smallDesignImage1": $("#prod_refe .diagram-container .diagram").attr("data-simageurl"),//设计单图小
            "middleDesignImage1": $("#prod_refe .diagram-container .diagram").attr("data-mimageurl"),//设计单图中
            "designFile": $("#details_encl .accessory-container .fileitem").attr("data-url"),//上传附件
            "otherFile": $("#details_encl_next .accessory-container .fileitem").attr("data-url"),//其他附件
            "designMemo": $(".design-rema textarea").text(),//设计备注
            "designId" : '需要概论页面传 orderDesignInfoId',
            "customid": 2051774640610011,
            "designerId": this.designerId,
            "ordersummaryId":'',
            "orderid": this.orderid,
        }

        var imgleng =  $("#details_encl_textarea .diagram-container").children().length;
        for (var i =1; i <= imgleng; i++ ){// 添加设计备注图片
            data['initialReferenceImage'+i]= $("#details_encl_textarea .diagram-container .diagram").attr('data-oimageurl');
            data['middleReferenceImage'+i] = $("#details_encl_textarea .diagram-container .diagram").attr('data-mimageurl');
            data['smallReferenceImage'+i] = $("#details_encl_textarea .diagram-container .diagram").attr('data-simageurl');
        }

        Requst.ajaxGet(url, data, true, function (data) {

        });

    }
}

