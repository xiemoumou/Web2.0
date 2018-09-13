/**
 * Created by inshijie on 2018/7/10.
 */
var customid = Helper.getUrlParam('customid') || "";//获取订单号
$(function () {
    Invoice.NoneInvoice($('.radio-select-first'));//默认选中不开发票

     $(".list-1").prop("checked", true);//默认选中地址保持一致
     $(".list-1,.list-2").on('click',function () {
         Invoice.Detailsrece();
     })

    //var isallocation = Common.getUrlParam("allocationProduce");
    // if (isallocation) {
    //     $(".allocation").show();
    //     $(".ok").hide();
    // }//判断是否是分配生产过来的
    $(".add-ress").on('click',function () {
        Invoice.Controller.invoiceAddress();
    })

    //选择发票类型
    $(".select-box ul li").on('click', function () {
        var li = $(this).find('input');
        var thisval = li.attr("data-val");
        $(".remarks-text").removeClass('ml-30');

        if (thisval == 1) {
            Invoice.NoneInvoice(li);//不开发票
            Invoice.Tabdiv();
            Invoice.HeightAuto();
        }
        if (thisval == 2) {
            Invoice.Ordinary(li);//增值税
            $("#mech-invoice")[0].removeAttribute("data-disabled");
            Invoice.Tabdiv();
            Invoice.HeightAuto();
        }
        if (thisval == 3) {
            Invoice.Special(li);//专用发票
            $("#mech-invoice").attr("data-disabled","true");
            Invoice.Tabdiv();
            Invoice.HeightAuto();
        }
        if (thisval == 4) {
            $("input:radio[id='receipt']").attr('checked','true');
            Invoice.Receipt(li)//收据
            $(".tax-rate").addClass('active-none');
            $(".mech").addClass('active-none');
            $(".uncommercially").addClass('active-none');
            $(".receipt-num").removeClass('active-none');
            $(".receipt-unit").removeClass('active-none');
            $("#tax-rate-title").text("品  类：");
            $(".remarks-text").addClass('ml-30');
            Invoice.HeightAuto();
        }
    });

    //非盈利机构点击事件
    $(".mech").on('click', function () {
        if(!$("#mech-invoice").is('[data-disabled]'))
        {
            var no_invoice = $("#no-invoice");//不开票
            var mech_invoice = $("#mech-invoice");//非盈利机构
            if (!no_invoice.prop('checked')) {
                var flag = mech_invoice.prop('checked');
                Invoice.Controller.uncommercially(!flag);
            }
        }

    });
    Invoice.getData();//回显数据


});


var orderInfo = {
    shippingAddress: {//收货地址
        customid: customid,//定制号customid
        name: '',  //收件人
        mobilephone: '', //收件人电话
        postcode: '', //	邮编
        province: '', //省份
        city: '',  //城市
        county: '',  //县区
        address: '', //  收货地址
    },
    data: null,
};



function clearNoNum(obj){//文本框验证
    //修复第一个字符是小数点 的情况.
    if(obj.value !=''&& obj.value.substr(0,1) == '.'){
        obj.value="";
    }
    obj.value = obj.value.replace(/^0*(0\.|[1-9])/, '$1');//解决 粘贴不生效
    obj.value = obj.value.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符
    obj.value = obj.value.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的
    obj.value = obj.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
    obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数
    if(obj.value.indexOf(".")< 0 && obj.value !=""){//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
        if(obj.value.substr(0,1) == '0' && obj.value.length == 2){
            obj.value= obj.value.substr(1,obj.value.length);
        }
    }
}



var Invoice = {

    Controller: {
        uncommercially: function (islock) {//非营利机构锁定与解锁

            var isNoInvoice = $("#no-invoice").prop('s');


            var backColor = islock ? "rgb(245, 242, 242)" : "#fff";

            var inputObj = $(".uncommercially input");
            for (var i = 0; i < inputObj.length; i++) {
                $(inputObj[i]).attr('disabled', islock);
                $(inputObj[i]).css('background-color', backColor);
                if (islock) {
                    $(inputObj[i]).val("");
                }
            }

            var textarea = $(".uncommercially textarea");
            for (var i = 0; i < textarea.length; i++) {
                $(textarea[i]).attr('disabled', islock);
                $(textarea[i]).css('background-color', backColor);
                if (islock) {
                    $(textarea[i]).val("");
                }
            }


            if (islock) {
                $('.mech-checkbox,.mech-img').attr('disabled', 'true');
                $(".mech-checkbox").prop("checked", true);
                $(".mech span").removeClass("js-icon").addClass("active");
            }
            else {
                $('.mech-checkbox,.mech-img').attr('disabled', 'false');
                $(".mech-checkbox").prop("checked", false);
                $(".mech span").removeClass("active").addClass("js-icon");
            }
        },
        invoiceAddress: function () {
            var url = encodeURI('../Pop-ups/addAddress.html?name=' + orderInfo.shippingAddress.name + '&mobilephone=' + orderInfo.shippingAddress.mobilephone + '&postcode=' + orderInfo.shippingAddress.postcode + '&province=' + orderInfo.shippingAddress.province + '&city=' + orderInfo.shippingAddress.city + '&county=' + orderInfo.shippingAddress.county + '&address=' + orderInfo.shippingAddress.address + '&customid=' + customid)
            var scrollH = document.documentElement.scrollHeight - 20;
            if (scrollH > 380) {
                scrollH = 380;
            }
            Popup.open('添加收货地址', 480, scrollH, url);


        },
        saveAddress: function (name, mobilephone, postcode, province, city, county, address) {//保存收获地址
            orderInfo.shippingAddress.name = name;
            orderInfo.shippingAddress.mobilephone = mobilephone;
            orderInfo.shippingAddress.province = province;
            orderInfo.shippingAddress.postcode = postcode;
            orderInfo.shippingAddress.city = city;
            orderInfo.shippingAddress.county = county;
            orderInfo.shippingAddress.address = address;
            Invoice.Controller.initAddress();//初始化收件地址
        },
        initAddress: function () {
            $(".cons").html(orderInfo.shippingAddress.name);
            $(".code").html(orderInfo.shippingAddress.postcode);
           //$(".deta-add").html(orderInfo.shippingAddress.address);
            $(".tele").html(orderInfo.shippingAddress.mobilephone);
            $(".deta-add").html(orderInfo.shippingAddress.address+orderInfo.shippingAddress.province + orderInfo.shippingAddress.city + orderInfo.shippingAddress.county);
            if (orderInfo.shippingAddress.name) {
                $('.address-empty').addClass('hide');
                $('.address-text-box').removeClass('hide');
                // layer.closeAll();
            }
        },
        basedata: function (islock) { //基础输入框锁定
            var databaseInput = $('.database input');
            var backColor = islock ? "rgb(245, 242, 242)" : "#fff";
            for (var i = 0; i < databaseInput.length; i++) {
                $(databaseInput[i]).attr('disabled', islock);
                $(databaseInput[i]).css('background-color', backColor);


                if (islock) {
                    $(databaseInput[i]).val("");
                    $(".receipt-input").val("");
                    $(".remarks-text").val("");
                }
            }


            var select = $(".database select");
            for (var i = 0; i < select.length; i++) {
                $(select[i]).attr('disabled', islock);
                $(select[i]).css('background-color', backColor);

                if (islock) {
                    $(select[i]).val("0");
                }
            }
        }
    },
    data: {},
    NoneInvoice: function (ojb) {//不开发票
        var that = this;
        that.Controller.uncommercially(true);//锁定非营利机构按钮
        that.Controller.basedata(true);

        $(ojb).parent().find('.radio-select-first').prop("checked", true);
        $(ojb).parent().find('.radio-select').prop("checked", true);
        $(ojb).parent().children().last().removeClass("js-icon").addClass("active");
        $(ojb).parent().siblings().children("span").removeClass("active").addClass("js-icon");

    },
    Ordinary: function (obj) {//增值税
        var that = this;
        that.Controller.uncommercially(false);//锁定非营利机构按钮
        that.Controller.basedata(false);

        $(".rate-select,.rise-text,.money-text,.invoice-select").attr("disabled", false).css({
            "background-color": "#fff",
            "color": "#444"
        });
        $(obj).parent().find('.radio-select-second').prop("checked", true);
        $(obj).parent().children().last().removeClass("js-icon").addClass("active");
        $(obj).parent().siblings().children("span").removeClass("active").addClass("js-icon");
        $('.mech-checkbox,.mech-img').removeAttr("disabled");
        $(".mech-checkbox").prop("checked", false);
        $(".mech span").removeClass("active").addClass("js-icon");
    },
    Special: function (obj) {//专用发票
        var that = this;
        that.Controller.uncommercially(false);//锁定非营利机构按钮
        that.Controller.basedata(false);

        $(".rate-select,.rise-text,.money-text,.invoice-select").attr("disabled", false).css({
            "background-color": "#fff",
            "color": "#444"
        });
        $(obj).parent().find('.radio-select-third').prop("checked", true);
        $(obj).parent().children().last().removeClass("js-icon").addClass("active");
        $(obj).parent().siblings().children("span").removeClass("active").addClass("js-icon");
        $('.mech-checkbox,.mech-img').removeAttr("disabled");
        $(".mech-checkbox").prop("checked", false);
        $(".mech span").removeClass("active").addClass("js-icon");
    },
    Receipt: function (ojb) {//收据
        var that = this;
        $(ojb).parent().find('.radio-select-fourth').prop("checked", true);
        $(ojb).parent().children().last().removeClass("js-icon").addClass("active");
        $(ojb).parent().siblings().children("span").removeClass("active").addClass("js-icon");
        that.Controller.basedata(false);

    },
    Detailsrece: function () {
        $(".rece-type div").on('click',function () {
            var val_payPlatform = $('.rece-type input[name="sex"]:checked ').attr('data-val');
            if (val_payPlatform==0){
                $(".rece-text-content").addClass('hide');
            }else{
                $(".rece-text-content").removeClass('hide');
            }
            $(this).children().first().prop("checked", true);
            $(this).children().last().removeClass("js-icon").addClass("active");
            $(this).siblings().children("span").removeClass("active").addClass("js-icon");
        })
        // //$(".list-1").parent().find('.list-1').prop("checked", true);
        // $(".list-1").parent().children().last().removeClass("js-icon").addClass("active");
        // $(".list-1").parent().siblings().children("span").removeClass("active").addClass("js-icon");
    },
    HeightAuto: function () {//高度自适应
        var docHeight= $(".container").height();
        top.setPopSize(0,docHeight);
    },
    Tabdiv: function () {
        $(".tax-rate").removeClass('active-none');
        $(".mech").removeClass('active-none');
        $(".uncommercially").removeClass('active-none');
        $(".receipt-num").addClass('active-none');
        $(".receipt-unit").addClass('active-none');
        $("#tax-rate-title").text("发票内容：");
    },
    CheckData: function () { //验证文本框
        var that = this;

        var invoicetype = parseInt($("input[name='invoice']:checked").attr("index"));
        var taxrate = parseInt($(".rate-select").val()) || 0;
        var invoicetitle = $(".rise-text").val();
        var detailsvalue1 = parseInt($(".money-text").val()) || 0;
        var detailsinvoice1 = $(".invoice-select").val();
        var taxIdentification = $(".dist-text").val();
        var customeraddress = $(".address-text").val();
        var customertele = $(".phone-text").val();
        var customerbank = $(".account-text").val();
        var customeraccount = $(".account-num-text").val();
        var radio_single = $("input[name='invoice']:checked").attr("data-val");
        var check = $("input[type='checkbox']").is(':checked');
        var idstatus = $("#typestatus").val();
        var amount1 = parseInt($("#re_num").val())|| 0;
        var unitPrice1 = parseInt($("#re_mon").val())|| 0;
        var remark = $(".remarks-text").val();
        var val_payPlatform = $('.rece-type input[name="sex"]:checked ').attr('data-val');

        that.data = {
            "customid": customid,
            "invoiceType": invoicetype,
            "taxRate": taxrate,
            "invoiceTitle": invoicetitle,
            "detailsValue1": detailsvalue1,
            "detailsInvoice1": detailsinvoice1,
            "isPersonal": check == true ? 1 : 0,
            "taxIdentification": taxIdentification,
            "customerAddress": customeraddress,
            "customerTele": customertele,
            "customerBank": customerbank,
            "customerAccount": customeraccount,
            "amount1": amount1,
            "unitPrice1":unitPrice1,
            "remark": remark,
            "isConsistent":val_payPlatform,
        };


        //税率
        var attrval = $("#rate-select").val();

        //抬头
        var title = $(".rise-text").val();

        //金额
        var money = $(".money-text").val();
        
        //发票内容
        var invcontent = $(".invoice-select").val() == "0" ? "" : $(".invoice-select").val();
        //纳税人识别号
        var pay_taxes = $(".dist-text").val();
        //注册地址
        var register = $(".address-text").val();
        //联系电话
        var phone = $(".phone-text").val();
        //开户行
        var open_account = $(".account-text").val();
        //开户账号
        var open_num = $(".account-num-text").val();


        //var strict = Common.getUrlParam("strict");



        if ((radio_single == 2 || radio_single == 3)) {
            if (check) {//勾选非盈利机构

                if (!attrval) {
                    Helper.shake($(".rate-select"), "border-red", 10);
                    return false;
                }
                else if (!title) {
                    Helper.shake($(".rise-text"), "border-red", 10);
                    return false;
                }
                else if (!money || money <= 0) {
                    Helper.shake($(".money-text"), "border-red", 10);
                    return false;
                }
                else if (!invcontent) {
                    Helper.shake($(".invoice-select"), "border-red", 10);
                    return false;
                }
            } else {//未勾选非盈利机构

                if (attrval == 0 || attrval == '' || attrval == null) {
                    Helper.shake($(".rate-select"), "border-red", 10);
                    return false;
                }
                else if (title == '') {
                    Helper.shake($(".rise-text"), "border-red", 10);
                    return false;
                }
                else if (money == '' || money <= 0) {
                    Helper.shake($(".money-text"), "border-red", 10);
                    return false;
                }
                else if (invcontent == 1 || invcontent == '' || invcontent == null) {
                    Helper.shake($(".invoice-select"), "border-red", 10);
                    return false;
                }
                else if (pay_taxes == '') {
                    Helper.shake($(".dist-text"), "border-red", 10);
                    return false;
                }
                else if (register == '') {
                    Helper.shake($(".address-text"), "border-red", 10);
                    return false;
                }
                else if (phone == '') {
                    Helper.shake($(".phone-text"), "border-red", 10);
                    return false;
                }
                else if (open_account == '') {
                    Helper.shake($(".account-text"), "border-red", 10);
                    return false;
                }
                else if (open_num == '') {
                    Helper.shake($(".account-num-text"), "border-red", 10);
                    return false;
                }

            }
        }

        if (radio_single ==4){//票据
            if (!title) {
                Helper.shake($(".rise-text"), "border-red", 10);
                return false;
            }else if (!invcontent) {
                Helper.shake($(".invoice-select"), "border-red", 10);
                return false;
            }

        }


        // if (check && (!attrval || !title || !money || !invcontent )) {
        //     that.data.existblank = 1;
        // }
        // else if (!check && (!attrval || !title || !money || !invcontent || !pay_taxes || !register || !phone || !open_account || !open_num )) {
        //     that.data.existblank = 1;
        // }

        //收据
        // if(radio_single ==4&&(attrval&&invcontent)){
        //     that.data.existblank = 0;
        // }
        //
        //
        // if (invoicetype == 0) {
        //     that.data.existblank = 0;
        // }

        return true;
    },
    getData: function () {
        var that = this;
        var url = config.WebService()["invoice_Init"];
        var data = {
            "customid": customid,
        }

        Requst.ajaxGet(url, data, true, function (data) {
            if (data) {
                Invoice.Controller.saveAddress(1,1,1,1,1,1,1);
                if (data.code == 200) {
                    // var isPay = data.data.paystate;
                    // if (isPay == 6)//锁住税率
                    // {
                    //     $(".raxr-lock").removeClass('hide');
                    //     $(".tax-rate .msg-rate").removeClass('hide');
                    // }
                    // if (data.data.orderstate >= 7)//锁住全部
                    // {
                    //     $(".all-lock").removeClass("hide");
                    //     $(".ok").attr("disabled", true);
                    //     $(".ok").css("background-color", "#aaa");
                    //     $(".tax-rate .msg-rate").addClass('hide');
                    // }
                    var $invoicetype = data.data.invoiceType;//发票类型
                    if ($invoicetype == 2) {//专票
                        $("#mech-invoice").attr("data-disabled", "true");//锁住非盈利机构按钮
                    }

                    var $taxrate = data.data.taxRate;
                    var $invoicetitle = data.data.invoiceTitle;
                    var $detailsvalue1 = data.data.detailsValue1;
                    var $detailsinvoice1 = data.data.detailsInvoice1;
                    var $ispersonal = data.data.isPersonal;
                    //var $customerduty = data.data.customerduty;
                    var $customeraddress = data.data.customerAddress;
                    var $customertele = data.data.customerTele;
                    var $customerbank = data.data.customerBank;
                    var $customeraccount = data.data.customerAccount;
                    //var $invoice = data.invoice.id;
                    var $taxIdentification = data.data.taxIdentification;
                    var $remark = data.data.remark;
                    //var $detailsvalue2 = data.data.detailsvalue2;
                    //var $detailsvalue3 = data.data.detailsvalue3;



                    $("#rate-select").val($taxrate);
                    $(".invoice-select").find("option[value='" + $detailsinvoice1 + "']").attr("selected", "selected");
                    //$(".dist-text").val($customerduty);
                    $(".address-text").val($customeraddress);
                    $(".phone-text").val($customertele);
                    $(".account-text").val($customerbank);
                    $(".account-num-text").val($customeraccount);
                    $(".remarks-text").val($remark);
                    $(".dist-text").val($taxIdentification);
                    //$("#re_mon").val($detailsvalue2);
                    //$("#re_num").val($detailsvalue3);

                    $("#operateType").attr("value", "edit");
                    that.data.operateType = 2;
                    //$("#typestatus").val($invoice);


                    if ($invoicetype == 0) {//判断开票类型
                        Invoice.NoneInvoice($("#no-invoice"));//不开发票
                    } else if ($invoicetype == 1) {
                        Invoice.Ordinary($("#tax-invoice"));//增值税
                    } else if ($invoicetype == 2) {
                        Invoice.Special($("#spec-invoice"));//专用发票
                    } else if ($invoicetype == 3){
                        Invoice.Receipt($("#receipt"));//收据

                        $(".tax-rate").addClass('active-none');
                        $(".mech").addClass('active-none');
                        $(".uncommercially").addClass('active-none');
                        $(".receipt-num").removeClass('active-none');
                        $(".receipt-unit").removeClass('active-none');
                        $("#tax-rate-title").text("品  类：");
                        $(".remarks-text").addClass('ml-30');
                    }
                    $(".rise-text").val($invoicetitle);
                    $(".money-text").val($detailsvalue1);
                    if ($ispersonal == 1) {
                        that.Controller.uncommercially(true);//锁定非营利机构按钮
                    }
                }
            }
            Invoice.HeightAuto();
        });
    },
    Submit: function () {
        var that = this;
        var flag = that.CheckData();
        //var strict = Common.getUrlParam("strict");//分配生产
        if (flag) {
            $(".allocation").attr('disabled', true);
            var url = config.WebService()["invoice_Update"];
            Requst.ajaxGet(url, that.data, true, function (data) {
                console.info(data.msg + "   Code:" + data.code);
                if (data.code == 200) {

                        parent.layer.closeAll();
                }
                // else if (data.code == 3 && strict) {
                //     callback();
                //     parent.layer.closeAll();
                // }
                // else if (data.code == 3 && !strict) {
                //     Common.msg("更新成功", 200, 2000, function () {
                //         callback();
                //         parent.layer.closeAll();
                //     });
                // }
                // else {
                //     Common.msg(data.msg, 400, 2000, function () {
                //         window.location.reload();
                //     });
                // }
            });
            function callback() {
                //分配生产
                if (strict && parent.document.getElementById("cont_iframe").contentWindow.OrderDetails) {//详情分配生产
                    parent.document.getElementById("cont_iframe").contentWindow.OrderDetails.statusClick.allocationProduce(6);
                }
                else if (strict && parent.document.getElementById("cont_iframe").contentWindow.OrderOverview.statusClick.allocationProduce) {//概览分配生产
                    parent.document.getElementById("cont_iframe").contentWindow.OrderOverview.statusClick.allocationProduce(6);
                }
                else if (parent.document.getElementById("cont_iframe").contentWindow.base) {
                    parent.document.getElementById("cont_iframe").contentWindow.base.init();
                }
            }
        }

    }
}


