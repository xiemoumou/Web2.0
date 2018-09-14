// 订单详情
var orderId ="";
var customid="";
var demand_details = {
    getUrl: {},//请求接口的URL
    getDataInterface: {},//请求数据的接口
    functionalInterface: {},//操作功能的接口
    userInfo: {},//用户信息
    init: function () {//初始化
        demand_details.getUrl = parent.Common.getUrl();//获取请求接口的URL
        demand_details.getDataInterface = parent.Common.getDataInterface();//获取请求数据的接口
        demand_details.functionalInterface = parent.Common.functionalInterface();//获取操作功能的接口
        demand_details.userInfo = parent.Main.userInfo;//获取用户信息


        //点击空白隐藏搜索下拉菜单或个人中心下拉菜单
        $(window).click(function () {
            if (parent.Main.currentClickObj) {
                $(parent.Main.currentClickObj).hide();
                parent.Main.currentClickObj = null;
            }
        })

        orderId = Common.getUrlParam("orderId");//订单号
        customid = Common.getUrlParam("customid");
        var isrobbery=Common.getUrlParam("isrobbery");
        sessionStorage.setItem("src", "./design/demand_details.html?customid="+customid+"&orderId="+orderId+"&isrobbery="+isrobbery);
        demand_details.getData(orderId, customid,isrobbery);//加载数据
        parent.Main.redDot();//更新导航红点数值
    },
    getData: function (orderId, customid,hideRobbery) {
        var url = demand_details.getUrl["order"] + demand_details.getDataInterface["demand_details"];//获取订单详情接口地址
        var cosImgUrl=demand_details.getUrl["cosImgUrl"];
        var that=this;
        Common.ajax(url, {
            "orderId": orderId,
            "userId": demand_details.userInfo.userid,
            "customId": customid,
            "roleType": demand_details.userInfo.roletype,
            "token": demand_details.userInfo.token
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

                    var item = data.ordersummary;
                    
                    if(item.state.designreceivestate.code==1)//详情跳转页面
                    {
                        window.location.href="./design_draft.html?customid="+customid+"&orderId="+orderId;
                    }

                    var orderDate = item.orderinfo.createtime;
                    //var orderId = item.orderinfo.orderid;
                    var imageSrc = item.orderinfo.goodsimage;
                    var accessoriesname = item.goodsinfo.accessoriesname;//蝴蝶扣
                    var texturename = item.goodsinfo.texturename;//锌合金
                    var goodsclass = item.orderinfo.goodsclass;//"徽章"
                    var shape = item.goodsinfo.shape;//"2D;"
                    var technology = item.goodsinfo.technology;//"柯氏;"
                    var color = item.goodsinfo.color;
                    //var customid = item.orderinfo.customid;
                    var remarks = data.orderaddinfo.remarks;

                    var l = item.goodsinfo.size.length;
                    var w = item.goodsinfo.size.width;
                    var h = item.goodsinfo.size.height;

                    var designprice = item.price.designprice;//设计费
                    var orderstate = item.state.orderstate.orderstate;

                    var orderaddinfo = data.orderaddinfo;//附件
                    // var designer=designinfo.designer;
                    // var module=$("#module");
                    // $.each(designer,function(i,item){
                    //    var designername= item.designername;//设计师名字
                     
                    if(data.orderaddinfo)
                    {
                        if(data.orderaddinfo.imageurl1)
                        {
                            $(".design-diagram-layout-photo").append($("<div class=\"photo-container fl\"><img data-original=\""+that.getUrl["cosImgUrl"]+data.orderaddinfo.imageurl1 +"\" src=\""+ that.getUrl["cosImgUrl"]+data.orderaddinfo.imageurl1+"\" onerror=\"this.src='../../images/icon/loading.gif'\"><!--<div class=\"cover active\"></div>--></div>"));
                        }
                        if(data.orderaddinfo.imageurl2)
                        {
                            $(".design-diagram-layout-photo").append($("<div class=\"photo-container fl\"><img data-original=\""+that.getUrl["cosImgUrl"]+data.orderaddinfo.imageurl2 +"\" src=\""+ that.getUrl["cosImgUrl"]+data.orderaddinfo.imageurl2+"\" onerror=\"this.src='../../images/icon/loading.gif'\"><!--<div class=\"cover active\"></div>--></div>"));
                        }
                        if(data.orderaddinfo.imageurl3)
                        {
                            $(".design-diagram-layout-photo").append($("<div class=\"photo-container fl\"><img data-original=\""+that.getUrl["cosImgUrl"]+data.orderaddinfo.imageurl3 +"\" src=\""+ that.getUrl["cosImgUrl"]+data.orderaddinfo.imageurl3+"\" onerror=\"this.src='../../images/icon/loading.gif'\"><!--<div class=\"cover active\"></div>--></div>"));
                        }

                        $(".design-diagram-layout-photo").viewer({
                            url: 'data-original'
                        });
                    }

                    // });
                    $("#ordNum").html('订单号: ' + orderId);
                    $("#money").html('¥' + designprice);
                    $("#size").html(l + "mm＊" + w + "mm＊" + h + "mm");
                    $("#attr_info").html(goodsclass + " " + texturename + " " + accessoriesname + " " + shape + " " + technology + " " + color);
                    $("#requ_info").html(remarks);
                    $("#datetime").html(data.ordersummary.orderinfo.createtime);
                    $("#qd_btn").on('click', function () {//抢单按钮
                        parent.Main.robbery(orderId,customid,demand_details.robbery);
                    });
                    // //隐藏抢单按钮
                    // if(hideRobbery=="waiting_design")
                    // {
                    //     $("#qd_btn").hide();
                    // }

                    if (orderaddinfo.accessoryurl) {
                        $("#fileName").val(orderaddinfo.accessoryid);
                        $("#fileName").attr('title',orderaddinfo.accessoryid);
                    }
                    else {
                        $(".download").hide();
                    }
                    $("#download").attr("href", "javascript:Common.download(\"" + cosImgUrl + orderaddinfo.accessoryurl + "\")");
                }
            });
    },
    robbery: function (url, requestData) { //抢单
        Common.ajax(url, requestData,
            true,
            function (data) {
                if (!data) {
                    return false;
                }
                Common.msg(data.status.msg, data.status.code==0?200:null);
                if(data.status.code==0)
                {
                    setTimeout(function () {
                        window.location.href="./design_draft.html?orderId=" + orderId + "&customid=" + customid;
                    },2000);
                }
                parent.Main.redDot();
            }
        );
    }
};

$(function () {
    demand_details.init();
})