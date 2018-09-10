$(function () {
    var customid=Helper.getUrlParam("customid");
    var tax=Helper.getUrlParam("tax",true);//是否含税
    var userPeriod=Helper.getUrlParam("userPeriod");//客户要求工期
    var lastQuote=Helper.getUrlParam("lastQuote");//上次报价
    lastQuote=lastQuote=="undefined"?0:lastQuote;
    
    $("#userPeriod").val(userPeriod);
    $("#lastQuote").val(parseFloat(lastQuote).formatMoney(2, "", ",", "."));
    $("#tax").text(tax);
    $(".ok").on("click",function () {
        var url=config.WebService()["orderBargin_Query"];
        var data={"customid":customid};
        data["basePrice"]=parseFloat($("#lastQuote").val().replace(/[^0-9-.]/g, ''));
        data["userPeriod"]=parseInt($("#userPeriod").val());
        top.Requst.ajaxGet(url,data,true,function (data) {
            if(data.code==200)
            {
                top.Message.show("提示", data.message, MsgState.Success, 2000,function () {
                    if (top.classMain.loadOverview) {
                        top.classMain.loadOverview(null, null, null, customid);
                    }
                    top.Popup.close("发起议价");
                });
            }
            else
            {
                top.Message.show("提示", data.message, MsgState.Warning, 2000);
            }
        });
    });
});