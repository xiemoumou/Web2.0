//报价与重新报价
$(function () {
    var customid = Helper.getUrlParam("customid");
    var inquiryRound = Helper.getUrlParam("inquiryRound");
    inquiryRound = parseInt(inquiryRound);
    var lastQuote = Helper.getUrlParam("lastQuote");
    lastQuote = parseFloat(lastQuote).formatMoney(2, "", ",", ".");

    $("#lastQuote").text(lastQuote);


    $('.ok').on('click', function () {
        var quotePrice = $("#quotePrice").val() || 0;
        quotePrice = parseFloat(quotePrice.replace(/[^0-9-.]/g, ''));//报价
        var quotePeriod = $("#quotePeriod").val() || 0;
        quotePeriod = parseInt(quotePeriod);//工期

        if (quotePrice <= 0) {
            top.Message.show("提示", "输入的报价金额必须大于 0 ", MsgState.Warning, 2000);
            return;
        }
        if (quotePeriod <= 0) {
            top.Message.show("提示", "输入的工期必须大于 0 ", MsgState.Warning, 2000);
            return;
        }
        var url = config.WebService()["orderQuoteInfo_Insert"];
        top.Requst.ajaxGet(url, {
            "customid": customid,
            "quotePrice": quotePrice,
            "quotePeriod": quotePeriod,
            "rounds": inquiryRound
        }, true, function (data) {
            if (data.code == 200) {
                top.Message.show("提示", data.message, MsgState.Success, 2000, function () {
                    top.classMain.loadOverview(null, null, null, customid);
                    if (data.data) {
                        var code = data.data;
                        top.Cache["train-data"] = code;
                        console.log(code);
                        top.Popup.open("请输入", 623, 626, './Pop-ups/train.html');
                    }
                    top.Popup.close("重新报价");
                    top.Popup.close("报价");
                });
            }
            else {
                top.Message.show("提示", data.message, MsgState.Warning, 2000);
            }
        });

    });


});