/**
 * Created by inshijie on 2018/4/26.
 */
// 车间详情页面报价
var customid = '';
var orderid = '';
var goodsid = '';//商品id
var quotePrice='';//上次报价
var deadline="";//生产周期
$(function () {
    customid = Common.getUrlParam('customid');
    orderid = Common.getUrlParam('orderid');
    sessionStorage.setItem("src_factory", "./factory/quote_price.html?customid="+customid+"&orderid="+orderid);
    //必要性初始化
    OrderDetails.init();//附件上传
});

var orderInfo = {
    data: null,
};


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
        OrderDetails.getData();//加载数据
        
        parent.Main.redDot();//更新导航红点数值
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
                if(data.ordersummary&&data.ordersummary.orderinfo)
                {
                    $(".design-body").show();
                    goodsid = data.ordersummary.orderinfo.goodsid;
                }
                else {
                    return;
                }

                OrderDetails.dirtyCheck();
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
    quotePricePop: function () {//报价弹窗
        var url = encodeURI('./quotePricePop.html?quotePrice=' + quotePrice+"&deadline="+deadline)
        OrderDetails.layerIndex = layer.open({
            type: 2,
            title: '报价',
            shadeClose: false,
            shade: 0.1,
            area: ['416px', '284px'],
            content: url
        });
    },
    quotePrice:function (produce_day,quote_price) {
        OrderDetails.request({
            "orderid": orderid,
            "userId": OrderDetails.userInfo.userid,
            "customid": customid,
            "roleType": OrderDetails.userInfo.roletype,
            "token": OrderDetails.userInfo.token,
            "productioncycle":produce_day,//生产周期
            "returnprice":quote_price,//定价金额
            "commandcode": 141
        }, function (data) {
            if (data) {
                Common.msg(data.status.msg,data.status.code==0?200:"",2000,function () {
                    layer.closeAll();
                });
                OrderDetails.init();
            }
        }, 'priceRuler', null);
    },
    dirtyCheck: function () {
        
        var data = orderInfo.data;
        if (data) {
            var ordersummary = data.ordersummary;//订单概要
            $("#order_number").html(ordersummary.orderinfo.orderid);//订单号
            $("#order_datetime").html(ordersummary.orderinfo.createtime)
            $(".design-body .img-count img").attr('src', OrderDetails.getUrl['cosImgUrl'] + ordersummary.orderinfo.goodsimage);
            $('.type').html(ordersummary.orderinfo.goodsclass);
            $('#materials').html(ordersummary.goodsinfo.accessoriesname+" "+ordersummary.goodsinfo.texturename+" "+ordersummary.goodsinfo.technology+" "+ordersummary.goodsinfo.shape+" "+ordersummary.goodsinfo.color);
            $('#l_w_h').html(ordersummary.goodsinfo.size.length+"×"+ordersummary.goodsinfo.size.width+"×"+ordersummary.goodsinfo.size.height);

            deadline=ordersummary.orderinfo.deadline;
            quotePrice=ordersummary.price.returnprice;

            $('#deadline').html(parseInt(deadline));
            $('#quotestate').html(ordersummary.state.quotestate.msg);
            $('#order_count').text( "×" + ordersummary.goodsinfo.number);

            $("#slide_rule_os").attr('data-up-max',ordersummary.price.productPriceLimit||1000);
            $("#slide_rule_os").attr('data-down-max',ordersummary.price.productPriceLimit||1000);
            
            if(ordersummary.state.quotestate.code==2)//已报价
            {
                if(ordersummary.price.returnprice>ordersummary.price.mindprice)
                {
                    $("#slide_rule_os").attr('data-yellow-darrow-val',ordersummary.price.mindprice);
                }
                else {
                    $("#slide_rule_os").removeAttr('data-yellow-darrow-show');
                }
                if(ordersummary.price.returnprice!=0)
                {
                    $("#slide_rule_os").attr('data-red-darrow-show','');
                    $("#slide_rule_os").attr('data-red-darrow-name','上次报价：¥');
                    $("#slide_rule_os").attr('data-red-darrow-val',ordersummary.price.returnprice);
                }

            }

            
            if(ordersummary.orderinfo.renew==1)//续订订单
            {
                $(".renew").removeClass('hide');
            }

            if(ordersummary.state.quotestate.code<2)//未报价
            {
                $("#slide_rule_os").removeAttr('data-red-darrow-show');
                $("#slide_rule_os").removeAttr('data-yellow-darrow-show');
            }
            priceSlider.initSlideRuleOS();
            // 客服提交客户需求///////////////////////////////////////////////////////////////////////////////////////////
            var orderaddinfo = data.orderaddinfo;
            $("#production_requirements").val(orderaddinfo.fremarks||"");
            //判断是否存在参考图
            if (orderaddinfo.imageurl1 || orderaddinfo.imageurl2 || orderaddinfo.imageurl3) {
                $(".upload-photo").show();
                if (orderaddinfo.imageurl1) {
                    $(".photo-1").removeClass("hide");
                    $('#photo_1').css('background-image', "url(" + OrderDetails.getUrl['cosImgUrl'] + orderaddinfo.imageurl1 + ")");
                    $('#photo_1').find('.cover').addClass('active');
                    $('#photo_1').find('.zoon').find('img').attr('data-original', OrderDetails.getUrl['cosImgUrl'] + orderaddinfo.imageurl1);
                    $('#photo_1').find('.zoon').find('img').attr('src', OrderDetails.getUrl['cosImgUrl'] + orderaddinfo.imageurl1);
                    $('#photo_1').attr('data-url', orderaddinfo.imageurl1);
                    var id = $('#photo_1').find('.zoon').attr('id');
                    $('#' + id).viewer({
                        url: 'data-original',
                    });
                }else{
                    $(".photo-1").addClass("hide");
                }
                if (orderaddinfo.imageurl2) {
                    $(".photo-2").removeClass("hide");
                    $('#photo_2').css('background-image', "url(" + OrderDetails.getUrl['cosImgUrl'] + orderaddinfo.imageurl2 + ")");
                    $('#photo_2').find('.cover').addClass('active');
                    $('#photo_2').find('.zoon').find('img').attr('data-original', OrderDetails.getUrl['cosImgUrl'] + orderaddinfo.imageurl2);
                    $('#photo_2').find('.zoon').find('img').attr('src', OrderDetails.getUrl['cosImgUrl'] + orderaddinfo.imageurl2);
                    $('#photo_2').attr('data-url', orderaddinfo.imageurl2);

                    var id = $('#photo_2').find('.zoon').attr('id');
                    $('#' + id).viewer({
                        url: 'data-original',
                    });
                }else{
                    $(".photo-2").addClass("hide");
                }
                if (orderaddinfo.imageurl3) {
                    $(".photo-3").removeClass("hide");
                    $('#photo_3').css('background-image', "url(" + OrderDetails.getUrl['cosImgUrl'] + orderaddinfo.imageurl3 + ")");
                    $('#photo_3').find('.cover').addClass('active');
                    $('#photo_3').find('.zoon').find('img').attr('data-original', OrderDetails.getUrl['cosImgUrl'] + orderaddinfo.imageurl3);
                    $('#photo_3').find('.zoon').find('img').attr('src', OrderDetails.getUrl['cosImgUrl'] + orderaddinfo.imageurl3);
                    $('#photo_3').attr('data-url', orderaddinfo.imageurl3);

                    var id = $('#photo_3').find('.zoon').attr('id');
                    $('#' + id).viewer({
                        url: 'data-original',
                    });
                }else{
                    $(".photo-3").addClass("hide");
                }
            }
            //生产参考图
            if (orderaddinfo.fimageurl1) {
                $('#p_photo_1').css('background-image', "url(" + OrderDetails.getUrl['cosImgUrl'] + orderaddinfo.fimageurl1 + ")");
                $('#p_photo_1').find('.cover').addClass('active');
                $('#p_photo_1').find('.zoon').find('img').attr('data-original', OrderDetails.getUrl['cosImgUrl'] + orderaddinfo.fimageurl1);
                $('#p_photo_1').find('.zoon').find('img').attr('src', OrderDetails.getUrl['cosImgUrl'] + orderaddinfo.fimageurl1);
                $('#p_photo_1').attr('data-url', orderaddinfo.fimageurl1);

                $('.upload-photo-product').removeClass("hide");

                var id = $('#p_photo_1').find('.zoon').attr('id');
                $('#' + id).viewer({
                    url: 'data-original',
                });
            }else
            {
                $('.product-photo').addClass("hide");
            }

            if (orderaddinfo.accessoryurl) {
                $(".prev-annex").removeClass('hide');
                $("#prev_annex_name").html(orderaddinfo.accessoryurl);
                $("#prev_annex_download").on('click', function () {
                    Common.download(OrderDetails.getUrl['cosImgUrl'] + orderaddinfo.accessoryurl, orderaddinfo.accessoryid);
                });
            }

            $("#production_requirements").val(orderaddinfo.fremarks || "");
        }
    }
};
