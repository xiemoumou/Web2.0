// 定价
var customid='';
var pricing = {
    init: function () {
        var that=this;
        customid = Helper.getUrlParam("customid");//定制号
        var currentPeriod = Helper.getUrlParam("currentPeriod");//工期
        var currentPrice=Helper.getUrlParam("currentPrice");//当前参考价
        var quote=Helper.getUrlParam("quote");//报价
        var userPeriod=Helper.getUrlParam('userPeriod');//客户要求工期
        var inquiryStatus=Helper.getUrlParam('inquiryStatus');

        $("#currentPrice").text(currentPrice);
        $("#currentPeriod").text(currentPeriod);
        $("#quote").text(quote);
        $('#inputQuote').val(quote);
        $('#inputPeriod').val(userPeriod);

        $('.save-btn').on('click',function () {
            that.save();
        });
    },
    save:function () {
        
        var url=config.WebService()["order_Finally"];
        var data={};
        data["producrPeriod"]=parseInt($("#inputPeriod").val());//客户要求工期
        data["finalprice"]=parseInt($("#inputQuote").val());//定价金额
        data['customid']=customid;

        top.Requst.ajaxGet(url,data,true,function (data) {
            if(data.code==200)
            {
                top.Message.show("提示",data.message,MsgState.Success,200,function () {
                    top.loadOverview(null,null,null,customid);
                    top.Popup.close("订单定价");
                });
            }
            else
            {
                console.log(data.message);
            }
        });
    }
};

$(function () {
    pricing.init();
});