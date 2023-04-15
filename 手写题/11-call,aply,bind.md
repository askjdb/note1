## call

```js
Function.prototype.call1 = function () {
    // 初始化，获取传入的this对象和后续所有参数
    const [context, ...args] = [...arguments];
    // 在传入的对象上设置属性为待执行函数
    context.fn = this;
    // 执行函数
    const res = context.fn(args);
    // 删除属性
    delete context.fn;

    // 返回执行结果
    return res;
  };
```

## apply

```js
Function.prototype.apply1 = function (context, args) {
    // 给传入的对象添加属性，值为当前函数
    context.fn = this;

    // 判断第二个参数是否存在，不存在直接执行，否则拼接参数执行，并存储函数执行结果
    let res = !args ? context.fn() : context.fn(...args)

    // 删除新增属性
    delete context.fn;

    // 返回函数执行结果
    return res;
}

const obj = {
    value: 1,
};

function fn() {
    console.log(this.value); // 1

    return [...arguments]
}

console.log(fn.apply(obj, [1, 2])); // [1, 2]
```

## bind

```js
Function.prototype.myBind_3 = function() {
    let outContext = arguments[0] // 取上下文
    let outArgs = Array.from(arguments).slice(1) // 取外部入参
    const outThis = this // 存外部this
    let cb = function() {
        const isNew = typeof new.target !== 'undefined' // 判断函数是否被new过
        const inArgs = Array.from(arguments)// 取内部入参
        return outThis.apply(isNew ? this : outContext, outArgs.concat(inArgs)) // 改变指向，合并函数入参
    }
    cb.prototype = outThis.prototype // 继承构造函数原型
    return cb // 返回创建函数
}

试一下

var obj = {name:1,age:2}
var name = 'Leo', age = 18
function Fn(height, Gender) {
    console.log('name：', this.name, 'age:', this.age,'height:',height, 'Gender:',Gender)
}
Fn.prototype.say = function() {
    console.log('Fn.prototype.say')
}

var fn1 = Fn.myBind_3(obj, '80cm')
var obj1 = new fn1('male') // name： undefined age: undefined height: 80cm Gender: male
obj1.say() // Fn.prototype.say

var fn1 = Fn.bind(obj, '80cm')
var obj1 = new fn1('male') // name： undefined age: undefined height: 80cm Gender: male
obj1.say() // Fn.prototype.say
```

