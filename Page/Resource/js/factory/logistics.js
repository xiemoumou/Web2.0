var logistics = {
    orderId:Common.getUrlParam('orderid'),
    customid:Common.getUrlParam('customid'),
    courier:"",
    number:"",
    init:function (){
        this.getData();
   },
    getData:function(){//获取数据
        var url = Common.getUrl()['logistics']+Common.getDataInterface()['logistics'];
        var that = this;
        
        Common.ajax(
            url,
            {
                "userId": top.Main.userInfo.userid,
                "orderid": that.orderId /*orderid*/,
                "customid":that.customid /*customid*/,
                "roleType": top.Main.userInfo.roletype,
                "token": top.Main.userInfo.token,
                "commandcode": 50
            },
            true,
            function (data) {//成功之后的回调
                    var li = data.ArrayList[0];
                    $(".js_li_number").html('订单号：'+that.orderId);//订单号
                    $(".js_li_time").html(li.logisticstime1);//右边的时间
                    that.courier=li.logisticscompany;//物流公司
                    that.number=li.logisticssheetid;//单号
                    $(".js_list_number").html('运单号码：'+li.logisticssheetid);
                    $(".js_logisticscompany").html('物流公司：'+li.logisticscompany+'快递');
                    var h = '';
                    data.traces.reverse();
                    for(var i = 0;i<data.traces.length;i++){
                        h+='<div class="logistics_list ">' +
                            '<div class="logistics_list_third">'+data.traces[i].acceptTime+'</div>'+
                            '<div class="">'+data.traces[i].acceptStation+'</div>'+
                            '</div>';
                    }
                    $(".js_content").html(h);
                    $(".logistics_list:first").addClass("red_color");
            },function(err){
                //alert(data.status.msg)
            }
        )
    },
    editlogistics:function () {
        var that = this;
        var url = encodeURI('./uploadLogist.html?orderid=' + that.orderId + '&customid=' + that.customid + '&goodsid=' + "abcd123456&courier="+that.courier+"&number="+that.number);
        layer.open({
            type: 2,
            title: '修改物流信息',
            shadeClose: false,
            shade: 0.1,
            area: ['410px', '246px'],
            content: url
        });
    }
}
$(function(){
    logistics.init();
})

var base={
    init:function () {
        console.log("");
        logistics.init();
    }
};

