
$(function () {
    message.mess();
})



var message = {
    mess: function() {
        $(".message-msg-box-pre").children("div:first").css("background-color", "#fcfcfc");
        $(".message-msg-box-pre").children("div:even").addClass("one");
        $(".message-msg-box-pre").children("div:odd").addClass("two");
 }
}