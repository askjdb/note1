let arr = [1, [2, [3, 4, 5]]];


//递归
function flatten(array){
    let result=[]
    a=Object.prototype.toString.call(array);
    if(a!=='[object Array]'){
        throw new Error('参数不是数组')
    }
    array.forEach((item)=>{
        if(Object.prototype.toString.call(item)==='[object Array]'){
            result=result.concat(flatten(item))
        }else{
            result.push(item)
        }
    })
    return result;
}

//使用reduce
function flatten2(array){
    return array.reduce((pre,cur)=>{
        return pre.concat(Array.isArray(cur)?flatten2(cur):cur)
    },[])
}

//使用扩展运算符
function flatten3(array){
    while(array.some((item)=>Array.isArray(item))){
        array=[].concat(...array)
    }
    return array
}

//split + toString 实现
function flatten4(array){
    return array.toString().split(',').map(i=>Number(i));
}

//使用flat
function flatten5(array){
    return array.flat(Infinity);
}


console.log(flatten4(arr));
// console.log([].concat(...arr));
// console.log(arr.flat(Infinity));