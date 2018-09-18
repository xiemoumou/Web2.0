/**
 * Created by inshijie on 2018/6/12.
 */
// *************************************************************
// *************************************************************
// *************************************************************
// *************************************************************
// 系统配置
var config = {
    Domain: {
        "systemApi": "http://192.168.1.50:81",
        //"systemApi": "http://192.168.88.1:81",
    },
    WebService: function () {
        var that = this;
        return {
            "getSysParam":that.Domain.systemApi + "/dynamo/sysInitialize/getSysParam",//初始化参数
            "createOrderId": that.Domain.systemApi + "/dynamo/order/createCustomid",//创建订单id
            "orderSummaryInfo_Insert": that.Domain.systemApi + "/dynamo/order/orderSummaryInfo_Insert",//新建订单
            "autoPrice":that.Domain.systemApi + "/dynamo/order/auto_price",//自动报价
            "sendDesign":that.Domain.systemApi + "/design/sendDesign",//分配设计
            "order_Finally":that.Domain.systemApi + "/dynamo/order/order_Finally",//定价
            "order_PayFinally":that.Domain.systemApi + "/dynamo/order/order_PayFinally",//确认支付
            "logisticsCompany_Query":that.Domain.systemApi + "/dynamo/order/logisticsCompany_Query",//获取快递公司列表
            "orderProductInfoImages_Query":that.Domain.systemApi +"/dynamo/order/orderProductInfoImages_Query",//查看成品图
            "logistics_Upload":that.Domain.systemApi +"/dynamo/order/logistics_Upload",//编辑物流信息
            "select_Logistics":that.Domain.systemApi + "/dynamo/order/select_Logistics",//查看物流信息
            "continue_Production":that.Domain.systemApi + "/dynamo/order/continue_Production",//继续分配
            "distribut_Production":that.Domain.systemApi + "/dynamo/order/distribut_Production",//分配生产前检查
            "updateOrderQuoteItem":that.Domain.systemApi +"/dynamo/order/updateOrderQuoteItem",//影响报价数据编辑
            "orderSupplementary_Query": that.Domain.systemApi + "/dynamo/order/orderSupplementary_Query",//订单概览
            "business_Query":that.Domain.systemApi + "/dynamo/order/business_Query",//左侧业务栏
            "orderProductInfoUpdateImages":that.Domain.systemApi + "/dynamo/order/orderProductInfoUpdateImages",//编辑上传成品图
            "orderLogisticsStatus_Update":that.Domain.systemApi + "/dynamo/order/orderLogisticsStatus_Update",//确认收货
            "orderSupplementary_Search":that.Domain.systemApi +"/dynamo/order/orderSupplementary_Search",//搜索
            "orderDesignInfo_Update":that.Domain.systemApi +"/dynamo/order/orderDesignInfo_Update",//设计师抢单
            "orderSupplementaryCount_Query":that.Domain.systemApi +"/dynamo/order/orderSupplementaryCount_Query",//统计
            "orderProductInfoAccept_Update":that.Domain.systemApi +"/dynamo/order/orderProductInfoAccept_Update",//接受生产
            "messageCount":that.Domain.systemApi +"/dynamo/message/messageCount",//获取消息条数
            "messageSummary_Query":that.Domain.systemApi +"/dynamo/message/messageSummary_Query",//获取消息信息
            "orderSummaryInfo_Update":that.Domain.systemApi +"/dynamo/order/orderSummaryInfo_Update",//删除订单
            "markedUpRead":that.Domain.systemApi +"/dynamo/message/markedUpRead",//标记已读
            "batchMarkedUpRead":that.Domain.systemApi +"/dynamo/message/batchMarkedUpRead",//全部标记已读
            "orderBoxInsert_Insert":that.Domain.systemApi +"/dynamo/order/orderBoxInsert_Insert",//保存盒子
            "orderBoxAll_Query":that.Domain.systemApi +"/dynamo/order/orderBoxAll_Query",//获取盒子信息
            "orderProductInfoWaitProduct":that.Domain.systemApi +"/dynamo/order/orderProductInfoWaitProduct",//拉取列表与数量统计
            "orderDesignInfoSearch_Query":that.Domain.systemApi +"/dynamo/order/orderDesignInfoSearch_Query",//查询转接订单
            "orderSummaryInfoByOrderid":that.Domain.systemApi +"/dynamo/order/orderSummaryInfoByOrderid",//转接到列表
            "orderDesignInfoDesignTransfer_Update":that.Domain.systemApi +"/dynamo/order/orderDesignInfoDesignTransfer_Update",//转接操作
            "orderDesignPatternById_Query":that.Domain.systemApi +"/dynamo/order/orderDesignPatternById_Query",//修正设计稿回显
            "orderInvoicePage_Query":that.Domain.systemApi +"/dynamo/order/orderInvoicePage_Query",//票据概览
            "orderInvoiceSign_Update":that.Domain.systemApi +"/dynamo/order/orderInvoiceSign_Update",//发票标记已开
            "orderInvoiceDetail_Query":that.Domain.systemApi +"/dynamo/order/orderInvoiceDetail_Query",//发票明细





            "AccountInfo_Insert": that.Domain.systemApi + "/dynamo/user/userAccountInfo_Insert",//注册
            "userAccountInfo_Query": that.Domain.systemApi + "/dynamo/user/userAccountInfo_Query",//登陆
            "userPassword_Update": that.Domain.systemApi + "/dynamo/user/userPassword_Update",//修改密码
            "uploadImage": that.Domain.systemApi + "/dynamo/order/uploadImage",//上传图片
            "uploadAccessory": that.Domain.systemApi + "/dynamo/order/uploadAccessory",//文件上传
            "orderQuoteInfo_Insert":that.Domain.systemApi + "/dynamo/order/orderQuoteInfo_Insert",//报价
            "orderInquiryInfo_Query":that.Domain.systemApi + "/dynamo/order/orderInquiryInfo_Query",//发起询价
            "orderBargin_Query":that.Domain.systemApi + "/dynamo/order/orderBargin_Query",//发起议价
            "orderBargin_Doit":that.Domain.systemApi + "/dynamo/order/orderBargin_Doit",//处理议价
            "designFee_Init":that.Domain.systemApi + "/dynamo/order/designFee_Init",//设计费编辑初始化
            "designFee_Submit":that.Domain.systemApi + "/dynamo/order/designFee_Submit",//设计费点确定按钮
            "orderSummaryInfo_Query":that.Domain.systemApi + "/dynamo/order/orderSummaryInfo_Query",//订单详情
            "orderSummaryInfoAccessory_Update":that.Domain.systemApi + "/dynamo/order/orderSummaryInfoAccessory_Update",//提交修改
            "logistics_Info":that.Domain.systemApi + "/dynamo/order/logistics_Info",//编辑添加收货地址
            "custom_Quotation":that.Domain.systemApi + "/dynamo/order/custom_Quotation",//客服报价接口
            "updatePrice":that.Domain.systemApi + "/dynamo/order/updatePrice",//修改价格
            "orderDesignPattern_Query":that.Domain.systemApi +"/dynamo/order/orderDesignPattern_Query",//查询设计方案
            "orderDesignPattern_Insert":that.Domain.systemApi +"/dynamo/order/orderDesignPattern_Insert",//提交设计单
            "orderDesignMessage_Query":that.Domain.systemApi +"/dynamo/order/orderDesignMessage_Query",//显示留言
            "orderDesignMessage_Insert":that.Domain.systemApi +"/dynamo/order/orderDesignMessage_Insert",//提交留言
            "chooseDesign":that.Domain.systemApi +"/dynamo/order/chooseDesign",//选定设计稿
            "invoice_Update":that.Domain.systemApi +"/dynamo/order/invoice_Update",//发票编辑新增
            "invoice_Init":that.Domain.systemApi +"/dynamo/order/invoice_Init",//票据明细初始化
            "logistics_Check":that.Domain.systemApi +"/dynamo/order/logistics_Check",//核对订单
            "orderBoxInfoPage_Query":that.Domain.systemApi +"/dynamo/order/orderBoxInfoPage_Query",//经理包装盒代开已开
            "orderBoxDetail_Query":that.Domain.systemApi +"/dynamo/order/orderBoxDetail_Query",//包装盒详情
            "orderLogisticsBillOrder_Query":that.Domain.systemApi +"/dynamo/order/orderLogisticsBillOrder_Query",//经理导出发货单
            "exportYieldList":that.Domain.systemApi +"/dynamo/order/exportYieldList",//经理导出结算收益单
            "downManOrder":that.Domain.systemApi +"/dynamo/order/downManOrder",//下载生产单
            "algorithmTrainningInsert":that.Domain.systemApi +"/dynamo/order/algorithmTrainningInsert",//新增自动报价
        }
    }
};


// *************************************************************
// *************************************************************
// *************************************************************
// *************************************************************
// 方法扩展
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

// Extend the default Number object with a formatMoney() method:
// usage: someVar.formatMoney(decimalPlaces, symbol, thousandsSeparator, decimalSeparator)
// defaults: (2, "$", ",", ".")
Number.prototype.formatMoney = function (places, symbol, thousand, decimal) {
    places = !isNaN(places = Math.abs(places)) ? places : 2;
    symbol = symbol !== undefined ? symbol : "$";
    thousand = thousand || ",";
    decimal = decimal || ".";
    var number = this,
        negative = number < 0 ? "-" : "",
        i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
};

Number.prototype.toFixed = function (d) {
    var s = this + "";
    if (!d) d = 0;
    if (s.indexOf(".") == -1) s += ".";
    s += new Array(d + 1).join("0");
    if (new RegExp("^(-|\\+)?(\\d+(\\.\\d{0," + (d + 1) + "})?)\\d*$").test(s)) {
        var s = "0" + RegExp.$2, pm = RegExp.$1, a = RegExp.$3.length, b = true;
        if (a == d + 2) {
            a = s.match(/\d/g);
            if (parseInt(a[a.length - 1]) > 4) {
                for (var i = a.length - 2; i >= 0; i--) {
                    a[i] = parseInt(a[i]) + 1;
                    if (a[i] == 10) {
                        a[i] = 0;
                        b = i != 1;
                    } else break;
                }
            }
            s = a.join("").replace(new RegExp("(\\d+)(\\d{" + d + "})\\d$"), "$1.$2");

        }
        if (b) s = s.substr(1);
        return (pm + s).replace(/\.$/, "");
    }
    return this + "";
};


// *************************************************************
// *************************************************************
// *************************************************************
// *************************************************************
//*********************************输入框验证-begin
$(function () {

    inputCheck();

});

function inputCheck() {
    //阻止选择网页内容
    // document.onselectstart = function () {
    //     return false;
    // };

    function MoneyToFloat(val) { //将字符串类型的金额转成float类型
        if (isNaN(val)) {
            val = val.replace(/[^0-9-.]/g, '');
        }
        return parseFloat(val);
    }

    // *************验证只允许输入正整数-begin
    $(".input-number").unbind("keyup");
    $(".input-number").keyup(function () {
        ConvertToInt($(this)[0]);
    });
    function ConvertToInt(ob) {
        ob.value = ob.value.replace(/[^0-9.]/g, '');
    }

    // ************* 验证只允许输入正整数-end

    // *************验证只允许输入保留一位小数的浮点型数据-begin
    $(".input-float-1").unbind("keyup");
    $(".input-float-1").keyup(function () {
        var curobj = $(this);
        var reg = curobj.val().match(/(-?\d+\.?\d{0,1})|-/);
        var txt = '';
        if (reg != null) {
            txt = reg[0];
        }
        curobj.val(txt);
    });

    $(".input-float-1").unbind("blur");
    $(".input-float-1").blur(function () {
        var curobj = $(this);
        var val = parseFloat(curobj.val()).toFixed(1);
        if (val == "NaN") {
            var defaultVal = $(curobj).attr('data-default');
            if (defaultVal) {
                curobj.val(defaultVal);
            }
            else {
                curobj.val("0.0");
            }
        }
        else {
            curobj.val(val);
        }
    })
    // *************验证只允许输入保留一位小数的浮点型数据-begin

    // *************验证只允许输入保留两位小数的浮点型数据-begin
    $(".input-float-2").unbind("keyup");
    $(".input-float-2").keyup(function () {
        var curobj = $(this);
        var reg = curobj.val().match(/(-?\d+\.?\d{0,2})|-/);
        var txt = '';
        if (reg != null) {
            txt = reg[0];
        }
        curobj.val(txt);
    });

    $(".input-float-2").unbind("blur");
    $(".input-float-2").blur(function () {
        var curobj = $(this);
        var val = parseFloat(curobj.val())/*.toFixed(2)*/;
        if (isNaN(val)) {
            var defaultVal = $(curobj).attr('data-default');
            if (defaultVal) {
                curobj.val(defaultVal);
            }
            else {
                curobj.val("0.00");
            }
        }
        else {
            curobj.val(val);
        }
    })
    // *************验证只允许输入保留两位小数的浮点型数据-begin

    // *************验证只允许输入金额格式-begin
    $(".input-money").unbind("focus");
    $(".input-money").focus(function () {
        var stringVal = $(this);
        var floatVal = MoneyToFloat(stringVal.val());
        if (floatVal == 0)
            floatVal = "";
        stringVal.val(floatVal);
    });

    $(".input-money").unbind("keyup");
    $(".input-money").keyup(function () {
        var curobj = $(this);
        var reg = curobj.val().match(/(-?\d+\.?\d{0,2})|-/);
        var txt = '';
        if (reg != null) {
            txt = reg[0];
        }
        curobj.val(txt);
    });

    $(".input-money").unbind("blur");
    $(".input-money").blur(function () {
        var curobj = $(this);
        var val = parseFloat(curobj.val());
        curobj.val(val.formatMoney(2, "", ",", "."));
    });
    // *************验证只允许输入金额格式-begin


    //金额类型中提取浮点形数据
    //.replace(/[^0-9-.]/g, '');
}


// *************************************************************
// *************************************************************
// *************************************************************
// *************************************************************
//工具类
var Helper = {
    Date: {
        timeDifference:function (begin,end) {
          //计算时间差 返回相差秒数
            if(begin.replace)
            {
                begin=begin.replace(/\-/g, "/");
                end=end.replace(/\-/g, "/");
            }
            var d1 = new Date(begin);
            var d2 = new Date(end);
            return parseInt(d2 - d1)/ 1000;
        },
        countdown:function (tagDate) {
            //倒计时
            var now = new Date();
            if(tagDate.replace)
            {
                tagDate=tagDate.replace(/\-/g, "/");
            }

            var endDate = new Date(tagDate);
            var leftTime=endDate.getTime()-now.getTime();
            var dd = parseInt(leftTime / 1000 / 60 / 60 / 24, 10);//计算剩余的天数
            var hh = parseInt(leftTime / 1000 / 60 / 60 % 24, 10);//计算剩余的小时数
            var mm = parseInt(leftTime / 1000 / 60 % 60, 10);//计算剩余的分钟数
            var ss = parseInt(leftTime / 1000 % 60, 10);//计算剩余的秒数
            dd = checkTime(dd);
            hh = checkTime(hh);
            mm = checkTime(mm);
            ss = checkTime(ss);//小于10的话加0

            function checkTime(i)
            {
                if (i < 10) {
                    i = "0" + i;
                }
                return i;
            }
            
            return dd+"天 "+hh+" 小时 "+mm+" 分钟";
        },
        getDate: function (format) {
            format=format?format:'yyyy-MM-dd hh:mm:ss';
            var date = new Date();
            var milliseconds = date.getTime();
            var newDate = new Date(milliseconds);
            return newDate.Format(format);
        },
        getTimestamp: function (datetime) {
            if(!datetime)
            {
                return 1924905600000
            }
            //获取时间戳
            if(datetime.replace)
            {
                datetime=datetime.replace(/\-/g, "/");
            }

            var timestamp = Date.parse(new Date(datetime));
            timestamp = timestamp;
            return timestamp;
        },
        getLocalTime: function (timespan, format) {
            //时间戳转时间
            /*
             format:
             yyyy-MM-dd
             yyyy-MM-dd hh:mm:ss
             yyyy/MM/dd hh:mm:ss
             yyyy/MM/dd hh:mm
             */
            try {
                if (format) {
                    return new Date(parseInt(timespan) * 1000).Format(format);
                }
            }
            catch (error) {
                console.log(error);
            }
        },
        getCurrentMonthLast: function (m) {
            //获取当前月最后一天
            var current = new Date();
            var currentMonth = current.getMonth();
            var nextMonth = m;
            var nextMonthDayOne = new Date(current.getFullYear(), nextMonth, 1);
            var minusDate = 1000 * 60 * 60 * 24;
            return new Date(nextMonthDayOne.getTime() - minusDate).Format("yyyy-MM-dd");
        },
        getNdayDate: function (n,format) {
            format=format?format:'yyyy-MM-dd hh:mm:ss';
            //获取第N天的日期
            var date = new Date();
            //n代表天数,加号表示未来n天的此刻时间,减号表示过去n天的此刻时间
            var milliseconds = date.getTime() + 1000 * 60 * 60 * 24 * n;
            //getTime()方法返回Date对象的毫秒数,但是这个毫秒数不再是Date类型了,而是number类型,所以需要重新转换为Date对象,方便格式化
            var newDate = new Date(milliseconds);
            return newDate.Format(format);
        }
    },
    getUrlParam: function (name, isdecode) {//第二参数防止中午乱码
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (isdecode) {
            r = decodeURI(window.location.search).substr(1).match(reg);
        }
        if (r != null) return unescape(r[2]);
        return null;
    },
    download: function (url) {//打开新页面下载
        if (navigator.userAgent.indexOf("Firefox") > -1) //火狐浏览器
            window.location = url;
        else //其他浏览器
        {
            var aDoc = document.createElement("a");
            aDoc.href = url;
            aDoc.click();
        }
    },
    shake: function (ele) {//边框闪烁
        var i = 0;
        var times = 3000;
        var t = setInterval(function () {
            i += 200;
            ele.addClass('border-warning');
            if (i >= times) {
                clearInterval(t);
                ele.removeClass('border-warning');
            }
            else if (i / 600 == 0) {
                ele.removeClass('border-warning');
            }
        }, 200);
    },
    dragBind: function (domObj, inputFileObj, inCss, outCss) {//拖拽上传事件绑定
        domObj.ondragover = function (ev) {
            //阻止浏览器默认打开文件的操作
            ev.preventDefault();
            //拖入文件后
            $(this).css(inCss);
        }

        domObj.ondragleave = function () {
            //拖出
            $(this).css(outCss);
        }
        domObj.ondrop = function (ev) {
            //放下
            $(this).css(outCss);
            //阻止浏览器默认打开文件的操作
            ev.preventDefault();
            var files = ev.dataTransfer.files;
            inputFileObj.files = files;
        }
    },
    getStrLeng: function (str) {
        //获取字节数
        var realLength = 0;
        var len = str.length;
        var charCode = -1;
        for (var i = 0; i < len; i++) {
            charCode = str.charCodeAt(i);
            if (charCode >= 0 && charCode <= 128) {
                realLength += 1;
            } else {
                // 如果是中文则长度加2
                realLength += 2;
            }
        }
        return realLength;
    },
    Cache: {//缓存操作
        set: function (key, value,expires) {
            //localStorage.setItem(key, value);

            var data={ path: '/' };
            if(expires)
            {
                data['expires']=expires;
            }
            $.cookie(key, value, data);
        },
        get: function (key) {
            //return localStorage.getItem(key);
            return $.cookie(key);
        }
    },
    Sleep: function (time, callback) {//睡眠函数 time:毫秒
        if (!time) {
            console.error("您在调用Common.Sleep(time,callback)方法时没有传入睡眠时间");
            return;
        }
        var pus = 0;
        var currentDate = new Date();
        while (pus < time) {
            var now = new Date();
            pus = now - currentDate;
        }
        if (callback) {
            callback();
        }
    },
    getStrLeng:function (str){
        var realLength = 0;
        var len = str.length;
        var charCode = -1;
        for(var i = 0; i < len; i++){
            charCode = str.charCodeAt(i);
            if (charCode >= 0 && charCode <= 128) {
                realLength += 1;
            }else{
                // 如果是中文则长度加2
                realLength += 2;
            }
        }
        return realLength;
    },
    CopyToClipboard: function (content, triggerId) {//content：内容,triggerObj:触发复制事件的对象Id
        if (!$("#copyContent")) {
            $('#' + triggerId).attr('data-clipboard-target', '#copyContent');
            document.write('<textarea type="text" style="height: 0px; width: 0px; border: none;" id="copyContent" value="" ></textarea>');
            var clipboard = new ClipboardJS('#' + triggerId);
            clipboard.on('success', function (e) {
                console.info('Action:', e.action);
                console.info('Text:', e.text);
                console.info('Trigger:', e.trigger);

                e.clearSelection();
            });

            clipboard.on('error', function (e) {
                console.error('Action:', e.action);
                console.error('Trigger:', e.trigger);
            });
        }
        $("#copyContent").val(content);
        $('#' + triggerId).click();
    },
    getClientHeight: function () { //获取窗口可视范围的高度
       return $(window).height();
    },
    getClientWidth: function () { //获取窗口可视范围的宽度
        return $(window).width();
    }
};


// *************************************************************
// *************************************************************
// *************************************************************
// *************************************************************
// 弹出页面
var Popup = {
    layerIndex: {},
    callback: {},//弹窗回调
    open: function (title, width, height, url, childCallback) {
        var that = this;
        var index = layer.open({
            type: 2,
            title: title,
            shadeClose: false,
            shade: 0.1,
            area: [width + 'px', height + 'px'],
            resize: false,
            content: url,
        });
        that.layerIndex[title] = index;

        if (childCallback) {
            that.callback[title] = childCallback;
        }
    },
    close: function (title) {
        var that = this;
        if (title != null && title != "") {
            var index = that.layerIndex[title];
            if (typeof index != "undefined" && index != null) {
                delete that.layerIndex[title];
                layer.close(index);
            }
        }
        else {
            layer.closeAll();
            that.callback = {};
        }
    }
};


// *************************************************************
// *************************************************************
// *************************************************************
// *************************************************************
//提示消息
var MsgState = {"Success": 1, "Warning": 2, "Fail": 3};//提示消息状态
var Message = {
    show: function (title, content, status, time, callback,size) {

        title = !title ? title = "提示:" : title;

        time = !time ? 2000 : time;

        var box_shadow = '';
        var msgType = "";
        switch (status) {
            case 1:
                box_shadow = "0 0 6px #659F3D";
                msgType = "success";
                break;
            case 2:
                box_shadow = "0 0 6px #E28327";
                msgType = "Warning";
                break;
            case 3:
                box_shadow = "0 0 6px #E84B4C";
                msgType = "Fail";
                break;
        }

        var html = '<div class="msg-container msg-' + msgType + '-border"> <div class="msg-icon msg-' + msgType + '-icon"></div> <div class="msg-content msg-' + msgType + '-text"><span class="msg-content-title">' + title + '</span><span class="msg-content-content">' + content + '</span></div> </div>';
        var data={
            type: 1,
            icon: 1,
            content: html,
            time: time,
        };
        if(size) {
            data["area"] = [size.width + 'px', size.height + 'px'];
        }

        var index = layer.msg("",data , callback);
        $("#layui-layer" + index).css("box-shadow", box_shadow);
    }
};


// *************************************************************
// *************************************************************
// *************************************************************
// *************************************************************
// 会话窗口
var Confirm = function (title, message, width, height, hideCancel, callback) {
    var layerIndex = {};
    var btn = hideCancel ? ['确定'] : ['确定', '取消'];

    var index = layer.confirm(message, {
        btn: btn,
        area: [width + 'px', height + 'px'],
        title: title,
    }, function () {
        if (callback) {
            callback();
            close();
        }
        else {
            close();
        }
    }, function () {
        close();
    });
    layerIndex[title] = index;

    function close() {
        var curindex = layerIndex[title];
        if (typeof curindex != "undefined" && curindex != null) {
            delete layerIndex[title];
            layer.close(curindex);
        }
    }
};

// *************************************************************
// *************************************************************
// *************************************************************
// *************************************************************
//请求
var Loading = {//加载效果
    start: function (params) {
        var index = layer.load(2, params);
    },
    end: function () {
        layer.closeAll('loading');
    }
}
var Requst = {
    ajaxPost: function (url, data, isAsync, successCallback, errerCallback, hideLoading) {
        if (!hideLoading)Loading.start();
        var token = Helper.Cache.get('token');
        $.ajax({
            type: 'Post',
            url: url,
            data: data,
            dataType: 'json',
            async: isAsync,
            headers: {"token": token},
            timeout: 10000,
            success: function (data) {
                if(data.code && data.code=="99999" || data.code=="99998")
                {
                    //根据后台返回结果判断token是否过期，过期则退出系统
                    top.window.location.href="./Member/login.html";
                }
                if (!hideLoading)Loading.end();
                successCallback(data);
            },
            error: function (data) {
                if (!hideLoading)Loading.end();
                if (errerCallback) {
                    errerCallback(data);
                }
                else {
                    Message.show('操作失败', '服务器无响应。', MsgState.Fail, 2000);
                    console.warn("请求异常");
                }
            },
        });
    },
    ajaxGet: function (url, data, isAsync, successCallback, errerCallback, hideLoading) {
        if (!hideLoading)Loading.start();
        var token = Helper.Cache.get('token');
        $.ajax({
            type: 'Get',
            url: url,
            data: data,
            dataType: 'json',
            async: isAsync,
            headers: {"token": token},
            timeout: 10000,
            success: function (data) {
                if(data.code && data.code=="99999" || data.code=="99998")
                {
                    //根据后台返回结果判断token是否过期，过期则退出系统
                    top.window.location.href="./Member/login.html";
                }
                if (!hideLoading)Loading.end();
                successCallback(data);
            },
            error: function (data) {
                if (!hideLoading)Loading.end();
                if (errerCallback) {
                    errerCallback(data);
                }
                else {
                    Message.show('操作失败', '服务器无响应。', MsgState.Fail, 2000);
                    console.warn("请求异常");
                }
            },
        });
    }
}

//将id转换成名称
function ConvertIdToName(dataSource,idArray) {
    var idarray=idArray.split(',');
    var temp=[];
    for(var w=0;w<idarray.length;w++)
    {
        if(idarray[w] && dataSource[idarray[w]])
        {
            temp.push(dataSource[idarray[w]].name);
        }
    }
    return temp;
}

var OPER={
    checkOrder:function (customid,title) {
        title=title?title:"核对订单";
        // 流程弹窗
        var scrollH = top.Helper.getClientHeight();
        var scrollW = top.Helper.getClientWidth();
        var popH = scrollH - 100 > 550 ? 550 : scrollH - 100;
        Popup.open(title, 939, popH, "./Pop-ups/checkOrder.html?customid="+customid+"&allocationProduce=true");
    },
    invoice:function (customid,title) {
        title=title?title:"发票收据";
        // 流程弹窗
        var scrollH = top.Helper.getClientHeight();
        var scrollW = top.Helper.getClientWidth();
        var popH = scrollH - 100 > 610 ? 610 : scrollH - 100;
        top.Popup.open(title, 818, popH, "./Pop-ups/invoice.html?customid="+customid);
    },
    box:function (customid,title) {
        title=title?title:"包装";
        // 流程弹窗
        var scrollH = top.Helper.getClientHeight();
        var scrollW = top.Helper.getClientWidth();
        var popH = scrollH - 100 > 550 ? 550 : scrollH - 100;
        top.Popup.open(title, 939, popH, "./Pop-ups/box.html?customid="+customid);
    },
    uploadDesign:function (customid,title) {
        title=title?title:"补充设计稿";
        var scrollH = top.Helper.getClientHeight();
        var popH = scrollH - 100 > 559 ? 559 : scrollH - 100;
        var url=encodeURI("./Pop-ups/uploadDesign.html?customid="+customid+"&title="+title);
        top.Popup.open(title, 830, popH, url);
    },
    invoiceDetails:function (customid,title) {
        title=title?title:"发票明细";
        var scrollH = top.Helper.getClientHeight();
        var popH = scrollH - 100 > 559 ? 559 : scrollH - 100;
        top.Popup.open(title, 560, popH, "./Pop-ups/invoicePreview.html?customid="+customid);
    },
    sendInquiry:function (customid) {
        //发起询价
        var url=config.WebService()['orderInquiryInfo_Query'];
        top.Requst.ajaxGet(url,{"customid":customid},true,function (data) {
            if(data.code==200)
            {
                top.Message.show("提醒",data.message,MsgState.Success,2000,function () {
                    classMain.loadOverview(null,null,null,customid);
                });
            }
            else
            {
                top.Message.show("提醒",data.message,MsgState.Warning,2000,null,{"width":370 ,"height":75});
            }
        });
    },
    distributionDesign:function (ordersummaryId,orderId,customid,designPrice) {
        //分配设计
        Confirm("分配设计","请确认发起设计信息，设计费：<em style='color:#E84B4C;'>¥ "+designPrice+"</em>",423,235,null,function () {
            var url=config.WebService()['sendDesign'];
            top.Requst.ajaxGet(url,{"ordersummaryId":parseInt(ordersummaryId),"orderId":orderId,"customId":customid},true,function (data) {
                if(data.code==200)
                {
                    Message.show("提醒",data.message,MsgState.Success,2000,function () {
                        classMain.loadOverview(null,null,null,customid);
                    });
                }
            });
        });
    },
    pricing:function (customid,currentPeriod,currentPrice,quote,userPeriod,inquiryStatus) {
        //定价
        top.Popup.open("订单定价", 407, 290, "./Pop-ups/orderPrice.html?customid="+customid+"&currentPeriod="+currentPeriod+"&currentPrice="+currentPrice+"&quote="+quote+"&userPeriod="+userPeriod+"&inquiryStatus="+inquiryStatus);
    },
    orderPrice:function (customid,finalPrice) {
        top.Popup.open("订单支付", 407, 240, "./Pop-ups/orderPay.html?customid="+customid+"&finalPrice="+finalPrice);
    },
    distributionProduction:function (customid) {
        //分配生产
        var url=config.WebService()['distribut_Production'];
        top.Requst.ajaxGet(url,{"customid":customid},true,function (data) {
            
            if(data.code==3000)
            {
                top.Popup.open("收货地址", 482, 380, "./Pop-ups/addAddress.html?customid="+customid+"&operType=distributionProduction");
            }
            else if(data.code==3001){
                //发票收据不全,请补充发票收据
                top.OPER.invoice(customid);
            }
            else if(data.code==3002)
            {
                //设计稿未定稿,请先定稿
                top.OPER.uploadDesign(customid);
            }
            else
            {
                //核对订单
                top.OPER.checkOrder(customid,true);//第二个参数告诉核对订单页面分配生产
            }
        });
    },
    productPicture:function (customid,operType,title) {
        //成品图
        if(operType=="prev")
        {
            top.Popup.open("查看成品图", 482, 246, "./Pop-ups/productPicture.html?customid="+customid+"&operType="+operType);
        }
        else if(operType=="edit")
        {
            title=title?title:"编辑成品图";
            top.Popup.open(title, 482, 246, "./Pop-ups/productPicture.html?customid="+customid+"&operType="+operType);
        }
    }
};


//检查浏览器类型
function getBrowserType(){
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    var isOpera = userAgent.indexOf("Opera") > -1;
    if (isOpera) {
        return "Opera"
    }; //判断是否Opera浏览器
    if (userAgent.indexOf("Firefox") > -1) {
        return "FF";
    } //判断是否Firefox浏览器
    if (userAgent.indexOf("Chrome") > -1){
        return "Chrome";
    }
    if (userAgent.indexOf("Safari") > -1) {
        return "Safari";
    } //判断是否Safari浏览器
    if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
        return "IE";
    }; //判断是否IE浏览器
}





