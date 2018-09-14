//已取消订单---客服
var currentSelectObj = null;
var cancelled = {
    getUrl: {},//请求接口的URL
    getDataInterface: {},//请求数据的接口
    functionalInterface: {},//操作功能的接口
    //commonObj: {},//Common工具类
    userInfo: {},//用户信息
    pagePrams: { 'curIndex': 1, 'totalPage': 1, 'pageSize': 5, 'isInit': -1 },//分页参数
    request: function (data, callback, getDataInterface, functionalInterface) {
        var url = this.getUrl['order'];
        if (getDataInterface) {
            url += this.getDataInterface[getDataInterface];
        }
        if (functionalInterface) {
            url += this.functionalInterface[functionalInterface];
        }
        Common.ajax(url, data, true, callback, function (error) {
            //接口调用错误处理
        });
    },
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
        var reddot=$(".tab #tabmode i.reddot");
        reddot.css({'top':"14px","height":"3px"}).hide();
        parent.Main.redDot(function(data){
            if (data[12].num > 0) {
                reddot.css({ 'top': "0px", "height": "20px" });
                reddot.html(data[12].num).show();
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
    initPriceRuler: function(){
        var that=this;
        priceSlider.initSlideRuleOS({
            redCallback: function (item,scrollBar) {//定价
                that.request({
                    "orderid": $(item).attr("data-orderid"),
                    "userId": that.userInfo.userid,
                    "customid": $(item).attr("data-customid"),
                    "roleType": that.userInfo.roletype,
                    "token": that.userInfo.token,
                    "finalprice": parseInt($(item).find('.show-value .red-value').val()),
                    "designGuideFee": parseInt($(item).attr('guide-fee-value')),
                    "commandcode": 141
                }, function (data) {
                    if (data) {
                        Common.msg(data.status.msg, data.status.code == 0 ? 200 : "");
                        that.getDataList(all_order.pagePrams.curIndex);
                    }
                }, 'priceRuler', null);
            },
            blueCallback: function (item,scrollBar) {
                that.request({
                    "orderid": $(item).attr("data-orderid"),
                    "userId": that.userInfo.userid,
                    "customid": $(item).attr("data-customid"),
                    "roleType": that.userInfo.roletype,
                    "token": that.userInfo.token,
                    "designprice": parseInt($(item).find('.show-value .blue-value').val()),
                    "designGuideFee": parseInt($(item).attr('guide-fee-value')),
                    "commandcode": 141
                }, function (data) {
                    if (data) {
                        Common.msg(data.status.msg, data.status.code == 0 ? 200 : "");
                        that.getDataList(all_order.pagePrams.curIndex);
                    }
                }, 'priceRuler', null);
            },
            yellowCallback: function (item,scrollBar) {
                that.request({
                    "orderid": $(item).attr("data-orderid"),
                    "userId": that.userInfo.userid,
                    "customid": $(item).attr("data-customid"),
                    "roleType": that.userInfo.roletype,
                    "token": that.userInfo.token,
                    "mindprice": parseInt($(item).find('.show-value .yellow-value').val()),
                    "designGuideFee": parseInt($(item).attr('guide-fee-value')),
                    "commandcode": 141
                }, function (data) {
                    if (data) {
                        Common.msg(data.status.msg, data.status.code == 0 ? 200 : "");
                        that.getDataList(all_order.pagePrams.curIndex);
                    }
                }, 'priceRuler', null);
            }
        });
    },
    getDataList: function (currIndex) {
        var url = cancelled.getUrl["order"] + cancelled.getDataInterface["cancelled"];//获取全部订单接口地址
        var cosImgUrl=cancelled.getUrl["cosImgUrl"];
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
            "inorder": 0
        },
            true,
            function (data) {
                if (data) {
                    var dataList = data.ordersummary;
                    //var dataList;//测试数据
                    //如果没数据则跳出
                    if (!dataList) {
                        Common.emptyList($("#orderList"));
                        return false;
                    }

                    $(".thead").removeClass('hide');
                    var status = data.status;
                    var userInfo = data.userinfo;
                    cancelled.pagePrams.curIndex = currIndex;//当前页码
                    cancelled.pagePrams.totalPage = Math.ceil(dataList.totalnum / cancelled.pagePrams.pageSize);//共多少页
                    $("#orderList").html("");
                    
                    //--------------BEGIN--动态生成订单概览信息----------------	
					var data_order = data.ordersummary;
                    data_order["roleType"]=data.userinfo.roleType;//角色id

                    //下啦数据
                    data_order["ordersummary"]=commonData.technology;
                    data_order["machining"]=commonData.machining;
                    data_order["color"]=commonData.color;

                    data_order["productType"]=commonData.productType;
                    data_order["texturename"]=commonData.texturename;
                    data_order["accessoriesname"]=commonData.accessoriesname;

					//命名空间
					var bt = baidu.template;
					var strHtml = bt( 'baidu_workstage_order', data_order );
					//渲染
					$("#orderList").html(strHtml);
					//---------------END 动态生成订单概览信息------------------
                    
                    /*$.each(dataList.orderarray, function (i, item) {
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
                    });*/
                }
                cancelled.initPage();
            });
    },
    setListContainerHeight: function () {//设置列表容器的高度
        var winH = window.innerHeight;
        if (winH) {
            winH -= 145;
        }
        $(".order").css("height", winH + "px");
    }
};

var base={
    init:function () {
        cancelled.getDataList(cancelled.pagePrams.curIndex);
    }
}

//初始化
$(function () {
    cancelled.init();
});