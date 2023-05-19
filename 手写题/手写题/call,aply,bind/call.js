Function.prototype.MyCall=function(target){
    target=target?target:Window
    x=Symbol()
    target[x]=this
    target[x]()
    delete target[x]
}
var value=2
a={
    value:1
}
function x(){
    console.log(this);
    console.log(this.value);
}
x.MyCall()