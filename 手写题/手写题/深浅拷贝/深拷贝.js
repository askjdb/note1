var $obj = {
    func: function () {
        console.log('this is function')
    },
    date: new Date(),	
    symbol: Symbol(),
    a: null,
    b: undefined,
    c: {
        a: 1
    },
    e: new RegExp('regexp'),
    f: new Error('error'),
    g:[1,2,3]
}
// $obj.c.d = $obj
function deepCopy (obj){
    if(obj === null) return null 
    if(typeof obj !== 'object') return obj;
    if(obj.constructor===Date) return new Date(obj); 
    if(obj.constructor === RegExp) return new RegExp(obj);
    if(obj.constructor===Error) return new Error(obj);
    var newObj = new obj.constructor ();  //保持继承链
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {   //不遍历其原型链上的属性
            var val = obj[key];
            newObj[key] = typeof val === 'object' ? deepCopy(val) : val; // 使用arguments.callee解除与函数名的耦合
        }
    }  
    return newObj;  
}

console.log(deepCopy($obj));