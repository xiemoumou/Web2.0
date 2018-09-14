// //研发
var url_manager = "http://192.168.1.150:8082";

// //正式
//var url_manager = "http://118.126.116.76:8081";

//预发布
// var url_manager = "http://119.27.172.55:8081";

var totalPage = 0,
	img1_reply = "",
	img2_reply = "",
	img3_reply = "",
	taskid = "";
/* 页面开始加载，立即执行 */
$(function(){
	var userid = $.cookie("userid");	
		token = $.cookie("token"),			
	    roletype = $.cookie('roletype'),
		pagenum = 1,
		total = 1,
		histask = [];
	
	
	console.log(token, roletype, userid);
	//获取左侧导航区
	$.ajax({
		type:"get",
		url: url_manager+"/zb-manager-web/workflow/show.do",					
		data:{
			"userid": userid,
			"token": token,
			"roletype": parseInt(roletype)
						
		},
		dataType: "json",
		success: function(res){
    		//console.log(res);    		
    		   	   		
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
		/*"workflow": 1,
		"searchday": 30,
		"fromtime": "2016",
		"totime": "2018",
		"ordernumofsheet": 5,
		"ordersheet": 2,
		"ranktype": 1,			
		"inorder": 0*/
	/*http://192.168.1.150:8082/zb-manager-web/page/doneTaskList.do*/
	//请求待处理任务的内容列表
	$.ajax({
		type:"get",
		url: url_manager+"/zb-manager-web/page/unDoneTaskList.do",					
		data:{
			"userId": userid,
			"token": token,
			"roleType": roletype,
			"currentPage": pagenum						
		},
		dataType: "json",
		success: function(res){
			console.log(res.taskinfo);
			if ( res.status.code == 0) {
				$("em.todealTaskNum").text(res.taskinfo.todealnum);
				$("em.historyTaskNum").text(res.taskinfo.historynum);
				histask = res.taskinfo.todealtask;//historytask
				//console.log(histask);
				var str_histask = '';
				for(var i=0;i<histask.length;i++){
					str_histask += '<tr><td class="task_title">'+histask[i].taskinfo
							+'</td><td>'+histask[i].orderid
							+'</td><td>'+histask[i].tasksendername
                            +'</td><td class="graycolor">'+histask[i].taskperiod
                            +'</td><td class="graycolor">'+histask[i].tasksendtime
                            +'</td><td data-taskId="'+histask[i].taskid
                            +'" data-user="" class="taskBtn">查看任务</td></tr>';
				};
				$("table.order_all").html(str_histask);
			} else{
				
			}				
		}
	});
});

$(document).ready(function(){
	var userid = $.cookie("userid"),	
		token = $.cookie("token"),			
		roletype = $.cookie('roletype');
		
	//点击 待处理任务  或  历史任务
	$(document).on("click","p.overview_task",function(e){
		var e = e || window.event;
		var Url = "",
			pagenum = 1,
			histask = [];
		$(e.target.parentNode).addClass("borderRed").siblings().removeClass("borderRed");
		var txt = e.target.innerText;		
		/*var reg = /^[\u4e00-\u9fa5]+$/;*/
		txt = txt.replace(/[^\u4e00-\u9fa5]/gi,"");
		
		switch (txt){
			case "待处理任务":
				Url = "/zb-manager-web/page/unDoneTaskList.do";
				break;
			case "历史任务":
				Url = "/zb-manager-web/page/doneTaskList.do";
				break;	
			default:
				break;
		};
		console.log(txt);
		$.ajax({
			type:"get",
			url: url_manager+Url,					
			data:{
				"userId": userid,
				"token": token,
				"roleType": roletype,
				"currentPage": pagenum						
			},
			dataType: "json",
			success: function(res){
				console.log(res);
				if ( res.status.code == 0) {
					if (res.taskinfo.todealtask ) {  //判断如果有待处理任务
						histask = res.taskinfo.todealtask; //historytask
						console.log(histask);
						var str_histask = '';
					for(var i=0;i<histask.length;i++){
						str_histask += '<tr><td class="task_title">'+histask[i].taskinfo
								+'</td><td>'+histask[i].orderid
								+'</td><td>'+histask[i].tasksendername
	                            +'</td><td class="graycolor">'+histask[i].taskperiod
	                            +'</td><td class="graycolor">'+histask[i].tasksendtime
	                            +'</td><td data-taskid="'+histask[i].taskid
	                            +'" data-user="" class="taskBtn">查看任务</td></tr>';
					};
					$("table.order_all").html(str_histask);
					
				} else{
					histask = res.taskinfo.historytask;//
					console.log(histask);
					var str_histask = '';
					for(var i=0;i<histask.length;i++){
						str_histask += '<tr><td class="task_title">'+histask[i].taskinfo
								+'</td><td>'+histask[i].orderid
								+'</td><td>'+histask[i].tasksendername
	                            +'</td><td class="graycolor">'+histask[i].taskperiod
	                            +'</td><td class="graycolor">'+histask[i].tasksendtime
	                            +'</td><td data-taskId="'+histask[i].taskid
	                            +'" data-user="" class="taskBtn">查看任务</td></tr>';
					};
					$("table.order_all").html(str_histask);
				}
			///
			} else{}				
		}
	});		
});

    //点击查看任务，打开当前的任务
    $(document).on("click","td.taskBtn",function(){
    	
		var taskid = $(this).attr("data-taskid");
			pagenum = 1,
			total = 1;
			//customid = "12";
			
		console.log(userid, token, roletype);	
		$.ajax({
			type:"get",
			url: url_manager+"/zb-manager-web/order/lookTaskItem.do",					
			data:{
				"userid": userid,
				"token": token,
				"roletype": roletype,				
				"commandcode": 93,
				"taskid": taskid,
				//"customid": customid,
				"taskType": 0
			},
			dataType: "json",
			success: function(res){
				console.log(res);
				 
				//--------------BEGIN--动态生成导航目录----------------	
	    		var data_task = res;
	    		//命名空间
				var bt = baidu.template;
				var str_html = bt( 'baidu_taskDetail', data_task );
				//用百度模板渲染页面
				$("#task_content").html(str_html);
				//---------------END 动态生成导航目录------------------------
				var createTime = res.taskinfo.tasksendtime;
				var period = res.taskinfo.taskperiod;
				$("time.countdownTime").text( getTimeDown( createTime,period ) );  //countdownTime
				//任务截止期限倒计时 
			    setTimeout(function(){
			    	$(".countdownTime").countDown();
			    },1000);
				
			}
		})
    	
        $("div#task_content").show();
        
    });
    
    
    //zb-manager-web/task/writebackmsg.do?userid=10000039
	//&token=3333&roletype=1&commandcode=91
	//&operatecode=1&taskid=300001760521735002526
	//&taskinfo=哈哈哈哈&taskimageurl1= lwPW1gEWZ.png
	//&taskimageurl2=task/2LlwPW1gEWZ.png 
	
	//点击  任务回复   的  回复 按钮， 上传回复的信息  targetReply  任务回复
	$(document).on("click","strong.targetReplyBtn",function(){
		var taskid = $(this).parent().attr("data-taskid");
    	var taskTxt = $.trim($(this).parent().find("textarea").val());
    	$.ajax({
			type:"get",
			url: url_manager+"/zb-manager-web/task/writebackmsg.do",					
			data:{
				"userid": userid,
				"token": token,
				"roletype": roletype,				
				"commandcode": 91,
				"taskid": taskid,
				"operatecode": 1,
				"taskType": 0,
				"taskinfo": taskTxt,
				"taskimageurl1": img1_reply,
				"taskimageurl2": img2_reply,
				"taskimageurl3": img3_reply
			},
			dataType: "json",
			success: function(res){
				console.log(res);
				if (res.status.code == 0) {
					copyAlert(res.status.code);
				} else{
					
				}
			}
		});
    	
    });
	
	//点击  完成任务  按钮， 提交  完成任务  事件            finishworkinfo.do    "commandcode": 91,
	$(document).on("click","button.tasklist_completeBtn",function(){
		var taskid = $(this).parent().attr("data-taskid");
    	//var taskTxt = $.trim($(this).parent().children("textarea").val());
    	$.ajax({
			type:"get",
			url: url_manager+"/zb-manager-web/task/finishworkinfo.do",					
			data:{
				"userid": userid,
				"token": token,
				"roletype": roletype,				
				"taskid": taskid,
				"operatecode": 5
			},
			dataType: "json",
			success: function(res){
				console.log(res);
				if (res.status.code == 1) {
					copyAlert(res.status.msg);
					setTimeout(function(){
						closeAlert();
					},1500);
					$("div#task_content").hide();
				} else{
					
				}
			}
		});
    	
    });
    
    //点击查看任务中的关闭按钮，查看任务关闭
    $("i.icon-guanbi").click(function(){
        $("div#task_content").hide();
        setTimeout(function(){
        	location.reload();
        },200);
    });
    
    //点击完成任务按钮，发送数据，改变任务状态
    $("button.tasklist_completeBtn").click(function(){
        //向后台传送任务号和user
        /*$.ajax({
            
        });*/
        $("div#task_content").hide();
        $('div.task_evaluation').show();       
    });
    
    
            
    
    //点击   留言  按钮 ，  控制回复输入框的显示与隐藏
    $(document).on("click","button.replyshowBtn",function(){
    	//$("form.taskCont_reply").css({"display":"none"}); //所有
    	//setTimeout(function(){},100);
    		$(this).parent().next().toggle();
    		
         
      });
      
    /*获取当前节点输入文字的数量*/
    $(".reply_content").keyup(function(){
        $(this).next().find(".textnum").text( $(this).val().trim().length );
    });
    
   /* 当点击评价任务的确定按钮， */
    $(document).on("click","button.confirm_evaluation",function(){
       /*向后台发送评价的数据*/
      
       $('div.task_evaluation').hide();
   });
    /* 五角形评分  */
    /*$("span.span_style").raty({
        number: 5 ,
        half: true,
        starHalf: '../images/icon/star-half.svg',
        starOff: '../images/icon/star.svg',
        starOn: '../images/icon/star1.svg'
        
    });*/
    
    $("span.result_evaluation").raty({
        number: 5 ,        
        starOff: './images/icon/star.svg',
        starOn: './images/icon/star1.svg',
        /*score: 4,*/
        click: function(score, evt) {

            console.log("处理结果得分: " + score );

         }
        
    });
    
    $("span.speed_evaluation").raty({
        number: 5 ,        
        starOff: './images/icon/star.svg',
        starOn: './images/icon/star1.svg',
        /*score: 3,*/
        click: function(score, evt) {

        console.log(+ "处理速度得分: " + score );

        }
        
    });
    
    $("span.attitude_evaluation").raty({
        number: 5 ,        
        starOff: './images/icon/star.svg',
        starOn: './images/icon/star1.svg',
       /* score: 4,*/
        click: function(score, evt) {

        console.log("服务态度得分: " + score );

        }
    });
    
});

//$(window).load(function(){});
//$(function(){});  ===  $(document).ready(function(){});
$(function(){
	///点击  图片上的删除按钮， 删除该对应图片
	$(document).on("click","p.upload_float i",function(){
		var $parent = $(this).parent().parent(); 
		var num = $parent.attr("data-num");
        ($parent.children("img.upload_img")).attr("src", "").hide();
        ($parent.children("label")).show();
        ($parent.children("p")).hide();
        if( num == 1 ) {
        	img1_reply = "";
        }else if( num == 2 ) {
        	img2_reply = "";
        }else if( num == 3 ) {
        	img3_reply = "";
        }  
                       
    });
    
	//任务详情的  图片上传和预览的模块
    	$(document).on("change","input.upload_input",function(){
    		
            var flag = false,
	            $upload_label = $(this).parent(),
	            $upload_img = $upload_label.prev(),
	            $upload_float = $upload_label.next();
            
            //选择图片，马上预览
            function uploadImg(obj) {
                var file = obj.files[0];
                    flag = file.size <= 2048000 ? true : false ;
                
                if(flag){
                    var reader = new FileReader();

                    //读取文件过程方法
                    reader.onloadstart = function (e) {
                        //console.log("开始读取....");
                    }
                    reader.onprogress = function (e) {
                        //console.log("正在读取中....");
                    }
                    reader.onabort = function (e) {
                        console.log("中断读取....");
                    }
                    reader.onerror = function (e) {
                        //console.log("读取异常....");
                    }
                    reader.onload = function (e) {
                       //console.log(e.target.result,"1234");
                       $upload_img.attr("src", e.target.result).show();
					}
                    //解析图片内容
                    reader.readAsDataURL(file);                          
                };
            }    
                        
                	//调用函数            
                    uploadImg( $(this)[0] );
                    
                if(flag){ 
                   $upload_label.hide();
                     
                }
    })
    
    
});
//计算任务倒计时的方法
//startDate  任务创建的时间     period  任务的处理期限
//1、获取当前时间  ms	
//2、将创建时间  加上  任务的处理期限   转化为  ms
//3、
//
function getTimeDown(startDate,period){
			
	var myDate = new Date(),
		mydate = new Date( startDate ),
		mytime = myDate.getTime() - ( parseInt(period)*60*1000 ),  //当前时间  减去  处理期限
		mydate = Math.floor((mydate - mytime)/1000);		//
        sec = mydate%60;  //秒
        hour = Math.floor(mydate/3600); //小时
        min = Math.floor((mydate/60) - (hour*60)); //分
    //判断时间是否有效
    if(mydate >0){
    	if ( sec<=9 && sec>= 0) {
	    	sec = "0" + sec;
	    }/*else{
	    	sec = "" + sec;
	    }*/;
	    if ( min<=9 && min >=0 ) {
	    	min = "0" + min;
	    }/*else{
	    	min = "" + min;
	    }*/;
	    if ( hour<=9 &&hour >=0 ) {
	    	hour = "0" + hour;
	    }/*else{
	    	hour = "" + hour;
	    }*/;
	    //console.log(hour , min , sec);
	    if ((sec+"")=="NaN" || (min+"")=="NaN" || (hour+"")=="NaN") {
	    	//console.log(hour ,"11111", min , sec);
	    	return ;
	    }else{
	    	return 	hour +":"+ min +":"+ sec;
	    }
    }else{
    	return "00:00:00";
    }
	           
}

///定义分页方法      动态生成分页的方法----START------
function pageFun(num){
	
	var str_page = '<div><em>首页</em><em>上一页</em>';
	var startNum = 1;
	var length = 8;
	var endNum = 8;
	//var totalPage = parseInt($.cookie("totalPage"));
	//console.log(num);
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
				if(num == 1){
					endNum = 8;
				}else if(num > 3){
					if (num <= totalPage - length) {
						startNum = num-2;
						endNum = endNum + num - 1;
					}else{
						startNum = totalPage - 7;
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
			$("div.page_task").html(str_page);	
			
		}
	
}
//动态生成分页的方法----END------

//cos 的方法
    (function ($) {
        // 请求用到的参数
        var Bucket = 'test-1255653994';//'resource-1255653994'
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
        
    try{
    	$(document).on("change","input#uploadPic1_taskReply",function(e){
    		var fileArray = document.getElementById('uploadPic1_taskReply').files;
            var file = fileArray[0];
    			if(file.type == 'image/jpg' || file.type == 'image/gif' || file.type == "image/png" ||file.type == 'image/jpeg' ){
		            file && uploadFile(file, function (err, data) {
		                //console.log(err || data);
		                console.log(err ? err : ('上传成功，url=' + data.url));
		                var str_url = (data.url).substr( (data.url).indexOf(".com/")+5 );
		                img1_reply = str_url;
		                  
		            });
		        }
    	});
    	
        $(document).on("change","input#uploadPic2_taskReply",function(e){
    		var fileArray = document.getElementById('uploadPic2_taskReply').files;
            var file = fileArray[0];
    			if(file.type == 'image/jpg' || file.type == 'image/gif' || file.type == "image/png" ||file.type == 'image/jpeg' ){
		            file && uploadFile(file, function (err, data) {
		                //console.log(err || data);
		                console.log(err ? err : ('上传成功，url=' + data.url));
		                var str_url = (data.url).substr( (data.url).indexOf(".com/")+5 );
		                img2_reply = str_url;
		                  
		            });
		        }
    	});
    	
    	$(document).on("change","input#uploadPic3_taskReply",function(e){
    		var fileArray = document.getElementById('uploadPic3_taskReply').files;
            var file = fileArray[0];
    			if(file.type == 'image/jpg' || file.type == 'image/gif' || file.type == "image/png" ||file.type == 'image/jpeg' ){
		            file && uploadFile(file, function (err, data) {
		                //console.log(err || data);
		                console.log(err ? err : ('上传成功，url=' + data.url));
		                var str_url = (data.url).substr( (data.url).indexOf(".com/")+5 );
		                img3_reply = str_url;
		                  
		            });
		        }
    	});
    	
    }catch(e){
        	//TODO handle the exception
    }
        	
		

   })($);


        
            
