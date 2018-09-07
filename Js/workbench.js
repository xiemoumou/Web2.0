/**
 * Created by inshijie on 2018/6/12.
 */
var SysParam = "";
var roleType = -1;//获取角色

$(function () {
    roleType = top.Helper.Cache.get('roleType');
    roleType = parseInt(roleType);//获取角色
    if (localStorage.getItem('SysParam'))//从缓存获取字典
    {
        try {
            SysParam = JSON.parse(localStorage.getItem('SysParam'));
        }
        catch (e) {

        }
    }
    classMain.init();
});

var classMain = {
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
        var scrollH = top.Helper.getClientHeight(); //浏览器显示区域高度
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
        function pageHeightSet() {
            //******导航区域设置-begin
            var domNav = $('.nav');
            // 设置导航菜单的最大高度
            domNav.css('max-height', scrollH - 70 + 'px');
            //******导航区域设置-end

            // 主体区域
            var domMain = $('.container .iframe-container');
            domMain.css('height', scrollH - 90 + 'px');

            $(window).resize(function () {
                scrollH = top.Helper.getClientHeight(); //浏览器显示区域高度
                domNav.css('max-height', scrollH - 70 + 'px');//导航
                domMain.css('height', scrollH - 90 + 'px');//主体区域
            });
        }

        // 加载系统字典
        function loadSystemParams(async) {
            async = async ? async : false;
            var getSysParam = top.config.WebService()['getSysParam'];
            top.Requst.ajaxGet(getSysParam, null, async, function (data) {
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
                dict['inquiryStatus'] = formatOrderState(SysParam.orderStatus.inquiryStatus);
                dict['designStatus'] = formatOrderState(SysParam.orderStatus.designStatus);
                dict['produceStatus'] = formatOrderState(SysParam.orderStatus.produceStatus);

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
                        temp[dataSource[i].code] = dataSource[i].servicerTag;
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
                                var domDt = $('<dt data-iconUrl1="http://' + item.iconurl1 + '" data-iconUrl2="http://' + item.iconurl2 + '" data-type="' + item.identity + '" data-identity="' + item.navId + '" data-isLast="' + item.isLast + '"><i class="icon" style="background-image: url(http://' + item.iconurl1 + ');"></i> <span>' + item.name + '</span>' + arrow + ' <s class="statistics gradient fr hide identity_' + item.identity + '">0</s> </dt>');

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
                                var domLi = $('<li data-type="' + item.identity + '" data-identity="' + item.navId + '" class="secondary"><span>' + item.name + '</span> <s class="statistics gradient fr hide identity_' + item.identity + '">0</s></li>');
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

            co.style.left = x + "px";
            co.style.top = y + "px";
            that.initEvent.creatOrderBtn();
            $('#createOrder').removeClass('hide');
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
            var t = setInterval(function () {
                var timeleft = $('.timeleft');
                for (var i = 0; i < timeleft.length; i++) {
                    ////////////////////// ////////////////////// ////////////////////// //////////////////////
                }
            }, 60000)
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
                classMain.loadOverview();
            });
            $('.customer-service-table-sort .createtime').on('click', function () {
                setSortType($(this));
                classMain.requstParams['sortCategory'] = 'createTime';//创建时间
                classMain.requstParams['sortType'] = $(this).attr('data-sorttype');
                classMain.loadOverview();
            });
            $('.customer-service-table-sort .updatetime').on('click', function () {
                setSortType($(this));
                classMain.requstParams['sortCategory'] = 'updateTime';//操作时间
                classMain.requstParams['sortType'] = $(this).attr('data-sorttype');
                classMain.loadOverview();
            });
            $('.customer-service-table-sort .ordermoney').on('click', function () {
                setSortType($(this));
                classMain.requstParams['sortCategory'] = 'orderPrice';//订单金额
                classMain.requstParams['sortType'] = $(this).attr('data-sorttype');
                classMain.loadOverview();
            });

            //方案师
            $('.designer-table-sort .complex').on('click', function () {
                classMain.requstParams['sortCategory'] = 'synthesize'; //综合排序
                classMain.requstParams['sortType'] = 'asc';
                setSortType($(this));
            });
            $('.designer-table-sort .assigntime').on('click', function () {
                classMain.requstParams['sortCategory'] = 'createTime';//派单时间
                classMain.requstParams['sortType'] = 'asc';
                setSortType($(this));
            });
            $('.designer-table-sort .designfee').on('click', function () {
                classMain.requstParams['sortCategory'] = 'designPrice';//设计费
                classMain.requstParams['sortType'] = 'asc';
                setSortType($(this));
            });

            //车间
            $('.workshop-table-sort .complex').on('click', function () {
                classMain.requstParams['sortCategory'] = 'synthesize'; //综合排序
                classMain.requstParams['sortType'] = 'asc';
                setSortType($(this));
            });
            $('.workshop-table-sort .createtime').on('click', function () {
                classMain.requstParams['sortCategory'] = 'createTime';//创建时间
                classMain.requstParams['sortType'] = 'asc';
                setSortType($(this));
            });
            $('.customer-service-table-sort .opertime').on('click', function () {
                classMain.requstParams['sortCategory'] = 'updateTime';//操作时间
                classMain.requstParams['sortType'] = 'asc';
                setSortType($(this));
            });


            $('.anxious').on('click', function () { //急单
                var thisObj = $(this);
                var i = thisObj.find('i');
                if (thisObj.attr('data-select') == 'true') {
                    thisObj.attr('data-select', 'false');
                    $(i).css('background-color', '#ffffff');
                    classMain.requstParams['userPeriod'] = 0;
                }
                else {
                    thisObj.attr('data-select', 'true');
                    $(i).css('background-color', 'rgb(249, 120, 83)');
                    classMain.requstParams['userPeriod'] = 1;
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
            }
        },
        edit: function (customid) {
            var scrollH = top.Helper.getClientHeight();
            var popH = scrollH - 100 > 410 ? 410 : scrollH - 100;
            Popup.open("产品生产参数编辑", 900, popH, "./CustomerService/createOrder.html?operType=edit&customid=" + customid);
        },
        buttonClick: {}
    },
    requstParams: {"sortCategory": "synthesize", "sortType": "desc"},
    loadOverview: function (type, pageIndex, isInitPage,customid) {//加载概览数据 initPage是否初始化分页
        var that = this;
        if (isInitPage)//分页初始化
        {
            classMain.pagePrams.isInit = -1;
        }

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
        top.Requst.ajaxGet(getNavListUrl, classMain.requstParams, true, function (data) {

            var datalist = $('#datalist');
            if(!customid)
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
                        else if(customid!=null && customid!=item.customid)
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
                            var check = $('<span>核对订单</span>');
                            check.on('click', function () {
                                alert('触发核对订单');
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
                            var moreItem_1 = $('<span>发票/收据</span>');
                            moreItem_1.on('click', function () {
                                alert('弹出发票收据');
                            });
                            moreList.append(moreItem_1);

                            var moreItem_2 = $('<span>产品包装</span>');
                            moreItem_2.on('click', function () {
                                alert('弹出产品包装');
                            });
                            moreList.append(moreItem_2);

                            var moreItem_3 = $('<span>订单备注</span>');
                            moreItem_3.on('click', function () {
                                alert('弹出订单备注');
                            });
                            moreList.append(moreItem_3);

                            var moreItem_4 = $('<span style="border-bottom: none;">删除订单</span>');
                            moreItem_4.on('click', function () {
                                alert('弹出删除订单');
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
                            var tax = item.tax_rate > 0 ? "含税" : "不含税";

                            var money = $('<div class="amount">' +
                                '<div class="design-fee"><!--设计费-->' +
                                '<span>设计费：¥ <em>' + item.designPrice.formatMoney(2, "", ",", ".") + ' </em></span>' +
                                '<span>引导费：¥ <em>' + item.introducePrice.formatMoney(2, "", ",", ".") + '</em></span>' +
                                '<i class="edit hide" data-customid="' + item.customid + '">编辑</i>' +
                                '</div>' +
                                '<!--预算-->' +
                                '<div class="budget">' +
                                '<i class="label fl">预算：</i>' +
                                '<input class="fl" value="' + item.userPrice.formatMoney(2, "", ",", ".") + '">' +
                                '<button data-customid="' + item.customid + '" class="btn edit fl">确定</button>' +
                                '</div>' +
                                '<!--报价-->' +
                                '<div class="quoted">' +
                                '<div class="bargain"><!--议价-->' +
                                '<span class="tax">' + tax + '</span>' +
                                '<span class="proposed-price">' + proposed + '</span>' +
                                '<span data-customid="' + item.customid + '" class="button hide">议价</span>' +
                                '<i class="arrow"></i>' +
                                '</div>' +
                                '<i class="label fl">报价：</i>' +
                                '<input class="fl" value="' + item.prePrice.formatMoney(2, "", ",", ".") + '">' +
                                '<button data-customid="' + item.customid + '" class="btn edit fl">确定</button>' +
                                '</div>' +
                                '</div>');

                            if (item.inquiryStatus >= 2 && item.inquiryStatus <= 4)//是否显示议价
                            {
                                var bargain = $(money.find('.quoted').find('.button'));
                                $(money.find('.quoted').find('.proposed-price')).css('color', ' #5298FF');
                                bargain.removeClass('hide');
                            }
                            else {
                                var bargain = $(money.find('.quoted').find('.bargain'));
                                $(money.find('.quoted').find('.proposed-price')).css('color', '#E84B4C');
                                bargain.css('width', '185px');
                            }

                            //议价
                            $(money.find('.quoted').find('.button')).on('click', function () {
                                var customid = $(this).attr('data-customid');
                                alert('发起议价');
                            });

                            // 编辑设计费
                            $(money.find('.design-fee').find('.edit')).on('click', function () {
                                var customid = $(this).attr('data-customid');
                                alert('编辑设计费');
                            });
                            // 编辑预算
                            $(money.find('.budget').find('.edit')).on('click', function () {
                                var customid = $(this).attr('data-customid');
                                alert('编辑预算' + customid);
                            });

                            $(money.find('.design-fee')).hover(function () {
                                $($(this).find('i')).removeClass('hide');
                            }, function () {
                                $($(this).find('i')).addClass('hide');
                            });

                            // 编辑报价
                            $(money.find('.quoted').find('.edit')).on('click', function () {
                                var customid = $(this).attr('data-customid');
                                alert('编辑报价' + customid);
                            });

                            infoContainer.append(money);
                        }

                        addMoney();

                        var payStatus = item.inquiryStatus == 4 ? "" : "未支付";
                        //状态
                        function addStatus() {
                            var status = $('<div class="status"></div>');
                            if (SysParam.inquiryStatus[item.inquiryStatus]) {
                                status.append($('<span>' + SysParam.inquiryStatus[item.inquiryStatus] + '</span>'));
                            }
                            if (SysParam.designStatus[item.designStatus]) {
                                status.append($('<span>' + SysParam.designStatus[item.designStatus] + '</span>'));
                            }
                            if (SysParam.produceStatus[item.produceStatus]) {
                                status.append($('<span>' + SysParam.produceStatus[item.produceStatus] + '</span>'));
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
                            var buttonShow = item.command.split(',');
                            if (buttonShow.indexOf('INQUIRY') >= 0) {
                                var btn=$('<button class="btn" data-orderid="' + item.orderid + '" data-ordersummaryId="' + item.id + '" data-customid="' + item.customid + '" style="width: 66px; height: 23px;">发起询价</button>');
                                btn.on('click',function () {
                                    var customid = $(this).attr('data-customid');
                                    OPER.sendInquiry(customid);//发起询价
                                });
                                operating.append(btn);
                            }
                            if (buttonShow.indexOf('PAYOFF') >= 0) {
                                operating.append('<button class="btn" data-orderid="' + item.orderid + '" data-ordersummaryId="' + item.id + '"  data-customid="' + item.customid + '" style="width: 66px; height: 23px;">确认支付</button>');
                            }
                            if (buttonShow.indexOf('SEND_DESIGN') >= 0) {
                                var btn=$('<button class="btn" data-orderid="' + item.orderid + '" data-ordersummaryId="' + item.id + '" data-customid="' + item.customid + '" style="width: 66px; height: 23px;">分配设计</button>');
                                btn.on('click',function () {
                                    var customid = $(this).attr('data-customid');
                                    var orderid = $(this).attr('data-orderid');
                                    var ordersummaryId = $(this).attr('data-ordersummaryId');
                                    debugger
                                    var designPrice= $($(this).parent().parent()).find('.amount').find('.design-fee').find('span').eq(0).find('em');
                                    OPER.distributionDesign(ordersummaryId,orderid,customid,$(designPrice).text());
                                });
                                operating.append(btn);
                            }
                            if (buttonShow.indexOf('SEND_PRODUCE') >= 0) {
                                operating.append('<button class="btn" data-orderid="' + item.orderid + '" data-ordersummaryId="' + item.id + '" data-customid="' + item.customid + '" style="width: 66px; height: 23px;">分配生产</button>');
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
                        else if(customid!=null && customid!=item.customid)
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
                            itemHead_l.append($('<span>派单时间：<em>' + item.sendDesignTime || "------------" + '</em></span>'));
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
                            itemHead_r.append($('<span title="更多操作"><i class="more-icon"></i></span>'));
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
                            var info = $('<div class="info">' +
                                '<div class="attributes">' +
                                '<span>' + item.goodsClass + '</span>' +
                                '<span>' + item.material + '</span>' +
                                '<span>' + item.accessories + '</span>' +
                                '</div>' +
                                '<!--工艺-->' +
                                '<div class="process">' +
                                '<span>' + item.model + '</span>' +
                                '<span>' + item.technology + '</span>' +
                                '<span>' + item.color + '</span>' +
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
                            var status = $('<div class="status">' +
                                '<span>' + item.designStatus + '</span>' +
                                '</div>')
                            itemBody.append(status);
                        }

                        addStatus();

                        //按钮
                        function operating() {
                            var operating = $('<div class="operating"></div>');
                            var buttonShow = item.command.split(',');
                            if (buttonShow.indexOf('INQUIRY') >= 0) {
                                operating.append('<button class="btn" style="width: 66px; height: 23px;">立即抢单</button>');
                            }
                            if (buttonShow.indexOf('PAYOFF') >= 0) {
                                operating.append('<button class="btn" style="width: 66px; height: 23px;">确认支付</button>');
                            }
                            if (buttonShow.indexOf('SEND_DESIGN') >= 0) {
                                operating.append('<button class="btn" style="width: 66px; height: 23px;">分配设计</button>');
                            }
                            if (buttonShow.indexOf('SEND_PRODUCE') >= 0) {
                                operating.append('<button class="btn" style="width: 66px; height: 23px;">分配生产</button>');
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
                        else if(customid!=null && customid!=item.customid)
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

                            var timeleft = $('<span class="timeleft"><i class="clock-icon"></i>剩余发货时间：<em>12  天  12  小时  23  分钟</em></span>');
                            itemHead_l.append(timeleft);
                            // 数据头右侧

                            var view = $('<span data-customid="' + item.customid + '">查看订单</span>');
                            view.on('click', function () {
                                var customid = $(this).attr('data-customid');
                                that.addTab(customid, './WorkShop/shopDetails.html?customid=' + customid);
                            });
                            itemHead_r.append(view);
                            itemHead_r.append($('<span title="更多操作"><i class="more-icon"></i></span>'));
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
                            var info = $('<div class="info">' +
                                '<div class="attributes">' +
                                '<span>' + item.goodsClass + '</span>' +
                                '<span>' + item.material + '</span>' +
                                '<span>' + item.accessories + '</span>' +
                                '</div>' +
                                '<!--工艺-->' +
                                '<div class="process">' +
                                '<span>' + item.model + '</span>' +
                                '<span>' + item.technology + '</span>' +
                                '<span>' + item.color + '</span>' +
                                '</div>' +
                                '<div class="num">' +
                                '<span><em>' + item.number + '</em>个</span>' +
                                '</div>' +
                                '<div class="size">' +
                                '<span><em>' + item.length + '×' + item.width + '×' + item.height + '</em> (mm)</span>' +
                                '</div>' +
                                '<div class="day">' +
                                '<span>¥ <em class="c-red">1,000.00</em>/<em>99</em>天</span>' +
                                '</div>' +
                                '</div>');
                            infoContainer.append(info);
                        }

                        addInfo();

                        //金额区域
                        function addMoney() {
                            var money = $('<div class="amount">' +
                                '<div class="quoted"><!--报价-->' +
                                '<span>上次报价：¥ <em> 80000000 / 8</em>天</span>' +
                                '</div>' +
                                '<!--预算-->' +
                                '<div class="budget">' +
                                '<span>客户预算：<em>¥' + item.userPrice.formatMoney(2, "", ",", ".") + '</em></span>' +
                                '</div>' +
                                '</div>');
                            infoContainer.append(money);
                        }

                        addMoney();

                        //状态
                        function addStatus() {
                            var status = $('<div class="status">' +
                                '<span>' + item.produceStatus + '</span>' +
                                '</div>')
                            itemBody.append(status);
                        }

                        addStatus();

                        //按钮
                        function operating() {
                            var operating = $('<div class="operating"></div>');
                            var buttonShow = item.command.split(',');
                            if (buttonShow.indexOf('INQUIRY') >= 0) {
                                operating.append('<button class="btn" style="width: 66px; height: 23px;">发起询价</button>');
                            }
                            if (buttonShow.indexOf('PAYOFF') >= 0) {
                                operating.append('<button class="btn" style="width: 66px; height: 23px;">确认支付</button>');
                            }
                            if (buttonShow.indexOf('SEND_DESIGN') >= 0) {
                                operating.append('<button class="btn" style="width: 66px; height: 23px;">分配设计</button>');
                            }
                            if (buttonShow.indexOf('SEND_PRODUCE') >= 0) {
                                operating.append('<button class="btn" style="width: 66px; height: 23px;">分配生产</button>');
                            }

                            itemBody.append(operating);
                        }

                        operating();
                    }
                }
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