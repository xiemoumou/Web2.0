$(function () {
    var operType=Helper.getUrlParam('operType');
    var customid=Helper.getUrlParam('customid');
    debugger
    $('#productPicture').attr('data-customid',customid);
    var url=config.WebService()['orderProductInfoImages_Query'];
    var photoArray=[];
    top.Requst.ajaxGet(url,{"customid":customid},false,function (data) {
        if(data.code==200)
        {
            if(data.data.smallReferenceImage1)
            {
                photoArray.push({'thumbnail':"http://"+data.data.smallReferenceImage1,'orgSrc':"http://"+data.data.middleReferenceImage1});
            }
            if(data.data.smallReferenceImage2)
            {
                photoArray.push({'thumbnail':"http://"+data.data.smallReferenceImage2,'orgSrc':"http://"+data.data.middleReferenceImage2});
            }
            if(data.data.smallReferenceImage3)
            {
                photoArray.push({'thumbnail':"http://"+data.data.smallReferenceImage3,'orgSrc':"http://"+data.data.middleReferenceImage3});
            }
        }
        render();
    })

    function render() {
        if(photoArray.length==0)
        {
            photoArray=null;
        }
        if(operType=="prev")
        {
            uploadfile.uploadPhoto("productPicture",3,photoArray,false);
        }
        else if(operType=="edit")
        {
            uploadfile.uploadPhoto("productPicture",3,photoArray,true);
        }
    }
});