/**
 * Created by inshijie on 2018/6/12.
 */
var SysParam = "";
var roleType = -1;//获取角色
var isMessage=false;//是否有消息
var Cache={};//全局缓存

$(function () {
    var pageLoading_start=new Date(); pageLoading_start.toLocaleString();//初始化计时

    roleType = top.Helper.Cache.get('roleType');
    roleType =parseInt(roleType);//获取角色
    if (localStorage.getItem('SysParam'))//从缓存获取字典
    {
        try {
            SysParam = JSON.parse(localStorage.getItem('SysParam'));
        }
        catch (e) {

        }
    }

    //显示资源库按钮
    if(roleType==1||roleType==4||roleType==2)
    {
        $(".resource").removeClass('hide');
        $(".resource").on('click',function () {
            top.window.location.href="./Resource/resource.html";
        });
    }

    classMain.init();

    classMain.message();//获取消息

    var pageLoading_end=new Date(); pageLoading_end.toLocaleString();//初始化计时
    console.log("workbench加载用时：" +Helper.Date.timeDifference(pageLoading_start,pageLoading_end)+"秒。");
});

var classMain = {
    getStatistics:function () {
      //获取统计
        var url=config.WebService()["orderSupplementaryCount_Query"];
        Requst.ajaxGet(url,{},true,function (data) {
            if(data.code==200)
            {
                for(var i=0;i<data.data.length;i++)
                {
                    var item=data.data[i];
                    var staObj=$(".nav .identity_"+item.nviId);
                    if(staObj.length && staObj.length>0 && item.count>0)
                    {
                        staObj.removeClass('hide');
                        staObj.text(item.count);
                    }
                    else
                    {
                        staObj.addClass('hide');
                    }
                }
            }
        },function (error) {
            console.log("获取统计数据失败");
        },true);
    },
    message:function () {
        var playSound=$("#playSound");

        //定时轮询消息
        getMessage();
        setInterval(function () {
            getMessage();
        },6000);

        function getMessage() {
            var url=config.WebService()["messageCount"];
            top.Requst.ajaxGet(url,{},true,function (data) {
                if(data.code==200)
                {
                    var orderMessage=$(".order-message");
                    var data=data.data;
                    var totalCount=data.all;//总条数
                    var didntRead=data.didntRead;//未读条数
                    var hasRead=data.hasRead;//已读条数
                    if(didntRead>0)//有未读消息
                    {
                        orderMessage.removeClass("hide");
                        $("#didntReadCount").text(didntRead);
                        playSound.html('');
                        playSound.append($('<audio autoplay="autoplay"><source src="../Common/Media/audio/71.mp3" type="audio/mpeg" /></audio>'));
                        isMessage=true;
                    }
                    else if(!orderMessage.hasClass('hide'))//没有未读消息
                    {
                        isMessage=false;
                        orderMessage.addClass("hide");
                    }
                    pageHeightSet();
                }
            },function (error) {
                console.log("获取消息条数失败");
            },true);
        }

        //点击进入消息列表
        $("#enterMessageList").on('click',function () {
            var scrollH = top.Helper.getClientHeight();
            var popH = scrollH - 100 > 580 ? 580 : scrollH - 100;
            top.Popup.open( '消息列表',929, popH,'./Pop-ups/message.html');
        });
    },
    pagePrams: {'curIndex': 1, 'totalPage': 1, 'pageSize': 10, 'isInit': -1, 'dataType': ''},//分页参数
    initPage: function () {//初始化分页插件
        var that = this;
        if (that.pagePrams.isInit > 0)
            return;
        that.pagePrams.isInit = 1;
        that.pagePrams.curIndex = 1;
        $(".page-box").html("");
        $(".page-box").append($("<div id=\"pagination\" class=\"page fr\"></div>"));
        $("#pagination").pagination({
            currentPage: that.pagePrams.curIndex,
            totalPage: that.pagePrams.totalPage,
            isShow: true,
            count: that.pagePrams.pageSize,
            callback: function (currIndex) {
                that.pagePrams.curIndex = currIndex;//分页保持
                that.loadOverview(that.pagePrams.dataType, currIndex);
            }
        });
    },
    init: function () {
        $("body").append($('<ul id="previewImg"></ul>'));//图片预览用
        var that = this;

        //昵称
        var mickName = top.Helper.Cache.get('mickName');
        if (mickName) {
            $("#mickName").text(mickName);
        }

        that.initEvent.sort();//初始化概览排序

        //页面高度初始化
        pageHeightSet();

        // 加载系统字典
        function loadSystemParams(async) {
            async = async ? async : false;
            var getSysParam = top.config.WebService()['getSysParam'];
            top.Requst.ajaxGet(getSysParam, null, async, function (data) {
                var dict_start=new Date(); dict_start.toLocaleString();//初始化计时

                data = data.data;

                var dict = {};
                var goodsClass = [];
                dict['goodsClass'] = format(goodsClass, data.flatRelation.goodsClass, 'goodsClass');//品类
                var material = [];
                dict['material'] = format(material, data.flatRelation.material, 'material');//材质
                var accessories = [];
                dict['accessories'] = format(accessories, data.flatRelation.accessories, 'accessories');//配件
                var model = [];
                dict['model'] = format(model, data.flatRelation.model, 'model');//开模
                var technology = [];
                dict['technology'] = format(technology, data.flatRelation.technology, 'technology');//工艺
                var color = [];
                dict['color'] = format(color, data.flatRelation.color, 'color');//电镀色
                var shop = [];
                dict['shop'] = format(shop, data.flatRelation.shop, 'shop');//客源
                var platform = [];
                dict['platform'] = format(platform, data.flatRelation.platform, 'platform');//平台
                var size = [];
                dict['size'] = format(size, data.flatRelation.size, 'description');//尺寸
                dict['relationMaterial'] = data.relation[0];//材质关系
                dict['relationTechnology'] = data.relation[1];//工艺关系
                dict['relationGoodsclass'] = data.relation[2];//品类关系
                dict['orderStatus'] = data.orderStatus;//订单状态
                dict['element'] = {
                    "goodsClass": {},
                    "material": {},
                    "accessories": {},
                    "model": {},
                    "technology": {},
                    "color": {},
                    "shop": {}
                };

                //用于概览的字典
                formatElement(dict['goodsClass'], 'goodsClass');
                formatElement(dict['material'], 'material');
                formatElement(dict['accessories'], 'accessories');
                formatElement(dict['model'], 'model');
                formatElement(dict['technology'], 'technology');
                formatElement(dict['color'], 'color');
                formatElement(dict['shop'], 'shop');

                // 订单状态
                dict['inquiryStatus'] = formatOrderState(data.orderStatus.inquiryStatus);
                dict['designStatus'] = formatOrderState(data.orderStatus.designStatus);
                dict['produceStatus'] = formatOrderState(data.orderStatus.produceStatus);

                dict['sysParam'] = {};//系统字典
                for (var i = 0; i < data.sysParam.length; i++) {
                    var item = data.sysParam[i];
                    dict['sysParam'][item.name] = item;
                }

                dict['commands'] = data.commands;

                SysParam = dict;
                dict = JSON.stringify(dict);
                localStorage.setItem('SysParam', dict);

                // 订单状态
                function formatOrderState(dataSource) {
                    var temp = {};
                    for (var i = 0; i < dataSource.length; i++) {
                        temp[dataSource[i].code] = dataSource[i];
                    }
                    return temp;
                }

                //五要素
                function formatElement(dataSource, field) {
                    for (var i = 0; i < dataSource.length; i++) {
                        dict['element'][field][dataSource[i].id] = dataSource[i];
                    }
                }

                //五要素关系
                function format(result, orgData, field) {
                    for (var i = 0; i < orgData.length; i++) {
                        var item = orgData[i];
                        result.push({
                            'id': item.id,
                            "name": item[field],
                            'type': item.materialtype || '',
                            "py": item.pinyin || "",
                            "length": item.Length || 0,
                            "height": item.height,
                            "isDefault": item.isDefault,
                            "width": item.width
                        });
                    }
                    return result;
                }
                var dict_end=new Date(); dict_end.toLocaleString();//初始化计时
                var timeDiff=async?"异步":"同步";
                console.log("字典"+timeDiff+"初始化：" +Helper.Date.timeDifference(dict_start,dict_end)+"秒。");
            });
        }

        if (SysParam) {
            loadSystemParams(true);//异步加载
        }
        else {
            loadSystemParams();//同步加载
        }


        // 导航数据加载
        loadingNav();
        function loadingNav() {
            var nav_start=new Date(); nav_start.toLocaleString();//初始化计时

            var getNavListUrl = top.config.WebService()['business_Query'];
            top.Requst.ajaxGet(getNavListUrl, null, false, function (data) {
                renderNav(data);
            });
            //渲染导航
            function renderNav(data) {
                var domNav = $('.nav');

                function Collapse() {//收起全部菜单
                    $.each($('.nav dd'), function (i, item) {
                        var parentMenu = $(item).prev();
                        parentMenu.attr('data-expand', false);
                        rotate(parentMenu.find('.icon-arrow')[0], 0);//旋转箭头
                        $(item).slideUp(300);//收起其他项
                    });
                }

                var navList = data.data;//正式数据
                var temp = [];
                for (var i = 0; i < 3; i++) {
                    for (var j = 0; j < navList.length; j++) {
                        var item = navList[j];
                        if (i == 0)//类型
                        {
                            if (item.navPid == -1) {
                                var domType = $('<div class="main-title gradient"><i class="main-icon" style="background-image: url(http://' + item.iconurl1 + ');"></i> <span class="main-content">' + item.name + '</span></div>' +
                                    '<dl id="column_' + item.navId + '" class="nav-list"></dl>');
                                domNav.append(domType);
                            }
                            else {
                                temp.push(item);
                            }
                        }
                        else if (i == 1)//一级菜单
                        {
                            var domDl = $('#column_' + item.navPid);
                            if (domDl.length && domDl.length > 0) {
                                var arrow = item.isLast == 0 ? '<i class="icon-arrow fr"></i>' : "";
                                var domDt = $('<dt data-iconUrl1="http://' + item.iconurl1 + '" data-iconUrl2="http://' + item.iconurl2 + '" data-type="' + item.identity + '" data-identity="' + item.navId + '" data-isLast="' + item.isLast + '"><i class="icon" style="background-image: url(http://' + item.iconurl1 + ');"></i> <span>' + item.name + '</span>' + arrow + ' <s class="statistics gradient fr hide identity_' + item.navId + '">0</s> </dt>');

                                domDt.hover(function () {
                                    var icon2 = $(this).attr('data-iconUrl2');
                                    var icon = $(this).find('.icon');
                                    $(icon).css('background-image', 'url(' + icon2 + ')');
                                }, function () {
                                    var icon1 = $(this).attr('data-iconUrl1');
                                    var icon = $(this).find('.icon');
                                    $(icon).css('background-image', 'url(' + icon1 + ')');
                                });
                                //点击事件
                                domDt.on('click', function () {
                                    var thisObj = $(this);
                                    if (thisObj.attr('data-isLast') == 0) {
                                        var iconArrow = thisObj.find('.icon-arrow');

                                        if (thisObj.attr('data-expand') == "true") {
                                            thisObj.attr('data-expand', false);
                                            thisObj.next().slideUp(300);
                                            rotate(iconArrow[0], 0);
                                        }
                                        else {
                                            Collapse();
                                            //展开选中项
                                            thisObj.attr('data-expand', true);
                                            thisObj.next().slideDown(300);
                                            rotate(iconArrow[0], -90);
                                        }
                                    }
                                    else {
                                        $('.nav dt').removeClass('active');//取消其他所有选中项目
                                        $('.nav dd ul li').removeClass('active');
                                        Collapse();
                                        //点击过去概览数据
                                        that.loadOverview(identity, 1, true);//加载概览
                                        SelectedTab('overview');//切换到订单概览选项卡
                                        thisObj.addClass('active');
                                    }
                                });

                                domDl.append(domDt);
                                if (item.isLast == 0) {
                                    domDl.append($('<dd style="display: none;"> <ul id="child_' + item.navId + '"> </ul> </dd>'));
                                }

                                if (item.selected) {
                                    domDt.click(); //选中项目
                                }
                            }
                            else {
                                temp.push(item);
                            }
                        }
                        else if (i == 2)//二级子菜单
                        {
                            var domChild = $('#child_' + item.navPid);
                            if (domChild.length && domChild.length > 0) {
                                var domLi = $('<li data-type="' + item.identity + '" data-identity="' + item.navId + '" class="secondary"><span>' + item.name + '</span> <s class="statistics gradient fr hide identity_' + item.navId + '">0</s></li>');
                                domLi.on('click', function () {
                                    var thisObj = $(this);
                                    $('.nav dt').removeClass('active');//取消其他所有选中项目
                                    $('.nav dd ul li').removeClass('active');

                                    thisObj.addClass('active');
                                    $(thisObj.parent().parent().prev()).addClass('active');//父级选中样式

                                    var identity = thisObj.attr('data-identity');//过去概览数据标识
                                    var navType = thisObj.attr('data-type');
                                    if (navType.indexOf("transaction") >= 0)//经理事务处理
                                    {
                                        switch (parseInt(identity)) {
                                            case 87:/*结算发货*/
                                                classMain.addTab("结算发货", './CustomerService/thingHandle.html');
                                                SelectedTab('结算发货');//切换到订单概览选项卡
                                                break;
                                            case 84:/*订单管理*/
                                                classMain.addTab("订单管理", './CustomerService/orderManager.html');
                                                SelectedTab('订单管理');//切换到订单概览选项卡
                                                break;
                                            case 85:/*开票据*/
                                                classMain.addTab("开票据", './CustomerService/invoiceList.html');
                                                SelectedTab('开票据');//切换到订单概览选项卡
                                                break;
                                            case 86:/*包装*/
                                                classMain.addTab("包装", './CustomerService/boxList.html');
                                                SelectedTab('包装');//切换到订单概览选项卡
                                                break;
                                        }
                                        thisObj.addClass('active');
                                    }
                                    else //业务流程
                                    {
                                        
                                        var identity = thisObj.attr('data-identity');//过去概览数据标识
                                        that.loadOverview(identity, 1, true);//加载概览
                                        SelectedTab('overview');//切换到订单概览选项卡
                                        $("#tab_overview").text("订单列表");
                                    }
                                });
                                domChild.append(domLi);
                                //默认选中
                                if (item.selected) {
                                    $(domLi.parent().parent()).css('display', 'block');
                                    var parentMenu = $(domLi.parent().parent().prev());
                                    parentMenu.attr('data-expand', 'true');

                                    rotate(parentMenu.find('.icon-arrow')[0], -90);//旋转箭头

                                    domLi.click(); //选中项目
                                }
                            }
                        }
                    }
                    navList = temp;
                    temp = [];
                }
            }

            var nav_end=new Date(); nav_end.toLocaleString();//初始化计时
            console.log("导航初始化：" +Helper.Date.timeDifference(nav_start,nav_end)+"秒。");
        }

        //头部tab滑过效果
        slidingOverTabEffect();
        function slidingOverTabEffect() {
            $('.header .tab li').hover(function () {
                var thisObj = $(this);
                thisObj.find('i').addClass('active');
            }, function () {
                var thisObj = $(this);
                thisObj.find('i').removeClass('active');
            });
        }

        // 点单概览选项卡初始化tab
        mainTab();
        function mainTab() {
            $('.tab-container .fixed li').on('click', function () {
                $('.tab-container .float li').removeClass('active');
                $(this).addClass('active');
                SelectedTab('overview');
            });
        }

        //列表初始化
        listInit();
        function listInit() {
            switch (parseInt(roleType)) {
                case 4://经理
                case 1://客服
                    $('.customer-service-table-sort').removeClass('hide');
                    $('.customer-service-table-head').removeClass('hide');
                    break;
                case 2://方案师
                    $('.designer-table-sort').removeClass('hide');
                    $('.designer-table-head').removeClass('hide');
                    break;
                case 3://车间
                    $('.workshop-table-sort').removeClass('hide');
                    $('.workshop-table-head').removeClass('hide');
                    break;
            }
        }

        //新建订单按
        setCreateOrderBtnPos();
        function setCreateOrderBtnPos() {
            var x = Helper.Cache.get("createOrderBtn_X");
            var y = Helper.Cache.get("createOrderBtn_Y");


            var co = document.getElementById("createOrder");
            if(x && y) {
                co.style.left = x + "px";
                co.style.top = y + "px";
            }
            else
            {
                co.style.left = "685px";
                co.style.top = "9px";
            }
            that.initEvent.creatOrderBtn();
            if(roleType==1)
            {
                $('#createOrder').removeClass('hide');
            }
        }

        //个人中心
        personalCenter();
        function personalCenter() {
            var i = $('.account i')[0];
            $(document).click(function () {
                $('.account-dropList').slideUp(200);
                rotate(i, 0);
            });
            $(".account").on('click', function (e) {
                $('.account-dropList').slideDown(200);
                rotate(i, 180);
                e.stopPropagation();
            });
            $('.exitSystem').on('click', function (e) {
                //退出系统
                top.Helper.Cache.set('token', null, -1);//token
                top.Helper.Cache.set('mickName', null, -1);//mickName
                top.Helper.Cache.set('roleType', null, -1);//roleType
                top.Helper.Cache.set('userId', null, -1);//userId
                top.Helper.Cache.set("phone", null, -1);
                top.Helper.Cache.set("password", null, -1);
                window.location.href = './Member/login.html';
            });
        }

        // 刷新车间的剩余发货时间
        if (roleType == 3) {
            setInterval(function () {
                countdown();
            }, 60000);
            function countdown() {
                var timeleft = $('.timeleft');
                for (var i = 0; i < timeleft.length; i++) {
                    var domItem=timeleft.attr('data-deadlineTime');
                    if(domItem && domItem!='null')
                    {
                        var countdown=Helper.Date.countdown(domItem);
                        $(timeleft.find('em')).text(countdown);
                    }
                }
            }
            countdown();
        }

        //旋转图标
        function rotate(domObj, deg) {
            domObj.style.webkitTransform = 'rotate(' + deg + 'deg)';
            domObj.style.mozTransform = 'rotate(' + deg + 'deg)';
            domObj.style.msTransform = 'rotate(' + deg + 'deg)';
            domObj.style.oTransform = 'rotate(' + deg + 'deg)';
            domObj.style.transform = 'rotate(' + deg + 'deg)';
        }

        showMain();//显示主体数据
        function showMain() {
            $('.header').removeClass('hide');
            $('.container').removeClass('hide');
            setTimeout(function () {
                $('.loading').addClass('hide');
            }, 800);
        }
    },
    addTab: function (index, src) {
        // 检查是否存在
        var orgTab = $('#tab_' + index);
        if (orgTab.length && orgTab.length > 0) {
            SelectedTab(index);
            /*选中选项卡*/
            return false;
        }

        //内容区域
        var mainContainer = $('.container .iframe-container');
        var ifream = $('<div id="iframe_box_' + index + '" class="iframe details">' + '<iframe id="iframe_' + index + '"  src="' + src + '"></iframe> ' + '</div>');

        //选项卡区域
        var tabContainer = $('.tab-container .float');
        var tabItem = $('<li id="tab_' + index + '" data-index="' + index + '" class="active"></li>');
        var refresh = $('<i title="刷新" data-src="' + src + '" class="refresh fl"></i>');
        tabItem.append(refresh);
        var title = $('<span class="title fl">' + index + '</span>');
        tabItem.append(title);
        var close = $('<i class="close fl"></i>');
        tabItem.append(close);

        //点击选项卡
        tabItem.on('click', function () {
            DeactivateTab();
            DeactivatePage();
            var thisObj = $(this);
            var index = thisObj.attr('data-index');
            SelectedTab(index);
            /*选中选项卡*/
        });

        // 刷新
        refresh.on('click', function () {
            var parentObj = $($(this).parent());
            var src = $(this).attr('data-src');
            var index = parentObj.attr('data-index');
            $('#iframe_' + index).attr('src', src);
        });

        //关闭选项卡
        close.on('click', function () {
            var thisObj = $($(this).parent());
            var index = thisObj.attr('data-index');

            $('#iframe_box_' + index).remove();//删除选项页面

            var prevTab = $(thisObj.prev());//前一个选项卡
            var nextTab = $(thisObj.next());//后一个选项卡
            if (nextTab.length && nextTab.length > 0)//选中后一个
            {
                var nextIndex = nextTab.attr('data-index');
                SelectedTab(nextIndex);
                /*选中选项卡*/
                $('#iframe_box_' + nextIndex).removeClass('hide');
            }
            else if (prevTab.length && prevTab.length > 0)//选中前一个
            {
                var prevIndex = prevTab.attr('data-index');
                SelectedTab(prevIndex);
                /*选中选项卡*/
                $('#iframe_box_' + prevIndex).removeClass('hide');
            }
            else {//只剩下概览可选中
                SelectedTab('overview');
                /*选中选项卡*/
            }
            thisObj.remove();//删除选项卡
        });

        if (tabContainer.find('li').length >= 5) {
            Message.show('注意', '需先关闭一个选项卡。', MsgState.Warning, 2000);
            return;
        }
        tabContainer.append(tabItem);//添加新选项卡
        mainContainer.append(ifream);//添加新选项页面
        SelectedTab(index);//选中选项卡
    },
    initEvent: {
        creatOrderBtn: function () {//新建订单按钮
            var co = document.getElementById("createOrder");
            var moveVal = 0;
            co.onmousedown = function (ev) {
                var oevent = ev || event;
                var distanceX = oevent.clientX - co.offsetLeft;
                var distanceY = oevent.clientY - co.offsetTop;
                var scrollH = top.Helper.getClientHeight();
                var scrollW = top.Helper.getClientWidth();

                document.onmousemove = function (ev) {
                    var oevent = ev || event;
                    var x = oevent.clientX - distanceX;
                    var y = oevent.clientY - distanceY;

                    if (x > 0 && x < scrollW - 104) {
                        Helper.Cache.set("createOrderBtn_X", x, 7);
                        co.style.left = x + 'px';
                    }

                    if (y > 0 && y < scrollH - 32) {
                        Helper.Cache.set("createOrderBtn_Y", y, 7);
                        co.style.top = y + 'px';
                    }

                    moveVal += 1;
                    window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
                };
                document.onmouseup = function (e) {
                    document.onmousemove = null;
                    document.onmouseup = null;
                    //单击新建订单
                    if (moveVal < 4) {
                        var popH = scrollH - 100 > 550 ? 550 : scrollH - 100;
                        Popup.open("新建订单", 939, popH, "./CustomerService/createOrder.html");
                    }
                    moveVal = 0;
                };

            }
        },//新建订单按钮随意摆放
        sort: function () {//概览排序

            $('.complex i').css('background', 'url(../Image/workbench.png) no-repeat -34px -85px');//默认综合排序
            $('.complex').css('color',"#e84a4b");
            $('#select-date-range1').DateSelectRange(function () {
                classMain.loadOverview(null, null, true);
            });
            $('#select-date-range2').DateSelectRange(function () {
                classMain.loadOverview(null, null, true);
            });
            $('#select-date-range3').DateSelectRange(function () {
                classMain.loadOverview(null, null, true);
            });

            //客服
            $('.customer-service-table-sort .complex').on('click', function () {
                setSortType($(this));
                classMain.requstParams['sortCategory'] = 'synthesize'; //综合排序
                classMain.requstParams['sortType'] = $(this).attr('data-sorttype');
                classMain.pagePrams.isInit = -1;
                classMain.loadOverview();
            });
            $('.customer-service-table-sort .createtime').on('click', function () {
                setSortType($(this));
                classMain.requstParams['sortCategory'] = 'createTime';//创建时间
                classMain.requstParams['sortType'] = $(this).attr('data-sorttype');
                classMain.pagePrams.isInit = -1;
                classMain.loadOverview();
            });
            $('.customer-service-table-sort .updatetime').on('click', function () {
                setSortType($(this));
                classMain.requstParams['sortCategory'] = 'updateTime';//操作时间
                classMain.requstParams['sortType'] = $(this).attr('data-sorttype');
                classMain.pagePrams.isInit = -1;
                classMain.loadOverview();
            });
            $('.customer-service-table-sort .ordermoney').on('click', function () {
                setSortType($(this));
                classMain.requstParams['sortCategory'] = 'orderPrice';//订单金额
                classMain.requstParams['sortType'] = $(this).attr('data-sorttype');
                classMain.pagePrams.isInit = -1;
                classMain.loadOverview();
            });

            //方案师
            $('.designer-table-sort .complex').on('click', function () {
                setSortType($(this));
                classMain.requstParams['sortCategory'] = 'synthesize'; //综合排序
                classMain.requstParams['sortType'] = $(this).attr('data-sorttype');
                classMain.pagePrams.isInit = -1;
                classMain.loadOverview();
            });
            $('.designer-table-sort .assigntime').on('click', function () {
                setSortType($(this));
                classMain.requstParams['sortCategory'] = 'createTime';//派单时间
                classMain.requstParams['sortType'] = $(this).attr('data-sorttype');
                classMain.pagePrams.isInit = -1;
                classMain.loadOverview();
            });
            $('.designer-table-sort .designfee').on('click', function () {
                setSortType($(this));
                classMain.requstParams['sortCategory'] = 'designPrice';//设计费
                classMain.requstParams['sortType'] = $(this).attr('data-sorttype');
                classMain.pagePrams.isInit = -1;
                classMain.loadOverview();
            });

            //车间
            $('.workshop-table-sort .complex').on('click', function () {
                setSortType($(this));
                classMain.requstParams['sortCategory'] = 'synthesize'; //综合排序
                classMain.requstParams['sortType'] = $(this).attr('data-sorttype');
                classMain.pagePrams.isInit = -1;
                classMain.loadOverview();
            });
            $('.workshop-table-sort .createtime').on('click', function () {
                setSortType($(this));
                classMain.requstParams['sortCategory'] = 'createTime';//创建时间
                classMain.requstParams['sortType'] = $(this).attr('data-sorttype');
                classMain.pagePrams.isInit = -1;
                classMain.loadOverview();
            });
            $('.workshop-table-sort .opertime').on('click', function () {
                setSortType($(this));
                classMain.requstParams['sortCategory'] = 'updateTime';//操作时间
                classMain.requstParams['sortType'] = $(this).attr('data-sorttype');
                classMain.pagePrams.isInit = -1;
                classMain.loadOverview();
            });


            $('.anxious').on('click', function () { //急单
                var thisObj = $(this);
                var i = thisObj.find('i');
                if (thisObj.attr('data-select') == 'true') {
                    thisObj.attr('data-select', 'false');
                    $(i).css('background-color', '#ffffff');
                    classMain.requstParams['isUrgency'] = 0;
                }
                else {
                    thisObj.attr('data-select', 'true');
                    $(i).css('background-color', 'rgb(249, 120, 83)');
                    classMain.requstParams['isUrgency'] = 1;
                }
                classMain.loadOverview();
            });

            $('.renew').on('click', function () { //续订
                var thisObj = $(this);
                var i = thisObj.find('i');
                if (thisObj.attr('data-select') == 'true') {
                    thisObj.attr('data-select', 'false');
                    $(i).css('background-color', '#ffffff');
                    classMain.requstParams['isContinueOrder'] = 0;
                }
                else {
                    thisObj.attr('data-select', 'true');
                    $(i).css('background-color', 'rgb(82, 151, 254)');
                    classMain.requstParams['isContinueOrder'] = 1;
                }
                classMain.loadOverview();
            });


            function setSortType(thisObj) {
                var sortArrow = thisObj.find('.sort-arrow');
                $('.sortbox').css('color',"#666b6b");
                $('.sortbox .sort-arrow').css('background', 'url(../Image/workbench.png) no-repeat -164px -59px');
                $('.sortbox').attr('data-select', 'false');
                if (thisObj.attr('data-sortType') == 'desc') {
                    thisObj.attr('data-select', 'true');
                    thisObj.attr('data-sortType', 'asc');
                    classMain.requstParams['sortType'] = 'asc';
                    $(sortArrow).css('background', 'url(../Image/workbench.png) no-repeat -190px -59px');
                }
                else {
                    thisObj.attr('data-select', 'true');
                    thisObj.attr('data-sortType', 'desc')
                    $(sortArrow).css('background', 'url(../Image/workbench.png) no-repeat -34px -85px');
                }
                thisObj.css("color","#e84a4b");
            }
        },
        edit: function (customid) {
            var scrollH = top.Helper.getClientHeight();
            var popH = scrollH - 100 > 410 ? 410 : scrollH - 100;
            Popup.open("产品生产参数编辑", 900, popH, "./CustomerService/createOrder.html?operType=edit&customid=" + customid);
        },
        buttonClick: {}
    },
    search:function () {
        //搜索
        var searchContent=$("#search_content").val();//搜索框输入的内容
        var contentLength=Helper.getStrLeng(searchContent);
        if(contentLength==0)
        {
            Message.show("提醒","请输入要搜索的内容。",MsgState.Warning,2000);
            return ;
        }
        else if(contentLength<3)
        {
            Message.show("提醒","输入的信息过于简短，请补充。",MsgState.Warning,2000);
            return ;
        }
        SelectedTab('overview');//切换到订单概览选项卡
        //thisObj.addClass('active');
        classMain.loadOverview(null,1,true,null,searchContent);
    },
    requstParams: {"sortCategory": "synthesize", "sortType": "desc"},
    loadOverview: function (type, pageIndex, isInitPage,customid,searchContent) {
        //加载概览数据 initPage是否初始化分页
        var that = this;
        if (isInitPage)//分页初始化
        {
            classMain.pagePrams.isInit = -1;
        }

        classMain.getStatistics();//更新统计数据

        //请求参数创建
        function requstPrams() {
            classMain.requstParams['navId'] = type ? parseInt(type) : classMain.requstParams['navId'];
            classMain.requstParams['pageNum'] = pageIndex ? pageIndex : classMain.pagePrams.curIndex;
            classMain.requstParams['pageSize'] = classMain.pagePrams.pageSize;
            switch (roleType) {
                case 0://普通角色
                    break;
                case 1://客服角色
                    classMain.requstParams['startTime'] = top.Helper.Date.getTimestamp($('#select-date-range1').attr('data-begin'));
                    classMain.requstParams['endTime'] = top.Helper.Date.getTimestamp($('#select-date-range1').attr('data-end'));
                    break;
                case 2://方案师角色
                    classMain.requstParams['startTime'] = top.Helper.Date.getTimestamp($('#select-date-range2').attr('data-begin'));
                    classMain.requstParams['endTime'] = top.Helper.Date.getTimestamp($('#select-date-range2').attr('data-end'));
                    break;
                case 3://车间角色
                    classMain.requstParams['startTime'] = top.Helper.Date.getTimestamp($('#select-date-range3').attr('data-begin'));
                    classMain.requstParams['endTime'] = top.Helper.Date.getTimestamp($('#select-date-range3').attr('data-end'));
                    break;
                case 4://经理角色
                    classMain.requstParams['startTime'] = top.Helper.Date.getTimestamp($('#select-date-range1').attr('data-begin'));
                    classMain.requstParams['endTime'] = top.Helper.Date.getTimestamp($('#select-date-range1').attr('data-end'));
                    break;
            }
        }

        requstPrams();

        //查询数据
        var getNavListUrl = top.config.WebService()['orderSupplementary_Query'];

        //搜索
        var searchParams=null;
        if(searchContent)
        {
            getNavListUrl= top.config.WebService()['orderSupplementary_Search'];
            searchParams={};
            searchParams["startTime"]=0;
            searchParams["endTime"]=0;
            searchParams["word"]=searchContent;
            searchParams["pageNum"]=classMain.requstParams.pageNum;
            searchParams["pageSize"]=classMain.requstParams.pageSize;
            $("#tab_overview").text("搜索结果");
        }

        var reqPara=searchParams||classMain.requstParams;//搜索取前面参数

        top.Requst.ajaxGet(getNavListUrl,reqPara, true, function (data) {

            var isDom=false;//
            var datalist = $('#datalist');
            if(customid)//是否需要跟新特定某条
            {
                //服务器返回新列表中是否包含customid对应的数据
                for (var i = 0; i < data.data.pageData.length; i++) {
                    var item = data.data.pageData[i];
                    if(customid==item.customid)
                    {
                        isDom=true;
                    }
                }
                if(!isDom)
                {
                    datalist.html('');
                }
            }
            else
            {
                datalist.html('');
            }

            if (data.code == 200 && data.data && data.data.pageData.length > 0) {
                if (roleType == 1 || roleType == 4)//客服与经理数据模版
                {
                    for (var i = 0; i < data.data.pageData.length; i++) {

                        var item = data.data.pageData[i];
                        var itemDiv = $('<div id="item_'+item.customid+'" class="customer-service data-item clearfix"></div>');

                        //更新逐条信息
                        if(customid!=null && customid==item.customid)
                        {
                            itemDiv=$("#item_"+customid);
                            itemDiv.html("");
                        }
                        else if(customid!=null && customid!=item.customid && isDom)
                        {
                            continue;
                        }
                        else
                        {
                            datalist.append(itemDiv);
                        }

                        var itemHead = $('<div class="item-head"></div>');
                        itemDiv.append(itemHead);
                        itemDiv.append(itemHead);
                        var itemHead_l = $('<div class="item-head-left fl"></div>');
                        itemHead.append(itemHead_l);
                        var itemHead_r = $('<div class="item-head-right fr"></div>');
                        itemHead.append(itemHead_r);
                        var itemBody = $('<div class="clearfix fl"></div>');
                        itemDiv.append(itemBody);
                        // 数据头
                        function addHead() {
                            // 数据头左侧
                            itemHead_l.append($('<span class="time">' + item.createTime + '</span>'));
                            itemHead_l.append($('<span>订单号：<em>' + item.orderid + '</em></span>'));
                            itemHead_l.append($('<span>客源：<em>' + SysParam.element.shop[item.shop].name + '</em></span>'));
                            itemHead_l.append($('<span class="wangwang">旺旺：<em>' + item.customerWang + '</em></span>'));

                            //是否急单
                            var orderUrgencyDays = parseInt(SysParam.sysParam['order_urgency_days'].value);
                            if (item.userPeriod <= orderUrgencyDays) {
                                itemHead_l.append($('<span class="anxious">急单</span>'));
                            }

                            if (item.isContinueOrder == 1) {
                                itemHead_l.append($('<span class="renew">续订</span>'));
                            }

                            if (roleType == 4) {
                                itemHead.append($('<div class="item-head-left-manager fl">' +
                                    '<span>客服ID：<em>' + item.servicerNickName + '</em></span>' +
                                    '<span>车间ID：<em>' + item.produceNickName + '</em></span>' +
                                    '<span style="border-right: none;">方案师ID：<em>' + item.designNickName + '</em></span>' +
                                    '</div>'));
                            }

                            // 数据头右侧
                            var check = $('<span data-customid="' + item.customid + '">核对订单</span>');
                            check.on('click', function () {
                                var customid = $(this).attr('data-customid');
                                var scrollH = top.Helper.getClientHeight();
                                var popH = scrollH - 100 > 680 ? 680 : scrollH - 100;
                                top.Popup.open("核对订单",818,popH,"./Pop-ups/checkOrder.html?customid="+customid);
                            });
                            itemHead_r.append(check);

                            var view = $('<span data-customid="' + item.customid + '">查看订单</span>');
                            view.on('click', function () {
                                var customid = $(this).attr('data-customid');
                                that.addTab(customid, './CustomerService/orderDetails.html?customid=' + customid);
                            });
                            itemHead_r.append(view);
                        }

                        addHead();
                        //添加更多按钮
                        function addMore() {
                            //更多操作列表
                            var moreList = $('<div class="operlist" style="display: none;"><i class="arrow"></i></div>');
                            //发票收据
                            var moreItem_1 = $('<span data-customid="'+item.customid+'">发票/收据</span>');
                            moreItem_1.on('click', function () {
                                var customid = $(this).attr('data-customid');
                                var scrollH = top.Helper.getClientHeight();
                                var popH = scrollH - 100 > 680 ? 680 : scrollH - 100;
                                top.Popup.open("发票/收据",818,popH,"./Pop-ups/invoice.html?customid="+customid);
                            });
                            moreList.append(moreItem_1);

                            var moreItem_2 = $('<span data-orderid="' + item.orderid + '" data-ordersummaryId="' + item.id + '" data-customid="' + item.customid + '">产品包装</span>');
                            moreItem_2.on('click', function () {
                                var orderid = $(this).attr('data-orderid');
                                var customid=$(this).attr('data-customid');
                                var scrollH = top.Helper.getClientHeight();
                                var popH = scrollH - 100 > 510 ? 510 : scrollH - 100;
                                top.Popup.open("产品包装",545, popH,"./Pop-ups/box.html?orderid="+orderid+"&customid="+customid);
                            });
                            moreList.append(moreItem_2);

                            // var moreItem_3 = $('<span>订单备注</span>');
                            // moreItem_3.on('click', function () {
                            //     alert('弹出订单备注');
                            // });
                            // moreList.append(moreItem_3);

                            var moreItem_4 = $('<span data-customid="'+item.customid+'" style="border-bottom: none;">删除订单</span>');
                            moreItem_4.on('click', function () {
                                var customid = $(this).attr('data-customid');
                                Confirm("删除订单","您确定要删除该订单吗？",423,203,null,function () {
                                   var url=config.WebService()['orderSummaryInfo_Update'];
                                    top.Requst.ajaxPost(url,{"customid":customid},true,function (data) {
                                        if(data.code==200)
                                        {
                                            top.Message.show("提示",data.message,MsgState.Success,2000,function () {
                                                classMain.loadOverview();
                                            });
                                        }
                                        else
                                        {
                                            top.Message.show("提示",data.message,MsgState.Warning,3000,null,{"width":435,"height":75});
                                        }
                                    })
                                });
                            });
                            moreList.append(moreItem_4);

                            var more = $('<span title="更多操作"><i class="more-icon"></i></span>');
                            more.on('click', function (e) {
                                $('.operlist').slideUp();
                                var dropList = $($(this).find('.operlist'));
                                dropList.slideDown('fast');
                                $(document).click(function () {
                                    dropList.slideUp('fast');
                                });
                                //点击后自动关闭下拉
                                $(dropList.find('span')).click(function (e) {
                                    dropList.slideUp('fast');
                                    e.stopPropagation();
                                });
                                e.stopPropagation();
                            });
                            more.append(moreList);
                            itemHead_r.append(more);
                        }

                        addMore();

                        // 产品图
                        var prodImage = $('<div class="photo"> <img onerror="this.src=\'../Image/imageError.png\'" data-orgSrc="http://' + item.middleGoodsImage + '" src="http://' + item.smallGoodsImage + '"> </div>');
                        itemBody.append(prodImage);
                        function addProductPhoto() {
                            prodImage.on('click', function () {
                                var orgSrc = $($(this).find('img')).attr('data-orgSrc');
                                previewImg.create(orgSrc);
                                previewImg.show();
                            });
                        }

                        addProductPhoto();

                        //5要素
                        var infoContainer = $('<div class="clearfix fl" style="width: 645px; margin-left: 10px;"></div>');
                        itemBody.append(infoContainer);
                        function addInfo() {
                            var element = SysParam.element;//元素
                            var model = ConvertIdToName(element.model, item.model).join(';');
                            var technology = ConvertIdToName(element.technology, item.technology).join(';');
                            var color = ConvertIdToName(element.color, item.color).join(';');

                            var info = $('<div class="info">' +
                                '<div class="attributes">' +
                                '<span>' + SysParam.element.goodsClass[item.goodsClass].name + '</span>' +
                                '<span>' + SysParam.element.material[item.material].name + '</span>' +
                                '<span>' + SysParam.element.accessories[item.accessories].name + '</span>' +
                                '</div>' +
                                '<!--工艺-->' +
                                '<div class="process">' +
                                '<span>' + model + ' </span>' +
                                '<span>' + technology + ' </span>' +
                                '<span>' + color + ' </span>' +
                                '</div>' +
                                '<div class="num">' +
                                '<span><em>' + item.number + '</em>个</span>' +
                                '</div>' +
                                '<div class="size">' +
                                '<span><em>' + item.length + '×' + item.width + '×' + item.height + '</em> (mm)</span>' +
                                '</div>' +
                                '<div class="day">' +
                                '<span><em>' + item.userPeriod + '</em>天</span>' +
                                '</div>' +
                                '<button class="edit red-h hide" onclick="classMain.initEvent.edit(' + item.customid + ');">编辑参数</button>' +
                                '</div>');
                            info.hover(function () {
                                $($(this).find('.edit')).removeClass('hide');
                            }, function () {
                                $($(this).find('.edit')).addClass('hide');
                            });
                            infoContainer.append(info);
                        }

                        addInfo();

                        //金额区域
                        function addMoney() {
                            var proposed = ' 参考价 ¥' + parseFloat(item.currentPrice).formatMoney(2, "", ",", ".") + ' / 工期' + item.currentPeriod + '天 ';
                            var tax = item.taxRate > 0 ? "含税" : "不含税";

                            var money = $('<div class="amount">' +
                                '<div class="design-fee"><!--设计费-->' +
                                '<span>设计费：¥ <em>' + item.designPrice.formatMoney(2, "", ",", ".") + ' </em></span>' +
                                '<span>引导费：¥ <em>' + item.introducePrice.formatMoney(2, "", ",", ".") + '</em></span>' +
                                '<i class="edit hide" data-designPrice="'+item.designPrice.formatMoney(2, "", ",", ".")+'" data-introducePrice="'+item.introducePrice.formatMoney(2, "", ",", ".")+'" data-customid="' + item.customid + '">编辑</i>' +
                                '</div>' +
                                '<!--预算-->' +
                                '<div class="budget">' +
                                '<i class="label fl">预算：</i>' +
                                '<input class="fl input-money" value="' + item.userPrice.formatMoney(2, "", ",", ".") + '">' +
                                '<button data-customid="' + item.customid + '" class="btn edit fl">确定</button>' +
                                '</div>' +
                                '<div class="bargain"><!--议价-->' +
                                    '<span class="tax fl">' + tax + '</span>' +
                                    '<span class="proposed-price fl">' + proposed + '</span>' +
                                    '<span data-tax="'+tax+'" data-userPeriod="'+item.userPeriod+'" data-lastQuote="'+item.lastQuote+'" data-customid="' + item.customid + '" class="button fl hide">议价</span>' +
                                    '<i class="arrow"></i>' +
                                '</div>' +
                                '<!--报价-->' +
                                '<div class="quoted">' +
                                '<i class="label fl">报价：</i>' +
                                '<input class="fl input-money" value="' + item.prePrice.formatMoney(2, "", ",", ".") + '">' +
                                '<button data-customid="' + item.customid + '" class="btn edit fl">确定</button>' +
                                '</div>' +
                                '</div>');

                            //议价
                            if(item.inquiryStatus==6)//议价达成
                            {
                                var bargain = $(money.find('.bargain').find('.button'));
                                $(money.find('.bargain').find('.proposed-price')).css('color', ' #E84B4C');
                                $(bargain).text("议价达成");
                                // $(bargain.parent()).css('width', '238px');
                                bargain.removeClass('hide');
                            }
                            // else if(item.inquiryStatus==5)
                            // {
                            //     var bargain = $(money.find('.bargain').find('.button'));
                            //     $(money.find('.bargain').find('.proposed-price')).css('color', ' #5298FF');
                            //     $(bargain).text("议价中");
                            //     // $(bargain.parent()).css('width', '230px');
                            //     bargain.removeClass('hide');
                            // }
                            else if (item.inquiryStatus == 2 || item.inquiryStatus ==3 || item.inquiryStatus==5)
                            {
                                var bargain = $(money.find('.bargain').find('.button'));
                                $(money.find('.bargain').find('.proposed-price')).css('color', ' #5298FF');
                                bargain.removeClass('hide');
                                //议价
                                $(money.find('.bargain').find('.button')).on('click', function () {
                                    var customid = $(this).attr('data-customid');
                                    var lastQuote=$(this).attr('data-lastQuote');
                                    var userPeriod=$(this).attr('data-userPeriod');
                                    var tax=$(this).attr("data-tax");
                                    top.Popup.open("发起议价",423,235,"./Pop-ups/launBarg.html?customid="+customid+"&tax="+tax+"&lastQuote="+lastQuote+"&userPeriod="+userPeriod);
                                });
                            }
                            else {
                                var bargain = $(money.find('.bargain').find('.bargain'));
                                $(money.find('.bargain').find('.proposed-price')).css('color', '#E84B4C');
                                // bargain.css('width', '185px');
                            }



                            // 编辑设计费
                            $(money.find('.design-fee').find('.edit')).on('click', function () {
                                var customid = $(this).attr('data-customid');
                                var introduceprice=$(this).attr('data-introduceprice');
                                var designPrice=$(this).attr("data-designPrice");
                                top.Popup.open("调整设计费",423,286,"./Pop-ups/adjustDesi.html?customid="+customid+"&introduceprice="+introduceprice+"&designPrice="+designPrice);
                            });
                            // 编辑预算
                            $(money.find('.budget').find('.edit')).on('click', function () {
                                var customid = $(this).attr('data-customid');
                                var url=config.WebService()["updatePrice"];
                                var userPrice=$($(this).prev()).val().replace(/[^0-9-.]/g, '');

                                Requst.ajaxPost(url,{"price":parseFloat(userPrice),"wCustomid":customid,"type":"userPrice"},true,function (data) {
                                    if(data.code==200)
                                    {
                                        top.Message.show("提示",data.message, MsgState.Success, 2000,function () {
                                            classMain.loadOverview(null,null,null,customid);
                                        });
                                    }
                                    else
                                    {
                                        top.Message.show("提示",data.message, MsgState.Fail, 2000,function () {
                                            classMain.loadOverview(null,null,null,customid);
                                        });
                                    }
                                });
                            });

                            $(money.find('.design-fee')).hover(function () {
                                $($(this).find('i')).removeClass('hide');
                            }, function () {
                                $($(this).find('i')).addClass('hide');
                            });

                            // 编辑报价
                            $(money.find('.quoted').find('.edit')).on('click', function () {
                                var customid = $(this).attr('data-customid');
                                var url=config.WebService()["custom_Quotation"];
                                var prePrice=$($(this).prev()).val().replace(/[^0-9-.]/g, '');
                                Requst.ajaxGet(url,{"prePrice":parseFloat(prePrice),"customid":customid},true,function (data) {
                                    if(data.code==200)
                                    {
                                        top.Message.show("提示",data.message, MsgState.Success, 2000,function () {
                                            classMain.loadOverview(null,null,null,customid);
                                        });
                                    }
                                    else
                                    {
                                        top.Message.show("提示",data.message, MsgState.Fail, 2000,function () {
                                            classMain.loadOverview(null,null,null,customid);
                                        });
                                    }
                                });
                            });

                            infoContainer.append(money);
                        }

                        addMoney();

                        var payStatus = item.inquiryStatus == 4 ? "" : "未支付";
                        //状态
                        function addStatus() {
                            var status = $('<div style="margin-left: 8px;" class="status"></div>');
                            if (SysParam.inquiryStatus[item.inquiryStatus]) {
                                status.append($('<span>' + SysParam.inquiryStatus[item.inquiryStatus].servicerTag + '</span>'));
                            }
                            if (SysParam.designStatus[item.designStatus]) {
                                status.append($('<span>' + SysParam.designStatus[item.designStatus].servicerTag + '</span>'));
                            }
                            if (SysParam.produceStatus[item.produceStatus]) {
                                status.append($('<span>' + SysParam.produceStatus[item.produceStatus].servicerTag + '</span>'));
                            }
                            if(payStatus)
                            {
                                status.append($('<span>' + payStatus + '</span>'));
                            }
                            itemBody.append(status);
                        }
                        addStatus();

                        //按钮
                        function operating() {
                            var operating = $('<div class="operating"></div>');
                            var command=item.command.split(',');
                            // 发起询价
                            if (command.indexOf("INQUIRY")>=0) {
                                var btn=$('<button class="btn" data-orderid="' + item.orderid + '" data-ordersummaryId="' + item.id + '" data-customid="' + item.customid + '" style="width: 66px; height: 23px;">发起询价</button>');
                                btn.on('click',function () {
                                    var customid = $(this).attr('data-customid');
                                    OPER.sendInquiry(customid);//发起询价
                                });
                                operating.append(btn);
                            }
                            //分配设计
                            if (command.indexOf("SEND_DESIGN")>=0) {
                                var btn=$('<button class="btn" data-orderid="' + item.orderid + '" data-ordersummaryId="' + item.id + '" data-customid="' + item.customid + '" style="width: 66px; height: 23px;">分配设计</button>');
                                btn.on('click',function () {
                                    var customid = $(this).attr('data-customid');
                                    var orderid = $(this).attr('data-orderid');
                                    var ordersummaryId = $(this).attr('data-ordersummaryId');
                                    var designPrice= $($(this).parent().parent()).find('.amount').find('.design-fee').find('span').eq(0).find('em');
                                    OPER.distributionDesign(ordersummaryId,orderid,customid,$(designPrice).text());
                                });
                                operating.append(btn);
                            }
                            //定价
                            if (command.indexOf("PRICE")>=0) {
                                var btn=$('<button data-inquiryStatus="'+item.inquiryStatus+'" data-userPeriod="'+item.userPeriod+'" data-prePrice="'+parseFloat(item.prePrice).formatMoney(2, "", ",", ".")+'" data-currentPeriod="'+item.currentPeriod+'" data-currentPrice="'+parseFloat(item.currentPrice).formatMoney(2, "", ",", ".")+'" class="btn" data-orderid="' + item.orderid + '" data-ordersummaryId="' + item.id + '" data-customid="' + item.customid + '" style="width: 66px; height: 23px;">定价</button>');
                                btn.on('click',function () {
                                    var customid = $(this).attr('data-customid');
                                    var dataUserPeriod = $(this).attr('data-userPeriod');//客户要求工期
                                    var currentPeriod = $(this).attr('data-currentPeriod');//当前车间工期
                                    var currentPrice = $(this).attr('data-currentPrice');//当前车间报价
                                    var quotePrice= $(this).attr('data-prePrice');//客服报价
                                    var inquiryStatus= $(this).attr('data-inquiryStatus');//询价状态
                                    if(parseInt(inquiryStatus)==4)
                                    {
                                        Confirm("注意","订单已经支付，确定要重新定价？",423,235,null,function () {
                                            OPER.pricing(customid,currentPeriod,currentPrice,quotePrice,dataUserPeriod,inquiryStatus);
                                        });
                                    }
                                    else
                                    {
                                        OPER.pricing(customid,currentPeriod,currentPrice,quotePrice,dataUserPeriod,inquiryStatus);
                                    }
                                });
                                operating.append(btn);
                            }
                            //确认支付
                            if (command.indexOf("PAYOFF")>=0) {
                                var btn=$('<button data-inquiryStatus="'+item.inquiryStatus+'" data-finalPrice="'+parseFloat(item.finalPrice).formatMoney(2, "", ",", ".")+'" data-prePrice="'+parseFloat(item.prePrice).formatMoney(2, "", ",", ".")+'" data-currentPeriod="'+item.currentPeriod+'" data-currentPrice="'+parseFloat(item.currentPrice).formatMoney(2, "", ",", ".")+'" class="btn" data-orderid="' + item.orderid + '" data-ordersummaryId="' + item.id + '" data-customid="' + item.customid + '" style="width: 66px; height: 23px;">订单支付</button>');
                                btn.on('click',function () {
                                    var customid = $(this).attr('data-customid');
                                    var finalPrice = $(this).attr('data-finalPrice');//定价金额
                                    OPER.orderPrice(customid,finalPrice);
                                });
                                operating.append(btn);
                            }
                            //分配生产
                            if (command.indexOf("SEND_PRODUCE")>=0) {
                                var btn=$('<button data-inquiryStatus="'+item.inquiryStatus+'" data-finalPrice="'+parseFloat(item.finalPrice).formatMoney(2, "", ",", ".")+'" data-prePrice="'+parseFloat(item.prePrice).formatMoney(2, "", ",", ".")+'" data-currentPeriod="'+item.currentPeriod+'" data-currentPrice="'+parseFloat(item.currentPrice).formatMoney(2, "", ",", ".")+'" class="btn" data-orderid="' + item.orderid + '" data-ordersummaryId="' + item.id + '" data-customid="' + item.customid + '" style="width: 66px; height: 23px;">分配生产</button>');
                                btn.on('click',function () {
                                    var customid = $(this).attr('data-customid');
                                    OPER.distributionProduction(customid);
                                });
                                operating.append(btn);
                            }
                            //查看物流
                            if (item.produceStatus==4) {
                                var btn=$('<button class="btn" data-orderid="' + item.orderid + '" data-ordersummaryId="' + item.id + '" data-customid="' + item.customid + '" style="width: 66px; height: 23px;">查看物流</button>');
                                btn.on('click',function () {
                                    var customid = $(this).attr('data-customid');
                                    var orderId=$(this).attr('data-orderid');
                                    window.open("./Pop-ups/logisticsInfo.html?customid="+customid+"&orderid="+orderId);
                                });
                                operating.append(btn);
                            }

                            //查看成品
                            if (item.smallFinishedProductsImage1||item.smallFinishedProductsImage2||item.smallFinishedProductsImage3) {
                                var btn=$('<button class="btn" data-orderid="' + item.orderid + '" data-ordersummaryId="' + item.id + '" data-customid="' + item.customid + '" style="width: 66px; height: 23px;">查看成品</button>');
                                btn.on('click',function () {
                                    var customid = $(this).attr('data-customid');
                                    OPER.productPicture(customid,'prev');
                                });
                                operating.append(btn);
                            }

                            //确认收货
                            if (item.produceStatus==4) {
                                var btn=$('<button class="btn" data-orderid="' + item.orderid + '" data-ordersummaryId="' + item.id + '" data-customid="' + item.customid + '" style="width: 66px; height: 23px;">确认收货</button>');
                                btn.on('click',function () {
                                    var customid = $(this).attr('data-customid');
                                    var url=config.WebService()["orderLogisticsStatus_Update"];
                                    top.Requst.ajaxPost(url,{"customid":customid},true,function (data) {
                                        if(data.code==200)
                                        {
                                            top.Message.show("提示", data.message, MsgState.Success, 2000);
                                            if (top.classMain.loadOverview) {
                                                top.classMain.loadOverview(null, null, null, customid);
                                            }
                                        }
                                        else{
                                            top.Message.show("提示", data.message, MsgState.Warning, 2000);
                                        }
                                    })
                                });
                                operating.append(btn);
                            }

                            itemBody.append(operating);
                        }

                        operating();

                    }
                }
                else if (roleType == 2)//方案师数据模版
                {
                    for (var i = 0; i < data.data.pageData.length; i++) {
                        var item = data.data.pageData[i];
                        var itemDiv = $('<div id="item_'+item.customid+'" class="designer data-item clearfix"></div>');

                        //更新逐条信息
                        if(customid!=null && customid==item.customid)
                        {
                            itemDiv=$("#item_"+customid);
                            itemDiv.html("");
                        }
                        else if(customid!=null && customid!=item.customid && isDom)
                        {
                            continue;
                        }
                        else
                        {
                            datalist.append(itemDiv);
                        }

                        var itemHead = $('<div class="item-head"></div>');
                        itemDiv.append(itemHead);
                        itemDiv.append(itemHead);
                        var itemHead_l = $('<div class="item-head-left fl"></div>');
                        itemHead.append(itemHead_l);
                        var itemHead_r = $('<div class="item-head-right fr"></div>');
                        itemHead.append(itemHead_r);
                        var itemBody = $('<div class="clearfix fl"></div>');
                        itemDiv.append(itemBody);

                        // 数据头
                        function addHead() {
                            // 数据头左侧
                            itemHead_l.append($('<span>派单时间：<em>' + item.sendDesignTime + '</em></span>'));
                            itemHead_l.append($('<span>订单号：<em>' + item.orderid + '</em></span>'));

                            //是否急单
                            var orderUrgencyDays = parseInt(SysParam.sysParam['order_urgency_days'].value);
                            if (item.userPeriod <= orderUrgencyDays) {
                                itemHead_l.append($('<span class="anxious">急单</span>'));
                            }

                            if (item.isContinueOrder == 1) {
                                itemHead_l.append($('<span class="renew">续订</span>'));
                            }

                            var view = $('<span data-customid="' + item.customid + '">查看订单</span>');
                            view.on('click', function () {
                                var customid = $(this).attr('data-customid');
                                that.addTab(customid, './Designer/designDetails.html?customid=' + customid);
                            });
                            itemHead_r.append(view);
                            itemHead_r.append($('<span title="更多操作"></span>'));
                        }

                        addHead();

                        // 产品图
                        var prodImage = $('<div class="photo"> <img onerror="this.src=\'../Image/imageError.png\'" data-orgSrc="http://' + item.middleGoodsImage + '" src="http://' + item.smallGoodsImage + '"> </div>');
                        itemBody.append(prodImage);
                        function addProductPhoto() {
                            prodImage.on('click', function () {
                                var orgSrc = $($(this).find('img')).attr('data-orgSrc');
                                previewImg.create(orgSrc);
                                previewImg.show();
                            });
                        }

                        addProductPhoto();

                        //5要素
                        var infoContainer = $('<div class="clearfix fl" style="width: 645px; margin-left: 10px;"></div>');
                        itemBody.append(infoContainer);
                        function addInfo() {
                            var element = SysParam.element;//元素
                            var model = ConvertIdToName(element.model, item.model).join(';');
                            var technology = ConvertIdToName(element.technology, item.technology).join(';');
                            var color = ConvertIdToName(element.color, item.color).join(';');

                            var info = $('<div class="info">' +
                                '<div class="attributes">' +
                                '<span>' + SysParam.element.goodsClass[item.goodsClass].name + '</span>' +
                                '<span>' + SysParam.element.material[item.material].name + '</span>' +
                                '<span>' + SysParam.element.accessories[item.accessories].name + '</span>' +
                                '</div>' +
                                '<!--工艺-->' +
                                '<div class="process">' +
                                '<span>' + model + '</span>' +
                                '<span>' + technology + '</span>' +
                                '<span>' + color + '</span>' +
                                '</div>' +
                                '<div class="size">' +
                                '<span><em>' + item.length + '×' + item.width + '×' + item.height + '</em> (mm)</span>' +
                                '</div>' +
                                '<div class="money">' +
                                '<span>¥ <em>' + item.designPrice.formatMoney(2, "", ",", ".") + '</em></span>' +
                                '</div>' +
                                '</div>');
                            infoContainer.append(info);
                        }

                        addInfo();

                        //状态
                        function addStatus() {
                            var status = $('<div style="margin-left: 8px;" class="status">' +
                                '<span>' + SysParam.designStatus[item.designStatus].designerTag +'</span>' +
                                '</div>')
                            itemBody.append(status);
                        }

                        addStatus();

                        //按钮
                        function operating() {
                            var operating = $('<div class="operating"></div>');
                            //立即抢单
                            if (item.designStatus==0||item.designStatus==1) {
                                var btn=$('<button class="btn" style="width: 66px; height: 23px;" data-designId="'+item.designId+'" data-orderid="' + item.orderid + '" data-ordersummaryId="' + item.id + '" data-customid="' + item.customid + '">立即抢单</button>');
                                btn.on('click',function () {
                                    var customid = $(this).attr('data-customid');
                                    var designId = $(this).attr('data-designId');
                                    var ordersummaryId = $(this).attr('data-ordersummaryId');
                                    var url=config.WebService()["orderDesignInfo_Update"];
                                    Requst.ajaxPost(url,{"wId":designId},true,function (data) {
                                        if(data.code==200)
                                        {
                                           Message.show('提示',data.message,MsgState.Success,2000,function () {
                                                classMain.loadOverview(null,null,null,customid);
                                           });
                                        }
                                        else {
                                            Message.show('提示',data.message,MsgState.Warning,2000);
                                        }
                                    });
                                });
                                operating.append(btn);
                            }
                            //提交设计
                            if (item.designStatus==2) {
                                var btn=$('<button class="btn" style="width: 66px; height: 23px;" data-orderid="' + item.orderid + '" data-ordersummaryId="' + item.id + '" data-customid="' + item.customid + '">提交设计</button>');
                                btn.on('click',function () {
                                    var customid = $(this).attr('data-customid');
                                    var orderid = $(this).attr('data-orderid');
                                    var ordersummaryId = $(this).attr('data-ordersummaryId');
                                    that.addTab(customid, './Designer/designDetails.html?customid=' + customid+"&operType=submit");
                                });
                                operating.append(btn);
                            }
                            //修改设计
                            if (item.designStatus==4) {
                                var btn=$('<button class="btn" style="width: 66px; height: 23px;" data-orderid="' + item.orderid + '" data-ordersummaryId="' + item.id + '" data-customid="' + item.customid + '">修改设计</button>');
                                btn.on('click',function () {
                                    var customid = $(this).attr('data-customid');
                                    var orderid = $(this).attr('data-orderid');
                                    var ordersummaryId = $(this).attr('data-ordersummaryId');
                                    that.addTab(customid, './Designer/designDetails.html?customid=' + customid+"&operType=modify");
                                });
                                operating.append(btn);
                            }
                            //查看设计
                            if (item.designStatus==5||item.designStatus==3) {
                                var btn=$('<button class="btn" style="width: 66px; height: 23px;" data-orderid="' + item.orderid + '" data-ordersummaryId="' + item.id + '" data-customid="' + item.customid + '">查看设计</button>');
                                btn.on('click',function () {
                                    var customid = $(this).attr('data-customid');
                                    var orderid = $(this).attr('data-orderid');
                                    var ordersummaryId = $(this).attr('data-ordersummaryId');
                                    that.addTab(customid, './Designer/designDetails.html?customid=' + customid+"&operType=view");
                                });
                                operating.append(btn);
                            }

                            itemBody.append(operating);
                        }

                        operating();
                    }
                }
                else if (roleType == 3)//车间数据模版
                {
                    for (var i = 0; i < data.data.pageData.length; i++) {
                        var item = data.data.pageData[i];
                        var itemDiv = $('<div id="item_'+item.customid+'" class="workshop data-item clearfix"></div>');

                        //更新逐条信息
                        if(customid!=null && customid==item.customid)
                        {
                            itemDiv=$("#item_"+customid);
                            itemDiv.html("");
                        }
                        else if(customid!=null && customid!=item.customid && isDom)
                        {
                            continue;
                        }
                        else
                        {
                            datalist.append(itemDiv);
                        }

                        var itemHead = $('<div class="item-head"></div>');
                        itemDiv.append(itemHead);
                        itemDiv.append(itemHead);
                        var itemHead_l = $('<div class="item-head-left fl"></div>');
                        itemHead.append(itemHead_l);
                        var itemHead_r = $('<div class="item-head-right fr"></div>');
                        itemHead.append(itemHead_r);
                        var itemBody = $('<div class="clearfix fl"></div>');
                        itemDiv.append(itemBody);
                        // 数据头
                        function addHead() {
                            // 数据头左侧
                            itemHead_l.append($('<span>创建时间：<em>' + item.createTime + '</em></span>'));
                            itemHead_l.append($('<span>订单号：<em>' + item.orderid + '</em></span>'));

                            //是否急单
                            var orderUrgencyDays = parseInt(SysParam.sysParam['order_urgency_days'].value);
                            if (item.userPeriod <= orderUrgencyDays) {
                                itemHead_l.append($('<span class="anxious">急单</span>'));
                            }

                            if (item.isContinueOrder == 1) {
                                itemHead_l.append($('<span class="renew">续订</span>'));
                            }

                            var deadlineTime=item.deadlineTime;
                            if(deadlineTime)
                            {
                                deadlineTime= top.Helper.Date.countdown(deadlineTime);
                            }
                            else
                            {
                                deadlineTime="--  天  --  小时  --  分钟";
                            }

                            var timeleft = $('<span data-deadlineTime="'+item.deadlineTime+'" class="timeleft"><i class="clock-icon"></i>剩余发货时间：<em>'+deadlineTime+'</em></span>');
                            itemHead_l.append(timeleft);
                            // 数据头右侧

                            var view = $('<span data-customid="' + item.customid + '">查看订单</span>');
                            view.on('click', function () {
                                var customid = $(this).attr('data-customid');
                                that.addTab(customid, './WorkShop/shopDetails.html?customid=' + customid);
                            });
                            itemHead_r.append(view);
                            itemHead_r.append($('<span title="更多操作"></span>'));
                        }

                        addHead();

                        // 产品图
                        var prodImage = $('<div class="photo"> <img onerror="this.src=\'../Image/imageError.png\'" data-orgSrc="http://' + item.middleGoodsImage + '" src="http://' + item.smallGoodsImage + '"> </div>');
                        itemBody.append(prodImage);
                        function addProductPhoto() {
                            prodImage.on('click', function () {
                                var orgSrc = $($(this).find('img')).attr('data-orgSrc');
                                previewImg.create(orgSrc);
                                previewImg.show();
                            });
                        }

                        if(item.lastQuote>item.userPrice)
                        {
                            prodImage.append($("<i class='mark1'><s style='font-size: 12px; color:#ffffff; text-shadow: 1px 1px 1px rgba(135,18,18,0.50);'>超预算</s></i>"));
                        }
                        else if(item.lastPeriod>item.userPeriod)
                        {
                            prodImage.append($("<i class='mark2'><s style='font-size: 12px; color:#ffffff; text-shadow: 1px 1px 1px rgba(174,64,16,0.50);'>超工期</s></i>"));
                        }
                        else if(item.inquiryStatus==5||item.inquiryStatus==6)
                        {
                            prodImage.append($("<i class='mark3'><s style='font-size: 12px; color:#ffffff; text-shadow: 1px 1px 1px rgba(24,38,111,0.50);'>议价中</s></i>"));
                        }


                        addProductPhoto();

                        //5要素
                        var infoContainer = $('<div class="clearfix fl" style="width: 645px; margin-left: 10px;"></div>');
                        itemBody.append(infoContainer);
                        function addInfo() {
                            var element = SysParam.element;//元素
                            var model = ConvertIdToName(element.model, item.model).join(';');
                            var technology = ConvertIdToName(element.technology, item.technology).join(';');
                            var color = ConvertIdToName(element.color, item.color).join(';');
                            var producePrice=item.lastQuote>0?item.producePrice.formatMoney(2, "", ",", "."):"----";

                            var info = $('<div class="info">' +
                                '<div class="attributes">' +
                                '<span>' + SysParam.element.goodsClass[item.goodsClass].name + '</span>' +
                                '<span>' + SysParam.element.material[item.material].name + '</span>' +
                                '<span>' + SysParam.element.accessories[item.accessories].name + '</span>' +
                                '</div>' +
                                '<!--工艺-->' +
                                '<div class="process">' +
                                '<span>' + model + '</span>' +
                                '<span>' + technology + '</span>' +
                                '<span>' + color + '</span>' +
                                '</div>' +
                                '<div class="num">' +
                                '<span><em>' + item.number + '</em>个</span>' +
                                '</div>' +
                                '<div class="size">' +
                                '<span><em>' + item.length + '×' + item.width + '×' + item.height + '</em> (mm)</span>' +
                                '</div>' +
                                '<div class="day">' +
                                '<span>¥ <em class="c-red">'+producePrice+'</em>/<em>'+item.userPeriod+'</em>天</span>' +
                                '</div>' +
                                '</div>');
                            infoContainer.append(info);
                        }

                        addInfo();

                        //金额区域
                        function addMoney() {
                            var lastQuote=item.lastQuote?item.lastQuote.formatMoney(2, "", ",", "."):"----";
                            var lastPeriod=item.lastPeriod?item.lastPeriod:"--";
                            var money = $('<div class="amount">' +
                                '<div class="quoted"><!--报价-->' +
                                '<span>上次报价：¥ <em> '+lastQuote+' / '+lastPeriod+'</em>天</span>' +
                                '</div>' +
                                '<!--预算-->' +
                                '<div class="budget hide">' +
                                '<span>客户预算：<em>¥' + item.userPrice.formatMoney(2, "", ",", ".") + '</em></span>' +
                                '</div>' +
                                '</div>');
                            infoContainer.append(money);

                            if(item.lastQuote>item.userPrice)//报价高于客户预算
                            {
                                $($(money).find('.budget')).removeClass('hide');
                            }
                        }

                        addMoney();

                        //状态
                        function addStatus() {
                            var status = $('<div class="status">' +
                                '<span>' + item.produceMessage + '</span>' +
                                '</div>');
                            itemBody.append(status);
                        }

                        addStatus();

                        //按钮
                        function operating() {
                            var operating = $('<div class="operating"></div>');
                            //未报价
                            if((item.inquiryStatus==1||item.inquiryStatus==2)&& item.lastQuote==0)
                            {
                                var btn=$('<button class="btn" data-lastQuote="'+item.lastQuote+'" style="width: 66px; height: 23px;" data-inquiryRound="'+item.inquiryRound+'" data-orderid="' + item.orderid + '" data-ordersummaryId="' + item.id + '" data-customid="' + item.customid + '">报价</button>');
                                btn.on('click',function () {
                                    var customid = $(this).attr('data-customid');
                                    var orderid = $(this).attr('data-orderid');
                                    var ordersummaryId = $(this).attr('data-ordersummaryId');
                                    var inquiryRound=$(this).attr('data-inquiryRound');//询价轮次
                                    var lastQuote=$(this).attr("data-lastQuote");//上次报价
                                    top.Popup.open("报价",423,266,"./Pop-ups/orderOffer.html?customid="+customid+"&inquiryRound="+inquiryRound+"&lastQuote="+lastQuote);
                                });
                                operating.append(btn);
                            }
                            //重新报价
                            if(item.inquiryStatus==2 && item.lastQuote>0)
                            {
                                var btn=$('<button class="btn" data-lastQuote="'+item.lastQuote+'" style="width: 66px; height: 23px;" data-inquiryRound="'+item.inquiryRound+'" data-orderid="' + item.orderid + '" data-ordersummaryId="' + item.id + '" data-customid="' + item.customid + '">重新报价</button>');
                                btn.on('click',function () {
                                    var customid = $(this).attr('data-customid');
                                    var orderid = $(this).attr('data-orderid');
                                    var ordersummaryId = $(this).attr('data-ordersummaryId');
                                    var inquiryRound=$(this).attr('data-inquiryRound');//询价轮次
                                    var lastQuote=$(this).attr("data-lastQuote");//上次报价

                                    top.Popup.open("重新报价",423,266,"./Pop-ups/orderOffer.html?customid="+customid+"&inquiryRound="+inquiryRound+"&lastQuote="+lastQuote);

                                });
                                operating.append(btn);
                            }
                            //处理议价
                            if(item.inquiryStatus==5 || (item.inquiryStatus==6 && item.lastQuote==0))
                            {
                                var btn=$('<button class="btn" style="width: 66px; height: 23px;" data-userPeriod="'+item.workshopUserPeriod+'" data-basePrice="'+item.workshopBasePrice+'" data-orderid="' + item.orderid + '" data-ordersummaryId="' + item.id + '" data-customid="' + item.customid + '">处理议价</button>');
                                btn.on('click',function () {
                                    var customid = $(this).attr('data-customid');
                                    var orderid = $(this).attr('data-orderid');
                                    var ordersummaryId = $(this).attr('data-ordersummaryId');
                                    var userPeriod=$(this).attr("data-userPeriod");//客户期望工期
                                    var basePrice=$(this).attr("data-basePrice");//客户低价

                                    top.Popup.open("处理议价",423,266,"./Pop-ups/handBarg.html?customid="+customid+"&userPeriod="+userPeriod+"&basePrice="+basePrice);

                                });
                                operating.append(btn);
                            }
                            //接受生产
                            if(item.produceStatus==2)
                            {
                                var btn=$('<button class="btn" style="width: 66px; height: 23px;" data-orderid="' + item.orderid + '" data-ordersummaryId="' + item.id + '" data-customid="' + item.customid + '">接受生产</button>');
                                btn.on('click',function () {
                                    var customid = $(this).attr('data-customid');
                                    var orderid = $(this).attr('data-orderid');
                                    var ordersummaryId = $(this).attr('data-ordersummaryId');

                                    var url=config.WebService()["orderProductInfoAccept_Update"];
                                    top.Requst.ajaxPost(url,{"customid":customid},true,function (data) {
                                        if(data.code==200)
                                        {
                                            top.Message.show("提示",data.message,MsgState.Success,2000,function () {
                                                top.classMain.loadOverview(null,null,null,customid);
                                            });
                                        }
                                        else
                                        {
                                            top.Message.show("提示",data.message,MsgState.Warning,2000);
                                        }
                                    });
                                });
                                operating.append(btn);
                            }
                            //发货
                            if(item.produceStatus==3)
                            {
                                var btn=$('<button class="btn" style="width: 66px; height: 23px;" data-orderid="' + item.orderid + '" data-ordersummaryId="' + item.id + '" data-customid="' + item.customid + '">发货</button>');
                                btn.on('click',function () {
                                    var customid = $(this).attr('data-customid');
                                    var orderid = $(this).attr('data-orderid');
                                    var ordersummaryId = $(this).attr('data-ordersummaryId');
                                    top.Popup.open("发货",423,230,"./Pop-ups/uploadLogist.html?customid="+customid);
                                });
                                operating.append(btn);
                            }

                            //查看物流
                            if(item.produceStatus==4)
                            {
                                var btn=$('<button class="btn" style="width: 66px; height: 23px;" data-orderid="' + item.orderid + '" data-ordersummaryId="' + item.id + '" data-customid="' + item.customid + '">查看物流</button>');
                                btn.on('click',function () {
                                    var customid = $(this).attr('data-customid');
                                    var orderid = $(this).attr('data-orderid');
                                    var ordersummaryId = $(this).attr('data-ordersummaryId');
                                    window.open("./Pop-ups/logisticsInfo.html?customid="+customid+"&orderid="+orderid);
                                });
                                operating.append(btn);
                            }

                            //上传成品图
                            if(item.produceStatus==3 || item.produceStatus==4)
                            {

                                if (item.smallFinishedProductsImage1||item.smallFinishedProductsImage2||item.smallFinishedProductsImage3)
                                {
                                    var btn=$('<button class="btn" style="width: 66px; height: 23px;" data-orderid="' + item.orderid + '" data-ordersummaryId="' + item.id + '" data-customid="' + item.customid + '">编辑成品图</button>');
                                    btn.on('click',function () {
                                        var customid = $(this).attr('data-customid');
                                        var orderid = $(this).attr('data-orderid');
                                        var ordersummaryId = $(this).attr('data-ordersummaryId');
                                        OPER.productPicture(customid,'edit');
                                    });
                                    operating.append(btn);
                                }
                                else
                                {
                                    var btn=$('<button class="btn" style="width: 66px; height: 23px;" data-orderid="' + item.orderid + '" data-ordersummaryId="' + item.id + '" data-customid="' + item.customid + '">上传成品图</button>');
                                    btn.on('click',function () {
                                        var customid = $(this).attr('data-customid');
                                        var orderid = $(this).attr('data-orderid');
                                        var ordersummaryId = $(this).attr('data-ordersummaryId');
                                        OPER.productPicture(customid,'edit',"上传成品图");
                                    });
                                    operating.append(btn);
                                }

                            }

                            itemBody.append(operating);
                        }

                        operating();
                    }
                }
                inputCheck();//input输入框校验
                //分页
                classMain.pagePrams.totalPage = Math.ceil(data.data.pageMessage.rowCount / classMain.pagePrams.pageSize);
                classMain.initPage();
            }
        });
    }
};

// 取消激活页面
function DeactivatePage() {
    var iframeList = $('.iframe-container .iframe');
    iframeList.addClass('hide');
}

// 取消激活Tab
function DeactivateTab() {
    var tabContaine = $('.tab-container ul li');
    tabContaine.removeClass('active');
}

//选中某选项卡
function SelectedTab(index) {
    DeactivateTab();
    DeactivatePage();
    $('#tab_' + index).addClass('active');
    $('#iframe_box_' + index).removeClass('hide');
}

//图片预览
var previewImg = {
    create: function (url) {//创建图片
        $('#previewImg').html("");
        var li = $('<li style="display: none;"><img src="' + url + '" data-original="' + url + '"/></li>');
        $('#previewImg').append(li);
        $('#previewImg').viewer({
            url: 'data-original',
        });
        $("#previewImg").viewer('update');
    },
    show: function () {//显示图片
        var img = $('#previewImg').find('li').find('img');
        $(img[0]).click();
    }
};

//设置弹出窗体高度
var setPopSize = function (width, height) {
    var iframe = $(".layui-layer-iframe");
    iframe.css("height", height + 73 + "px");
    iframe.find('iframe').css("height", height + 28 + "px");
}

// 设置主界面高度
var isSetPageHeight=false;
function pageHeightSet() {
    var scrollH = top.Helper.getClientHeight(); //浏览器显示区域高度
    //******导航区域设置-begin
    var domNav = $('.nav');
    // 设置导航菜单的最大高度
    domNav.css('max-height', scrollH - 70 + 'px');
    //******导航区域设置-end

    // 主体区域
    var domMain = $('.container .iframe-container');
    domMain.css('height', (isMessage?-34:0)+scrollH - 90 + 'px');

    if(!isSetPageHeight)
    {
        $(window).resize(function () {
            scrollH = top.Helper.getClientHeight(); //浏览器显示区域高度
            domNav.css('max-height', scrollH - 70 + 'px');//导航

            domMain.css('height', (isMessage?-34:0)+scrollH - 90 + 'px');//主体区域
        });
        isSetPageHeight=true;
    }
}