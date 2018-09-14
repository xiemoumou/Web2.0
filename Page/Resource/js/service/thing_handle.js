/**
 * Created by inshijie on 2018/5/28.
 */
$(function () {
    $.ms_DatePicker({
        YearSelector: "#begin_year",
        MonthSelector: "#begin_month",
        DaySelector: "#begin_day"
    });

    $.ms_DatePicker({
        YearSelector: "#end_year",
        MonthSelector: "#end_month",
        DaySelector: "#end_day"
    });

    $(".deliver-next-btn").on("click",function () {
        rofitSingle.getDataList();
    })
    $(".deliver-btn").on("click",function () {
        giveSingle.getDataList();
    })
    $("#deliver_work").on('click',function () {
        rofitSingle.getWorkShop();
    })
    // //设置红点数值
    // var redDot = $("#redDot");
    // parent.Main.redDot(function (data) {
    //
    //     if (data[0].num > 0) {
    //         redDot.removeClass('redDot-none');
    //         redDot.addClass('redDot');
    //         redDot.html(data[0].num);
    //     }
    //
    //     if (data[1].num > 0) {
    //         redDot.removeClass('redDot-none');
    //         redDot.addClass('redDot');
    //         redDot.html(data[1].num);
    //     }
    // });

    $.ms_DatePicker({
        YearSelector: "#bonus_year",
        MonthSelector: "#bonus_month",
        DaySelector: ""
    });

    $.ms_DatePicker({
        YearSelector: "#work_year",
        MonthSelector: "#work_month",
        DaySelector: ""
    });

    thingHandle.init();
    $("#bonus_year ul li").on("click",function () {
        thingHandle.init();
    });

    $("#work_year ul li").on("click",function () {
        thingHandle.init();
    });
});


var thingHandle={
    init:function () {
        $.ms_DatePicker({
            YearSelector: "",
            MonthSelector: "#bonus_month",
            DaySelector: ""
        });
        var curryear=parseInt(new Date().Format("yyyy"));
        var currMonth=parseInt(new Date().Format("MM"));
        $("#bonus_month ul li").each(function (i,item) {

            var currItem=parseInt($(item).text());
            if(currItem>=currMonth&&parseInt($("#bonus_year input").val())==curryear)
            {
                $(item).remove();
            }
        });

        if(parseInt($("#bonus_year input").val())==curryear)
        {
            var curMo=parseInt(new Date().Format("MM"))-1;
            $("#bonus_month input").val(curMo<10?"0"+curMo:curMo);
        }

        //结算单
        $.ms_DatePicker({
            YearSelector: "",
            MonthSelector: "#work_month",
            DaySelector: ""
        });

        $("#work_month ul li").each(function (i,item) {

            var currItem=parseInt($(item).text());
            if(currItem>=currMonth&&parseInt($("#work_year input").val())==curryear)
            {
                $(item).remove();
            }
        });

        if(parseInt($("#work_year input").val())==curryear)
        {
            var curMo=parseInt(new Date().Format("MM"))-1;
            $("#work_month input").val(curMo<10?"0"+curMo:curMo);
        }

    },
};
var rofitSingle= {
    getDataList: function () {
        rofitSingle.getUrl = parent.Common.getUrl();//获取请求接口的URL
        rofitSingle.getDataInterface = parent.Common.getDataInterface();//获取请求数据的接口
        rofitSingle.functionalInterface = parent.Common.functionalInterface();//获取操作功能的接口
        var url = rofitSingle.getUrl["order"] + rofitSingle.getDataInterface["downDesginrofit"];//导出奖金单地址
        //请求数据
        var bonus_year = $("#bonus_year input").val();//获取年
        var bonus_month = $("#bonus_month input").val();//获取月份
        var bonus_date = bonus_year+"-"+bonus_month;
        Common.ajax(url, {
                "rofitTime": bonus_date
            },
            true,
            function (data) {
                if (data&&data.map.code==0) {
                    Common.download(data.map.addRess);
                }
                else if(data.map.code!=0) {
                    Common.msg(data.map.msg,null,2000);
                }

            });



   },
    getWorkShop: function () {
        var userInfo = top.Main.userInfo;//获取用户信息
        rofitSingle.getUrl = parent.Common.getUrl();//获取请求接口的URL
        rofitSingle.getDataInterface = parent.Common.getDataInterface();//获取请求数据的接口
        rofitSingle.functionalInterface = parent.Common.functionalInterface();//获取操作功能的接口
        var url = rofitSingle.getUrl["order"] + rofitSingle.getDataInterface["exportIncomeList"];//导出车间收益单
        //请求数据
        var bonus_year = parseInt($("#work_year input").val());//获取年
        var bonus_month = parseInt($("#work_month input").val());//获取月份
        //var bonus_date = bonus_year+"-"+bonus_month;
        
        data = {
            "year": bonus_year,
            "month": bonus_month,
            "userid": userInfo.userid,
            "token": userInfo.token,
            "roleType":parseInt(userInfo.roletype),
            "commandCode":300,
        }
        Common.ajax(url, data, true, function (data) {
            
            if (data) {
                    Common.download(data.addRess);

                if(data.code!=0) {
                    Common.msg(data.msg,null,2000);
                }

            }
        });





    }

}

var giveSingle= {
    getDataList: function () {
        giveSingle.getUrl = parent.Common.getUrl();//获取请求接口的URL
        giveSingle.getDataInterface = parent.Common.getDataInterface();//获取请求数据的接口
        giveSingle.functionalInterface = parent.Common.functionalInterface();//获取操作功能的接口
        var url = giveSingle.getUrl["order"] + giveSingle.getDataInterface["exportCsv"];//导出发货单地址
        //请求数据

        //开始时间
        var begin_year = $("#begin_year input").val();//获取年
        var begin_month = $("#begin_month input").val();//获取月份
        var begin_day = $("#begin_day input").val();//获取日
        var startdate = begin_year+"-"+begin_month+"-"+begin_day;
        //结束时间
        var end_year = $("#end_year input").val();//获取年
        var end_month = $("#end_month input").val();//获取月份
        var end_day = $("#end_day input").val();//获取日
        var enddate = end_year+"-"+end_month+"-"+end_day;

        Common.ajax(url, {
                "startdate": startdate,
                "enddate": enddate
            },
            true,
            function (data) {

                if (data&&data.status.code==0) {
                    Common.download(data.status.addRess);
                }
                else if(data.map.status!=0) {
                    Common.msg(data.status.msg,null,2000);
                }

            });


    }

}
