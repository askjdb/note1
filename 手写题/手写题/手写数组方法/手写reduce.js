Array.prototype.MyReduce=function (callback,initValue){
    let res=initValue;
    for(let i=0;i<this.length;i++){
        res=callback(this[i],res)
    }
    return res;
}

let a=[1,2,3,4,5]
console.log(a.MyReduce((item,lastItem)=>{
    return item + lastItem
},0));