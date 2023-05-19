function Myinstanceof(obj,val){
    if(obj===null){
        return null;
    }
    if(obj.hasOwnProperty(val)){
        return obj[val]
    }else{
        return Myinstanceof(obj.__proto__,val)
    }
}

Function.prototype.a=1;
function b(){}
console.log(Myinstanceof(b,"a"));
