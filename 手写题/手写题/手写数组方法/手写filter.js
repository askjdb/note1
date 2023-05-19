Array.prototype.Myfilter=function (callback){
    let res=[]
    for(let i=0;i<this.length;i++){
        if(callback(this[i])){
            res.push(this[i])
        }
    }
    return res
}



let a=[1,2,3,4,5,6]
let b=a.Myfilter((item)=>item%2===0)
console.log(b);