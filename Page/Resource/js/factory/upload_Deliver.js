
/**
 * Created by inshijie on 2018/7/5.
 * 产品图
 */

var orderid = Common.getUrlParam('orderid', true);
$(function () {
    var inputFilePoto = document.querySelector('#input_file');//上传图片

    
    if($.cookie('roletype')=="3")
    {
        
        $(".ok").removeClass('hide');
        var imgList= $('.upload-photo').find('.upload-photo-btn');
        for(var i=0;i<imgList.length;i++)
        {
            $(imgList[i]).removeClass('hide');
        }
    }
    else {
        $('.del').addClass("hide");
    }
    
    //获取图片
    modifyDesign.getData();

    if($.cookie('roletype')=="3") {

        //初始化图片上传******
        modifyDesign.uploadInit(orderid, "", inputFilePoto, $(".upload-photo-btn"), function (uri, name, files, size, clickObj) {//选择文件后调用
                return modifyDesign.insertPhoto(uri, name, files, size, clickObj);//插入图片
            },
            function (err, data, imgId) {//上传成功后调用
                var str_url = (data.url).substr((data.url).indexOf(".com/") + 5);
                $("#" + imgId).attr('data-Url', str_url);
            }
            , "photo", function (progress, docId) {
                $("#" + docId).attr('progress', progress);
                $("#" + docId).find(".progress").text(progress + "%");
            });
        //图片拖拽事件
        var updesign = $(".upload-photo")[0];
        updesign.ondragover = function (ev) {
            //阻止浏览器默认打开文件的操作
            ev.preventDefault();
            //拖入文件后
            $(this).css({"border": "2px dashed #5d5d5d"});
        }

        updesign.ondragleave = function () {
            //拖出
            $(this).css({"border": "2px dashed #eee"});
        }
        updesign.ondrop = function (ev) {
            //放下
            $(this).css({"border": "2px dashed #eee"});
            //阻止浏览器默认打开文件的操作
            ev.preventDefault();

            // //判断只是否三张图片都存在
            var imageDivs = $(".upload-photo .upload-photo-btn");
            var imgcount = 0;//记录图片空缺
            
            for (var k = 0; k < imageDivs.length; k++) {
                var isUrl = $(imageDivs[k]).is('[data-url]');
                var isName = $(imageDivs[k]).is('[data-name]');
                if ((!isUrl && !isName) || isUrl && $(imageDivs[k]).attr('data-url') == "" && (!isName || (isName && $(imageDivs[k]).attr('data-name') == ""))) {
                    imgcount++;
                }
            }
            var files = ev.dataTransfer.files;
            if (imgcount < files.length) {
                if (imgcount == 0) {
                    Common.msg("最多上传3张图片", null, 2000);
                    return false;
                }
                Common.msg("本次只能拖拽" + imgcount + "张图片", null, 2000);
                return false;
            }
            inputFilePoto.files = files;
        }
    }

});

var modifyDesign={
    request: function (data, callback, getDataInterface, functionalInterface, geturl) {
        var url = Common.getUrl()['order'];
        if (geturl) {
            url = Common.getUrl()[geturl];
        }
        if (getDataInterface) {
            url += Common.getDataInterface()[getDataInterface];
        }
        if (functionalInterface) {
            url += Common.functionalInterface()[functionalInterface];
        }
        Common.ajax(url, data, true, callback, function (error) {
            //接口调用错误处理
        });
    },
    uploadInit: function (orderId, customid, inputFileObj, clickObj, callback, uploadSuccessCallback, filetype, progressCallback) { //初始化上传
        
        $(".cover").on('click', function (e) {
            e.stopPropagation();
        });

        $(".zoon").on('click', function (e) {
            e.stopPropagation();
        });

        $(".upload-photo .del").on('click', function (e) {
            var imgDiv = $(e.target).parent().parent();
            modifyDesign.deletePhoto(imgDiv);
            e.stopPropagation();
        });

        $(".annex-oper .del").on('click', function (e) {
            modifyDesign.deleteFile(this);
        });


        var event = null;
        clickObj.on('click', function (e) {
            event = e;
            inputFileObj.click();
        })

        var imageDivs = $(".upload-photo .upload-photo-btn");
        // 选择文件成后
        inputFileObj.addEventListener('change', function (e) {
            var files = inputFileObj.files;
            for (var i = 0; i < files.length; i++) {
                if (filetype == "photo" && event == null) {
                    var flag = true;

                    for (var k = 0; k < imageDivs.length; k++) {
                        if (!flag) {
                            continue;
                        }
                        var isUrl = $(imageDivs[k]).is('[data-url]');
                        var isName = $(imageDivs[k]).is('[data-name]');
                        if ((!isUrl && !isName) || isUrl && $(imageDivs[k]).attr('data-url') == "" && (!isName || (isName && $(imageDivs[k]).attr('data-name') == ""))) {
                            event = {};
                            event["target"] = $(imageDivs[k]);
                            flag = false;
                        }
                    }
                }
                else if (filetype == "file" && event == null) {
                    event = $(".upload-file-btn");
                }

                var file = files[i];
                var uri = modifyDesign.getObjectURL(file);
                var name = file.name;
                var type = file.type;
                var size = file.size / 1024 / 1024;
                size = size.toFixed(2);
                if (filetype == "photo" && size > 10) {

                    document.querySelector('#input_file').value = ''
                    Common.msg('图片已经超过10MB',null,2000);

                    return;
                }

                if (filetype == "photo" && type.indexOf('jpg') < 0 && type.indexOf('jpeg') < 0 && type.indexOf('png') < 0 && type.indexOf('gif') < 0) {
                    Common.msg("上传图片得格式不正确");
                    return;
                }

                var isupload = callback(uri, name, files, size, event.target);//展示选择的文件
                if (!isupload) {
                    return false;
                }

                var docId = $(event.target).attr('id');

                cosUploadFile(file, function (err, data, docId) {//上传完成回调

                    uploadSuccessCallback(err, data, docId);
                }, isupload, progressCallback,orderId);
                event = null;
            }
        });
    },
    insertPhoto: function (uri, name, files, size, clickObj) {  //图片上传区域添加图片

        $(clickObj).css('background-image', 'url(' + uri + ')');
        $(clickObj).attr('data-name', name);
        $(clickObj).find('.cover').addClass('active');
        //viewer必要元素img标签 src属性
        $(clickObj).find('.zoon').find('img').attr('data-original', uri);
        $(clickObj).find('.zoon').find('img').attr('src', uri);

        $(clickObj).find('.zoon').on('click',function () {//实现在父级页面预览图片
            top.previewImg.insert(uri);
            top.previewImg.show();
        });

        return $(clickObj).attr('id');
    }
    ,
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
    deletePhoto: function (imgDiv) {//删除图片
        $(imgDiv).css('background-image', 'url("../../images/icon/server/sctp.png")');
        $(imgDiv).find('.cover').removeClass('active');
        $(imgDiv).find('img').attr('data-original', '');
        $(imgDiv).attr('data-Url', '');
        $(imgDiv).attr('data-name', '');
        document.querySelector('#input_file').value = '';
    },
    submitDate:function () {//保存成品图
        var that=this;
        var userInfo = top.Main.userInfo;
        var imgUrl=[];
        var dataList=$('.upload-photo').find('.upload-photo-btn');
        for(var i=0;i<dataList.length;i++)
        {
            var data_name=$(dataList[i]).attr('data-name');
            if(data_name)
            {
               if(parseInt($(dataList[i]).attr('progress'))!=100)
               {
                   Common.msg("图片正在上传...",null,2000);
                   return;
               }
            }
            if($(dataList[i]).attr('data-Url'))
            {
                imgUrl.push($(dataList[i]).attr('data-Url'));
            }
        }
        imgUrl=imgUrl.join(',');
        if(!imgUrl)
        {
            imgUrl="null";
        }

        var data={
            "userid": userInfo.userid,
            "token": userInfo.token,
            "roleType":userInfo.roletype,
            "commandCode":301,
            "images":imgUrl,
            "orderid":orderid
        };

        that.request(data, function (data) {
            if (data) {
                Common.msg("操作成功！",200,2000,function () {
                    if (parent.document.getElementById("cont_iframe").contentWindow.base) {
                        parent.document.getElementById("cont_iframe").contentWindow.base.init();
                    }
                    parent.layer.closeAll();
                });
            }
        }, 'uploadFacImages', null);
    },
    getData:function () {//获取
        var that=this;
        var userInfo = top.Main.userInfo;//获取用户信息
        var data={
            "userid": userInfo.userid,
            "token": userInfo.token,
            "roleType":userInfo.roletype,
            "commandCode":302,
            "orderid":orderid
        };
        that.request(data, function (data) {
            if (data&&data.code==1) {
                var status1 = data.status.success.length>=1?data.status.success[0]:"";
                var status2 = data.status.success.length>=2?data.status.success[1]:"";
                var status3 = data.status.success.length>=3?data.status.success[2]:"";
                if (status1&&status1!="null") {
                    var photo1=$('#photo_1');
                    photo1.css('background-image', "url(" + top.Main.getUrl['cosImgUrl'] + status1 + ")");
                    photo1.find('.cover').addClass('active');
                    photo1.find('.zoon').find('img').attr('data-original', + top.Main.getUrl['cosImgUrl'] + status1 );
                    photo1.find('.zoon').find('img').attr('src', + top.Main.getUrl['cosImgUrl'] + status1);
                    photo1.attr('data-url', status1);
                    photo1.removeClass('hide');

                    photo1.find('.zoon').on('click',function () {
                        
                        top.previewImg.insert(top.Main.getUrl['cosImgUrl'] + status1);
                        top.previewImg.show();
                    });
                }
                if (status2) {
                    var photo2=$('#photo_2');
                    photo2.css('background-image', "url(" + top.Main.getUrl['cosImgUrl'] + status2 + ")");
                    photo2.find('.cover').addClass('active');
                    photo2.find('.zoon').find('img').attr('data-original', + top.Main.getUrl['cosImgUrl'] + status2);
                    photo2.find('.zoon').find('img').attr('src', + top.Main.getUrl['cosImgUrl'] + status2);
                    photo2.attr('data-url', status2);
                    photo2.removeClass('hide');


                    photo2.find('.zoon').on('click',function () {
                        
                        top.previewImg.insert(top.Main.getUrl['cosImgUrl'] + status2);
                        top.previewImg.show();
                    });
                }
                if (status3) {
                    var photo3=$('#photo_3');
                    photo3.css('background-image', "url(" + top.Main.getUrl['cosImgUrl'] + status3 + ")");
                    photo3.find('.cover').addClass('active');
                    photo3.find('.zoon').find('img').attr('data-original', top.Main.getUrl['cosImgUrl'] + status3);
                    photo3.find('.zoon').find('img').attr('src', top.Main.getUrl['cosImgUrl'] + status3);
                    photo3.attr('data-url', status3);
                    photo3.removeClass('hide');

                    photo3.find('.zoon').on('click',function () {
                        top.previewImg.insert(top.Main.getUrl['cosImgUrl'] + status3);
                        top.previewImg.show();
                    });
                }

            }
        }, 'getFacImages', null);
    }
}

