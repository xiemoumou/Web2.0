$(document).ready(function(){
    //实现导航栏中个人资料的显示和隐藏
    $("li.perDet_headl").click(function(){
        $("p.perDet_cont").slideDown();
    });
});
//调用年月日的模块
$(function(){  
                $.ms_DatePicker({  
                    YearSelector: "#select_year",  
                    MonthSelector: "#select_month",  
                    DaySelector: "#select_day"  
                });  
                
    }); 
