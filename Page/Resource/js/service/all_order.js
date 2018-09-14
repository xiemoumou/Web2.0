//全部订单-客服
var currentSelectObj = null;
var all_order = {
    getUrl: {},//请求接口的URL
    getDataInterface: {},//请求数据的接口
    functionalInterface: {},//操作功能的接口
    //commonObj: {},//Common工具类
    userInfo: {},//用户信息
    pagePrams: {'curIndex': 1, 'totalPage': 1, 'pageSize': 5, 'isInit': -1},//分页参数
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
        var that = this;
        //分页保持
        if (sessionStorage.getItem('pageIndex')) {
            that.pagePrams.curIndex = parseInt(sessionStorage.getItem('pageIndex'));
        }

        all_order.getUrl = parent.Common.getUrl();//获取请求接口的URL
        all_order.getDataInterface = parent.Common.getDataInterface();//获取请求数据的接口
        all_order.functionalInterface = parent.Common.functionalInterface();//获取操作功能的接口
        //all_order.commonObj = parent.Common;//获取common工具类对象
        all_order.userInfo = parent.Main.userInfo;//获取用户信息

        all_order.setListContainerHeight();//设置列表容器得高度跟随浏览器大小变化
        window.onresize = function () {
            all_order.setListContainerHeight();
        }

        //点击空白隐藏搜索下拉菜单或个人中心下拉菜单
        $(window).click(function (e) {
            if (parent.Main.currentClickObj) {
                $(parent.Main.currentClickObj).hide();
                parent.Main.currentClickObj = null;
            }
        })

        //设置红点数值
        var al_i = $("#al_i");
        var dcl_i = $("#dcl_i");
        al_i.css({'top': "14px", "height": "3px"});
        dcl_i.css({'top': "14px", "height": "3px"});
        parent.Main.redDot(function (data) {
            if (data[0].num > 0) {
                al_i.css({'top': "0px", "height": "20px"});
                al_i.html(data[0].num);
            }

            if (data[1].num > 0) {
                dcl_i.css({'top': "0px", "height": "20px"});
                dcl_i.html(data[1].num);
            }
        });
        //设置红点数值end
        all_order.getDataList(all_order.pagePrams.curIndex);//加载数据

    },
    initPage: function () {//初始化分页插件
        var that = this;
        if (all_order.pagePrams.isInit > 0)
            return;
        all_order.pagePrams.isInit = 1;
        $(".page-box").html("");
        $(".page-box").append($("<div id=\"pagination\" class=\"page fl\"></div>"));
        $("#pagination").pagination({
            currentPage: all_order.pagePrams.curIndex,
            totalPage: all_order.pagePrams.totalPage,
            isShow: true,
            count: all_order.pagePrams.pageSize,
            homePageText: "首页",
            endPageText: "尾页",
            prevPageText: "上一页",
            nextPageText: "下一页",
            callback: function (currIndex) {
                that.pagePrams.curIndex = currIndex;//分页保持
                sessionStorage.setItem('pageIndex', currIndex);//分页保持
                all_order.getDataList(currIndex);
            }
        });
    },
    initPriceRuler: function () {
        var that = this;
        priceSlider.initSlideRuleOS({
            redCallback: function (item, scrollBar) {//定价
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
            blueCallback: function (item, scrollBar) {
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
            yellowCallback: function (item, scrollBar) {
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
        var url = all_order.getUrl["order"] + all_order.getDataInterface["all-order"];//获取全部订单接口地址
        var cosImgUrl = all_order.getUrl["cosImgUrl"];

        //var data=ServiceData;//测试数据


        //请求数据
        Common.ajax(url, {
                "userid": all_order.userInfo.userid,
                "token": all_order.userInfo.token,
                "roletype": all_order.userInfo.roletype,
                "workflow": 1,
                "searchday": 30,
                "fromtime": "2016",
                "totime": "2018",
                "ordernumofsheet": all_order.pagePrams.pageSize,
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
                    all_order.pagePrams.curIndex = currIndex;//当前页码
                    all_order.pagePrams.totalPage = Math.ceil(dataList.totalnum / all_order.pagePrams.pageSize);//共多少页
                    $("#orderList").html(""); //初始化全部订单页面

                    //--------------BEGIN--动态生成订单概览信息----------------
                    var data_order = data.ordersummary;

                    data_order["cosImgUrl"] = cosImgUrl;
                    data_order["roleType"]=data.userinfo.roleType;//角色id

                    //下啦数据
                    data_order["ordersummary"] = commonData.technology;
                    data_order["machining"] = commonData.machining;
                    data_order["color"] = commonData.color;

                    data_order["productType"] = commonData.productType;
                    data_order["texturename"] = commonData.texturename;
                    data_order["accessoriesname"] = commonData.accessoriesname;

                    //命名空间
                    var bt = baidu.template;
                    var strHtml = bt('baidu_workstage_order', data_order);
                    //渲染
                    $("#orderList").html(strHtml);
                    //---------------END 动态生成订单概览信息------------------------
                }
                all_order.initPage();
                all_order.initPriceRuler();
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

var base = {
    init: function () {
        all_order.getDataList(all_order.pagePrams.curIndex);
    }
}

//初始化
$(function () {
    all_order.init();
});