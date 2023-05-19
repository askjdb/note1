

function debounce(func,delay,...args){
    let timer=null;
    return ()=>{
        if(timer!==null){
            clearTimeout(timer)
        }
        timer=setTimeout(()=>{
            func.call(this,...args)
        },delay)
    }
}