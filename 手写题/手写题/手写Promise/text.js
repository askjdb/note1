


b=new Promise((resolve,reject)=>{
    console.log(this);
    resolve(1)
})
const a= Promise.all([
    b,
    1,
    2
])
