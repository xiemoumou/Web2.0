(function ($) {
    $.extend({
        ms_DatePicker: function (options) {
            var defaults = {
                YearSelector: "#sel_year",
                MonthSelector: "#sel_month",
                DaySelector: "#sel_day",
                FirstText: "",
                FirstValue: ""
            };
            var selectObj=null;
            var opts = $.extend({}, defaults, options);
            var $YearSelector = $(opts.YearSelector);
            var $MonthSelector = $(opts.MonthSelector);
            var $DaySelector = $(opts.DaySelector);
            var FirstText = opts.FirstText;
            var FirstValue = opts.FirstValue;

            $YearSelector.on('click', function (e) {
                $(".datepicker ul").hide();
                $(this).find('ul').show();
                selectObj=$(this);
                e.stopPropagation();
            });

            $MonthSelector.on('click', function (e) {
                $(".datepicker ul").hide();
                $(this).find('ul').show();
                selectObj=$(this);
                e.stopPropagation();
            });

            $DaySelector.on('click', function (e) {
                $(".datepicker ul").hide();
                $(this).find('ul').show();
                selectObj=$(this);
                e.stopPropagation();
            });


            // 初始化
            var str = "<input value='" + FirstValue + "' disabled />   <ul></ul>";
            $YearSelector.html(str);
            $MonthSelector.html(str);
            $DaySelector.html(str);

            // 年份列表
            var yearNow = new Date().getFullYear();
            var yearSel = $YearSelector.attr("rel");
            $YearSelector.find('ul').html('');
            for (var i = yearNow; i >= 2013; i--) {
                var sed = yearSel == i ? "selected" : "";
                var yearStr = "<li value=\"" + i + "\" " + sed + ">" + i + "</li>";
                $YearSelector.find('ul').append(yearStr);
            }

            // 月份列表
            var monthSel = $MonthSelector.attr("rel");
            $MonthSelector.find('ul').html('');
            for (var i = 1; i <= 12; i++) {
                var sed = monthSel == i ? "selected" : "";
                i=i<10?"0"+i:i;
                var monthStr = "<li value=\"" + i + "\" " + sed + ">" + i + "</li>";
                $MonthSelector.find('ul').append(monthStr);
            }

            // 日列表(仅当选择了年月)
            function BuildDay() {
                // if ($YearSelector.find("input").val() == 0 || $MonthSelector.find("input").val() == 0) {
                //     // 未选择年份或者月份
                //     $DaySelector.html(str);
                // } else {

                    var temp=$DaySelector.find('input');
                    $DaySelector.find('ul').html('');
                    var year = parseInt($YearSelector.find("input").val());
                    var month = parseInt($MonthSelector.find("input").val());
                     month=parseInt(month);
                    var dayCount = 0;
                    switch (month) {
                        case 1:
                        case 3:
                        case 5:
                        case 7:
                        case 8:
                        case 10:
                        case 12:
                            dayCount = 31;
                            break;
                        case 4:
                        case 6:
                        case 9:
                        case 11:
                            dayCount = 30;
                            if(parseInt(temp.val())>dayCount)
                            {
                                temp.val(dayCount);
                            }
                            break;
                        case 2:
                            dayCount = 28;
                            if ((year % 4 == 0) && (year % 100 != 0) || (year % 400 == 0)) {
                                dayCount = 29;
                            }
                            if(parseInt(temp.val())>dayCount)
                            {
                                temp.val(dayCount);
                            }
                            break;
                        default:
                            break;
                    }

                    var daySel = $DaySelector.attr("rel");
                    for (var i = 1; i <= dayCount; i++) {
                        var sed = daySel == i ? "selected" : "";
                        i=i<10?"0"+i:i;
                        var dayStr = "<li value=\"" + i + "\" " + sed + ">" + i + "</li>";
                        $DaySelector.find('ul').append(dayStr);
                    }
                //}
                //点击下拉列表事件
                $DaySelector.find('li').on('click',function (e) {
                    var val= $(this).text();
                    var input= $(this).parent().prev();
                    $(input).val(val);
                    hide($(this).parent());
                    //BuildDay();
                    e.stopPropagation();
                });
            }

            // $MonthSelector.find('input').change(function () {
            //     BuildDay();
            // });
            // $YearSelector.find('input').change(function () {
            //     BuildDay();
            // });
            // if ($DaySelector.attr("rel") != "") {
            //     BuildDay();
            // }

            //点击下拉列表事件
            $YearSelector.find('li').on('click',function (e) {
                var val= $(this).text();
                var input= $(this).parent().prev();
                $(input).val(val);
                hide($(this).parent());
                BuildDay();
                e.stopPropagation();
            });

            //点击下拉列表事件
            $MonthSelector.find('li').on('click',function (e) {
                var val= $(this).text();
                var input= $(this).parent().prev();
                $(input).val(val);
                hide($(this).parent());
                BuildDay();
                e.stopPropagation();
            });


            $YearSelector.find("input").val(new Date().Format("yyyy"));
            $MonthSelector.find("input").val(new Date().Format("MM"));
            $DaySelector.find("input").val(new Date().Format("dd"));


            BuildDay();

            function hide(obj) {
                $(obj).hide();
            }

            $(document).on('click',function () {
                $(".datepicker ul").hide();
            });

        } // End ms_DatePicker
    });
})(jQuery);