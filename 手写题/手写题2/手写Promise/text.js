const  MyPromise =require("./index") ;

new MyPromise((resolve,reject)=>{
    resolve(3)
}).then((val)=>{
    console.log(val);
},(reason)=>{
    console.log(reason);
})
// console.log(a);