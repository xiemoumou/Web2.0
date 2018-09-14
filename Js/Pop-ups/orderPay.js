/**
 * Created by inshijie on 2018/9/8.
 */
// 订单支付
var customid='';
var finalPrice=0;
var pricing = {
    init: function () {
        var that=this;
        customid = Helper.getUrlParam("customid");//定制号
        finalPrice = Helper.getUrlParam("finalPrice");//定价金额
        $("#finalPrice").text(finalPrice);
        $("#receiptChannel").DropDownList([{"id":1,"name":"淘宝平台收款"},{"id":2,"name":"北京协迈科技有限公司"}]);

        $("#receiptChannel .val").append($('<em style="color:#5d5d5d;">请选择</em>'));

        $('.save-btn').on('click',function () {
            that.save();
        });
    },
    save:function () {
        var data={};
        var payPrice=$("#payPrice").val().replace(/[^0-9-.]/g, '');
        payPrice=parseFloat(payPrice);

        data["payPrice"]=payPrice;//支付金额
        data['customid']=customid;
        data['code']=parseInt($("#receiptChannel .val").attr('data-value'));//支付平台

        if(isNaN(data['code']))
        {
            top.Message.show("提示","请选择收款渠道。",MsgState.Warning,2000);
            return;
        }

        if(payPrice!=parseFloat(finalPrice))
        {
            top.Confirm("提示","检测到定价金额和用户支付金额不一致，是否继续提交？",440,184,false,function () {
                submit();
            });
        }
        else {
            submit();
        }

        function submit() {
            var url=config.WebService()["order_PayFinally"];
            top.Requst.ajaxGet(url,data,true,function (data) {
                    if(data.code==200)
                    {
                        top.Message.show("提示",data.message,MsgState.Success,2000,function () {
                            top.loadOverview(null,null,null,customid);
                            top.Popup.close("订单支付");
                        });
                    }
                    else
                    {
                        top.Message.show("提示",data.message,MsgState.Warning,2000);
                    }
                });
        }
    }
};

$(function () {
    pricing.init();
});