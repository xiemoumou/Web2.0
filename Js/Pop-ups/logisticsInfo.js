var logistics = {
    customid:Helper.getUrlParam('customid'),
    company:"",
    number:"",
    orderId:Helper.getUrlParam('orderid'),
    init:function (){
        this.getData();
   },
    getData:function(){//获取数据
        var url = config.WebService()['select_Logistics'];
        var that = this;
        
        top.Requst.ajaxGet(
            url,
            {"customid":that.customid },
            true,
            function (data) {//成功之后的回调
                if(data.code==200 && data.data)
                {
                    data=data.data;
                    var li = data.ArrayList[0];
                    $(".js_li_number").html('订单号：'+that.orderId);//订单号
                    $(".js_li_time").html(data.mailTime);//右边的时间
                    that.company=data.code;//物流公司
                    that.number=data.logisticsId;//单号
                    $(".js_list_number").html('运单号码：'+that.number);
                    $(".js_logisticscompany").html('物流公司：'+data.logisticsCompany+'快递');
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
                }
            });
    },
    editlogistics:function () {
        Popup.open("编辑物流信息",410,206,"./uploadLogist.html?company="+logistics.company+"&number="+logistics.number+"&customid="+logistics.customid,function () {
            logistics.getData();
        });
    }
}
$(function(){
    logistics.init();
})
