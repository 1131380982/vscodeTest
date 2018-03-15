(function () {
    var _options = {
        PageIndex: 0,
        PageSize: 10,
        ListCount: 0,
        ShowPage: 5,
        Elmement: ".list_page",
        PageParameter: "page",
        IsFirstLast: false,
        IsPreviousNext: false,
        IsHref: true,
        PageAjax: function () { }
    };

    var list_page = function (options) {
        document.querySelector(options.Elmement).className += " list_page";;
        this.init(options);
    };
    list_page.prototype = {
        init: function (options) {
            for (var key in options) {
                _options[key] = options[key]
            }

            this.options = _options;
            // console.log(this.options);
            var ListCount = this.options.ListCount;
            var PageIndex = this.options.PageIndex;
            var PageSize = this.options.PageSize;
            var ShowPage = this.options.ShowPage;
            var PageUrl = "";
            if (!this.options.IsHref) {
                if (!this.options.PageAjax(this.options.PageIndex, this.options)) {
                    console.log("PageAjax 出现问题")
                }
                //首次加载之后重新获取数据
                ListCount = this.options.ListCount;
                PageIndex = this.options.PageIndex;
                PageSize = this.options.PageSize;
                ShowPage = this.options.ShowPage;
            } else {

                var windowssearch = window.location.search;
                //处理URL参数开始
                var reg = new RegExp("(^|&)" + this.options.PageParameter + "=([^&]*)(&|$)");
                var arr = windowssearch.substr(1).match(reg);
                if (arr != null) {
                    PageUrl = unescape(arr[0]);
                    var firstand = unescape(arr[1]) == "&" ? "&" : "";
                    var lastand = unescape(arr[3]) == "&" ? "&" : "";
                    PageUrl = windowssearch.replace(PageUrl, firstand + this.options.PageParameter + "=__page__" + lastand);
                    if (this.options.PageIndex == 0) {
                        PageIndex = parseInt(unescape(arr[2]));
                    }
                } else {
                    if (windowssearch.indexOf("?") == -1) {
                        PageUrl = windowssearch + "?" + this.options.PageParameter + "=__page__";
                    } else {
                        PageUrl = windowssearch + "&" + this.options.PageParameter + "=__page__";
                    }
                    if (this.options.PageIndex == 0) {
                        PageIndex = 1;
                    }
                }
                //处理URL参数结束

            }

            var PageCount = (ListCount % PageSize == 0 ? parseInt(ListCount / PageSize) : parseInt(ListCount / PageSize) + 1);
            if (PageIndex > PageCount) {
                PageIndex = PageCount;
            }
            if (PageIndex < 1) {
                PageIndex = 1;
            }
            var startPage = PageIndex - parseInt(ShowPage / 2); //开始页码
            if (ListCount <= ShowPage || startPage < 1 || PageCount <= ShowPage) {
                startPage = 1;
            }
            if (startPage > (PageCount - ShowPage) && (PageCount - ShowPage) >= 0) {
                if (this.options.IsFirstLast) {
                    startPage = (PageCount - ShowPage);
                } else {
                    startPage = (PageCount - ShowPage) + 1;
                }
            }

            var endPage = PageIndex + parseInt(ShowPage / 2);  //结束页码
            if (PageIndex <= parseInt(ShowPage / 2) + 1) {
                if (this.options.IsFirstLast) {
                    endPage = ShowPage + 1;
                } else {
                    endPage = ShowPage;
                }
            }
            if (endPage > PageCount) {
                endPage = PageCount;
            }


            var html = '<ul>';
            if (this.options.IsPreviousNext && PageIndex != 1) {
                var url = PageUrl.replace(/__page__/, PageIndex - 1);
                html += this.AddStr(PageIndex - 1, url, '上一页');
            }
            if (this.options.IsFirstLast && startPage != 1) {
                var url = PageUrl.replace(/__page__/, 1);
                html += this.AddStr(1, url, 1);
            }
            for (var i = startPage; i <= endPage; i++) {
                var url = PageUrl.replace(/__page__/, i);
                if (i == PageIndex) {
                    html += this.AddStr(i, '', i, 'active');
                }
                else {
                    html += this.AddStr(i, url, i);
                }
            }
            if (this.options.IsFirstLast && endPage != PageCount) {
                var url = PageUrl.replace(/__page__/, PageCount);
                html += this.AddStr(PageCount, url, PageCount);

            }
            if (this.options.IsPreviousNext && PageIndex != PageCount) {
                var url = PageUrl.replace(/__page__/, PageIndex + 1);
                html += this.AddStr(PageIndex + 1, url, "下一页");

            }
            html += '</ul>';
            var pagehtml = document.querySelector(this.options.Elmement);
            pagehtml.innerHTML = html;
            this.data_click();
        },
        AddStr: function (page, url, txt, cssclass = "") {
            var datalistpage;
            var cssclassStr;
            if (url != null && url.length > 0) {
                url = ' href="' + url + '"';
            }
            if (cssclass.length > 0) {
                cssclassStr = ' class="' + cssclass + '"';
            }
            if (!this.options.IsHref) {
                datalistpage = ' data-list-page="' + page + '"';
                cssclassStr = ' class="' + cssclass + ' datalistpage"';
                return '<li><a ' + cssclassStr + '  ' + datalistpage + '>' + txt + '</a></li>';
            } else {
                return '<li><a ' + url + '  ' + cssclassStr + ' >' + txt + '</a></li>';
            }
        },
        data_click: function () {  //异步添加点击事件
            var list = document.querySelectorAll(".datalistpage");
            that = this;
            for (var index = 0; index < list.length; index++) {
                list[index].onclick = function () {
                    var page = this.getAttribute("data-list-page");
                    if (that.options.PageAjax(page, that.options)) {  //执行回调函数获取结果
                        that.options.PageIndex = parseInt(page);
                        that.init(that.options);
                    }
                }
            }
        }
    };

    window.list_page = list_page;
})();