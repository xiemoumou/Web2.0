// 新建订单  方法

var currentSelectObj = null;
$(function () {

    $(document).on("click", ".laydate-btns-confirm", function () {
        OrderDetails.exchangeDate();
    });
    $(document).on("click", ".layui-laydate-content tbody", function () {
        OrderDetails.exchangeDate();
    });


    $("#submit").click(function () {
        if (uploadstate == 0) {
            OrderDetails.newOrderFun();
        } else {
            Common.msg("正在上传请稍后...", null, 2000);
        }
    });


    //点击空白隐藏搜索下拉菜单或个人中心下拉菜单
    $(window).click(function () {
        if (currentSelectObj) {
            $(currentSelectObj).hide();
            currentSelectObj = null;
        }
    })

    //数字框验证
    /*$('.number-input').keyup(function () {
     var correct = Common.convertFloat($(this).val());
     $(this).val(correct);
     })
     $('.order-count .number-input').keyup(function () {
     var correct = Common.convertInt($(this).val());
     $(this).val(correct);
     })*/

    //计算输入文本字数
    $("#design_requirements").keyup(function () {
        var length = $("#design_requirements").val().length;
        $('.design-requirements .count').html(length);
    });
    $("#production_requirements").keyup(function () {
        var length = $("#production_requirements").val().length;
        $('.production-requirements .count').html(length);
    });

    //选择无
    $('.cbx-none').on('click', function () {
        var div = $(this).parent().parent();
        if(!$(this).prop('checked'))
        {
            $(this).prop('checked', true);
            return;
        }
        $.each(div.find('label'), function (i, item) {
            var checkbox = $(item).find("input:checkbox");
            checkbox.prop('checked', false);
        });
        $(this).prop('checked', true);
    });

    //选择普通按钮
    $(".drop-cbx").on("click", function () {
        var flag=true;
        var div = $(this).parent().parent();
        div.find('.cbx-none').prop('checked', false);
        //遍历是否有选中项目
        $.each(div.find('label'), function (i, item) {
            var checkbox = $(item).find("input:checkbox");
            if(checkbox.prop('checked'))
            {
                flag=false;
            }
        });
        if(flag)
        {
            div.find('.cbx-none').prop('checked', true);
        }
    });

    autoOffer.init();//初始化实时报价

});


// ==>>验证长度，宽度和高度 格式


var OrderDetails = {
    layerIndex: 0,
    getDataInterface: {},//请求数据的接口
    functionalInterface: {},//操作功能的接口
    userInfo: {
        userid: $.cookie("userid"),
        token: $.cookie("token"),
        roletype: $.cookie("roletype")
    },//用户信息
    request: function (data, callback, getDataInterface, functionalInterface) {
        var url = Common.getUrl()['order'];
        if (getDataInterface) {
            url += Common.getDataInterface()[getDataInterface];
        }
        if (functionalInterface) {
            url += Common.functionalInterface()[functionalInterface];
        }
        Common.ajax(url, data, true, callback, function (error) {
            //接口调用错误处理
            Common.msg('新建订单失败，请稍后重试');
        });
    },
    exchangeDate: function () {
        var sDate = Common.date.getDate();
        var eDate = $("#stop_time").val();
        var sArr = sDate.split("-");
        var eArr = eDate.split("-");
        var sRDate = new Date(sArr[0], sArr[1], sArr[2]);
        var eRDate = new Date(eArr[0], eArr[1], eArr[2]);
        var result = (eRDate - sRDate) / (24 * 60 * 60 * 1000);
        return result;
        //
        //$(obj).val( result );
        /*setTimeout(function(){
         var str_d = $("#stop_time").val();
         alert( str_d );
         var str_day = new Date( str_d );
         var str_new = new Date();
         var timeStr = str_day - str_new ;
         $("#stop_time").val( Math.ceil(( parseInt( timeStr ) )/24/3600/1000) );

         return true;
         },900);*/

    },
    checkMess: function () {
        //1.0获取每个字段的值
        var flag = true; // ==>>标识
        var data = {};
        var order_cycle = OrderDetails.exchangeDate();
        var userId = OrderDetails.userInfo.userid;
        var roletype = OrderDetails.userInfo.roletype;
        var token = OrderDetails.userInfo.token;

        var obj_div = $("#uploadedList").children("div");
        var arr_url = new Array();
        $.each(obj_div, function (i, item) {
            if ($(item).attr("data-name") != null || $(item).attr("data-name") != "") {
                arr_url.push($(item).attr("data-url"));
            }
        });

        var goodsclass = $(".ordertype_span").text();//   --- 修改产品类别
        var number = $(".orderNum").val(); // ==>> 产品数量
        var texturename = $(".workstage_textureBtn").text();//   -----产品材质
        var accessoriesname = $(".order_parts").text(); //---  产品配件名称


        var shape = $(".moldOpenBtn").text(); //  ----  开模参数
        var technology = $(".craftBtn").text(); //    --- 电镀色参数
        var color = $(".electroplateBtn").text();//   --- 修改  工艺参数

        var length = $(".productLength").val();//    --产品长度
        var width = $(".productWidth").val();//     ----产品宽度
        var height = $(".productHeight").val();//  ----产品高度


        var acc_url = $("#filelist li").attr("data-url"); //上传附件的url
        var acc_name = $("#filelist li").attr("data-name"); //上传附件的名称
        var commandcode = 70;
        var deadline = order_cycle || 10;


        var customerid = $(".order_contact").val();  //旺旺名
        var extent1 = $(".order_customerprice").val(); //估价
        var mindprice = $(".order_evaluate").val(); //客户预算
        var fromplatform = $("#source").text(); //订单来源
        var stopDay = $(document).attr('timeStep'); //截止工期


        var goodsimage = arr_url[1] || arr_url[2] || arr_url[3] || ""; // 默认显示的图片
        var referencepictureurl1 = arr_url[1] || "";  // 图片1
        var referencepictureurl2 = arr_url[2] || "";  // 图片2
        var referencepictureurl3 = arr_url[3] || "";  // 图片3
        var accessoryid = acc_name || "";
        var accessoryurl = acc_url || "";
        var remark_designer = $.trim($("#remark_desig").val()); //=>>设计备注
        var remark_factory = $.trim($("#remark_fact").val()); //=>生产备注
        var memo = remark_designer;
        var factorymemo = remark_factory;
        var append=$("#append").prop('checked');//是否续订订单


        //2.0 ==>>教研字段合法性，提示用户
        if (!goodsclass.length) {
            flag = OrderDetails.msgTip("产品类型不能为空，选择");
            return;
        }
        if (!number.length) {
            flag = OrderDetails.msgTip("产品数量不能为空，请输入");
            $(".orderNum").focus();
            return;
        }


        if (!texturename.length) {
            flag = OrderDetails.msgTip("产品材质不能为空，请输入");
            $(".orderNum").focus();
            return;
        }
        if (!accessoriesname.length) {
            flag = OrderDetails.msgTip("产品配件名次不能为空，请输入");
            $(".orderNum").focus();
            return;
        }


        if (!shape.length) {
            flag = OrderDetails.msgTip("开模参数不能为空，请输入");
            $(".orderNum").focus();
            return;
        }

        if (!color.length) {
            flag = OrderDetails.msgTip("电镀色参数不能为空，请输入");
            $(".orderNum").focus();
            return;
        }

        if (!technology.length) {
            flag = OrderDetails.msgTip(" 工艺参数不能为空，请输入");
            $(".orderNum").focus();
            return;
        }


        if (!length.length) {
            flag = OrderDetails.msgTip(" 产品长度不能为空，请输入");
            $(".orderNum").focus();
            return;
        }

        if (!width.length) {
            flag = OrderDetails.msgTip(" 产品宽度不能为空，请输入");
            $(".orderNum").focus();
            return;
        }

        if (!height.length) {
            flag = OrderDetails.msgTip(" 产品高度不能为空，请输入");
            $(".orderNum").focus();
        }


        if (!customerid.length) {
            flag = OrderDetails.msgTip(" 旺旺名称不能为空，请输入");
            $(".order_contact").focus();
            return;
        }

        if (!extent1.length) {
            flag = OrderDetails.msgTip(" 估价不能为空，请输入");
            $(".order_customerprice").focus();
            return;
        }
        
        if($("#source").text()=="请选择")
        {
            flag = OrderDetails.msgTip("请选则订单来源");
            Common.shake($(".source"),"border-red",4);
            return;
        }



        // if(!mindprice.length) {
        //     flag = OrderDetails.msgTip(" 客户预算不能为空，请输入");
        //     $(".order_evaluate").focus();
        //     return;
        // }
        // if(!stopDay.toString().length) {
        //     flag = OrderDetails.msgTip(" 截止工期不能为空，请输入");
        //     $(".order_deadline").focus();
        //     return;
        // }


        // if(!acc_url) {
        //     flag = OrderDetails.msgTip("请上传附件，请输入");
        //     return;
        // }


        // if(!goodsimage) {
        //     flag = OrderDetails.msgTip("至少上传一张图片");
        //     return;
        // }

        // ==>> 3.0 拼装数据,ajax进行发送
        if (flag) {

            data.userId = userId;
            data.roletype = roletype;
            data.token = token;
            data.commandcode = commandcode;
            data.number = number;
            data.deadline = deadline || 10;
            data.length = length;
            data.width = width;
            data.height = height;
            data.goodsclass = goodsclass;
            data.texturename = texturename;
            data.accessoriesname = accessoriesname;
            data.color = color;
            data.technology = technology;
            data.customerid = customerid;
            data.extent1 = extent1;
            data.mindprice = mindprice;
            data.goodsimage = goodsimage;
            data.referencepictureurl1 = referencepictureurl1;
            data.referencepictureurl2 = referencepictureurl2;
            data.referencepictureurl3 = referencepictureurl3;
            data.accessoryid = accessoryid;
            data.accessoryurl = accessoryurl;
            data.memo = memo;
            data.factorymemo = factorymemo;
            data.fromplatform=fromplatform;
            data.stopDay = stopDay;
            data.shape = $(".moldOpenBtn").html();
            data.goodsid = 'abcd123456';  // ==>>临时测试哦!!!
            data.renew=append?1:0;
        }

        // ==>>4.0返回数据
        return {
            data: data,
            flag: flag
        }
    },
    msgTip: function (tipText) {
        Common.msg(tipText);
        return false;
    },
    newOrderFun: function () {//创建订单
        
        var obj = OrderDetails.checkMess();
        if (obj && obj.flag) {
            var data = obj.data;
            $("#submit").attr("disabled",true);
            OrderDetails.request(data, function (data) {
                if (data && data.status && data.status.msg) {
                    clearTimeout(timer);
                    var timer = null;
                    timer = setTimeout(function () {
                        parent.layer.closeAll();
                    }, 1000);
                    Common.msg(data.status.msg);
                }
            }, 'newOrder', null);
        }

    },
    end_data: {
        getDates: function (arg) {
            if (arg == undefined || arg == '') {
                return '';
            }

            var re = arg + '';
            if (re.length < 2) {
                re = '0' + re;
            }
            return re;
        },
        addDate: function (date, days) {
            if (days == undefined || days == '') {
                days = 1;
            }
            var date = new Date(date);
            date.setDate(date.getDate() + days);
            var month = date.getMonth() + 1;
            var day = date.getDate();
            return date.getFullYear() + '-' + this.getDates(month) + '-' + this.getDates(day);
        }
    }

};

var autoOffer = {
    init: function () {
        var that = this
        //下拉框绑定报价事件
        // $(".select_box li").on("click", function () {
        //     that.get();
        // });
        //
        // $(".confirm_addTech").on("click", function () {
        //     that.get();
        // });

        //***********
        $("#number").on("change", function () {
            that.get();
        });

        $("#length").on("change", function () {
            that.get();
        });
        $("#width").on("change", function () {
            that.get();
        });
        $("#height").on("change", function () {
            that.get();
        });
    },
    get: function () {
        var flag=true;
        flag=flag && $("#number").val()?true:false;
        flag=flag && $("#goodsclass").text()?true:false;
        flag=flag && $("#texturename").text()?true:false;
        flag=flag && $("#shape").text()?true:false;
        flag=flag && $("#color").text()?true:false;
        flag=flag && $("#technology").text()?true:false;
        flag=flag && $("#length").val()?true:false;
        flag=flag && $("#height").val()?true:false;
        flag=flag && $("#width").val()?true:false;
        flag=flag && $("#accessoriesname").text()?true:false;

        if(!flag)//不符合报价条件
        return;

        
        $(".evaluation").addClass("active");
        var url=Common.getUrl()['order'] + Common.getDataInterface()['autoPrice'];
        var data={
            "userid": $.cookie('userid'),
            "token": $.cookie('token'),
            "roletype": $.cookie('roletype'),
            "commandcode": "70",
            "number": $("#number").val(),
            "goodsclass": $("#goodsclass").text(),
            "texturename": $("#texturename").text(),
            "shape": $("#shape").text(),
            "color": $("#color").text(),
            "technology": $("#technology").text(),
            "length": $("#length").val(),
            "width": $("#width").val(),
            "height": $("#height").val(),
            "accessoriesname": $("#accessoriesname").text(),
            "goodsid": "abcd123456",
        };
        Common.ajax(url,
            data,
            true,
            function (data) {
                if(data.status.code==0)
                {
                    $("#evaluation").val(data.status.AutoPriceService);
                }
            $(".evaluation").removeClass("active");
        }, function (err) {
                $(".evaluation").removeClass("active");
        }, null, false);
    }
}

