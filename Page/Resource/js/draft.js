//开始加载页面，就发起请求
$(function(){
	//获取session
	var userid = $.cookie('userid'), 
		token = $.cookie('token'),
		roletype = parseInt($.cookie('roletype'));
		//orderid = $.cookie('orderid');
		//goodsid = $.cookie('goodsid'),  //商品号
		//customid = $.cookie('customid'); //定制号
	//根据cookie发起请求，获取订单详情的具体内容
	$.ajax({
		type: "GET",
		url: "http://192.168.1.150:8082/zb-order-web/order/findDraftByPageInfo.do",
		data: {			
			"userId": userid,
			"currentPage": 1,
			"roletype": roletype,
			"token": token	
		},
		async: true,
		dataType: "JSON",
		success: function(res){
			/*console.log(res);*/
			if ( res.status.code == 0) {
				
				draft = res.orderinfo;
				/*console.log(res);*/
				$("span.allnum_draft").text("(共  "+ res.rownumber.totalnum +" 封)");
				var str_draft = '';
				for(var i=0;i<draft.length;i++){
					str_draft += '<tr><td><i class="icon iconfont icon-dvt-draft"></i>'
                        +'<em>'+draft[i].goodsname
                        +'</em></td><td>'+draft[i].customid
                        +'</td><td>'+ draft[i].createtime
                        +'</td><td><b data-draftid="'+draft[i].orderid+'" class="draft_edit">'
                        +'<i class="icon iconfont icon-bianji"></i><em>编辑</em>'
                        +'</b><b data-draftid="'+draft[i].orderid+'" class="draft_delete">'
                        +'<i class="icon iconfont icon-shanchu"></i><em>删除</em></b></td></tr>';
				};
				$("table.draft_box").append(str_draft);
				/*console.log(res.status.msg);*/
			} else{				
			}
												
		}
	})
});

$(document).ready(function(){
    //当点击 编辑 时，跳转至订单详情
    $(document).on("click","b.draft_edit",function(){
    	    	
        getOrderDetail();
        $.cookie("orderid", $(this).attr("data-draftid"));
    });
    
    //当点击 删除 时， 删除该条草稿，并传给后台
    $(document).on("click","b.draft_delete",function(){
                
        var userid = $.cookie('userid'), 
			token = $.cookie('token'),
			$this = $(this),
			roletype = parseInt($.cookie('roletype')),
			orderid = $this.attr("data-draftid");
		
		//orderid = $.cookie('orderid');
		//goodsid = $.cookie('goodsid'),  //商品号
		//customid = $.cookie('customid'); //定制号
		//根据cookie发起请求，获取订单详情的具体内容
		$.ajax({
			type: "GET",
			url: "http://192.168.1.150:8082/zb-order-web/order/deleteDraft.do",
			data: {			
				"userId": userid,
				"orderid": orderid,
				"roletype": roletype,
				"token": token	
			},
			async: true,
			dataType: "JSON",
			success: function(res){
				console.log(res);
				$this.parent().parent("tr").remove();
				if ( res.status.code == 0) {
					
					console.log(res.status.msg);
				}else{
				}
			}
		});
        
    });
});
