// $(function () {
//     var url = window.location.href;
//     sessionStorage.setItem('src_factory',url);
// })

//主框架公共函数
var Common = {
    loadIndex: 0,
    copyright: "Copyright © 2017 - 2018  制宝科技 版权所有",
    getUrl: function () {
        //获取接口地址
        return {
            // //开发
            // "logistics": "http://192.168.1.150:8082",
            // "manager": "http://192.168.1.150:8082",
            // "order": "http://192.168.1.150:8082",
            // "sso": "http://192.168.1.150:8082",
            // "resource": "http://192.168.1.150:8084",
            // "cosImgUrl": "http://test-1255653994.cos.ap-chengdu.myqcloud.com/",


            ////正式
            //"cosImgUrl": "http://resource-1255653994.coscd.myqcloud.com/",
            // "logistics": "http://118.126.116.76:8080",
            // "manager": "http://118.126.116.76:8081",
            // "order": "http://118.126.116.76:8082",
            // "sso": "http://118.126.116.76:8083",
            // "resource": "http://118.126.116.76:8084",


            //预发布
            "cosImgUrl": "http://resource-1255653994.coscd.myqcloud.com/",
            "logistics": "http://119.27.172.55:8080",
            "manager": "http://119.27.172.55:8081",
            "order": "http://119.27.172.55:8082",
            "sso": "http://119.27.172.55:8083",
            "resource": "http://119.27.172.55:8084",
        };
    },
    getDataInterface: function () {//获取数据接口
        return {
            "all-order": "/zb-order-web/order/allOrder.do",//全部订单
            "waiting-list": "/zb-order-web/order/waitDesign.do",//待接单?待设计
            "waiting-design": "/zb-order-web/order/designing.do",//待设计？设计中
            "waiting-modification": "/zb-order-web/order/againDesign.do",//待修改
            "cancelled": "/zb-order-web/order/cancel.do",//已取消订单
            "completed": "/zb-order-web/order/complete.do",//已完成订单
            "waiting_handle": "/zb-order-web/order/waitHandle.do",//待处理
            "consulting": "/zb-order-web/order/advisory.do",  ///咨询中
            "quotation": "/zb-order-web/order/quotation.do",///报价中？ 未报价
            "hasQuotation": "/zb-order-web/order/hasQuotation.do",//已报价
            "waitDesign": "/zb-order-web/order/waitDesign.do",// 待设计
            "waitConfirm": "/zb-order-web/order/waitUserConfirm.do",// 待用户确认
            "wait-pay": "/zb-order-web/order/waitPayState.do",//待支付
            "waitDistriProduct": "/zb-order-web/order/finalized.do",//定稿 ？ 待分配生产
            "newFactoryOrder": "/zb-order-web/order/newFactoryOrder.do", //新订单？ 待接受生产
            "inProduct": "/zb-order-web/order/inProduction.do",//生产中
            "inMail": "/zb-order-web/order/inMail.do",//邮寄中
            "after-processing": "/zb-order-web/order/inAftermarket.do", //售后处理中
            "inReturns": "/zb-order-web/order/inReturns.do",//退货中
            "inReimburse": "/zb-order-web/order/inReimburse.do",//退款中
            "search": "/zb-order-web/order/orderinfo.do",//搜索订单
            "search_ww": "/zb-order-web/order/orderinfo.do",//搜索旺旺号
            "demand_details": "/zb-order-web/order/orderDetail.do",//获取订单详情
            "update_nav": "/zb-manager-web/workflow/statistics.do",//更新导航数据
            "get_nav": "/zb-manager-web/workflow/show.do",//获取导航区数据

            "order_download": "/zb-order-web/order/downcsv.do",//下载订单
            "comment": "/zb-order-web/designpattern/userfeedback.do",//发起评论
            "designpat": "/zb-order-web/ordersummary/designpat.do",//分配设计
            "updateOrderSummary": "/zb-order-web/order/updateOrderSummary.do",//修改订单的参考信息
            "enquiry": "/zb-order-web/ordersummary/send.do",	//发起询价
            "reminder": "/zb-order-web/designpattern/designerReminders.do",  //催设计稿  催稿
            "confirmReceipt": "/zb-order-web/order/confirmReceipt.do", //确认收货
            "confirmPay": "/zb-order-web/order/confirmPay.do", //确认支付
            "newOrder": "/zb-order-web/order/newOrder.do",	//新建订单
            "priceRuler": "/zb-order-web/order/updateInquiryRule.do",	//更新报价尺的相关价格
            "send": "/zb-order-web/ordersummary/send.do",//发起询价
            "designerReminders": "/zb-order-web/designpattern/designerReminders.do",//崔设计稿
            "allocation": "/zb-order-web/productinfo/allocation.do",//分配生产
            "designate": "/zb-order-web/ordersummary/designate.do",//选定设计方案
            "logistics": "/zb-logistics-web/logistics/logistics.do",//查看物流信息
            "receiving": "/zb-manager-web/service/address.do", ///客服添加收获地址
            "acceptProduction": "/zb-order-web/productinfo/continue.do", //接受生产--车间、工厂
            "uploadLogistics": "/zb-logistics-web/logistics/insertIntoLogistics.do", ///上传物流信息 ---- 车间、工厂

            "uploadResource": "/zb-manager-web/resource/uploadResource.do",//资源库上传
            "getResourceDetail": "/zb-manager-web/resource/getResourceDetail.do",//获取资源详情
            "addResourLabel": "/zb-manager-web/resource/addResourLabel.do",//打标签
            "downloadCount": "/zb-manager-web/resource/downloadCount.do",//统计下载次数
            "autoPrice": "/zb-order-web/order/autoPrice.do",//自动报价
            "getResourceType": "/zb-manager-web/resource/getResourceType.do",//获取素材类型
            "getDownloadPoint": "/zb-manager-web/resource/getDownloadPoint.do",//获取下载点数

            "downDesginrofit": "/zb-order-web/order/downDesginrofit.do",//导出奖金单
            "exportCsv": "/zb-order-web/order/exportCsv.do",//导出发货单
            "editPassword": "/zb-sso-web/user/editPassword.do",//修改密码
            "material": "/zb-order-web/order/material.do",//新建订单获取材质

            "updateTaxRate":"/zb-order-web/order/updateTaxRate.do",//修改税率
            "deleByCustomid":"/zb-order-web/order/deleByCustomid.do",//删除订单
            "selectAllLogisticscompany":"/zb-logistics-web/logistics/selectAllLogisticscompany.do",//获取物流公司列表
            "editDesign":"/zb-order-web/designpattern/editDesign.do",//经理修改设计稿
            "invoiceList":"/zb-order-web/order/invoice.do",//发票概览
            "newInvoice":"/zb-order-web/invoice/newInvoice.do",//开发票确定按钮
            "markInvoiced":"/zb-order-web/order/markInvoiced.do",//标记已开
            "getInvoiceInfo":"/zb-order-web/invoice/getInvoiceInfo.do",//获取发票信息
            "invoiceDetail":"/zb-order-web/order/invoiceDetail.do",//开票详情
            "uploadFacImages":"/zb-order-web/order/uploadFacImages.do",//发货图
            "getFacImages":"/zb-order-web/order/getFacImages.do",//查看发货图
            "checkOrder":"/zb-order-web/order/checkOrder.do",//核对订单
            "beforeAllocation":"/zb-order-web/productinfo/beforeAllocation.do",//分配生产前检查
            "exportIncomeList":"/zb-order-web/order/exportIncomeList.do",//经理导出车间收益单
            "beforeAllocationDesin":"/zb-order-web/productinfo/beforeAllocationDesin.do",//客服分配生产前上传设计稿
            "managerOrder":"/zb-order-web/order/managerOrder.do",//经理订单管理初始化+拉取列表
            "managerOrderSerach":"/zb-order-web/order/managerOrderSerach.do",//经理订单管理 搜索+转接订单初始化
            "managerOrderRevice":"/zb-order-web/order/managerOrderRevice.do",//接口名称: 经理订单管理 工厂+设计师转单
            "newBox":"/zb-order-web/order/newBox.do",//新增或修改盒子
            "getBoxInfo":"/zb-order-web/order/getBoxInfo.do",//获取盒子信息
            "orderBox":"/zb-order-web/order/orderBox.do",//盒子待处理已处理
            "markBox":"/zb-order-web/order/markBox.do",//盒子标记已开
            "boxDetail":"/zb-order-web/order/boxDetail.do",//盒子详情
        };
    },
    functionalInterface: function () {//功能接口
        return {
            "robbery": "/zb-order-web/designpattern/continue.do",//抢单
            "submit_design": "/zb-order-web/ordersummary/submit.do",//提交设计
            "exit_system": "/zb-sso-web/user/exitDele.do"//退出系统
        };
    },
    date: {
        getDate: function () {
            //获取当前时间
            var date = new Date();
            var seperator1 = "-";
            var seperator2 = ":";
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
            return currentdate;
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
        getCurrentMonthLast: function () {
            //获取当前月最后一天
            var current = new Date();
            var currentMonth = current.getMonth();
            var nextMonth = ++currentMonth;
            var nextMonthDayOne = new Date(current.getFullYear(), nextMonth, 1);
            var minusDate = 1000 * 60 * 60 * 24;
            return new Date(nextMonthDayOne.getTime() - minusDate).Format("yyyy-MM-dd");
        }
    },
    ajax: function (url, param, async, successCallback, errerCallback, method, islock) {
        //请求方式
        if (islock == null) {
            islock = true;
        }

        if (!method)
            method = "get";

        if (islock)
            Common.loadIndex = Common.load();

        if (!async) {
            async = false;
        }
        $.ajax({
            type: method,
            url: url,
            data: param,
            dataType: 'json',
            async: async,
            success: function (data) {
                if (islock)
                    Common.loadClose(Common.loadIndex);
                successCallback(data);
                setTimeout(function () {
                    Common.loadClose(Common.loadIndex);
                }, 5000);
            },
            error: function (data) {
                if (errerCallback) {
                    Common.loadClose(Common.loadIndex);
                    errerCallback(data);
                }
                // else {
                //     if (islock)
                //         Common.loadClose(Common.loadIndex);
                //     Common.msg("网络异常，请稍后重试");
                // }
            },
        });
    },
    load: function () {
        return top.layer.open({type: 3, icon: 2, shade: 0.01,});
    },
    loadClose: function (index) {
        top.layer.close(index);
    },
    confirm:function (title,message,width,height,hideCancel,callback) {
        var layerIndex={};

        var btn=hideCancel?['确定']:['确定','取消'];

        var index=layer.confirm(message, {
            btn: btn,
            area:[width+'px', height+'px'],
            title: title,
        }, function(){
            if(callback)
            {
                callback();
            }
            else
            {
                close();
            }
        }, function(){
            close();
        });
        layerIndex[title]=index;

        function close() {
            var curindex=layerIndex[title];
            if(typeof curindex != "undefined"&& curindex!=null)
            {
                delete layerIndex[title];
                layer.close(curindex);
            }
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
    download: function (url,fileName) {//打开新页面下载
        var aDoc=document.createElement("a");
        aDoc.href=url;
        aDoc.click();

        if (navigator.userAgent.indexOf("Firefox") > -1)
            window.location=url;

    },
    msg: function (msg, icon, time, callback) {
        if (!icon) {
            icon = 0;
        }
        if (!time) {
            time = 2000;
        }
        //0:感叹号,1：对号,2：错误,3:问号
        switch (icon) {
            case 200:
                icon = 1;
                break;
            case 400:
            case 404:
                icon = 2;
                break;
            case 405:
            case 406:
            case 408:
                icon = 0;
                break;
            default:
                icon = icon;
                break;
        }
        ;
        layer.msg(msg, {icon: icon, time: time, shade: 0.01}, callback);
    },
    getTimestamp: function () {
        var timestamp = Date.parse(new Date());
        timestamp = timestamp / 1000;
        return timestamp;
    },
    convertInt: function (data) {//返回整数
        return parseInt(data) || '';
    },
    convertFloat: function (data) {//返回整数
        var temp = parseFloat(data);
        if (temp) {
            temp = temp.toFixed(1)
        }
        return temp || '';
    },
    shake: function (ele, cls, times) {//边框闪烁
        var i = 0, t = false, times = times || 2;
        if (t) return;
        t = setInterval(function () {
            i++;
            ele.addClass(cls);
            if (i == 2 * times) {
                clearInterval(t);
                ele.removeClass(cls);
            }
        }, 200);
    },
    emptyList: function (dom) { //车间 客服没有数据的情况下展示的dom  dom:需要拼接的jquery对象
        var html = '<div class="empty-list">';
        html += '<p><img src="../../images/icon/bj_ico.jpg"></p>';
        html += '<p class="msg" style="color: #858585">您还没有相关订单！</p>';
        html += '</div>';
        dom.html(html);
    },
    dragBind: function (domObj, inputFileObj,inCss,outCss) {//拖拽上传事件绑定
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
    PopResetPasswords:function () {//弹出重置密码窗口
        layer.open({
            type: 2,
            title: '',
            shadeClose: false,
            shade: 0.1,
            area: ['360px', '240px'],
            content: '../resetPassword.html'
        });
    }
};


//定义函数，只输入数字和一位小数
function clearNoNum(obj) {
    obj.value = obj.value.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符
    obj.value = obj.value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
    obj.value = obj.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d).*$/, '$1$2.$3');//只能输入两个小数

    if (obj.value.indexOf(".") < 0 && obj.value != "") {//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
        obj.value = parseFloat(obj.value);
    }
}


//方法扩展
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
}

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

var isHaveAddress = false;//是否有收货地址

$(function () {

    function MoneyToFloat(val) { //将字符串类型的金额转成float类型
        if (isNaN(val)) {
            val = val.replace(/[^0-9-.]/g, '');
        }
        return parseFloat(val);
    }

    $(".input-number").keyup(function () {
        ConvertToInt($(this)[0]);
    });
    function ConvertToInt(ob) {
        ob.value = ob.value.replace(/[^0-9]/g, '');
    }

    // *************验证只允许输入金额格式-begin
    $(".input-money").focus(function () {
        var stringVal = $(this);

        var floatVal = MoneyToFloat(stringVal.val()||"0");
        if(floatVal==0)
            floatVal="";
        stringVal.val(floatVal);
    });

    $(".input-money").keyup(function () {
        var curobj = $(this);
        var reg = curobj.val().match(/(-?\d+\.?\d{0,2})|-/);
        var txt = '';
        if (reg != null) {
            txt = reg[0];
        }
        curobj.val(txt);
    });

    $(".input-money").blur(function () {
        var curobj = $(this);
        var val = parseFloat(curobj.val());
        curobj.val(val.formatMoney(2, "", ",", "."));
    });
    // *************验证只允许输入金额格式-begin

    // *************验证只允许输入保留两位小数的浮点型数据-begin
    $(".input-float-2").keyup(function () {
        var curobj = $(this);
        var reg = curobj.val().match(/(-?\d+\.?\d{0,2})|-/);
        var txt = '';
        if (reg != null) {
            txt = reg[0];
        }
        curobj.val(txt);
    });

    $(".input-float-2").blur(function () {
        var curobj = $(this);
        var val = parseFloat(curobj.val()).toFixed(2);
        if (val == "NaN") {
            var defaultVal = $(curobj).attr('data-default');
            if (defaultVal) {
                curobj.val(defaultVal);
            }
            else {
                curobj.val("0.00");
            }
        }
        else
        {
            curobj.val(val);
        }
    })
    // *************验证只允许输入保留两位小数的浮点型数据-begin
});