
var customid = Helper.getUrlParam('customid') || "";//获取订单号

//var customid = '2051774640610011';
$(function () {

    desigDetails.desiGet();//显示详情
    desigDetails.leavShow();//留言显示
    //desigDetails.suatusDesi();//显示是否接单

    uploadfile.uploadPhoto('prod_refe',1);//设计稿
    uploadfile.uploadPhoto('details_encl_textarea',3);//设计备注上传
    uploadfile.uploadFile('details_encl',1,null,true,null);//附件上传
    uploadfile.uploadFile('details_encl_next',1,null,true,null,false);//附件上传
    uploadfile.uploadPhoto('leav_bottom_img', 3);//留言图片上传
    uploadfile.uploadFile('leav_bottom_file', 1);//留言附件上传

    uploadfile.initDrag('prod_refe');//设计稿拖拽
    uploadfile.initDrag('details_encl');//附件拖拽
    uploadfile.initDrag('details_encl_next');//附件拖拽



    $("#leav_bottom_img").attr("data-customid", customid);
    $("#leav_bottom_file").attr("data-customid", customid);
    $("#detas_prod").attr("data-customid", customid);
    $("#other_encl_second").attr("data-customid", customid);


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

    $(".leav-btn .btn").on('click',function () {
        desigDetails.leavBtn();
    });

    $(".file-prod_refe").attr("data-customid", customid);
    $("#details_encl").attr("data-customid", customid);
    $("#details_encl_next").attr("data-customid", customid);
    $(".file-details_encl_textarea").attr("data-customid", customid);




})

var detailsData=null;

var desigDetails = {
    desiGet: function () {
        
        var that = this;
        data = {
            "customId": customid,
        }
        var url = config.WebService()["orderSummaryInfo_Query"];
        Requst.ajaxGet(url, data, true, function (data) {
            detailsData=data.data;

            var createTime = data.data.createTime || "";//订单创建时间
            var designPrice = data.data.designPrice || "";//设计费

            var length = data.data.length || "";//长
            var width = data.data.width || "";//宽
            var height = data.data.height || "";//高

            if (data.data.designStatus==1){//已分配设计，尚无方案师接单
                
                $(".desiDeta-title").addClass('hide');
                $(".prod-details").removeClass('hide');
                $(".design-man").addClass('hide');
            }
            if (data.data.designStatus>=2) {
                $(".desiDeta-title").removeClass('hide');
                $(".prod-details").addClass('hide');
                $(".design-man").removeClass('hide');
            }

            if (data.data.designInfo.length>=1){
                that.desi = data.data.designInfo[0].id;//设计方案表id
                that.ordersummaryId = data.data.designInfo[0].ordersummaryId;//订单表id
                that.version = data.data.designInfo[0].version;//设计方案版本号
            }

            //是否急单
            var orderUrgencyDays = parseInt(top.SysParam.sysParam['order_urgency_days'].value);
            if (detailsData.userPeriod <= orderUrgencyDays) {
                $(".emer").removeClass('hide');
            }

            //是否续订
            if (detailsData.isContinueOrder == 1) {
                $(".renew").removeClass('hide');
            }

            //五要素
            var element = top.SysParam.element;//元素
            var shape = ConvertIdToName(element.model, detailsData.model).join(';');
            var technology = ConvertIdToName(element.technology, detailsData.technology).join(';');
            var color = ConvertIdToName(element.color, detailsData.color).join(';');

            //属性
            var goodsClass =top.SysParam.element.goodsClass[detailsData.goodsClass].name || "";//产品类别
            var material = top.SysParam.element.material[detailsData.material].name || "";//产品材质
            var accessories = top.SysParam.element.accessories[detailsData.accessories].name || "";//配件

            //工艺
            var deadline = data.data.deadline || "";//要求工期
            var orderid = data.data.orderid || "";//订单id
            that.orderid = data.data.orderid || "";//orderid
            that.designId = data.data.designId || "";//设计单id
            that.id = data.data.id || "";//订单表
            that.servicerId = data.data.servicerId || "";//客服id
            that.designStatus = data.data.designStatus || "";//判断接单状态
            that.producestatus = data.data.producestatus || "";//生产状态
            that.designInfo = data.data.designInfo || "";

            $(".order-time").text(createTime);//订单创建时间
            $(".order-num").text(orderid);//订单号
            $(".order-money").text(designPrice);//设计费
            $(".length").text(length);//长
            $(".width").text(width);//宽
            $(".height").text(height);//高
            $(".attr-text").text(goodsClass+material+accessories+shape+technology+color);//产品属性
            $(".order-requ").text(detailsData.produceMemo);//生产备注

            function detaProdRefe (srcArray) {
                srcArray = [];//参考图
                if (data.data.middleReferenceImage1) {
                    srcArray.push({
                        "orgSrc": 'http://'+data.data.middleReferenceImage1,
                        "thumbnail": 'http://'+data.data.smallReferenceImage1
                    });

                }
                return srcArray

            }

            function detaProdRefes (srcArray) {
                srcArray = [];//详情参考图
                if (data.data.middleReferenceImage1) {
                    srcArray.push({
                        "orgSrc": 'http://'+data.data.middleReferenceImage1,
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
                        "name": customid,
                    });
                }
                return accessoryArray
            }

            function accessoryFile (accessoryArray) {
                accessoryArray = [];//详情附件
                if (data.data.accessoryFile) {
                    accessoryArray.push({
                        "uri": 'http://' + data.data.accessoryFile,
                        "name": customid,
                    });
                }
                return accessoryArray
            }

            uploadfile.uploadPhoto('deta_prod', 1, detaProdRefe(), false);//参考图
            uploadfile.uploadPhoto('detas_prod', 1, detaProdRefes(), false);//点详情显示参考图
            uploadfile.uploadFile('other_encl_first', 1, accessory(), false, "", "", true);//附件
            uploadfile.uploadFile('other_encl_second', 1, accessoryFile(), false, "", "", true);//详情附件
            
            
            
            

            if (data.data.designInfo.length>=1) {
                for (var i = 0; i < data.data.designInfo.length; i++) {
                    var commit_time = data.data.designInfo[i].commitTime || "";
                    var design_memo = data.data.designInfo[i].designMemo || "";
                    var srcMan = [];//设计稿版本图片
                    var srcFile = [];//设计稿版本附件
                    var otherFile = [];//设计稿版本其他附件
                    var remaMan = [];//设计稿版本备注图片
                    if (data.data.designInfo[i].status==3){//判断是否显示设计稿留言
                        $(".design-bg").removeClass('hide');
                        $(".EditButton").attr('disabled',"true").addClass('bg_color');

                    }
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
                        // "<span class='hide'>修正设计稿</span>" +
                        // "<button class='EditButton'>选定设计方案</button>" +
                        "</div>" +
                        "</div>" +
                        "</div>"

                    $(".for-design-box").append(str);
                    uploadfile.uploadPhoto('edit_desi_' + i, 1, srcMan, true);//设计稿版本图片
                    uploadfile.uploadFile('desi_encl_' + i, 1, srcFile, false, "", "", true);//设计稿版本附件回显
                    uploadfile.uploadFile('other_encl_' + i, 1, otherFile, false, "", "", true);//设计稿版本其他附件回显
                    uploadfile.uploadPhoto('planner_leav_' + i, 3, remaMan, false);//设计稿版本留言图片
                }

            }
            
            
            
            
            

        })
    },
    //suatusDesi: function () {


   // },
    desiSub: function () {//提交设计单
        
        if (this.producestatus>=3){
            Message.show('提示','订单已经发起生产，设计稿相关内容不可使用',3,2000);
            return false;
        }
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
            "designFile": $("#details_encl .accessory-container .fileitem").attr("data-url")||"",//上传附件
            "otherFile": $(".details-encl-box .accessory-container .fileitem").attr("data-url")||"",//其他附件
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

        var imgContainer = $("#details_encl_textarea .diagram-container .diagram");

        for (var i = 0; i < imgContainer.length; i++ ){// 添加设计备注图片
            data['initialRemarkImage'+(i+1)]= imgContainer[i].getAttribute('data-simageurl');
            data['smallRemarkImage'+(i+1)] = imgContainer[i].getAttribute('data-simageurl');
            data['middleRemarkImage'+(i+1)] = imgContainer[i].getAttribute('data-mimageurl');
        }
        Requst.ajaxPost(url, data, true, function (data) {
             if (data.code ==200){
                 Message.show('提示',data.message,MsgState.Success,2000,function () {
                     desigDetails.desiGet();
                 });
             }

        });

    },
    robbBtn: function () {//抢单
        var url = config.WebService()["orderDesignInfo_Update"];
        data = {
            "wId":this.designId,
        }
        Requst.ajaxPost(url, data, true, function (data) {
             if (data.code ==200){
                 window.location.reload();
             }
        });

    },
    leavShow: function () { //显示留言
        var that = this;
        var url = config.WebService()["orderDesignMessage_Query"];
        data = {
            "customid": customid,
        }

        Requst.ajaxGet(url, data, true, function (data) {
            if (data.data.length>=1){
                that.messageNo = data.data[0].messageNo||"";
                that.targetId = data.data[0].targetId||"";//设计师Id
                $(".leav-title-right-text em").text(data.data[0].version);//版本号沟通中
                $(".leav-title-right span").text('版本'+data.data[0].version+'沟通中');
                $(".leav-content").html('');
                for (var i = 0; i < data.data.length; i++) {
                    var srcMan = [];//留言显示图片
                    var messageFile = [];//留言显示附件
                    if (data.data[i].initialMessageImage1) {
                        srcMan.push({
                            "orgSrc": 'http://' +data.data[i]['middleMessageImage' + (i+1)],
                            "thumbnail": 'http://' +data.data[i]['smallMessageImage' + (i+1)],
                        });

                    }
                    if (data.data[i].messageFile) {
                        messageFile.push({
                            "uri": 'http://' + data.data[i].messageFile,
                            "name": customid,
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
                        "<a>客服</a>：" +
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
                    uploadfile.uploadPhoto('leav_img_' + i, 3, srcMan, false);//留言显示图片
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

        if (this.designInfo.length<= 1){
            data.messageNo = 0;
        }else{
            data.messageNo = this.messageNo + 1;
        }
        data = {
            "customid": customid,
            "orderid": this.orderid,
            "designPatternId": this.desi,
            "ordersummaryId": this.id,
            "version": this.version,
            "messageNo": 0,
            "targetId": this.servicerId,
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
            "needReDesign":'',
        }

        var imgContainer = $("#leav_bottom_img .diagram-container").children();
        var imgleng =  imgContainer.length;
        for (var i = 0; i < imgleng; i++) {// 添加设计图片
            data['initialMessageImage' + (i+1)] = imgContainer[i].getAttribute('data-oimageurl');
            data['middleMessageImage' + (i+1)] = imgContainer[i].getAttribute('data-mimageurl');
            data['smallMessageImage' + (i+1)] = imgContainer[i].getAttribute('data-simageurl');
        }

        Requst.ajaxPost(url, data, true, function (data) {
            desigDetails.leavShow();

        });
    }
    
}
