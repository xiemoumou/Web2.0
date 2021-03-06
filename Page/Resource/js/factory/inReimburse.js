//退款中-车间
var after_processing = {
    getUrl: {},//请求接口的URL
    getDataInterface: {},//请求数据的接口
    functionalInterface: {},//操作功能的接口
    //commonObj: {},//Common工具类
    userInfo: {},//用户信息
    pagePrams: { 'curIndex': 1, 'totalPage': 1, 'pageSize': 5, 'isInit': -1 },//分页参数
    init: function () {//初始化
        var that=this;
        //分页保持
        if(sessionStorage.getItem('pageIndex'))
        {
            that.pagePrams.curIndex=parseInt(sessionStorage.getItem('pageIndex'));
        }
        after_processing.getUrl = parent.Common.getUrl();//获取请求接口的URL
        after_processing.getDataInterface = parent.Common.getDataInterface();//获取请求数据的接口
        after_processing.functionalInterface = parent.Common.functionalInterface();//获取操作功能的接口
        //after_processing.commonObj = parent.Common;//获取common工具类对象
        after_processing.userInfo = parent.Main.userInfo;//获取用户信息

        after_processing.setListContainerHeight();//设置列表容器得高度跟随浏览器大小变化
        window.onresize = function () {
            after_processing.setListContainerHeight();
        }

        //点击空白隐藏搜索下拉菜单或个人中心下拉菜单
        $(window).click(function () {
            if (parent.Main.currentClickObj) {
                $(parent.Main.currentClickObj).hide();
                parent.Main.currentClickObj = null;
            }
        })

        //设置红点数值
        var afterProcessing_i = $("#afterProcessing_i"); //售后处理中
        var inReturns_i = $("#inReturns_i");  //退货中
        var inReimburse_i = $("#inReimburse_i"); //退款中
        afterProcessing_i.hide();
        inReturns_i.hide();
        inReimburse_i.hide();  //退款
        afterProcessing_i.css({ 'top': "14px", "height": "3px" });
        inReturns_i.css({ 'top': "14px", "height": "3px" });
        inReimburse_i.css({ 'top': "14px", "height": "3px" }); 
        parent.Main.redDot(function (data) {
            if (data[7].num > 0) {
                afterProcessing_i.css({ 'top': "0px", "height": "20px",'display':'inline-block' });
                afterProcessing_i.html(data[7].num).show();
            }

            if (data[8].num > 0) {
                inReturns_i.css({ 'top': "0px", "height": "20px" });
                inReturns_i.html(data[8].num).show();
            }
            
            if (data[9].num > 0) {
                inReimburse_i.css({ 'top': "0px", "height": "20px" });
                inReimburse_i.html(data[9].num).show();
            }
        });
        //设置红点数值end

        after_processing.getDataList(that.pagePrams.curIndex);//加载数据

    },
    initPage: function () {//初始化分页插件
        var that=this;
        if (after_processing.pagePrams.isInit > 0)
            return;
        after_processing.pagePrams.isInit = 1;
        $(".page-box").html("");
        $(".page-box").append($("<div id=\"pagination\" class=\"page fl\"></div>"));
        $("#pagination").pagination({
            currentPage: after_processing.pagePrams.curIndex,
            totalPage: after_processing.pagePrams.totalPage,
            isShow: true,
            count: after_processing.pagePrams.pageSize,
            homePageText: "首页",
            endPageText: "尾页",
            prevPageText: "上一页",
            nextPageText: "下一页",
            callback: function (currIndex) {
                that.pagePrams.curIndex=currIndex;//分页保持
                sessionStorage.setItem('pageIndex',currIndex);//分页保持
                after_processing.getDataList(currIndex);
            }
        });
    },
    initPriceRuler: function(){
    	priceSlider.initSlideRuleOS({
            redCallback:function () {

                return true;
            },
            blueCallback:function () {
            	
                return true;
            },
            yellowCallback:function () {
            	
                return true;
            }
        });
    },
    getDataList: function (currIndex) {
        var url = after_processing.getUrl["order"] + after_processing.getDataInterface["inReimburse"];//获取售后处理中的接口地址
        var cosImgUrl = after_processing.getUrl["cosImgUrl"];
        //请求数据
        //after_processing.commonObj.ajax(url, {
        Common.ajax(url, {
            "userid": after_processing.userInfo.userid,
            "token": after_processing.userInfo.token,
            "roletype": after_processing.userInfo.roletype,
            "workflow": 1,
            "searchday": 30,
            "fromtime": "2016",
            "totime": "2018",
            "ordernumofsheet": after_processing.pagePrams.pageSize,
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
					after_processing.pagePrams.curIndex = currIndex;//当前页码
                    after_processing.pagePrams.totalPage = Math.ceil(dataList.totalnum / after_processing.pagePrams.pageSize);//共多少页
                    $("#orderList").html(""); //初始化全部订单页面
                    
					//--------------BEGIN--动态生成订单概览信息----------------	
					var data_order = data.ordersummary; 
 data_order["cosImgUrl"]=cosImgUrl; 
 //命名空间
					var bt = baidu.template;
					var strHtml = bt( 'baidu_workstage_order', data_order );
					//渲染
					$("#orderList").html(strHtml);
					//---------------END 动态生成订单概览信息------------------------
                    
                }
                
                after_processing.initPage();
                after_processing.initPriceRuler();
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
        after_processing.getDataList(after_processing.pagePrams.curIndex);
    },
    request: function (data, callback, getDataInterface, functionalInterface) {
        var url = Common.getUrl()['order'];
        if (getDataInterface) {
            url += Common.getDataInterface()[getDataInterface];
        }
        if (functionalInterface) {
            url += Common.functionalInterface()[functionalInterface];
        }
        Common.ajax(url, data, true, callback, function (error) {
            //接口调用错误处理
        });
    },
    quotePrice:function (produce_day,quote_price,orderid,customid) {//报价
        this.request({
            "orderid": orderid,
            "userId": top.Main.userInfo.userid,
            "customid": customid,
            "roleType": top.Main.userInfo.roletype,
            "token": top.Main.userInfo.token,
            "productioncycle":produce_day,//生产周期
            "returnprice":quote_price,//定价金额
            "commandcode": 141
        }, function (data) {
            if (data) {
                Common.msg(data.status.msg,data.status.code==0?200:"",2000,function () {
                    layer.closeAll();
                });
                base.init();
            }
        }, 'priceRuler', null);
    },
}
//初始化
$(function () {
    after_processing.init();
});