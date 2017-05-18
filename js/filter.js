/**
 * Created by cl on 2017/5/16.
 */
var filter = (function(){
    var body = document.body;
    var walker = document.createTreeWalker(body,NodeFilter.SHOW_TEXT|NodeFilter.SHOW_ATTRIBUTE,null,false);
    var node = walker.nextNode();
    var filter={
        a:function(str,icon){
            return icon + str
        },
        b:function(str){
            console.log('b');
            return str + '*'
        },
        c:function(str){
            console.log('c');
            return str + '@'
        }
    };
    var data = {};
    function filterFn(fn,arg){
        return filter[fn].apply(filter,arg)
    }
    function assignment(arr){
        var content = arr.shift();

        arr.forEach(function(items){

            var _arr = items.split(':');
            var _fn = _arr.shift();

            _arr.unshift(content);

            _arr = _arr.map(function(item){

                return data[item] || item

            });
            content = filterFn(_fn,_arr);

        });
        return content
    }
    window.addEventListener('load',function(){
        while(node !== null){
            console.log(node.nodeValue);
            if(/^(\${)[\s\S]*}$/g.test(node.nodeValue)){
                var arr = node.nodeValue.replace(/[\${}]/g,'').split('|');
                console.log(arr);

                node.nodeValue = assignment(arr)

            }
            node = walker.nextNode()
        }
    });

    return {
        filter:function(key,fn){
            filter[key] = fn
        },
        setData:function(key,variable){
            data[key] = variable
        }
    }
}());



filter.filter('date',function(time){

    return time.getTime()
});

filter.filter('toCase',function(str){
    return str.toLocaleUpperCase()
});
filter.setData('time',new Date);