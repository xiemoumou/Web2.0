//COS 上传方法
// 请求用到的参数
//var Bucket = 'test-1255653994';  //开发环境

var Bucket='resource-1255653994';  //预发布 或 线上


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
var cosUploadFile = function (file, callback,docId,progressCallback,orderid) {
    if(!orderid){
        orderid="000000000000000"
    }
    orderid+="_";
    

    if(orderid=="Resource_") //如果是资源库则
    {
        orderid="";
    }


    var fname = file.name;
    var index=fname.indexOf(".");
    var filetype = index>0?fname.substr(index):"";
    var random = Math.random().toString().replace('.', '0');
    //获取cookie字符串
    var userId="";
    try{
        var strCookie=document.cookie;
        var arrCookie=strCookie.split("; ");
        for(var i=0;i<arrCookie.length;i++){
            var arr=arrCookie[i].split("=");
            if("userid"==arr[0]){
                userId=arr[1]+"_";
                break;
            }
        }
    }
    catch(e) {

    }

    var Key =/*userId+*/orderid+Common.getTimestamp() + random + filetype;
    //console.log(filetype, Key);
    getAuthorization({ Method: 'PUT', Key: Key }, function (err, auth) {
        var url = prefix + Key;
        var xhr = new XMLHttpRequest();
        xhr.open('PUT', url, true);
        xhr.setRequestHeader('Authorization', auth);

        xhr.upload.onprogress = function (evt) {
            if (evt.lengthComputable) {
                var percentComplete = Math.round(evt.loaded * 100 / evt.total);
                // document.getElementById('progress').value = percentComplete;
                // document.getElementById('progressNumber').style.width = percentComplete + "%";
                //console.log(percentComplete + "%");
                if(progressCallback)
                {
                    progressCallback(percentComplete,docId);
                }
            }
        };

        xhr.onload = function () {
            if (xhr.status === 200 || xhr.status === 206) {
                var ETag = xhr.getResponseHeader('etag');
                callback(null, { url: url, ETag: ETag },docId);
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