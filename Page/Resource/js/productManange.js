$(document).ready(function(){
	//click error-20170103 PIC , remove this type;
	$(document).on("click","i.icon-error-20170103",function(){				
			$(this).parent().remove();		
	});
	//click em(AttEditBtn),show div.relatedProduct_box 添加产品 属性   ;	
	$(document).on("click","em.AttEditBtn",function(){		    
			$(this).parent().parent().next(".relatedProduct_box").toggle();
		
	})
	//click button(addTextureBtn),add texture 添加材质
	$("button.addTextureBtn").each(function(){
		var $this = $(this);
		$this.click(function(){
			/* 出现输入框，输入材质名 */
			var str_p = $("<p>").addClass("addTexture_p").append($('<input placeholder="请输入材质名称"/>').addClass("addTexture_input"))
									.append($("<button>保存</button>").addClass("addTexture_button"));
			$("div.TextureContent").append(str_p);
			//输入框的保存按钮点击
			$("button.addTexture_button").click(function(){
				/* 获取输入的材质名 */
				var value_texture = $("input.addTexture_input").val();
				
				var str_texture = '<div class="product_box" data-texturenum="">'
	                +'<h4><span>'+ value_texture +'</span>'
	                +'<b class="retProduct_tip redcolor"><i class="icon iconfont icon-gantanhao"></i>未添加关联产品</b>'
	                +'<strong><em class="downLineBtn">下线</em><em class="AttEditBtn redcolor">编辑属性</em><em class="deleteProdBtn">删除</em></strong>'               		
	                +'</h4><div class="relatedProduct_box"><div><dl>'	                	    
		            +'<dt>产品</dt><dd><p class="typeBox">'
		            +'<span>徽章<i class="icon iconfont icon-error-20170103"></i></span>'
		            +'</p><button class="redcolor addProductBtn">'
		            +'<i class="icon iconfont icon-jiahao1"></i>添加产品'
		            +'</button></dd></dl><dl><dt>开模</dt><dd><p class="typeBox">'
		            +'<span>徽章<i class="icon iconfont icon-error-20170103"></i></span>'
		            +'</p><button class="redcolor addProductBtn">'
		            +'<i class="icon iconfont icon-jiahao1"></i>添加属性'
		            +'</button></dd></dl><dl><dt>电镀色</dt><dd><p class="typeBox">' 
		            +'<span>徽章<i class="icon iconfont icon-error-20170103"></i></span>'
		            +'</p><button class="redcolor addColorBtn">'
			        +'<i class="icon iconfont icon-jiahao1"></i>添加属性'
			        +'</button></dd></dl><dl><dt>工艺</dt><dd><p class="typeBox">'
		            +'<span>徽章<i class="icon iconfont icon-error-20170103"></i></span>'
		            +'</p><button class="redcolor addCraftBtn">'
			        +'<i class="icon iconfont icon-jiahao1"></i>添加属性'
			        +'</button></dd></dl><dl><dt>配件</dt><dd><p class="typeBox">'		                	
		            +'<span>徽章<i class="icon iconfont icon-error-20170103"></i></span>'		                					
		            +'</p><button class="redcolor addPartsBtn">'
			        +'<i class="icon iconfont icon-jiahao1"></i>添加属性'
			        +'</button></dd></dl><dl><dt>尺寸</dt><dd>'
		            +'<p class="typeBox addSize_content">'
		            +'<em>最小值:<b class="minLength"></b>*<b class="minWidth"></b>*'
		            +'<b class="minHeight"></b></em><em>最大值:<b class="maxLength"></b>*'
		            +'<b class="maxWidth"></b>*<b class="maxHeight"></b></em></p>'
		            +'<button class="redcolor addSizeBtn">'
			        +'<i class="icon iconfont icon-jiahao1"></i>添加属性'
			        +'</button></dd></dl></div></div></div>' ;
			    //将添加的str加入页面中   
				$("div.TextureContent").append(str_texture);
				//最后，移除输入框
				$(this).parent().remove();
			});
						
		});
	});
	//点击添加属性，出现添加属性框
	$(document).on("click","button.addTypeBtn",function(){
		var label_str = "";
		var data = ["徽章1","徽章美好"];
		if (data.length >= 1) {
			for (var i=0;i<data.length;i++) {
				label_str += '<label><input type="checkbox"/>'+data[i]+'</label>';
			}
		} else{
			
		}
		
		var add_str = '<h5 class="addAttrBox"><p>'
		        +'<input class="addAttr_inp" placeholder="请输入名称"/>'
		        +'<i class="icon iconfont icon-sousuo2"></i>'
		        +'</p><div class="addAttr_cont">'+ label_str 
		        +'</div><div class="addAttr_bggray">'
		        +'<button class="confirm_addAttr">确定</button>'
		        +'<button class="cancel_addAttr">取消</button>'
		        +'</div></h5>';
		$(this).parent().parent().append(add_str);
	});
	//点击添加新属性的确定按钮
	$(document).on("click","button.confirm_addAttr",function(){
		var $prev = $(this).parent().prev("div");
		var $parent = $prev.find(":checked").parent();
		/*console.log($parent.length);*/
		if($parent.length >=1){	
			var $span ='';
			for (var i =0;i< $parent.length;i++) {
				var txt = $parent[i].innerText;
				console.log(txt);			
				$span += '<span>'+ txt +'<i class="icon iconfont icon-error-20170103"></i></span>';			 
			}
			$prev.parent().prev("dd").children("p.typeBox").append($span);
		}		
	});
	//点击添加新属性的取消按钮
	$(document).on("click","button.cancel_addAttr",function(){
		$(this).parent().parent().remove();
	});
});
