//客服---订单概览的事件
var orderid, customid, goodsid, finalprice ; //定义变量  -- 定价
var prdNumber,	//---订单的产品数量
    deadline,	//---订单工期
    length,		// --产品长度
    width,		//  ----产品宽度
    height,		//  ----产品高度
    goodsclass,		//   --- 修改产品类别
    texturename,	//   -----产品材质
    accessoriesname,//---  产品配件名称
    shape,		//  ----  开模参数
    color,		//    --- 电镀色参数
    technology;	//   --- 修改  工艺参数
var designFee = 0, guideFee = 0, finalPrice = 0, mindPrice = 0;//定义变量--设计费--引导费--定价--心理价
$(function(){
	//分配设计
	$(document).on("click",".workstage_designBtn",function(){
		orderid = $(this).parent().attr("data-orderid");
        customid = $(this).parent().attr("data-customid");
        goodsid = $(this).parent().attr("data-goodsid");
		OrderOverview.statusClick.distributionDesign();
	});
	//发起询价
	$(document).on("click",".workstage_enquiryBtn",function(){
		orderid = $(this).parent().attr("data-orderid");
        customid = $(this).parent().attr("data-customid");
        goodsid = $(this).parent().attr("data-goodsid");
		OrderOverview.statusClick.doEnquiry();
	});
	//催设计稿  催稿
	$(document).on("click",".workstage_reminderBtn",function(){
		orderid = $(this).parent().attr("data-orderid");
        customid = $(this).parent().attr("data-customid");
        goodsid = $(this).parent().attr("data-goodsid");
		OrderOverview.statusClick.doEnquiry();
	});
	//进入订单详情 
	$(document).on("click",".figure_orderCont",function(){
		orderid = $(this).parent().attr("data-orderid");
        customid = $(this).parent().attr("data-customid");
        window.location.href = "../page_service/service/order_details.html?orderid="+ orderid +"&customid="+ customid;
	});
	//查看物流信息
	$(document).on("click","button.checkLogist",function(){
		orderid = $(this).parent().attr("data-orderid");
        customid = $(this).parent().attr("data-customid");
        window.location.href="../../page_factory/factory/logistics_info.html?orderid"+orderid+"&customid="+customid;
	});
	//修改订单产品的数量
	$(document).on("blur",".prdNum",function(){
		var $parent = $(this).parent().parent().parent();
		orderid = $parent.attr("data-orderid");
        customid = $parent.attr("data-customid");
        prdNumber = $.trim( $(this).val() );//---订单的产品数量
        deadline = $.trim( $parent.find(".prdDeadline").val() );//---订单工期
        length = $.trim( $parent.find(".prdLength").val() );//    --产品长度
        width = $.trim( $parent.find(".prdWidth").val() );//     ----产品宽度
        height = $.trim( $parent.find(".prdHeight").val() );//  ----产品高度
        //调用并触发更新订单内容的事件
        OrderOverview.updateOrderSummary(3);
	});
	//修改订单产品的长度
	$(document).on("blur",".prdLength",function(){
		var $parent = $(this).parent().parent().parent();
		orderid = $parent.attr("data-orderid");
        customid = $parent.attr("data-customid");
        prdNumber = $.trim( $parent.find(".prdNum").val() );//---订单的产品数量     
        deadline = $.trim( $parent.find(".prdDeadline").val() );//---订单工期
        length = $.trim( $parent.find(".prdLength").val() );//    --产品长度
        width = $.trim( $parent.find(".prdWidth").val() );//     ----产品宽度
        height = $.trim( $parent.find(".prdHeight").val() );//  ----产品高度
        //调用并触发更新订单内容的事件
        OrderOverview.updateOrderSummary(3);
	});
	//修改订单产品的宽度
	$(document).on("blur",".prdWidth",function(){
		var $parent = $(this).parent().parent().parent();
		orderid = $parent.attr("data-orderid");
        customid = $parent.attr("data-customid");
        prdNumber = $.trim( $parent.find(".prdNum").val() );//---订单的产品数量     
        deadline = $.trim( $parent.find(".prdDeadline").val() );//---订单工期
        length = $.trim( $parent.find(".prdLength").val() );//    --产品长度
        width = $.trim( $parent.find(".prdWidth").val() );//     ----产品宽度
        height = $.trim( $parent.find(".prdHeight").val() );//  ----产品高度
        //调用并触发更新订单内容的事件
        OrderOverview.updateOrderSummary(3);
	});
	//修改订单产品的高度
	$(document).on("blur",".prdHeight",function(){
		var $parent = $(this).parent().parent().parent();
		orderid = $parent.attr("data-orderid");
        customid = $parent.attr("data-customid");
        prdNumber = $.trim( $parent.find(".prdNum").val() );//---订单的产品数量     
        deadline = $.trim( $parent.find(".prdDeadline").val() );//---订单工期
        length = $.trim( $parent.find(".prdLength").val() );//    --产品长度
        width = $.trim( $parent.find(".prdWidth").val() );//     ----产品宽度
        height = $.trim( $parent.find(".prdHeight").val() );//  ----产品高度
        //调用并触发更新订单内容的事件
        OrderOverview.updateOrderSummary(3);
	});
	//修改订单产品的工期
	$(document).on("blur",".prdDeadline",function(){
		var $parent = $(this).parent().parent().parent();
		orderid = $parent.attr("data-orderid");
        customid = $parent.attr("data-customid");
        prdNumber = $.trim( $parent.find(".prdNum").val() );//---订单的产品数量     
        deadline = $.trim( $parent.find(".prdDeadline").val() );//---订单工期
        length = $.trim( $parent.find(".prdLength").val() );//    --产品长度
        width = $.trim( $parent.find(".prdWidth").val() );//     ----产品宽度
        height = $.trim( $parent.find(".prdHeight").val() );//  ----产品高度
        //调用并触发更新订单内容的事件
        OrderOverview.updateOrderSummary(3);
	});
	//修改订单产品的类别
	$(document).on("click","ul.productType_service li",function(){
		var $parent = $(this).parent().parent().parent().parent().parent();
		orderid = $parent.attr("data-orderid");
        customid = $parent.attr("data-customid");
        goodsclass = $.trim( $parent.find(".productTypeBtn_service").text() );	//   --- 修改产品类别
    	texturename = $.trim( $parent.find(".textureBtn_service").text());	//   -----产品材质
    	accessoriesname = $.trim( $parent.find(".partsBtn_service").text());//---  产品配件名称
        //调用并触发更新订单内容的事件
        setTimeout(function(){
        	OrderOverview.updateOrderSummary(1);
        },150);
        
	});
	//修改订单产品的材质
	$(document).on("click","ul.texture_service li",function(){
		var $parent = $(this).parent().parent().parent().parent().parent();
		orderid = $parent.attr("data-orderid");
        customid = $parent.attr("data-customid");
        goodsclass = $.trim( $parent.find(".productTypeBtn_service").text());	//   --- 修改产品类别
    	texturename = $.trim( $parent.find(".textureBtn_service").text());	//   -----产品材质
    	accessoriesname = $.trim( $parent.find(".partsBtn_service").text());//---  产品配件名称
        //调用并触发更新订单内容的事件
        setTimeout(function(){
        	OrderOverview.updateOrderSummary(1);
        },150);
	});
	//修改订单产品的配件
	$(document).on("click","ul.parts_service li",function(){
		var $parent = $(this).parent().parent().parent().parent().parent();
		orderid = $parent.attr("data-orderid");
        customid = $parent.attr("data-customid");
        goodsclass = $.trim( $parent.find(".productTypeBtn_service").text());	//   --- 修改产品类别
    	texturename = $.trim( $parent.find(".textureBtn_service").text());	//   -----产品材质
    	accessoriesname = $.trim( $parent.find(".partsBtn_service").text());//---  产品配件名称
        //调用并触发更新订单内容的事件
        setTimeout(function(){
        	OrderOverview.updateOrderSummary(1);
        },150);
	});
	//修改订单产品的开模方法  参数
	$(document).on("click","button.confirm_addMold_work",function(){
		var $parent = $(this).parent().parent().parent().parent().parent().parent();
		orderid = $parent.attr("data-orderid");
        customid = $parent.attr("data-customid");
        shape = $.trim( $parent.find(".moldOpenBtn").text());//  ----  开模参数
        color = $.trim( $parent.find(".craftBtn").text());//    --- 电镀色参数
        technology = $.trim( $parent.find(".electroplateBtn").text());//   --- 修改  工艺参数
        //调用并触发更新订单内容的事件
        setTimeout(function(){
        	OrderOverview.updateOrderSummary(2);
        },150);
	});
	//修改订单产品的工艺  参数
	$(document).on("click","button.confirm_addCraft_work",function(){
		var $parent = $(this).parent().parent().parent().parent().parent().parent();
		orderid = $parent.attr("data-orderid");
        customid = $parent.attr("data-customid");
        shape = $.trim( $parent.find(".moldOpenBtn").text());//  ----  开模参数
        color = $.trim( $parent.find(".craftBtn").text());//    --- 电镀色参数
        technology = $.trim( $parent.find(".electroplateBtn").text());//   --- 修改  工艺参数
        //调用并触发更新订单内容的事件
        setTimeout(function(){
        	OrderOverview.updateOrderSummary(2);
        },150);
	});
	//修改订单产品的电镀色  参数
	$(document).on("click","button.confirm_addColor_work",function(){
		var $parent = $(this).parent().parent().parent().parent().parent().parent();
		orderid = $parent.attr("data-orderid");
        customid = $parent.attr("data-customid");
        shape = $.trim( $parent.find(".moldOpenBtn").text());//  ----  开模参数
        color = $.trim( $parent.find(".craftBtn").text());//    --- 电镀色参数
        technology = $.trim( $parent.find(".electroplateBtn").text());//   --- 修改  工艺参数
        //调用并触发更新订单内容的事件
        setTimeout(function(){
        	OrderOverview.updateOrderSummary(2);
        },150);
	});
	//客服确认收货   workstage_confirmDeliveryBtn
	$(document).on("click","button.workstage_confirmDeliveryBtn",function(){
		orderid = $(this).parent().attr("data-orderid");
        customid = $(this).parent().attr("data-customid");
        goodsid = $(this).parent().attr("data-goodsid");
        //调用并触发  确认收货  事件
        OrderOverview.statusClick.confirmRecp();
    });
    //客服确认支付  
    $(document).on("click","button.workstage_confirmPayBtn",function(){
		orderid = $(this).parent().attr("data-orderid");
        customid = $(this).parent().attr("data-customid");
        goodsid = $(this).parent().attr("data-goodsid");
        finalprice = $(this).parent().attr("data-finalprice");
        				
        var url = encodeURI('./confirmPay.html?orderid='+ orderid +'&customid='+ customid +'&goodsid='+ goodsid +'&finalprice='+ finalprice);
        OrderOverview.layerIndex = layer.open({
            type: 2,
            title: '确认客户支付',
            shadeClose: false,
            shade: 0.1,
            area: ['400px', '242px'],
            content: url
        });
    });
    //修改设计费和引导费
    $(document).on("click",".row .blue-btn", function(){
    	var $parent = $(this).parent().parent().parent().parent().parent();
	    	orderid = $parent.attr("data-orderid");
	    	customid = $parent.attr("data-customid");
    	designFee = parseInt($(this).prev(".blue-value").val()) ;
    	guideFee = parseInt( (($(this).parent().parent().parent().find(".guide-fee-value")).text()).replace(/[^0-9]/ig,"") );
    	//判断设计费不为零
    	if ( designFee >= 8 ) {
    		OrderOverview.statusClick.changePrice( 1 );
    	} else{
    		Common.msg("设计费不少于8元");
    	}
    });
    //修改订单定价
    $(document).on("click",".row .red-btn", function(){
    	var $parent = $(this).parent().parent().parent().parent().parent();
	    	orderid = $parent.attr("data-orderid");
	    	customid = $parent.attr("data-customid");
    	finalPrice = parseInt($(this).prev(".red-value").val()) ;
    	
    	//判断设计费不为零
    	if ( finalPrice > 0 ) {
    		OrderOverview.statusClick.changePrice( 3 );
    	} else{
    		Common.msg("订单定价不能为0");
    	}
    });
    //修改客户心理价--预算
    $(document).on("click",".row .yellow-btn", function(){
    	var $parent = $(this).parent().parent().parent().parent().parent();
	    	orderid = $parent.attr("data-orderid");
	    	customid = $parent.attr("data-customid");
    	mindPrice = parseInt($(this).prev(".yellow-value").val()) ;
    	
    	//判断设计费不为零
    	if ( mindPrice > 0 ) {
    		OrderOverview.statusClick.changePrice( 2 );
    	} else{
    		Common.msg("客户预算不能为0");
    	}
    });
    
});

var OrderOverview = {
	layerIndex: 0,
    getUrl: {},//请求接口的URL
    getDataInterface: {},//请求数据的接口
    functionalInterface: {},//操作功能的接口
    userInfo: {
    	"userid": $.cookie("userid"),
    	"roletype": parseInt( $.cookie("roletype") ),
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
    updateOrderSummary: function (base,lockbtn) {//修改订单的信息, 修改产品类别、产品材质、产品配件
         
        var data = {};
        if (base == 1) {
            data = {
                "userId": OrderOverview.userInfo.userid,
                "orderid": orderid,
                "customid": customid,
                "roleType": OrderOverview.userInfo.roletype,
                "token": OrderOverview.userInfo.token,
                "commandcode": 150,
                "goodsclass": goodsclass,//   --- 修改产品类别
                "texturename": texturename,//   -----产品材质
                "accessoriesname": accessoriesname,//---  产品配件名称
            }
        }else if (base == 2) {
            data = {
                "userId": OrderOverview.userInfo.userid,
                "orderid": orderid,
                "customid": customid,
                "roleType": OrderOverview.userInfo.roletype,
                "token": OrderOverview.userInfo.token,
                "commandcode": 150,
                "shape": shape,//  ----  开模参数
                "color": color,//    --- 电镀色参数
                "technology": technology//   --- 修改  工艺参数
            }
        }else if (base == 3) {
            data = {
                "userId": OrderOverview.userInfo.userid,
                "orderid": orderid,
                "customid": customid,
                "roleType": OrderOverview.userInfo.roletype,
                "token": OrderOverview.userInfo.token,
                "commandcode": 150,
                "number": prdNumber,//---订单的产品数量
                "deadline":	deadline,//---订单工期
                "length": length,//    --产品长度
                "width": width,//     ----产品宽度
                "height": height,//  ----产品高度
            }
        }


        OrderOverview.request(data, function (data) {
            if (data && data.status && data.status.msg) {
                Common.msg(data.status.msg);
            }
        }, 'updateOrderSummary', null);
    },
	statusClick: {
        distributionDesign: function () {//分配设计
        	//console.log(orderid, customid, goodsid);
        	 
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
        },
        doEnquiry: function () {//发起询价
        	//console.log(orderid, customid, goodsid);
            OrderOverview.request({
                "orderid": orderid,
                "userid": OrderOverview.userInfo.userid,
                "customid": customid,
                "roletype": OrderOverview.userInfo.roletype,
                "token": OrderOverview.userInfo.token,
                "commandcode": 140,
                "goodsid": goodsid
            }, function (data) {
            	console.log(data)
                if (data && data.status && data.status.msg) {
                	
                    Common.msg(data.status.msg);
                }
            }, 'enquiry', null);  
        },
        doReminder: function () {//催稿  催设计稿
        	//console.log(orderid, customid, goodsid);
            OrderOverview.request({
                "orderid": orderid,
                "userid": OrderOverview.userInfo.userid,
                "customid": customid,
                "roletype": OrderOverview.userInfo.roletype,
                "token": OrderOverview.userInfo.token,
                "commandcode": 148
            }, function (data) {
                if (data && data.status && data.status.msg) {
                	
                    Common.msg(data.status.msg);
                }
            }, 'reminder', null);  
        },
        confirmRecp: function () {//确认收货---客服
        	 
        	//console.log(orderid, customid, goodsid);
            OrderOverview.request({
                "orderid": orderid,
                "userid": OrderOverview.userInfo.userid,
                "customid": customid,
                "roletype": OrderOverview.userInfo.roletype,
                "token": OrderOverview.userInfo.token,
                "commandcode": 59,
                "goodsid": goodsid
            }, function (data) {
                if (data && data.status && data.status.msg) {
                	
                    Common.msg(data.status.msg);
                }
            }, 'confirmReceipt', null);  
        },
        changePrice: function( temp ){ //改变价格--设计费--引导费--报价--预算价格
        	if (temp == 1) {//修改设计费--引导费
        		var data = {
		        		"orderid": orderid,
		                "userId": OrderOverview.userInfo.userid,
		                "customid": customid,
		                "roleType": OrderOverview.userInfo.roletype,
		                "token": OrderOverview.userInfo.token,
		                "designprice": designFee,
		                "designGuideFee": guideFee,
		                "commandcode": 141
		        }
        	} else if (temp == 2) {//修改客户预算价格--心理价
        		var data = {
		        		"orderid": orderid,
		                "userId": OrderOverview.userInfo.userid,
		                "customid": customid,
		                "roleType": OrderOverview.userInfo.roletype,
		                "token": OrderOverview.userInfo.token,
		                "mindprice": mindPrice,
		                "commandcode": 141
		        }
        	} else if (temp == 3) {//修改订单定价
        		var data = {
		        		"orderid": orderid,
		                "userId": OrderOverview.userInfo.userid,
		                "customid": customid,
		                "roleType": OrderOverview.userInfo.roletype,
		                "token": OrderOverview.userInfo.token,
		                "finalprice": finalPrice,
						"commandcode": 141
		        }
        	} 
        	 
        	OrderOverview.request( data,
                function (res) {
                    if (res) {
                        Common.msg(res.status.msg,res.status.code==0?200:"");
                    }
                }, 'priceRuler', null);
                return true;

        }
        //statusClick-------END 
    }
    
	
	
}
