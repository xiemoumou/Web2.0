/**
 * Created by inshijie on 2018/6/27.
 */
var SysParam = top.SysParam;
var customid = '';//定制号
var operType = '';//操作类型
var createOrder = {
    init: function () {
        operType = Helper.getUrlParam('operType');//新建还是编辑
        if (operType == 'edit') {
            //编辑5要素
            $('.create').css('display', 'none');
            customid = Helper.getUrlParam('customid');
        }
        else {
            //新建订单
            var getOrderIdUrl = top.config.WebService()['createOrderId'];
            $('.edit').css('display', 'none');
            top.Requst.ajaxGet(getOrderIdUrl, null, false, function (data) {//必须同步否则上传组件取不到ID
                customid = data.data.customid;
                $('#reference_diagram').attr("data-customid", data.data.customid);//需要告诉上传组件订单id
                $('#accessory').attr("data-customid", data.data.customid);//需要告诉上传组件订单id
            }, function () {
                console.warn('获取订单id时出现异常请检查。');
                top.Message.show('新建订单异常', '不要填写数据，请联系客服解决。', top.MsgState.Warning, 3000);
            });
        }

        var that = this;
        $("#js_close").on("click", function () {
            top.Popup.close('新建订单');
            top.Popup.close('产品生产参数编辑');
        });

        //截止工期时间时间初始化
        var userPeriodDefault=parseInt(SysParam.sysParam['user_period_default'].value);
        $("#endlimit").val(top.Helper.Date.getNdayDate(userPeriodDefault, 'yyyy-MM-dd'));
        laydate.render({elem: '#endlimit', min: top.Helper.Date.getDate('yyyy-MM-dd')});

        //回显数据
        if (operType == 'edit') {
            that.getData();
        }

        //下拉框
        that.initDropDownList();

        uploadfile.uploadPhoto('reference_diagram', 3);//图片上传
        uploadfile.uploadFile('accessory', 1, null, true,null,false);//附件上传

        textArea.init('.design-note', 300, '', '注：备注不允许出现产品价格，参数和旺旺等各种联系方式。', '');
        textArea.init('.production-note', 300, '', '注：备注不允许出现产品价格，参数和旺旺等各种联系方式。', '');

        uploadfile.initDrag('reference_diagram');//拖拽支持
        uploadfile.initDrag('accessory');

        $('.container').removeClass('hide');//显示界面

        $('.autoPrice').on('change',function () {
            createOrder.autoPrice();
        });
    },
    autoPrice: function () {
        //自动报价
        var requstData = {
            "iscontinue": 0,
            "producttype": 0,
            "material": 0,
            "model": 0,
            "color": 0,
            "quality": 0,
            "technology": 0,
            "accessories": 0,
            "sizelong": 0,
            "sizewidth": 0,
            "sizeheight": 0,
            "num": 0
        };

        //订单类型
        var obj_ordertype = $('.ordertype .lg-dropdownlist .val');
        requstData.iscontinue = parseInt($(obj_ordertype).attr('data-value'));

        //产品类型
        var obj_producttype = $('.producttype .lg-dropdownlist .val');
        requstData.producttype = parseInt($(obj_producttype).attr('data-value'));

        //产品属性-1
        var obj_productAttribute_1 = $('.product-attribute-1 .lg-dropdownlist .val');
        requstData.material = $(obj_productAttribute_1).attr('data-value');

        //产品属性-2
        var obj_productAttribute_2 = $('.product-attribute-2 .lg-dropdownlist .val');
        requstData.accessories = $(obj_productAttribute_2).attr('data-value');

        //工艺属性-1
        var obj_technology_attribute_1 = $('.technology-attribute-1 .lg-dropdownbox .val');
        requstData.model = $(obj_technology_attribute_1).attr('data-value') || $('.technology-attribute-1').attr('data-val');

        //工艺属性-2
        var obj_technology_attribute_2 = $('.technology-attribute-2 .lg-dropdownbox .val');
        requstData.technology = $(obj_technology_attribute_2).attr('data-value') || $('.technology-attribute-2').attr('data-val');

        //工艺属性-3
        var obj_technology_attribute_3 = $('.technology-attribute-3 .lg-dropdownbox .val');
        requstData.color = $(obj_technology_attribute_3).attr('data-value') || $('.technology-attribute-3').attr('data-val');

        //产品数量
        var productNumVal = $('#productNum').val();
        requstData.num = parseInt(productNumVal);

        // 长
        var obj_size_length = $('.size-length');
        var input_length = obj_size_length.find('input');
        requstData.sizelong = parseFloat($(input_length).val());


        // 宽
        var obj_size_width = $('.size-width');
        var input_width = obj_size_width.find('input');
        requstData.sizewidth = parseFloat($(input_width).val());

        // 高
        var obj_size_height = $('.size-height');
        var input_height = obj_size_height.find('input');
        requstData.sizeheight = parseFloat($(input_height).val());

        var url = config.WebService()['autoPrice'];
        $(".evaluate-mask").addClass('active');
        Requst.ajaxGet(url, requstData, true, function (data) {
            $(".evaluate-mask").removeClass('active');
            if(data.code==200)
            {
                $('.appraisal input').val(data.data.pred_duty.formatMoney(2, "", ",", "."));
            }
        },function (data) {
            $(".evaluate-mask").removeClass('active');
        },true);
    },
    initDropDownList: function () {//初始化下拉菜单
        var shopDefault = getDefault(SysParam['shop']);
        $(".ordersource").attr('data-val', shopDefault);
        $(".ordersource").DropDownList(SysParam['shop']);
        $(".ordertype").DropDownList([{"id": 0, "name": "新订单"}, {"id": 1, "name": "续订"}]);

        //五要素级联开始——————————————————————————————————————————————————————————————————————————————————————————————————
        var material = [];
        /*材质*/
        var accessories = [];
        /*配件*/
        var size = [];//尺寸
        var technology = [];//配件
        var model = [];//开模
        var color = [];//电镀色

        // 初始化动态列表数据
        //品类********************************************************************
        var goodsClassDefault = "";//获取品类默认值
        if ($(".producttype").attr('data-val')) {
            goodsClassDefault = $(".producttype").attr('data-val');
        }
        else {
            goodsClassDefault = getDefault(SysParam['goodsClass']);
        }
        $(".producttype").attr('data-val', goodsClassDefault);//把默认值赋给标签
        function goodsClassCallback(dataId) {
            goodsClassDefault=dataId;

            material.length = 0;
            accessories.length = 0;
            dataId = parseInt(dataId);
            //选择品类
            for (var i = 0; i < SysParam.relationGoodsclass.length; i++) {
                var item = SysParam.relationGoodsclass[i];
                if (item.firstId == dataId) {
                    for (var j = 0; j < item.son.length; j++) {
                        if (item.son[j].secondClass == 'material') {
                            material.push({
                                'id': item.son[j].secondId,
                                'name': item.son[j].secondDescription,
                                'isDefault': item.son[j].isDefaultSon
                            });
                        }
                        else if (item.son[j].secondClass == 'accessories') {
                            accessories.push({
                                'id': item.son[j].secondId,
                                'name': item.son[j].secondDescription,
                                'isDefault': item.son[j].isDefaultSon
                            });
                        }
                    }
                }
            }

            //触发材质  配件
            setMaterial(material);

            setAccessories(accessories);

        }//获取选中品类的子集
        goodsClassCallback(goodsClassDefault);//品类

        //初始化品类下拉
        $(".producttype").DropDownList(SysParam['goodsClass'], function (dataId) {
            goodsClassCallback(dataId);
            createOrder.autoPrice();
        });
        //品类-end****************************************************************


        //材质-begin**************************************************************
        function materialCallback(dataId) {
            model.length = 0;
            technology.length = 0;
            size.length = 0;
            dataId = parseInt(dataId);
            //选择材质
            for (var i = 0; i < SysParam.relationMaterial.length; i++) {
                var item = SysParam.relationMaterial[i];
                if (item.firstId == dataId) {
                    for (var j = 0; j < item.son.length; j++) {
                        if (item.son[j].secondClass == 'technology') {
                            technology.push({
                                'id': item.son[j].secondId,
                                'name': item.son[j].secondDescription,
                                'isDefault': item.son[j].isDefaultSon
                            });
                        }
                        else if (item.son[j].secondClass == 'model') {
                            model.push({
                                'id': item.son[j].secondId,
                                'name': item.son[j].secondDescription,
                                'isDefault': item.son[j].isDefaultSon
                            });
                        }
                    }
                }
            }

            //从品类下获取材质下的尺寸
            for (var i = 0; i < SysParam.relationGoodsclass.length; i++) {
                var item = SysParam.relationGoodsclass[i];
                if (item.firstId ==parseInt(goodsClassDefault)) {
                    for (var j = 0; j < item.son.length; j++) {
                        if (item.son[j].secondClass == 'material' && item.son[j].secondId==parseInt(dataId)) {
                            if (item.son[j].son && item.son[j].son.length>0) {
                                for(var sizeI=0;sizeI<item.son[j].son.length;sizeI++)
                                {
                                    var sizeItem=item.son[j].son[sizeI];
                                    if(sizeItem.thirdClass=="size")
                                    {
                                        size.push({
                                            'id': sizeItem.thirdId,
                                            'name': sizeItem.thirdDescription,
                                            'isDefault': sizeItem.isDefaultGrandson,
                                        });
                                    }
                                }
                            }
                        }
                    }
                }
            }

            setModel(model);
            setTechnology(technology);
            setSize(size);
        }

        //材质-end****************************************************************

        //工艺属性-begin***********************************************************
        function technologyCallback(dataId) {
            color.length = 0;
            //选择工艺影响颜色
            dataId = dataId.id;
            var colorDef = [];
            for (var i = 0; i < SysParam.relationTechnology.length; i++) {
                var item = SysParam.relationTechnology[i];
                if (dataId.indexOf(item.firstId) > -1) {
                    for (var j = 0; j < item.son.length; j++) {
                        if (item.son[j].secondClass == 'color') {
                            var flag = true;
                            for (var k = 0; k < color.length; k++) {
                                if (color.id == item.son[j].secondId) {
                                    flag = false;
                                }
                            }
                            if (flag) {
                                color.push({
                                    'id': item.son[j].secondId,
                                    'name': item.son[j].secondDescription,
                                    'isDefault': item.son[j].isDefaultSon
                                });
                                if (item.son[j].isDefaultSon) {
                                    colorDef.push(item.son[j].secondId);
                                }
                            }
                        }
                    }
                }
            }
            colorDefault = colorDef.join(",");
            setColor(color);
        }

        //工艺属性-end*************************************************************

        //尺寸-begin**************************************************************
        function sizeCallback(dataId) {
            for (var i = 0; i < SysParam.size.length; i++) {
                var item = SysParam.size[i];
                var selectVal = parseInt(dataId);
                var $length = $('.size-length .size-input');
                var $width = $('.size-width .size-input');
                var $height = $('.size-height .size-input');
                if (selectVal == item.id) {
                    if (selectVal != 1)//不等于自定义
                    {
                        $length.attr("disabled", true);
                        $width.attr("disabled", true);
                        $height.attr("disabled", true);

                        $length.val(item.length);
                        $width.val(item.width);
                        $height.val(item.height);
                    }
                    else {//等于自定义
                        $length.attr("disabled", false);
                        $width.attr("disabled", false);
                        $height.attr("disabled", false);
                    }
                }
            }
        }

        //尺寸-end****************************************************************

        //设置电镀色
        function setColor(data) {
            var val = [];
            for (var i = 0; i < data.length; i++) {
                if (data[i].isDefault) {
                    val.push(data[i].id);
                }
            }

            //保留原来选中的值（如果新数据愿中有的话）
            var oldVal = oldSelectValue($(".technology-attribute-3").attr('data-val'), data);
            if (oldVal) {
                val = oldVal;
            }

            $(".technology-attribute-3").attr('data-val', val.join(','));
            $(".technology-attribute-3").DropDownBox(data,function (dataId) {
                createOrder.autoPrice();//触发自动报价
            });
        }

        //设置材质
        function setMaterial(data) {
            var val = [];
            for (var i = 0; i < data.length; i++) {
                if (data[i].isDefault) {
                    val.push(data[i].id);
                }
            }

            //保留原来选中的值（如果新数据愿中有的话）
            var oldVal = oldSelectValue($(".product-attribute-1").attr('data-val'), data);
            if (oldVal) {
                val = oldVal;
            }

            var defaultVal = val.join(',');
            $(".product-attribute-1").attr('data-val', defaultVal);
            $(".product-attribute-1").DropDownList(data,function (dataId) {
                materialCallback(dataId);
                createOrder.autoPrice();//触发自动报价
            });
            materialCallback(defaultVal);
        }

        //设置配件
        function setAccessories(data) {
            var val = [];
            for (var i = 0; i < data.length; i++) {
                if (data[i].isDefault) {
                    val.push(data[i].id);
                }
            }

            //保留原来选中的值（如果新数据愿中有的话）
            var oldVal = oldSelectValue($(".product-attribute-2").attr('data-val'), data);
            if (oldVal) {
                val = oldVal;
            }

            $(".product-attribute-2").attr('data-val', val.join(','));
            $(".product-attribute-2").DropDownList(data,function (dataId) {
                createOrder.autoPrice();//触发自动报价
            });
        }

        //设置开模方式
        function setModel(data) {
            // var val = [];
            // for (var i = 0; i < data.length; i++) {
            //     if (data[i].isDefault) {
            //         val.push(data[i].id);
            //     }
            // }
            //
            // //保留原来选中的值（如果新数据愿中有的话）
            // var oldVal = oldSelectValue($('.technology-attribute-1').attr('data-val'), data);
            // if (oldVal) {
            //     val = oldVal;
            // }
            //
            // $('.technology-attribute-1').attr('data-val', val.join(','));
            // $('.technology-attribute-1').DropDownBox(data,function (dataId) {
            //     createOrder.autoPrice();//触发自动报价
            // });
        }

        //设置工艺
        function setTechnology(data) {
            var val = [];
            for (var i = 0; i < data.length; i++) {
                if (data[i].isDefault) {
                    val.push(data[i].id);
                }
            }

            //保留原来选中的值（如果新数据愿中有的话）
            var oldVal = oldSelectValue($(".technology-attribute-2").attr('data-val'), data);
            if (oldVal) {
                val = oldVal;
            }

            var defaultVal = val.join(',');
            $(".technology-attribute-2").attr('data-val', defaultVal);
            $(".technology-attribute-2").DropDownBox(data,function (dataId) {
                technologyCallback(dataId);
                createOrder.autoPrice();//触发自动报价
            });
            technologyCallback({"id": val});
        }

        //设置尺寸
        function setSize(data) {
            var val = [];
            for (var i = 0; i < data.length; i++) {
                if (data[i].isDefault) {
                    val.push(data[i].id);
                }
            }

            //保留原来选中的值（如果新数据愿中有的话）
            var oldVal = oldSelectValue($('.technology-attribute-1').attr('data-val'), data);
            if (oldVal) {
                val = oldVal;
            }

            var defaultVal = val.join(',');
            $(".sizeType").attr('data-val', defaultVal);
            $(".sizeType").DropDownList(data, function(dataId){
                sizeCallback(dataId);
                createOrder.autoPrice();//触发自动报价
            });
            sizeCallback(defaultVal);
        }

        //原来选中的值是否在新集合中
        function oldSelectValue(oldValue, dataSource) {
            var temp = [];//旧的值
            if (oldValue) {
                oldValue = oldValue.split(",");
                for (var i = 0; i < oldValue.length; i++) {
                    for (var j = 0; j < dataSource.length; j++) {
                        var val = parseInt(oldValue[i]);
                        if (dataSource[j].id == val) {
                            temp.push(val);
                        }
                    }
                }
            }
            if (temp.length > 0) {
                return temp;
            }
            return false;
        }

        //开模方式
        $('.technology-attribute-1').DropDownMold(null,function () {
            createOrder.autoPrice();//触发自动报价
        });
    },
    getData: function () {
        Requst.ajaxGet(config.WebService()['orderSummaryInfo_Query'], {'customId': customid}, false, function (data) {
            if (data.code == 200) {
                var data = data.data;
                $('.orderId').text(data.orderid);
                $('.wangwang .input-text').val(data.customerWang);
                $('.ordersource').attr('data-val', data.shop);
                $('.ordertype').attr('data-val', data.isContinueOrder);
                $('.producttype').attr('data-val', data.goodsClass);
                $('.productNum .input-number').val(data.number);
                $('.product-attribute-1').attr('data-val', data.material);//材质
                $('.product-attribute-2').attr('data-val', data.accessories);//配件
                $('.technology-attribute-1').attr('data-val', data.model);//开模方式
                $('.technology-attribute-2').attr('data-val', data.technology);//生产工艺
                $('.technology-attribute-3').attr('data-val', data.color);//电镀色
                $('.size-length .size-input').val(data.length);//长
                $('.size-width .size-input').val(data.width);//宽
                $('.size-height .size-input').val(data.height);//高
                var userPeriod = data.userPeriod;//工期
                userPeriod = top.Helper.Date.getNdayDate(userPeriod, 'yyyy-MM-dd');
                $('#endlimit').val(userPeriod);
            }
        });
    },
    checkAndGetData: function () {//验证与获取表单数据
        var resultObj = {
            "customid": customid,
            "goodsClass": 1,
            "goodsName": "",
            "material": 1,
            "model": 1,
            "color": 1,
            "technology": 1,
            "length": 0,
            "width": 0,
            "height": 0,
            "number": 0,
            "accessories": 1,
            "quality": 0,
            "userPeriod": 0,
            "userPrice": 0,
            "initialReferenceImage1": "",
            "initialReferenceImage1s": "",
            "initialReferenceImage1m": "",
            "initialReferenceImage2": "",
            "initialReferenceImage2s": "",
            "initialReferenceImage2m": "",
            "initialReferenceImage3": "",
            "initialReferenceImage3s": "",
            "initialReferenceImage3m": "",
            "initialProducerefImage": "",
            "smallProducerefImage": "",
            "middleProducerefImage": "",
            "accessoryFile": "",
            "designMemo": "",
            "produceMemo": "",
            "customerWang": "",
            "plateform": "1",
            "shop": -1,
            "isContinueOrder": -1,
            "wCustomid": customid,
        };//结果

        //客源
        var obj_ordersource = $('.ordersource .lg-dropdownlist .val');
        resultObj.shop = parseInt($(obj_ordersource).attr('data-value'));

        //订单类型
        var obj_ordertype = $('.ordertype .lg-dropdownlist .val');
        resultObj.isContinueOrder = parseInt($(obj_ordertype).attr('data-value'));

        //产品类型
        var obj_producttype = $('.producttype .lg-dropdownlist .val');
        resultObj.goodsClass = parseInt($(obj_producttype).attr('data-value'));

        //产品属性-1
        var obj_productAttribute_1 = $('.product-attribute-1 .lg-dropdownlist .val');
        resultObj.material = $(obj_productAttribute_1).attr('data-value');

        //产品属性-2
        var obj_productAttribute_2 = $('.product-attribute-2 .lg-dropdownlist .val');
        resultObj.accessories = $(obj_productAttribute_2).attr('data-value');

        //工艺属性-1
        var obj_technology_attribute_1 = $('.technology-attribute-1 .lg-dropdownbox .val');
        resultObj.model = $(obj_technology_attribute_1).attr('data-value') || $('.technology-attribute-1').attr('data-val');

        //工艺属性-2
        var obj_technology_attribute_2 = $('.technology-attribute-2 .lg-dropdownbox .val');
        resultObj.technology = $(obj_technology_attribute_2).attr('data-value') || $('.technology-attribute-2').attr('data-val');

        //工艺属性-3
        var obj_technology_attribute_3 = $('.technology-attribute-3 .lg-dropdownbox .val');
        resultObj.color = $(obj_technology_attribute_3).attr('data-value') || $('.technology-attribute-3').attr('data-val');

        //估价
        // var appraisal=$('.appraisal');
        // var input_appraisal=appraisal.find('input');
        //
        // var appraisal_val=$(input_appraisal).val().replace(/[^0-9-.]/g, '');
        // top.Helper.shake(appraisal);


        //产品数量
        var obj_productNum = $('.productNum');
        var productNumVal = $('#productNum').val();
        resultObj.number = parseInt(productNumVal);
        if (isNaN(resultObj.number) || resultObj.number <= 0) {
            top.Helper.shake(obj_productNum);
            return
        }

        // 长
        var obj_size_length = $('.size-length');
        var input_length = obj_size_length.find('input');
        resultObj.length = $(input_length).val();
        resultObj.length = parseFloat(resultObj.length);
        if (resultObj.length <= 0) {
            top.Helper.shake(obj_size_length);
            $(input_length).focus();
            return false;
        }


        // 宽
        var obj_size_width = $('.size-width');
        var input_width = obj_size_width.find('input');
        resultObj.width = $(input_width).val();
        resultObj.width = parseFloat(resultObj.width);
        if (resultObj.width <= 0) {
            top.Helper.shake(obj_size_width);
            $(input_width).focus();
            return false;
        }

        // 高
        var obj_size_height = $('.size-height');
        var input_height = obj_size_height.find('input');
        resultObj.height = $(input_height).val();
        resultObj.height = parseFloat(resultObj.height);
        if (resultObj.height <= 0) {
            top.Helper.shake(obj_size_height);
            $(input_height).focus();
            return false;
        }

        //旺旺号
        if (operType == 'edit') {
            var wangwang = $('.wangwang.edit');
            var input_wangwang = wangwang.find('input');
            resultObj.customerWang = $.trim($(input_wangwang).val());
            if (!resultObj.customerWang) {
                top.Helper.shake(wangwang);
                input_wangwang.focus();
                return false;
            }
        }
        else {
            var wangwang = $('.wangwang.create');
            var input_wangwang = wangwang.find('input');
            resultObj.customerWang = $.trim($(input_wangwang).val());
            if (!resultObj.customerWang) {
                top.Helper.shake(wangwang);
                input_wangwang.focus();
                return false;
            }
        }


        //客户预算
        //var userPrice = $('.budget');
        resultObj.userPrice = $('#customer_budget').val().replace(/[^0-9-.]/g, '')||0;
        resultObj.userPrice=parseFloat(resultObj.userPrice);
        // if(isNaN(resultObj.userPrice) || resultObj.userPrice<=0)
        // {
        //     top.Helper.shake(userPrice);
        // }

        //截止工期
        var endDay = $('.endDay');
        var sDate = top.Helper.Date.getDate('yyyy-MM-dd');
        var eDate = $("#endlimit").val();

        if ($.trim(eDate) == "") {
            top.Helper.shake(endDay);
            return;
        }
        var sArr = sDate.split("-");
        var eArr = eDate.split("-");
        var sRDate = new Date(sArr[0], sArr[1], sArr[2]);
        var eRDate = new Date(eArr[0], eArr[1], eArr[2]);
        resultObj.userPeriod = (eRDate - sRDate) / (24 * 60 * 60 * 1000) + 1;

        //参考图
        var ref_diagram = $('#reference_diagram .diagram-container .diagram');
        for (var i = 0; i < ref_diagram.length; i++) {
            var item = $(ref_diagram[i]);
            if (i <= 2) {
                if (item && item.attr('data-complete') != "complete") {
                    Message.show('提醒', "参考图正在上传请等待...", MsgState.Fail, 2000);
                    return;
                }
                resultObj["initialReferenceImage" + (i + 1)] = item.attr('data-oimageurl');
                resultObj["initialReferenceImage" + (i + 1) + "s"] = item.attr('data-simageurl');
                resultObj["initialReferenceImage" + (i + 1) + "m"] = item.attr('data-mimageurl');
            }
        }

        //附件
        var accessoryList = $('.accessory-container .fileitem');
        if ($(accessoryList).length && $(accessoryList[0]).attr('data-complete') != "complete") {
            Message.show('提醒', "附件正在上传请等待...", MsgState.Fail, 2000);
            return;
        }
        resultObj.accessoryFile = $(accessoryList[0]).attr('data-url');
        resultObj.designMemo = $('.design-note textarea').val();//设计备注
        resultObj.produceMemo = $('.production-note textarea').val();//生产备注
        return resultObj;
    },
    allowSave: true,
    save: function () {//保存
        
        var that = this;
        var submitData = that.checkAndGetData();//获得提交的数据
        if (that.allowSave && submitData) {
            that.allowSave = false;
            var url = operType == "edit" ? config.WebService()['updateOrderQuoteItem'] : config.WebService()['orderSummaryInfo_Insert'];
            Requst.ajaxPost(url, submitData, true, function (data) {
                if (data.code == 200) {
                    var message = operType == "edit" ? "编辑成功" : "新建订单成功！";
                    Message.show('提示', message, MsgState.Success, 2000, function () {
                        //更新概览列表
                        if (top.classMain.loadOverview) {
                            if(operType == "edit")
                            {
                                top.classMain.loadOverview(null,null,null,customid);
                            }
                            else
                            {
                                top.classMain.loadOverview();
                            }
                        }
                        //更新详情内容
                        top.Popup.close('新建订单');
                        top.Popup.close('产品生产参数编辑');
                    });
                }
                else {
                    Message.show('注意', '本次操作失败了！', MsgState.Fail, 2000, function () {
                        that.allowSave = true;
                    });
                    console.warn('code:' + data.code + '    ' + data.message);
                }
            }, function () {
                that.allowSave = true;
            });
        }
    }
}

$(function () {
    createOrder.init();
});

function getDefault(arrayList) {
    var shopDefault = [];
    for (var i = 0; i < arrayList.length; i++) {
        var item = arrayList[i];
        if (item.isDefault) {
            shopDefault.push(item.id);
        }
    }
    return shopDefault.join(",");
}