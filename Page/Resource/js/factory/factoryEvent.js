//车间、工厂---订单的事件
var orderid, customid, goodsid ; //定义变量  -- 定价
var returnprice = 0, deadline = 0, finalprice = 0;
/*
点击图片跳转详细页(点击查看订单一样跳转)
封装对象ClickEvent
* */
var ClickEvent = {
    click_:function(dom,state){
        var orderid = $(dom).parents(".js_list_").attr("data-orderid");
        var customid = $(dom).parents(".js_list_").attr("data-customid");
        if(state == '报价'){
            window.location.href = './quote_price.html?orderid='+orderid+'&customid='+customid;
        }else{
            window.location.href = './order_details.html?orderid='+orderid+'&customid='+customid;
        }
    }
}
$(function(){
	//点击报价 --弹出报价框
	$(document).on("click","button.workstage_quotePriceBtn",function(){
		orderid = $(this).parent().attr("data-orderid");
        customid = $(this).parent().attr("data-customid");
        goodsid = $(this).parent().attr("data-goodsid");
        returnprice = ($(this).parent().attr("data-returnprice")) || 0 ;
        deadline = $(this).parent().attr("data-deadline");
        var url = encodeURI('./quotePricePop.html?quotePrice=' + returnprice +"&deadline="+ deadline+"&orderid="+orderid+"&customid="+customid);
        OrderOverview.layerIndex = layer.open({
            type: 2,
            title: '报价弹窗',
            shadeClose: false,
            shade: 0.1,
            area: ['416px', '284px'],
            content: url
        });
    });
    //接受生产 --弹出接受生产弹窗 
	$(document).on("click","button.workstage_acceptProductionBtn",function(){
		orderid = $(this).parent().attr("data-orderid");
        customid = $(this).parent().attr("data-customid");
        goodsid = $(this).parent().attr("data-goodsid");
        deadline = $(this).parent().attr("data-deadline");
        finalprice = $(this).parent().attr("data-finalprice");
        // 				
        var url = encodeURI('./acceptProduction.html?orderid='+ orderid +'&customid='+ customid +'&goodsid='+ goodsid +'&deadline='+ deadline +'&finalprice='+ finalprice);
        layer.open({
            type: 2,
            title: '接受生产',
            shadeClose: false,
            shade: 0.1,
            area: ['410px', '246px'],
            content: url
        });
        
        	
    });
    //上传物流信息 --弹出上传物流信息弹窗 
	$(document).on("click","button.uploadLogistics",function(){
		orderid = $(this).parent().attr("data-orderid");
        customid = $(this).parent().attr("data-customid");
        goodsid = $(this).parent().attr("data-goodsid");
        
        // 				
        var url = encodeURI('./uploadLogist.html?orderid='+ orderid +'&customid='+ customid +'&goodsid='+ goodsid );
        OrderOverview.layerIndex = layer.open({
            type: 2,
            title: '上传物流信息',
            shadeClose: false,
            shade: 0.1,
            area: ['410px', '246px'],
            content: url
        });
        
        	
    });

    //查看物流信息
    $(document).on("click","button.showLogistics",function(){
        orderid = $(this).parent().attr("data-orderid");
        customid = $(this).parent().attr("data-customid");
        goodsid = $(this).parent().attr("data-goodsid");

        window.location.href="./logistics_info.html?orderid="+orderid+"&customid="+customid;
    });

    //操作成品图
    $(document).on('click','.up-finished,.ed-finished',function () {
        orderid = $(this).parent().attr("data-orderid");
        customid = $(this).parent().attr("data-customid");
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

var OrderOverview = {
	layerIndex: 0,
    request: function (data, callback, getDataInterface, functionalInterface) {
        var url = Common.getUrl()['order'];
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
    statusClick: {
        distributionDesign: function () {//分配设计
        	console.log(orderid, customid, goodsid);
            this.request({
                "orderid": orderid,
                "userid": parent.Main.userInfo.userid,
                "customid": customid,
                "roletype": parent.Main.userInfo.roletype,
                "token": parent.Main.userInfo.token,
                "commandcode": 142,
                "goodsid": goodsid
            }, function (data) {
                if (data && data.status && data.status.msg) {
                    Common.msg(data.status.msg);
                }
            }, 'designpat', null);  
        }
    }
}
