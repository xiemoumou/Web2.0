$(document).ready(function(){
    //点击拒绝按钮，实现显示拒绝理由的弹框
    $("strong.refuse_Refund").click(function(){
        $("div.refused_return_cont").show();
    });
    //选择退货地址的属性
    $("div.deliveryadd_Refund_box em").click(function(){
        $(this).addClass("bacred").siblings("em").removeClass("bacred");
    });
    //选择退货地址
    $("strong.deliveryadd_alias").click(function(){
        $(this).addClass("bacg_cuntermark").parent().siblings("h5").find("strong").removeClass("bacg_cuntermark");
    });
    //显示电话号码为123****4567
    $("span.tel01_Refund").text(changeTel("13542324296"));
    $("span.tel02_Refund").text(changeTel("13213504299"));
});
