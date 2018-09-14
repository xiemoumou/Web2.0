$(function () {
    /*模拟下拉单选菜单的效果*/
    $(document).on("click", ".select_box", function (event) {
        var select = $(this).find('ul');
        if (typeof parent.Main.currentClickObj != "undefined") {
            if (parent.Main.currentClickObj != null) {
                $(parent.Main.currentClickObj).hide();
                parent.Main.currentClickObj = null;
            }
            parent.Main.currentClickObj = select;
        }//隐藏其他下拉
        select.show();
        event.stopPropagation();
    });
    /* 当点击本页的其他地方时，下拉的部分会自动收起 */
    $(document).click(function (event) {
        var eo = $(event.target);
        if (eo.attr("class") != "option" && !eo.parent(".option").length) {
            $('.option').hide();
        }

    });
    /*赋值给文本框*/
    $(document).on("click", ".option li", function (e) {
        if (typeof parent.Main.currentClickObj != "undefined") {
            if (parent.Main.currentClickObj != null) {
                $(parent.Main.currentClickObj).hide();
                parent.Main.currentClickObj = null;
            }
        }//隐藏其他下拉
        var value = $(this).text();
        $(this).parent().siblings(".select_txt").text(value);



        if (typeof autoOffer != "undefined" && !$(this).parent().hasClass('none_offer')) {
            autoOffer.get();//发起实时报价
        }

        e.stopPropagation();
    });


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


    $(document).on('click',".zb-box",function (e) {
        e.stopPropagation();
    });

});


$(document).ready(function () {
    /*  模拟下拉多选菜单   */

    /* 点击工艺、电镀、开模中的确定按钮，添加到span中  */
    $(document).on("click", "button.confirm_addTech", function () {
        if (typeof parent.Main.currentClickObj != "undefined") {
            if (parent.Main.currentClickObj != null) {
                $(parent.Main.currentClickObj).hide();
                parent.Main.currentClickObj = null;
            }
        }//隐藏其他下拉

        var $parent = $(this).parent().parent("div"),
            arr = $parent.find(":checked").parent("label"),
            str_txt = "";
        if (arr.length >= 1) {
            for (var i = 0; i < arr.length; i++) {
                str_txt += arr[i].innerText + ";";
            }
        } else {
            str_txt = "请选择";
        }
        $parent.parent().parent().find(".techTypeBtn").text(str_txt);
        $parent.parent("h5").hide();
        if (typeof autoOffer != "undefined") {
            autoOffer.get();//发起实时报价
        }
    });
    ///点击下拉多选框时，隐藏父级同辈元素的子级多选框
    $(document).click(function (eve) {
        var eve = eve || window.event;
        var eo = $(eve.target);
        ( eo.parent() ).siblings(".type_tech").find(".tech_label_box").hide();

    });


    /* 点击工艺、电镀、开模，弹出多选框，进行多选，将已选选项选中 */
    $(document).on("click", "span.techTypeBtn", function (e) {
        if (typeof parent.Main.currentClickObj != "undefined") {
            if (parent.Main.currentClickObj != null) {
                $(parent.Main.currentClickObj).hide();
                parent.Main.currentClickObj = null;
            }
        }//隐藏其他下拉

        var box = $(this).next("h5");
        box.toggle();
        var $parent = $(this);
        var arr = $parent.text().trim();

        //选中项初始化
        var div = $(this).parent().find('h5').find('div');
        if (typeof parent.Main.currentClickObj != "undefined") {
            parent.Main.currentClickObj = $(div).parent();
        }
        // box.find('.zb-box').on('click', function (e) {//防止点击复选框隐藏菜单
        // 	if($(e.target)[0].className.indexOf('confirm_addTech')<0&&$(e.target)[0].className.indexOf('cancel_addTech'))
        // 	{
        // 		e.stopPropagation();
        // 	}
        // });


        if (arr) {
            var selectVals = arr.split(';');
            $.each(div.find('label'), function (i, item) {
                var checkbox = $(item).find("input:checkbox");
                if ($.inArray(checkbox.val(), selectVals) >= 0) {
                    checkbox.prop('checked', true);
                }
                else {
                    checkbox.prop('checked', false);
                }
            });
        }
        else {
            $.each(div.find('label'), function (i, item) {
                var checkbox = $(item).find("input:checkbox");
                checkbox.prop('checked', false);
            });
        }
        //选中项初始化结束
        e.stopPropagation();
    });

    $(document).on("click", "button.cancel_addTech", function () {
        $(this).parent().parent().parent("h5").hide();
    });

    //选择无
    $(document).on("click", ".cbx-none", function (e) {
        e.stopPropagation();
        var div = $(this).parent().parent();
        if (!$(this).prop('checked')) {
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
    $(document).on("click", ".drop-cbx", function (e) {
        var flag = true;
        var div = $(this).parent().parent();
        div.find('.cbx-none').prop('checked', false);
        //遍历是否有选中项目
        $.each(div.find('label'), function (i, item) {
            var checkbox = $(item).find("input:checkbox");
            if (checkbox.prop('checked')) {
                flag = false;
            }
        });
        if (flag) {
            div.find('.cbx-none').prop('checked', true);
        }
        e.stopPropagation();
    });


    /*规则：
     1 、在选择双面开模以前，所有的选项都是单选
     2、选中双面开模后：
     1、取消对“无”或者“浇铸”或者“模切”的选择，选中“双面开模”
     2、不用取消已经选中的带2D或者3D的项目
     3、带2D和3D两字的项目可以选择1个或者2个，最多两个项目
     3、如果选择了双面开模，又尝试选择：“无”或者“浇铸”或者“模切”，则取消所有现有勾选，只选中最新选择的项目*/
    $(document).on("click", ".mold-cbx-none,.mold-single", function (e) {
        e.stopPropagation();
        //判断是否选中双面开模
        var isDoubleSidedMold = false;
        if ($(e.target).val() == "双面开模") {
            isDoubleSidedMold = true;
        }

        var div = $(this).parent().parent();
        var isSelected=$(this).prop('checked');//是否勾选

        $.each(div.find('label'), function (i, item) {
            var checkbox = $(item).find("input:checkbox");
            if (!isDoubleSidedMold||isDoubleSidedMold&&!isSelected)//如果没选中双面开模，取消其他所有选中
            {
                checkbox.prop('checked', false);
            }
            else {
                if ($(checkbox).val().indexOf("2D") < 0 && $(checkbox).val().indexOf("3D") < 0) {
                    checkbox.prop('checked', false);
                }
            }

        });
        if(isSelected)
        {
            $(this).prop('checked', true);
        }
        else
        {
            $(".mold-cbx-none").prop('checked',true);
        }
    });

    //选择普通按钮
    $(document).on("click", ".mold-drop-cbx", function (e) {
        var flag = true;
        var div = $(this).parent().parent();
        //判断是否选中双面开模
        var isDoubleSidedMold = false;
        var dsmInput = $(this).parent().parent().find(".doubleSidedMold");
        if (dsmInput.prop('checked')) {
            isDoubleSidedMold = true;
        }

        var count_2D_3D = 0;
        var thisSelect=$(this).prop('checked');//获取当前选中状态
        //遍历是否有选中项目
        $.each(div.find('label'), function (i, item) {
            var checkbox = $(item).find("input:checkbox");

            if (checkbox.prop('checked')) {
                flag = false;
                if ($(checkbox).val().indexOf("2D") >= 0 || $(checkbox).val().indexOf("3D") >= 0)//统计选中2D与3D总数量)
                {
                    count_2D_3D++;
                }
            }

            //如果没选中'双面开模' 清除所有选中
            if (!isDoubleSidedMold) {
                $(checkbox).prop('checked', false);
            }
        });
        $(this).prop('checked', thisSelect);//操作当前是否被选中
        if(thisSelect)
        {
            div.find('.mold-cbx-none').prop('checked', false);
        }

        if (isDoubleSidedMold && count_2D_3D > 2)//如果选中'双面开模'的情况下又选择了2D3D超过两个则不能选中
        {
            $(this).prop('checked', false);
        }

        if (flag) {
            div.find('.mold-cbx-none').prop('checked', true);
        }
        e.stopPropagation();
    });

});
