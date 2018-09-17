/**
 * Created by inshijie on 2018/7/6.
 */
$(function () {
    $('.nav ul li').on('click',function () {
        $('.nav ul li').removeClass('active');
        var li=$(this);
        li.addClass('active');
        $("#showtype").val(li.attr('data-status'));
        invoList.pagePrams.isInit=-1;
        invoList.getDataList(1);//初始化数据
    });


    invoList.getDataList();//初始化数据
});


var invoList={
    pagePrams: {'curIndex': 1, 'totalPage': 1, 'pageSize': 20, 'isInit': -1},//分页参数
    sign:function (orderid) {//标记已开
        var that=this;
        var data={
            "orderid":orderid,
        };
        var url=config.WebService()["orderInvoiceSign_Update"];
        top.Requst.ajaxPost(url,data,true,function (data) {
            if(data.code==200)
            {
             top.Message.show(" 提示",data.message,MsgState.Success,2000,function () {
                 that.getDataList();
             });
            }
            else {
                Console.log(data.message);
            }
        })
    },
    popDetail:function (ordersummaryId,orderId) {//发票详情
        var scrollH= parent.$(window).height();
            scrollH=560;
        var state=$("#showtype").val();
        top.Popup.open("票据详情",620,scrollH,'./Pop-ups/invoicePreview.html?ordersummaryId='+ordersummaryId+"&state="+state+"&orderId="+orderId,invoList.getDataList);
    },
    getDataList:function (currIndex) {
        if(!currIndex)
        {
            currIndex=invoList.pagePrams.curIndex;
        }

        var that=this;
        var state=$("#showtype").val();
        var data={
            "invoiceStatus":parseInt(state),
            "pageNum":parseInt(currIndex),
            "pageSize":invoList.pagePrams.pageSize,
            "sortType":"desc",
            "sortField":"sendtime"
        };
        var url=config.WebService()["orderInvoicePage_Query"];
        top.Requst.ajaxGet(url,data,true,function (data) {
            var datalist= $("#datalist");
            datalist.html('');
            if(data.code==200 && data.data.pageMessage.rowCount>0)
            {
                invoList.pagePrams.totalPage= Math.ceil(data.data.pageMessage.rowCount / invoList.pagePrams.pageSize);
                data=data.data.pageData;
                for(var i=0;i<data.length;i++)
                {
                    var item=data[i];
                    var tr=$('<tr></tr>');
                    var orderDatetime=item.sendtime?item.sendtime:'';
                    tr.append($('<td style="min-width: 130px">'+orderDatetime+'</td>'));
                    tr.append($('<td style="min-width: 102px;">'+item.orderid+'</td>'));
                    tr.append($('<td><span class="text">'+item.invoiceTitle+'</span></td>'));
                    if(state==2)
                    {
                        tr.append($('<td style="text-align: right; min-width: 180px;"><div class="sign"> </div> <div class="ticket-details"> <span></span> <p onclick="invoList.popDetail(\''+item.ordersummaryId+'\',\''+item.orderid+'\')">票据详情</p> </div></td>'));
                    }
                    else
                    {
                        tr.append($('<td style="text-align: right; min-width: 180px;"><div class="sign"> <span></span> <p onclick="invoList.sign(\''+item.orderid+'\')">标记已开</p> </div> <div class="ticket-details"> <span></span> <p onclick="invoList.popDetail(\''+item.ordersummaryId+'\',\''+item.orderid+'\')">票据详情</p> </div></td>'));
                    }

                    datalist.append(tr);
                }
            }
            invoList.initPage();
        })
    },
    initPage: function () {//初始化分页插件
        var that = this;
        if (invoList.pagePrams.isInit > 0)
            return;
        invoList.pagePrams.isInit = 1;
        $(".page-box").html("");
        $(".page-box").append($("<div id=\"pagination\" class=\"page fl\"></div>"));
        $("#pagination").pagination({
            currentPage: invoList.pagePrams.curIndex,
            totalPage: invoList.pagePrams.totalPage,
            isShow: true,
            count: invoList.pagePrams.pageSize,
            homePageText: "首页",
            endPageText: "尾页",
            prevPageText: "上一页",
            nextPageText: "下一页",
            callback: function (currIndex) {
                invoList.pagePrams.curIndex = currIndex;//分页保持
                invoList.getDataList(currIndex);
            }
        });
    },
}