/**
 * Created by inshijie on 2018/5/22.
 */
var id="";
var uploader="";
var base = {
    data:{},
    init: function () {
        var that = this;
        id=Common.getUrlParam('id');
        uploader=Common.getUrlParam('uploader');
        var imgsrc=Common.getUrlParam('imgsrc');

        $("#badge").attr('src',imgsrc);
        $("#badge").attr('data-original',imgsrc);

        //$('#badge').viewer({url:"data-original"});
        //$('#badge').viewer('show'); //如果要在下载弹窗外面显示预览图则在父页面放一个img 将其隐藏，父业面放一个方法中加入此行代码来触发

        $('.show-more').on('click',function () {
           that.moreLabel();
        });

        that.getdata(id,uploader);
        that.getDownPoint();

    },
    moreLabel:function () {
        var that = this;
        // $(".label-container").addClass("edit");
        // $(".show-more").addClass("hide");
        // that.renderLabel();
    },
    endMoreLabel:function () {
        $(".label-container").removeClass("edit");
        $(".show-more").removeClass("hide");
    },
    getDownPoint:function () {//获取下载点数
        Common.ajax(Common.getUrl()["resource"]+Common.getDataInterface()["getDownloadPoint"],{
            "userId": $.cookie('userId'),
        },true,function (data) {
            if(data.code==0)
            {
                $("#download_point").text(data.downloadPoint||"0");
            }
        },function (err) {
            console.warn("点数获取失败");
        },null,false);
    },
    getdata: function (id,uploader) {
        var that = this;
        Common.ajax(Common.getUrl()["resource"]+Common.getDataInterface()["getResourceDetail"],{
            "id": id,
 			"uploader": uploader,
        },true,function (data) {
            if(data.code==0&&data.resource)
            {
                var resource=data.resource;
                that.data=data;
                $("#uploader").text(resource.uploader||"");//作者
                $("#upload_date").text(resource.uploadTime);//上传时间
                var resourceTitle=resource.resourceTitle.length>10?resource.resourceTitle.substring(0,10)+"...":resource.resourceTitle;
                $("#title").text(resourceTitle);//标题
                $("#title").attr("title",resource.resourceTitle);
                $("#downloac_num").text(resource.downloadNum);//下载次数
                that.renderLabel(true);//渲染打标签
            }
        },function (err) {

        },"post");
    },
    renderLabel:function (limit,showMore) {
        //渲染标签
        var that=this;
        if(that.data&&that.data.resource)
        {
            var resource=that.data.resource;
            var labels=[];
            if(resource.labelContent)
            {
                labels=resource.labelContent.split(/[,，]/);
            }

            if(labels.length>0)
            {
                // if(labels.length>6&&!showMore)
                // {
                //     $(".show-more").removeClass("hide");
                // }

                $(".label-container").html('');
                $.each(labels,function (i,item) {
                    // var flag=limit && i>6?false:true;
                    if(/*flag &&*/ $.trim(item)!="")
                    {
                        $(".label-container").append("<span class='label-element'>"+item+"</span>");
                    }

                });
            }
            else
            {
                $('.label-msg').removeClass("hide");
            }
        }
        //渲染标签结束
        if($(".label-container")[0].scrollHeight > ($(".label-container")[0].innerHeight || $(".label-container")[0].clientHeight))
        {
            $(".label-container").addClass("edit");
        }

    },
    addLabel:function () {
        var that = this;
        var content=$("#add_input").val();
        content=$.trim(content);

        var labels=content.split(/[,，]/);
        for(var i=0;i<labels.length;i++)
        {
            if(Common.getStrLeng(labels[i])>10)
            {
                Common.msg("单个标签不能超过10个符（1汉字两字符）",null,2000);
                return;
            }
        }

        if(content=="")
        {
            Common.msg("内容不允许为空",null,2000);
            return;
        }
        Common.ajax(Common.getUrl()["resource"]+Common.getDataInterface()["addResourLabel"],{
            "id": id,
            "labelContent":that.data.resource.labelContent+","+content,
            "uploader": $.cookie("userId"),
        },true,function (data) {
            if(data.code==0)
            {
                Common.msg(data.msg,200,2000,function () {
                    //that.endMoreLabel();
                    that.getdata(id,uploader);
                    that.moreLabel();
                    that.renderLabel();//渲染打标签
                    that.getDownPoint();
                    $("#add_input").val("");
                });
            }
            else
            {
                if(data.msg)
                {
                    console.warn("打标签后台返回："+data.msg  +"    code："+data.code);
                }
            }
        },function (err) {
            Common.msg("提交标签失败了。",404,2000);
            console.log(err);
        },"post");
    },
    download:function () {
        var that = this;
        Common.ajax(Common.getUrl()["resource"]+Common.getDataInterface()["downloadCount"],{
            "id": id,
            "downloader": $.cookie('userId'),
        },true,function (data) {
            if(data.code==0)
            {
                that.getdata(id,uploader);
                Common.download(that.data.resource.vectorgraphUrl);
                that.getDownPoint();
            }
            else
            {
                Common.msg(data.msg,null,2000);
            }
        },function (err) {
            Common.msg("下载失败了，稍后再试试。",404,2000);
            console.log(err);
        },"post");
    }
}

$(function () {
    base.init();
});