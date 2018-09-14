// //研发
// var url_manager = "http://192.168.1.150:8082",
// 	url_order = "http://192.168.1.150:8082";

// //正式
// var url_manager = "http://118.126.116.76:8081",
// 	url_order = "http://118.126.116.76:8082";

//预发布
var url_manager = "http://119.27.172.55:8081",
	url_order = "http://119.27.172.55:8082";

/* 页面加载，即请求数据并渲染 */
var arr_pic_task = new Array(3),
	totalPage = 1; //定义全局，总页数；
var url_page ="";
$(function(){
	var $userid = $.cookie('userid'),
		token = $.cookie('token'),
		roletype = $.cookie('roletype'),
		Url = url_order + "/zb-order-web/order/allOrder.do",
		Url1 = url_page = url_order + "/zb-order-web/order/waitHandle.do";
		var url_session = sessionStorage.getItem("Url");
		var pagenum_session = sessionStorage.getItem("pageNum");
		var ind_session = parseInt(sessionStorage.getItem("ind"));
		var code_session = parseInt(sessionStorage.getItem("code"));
		var arr_code = [];
	console.log(token, roletype, $userid, url_session, pagenum_session);
	
	if ($userid != null) {
		//请求并更新导航区数据    statistics.do
		setTimeout(function(){
			$.ajax({
				type:"get",
				url: url_manager + "/zb-manager-web/workflow/statistics.do",					
				data:{
					"userid": $userid,
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
			setTimeout(function(){
				//请求并获取导航区数据    
			$.ajax({
				type:"get",
				url: url_manager + "/zb-manager-web/workflow/show.do",					
				data:{
					"userid": $userid,
					"token": token,
					"roletype": parseInt(roletype)
				},
				dataType: "json",
				success: function(res){
		    		console.log(res);
		    		/*var work = res.workstatistics;
		    		
		    		//月度数据汇总
		    		$("em.monthturnover").text(work.monthorderprice);
		    		$("em.monthordernum").text(work.monthordernum);
		    		$("em.monthdealnum").text(work.monthorderednum);
		    		$("em.monthconversion").text(work.conversionrate+"%");
		    		$("em.monthincome").text(work.monthincome);
		    		$("em.allincome").text(work.totalincome);
		    		$("em.monthrank").text(work.monthrank);
		    		//每天数据汇总
		    		$("em.dayordernum").text(work.dayordernum);
		    		$("em.daydealnum").text(work.dayorderednum);
		    		$("em.dayturnover").text(work.dayorderprice);
		    		$("em.dayincome").text(work.dayincome);
		    		$("em.dayrank").text(work.dayrank);*/
		    		
		    		var data_nav = {
						'workflow':[]   
						};
					//--------------BEGIN--动态生成导航目录----------------	
		    		data_nav.workflow = res.workflow;
		    		//命名空间
					var bt = baidu.template;
					var strHtml = bt( 'baidu_workstage_nav', data_nav );
					//渲染
					$("#nav").html(strHtml);
					//---------------END 动态生成导航目录------------------------
		    	}	
		   });	
		},100);   
		   //获取用户userid的列表    http://192.168.1.150:8082/zb-sso-web/user/userList.do
	    /*$.ajax({
			type: "GET",
			url: url_sso+"/zb-sso-web/user/userList.do",
			data: {
				"userid": $userid,
				"token": token,						
				"roletype": parseInt(roletype),
				"commandcode": 14
			},									
			dataType: "JSON",
			success: function(res){
				console.log(res);
				if (res.status.code == 0) {
					localStorage.user = JSON.stringify(res); //对象转字符串
				} else{
					copyAlert(res.status.msg);			
				}
								
			}
		});*/
	   //获取待处理任务的数目
	   /*$.ajax({
			type:"get",
			url: url_manager + "/zb-manager-web/page/unDoneTaskList.do",					
			data:{
				"userId": $userid,
				"token": token,
				"roleType": roletype,
				"currentPage": 1						
			},
			dataType: "json",
			success: function(res){
				console.log(res);
				if ( res.status.code == 0) {
					if (res.taskinfo.todealnum >0) {
						$("p.notice_task").show();
						$("a#todealtaskNum").text(res.taskinfo.todealnum);
					} else{
						$("p.notice_task").hide();
					}
					
					
				} 				
			}
		});*/
	setTimeout(function(){
		
	
		if ( url_session == null || pagenum_session == null ) {
			url_page = url_session;
			//获取全部订单
			getOrderView(Url, $userid, token, roletype, 1);	
			//获取待处理
			setTimeout(function(){
				getOrderView(Url1, $userid, token, roletype, 1);
				setTimeout(function(){
					pageFun(1);
				},150);	
			},100);
			
		} else{
			if ( code_session == 18 ) {
				//获取全部订单
				if (url_session == Url ) {
					getOrderView(Url1, $userid, token, roletype, 1); //待处理
					setTimeout(function(){
						getOrderView(Url, $userid, token, roletype, pagenum_session);	//全部订单
						setTimeout(function(){
							pageFun(parseInt(pagenum_session));
						},100);	
					},100);
					
					($(".overview_workstage span").eq(0)).addClass("borderRed")
												.siblings().removeClass("borderRed");
				} else {
					getOrderView(Url, $userid, token, roletype, 1);  //全部订单
					setTimeout(function(){
						getOrderView(Url1, $userid, token, roletype, pagenum_session); //待处理
					},100);
					($(".overview_workstage span").eq(1)).addClass("borderRed")
												.siblings().removeClass("borderRed");
					setTimeout(function(){
						pageFun(parseInt(pagenum_session));
					},200);
				}
					
				
					
				
			} else if( code_session >= 0 && code_session <= 17 ){
				console.log(ind_session, code_session);
				var $target = $("ul.workstage_prograss li").eq(ind_session);
				$target.addClass("borderCol").siblings().removeClass("borderCol");
				var str = $target.text();//获取当前li的文字部分
				str = str.replace(/[^\u4e00-\u9fa5]/gi,""); //截取汉字部分
				$(".overview_workstage span").eq(1).hide();
				//$(".overview_workstage span").eq(0).addClass("borderRed");
				$("strong.order_prograssState").text( str );
				//请求页面数据，并渲染
				getOrderView(url_session, $userid, token, roletype, parseInt(pagenum_session));
				setTimeout(function(){
					pageFun(parseInt(pagenum_session));
				},100);	
				
			};
			
		}
		
	},300);		
		
		},100);
		
	} else{
		
	}
	
	
});

			/*var data_nav = {
				'workflow':[{
					'name': '全部订单',
					'code': 18,
					'num': 20
				}]
				};
			//--------------BEGIN--动态生成导航目录----------	
    		
    		//命名空间
			var bt = baidu.template;
			var strHtml = bt( 'baidu_workstage_nav', data_nav );
			//渲染
			$("#nav").html(strHtml);
			//---------------END 动态生成导航目录-------------*/

//获取cookie，并发起ajax
$(document).ready(function(){
			var txt = $("li.allorder_work").children("em").text();
			var userid = $.cookie("userid");	
			var token = $.cookie("token");			
		    var roletype = $.cookie('roletype');
		    //var totalPage = parseInt($.cookie("totalPage")),
		    var	code ,
		    	Url = url_order + "/zb-order-web/order/waitHandle.do",
		    	pageNum = 1;
		    
		    if(roletype == 1){
		    	$("div.searSort span.select_txt").text( "旺旺名" );
		    }
			
			
			//调取分页函数
			
				//pageFun(1);
			
			//点击导航条中的li， 获取其中的code，并发起ajax请求
			$(document).on("click","ul.workstage_prograss li",function(e){
				$(this).addClass("borderCol")
					   .siblings("li").removeClass("borderCol");
				var ind = parseInt($(this).attr("data-index"));	   
					code = parseInt($(this).attr("data-code"));
				var e = e || window.event,
					tar = e.target,
					str, str1, num;
					if(tar.nodeName == "EM"){
						str = $(tar).parent().text();
					}else{
						str = $(tar).text();
					}
				
				str = str.replace(/[^\u4e00-\u9fa5]/gi,"");
				pageNum = 1; //当点击切换类型， 页码重置为1
				console.log(str, tar.nodeName, str1, num, code);
				$("strong.order_prograssState").text(str);
				/*$("em.prograssState_num").text(num);*/
				if (code == 18) {
					$("p.overview_workstage span").eq(1).show();
					location.reload();
				} else{
					$("p.overview_workstage span").eq(1).hide();
				}
				//sessionStorage  存储数据
				
					sessionStorage.setItem("code", code);
				
				
				sessionStorage.setItem("ind", ind);
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
						Url = url_order + "/zb-order-web/order/waitDesign.do";//待设计
						break;
					case 4:
						Url = url_order + "/zb-order-web/order/designing.do";//设计中
						break;
					case 5:
						Url = url_order + "/zb-order-web/order/waitUserConfirm.do";//待客户确认
						break;
					case 6:
						Url = url_order + "/zb-order-web/order/againDesign.do";//重新设计
						break;
					case 7:
						Url = url_order + "/zb-order-web/order/waitPayState.do";//待支付
						break;
					case 8:
						Url = url_order + "/zb-order-web/order/finalized.do";//定稿
						break;
					case 9:
						Url = url_order + "/zb-order-web/order/newFactoryOrder.do"; //新订单
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
						Url = url_order + "/zb-order-web/order/waitHandle.do";//点击全部订单，请求待处理
						break;
					/*case 19:
						Url = url_order + "/zb-order-web/order/waitHandle.do";//待处理
						break;*/
					default:
						break;
				}
				
				/* 发起请求，获取订单概览的数据 */
				/*"rankstyle": 1,*/
				getOrderView(Url, userid, token, roletype, pageNum);
				setTimeout(function(){
					pageFun(1);
				},300);
			});
			//点击订单号，获取订单id，并存入session，跳转页面
            $(document).on("click","strong.workstage_orderid",function(){
             	$.cookie('orderid', $(this).text());
				$.cookie('customid', $(this).attr("data-customid"));
             	console.log($.cookie("orderid"));
             		getOrderDetail();
             	
             });
             ///点击效果图，跳转至订单详情  figure_orederCont
            $(document).on("click",".figure_orederCont",function(){
             	$.cookie('orderid', $(this).attr("data-orderid"));
				$.cookie('customid', $(this).attr("data-customid"));
             	console.log($.cookie("orderid"));
             		getOrderDetail();
             });
            $("strong.cancelBtn_order").click(function(){
            	$("div.cancel_order").hide();
            });
                                         
        //分页效果
        $(document).on("click","div.page_workstage",function(eve){
            var eve = eve || window.event;            
            $(eve.target).addClass("spanRed").siblings().removeClass("spanRed");
            var pagetext = $(eve.target).text();
            console.log( pagetext);
            switch( pagetext ){
            	case "首页":
            		pageNum = 1;
            		break;
            	case "上一页":
            		if (pageNum >= 2){
            			pageNum = pageNum -1;
            		} else{
            			pageNum = 1;
            		}
            		
            		break;
            	case "下一页":
	            	if (pageNum <= totalPage - 1){
	            			pageNum = pageNum + 1;
	            		} else{
	            			pageNum = totalPage;
	            		}
            		break;
                case "末页":
                	pageNum = totalPage;
            		break;
            	default:
            		if( parseInt(pagetext)>=1 && parseInt(pagetext)<= totalPage ){
            			pageNum = parseInt(pagetext);
            		}
            		break;
            };
            setTimeout(function(){
            	getOrderView( Url, userid, token, roletype,pageNum);
            	setTimeout(function(){
					pageFun(pageNum);
				},150);
            },100);
           
        });
        //点击全部订单  或  待处理   ，  刷新订单概览的内容
    $(document).on("click","p.overview_workstage",function(e){
    	$("p.overview_workstage span").eq(1).show();
		var e = e || window.event;
		$(e.target).addClass("borderRed").siblings().removeClass("borderRed");
		$(e.target.parentNode).addClass("borderRed").siblings().removeClass("borderRed");
		var txt = e.target.innerText;		
		/*var reg = /^[\u4e00-\u9fa5]+$/;*/
		txt = txt.replace(/[^\u4e00-\u9fa5]/gi,"");
		sessionStorage.setItem("ind", 0);
		sessionStorage.setItem("code", 18);
		
		switch (txt){
			case "全部订单":
				Url = url_order + "/zb-order-web/order/allOrder.do";
				sessionStorage.setItem("Url",  url_order + "/zb-order-web/order/allOrder.do");
				break;
			case "待处理":
				Url = url_order + "/zb-order-web/order/waitHandle.do";
				sessionStorage.setItem("Url",  url_order + "/zb-order-web/order/waitHandle.do");
				break;	
			default:
				break;
		};
		console.log(txt);
		getOrderView(Url,userid,token,roletype,1);	
		setTimeout(function(){
			pageFun(1);
		},300);
	});
		
        //点击  × ，让任务的提示消失。
        $(document).on("click",".icon-error-20170103",function(){
            $(this).parent(".notice_rig").hide();
        });
        //点击时间 图标， 出现添加截至工期的模块
        $("p.deadline_contbox i.icon-shijian").click(function(){
        	$("div.newtask_addTime").show();
        });
               
        
        //边缘弹出
        /*layer.open({
          'code': 1
          ,title: "动态消息"
          ,offset: 'rb' //具体配置参考：offset参数项
          ,area: ['300px', '180px']
          ,content: '<div  style="padding: 20px 40px; fontsize: 14px;">'
            +'有新的任务内容好久好久好久集合计划的任务内容好久好久好久集合计划'+'</div>'
          ,btn: '关闭全部'
          ,btnAlign: 'c' //按钮居中
          ,shade: 0 //不显示遮罩         
          ,yes: function(){
            layer.closeAll();
          }
        });*/
        /*$.post('Url', {}, function(str){
          layer.open({
            'code': 1,
            content: str //注意，如果str是object，那么需要字符拼接。
          });
        });*/
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
						"orderid": val_search,
					},
					dataType: "json",
					success: function(res){
						console.log(res);
						var data_order_overview = {};
						if(res.status.code == 0){
							
							if( res.ordersummary ){
								
								totalPage = Math.ceil(parseInt(res.ordersummary.totalnum)/5);
								//$.cookie("totalPage", Math.ceil(parseInt(res.ordersummary.totalnum)/5));
								$("em.searOrder_num").show().text( res.ordersummary.totalnum );
								$("p.overview_workstage span.searOrder_work").css("display","inline-block").siblings().hide();
								$("div.page_workstage").hide();
								/*---------------BEGIN 动态生成订单概览------------------------*/
								data_order_overview = res;
								//命名空间
								var bt = baidu.template;
								var str1 = bt( 'baidu_workstage_orderview', data_order_overview );
								//渲染
								$("#workstage_orderview").html(str1);
								/*---------------END 动态生成订单概览-----------------*/
							}
							///判断是否有  ordersummary 结束
						}else{
								$("em.searOrder_num").hide();
								$("em.prograssState_num").hide();
								/*copyAlert( res.status.msg );
								setTimeout(function(){
									closeAlert();
								},1000);*/
								$("p.overview_workstage span.searOrder_work").css("display","inline-block").siblings().hide();
								$("#workstage_orderview").html("");
								/*$("dl#workstage_orderview").children().remove();*/
								$("div.page_workstage").hide();  
		                        $("#workstage_orderview").html('<div class="noorder_workstage">'
		                         	+'<div><p><img src="images/icon/bj_ico.jpg" /></p>'
		                         	+'<p style="color: #858585">您还没有相关订单！</p></div></div>');
							}
						///
					}
					
				});
 		}
        /* 新建任务 之 任务处理期限 */       
        var mydate = new Date(),
        	/*mydate = mydate + 10*24*3600*1000 ,*/
        	year = mydate.getFullYear(),
            month = mydate.getMonth(),
        	day = mydate.getDate(),   //getDate()   获取日期
        	hour = mydate.getHours(),
        	minute = mydate.getMinutes();
        $("select#select_year2").attr("rel", year);
        $("select#select_month2").attr("rel", month+1);
        $("select#select_day2").attr("rel", day);
               
        /* 小时部分的显示  */
        var str_hour = "";
        for (var i=1;i<25;i++){
        	if(i == hour){
        		str_hour += '<option selected="selected">'+i+'</option>';
        	}else{
        		str_hour += '<option>'+i+'</option>';
        	}       	 
        }
        $("select#select_hour").append(str_hour);
        /* 分钟部分的显示  */
        var str_minute = "";
        for (var i=0;i<60;i++){       	
        	if(i == minute ){
        		/* 设置默认显示的分钟 */
        		str_minute += '<option selected="selected">'+i+'</option>';
        	}else{
        		str_minute += '<option>'+i+'</option>';
        	}
        }
        $("select#select_minute").append(str_minute);
        
        $("button.addTimeBtn").click(function(){
        	/* 获取选择的日期和时间 */  	
	    	var uYear = $("select#select_year2 option:selected").text(),
	    		uMonth = $("select#select_month2 option:selected").text(),
	    		uDay = $("select#select_day2 option:selected").text(),
	    		uHour = $("select#select_hour option:selected").text(),
	    		uMinute = $("select#select_minute option:selected").text();
	    	/*console.log(uYear, uMonth, uDay, uHour,uMinute );*/
	    	var stringTime = uYear+"-"+uMonth+"-"+uDay+" "+uHour+":"+uMinute+":0";
	    	//将年月日 转换化为时间戳（毫秒）
			var timestamp = Date.parse(new Date(stringTime));
        	 	timestamp = Math.ceil( (timestamp - mydate)/60000 );
        	 	/*console.log(timestamp);*/
        	 	if( timestamp <= 0){
        	 		$(".newtask_addTime_tip").text("请选择现在时间之后的时间");
        	 	}else{
        	 		$(".newtask_addTime_tip").text("");
        	 		$("input.newTask_deadline").val( timestamp );
        	 		$("div.newtask_addTime").hide();
        	 	}
	        
        });
        
        
        
        ///发货清单的模块
        //设置默认起始的时间
        $("select#select_year3").attr("rel", year);
        $("select#select_month3").attr("rel", month+1);
        $("select#select_day3").attr("rel", day-1);
        //设置默认截止的时间
        $("select#select_year4").attr("rel", year);
        $("select#select_month4").attr("rel", month+1);
        $("select#select_day4").attr("rel", day);
        
        ///点击发货清单，出现下载发货清单 模块
        $("a.shippingListBtn").on("click",function(){
        	$("div.shippingList_add").show();
        });
        //---下载发货清单事件-----http://localhost:8084/zb-order-web/order/exportCsv.do
        //?startdate=2018-2-1&enddate=2018-2-3    "roletype": roletype,"userid": userid,"token": token,
						
        $(document).on("click","button.downloadShippingList",function(){
        	///起始时间
        	var startDate = ($("select#select_year3").val()) +"-"+($("select#select_month3").val())
        					+"-"+($("select#select_day3").val());
        	///截止时间
        	var endDate = ($("select#select_year4").val()) +"-"+($("select#select_month4").val())
        					+"-"+($("select#select_day4").val());
        	$.ajax({
					type:"get",
					url: url_order + "/zb-order-web/order/exportCsv.do",					
					data:{
						"startdate": startDate,
						"enddate": endDate
					},
					dataType: "json",
					success: function(res){
						console.log(res);
						if(res.status.code == "0"){
							window.open( res.status.addRess);
							$("div.shippingList_add").hide();
						}
						
					}
			    });
			    
        });
});

//window加载完毕
$(window).load(function(){
	//调取移动标尺
	/*setTimeout(function(){
			var arr_design = $("ul.design_ruler");
			var price_design = 0,
				price_custom = 0,
				price_offer = 0;
				console.log(arr_design, $("ul.design_ruler"));
			for (var i=0; i< arr_design.length; i++) {
				price_design = arr_design.eq(i).find("input").val();
				price_custom = $("ul.custom_ruler").eq(i).find("input").val();
				console.log(price_custom, price_design);
				price_offer = $("ul.offer_ruler").eq(i).find("input").val();
				rulerFun( $("ul.design_ruler").eq(i), price_design, 1);
				rulerFun( $("ul.custom_ruler").eq(i), price_custom, 2);
				rulerFun( $("ul.offer_ruler").eq(i), price_offer, 2);
			}
	},500);*/
});

//定义获取概览数据的方法，
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
						var data_order_overview = {};
						if(res.status.code == 0){
							if( res.ordersummary ){
								$("div.page_workstage").show();
								if ( res.ordersummary ) {
									totalPage = Math.ceil( parseInt(res.ordersummary.totalnum)/5 );
									//$.cookie("totalPage", Math.ceil(parseInt(res.ordersummary.totalnum)/5));
									$("em.prograssState_num").show();
									//运用会话存储，保存数据
									sessionStorage.setItem("Url", Url);
									sessionStorage.setItem("pageNum", pagenum);
								} else{
									totalPage = 0;
									//$.cookie("totalPage", 0);
									$("em.prograssState_num").hide();
								}
								///判断订单数的显示
								if( Url == (url_order + "/zb-order-web/order/waitHandle.do") ){
									$("em.prograssTodeal_num").text(res.ordersummary.totalnum);
								}else{
									$("em.prograssState_num").text(res.ordersummary.totalnum);
								}
								
								
								/*console.log("totalnum:"+ res.ordersummary.totalnum);*/
								/*---------------BEGIN 动态生成订单概览------------------------*/
								data_order_overview = res;
								/*data_order_overview.roleType = res.userinfo.roleType;*/
								/*console.log( data_order_overview);*/
								
								//命名空间
								var bt = baidu.template;
								var str1 = bt( 'baidu_workstage_orderview', data_order_overview );
								//渲染
								$("#workstage_orderview").html(str1);
								/*---------------END 动态生成订单概览-----------------*/
							}else{
								$("em.prograssState_num").hide();
								$("#workstage_orderview").html("");
								/*$("dl#workstage_orderview").children().remove();*/
								    
		                        $("#workstage_orderview").html('<div class="noorder_workstage">'
		                         	+'<div><p><img src="images/icon/bj_ico.jpg" /></p>'
		                         	+'<p style="color: #858585">您还没有相关订单！</p></div></div>');
		                        totalPage = 0 ;
								//$.cookie("totalPage", 0);
								
								$("div.page_workstage").hide();
							}
						}else{}
					}
				});
	}

//封装的订单概览方法END------------------	

//动态生成分页的方法----START------
/*var totalPage = parseInt($.cookie("totalPage"));
	layui.use(['laypage'], function(){
		var laypage = layui.laypage;
		
			laypage.render({
			    elem: 'page_workstage'
			    ,count: totalPage*10
			    ,theme: '#d74a49'
			    ,first: '首页'
			    ,last: '尾页'
			    ,prev: '<em>上一页</em>'
			    ,next: '<em>下一页</em>'
			  });
	});*/
function pageFun(num){
	
	var str_page = '<div><em>首页</em><em>上一页</em>';
	var startNum = 1;
	var length = 8;
	var endNum = 8;
	//var  = parseInt($.cookie("totalPage"));
	console.log(totalPage);
	if ( totalPage == 0 ) {
		//$("div.page_workstage").hide();
	}else if(totalPage <= 8 && totalPage >=1 ) {
		$("div.page_workstage").show();
		endNum = totalPage;
		startNum = 1;
		
		for (var i = startNum;i <= endNum; i++) {
			if (i == num){
				str_page +='<em class="spanRed">'+ i +'</em>';
			}else{
				str_page += '<em>'+ i +'</em>';
			}
			//console.log(i);
		};
		str_page += '<em>下一页</em><em>末页</em></div>';
		$("div.page_workstage").html(str_page);
			
	}else if(totalPage > 8){
			$("div.page_workstage").show();
				if(num <=4 ){
					endNum = 8;
				}else if(num > 4){
					if (num <= totalPage - length) {
						startNum = num-3;
						endNum = length + num - 4;
					}else{
						//startNum = (num - 3) <= (totalPage-7)?(totalPage-7):(num - 3);
						//endNum = (totalPage-5)>= num ?(totalPage): (num+4);
						startNum = totalPage-7;
						endNum = totalPage;
					}				
				}
			for (var i = startNum;i <= endNum; i++) {
				if (i == num){
					str_page +='<em class="spanRed">'+ i +'</em>';
				}else{
					str_page += '<em>'+ i +'</em>';
				}
				//console.log(i);
			};
			str_page += '<em>下一页</em><em>末页</em></div>';
			$("div.page_workstage").html(str_page);	
			
		}
	
}
//动态生成分页的方法----END------
//控制滑动尺的移动
function rulerFun($obj,price,ruler){
	var Y = $("div.orderCont7").eq(0).offset().left;
	price = parseInt( price );
	var start = 0,
		end = 100,
		length = 720;
	if( ruler == 1){
		start = 5;
		end = 500;
	}else if( ruler == 2){
		start = 0;
		end = 15000;
	};
	if ( price > end) {
		price = end ;
	} else{
		
	}
	var Y_ruler = parseInt( (price*length)/(end - start) );
	console.log(Y, Y_ruler);
	$obj.css({"left": Y + Y_ruler });	
	
}
//调用获取date的模块
$(function(){  
    $.ms_DatePicker({  
    	YearSelector: "#select_year2",  
        MonthSelector: "#select_month2",  
        DaySelector: "#select_day2"                   
    });  
    $.ms_DatePicker({  
    	YearSelector: "#select_year3",  
        MonthSelector: "#select_month3",  
        DaySelector: "#select_day3"                   
    });
    $.ms_DatePicker({  
    	YearSelector: "#select_year4",  
        MonthSelector: "#select_month4",  
        DaySelector: "#select_day4"                   
    });
});

//cos 的方法
(function ($) {
        // 请求用到的参数
        var Bucket = 'resource-1255653994';//   'test-1255653994'   
        var Region = 'ap-chengdu';
        var protocol = location.protocol === 'https:' ? 'https:' : 'http:';
        var prefix = protocol + '//' + Bucket + '.cos.' + Region + '.myqcloud.com/';

        // 计算签名
        var getAuthorization = function (options, callback) {
            // 方法一（适用于前端调试）
            var method = (options.Method || 'get').toLowerCase();
            var key = options.Key || '';
            var pathname = key.indexOf('/') === 0 ? key : '/' + key;
            var url = 'http://119.27.172.55/auth.php?method=' + method + '&pathname=' + encodeURIComponent(pathname);
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.onload = function (e) {
                callback(null, e.target.responseText);
            };
            xhr.onerror = function (e) {
                callback('获取签名出错');
            };
            xhr.send();

        };

        // 上传文件
        var uploadFile = function (file, callback) {
        	var fname = file.name;
        	var filetype = fname.substr(fname.lastIndexOf("."));
        	
            var Key = getRandomName() + filetype;
            //console.log(filetype, Key);
            getAuthorization({Method: 'PUT', Key: Key}, function (err, auth) {
                var url = prefix + Key;
                var xhr = new XMLHttpRequest();
                xhr.open('PUT', url, true);
                xhr.setRequestHeader('Authorization', auth);
                xhr.onload = function () {
                    if (xhr.status === 200 || xhr.status === 206) {
                        var ETag = xhr.getResponseHeader('etag');
                        callback(null, {url: url, ETag: ETag});
                    } else {
                        callback('文件 ' + Key + ' 上传失败，状态码：' + xhr.status);
                    }
                };
                xhr.onerror = function () {
                    callback('文件 ' + Key + ' 上传失败，请检查是否没配置 CORS 跨域规则');
                };
                xhr.send(file);
            });
        };
        
        
		

   })($);



