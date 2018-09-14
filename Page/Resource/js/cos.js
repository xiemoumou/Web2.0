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
		/*// 指定要下载到的本地路径
		File downFile = new File("src/test/resources/mydown.txt");
		// 指定要下载的文件所在的 bucket 和路径
		GetObjectRequest getObjectRequest = new GetObjectRequest(bucketName, key);
		ObjectMetadata downObjectMeta = cosClient.getObject(getObjectRequest, downFile);*/
		
		
		//以下为 自己写的 与实际业务相关的代码
        // 监听表单提交  参考图提交
        var tem = 0;
        document.getElementById('order_uploadpic_file').onchange = function (e) {
            var fileArray = document.getElementById('order_uploadpic_file').files;
            
            
            for (var i=0; i<fileArray.length;i++) {
            	var file = fileArray[i];
	            if (!file) {
	                console.log('未选择上传文件');
	                return;
	            }
	            file && uploadFile(file, function (err, data) {
	                //console.log(err || data);
	                console.log(err ? err : ('上传成功，url=' + data.url));
	                
	                var str_url = (data.url).substr( (data.url).indexOf(".com/")+5 );
	                arr_imgRef[tem] = str_url;
	                tem++; 
	            });	
            }
            
        };
        
        // 监听表单提交    参考附件提交
        document.getElementById('upload_accessory_file').onchange = function (e) {
            var file = document.getElementById('upload_accessory_file').files[0];
            if (!file) {
                console.log('未选择上传文件');
                return;
            }
            file && uploadFile(file, function (err, data){
                //console.log(err || data);
                console.log(err ? err : ('上传成功，url=' + data.url));
                var str_url = (data.url).substr( (data.url).indexOf(".com/")+5 );
	            acc_ref = str_url;
            });
        };
        
        // 监听表单提交  设计效果图上传与提交
        var temp = 0;
        document.getElementById('scheme_upload_pic_orderDetail').onchange = function (e) {
            var fileArray = document.getElementById('scheme_upload_pic_orderDetail').files;
            
            for (var i=0; i<fileArray.length;i++) {
            	var file = fileArray[i];
	            if (!file) {
	                console.log('未选择上传文件');
	                return;
	            }
	            file && uploadFile(file, function (err, data) {
	                //console.log(err || data);
	                console.log(err ? err : ('上传成功，url=' + data.url));
	                var str_url_sch = (data.url).substr( (data.url).indexOf(".com/")+5 );
	                arr_imgSch[temp] = str_url_sch;
	                temp++; 
	            });	
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
    })($);