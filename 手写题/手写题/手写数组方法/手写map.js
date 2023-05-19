Array.prototype.MyMap=function (callback){
    let res=[]
    for(let i=0;i<this.length;i++){
        res.push(callback(this[i],i))
    }
    return res;
}


let a=[1,2,3,4]
const b=a.MyMap((item,index)=>{
    console.log(index);
    return item+1
})
console.log(b);