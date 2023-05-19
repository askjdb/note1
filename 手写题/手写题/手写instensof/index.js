function instance_of(cur,target){
    if (cur===null){
        return false
    }
    if(cur.__proto__===target.prototype){
        return true;
    }
    else{
       return instance_of(cur.__proto__,target)
    }
}



//测试
var a = []
var b = {}

function Foo(){}
var c = new Foo()
function child(){}
function father(){}
child.prototype = new father() 
var d = new child()

console.log(instance_of(a, Array)) // true
console.log(instance_of(b, Object)) // true
console.log(instance_of(b, Array)) // false
console.log(instance_of(a, Object)) // true
console.log(instance_of(c, Foo)) // true
console.log(instance_of(d, child)) // true
console.log(instance_of(d, father)) // true