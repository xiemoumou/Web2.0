
$(function () {
    message.mess();
})



var message = {
    pagePrams: {'curIndex': 1, 'totalPage': 1, 'pageSize': 10, 'isInit': -1, 'dataType': ''},//分页参数
    mess: function() {
        $(".message-msg-box-pre").children("div:first").css("background-color", "#fcfcfc");
        $(".message-msg-box-pre").children("div:even").addClass("one");
        $(".message-msg-box-pre").children("div:odd").addClass("two");
   },
    initPage: function () {//初始化分页插件
        var that = this;
        if (that.pagePrams.isInit > 0)
            return;
        that.pagePrams.isInit = 1;
        that.pagePrams.curIndex = 1;
        $(".page-box").html("");
        $(".page-box").append($("<div id=\"pagination\" class=\"page fr\"></div>"));
        $("#pagination").pagination({
            currentPage: that.pagePrams.curIndex,
            totalPage: that.pagePrams.totalPage,
            isShow: true,
            count: that.pagePrams.pageSize,
            callback: function (currIndex) {
                that.pagePrams.curIndex = currIndex;//分页保持
                that.loadOverview(that.pagePrams.dataType, currIndex);
            }
        });
    }

}