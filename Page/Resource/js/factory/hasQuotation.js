//已报价----车间
var all_order = {
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
        $(window).click(function () {
            if (parent.Main.currentClickObj) {
                $(parent.Main.currentClickObj).hide();
                parent.Main.currentClickObj = null;
            }
        })

        //设置红点数值
        var factory_ord = $("#factory_ord_i");
        
        factory_ord.css({ 'top': "14px", "height": "3px", "left": "55px"}).hide();
        
        parent.Main.redDot(function (data) {
            if (data[3].num > 0) {
                factory_ord.css({ 'top': "0px", "height": "20px" });
                factory_ord.html(data[3].num).show();
            }

            
        });
        //设置红点数值end

        all_order.getDataList(that.pagePrams.curIndex);//加载数据
        this.GoDetail();//进入详情页

    },
    initPage: function () {//初始化分页插件
        var that=this;
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
                that.pagePrams.curIndex=currIndex;//分页保持
                sessionStorage.setItem('pageIndex',currIndex);//分页保持
                all_order.getDataList(currIndex);
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
        var url = all_order.getUrl["order"] + all_order.getDataInterface["hasQuotation"];//获取已报价订单接口地址
        var cosImgUrl = all_order.getUrl["cosImgUrl"];
        //请求数据
        //all_order.commonObj.ajax(url, {
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
					all_order.pagePrams.curIndex = currIndex;//当前页码
                    all_order.pagePrams.totalPage = Math.ceil(dataList.totalnum / all_order.pagePrams.pageSize);//共多少页
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
                
                all_order.initPage();
                all_order.initPriceRuler();
            });
    },
    setListContainerHeight: function () {//设置列表容器的高度
        var winH = window.innerHeight;
        if (winH) {
            winH -= 142;
        }
        $(".order").css("height", winH + "px");
    },
    GoDetail:function(){
        $(document).on("click",".js_go_detail",function () {
            ClickEvent.click_($(this),'报价');
        })

    }
    
};

var base={
    init:function () {
        all_order.getDataList(all_order.pagePrams.curIndex);
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
    all_order.init();
});