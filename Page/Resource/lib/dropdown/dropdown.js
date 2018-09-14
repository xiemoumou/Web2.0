/**
 * Created by inshijie on 2018/6/28.
 */

(function ($) {
    //点击空白收起菜单
    $(document).click(function () {
        DropUp();
    });

    function DropUp() {//收起菜单
        $(".lg-dropdownlist ul").slideUp('fast');
    }

    //下拉菜单 data：数据原， oneClickCallback:单击回调
    $.fn.DropDownList = function (data, oneClickCallback) {
        var tagObj = $(this); tagObj.html("");

        var val = tagObj.attr('data-val'); val = val ? val : ""; //获取标签上的默认值
        var dropdownlist = $('<div class="lg-dropdownlist"><span title="' + val + '">' + val + '</span><i></i></div>');

        var ul = $('<ul></ul>');
        tagObj.on('click', function (e) { //触发显示下拉菜单
            DropUp();
            //渲染数据
            if (!data) return;//如果数据源为空则退出

            ul.html('');
            for (var i = 0; i < data.length; i++) {
                var li = $('<li data-val="' + data[i].logisticscompany + '">' + data[i].logisticscompany + '</li>');

                i % 2 != 0?li.addClass("even"):li.addClass("odd"); //设置各行变色

                li.on('click', function (e) {//列表点击事件
                    var liObj = $(this);
                    if (oneClickCallback) {
                        oneClickCallback(liObj.attr("data-val"));
                    }
                    var span = liObj.parent().parent().find('span');
                    $(span).html(liObj.text());//赋值
                    $(span).attr('title',liObj.text());
                    ul.slideUp('fast',function () {
                        ul.html("");
                    });//收起菜单
                    e.stopPropagation();
                });
                ul.append(li);
            }

            ul.slideDown('fast');
            e.stopPropagation();
        });

        dropdownlist.append(ul);
        tagObj.append(dropdownlist);
    }

    //下拉不选框 data：数据原， oneClickCallback:单击回调
    $.fn.DropDownBox = function (data, oneClickCallback)
    {
        var tagObj = $(this); tagObj.html("");
        var width=tagObj.attr('data-width')||356;
        var height=tagObj.attr('data-height')||172;
        var defaultValue=tagObj.attr('data-val')||"";
        var dropdownlist = $('<div class="lg-dropdownbox"><span title="' + defaultValue + '">' + defaultValue + '</span><i></i></div>');
        var div=$("<div class='drop-box' style='width: "+width+"px; height:"+height+"px;'></div>");
        var ul = $('<ul></ul>');


        var btn=$('<div><button class="btn">确定</button><button class="btn-h">取消</button></div>');
        div.append(ul);
        div.append(btn);
        dropdownlist.append(div);
        tagObj.append(dropdownlist);
    }

    //开模方式 data：数据原， oneClickCallback:单击回调
    $.fn.DropDownMold = function (data, oneClickCallback)
    {
        var tagObj = $(this); tagObj.html("");
        var width=tagObj.attr('data-width')||160;
        var height=tagObj.attr('data-height')||206;
        var defaultValue=tagObj.attr('data-val')||"";
        var dropdownlist = $('<div class="lg-dropdownlist"><span title="' + defaultValue + '">' + defaultValue + '</span><i></i></div>');
        tagObj.append(dropdownlist);
    }
})(jQuery);