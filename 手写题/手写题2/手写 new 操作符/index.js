function Mynew(func,...args){
    let x={}
    let  result=func.call(x,...args)
    if(result!==null && typeof result ==='object'){
        return result;
    }
    x.__proto__=func.prototype;
    return x
}


function a(value){
    this.x=value
}
let b=Mynew(a,1)
console.log(b);