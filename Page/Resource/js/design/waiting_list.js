/* 待接单 */
var _sortCode=0;//排序方式
var waiting_list = {
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
        waiting_list.getUrl = parent.Common.getUrl();//获取请求接口的URL
        waiting_list.getDataInterface = parent.Common.getDataInterface();//获取请求数据的接口
        waiting_list.functionalInterface = parent.Common.functionalInterface();//获取操作功能的接口
        //waiting_list.commonObj = parent.Common;//获取common工具类对象
        waiting_list.userInfo = parent.Main.userInfo;//获取用户信息

        waiting_list.setListContainerHeight();//设置列表容器得高度跟随浏览器大小变化
        window.onresize = function () {
            waiting_list.setListContainerHeight();
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
            if (data[2].num > 0) {
                reddot.css({'top': "0px", "height": "20px"});
                reddot.html(data[2].num);
            }
        });
        //设置红点数值end

        waiting_list.getDataList(that.pagePrams.curIndex);//加载数据
    },
    initPage: function () {//初始化分页插件
        var that=this;
        if (waiting_list.pagePrams.isInit > 0)
            return;
        waiting_list.pagePrams.isInit = 1;
        $(".page-box").html("");
        $(".page-box").append($("<div id=\"pagination\" class=\"page fl\"></div>"));
        $("#pagination").pagination({
            currentPage: waiting_list.pagePrams.curIndex,
            totalPage: waiting_list.pagePrams.totalPage,
            isShow: true,
            count: waiting_list.pagePrams.pageSize,
            homePageText: "首页",
            endPageText: "尾页",
            prevPageText: "上一页",
            nextPageText: "下一页",
            callback: function (currIndex) {
                that.pagePrams.curIndex=currIndex;//分页保持
                sessionStorage.setItem('pageIndex',currIndex);//分页保持
                waiting_list.getDataList(currIndex);
            }
        });
    },
    getDataList: function (currIndex,sortCode) {
        if(typeof sortCode!= "undefined")
        {
            _sortCode=sortCode;
        }
        var url = waiting_list.getUrl["order"] + waiting_list.getDataInterface["waiting-list"];//获取待接单接口地址
        var cosImgUrl = waiting_list.getUrl["cosImgUrl"];
        //请求数据
        //waiting_list.commonObj.ajax(url, {
        Common.ajax(url, {
                "userid": waiting_list.userInfo.userid,
                "token": waiting_list.userInfo.token,
                "roletype": waiting_list.userInfo.roletype,
                "workflow": 1,
                "searchday": 30,
                "fromtime": "2016",
                "totime": "2018",
                "ordernumofsheet": waiting_list.pagePrams.pageSize,
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

                    waiting_list.pagePrams.curIndex = currIndex;//当前页码
                    waiting_list.pagePrams.totalPage = Math.ceil(dataList.totalnum / waiting_list.pagePrams.pageSize);//共多少页
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

                        btn = "<button class=\"rob\" onclick=\"parent.Main.robbery('" + orderId + "','" + customid + "',waiting_list.robbery)\">立即抢单</button>";
                        var detialbtn = "<a class=\"desc\" href=\"javascript:parent.Main.demandDetails('" + orderId + "','" + customid + "')\">需求详情</a>";

                        var detiHead = $(" <div class=\"head\"><span class=\"date\">" + orderDate + "</span><span class=\"ordNum\">订单号: " + orderId + "</span>" + detialbtn + "</div>");

                        //var detiBody = $("<div class=\"body\"><ul><li><a class=\"img\" href=\"javascript:parent.Main.designDraft('" + orderId + "','" + customid + "');\"><img alt=\"图片\" onerror=\"this.src='../../images/images/mr.png'\" src=\"" + cosImgUrl + imageSrc + "\" /></a></li><li><span class=\"describe\">" + goodsclass + " " + texturename + " " + accessoriesname + " </br> " + shape + " " + technology + " " + color + "</span></li><li><span class=\"size\">" + l + "mm＊" + w + "mm＊" + h + "mm</span></li><li><span class=\"money\">¥" + designprice + "</span></li><li><span class=\"day\">--</span></li><li>" + btn + "</li></ul></div>");
                        var detiBody = $("<div class=\"body\"><ul><li><a class=\"img\" href=\"javascript:parent.Main.demandDetails('" + orderId + "','" + customid + "');\"><img alt=\"图片\" onerror=\"this.src='../../images/images/mr.png'\" src=\"" + cosImgUrl + imageSrc + "\" /></a></li><li><span class='name'>" + goodsclass + "</span></span></li><li><span class=\"describe\"> " + texturename + " " + accessoriesname + " </br> " + shape + " " + technology + " " + color + "</span></li><li><span class=\"size\">" + l + "＊" + w + "＊" + h + "</span></li><li><span class=\"money\">¥" + designprice + "</span></li><li><span class=\"day\">--</span></li><li><span class=\"status\">" + item.state.designstate.msg + "</span></li><li>" + btn + "</li></ul></div>");

                        detial.append(detiHead);
                        detial.append(detiBody);
                        orderList.append(detial);
                    });
                }
                waiting_list.initPage();
            });
    },
    setListContainerHeight: function () {//设置列表容器的高度
        var winH = window.innerHeight;
        if (winH) {
            winH -= 175;
        }
        $(".order").css("height", winH + "px");
    },
    robbery: function (url, requestData) { //抢单

        Common.ajax(url, requestData,
            true,
            function (data) {
                if (!data) {
                    return false;
                }
                Common.msg(data.status.msg, 200);
                setTimeout(function () {
                    window.location.reload(true);
                }, 1000);
            }
        );
    }
};


//初始化
$(function () {
    waiting_list.init();
    //排序样式切换

    $(".sort ul li").on('click',function () {
        var pageInfo= $("#pagination").pagination("getPage");
        $("#pagination").pagination("setPage", 1,pageInfo.total);
        waiting_list.pagePrams.curIndex=1;
        sessionStorage.setItem('pageIndex',waiting_list.pagePrams.curIndex);//分页保持

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
            waiting_list.getDataList(waiting_list.pagePrams.curIndex,0);//加载数据
        }else if(Thname ==2){
            //console.log(attr);
            if (attr==0){
                $(this).attr("attribute","1");
                waiting_list.getDataList(waiting_list.pagePrams.curIndex,2);

            }else if(attr==1){
                $(this).attr("attribute","0");
                waiting_list.getDataList(waiting_list.pagePrams.curIndex,1);
            }
        }else if(Thname ==3){
            if (attr==0){
                $(this).attr("attribute","1");
                waiting_list.getDataList(waiting_list.pagePrams.curIndex,4);

            }else if(attr==1){
                $(this).attr("attribute","0");
                waiting_list.getDataList(waiting_list.pagePrams.curIndex,3);
            }
        }else if(Thname ==4){
            if (attr==0){
                $(this).attr("attribute","1");
                waiting_list.getDataList(waiting_list.pagePrams.curIndex,6);

            }else if(attr==1){
                $(this).attr("attribute","0");
                waiting_list.getDataList(waiting_list.pagePrams.curIndex,5);
            }
        }


        window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();

    });
});