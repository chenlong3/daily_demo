/**
 * Created by cl on 2017/7/18.
 */
var common = (function () {
    return {
        setUrl: function (url, data) {
            var _arr = [];
            for (var key in data) {
                _arr.push(key + '=' + data[key])
            }
            return url + '?' + _arr.join('&')
        },
        getUrl: function (url) {
            if(url.indexOf('?') !== -1){
                var result = {},
                    _arr = url.split('?')[1].split('&');
                _arr.forEach(function (item) {
                    var obj = item.split('=');
                    result[obj[0]] = decodeURI(obj[1])
                });
                return result
            }
            return {}
        },
        isArray:function(arr){
            return Object.prototype.toString.call(arr) === "[object Array]"
        },
        clone: function (data) {
            var result;
            if (common.isArray(data)) {
                result = [];
                data.forEach(function (item) {
                    result.push(common.clone(item))
                })
            } else if (typeof data === 'object') {
                result = {};
                for (var key in data) {
                    result[key] = common.clone(data[key])
                }
            } else {
                result = data
            }
            return result
        },
        strStartAdd: function(str,num,content){
            var len = str.length,
                content = content||'00000000000000000000000000000000000';
            if(len<num){
                str += content.substr(0,num-len)
            }
            return str
        }
    }
}());
function TemplateEngine(options) {
    //ie不支持NodeList.forEach,兼容处理
    if(!NodeList.prototype.forEach){
        NodeList.prototype.forEach = Array.prototype.forEach;
    }
    //dom元素处理
    function eleFn(dom,data) {

        if (dom.hasAttribute('bing')) {

            var obj = dom.getAttribute('bing');

            if (obj) {
                var attrObjFn = new Function(data.space||'data','var $index = '+(data.space||'data') + '.index;return' + obj),
                    attrObj = attrObjFn(data);
                for (var key in attrObj) {
                    if(key === 'html'){
                        dom.innerHTML = attrObj[key]
                    }else{
                        dom.setAttribute(key, attrObj[key])
                    }

                }
                dom.removeAttribute('bing')
            }
        }
        if (dom.childNodes) {
            dom.childNodes.forEach(function (item) {
                extract(item, data)
            })
        }
    }

    //处理数组循环
    function myForFn(dom){
        var space = dom.getAttribute('my-for').split(' in '),
            _arr = space[1].split('.');
        dom.removeAttribute('my-for');
        var data = optionsData,
            namedSpace = space[0];
        _arr.forEach(function(item){
            data = data[item]
        });

        if(common.isArray(data)){
            var domFm = document.createDocumentFragment();
            data.forEach(function (item, index) {
                item.index = index;
                item.space = namedSpace;
                var domCopy = dom.cloneNode(true);
                domFm.appendChild(extract(domCopy, item))
            });
            return domFm;
        }
    }

    //处理变量
    function dealVariable(text, data) {
        return text.replace(/{([\s\S]*)}/gi, function (match, $1) {
            var result = new Function(data.space||'data', 'var $index = '+(data.space||'data')+'.index;return ' + $1);
            return result(data)
        });
    }

    function extract(dom,data) {
        switch (dom.nodeType) {
            //如果是元素
            case 1:
                if(dom.hasAttribute('my-for')){
                    var result = myForFn(dom);
                    if(dom.parentNode){
                        dom.parentNode.replaceChild(result,dom);
                    }else{
                        dom = result
                    }
                }else{
                    eleFn(dom,data||optionsData.data);
                }
                break;
            //如果是文本
            case 3:
                dom.nodeValue = dealVariable(dom.nodeValue, data);
                break;
            default:
                console.log(dom.nodeType);
                break;
        }
        return dom

    }
    //判断是否有数据
    function isEmpty(data){
        if(common.isArray(data)){
            return data.length > 0
        }else if(typeof data === 'object'){
            return data !== null&&data !== {}
        }else{
            return false
        }

    }

    var optionsData = common.clone(options);
    var test = document.createElement('div');
    test.innerHTML = document.getElementById(options.id).innerHTML;

    this.template = test.firstElementChild.cloneNode(true);
    this.getTemplateNode = function () {
        return document.getElementById(options.id)
    };
    this.render = function () {
        var template = this.template,
            templateNode = this.getTemplateNode(),
            content = document.getElementById('js_main'),
            div = document.createElement('div');
        if(content){
            content.parentNode.removeChild(content);
        }
        div.setAttribute('id','js_main');
        if(isEmpty(optionsData.data)){
            div.appendChild(extract(template));
            templateNode.parentNode.appendChild(div);
        }else{
            div.setAttribute('style','font-size:20px;text-align:center');
            var text=document.createTextNode("暂无数据");
            div.appendChild(text);
            templateNode.parentNode.appendChild(div);
        }
    };
}
//分页
function Page(options){
    function pageListHtml(page){
        var data,focus,_arr=[],arr=pageNumArr(pageTotal);
        if(page>0&&page<=pageTotal){
            page = parseInt(page);
            if(page<=5){
                data = arr.slice(0,11);
                focus = page-1;
            }else if(page>5&&page<pageTotal-5){
                data = arr.slice(page-5,page+5);
                focus = 4;
            }else if(page>=pageTotal-5&&page<=pageTotal){
                data = arr.slice(-11);
                focus = data.length >11?10:(data.length-1) - (pageTotal - page);
            }
        } else{
            throw 'page is not number or too much or too small'
        }
        data.forEach(function(item,index){
            var str;
            if(index === focus){
                str = '<span class="page-num page-focus">'+item+'</span>'
            }else{
                str = '<span class="page-num">'+item+'</span>'
            }
            _arr.push(str)
        });
        return _arr.join('')
    }
    function render(page){
        var pageDom = document.getElementById(pageOption.id);
        if(pageTotal){
            pageDom.innerHTML = '<div id="js_page_event" class="page"><span class="page-up">上一页</span> '+ pageListHtml(page) +
                '<span class="page-down">下一页</span> <span class="page-total">共'+pageTotal+'页</span> </div>';
            own.onclick();
        }else{
            console.warn('共0页')
        }

    }

    function pageNumArr(){
        var arr = [],
            i = 1;
        while (i <= pageTotal){
            arr.push(i);
            i++
        }
        return arr
    }

    //获取当前页码
    this.getPage = function(){
        return pageNum
    };
    //设置页码
    this.setPage = function(newPage){
        pageOption.page = newPage
    };
    //上一页
    this.pageUp = function(){
        if(pageNum > 1){
            pageOption.page -= 1
        }else{
            console.warn('已经是首页了')
        }

    };
    //下一页
    this.pageDown = function(){
        if(pageNum < pageTotal){
            pageOption.page += 1
        }else{
            console.info('已经是尾页了')
        }
    };
    //跳到首页
    this.toFirstPage = function(){
        pageOption.page = 1
    };
    //跳到尾页
    this.toLatePage = function () {
        pageOption.page = pageTotal;
    };
    //获取页码上一级dom
    this.ele = function(){
        return document.getElementById(pageOption.id).firstElementChild
    };
    //页码点击事件
    this.onclick = function(fn){
        function callback(e) {
            var tag = e.target;
            switch (tag.className){
                case 'page-num':
                    own.setPage(tag.innerText);
                    break;
                case 'page-up':
                    own.pageUp();
                    break;
                case 'page-down':
                    own.pageDown();
                    break;
            }
        }
        own.ele().addEventListener('click',fn||callback)
    };
    var changeFn;
    this.change = function(fn){
        fn = fn||changeFn;
        fn(this.getPage());
        changeFn = fn;
    };
    var pageOption = common.clone(options),
        pageNum = pageOption.page,
        pageTotal = Math.ceil(pageOption.count/(pageOption.limit||10)),
        own = this;

    Object.defineProperty(pageOption, 'page', {
        get:function(){
            return pageNum
        },
        set:function(newValue){
            if(pageNum !== newValue){
                pageNum = newValue;
                render(pageNum);
                own.change()
            }else{
                console.info('没有改变')
            }
        }
    });

    render(pageNum);
}