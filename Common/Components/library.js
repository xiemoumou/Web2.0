/**
 * Created by inshijie on 2018/6/28.
 */
// 库文件中包含的功能
// 1、下拉列表
// 2、下拉盒子
// 3、图片预览与上传
// 4、文件回显与上传
// 5、带有统计的文本域

/*============================================================================================================*/
/*============================================================================================================*/
/*============================================================================================================*/
/*============================================================================================================*/
/*============================================================================================================*/
/*============================================================================================================*/
// **************************************************下拉菜单
(function ($) {
    //点击空白收起菜单
    $(document).click(function () {
        DropUp();
    });

    function DropUp() {//收起菜单
        $(".lg-dropdownlist ul").slideUp('fast');
        $(".lg-dropdownbox div").slideUp('fast');
    }

    //下拉菜单 data：数据原， oneClickCallback:单击回调
    $.fn.DropDownList = function (data, oneClickCallback) {
        var tagObj = $(this);
        tagObj.html("");
        tagObj.unbind();

        var val = tagObj.attr('data-val');
        var name="";
        for(var i=0;i<data.length;i++)
        {
            if(val==data[i].id)
            {
                name=data[i].name;
            }
        }

        var dropdownlist = $('<div class="lg-dropdownlist"><span data-value="'+val+'" class="val" title="' + name + '">' + name + '</span><i class="select"></i></div>');
        dropdownlist.css('background-color','#d5d5d5');
        if(data.length && data.length>0)
        {
            dropdownlist.css('background-color','#ffffff');
            var ul = $('<ul></ul>');
            tagObj.on('click', function (e) { //触发显示下拉菜单
                DropUp();
                //渲染数据
                if (!data) return;//如果数据源为空则退出

                ul.html('');
                for (var i = 0; i < data.length; i++) {
                    var li = $('<li data-val="' + data[i].id + '">' + data[i].name + '</li>');

                    i % 2 != 0 ? li.addClass("even") : li.addClass("odd"); //设置各行变色

                    li.on('click', function (e) {//列表点击事件
                        var liObj = $(this);
                        if (oneClickCallback) {
                            oneClickCallback(parseInt(liObj.attr('data-val')));
                        }
                        var span = liObj.parent().parent().find('span');
                        $(span).html(liObj.text());//赋值
                        $(span).attr('title', liObj.text());
                        $(span).attr('data-value', liObj.attr('data-val'));
                        ul.slideUp(1, function () {
                            ul.html("");
                        });//收起菜单
                        e.stopPropagation();
                    });
                    ul.append(li);
                }

                ul.slideDown(1);
                e.stopPropagation();
            });

            dropdownlist.append(ul);
        }
        tagObj.append(dropdownlist);
    }

    //下拉不选框 data：数据原， oneClickCallback:单击回调
    $.fn.DropDownBox = function (data, oneClickCallback) {
        var tagObj = $(this);
        tagObj.html("");
        tagObj.unbind();

        var width = tagObj.attr('data-width') || 160;//下拉宽度
        var height = tagObj.attr('data-height') || 206;//下拉高度
        var defaultValue = tagObj.attr('data-val') || "";//默认值
        var name=[];
        defaultValue=defaultValue.split(",");
        for(var i=0;i<data.length;i++)
        {
            for(var j=0;j<defaultValue.length;j++)
            {
                if(parseInt(defaultValue[j])==data[i].id)
                {
                    name.push(data[i].name);
                }
            }
        }

        var dropdownbox = $('<div class="lg-dropdownbox"><span class="val" title="' + name.join(";") + '">' + name.join(";") + '</span><i class="select"></i></div>');
        dropdownbox.css('background-color','#d5d5d5');

        var pc_height = tagObj.css("height");

        var div_c = $('<div class="s-btn-container" style="position: absolute; z-index: 1000; top:' + pc_height + ';display: none;"></div>');
        div_c.on('click', function (e) {
            e.stopPropagation();
        });

        if(data.length && data.length>0)
        {
            dropdownbox.css('background-color','#ffffff');
            tagObj.on('click', function (e) { //触发显示下拉菜单
                DropUp();
                //渲染数据
                if (!data) return;//如果数据源为空则退出
                div_c.html('');
                var body_width = parseInt(width) - 2;

                div_c.css("width", body_width);

                var div_body = $('<div class="div-body" style="width:' + body_width + 'px; height: ' + height + 'px;"></div>');
                div_c.append(div_body);//选项容器
                var div_oper = $('<div style="width:' + width + 'px; height:26px;"></div>');
                div_c.append(div_oper);//确定取消
                var ok_btn = $('<button class="btn ok-btn">确定</button>');
                div_oper.append(ok_btn);
                var cancel_btn = $('<button class="btn-h cancel-btn">取消</button>');
                div_oper.append(cancel_btn);

                //渲染按钮
                for (var i = 0; i < data.length; i++) {
                    if(data[i].id=='1')
                    {
                        var none=$('<div class="s-btn none" data-name="'+data[i].name+'" data-id="'+data[i].id+'"><div class="item"><span>' + data[i].name + '</span><i></i></div></div>');
                        none.on('click',function (e) {
                            var normalBtn=$($(this).parent()).find('.normal');
                            $(normalBtn).attr("data-selected", '');
                            $(normalBtn.find("i")).removeClass('active');
                            $(this).attr("data-selected", true);
                            $($(this).find("i")).addClass('active');
                            e.stopPropagation();
                        });
                        div_body.append(none);
                    }
                    else {
                        var normal=$('<div class="s-btn normal" data-name="'+data[i].name+'" data-id="'+data[i].id+'"><div class="item"><span>' + data[i].name + '</span><i></i></div></div>');
                        normal.on('click',function (e) {
                            var thisObj = $(this);
                            var noneObj=$(thisObj.parent()).find('.none');
                            var selectflag = thisObj.find("i");//选中标记
                            if (!thisObj.attr("data-selected")) {
                                thisObj.attr("data-selected", true);
                                selectflag.addClass('active');

                                $(noneObj.find("i")).removeClass('active');
                                $(noneObj).attr("data-selected", '');
                            }
                            else //取消选中
                            {
                                thisObj.attr("data-selected", '');
                                selectflag.removeClass('active');

                                var normalBtnList=$($(this).parent()).find('.normal');
                                var isSelect=false;
                                for(var i=0;i<normalBtnList.length;i++)
                                {
                                    if($(normalBtnList[i]).attr('data-selected'))
                                    {
                                        isSelect=true;
                                    }
                                }
                                if(!isSelect)
                                {
                                    noneObj.attr("data-selected","true");
                                    $(noneObj.find("i")).addClass('active');
                                }
                            }
                        });
                        div_body.append(normal);
                    }
                }


                //回选操作
                var defaultValue = $($(this).find('.val')).attr('data-value') || $(this).attr('data-val') || "";//默认值
                defaultValue=defaultValue.split(",");
                var $btnArray= $($(this).find('.s-btn-container')).find('.s-btn');
                for(var i=0;i<$btnArray.length;i++) {
                    for (var j = 0; j < defaultValue.length; j++)
                    {
                        if(defaultValue[j]==$($btnArray[i]).attr('data-id'))
                        {
                            $($btnArray[i]).attr("data-selected","true");
                            $($($btnArray[i]).find("i")).addClass('active');
                        }
                    }
                }

                ok_btn.on('click', function (e) {//确定按钮事件
                    var result={'id':[],'name':[]};
                    var $btnContainer= $($(this).parent().prev());
                    var $btnList=$($btnContainer.find('.s-btn'));
                    
                    for(var i=0;i<$btnList.length;i++)
                    {
                        var $item=$($btnList[i]);
                        if($item.attr('data-selected'))
                        {
                            result.id.push(parseInt($item.attr('data-id')));
                            result.name.push($item.attr('data-name'));
                        }
                    }
                    var $span=$($btnContainer.parent().prev().prev());
                    $span.attr('data-value',result.id.join(','));
                    $span.text(result.name.join(';'));
                    $span.attr('title',result.name.join(';'));

                    if(oneClickCallback)
                    {
                        oneClickCallback(result);
                    }

                    DropUp();
                    e.stopPropagation();
                });

                cancel_btn.on('click', function (e) {//取消按钮事件
                    DropUp();
                    e.stopPropagation();
                });
                div_c.slideDown('fast');
                e.stopPropagation();
            });
            dropdownbox.append(div_c);
        }
        tagObj.append(dropdownbox);
    }

    //*******************开模方式 data：数据原， oneClickCallback:单击回调
    /*规则：
     1 、在选择双面开模以前，所有的选项都是单选
     2、选中双面开模后：
     1、取消对“无”或者“浇铸”或者“模切”的选择，选中“双面开模”
     2、不用取消已经选中的带2D或者3D的项目
     3、带2D和3D两字的项目可以选择1个或者2个，最多两个项目
     3、如果选择了双面开模，又尝试选择：“无”或者“浇铸”或者“模切”，则取消所有现有勾选，只选中最新选择的项目*/
    $.fn.DropDownMold = function (data, oneClickCallback) {
        var tagObj = $(this);
        tagObj.html("");
        tagObj.unbind();

        var width = tagObj.attr('data-width') || 160;//下拉宽度
        var height = tagObj.attr('data-height') || 206;//下拉高度
        var defaultValue = tagObj.attr('data-val') || "";//默认值
        var name=[];
        defaultValue=defaultValue.split(",");
        for(var i=0;i<data.length;i++)
        {
            for(var j=0;j<defaultValue.length;j++)
            {
                if(parseInt(defaultValue[j])==data[i].id)
                {
                    name.push(data[i].name);
                }
            }
        }

        var dropdownbox = $('<div class="lg-dropdownbox"><span class="val" title="' + name.join(";") + '">' + name.join(";") + '</span><i class="select"></i></div>');
        dropdownbox.css('background-color','#d5d5d5');
        var pc_height = tagObj.css("height");

        var div_c = $('<div class="s-btn-container" style="position: absolute; z-index: 1000; top:' + pc_height + ';display: none;"></div>');
        div_c.on('click', function (e) {
            e.stopPropagation();
        });

        if(data.length && data.length>0)
        {
            dropdownbox.css('background-color','#ffffff');
            tagObj.on('click', function (e) { //触发显示下拉菜单
                DropUp();
                //渲染数据
                if (!data) return;//如果数据源为空则退出
                div_c.html('');
                var body_width = parseInt(width) - 10;

                div_c.css("width", body_width);

                var div_body = $('<div class="div-body" style="padding-left:8px;width:' + body_width + 'px; height: ' + height + 'px;"></div>');
                div_c.append(div_body);//选项容器
                var div_oper = $('<div style="width:' + width + 'px; height:26px;"></div>');
                div_c.append(div_oper);//确定取消
                var ok_btn = $('<button class="btn ok-btn">确定</button>');
                div_oper.append(ok_btn);
                var cancel_btn = $('<button class="btn-h cancel-btn">取消</button>');
                div_oper.append(cancel_btn);

                //渲染按钮
                for (var i = 0; i < data.length; i++) {
                    if(data[i].id=='1')
                    {
                        var none=$('<div class="s-btn none" data-name="'+data[i].name+'" data-id="'+data[i].id+'"><div class="item"><span>' + data[i].name + '</span><i></i></div></div>');
                        none.on('click',function (e) {
                            var normalBtn=$($(this).parent()).find('.normal');
                            $(normalBtn).attr("data-selected", '');
                            $(normalBtn.find("i")).removeClass('active');
                            $(this).attr("data-selected", true);
                            $($(this).find("i")).addClass('active');
                            e.stopPropagation();
                        });
                        div_body.append(none);
                    }
                    else {
                        var normal=$('<div class="s-btn normal" data-name="'+data[i].name+'" data-id="'+data[i].id+'"><div class="item"><span>' + data[i].name + '</span><i></i></div></div>');
                        normal.on('click',function (e) {
                            var thisObj = $(this);
                            var noneObj=$(thisObj.parent()).find('.none');
                            var selectflag = thisObj.find("i");//选中标记
                            if (!thisObj.attr("data-selected")) {
                                thisObj.attr("data-selected", true);
                                selectflag.addClass('active');

                                $(noneObj.find("i")).removeClass('active');
                                $(noneObj).attr("data-selected", '');
                            }
                            else //取消选中
                            {
                                thisObj.attr("data-selected", '');
                                selectflag.removeClass('active');

                                var normalBtnList=$($(this).parent()).find('.normal');
                                var isSelect=false;
                                for(var i=0;i<normalBtnList.length;i++)
                                {
                                    if($(normalBtnList[i]).attr('data-selected'))
                                    {
                                        isSelect=true;
                                    }
                                }
                                if(!isSelect)
                                {
                                    noneObj.attr("data-selected","true");
                                    $(noneObj.find("i")).addClass('active');
                                }
                            }
                        });
                        div_body.append(normal);
                    }
                }


                //回选操作
                var defaultValue = $($(this).find('.val')).attr('data-value') || $(this).attr('data-val') || "";//默认值
                defaultValue=defaultValue.split(",");
                var $btnArray= $($(this).find('.s-btn-container')).find('.s-btn');
                for(var i=0;i<$btnArray.length;i++) {
                    for (var j = 0; j < defaultValue.length; j++)
                    {
                        if(defaultValue[j]==$($btnArray[i]).attr('data-id'))
                        {
                            $($btnArray[i]).attr("data-selected","true");
                            $($($btnArray[i]).find("i")).addClass('active');
                        }
                    }
                }

                ok_btn.on('click', function (e) {//确定按钮事件
                    var result={'id':[],'name':[]};
                    var $btnContainer= $($(this).parent().prev());
                    var $btnList=$($btnContainer.find('.s-btn'));
                    for(var i=0;i<$btnList.length;i++)
                    {
                        var $item=$($btnList[i]);
                        if($item.attr('data-selected'))
                        {
                            result.id.push($item.attr('data-id'));
                            result.name.push($item.attr('data-name'));
                        }
                    }
                    var $span=$($btnContainer.parent().prev().prev());
                    $span.attr('data-value',result.id.join(','));
                    $span.text(result.name.join(';'));
                    $span.attr('title',result.name.join(';'));

                    if(oneClickCallback)
                    {
                        oneClickCallback(result);
                    }

                    DropUp();
                    e.stopPropagation();
                });

                cancel_btn.on('click', function (e) {//取消按钮事件
                    DropUp();
                    e.stopPropagation();
                });
                div_c.slideDown('fast');
                e.stopPropagation();
            });
            dropdownbox.append(div_c);
        }
        tagObj.append(dropdownbox);
    }
})(jQuery);


/*============================================================================================================*/
/*============================================================================================================*/
/*============================================================================================================*/
/*============================================================================================================*/
/*============================================================================================================*/
/*============================================================================================================*/

// **************************************************文件上传
/*
 * 说明：
 * 需要在绑定标签上设置上传类型：data-type：Annex 或 data-type：ReferencePhoto 或 data-type：OtherAnnex  或  data-type：DesignDraft   或  data-type：Avatar
 *                           data-customid:
 * */


var uploadfile = {
    photoConstraint: ['jpg', 'jpeg', 'png', 'gif'],//图片类型限制
    fileConstraint: ['cdr', 'ai', 'psd', 'pdf', 'eps'],//附件类型限制
    initDrag: function (domId) {//拖拽到那个哪个区域触发事件（domId）
        // 注意：调用此方法需要在uploadPhoto或uploadFile之后
        var domObj = $('#' + domId)[0];
        domObj.ondragover = function (ev) {
            //阻止浏览器默认打开文件的操作
            ev.preventDefault();
            //拖入文件后
            $(this).css('box-shadow', '0 0 1px 2px #D5D5D5');
        }

        domObj.ondragleave = function () {
            //拖出
            $(this).css('box-shadow', '');
        }
        domObj.ondrop = function (ev) {
            //放下
            $(this).css('box-shadow', '');
            //阻止浏览器默认打开文件的操作
            ev.preventDefault();
            var files = ev.dataTransfer.files;
            var fileDomList = $(this).find('input[type="file"]');

            for (var i = 0; i < fileDomList.length; i++) {
                var item = fileDomList[i];
                item.files = files;
            }
        }
    },
    uploadPhoto: function (tagId, limit, srcArray, allowEditors, size) {//图片上传 tagId：容器ID, limit：最多可容纳几张图片,srcArray：[{'thumbnail':'','orgSrc':''}]反显时需要的图片src,allowEditors:是否允许编辑,size：每张图片的狭小限制
        var that = this;
        size = !size ? 6 : size;//图片大小限制默认2MB
        allowEditors = allowEditors == null ? true : allowEditors;//是否允许编辑

        var typeConstraint = that.photoConstraint;//类型约束
        var container = $('#' + tagId);
        container.html('');
        var uploadType = container.attr('data-type');//上传类型
        var customid = container.attr("data-customid");//需要在标签上获得订单id用于上传

        var docPhotoList = $('<div class="diagram-container"></div>');//图片容器
        var fileDOM = $('<input type="file" data-limit="' + limit + '" style="display:none;" multiple class="file-' + tagId + '  diagram">');
        container.append(fileDOM);//选择图片控件
        container.append(docPhotoList);

        if (allowEditors)//是否显示添加按钮
        {
            var docAddBtn = $('<div class="addDiagram cursor">' +
                '<span class="dia-icon"></span>' +
                '<span class="dia-remind-1">支持拖拽上传</span>' +
                '<span class="dia-remind-2">大小不得超过' + size + 'M</span>' +
                '</div>');
            container.append(docAddBtn);
            docAddBtn.on('click', function (e) {//添加按钮绑定选择文件事件
                fileDOM[0].click();
            })
        }

        // 回显图片-begin
        if (srcArray) {
            for (var i = 0; i < srcArray.length; i++) {
                //张数限制
                var currentPhotoNum = docPhotoList.find(".diagram").length;
                if (docAddBtn && currentPhotoNum == (limit - 1))//插入最后一张图片时隐藏添加按钮
                {
                    docAddBtn.addClass('hide');
                }

                if (currentPhotoNum < limit) {
                    var item = srcArray[i];
                    renderPhoto(item.thumbnail, item.orgSrc, false);
                }
            }
        }
        // 回显图片-end


        //选择文件进行上传
        fileDOM[0].addEventListener('change', function (e) {

            var files = $(this)[0].files;
            var limit = parseInt(fileDOM.attr('data-limit'));
            //遍历选择的文件
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var uri = that.getObjectURL(file);
                var name = file.name;
                var index = name.lastIndexOf('.');
                var type = name.slice(index + 1).toLowerCase();//文件类型

                //文件格式判断
                if (typeConstraint.indexOf(type) < 0) {
                    top.Message.show("注意", "图片的格式不能为" + type, top.MsgState.Fail, 3000);
                    fileDOM[0].value = '';
                    return;
                }

                //文件大小验证
                var filesize = file.size / 1024 / 1024;//MB
                if (filesize > size) {
                    top.Message.show("注意", "请上传小于" + size + "MB的图片", top.MsgState.Fail, 3000);
                    fileDOM[0].value = '';
                    return;
                }

                //张数限制
                var currentPhotoNum = docPhotoList.find(".diagram").length;
                if (currentPhotoNum == limit) {
                    top.Message.show("注意", "最多只能上传" + limit + "张图片。", top.MsgState.Fail, 3000);
                    fileDOM[0].value = '';
                    return;
                }
                if (currentPhotoNum == (limit - 1))//插入最后一张图片时隐藏添加按钮
                {
                    docAddBtn.addClass('hide');
                }
                var diagram = renderPhoto(uri, uri);//渲染图片
                
                //执行上传
                that.upload(file, diagram, function (diagram, percentVal) {
                    //上传进度
                    var progress = diagram.find('.progress');
                    $(progress).find('span').text(percentVal + "%...");
                    if (percentVal == 100) {
                        $(progress).find('span').text('处理中...');
                    }
                }, function (diagram, data) {
                    //上传成功
                    data = data.data;
                    diagram.attr('data-complete', 'complete');
                    diagram.attr('data-mImageUrl', data.mImageUrl);
                    diagram.attr('data-oImageUrl', data.oImageUrl);
                    diagram.attr('data-sImageUrl', data.sImageUrl);
                    var progress = diagram.find('.progress');
                    $(progress).addClass('hide');
                }, function (diagram, data) {
                    //上传失败
                    var progress = diagram.find('.progress');
                    $(progress).find('span').text('上传失败');
                    $(progress).removeClass('hide');
                }, "photo", uploadType, customid);
            }
        });

        //渲染图片
        function renderPhoto(thumbnail, orgSrc, showProgress) {
            showProgress = showProgress == null ? true : showProgress;
            //图片
            var diagram = $('<div data-progress="0" data-mimageurl="'+orgSrc+'"  data-simageurl="'+thumbnail+'"  data-src="' + orgSrc + '" class="diagram"><div class="progress"><span>0%</span></div></div>').append($('<img src="' + thumbnail + '">'));
            diagram.hover(function () {//显示或隐藏放大镜+删除图标
                $(this).find('.handle').removeClass('hide');
            }, function () {
                $(this).find('.handle').addClass('hide');
            });

            //是否显示进度条
            if (!showProgress) {
                var progress = diagram.find('.progress');
                $(progress).addClass('hide');
            }

            //图片操控按钮
            var handle = $('<div class="handle hide"></div>');
            diagram.append(handle);
            var del = $('<span class="dia-del del-icon oper"></span>');//删除图片
            var zoom = $('<span data-orgSrc="' + orgSrc + '" class="dia-zoom oper"></span>');//放大镜

            zoom.on('click', function () {//放大图片
                var uri = $(this).attr('data-orgSrc');
                top.previewImg.create(uri);
                top.previewImg.show();
            });
            handle.append(zoom);

            if (allowEditors)//是否允许编辑
            {
                del.on("click", function () {//删除自己
                    fileDOM[0].value = '';
                    docAddBtn.removeClass('hide');
                    $(this).parent().parent().remove();
                });
                handle.append(del);
            }

            docPhotoList.append(diagram);
            return diagram;
        }
    },
    uploadFile: function (tagId, limit, accessoryArray, allowEditors, size, typeConstraint, isDownload) {//上传文件 typeConstraint==false 表示不验证文件格式
        var that = this;
        size = !size ? 200 : size;//图片大小限制默认200MB
        allowEditors = allowEditors == null ? true : allowEditors;//是否允许编辑
        typeConstraint = typeConstraint == null ? that.fileConstraint : typeConstraint;//类型约束

        var container = $('#' + tagId);
        container.html('');
        var uploadType = container.attr('data-type');//上传类型
        var customid = container.attr("data-customid");//需要在标签上获得订单id用于上传

        var docAccessoryContainer = $('<div class="accessory-container"> </div>');//附件容器
        if (allowEditors)//是否显示添加按钮
        {
            container.append($('<span class="accessory-icon"></span>'));//图标
            var docAddBtn = $('<div class="addAccessory">' +
                '<span class="addAccessory-title">支持拖拽上传或</span><span class="addAccessory-btn">点击上传</span>' +
                '<span class="accessory-message">附件大小不得超过' + size + 'M</span>' +
                '</div>');
            docAccessoryContainer.append(docAddBtn);
            docAddBtn.on('click', function () {
                fileDOM[0].click();//添加按钮绑定选择文件事件
            });
        }

        var accessoryList = $('<div class="filelist clearfix"> </div>');//附件列表
        docAccessoryContainer.append(accessoryList);

        var dragFileType = "designFile";//告诉拖拽方法次位置适合放的文件类型
        if (!typeConstraint)//如果等于false则视为不限制文件类型
        {
            dragFileType = 'otherFile'
        }

        var fileDOM = $('<input type="file" data-limit="' + limit + '" style="display:none;" multiple class="file-' + tagId + ' ' + dragFileType + '">');
        container.append(fileDOM);//选择图片控件
        container.append(docAccessoryContainer);


        // 回显附件列表-begin
        if (accessoryArray) {
            for (var i = 0; i < accessoryArray.length; i++) {
                //张数限制
                var currentFileNum = accessoryList.find(".fileitem").length;
                if (docAddBtn && currentFileNum == (limit - 1))//插入最后一张图片时隐藏添加按钮
                {
                    docAddBtn.addClass('hide');
                }

                if (currentFileNum < limit) {
                    var item = accessoryArray[i];
                    var index = item.uri.lastIndexOf('.');
                    item.type = item.uri.slice(index + 1).toLowerCase();//文件类型
                    renderAccessory(item.uri, item.name, item.type);//渲染文件
                }
            }
        }
        // 回显附件列表-end


        //选择文件进行上传
        fileDOM[0].addEventListener('change', function (e) {

            var files = $(this)[0].files;
            var limit = parseInt(fileDOM.attr('data-limit'));
            //遍历选择的文件
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var uri = that.getObjectURL(file);
                var name = file.name;
                var index = name.lastIndexOf('.');
                var type = name.slice(index + 1).toLowerCase();//文件类型


                //文件格式判断
                if (typeConstraint && typeConstraint.indexOf(type) < 0) {
                    top.Message.show("注意", "不允许上传" + type + "格式的文件。", top.MsgState.Fail, 3000);
                    fileDOM[0].value = '';
                    return;
                }

                //文件大小验证
                var filesize = file.size / 1024 / 1024;//MB
                if (filesize > size) {
                    top.Message.show("注意", "请上传小于" + size + "MB的文件", top.MsgState.Fail, 3000);
                    fileDOM[0].value = '';
                    return;
                }

                //附件数限制
                var currentFileNum = accessoryList.find(".fileitem").length;
                if (currentFileNum == limit) {
                    top.Message.show("注意", "最多只能上传" + limit + "个文件。", top.MsgState.Fail, 3000);
                    fileDOM[0].value = '';
                    return;
                }
                if (currentFileNum == (limit - 1))//插入最后一张图片时隐藏添加按钮
                {
                    docAddBtn.addClass('hide');
                }
                var Accessory = renderAccessory(uri, name, type);//渲染文件

                //执行上传
                that.upload(file, Accessory, function (Accessory, percentVal) {
                    //上传进度
                    var progress = Accessory.find('.progress');
                    progress.removeClass('hide');
                    $(progress).find('span').text(percentVal + "%...");
                    if (percentVal == 100) {
                        $(progress).find('span').text('处理中...');
                    }
                }, function (Accessory, data) {
                    //上传成功
                    data = data.data;
                    Accessory.attr('data-complete', 'complete');
                    Accessory.attr('data-url', data.url);
                    var progress = Accessory.find('.progress');
                    $(progress).addClass('hide');
                }, function (Accessory, data) {
                    //上传失败
                    var progress = Accessory.find('.progress');
                    $(progress).find('span').text('上传失败');
                    $(progress).removeClass('hide');
                }, "", uploadType, customid);
            }
        });

        //渲染附件列表
        function renderAccessory(uri, name, type) {
            type = type.toUpperCase();
            var accessoryItem = $('<div title="' + name + '" data-url="'+uri+'" class="fileitem"><div class="progress hide"><span>0%</span></div></div>');
            accessoryItem.append($('<span class="filetype fl">' + type + '</span>'));
            var lastIndex=name.lastIndexOf('/');
            if(lastIndex>=0)
            {
                name=name.slice(lastIndex,name.length-lastIndex);
            }
            accessoryItem.append($('<span class="filename fl">' + name + '</span>'));
            if (isDownload) {
                var download = $('<span data-download-url="' + uri + '" class="download fl">下载</span>');
                download.on('click', function () {
                    top.Helper.download(uri);
                });
                accessoryItem.append(download);
            }

            if(allowEditors)
            {
                var del = $('<span class="del-icon fl"></span>');
                del.on('click', function () {
                    fileDOM[0].value = '';
                    $(this).parent().remove();
                    docAddBtn.removeClass('hide');
                });

                accessoryItem.append(del);
            }
            accessoryList.append(accessoryItem);
            return accessoryItem;
        }
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
    upload: function (files, operTag, progressCallback, successCallback, errorCallback, type, uploadType, customid) {//uploadType传给后台用于创建文件夹
        var url = type == "photo" ? top.config.WebService()['uploadImage'] : top.config.WebService()['uploadAccessory'];
        var xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);

        var token = $.cookie('token');
        xhr.setRequestHeader('token', token);

        var formdata = new FormData();
        formdata.append('file', files);
        formdata.append('customid', customid);
        formdata.append('type', uploadType);

        //上传进度
        xhr.upload.onprogress = function (event) {
            if (event.lengthComputable) {
                var percentComplete = Math.round(event.loaded * 100 / event.total);
                if (progressCallback) {
                    progressCallback(operTag, percentComplete);
                }
            }
        };

        if (operTag)//终止上传
        {
            var delBtn = $(operTag).find('.del-icon');
            delBtn.on('click', function () {
                xhr.abort();
            });
        }

        xhr.onload = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var data = xhr.responseText;
                data = JSON.parse(xhr.responseText);//服务端响应结果
            } else {
                errorCallback(operTag);
            }
        };

        xhr.onerror = function () {
            top.Message.show("注意", "文件上传过程中好像出现了问题。", top.MsgState.Fail, 3000);
        };
        xhr.send(formdata);

        //success回调
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var data = xhr.responseText;
                data = JSON.parse(xhr.responseText);//服务端响应结果
                successCallback(operTag, data);
            }
        };
        //设置超时时间
        xhr.timeout = 300000;//5分钟
        xhr.ontimeout = function (event) {
            top.Message.show("注意", "上传文件超时了，请检查下是否您的网络出现了问题？", top.MsgState.Fail, 3000);
        };//上传超时
    }
}

/*============================================================================================================*/
/*============================================================================================================*/
/*============================================================================================================*/
/*============================================================================================================*/
/*============================================================================================================*/
/*============================================================================================================*/

// **************************************************文本域

var textArea = {
    init: function (tagId, maxWordCount, value, placeholder, remark) {
        placeholder = placeholder || "";//提示
        remark = remark || "";//备注

        var domContainer = $(tagId);
        domContainer.html('');
        var divTextArea = $('<div class="textarea"></div>');
        domContainer.append(divTextArea);
        var domTextArea = $('<textarea placeholder="' + placeholder + '" maxlength="' + maxWordCount + '"></textarea>');
        divTextArea.append(domTextArea);
        var domspan = $('<span data-max="' + maxWordCount + '" class="wordCount">0/' + maxWordCount + '</span>');
        divTextArea.append(domspan);
        divTextArea.append($('<span class="remark">' + remark + '</span>'));

        var width = domContainer.css('width');
        width = parseInt(width);
        var height = domContainer.css('height');
        height = parseInt(height);
        domTextArea.css({'width': (width - 16) + 'px', 'height': (height - 16) + 'px'});

        domTextArea.keyup(function () {
            var wordCount = $(this).val().length;
            var maxCount = domspan.attr('data-max');
            domspan.text(wordCount + '/' + maxCount);
        });

        if (value) {
            domTextArea.val(value);
            var wordCount = domTextArea.val().length;
            var maxCount = domspan.attr('data-max');
            domspan.text(wordCount + '/' + maxCount);
        }

    }
};


/*============================================================================================================*/
/*============================================================================================================*/
/*============================================================================================================*/
/*============================================================================================================*/
/*============================================================================================================*/
/*============================================================================================================*/

// **************************************************日期选择插件

(function ($) {
    //点击空白收起菜单
    $(document).click(function () {
        DropUp();
    });

    function DropUp() {//收起菜单
        $(".lg-date-select").slideUp('fast');
    }

    //下拉菜单 data：数据原， oneClickCallback:单击回调
    $.fn.DateSelectRange=function (callback) {

        var random=Math.random().toString().replace('.','');

        var thisObj= $(this);
        var beginDate= top.Helper.Date.getNdayDate(-6,'yyyy-MM-dd');//开始时间
        var endDate= top.Helper.Date.getDate('yyyy-MM-dd');//结束时间
        var lgdateControl=$('<div class="lg-date-select" style="display: none;">'+
             '<i class="arrow"></i>'+
             '<div class="lg-date-range">'+
             '<span class="label">日期范围：</span>'+
             '<div style="margin-top: 10px;">'+
                '<input class="begin" id="begin_'+random+'" type="text" value="'+beginDate+'">'+
                '<em>至</em>'+
                '<input class="end" id="end_'+random+'" type="text" value="'+endDate+'" >'+
             '</div></div>');

        var fastSelect=$('<div class="lg-fast-select">'+
            '<span class="label">快捷日期：</span>'+
            '<div class="lg-select">'+
               '<span data-day="1">近1日<i></i></span>'+
               '<span data-day="3">近3日<i></i></span>'+
               '<span data-selected="true" data-day="7">近7日<i class="active"></i></span>'+
               '<span data-day="week">本周<i></i></span>'+
               '<span data-day="lastWeek">上周<i></i></span>'+
               '<span data-day="month">本月<i></i></span>'+
               '<span data-day="lastMonth">上月<i></i></span>'+
            '</div>'+
            '</div>'+
            '<div class="oper">'+
            '<button class="btn">确定</button>'+
            '<button class="btn-h">取消</button>'+
            '</div>'+
            '</div>');
        lgdateControl.append(fastSelect);

        $(fastSelect.find('.lg-select span')).on('click',function () {
            var thisObj=$(this);
            var i=thisObj.find('i');
            if(thisObj.attr('data-selected')=='true')
            {
                thisObj.attr('data-selected','false');
                i.removeClass('active');
            }
            else {

                var span=$(thisObj.parent()).find('span');
                $.each($(span),function (index,item) {
                    $(item).attr('data-selected','false');
                    $($(item).find('i')).removeClass('active');
                });

                thisObj.attr('data-selected','true');
                i.addClass('active');
            }

        });

        $(fastSelect.find('.btn')).on('click',function () {
            //确定按钮
            var control=$(this).parent().parent();
            setDate(control);
            if(callback)
            {
                callback();
            }
        });

        $(fastSelect.find('.btn-h')).on('click',function () {
            //取消按钮
            var selectDate=$(this).parent().parent();
            if($(selectDate).hasClass('lg-date-select'))
            {
                $(selectDate).slideUp('fast');
            }
        });

        lgdateControl.on('click',function (e) {
            e.stopPropagation();
        });
        thisObj.after(lgdateControl);
        thisObj.on('click',function (e) {
            var selectDate=$(this).next();
            if($(selectDate).hasClass('lg-date-select'))
            {
                $(selectDate).slideDown('fast');
            }
            e.stopPropagation();
        });

        laydate.render({elem: '#begin_'+random});
        laydate.render({elem: '#end_'+random});

        setDate(lgdateControl);

        //设置时间区间
        function setDate(obj) {
            var spanObj=obj.prev();
            var dateRange_begin=obj.find('.begin');//开始时间
            var dateRange_end=obj.find('.end');//结束时间
            var spanSelectList=obj.find('.lg-select').find('span');//快捷日期
            dateRange_begin=$(dateRange_begin).val()+' '+top.Helper.Date.getDate('hh:mm:ss');
            dateRange_end=$(dateRange_end).val()+' '+top.Helper.Date.getDate('hh:mm:ss');

            var flag=true;//是否选择自定义时间

            if(spanSelectList.length && spanSelectList.length>0)
            {
                $.each($(spanSelectList),function (i,item) {
                    if($(item).attr('data-selected')=='true')
                    {
                        flag=false;
                        var dayVal= $(item).attr('data-day');
                        switch (dayVal)
                        {
                            case '1': //近一日
                                dateRange_begin=top.Helper.Date.getNdayDate(-1,'yyyy-MM-dd hh:mm:ss');//开始时间
                                dateRange_end= top.Helper.Date.getDate('yyyy-MM-dd hh:mm:ss');
                                $(spanObj).attr('data-begin',dateRange_begin);
                                $(spanObj).attr('data-end',''/*dateRange_end*/);
                                $(spanObj).text($(item).text());
                                break;
                            case '3'://近三日
                                dateRange_begin=top.Helper.Date.getNdayDate(-3,'yyyy-MM-dd hh:mm:ss');//开始时间
                                dateRange_end= top.Helper.Date.getDate('yyyy-MM-dd hh:mm:ss');
                                $(spanObj).attr('data-begin',dateRange_begin);
                                $(spanObj).attr('data-end',''/*dateRange_end*/);
                                $(spanObj).text($(item).text());
                                break;
                            case '7'://近七日
                                dateRange_begin=top.Helper.Date.getNdayDate(-7,'yyyy-MM-dd hh:mm:ss');//开始时间
                                dateRange_end= top.Helper.Date.getDate('yyyy-MM-dd hh:mm:ss');
                                $(spanObj).attr('data-begin',dateRange_begin);
                                $(spanObj).attr('data-end',''/*dateRange_end*/);
                                $(spanObj).text($(item).text());
                                break;
                            case 'week'://本周
                                
                                var date=new Date();
                                var day=date.getDay();//获取星期几
                                dateRange_begin=top.Helper.Date.getNdayDate(-day+1,'yyyy-MM-dd');//开始时间
                                dateRange_end= top.Helper.Date.getDate('yyyy-MM-dd hh:mm:ss');
                                $(spanObj).attr('data-begin',dateRange_begin+" 00:00:00");
                                $(spanObj).attr('data-end',''/*dateRange_end*/);
                                $(spanObj).text($(item).text());
                                break;
                            case 'lastWeek'://上周
                                var date=new Date();
                                var day=date.getDay();//获取星期几
                                dateRange_begin=top.Helper.Date.getNdayDate(-7-day+1,'yyyy-MM-dd');//开始时间
                                dateRange_end= top.Helper.Date.getNdayDate(-day,'yyyy-MM-dd');//开始时间
                                $(spanObj).attr('data-begin',dateRange_begin+" 00:00:00");
                                $(spanObj).attr('data-end',dateRange_end+" 24:00:00");
                                $(spanObj).text($(item).text());
                                break;
                            case 'month'://本月
                                var date=new Date();
                                var month=date.getMonth()+1;//获取当前月份
                                dateRange_begin=date.getFullYear()+'-'+month+'-01';//开始时间
                                dateRange_end= top.Helper.Date.getDate('yyyy-MM-dd hh:mm:ss');
                                $(spanObj).attr('data-begin',dateRange_begin+" 00:00:00");
                                $(spanObj).attr('data-end',''/*dateRange_end*/);
                                $(spanObj).text($(item).text());
                                break;
                            case 'lastMonth'://上月
                                var date=new Date();
                                var month=date.getMonth();//获取当前月份
                                dateRange_begin=date.getFullYear()+'-'+month+'-01';//开始时间
                                dateRange_end=top.Helper.Date.getCurrentMonthLast(month);
                                $(spanObj).attr('data-begin',dateRange_begin+" 00:00:00");
                                $(spanObj).attr('data-end',dateRange_end+" 24:00:00");
                                $(spanObj).text($(item).text());
                                break;
                        }
                    }
                });
            }

            if(flag)
            {

                $(spanObj).attr('data-begin',dateRange_begin);
                $(spanObj).attr('data-end',dateRange_end);
                $(spanObj).text(dateRange_begin.split(' ')[0]+'至'+dateRange_end.split(' ')[0]);
            }

            obj.slideUp('fast');
        }
    }

})(jQuery);


/*============================================================================================================*/
/*============================================================================================================*/
/*============================================================================================================*/
/*============================================================================================================*/
/*============================================================================================================*/
/*============================================================================================================*/