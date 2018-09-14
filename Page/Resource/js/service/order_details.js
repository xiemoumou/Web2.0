// 客服订单详情
var currentSelectObj = null;
var customid = '';
var orderid = '';
var goodsid = '';//商品id
var taxrate = 0;//税率
var ok_finalprice=0;
// 设计稿
var uploadstate = 0;//附件上传
$(function () {


    customid = Common.getUrlParam('customid');
    orderid = Common.getUrlParam('orderid');
    sessionStorage.setItem("src_service", "./service/order_details.html?customid=" + customid + "&orderid=" + orderid);

    $(".add-address-btn").on('click', function () {
        OrderDetails.addAddress();
    });

    $(window).click(function () {
        if (currentSelectObj) {
            currentSelectObj.hide();
            currentSelectObj = null;
        }
    })

    //数字框验证
    $('.number-input').keyup(function () {
        var obj = $(this)[0];
        obj.value = obj.value.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符
        obj.value = obj.value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
        obj.value = obj.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
        obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d).*$/, '$1$2.$3');//只能输入两个小数

        if (obj.value.indexOf(".") < 0 && obj.value != "") {//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
            obj.value = parseFloat(obj.value);
        }

    })
    $('.order-count .number-input').keyup(function () {
        var correct = Common.convertInt($(this).val());
        $(this).val(correct);
    })

    //计算输入文本字数
    $("#design_requirements").keyup(function () {
        var length = $("#design_requirements").val().length;
        $('.design-requirements .count').html(length);
    });
    $("#production_requirements").keyup(function () {
        var length = $("#production_requirements").val().length;
        $('.production-requirements .count').html(length);
    });

    //必要性初始化
    OrderDetails.init();//附件上传

    //收货地址修改
    $("#address_modify").on('click', function () {
        OrderDetails.addAddress();
    });

    //删除收货地址
    $("#address_del").on('click', function () {
        OrderDetails.delAddress();
    });


    if (top.Main.userInfo.roletype == "4") {
        console.log("欢迎经理查看详情页面");
        $(".jl").css("display", "block");
    }

    //发票
    $(".invoice").on('click', function () {
        //确认发票
        var url = encodeURI('./service/invoice.html?orderid='+ orderid);
        var scrollH= parent.document.documentElement.scrollHeight-20;
        if(scrollH>698)
        {
            scrollH=698;
        }
        parent.layer.open({
            type: 2,
            title: '开票据',
            shadeClose: false,
            shade: 0.1,
            area: ['698px', scrollH +'px'],
            content: url
        });
    });

    //盒子
    $(".box").on('click', function () {
        //确认发票
        var url = encodeURI('./service/box.html?orderid='+ orderid);
        var scrollH= parent.document.documentElement.scrollHeight-20;
        if(scrollH>500)
        {
            scrollH=500;
        }
        parent.layer.open({
            type: 2,
            title: '配置包装',
            shadeClose: false,
            shade: 0.1,
            area: ['550px', scrollH +'px'],
            content: url
        });
    });

    //成品图
    $(document).on('click','.up-finished',function () {
        // orderid = $(this).parent().attr("data-orderid");
        // var taxrate = $(this).parent().attr("data-taxrate");
        var url = encodeURI('../page_service/service/upload_Deliver.html?orderid='  + orderid + "&customid=" + customid);
        var scrollH= parent.$(window).height();-20;
        if(scrollH>245)
        {
            scrollH=245;
        }

        parent.layer.open({
            type: 2,
            title: '上传发货图',
            shadeClose: false,
            shade: 0.1,
            area: ['416px', scrollH +'px'],
            content: url
        });
    });
});

var orderInfo = {
    shippingAddress: {//收货地址
        recipient: '',  //收件人
        recipienttele: '', //收件人电话
        state: '',  //国家
        province: '', //省份
        city: '',  //城市
        county: '',  //县区
        logisticsaddress1: '', //  收货地址
        logisticsaddress2: '' //	邮编
    },
    data: null,
};//订单信息


var OrderDetails = {
    layerIndex: 0,
    getUrl: {},//请求接口的URL
    getDataInterface: {},//请求数据的接口
    functionalInterface: {},//操作功能的接口
    userInfo: {},//用户信息
    request: function (data, callback, getDataInterface, functionalInterface, geturl) {
        var url = OrderDetails.getUrl['order'];
        if (geturl) {
            url = OrderDetails.getUrl[geturl];
        }
        if (getDataInterface) {
            url += OrderDetails.getDataInterface[getDataInterface];
        }
        if (functionalInterface) {
            url += OrderDetails.functionalInterface[functionalInterface];
        }
        Common.ajax(url, data, true, callback, function (error) {
            //接口调用错误处理
        });
    },
    init: function () {//初始化
        OrderDetails.getUrl = Common.getUrl();//获取请求接口的URL
        OrderDetails.getDataInterface = Common.getDataInterface();//获取请求数据的接口
        OrderDetails.functionalInterface = Common.functionalInterface();//获取操作功能的接口
        OrderDetails.userInfo = parent.Main.userInfo;//获取用户信息

        //初始化上传操作
        var orderId = Common.getUrlParam("orderId");//订单号
        var customid = Common.getUrlParam("customid");//客户id
        var inputFilePoto = document.querySelector('#input_file');//上传图片
        var inputFileAnnex = document.querySelector('#input_file_1');//上传附件

        //初始化图片上传******
        OrderDetails.uploadInit(orderId, customid, inputFilePoto, $(".upload-photo-btn"), function (uri, name, files, size, clickObj) {//选择文件后调用
                return OrderDetails.insertPhoto(uri, name, files, size, clickObj);//插入图片
            },
            function (err, data, imgId) {//上传成功后调用
                var str_url = (data.url).substr((data.url).indexOf(".com/") + 5);
                $("#" + imgId).attr('data-Url', str_url);
            }
            , "photo", function (progress, docId) {
                $("#" + docId).attr('progress', progress);
                $("#" + docId).find(".progress").text(progress + "%");
            });

        //初始化附件上传******
        OrderDetails.uploadInit(orderId, customid, inputFileAnnex, $(".upload-file-btn"), function (uri, name, files, size, clickObj) {//选择文件后调用
                $('#file_annex').removeClass('hide');
                return OrderDetails.insertFile(uri, name, files, size, clickObj);//显示已上传附件
            },
            function (err, data, fileId) {//上传成功后调用
                var str_url = (data.url).substr((data.url).indexOf(".com/") + 5);
                $("#file_annex").attr('data-file-url', str_url);

            }
            , "file", function (progress, docId) {
                $("#" + docId).attr('progress', progress);
                $("#" + docId).find(".progress").text(progress + "%");
            });

        OrderDetails.getData();//加载数据
        parent.Main.redDot();//更新导航红点数值


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

        //附件拖拽事件
        var upfile = $(".upload-annex")[0];
        Common.dragBind(upfile, inputFileAnnex, {"border": "2px dashed #5d5d5d"}, {"border": "2px dashed #eee"});//附件拖拽上传

    },
    getData: function () {//初始化数据
        OrderDetails.request({
            "orderId": orderid,
            "userId": OrderDetails.userInfo.userid,
            "customId": customid,
            "roleType": OrderDetails.userInfo.roletype,
            "token": OrderDetails.userInfo.token
        }, function (data) {
            if (data) {
                $('#file_annex').attr('data-file-name', '');
                $('#file_annex').attr('data-file-url', '');

                orderInfo.data = data;
                if (data.ordersummary && data.ordersummary.orderinfo) {
                    $(".design-body").show();
                    goodsid = data.ordersummary.orderinfo.goodsid;
                }
                else {
                    return;
                }

                OrderDetails.dirtyCheck();
                //初始化下拉菜单
                OrderDetails.initDropDownList();
                OrderDetails.initDropDownBox();
                //选择无
                $('.cbx-none').on('click', function () {
                    var div = $(this).parent().parent();
                    if (!$(this).prop('checked')) {
                        $(this).prop('checked', true);
                        return;
                    }
                    $.each(div.find('label'), function (i, item) {
                        var checkbox = $(item).find("input:checkbox");
                        checkbox.prop('checked', false);
                    });
                    $(this).prop('checked', true);
                });

                //选择普通按钮
                $(".drop-cbx").on("click", function () {
                    var flag = true;
                    var div = $(this).parent().parent();
                    div.find('.cbx-none').prop('checked', false);
                    //遍历是否有选中项目
                    $.each(div.find('label'), function (i, item) {
                        var checkbox = $(item).find("input:checkbox");
                        if (checkbox.prop('checked')) {
                            flag = false;
                        }
                    });
                    if (flag) {
                        div.find('.cbx-none').prop('checked', true);
                    }
                });

                // 开模复选框开始
                /*规则：
                 1 、在选择双面开模以前，所有的选项都是单选
                 2、选中双面开模后：
                 1、取消对“无”或者“浇铸”或者“模切”的选择，选中“双面开模”
                 2、不用取消已经选中的带2D或者3D的项目
                 3、带2D和3D两字的项目可以选择1个或者2个，最多两个项目
                 3、如果选择了双面开模，又尝试选择：“无”或者“浇铸”或者“模切”，则取消所有现有勾选，只选中最新选择的项目*/
                $(".mold-cbx-none,.mold-single").on('click', function (e) {
                    e.stopPropagation();
                    //判断是否选中双面开模
                    var isDoubleSidedMold = false;
                    if ($(e.target).val() == "双面开模") {
                        isDoubleSidedMold = true;
                    }

                    var div = $(this).parent().parent();
                    // if (!$(this).prop('checked')) {
                    //     $(this).prop('checked', true);
                    //     return;
                    // }

                    var isSelected=$(this).prop('checked');//是否勾选

                    $.each(div.find('label'), function (i, item) {
                        var checkbox = $(item).find("input:checkbox");
                        if (!isDoubleSidedMold||isDoubleSidedMold&&!isSelected)//如果没选中双面开模，取消其他所有选中
                        {
                            checkbox.prop('checked', false);
                        }
                        else {
                            if ($(checkbox).val().indexOf("2D") < 0 && $(checkbox).val().indexOf("3D") < 0) {
                                checkbox.prop('checked', false);
                            }
                        }

                    });
                    if(isSelected)
                    {
                        $(this).prop('checked', true);
                    }
                    else
                    {
                        $(".mold-cbx-none").prop('checked',true);
                    }
                });

                //选择普通按钮
                $(".mold-drop-cbx").on('click', function (e) {
                    var flag = true;
                    var div = $(this).parent().parent();
                    //判断是否选中双面开模
                    var isDoubleSidedMold = false;
                    var dsmInput = $(this).parent().parent().find(".doubleSidedMold");
                    if (dsmInput.prop('checked')) {
                        isDoubleSidedMold = true;
                    }

                    var count_2D_3D = 0;
                    var thisSelect=$(this).prop('checked');//获取当前选中状态
                    //遍历是否有选中项目
                    $.each(div.find('label'), function (i, item) {
                        var checkbox = $(item).find("input:checkbox");

                        if (checkbox.prop('checked')) {
                            flag = false;
                            if ($(checkbox).val().indexOf("2D") >= 0 || $(checkbox).val().indexOf("3D") >= 0)//统计选中2D与3D总数量)
                            {
                                count_2D_3D++;
                            }
                        }

                        //如果没选中'双面开模' 清除所有选中
                        if (!isDoubleSidedMold) {
                            $(checkbox).prop('checked', false);
                        }
                    });
                    $(this).prop('checked', thisSelect);//操作当前是否被选中
                    if(thisSelect)
                    {
                        div.find('.mold-cbx-none').prop('checked', false);
                    }

                    if (isDoubleSidedMold && count_2D_3D > 2)//如果选中'双面开模'的情况下又选择了2D3D超过两个则不能选中
                    {
                        $(this).prop('checked', false);
                    }

                    if (flag) {
                        div.find('.mold-cbx-none').prop('checked', true);
                    }
                    e.stopPropagation();
                });
                //开模复选框结束

                OrderDetails.statusShow();
                OrderDetails.initAddress();//初始化收件地址
                if (!$('#file_annex').attr('data-file-name')) {
                    $('#file_annex').addClass('hide');
                } else {
                    $('#file_annex').removeClass('hide');
                }
            }

        }, 'demand_details', null);
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
    addAddress: function () {//添加收获地址

        var url = encodeURI('./add-address.html?recipient=' + orderInfo.shippingAddress.recipient + '&recipienttele=' + orderInfo.shippingAddress.recipienttele + '&logisticsaddress2=' + orderInfo.shippingAddress.logisticsaddress2 + '&province=' + orderInfo.shippingAddress.province + '&city=' + orderInfo.shippingAddress.city + '&county=' + orderInfo.shippingAddress.county + '&logisticsaddress1=' + orderInfo.shippingAddress.logisticsaddress1)
        OrderDetails.layerIndex = layer.open({
            type: 2,
            title: '添加收货地址',
            shadeClose: false,
            shade: 0.1,
            area: ['400px', '420px'],
            content: url
        });
    },
    initSlideRule: function (price) {//报价尺
        $("#slide_rule_os").attr('data-red-point-val', price.returnprice);
        $("#slide_rule_os").attr('data-blue-point-val', price.designprice);
        $("#slide_rule_os").attr('data-yellow-point-val', price.mindprice);


            if (price.taxrate > 0)
                $("#slide_rule_os").attr("data-red-name", "(含税)");
            else
            {
                $("#slide_rule_os").attr("data-red-name", "(不含税)");
            }


        var finalprice = price.finalprice || 0;

        if (finalprice == 0) {
            $("#slide_rule_os").removeAttr('data-red-darrow-show');//定价金额
        }
        else {
            $("#slide_rule_os").attr('data-red-darrow-show', "")
        }
        $("#slide_rule_os").attr('data-red-darrow-val', finalprice);//定价金额
        $("#slide_rule_os").attr('data-up-max', price.productPriceLimit);//产品费上限
        $("#slide_rule_os").attr('data-down-max', price.designPriceLimit);//设计费上限
        var that = this;

        priceSlider.initSlideRuleOS({
            redCallback: function (item, scrollBar) {//定价
                OrderDetails.request({
                    "orderid": orderid,
                    "userId": OrderDetails.userInfo.userid,
                    "customid": customid,
                    "roleType": OrderDetails.userInfo.roletype,
                    "token": OrderDetails.userInfo.token,
                    "finalprice": parseInt($(".red-value").val()),
                    "designGuideFee": parseInt($("#slide_rule_os").attr('guide-fee-value')),
                    "commandcode": 141
                }, function (data) {
                    if (data) {
                        Common.msg(data.status.msg, data.status.code == 0 ? 200 : "");
                        that.getData();
                    }
                }, 'priceRuler', null);
            },
            blueCallback: function (item, scrollBar) {
                OrderDetails.request({
                    "orderid": orderid,
                    "userId": OrderDetails.userInfo.userid,
                    "customid": customid,
                    "roleType": OrderDetails.userInfo.roletype,
                    "token": OrderDetails.userInfo.token,
                    "designprice": parseInt($(".blue-value").val()),
                    "designGuideFee": parseInt($("#slide_rule_os").attr('guide-fee-value')),
                    "commandcode": 141
                }, function (data) {
                    if (data) {
                        Common.msg(data.status.msg, data.status.code == 0 ? 200 : "");
                        that.getData();
                    }
                }, 'priceRuler', null);
            },
            yellowCallback: function (item, scrollBar) {
                OrderDetails.request({
                    "orderid": orderid,
                    "userId": OrderDetails.userInfo.userid,
                    "customid": customid,
                    "roleType": OrderDetails.userInfo.roletype,
                    "token": OrderDetails.userInfo.token,
                    "mindprice": parseInt($(".yellow-value").val()),
                    "designGuideFee": parseInt($("#slide_rule_os").attr('guide-fee-value')),
                    "commandcode": 141
                }, function (data) {
                    if (data) {
                        Common.msg(data.status.msg, data.status.code == 0 ? 200 : "");
                        that.getData();
                    }
                }, 'priceRuler', null);
            }
        });
    },
    initDropDownList: function () {//下拉菜单
        $(".zb-dorpdownlist").on('click', function (e) {
            var dropdownlist = $(this).find('ul');
            if (currentSelectObj) {
                currentSelectObj.hide();
                currentSelectObj = null;
            }
            if ($(dropdownlist).css('display') == "none") {
                dropdownlist.show();
                currentSelectObj = dropdownlist;
            }
            else {
                dropdownlist.hide();
                currentSelectObj = null;
            }
            e.stopPropagation();
        });
        var select = $(".zb-dorpdownlist ul li");
        select.unbind();
        select.on('click', function (e) {
            $(this).parent().prev().html($(this).html());
            $(this).parent().hide();
            OrderDetails.updateOrderSummary(true);//触发更新详情事件
            e.stopPropagation();
        });
    },
    initDropDownBox: function () {//下拉盒子
        $(".zb-dorpdownbox").on('click', function (e) {
            var dorpdownbox = $(this).find('.zb-box');
            if (currentSelectObj) {
                currentSelectObj.hide();
                currentSelectObj = null;
            }
            dorpdownbox.show();
            currentSelectObj = dorpdownbox;//注释点击空白不隐藏下拉菜单

            //选中项初始化
            var div = $(this).find('.zb-box');
            var data_value = div.prev().attr('data-value');
            if (data_value) {
                var selectVals = data_value.split(';');
                $.each(div.find('label'), function (i, item) {
                    var checkbox = $(item).find("input:checkbox");
                    if ($.inArray(checkbox.val(), selectVals) >= 0) {
                        checkbox.prop('checked', true);
                    }
                    else {
                        checkbox.prop('checked', false);
                    }
                });
            }
            else {
                $.each(div.find('label'), function (i, item) {
                    var checkbox = $(item).find("input:checkbox");
                    checkbox.prop('checked', false);
                });
            }
            //选中项初始化结束

            $(this).find('.zb-box').on('click', function (e) {//防止点击复选框隐藏菜单
                e.stopPropagation();
            });


            var ok = $(this).find('.ok');//确定按钮
            ok.unbind();
            ok.on('click', function () {

                var result = [];
                var div = $(this).parent().parent();
                div.hide();
                $.each(div.find('label'), function (i, item) {
                    var checkbox = $(item).find("input:checkbox:checked");
                    if (checkbox.length > 0) {
                        result.push(checkbox.val());
                    }
                });

                var temp = result.join(';');
                div.prev().attr('data-value', temp);
                if (temp.length > 8) {
                    temp = temp.substring(0, 8);
                }
                if (result.length <= 0) {
                    temp = "请选择";
                }
                div.prev().html(temp);

                OrderDetails.updateOrderSummary(true);//触发更新详情事件
            });

            var close = $(this).find('.close');//关闭
            close.on('click', function () {
                $(this).parent().parent().hide();
            });

            e.stopPropagation();
        });
    },
    uploadInit: function (orderId, customid, inputFileObj, clickObj, callback, uploadSuccessCallback, filetype, progressCallback) {//初始化上传

        $(".cover").on('click', function (e) {
            e.stopPropagation();
        });

        $(".zoon").on('click', function (e) {
            e.stopPropagation();
        });

        $(".upload-photo .del").on('click', function (e) {
            var imgDiv = $(e.target).parent().parent();
            OrderDetails.deletePhoto(imgDiv);
            e.stopPropagation();
        });

        $(".annex-oper .del").on('click', function (e) {
            OrderDetails.deleteFile(this);
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
                var uri = OrderDetails.getObjectURL(file);
                var name = file.name;
                var type = file.type;
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

                var isupload = callback(uri, name, files, size, event.target);//展示选择的文件
                if (!isupload) {
                    return false;
                }

                var docId = $(event.target).attr('id');
                uploadstate += 1;
                cosUploadFile(file, function (err, data, docId) {//上传完成回调

                    uploadstate -= 1;
                    uploadSuccessCallback(err, data, docId);
                }, isupload, progressCallback,orderid);
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

        var id = $(clickObj).find('.zoon').attr('id');
        $('#' + id).viewer({
            url: 'data-original',
        });

        return $(clickObj).attr('id');
    }
    ,
    deletePhoto: function (imgDiv) {//删除图片
        $(imgDiv).css('background-image', 'url("../../images/icon/server/sctp.png")');
        $(imgDiv).find('.cover').removeClass('active');
        $(imgDiv).find('img').attr('data-original', '');
        $(imgDiv).attr('data-Url', '');
        $(imgDiv).attr('data-name', '');
        document.querySelector('#input_file').value = '';
    }
    ,
    insertFile: function (uri, name, files, size, clickObj) {
        var newfilename = name;
        if (name.length > 10) {
            newfilename = newfilename.substring(0, 10) + "...";
        }
        $('.upload-annex .annex-name').html(newfilename);
        $('.upload-annex .annex-name').attr('title', name);
        $('#file_annex').attr('data-file-name', name);
        $('.upload-annex .annex-oper .size').html(size + "M");
        return 'file_annex';
    }
    ,
    deleteFile: function (obj) {
        var obj = $(obj).parent();
        obj.addClass('hide');
        obj.attr('data-file-url', '');
        obj.attr('data-file-name', '');
        obj.find('.annex-name').html('请上传附件');
        obj.find('.size').html('0.00M');
        document.querySelector('#input_file_1').value = '';//上传附件
        $('#file_annex').attr('data-file-name', '');
        $('#file_annex').attr('data-file-url', '');
    },
    saveAddress: function (recipient, tel, code, province, city, block, address) {//保存收获地址
        orderInfo.shippingAddress.recipient = recipient;
        orderInfo.shippingAddress.recipienttele = tel;
        orderInfo.shippingAddress.province = province;
        orderInfo.shippingAddress.city = city;
        orderInfo.shippingAddress.county = block;
        orderInfo.shippingAddress.logisticsaddress1 = address;
        orderInfo.shippingAddress.logisticsaddress2 = code;
        OrderDetails.request({
            "userid": OrderDetails.userInfo.userid,
            "orderid": orderid,
            "roletype": OrderDetails.userInfo.roletype,
            "customid": customid,
            "token": OrderDetails.userInfo.token,
            "goodsid": goodsid,
            "commandcode": 150,
            "recipient": orderInfo.shippingAddress.recipient,
            "recipienttele": orderInfo.shippingAddress.recipienttele,
            "logisticsaddress2": orderInfo.shippingAddress.logisticsaddress2,
            "state": "中国",
            "province": orderInfo.shippingAddress.province,
            "city": orderInfo.shippingAddress.city,
            "county": orderInfo.shippingAddress.county,
            "logisticsaddress1": orderInfo.shippingAddress.logisticsaddress1
        }, function (data) {
            if (data && data.status && data.status.msg) {
                if(data.status.code==0)
                {
                    OrderDetails.initAddress();//初始化收件地址
                    Common.msg(data.status.msg,200,2000,function () {
                        layer.closeAll();
                    });
                }
                else
                {
                    Common.msg(data.status.msg,null,2000);
                }
            }
        }, 'receiving', null, "manager");
    },
    delAddress: function () {
        $('.add-address-btn').css('display', 'block');
        $('.shipping-address .address-info').css('display', 'none');
        orderInfo.shippingAddress.recipient = "";
        orderInfo.shippingAddress.recipienttele = "";
        orderInfo.shippingAddress.province = "";
        orderInfo.shippingAddress.city = "";
        orderInfo.shippingAddress.county = "";
        orderInfo.shippingAddress.logisticsaddress1 = "";
        orderInfo.shippingAddress.logisticsaddress2 = "";
    },
    initAddress: function () {
        $("#name").html(orderInfo.shippingAddress.recipient);
        $("#code").html(orderInfo.shippingAddress.logisticsaddress2);
        $("#address").html(orderInfo.shippingAddress.logisticsaddress1);
        $("#tel").html(orderInfo.shippingAddress.recipienttele);
        $("#area").html(orderInfo.shippingAddress.province + " " + orderInfo.shippingAddress.city + " " + orderInfo.shippingAddress.county);
        if (orderInfo.shippingAddress.recipient) {
            $('.add-address-btn').css('display', 'none');
            $('.shipping-address .address-info').css('display', 'block');
        }
    },
    dirtyCheck: function () {
        var data = orderInfo.data;
        if (data) {
            try {
                var address = data.useraddress;
                if (address) {
                    orderInfo.shippingAddress.recipient = address.consignee;
                    orderInfo.shippingAddress.recipienttele = address.tele;
                    orderInfo.shippingAddress.province = address.province;
                    orderInfo.shippingAddress.city = address.city;
                    orderInfo.shippingAddress.county = address.county;
                    orderInfo.shippingAddress.logisticsaddress1 = address.address;
                    orderInfo.shippingAddress.logisticsaddress2 = address.postcode;
                    isHaveAddress = true;
                }
                else {
                    isHaveAddress = false;
                }
                var ordersummary = data.ordersummary;//订单概要
                $("#order_number").html(ordersummary.orderinfo.orderid);//订单号
                $("#order_datetime").html(ordersummary.orderinfo.createtime);
                $("#fromplatform").html(ordersummary.orderinfo.fromplatform||"未指定");

                $("#wangwang_number").html(ordersummary.orderinfo.customerid);//客服旺旺号
                $("#customer_service").html(data.nickname.customnickname);//客服名称
                $("#designer_number").html(data.nickname.designernickname);//设计师名称
                $("#factory_number").html(data.nickname.factorynickname);//工厂名称
                //
                $('.status i').html("设计师" + ordersummary.state.designstate.msg);//设计接单状态
                $(".payment").html(ordersummary.state.payoffstate.msg);
                $(".design-body .img-count img").attr('src', OrderDetails.getUrl['cosImgUrl'] + ordersummary.orderinfo.goodsimage);

                $('.type .value').html(ordersummary.orderinfo.goodsclass);
                $('.materials .value').html(ordersummary.goodsinfo.texturename);
                $('.wear .value').html(ordersummary.goodsinfo.accessoriesname);


                var technology = ordersummary.goodsinfo.shape;
                $('.technology .value').attr('data-value', technology);

                if (technology && technology.length > 8) {
                    technology = technology.substring(0, 8);
                }
                $('.technology .value').html(technology || "");

                var machining = ordersummary.goodsinfo.technology;
                $('.machining .value').attr('data-value', machining);
                if (machining && machining.length > 8) {
                    machining = machining.substring(0, 8);
                }
                $('.machining .value').html(machining);

                var color = ordersummary.goodsinfo.color;
                $('.color .value').attr('data-value', color);
                if (color && color.length > 8) {
                    color = color.substring(0, 8);
                }
                $('.color .value').html(color);

                $('.l-w-h .par-length .center-input').val(ordersummary.goodsinfo.size.length);
                $('.l-w-h .par-width .center-input').val(ordersummary.goodsinfo.size.width);
                $('.l-w-h .par-height .center-input').val(ordersummary.goodsinfo.size.height);

                $('#order_count').val(ordersummary.goodsinfo.number);
                $("#order_cycle").val(ordersummary.orderinfo.deadline);
                $(".upload").show();//显示上传模块

                if(ordersummary.orderinfo.renew==1)//续订订单
                {
                    $(".renew").removeClass('hide');
                }

                //订单状态
                if (ordersummary.state.ordersheetstate.msg == "") {
                    $("#ordersheetstate").hide();
                }
                $("#ordersheetstate").html(ordersummary.state.ordersheetstate.msg);//咨询中

                if (ordersummary.state.designstate.msg == "") {
                    $("#designstate").hide();
                }
                $("#designstate").html(ordersummary.state.designstate.msg);//待设计接单

                if (ordersummary.state.payoffstate.msg == "") {
                    $("#payoffstate").hide();
                }
                $("#payoffstate").html(ordersummary.state.payoffstate.msg);//已支付

                if (ordersummary.state.quotestate.msg == "") {
                    $("#quotestate").hide();
                }
                $("#quotestate").html(ordersummary.state.quotestate.msg);//未生产

                //成品图操作
                if (ordersummary.state.orderstate.orderstate >= 8) {
                    if(ordersummary.orderinfo.endproductimages==1)
                    {
                        $(".up-finished").removeClass("hide");
                    }
                }

                //初始化滑动尺
                if (ordersummary.state.orderstate.orderstate >= 3)//锁定设计费
                {
                    $("#slide_rule_os").attr('islock-blue-point', '');
                }

                if (ordersummary.state.orderstate.orderstate >= 8) //锁定报价+锁定预算
                {
                    $("#slide_rule_os").attr('islock-yellow-point', '');
                    $("#slide_rule_os").attr('islock-red-point', '');
                }
                var price = ordersummary.price;
                ok_finalprice=price.finalprice;//定价金额
                console.log("后台返回设计引导费："+price.designGuideFee);
                taxrate = price.taxrate;
                OrderDetails.initSlideRule(price);

                // if (taxrate > 0)
                //     $(".red label").css("left","-31px");
                // else
                // {
                //     $(".red label").css("left","-45px");
                // }

                //控制按钮显示
                if (ordersummary.state.orderstate.orderstate < 2) {
                    $("#allocation_design").show();//分配设计
                }

                if (ordersummary.state.payoffstate.code == 0)//发起询价
                {
                    $("#inquiry").show();
                }

                if (ordersummary.state.designstate.code == 1 || ordersummary.state.designstate.code == 3) {//崔设计稿
                    $("#designerReminders").show();
                }

                if (ordersummary.state.payoffstate.code == 1 && ordersummary.state.ordersheetstate.code < 6)//分配生产
                {
                    $("#allocation_produce").show();
                    $("#allocation_produce").on('click', function () {

                        OrderDetails.statusClick.allocationProduce(ordersummary.state.orderstate.orderstate);
                    });
                }

                if (ordersummary.state.payoffstate.code == 0 && ordersummary.state.quotestate.code == 3)//确认支付
                {
                    $("#confirmPay").show();
                }

                if (ordersummary.state.ordersheetstate.code == 7) {
                    $("#logistics").show();//查看物流
                    $("#confirmReceipt").show();//确认收货
                }

                //设计方案／／／／／／／／／／／／／／／／／／／／／／／／／／／／／／／／／／／／／／／／／／／／／／／／／／／／／／／／／／
                var designinfo = data.designinfo;//设计师信息

                if (designinfo && designinfo.designer && designinfo.designer.length > 0 && designinfo.designer[0].designerpattern) {
                    if (data.designinfo.designer[0].designerpattern[0].patterniamgeurl1 || data.designinfo.designer[0].designerpattern[0].patterniamgeurl2 || data.designinfo.designer[0].designerpattern[0].patterniamgeurl3) {
                        // $('#designer_information_name').html(designinfo.designer[0].designername); //设计师昵称
                        $("#designer_information_date").html(designinfo.designsheettime);
                        var photo1 = designinfo.designer[0].designerpattern[0].patterniamgeurl1;
                        var photo2 = designinfo.designer[0].designerpattern[0].patterniamgeurl2;
                        var photo3 = designinfo.designer[0].designerpattern[0].patterniamgeurl3;
                        if (photo1 || photo2 || photo3) {
                            $('.design-diagram-layout').html('');
                            if (photo1) {
                                $('.design-diagram-layout').append($("<li class=\"design-diagram-layout-photo photo\"><img data-original=" + OrderDetails.getUrl['cosImgUrl'] + photo1 + " src=\"" + OrderDetails.getUrl['cosImgUrl'] + photo1 + "\" onerror=\"this.src='../../images/icon/loading.gif'\"><div class=\"cover active\">设计图</div></li>"));
                            }
                            if (photo2) {
                                $('.design-diagram-layout').append($("<li class=\"design-diagram-layout-photo photo\"><img data-original=" + OrderDetails.getUrl['cosImgUrl'] + photo2 + " src=\"" + OrderDetails.getUrl['cosImgUrl'] + photo2 + "\" onerror=\"this.src='../../images/icon/loading.gif'\"><div class=\"cover active\">设计图</div></li>"));
                            }
                            if (photo3) {
                                $('.design-diagram-layout').append($("<li class=\"design-diagram-layout-photo photo\"><img data-original=" + OrderDetails.getUrl['cosImgUrl'] + photo3 + " src=\"" + OrderDetails.getUrl['cosImgUrl'] + photo3 + "\" onerror=\"this.src='../../images/icon/loading.gif'\"><div class=\"cover active\">设计图</div></li>"));
                            }
                            $("#design_diagram_layout").viewer({
                                url: 'data-original'
                            });
                        }
                        else {
                            $("#design_diagram").hide();
                        }

                        if (designinfo.designer[0].designerpattern[0].designpatternversion >= 1 && designinfo.designer[0].designerpattern[0].feedbackstatus <= 1) {
                            $("#selected_plan").hide();
                            $("#selected_plan_btn").show();
                        }
                        else {
                            $("#selected_plan").show();
                            $("#selected_plan_btn").hide();
                        }
                        
                        if(OrderDetails.userInfo.roletype==4&&ordersummary.state.orderstate.orderstate<=7)//生产之前可以修改设计稿
                        {
                            $("#modifyDesigner_btn").removeClass('hide');
                        }


                        $("#note_content").html(designinfo.designer[0].designerpattern[0].patternmemo || "");//设计备注
                        $("#message_reply").val(designinfo.designer[0].designerpattern[0].feedback || "");
                        var snnexName = designinfo.designer[0].designerpattern[0].patternaccessoryurl;
                        if(snnexName)
                        {
                            $("#design_annex_name").html(snnexName.split('_')[1] || "");
                            $("#design_annex_name").attr('title', designinfo.designer[0].designerpattern[0].patternaccessoryurl || "");

                            $("#design_annex_download").on('click', function () {//下载设计师附件

                                Common.download(OrderDetails.getUrl['cosImgUrl'] + designinfo.designer[0].designerpattern[0].patternaccessoryurl, designinfo.designer[0].designerpattern[0].patternaccessoryid);
                            });

                        }

                        //其他附件
                        var otherSnnexName = designinfo.designer[0].designerpattern[0].otherAccessoryUrl||"";
                        if(otherSnnexName){
                           var otherAnnex=$('#other_design_annex');
                            otherAnnex.removeClass('hide');
                            otherAnnex.find('.annex-name').html(otherSnnexName.split('_')[1]);
                            
                            otherAnnex.find('.download').on('click',function () {
                                Common.download(OrderDetails.getUrl['cosImgUrl'] + designinfo.designer[0].designerpattern[0].otherAccessoryUrl);
                            });

                        }

                        $(".design-draft").show();//显示设计稿模块

                        $("#order_download").on('click', function () {//下载客户订单
                            OrderDetails.request({
                                "orderid": orderid,
                                "userid": OrderDetails.userInfo.userid,
                                "customid": customid,
                                "roletype": OrderDetails.userInfo.roletype,
                                "token": OrderDetails.userInfo.token
                            }, function (data) {
                                if (data) {
                                    if (data.status && data.status.addRess) {
                                        Common.download(data.status.addRess);
                                    }
                                    else {
                                        Common.msg(data.status.msg);
                                    }
                                }
                            }, 'order_download', null);
                        });

                        //评论留言
                        $("#leave_message_ok").on('click', function () {
                            var content = $("#message_reply").val();
                            if ($.trim(content) != "") {
                                OrderDetails.request({
                                    "orderid": orderid,
                                    "userid": OrderDetails.userInfo.userid,
                                    "customid": customid,
                                    "roletype": OrderDetails.userInfo.roletype,
                                    "token": OrderDetails.userInfo.token,
                                    "commandcode": 147,
                                    "feedback": content
                                }, function (data) {
                                    if (data && data.status && data.status.msg) {
                                        Common.msg(data.status.msg, "", 2000);
                                    }
                                }, 'comment', null);
                            }
                        });
                        //修正设计稿
                        $("#modifyDesigner_btn").on('click',function () {
                            layer.open({
                                type: 2,
                                title: '修正设计稿',
                                shadeClose: false,
                                shade: 0.1,
                                area: ['686px', '500px'],
                                content:"./modify_modal.html?orderid="+orderid,
                            });
                        });
                    }
                    else {
                        $(".design-draft").hide();
                    }
                }

                // 客服提交客户需求///////////////////////////////////////////////////////////////////////////////////////////
                var orderaddinfo = data.orderaddinfo;
                if (orderaddinfo.imageurl1) {
                    $('#photo_1').css('background-image', "url(" + OrderDetails.getUrl['cosImgUrl'] + orderaddinfo.imageurl1 + ")");
                    $('#photo_1').find('.cover').addClass('active');
                    $('#photo_1').find('.zoon').find('img').attr('data-original', OrderDetails.getUrl['cosImgUrl'] + orderaddinfo.imageurl1);
                    $('#photo_1').find('.zoon').find('img').attr('src', OrderDetails.getUrl['cosImgUrl'] + orderaddinfo.imageurl1);
                    $('#photo_1').attr('data-url', orderaddinfo.imageurl1);
                    var id = $('#photo_1').find('.zoon').attr('id');
                    $('#' + id).viewer({
                        url: 'data-original',
                    });
                }
                if (orderaddinfo.imageurl2) {
                    $('#photo_2').css('background-image', "url(" + OrderDetails.getUrl['cosImgUrl'] + orderaddinfo.imageurl2 + ")");
                    $('#photo_2').find('.cover').addClass('active');
                    $('#photo_2').find('.zoon').find('img').attr('data-original', OrderDetails.getUrl['cosImgUrl'] + orderaddinfo.imageurl2);
                    $('#photo_2').find('.zoon').find('img').attr('src', OrderDetails.getUrl['cosImgUrl'] + orderaddinfo.imageurl2);
                    $('#photo_2').attr('data-url', orderaddinfo.imageurl2);

                    var id = $('#photo_2').find('.zoon').attr('id');
                    $('#' + id).viewer({
                        url: 'data-original',
                    });
                }
                if (orderaddinfo.imageurl3) {
                    $('#photo_3').css('background-image', "url(" + OrderDetails.getUrl['cosImgUrl'] + orderaddinfo.imageurl3 + ")");
                    $('#photo_3').find('.cover').addClass('active');
                    $('#photo_3').find('.zoon').find('img').attr('data-original', OrderDetails.getUrl['cosImgUrl'] + orderaddinfo.imageurl3);
                    $('#photo_3').find('.zoon').find('img').attr('src', OrderDetails.getUrl['cosImgUrl'] + orderaddinfo.imageurl3);
                    $('#photo_3').attr('data-url', orderaddinfo.imageurl3);

                    var id = $('#photo_3').find('.zoon').attr('id');
                    $('#' + id).viewer({
                        url: 'data-original',
                    });
                }


                if (orderaddinfo.accessoryurl) {
                    var name=orderaddinfo.accessoryurl.split('_');
                    $("#file_annex .annex-name").html(name.length>=3?name[2]:name[1]);
                    $("#file_annex").attr("data-file-name", name[0]);
                    $("#file_annex").attr("data-file-url", orderaddinfo.accessoryurl);
                    $("#file_annex .download").on('click', function () {
                        Common.download(OrderDetails.getUrl['cosImgUrl'] + orderaddinfo.accessoryurl, orderaddinfo.accessoryid);
                    });
                }
                $("#file_annex .size").html("");

                $("#design_requirements").val(orderaddinfo.remarks || "");
                $(".requirements-content .count").html(orderaddinfo.remarks == null ? 0 : orderaddinfo.remarks.length);
                $("#production_requirements").val(orderaddinfo.fremarks || "");
                $(".production-requirements .count").html(orderaddinfo.fremarks == null ? 0 : orderaddinfo.fremarks.length);
                
                //生产参考图
                if (orderaddinfo.fimageurl1) {
                    $('#production_photo_1').css('background-image', "url(" + OrderDetails.getUrl['cosImgUrl'] + orderaddinfo.fimageurl1 + ")");
                    $('#production_photo_1').find('.cover').addClass('active');
                    $('#production_photo_1').find('.zoon').find('img').attr('data-original', OrderDetails.getUrl['cosImgUrl'] + orderaddinfo.fimageurl1);
                    $('#production_photo_1').find('.zoon').find('img').attr('src', OrderDetails.getUrl['cosImgUrl'] + orderaddinfo.fimageurl1);
                    $('#production_photo_1').attr('data-url', orderaddinfo.fimageurl1);

                    //$('.product-photo').removeClass("hide");

                    var id = $('#production_photo_1').find('.zoon').attr('id');
                    $('#' + id).viewer({
                        url: 'data-original',
                    });
                }

            }
            catch (e) {
                console.log(e);
            }
        }
    },
    updateOrderSummary: function (base, lockbtn, status) {//修改订单的参考信息
        if (uploadstate > 0) {
            Common.msg("正在上传请稍后...", null, 2000);
            return;
        }
        var patternimageurl1 = $("#photo_1").attr('data-url') || "";
        var patternimageurl2 = $("#photo_2").attr('data-url') || "";
        var patternimageurl3 = $("#photo_3").attr('data-url') || "";

        var prodPhoto=$("#production_photo_1");
        if(prodPhoto.attr('data-name'))
        {
            if(parseInt(prodPhoto.attr("progress"))!=100)
            {
                Common.msg("正在上传生产参考图请稍后...",null,2000);
                return;
            }
        }
        var data = {
            "userId": OrderDetails.userInfo.userid,
            "orderid": orderid,
            "roleType": OrderDetails.userInfo.roletype,
            "token": OrderDetails.userInfo.token,
            "goodsimage": patternimageurl1 || patternimageurl2 || patternimageurl3,//$(".design-body .img-count img").attr('src'),
            "referencepictureurl1": patternimageurl1,
            "referencepictureurl2": patternimageurl2, //参考商品图片2地址
            "referencepictureurl3": patternimageurl3, //参考商品图片3地址
            "accessoryurl": $("#file_annex").attr('data-file-url') || "", //参考附件地址
            "accessoryid": $("#file_annex").attr('data-file-name') || "", //参考附件原名
            "memo": $("#design_requirements").val() || "",  //设计备注
            "factorymemo": $("#production_requirements").val() || "",   //车间工厂备注
            "factorypictureurl1":prodPhoto.attr("data-url"),//生产参考图
        };

        if (!base && !status) {
            console.warn("修改图片附件备注信息");
        }

        if (status == 1)//修改工期
        {
            data = {
                "userId": OrderDetails.userInfo.userid,
                "orderid": orderid,
                "customid": customid,
                "roleType": OrderDetails.userInfo.roletype,
                "token": OrderDetails.userInfo.token,
                "commandcode": 150,
                "deadline": $("#order_cycle").val(),
            };
            console.info("修改工期");
        }
        if (base && !status) {
            data = {
                "userId": OrderDetails.userInfo.userid,
                "orderid": orderid,
                "customid": customid,
                "roleType": OrderDetails.userInfo.roletype,
                "token": OrderDetails.userInfo.token,
                "commandcode": 150,
                "number": $("#order_count").val(),
                "deadline": $("#order_cycle").val(),
                "length": $("#par_length").val(),//    --产品长度
                "width": $("#par_width").val(),//     ----产品宽度
                "height": $("#par_height").val(),//  ----产品高度
                "goodsclass": $(".parameter .type .value").html(),//   --- 修改产品类别
                "texturename": $(".parameter .materials .value").html(),//   -----产品材质
                "accessoriesname": $(".parameter .wear .value").html(),//---  产品配件名称
                "shape": $(".parameter .technology .value").attr('data-value'),//  ----  开模参数
                "color": $(".parameter .color .value").attr('data-value'),//    --- 电镀色参数
                "technology": $(".parameter .machining .value").attr('data-value'),//   --- 修改  工艺参数
            }
            console.info("修改基础信息");
        }

        //经理角色commandcode特殊处理
        if(OrderDetails.userInfo.roletype==4)
        {
            data.commandcode=102;
        }

        var that = this;
        OrderDetails.request(data, function (data) {

            if (data && data.status && data.status.msg) {
                Common.msg(data.status.msg, data.status.code == 1 ? 200 : '');
                that.getData();
            }
        }, 'updateOrderSummary', null);
    },
    statusShow: function () { //根据状态控制显示或隐藏某块区域
        if (orderInfo.data.ordersummary.state.orderstate.orderstate < 2) {
            $(".unassigned-designer").show();
        }
    },
    statusClick: {
        distributionDesign: function (obj) {//分配设计

            if(obj)
            {
                var axio=  $(obj).parent().parent().parent().next();
                
                var design=axio.find('.blue-value').val();//设计费
                var guidefee=axio.find('.guide-fee-value').html();//引导费
                guidefee=guidefee.slice(1,guidefee.length);
                layer.open(
                    {
                        type: 2,
                        title: '分配设计',
                        shadeClose: false,
                        shade: 0.1,
                        area: ['465px', '200px'],
                        content:"./distributionDesignConfirm.html?design="+design+"&guidefee="+guidefee,
                    }
                );
            }
            else{
                OrderDetails.request({
                    "orderid": orderid,
                    "userid": OrderDetails.userInfo.userid,
                    "customid": customid,
                    "roletype": OrderDetails.userInfo.roletype,
                    "token": OrderDetails.userInfo.token,
                    "commandcode": 142,
                    "goodsid": goodsid
                }, function (data) {
                    if (data && data.status && data.status.msg) {
                        Common.msg(data.status.msg,data.status.code==0?200:"");
                        OrderDetails.getData();
                    }
                }, 'designpat', null);
            }
        },

        inquiry: function () {//发起询价
            OrderDetails.request({
                "orderid": orderid,
                "userid": OrderDetails.userInfo.userid,
                "customid": customid,
                "roletype": OrderDetails.userInfo.roletype,
                "token": OrderDetails.userInfo.token,
                "commandcode": 140,
                "goodsid": goodsid
            }, function (data) {
                if (data && data.status && data.status.msg) {
                    Common.msg(data.status.msg);
                    OrderDetails.getData();
                }
            }, 'send', null);
        },
        designerReminders: function () {//崔设计稿
            OrderDetails.request({
                "orderid": orderid,
                "userid": OrderDetails.userInfo.userid,
                "customid": customid,
                "roletype": OrderDetails.userInfo.roletype,
                "token": OrderDetails.userInfo.token,
                "commandcode": 148,
                "goodsid": goodsid
            }, function (data) {
                if (data && data.status && data.status.msg) {
                    Common.msg(data.status.msg);
                    OrderDetails.getData();
                }
            }, 'designerReminders', null);
        },
        confirmReceipt: function () {//确认收货
            OrderDetails.request({
                "orderid": orderid,
                "userid": OrderDetails.userInfo.userid,
                "customid": customid,
                "roletype": OrderDetails.userInfo.roletype,
                "token": OrderDetails.userInfo.token,
                "commandcode": 59,
                "goodsid": goodsid
            }, function (data) {
                if (data && data.status && data.status.msg) {
                    Common.msg(data.status.msg);
                    OrderDetails.getData();
                }
            }, 'confirmReceipt', null);
        }, confirmPay: function () {//客户支付
            //调用同强的方法
            //var finalprice = parseInt($("#slide_rule_os").attr('data-red-point-val'));
            var url = encodeURI('./confirmPay.html?orderid=' + orderid + '&customid=' + customid + '&goodsid=' + goodsid + '&finalprice=' + ok_finalprice);
            layer.open({
                type: 2,
                title: '确认客户支付',
                shadeClose: false,
                shade: 0.1,
                area: ['400px', '230px'],
                content: url
            });
        },
        allocationProduce: function (orderstate) {//分配生产
            //分配生产前检查begin
            OrderDetails.request({
                "orderId": orderid,
                "userId": OrderDetails.userInfo.userid,
                "roleType": OrderDetails.userInfo.roletype,
                "token": OrderDetails.userInfo.token,
                "commandCode": 302,
            }, function (data) {
                if (data && data.status) {
                    if (data.status.code == 1)//弹出对账单，在对账单中点去定调用分配生产
                    {
                        var url = encodeURI('./service/order_check.html?allocationProduce=true&orderid=' + orderid+"&customid="+customid);
                        var scrollH = parent.$(window).height() - 20;
                        if (scrollH > 540) {
                            scrollH = 540;
                        }

                        parent.layer.open({
                            type: 2,
                            title: '分配生产前核对订单',
                            shadeClose: false,
                            shade: 0.1,
                            area: ['818px', scrollH + 'px'],
                            content: url
                        });
                    }
                    else if (data.status.code == 7)//发票信息不完整
                    {
                        //确认发票
                        var url = encodeURI('./service/invoice.html?orderid=' + orderid + "&allocationProduce=true&strict=true");
                        var scrollH = parent.$(window).height() - 20;
                        if (scrollH > 639) {
                            scrollH = 639;
                        }
                        parent.layer.open({
                            type: 2,
                            title: '完善发票',
                            shadeClose: false,
                            shade: 0.1,
                            area: ['639px', scrollH + 'px'],
                            content: url
                        });
                    }
                    else if (data.status.code == 1003)//没有设计稿
                    {
                        var url = encodeURI('./uploadDesign.html?orderid=' + orderid + '&customid=' + customid + '&goodsid=' + goodsid);
                        layer.open({
                            type: 2,
                            title: '上传设计稿',
                            shadeClose: false,
                            shade: 0.1,
                            area: ['565px', '570px'],
                            content: url
                        });
                        return true;
                    }
                    else if (data.status.code == 3)//没有收货地址
                    {
                        var url = encodeURI('./add-address.html?orderid=' + orderid + '&customid=' + customid + '&goodsid=' + goodsid)
                        layer.open({
                            type: 2,
                            title: '添加收货地址',
                            shadeClose: false,
                            shade: 0.1,
                            area: ['400px', '420px'],
                            content: url
                        });
                        return true;
                    }
                    else {
                        Common.msg(data.status.msg, null, 2000, function () {
                            return false;
                        });
                    }
                }
            }, 'beforeAllocation', null);//分配生产前检查end
        },
        designate: function () {//选定设计方案
            OrderDetails.request({
                "orderid": orderid,
                "userid": OrderDetails.userInfo.userid,
                "customid": customid,
                "roletype": OrderDetails.userInfo.roletype,
                "token": OrderDetails.userInfo.token,
                "commandcode": 144
            }, function (data) {
                if (data && data.status && data.status.msg) {
                    Common.msg(data.status.msg);
                    if (data.status.code == 0) {
                        window.location.reload();
                    }
                }
            }, 'designate', null);
        },
        logistics: function () {//查看物流信息
            window.location.href = "../../page_factory/factory/logistics_info.html?orderid=" + orderid + "&customid=" + customid;
        }
    },

};

var base = {
    init: function () {
        //OrderDetails.getData();
        window.location.reload();
    }
}

var distribution=function () {//确定分配设计
    
    layer.closeAll();
    OrderDetails.statusClick.distributionDesign(null);
}

$(document).on('click','.order_check',function () {
    var url = encodeURI('../page_service/service/order_check.html?orderid='+ orderid);
    var scrollH= parent.$(window).height()-20;
    if(scrollH>540)
    {
        scrollH=540;
    }

    parent.layer.open({
        type: 2,
        title: '核对订单',
        shadeClose: false,
        shade: 0.1,
        area: ['818px', scrollH +'px'],
        content: url
    });
});
