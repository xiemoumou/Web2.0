$(function () {
   $(".red-button").on('clcik',function () {
       train.Trainbtn();
   });

    train.Traindata();
});


var train = {
    Traindata: function () {
        var data = top.Cache['train-data'];
        $(".tran-date").text(data[0].f_UserPeriod);//工期
        $(".tran-num").text(data[0].f_Number);//数量
        $(".tran-size").text(data[0].f_Length+'x'+data[0].f_Width+'x'+data[0].f_Height);//尺寸
        $(".tran-mey").text(data[0].f_OrderPrice);//报价
        for (var i = 0; i < data.length; i++) {
            var str = "<div class='train-list-box'>" +
                      "<div class='train-list-box-pre'>" +
                      "<div class='train-list'>" +
                      "<span class='train-list-1'>" + data[i] +"</span>" +
                      "<span class='train-list-2'>" + data[i].number +"</span>" +
                      "<span class='train-list-3'>" + data[i].length+"x"+ data[i].width +"x"+data[i].height+"</span>" +
                      "</div>" +
                      "</div>" +
                      "<div class='train-input'>" +
                      "<input placeholder='请输入报价'  data-index='"+i+"'>" +
                      "</div>" +
                      "</div>"

            $($(str).find('input')).blur(function () {
               var data_index =  $(this).attr('data-index');
                data[data_index]['f_OrderPrice'] =$(this).val() ;
            });
            $(".train-list-rend").append(str);
        }
    },
    Trainbtn: function () {

        var Data_code =  JSON.stringify(top.Cache['train-data']);
        var data ={
            "datas":Data_code,
        }
        var url = config.WebService()["algorithmTrainningInsert"];
        Requst.ajaxPost(url, data, true, function (data) {

        });

    }




}