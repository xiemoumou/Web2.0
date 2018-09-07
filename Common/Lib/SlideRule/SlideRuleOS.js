
var priceSlider = {
    callback:{
        redCallback:null,
        blueCallback:null,
        yellowCallback:null
    },
    step:10,
    initSlideRuleOS:function (callback) {
        if(callback)
        {
            priceSlider.callback=callback;
        }

        var scrollBar = $(".slide-rule-os");
        $.each(scrollBar, function (i, item) {
            $(item).html('');
            $(item).append($('<div class="blue-point point-os" style="display: none"></div>  <!--蓝色--><div class="yellow-point point-os" style="display: none"></div>  <!--黄色--><div class="red-point point-os" style="display: none"></div>  <!--红色--><div class="red-darrow darrow-os" style="display: none"><div class="darrow-os-container"><span></span></div></div><div class="yellow-darrow darrow-os" style="display: none"><div class="darrow-os-container"><span></span></div></div><!--界限--><span class="lu">0</span><span class="up-name"></span><span class="ru"></span><span class="ld"></span><span class="down-name"></span><span class="rd"></span><div class="show-value"><div class="row"><div class="red" style="display:none;"><label>报价:</label><div class="red-div"><input type="text" maxlength="6" class="red-value number-input"/><button class="red-btn">定价</button></div></div><div class="blue" style="display:none;"><label>设计费:</label><div class="blue-div"><input type="text" maxlength="6" class="blue-value number-input"/><button class="blue-btn">确定</button></div></div><div class="yellow mt-8"  style="display:none;"><label>预算:</label><div class="yellow-div"><input type="text" maxlength="6" class="yellow-value number-input"/><button class="yellow-btn">确定</button></div></div><div class="guide-fee mt-8" style="display: none"><label>引导费:</label><span class="guide-fee-value">220元</span></div><!--引导费用--></div></div>'));

            priceSlider.step=parseInt($(item).attr('data-step'))||1;

            //设置滑动尺区间值
            var up_min_val=$(item).attr('data-up-min')||0;//滑动尺up最小值
            var up_max_val=$(item).attr('data-up-max')||1000;//滑动尺up最大值

            var down_min_val=$(item).attr('data-down-min')||100;//滑动尺down最小值
            var down_max_val=$(item).attr('data-down-max')||800;//滑动尺down最大值


            // 初始化滑动尺名称
            $(item).find('.up-name').html($(item).attr('data-up-name'));
            $(item).find('.down-name').html($(item).attr('data-down-name'));

            //箭头名称:值
            $(item).find('.red-darrow .darrow-os-container span').html($(item).attr('data-red-darrow-name'));
            $(item).find('.yellow-darrow .darrow-os-container span').html($(item).attr('data-yellow-darrow-name'));

            //显示与隐藏+是否可拖拽
            if($(item).is('[guide-fee-show]')) //设计引导费
            {
                $(item).find('.show-value .guide-fee').show();
            }

            if ($(item).is('[data-yellow-point-show]')) {
                $(item).find('.yellow-point').show();//黄点是否显示
                $(item).find('.show-value .yellow').show();//显示输入确认按钮
                if(!$(item).is('[islock-yellow-point]'))//黄点是否可拖拽
                {
                    priceSlider.init(item, $(item).find('.yellow-point'), up_min_val, up_max_val, scrollBar,$(item).find('.show-value .yellow-value'),function (item) {
                        var yellowpointval=$(item).find('.show-value .yellow-value').val();
                        $(item).attr('data-yellow-point-val',yellowpointval);
                        $(item).find('.yellow-darrow').attr('cur_val',yellowpointval);
                    });
                    $(item).find('.show-value .yellow-btn').on('click',function () {//黄按钮事件
                        priceSlider.btnClick.yellowBtn(item, scrollBar)
                    });
                }
                else
                {
                    $(item).find('.yellow-point').css("z-index","100");
                    $(item).find('.show-value .yellow-value').attr('readonly',"readonly");
                }
            }

            if ($(item).is('[data-red-point-show]')) {
                $(item).find('.red-point').show();//红点是否显示
                $(item).find('.show-value .red').show();
                if(!$(item).is('[islock-red-point]'))//红点是否可拖拽
                {
                    priceSlider.init(item, $(item).find('.red-point'), up_min_val, up_max_val, scrollBar,$(item).find('.show-value .red-value'),function (item) {
                        var redpointval=$(item).find('.show-value .red-value').val();
                        $(item).attr('data-red-point-val',redpointval);
                        $(item).find('.red-darrow').attr('cur_val',redpointval);
                    });
                    $(item).find('.show-value .red-btn').on('click',function () {//红按钮事件
                        priceSlider.btnClick.redBtn(item, scrollBar)
                    });
                }
                else
                {
                    $(item).find('.red-point').css("z-index","100");
                    $(item).find('.show-value .red-value').attr('readonly','readonly');
                }
            }

            if ($(item).is('[data-blue-point-show]')) {
                $(item).find('.blue-point').show();//蓝点是否显示
                $(item).find('.show-value .blue').show();
                if(!$(item).is('[islock-blue-point]'))//蓝点是否可拖拽
                {
                    priceSlider.init(item, $(item).find('.blue-point'), down_min_val, down_max_val, scrollBar,$(item).find('.show-value .blue-value'),function (item) {
                        $(item).attr('data-blue-point-val',$(item).find('.show-value .blue-value').val());
                        priceSlider.changeGuideFee(item);//改变引导费
                    },1);
                    $(item).find('.show-value .blue-btn').on('click',function () {//蓝按钮事件
                        priceSlider.btnClick.blueBtn(item, scrollBar)
                    });
                }
                else
                {
                    $(item).find('.blue-point').css("z-index","100");
                    $(item).find('.show-value .blue-value').attr('readonly','readonly');
                }
            }

            if ($(item).is('[data-yellow-darrow-show]')) {
                $(item).find('.yellow-darrow').show();//黄箭头是否显示
            }
            if ($(item).is('[data-red-darrow-show]')) {
                $(item).find('.red-darrow').show();//红箭头是否显示
            }

            // 滑动轴区间值
            $(item).find('.lu').html(up_min_val);
            $(item).find('.ru').html(up_max_val);
            $(item).find('.ld').html(down_min_val);
            $(item).find('.rd').html(down_max_val);




            //赋值
            $(item).find('.show-value .guide-fee-value').html("¥"+$(item).attr('guide-fee-value'));//设计引导费费

            $(item).find('.blue-point').attr('cur_val',$(item).attr('data-blue-point-val'));
            $(item).find('.show-value .blue-value').val($(item).attr('data-blue-point-val'));


            $(item).find('.yellow-point').attr('cur_val',$(item).attr('data-yellow-point-val'));
            $(item).find('.show-value .yellow-value').val($(item).attr('data-yellow-point-val'));

            $(item).find('.red-point').attr('cur_val',$(item).attr('data-red-point-val'));
            $(item).find('.show-value .red-value').val($(item).attr('data-red-point-val'));

            $(item).find('.red-darrow').attr('cur_val',$(item).attr('data-red-darrow-val'));
            $(item).find('.red-darrow .darrow-os-container span').html($(item).attr('data-red-darrow-name')+$(item).attr('data-red-darrow-val'));

            $(item).find('.yellow-darrow').attr('cur_val',$(item).attr('data-yellow-darrow-val'));
            $(item).find('.yellow-darrow .darrow-os-container span').html($(item).attr('data-yellow-darrow-name')+$(item).attr('data-yellow-darrow-val'));

            $(item).find('.data-guide-fee-value').html($(item).attr('guide-fee-value')+"元");



            priceSlider.valueChange(item, scrollBar);//初始化点位置

            if($(item).is('[data-red-name]')) //红色label名称
            {
                
                $(item).find('.red label').text("报价"+$(item).attr('data-red-name')+":");
                if($(item).attr('data-red-name').length>4)
                {
                    $(item).find('.red label').css("left","-45px");
                }
                else
                {
                    $(item).find('.red label').css("left","-31px");
                }
            }

        });

        $('.slideruleos-container .number-input').keyup(function () {
            $(this).val(parseInt($(this).val()));
            if($(this).val()=="NaN")
            {
                $(this).val(0);
            }
        });
    },
    valueChange: function (item, scrollBar) {
        /*设置点位置*/ //需要data-design-min等换成up_min_val
        var down_min = $(item).attr('data-down-min'); down_min = parseFloat(down_min);
        var up_min = $(item).attr('data-up-min'); up_min = parseFloat(up_min);

        var down_max = $(item).attr('data-down-max'); down_max = parseFloat(down_max);
        var up_max = $(item).attr('data-up-max'); up_max = parseFloat(up_max);

        //蓝色点
        var blue_point_cur = $(item).find('.show-value .blue-value').val();blue_point_cur = parseFloat(blue_point_cur);
        if(blue_point_cur>down_max)
        {
            blue_point_cur=down_max;
        }
        else if(blue_point_cur<down_min)
        {
            blue_point_cur=down_min;
        }
        $(item).find('.show-value .blue-value').val(blue_point_cur);
        blue_point_cur = (blue_point_cur - down_min) * ($(scrollBar)[0].clientWidth - 10) / down_max;
        blue_point_cur=Math.ceil(blue_point_cur);
        $(item).find('.blue-point').css('left', blue_point_cur + "px")
        priceSlider.changeGuideFee(item);//改变引导费

        //黄色点
        var yellow_point_cur = $(item).find('.show-value .yellow-value').val(); yellow_point_cur = parseFloat(yellow_point_cur);
        if(yellow_point_cur>up_max)
        {
            yellow_point_cur=up_max;
        }
        else if(yellow_point_cur<up_min)
        {
            yellow_point_cur=up_min;
        }
        $(item).find('.show-value .yellow-value').val(yellow_point_cur);
        yellow_point_cur = (yellow_point_cur - up_min) * ($(scrollBar)[0].clientWidth - 10) / up_max;
        yellow_point_cur=Math.ceil(yellow_point_cur);
        $(item).find('.yellow-point').css('left', yellow_point_cur + "px")


        //红色点
        var red_point_cur = $(item).find('.show-value .red-value').val(); red_point_cur = parseFloat(red_point_cur);
        if(red_point_cur>up_max)
        {
            red_point_cur=up_max;
        }
        else if(red_point_cur<up_min)
        {
            red_point_cur=up_min;
        }
        $(item).find('.show-value .red-value').val(red_point_cur);
        red_point_cur = (red_point_cur - up_min) * ($(scrollBar)[0].clientWidth - 10) / up_max;
        red_point_cur=Math.ceil(red_point_cur);
        $(item).find('.red-point').css('left', red_point_cur + "px")

        //红箭头
        var red_darrow_cur = $(item).find('.red-darrow').attr('cur_val'); red_darrow_cur = parseFloat(red_darrow_cur);
        if(red_darrow_cur>up_max)
        {
            red_darrow_cur=up_max;
        }
        else if(red_darrow_cur<up_min)
        {
            red_darrow_cur=up_min;
        }
        red_point_cur = (red_darrow_cur - up_min) * ($(scrollBar)[0].clientWidth-4) /up_max;
        $(item).find('.red-darrow').css('left', red_point_cur + "px");
        $(item).find('.red-darrow .darrow-os-container span').html($(item).attr('data-red-darrow-name')+$(item).attr('data-red-darrow-val'));

        //黄箭头
        var yellow_point_cur = $(item).find('.yellow-darrow').attr('cur_val'); yellow_point_cur = parseFloat(yellow_point_cur);
        if(yellow_point_cur>up_max)
        {
            yellow_point_cur=up_max;
        }
        else if(yellow_point_cur<up_min)
        {
            yellow_point_cur=up_min;
        }
        yellow_point_cur = (yellow_point_cur - up_min) * ($(scrollBar)[0].clientWidth-4) / up_max;
        $(item).find('.yellow-darrow').css('left', yellow_point_cur + "px");
        $(item).find('.yellow-darrow .darrow-os-container span').html($(item).attr('data-yellow-darrow-name')+$(item).attr('data-yellow-darrow-val'));

    },
    init: function (barObj, obj, minValue, maxValue, scrollBar,showValObj,callback,step) {
        //滑块
        obj.on('mousedown', function (event) {
            var event = event || window.event;
            var leftVal = event.clientX - this.offsetLeft;
            if(step)
            {
                priceSlider.step=step;
            }
            else
            {
                priceSlider.step=10;
            }


            // 拖动一定写到 down 里面才可以
            document.onmousemove = function (event) {
                var event = event || window.event;
                priceSlider.compute(obj, event, leftVal, showValObj, 0, ($(scrollBar)[0].clientWidth - 10), maxValue, minValue);
                window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
                if(callback)
                    callback(barObj);
            }
            document.onmouseup = function () {
                document.onmousemove = null;   // 弹起鼠标不做任何操作
            }
        });
    },
    compute: function (obj, event, curleftVal, showValObj, currValue, axisWidth, axisMaxVal, axisMinVal) {//
        axisMaxVal = parseFloat(axisMaxVal);
        //currValue = parseFloat(currValue);
        axisMinVal = parseFloat(axisMinVal);
        $(obj).css('left', event.clientX - curleftVal + 'px');
        var val = parseFloat($(obj).css('left'));
        if (val < 0) {
            $(obj).css('left', "0px");
        } else if (val > axisWidth) {
            $(obj).css('left', axisWidth + "px");
        }
        //var currentValue = parseFloat( $(obj).css('left')/ axisWidth * axisMaxVal);
        var curPos = parseFloat($(obj).css('left')) + axisMinVal * axisWidth / axisMaxVal;
        var currentValue = parseFloat(curPos / (axisWidth + (axisMinVal * axisWidth / axisMaxVal)) * axisMaxVal);
        if (currentValue < axisMinVal) {
            currentValue = axisMinVal;
        }
        //var val=Math.ceil(currentValue/priceSlider.step)*priceSlider.step;
        var val=0;
        if(currentValue != axisMinVal)
        {
            val=Math.ceil(currentValue/priceSlider.step)*priceSlider.step
        }
        else
        {
            val=currentValue;
        }
        showValObj.val(val);
        obj.attr('cur_val',val);
    },
    btnClick:{
        redBtn:function (item,scrollBar) {//红色按钮事件
            if(priceSlider.callback.redCallback)
            {
                priceSlider.callback.redCallback(item,scrollBar);
            }
            else
            {
                priceSlider.change(item,scrollBar);
            }
        },
        yellowBtn:function (item,scrollBar) {//黄色按钮事件
            if(priceSlider.callback.yellowCallback)
            {
                priceSlider.callback.yellowCallback(item,scrollBar);
            }
            else
            {
                priceSlider.change(item,scrollBar);
            }
        },
        blueBtn:function (item,scrollBar) {//蓝色按钮事件
            if(priceSlider.callback.blueCallback)
            {
                priceSlider.callback.blueCallback(item,scrollBar);//执行回掉返回成功
            }
            else
            {
                priceSlider.change(item,scrollBar);
            }
        },
    },
    change:function (item,scrollBar,isRefresh) {//刷新轴坐标

        if(isRefresh)
        {
            //红点与箭头
            var redpointval=$(item).find('.show-value .red-value').val();
            $(item).find('.red-point').attr('cur_val',redpointval);
            $(item).attr('data-red-point-val',redpointval);
            $(item).find('.red-darrow').attr('cur_val',redpointval);

            //黄点与箭头
            var yellowpointval=$(item).find('.show-value .yellow-value').val();
            $(item).find('.yellow-point').attr('cur_val',yellowpointval);
            $(item).attr('data-yellow-point-val',yellowpointval);
            $(item).find('.yellow-darrow').attr('cur_val',yellowpointval);
            //蓝点
            $(item).find('.blue-point').attr('cur_val',$(item).find('.show-value .blue-value').val());
            $(item).attr('data-blue-point-val',$(item).find('.show-value .blue-value').val());
            priceSlider.valueChange(item, scrollBar);
        }
        else
        {
            $(item).find('.show-value .blue-value').val($(item).find('.blue-point').attr('cur_val'));
            $(item).find('.show-value .yellow-value').val($(item).find('.yellow-point').attr('cur_val'));
            $(item).find('.show-value .red-value').val($(item).find('.red-point').attr('cur_val'));
        }
    },
    changeGuideFee:function (item) {
        //此处为改变蓝点位置后的回掉
        //计算设计引导费
        var down_max=parseInt($(item).attr('data-down-max'));//设计费上线
        var design_fee=parseInt($(item).find('.show-value .blue-value').val());//设计费
        var guide_fee=(down_max-design_fee)*(30/100);guide_fee=parseInt(guide_fee);

        $(item).attr('guide-fee-value',guide_fee);//主轴上的设计引导费值
        $(item).find('.show-value .guide-fee-value').html("¥"+guide_fee);//设计引导费费
    }
}