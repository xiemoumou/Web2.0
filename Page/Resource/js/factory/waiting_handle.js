//待处理订单
var waiting_handle = {
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
        waiting_handle.getUrl = parent.Common.getUrl();//获取请求接口的URL
        waiting_handle.getDataInterface = parent.Common.getDataInterface();//获取请求数据的接口
        waiting_handle.functionalInterface = parent.Common.functionalInterface();//获取操作功能的接口
        //waiting_handle.commonObj = parent.Common;//获取common工具类对象
        waiting_handle.userInfo = parent.Main.userInfo;//获取用户信息

        waiting_handle.setListContainerHeight();//设置列表容器得高度跟随浏览器大小变化
        window.onresize = function () {
            waiting_handle.setListContainerHeight();
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

        waiting_handle.getDataList(that.pagePrams.curIndex);//加载数据
        this.GoDetail_all();//跳转详情页
    },
    initPage: function () {//初始化分页插件
        var that=this;
        if (waiting_handle.pagePrams.isInit > 0)
            return;
        waiting_handle.pagePrams.isInit = 1;
        $(".page-box").html("");
        $(".page-box").append($("<div id=\"pagination\" class=\"page fl\"></div>"));
        $("#pagination").pagination({
            currentPage: waiting_handle.pagePrams.curIndex,
            totalPage: waiting_handle.pagePrams.totalPage,
            isShow: true,
            count: waiting_handle.pagePrams.pageSize,
            homePageText: "首页",
            endPageText: "尾页",
            prevPageText: "上一页",
            nextPageText: "下一页",
            callback: function (currIndex) {
                that.pagePrams.curIndex=currIndex;//分页保持
                sessionStorage.setItem('pageIndex',currIndex);//分页保持
                waiting_handle.getDataList(currIndex);
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
        var url = waiting_handle.getUrl["order"] + waiting_handle.getDataInterface["waiting_handle"];//获取等处理订单接口地址
        var cosImgUrl=waiting_handle.getUrl["cosImgUrl"];
        //var data={"ordersummary":{"totalnum":11,"orderarray":[{"orderNo":486,"price":{"returnprice":6000,"designprice":8,"designPriceLimit":199,"designGuideFee":null,"mindprice":11,"extent1":"21","productPriceLimit":29997,"finalprice":4999},"nickname":{"factorynickname":"ZB_17094363","customnickname":"ZB_9606333","designernickname":"无"},"state":{"ordersheetstate":{"msg":"生产中","code":6},"productreceivestate":{"msg":"未分配生产","code":2},"designstate":{"msg":"定稿","code":4},"payoffstate":{"msg":"已支付","code":1},"orderstate":{"orderstate":8},"quotestate":{"msg":"定价","code":3}},"goodsinfo":{"number":120,"size":{"width":30.0,"length":300.0,"height":2.0},"color":"金色;","shape":"2D;","technology":"柯氏;纯色电镀;腐蚀;贴纸;透明漆;","accessoriesname":"蝴蝶扣","texturename":"锌合金"},"orderinfo":{"feedbacktime":"","createtime":"2018-03-31 10:52:00","orderid":"205176214604860","goodsid":"abdc123456","goodsimage":"","customerid":"21","goodsname":null,"deadline":21.0,"customid":"12dc123456000486","goodsclass":"徽章"}},{"orderNo":476,"price":{"returnprice":800,"designprice":8,"designPriceLimit":36,"designGuideFee":null,"mindprice":0,"extent1":"12","productPriceLimit":5400,"finalprice":900},"nickname":{"factorynickname":"ZB_17094363","customnickname":"ZB_9606333","designernickname":"无"},"state":{"ordersheetstate":{"msg":"生产中","code":6},"productreceivestate":{"msg":"未分配生产","code":2},"designstate":{"msg":"定稿","code":4},"payoffstate":{"msg":"已支付","code":1},"orderstate":{"orderstate":8},"quotestate":{"msg":"定价","code":3}},"goodsinfo":{"number":120,"size":{"width":30.0,"length":30.2,"height":20.0},"color":"金色;","shape":"2D;压铸;","technology":"","accessoriesname":"蝴蝶扣","texturename":"锌合金"},"orderinfo":{"feedbacktime":"","createtime":"2018-03-28 18:16:15","orderid":"205176184603472","goodsid":"abdc123456","goodsimage":"order/20180329/20180329-172009e06h9bpg81b.jpg","customerid":"12","goodsname":null,"deadline":10.0,"customid":"12dc123456000476","goodsclass":"徽章"}},{"orderNo":414,"price":{"returnprice":300,"designprice":0,"designPriceLimit":12,"designGuideFee":null,"mindprice":100,"extent1":"100","productPriceLimit":1800,"finalprice":300},"nickname":{"factorynickname":"ZB_17094363","customnickname":"王大锤","designernickname":"ZB_401007"},"state":{"ordersheetstate":{"msg":"生产中","code":6},"productreceivestate":{"msg":"未分配生产","code":2},"designstate":{"msg":"定稿","code":4},"payoffstate":{"msg":"已支付","code":1},"orderstate":{"orderstate":8},"quotestate":{"msg":"定价","code":3}},"goodsinfo":{"number":200,"size":{"width":30.0,"length":30.0,"height":2.0},"color":"金色;","shape":"2D;","technology":"柯氏;","accessoriesname":"蝴蝶扣","texturename":"锌合金"},"orderinfo":{"feedbacktime":"","createtime":"2018-03-24 17:53:53","orderid":"205176144040142","goodsid":"abdc123456","goodsimage":"order/20180324/20180324-17530052f9123q6frf.gif","customerid":"24号第三个订单","goodsname":null,"deadline":7.0,"customid":"12dc123456000414","goodsclass":"徽章"}},{"orderNo":359,"price":{"returnprice":0,"designprice":8,"designPriceLimit":8,"designGuideFee":null,"mindprice":0,"extent1":"12","productPriceLimit":36,"finalprice":0},"nickname":{"factorynickname":"无","customnickname":"ZB_9606333","designernickname":"无"},"state":{"ordersheetstate":{"msg":"","code":0},"productreceivestate":{"msg":"未分配生产","code":2},"designstate":{"msg":"未设计","code":0},"payoffstate":{"msg":"未支付","code":0},"orderstate":{"orderstate":0},"quotestate":{"msg":"报价中","code":1}},"goodsinfo":{"number":21,"size":{"width":30.0,"length":30.0,"height":2.0},"color":"金色;","shape":"2D;","technology":"柯氏;","accessoriesname":"蝴蝶扣","texturename":"锌合金"},"orderinfo":{"feedbacktime":"","createtime":"2018-03-23 15:04:38","orderid":"205176134033591","goodsid":"abdc123456","goodsimage":"order/20180323/20180323-150441d11f51kp0qb.jpeg","customerid":"21","goodsname":null,"deadline":21.0,"customid":"12dc123456000359","goodsclass":"徽章"}},{"orderNo":66,"price":{"returnprice":0,"designprice":8,"designPriceLimit":8,"designGuideFee":null,"mindprice":100,"extent1":"100","productPriceLimit":300,"finalprice":0},"nickname":{"factorynickname":"无","customnickname":"王大锤","designernickname":"无"},"state":{"ordersheetstate":{"msg":"","code":0},"productreceivestate":{"msg":"未分配生产","code":2},"designstate":{"msg":"设计中","code":1},"payoffstate":{"msg":"未支付","code":0},"orderstate":{"orderstate":3},"quotestate":{"msg":"报价中","code":1}},"goodsinfo":{"number":200,"size":{"width":30.0,"length":30.0,"height":2.0},"color":"金色;","shape":"2D;","technology":"柯氏;","accessoriesname":"蝴蝶扣","texturename":"锌合金"},"orderinfo":{"feedbacktime":"","createtime":"2018-03-19 11:57:23","orderid":"205176094607062","goodsid":"abdc123456","goodsimage":"order/20180319/20180319-115651n4jojijgrit.gif","customerid":"客户旺旺号","goodsname":null,"deadline":10.0,"customid":"12dc123456000066","goodsclass":"徽章"}}],"returnum":5},"userinfo":{"roleType":3,"userId":"10000036","token":"a79be988-457c-43f3-b07a-bf2003aa8b34"},"status":{"msg":"查询正常","code":"0"}};

        //请求数据
        //waiting_handle.commonObj.ajax(url, {
        Common.ajax(url, {
            "userid": waiting_handle.userInfo.userid,
            "token": waiting_handle.userInfo.token,
            "roletype": waiting_handle.userInfo.roletype,
            "workflow": 1,
            "searchday": 30,
            "fromtime": "2016",
            "totime": "2018",
            "ordernumofsheet": waiting_handle.pagePrams.pageSize,
            "ordersheet": currIndex,
            "ranktype": 1,
            "inorder": 0
        },
            true,
            function (data) {
                if (data) {
                    var dataList = data.ordersummary;
                    //var dataList;测试数据
                    //如果没数据则跳出
                    if (!dataList) {
                        Common.emptyList($("#orderList"));
                        return false;
                    }
                    $(".thead").removeClass('hide');
                    var status = data.status;
                    var userInfo = data.userinfo;

                    waiting_handle.pagePrams.curIndex = currIndex;//当前页码
                    waiting_handle.pagePrams.totalPage = Math.ceil(dataList.totalnum / waiting_handle.pagePrams.pageSize);//共多少页
                     $("#orderList").html(""); //初始化全部订单页面
                    
					//--------------BEGIN--动态生成订单概览信息----------------	
					var data_order = data.ordersummary;
                    data_order["cosImgUrl"]=cosImgUrl;
                    //命名空间
					var bt = baidu.template;
					  
					var strHtml = bt( 'baidu_workstage_order_', data_order );
					//渲染
                    
					$("#orderList").html(strHtml);
					//---------------END 动态生成订单概览信息------------------------
                   
                }
                waiting_handle.initPage();
                waiting_handle.initPriceRuler();
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
    },
    GoDetail_all:function(){
    //修改全部中的状态(quotestate.code == 2 || quotestate.code == 0跳转报价详情页)
    $(document).on("click",".js_go_detail",function () {
        var code = $(this).parents(".js_list_").attr("data-code");
        if(code == 2 || code ==0){
            code = '报价'
        }else{
            code = ''
        }
        ClickEvent.click_($(this),code);
    })

}
};

var base={
    init:function () {
        waiting_handle.getDataList(waiting_handle.pagePrams.curIndex);
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

var RestData={
    rest:function () {
        waiting_handle.getDataList(waiting_handle.pagePrams.curIndex);
    }
}

//初始化
$(function () {
    waiting_handle.init();
});