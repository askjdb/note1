Function.prototype.myBind=function(context,...args){
    const outThis=this
    const woc=function(){
        const ifNew=new.target?true:false;
        const inText=Array.from(arguments)
        outThis.apply(ifNew?this:context,[...args,...inText])
    }
    woc.prototype=outThis.prototype
    return woc
}
