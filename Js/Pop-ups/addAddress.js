// 收货地址
var customid = Helper.getUrlParam('customid') || "";//获取订单号
var operType="";//操作类型
$(function () {
    dist.Address();

    $('.ok').on('click', function () {
        dist.Ressget();//保存
    });
});

//回填信息
var dist = {
    Address: function () {
        operType=Helper.getUrlParam("operType", true);//启动页面的类型

        var name = Helper.getUrlParam("name", true);//收货人
        var mobilephone = Helper.getUrlParam("mobilephone", true);//收货人电话
        var postcode = Helper.getUrlParam("postcode", true);//邮编
        var province = Helper.getUrlParam("province", true);//省份
        var city = Helper.getUrlParam("city", true);//城市
        var county = Helper.getUrlParam("county", true);//县区
        var address = Helper.getUrlParam("address", true);//详细地址
        var orderid = Helper.getUrlParam("orderid", true);//订单id
        var goodsid = Helper.getUrlParam("goodsid", true);//

        $('#recipient').val(name == "undefined" ? "" : name);
        $('#tel').val(mobilephone == "undefined" ? "" : mobilephone);
        $('#address_content').val(address == "undefined" ? "" : address);

        //初始化省市下拉框
        if (province != 'undefined') {
            $('#distpicker').distpicker({
                province: province,
                city: city,
                district: county
            });
        }
        else {
            $('#distpicker').distpicker({
                autoSelect: false
            });
        }

        $('#code').val(postcode == "undefined" ? "" : postcode);

        $('.address-select select').change(function () {
            var tempcode = $(this).find("option:selected").attr('data-code');
            $('#code').val(tempcode);
        });

        $('#code').keyup(function () {
            $('#code').val($('#code').val());
        });
    },
    Ressget: function () {
        var name = $('#recipient').val();
        var mobilephone = $('#tel').val();
        mobilephone = $.trim(mobilephone);
        var postcode = $('#code').val();
        var province = $('.address-select .province').val();
        var city = $('.address-select .city').val();
        var county = $('.address-select .block').val();
        var address = $('#address_content').val();//详细地址

        if ($.trim(name).length <= 0) {
            Helper.shake($('#recipient'), 'border-red', 5);
            $('#recipient').focus();
            return false
        }
        else if ($.trim(mobilephone).length <= 0) {
            Helper.shake($('#tel'), 'border-red', 5);
            $('#tel').focus();
            return false
        }
        else if ($.trim(postcode).length <= 0) {
            Helper.shake($('#code'), 'border-red', 5);
            $('#code').focus();
            return false
        }
        else if ($.trim(address).length <= 0) {
            Helper.shake($('.address'), 'border-red', 5);
            $('#address_content').focus();
            return false
        }
        else {
            var data = {
                "customid": customid,
                "name": name,
                "mobilephone": mobilephone,
                "postcode": postcode,
                "province": province,
                "city": city,
                "county": county,
                "address": address,
            };
            var url = config.WebService()["logistics_Info"];
            top.Requst.ajaxGet(url, data, true, function (data) {
                if(data.code==200)
                {
                    top.Message.show("提示",data.message,MsgState.Success,2000,function () {
                        if(operType=="distributionProduction")//分配生产
                        {
                            top.OPER.distributionProduction(customid);
                        }
                        else if(operType=="invoce") //发票
                        {

                        }
                        else if(operType=="detail")//详情页面
                        {

                        }
                    });
                }
                else
                {
                    top.Message.show("提示",data.message,MsgState.Warning,2000);
                }
            });
        }
    }
}