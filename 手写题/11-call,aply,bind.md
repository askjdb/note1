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

## 关于链式 bind 的操作

在 JS 中可以利用 `.bind` 的方式重新指定 `this` 的指向，而[级联](https://so.csdn.net/so/search?q=级联&spm=1001.2101.3001.7020)（链式）的 `.bind` 并不会奏效，只会绑定第一个 bind 的 `this`。以下是一种 `.bind` 的实现：

```js
if (!Function.prototype.bind) {
  Function.prototype.bind = function(oThis) {
    if (typeof this !== 'function') {
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable')
    }
    var aArgs   = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP    = function() {},
        fBound  = function() {
          return fToBind.apply(
            this instanceof fNOP ? this : oThis,
            aArgs.concat(Array.prototype.slice.call(arguments))
          )
        }
    if (this.prototype) {
        fNOP.prototype = this.prototype; 
    }
    fBound.prototype = new fNOP()
    return fBound
  }
}

```

可以看到，若链式进行 `.bind` 操作，实际的代码会变为一层一层的 apply 嵌套，在此情况下，只有最内层的 apply this 会对原始函数奏效。

然而，`bind()` 函数本身不支持链式调用。当你调用 `bind()` 函数时，它将返回一个新的函数，而不是原始函数。
