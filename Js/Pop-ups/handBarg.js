//处理议价
$(function () {

    var customid = Helper.getUrlParam("customid");
    var userPeriod=Helper.getUrlParam("userPeriod")||0;//客户期望工期
    userPeriod=userPeriod=="undefined"?0:parseInt(userPeriod);
    var basePrice=Helper.getUrlParam("basePrice")||0;//客户期望价格
    basePrice=parseFloat(basePrice).formatMoney(2, "", ",", ".");

    $("#userPeriod").text(userPeriod);
    $("#basePrice").text(basePrice);


    $('.ok').on('click',function () {
        var price=$("#price").val()||0;
        price=parseFloat(price.replace(/[^0-9-.]/g, ''));//回应报价

        var period=$("#period").val()||0;
        period=parseInt(period);//回应工期

        if(price<=0)
        {
            top.Message.show("提示","输入的报价金额必须大于 0 ",MsgState.Warning,2000);
            return;
        }
        if(period<=0)
        {
            top.Message.show("提示","输入的工期必须大于 0 ",MsgState.Warning,2000);
            return;
        }
        var url=config.WebService()["orderBargin_Doit"];
        top.Requst.ajaxGet(url,{"customid":customid,"price":price,"period":period},true,function (data) {
            if(data.code==200)
            {
                top.Message.show("提示",data.message,MsgState.Success,2000,function () {
                    top.classMain.loadOverview(null,null,null,customid);
                });
            }
            else
            {
                top.Message.show("提示",data.message,MsgState.Warning,2000);
            }
        });

    });


});