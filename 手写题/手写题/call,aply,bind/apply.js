Function.prototype.Myapply=function(context,arr){
    context=context? context:window
    const x=Symbol()
    context[x]=this;
    context[x](arr);
    delete context[x];
}