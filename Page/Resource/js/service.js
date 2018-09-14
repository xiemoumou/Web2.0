var url_logistics = "http://192.168.1.150:8082",
	url_manager = "http://192.168.1.150:8082",
	url_order = "http://192.168.1.150:8082",
	url_sso = "http://192.168.1.150:8082";
	
var totalPage = 1, //定义全部页数
	Url = "";
var userid = $.cookie("userid"),
	token = $.cookie("token"),
	roletype = $.cookie("roletype");
$(function(){
	var url_session = sessionStorage.getItem("Url"),
		pagenum_session = parseInt( sessionStorage.getItem("pageNum") ),
		index_session = parseInt( sessionStorage.getItem("index") ),
		code_session = parseInt( sessionStorage.getItem("code") );
		
		Url = url_order + "/zb-order-web/order/waitHandle.do"; //待处理
	
	if (userid != null) {
		//请求并加载导航区数据    statistics.do
		setTimeout(function(){
			$.ajax({
				type:"get",
				url: url_manager + "/zb-manager-web/workflow/statistics.do",					
				data:{
					"userid": userid,
					"token": token,
					"roletype": parseInt(roletype)
				},
				dataType: "json",
				success: function(res){
		    		console.log(res);
		    		
		    	}	
		   });	
		},0);
		
		setTimeout(function(){
			$.ajax({
				type:"get",
				url: url_manager + "/zb-manager-web/workflow/show.do",					
				data:{
					"userid": userid,
					"token": token,
					"roletype": parseInt(roletype)
				},
				dataType: "json",
				success: function(res){
		    		console.log(res);
		    		
		    		var $em = $("ul.overview_service em");
		    		var arr_num = res.workflow;
		    		console.log( arr_num );
		    		if( (arr_num[0].num) != 0 ){
		    			$("#nav li em").eq(0).text( arr_num[0].num ); //全部订单
		    		}else{
		    			($("#nav li em").eq(0)).hide();
		    		}
		    		if( (arr_num[2].num) != 0 ){
		    			$("#nav li em").eq(1).text( arr_num[2].num ); //咨询中
		    		}else{
		    			($("#nav li em").eq(1)).hide();
		    		}
		    		if( ((arr_num[3].num)+(arr_num[4].num)) != 0 ){
		    			$("#nav li em").eq(2).text( (arr_num[3].num)+(arr_num[4].num) ); //设计中
		    		}else{
		    			($("#nav li em").eq(2)).hide();
		    		}
		    		if( (arr_num[5].num) != 0 ){
		    			$("#nav li em").eq(3).text( arr_num[5].num ); //待支付
		    		}else{
		    			($("#nav li em").eq(3)).hide();
		    		}
		    		if( (arr_num[6].num) != 0 ){
		    			$("#nav li em").eq(4).text( arr_num[6].num ); //待分配生产
		    		}else{
		    			($("#nav li em").eq(4)).hide();
		    		}
		    		if( ((arr_num[7].num)+(arr_num[8].num)) != 0 ){
		    			$("#nav li em").eq(5).text( (arr_num[7].num)+(arr_num[8].num) ); //车间订单
		    		}else{
		    			($("#nav li em").eq(5)).hide();
		    		}
		    		($("#nav li em").eq(6)).hide();
		    		($("#nav li em").eq(7)).hide();
		    		if( (arr_num[13].num) != 0 ){
		    			($("#nav li em").eq(8)).text( arr_num[13].num ); //完成订单
		    		}else{
		    			($("#nav li em").eq(8)).hide();
		    		}
		    		
		    		
		    		if (res.workflow && arr_num.length != 0) {
		    			for (var i=0;i<arr_num.length;i++) {
		    				if(arr_num[i].num == 0){
		    					$em.eq(i).hide();
		    				}else{
		    					$em.eq(i).text( arr_num[i].num );
		    				}
		    				
		    			}
		    			
		    		} else{}
		    		
		    		
		    	}	
		   });	
		   
		getOrderView(Url,userid,token,roletype,1); 
		
		if ( url_session == null || pagenum_session == null ) {
			
			//获取待处理
			setTimeout(function(){
				getOrderView(Url, userid, token, roletype, 1);
				
			},150);
			
		} else{
			//显示对应的li
			($("ul.overview_service li").eq(index_session)).show().siblings().hide();
			($("#nav li").eq(index_session)).addClass("active").siblings().removeClass("active");
			var $p = $("ul.overview_service p");
			var code_p = 0;
			for (var i=0; i<$p.length; i++) {
				code_p = $p.eq(i).attr("data-code");
				if ( code_p == code_session ) {
					($p.eq(i)).addClass("bgred").siblings().removeClass("bgred");
				}
			}
			setTimeout(function(){
				getOrderView(url_session, userid, token, roletype, pagenum_session );
			},100);
			
		}
			
		
		},150);
		
	} else{
		
	}
	
	/*----*/
	
});
$(document).ready(function(){
		 
	//---点击左侧导航区域---
	$(document).on("click","#nav li",function(){
		var txt = $(this).text();
		var ind = $(this).attr("data-index");
		sessionStorage.setItem("index", ind);
		$(this).addClass("active").siblings().removeClass("active");
		//控制上侧  按钮  
		($("ul.overview_service li").eq( ind )).show().siblings().hide();
		txt = txt.replace(/[^\u4e00-\u9fa5]/gi,"");//过滤非汉字部分
		switch( txt ){
					case "全部订单":
						Url = url_order + "/zb-order-web/order/waitHandle.do";//待处理
						break;
					case "咨询中订单":
						Url = url_order + "/zb-order-web/order/advisory.do";  ///咨询中
						break;
					case "设计中订单":
						Url = url_order + "/zb-order-web/order/designing.do";
						break;
					case "待支付订单":
						Url = url_order + "/zb-order-web/order/waitPayState.do";
						break;
					case "待分配生产":
						Url = url_order + "/zb-order-web/order/finalized.do"; //定稿
						break;
					case "车间订单":
						Url = url_order + "/zb-order-web/order/inProduction.do"; //生产中
						break;
					case "售后处理中":
						Url = url_order + "/zb-order-web/order/inAftermarket.do";//售后处理中
						break;
					case "已取消订单":
						Url = url_order + "/zb-order-web/order/cancel.do"; //已取消
						break;
					case "已完成订单":
						Url = url_order + "/zb-order-web/order/complete.do";//完成
						break;
					default:
						break;
				}
		
			setTimeout(function(){
				getOrderView(Url,userid,token,roletype,1);
			},100);
		
	});

	
	/*$("#page_service").pagination({
			currentPage: curpage,
			totalPage: allpage,
			isShow: true,
			count: 8,
			homePageText: "首页",
			endPageText: "尾页",
			prevPageText: "上一页",
			nextPageText: "下一页",
			callback: function(current) {
				getOrderView(Url, userid, token, roletype, current );
			}
	});*/
	//点击页码， 获取订单信息
	$(document).on("click", "div#page_service", function(e){
		var info = $("#page_service").pagination(this);
		//存储 点击的 页码
		console.log(info.current, info.total);
		setTimeout(function(){
			getOrderView(Url, userid, token, roletype, info.current );
		},50);
	});
	
	//点击订单概览信息上方  的  导航区  的  按钮 ，获取  对应的内容
	$(document).on("click","ul.overview_service p",function(){
		var str_target = $(this).text();
		var code = parseInt( $(this).attr("data-code") );
		$(this).addClass("bgred").siblings().removeClass("bgred");
		sessionStorage.setItem("code", code);
				switch( code ){
					case 0:
						Url = url_order + "/zb-order-web/order/advisory.do";  ///咨询中
						break;
					case 1:
						Url = url_order + "/zb-order-web/order/quotation.do";///报价中
						break;
					case 2:
						Url = url_order + "/zb-order-web/order/hasQuotation.do";//已报价
						break;
					case 3:
						Url = url_order + "/zb-order-web/order/waitDesign.do";
						break;
					case 4:
						Url = url_order + "/zb-order-web/order/designing.do";
						break;
					case 5:
						Url = url_order + "/zb-order-web/order/waitUserConfirm.do";
						break;
					case 6:
						Url = url_order + "/zb-order-web/order/againDesign.do";
						break;
					case 7:
						Url = url_order + "/zb-order-web/order/waitPayState.do";
						break;
					case 8:
						Url = url_order + "/zb-order-web/order/finalized.do";
						break;
					case 9:
						Url = url_order + "/zb-order-web/order/newFactoryOrder.do";
						break;
					case 10:
						Url = url_order + "/zb-order-web/order/inProduction.do";
						break;
					case 11:
						Url = url_order + "/zb-order-web/order/inMail.do";
						break;
					case 12:
						Url = url_order + "/zb-order-web/order/inAftermarket.do";
						break;
					case 13:
						Url = url_order + "/zb-order-web/order/redo.do";
						break;
					case 14:
						Url = url_order + "/zb-order-web/order/inReturns.do";//退货中
						break;
					case 15:
						Url = url_order + "/zb-order-web/order/inReimburse.do";//退款中
						break;
					case 16:
						Url = url_order + "/zb-order-web/order/cancel.do";
						break;
					case 17:
						Url = url_order + "/zb-order-web/order/complete.do";//完成
						break;
					case 18:
						Url = url_order + "/zb-order-web/order/allOrder.do";
						break;
					case 19:
						Url = url_order + "/zb-order-web/order/waitHandle.do";//待处理
						break;
					default:
						break;
				};
				
			setTimeout(function(){
				getOrderView(Url,userid,token,roletype,1);
			},100);	
		
	});
	
	/* 搜索事件 */
 		$(document).on("click","button.searBtn_workstage",function(){
 			searchOrder();
		});
		//敲击enter键(回车键)，  触发登录按钮，触发验证事件
        $(document).keydown(function(eve){
            	var eve = eve || window.event;
            	if ( eve.keyCode == 13 ) {
            		searchOrder();
            	}
                
        });
 		///定义搜索事件
 		function searchOrder(){
 			var val_search = $("input#searchCon").val();
 			var txt_sear = $("div.searSort").find("span.select_txt").text();
 			var url_sear = "/zb-order-web/order/customeridinfo.do";
 			$("#nav li").removeClass("active");
 			//console.log( txt_sear );
 			switch ( txt_sear ){
 				case "旺旺名":
 					url_sear = "/zb-order-web/order/customeridinfo.do" ;
 					break;
 				case "订单号":
 					url_sear = "/zb-order-web/order/orderinfo.do" ;
 					break;
 				default:
 					break;
 			};
 			$.ajax({
					type:"get",
					url: url_order + url_sear ,					
					data:{
						"userid": userid,
						"token": token,
						"roletype": roletype,
						"customerid": val_search,
						"orderid": val_search
					},
					dataType: "json",
					success: function(res){
						console.log(res);
						var data_order_overview = {};
						$("div#page_service").hide();
						( $("ul.overview_service li").eq(9) ).show().siblings().hide();
						
						if(res.status.code == 0){//判断返回  搜索到的信息
							
							if( res.ordersummary ){
								
								//totalPage = Math.ceil(parseInt(res.ordersummary.totalnum)/5);
								///overview_service li   其他都隐藏
								
								$("em.num_search_service").text( res.ordersummary.totalnum );
								
								//--------------BEGIN--动态生成订单概览信息----------------	
					    		var data_order = res.ordersummary;
					    		//命名空间
								var bt = baidu.template;
								var strHtml = bt( 'baidu_workstage_order', data_order );
								//渲染
								$("#order_service_box").html(strHtml);
								//---------------END 动态生成订单概览信息------------------------
								
							}
							///判断是否有  ordersummary 结束
						}else{
								($("ul.overview_service li").eq(9).children("em")).hide();
								$("#workstage_orderview").html("");
								$("em.num_search_service").hide();
								$("#order_service_box").html('<div class="noorder_workstage">'
		                         	+'<div><p><img src="images/icon/bj_ico.jpg" /></p>'
		                         	+'<p style="color: #858585">您还没有相关订单！</p></div></div>');
							}
						///
					}
					
				});
 		}
 		
	
	//当输入的产品数目发生变化，触发修改订单    ordernum_workstage
	$(document).on("blur","input.prdNum",function(){
		var orderid = $(this).parent().parent().parent().parent().attr("data-orderid"),
			customid = $(this).parent().parent().parent().parent().attr("data-customid"),
			orderNum = $(this).val();
			console.log(orderid, orderNum);
		//调用修改订单事件
		
		$.ajax({
			type: "GET",
			url: url_order+"/zb-order-web/order/updateOrderSummary.do",
			data: {
				"userId": userid,
				"orderid": orderid,
				"customid": customid,
				"roleType": roletype,
				"token": token,
				"commandcode": 150,
				"number": orderNum
			},
			
			dataType: "JSON",
			success: function(res){
				if (res.status.code == 0) {
					//console.log(res.status.msg);
					copyAlert(res.status.msg+",请再次发起询价");
					setTimeout(function(){
  						location.reload();
  					},2000);
				} 
				
			},
			error: function(err){
				//console.log(err);
				copyAlert(err.status +","+ err.statusText);
			}
		});
	});
	
	//当输入的产品长度发生变化，触发修改订单   
	$(document).on("blur","input.productLength",function(){
		var orderid = $(this).parent().parent().parent().parent().attr("data-orderid"),
			customid = $(this).parent().parent().parent().parent().attr("data-customid"),
			orderLength = $(this).val();
			console.log(orderid, orderLength);
		//调用修改订单事件
		
		$.ajax({
			type: "GET",
			url: url_order+"/zb-order-web/order/updateOrderSummary.do",
			data: {
				"userId": userid,
				"orderid": orderid,
				"customid": customid,
				"roleType": roletype,
				"token": token,
				"commandcode": 150,
				"length": orderLength
			},
			
			dataType: "JSON",
			success: function(res){
				if (res.status.code == 0) {
					//console.log(res.status.msg);
					copyAlert(res.status.msg+",请再次发起询价");
					setTimeout(function(){
  						location.reload();
  					},2000);
				} 
				
			},
			error: function(err){
					console.log(err);
					copyAlert(err.status +","+ err.statusText);
			}
		});
		
	});
	
	//当输入的产品宽度发生变化，触发修改订单   
	$(document).on("blur","input.prdWidth",function(){
		var orderid = $(this).parent().parent().parent().parent().attr("data-orderid"),
			customid = $(this).parent().parent().parent().parent().attr("data-customid"),
			orderWidth = $(this).val();
			console.log(orderid, orderWidth);
			
		//调用修改订单事件
		$.ajax({
			type: "GET",
			url: url_order+"/zb-order-web/order/updateOrderSummary.do",
			data: {
				"userId": userid,
				"orderid": orderid,
				"customid": customid,
				"roleType": roletype,
				"token": token,
				"commandcode": 150,
				"width": orderWidth
			},
			dataType: "JSON",
			success: function(res){
				if (res.status.code == 0) {
					copyAlert(res.status.msg+",请再次发起询价");
					setTimeout(function(){
  						location.reload();
  					},2000);
				} 
				
			},
			error: function(err){
					console.log(err);
					copyAlert(err.status +","+ err.statusText);
			}
		});
		
	});
	//当输入的产品高度发生变化，触发修改订单   
	$(document).on("blur","input.prdHeight",function(){
		var orderid = $(this).parent().parent().parent().parent().attr("data-orderid"),
			customid = $(this).parent().parent().parent().parent().attr("data-customid"),
			orderheight = $(this).val();
			console.log(orderid, orderheight);
		//调用修改订单事件
			
		$.ajax({
			type: "GET",
			url: url_order+"/zb-order-web/order/updateOrderSummary.do",
			data: {
				"userId": userid,
				"orderid": orderid,
				"customid": customid,
				"roleType": roletype,
				"token": token,
				"commandcode": 150,
				"height": orderheight
			},
			
			dataType: "JSON",
			success: function(res){
				if (res.status.code == 0) {
					copyAlert(res.status.msg+",请再次发起询价");
					setTimeout(function(){
  						location.reload();
  					},2000);
				} 
				
			},
			error: function(err){
				console.log(err);
				copyAlert(err.status +","+ err.statusText);
			}
		});
	});
	
	///切换分类,保存数据，并上传
	$(document).on("click","ul.productType_service",function(eve){
		var eve = eve || window.event;
		var val = $(eve.target).text();
		var orderid = $(this).parent().parent().parent().attr("data-orderid");
		var customid = $(this).parent().parent().parent().attr("data-customid");
		//
		$.ajax({
			type: "GET",
			url: url_order+"/zb-order-web/order/updateOrderSummary.do",
			data: {
				"userId": userid,
				"orderid": orderid,
				"customid": customid,
				"roleType": roletype,
				"token": token,
				"commandcode": 150,
				"goodsclass": val
			},
			
			dataType: "JSON",
			success: function(res){
				console.log(res);
				if (res.status.code == 0) {
					copyAlert(res.status.msg+",请再次发起询价");
					setTimeout(function(){
  						location.reload();
  					},2000);
				} 
				
			},
			error: function(err){
					console.log(err);
					copyAlert(err.status +","+ err.statusText);
				}
		});
		
	});
	///切换产品材质,保存数据并上传
	$(document).on("click","ul.texture_service",function(eve){
		var eve = eve || window.event;
		var val = $(eve.target).text();
		var orderid = $(this).parent().parent().parent().attr("data-orderid");
		var customid = $(this).parent().parent().parent().attr("data-customid");
		//
		$.ajax({
			type: "GET",
			url: url_order+"/zb-order-web/order/updateOrderSummary.do",
			data: {
				"userId": userid,
				"orderid": orderid,
				"customid": customid,
				"roleType": roletype,
				"token": token,
				"commandcode": 150,
				"texturename": val
			},
			
			dataType: "JSON",
			success: function(res){
				console.log(res);
				if (res.status.code == 0) {
					copyAlert(res.status.msg+",请再次发起询价");
					setTimeout(function(){
  						location.reload();
  					},2000);
				} 
				
			},
			error: function(err){
					console.log(err);
					copyAlert(err.status +","+ err.statusText);
			}
		});
		
	});
	///切换产品配件,保存数据并上传
	$(document).on("click","ul.parts_service",function(eve){
		var eve = eve || window.event;
		var val = $(eve.target).text();
		var orderid = $(this).parent().parent().parent().attr("data-orderid");
		var customid = $(this).parent().parent().parent().attr("data-customid");
		//
		$.ajax({
			type: "GET",
			url: url_order+"/zb-order-web/order/updateOrderSummary.do",
			data: {
				"userId": userid,
				"orderid": orderid,
				"customid": customid,
				"roleType": roletype,
				"token": token,
				"commandcode": 150,
				"accessoriesname": val
			},
			
			dataType: "JSON",
			success: function(res){
				console.log(res);
				if (res.status.code == 0) {
					copyAlert(res.status.msg+",请再次发起询价");
					setTimeout(function(){
  						location.reload();
  					},2000);
				} 
				
			},
				error: function(err){
					console.log(err);
					copyAlert(err.status +","+ err.statusText);
				}
		});
		
	});
	
	///修改  截至工期  ,输入框blur， 保存数据并上传
	$(document).on("blur","input.prdDeadline",function(){
		var $val = $(this).val();
		var orderid = $(this).parent().parent().parent().parent().attr("data-orderid");
		var customid = $(this).parent().parent().parent().parent().attr("data-customid");
		setTimeout(function(){
			
			$.ajax({
				type: "GET",
				url: url_order+"/zb-order-web/order/updateOrderSummary.do",
				data: {
					"userId": userid,
					"orderid": orderid,
					"customid": customid,
					"roleType": roletype,
					"token": token,
					"commandcode": 150,
					"deadline": $val
				},
				dataType: "JSON",
				success: function(res){
					console.log(res);
					if (res.status.code == 0) {
						copyAlert(res.status.msg+",请再次发起询价");
						setTimeout(function(){
  							location.reload();
  						},2000);
					}else{
						copyAlert(res.status.msg);
						setTimeout(function(){
							closeAlert();
						},600);
					}
				},
				error: function(err){
					console.log(err);
					copyAlert(err.status +","+ err.statusText);
				}
			});
		},100);
		
	});
	
	/// 修改   客户 预算  ，触发事件
	$(document).on("blur", "input.customPrice_ser", function(){
			var orderid = $(this).parent().parent().parent().parent().attr("data-orderid"),
				customid = $(this).parent().parent().parent().parent().attr("data-customid");
			var customPrice = ($(this).val()).replace(/[^0-9]/ig,""); 
			
			if (roletype ==  1 ) {
	                $.ajax({
	                	type:"get",
	                	url: url_order+"/zb-order-web/order/updateInquiryRule.do",
	                	data:{
	                		"userId": userid,
	                		"roleType": roletype,
	                		"token": token,
	                		"orderid": orderid,
	                		"customid": customid,
	                		"mindprice": parseInt(customPrice)
	                	},
	                	success:function(res){
	                		/*console.log(res.status.msg, customPrice);*/
	                		copyAlert(res.status.msg);
							setTimeout(function(){
	  							location.reload();
	  						},500);
	                	},
	                	error: function(err){
							copyAlert(err.status +","+ err.statusText);
						}
	                });	
            }
	});
	//offerFee_service
	var orderid, customid;
	////当点击蓝色的框中的  “定价  按键”时，发起对应的事件
	$(document).on("click",".offerFee_service",function(){
			orderid = $(this).parent().parent().parent().attr("data-orderid"),
			customid = $(this).parent().parent().parent().attr("data-customid");
			
		
			// 客服定价
				var finalprice = ($(this).parent().find("input.offerFee").val()).replace(/[^0-9]/ig,"");//.substr(1)
				$(this).parent().parent().parent().prev("dd").find(".finalprice_ser")
						.text("￥"+ finalprice);
				console.log(userid,orderid,customid,roletype,token,finalprice);
				
			setTimeout(function(){
				
				//发起请求，进行客服定价
				$.ajax({
					type: "GET",
					url: url_order+"/zb-order-web/order/updateInquiryRule.do",
					data: {
						"userId": userid,
						"orderid": orderid,
						"roleType": roletype,
						"token": token,
						"customid": customid,
						"finalprice": finalprice,
						"commandcode": 141
					},
					dataType: "JSON",
					success: function(res){
						console.log(res);
						if(res.status.code == 0){
							copyAlert(res.status.msg);
							setTimeout(function(){
	  							location.reload();
	  						},1000);
						}else{
							copyAlert(res.errormsg);
							setTimeout(function(){
	  							location.reload();
	  						},1000);
						}
					}
				});
				
			},300);	
	
		});
	
	///点击产品图，跳转至订单详情  figure_orderCont
        $(document).on("click",".figure_orderCont",function(){
             	$.cookie('orderid', $(this).parent().attr("data-orderid"));
				$.cookie('customid', $(this).parent().attr("data-customid"));
             	//console.log($.cookie("orderid"));
             		getOrderDetail();
        });
             
	
	
});

/*--分页功能   page_service--*/
function pageFunc(curpage, allpage){
	$("#page_service").pagination({
			currentPage: curpage,
			totalPage: allpage,
			isShow: true,
			count: 8,
			homePageText: "首页",
			endPageText: "尾页",
			prevPageText: "上一页",
			nextPageText: "下一页",
			callback: function(current) {
				getOrderView(Url, userid, token, roletype, current );
			}
	});
}
	

//定义获取概览数据的方法
	function getOrderView(Url,userid,token,roletype,pagenum){
		sessionStorage.setItem("Url", Url);
		sessionStorage.setItem("pageNum", pagenum);
			$.ajax({
					type:"get",
					url: Url,					
					data:{
						"userid": userid,
						"token": token,
						"roletype": roletype,
						"workflow": 1,
						"searchday": 30,
						"fromtime": "2016",
						"totime": "2018",
						"ordernumofsheet": 5,
						"ordersheet": pagenum,
						"ranktype": 1,			
						"inorder": 0
					},
					dataType: "json",
					success: function(res){
						console.log(res);
						
						if(res.status.code == 0){
							
							if ( res.ordersummary ) {
								$("div#page_service").show();
								var allpage = Math.ceil(parseInt(res.ordersummary.totalnum)/5); 
								setTimeout(function(){
									pageFunc(pagenum, allpage);
								},100);
								
								//--------------BEGIN--动态生成订单概览信息----------------	
					    		var data_order = res.ordersummary;
					    		//命名空间
								var bt = baidu.template;
								var strHtml = bt( 'baidu_workstage_order', data_order );
								//渲染
								$("#order_service_box").html(strHtml);
								//---------------END 动态生成订单概览信息------------------------
								
							} else{
								
								$("#order_service_box").html("");
								
								$("div#page_service").hide();  
		                        $("#order_service_box").html('<div class="noorder_workstage">'
		                         	+'<div><p><img src="images/icon/bj_ico.jpg" /></p>'
		                         	+'<p style="color: #858585">您还没有相关订单！</p></div></div>');
							}
							
						}else{
							
						}
						
					},
					error: function(err){
						console.log(err);
					}
				});
	}

//封装的订单概览方法END	
