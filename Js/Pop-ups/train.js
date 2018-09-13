$(function () {

});


var train = {
    Traindata: function () {
        var data = top.Cache['train-data'];
        for (var i = 0; i < data.length; i++) {


            var str = "<div class='train-list-box'>" +
                      "<div class='train-list-box-pre'>" +
                      "<div class='train-list'>" +
                      "<span class='train-list-1'>" + data[i] +"</span>" +
                      "<span class='train-list-2'>" + data[i].f_Number +"</span>" +
                      "<span class='train-list-3'>" + data[i]. f_Length+"x"+ data[i]. f_Width +"x"+"</span>" +
                      "</div>" +
                      "</div>" +
                      "<div class='train-input'>" +
                      "<input placeholder='请输入报价'>" +
                      "</div>" +
                      "</div>"
        }
    }
}