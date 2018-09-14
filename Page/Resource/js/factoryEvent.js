//车间、工厂---订单的事件
var orderid, customid, goodsid ; //定义变量  -- 定价
var returnprice = 0, deadline = 0, finalprice = 0;
$(function(){
	//点击报价 --弹出报价框
	$(document).on("click","button.workstage_quotePriceBtn",function(){
		orderid = $(this).parent().attr("data-orderid");
        customid = $(this).parent().attr("data-customid");
        goodsid = $(this).parent().attr("data-goodsid");
        returnprice = ($(this).parent().attr("data-returnprice")) || 0 ;
        deadline = $(this).parent().attr("data-deadline");
        				
        var url = encodeURI('../page_factory/factory/quotePricePop.html?quotePrice=' + returnprice +"&deadline="+ deadline);
        OrderDetails.layerIndex = layer.open({
            type: 2,
            title: '报价弹窗',
            shadeClose: false,
            shade: 0.1,
            area: ['416px', '262px'],
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
        var url = encodeURI('../page_factory/factory/acceptProduction.html?orderid='+ orderid +'&customid='+ customid +'&goodsid='+ goodsid +'&deadline='+ deadline +'&finalprice='+ finalprice);
        OrderOverview.layerIndex = layer.open({
            type: 2,
            title: '接受生产',
            shadeClose: false,
            shade: 0.1,
            area: ['410px', '252px'],
            content: url
        });
        
        	
    });
    //上传物流信息 --弹出上传物流信息弹窗 
	$(document).on("click","button#uploadLogistics",function(){
		orderid = $(this).parent().attr("data-orderid");
        customid = $(this).parent().attr("data-customid");
        goodsid = $(this).parent().attr("data-goodsid");
        
        // 				
        var url = encodeURI('../page_factory/factory/uploadLogist.html?orderid='+ orderid +'&customid='+ customid +'&goodsid='+ goodsid );
        OrderOverview.layerIndex = layer.open({
            type: 2,
            title: '上传物流信息',
            shadeClose: false,
            shade: 0.1,
            area: ['410px', '252px'],
            content: url
        });
        
        	
    });
    //进入订单详情
	$(document).on("click",".figure_orderCont",function(){
		orderid = $(this).parent().attr("data-orderid");
        customid = $(this).parent().attr("data-customid");
        window.location.href = "../page_factory/factory/order_details.html?orderid="+ orderid +"&customid="+ customid;
	});
    
});

var OrderOverview = {
	layerIndex: 0,
    getUrl: {},//请求接口的URL
    getDataInterface: {},//请求数据的接口
    functionalInterface: {},//操作功能的接口
    userInfo: {
    	"userid": $.cookie("userid"),
    	"roletype": $.cookie("roletype"),
    	"token": $.cookie("token")
    },//用户信息
    request: function (data, callback, getDataInterface, functionalInterface) {
        var url = OrderOverview.getUrl['order'];
        if (getDataInterface) {
            url += OrderOverview.getDataInterface[getDataInterface];
        }
        if (functionalInterface) {
            url += OrderOverview.functionalInterface[functionalInterface];
        }
        Common.ajax(url, data, true, callback, function (error) {
            //接口调用错误处理
        });
    },
    statusClick: {
        distributionDesign: function () {//分配设计
        	console.log(orderid, customid, goodsid);
        	 
            OrderOverview.request({
                "orderid": orderid,
                "userid": OrderOverview.userInfo.userid,
                "customid": customid,
                "roletype": OrderOverview.userInfo.roletype,
                "token": OrderOverview.userInfo.token,
                "commandcode": 142,
                "goodsid": goodsid
            }, function (data) {
            	console.log(data)
                if (data && data.status && data.status.msg) {
                	
                    Common.msg(data.status.msg);
                }
            }, 'designpat', null);  
        }
        
        
        
      // statusClick-------END 
    }
    
	
	
}
// 定义事件
var OrderDetails = {
	layerIndex: 0,
    getUrl: {},//请求接口的URL
    getDataInterface: {},//请求数据的接口
    functionalInterface: {},//操作功能的接口
    userInfo: {
    	"userid": $.cookie("userid"),
    	"roletype": $.cookie("roletype"),
    	"token": $.cookie("token")
    },//用户信息
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
    statusClick: {
        
      // statusClick-------END 
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
                Common.msg(data.status.msg,data.status.code==0?200:"",null,2000);
                OrderDetails.init();
            }
        }, 'priceRuler', null);
    },
    
	
	
}
