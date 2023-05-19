function _MyNew(fn,...args){
    let o={}
    o.__proto__=fn.prototype;
    const mid=fn.apply(o,...args)
    if(mid &&(typeof mid==='object'||typeof mid==='function')){
        return mid
    }
    return o
}

function a(){
    this.name='a'
}
let b=_MyNew(a)
console.log(b);