/**
 * Created by cl on 2017/5/16.
 */
var filter = (function(){
    var body = document.body;
    var walker = document.createTreeWalker(body,NodeFilter.SHOW_TEXT|NodeFilter.SHOW_ATTRIBUTE,null,false);
    var node = walker.nextNode();
    var filter={
        a:function(str){
            return '￥' + str
        }
    };
    var data = {
        time:new Date()
    };
    window.addEventListener('load',function(){
        while(node !== null){
            console.log(node.nodeValue);
            if(/^(\${)[\s\S]*}$/g.test(node.nodeValue)){
                var arr = node.nodeValue.replace(/[\${}]/g,'').split('|');
                console.log(arr);

                if(typeof filter[arr[1]] === 'function'){
                    node.nodeValue = filter[arr[1]](data[arr[0]]);
                }
            }

            node = walker.nextNode()
        }
    });

    return function(key,fn){
        filter[key] = fn
    }
}());



filter('date',function(time){

    return time.getTime()
});
