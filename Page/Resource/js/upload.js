/**
 * Created by inshijie on 2018/5/21.
 */
// 资源库上传

var currentSelectObj = null;
$(function () {
    $(window).click(function () {
        if (currentSelectObj) {
            currentSelectObj.hide();
            currentSelectObj = null;
        }
    })
    base.init();


});

var base={
    init:function () {
        var that=this;
        $(".select").on('click',function (e) {
            that.dropdownlist(this);
            e.stopPropagation();
        });

// ***************************
        //初始化上传操作
        var inputFilePoto = document.querySelector('#input_file');//上传图片
        var inputFileAnnex = document.querySelector('#input_file_1');//上传附件

        //初始化图片上传******
        that.uploadInit("", "", inputFilePoto, $(".js-upload-img"), function (uri, name, files, size, clickObj) {//选择文件后调用
                return that.insertPhoto(uri, name, files, size, clickObj);//插入图片
            },
            function (err, data, imgId) {//上传成功后调用
                var str_url = (data.url).substr((data.url).indexOf(".com/") + 5);
                $("#" + imgId).attr('data-Url', str_url);
            }
            , "photo",function (progress,docId) {
                console.log(progress);
                $("#"+docId).attr('progress',progress);
                $("#"+docId).find(".progress").text(progress+"%");
            });

        //初始化附件上传******
        that.uploadInit("", "", inputFileAnnex, $(".js-upload-file"), function (uri, name, files, size, clickObj) {//选择文件后调用
                return that.insertFile(uri, name, files, size, clickObj);//显示已上传附件
            },
            function (err, data, fileId) {//上传成功后调用
                var str_url = (data.url).substr((data.url).indexOf(".com/") + 5);
                $("#" + fileId).attr('data-Url', str_url);

            }
            , "file",function (progress,docId) {
                $("#"+docId).attr('progress',progress);
                $("#"+docId).find(".progress").text(progress+"%");
            });
// ********************************
        that.getProductType();
    },
    getProductType:function () {
        Common.ajax(Common.getUrl()['resource']+Common.getDataInterface()["getResourceType"],"",true,function (data) {
            if(data.code==0)
            {
                var lists=data.list;
                var prod_List=$("#prod_List");
                prod_List.html("");
                $.each(lists,function (i,item) {
                    prod_List.append("<li data-id='"+item.id+"'>"+item.name+"</li>");
                });
            }
        },function (err) {
            Console.error("获取产品类型失败");
        },"Post",true);
    },
    dropdownlist:function (obj) {
        var dropdownlist = $(obj).next();
        if (currentSelectObj) {
            currentSelectObj.hide();
            currentSelectObj = null;
        }
        currentSelectObj= dropdownlist;
        $(dropdownlist).show();
        var lists= $(dropdownlist).find("ul li");
        $.each(lists,function (i,item) {
            $(item).unbind();
            $(item).on('click',function () {
                var val=$(this).text();
                var id=$(this).attr('data-id');
                var input=dropdownlist.prev().find('input');
                input.val(val);
                input.attr('data-id',id);
            });
        });
    },
    uploadInit: function (orderId, customid, inputFileObj, clickObj, callback, uploadSuccessCallback, filetype,progressCallback) {//初始化上传

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
                //获取文件缓存路径
                var uri = null;
                if (window.createObjectURL != undefined) { // basic
                    uri = window.createObjectURL(file);
                } else if (window.URL != undefined) { // mozilla(firefox)
                    uri = window.URL.createObjectURL(file);
                } else if (window.webkitURL != undefined) { // webkit or chrome
                    uri = window.webkitURL.createObjectURL(file);
                }//获取文件缓存路径结束

                var name = file.name;
                var index= name.lastIndexOf('.');
                var type = name.slice(index+1).toLowerCase();
                //var createDate = file.lastModifiedDate.toLocaleDateString();
                var size = file.size / 1024 / 1024;
                size = size.toFixed(2);
                if (filetype == "photo" && size > 10) {
                    $('.upload-photo .error-msg').show(300);
                    setTimeout(function () {
                        $('.upload-photo .error-msg').hide(300);
                    }, 3000);
                    return;
                }
                else if (filetype == "file" && size > 50) {
                    $('.upload-annex .error-msg').show(300);
                    setTimeout(function () {
                        $('.upload-annex .error-msg').hide(300);
                    }, 3000);
                    return;
                }

                if (filetype == "photo" && type.indexOf('jpg') < 0 && type.indexOf('jpeg') < 0 && type.indexOf('png') < 0 && type.indexOf('gif') < 0) {
                    Common.msg("上传图片得格式不正确");
                    return;
                }

                if (filetype == "file" && name.indexOf('.cdr') < 0 && name.indexOf('.ai') < 0 && type.indexOf('eps') < 0) {
                    Common.msg("矢量图格式必须为cdr 或 ai");
                    return;
                }

                var isupload = callback(uri, name, files, size, clickObj);//展示选择的文件
                if (!isupload) {
                    return false;
                }

                var docId = $(event.target).attr('id');
                cosUploadFile(file, function (err, data, docId) {//上传完成回调
                    uploadSuccessCallback(err, data, docId);
                }, isupload,progressCallback,"Resource");
            }
        });
    },
    insertPhoto: function (uri, name, files, size, clickObj) {  //图片上传区域添加图片
        
        $(clickObj).find('img').attr('src', uri);
        $(".js-photo-btn").hide();
        $(".js-photo").show();
        $(clickObj).attr('data-name',name);
        parent.upIfreamHeight(590);
        return $(clickObj).attr('id');
    },
    insertFile: function (uri, name, files, size, clickObj) {
        
        var newfilename = name;
        if (name.length > 10) {
            newfilename = newfilename.substring(0, 10) + "...";
        }
        $(clickObj).find('img').attr('src', uri);
        $(".js-file-btn").hide();
        $(".js-file").removeClass('hide');
        $(clickObj).attr('data-name',name);
        $("#js-file").val(name);
        $("#js-file").attr('title',name);
        return $(clickObj).attr('id');
    },
    upload:function () {
        var img=$("#upload_img");
        var upload_file=$("#upload_file");
        var prod_type=$("#prod_type");
        var reso_title=$("#reso_title");
        var label=$("#label");

        //上传图片验证
        var imgname=img.attr('data-name');
        if(!imgname)
        {
            img.find('.error-msg').removeClass('hide');
            setTimeout(function () {
                img.find('.error-msg').addClass('hide');
            },2000);
            return
        }

        if(img.attr('progress')&& !(parseInt(img.attr('progress'))==100))
        {
            //请上传图片
            Common.msg('文件正在上传...',null,2000);
            return;
        }

        // 矢量图验证
        var fileName=upload_file.attr('data-name');
        if(!fileName)
        {
            upload_file.find('.error-msg').removeClass('hide');
            setTimeout(function () {
                upload_file.find('.error-msg').addClass('hide');
            },2000);
            return
        }

        if(upload_file.attr('progress')&& !(parseInt(upload_file.attr('progress'))==100))
        {
            //请上传图片
            Common.msg('文件正在上传...',null,2000);
            return;
        }

        //产品类型
        if(!prod_type.attr('data-id'))
        {
            Common.msg('请选择产品类型',null,2000);
            return;
        }

        //资源标题
        if(!reso_title.val())
        {
            Common.msg('请输入资源标题',null,2000);
            return;
        }

        if($.trim(label.val())!="")
        {
            var labels=label.val().split(/[,，]/);
            for(var i=0;i<labels.length;i++)
            {
                if(Common.getStrLeng(labels[i])>10)
                {
                    Common.msg("单个标签不能超过10个符（1汉字两字符）",null,2000);
                    return;
                }
            }
        }

        // var roletype=$.cookie('roletype');
        // if(roletype==2)
        // {
        //
        // }

        var data={
            "thumbnailUrl":Common.getUrl()['cosImgUrl']+img.attr('data-Url'),//缩略图url
            "vectorgraphUrl":Common.getUrl()['cosImgUrl']+upload_file.attr('data-Url'),//矢量图url
            "resourceTitle":reso_title.val(),//缩略图名称
            "vectorgraphName":fileName,//矢量图名称
            "userId": $.cookie('userId'),
            "resourceType":prod_type.attr('data-id'),
            "labelContent":label.val(),
            "author":$.cookie('nickname'),
        };

        $("#btn_upload").attr('disabled',true);
        Common.ajax(Common.getUrl()['resource']+Common.getDataInterface()["uploadResource"],data,true,function (data) {
            //提交成功
            Common.msg(data.msg,data.code==0?200:null,2000,function () {
                parent.Refresh();
                //parent.layer.closeAll();
            });

        },function (err) {
            //提交失败
            Common.msg("提交失败请稍后再试",null);
            $("#btn_upload").attr('disabled',false);
        },null,true);
    }
};