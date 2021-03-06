//已取消订单
var _sortCode=0;//排序方式
var cancelled = {
    getUrl: {},//请求接口的URL
    getDataInterface: {},//请求数据的接口
    functionalInterface: {},//操作功能的接口
    //commonObj: {},//Common工具类
    userInfo: {},//用户信息
    pagePrams: {'curIndex': 1, 'totalPage': 1, 'pageSize': 5, 'isInit': -1},//分页参数
    init: function () {//初始化
        var that=this;
        //分页保持
        if(sessionStorage.getItem('pageIndex'))
        {
            that.pagePrams.curIndex=parseInt(sessionStorage.getItem('pageIndex'));
        }
        cancelled.getUrl = parent.Common.getUrl();//获取请求接口的URL
        cancelled.getDataInterface = parent.Common.getDataInterface();//获取请求数据的接口
        cancelled.functionalInterface = parent.Common.functionalInterface();//获取操作功能的接口
        //cancelled.commonObj = parent.Common;//获取common工具类对象
        cancelled.userInfo = parent.Main.userInfo;//获取用户信息

        cancelled.setListContainerHeight();//设置列表容器得高度跟随浏览器大小变化
        window.onresize = function () {
            cancelled.setListContainerHeight();
        }

        //点击空白隐藏搜索下拉菜单或个人中心下拉菜单
        $(window).click(function () {
            if (parent.Main.currentClickObj) {
                $(parent.Main.currentClickObj).hide();
                parent.Main.currentClickObj = null;
            }
        })

        //设置红点数值
        var reddot = $(".tab #tabmode i.reddot");
        reddot.css({'top': "14px", "height": "3px"});
        parent.Main.redDot(function (data) {
            if (data[7].num > 0) {
                reddot.css({'top': "0px", "height": "20px"});
                reddot.html(data[7].num);
            }
        });
        //设置红点数值end

        cancelled.getDataList(that.pagePrams.curIndex);//加载数据

    },
    initPage: function () {//初始化分页插件
        var that=this;
        if (cancelled.pagePrams.isInit > 0)
            return;
        cancelled.pagePrams.isInit = 1;
        $(".page-box").html("");
        $(".page-box").append($("<div id=\"pagination\" class=\"page fl\"></div>"));
        $("#pagination").pagination({
            currentPage: cancelled.pagePrams.curIndex,
            totalPage: cancelled.pagePrams.totalPage,
            isShow: true,
            count: cancelled.pagePrams.pageSize,
            homePageText: "首页",
            endPageText: "尾页",
            prevPageText: "上一页",
            nextPageText: "下一页",
            callback: function (currIndex) {
                that.pagePrams.curIndex=currIndex;//分页保持
                sessionStorage.setItem('pageIndex',currIndex);//分页保持
                cancelled.getDataList(currIndex);
            }
        });
    },
    getDataList: function (currIndex,sortCode) {
        if(typeof sortCode!= "undefined")
        {
            _sortCode=sortCode;
        }
        var url = cancelled.getUrl["order"] + cancelled.getDataInterface["cancelled"];//获取全部订单接口地址
        var cosImgUrl = cancelled.getUrl["cosImgUrl"];
        //请求数据
        //cancelled.commonObj.ajax(url, {
        Common.ajax(url, {
                "userid": cancelled.userInfo.userid,
                "token": cancelled.userInfo.token,
                "roletype": cancelled.userInfo.roletype,
                "workflow": 1,
                "searchday": 30,
                "fromtime": "2016",
                "totime": "2018",
                "ordernumofsheet": cancelled.pagePrams.pageSize,
                "ordersheet": currIndex,
                "ranktype": 1,
                "inorder": 0,
                "mark": _sortCode,
                "rushorders": 1
            },
            true,
            function (data) {
                if (data) {
                    var dataList = data.ordersummary;
                    var status = data.status;
                    var userInfo = data.userinfo;
                    //如果没数据则跳出
                    if (!dataList) {
                        return false;
                    }

                    cancelled.pagePrams.curIndex = currIndex;//当前页码
                    cancelled.pagePrams.totalPage = Math.ceil(dataList.totalnum / cancelled.pagePrams.pageSize);//共多少页
                    var orderList = $("#orderList");
                    orderList.html("");
                    $.each(dataList.orderarray, function (i, item) {
                        var orderDate = item.orderinfo.createtime;
                        var orderId = item.orderinfo.orderid;
                        var imageSrc = item.orderinfo.goodsimage;
                        var accessoriesname = item.goodsinfo.accessoriesname;//蝴蝶扣
                        var texturename = item.goodsinfo.texturename;//锌合金
                        var goodsclass = item.orderinfo.goodsclass;//"徽章"
                        var shape = item.goodsinfo.shape;//"2D;"
                        var technology = item.goodsinfo.technology;//"柯氏;"
                        var color = item.goodsinfo.color;
                        var customid = item.orderinfo.customid;

                        var l = item.goodsinfo.size.length;
                        var w = item.goodsinfo.size.width;
                        var h = item.goodsinfo.size.height;

                        var designprice = item.price.designprice;//设计费
                        var orderstate = item.state.orderstate.orderstate;

                        var detial = $("<div id=\"order_" + orderId + "\" class=\"detial\"> </div>");
                        var btn = "";
                        //btn = "<button class=\"rob\" onclick=\"parent.Main.designDraft('" + orderId + "','" + customid + "');\" >修改设计</button><a class=\"desc\" href=\"javascript:parent.Main.designDraft('" + orderId + "','" + customid + "');\">查看反馈</a>";

                        var detiHead = $(" <div class=\"head\"><span class=\"date\">" + orderDate + "</span><span class=\"ordNum\">订单号: " + orderId + "</span></div>");

                        var detiBody = $("<div class=\"body\"><ul><li><a class=\"img\" href=\"javascript:parent.Main.designDraft('" + orderId + "','" + customid + "');\"><img alt=\"图片\" onerror=\"this.src='../../images/images/mr.png'\" src=\"" + cosImgUrl + imageSrc + "\" /></a></li><li><span class=\"describe\">" + goodsclass + " " + texturename + " " + accessoriesname + " </br> " + shape + " " + technology + " " + color + "</span></li><li><span class=\"size\">" + l + "mm＊" + w + "mm＊" + h + "mm</span></li><li><span class=\"money\">¥" + designprice + "</span></li><li><span class=\"day\">--</span></li><li>" + btn + "</li></ul></div>");

                        detial.append(detiHead);
                        detial.append(detiBody);
                        orderList.append(detial);
                    });
                }
                cancelled.initPage();
            });
    },
    setListContainerHeight: function () {//设置列表容器的高度
        var winH = window.innerHeight;
        if (winH) {
            winH -= 175;
        }
        $(".order").css("height", winH + "px");
    }
};


//初始化
$(function () {
    cancelled.init();
    //排序样式切换
    $(".sort ul li").on('click',function () {
        var pageInfo= $("#pagination").pagination("getPage");
        $("#pagination").pagination("setPage", 1,pageInfo.total);
        cancelled.pagePrams.curIndex=1;
        sessionStorage.setItem('pageIndex',cancelled.pagePrams.curIndex);//分页保持
        
        var Thisval = $(this).val();
        var Thname  = $(this).attr("name");
        var attr = $(this).attr("attribute");
        $(this).siblings("li").removeClass("addstyle");
        $(this).addClass("addstyle");
        if (Thisval ==1){
            $(this).parents().find("span img").attr("src","../../images/icon/bottom_icon.png");
            $(this).siblings("li").attr("attribute","0");
            if($(this).hasClass("peg")){
                $(this).find("span img").attr("src","../../images/icon/top_icon.png");
                $(this).removeClass("peg");
                $(this).siblings("li").addClass("peg");
            }else {
                $(this).find("span img").attr("src","../../images/icon/bottom_icon_white.png");
                $(this).addClass("peg");
            }
        }else if(Thisval ==2){
            $(this).parents().find("span img").attr("src","../../images/icon/bottom_icon.png");
            $(this).siblings("li").addClass("peg");
            $(this).siblings("li").attr("attribute","0");
        }

        if(Thname ==1){
            cancelled.getDataList(cancelled.pagePrams.curIndex,0);//加载数据
        }else if(Thname ==2){
            //console.log(attr);
            if (attr==0){
                $(this).attr("attribute","1");
                cancelled.getDataList(cancelled.pagePrams.curIndex,2);

            }else if(attr==1){
                $(this).attr("attribute","0");
                cancelled.getDataList(cancelled.pagePrams.curIndex,1);
            }
        }else if(Thname ==3){
            if (attr==0){
                $(this).attr("attribute","1");
                cancelled.getDataList(cancelled.pagePrams.curIndex,4);

            }else if(attr==1){
                $(this).attr("attribute","0");
                cancelled.getDataList(cancelled.pagePrams.curIndex,3);
            }
        }else if(Thname ==4){
            if (attr==0){
                $(this).attr("attribute","1");
                cancelled.getDataList(cancelled.pagePrams.curIndex,6);

            }else if(attr==1){
                $(this).attr("attribute","0");
                cancelled.getDataList(cancelled.pagePrams.curIndex,5);
            }
        }


        window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();

    });
});