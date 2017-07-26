# daily_demo
做一些自己技术栽相关的一些demo

#./js/filter.js

看到dom遍历方法时，想到angular、vue等框架都有filter，尝试的自己写一个
## 使用方法
    <div>${1111|fn1:arg1:arg2····|fn2|fn3}</div>
fn1、fn2等为filter函数使用如下方法定义

    filter.filter('toCase',function(str){
        return str.toLocaleUpperCase()
    })
filter(key,fn(arg1,arg2···))
key为过滤器名称
arg1为原始数据
arg2,arg3···为过滤器参数

    <div>${book|toCase}</div>
        //等同于
        <div>BOOK</div>

原始数据也可为js变量，如：

    <div>${time|date}</div>
    //time为变量在js中这样定义
    filter.setData('time',new Date);//time为当前时间

#./js/template.js
模版渲染引擎

###使用方法

####html
    <script type="text/template" id="js_template">
        <div class="science-title clearfix" my-for="li in data" bing="{id:li._id}">
            <i></i><p>{li.title}</p><span>{li.updatedDate}</span>
        </div>
    </script>
    
####js
data为数据

     var template = new TemplateEngine({
                    id:'js_template',
                    data:data
                });
                template.render();

