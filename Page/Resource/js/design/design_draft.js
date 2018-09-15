// 设计稿
var uploadstate = 0;
var design_draft = {
    getUrl: {},//请求接口的URL
    getDataInterface: {},//请求数据的接口
    functionalInterface: {},//操作功能的接口
    userInfo: {},//用户信息
    uploadListDoc: $("#uploadedList"),
    init: function () {//初始化

        design_draft.getUrl = parent.Common.getUrl();//获取请求接口的URL
        design_draft.getDataInterface = parent.Common.getDataInterface();//获取请求数据的接口
        design_draft.functionalInterface = parent.Common.functionalInterface();//获取操作功能的接口
        design_draft.userInfo = parent.Main.userInfo;//获取用户信息
        //点击空白隐藏搜索下拉菜单或个人中心下拉菜单
        $(window).click(function () {
            if (parent.Main.currentClickObj) {
                $(parent.Main.currentClickObj).hide();
                parent.Main.currentClickObj = null;
            }
        })

        //初始化上传操作
        var orderId = Common.getUrlParam("orderId");//订单号
        var customid = Common.getUrlParam("customid");//客户id

        sessionStorage.setItem("src", "./design/design_draft.html?customid=" + customid + "&orderId=" + orderId);

        var inputFilePoto = document.querySelector('#input_file');//上传图片
        var inputFileAnnex = document.querySelector('#input_file_1');//上传附件
        var inputFileAnnex2 = document.querySelector('#input_file_2');//上传其他附件

        //初始化图片上传******
        if (inputFilePoto) {
            design_draft.uploadInit(orderId, customid, inputFilePoto, $("#upload_btn"), function (uri, name, files) {//选择文件后调用
                    return design_draft.insertPhoto(uri, name, files);//插入图片
                },
                function (err, data, imgId) {//上传成功后调用
                    var str_url = (data.url).substr((data.url).indexOf(".com/") + 5);
                    $("#" + imgId).attr('data-Url', str_url);
                }
                , "photo", function (progress, docId) {
                    $("#" + docId).attr('progress', progress);
                    $("#" + docId).find(".progress").text(progress + "%");
                });
        }

        //初始化附件上传******
        if (inputFileAnnex)
        {
            design_draft.uploadInit(orderId, customid, inputFileAnnex, $("#upfile"), function (uri, name, files) {//选择文件后调用
                    return design_draft.insertFile(name);//显示已上传附件
                },
                function (err, data, fileId) {//上传成功后调用
                    var str_url = (data.url).substr((data.url).indexOf(".com/") + 5);
                    $("#" + fileId).attr('data-Url', str_url);
                }
                , "file", function (progress, docId) {
                    $("#" + docId).attr('progress', progress);
                    $("#" + docId).find(".progress").text(progress + "%");
                });
        }

        if (inputFileAnnex2) {
            //初始化其他附件上传******
            design_draft.uploadInit(orderId, customid, inputFileAnnex2, $("#o_upfile"), function (uri, name, files) {//选择文件后调用
                    return design_draft.insertFile(name, "#o_filelist");//显示已上传附件
                },
                function (err, data, fileId) {//上传成功后调用
                    var str_url = (data.url).substr((data.url).indexOf(".com/") + 5);
                    $("#" + fileId).attr('data-Url', str_url);
                }
                , "o_file", function (progress, docId) {
                    $("#" + docId).attr('progress', progress);
                    $("#" + docId).find(".progress").text(progress + "%");
                });
        }

        design_draft.getData(orderId, customid);//加载数据

        parent.Main.redDot();//更新导航红点数值

        //添加拖拽事件
        var updesign = $(".updesign")[0];
        if(updesign)
        Common.dragBind(updesign, inputFilePoto, {"border": "2px dashed #5d5d5d"}, {"border": "2px dashed #eee"});//图片拖拽上传


        var upfile = $(".upfile")[0];
        if(upfile)
        Common.dragBind(upfile, inputFileAnnex, {"border": "2px dashed #5d5d5d"}, {"border": "2px dashed #eee"});//附件拖拽上传

        var upfile2 = $(".o_upfile")[0];
        if(upfile2)
        Common.dragBind(upfile2, inputFileAnnex2, {"border": "2px dashed #5d5d5d"}, {"border": "2px dashed #eee"});//其他附件拖拽上传


    },
    uploadInit: function (orderId, customid, inputFileObj, clickObj, callback, uploadSuccessCallback, filetype, progressCallback) {//初始化上传
        if (clickObj) {
            clickObj.on('click', function (e) {
                inputFileObj.click();
            })
        }

        // 选择文件成后
        inputFileObj.addEventListener('change', function (e) {

            var files = inputFileObj.files;
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var uri = design_draft.getObjectURL(file);
                var name = file.name;
                var index= name.lastIndexOf('.');
                var type = name.slice(index+1).toLowerCase();
                
                //var createDate = file.lastModifiedDate.toLocaleDateString(); //safari浏览器不支持
                var size = file.size / 1024 / 1024;
                if (filetype == "photo" && size > 10) {
                    Common.msg("请上传小于10MB的图片");
                    return;
                }
                else if (filetype == "file" && size > 50) {
                    Common.msg("请上传小于50MB的文件");
                    return;
                }

                
                //.cdr,.ai,.psd,.pdf
                if (filetype == "file" && type.indexOf('cdr') < 0 && type.indexOf('ai') < 0 && type.indexOf('psd') < 0 && type.indexOf('pdf') < 0 && type.indexOf('eps') < 0) {
                    Common.msg("上传文件格式不正确");
                    return;
                }

                if (filetype == "photo" && type.indexOf('jpg') < 0 && type.indexOf('jpeg') < 0 && type.indexOf('png') < 0 && type.indexOf('gif') < 0) {
                    Common.msg("上传图片格式不正确");
                    return;
                }

                var isupload = callback(uri, name, files);//展示选择的文件
                if (!isupload) {
                    return false;
                }
                uploadstate += 1;
                cosUploadFile(file, function (err, data, docId) {//上传完成回调
                    uploadstate -= 1;
                    uploadSuccessCallback(err, data, docId);
                }, isupload, progressCallback, orderId);
            }
        });
    },
    getObjectURL: function (file) {//获取图片本地路径
        var url = null;
        if (window.createObjectURL != undefined) { // basic
            url = window.createObjectURL(file);
        } else if (window.URL != undefined) { // mozilla(firefox)
            url = window.URL.createObjectURL(file);
        } else if (window.webkitURL != undefined) { // webkit or chrome
            url = window.webkitURL.createObjectURL(file);
        }
        return url;
    },
    insertPhoto: function (uri, name, file) {  //图片上传区域添加图片
        if (design_draft.uploadListDoc.find('.img').length >= 1) {
            Common.msg("设计图只能上传1张");
            return false;
        }
        var timestamp = Common.getTimestamp() + Math.random();
        timestamp = timestamp.toString().replace(".", "_");
        var photoDiv = $("<div id='t_" + timestamp + "' data-name='" + name + "'  class='img''> <span class='progress'></span> <img src='" + uri + "' /><span onClick='design_draft.deletePhoto(\"t_" + timestamp + "\",\"" + name + "\")' class='x'></span></div>");
        design_draft.uploadListDoc.append(photoDiv);
        return "t_" + timestamp;
    },
    deletePhoto: function (imgId, name) {//删除图片
        $("#" + imgId).remove();
        var inputFile = document.querySelector('#input_file');//上传图片
        inputFile.value = '';
    },
    insertFile: function (filename,listId) {
        var newfilename = filename;
        if (filename.length > 20) {
            newfilename = newfilename.substring(0, 20) + "...";
        }
        var timestamp = Common.getTimestamp() + Math.random();
        timestamp = timestamp.toString().replace(".", "_");
        var file = $("<li id='t_" + timestamp + "' data-name='" + filename + "' class=\"file\"  ><div> <span class='progress' style='position: absolute; left: 390px;'></span> <span title=\"" + filename + "\" style=\"display: block;overflow: hidden;height: 31px;width: 196px;position: absolute; cursor:pointer;\">" + newfilename + "</span><span onClick='design_draft.deleteFile(\"t_" + timestamp + "\")' class=\"del_btn\">删除</span></div></li>");
        if(listId)
        {
            $(listId).html(file);
        }
        else
        {
            $("#filelist").html(file);
        }

        return "t_" + timestamp;
    },
    deleteFile: function (docId) {
        $("#" + docId).remove();
        var inputFile = document.querySelector('#input_file_1');//上传附件
        inputFile.value = '';
    },
    getData: function (orderId, customid) {
        var url = design_draft.getUrl["order"] + design_draft.getDataInterface["demand_details"];//获取订单详情接口地址
        var cosImgUrl = design_draft.getUrl["cosImgUrl"];

        Common.ajax(url, {
                "orderId": orderId,
                "userId": design_draft.userInfo.userid,
                "customId": customid,
                "roleType": design_draft.userInfo.roletype,
                "token": design_draft.userInfo.token
            },
            true,
            function (data) {
                if (data) {//模块展示控制
                    try {
                        if(typeof neworder!= "undefined")
                            return
                        
                        if (data.status.code == 0) {

                            var ordersummary = data.ordersummary;
                            var orderstate = ordersummary.state.orderstate.orderstate;//订单状态

                            if (ordersummary.state.designreceivestate.code == 0)//详情跳转页面
                            {
                                window.location.href = "./demand_details.html?customid=" + customid + "&orderId=" + orderId;
                            }

                            
                            if (data.orderaddinfo.accessoryurl) {
                                $("#fileName").val(data.orderaddinfo.accessoryid);
                                $("#fileName").attr('title', data.orderaddinfo.accessoryid);
                                $("#download").attr("href", "javascript:Common.download(\"" + cosImgUrl + data.orderaddinfo.accessoryurl + "\")");
                            }
                            else {
                                $(".attachment").addClass('hide');
                                $(".download").addClass('hide');
                            }

                            if (data.orderaddinfo) {
                                if (data.orderaddinfo.imageurl1) {
                                    $(".design-diagram-layout-photo").append($("<div class=\"photo-container fl\"><img data-original=\"" + cosImgUrl + data.orderaddinfo.imageurl1 + "\" src=\"" + cosImgUrl + data.orderaddinfo.imageurl1 + "\" onerror=\"this.src='../../images/icon/loading.gif'\"><!--<div class=\"cover active\"></div>--></div>"));
                                }
                                if (data.orderaddinfo.imageurl2) {
                                    $(".design-diagram-layout-photo").append($("<div class=\"photo-container fl\"><img data-original=\"" + cosImgUrl + data.orderaddinfo.imageurl2 + "\" src=\"" + cosImgUrl + data.orderaddinfo.imageurl2 + "\" onerror=\"this.src='../../images/icon/loading.gif'\"><!--<div class=\"cover active\"></div>--></div>"));
                                }
                                if (data.orderaddinfo.imageurl3) {
                                    $(".design-diagram-layout-photo").append($("<div class=\"photo-container fl\"><img data-original=\"" + cosImgUrl + data.orderaddinfo.imageurl3 + "\" src=\"" + cosImgUrl + data.orderaddinfo.imageurl3 + "\" onerror=\"this.src='../../images/icon/loading.gif'\"><!--<div class=\"cover active\"></div>--></div>"));
                                }

                                if (data.orderaddinfo.imageurl1 || data.orderaddinfo.imageurl2 || data.orderaddinfo.imageurl3) {
                                    $(".design-diagram-layout-photo").show();
                                }

                                $(".design-diagram-layout-photo").viewer({
                                    url: 'data-original'
                                });
                            }

                            //当前订单状态
                            // if (orderstate == 2) {//待接单
                            //     design_draft.showModule("orderInfo", data);
                            // }


                            /*else*/
                            if (orderstate == 3 || orderstate == 2)//待设计+设计中
                            {
                                $("#submit").html("提交设计稿");
                                design_draft.showModule("orderInfo", data);
                                design_draft.showModule("upload", data);
                            }
                            else if (orderstate == 4)//待确认
                            {
                                design_draft.showModule("orderInfo", data);
                                design_draft.showModule("programme", data);
                            }
                            else if (orderstate == 3 || orderstate == 5)//待修改
                            {
                                $("#submit").html("修改设计稿");
                                design_draft.showModule("orderInfo", data);
                                design_draft.showModule("upload", data);
                                design_draft.showModule("programme", data);
                            }
                            else if (orderstate == 14) {//取消订单
                                design_draft.showModule("orderInfo", data);
                                design_draft.showModule("programme", data);
                            }
                            else if (orderstate == 16) {//完成订单
                                design_draft.showModule("orderInfo", data);
                                design_draft.showModule("programme", data);
                            }
                            else if (orderstate >= 6)//已定稿
                            {
                                design_draft.showModule("orderInfo", data);
                                design_draft.showModule("programme", data);
                            }
                            if (data.designinfo.designer != null && data.designinfo.designer.length > 0) {
                                if (data.designinfo.designer[0].designerpattern[0].patterniamgeurl1 || data.designinfo.designer[0].designerpattern[0].patterniamgeurl2 || data.designinfo.designer[0].designerpattern[0].patterniamgeurl3) {
                                    design_draft.showModule("programme", data);
                                }
                            }
                        }
                        else
                        {
                            Common.msg(data.status.msg,null,2000,function () {
                                window.location.href = "./all_order.html";
                            });
                        }
                    }
                    catch (e) {

                    }
                }
            }
        );
    },
    submitDesign: function (state) {//提交设计

        if (uploadstate > 0) {
            Common.msg("正在上传请稍后...", null, 2000);
            return;
        }
        var orderId = Common.getUrlParam("orderId");//订单号
        var customid = Common.getUrlParam("customid");//客户id

        var url = design_draft.getUrl["order"] + design_draft.functionalInterface["submit_design"];//提交设计接口地址

        var imageList = design_draft.uploadListDoc.find('.img');//设计图
        var file = $("#filelist").find('.file');//附件

        if (imageList.length <= 0 && file.length <= 0) {
            Common.msg("请上传设计稿或附件");
            return;
        }


        var submit_btn = $("#submit");
        submit_btn.attr("disabled", true);

        var otherFile=$("#o_filelist").find("li");

        Common.ajax(url, {
                "userid": design_draft.userInfo.userid,
                "orderid": orderId,
                "customid": customid,
                "roletype": design_draft.userInfo.roletype,
                "token": design_draft.userInfo.token,
                "commandcode": 146,
                "patternimageurl1": imageList.length >= 1 ? $(imageList[0]).attr("data-url") : "",//设计图1
                "patternimageurl2": imageList.length >= 2 ? $(imageList[1]).attr("data-url") : "", //设计图2
                "patternimageurl3": imageList.length >= 3 ? $(imageList[2]).attr("data-url") : "", //设计图3
                "patternaccessoryurl": file.length >= 1 ? $(file[0]).attr("data-url") : "", //设计附件cos的名称
                "patternaccessoryid": file.length >= 1 ? $(file[0]).attr("data-name") : "", //涉及附件原名
                "patternmemo": $("#explain").val(),  //设计备注
                "otherAccessoryUrl":otherFile.length >= 1 ? $(otherFile[0]).attr("data-url") : "",
            },
            true,
            function (data) {//提交设计成功
                // Common.msg("操作成功", 200);
                // setTimeout(function () {
                //     window.location.reload(true);//重新加载当前页面
                // }, 2000)
                Common.msg(data.status.msg, data.status.code == 0 ? 200 : null, 2000, function () {
                    submit_btn.attr("disabled", false);
                    if (data.status.code == 0) {
                        window.location.reload(true);//重新加载当前页面
                    }
                });
            }, function (err) {
                submit_btn.attr("disabled", false);
            });
    },
    showModule: function (moduleName, data) {
        var cosImgUrl = design_draft.getUrl["cosImgUrl"];
        var orderInfo = $("#orderInfo");
        var detail = $("#detail");
        var upload = $(".upload");
        var programme = $(".programme");

        var ordersummary = data.ordersummary;
        var orderDate = ordersummary.orderinfo.createtime;
        var orderId = ordersummary.orderinfo.orderid;
        var imageSrc = ordersummary.orderinfo.goodsimage;
        var accessoriesname = ordersummary.goodsinfo.accessoriesname;//蝴蝶扣
        var texturename = ordersummary.goodsinfo.texturename;//锌合金
        var goodsclass = ordersummary.orderinfo.goodsclass;//"徽章"
        var shape = ordersummary.goodsinfo.shape;//"2D;"
        var technology = ordersummary.goodsinfo.technology;//"柯氏;"
        var color = ordersummary.goodsinfo.color;
        var customid = ordersummary.orderinfo.customid;
        var remarks = data.orderaddinfo.remarks;//描述信息
        //尺寸
        var l = ordersummary.goodsinfo.size.length;
        var w = ordersummary.goodsinfo.size.width;
        var h = ordersummary.goodsinfo.size.height;

        var designprice = ordersummary.price.designprice;//设计费
        var orderstate = ordersummary.state.orderstate.orderstate;//订单状态
        var designinfo = data.designinfo;//设计方案

        var designer = designinfo.designer;
        var isShowProgramme = false;

        switch (moduleName) {
            case "orderInfo": //单据基础信息展示
                $("#ordNum").html('订单号: ' + orderId);
                $("#money").html('¥' + designprice);
                $("#size").html(l + "mm＊" + w + "mm＊" + h + "mm");
                $("#attr_info").html(goodsclass + " " + texturename + " " + accessoriesname + " " + shape + " " + technology + " " + color);
                $("#requ_info").html(remarks);
                orderInfo.show();
                detail.show();
                break;
            case "upload"://上传模块
                upload.show();
                $("#submit").click(function () {
                    design_draft.submitDesign();
                });
                break;
            case "programme"://设计稿模块
                if (designer != null) {
                    $.each(designer, function (i, item) {
                        var designername = item.designername;//设计师名字
                        item = item.designerpattern[0];
                        var feedbackstatus = item.feedbackstatus;

                        var patterncommittime = item.patterncommittime;//方案提交时间

                        $(".designName").html(designername);
                        $(".design .date").html(patterncommittime);
                        $(".remarks-info").html(item.patternmemo);
                        $("#photo").html('');
                        if (item.patterniamgeurl1) {
                            $("#photo").append($("<div class=\"img\"> <img data-original='" + cosImgUrl + item.patterniamgeurl1 + "' src=\"" + cosImgUrl + item.patterniamgeurl1 + "\"></div>"));
                        }
                        if (item.patterniamgeurl2) {
                            $("#photo").append($("<div class=\"img\"> <img data-original='" + cosImgUrl + item.patterniamgeurl2 + "' src=\"" + cosImgUrl + item.patterniamgeurl2 + "\"></div>"));
                        }
                        if (item.patterniamgeurl3) {
                            $("#photo").append($("<div class=\"img\"> <img data-original='" + cosImgUrl + item.patterniamgeurl3 + "' src=\"" + cosImgUrl + item.patterniamgeurl3 + "\"></div>"));
                        }
                        // $(".attachment")
                        if (item.patternaccessoryid) {//附件下载
                            var fileName = item.patternaccessoryid;
                            if (fileName.length > 20) {
                                fileName = fileName.substring(0, 20) + "...";
                            }
                            $(".attachment .org label").html(fileName);
                            $(".attachment .org label").attr("title", item.patternaccessoryid);
                            $(".attachment .org span").on('click', function () {
                                Common.download(cosImgUrl + item.patternaccessoryurl);
                            });
                            $(".attachment").show();
                            $(".download").show();
                        }
                        else {
                            $(".attachment").hide();
                        }

                        //其他附件
                        if (item.otherAccessoryUrl) {//附件下载
                            var fileName = item.otherAccessoryUrl;
                            if (fileName.length > 20) {
                                fileName = fileName.substring(0, 20) + "...";
                            }
                            $(".attachment .otherfile label").html(fileName);
                            $(".attachment .otherfile label").attr("title", item.otherAccessoryUrl);
                            $(".attachment .otherfile span").on('click', function () {
                                Common.download(cosImgUrl + item.otherAccessoryUrl);
                            });
                            $(".otherfile").removeClass("hide");
                        }

                        if (item.feedback) {//客服返回
                            //$(".kffk").html();//客服昵称
                            $(".fknr").html(item.feedback);
                            $(".date-hf .date").html(item.userfeedbacktime);
                            $(".message").show();
                        }
                        else {
                            $(".message").hide();
                        }

                        //选定设计方案

                        if (feedbackstatus == 2) {
                            $("#xdsjfa").show();
                        }

                    });

                    //图片预览插件
                    $('#photo').viewer({
                        url: 'data-original',
                    });
                    programme.show();
                }
                break;
        }
    }
}

//初始化
$(function () {
    design_draft.init();
})