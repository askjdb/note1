let a=[1,2,3,4,{
    value:'woc'
}]

//数组浅拷贝
function Arr(arr){
    return arr.map(item=>item)
}
function Arr1(arr){
    return [].concat(arr)
}

let b={
    var:1,
    value:2
}
//对象浅拷贝
function Obj(obj){
    return Object.assign({},obj)
}
function Obj2(obj){
    const {...a}=obj
    return a
}