
var customid = Helper.getUrlParam('customid') || "";//获取订单号

$(function () {

    document.onkeydown = function (e) {
        e = window.event || e;
        var keycode = e.keyCode || e.which;
        if (keycode == 116) {
            if (window.event) {// ie
                try {
                    e.keyCode = 0;
                } catch (e) {
                }
                e.returnValue = false;
            } else {// firefox
                e.preventDefault();
            }
            window.location.reload(true);
        }
    }

    details.getData();//显示详情

    details.initDesignDraft();
    uploadfile.initDrag('prod_refe');//设计稿拖拽
    uploadfile.initDrag('details_encl');//附件拖拽
    uploadfile.initDrag('details_encl_next');//附件拖拽


    uploadfile.uploadPhoto('leav_bottom_img', 3);//留言图片上传
    uploadfile.uploadFile('leav_bottom_file', 1);//留言附件上传
    $("#leav_bottom_img").attr("data-customid", customid);
    $("#leav_bottom_file").attr("data-customid", customid);
    $("#detas_prod").attr("data-customid", customid);
    $("#other_encl_second").attr("data-customid", customid);

    textArea.init('.offer-rema',300,'','请输入订单设计要求，请留意：备注不允许出现产品价格，参数和旺旺等\n' +
        '各种联系方式','');
    $(".leav-btn .btn").on('click',function () {
        details.leavBtn();
    });

    //提交设计按钮
    $(".dest-btn").on('click',function () {
        details.SubmitDesign();
    });

    //查看设计稿
    $(".dest-btn-text-on").on('click',function () {
        $(window).scrollTop($('.desiDeta-title').height()+10);
    });
});



var dataDetail=null;

var details = {
    initDesignDraft:function () {
        //初始化设计稿
        $(".file-prod_refe").attr("data-customid", customid);
        uploadfile.uploadPhoto('prod_refe',1);//设计稿
        $("#details_encl").attr("data-customid", customid);
        uploadfile.uploadFile('details_encl',1,null,true,null);//附件上传
        $("#details_encl_next").attr("data-customid", customid);
        uploadfile.uploadFile('details_encl_next',1,null,true,null,false);//其他附件上传
        // 设计备注
        textArea.init('.design-rema',300,'','请输入订单设计要求，请留意：备注不允许出现产品价格，参数和旺旺等\n' +
            '各种联系方式','');

        uploadfile.uploadPhoto('details_encl_textarea',3);//设计备注上传
        $("#details_encl_textarea .addDiagram .dia-remind-1").text('点击上传');
        $("#details_encl_textarea .addDiagram .dia-remind-2").text('备注图片(最多3张）');
        $("#details_encl_textarea").attr("data-customid", customid);
    },
    getData: function () {
        var url = config.WebService()["orderSummaryInfo_Query"];
        Requst.ajaxGet(url, {"customId": customid}, true, function (data) {
            dataDetail=data.data;
            var command=dataDetail.command.split(',');

            //是否急单
            var orderUrgencyDays = parseInt(top.SysParam.sysParam['order_urgency_days'].value);
            if (dataDetail.userPeriod <= orderUrgencyDays) {
                $(".emer").removeClass('hide');
            }
            //续订
            if (dataDetail.isContinueOrder == 1) {
                $(".renew").removeClass('hide');
            }

            var element = top.SysParam.element;//元素
            var shape = ConvertIdToName(element.model, dataDetail.model).join(';');
            var technology = ConvertIdToName(element.technology, dataDetail.technology).join(';');
            var color = ConvertIdToName(element.color, dataDetail.color).join(';');

            var goodsClass =top.SysParam.element.goodsClass[dataDetail.goodsClass].name || "";//产品类别
            var material = top.SysParam.element.material[dataDetail.material].name || "";//产品材质
            var accessories = top.SysParam.element.accessories[dataDetail.accessories].name || "";//配件

            $(".order-time").text(dataDetail.createTime);//订单创建时间
            $(".order-num").text(dataDetail.orderid);//订单号
            $(".order-money").text(dataDetail.designPrice);//设计费
            $(".length").text(dataDetail.length);//长
            $(".width").text(dataDetail.width);//宽
            $(".height").text(dataDetail.height);//高
            $(".attr-text").text(goodsClass+" "+material+" "+accessories+" "+shape+" "+technology+" "+color);//产品属性
            $(".order-requ").text(dataDetail.designMemo || "暂无");//具体要求

            function referenceImage () {
                var srcArray = [];//参考图
                for (var i = 1; i <= 3; i++) {
                    if (dataDetail['smallReferenceImage' + i]) {
                        var orgSrc = dataDetail['middleReferenceImage' + i];
                        orgSrc = orgSrc.indexOf('http:') >= 0 ? orgSrc : "http://" + orgSrc;
                        var thumbnail = dataDetail['smallReferenceImage' + i];
                        thumbnail = thumbnail.indexOf('http:') >= 0 ? thumbnail : "http://" + thumbnail;
                        srcArray.push({"orgSrc": orgSrc, "thumbnail": thumbnail});
                    }
                }
                return srcArray
            }

            function accessory () {
                var accessoryArray = [];//设计附件
                if (dataDetail.accessoryFile) {
                    var accessoryFile = dataDetail['accessoryFile'];
                    accessoryFile = accessoryFile.indexOf('http:') >= 0 ? accessoryFile : "http://" + accessoryFile;
                    accessoryArray.push({
                        "uri": accessoryFile,
                        "name": accessoryFile,
                    });
                }
                return accessoryArray;
            }

            uploadfile.uploadPhoto('detas_prod', 1, referenceImage(), false);//参考图
            if(accessory().length>0)
            {
                $('.quote-1').removeClass("hide");
                uploadfile.uploadFile('other_encl_second', 1, accessory(), false, "", "", true);//附件
            }


            //立即抢单
            if (command.indexOf("ACCEPT_DESIGN")>=0) {
                $('.prod-details').removeClass('hide');
                $(".design-attr-btn").on('click',function () {
                    var url = config.WebService()["orderDesignInfo_Update"];
                    Requst.ajaxPost(url, {"wId":parseInt(dataDetail.designId)}, true, function (data) {
                        if (data.code ==200){
                            top.Message.show("提示",data.message,MsgState.Success,2000);
                            top.classMain.loadOverview(null,null,null,customid);
                            window.location.reload();
                        }
                    });
                })
            }
            else
            {
                $(".desiDeta-title").removeClass('hide');

                uploadfile.uploadPhoto('deta_prod', 3, referenceImage(), false);//参考图

                if(accessory().length>0)
                {
                    $('.quote-1').removeClass("hide");
                    uploadfile.uploadFile('referenceAccessory', 1, accessory(), false, "", "", true);//附件
                }

                details.initDesignDraft();//初始化提交设计稿区域
                details.refreshDraft();//刷新设计方案
                details.leavShow();//显示留言
            }
        });
        $('.desiDeta-content').removeClass('hide');
    },
    SubmitDesign: function () {
        // if (this.producestatus>=3){
        //     Message.show('提示','订单已经发起生产，设计稿相关内容不可使用',3,2000);
        //     return false;
        // }
        var url = config.WebService()["orderDesignPattern_Insert"];
        var data = {
            "initialDesignImage1": "",
            "smallDesignImage1": "",
            "middleDesignImage1": "",
            "initialDesignImage2":'',
            "smallDesignImage2":'',
            "middleDesignImage2":'',
            "initialDesignImage3":'',
            "smallDesignImage3":'',
            "middleDesignImage3":'',
            "designFile": "",
            "otherFile":"",
            "designMemo": $(".design-rema textarea").val(),
            "designId" : 1,
            "customid": customid,
            "ordersummaryId":dataDetail.id,
            "orderid": dataDetail.orderid,
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

        //设计稿
        var diagram = $("#prod_refe .diagram-container .diagram");
        if(diagram.length==0)
        {
            top.Message.show('提醒', "请上传设计稿", MsgState.Fail, 2000);
            return;
        }
        for (var i = 0; i < diagram.length; i++) {

            if (typeof $(diagram[i]).attr('data-complete') != "undefined" && $(diagram[i]).attr('data-complete') != "complete") {
                top.Message.show('提醒', "设计稿正在上传请等待...", MsgState.Fail, 2000);
                return;
            }
            data['initialDesignImage' + (i + 1)] = diagram[i].getAttribute('data-oimageurl');
            data['middleDesignImage' + (i + 1)] = diagram[i].getAttribute('data-mimageurl');
            data['smallDesignImage' + (i + 1)] = diagram[i].getAttribute('data-simageurl');
        }

        //设计附件
        var designFile = $("#details_encl .accessory-container .fileitem");
        if(designFile.length==0)
        {
            top.Message.show('提醒', "请上传附件", MsgState.Fail, 2000);
            return;
        }
        if (designFile && designFile.length > 0) {
            if (typeof $(designFile[0]).attr('data-complete') != "undefined" && $(designFile[0]).attr('data-complete') != "complete") {
                top.Message.show('提醒', "附件正在上传请等待...", MsgState.Fail, 2000);
                return;
            }
            designFile = $(designFile[0]).attr('data-url');
            data["designFile"] = designFile;
        }

        //设计其他附件
        var designOtherFile = $("#details_encl_next .accessory-container .fileitem");
        if (designOtherFile && designOtherFile.length > 0) {
            if (typeof $(designOtherFile[0]).attr('data-complete') != "undefined" && $(designOtherFile[0]).attr('data-complete') != "complete") {
                top.Message.show('提醒', "其他附件正在上传请等待...", MsgState.Fail, 2000);
                return;
            }
            designOtherFile = $(designOtherFile[0]).attr('data-url');
            data["otherFile"] = designOtherFile;
        }

        //备注参考图
        var remarkDiagram = $("#details_encl_textarea .diagram-container .diagram");
        for (var i = 0; i < remarkDiagram.length; i++) {
            if (typeof $(remarkDiagram[i]).attr('data-complete') != "undefined" && $(remarkDiagram[i]).attr('data-complete') != "complete") {
                top.Message.show('提醒', "设计稿正在上传请等待...", MsgState.Fail, 2000);
                return;
            }
            data['initialRemarkImage' + (i + 1)] = remarkDiagram[i].getAttribute('data-oimageurl');
            data['middleRemarkImage' + (i + 1)] = remarkDiagram[i].getAttribute('data-mimageurl');
            data['smallRemarkImage' + (i + 1)] = remarkDiagram[i].getAttribute('data-simageurl');
        }

        Requst.ajaxPost(url, data, true, function (data) {
             if (data.code ==200){
                 top.Message.show('提示',data.message,MsgState.Success,2000,function () {
                     details.getData();
                 });
             }
        });

    },//提交设计稿
    refreshDraft:function () {
        //刷新设计稿
        if (dataDetail.designInfo.length>0) {
            $(".design-man").removeClass('hide');
            $(".for-design-box").html('');
            for (var i = 0; i < dataDetail.designInfo.length; i++) {
                var commit_time = dataDetail.designInfo[i].commitTime.replace(/\-/g, "/");
                commit_time = new Date(commit_time);
                commit_time = commit_time.Format("yyyy-MM-dd hh:mm:ss");
                var design_memo = dataDetail.designInfo[i].designMemo || "";
                var srcMan = [];//设计稿版本图片
                var srcFile = [];//设计稿版本附件
                var otherFile = [];//设计稿版本其他附件
                var remaMan = [];//设计稿版本备注图片

                if (dataDetail.designInfo[i].initialDesignImage1) {
                    srcMan.push({
                        "orgSrc": 'http://' + dataDetail.designInfo[i].initialDesignImage1,
                        "thumbnail": 'http://' + dataDetail.designInfo[i].smallDesignImage1,
                    });
                }
                if (dataDetail.designInfo[i].designFile) {
                    srcFile.push({
                        "uri": 'http://' + dataDetail.designInfo[i].designFile,
                        "name": customid,
                    });
                }
                if (dataDetail.designInfo[i].otherFile) {
                    otherFile.push({
                        "uri": 'http://' + dataDetail.designInfo[i].otherFile,
                        "name": customid,
                    });
                }
                if (dataDetail.designInfo[i].middleRemarkImage1) {
                    if(dataDetail.designInfo[i].middleRemarkImage1)
                    {
                        remaMan.push({
                            "orgSrc": 'http://' + dataDetail.designInfo[i].middleRemarkImage1,
                            "thumbnail": 'http://' + dataDetail.designInfo[i].smallRemarkImage1,
                        });
                    }

                    if(dataDetail.designInfo[i].middleRemarkImage2)
                    {
                        remaMan.push({
                            "orgSrc": 'http://' + dataDetail.designInfo[i].middleRemarkImage2,
                            "thumbnail": 'http://' + dataDetail.designInfo[i].smallRemarkImage2,
                        });
                    }

                    if(dataDetail.designInfo[i].middleRemarkImage3)
                    {
                        remaMan.push({
                            "orgSrc": 'http://' + dataDetail.designInfo[i].middleRemarkImage3,
                            "thumbnail": 'http://' + dataDetail.designInfo[i].smallRemarkImage3,
                        });
                    }
                }

                var selected=dataDetail.designInfo[i].status==3?"":"hide";//是否已选定该方案
                var designDraft = $("<div class='for-design'>" +
                    "<div class='design-next-title'>" +
                    "<h3>版本" +
                    "<span>" + dataDetail.designInfo[i].version + "</span>" +
                    "</h3>" +
                    "<div style='height:1px;border:none;border-top:2px solid #f5f5f5;display: inline-block;width: 842px;'></div>" +
                    "</div>" +
                    "<div class='design-bg "+selected+"'>" +
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
                    "</div>" +
                    "</div>");
                $(".for-design-box").append(designDraft);

                if (dataDetail.designInfo.length > 1 && i == 0) //历史版本 画线
                {
                    var line = $("<div class='history-line fl'><div style='margin-left: 50px;'><span class='left  fl'></span> <span class='title  fl'> 查看历史版本 </span> <span class='right  fl'></span></div></div>");
                    $(designDraft.find('.design-content')).append(line);
                }

                uploadfile.uploadPhoto('edit_desi_' + i, 1, srcMan, false);//设计稿版本图片
                uploadfile.uploadFile('desi_encl_' + i, 1, srcFile, false, "", "", true);//设计稿版本附件回显
                uploadfile.uploadFile('other_encl_' + i, 1, otherFile, false, "", "", true);//设计稿版本其他附件回显
                uploadfile.uploadPhoto('planner_leav_' + i, 3, remaMan, false);//设计稿版本留言图片
            }
        }
    },
    leavShow: function () { //显示留言
        var url = config.WebService()["orderDesignMessage_Query"];
        Requst.ajaxGet(url, {"customid": customid}, true, function (data) {
            if(dataDetail.designInfo.length==0 || (dataDetail.designInfo.length>0 && dataDetail.designInfo[0].version==0))
            {
                $(".leav-title-right-text").html('设计前沟通中');
            }
            else
            {
                $(".leav-title-right-text").html('版本<em id="interaction_ver">-</em>沟通中');
            }
            if (data.data && data.data.length > 0) {
                $("#interaction_ver").text(data.data[data.data.length-1].version);//版本号沟通中
                $('.leav-box .leav-content').html('');//清空留言区域

                var messageVer=0;//留言版本
                for (var i = 0; i < data.data.length; i++) {
                    var srcMan = [];//留言显示图片
                    var messageFile = [];//留言显示附件
                    for (var j = 1; j <= 3; j++) {
                        if (data.data[i]['middleMessageImage' + j]) {
                            var orgSrc = data.data[i]['middleMessageImage' + j];
                            orgSrc = orgSrc.indexOf('http:') >= 0 ? orgSrc : "http://" + orgSrc;
                            var thumbnail = data.data[i]["smallMessageImage" + j];
                            thumbnail = thumbnail.indexOf('http:') >= 0 ? thumbnail : "http://" + thumbnail;
                            srcMan.push({"orgSrc": orgSrc, "thumbnail": thumbnail});
                        }
                    }

                    if (data.data[i].messageFile) {
                        var accessoryFile = data.data[i].messageFile;
                        accessoryFile = accessoryFile.indexOf('http:') >= 0 ? accessoryFile : "http://" + accessoryFile;
                        messageFile.push({
                            "uri": accessoryFile,
                            "name": customid,
                        });
                    }

                    var plan = $("<div class='leav-reg'>" +
                        "<div class='leav-text-first'>" +
                        "<div class='TextList-left'>" +
                        "<span>"+data.data[i].leaverNickName+"</span>回复" +
                        "<a>"+data.data[i].targetNickName+"</a>：" +
                        "</div>" +
                        "<div class='TextList-right'>" +
                        "<span>" + data.data[i].leaveTime + "</span>" +
                        "</div>" +
                        "</div>" +
                        "<div class='leav-text-second'>" + data.data[i].messageContent + "</div>" +
                        "<div class='clearfix'>" +
                        "<div class='leav-reg-img'>" +
                        "<div id='leav_img_" + i + "'></div>" +
                        "</div>" +
                        "<div class='leav-reg-file'>" +
                        "<div id='leav_file_" + i + "' data-type='' data-customid='" + customid + "'>" +
                        "</div>" +
                        "</div>"+
                        "</div>"+
                        "</div>");

                    $(".leav-content").append(plan);
                    if (srcMan.length > 0) {
                        uploadfile.uploadPhoto('leav_img_' + i, 3, srcMan, false);//留言显示图片
                    }
                    if (messageFile.length > 0) {
                        uploadfile.uploadFile('leav_file_' + i, 1, messageFile, false, "", "", true);//留言附件回显
                    }
                    
                    if(messageVer==0 && messageVer!=data.data[i].version)
                    {
                        var line=$('<div class="history-line fl"><div><span class="left  fl"></span> <span class="title  fl"> 以上信息为设计前沟通 </span> <span class="right  fl"></span></div></div>');
                        plan.append(line);
                        messageVer=data.data[i].version;
                    }
                    else if(messageVer!=data.data[i].version)
                    {
                        var line=$('<div class="history-line fl"><div><span class="left  fl"></span> <span class="title  fl"> 版本 '+ data.data[i].version+' </span> <span class="right  fl"></span></div></div>');
                        plan.append(line);
                        messageVer=data.data[i].version;
                    }
                }
                //自动滚动到底部
                $(".leav-content").scrollTop($(".leav-content")[0].scrollHeight);
            }
        }, null, true);
    },
    leavBtn: function () { //提交留言
        //最新的一张设计稿
        var newDesign = dataDetail.designInfo && dataDetail.designInfo.length > 0 ? dataDetail.designInfo[0] : {
            "id": 0,
            "version": 0
        };
        newDesignVer = newDesign.version;

        var messageContent = $.trim($(".leav-bottom-input input").val());
        if (!messageContent) {
            Message.show('提醒', "回复内容不能为空", MsgState.Fail, 2000);
            return;
        }

        var data = {
            "ordersummaryId": dataDetail.id,
            "designPatternId": newDesign.id,
            "version": parseInt(newDesign.version),
            "orderid": dataDetail.orderid,
            "customid": dataDetail.customid,
            "messageContent": messageContent,
            "initialMessageImage1": "",
            "middleMessageImage1": "",
            "smallMessageImage1": "",
            "initialMessageImage2": "",
            "middleMessageImage2": "",
            "smallMessageImage2": "",
            "initialMessageImage3": "",
            "middleMessageImage3": "",
            "smallMessageImage3": "",
            "needReDesign": 0,
            "messageFile": ""
        }

        //附件
        var messageFile = $("#leav_bottom_file .accessory-container .fileitem");
        if (messageFile && messageFile.length > 0) {
            if (typeof $(messageFile[0]).attr('data-complete') != "undefined" && $(messageFile[0]).attr('data-complete') != "complete") {
                Message.show('提醒', "留言附件正在上传请等待...", MsgState.Fail, 2000);
                return;
            }
            messageFile = $(messageFile[0]).attr('data-url').indexOf('http:') >= 0 ? $(messageFile[0]).attr('data-url') : "http://" + $(messageFile[0]).attr('data-url');
            data["messageFile"] = messageFile;
        }

        //图片
        var diagram = $("#leav_bottom_img .diagram-container .diagram");
        for (var i = 0; i < diagram.length; i++) {// 添加设计图片

            if (typeof $(diagram[i]).attr('data-complete') != "undefined" && $(diagram[i]).attr('data-complete') != "complete") {
                Message.show('提醒', "留言图片正在上传请等待...", MsgState.Fail, 2000);
                return;
            }

            data['initialMessageImage' + (i + 1)] = diagram[i].getAttribute('data-oimageurl');
            data['middleMessageImage' + (i + 1)] = diagram[i].getAttribute('data-mimageurl');
            data['smallMessageImage' + (i + 1)] = diagram[i].getAttribute('data-simageurl');
        }

        var url = config.WebService()["orderDesignMessage_Insert"];
        Requst.ajaxPost(url, data, true, function (data) {
            if (data.code == 200) {
                $(".leav-bottom-input input").val("");
                details.leavShow();
            }
        });
    }
    
}
