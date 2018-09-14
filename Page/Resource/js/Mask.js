// //研发环境
// var url = "http://192.168.1.150:8084";
// var cosurl='test-1255653994';

// //正式环境
// var url = "http://118.126.116.76:8084";
// var cosurl='resource-1255653994';

//预发布环境
var url = "http://119.27.172.55:8084";
var cosurl='resource-1255653994';

//上传图片img的变量名
var imgas1;
var imgas2;
var imgas3;
var imgas4;
var imgas4;
//psd格式的变量名
var imgps1;
var imgps2;
var imgps3;
var imgps4;
var imgps5;
var success;
var parent;

var n = 1;
//统计上传几行
var s = 0;
//用来计算图片的数量
var mas = 0;

var totalPage,
    paGes,
    liId,  //类型代码
    searchVal = "";//搜索的内容
var userid = $.cookie("userid");


//动态生成分页的方法----START------
//var totalPage;
function pageFun(num) {

    var str_page = '<li>首页</li><li>上一页</li>';
    var startNum = 1;
    var length = 8;
    var endNum = 8;
    //totalPage = paGes;
//			console.log(num);
    if (totalPage == 0) {

    } else if (totalPage <= 8 && totalPage >= 1) {
        //$("div.page_workstage").show();
        endNum = totalPage;
        startNum = 1;

        for (var i = startNum; i <= endNum; i++) {
            if (i == num) {
                str_page += '<li class="active1">' + i + '</li>';
            } else {
                str_page += '<li>' + i + '</li>';
            }
            //console.log(i);
        }
        ;
        str_page += '<li id="bott">下一页</li><li>末页</li>';
        $("ul.paging_ul").html(str_page);

    } else if (totalPage > 8) {
        //$("div.page_workstage").show();
        if (num == 1) {
            endNum = 8;
        } else if (num > 7) {
            if (num <= totalPage - length) {
                startNum = num - 2;
                endNum = endNum + num - 1;
            } else {
                startNum = totalPage - 7;
                endNum = totalPage;
            }
        }
        for (var i = startNum; i <= endNum; i++) {
            if (i == num) {
                str_page += '<li class="active">' + i + '</li>';
            } else {
                str_page += '<li>' + i + '</li>';
            }
            //console.log(i);
        }
        ;
        str_page += '<li>下一页</li><li>末页</li>';
        $("ul.paging_ul").html(str_page);
//					console.log($("ul.paging_ul"))
    }
}

//时间方法
function resource() {
    var mydate = new Date(),
        year = mydate.getFullYear(),
        month = mydate.getMonth() + 1,
        day = mydate.getDate(),
        hour = mydate.getHours(),
        mint = mydate.getMinutes(),
        secd = mydate.getSeconds();
    if (month <= 9) {
        month = "1" + month;
    }
    if (day <= 9) {
        day = "1" + day;
    }
    if (hour <= 9) {
        hour = "1" + hour;
    }
    if (mint <= 9) {
        mint = "1" + mint;
    }
    if (secd <= 9) {
        secd = "1" + secd;
    }
    var str_ran = (Math.random() * 2).toString(30).substr(2);
    return "resource/" + day + "-" + hour + mint + secd + str_ran;
}


//页面左侧列表产品类型
$.ajax({
    type: "post",
    url: url + "/zb-manager-web/resource/getResourceType.do",
    async: true,
    dataType: "json",
    success: function (res) {
        console.log(res)
        console.log(res.code)
        var liId = $(".uls il").attr("data-id");
        for (var i = 0; i < res.list.length; i++) {
            $(".uls").append('<li id=' + res.list[i].id + '>' + res.list[i].name + '</li>');
            $(".drop").append('<option value=' + res.list[i].id + '>' + res.list[i].name + '</option>');
        }
        $(".uls li").eq(0).hide();

    }
});


//当该元素加载完成，绑定事件
$(document).on("click", "#uls li", function () {
    liId = $(this).attr("id");
//					   	console.log(liId)
    $(this).addClass("active1").siblings().removeClass("active1");
    //Lists();

    console.log(liId)
    if (liId > 0) {
        $("#notex").val(liId);
        searchVal = "";
        liId = liId;
        setTimeout(function () {
            Inpsearch(1,true);
        }, 100);

    } else {
//							$("#notex").text("")
    }

//						console.log(res.code)

})


//左侧列表点击时加载列表详情的数据
function Lists() {

    var liId = $("#notex").val();

    $.ajax({
        type: "post",
        url: url + "/zb-manager-web/resource/getResourceList.do",
        async: true,
        data: {
            "resourceType": liId,
        },
        success: function (res) {
            $(".cont_ul").html("")
            console.log(res)

            for (var i = 0; i < res.list.length; i++) {

                $(".cont_ul").append('<li class="cont_ul_li"><div class="cont_li_box">'
                    + '<img src=' + res.list[i].thumbnailUrl + ' id=' + res.list[i].id + ' />'
                    + '<div class="cont_box_son">'
                    + '<i class="icon iconfont icon-xiazai" data-id=' + res.list[i].id + ' data-uploader=' + res.list[i].uploader + ' onclick="load(this)"></i>'
                    + '<i class="icon iconfont  icon-fangda" data-id=' + res.list[i].id + ' data-uploader=' + res.list[i].uploader + ' data-url=' + res.list[i].thumbnailUrl + ' onclick="enlarge(this)"></i></div></div>'
                    + '<p>' + res.list[i].resourceTitle + '</p></li>');
                console.log(res.list[i].resourceTitle);

            }
            c
        }

    });

};

//********搜索按钮查询*******
//            var searchVal;
$("#search").click(function () {
//          	alert($("cont_ul_li").attr("id"))
    liId = null;
    searchVal = $("#searchCon").val();//搜索的内容
    Inpsearch(1,true);

})
//             搜索框同步回车键搜索
$('#searchCon').bind('keypress', function (event) {
    if (event.keyCode == "13") {
        $("#search").click();
    }
})





//点击下载显示
var imgId;
var imgSrc;
var pText;
function load(this_) {
    //素材id
    imgId = $(this_).attr("data-id");
    //获取上传人id
    uploader = $(this_).attr("data-uploader");
    //获取img的src路径
    var i_fileInfo= $(this_).next();
    imgSrc=$(i_fileInfo).attr('data-url');
    var url = encodeURI('./resourceDownload.html?id='+imgId+"&uploader="+uploader+"&imgsrc="+imgSrc);
    layer.open({
        type: 2,
        title: '资源下载',
        shadeClose: false,
        shade: 0.1,
        area: ['840px', '515px'],
        content: url
    });
}

//下载缩略图
function Download(this_) {
    var winimg = $(this_).attr("data-url");
    var dataId = $(this_).attr("data-id");
    console.log(winimg, dataId);
    window.open(winimg);

    $.ajax({
        type: "post",
        url: url + "/zb-manager-web/resource/downloadCount.do",
        async: true,
        data: {
            "id": dataId,
        },
        success: function (res) {
            console.log(res)
        },
    });

};
//点击下载矢量图
function Downloadr(this_) {
    var winpsimg = $(this_).attr("data-url");
    console.log(winpsimg);
    window.open(winpsimg);
    var dataId = $(this_).attr("data-id");
    $.ajax({
        type: "post",
        url: url + "/zb-manager-web/resource/downloadCount.do",
        async: true,
        data: {
            "id": dataId,
        },
        success: function (res) {
            console.log(res)
        },
    });
}
//点击下载隐藏
function cuowu() {
    $(".back_box").hide();
    $(".download").hide();
}

//点击大图预览图片
function enlarge(this_) {
    $(".bigimg").css('display', 'block');
    $(".back_box").css('display', 'block');
    $(".download").css('display', 'none');
//           	$(".big_imga").attr('src', 'images/images/bg_t.png');
    imgId = $(this_).attr("data-id");
    imgUrl = $(this_).attr("data-url");
    var uploader = $(this_).attr("data-uploader");
    $(".bigimg img").attr("src", "")
    var imgsting = '<img src=' + imgUrl + ' alt="" class="big_imga"/>';
    $(".bigimg").append(imgsting);

}
function out() {
    $(".bigimg").css('display', 'none');
    $(".back_box").css('display', 'none');
}
//           $(".out").click(function() {
//           	$(".bigimg").css('display', 'none');
//           });

//点击上传资源按钮
$("#shang").click(function () {
    var url = encodeURI('./upload.html')
    layer.open({
        type: 2,
        title: '资源库上传',
        shadeClose: false,
        shade: 0.1,
        area: ['416px', '564px'],
        content: url
    });
});

function upIfreamHeight(val) {
    $("iframe").css('height', val + "px");
}
//蒙版的高度等同于页面的高度
var allHeight = Math.max(document.documentElement.scrollHeight, document.documentElement.clientHeight) + "px";
document.getElementById("11a").style.height = allHeight;

//上传本地图片
function Mode(va, vb) {
    var result = document.getElementById(va);
    var input = document.getElementById(vb);
    //  console.log(1)
    if (typeof FileReader === 'undefined') {
        result.innerHTML = "抱歉，你的浏览器不支持 FileReader";
        input.setAttribute('disabled', 'disabled');
    } else {
        input.addEventListener('change', readFile, false);
    }
    function readFile() {
        //用来计算上传图片的数量
        s++;

        var file = this.files[0];
        if (!/image\/\w+/.test(file.type)) {
            alert("请确保文件为图像类型");
            return false;
        }
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (e) {
            //alert(3333)
            //alert(this.result);
//             			result.innerHTML = '< img src="'+this.result+'" alt=""/>'
            var img = document.createElement("img")
//           			var div = document.createElement("div")
//           			alert(ids)
            img.src = this.result;
            img.setAttribute("id", "imgs");
//           			img.bind(onclick)
            result.appendChild(img);
//           			console.log(result.innerHTML)
        }
    }
}
Mode("result", "input");
//           Mode("result1", "input1");
//           Mode("result2", "input2");
//           Mode("result3", "input3");
//           Mode("result4", "input4");


//           删除图片按钮
$(".scbox").mouseover(function () {
    if (this.getElementsByTagName("img").length) {
        $(".scbox img").mouseover(function () {
            $(".del_tu").css("display", "block")
        });
    } else {
        $(".del_tu").css("display", "none")
    }
})

//			 $(".del_tu").mouseover(function(){
//			 	$(".del_tu").css("display","block");
//			 	$(".del_tu").mouseout (function(){
//			 			$(".del_tu").css("display","none")
//			 		})
//			 })

//           删除功能
document.getElementById("del_tu").onclick = function () {
    document.getElementById("imgs").remove();
    s = s - 1;
    console.log(n)
}

//			上传psd格式按钮
function fbb(val, valb) {
    $(function () {
        $(val).on("change", "input[type='file']", function () {
            var filePath = $(this).val();
            if (filePath.indexOf("") + 1) {
                var arr = filePath.split('\\');
                var fileName = arr[arr.length - 1];
                $(valb).html(fileName);
            } else {
                alert("上传格式错误")
                return false
            }
        })
    });
}

fbb(".input-fileup1", ".showFileName1");
fbb(".input-fileup2", ".showFileName2");
fbb(".input-fileup3", ".showFileName3");
fbb(".input-fileup4", ".showFileName4");
fbb(".input-fileup5", ".showFileName5");


//cos 的方法
(function ($) {
    
    $(".myWorkstage").on("click",function () {
        window.location.href = '../workbench.html';
    });
    
    var userid = $.cookie('phone');
    if (userid == "null" || !userid) {
        top.window.location.href = './Member/login.html';//如果userid没有拿到则退出系统
    }

    // 请求用到的参数
    var Bucket = cosurl;
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


    // ***********************上传文件************************
    var uploadFile = function (file, callback) {
        var fname = file.name;
        var filetype = fname.substr(fname.indexOf("."));

        var Key = resource() + filetype;
//            console.log(filetype, Key);
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


    //n代表的是次数，imgas代表五个上传框的url


    //这是第一个添加图片按钮
    $("input#input").change(function (e) {
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
            imgas1 = data.url;

        })
        mas = 0;
    });


    //第一个ps上传
    $("input#imgps").change(function (e) {
        var fileArray = $("input#imgps")[0].files;
//          console.log(fileArray);
        mas = 1;
        var file = fileArray[0];
        if (!file) {
            console.log('未选择上传文件');
            return;
        }
        file && uploadFile(file, function (err, data) {
            console.log(err || data);
            console.log(err ? err : ('上传成功，url=' + data.url));
            imgps1 = data.url;
        })
        mas = 0;
    });

    //第二个ps上传
    $("input#imgps1").change(function (e) {
        var fileArray = $("input#imgps1")[0].files;
//          console.log(fileArray);
        /*for (var i=0; i<fileArray.length;i++) {
         var file = fileArray[i];
         }*/
        mas = 1;
        var file = fileArray[0];
        if (!file) {
            console.log('未选择上传文件');
            return;
        }
        file && uploadFile(file, function (err, data) {
            console.log(err || data);
            console.log(err ? err : ('上传成功，url=' + data.url));
            imgps2 = data.url;
        })
        mas = 0;
    });


    n = String(n)
    var imgas = imgas + n;
    var imgps = imgps + n;

    //关闭
    $("button.close").click(function () {
        $("")
    });

    //上传方法
//       function abc(){
    $(".ck_upload").click(function () {

//			         	abc();
        resourceTitle = $(".idname").val();

//			         })

        var intxt = document.getElementById("inpTxt").value;
        if (intxt == "") {
            alert("请输入完整的内容")
            return;
        }


        if (mas == 1) {
            alert("正在上传");
            return;
        }


        //首先div是以div1，div2，形式定义，随后我们需要获取到所有的div
        //然后定义一个变量来让他每次循环的时候加上这个变量来循环所有div里面的子元素
        var ooa = $("#div" + "" + n + "")

        var resourceTitle;//原图url
        var vectorgraphName;//矢量图url
        var userId;//用户Id
        var downloadPrice;//价格
        var labelContent;//标签
        var author;//作者
        var descDetail;
        // console.log("n第几次" + n)
        // console.log("s第几次" + s)
//       	var descDetail;//描述
//       	alert($("#div1 input").val())
        //获取div1下面所有的input。val
//           console.log($(ooa).children())
        $(ooa).children().each(function (index, element) {


            //来进行判断他下面的第几个子元素然后赋值给变量
            if (index == 1) {
                resourceTitle = $(element).val()
//	         		console.log(resourceTitle)
            } else if (index == 2) {
                vectorgraphName = $(element).val()
//	         		console.log(vectorgraphName)
            } else if (index == 3) {
                userId = $(element).val()
//	         		console.log(userId)
            } else if (index == 4) {
                downloadPrice = $(element).val()
//	         		console.log(downloadPrice)
            } else if (index == 5) {
                labelContent = $(element).val()
//	         		console.log(labelContent)
            } else if (index == 6) {
                author = $(element).val()
//	         		console.log(author)
            } else if (index == 7) {
                descDetail = $(element).val();
//       			console.log(descDetail)
            }
            ;


        });

        var imgas;
        var imgps;
        //判断图片是否重复添加
        //让他的imgas或者imgps每次判断的时候等于不一样的值
        if (n == 1) {
            imgas = imgas1;
        } else if (n == 2) {
            imgas = imgas2;
        } else if (n == 3) {
            imgas = imgas3;
        } else if (n == 4) {
            imgas = imgas4;
        } else if (n == 5) {
            imgas = imgas5;
        }
        ;
        if (n == 1) {
            imgps = imgps1;
        } else if (n == 2) {
            imgps = imgps2;
        } else if (n == 3) {
            imgps = imgps3;
        } else if (n == 4) {
            imgps = imgps4;
        } else if (n == 5) {
            imgps = imgps5;
        }
        ;
        // console.log(imgas);
        // console.log(imgps);
        //来获取所有下拉列表的val
        var resourceType = $(ooa).children("select").select(true).val();
//       	  console.log(resourceType)
//       	  $("#div1 ).val()
        $.ajax({
            type: "post",
            url: url + "/zb-manager-web/resource/uploadResource.do",
            async: true,
            data: {
                "thumbnailUrl": imgas,
                "vectorgraphUrl": imgps,
                "resourceTitle": resourceTitle,
                "vectorgraphName": vectorgraphName,
                "userId": userid,
                "downloadPrice": downloadPrice,
                "labelContent": labelContent,
                "author": author,
                "descDetail": descDetail,
                "resourceType": resourceType,
            },
            success: function (res) {
//		         		console.log(res)
                //让n每次++，也就是让#div1后面这个结尾++从而来循环所有的div
                n++;
                //如果你<=s的话就会调用这个函数来执行函数里面的操作
                if (n <= s) {
                    abc();
                } else {
                    //否则就调用以下
                    wind();
                }
            }
        });
//       }
    })

    //点击完上传按钮之后重新加载这个页面并且调用这个方法
    function wind() {
        window.location.href = 'resource.html';
        details(1);
    }

    //页面加载时执行上传事件ajax
    $(document).ready(function () {
        //details()//执行函数
//			     Nlist();
        Inpsearch(1,true);
    });


    //**************************列表详情页******************************
    //var pase = 1;
    function details(pase) {
        var that = this;
        //pase = data;
        str_url = url + "/zb-manager-web/resource/getResourceList.do";
        $.ajax({
            type: "post",
            url: str_url,
            async: true,
            data: {
                "page": pase,
            },
            success: function (res) {
                //console.log(res)

                $(".cont_ul").html("")
                for (var i = 0; i < res.list.length; i++) {
                    $(".cont_ul").append('<li class="cont_ul_li" data-id=' + res.pages + '>'
                        + '<div class="cont_li_box"><img src=' + res.list[i].thumbnailUrl + ' id=' + res.list[i].id + '/>'
                        + '<div class="cont_box_son">'
                        + '<i class="icon iconfont icon-xiazai" data-id=' + res.list[i].id + ' data-uploader=' + res.list[i].uploader + ' onclick="load(this)"></i>'
                        + '<i class="icon iconfont  icon-fangda" data-id=' + res.list[i].id + ' data-uploader=' + res.list[i].uploader + ' data-url=' + res.list[i].thumbnailUrl + '  onclick="enlarge(this)"></i>'
                        + '</div></div>'
                        + '<p>' + res.list[i].resourceTitle + '</p></li>')
                }
//				    console.log(res.pages)
                paGes = res.pages;
                pages = res.page

                pageFun(pase);
                totalPage = paGes;
                $("#noText").val(pages);
//					console.log(pages)
            }
        });
    };
})($);

function Refresh() {
    window.location.reload();
}

var resource={
    pagePrams: { 'curIndex': 1, 'totalPage': 1, 'pageSize': 5, 'isInit': -1 },//分页参数
    initPage: function (isInitPage) {//初始化分页插件
        var that=this;
        if(isInitPage)
        {
            that.pagePrams.isInit=-1;
            that.pagePrams.curIndex=1;
        }
        if (that.pagePrams.isInit > 0)
            return;
        that.pagePrams.isInit = 1;
        $(".page-box").html("");
        $(".page-box").append($("<div id=\"pagination\" class=\"page fl\"></div>"));
        $("#pagination").pagination({
            currentPage: that.pagePrams.curIndex,
            totalPage: that.pagePrams.totalPage,
            isShow: true,
            count: that.pagePrams.pageSize,
            homePageText: "首页",
            endPageText: "尾页",
            prevPageText: "上一页",
            nextPageText: "下一页",
            callback: function (currIndex) {
                that.pagePrams.curIndex=currIndex;//分页保持
                //sessionStorage.setItem('pageIndex',currIndex);//分页保持
                Inpsearch(currIndex);
            }
        });
    },
};


//搜索列表需要展示的内容
function Inpsearch(noText,isInitPage) {

    Common.ajax(url + "/zb-manager-web/resource/getResourceList.do",{
        "resourceType": liId,
        "searchContent": searchVal,
        "page": noText,
    },true,function (res) {

        $(".cont_ul").html("")
        var code = res.code;

        if (code == 1002) {
            //页面没有资源是显示的图片及文字
            $(".paging_ul").html("");
            $(".cont_ul").html('<div class="noorder_workstage">'
                + '<div><p><img src="images/icon/bj_ico.jpg" /></p>'
                + '<p style="color: #858585">您还没有相关素材！</p></div></div>');
        } else {
            //$(".cont_right").html("");
            $(".cont_ul").html("");
            if (res.list) {


                for (var i = 0; i < res.list.length; i++) {
                    if (true) {
                        //截取图片名称
                        var title=res.list[i].resourceTitle && res.list[i].resourceTitle.length>10?res.list[i].resourceTitle.substring(0,10):res.list[i].resourceTitle;
                        $(".cont_ul").append('<li class="cont_ul_li"><div class="cont_li_box" >'
                            + '<img src=' + res.list[i].thumbnailUrl + ' id=' + res.list[i].id + '  onerror="this.src=\'./images/images/mr.png\'"/>'
                            + '<div class="cont_box_son">'
                            + '<i class="icon iconfont icon-xiazai" data-id=' + res.list[i].id + ' data-uploader=' + res.list[i].uploader + ' onclick="load(this)"></i>'
                            + '<i class="icon iconfont  icon-fangda" data-id=' + res.list[i].id + ' data-uploader=' + res.list[i].uploader + ' data-url=' + res.list[i].thumbnailUrl + ' onclick="enlarge(this)"></i></div></div>'
                            + '<p>' + title + '</p></li>');
                        //						           console.log(res.list[i].resourceTitle);
                    }
                }


            }

            totalPage = res.pages;//总页数
            var pagge = res.page;//当前页

            resource.pagePrams.totalPage=totalPage;
            resource.initPage(isInitPage);

        }
    });
};

