/**
 * Created by cl on 2017/4/20.
 */
function isArray(value) {
    console.log(Object.prototype.toString.call(value));
    return Object.prototype.toString.call(value) === '[object Array]'
}
console.log(isArray([1,2]));