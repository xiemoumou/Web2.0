/**
 * Created by inshijie on 2018/7/5.
 */
$(function () {
    
    var orderid = Common.getUrlParam('orderid', true);
    $(".design-photo .image").hover(function () {
        $(".operation").removeClass('hide')
    },function () {
        $(".operation").addClass('hide')
    });
    $("#design_requirements").keyup(function () {
        var contentCount=$(this).val().length;
        $(".count").html(contentCount);
    });

    //回显信息
    var designinfo = parent.orderInfo.data.designinfo;//设计师信息
    var photo1 = designinfo.designer[0].designerpattern[0].patterniamgeurl1;
    if (photo1 || photo2 || photo3) {
        if (photo1) {
            var imageObj=$('#designImg');
            imageObj.attr('src',parent.OrderDetails.getUrl['cosImgUrl'] + photo1);
            imageObj.attr('data-original',parent.OrderDetails.getUrl['cosImgUrl']+photo1);
            imageObj.attr('data-url',photo1);
        }
//            $("#design_diagram_layout").viewer({
//                url: 'data-original'
//            });
    }

    //设计附件
    
    var snnexName = designinfo.designer[0].designerpattern[0].patternaccessoryurl|| "";
    var otherSnnexName = designinfo.designer[0].designerpattern[0].otherAccessoryUrl||"";
    if(snnexName)
    {
        $("#file_annex").attr('data-url',snnexName);

        if(snnexName)
        {
            snnexName=snnexName.split('_')[1];
        }
        $("#file_annex .annex-name").html(snnexName);
        $("#file_annex").removeClass("hide");

    }

    if(otherSnnexName)
    {
        $("#file_annex_other").attr('data-url',otherSnnexName);

        if(otherSnnexName)
        {
            otherSnnexName=otherSnnexName.split('_')[1];
        }
        $("#file_annex_other .annex-name").html(otherSnnexName);
        $("#file_annex_other").removeClass('hide');

    }

    var des_requ=designinfo.designer[0].designerpattern[0].patternmemo;//设计备注
    $("#design_requirements").html(des_requ || "");
    $(".count").html(des_requ.length);


    //修改图片
    modifyDesign.uploadInit(orderid,$("#input_file_0")[0],$(".operation"),function (uri, name, files, size) {
            //选中图片后
            return modifyDesign.insertPhoto(uri, name, files, size);//插入图片

        }, function (err, data, imgId) {//上传成功后调用
            var str_url = (data.url).substr((data.url).indexOf(".com/") + 5);
            $('#designImg').attr('data-Url', str_url);
        }
        , "photo", function (progress) {
            $(".image .progress").attr('progress', progress);
            $(".image .progress").text(progress + "%");
        });

    //上传附件
    modifyDesign.uploadInit(orderid,$("#input_file_1")[0],$(".upload-file-btn"),function (uri, name, files, size) {
            //选中图片后
            return modifyDesign.insertFile(uri, name, files, size,"#file_annex");//插入图片
        }, function (err, data, imgId) {//上传成功后调用
            var str_url = (data.url).substr((data.url).indexOf(".com/") + 5);
            $('#file_annex').attr('data-Url', str_url);
        }
        , "file", function (progress) {
            $("#file_annex .progress").attr('progress', progress);
            $("#file_annex .progress").text(progress + "%");
        });

    modifyDesign.uploadInit(orderid,$("#input_file_2")[0],$(".other-upload-file-btn"),function (uri, name, files, size) {
            //选中图片后
            return modifyDesign.insertFile(uri, name, files, size,"#file_annex_other");//插入图片
        }, function (err, data, imgId) {//上传成功后调用
            var str_url = (data.url).substr((data.url).indexOf(".com/") + 5);
            $('#file_annex_other').attr('data-Url', str_url);
        }
        , "", function (progress) {
            $("#file_annex_other .progress").attr('progress', progress);
            $("#file_annex_other .progress").text(progress + "%");
        });

    //删除附件
    $(".del").on('click',function () {
        modifyDesign.deleteFile($("#file_annex"));
    });

    $(".del-other").on('click',function () {
        modifyDesign.deleteFile($("#file_annex_other"))
    });
    
    //拖拽上传
    modifyDesign.initUpload(".design-photo",$("#input_file_0")[0]);
    modifyDesign.initUpload(".upload-orgfile",$("#input_file_1")[0]);
    modifyDesign.initUpload(".upload-orgfile.other",$("#input_file_2")[0]);
    
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
    initUpload:function (tag,inputFilePoto) {
        //图片拖拽事件
        var updesign = $(tag)[0];
        updesign.ondragover = function (ev) {
            //阻止浏览器默认打开文件的操作
            ev.preventDefault();
            //拖入文件后
            $(this).css({"border": "2px dashed #5d5d5d"});
        }

        updesign.ondragleave = function () {
            //拖出
            $(this).css({"border": "none"});
        }
        updesign.ondrop = function (ev) {
            //放下
            $(this).css({"border": "none"});
            //阻止浏览器默认打开文件的操作
            ev.preventDefault();
            var files = ev.dataTransfer.files;
            if (files.length>1) {
                Common.msg("请拖拽一个文件进行上传", null, 2000);
                return false;
            }
            inputFilePoto.files = files;
        }
    },
    uploadInit: function (orderId, inputFileObj, clickObj, callback, uploadSuccessCallback, filetype, progressCallback) {//初始化上传
        var event = null;
        clickObj.on('click', function (e) {
            event = e;
            inputFileObj.click();
        })
        // 选择文件成后
        inputFileObj.addEventListener('change', function (e) {
            var files = inputFileObj.files;
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var uri = getObjectURL(file);
                var name = file.name;
                var index= name.lastIndexOf('.');
                var type = name.slice(index+1).toLowerCase();
                //var createDate = file.lastModifiedDate.toLocaleDateString();
                var size = file.size / 1024 / 1024;
                size = size.toFixed(2);
                if (filetype == "photo" && size > 10) {
                    Common.msg("上传的图片不能大于10M");
                    return;
                }
                else if (filetype == "file" && size > 50) {
                    Common.msg("上传的文件不能大于50M");
                    return;
                }else if (filetype == "" && size > 5) {
                    Common.msg("上传的文件不能大于5M");
                    return;
                }

                if (filetype == "photo" && type.indexOf('jpg') < 0 && type.indexOf('jpeg') < 0 && type.indexOf('png') < 0 && type.indexOf('gif') < 0) {
                    Common.msg("上传图片得格式不正确");
                    return;
                }

                //.cdr,.ai,.psd,.pdf
                if (filetype == "file" && type.indexOf('cdr') < 0 && type.indexOf('ai') < 0 && type.indexOf('psd') < 0 && type.indexOf('pdf') < 0 && type.indexOf('eps') < 0) {
                    Common.msg("上传文件格式不正确");
                    return;
                }
                
                var isupload = callback(uri, name, files, size);//展示选择的文件
                if (!isupload) {
                    return false;
                }
                cosUploadFile(file, function (err, data, isupload) {//上传完成回调
                    uploadSuccessCallback(err, data);
                }, isupload, progressCallback,orderId);
                event = null;
            }
        });

        function getObjectURL (file) {//获取图片本地路径
            var url = null;
            if (window.createObjectURL != undefined) { // basic
                url = window.createObjectURL(file);
            } else if (window.URL != undefined) { // mozilla(firefox)
                url = window.URL.createObjectURL(file);
            } else if (window.webkitURL != undefined) { // webkit or chrome
                url = window.webkitURL.createObjectURL(file);
            }
            return url;
        }

    },
    insertPhoto: function (uri, name, files, size) {  //图片上传区域添加图片
        var imageObj=$("#designImg");
        imageObj.attr('data-name', name);
        imageObj.attr('data-original',uri);
        imageObj.attr('src',uri);
        return "designImg";
    },
    insertFile: function (uri, name, files, size,obj) {
        $(obj).removeClass('hide');
        $(obj+' .annex-name').html(name);
        $(obj+' .annex-name').attr('title', name);
        $(obj).attr('data-file-name', name);
        // $('.upload-annex .annex-oper .size').html(size + "M");
        return obj;
    }
    ,
    deleteFile: function (obj) {
        obj.addClass('hide');
        obj.attr('data-url', '');
        obj.attr('data-file-name', '');
        obj.find('.annex-name').html('');
        obj.find('.annex-name').attr('title',"");
        document.querySelector('#input_file_1').value = '';//上传附件
    },
    submitDate:function () {
        var that=this;
        var userInfo = top.Main.userInfo;//获取用户信息
        that.request({
            "userId": userInfo.userid,
            "token": userInfo.token,
            "roleType":userInfo.roletype,
            "patternImageUrl1":$("#designImg").attr('data-url')||"",
            "patternAccessoryUrl": $("#file_annex").attr('data-url')||"",
            "otherAccessoryUrl":$("#file_annex_other").attr('data-url')||"",
            "patternMemo": $("#design_requirements").val(),
            "orderId":Common.getUrlParam('orderid', true)
        }, function (data) {
            if (data) {
                Common.msg(data.status.msg, data.status.code == 0 ? 200 : "",2000,function () {
                    if(parent.OrderDetails.getData && data.status.code == 0)
                    {
                        parent.OrderDetails.getData();
                        parent.layer.closeAll();
                    }
                });
            }
        }, 'editDesign', null);
    }
}
