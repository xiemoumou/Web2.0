$(function () {
    var operType = Helper.getUrlParam('operType');
    var customid = Helper.getUrlParam('customid');
    $('#productPicture').attr('data-customid', customid);
    var url = config.WebService()['orderProductInfoImages_Query'];
    var photoArray = [];
    top.Requst.ajaxGet(url, {"customid": customid}, false, function (data) {
        if (data.code == 200 && data.data.length>0) {
            data=data.data[0];
            for (var i = 1; i <=3; i++) {
                if (data['middleReferenceImage' + i]) {
                    var orgSrc = data['middleReferenceImage' + i];
                    orgSrc = orgSrc.indexOf('http:') >= 0 ? orgSrc : "http://" + orgSrc;
                    var thumbnail = data['smallReferenceImage' + i];
                    thumbnail = thumbnail.indexOf('http:') >= 0 ? thumbnail : "http://" + thumbnail;
                    photoArray.push({"orgSrc": orgSrc, "thumbnail": thumbnail});
                }
            }
        }
        render();
    });

    function render() {
        if (photoArray.length == 0) {
            photoArray = null;
        }
        if (operType == "prev") {
            uploadfile.uploadPhoto("productPicture", 3, photoArray, false);
        }
        else if (operType == "edit") {
            $('.red-button').removeClass('hide');
            uploadfile.uploadPhoto("productPicture", 3, photoArray, true);
            uploadfile.initDrag("productPicture");
        }
    }

    $(".ok").on('click', function () {
        var url = config.WebService()["orderProductInfoUpdateImages"];
        var data = {"customid": customid};
        var diagram = $("#productPicture .diagram-container .diagram");
        for (var i = 0; i < 3; i++) {
            if (diagram[i] && $(diagram[i]).attr("data-complete") != "complete") {
                top.Message.show("提示", "图片正在上传请稍后...", MsgState.Warning, 2000);
                return;
            }
            data["initialReferenceImage" + (i + 1)] = $(diagram[i]).attr("data-oimageurl") || "";
            data["middleReferenceImage" + (i + 1)] = $(diagram[i]).attr("data-mimageurl") || "";
            data["smallReferenceImage" + (i + 1)] = $(diagram[i]).attr("data-simageurl") || "";
        }
        top.Requst.ajaxPost(url, data, true, function (data) {
            if (data.code == 200) {
                top.Message.show("提示", data.message, MsgState.Success, 2000,function () {
                    if (top.classMain.loadOverview) {
                        top.classMain.loadOverview(null, null, null, customid);
                    }
                    if (top.document.getElementById("iframe_"+customid)) {
                        top.document.getElementById("iframe_"+customid).contentWindow.details.getData("base");
                    }
                    top.Popup.close("查看成品图");
                    top.Popup.close("编辑成品图");
                    top.Popup.close("上传成品图");
                });
            }
            else {
                top.Message.show("提示", data.message, MsgState.Fail, 2000);
            }
        })
    });
});