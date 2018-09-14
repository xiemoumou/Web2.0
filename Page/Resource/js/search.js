//搜索订单
var search = {
    getUrl: {},//请求接口的URL
    getDataInterface: {},//请求数据的接口
    functionalInterface: {},//操作功能的接口
    //commonObj: {},//Common工具类
    userInfo: {},//用户信息
    pagePrams: { 'curIndex': 1, 'totalPage': 1, 'pageSize': 5, 'isInit': -1 },//分页参数
    init: function () {//初始化
        search.getUrl = parent.Common.getUrl();//获取请求接口的URL
        search.getDataInterface = parent.Common.getDataInterface();//获取请求数据的接口
        search.functionalInterface = parent.Common.functionalInterface();//获取操作功能的接口
        //search.commonObj = parent.Common;//获取common工具类对象
        search.userInfo = parent.Main.userInfo;//获取用户信息

        search.setListContainerHeight();//设置列表容器得高度跟随浏览器大小变化
        window.onresize = function () {
            search.setListContainerHeight();
        }

        //点击空白隐藏搜索下拉菜单或个人中心下拉菜单
        $(window).click(function () {
            if (parent.Main.currentClickObj) {
                $(parent.Main.currentClickObj).hide();
                parent.Main.currentClickObj = null;
            }
        })

        //设置红点数值
        var al_i = $("#al_i");
        var dcl_i = $("#dcl_i");
        al_i.css({ 'top': "14px", "height": "3px" });
        dcl_i.css({ 'top': "14px", "height": "3px" });
        parent.Main.redDot(function (data) {
            if (data[0].num > 0) {
                al_i.css({ 'top': "0px", "height": "20px" });
                al_i.html(data[0].num);
            }

            if (data[1].num > 0) {
                dcl_i.css({ 'top': "0px", "height": "20px" });
                dcl_i.html(data[1].num);
            }
        });
        //设置红点数值end

        var searchType=Common.getUrlParam('type');
        var searchValue=Common.getUrlParam('value',true);
        search.getDataList(1,searchValue,searchType);//搜索数据

    },
    initPage: function () {//初始化分页插件
        if (search.pagePrams.isInit > 0)
            return;
        search.pagePrams.isInit = 1;
        $(".page-box").html("");
        $(".page-box").append($("<div id=\"pagination\" class=\"page fl\"></div>"));
        $("#pagination").pagination({
            currentPage: search.pagePrams.curIndex,
            totalPage: search.pagePrams.totalPage,
            isShow: true,
            count: search.pagePrams.pageSize,
            homePageText: "首页",
            endPageText: "尾页",
            prevPageText: "上一页",
            nextPageText: "下一页",
            callback: function (currIndex) {
                search.getDataList(currIndex);
            }
        });
    },
    getDataList: function (currIndex, searchContent) {
        var url = search.getUrl["order"] + search.getDataInterface["search"];//搜索订单接口地址
        var cosImgUrl=search.getUrl["cosImgUrl"];
        //请求数据
        //search.commonObj.ajax(url, {
        Common.ajax(url, {
            "userid": search.userInfo.userid,
            "token": search.userInfo.token,
            "roletype": search.userInfo.roletype,
            "orderid": searchContent
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

                        // var btn = "";
                        //
                        // //按钮状态判断
                        // if (orderstate == 2) {//待接单
                        //     btn = "<button class=\"rob\" onclick=\"parent.Main.robbery('" + orderId + "','" + customid + "',search.robbery)\">立即抢单</button><a class=\"desc\" href=\"javascript:parent.Main.demandDetails('" + orderId + "','" + customid + "')\">需求详情</a>";
                        // }
                        // else if (orderstate == 5) {//待设计
                        //     btn = "<button class=\"rob\" onclick=\"parent.Main.designDraft('" + orderId + "','" + customid + "');\" >修改设计</button><a class=\"desc\" href=\"javascript:parent.Main.designDraft('" + orderId + "','" + customid + "');\">查看反馈</a>";
                        // }
                        //
                        // var detiHead = $(" <div class=\"head\"><span class=\"date\">" + orderDate + "</span><span class=\"ordNum\">订单号: " + orderId + "</span></div>");
                        //
                        // var detiBody = $("<div class=\"body\"><ul><li><a class=\"img\" href=\"javascript:parent.Main.designDraft('" + orderId + "','" + customid + "');\"><img alt=\"图片\" onerror=\"this.src='../images/images/mr.png'\" src=\"" + cosImgUrl + imageSrc + "\" /></a></li><li><span class=\"describe\">" + goodsclass + " " + texturename + " " + accessoriesname + " </br> " + shape + " " + technology + " " + color + "</span></li><li><span class=\"size\">" + l + "mm＊" + w + "mm＊" + h + "mm</span></li><li><span class=\"money\">¥" + designprice + "</span></li><li><span class=\"day\">--</span></li><li>" + btn + "</li></ul></div>");

                        var btn = "";
                        var detialbtn="";
                        //按钮状态判断
                        
                        if (item.state.designreceivestate.code == 0) {//待接单
                            btn = "<button class=\"rob\" onclick=\"parent.Main.robbery('" + orderId + "','" + customid + "',search.robbery)\">立即抢单</button>";
                            detialbtn = "<a class=\"desc\" href=\"javascript:parent.Main.demandDetails('" + orderId + "','" + customid + "')\">需求详情</a>";
                            imgClick="href=\"javascript:parent.Main.demandDetails('" + orderId + "','" + customid + "')\"";
                        }
                        else if (orderstate == 5) {//待设计
                            btn = "<button class=\"rob\" onclick=\"parent.Main.designDraft('" + orderId + "','" + customid + "');\" >修改设计</button>";
                            detialbtn = "<a class=\"desc\" href=\"javascript:parent.Main.designDraft('" + orderId + "','" + customid + "');\">查看反馈</a>";
                            imgClick="href=\"javascript:parent.Main.designDraft('" + orderId + "','" + customid + "')\"";
                        }
                        else if (item.state.designstate.code==0||item.state.designstate.code==1||item.state.designstate.code==3)
                        {
                            btn = "<button class=\"rob\" onclick=\"parent.Main.designDraft('" + orderId + "','" + customid + "');\" >提交设计</button>";
                            detialbtn = "<a class=\"desc\" href=\"javascript:parent.Main.designDraft('" + orderId + "','" + customid + "')\">需求详情</a>";
                            imgClick="href=\"javascript:parent.Main.designDraft('" + orderId + "','" + customid + "')\"";
                        }
                        else
                        {
                            //console.error("请检查");
                            detialbtn="<a class=\"desc\" href=\"javascript:parent.Main.designDraft('" + orderId + "','" + customid + "')\">需求详情</a>";
                        }

                        var detiHead = $(" <div class=\"head\"><span class=\"date\">" + orderDate + "</span><span class=\"ordNum\">订单号: " + orderId + "</span>"+detialbtn+"</div>");

                        var detiBody = $("<div class=\"body\"><ul><li><a class=\"img\" href=\"javascript:parent.Main.designDraft('" + orderId + "','" + customid + "');\"><img alt=\"图片\" onerror=\"this.src='../images/images/mr.png'\" src=\"" + cosImgUrl + imageSrc + "\" /></a></li><li><span class='name'>"+goodsclass+"</span></span></li><li><span class=\"describe\"> " + texturename + " " + accessoriesname + " </br> " + shape + " " + technology + " " + color + "</span></li><li><span class=\"size\">" + l + "＊" + w + "＊" + h + "</span></li><li><span class=\"money\">¥" + designprice + "</span></li><li><span class=\"day\">--</span></li><li><span class=\"status\">"+item.state.designstate.msg+"</span></li><li>" + btn + "</li></ul></div>");


                        detial.append(detiHead);
                        detial.append(detiBody);
                        orderList.append(detial);
                    });
                }
                //search.initPage();
            });
    },
    setListContainerHeight: function () {//设置列表容器的高度
        var winH = window.innerHeight;
        if (winH) {
            winH -= 142;
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

                Common.msg(data.status.msg,data.status.code==1?200:null,2000,function () {
                    window.location.reload();
                });
            }
        );
    }
};


//初始化
$(function () {
    search.init();
});