		//从cookie获取userid
		var userid = $.cookie("userid");
		var token = $.cookie("token");
		var roletype = $.cookie("roletype");
		
		//定义展开按钮的class每次加1
		var btn = 1;
		var ck_btn = 1;
		var flowText = 1;
		var n = 1;
		
		//定义上传图片附件的变量
		var imgas;
		//上传到本地显示图片的变量
		var imgurl = "";
		//定义滚动加载的页数
		var pase_num = 1;
		
		//设置input file 的上传信息和路径
		 $(function(){
            $(".input-fileup").on("change","input[type='file']",function(){
                var filePath=$(this).val();
                if(filePath.indexOf("jpg")!=-1 || filePath.indexOf("png")!=-1){
                    $(".fileerrorTip1").html("").hide();
                    var arr=filePath.split('\\');
                    var fileName=arr[arr.length-1];
                    $(".showFileName1").html(fileName);
                }else{
                    $(".showFileName1").html("");
                    $(".fileerrorTip1").html("您未上传文件，或者您上传文件类型有误！").show();
                    return false
                }
            })
        })
		
		//标题和内容框失去焦点和获取焦点添加的表框
		$("#theme").focus(function(){
			$("#theme").css("border","1px solid #3a8ecc")
		});
		$("#theme").blur(function(){
			$("#theme").css("border","1px solid ")
		});
		$(".domain").focus(function(){
			$(".domain").css("border","1px solid #3a8ecc")
		});
		$(".domain").blur(function(){
			$(".domain").css("border","1px solid ")
		});
	
		//限制文字数量
		function textLimitCheck(thisArea, maxLength) {
			if(thisArea.value.length > maxLength) {
				//					alert(maxLength + ' 个字限制. \r超出的将自动去除.');
				thisArea.value = thisArea.value.substring(0, 300);
				thisArea.focus();
			} /*回写span的值，当前填写文字的数量*/
			messageCount.innerText = thisArea.value.length;
		}

		var page = 1;
		var pageNum = 5;
		//渲染反馈列表
		$.ajax({
			type:"get",
			url:"http://192.168.1.150:8082/zb-manager-web/suggestion/viewlist.do",
			data:{
				"userid":userid,
				"roletype":roletype,
				"token":token,
				"commandcode":120,
				"page":page,
				"pageSize":pageNum,
			},
			success:function(res){
				console.log(res)
				for(var i=0;i<res.list.length;i++){
					console.log(res)
					var str = '<li class="content_li clearfix" id='+res.list[i].suggestionid+' >'
					+'<div class="portrait"><img src="images/images/073928257.jpg"/></div>'
		+'<div class="name_h clearfix">'
		+'<h4><b>'+res.list[i].title+'</b></h4>'
		+'</div><div class="content_txt clearfix">'
		+'<div id="flowText'+n+'" class="flowText">'+res.list[i].content+'<br/><img src="'+res.list[i].suggestaccessoryurl+'"  id="imgs"/>'
		+'</div>'
		+'<div class="data clearfix">'
		+'<div class="data_left">'
		+'<span>'+res.list[i].nickname+'</span><span>'+res.list[i].createtime+'</span><hr />'
		+'</div>'
		+'<div class="ck_btn'+n+'" id="ck_btn"style="display: block;">'
		+'<p class="btn'+n+'">展开</p><i id="icon'+n+'" class="icon iconfont icon-xialajiantou"></i></div>'
		+'<div class="data_right"><span onclick="suppnum(this)" data-id='+res.list[i].suggestionid+' ><i class="icon iconfont icon-dianzan3"></i>支持(<span>'+res.list[i].suppnum+'</span>)</span>'
		+'<span onclick="opponum(this)" data-id='+res.list[i].suggestionid+'><i class="icon iconfont icon-dianzan2"></i>支持(<span>'+res.list[i].opponum+'</span>)</span></div></div></div></li>';
		n++;
		$(".content_ul").append(str)
		
				}
			}
		});
		
		//支持按钮
		function suppnum(this_){
			suggestionid = $(this_).attr("data-id");
			console.log(suggestionid)
			$(this_).css("color","red");
			$(this_).find("i").css("color","red");
//			setTimeout(function(){
				$.ajax({
				type:"get",
				url:"http://192.168.1.150:8082/zb-manager-web/suggestion/thumbupset.do",
				async:true,
				data:{
					"userid":userid,
					"roletype":roletype,
					"token":token,
					"commandcode":122,
					"suggestionid":suggestionid,
					"operate":0,
				},
				success:function(res){
					console.log(res.status.code)
					if(res.status.code == 3){
						alert("亲     您今天已支持过了。")
					}
					
				}
			});
//			},500)
			
		}
		//反对支持按钮
		function opponum(this_){
			suggestionid = $(this_).attr("data-id");
			$(this_).css("color","red")
			$.ajax({
				type:"get",
				url:"http://192.168.1.150:8082/zb-manager-web/suggestion/thumbupset.do",
				async:true,
				data:{
					"userid":userid,
					"roletype":roletype,
					"token":token,
					"commandcode":122,
					"suggestionid":suggestionid,
					"operate":1,
				},
				success:function(res){
					console.log(res)
				}
			});
		}

		//时间函数文件后缀名拼接保证每个路径不一致
			function resource() {
				var mydate = new Date(),
					year = mydate.getFullYear(),
					month = mydate.getMonth() + 1,
					day = mydate.getDate(),
					hour = mydate.getHours(),
					mint = mydate.getMinutes(),
					secd = mydate.getSeconds();
				if(month <= 9) {
					month = "1" + month;
				}
				if(day <= 9) {
					day = "1" + day;
				}
				if(hour <= 9) {
					hour = "1" + hour;
				}
				if(mint <= 9) {
					mint = "1" + mint;
				}
				if(secd <= 9) {
					secd = "1" + secd;
				}
				var str_ran = (Math.random() * 2).toString(30).substr(2);
				return "resource/" + day + "-" + hour + mint + secd + str_ran;
			}

		//5秒倒计时返回首页
		
		function Time(){
		$(function(){
			  var countDownTime=parseInt(5);    //在这里设置每道题的答题时长
			  function countDown(countDownTime){
			    var timer=setInterval(function(){
			      if(countDownTime>=0){
			        showTime(countDownTime);
			        countDownTime--;
			        
			      }else{
			        clearInterval(timer);
			        window.location.href='feednack.html';
			      }
//			      document.write(countDownTime)
			    },1000);
			  }
			  countDown(countDownTime);
			  function showTime(countDownTime){      //这段是计算分和秒的具体数
			    var minute=Math.floor(countDownTime/60);
			    var second=countDownTime-minute*60;
			    $("#countDownTime").text(+second);
			  }
			})
}

//			//图片附件上传到服务器
//			function getImgURL(node) {
//				var imgURL = "";
//				try {
//					var file = null;
//					if(node.files && node.files[0]) {
//						file = node.files[0];
//					} else if(node.files && node.files.item(0)) {
//						file = node.files.item(0);
//					}
//					//Firefox 因安全性问题已无法直接通过input[file].value 获取完整的文件路径  
//					try {
//						//Firefox7.0   
//						imgURL = file.getAsDataURL();
//						//alert("//Firefox7.0"+imgRUL);                           
//					} catch(e) {
//						//Firefox8.0以上                                
//						imgRUL = window.URL.createObjectURL(file);
//						//alert("//Firefox8.0以上"+imgRUL);  
//					}
//				} catch(e) {
//					//这里不知道怎么处理了，如果是遨游的话会报这个异常
//					//支持html5的浏览器,比如高版本的firefox、chrome、ie10  
//					if(node.files && node.files[0]) {
//						var reader = new FileReader();
//						reader.onload = function(e) {
//							imgURL = e.target.result;
//						};
//						reader.readAsDataURL(node.files[0]);
//					}
//				}
//				//imgurl = imgURL;  
//				creatImg(imgRUL);
//				console.log(imgRUL)
//				return imgURL;
//			}
//
//			function creatImg(imgRUL) {
//				//根据指定URL创建一个Img对象
//				var textHtml = "<img src='" + imgRUL + "'/>";
//				$("#mark").html(textHtml);
//				console.log(imgRUL)
//			
//}
			

			//      cos的上传方法        	
			(function($) {
				// 请求用到的参数
				var Bucket = 'test-1255653994'; //'resource-1255653994'
				var Region = 'ap-chengdu';
				var protocol = location.protocol === 'https:' ? 'https:' : 'http:';
				var prefix = protocol + '//' + Bucket + '.cos.' + Region + '.myqcloud.com/';

				// 计算签名
				var getAuthorization = function(options, callback) {
					// 方法一（适用于前端调试）
					var method = (options.Method || 'get').toLowerCase();
					var key = options.Key || '';
					var pathname = key.indexOf('/') === 0 ? key : '/' + key;
					var url = 'http://119.27.172.55/auth.php?method=' + method + '&pathname=' + encodeURIComponent(pathname);
					var xhr = new XMLHttpRequest();
					xhr.open('GET', url, true);
					xhr.onload = function(e) {
						callback(null, e.target.responseText);
					};
					xhr.onerror = function(e) {
						callback('获取签名出错');
					};
					xhr.send();

				};

				// ***********************上传文件************************
				var uploadFile = function(file, callback) {
					var fname = file.name;
					var filetype = fname.substr(fname.indexOf("."));

					var Key = resource() + filetype;
					//            console.log(filetype, Key);
					getAuthorization({
						Method: 'PUT',
						Key: Key
					}, function(err, auth) {
						var url = prefix + Key;
						var xhr = new XMLHttpRequest();
						xhr.open('PUT', url, true);
						xhr.setRequestHeader('Authorization', auth);
						xhr.onload = function() {
							if(xhr.status === 200 || xhr.status === 206) {
								var ETag = xhr.getResponseHeader('etag');
								callback(null, {
									url: url,
									ETag: ETag
								});
							} else {
								callback('文件 ' + Key + ' 上传失败，状态码：' + xhr.status);
							}
						};
						xhr.onerror = function() {
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

				//n代表的是次数，imgas代表五个上传框的url

				//这是第一个添加图片按钮
//				$("input#file").change(function(e) {
				$("input#input").change(function(e){
			var fileArray = $("input#input")[0].files;
            console.log(fileArray);
            /*for (var i=0; i<fileArray.length;i++) {
            	var file = fileArray[i];
            	}*/
            	
            	//mas是不可以上图片上传重复
            	mas = 1;
            	var file = fileArray[0];
	            if (!file) {
	                console.log('未选择上传文件');
	                return;
	            }
	            file && uploadFile(file, function (err, data) {
	                console.log(err || data);
	                console.log(err ? err : ('上传成功，url=' + data.url));
	                imgas = data.url;
	               
	            })
	         mas = 0;
		});
				

					//提交意见反馈
		$("#submit").click(function(){
			//获取title的文本内容
					var title = $("#theme").val();
					//获取意见框的内容
					var content = $(".domain").val();
					//img
					console.log(imgas)
					
//					进行判断不能为空
					if($("#theme").val() == "") {
						alert("请输入主题内容");
						return;
					} else if($("#theme").val().length >= 16) {
						alert("标题内容过长请规定在15位内")
						return;
					} else if($(".domain").val() == "") {
						alert("请填写反馈内容")
						return;
					};
					
					//获取图片名称
//					var fp = $("#file");
//				    var lg = fp[0].files.length; // get length
//				    var items = fp[0].files;
//				    var fragment = "";
//				     
//				    if (lg > 0) {
//				        for (var i = 0; i < lg; i++) {
//				            var fileName = items[i].name; // get file name
//				            var fileSize = items[i].size; // get file size 
//				            var fileType = items[i].type; // get file type
//				 
//				 			console.log(fileName)
//				            // append li to UL tag to display File info
//				//          fragment += "<li>" + fileName  + "</li>";
//				        }
//				 
//				//      $("#ulList").append(fragment);
//				//      console.log(fragment)
//				    }
//				    console.log(imgas)
					//*************提交意见反馈***********
					$.ajax({
						type: "get",
						url: "http://192.168.1.150:8082/zb-manager-web/suggestion/submit.do",
						data: {
							"userid": userid,
							"token": token,
							"commandcode": 121,
							"roletype": roletype,
							"title": title,
							"content": content,
//							"fileName":fileName,
							"suggestaccessoryurl":imgas,
						},
						success: function(res) {
//							console.log(res.status.code);
							var code = res.status.code;
							console.log(imgas)
							console.log(code)
							if(code == 0){
								$("#content_box").hide();
								$("#feed").hide();
								$("#succ").show();
								//判断如果成功就调用反馈成功页面倒计时函数
								Time();
							}else if(code == 1){
								alert("发表意见失败")
							}else if(code == 2){
								alert("抱歉您还没有访问权限")
							}
							
						}
					});
		})
		

	})($);
		//返回顶部
		