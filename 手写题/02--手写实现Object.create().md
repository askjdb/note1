# Objct.creacte()

```js
Object.prototype.Mycreate=function (p){
    if(typeof p !=='object' ||p===null ){
        throw new Error('传入的参数不是对象或传入参数为空')
    }
    function F(){}
    F.prototype=p
    return new F();
}
var Person = {
    name:"xixixi",
    age:18
}

var p = Object.Mycreate(Person);
console.log(p.name)//xixixi
console.log(Person.isPrototypeOf(p))//true
```

