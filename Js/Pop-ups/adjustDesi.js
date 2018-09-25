// 修改设计费
$(function () {
    var url=config.WebService()["designFee_Init"];
    var customid=Helper.getUrlParam("customid");
    var introduceprice=Helper.getUrlParam("introduceprice");//设计引导费
    var designPrice=Helper.getUrlParam("designPrice");//设计费
    $("#introduceprice").text(introduceprice);
    $("#designPrice").val(designPrice);
    var slideRuleOs=$(".slide-rule-os");

    top.Requst.ajaxGet(url,{"customid":customid},false,function (data) {
        if(data.code==200)
        {
            slideRuleOs.attr("data-down-min",data.data.baseDesignPrice.formatMoney(2, "", ",", "."));
            slideRuleOs.attr("data-down-max",data.data.maxDesignPrice.formatMoney(2, "", ",", "."));
            slideRuleOs.attr("data-blue-point-val",designPrice.replace(/[^0-9-.]/g, ''));
            priceSlider.initSlideRuleOS();
        }
    });

    $(".btn").on("click",function () {
        designPrice=parseFloat($("#designPrice").val().replace(/[^0-9-.]/g, ''));
        var url=config.WebService()["designFee_Submit"];
        var data={"customid":customid,"designPrice":designPrice};
        top.Requst.ajaxGet(url,data,true,function (data) {
            if(data.code==200)
            {
                top.Message.show("提示", data.message, MsgState.Success, 2000,function () {
                    //更新概览
                    if (top.classMain.loadOverview) {
                        top.classMain.loadOverview(null, null, null, customid);
                    }
                    //更新详情
                    if(top.document.getElementById("iframe_"+customid))
                    {
                        top.document.getElementById("iframe_"+customid).contentWindow.details.getData("base");
                    }
                    top.Popup.close("调整设计费");
                });
            }
            else
            {
                top.Message.show("提示", data.message, MsgState.Warning, 2000,null,{"width":"400","height":"76"});
            }
        })
    });
});