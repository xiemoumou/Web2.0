$(function () {
    $('.nav ul li').on('click', function () {
        $('.nav ul li').removeClass('active');
        var li = $(this);
        li.addClass('active');
        $("#showtype").val(li.attr('data-status'));
        invoList.pagePrams.isInit = -1;
        invoList.getDataList(1);//初始化数据
    });
    invoList.getDataList(1);//初始化数据
});


var invoList = {
    pagePrams: {'pageNum': 1, 'totalPage': 1, 'pageSize': 20, 'isInit': -1},//分页参数
    sign: function (orderid) {//标记已处理
        var that = this;
        var data = {
            "orderid": orderid,
        };
        var url = config.WebService()["orderInvoiceSign_Update"];
        Requst.ajaxPost(url, data, true, function (data) {
            if (data.code == 200) {
                Message.show('提示', '标记成功', 1, 2000, function () {
                    that.getDataList();
                });
            }
            else {
                console.log(data.status.msg);
            }
        })
    },
    popDetail: function (orderid) {//包装盒详情
        var scrollH = parent.$(window).height();
        if (scrollH > 500) {
            scrollH = 500;
        }
        var url = encodeURI('./CustomerService/packing_preview.html?orderid=' + orderid);
        parent.layer.open({
            type: 2,
            title: '包装盒详情',
            shadeClose: false,
            shade: 0.1,
            area: ['620px', scrollH + 'px'],
            content: url,
        });
    },
    getDataList: function () {
        var that = this;
        var state = $("#showtype").val();
        var data = {
            "sortField": "sendtime",
            "sortType": "desc",
            "state": parseInt(state),
            "pageNum": invoList.pagePrams.pageNum,
            "pageSize": 10,
        };

        var url = config.WebService()["orderBoxInfoPage_Query"];
        top.Requst.ajaxGet(url, data, true, function (data) {
            var orderBoxs = data.data.pageData;
            var datalist = $("#datalist");
            datalist.html('');
            if (data.code == 200 && data.data.pageData.length && data.data.pageData.length > 0) {
                that.pagePrams.totalPage = Math.ceil(data.data.pageMessage.rowCount / that.pagePrams.pageSize);
                for (var i = 0; i < orderBoxs.length; i++) {
                    var item = orderBoxs[i];
                    var tr = $('<tr></tr>');
                    var orderDatetime = item.sendTime ? item.sendTime : '';
                    tr.append($('<td style="min-width: 130px;">' + orderDatetime + '</td>'));
                    tr.append($('<td style="min-width: 102px;">' + item.orderid + '</td>'));
                    tr.append($('<td style="min-width: 102px;">' + item.wangid + '</td>'));
                    tr.append($('<td style="min-width: 102px;">' + ConvertIdToName_1(top.SysParam.shop,item.shop) + '</td>'));
                    // tr.append($('<td><span class="text">'+item.invoicetitle+'</span></td>'));
                    if (state == 2) {
                        tr.append($('<td style="text-align: right; min-width: 180px;"><div class="sign"> </div> <div class="ticket-details"> <span></span> <p onclick="invoList.popDetail(\'' + item.orderid + '\')">包装详情</p> </div></td>'));
                    }
                    else {
                        tr.append($('<td style="text-align: right; min-width: 180px;"><div class="sign"> <span></span> <p onclick="invoList.sign(\'' + item.orderid + '\')">标记已处理</p> </div> <div class="ticket-details"> <span></span> <p onclick="invoList.popDetail(\'' + item.orderid + '\')">包装详情</p> </div></td>'));
                    }

                    datalist.append(tr);
                }
            }
            that.initPage();
        })
    },
    initPage: function () {//初始化分页插件
        var that = this;
        if (that.pagePrams.isInit > 0)
            return;
        that.pagePrams.isInit = 1;
        $(".page-box").html("");
        $(".page-box").append($("<div id=\"pagination\" class=\"page fl\"></div>"));
        $("#pagination").pagination({
            currentPage: that.pagePrams.curIndex,
            totalPage: that.pagePrams.totalPage,
            isShow: true,
            count: that.pagePrams.pageSize,
            homePageText: "首页",
            endPageText: "尾页",
            prevPageText: "上一页",
            nextPageText: "下一页",
            callback: function (currIndex) {
                that.pagePrams.pageNum = currIndex;//分页保持
                that.getDataList();
            }
        });
    },
}


