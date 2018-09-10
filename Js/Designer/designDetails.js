
var customid = Helper.getUrlParam('customid') || "";//获取订单号

//var customid = '2051774640610011';
$(function () {

    desigDetails.desiGet();//显示详情
    desigDetails.leavShow();//留言显示
    //desigDetails.suatusDesi();//显示是否接单

    uploadfile.uploadPhoto('prod_refe',1);//设计稿
    uploadfile.uploadPhoto('details_encl_textarea',3);//设计备注上传
    uploadfile.uploadFile('details_encl',1,null,true,null);//附件上传
    uploadfile.uploadFile('details_encl_next',1,null,true,null);//附件上传
    uploadfile.uploadPhoto('leav_bottom_img', 3);//留言图片上传
    uploadfile.uploadFile('leav_bottom_file', 1);//留言附件上传

    uploadfile.initDrag('prod_refe');//设计稿拖拽
    uploadfile.initDrag('details_encl');//附件拖拽
    uploadfile.initDrag('details_encl_next');//附件拖拽



    $("#leav_bottom_img").attr("data-customid", customid);
    $("#leav_bottom_file").attr("data-customid", customid);


    textArea.init('.design-rema',300,'','请输入订单设计要求，请留意：备注不允许出现产品价格，参数和旺旺等\n' +
        '各种联系方式','');
    textArea.init('.offer-rema',300,'','请输入订单设计要求，请留意：备注不允许出现产品价格，参数和旺旺等\n' +
        '各种联系方式','');

    $("#details_encl_textarea .dia-remind-1").text('点击上传')
    $("#details_encl_textarea .dia-remind-2").text('备注图片(最多3张）')



    $(".dest-btn").on('click',function () {
        desigDetails.desiSub();
    });

    $(".design-attr-btn").on('click',function () {
        desigDetails.robbBtn();
    })


    $(".file-prod_refe").attr("data-customid", customid);
    $("#details_encl").attr("data-customid", customid);
    $("#details_encl_next").attr("data-customid", customid);
    $(".file-details_encl_textarea").attr("data-customid", customid);




})

var desigDetails = {
    desiGet: function () {
        var that = this;
        data = {
            "customId": customid,
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
            var orderid = data.data.orderid || "";//订单id
            that.orderid = data.data.orderid || "";//orderid
            that.designId = data.data.designId || "";//设计单id
            that.id = data.data.id || "";//订单表
            that.ordersummaryId = data.data.ordersummaryId || "";
            that.designStatus = data.data.designStatus || "";//判断接单状态

            if (data.data.designStatus<=1){//已分配设计，尚无方案师接单
                debugger
                $(".desiDeta-title").addClass('hide');
                $(".prod-details").removeClass('hide');
            }if (data.data.designStatus==2){//方案师正在设计中
                $(".desiDeta-title").removeClass('hide');
                $(".prod-details").addClass('hide');
            }

            if (data.data.designInfo!=''){

                that.id = data.data.designInfo[0].id;//设计方案表id
                that.ordersummaryId = data.data.designInfo[0].ordersummaryId;//订单表id
                that.version = data.data.designInfo[0].version;//设计方案版本号
            }



            if (deadline <= 5) {//急单
                $(".emer").removeClass('hide');
            } else {
                $(".emer").addClass('hide');
            }
            


            $(".order-time").text(createTime);//订单创建时间
            $(".order-num").text(orderid);//订单号
            $(".order-money").text(designPrice);//设计费
            $(".length").text(length);//长
            $(".width").text(width);//宽
            $(".height").text(height);//高
            $(".attr-text").text(goodsClass+material+accessories+shape+technology+color)//产品属性
            $(".order-requ").text(produceMemo)//生产备注


            function detaProdRefe (srcArray) {
                srcArray = [];//参考图
                if (data.data.initialReferenceImage1) {
                    srcArray.push({
                        "orgSrc": 'http://'+data.data.initialReferenceImage1,
                        "thumbnail": 'http://'+data.data.smallReferenceImage1
                    });

                }
                return srcArray

            }

            function detaProdRefes (srcArray) {
                srcArray = [];//详情参考图
                if (data.data.initialReferenceImage1) {
                    srcArray.push({
                        "orgSrc": 'http://'+data.data.initialReferenceImage1,
                        "thumbnail": 'http://'+data.data.smallReferenceImage1
                    });

                }
                return srcArray

            }

            function accessory (accessoryArray) {
                accessoryArray = [];//附件
                if (data.data.accessoryFile) {
                    accessoryArray.push({
                        "uri": 'http://' + data.data.accessoryFile,
                        "name": data.data.accessoryFile,
                    });
                }
                return accessoryArray
            }

            function accessoryFile (accessoryArray) {
                accessoryArray = [];//详情附件
                if (data.data.accessoryFile) {
                    accessoryArray.push({
                        "uri": 'http://' + data.data.accessoryFile,
                        "name": data.data.accessoryFile,
                    });
                }
                return accessoryArray
            }

            uploadfile.uploadPhoto('deta_prod', '', detaProdRefe(), false);//参考图
            uploadfile.uploadPhoto('detas_prod', '', detaProdRefes(), false);//点详情显示参考图
            uploadfile.uploadFile('other_encl_first', 1, accessory(), false, "", "", true);//附件
            uploadfile.uploadFile('other_encl_second', 1, accessoryFile(), false, "", "", true);//详情附件

        })
    },
    //suatusDesi: function () {


   // },
    desiSub: function () {//提交设计单
        var url = config.WebService()["orderDesignPattern_Insert"];
        data = {
            "initialDesignImage1": $("#prod_refe .diagram-container .diagram").attr("data-oimageurl"),//设计单原图
            "smallDesignImage1": $("#prod_refe .diagram-container .diagram").attr("data-simageurl"),//设计单图小
            "middleDesignImage1": $("#prod_refe .diagram-container .diagram").attr("data-mimageurl"),//设计单图中
            "initialDesignImage2":'',
            "smallDesignImage2":'',
            "middleDesignImage2":'',
            "initialDesignImage3":'',
            "smallDesignImage3":'',
            "middleDesignImage3":'',
            "designFile": $("#details_encl .accessory-container .fileitem").attr("data-url"),//上传附件
            "otherFile": $("#details_encl_next .accessory-container .fileitem").attr("data-url"),//其他附件
            "designMemo": $(".design-rema textarea").val(),//设计备注
            "designId" : 1,
            "customid": customid,
            "ordersummaryId":this.id,
            "orderid": this.orderid,
            "status":1,
            "initialRemarkImage1":'',
            "smallRemarkImage1":'',
            "middleRemarkImage1":'',
            "initialRemarkImage2":'',
            "smallRemarkImage2":'',
            "middleRemarkImage2":'',
            "initialRemarkImage3":'',
            "smallRemarkImage3":'',
            "middleRemarkImage3":'',
        }

        var imgContainer = $("#details_encl_textarea .diagram-container").children();
        var imgleng =  imgContainer.length;

        for (var i = 0; i < imgleng; i++ ){// 添加设计备注图片
            data['initialRemarkImage'+(i+1)]= imgContainer[i].getAttribute('data-oimageurl');
            data['smallRemarkImage'+(i+1)] = imgContainer[i].getAttribute('data-simageurl');
            data['middleRemarkImage'+(i+1)] = imgContainer[i].getAttribute('data-mimageurl');
        }
        Requst.ajaxPost(url, data, true, function (data) {

        });

    },
    robbBtn: function () {//抢单
        var url = config.WebService()["orderDesignInfo_Update"];
        data = {
            "wId":this.designId,
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
            if (data.data!=''){
                that.messageNo = data.data[0].messageNo||"";
                that.targetId = data.data[0].targetId||"";//设计师Id
                $(".leav-title-right-text em").text(data.data[0].version);//版本号沟通中
                for (var i = 0; i < data.data.length; i++) {
                    var srcMan = [];//留言显示图片
                    var messageFile = [];//留言显示附件
                    if (data.data[i].initialMessageImage1) {
                        srcMan.push({
                            "orgSrc": data.data[i].smallMessageImage1,
                            "thumbnail": data.data[i].smallDesignImage1,
                        });

                    }
                    if (data.data[i].messageFile) {
                        messageFile.push({
                            "uri": 'http://' + data.data[i].messageFile,
                            "name": data.data[i].messageFile,
                        });
                    }

                    var str = "<div class='leav-reg'>" +
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

        debugger
        var url = config.WebService()["orderDesignMessage_Insert"];

        var messageContent = $(".leav-bottom-input input").text();//留言内容

        data = {
            "customid": customid,
            "orderid": this.orderid,
            "designPatternId": this.id,
            "ordersummaryId": this.ordersummaryId,
            "version": this.version,
            "messageNo": this.messageNo + 1,
            "targetId": this.targetId,
            "messageContent": messageContent,
            "messageFile": $("#leav_bottom_file .accessory-container .fileitem").attr("data-url"),
            "initialMessageImage1":'',
            "middleMessageImage1":'',
            "smallMessageImage1":'',
            "initialMessageImage2":'',
            "middleMessageImage2":'',
            "smallMessageImage2":'',
            "initialMessageImage3":'',
            "middleMessageImage3":'',
            "smallMessageImage3":'',
        }
        console.log(data);

        var imgContainer = $("#details_diagram .diagram-container").children().length;
        var imgleng =  imgContainer.length;
        for (var i = 0; i < imgleng; i++) {// 添加设计图片
            data['initialMessageImage' + (i+1)] = imgContainer[i].attr('data-oimageurl');
            data['middleMessageImage' + (i+1)] = imgContainer[i].attr('data-mimageurl');
            data['smallMessageImage' + (i+1)] = imgContainer[i].attr('data-simageurl');
        }


        Requst.ajaxPost(url, data, true, function (data) {
            details.leavShow();

        });
    }
}
