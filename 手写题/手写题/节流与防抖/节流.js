

//节流是控制高频触发的事件的触发次数
function throttle(fn,delay,...args){
    let flag=true;
    return function(...args){
        if (flag){
            setTimeout(()=>{
                fn.call(this,...args)
                flag=true
            },delay)
        }
        flag=false
    }
}
