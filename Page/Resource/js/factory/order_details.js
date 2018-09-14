// 客服订单详情
var currentSelectObj = null;
var customid = '';
var orderid = '';
var goodsid = '';//商品id
$(function () {
    customid = Common.getUrlParam('customid');
    orderid = Common.getUrlParam('orderid');
    sessionStorage.setItem("src_factory", "./factory/order_details.html?customid=" + customid + "&orderid=" + orderid);

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
        var correct = Common.convertFloat($(this).val());
        $(this).val(correct);
    })
    $('.order-count .number-input').keyup(function () {
        var correct = Common.convertInt($(this).val());
        $(this).val(correct);
    })


    //必要性初始化
    OrderDetails.init();//附件上传

    //收货地址复制
    $("#address_copy").on('click', function () {
        //OrderDetails.copyAddress();
    });

    parent.Main.redDot();//更新导航红点数值


    //成品图
    $(document).on('click','.up-finished,.ed-finished',function () {
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
            title: '成品图',
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
    request: function (data, callback, getDataInterface, functionalInterface) {
        var url = OrderDetails.getUrl['order'];
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
            , "photo");

        //初始化附件上传******
        OrderDetails.uploadInit(orderId, customid, inputFileAnnex, $(".upload-file-btn"), function (uri, name, files, size, clickObj) {//选择文件后调用
                return OrderDetails.insertFile(uri, name, files, size, clickObj);//显示已上传附件
            },
            function (err, data, fileId) {//上传成功后调用
                var str_url = (data.url).substr((data.url).indexOf(".com/") + 5);
                $("#file_annex").attr('data-file-url', str_url);
            }
            , "file");

        OrderDetails.getData();//加载数据
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
                //OrderDetails.initDropDownList();
                //OrderDetails.initDropDownBox();
                OrderDetails.statusShow();
                OrderDetails.initAddress();//初始化收件地址
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
                if (temp.length > 10) {
                    temp = temp.substring(0, 10);
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
    uploadInit: function (orderId, customid, inputFileObj, clickObj, callback, uploadSuccessCallback, filetype) {//初始化上传

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
        else {
            $("#shipping-address").hide();
        }
    },
    dirtyCheck: function () {
        var data = orderInfo.data;
        if (data) {
            var address = data.useraddress;
            if (address) {
                orderInfo.shippingAddress.recipient = address.consignee;
                orderInfo.shippingAddress.recipienttele = address.tele;
                orderInfo.shippingAddress.province = address.province;
                orderInfo.shippingAddress.city = address.city;
                orderInfo.shippingAddress.county = address.county;
                orderInfo.shippingAddress.logisticsaddress1 = address.address;
                orderInfo.shippingAddress.logisticsaddress2 = address.postcode;
            } else {
                $(".shipping-address").hide();
            }
            var ordersummary = data.ordersummary;//订单概要

            if (ordersummary.state.quotestate.code != 3)//跳转报价页面
            {
                window.location.href = "./quote_price.html?customid=" + customid + "&orderid=" + orderid;
            }


            $("#order_number").html(ordersummary.orderinfo.orderid);//订单号
            $("#wangwang_number").html(ordersummary.orderinfo.customerid);//客服旺旺号
            $("#customer_service").html(data.nickname.customnickname);//客服名称
            $("#designer_number").html(data.nickname.designernickname);//设计师名称
            $("#factory_number").html(data.nickname.factorynickname);//工厂名称
            //
            $('.status i').html("设计师" + ordersummary.state.designstate.msg);//设计接单状态
            $(".payment").html(ordersummary.state.payoffstate.msg);
            $(".design-body .img-count img").attr('src', OrderDetails.getUrl['cosImgUrl'] + ordersummary.orderinfo.goodsimage);

            $('.type').html(ordersummary.orderinfo.goodsclass);
            $('.materials').html(ordersummary.goodsinfo.texturename);
            $('.wear').html(ordersummary.goodsinfo.accessoriesname);

            if (ordersummary.state.quotestate.code < 2)//报价跳转页面
            {
                window.location.href = "./quote_price.html?customid=" + customid + "&orderid=" + orderid;
            }
            
            //滑动尺子判断
            $("#slide_rule_os").attr('data-up-max', ordersummary.price.productPriceLimit || 1000);
            $("#slide_rule_os").attr('data-down-max', ordersummary.price.productPriceLimit || 1000);
            if (ordersummary.state.orderstate.orderstate < 7) {
                if (ordersummary.price.mindprice != 0) {
                    if (ordersummary.price.mindprice < ordersummary.price.returnprice) {
                        $("#slide_rule_os").attr("data-yellow-darrow-val", ordersummary.price.mindprice);
                        $("#slide_rule_os").attr('data-yellow-darrow-show', '');
                        $("#slide_rule_os").attr('data-yellow-darrow-name', "预算¥:");
                    }
                }
            }
            else {
                $("#slide_rule_os").attr('data-yellow-darrow-show', '');
                $("#slide_rule_os").attr('data-yellow-darrow-name', '预算¥:');

                if (ordersummary.price.returnprice == 0) {
                    $("#slide_rule_os").attr('data-yellow-darrow-val', ordersummary.price.finalprice);
                }
                else {
                    if (ordersummary.price.finalprice < ordersummary.price.returnprice)
                        $("#slide_rule_os").attr('data-yellow-darrow-val', ordersummary.price.finalprice);
                    else
                        $("#slide_rule_os").attr('data-yellow-darrow-val', ordersummary.price.returnprice);
                }
            }

            if (ordersummary.price.returnprice != 0 && ordersummary.state.orderstate.orderstate < 7) {
                $("#slide_rule_os").attr('data-red-darrow-val', ordersummary.price.returnprice);
                $("#slide_rule_os").attr('data-red-darrow-show', '');
                $("#slide_rule_os").attr('data-red-darrow-name', '上次报价¥:');
            }
            //滑动尺子判断End

            priceSlider.initSlideRuleOS();
            var technology = ordersummary.goodsinfo.shape;
            $('.technology').attr('data-value', technology);

            if (technology.length > 10) {
                technology = technology.substring(0, 10);
            }
            $('.technology').html(technology);

            var machining = ordersummary.goodsinfo.technology;
            $('.machining').attr('data-value', machining);
            if (machining.length > 10) {
                machining = machining.substring(0, 10);
            }
            $('.machining').html(machining);

            var color = ordersummary.goodsinfo.color;
            $('.color').attr('data-value', color);
            if (color.length > 10) {
                color = color.substring(0, 10);
            }
            $('.color').html(color);

            $('.l-w-h .par-length').text(ordersummary.goodsinfo.size.length);
            $('.l-w-h .par-width').text(ordersummary.goodsinfo.size.width);
            $('.l-w-h .par-height').text(ordersummary.goodsinfo.size.height);

            $('#order_count').text("×" + ordersummary.goodsinfo.number);
            $("#cycle").text(ordersummary.orderinfo.deadline);
            $(".upload").show();//显示上传模块
            //为元素添加data- 属性
            $(".operate-btn").attr({
                "data-orderid": ordersummary.orderinfo.orderid,
                "data-customid": ordersummary.orderinfo.customid,
                "data-goodsid": ordersummary.orderinfo.goodsid,
                "data-deadline": ordersummary.orderinfo.deadline,
                "data-finalprice": ordersummary.price.finalprice
            });
            //订单状态


            
            if(ordersummary.orderinfo.renew==1)//续订订单
            {
                $(".renew").removeClass('hide');
            }


            $("#ordersheetstate").html(ordersummary.state.ordersheetstate.msg);//咨询中
            $("#quotestate").html(ordersummary.state.quotestate.msg);//报价状态


            //控制按钮显示
            if (ordersummary.state.orderstate.orderstate == 7) {
                $("#acceptProduction").show();//接受生产按钮

            }

            //成品图操作
            if (ordersummary.state.orderstate.orderstate >= 8) {
                if(ordersummary.orderinfo.endproductimages==0)
                {
                    $(".up-finished").removeClass("hide");
                }
                else {
                    $(".ed-finished").removeClass("hide");
                }
            }

            if (ordersummary.state.orderstate.orderstate >= 6) {
                $("#ordersheetstate").show(); //订单状态
                $("#quotestate").hide();  //报价状态
            } else {
                $("#ordersheetstate").hide(); //订单状态
                $("#quotestate").show();  //报价状态
            }

            if (ordersummary.state.ordersheetstate.code == 6) {
                $("#uploadLogistics").show();//上传物流信息

            }
            if (ordersummary.state.ordersheetstate.code == 7) {
                $("#logistics").show();//查看物流

            }

            //设计方案／／／／／／／／／／／／／／／／／／／／／／／／／／／／／／／／／／／／／／／／／／／／／／／／／／／／／／／／／／
            var designinfo = data.designinfo;//设计师信息
            if (designinfo.designer != null && designinfo.designer.length > 0 && data.ordersummary.state.orderstate.orderstate >=8) {

                //$('#designer_information_name').html(designinfo.designer[0].designername);  //设计师昵称
                $("#designer_information_date").html(designinfo.designsheettime);
                var photo1 = designinfo.designer[0].designerpattern[0].patterniamgeurl1;
                var photo2 = designinfo.designer[0].designerpattern[0].patterniamgeurl2;
                var photo3 = designinfo.designer[0].designerpattern[0].patterniamgeurl3;
                if (photo1 || photo2 || photo3) {
                    $(".upload-photo").show();
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


                $("#note_content").html(designinfo.designer[0].designerpattern[0].patternmemo || "");//设计备注
                $("#message_reply").val(designinfo.designer[0].designerpattern[0].feedback || "");
                var snnexName = designinfo.designer[0].designerpattern[0].patternaccessoryurl;
                if (snnexName != null && snnexName.length > 10) {
                    snnexName = snnexName.substring(0, 10) + "...";
                }
                $("#design_annex_name").html(snnexName || "");
                $("#design_annex_name").attr('title', designinfo.designer[0].designerpattern[0].patternaccessoryurl || "");


                $("#design_annex_download").on('click', function () {//下载设计师附件
                    Common.download(OrderDetails.getUrl['cosImgUrl'] + designinfo.designer[0].designerpattern[0].patternaccessoryurl);
                });
                if (!snnexName) {
                    $("#design_annex").hide();
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

                //其他附件
                var otherSnnexName = designinfo.designer[0].designerpattern[0].otherAccessoryUrl||"";
                if(otherSnnexName){
                    var otherAnnex=$($('#other_annex_name').parent());
                    otherAnnex.removeClass('hide');
                    otherAnnex.find('.annex-name').html(otherSnnexName);
                
                    otherAnnex.find('.download').on('click',function () {
                        Common.download(OrderDetails.getUrl['cosImgUrl'] + designinfo.designer[0].designerpattern[0].otherAccessoryUrl);
                    });
                }

            }
            else {
                $(".design-draft").hide();
            }

            // 参考图+生产参考图///////////////////////////////////////////////////////////////////////////////////////////
            var orderaddinfo = data.orderaddinfo;
            //判断是否存在参考图
            if (orderaddinfo.imageurl1 || orderaddinfo.imageurl2 || orderaddinfo.imageurl3) {
                $(".upload-photo").removeClass("hide");

                if (orderaddinfo.imageurl1) {
                    $('#photo_1').css('background-image', "url(" + OrderDetails.getUrl['cosImgUrl'] + orderaddinfo.imageurl1 + ")");
                    $('#photo_1').find('.cover').addClass('active');
                    $('#photo_1').find('.zoon').find('img').attr('data-original', OrderDetails.getUrl['cosImgUrl'] + orderaddinfo.imageurl1);
                    $('#photo_1').find('.zoon').find('img').attr('src', OrderDetails.getUrl['cosImgUrl'] + orderaddinfo.imageurl1);
                    $('#photo_1').attr('data-url', orderaddinfo.imageurl1);
                    $('#photo_1').removeClass("hide");
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

                    $('#photo_2').removeClass("hide");

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

                    $('#photo_3').removeClass("hide");

                    var id = $('#photo_3').find('.zoon').attr('id');
                    $('#' + id).viewer({
                        url: 'data-original',
                    });
                }
            }

            //生产参考图
            if (orderaddinfo.fimageurl1) {
                $('#p_photo_1').css('background-image', "url(" + OrderDetails.getUrl['cosImgUrl'] + orderaddinfo.fimageurl1 + ")");
                $('#p_photo_1').find('.cover').addClass('active');
                $('#p_photo_1').find('.zoon').find('img').attr('data-original', OrderDetails.getUrl['cosImgUrl'] + orderaddinfo.fimageurl1);
                $('#p_photo_1').find('.zoon').find('img').attr('src', OrderDetails.getUrl['cosImgUrl'] + orderaddinfo.fimageurl1);
                $('#p_photo_1').attr('data-url', orderaddinfo.fimageurl1);

                $('.product-photo').removeClass("hide");

                var id = $('#p_photo_1').find('.zoon').attr('id');
                $('#' + id).viewer({
                    url: 'data-original',
                });
            }
            else 
            {
                $('.product-photo').addClass("hide");
            }
            if (orderaddinfo.accessoryurl) {
                $(".prev-annex").removeClass('hide');
                $("#prev_annex_name").html(orderaddinfo.accessoryurl.split('_')[1]);
                $("#prev_annex_download").on('click', function () {
                    Common.download(OrderDetails.getUrl['cosImgUrl'] + orderaddinfo.accessoryurl, orderaddinfo.accessoryid);
                });
            }
            
            $("#file_annex .size").html("");

            $("#production_requirements").val(orderaddinfo.fremarks || "");
        }
    },
    updateOrderSummary: function (base, lockbtn) {//修改订单的参考信息
        var patternimageurl1 = $("#photo_1").attr('data-url') || "";
        var patternimageurl2 = $("#photo_2").attr('data-url') || "";
        var patternimageurl3 = $("#photo_3").attr('data-url') || "";
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
            "factorymemo": $("#production_requirements").val() || ""   //车间工厂备注
        };
        if (base) {
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
        }


        OrderDetails.request(data, function (data) {
            if (data && data.status && data.status.msg) {
                Common.msg(data.status.msg);
            }
        }, 'updateOrderSummary', null);
    },
    statusShow: function () { //根据状态控制显示或隐藏某块区域
        /*if (orderInfo.data.ordersummary.state.orderstate.orderstate < 2) {
         $(".unassigned-designer").show();
         }*/
    },
    statusClick: {
        acceptProduction: function () {//接受生产
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
                    Common.msg(data.status.msg);
                }
            }, 'designpat', null);
        },

        uploadLogistics: function () {//上传物流信息
            var url = encodeURI('./uploadLogist.html?orderid=' + orderid + '&customid=' + customid + '&goodsid=' + goodsid);
            layer.open({
                type: 2,
                title: '上传物流信息',
                shadeClose: false,
                shade: 0.1,
                area: ['410px', '246px'],
                content: url
            });
        },

        confirmPay: function () {//客户支付
            //调用同强的方法
        },

        logistics: function () {//查看物流信息
            window.location.href = "./logistics_info.html?orderid=" + orderid + "&customid=" + customid;
        }
    }

};

var base = {
    init: function () {
        window.location.reload();
    }
};



