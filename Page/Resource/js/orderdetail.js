var url_logistics = "http://192.168.1.150:8082",
	url_manager = "http://192.168.1.150:8082",
	url_order = "http://192.168.1.150:8082",
	url_sso = "http://192.168.1.150:8082";
//定义全局变量
var img1_ref = "",
	img2_ref = "",
	img3_ref = "",
	arr_imgRef = new Array(3), //上传参考图的数组
	acc_ref = "",  //设计师参考图附件
	acc_ref_old = "", //参考图附件的原名
	img1_sch = "",
	img2_sch = "",
	img3_sch = "",
	acc_sch = "",  //设计图附件
	acc_sch_old = "", //设计图附件的原名
	arr_imgSch = new Array(3); //上传设计图的数组
var designstate = 0, orderstate = 0,
	arr_new_service = new Array(3),
	acc_new_service = "",
	acc_old_service = "",
	up_service_state = 0 ; //客服上传设计附件后  改变为   1
var consignee = ""; //收货人
$(function(){
	//获取session
	var userid = $.cookie('userid'), 
		token = $.cookie('token'),
		roletype = $.cookie('roletype'),
		orderid = $.cookie('orderid'),
		nickname = $.cookie('nickname'),
		goodsid = $.cookie('goodsid'),  //商品号
		customid = $.cookie('customid'); //定制号
	
	//res = JSON.stringify(res);
	var storage_str = null;
	if ( window.localStorage ) {
		storage_str = window.localStorage;
		storage_str.removeItem("obj_logisticsMess");
	};
		
	///获取导航区的数据
	if ( userid != null) {
		//请求并加载导航区数据    statistics.do
		$.ajax({
			type:"get",
			url: url_manager +"/zb-manager-web/workflow/show.do",					
			data:{
				"userid": userid,
				"token": token,
				"roletype": parseInt(roletype)
			},
			dataType: "json",
			success: function(res){
	    		console.log(res);
	    		/*var work = res.workstatistics;*/
	    		
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
	  }
	///获取订单详情
	$.ajax({
		type: "GET",
		url: url_order+ "/zb-order-web/order/orderDetail.do",
		data: {
			"orderId": orderid,
			"userId": userid,
			"customId": customid,
			"roleType": roletype,
			"token": token	
		},
		dataType: "JSON",
		success: function(res){
			console.log(res);
		if(res.status.code == 0){  
			var data_order_overview = res;
			var createtime = res.ordersummary.orderinfo.createtime,
				customname = res.ordersummary.orderinfo.customerid;
				
			    designstate = res.ordersummary.state.designstate.code;
			    orderstate = res.ordersummary.state.orderstate.orderstate;
			  if(res.ordersummary.state.designreceivestate){
			    	var designreceivestate = res.ordersummary.state.designreceivestate.code;
			    }
			
			///存储cookie
			$.cookie("goodsid",res.ordersummary.orderinfo.goodsid);
			/*if (designreceivestate == 1) {
				$("button.workstage_submitDesignBtn").show();
			} */
			
			consignee = res.useraddress.consignee; //收货人
			var	tel = res.useraddress.tele,
				postcode = res.useraddress.postcode,
				province = res.useraddress.province,
				city = res.useraddress.city,
				county = res.useraddress.county,
				address = res.useraddress.address,
				str_img = "http://test-1255653994.cos.ap-chengdu.myqcloud.com/";  ///设置图片的前缀字符串
			//	"http://test-1255653994.cos.ap-chengdu.myqcloud.com/"
			///如果设计师信息存在，展示设计师的图片与文字备注
		if ( res.designinfo.designer ) {
			   
				if( (roletype == 2) && (designreceivestate == 1) && (orderstate != 4) && (orderstate < 6)){
					///提交设计按钮 显示
					$("button.workstage_submitDesignBtn").show();
					}
				
			try{
			    if ( res.designinfo.designer[0].designerpattern ) {
				
					if( orderstate <= 3 && roletype != 2 ){
						$("div.order_scheme_box").hide();
					}else{
						
					
					var design = res.designinfo.designer[0].designerpattern[0],
						designer = res.designinfo.designer[0].designername,
						designName = res.designinfo.designer[0].designername,
						desTime = design.designcommittime,
						desPatternId = design.designpatternid,
						desImg1 = design.patterniamgeurl1,
						desImg2 = design.patterniamgeurl2,
						desImg3 = design.patterniamgeurl3,
						desAcc_old = design.patternaccessoryid,  //设计师附件的原名
						desAcc = design.patternaccessoryurl,	//设计师附件的cos名
						designid = res.designinfo.designsheetid,   ///设计单id
						designtime = res.designinfo.designsheettime,  ///设计单创建时间
						feedback = design.userfeedback,	///评论的内容
						feedbacktime = design.userfeedbacktime, ///评论创建的时间
						version = design.designpatternversion,  ///设计图方案版本号
						feedstatus = design.feedbackstatus,  ///方案的反馈状态
						memo = design.patternmemo;  ///设计的备注
					$.cookie("designversion", version );  ///设计单版本号
					$.cookie("feedstatus", feedstatus);  ///客服反馈状态
					$("h6.design_scheme_header").children("span").text( designer );
					$("h6.design_scheme_header").children("time").text( designtime );
					//设计方案区域显示
					/*$("div.order_scheme_box").show();*/
					if( memo ){
						$("textarea.remark_access_scheme").val( memo );
					};
					if ( roletype == 1 && version >= 1 && feedstatus <= 1) {
						$("button.selectScheme_orderDetail").show();
					}; 
					if ( feedstatus == 2 ) {
						$("div.content_scheme_design1").prepend( ( $("<h2>").addClass("selectSch")) );
					};
					var desAccess = "";	
						if(desImg1){
							$("ol.show_uppic_scheme").append( 
								$("<li>").attr("data-num","1").append( ($("<img />").attr("src", str_img + desImg1)) )
										.append($("<em>").text("设计图"))
										.append( $("<div>").addClass("showEnlarged_order").append($("<i>").addClass("icon iconfont icon-error-20170103"))
													.append($("<img />").attr("src", str_img + desImg1) )  )
								);
								img1_sch = desImg1;
						}
						if(desImg2){
							$("ol.show_uppic_scheme").append( 
								$("<li>").attr("data-num","2").append( ($("<img />").attr("src", str_img + desImg2)) )
										.append($("<em>").text("设计图"))
										.append( $("<div>").addClass("showEnlarged_order").append($("<i>").addClass("icon iconfont icon-error-20170103"))
													.append($("<img />").attr("src", str_img + desImg2) )  )
								);
								img2_sch = desImg2;
						}
						 ///<li ><img src=""/><em>设计图</em></li>
						if(desImg3){
							$("ol.show_uppic_scheme").append( 
								$("<li>").attr("data-num","3").append( ($("<img />").attr("src", str_img + desImg3)) )
										.append($("<em>").text("设计图"))
										.append( $("<div>").addClass("showEnlarged_order").append($("<i>").addClass("icon iconfont icon-error-20170103"))
													.append($("<img />").attr("src", str_img + desImg3) )  )
								);
								img3_sch = desImg3;
						}
						
						$("ol.show_upaccessory_scheme").html( '<li><b class="download_order_scheme">下载生产订单</b></li>' );
						if ( desAcc ) {
							////截取返回url中的名称部分字符串
							acc_sch = desAcc;
							var desAccess = desAcc.substr(15);  //截取后的设计附件的名称
							
							var str_acc = '<li data-url="'+ str_img+desAcc +'"><span>'+( desAcc_old || desAccess )+'</span><em></em><b class="download_accessory_scheme">下载设计稿</b>'
							  				+'<b class="download_order_scheme">下载生产订单</b><b class="delete_accessory_scheme">删除</b></li>';
							$("ol.show_upaccessory_scheme").html( str_acc );
							/*setTimeout(function(){},800)*/
								if ( roletype == 2 && designstate < 4 ) {
									$("ol.show_upaccessory_scheme li b.delete_accessory_scheme").show();
								}
						}
						
					}///判断roletype == 1  orderstate 
						
				}else{
						///有设计单号，没有具体设计信息，角色1 3  隐藏   
						if (roletype != 2 && orderstate < 4) {
							///如果没有设计图的信息，隐藏设计信息
							$("div.order_scheme_box").hide();
						} 
						
					}
			
			
			}catch(e){
					//TODO handle the exception
			}	
		}else{
					///如果没有设计师的信息，隐藏设计信息
					$("div.order_scheme_box").hide();
			}///判断 是否有设计信息、、结束	
			
			
			///如果存在设计师参考信息，进行展示和渲染
			if(res.orderaddinfo.imageurl1!= null || res.orderaddinfo.remarks!= null|| res.orderaddinfo.accessoryurl!= null){
				var img1 = res.orderaddinfo.imageurl1,
					img2 = res.orderaddinfo.imageurl2,
					img3 = res.orderaddinfo.imageurl3,
					access = res.orderaddinfo.accessoryurl,
					access_old = res.orderaddinfo.accessoryid,
					remark = res.orderaddinfo.remarks;
				
				////如果参考图片信息存在     <li><img src=""/> <em>参考图</em> </li>
				if( img1 ){
					/*$("h6.newOrder_uppic ol.show_uppic").show();*/
					$("li.toDesigner_cont ol.show_uppic").append( 
							$("<li>").attr("data-num","1").append( $("<img />").attr("src", str_img + img1) )
									.append( $("<em>").text("参考图") )
									.append( $("<div>").addClass("showEnlarged_order").append($("<i>").addClass("icon iconfont icon-error-20170103"))
												.append($("<img />").attr("src", str_img + img1) )  )
							);
							arr_imgRef[0] = img1_ref = img1;
							
				};
				if( img2  ){
					$("li.toDesigner_cont ol.show_uppic").append( 
							$("<li>").attr("data-num","2").append( ($("<img />").attr("src", str_img + img2)) )
									.append($("<em>").text("参考图"))
									.append( $("<div>").addClass("showEnlarged_order").append($("<i>").addClass("icon iconfont icon-error-20170103"))
												.append($("<img />").attr("src", str_img + img2) )  )
							);
							arr_imgRef[1] = img2_ref = img2;
				};
				if( img3  ){
					$("li.toDesigner_cont ol.show_uppic").append( 
							$("<li>").attr("data-num","3").append( ($("<img />").attr("src", str_img + img3)) )
									.append($("<em>").text("参考图"))
									.append( $("<div>").addClass("showEnlarged_order").append($("<i>").addClass("icon iconfont icon-error-20170103"))
												.append($("<img />").attr("src", str_img + img3) )  )
							);
							arr_imgRef[2] = img3_ref = img3;
				};
				////如果设计师参考附件信息存在
				if( res.orderaddinfo.accessoryurl ){
						/*$("ol.show_upaccessory").show();*/
						////截取返回url中的名称部分字符串
						acc_ref = access;
						var str_access = access.substr(15);  //截取后的参考附件的名字
						
						var str_access = '<li data-url="'+ str_img+access +'"><span>'+ ( access_old || str_access ) +'</span><em></em><b class="download_accessory">下载</b>'
						  				+'<b class="delete_accessory">删除</b></li>';
						$("li.toDesigner_cont ol.show_upaccessory").html( str_access );
						if( roletype == "1" ){
							$("b.delete_accessory").show();
						}
						
				};
				
				////如果设计师参考备注信息存在
				if( remark ){
					$("textarea.neworder_remark_designer").val( remark );
				};
			}	
				
			try{
				fremark = res.orderaddinfo.fremarks;
				
				////如果工厂、车间  参考备注信息存在
				if( fremark ){
					$("textarea.neworder_remark_factory").val( fremark );
				};
				
			}catch(e){
				//TODO handle the exception
			}
				
				
				
				
			
				
				///判断关于设计师评论是否存在
				if( feedback ){
					///渲染数据，加载页面
					var str_comment = '<div class="comment-show-con clearfix">'
					+'<div class="comment-show-con-img pull-left"><img src="./images/images/073928257.jpg" alt=""/></div>'
					+'<div class="comment-show-con-list pull-left clearfix">'
					+'<div class="pl-text clearfix"><a href="#" class="comment-size-name">'+ nickname +': </a>' 
					+'<span class="my-pl-con">'+ feedback +'</span></div><div class="date-dz">' 
					+'<span class="date-dz-left pull-left comment-time">'+ feedbacktime +'</span>' 
					+'<div class="date-dz-right pull-right comment-pl-block">'
					+'<a href="javascript:;" class="removeBlock">删除</a>'
					+'<a href="javascript:;" class="date-dz-pl pl-hf hf-con-block pull-left">回复</a>'
					+'<span class="pull-left date-dz-line">|</span>'
					+'<a href="javascript:;" class="date-dz-z pull-left">'
					+'<i class="date-dz-z-click-red"></i>赞 (<i class="z-num">666</i>)</a></div>' 
					+'</div><div class="hf-list-con"></div></div> </div>';
					$("div.comment-show").html( str_comment );
				}
			
			
			//如果有收货地址信息
			if ( consignee ) {
				$("em.name_orderdetail").text( consignee );
		  		$("em.tel_orderdetail").text(tel);
		  		$("em.postcode_orderdetail").text( postcode );
		  		$("em.province_orderdetail").text( province );
		  		$("em.city_orderdetail").text( city );
		  		$("em.district_orderdetail").text( county );
		  		$("em.road_orderdetail").text( address );
		  		$("strong.newAddressBtn").hide();  ///新建地址按钮
			} else{
				$("div.deliveryaddress_orderdetail p").show();
				$("div.deliveryaddress_orderdetail dl").hide();
			}
	  		
	  		
			console.log(data_order_overview);
			//命名空间
			var bt = baidu.template;
			var str1 = bt( 'baidu_orderDetail_orderview', data_order_overview );
			//渲染
			$("#orderDetail_orderview").html(str1);
			
		}else{ 
			copyAlert(res.msg+",3s后返回我的工作台！");
			setTimeout(function(){
				getWorkstage();
			},3000);
		}
			
		}
	});
	
	
	///点击  复制  按钮  ，调用复制的方法
	
	$(document).on("click","#copyBtn_orderdetail",function(){
		var txt1 = $("div.deliveryaddress_orderdetail dt span").eq(0).text();
		var txt2 = $("div.deliveryaddress_orderdetail dt span").eq(1).text();
		var txt3 = $("div.deliveryaddress_orderdetail dt span").eq(2).text();
		var txt4 = $("div.deliveryaddress_orderdetail dt span").eq(3).text();
		var txt = txt1 +"\n"+ txt2 +"\n"+ txt3 +"\n"+ txt4;
		console.log( txt );
		
		setTimeout(function(){
			
		},500);
		
			
	});
	
	 
	
	//引入添加地址的封装文件
	var $distpicker = $('#distpicker');
 
	$('#distpicker').distpicker({
	    province: '--- 所在省 ---',
	    city: '--- 所在市 ---',
	    district: '--- 所在区 ---'
	  });
	  
});


$(document).ready(function(){
		var userid = $.cookie('userid'), 
			token = $.cookie('token'),
			roletype = parseInt( $.cookie('roletype') ),
			orderid = ( $.cookie('orderid') ),
			goodsid = $.cookie('goodsid'),  //商品号
			customid = $.cookie('customid'); //定制号"customid": customid,
	//
	if ( roletype == "1" ) {
		 ///参考附件的 删除附件显示
		$("b.delete_accessory").show();
		$("textarea.remark_access_scheme").attr("readonly",true);
		$("ul.upload_picremark_scheme h6").children("div").hide();
		$("button.workstage_modifyRefPicBtn").show();   ///参考的提交按钮
		/*$("b.delete_accessory_scheme").hide();*/  ///设计图附件的 删除附件隐藏
		//判断订单状态为8或9  （生产中 或  物流中）,显示  下载订单内容；
		setTimeout(function(){
			if( orderstate == 8 || orderstate == 9 ){
				$("b.download_order_scheme").show();
			}
		},500);
		
	}else if( roletype == "2"){
		$("span.customname_orderDetail").parent().hide();
		/*$("div.order_scheme_box").show();*/
		$("textarea.neworder_remark").attr("readonly",true);
		$("ul.upload_picremark_orderdetail h6").find("div").hide();
		/*$("ul.upload_picremark_orderdetail h6").find("ol").hide();*/
		$("div.deliveryaddress_orderdetail").hide();
		$("div.memo_factory").hide(); ///工厂备注隐藏
		$("b.delete_accessory_scheme").show();
	}else if( roletype == "3" ) {
		$("span.customname_orderDetail").parent().hide();
		$("div.order_scheme_box").show();
		$("textarea.neworder_remark").attr("readonly",true);  //参考的备注信息不可更改
		$("textarea.remark_access_scheme").attr("readonly",true);  //设计图的备注不可更改
		//参考图方面的信息
		$("ul.upload_picremark_orderdetail h6").find("div").hide();
		
		///设计方案的信息
		$("ul.upload_picremark_scheme h6").children("div").hide();
		$("div.memo_designer").hide(); 	///设计师备注隐藏
		/*$("b.delete_accessory_scheme").hide();*/  ///设计图附件的 删除附件隐藏
		$("b.delete_accessory_scheme").hide();
		$("b.delete_accessory").hide();
		///隐藏收货地址的相关按钮
		$("strong.newAddressBtn").hide();
		$("b.editAddBtn_orderdetail").hide();
		//判断订单状态为8或9  （生产中 或  物流中）,显示  下载订单内容；
		setTimeout(function(){
			if( orderstate == 8 || orderstate == 9 ){
				$("b.download_order_scheme").show();
			}
		},500);
	};   
	
	//下载生产订单                         "commandcode": 146,
	$(document).on("click","b.download_order_scheme",function(){
		var $this = $(this);
		$.ajax({
					type: "GET",
					url: url_order+"/zb-order-web/order/downcsv.do",
					data: {
						"customid": customid,
						"orderid": orderid,
						"userid": userid,
						"roletype": roletype,
						"token": token
					},
					dataType: "JSON",
					success: function(res){
						console.log(res)
						if (res.status.code == 0) {
							
							//window.open( str_url );
					    	var a = document.createElement("a");
					    	a.href = res.status.addRess;
					    	a.download = "abc";
					    	//response.addHeader("Content-Disposition","attachment");
					    	a.click();
							/*sessionStorage.setItem("url_download", res.status.addRess );
							window.open("download.html");*/
							//window.location.href = res.status.addRess ;//重新打开一个tag
						} 
					}
				})
	});
	
	///判断角色为客服
	if ( roletype == 1 ) {
		
		//将鼠标移至参考图片上时，出现  放大  和  删除的图标；移开，消失
		$(document).on("mouseenter","ol.show_uppic li",function(){
			$(this).append( $("<p>").append( $("<i>").addClass("icon").addClass("iconfont").addClass("icon-fangda") )
									.append( $("<i>").addClass("icon").addClass("iconfont").addClass("icon-liucheng") ));
		}).on("mouseleave","ol.show_uppic li",function(){
			$(this).children("p").remove();
		});
		///鼠标移至设计图上，出现 放大的图标；移开，消失
		$(document).on("mouseenter","ol.show_uppic_scheme li",function(){
			$(this).append( $("<p>").append( $("<i>").addClass("icon").addClass("iconfont").addClass("icon-fangda") ) );
		}).on("mouseleave","ol.show_uppic_scheme li",function(){
			$(this).children("p").remove();
		});
		///点击收件箱图标，删除对应参考图片
		$(document).on("click","ol.show_uppic i.icon-liucheng",function(){
			var num = $(this).parent().parent("li").attr("data-num");
			$(this).parent().parent("li").remove();
			if (num == 1) {
				img1_ref = "";
				arr_imgRef[0]="";
				/*$.ajax({
					type: "GET",
					url: "http://192.168.1.150:8082/zb-order-web/order/updateOrderSummary.do",
					data: {
						"userId": userid,
						"orderid": orderid,
						"roleType": roletype,
						"token": token,
						"commandcode": 146,
						"referencepictureurl1": null
					},
					dataType: "JSON",
					success: function(res){
						if (res.status.code == 0) {
							
							console.log(res, res.status.msg);
							location.reload();
						} 
					}
				});*/		
			} else if (num == 2) {
				img2_ref = "";
				arr_imgRef[1]="";
				
			} else if(num == 3){
				img3_ref = "";
				arr_imgRef[2]="";
			}
		});
		
		////删除参考附件，并发起请求
		$(document).on("click","b.delete_accessory",function(){
			$("button.delete_ref_access").show();
			copyAlert("是否确定删除参考附件？");
		});
		///确认删除参考附件
		$(document).on("click","button.delete_ref_access",function(){
			$(this).parent().remove();
			acc_ref = "";
			acc_ref_old = "";
		});
		
		///客服发起评论       userfeedback.do
		$(document).one("click","a.commentBtn",function(){
			var txt = $("span.my-pl-con").text();
			console.log( txt );
			$.ajax({
					type: "GET",
					url: url_order+"/zb-order-web/designpattern/userfeedback.do",
					data: {
						"userid": userid,
						"orderid": orderid,
						"customid": customid,
						"roletype": roletype,
						"token": token,
						"commandcode": 147,
						"feedback": txt
					},
					dataType: "JSON",
					success: function(res){
						if (res.status.code == 0) {
							console.log(res.status.msg);
							copyAlert(res.status.msg);
							setTimeout(function(){
								location.reload();
							},500);
						} 
						
					}
				});
		});
		
		//当修改参考图和参考方案，  触发修改订单  的  提交按钮
		$(document).on("click","button.workstage_modifyRefPicBtn",function(){
			var val = $("textarea.neworder_remark_designer").val(),
				fval = $("textarea.neworder_remark_factory").val();
				///判断 img_ref的3个项
				
				if(!(img1_ref) && !(img2_ref) && !(img3_ref) ){
					//都是空
					img1_ref = arr_imgRef[0];
					img2_ref = arr_imgRef[1];
					img3_ref = arr_imgRef[2];
				}else if(!(img1_ref) && (img2_ref) && !(img3_ref) ){
					//第1、3个空
					img1_ref = arr_imgRef[0];
					img3_ref = arr_imgRef[1];				
				}else if((img1_ref) && !(img2_ref) && !(img3_ref) ){
					//第2、3个空
					img2_ref = arr_imgRef[0];
					img3_ref = arr_imgRef[1];				
				}else if(!(img1_ref) && !(img2_ref) && (img3_ref) ){
					//第1/2个空
					img1_ref = arr_imgRef[0];
					img2_ref = arr_imgRef[1];				
				}else if(!(img1_ref) && (img2_ref) && (img3_ref) ){
					//第1个空
					img1_ref = arr_imgRef[0];
								
				}else if((img1_ref) && !(img2_ref) && (img3_ref) ){
					//第2个空
					img2_ref = arr_imgRef[0];
				}else if((img1_ref) && (img2_ref) && !(img3_ref) ){
					//第2个空
					img3_ref = arr_imgRef[0];
				};/*else if((img1_ref) && !(img2_ref) && (img3_ref) ){
					//第2个空
					img2_ref = arr_imgRef[0];
				}*/
				
				console.log(orderid, arr_imgRef);
			//调用修改订单事件     ///"commandcode": 150,
			
			$.ajax({
				type: "GET",
				url: url_order+"/zb-order-web/order/updateOrderSummary.do",
				data: {
					"userId": userid,
					"orderid": orderid,
					"roleType": roletype,
					"token": token,
					"goodsimage": img1_ref || img2_ref || img3_ref,
					"referencepictureurl1": img1_ref,
					"referencepictureurl2": img2_ref,
					"referencepictureurl3": img3_ref,
					"accessoryurl": acc_ref,
					"accessoryid": acc_ref_old,
					"memo": val,
					
					"factorymemo": fval
				},
				
				dataType: "JSON",
				success: function(res){
					if (res.status.code == 0) {
						/*console.log(res.status.msg);*/
						copyAlert(res.status.msg);
						setTimeout(function(){
							location.reload();
						},500);
					} 
					
				},
				error: function(err){
					copyAlert(err.status +","+ err.statusText);
				}
			});
		});
		
	} //角色为客服  结束
	
	///查看参考放大图  download_accessory
	$(document).on("click","i.icon-fangda",function(){
		$(this).parent().siblings("div").css({"display": "flex"});
	});
	///查看参考放大图  download_accessory
	$(document).on("click","i.icon-error-20170103",function(){
		$(this).parent("div").css({"display": "none"});
	});
	///下载参考附件  download_accessory
	$(document).on("click","b.download_accessory",function(){
		var str_url = $(this).parent().attr("data-url");
		
    	//window.open( str_url );
    	//运用a标签的download属性，实现下载的目的；
    	var a = document.createElement("a");
    	a.href = str_url;
    	a.download = "abc";
    	//response.addHeader("Content-Disposition","attachment");
    	a.click();
	});
	///下载设计附件  download_accessory_scheme
	$(document).on("click","b.download_accessory_scheme",function(){
		var str_url = $(this).parent().attr("data-url");
		
    	//window.open( str_url );
    	var a = document.createElement("a");
    	a.href = str_url;
    	a.download = "abc";
    	//response.addHeader("Content-Disposition","attachment");
    	a.click();
	});
	
	///判断角色为设计师
	if ( roletype == 2 ) {
		///点击下载
		/*$(document).on("click","ol.show_uppic li",function(){
			window.open( $(this).find("img").attr("src") );
		});*/
		//将鼠标移至参考图片上时，出现  放大  的图标；移开，消失
		$(document).on("mouseenter","ol.show_uppic li",function(){
			$(this).append( $("<p>").append( $("<i>").addClass("icon").addClass("iconfont").addClass("icon-fangda") ) );
									
		}).on("mouseleave","ol.show_uppic li",function(){
			$(this).children("p").remove();
		});
		///鼠标移至设计图上，出现  放大  和  删除  的图标；移开，消失
		$(document).on("mouseenter","ol.show_uppic_scheme li",function(){
			$(this).append( $("<p>").append( $("<i>").addClass("icon").addClass("iconfont").addClass("icon-fangda") )
									.append( $("<i>").addClass("icon").addClass("iconfont").addClass("icon-liucheng") ) );
		}).on("mouseleave","ol.show_uppic_scheme li",function(){
			$(this).children("p").remove();
		});
		///触发删除设计图的事件
		$(document).on("click","ol.show_uppic_scheme i.icon-liucheng",function(){
			var num = $(this).parent().parent("li").attr("data-num");
			$(this).parent().parent("li").remove();
			if (num == 1) {
				img1_sch = "";
				arr_imgSch[0] = "";
				/*$.ajax({
					type: "GET",
					url: "http://192.168.1.150:8082/zb-order-web/ordersummary/submit.do",
					data: {
						"userid": userid,
						"orderid": orderid,
						"roletype": roletype,
						"token": token,
						"commandcode": 146,
						"patternimageurl1": ""
					},
					dataType: "JSON",
					success: function(res){
						console.log(res);
					}
				});	*/
			} else if (num == 2) {
				img2_sch = "";
				arr_imgSch[1] = "";
			} else{
				img3_sch = "";
				arr_imgSch[2] = "";
			}
		});
		
		////删除设计图附件，并发起请求
		$(document).on("click","b.delete_accessory_scheme",function(){
			$("button.delete_design_access").show();
			copyAlert("是否确定删除附件？");
		});
		///确认删除设计图附件
		$(document).on("click","button.delete_design_access",function(){
			$(this).parent().parent().hide();
			acc_sch = "";
			acc_sch_old = "";
		});
		
		//设计师提交设计方案   
		$(document).on("click","button.workstage_submitDesignBtn",function(){
				var remark = $("textarea.remark_access_scheme").val();
				console.log(userid,orderid);
			//
			///判断 img_ref的3个项
			
			if(!(img1_sch) && !(img2_sch) && !(img3_sch) ){
				//都是空
				img1_sch = arr_imgSch[0];
				img2_sch = arr_imgSch[1];
				img3_sch = arr_imgSch[2];
			}else if(!(img1_sch) && (img2_sch) && !(img3_sch) ){
				//第1、3个空
				img1_sch = arr_imgSch[0];
				img3_sch = arr_imgSch[1];				
			}else if((img1_sch) && !(img2_sch) && !(img3_sch) ){
				//第2、3个空
				img2_sch = arr_imgSch[0];
				img3_sch = arr_imgSch[1];				
			}else if(!(img1_sch) && !(img2_sch) && (img3_sch) ){
				//第1/2个空
				img1_sch = arr_imgSch[0];
				img2_sch = arr_imgSch[1];				
			}else if(!(img1_sch) && (img2_sch) && (img3_sch) ){
				//第1个空
				img1_sch = arr_imgSch[0];
							
			}else if((img1_sch) && !(img2_sch) && (img3_sch) ){
				//第2个空
				img2_sch = arr_imgSch[0];
			}else if((img1_sch) && (img2_sch) && !(img3_sch) ){
				//第2个空
				img3_sch = arr_imgSch[0];
			};
			$.ajax({
				type: "GET",
				url: url_order+"/zb-order-web/ordersummary/submit.do",
				data: {
					
					"userid": userid ,
					"orderid": orderid ,
					"customid": customid,
					"roletype": roletype,
					"token": token,
					"commandcode": 146,
					"patternimageurl1": img1_sch,
					"patternimageurl2": img2_sch,
					"patternimageurl3": img3_sch,
					"patternaccessoryurl": acc_sch,
					"patternaccessoryid": acc_sch_old,
					"patternmemo": remark
				},
				
				dataType: "JSON",
				success: function(res){
					console.log(res, res.status);
					copyAlert("设计方案上传成功");
					setTimeout(function(){
						location.reload();
					},500);
					
				}
			});
		});
	
	};   ///判断角色结束
	
	// 客服  分配生产/发起生产 
	$(document).on("click","em.workstage_productionBtn",function(){
		var orderid = $(this).parent().attr("data-orderid"),
			customid = $(this).parent().attr("data-customid"),
			goodsid = $(this).parent().attr("data-goodsid"),
			orderState = $(this).attr("data-orderState");
		var $this = $(this);
			$this.css({"background-color": "#e8e8e8"});
			console.log(userid,orderid,roletype,token);
		//根据cookie发起请求，进行客服定价
		if( consignee ){
			$.ajax({
				type: "GET",
				url: url_order+"/zb-order-web/productinfo/allocation.do",
				data: {
					"userid": userid,
					"orderid": orderid,
					"roletype": roletype,
					"token": token,
					"goodsid": goodsid,
					"customid": customid,
					"commandcode": 170
				},
				dataType: "JSON",
				success: function(res){
					console.log(res);
					if ( res.status.code == 0 ) {
						$this.css({"background-color": "#fff"});
						$this.hide();
						copyAlert(res.status.msg);
						setTimeout(function(){
		  					location.reload();
		  				},500);
					} else{
						$("div.production_service_box").show(); //显示  客服发起生产、上传设计和附件 的  模块
						
					}		
				}
			})
			
		}else{
			copyAlert("请添加客户收货地址！");
			$("button.continueAddress_copyAlert").show();
			$(document).on("click","button.continueAddress_copyAlert",function(){
				closeAlert();
				//getOrderDetail();
				//setTimeout(function(){},2000);
				$("div.newAddress_orderDetail").show();
				
				
			});
		}
			
	});
	//客服上传设计图、备注、涉及附件
	$(document).on("click","button.continueUpload_work",function(){
		
		if( up_service_state == 1 ){
			
		
			var remark = $.trim($("textarea.neworder_remark_service").val());
					$.ajax({
							type: "GET",
							url: url_order+"/zb-order-web/productinfo/allocation.do",
							data: {
								"userid": userid,
								"orderid": orderid,
								"roletype": roletype,
								"token": token,
								"goodsid": goodsid,
								"customid": customid,
								"commandcode": 170,
								"patternimageurl1": arr_new_service[0],
								"patternimageurl2": arr_new_service[1],
								"patternimageurl3": arr_new_service[2],
								"patternaccessoryurl": acc_new_service,
								"patternaccessoryid": acc_old_service,
								"patternmemo": remark
							},
							dataType: "JSON",
							success: function(res){
								console.log(res);	
								if(res.status.code == 0){
									$("div.production_service_box").hide(); //隐藏  客服发起生产、上传设计和附件 的  模块
									copyAlert(res.status.msg);
									up_service_state = 0;
									setTimeout(function(){
										location.reload();
									},800);
								}
								
							}
						})
		}else{ 
			copyAlert("文件上传中，请稍等！");
			setTimeout(function(){
				closeAlert();
			},600);
		};
	});
	//判断角色为 车间
	if( roletype == 3){
		//将鼠标移至参考图片上时，出现  放大  的图标；移开，消失
		$(document).on("mouseenter","ol.show_uppic li",function(){
			$(this).append( $("<p>").append( $("<i>").addClass("icon").addClass("iconfont").addClass("icon-fangda") ) );
									
		}).on("mouseleave","ol.show_uppic li",function(){
			$(this).children("p").remove();
		});
		///鼠标移至设计图上，出现  放大  的图标；移开，消失
		$(document).on("mouseenter","ol.show_uppic_scheme li",function(){
			$(this).append( $("<p>").append( $("<i>").addClass("icon").addClass("iconfont").addClass("icon-fangda") ) );
									
		}).on("mouseleave","ol.show_uppic_scheme li",function(){
			$(this).children("p").remove();
		});
	};  ///判断角色结束
	
	
	
	
	/* 选定设计方案 */
	$(document).one("click","button.selectScheme_orderDetail",function(){
		var userid = $.cookie('userid'), 
			token = $.cookie('token'),
			roletype = parseInt( $.cookie('roletype') ),
			orderid = ( $.cookie('orderid') ),
			goodsid = $.cookie('goodsid'),  //商品号
			customid = $.cookie('customid'); //定制号"customid",
			var $this = $(this);
			///选中设计方案时，添加“选中的图标”     div.content_scheme_design1>p.selectSch
			$("div.content_scheme_design1").prepend( ( $("<h2>").addClass("selectSch")) );
			console.log(userid,orderid,roletype,token);
		//根据cookie发起请求，获取订单详情的具体内容    
		$.ajax({
			type: "GET",
			url: url_order+"/zb-order-web/ordersummary/designate.do",
			data: {
				"userid": userid,
				"orderid": orderid,
				"customid": customid,
				"roletype": roletype,
				"token": token,
				"commandcode": 144
			},
			
			dataType: "JSON",
			success: function(res){
				console.log(res);
				$this.hide();
				copyAlert(res.status.msg);
				setTimeout(function(){
					location.reload();
				},500);
				
			}
		});
	});
	
	//车间上传物流信息的事件
	$(document).one("click","button.confirm_addExpress",function(){
		var expressCom = $("input.expressCom_orderDetail").val(),
			expressNum = $("input.expressNum_orderDetail").val();
			console.log(userid,orderid,roletype,token);
		//根据cookie发起请求，获取订单详情的具体内容192.168.1.150:8082/zb-manager-web/service/address.do
		$.ajax({
			type: "GET",
			url: url_manager+"/zb-manager-web/service/address.do",
			data: {
				"userid": userid,
				"orderid": orderid,
				"goodsid": goodsid,
				"customid": customid,
				"roletype": roletype,
				"token": token,
				"commandcode": 58,
				"logisticscompany": expressCom,
				"logisticssheetid": expressNum
			},
			
			dataType: "JSON",
			success: function(res){
				console.log(res);
				$("div.uploadExpress_orderDetail").hide();
				copyAlert( res.status.msg );
				setTimeout(function(){
					location.reload();
				},500);				
			}
		});
	});
	
	//点击  查看物流  按钮，弹出查看物流信息框,查看物流信息
	$(document).on("click","em.workstage_logisticsBtn",function(){
			//$("div.checkExpress_orderDetail").show();
			//console.log(userid,orderid,roletype,token);
		//根据cookie发起请求，获取订单详情的具体内容
		$.ajax({
			type: "GET",
			url: url_logistics+"/zb-logistics-web/logistics/logistics.do",
			data: {				
				"userId": userid,
				"orderid": orderid,
				"customid": customid,
				"roleType": roletype,
				"token": token,
				"commandcode": 50
			},
			dataType: "JSON",
			success: function(res){
				console.log(res);
				if( res.status.code == 0 ){
					if( res.traces ){
						res = JSON.stringify(res);
						var storage_str = null;
						if ( window.localStorage ) {
							storage_str = window.localStorage;
							storage_str.setItem("obj_logisticsMess",res);
							//storage_str.getItem("obj_logisticsMess"));
						}; 	
						setTimeout(function(){
							getLogisticsMess();
						},900);	
					}else{
						copyAlert(res.status.msg);
						setTimeout(function(){
							location.reload();
						},500);
					}
					
				}
				
				
			}
		});
	});
	
	
	
	///
	
	
	//点击上传物流信息，弹出添加物流信息框   
	$(document).on("click","em.workstage_uploadLogisticsBtn",function(){
        $("div.uploadExpress_orderDetail").show();
    });
    //
    //点击订单详细信息，收起  或  显示  
	$(document).on("click","p.exchangeOrderDetailBtn",function(){
        $("div.order_box").toggle();
        $(".icon-henggang").toggle();
        $(".icon-comiisjiahao").toggle();
    });
    //点击 查看物流中的关闭  按钮，关闭查看物流模块  
	$(document).on("click","button.close_checkExpress",function(){
        $("div.checkExpress_orderDetail").hide();
    });
	/* 当点击订单详情中取消订单的取消按钮时， 让取消订单弹窗消失 */
    $("strong.cancelBtn_orderDetail").click(function(){
        $("div.cancel_orderDetail").hide();
    });
    /*-当点击“取消订单”时，出现取消订单的模块-*/
   $("a.workstage_cancelOrder").click(function(){
   		$("div.cancel_orderDetail").show();
   });
   /* 点击新建收货地址,显示弹窗 */
  	$(document).on("click","strong.newAddressBtn",function(){
  		$("div.newAddress_orderDetail").show();
  	});
  	/* 点击编辑收货地址， 打开地址窗口，并显示*/
  	$(document).on("click","b.editAddBtn_orderdetail",function(){
  		$("div.newAddress_orderDetail").show();
  		///获取当前的值
  		var name = $("em.name_orderdetail").text();
  		var tel = $("em.tel_orderdetail").text();
  		var postcode = $("em.postcode_orderdetail").text();
  		var province = $("em.province_orderdetail").text();
  		var city = $("em.city_orderdetail").text();
  		var district = $("em.district_orderdetail").text();
  		var Address = $("em.road_orderdetail").text();
  		///赋值在新建地址表格中
  		$("input.consignee_newAdd").val( name );
  		$("input.telphone_newAdd").val( tel );
  		$("input.postcode_newAdd").val( postcode );
  		$("select#province1 option:checked").text( province );
  		$("select#city1 option:checked").text( city );
  		$("select#district1 option:checked").text( district );
  		$("input.addDetailAddress_newAdd").val( Address );
  		
  		
  	});
  	
  	/* 点击新建地址弹窗中的确认按钮时，提交地址信息*/
  	$(document).on("click","button.confirm_addAddress_orderDetail",function(){ 
  		//获取输入 或 选择的信息
  		var consignee_newAdd = $("input.consignee_newAdd").val();  //新建收货人
  		var tel_newAdd = $.trim($("input.telphone_newAdd").val());	//新建  电话
  		var postcode_new = $("input.postcode_newAdd").val();	//邮编
  		var province = $("select#province1 option:checked").text();//省
  		var city = $("select#city1 option:checked").text(); // 市或 市辖区
  		var district = $("select#district1 option:checked").text(); //区
  		var dAddress = $("input.addDetailAddress_newAdd").val();
  		var checkTel = false;
  		var checkPost = false;
  		var regTel = /^[1][3,5,6,7,8,9][0-9]{9}$/; //验证手机号的正则表达式
  		var regPost = /^[1-9][0-9]{5}$/;  //验证邮编的正则表达式
  		//验证手机号
  		/*if ( regTel.test( tel_newAdd ) ) {
  			checkTel = true;
  			$("input.telphone_newAdd").removeClass("redbord");
  		} else{
  			checkTel = false;
  			$("input.telphone_newAdd").addClass("redbord");
  		}*/
  		//验证邮编
  		/*if ( regPost.test( postcode_new ) ) {
  			checkPost = true;
  			$("input.postcode_newAdd").removeClass("redbord");
  		} else{
  			checkPost = false;
  			$("input.postcode_newAdd").addClass("redbord");
  		}*/
  		console.log(province, dAddress);
  		///recipient=1&recipienttele=1&state=1&province=1&city=1&county=1&logisticsaddress1=1		&& district != "---- 选择区 ----"
  		if(consignee_newAdd !="" && tel_newAdd != "" && dAddress != "" ){
  			$.ajax({
				type: "GET",
				url: url_manager+"/zb-manager-web/service/address.do",
				data: {
					"userid": userid,
					"orderid": orderid,
					"roletype": roletype,
					"customid": customid,
					"token": token,
					"goodsid": goodsid,
					"commandcode": 150,
					"recipient": consignee_newAdd,
					"recipienttele": tel_newAdd,
					"logisticsaddress2": postcode_new,
					"state": "中国",
					"province": province,
					"city": city,
					"county": district,
					"logisticsaddress1": dAddress
				},
				
				dataType: "JSON",
				success: function(res){
					console.log(res);
					if (res.status.code == 0) {
						console.log(res.status.msg);
						///给页面添加数据
				  		$("em.name_orderdetail").text( consignee_newAdd );
				  		$("em.tel_orderdetail").text(tel_newAdd);
				  		$("em.postcode_orderdetail").text( postcode_new );
				  		$("em.province_orderdetail").text( province );
				  		$("em.city_orderdetail").text( city );
				  		$("em.district_orderdetail").text( district );
				  		$("em.road_orderdetail").text( dAddress );
						//点击  发送成功后隐藏
  						$("div.newAddress_orderDetail").hide();
  						copyAlert(res.status.msg);
  						setTimeout(function(){
  							location.reload();
  						},500); 						
					} 					
				},
				error: function(err){
					console.log(err);
				}
			});
		}
  		
  	});
  	
   /* 上传并预览参考图片 */
    $(".order_upload_pic").change(function(){
        var _this = $(this)[0],
        	ti,flag,
            /*$upload_label = _this.parent(),*/
            $upload_ol = $(this).parent().parent().next("ol");//
                                                       
            //选择图片，马上预览
            function uploadImg(obj) {
                for (var i = 0; i <3; i++) {
                	var file = obj.files[i];
                	//var file_size = file.size;
                    flag = (file.size <= 2048000) ? true : false ;
                	//console.log(file);
                    if(file.type == 'image/jpg' || file.type == 'image/gif' || file.type == "image/png" ||file.type == 'image/jpeg' ){ 
	                    if(flag){
	                    	
	                        var reader = new FileReader();
	    
	                        //读取文件过程方法
	                        reader.onloadstart = function (e) {
	                            /*console.log("开始读取....");*/
	                        }
	                        reader.onprogress = function (e) {
	                            /*console.log("正在读取中....");*/
	                        }
	                        reader.onabort = function (e) {
	                            console.log("中断读取....");
	                        }
	                        reader.onerror = function (e) {
	                            console.log("读取异常....");
	                        }
	                        reader.onload = function (e) {
	                           /* console.log("成功读取....");*/
	                           if (img1_ref == "") {
		                           	$upload_ol.append($("<li data-num='1'></li>")
			                           .append($("<img></img>").attr("src",e.target.result))
			                           .append($("<em></em>").text("参考图")));
	                           }else if(img1_ref != "" && img2_ref == ""){
		                           	$upload_ol.append($("<li data-num='2'></li>")
			                           .append($("<img></img>").attr("src",e.target.result))
			                           .append($("<em></em>").text("参考图")));
	                           }else if(img1_ref != "" && img2_ref != "" && img3_ref == ""){
	                           		$upload_ol.append($("<li data-num='3'></li>")
			                           .append($("<img></img>").attr("src",e.target.result))
			                           .append($("<em></em>").text("参考图")));
	                           } 
	                           
	                           
	                                               
	                        }
	                        //解析图片内容
	                        reader.readAsDataURL(file);                          
	                    };
	                }else{
	                	//如果图片格式不符，弹出提示框
	                	copyAlert("图片格式不符，请重新上传！");
	                };
                }             
            }    
            
            
                //调用函数
            
                    uploadImg(_this);
                /*if(flag){ 
                    $upload_label.hide();}*/
                                  
                   /*$upload_float.on("click",function(){
                       $upload_img.removeAttribute("src");
                       $upload_float.hide();
                       console.log(11111);
                   });*/  
          
    });
    
    //显示上传参考附件的名称
    $(".upload_accessory").change(function(){
        var _this = $(this)[0],
        	type = $(this).attr("data-type"),
            ti,flag,
            $upload_ol = $(this).parent().parent().next("ol");
            
            
            //选择附件，显示附件名
            function uploadAccessory(obj) {
                
                    var file = obj.files[0];
                    flag = (file.size <= 20480000) ? true : false ;
                    var filesize = parseInt((file.size)/1024)/1000 + "M";
                	//acc_ref_old = file.name;
                    /*console.log(obj);*/
                    //console.log(file.name);
                    		
	                    	
                    if(flag){
                    		
	                    		acc_ref_old = file.name;
	                    		
	                    	
	                    	console.log(file.name);
                        $upload_ol.html(($("<li></li>")
                        .append($("<span></span>").text(file.name)) 
                        .append($("<em></em>").text(filesize))
                        .append($("<b></b>"))
                        .append($("<b></b>").text("删除").attr("class","delete_accessory"))
                        ));
                        /*console.log("file.size = " + file.size);*/  //file.size 单位为byte
                    }
                                                           
                             
            }    
            
                //调用函数
            
                    uploadAccessory(_this);
                /*if(flag){ 
                    $upload_label.hide();}*/  
                     
    });
    
    //设计师上传图片
    $(".scheme_upload_pic").change(function(){
        var _this = $(this)[0],
            ti,flag,
            /*$upload_label = _this.parent(),*/
            $upload_ol = $("ol.show_uppic_scheme");
                                                       
            //选择图片，马上预览
            function uploadImg(obj) {
                for (var i = 0; i <3; i++) {
                    var file = obj.files[i];
                    /*var file_size = file.size;*/
                    flag = (file.size <= 2048000) ? true : false ;
                    //console.log(file);
                	if(file.type == 'image/jpg' || file.type == 'image/gif' || file.type == "image/png" ||file.type == 'image/jpeg' ){
	                    if(flag){
	                        var reader = new FileReader();
	    
	                        //读取文件过程方法
	                        reader.onloadstart = function (e) {
	                            /*console.log("开始读取....");*/
	                        }
	                        reader.onprogress = function (e) {
	                            /*console.log("正在读取中....");*/
	                        }
	                        reader.onabort = function (e) {
	                            console.log("中断读取....");
	                        }
	                        reader.onerror = function (e) {
	                            console.log("读取异常....");
	                        }
	                        reader.onload = function (e) {
	                           /* console.log("成功读取....");*/
	                           if (img1_sch == "") {
		                           	$upload_ol.append($("<li data-num='1'></li>")
			                           .append($("<img></img>").attr("src",e.target.result))
			                           .append($("<em></em>").text("效果图")));
	                           }else if(img1_sch != "" && img2_sch == ""){
		                           	$upload_ol.append($("<li data-num='2'></li>")
			                           .append($("<img></img>").attr("src",e.target.result))
			                           .append($("<em></em>").text("效果图")));
	                           }else if(img1_sch != "" && img2_sch != "" && img3_sch == ""){
	                           		$upload_ol.append($("<li data-num='3'></li>")
			                           .append($("<img></img>").attr("src",e.target.result))
			                           .append($("<em></em>").text("效果图")));
	                           }  
	                           
	                           
	                                               
	                        }
	                        //解析图片内容
	                        reader.readAsDataURL(file);                          
	                    };
                	}else{
                		//如果图片格式不符，弹出提示框
                		copyAlert("图片格式不符，请重新上传！");
                	}
                };
            }    
            
            
                //调用函数
            
                uploadImg(_this);
    });
    
    //显示设计师上传附件
    $(".upload_accessory_scheme").change(function(){
        var _this = $(this)[0],
            ti,flag,           
            $upload_ol = $("ol.show_upaccessory_scheme");
                                                        
            //选择附件，显示附件名
            function uploadaccessory(obj) {
                
                    var file = obj.files[0];
                    flag = (file.size <= 51200000) ? true : false ;
                    var filesize = parseInt((file.size)/1024)/1000 + "M";
                    acc_sch_old = file.name;
                    /*console.log(obj);*/
                   /* console.log(file.name);*/
                    if(flag){
                        $upload_ol.html(($("<li></li>")
	                        .append($("<span></span>").text(file.name)) 
	                        .append($("<em></em>").text(filesize))
	                        .append($("<b></b>"))
	                        .append($("<b></b>").text("删除").attr("class","delete_accessory_scheme"))
                        ));
                        /*console.log("file.size = " + file.size);*/  //file.size 单位为byte
                    }
                                                           
                           
            }    
            
            
                //调用函数
            
                    uploadaccessory(_this);
                /*if(flag){ 
                    $upload_label.hide();}*/                                                                
    });
    
    //客服添加  并 上传设计图 、 备注、附件
    /* 上传并预览参考图片 */
    $(".upload_pic_service").change(function(){
        var _this = $(this)[0],
            ti,flag,
            /*$upload_label = _this.parent(),*/
            $upload_ol = $(this).parent().parent().next("ol");//
                                                       
            //选择图片，马上预览
            function uploadImg(obj) {
                for (var i = 0; i <3; i++) {
                	var file = obj.files[i];
                	//var file_size = file.size;
                	
                    flag = (file.size <= 2048000) ? true : false ;
                	//console.log(file);
                    if(file.type == 'image/jpg' || file.type == 'image/gif' || file.type == "image/png" ||file.type == 'image/jpeg' ){ 
	                    if(flag){
	                    	
	                        var reader = new FileReader();
	    
	                        //读取文件过程方法
	                        reader.onloadstart = function (e) {
	                            /*console.log("开始读取....");*/
	                        }
	                        reader.onprogress = function (e) {
	                            /*console.log("正在读取中....");*/
	                        }
	                        reader.onabort = function (e) {
	                            console.log("中断读取....");
	                        }
	                        reader.onerror = function (e) {
	                            console.log("读取异常....");
	                        }
	                        reader.onload = function (e) {
	                           /* console.log("成功读取....");*/
	                            
	                           $upload_ol.append($("<li></li>")
	                           .append($("<img></img>").attr("src",e.target.result))
	                           .append($("<em></em>").text("参考图")));
	                           
	                                               
	                        }
	                        //解析图片内容
	                        reader.readAsDataURL(file);                          
	                    };
	                }else{
	                	//如果图片格式不符，弹出提示框
	                	copyAlert("图片格式不符，请重新上传！");
	                };
                }             
            }    
            
            
                //调用函数
            
                    uploadImg(_this);
                  
          
    });
    
    //显示客服上传参考附件的名称
    $(".upload_accessory_service").change(function(){
        var _this = $(this)[0],
            ti,flag,
            $upload_ol = $(this).parent().parent().next("ol");
                                                        
            //选择附件，显示附件名
            function uploadAccessory(obj) {
                
                    var file = obj.files[0];
                    flag = (file.size <= 20480000) ? true : false ;
                    var filesize = parseInt((file.size)/1024)/1000 + "M";
                	acc_old_service = file.name;
                    /*console.log(obj);*/
                    console.log(file.name);
                    if(flag){
                        $upload_ol.html(($("<li></li>")
                        .append($("<span></span>").text(file.name)) 
                        .append($("<em></em>").text(filesize))
                        .append($("<b></b>"))
                        .append($("<b></b>").text("删除").attr("class","delete_accessory"))
                        ));
                        /*console.log("file.size = " + file.size);*/  //file.size 单位为byte
                    }
                                                           
                             
            }    
            
                //调用函数
            
                    uploadAccessory(_this);
                /*if(flag){ 
                    $upload_label.hide();}*/  
                     
    });
    
    $("div.order_scheme_box>ul>li").click(function(){
        $(this).addClass("border_red").siblings().removeClass("border_red");
    });
   
});
//定义  对象（图片、附件、文档）的下载方法
function downloadFun(obj){
	/*var a = document.createElement("a");
    	a.href = str_url;
    	a.download = "abc";
    	//response.addHeader("Content-Disposition","attachment");
    	a.click();*/
	var eleA = $("<a>").attr( "href",$(obj).parent().attr("data-url") ).hide();
	eleA[0].click();
}

//cos 的方法
    (function ($) {
        // 请求用到的参数
        var Bucket = 'test-1255653994';// 'resource-1255653994'     
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
        	var filetype = fname.substr(fname.indexOf("."));
        	
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
		/*// 指定要下载到的本地路径
		File downFile = new File("src/test/resources/mydown.txt");
		// 指定要下载的文件所在的 bucket 和路径
		GetObjectRequest getObjectRequest = new GetObjectRequest(bucketName, key);
		ObjectMetadata downObjectMeta = cosClient.getObject(getObjectRequest, downFile);*/
		
        // 监听表单提交   提交参考图
        var tem = 0;
        document.getElementById('uploadPic_designer').onchange = function (e) {
            var fileArray = document.getElementById('uploadPic_designer').files;
            
            for (var i=0; i<fileArray.length;i++) {
            	var file = fileArray[i];
            	//console.log(file);
	            if (!file) {
	                console.log('未选择上传文件');
	                return;
	            }
	            //判断图片文件的格式
	            if(file.type == 'image/jpg' || file.type == 'image/gif' || file.type == "image/png" ||file.type == 'image/jpeg' ){
	            	file && uploadFile(file, function (err, data) {
		                console.log(err || data);
		                console.log(err ? err : ('上传成功，url=' + data.url));
		                
		                var str_url = (data.url).substr( (data.url).indexOf(".com/")+5 );
		                if (img1_ref == "") {
		                      img1_ref = arr_imgRef[0] = str_url;     
	                    }else if(img1_ref != "" && img2_ref == ""){
		                       img2_ref = arr_imgRef[1] = str_url;     
	                    }else if(img1_ref != "" && img2_ref != "" && img3_ref == ""){
	                           img3_ref = arr_imgRef[2] = str_url; 
	                    } 
		                
		                tem++; 
		            });		
	            }
		            
            }
            
        };
        
        // 监听表单提交      提交参考附件
        document.getElementById('uploadAccessory_designer_order').onchange = function (e) {
            var file = document.getElementById('uploadAccessory_designer_order').files[0];
            if (!file) {
                console.log('未选择上传文件');
                return;
            }
            file && uploadFile(file, function (err, data){
                //console.log(err || data);
                console.log(err ? err : ('上传成功，url=' + data.url));
                var str_url = (data.url).substr( (data.url).indexOf(".com/")+5 );
	            acc_ref = str_url;
	            up_service_state = 1; 
            });
        };
        
        
        
        // 监听表单提交  设计效果图上传与提交
        var temp = 0;
        document.getElementById('scheme_upload_pic_orderDetail').onchange = function (e) {
            var fileArray = document.getElementById('scheme_upload_pic_orderDetail').files;
            
            for (var i=0; i<fileArray.length;i++) {
            	var file = fileArray[i];
            	//console.log(file);
	            if (!file) {
	                console.log('未选择上传文件');
	                return;
	            }
	            if(file.type == 'image/jpg' || file.type == 'image/gif' || file.type == "image/png" ||file.type == 'image/jpeg' ){
	            	file && uploadFile(file, function (err, data) {
		                //console.log(err || data);
		                console.log(err ? err : ('上传成功，url=' + data.url));
		                var str_url_sch = (data.url).substr( (data.url).indexOf(".com/")+5 );
		                 if (img1_sch == "") {
		                     img1_sch = arr_imgSch[0] = str_url_sch;
	                     }else if(img1_sch != "" && img2_sch == ""){
		                      img2_sch = arr_imgSch[1] = str_url_sch;     	
	                     }else if(img1_sch != "" && img2_sch != "" && img3_sch == ""){
	                          img3_sch = arr_imgSch[2] = str_url_sch; 		
	                     }  
		                
		                temp++; 
		            });
	            }
		            	
            }
            ///designImg_orderDetail designAccessory_orderDetail
            
        };
        
        // 监听表单提交    设计方案附件的上传与提交
        document.getElementById('upload_accessory_scheme_orderDetail').onchange = function (e) {
            var file = document.getElementById('upload_accessory_scheme_orderDetail').files[0];
            if (!file) {
                console.log('未选择上传文件');
                return;
            }
            file && uploadFile(file, function (err, data) {
                //console.log(err || data);
                console.log(err ? err : ('上传成功，url=' + data.url));
                var str_url = (data.url).substr( (data.url).indexOf(".com/")+5 );
	            acc_sch = str_url;
            });
        }; 
        
        // 客服自行上传设计图     提交
       var ad_ser = 0;
        document.getElementById('uploadPic_service').onchange = function (e) {
            var fileArray = document.getElementById('uploadPic_service').files;
            
            for ( i=0; i<3;i++) {
            	var file = fileArray[i];
	            if (!file) {
	                console.log('未选择上传文件');
	                return;
	            	}
	            if(file.type == 'image/jpg' || file.type == 'image/gif' || file.type == "image/png" ||file.type == 'image/jpeg' ){
		            file && uploadFile(file, function (err, data) {
		                //console.log(err || data);
		                console.log(err ? err : ('上传成功，url=' + data.url));
		                var str_url = (data.url).substr( (data.url).indexOf(".com/")+5 );
		                arr_new_service[ad_ser] = str_url;
		                ad_ser++;   
		            });
		        }
            }
            
        };
        
        // 客服自行上传附件   并  提交
        document.getElementById('uploadAccessory_service').onchange = function (e) {
            var file = document.getElementById('uploadAccessory_service').files[0];
            var accessoryUrl_newOrder = "";
            if (!file) {
                console.log('未选择上传文件');
                return;
            }
            file && uploadFile(file, function (err, data) {
                //console.log(err || data);
                console.log(err ? err : ('上传成功，url=' + data.url));
                var str_url = (data.url).substr( (data.url).indexOf(".com/")+5 );
                //$.cookie("accessoryUrl_newOrder", str_url );
                acc_new_service = str_url;
                up_service_state = 1;
            });
        };
        
    })($);


 



