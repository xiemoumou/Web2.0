//生产中-客服
var workshop_order = {
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
        workshop_order.getUrl = parent.Common.getUrl();//获取请求接口的URL
        workshop_order.getDataInterface = parent.Common.getDataInterface();//获取请求数据的接口
        workshop_order.functionalInterface = parent.Common.functionalInterface();//获取操作功能的接口
        //workshop_order.commonObj = parent.Common;//获取common工具类对象
        workshop_order.userInfo = parent.Main.userInfo;//获取用户信息

        workshop_order.setListContainerHeight();//设置列表容器得高度跟随浏览器大小变化
        window.onresize = function () {
            workshop_order.setListContainerHeight();
        }

        //点击空白隐藏搜索下拉菜单或个人中心下拉菜单
        $(window).click(function () {
            if (parent.Main.currentClickObj) {
                $(parent.Main.currentClickObj).hide();
                parent.Main.currentClickObj = null;
            }
        })

        //设置红点数值
        var al_i = $("#inProduct_i");
        var dcl_i = $("#inMail_i");
        al_i.css({ 'top': "14px", "height": "3px" });
        dcl_i.css({ 'top': "14px", "height": "3px" });
        parent.Main.redDot(function (data) {
            if (data[7].num > 0) {
                al_i.css({ 'top': "0px", "height": "20px" });
                al_i.html(data[7].num);
            }

            if (data[8].num > 0) {
                dcl_i.css({ 'top': "0px", "height": "20px" });
                dcl_i.html(data[8].num);
            }
        });
        //设置红点数值end
	
        workshop_order.getDataList(that.pagePrams.curIndex);//加载数据

    },
    initPage: function () {//初始化分页插件
        var that=this;
        if (workshop_order.pagePrams.isInit > 0)
            return;
        workshop_order.pagePrams.isInit = 1;
        $(".page-box").html("");
        $(".page-box").append($("<div id=\"pagination\" class=\"page fl\"></div>"));
        $("#pagination").pagination({
            currentPage: workshop_order.pagePrams.curIndex,
            totalPage: workshop_order.pagePrams.totalPage,
            isShow: true,
            count: workshop_order.pagePrams.pageSize,
            homePageText: "首页",
            endPageText: "尾页",
            prevPageText: "上一页",
            nextPageText: "下一页",
            callback: function (currIndex) {
                that.pagePrams.curIndex=currIndex;//分页保持
                sessionStorage.setItem('pageIndex',currIndex);//分页保持
                workshop_order.getDataList(currIndex);
            }
        });
    },
    initPriceRuler: function(){
        var that=this;
        priceSlider.initSlideRuleOS({
            redCallback: function (item,scrollBar) {//定价
                that.request({
                    "orderid": $(item).attr("data-orderid"),
                    "userId": all_order.userInfo.userid,
                    "customid": $(item).attr("data-customid"),
                    "roleType": all_order.userInfo.roletype,
                    "token": all_order.userInfo.token,
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
                    "userId": all_order.userInfo.userid,
                    "customid": $(item).attr("data-customid"),
                    "roleType": all_order.userInfo.roletype,
                    "token": all_order.userInfo.token,
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
                    "userId": all_order.userInfo.userid,
                    "customid": $(item).attr("data-customid"),
                    "roleType": all_order.userInfo.roletype,
                    "token": all_order.userInfo.token,
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
        var url = workshop_order.getUrl["order"] + workshop_order.getDataInterface["inProduct"];//获取全部订单接口地址
        var cosImgUrl = workshop_order.getUrl["cosImgUrl"];
        //请求数据
        //workshop_order.commonObj.ajax(url, {
        Common.ajax(url, {
            "userid": workshop_order.userInfo.userid,
            "token": workshop_order.userInfo.token,
            "roletype": workshop_order.userInfo.roletype,
            "workflow": 1,
            "searchday": 30,
            "fromtime": "2016",
            "totime": "2018",
            "ordernumofsheet": workshop_order.pagePrams.pageSize,
            "ordersheet": currIndex,
            "ranktype": 1,
            "inorder": 0
        },
            true,
            function (data) {
                if (data) {
                	// 
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
					workshop_order.pagePrams.curIndex = currIndex;//当前页码
                    workshop_order.pagePrams.totalPage = Math.ceil(dataList.totalnum / workshop_order.pagePrams.pageSize);//共多少页
                    $("#orderList").html(""); //初始化全部订单页面
                    
					//--------------BEGIN--动态生成订单概览信息----------------	
					var data_order = data.ordersummary;
                     data_order["cosImgUrl"] = cosImgUrl;
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
					//---------------END 动态生成订单概览信息------------------------
                    
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

                        //按钮状态判断
                        if (orderstate == 2) {//待接单
                            btn = "<button class=\"rob\" onclick=\"parent.Main.robbery('" + orderId + "','" + customid + "',workshop_order.robbery)\">立即抢单</button><a class=\"desc\" href=\"javascript:parent.Main.demandDetails('" + orderId + "','" + customid + "')\">需求详情</a>";
                        }
                        else if (orderstate == 5) {//待设计
                            btn = "<button class=\"rob\" onclick=\"parent.Main.designDraft('" + orderId + "','" + customid + "');\" >修改设计</button><a class=\"desc\" href=\"javascript:parent.Main.designDraft('" + orderId + "','" + customid + "');\">查看反馈</a>";
                        }

                        var detiHead = $(" <div class=\"head\"><span class=\"date\">" + orderDate + "</span><span class=\"ordNum\">订单号: " + orderId + "</span></div>");

                        var detiBody = $("<div class=\"body\"><ul><li><a class=\"img\" href=\"javascript:parent.Main.designDraft('" + orderId + "','" + customid + "');\"><img alt=\"图片\" onerror=\"this.src='../../images/images/mr.png'\" src=\"" + cosImgUrl + imageSrc + "\" /></a></li><li><span class=\"describe\">" + goodsclass + " " + texturename + " " + accessoriesname + " </br> " + shape + " " + technology + " " + color + "</span></li><li><span class=\"size\">" + l + "mm＊" + w + "mm＊" + h + "mm</span></li><li><span class=\"money\">¥" + designprice + "</span></li><li><span class=\"day\">--</span></li><li>" + btn + "</li></ul></div>");

                        detial.append(detiHead);
                        detial.append(detiBody);
                        orderList.append(detial);
                    });*/
                }
                /*setTimeout(function(){
                    $(document.body).append( $("script").attr("src","../../lib/zbScrollBar/zb-scroll-bar.js") );
                },500);*/
                workshop_order.initPage();
                workshop_order.initPriceRuler();
            });
    },
    setListContainerHeight: function () {//设置列表容器的高度
        var winH = window.innerHeight;
        if (winH) {
            winH -= 145;
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
                var Item = $("#order_" + orderId);
                //var img = Item.find('.body').find('a.img');
                var button = dom_obj.find('.body').find('rob');
                //$(img).attr('href', 'javascript:base.uploadOrPriview(\'' + orderId + '\',\'dsj\');');
                $(button).unbind();
                $(button).css('background-color', '#999');
                Common.msg(data.status.msg, 200);
            }
        );
    }
};

var base={
    init:function () {
        workshop_order.getDataList(workshop_order.pagePrams.curIndex);
    }
}

//初始化
$(function () {
    workshop_order.init();
});