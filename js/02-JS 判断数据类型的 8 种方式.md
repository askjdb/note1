## 1、typeof

- 只能识别基础类型和引用类型

注意：`null`、 `NaN`、 `document.all` 的判断

```js
console.log(typeof null); // object
console.log(typeof NaN); // number
console.log(typeof document.all); // undefined
复制代码
```

------

## 2、constructor

- `constructor` 指向创建该实例对象的构造函数

注意 `null` 和 `undefined` 没有 `constructor`，以及 `constructor` 可以被改写

```js
String.prototype.constructor = function fn() {
  return {};
};

console.log("云牧".constructor); // [Function: fn]
复制代码
```

------

## 3、instanceof

- 语法：`obj instanceof Type`
- 功能：判断 `obj` 是不是 `Type` 类的实例，只可用来判断引用数据
- 实现思路： `Type` 的原型对象是否是 `obj` 的原型链上的某个对象
- 注意：右操作数必须是函数或者 class

手写 `instanceof`：

```js
function myInstanceof(Fn, obj) {
  // 获取该函数显示原型
  const prototype = Fn.prototype;
  // 获取obj的隐式原型
  let proto = obj.__proto__;
  // 遍历原型链
  while (proto) {
    // 检测原型是否相等
    if (proto === prototype) {
      return true;
    }
    // 如果不等于则继续往深处查找
    proto = proto.__proto__;
  }
  return false;
}
复制代码
```

------

## 4、isPrototypeof

- 是否在实例对象的原型链上
- 功能基本等同于 `instanceof`

```js
console.log(Object.isPrototypeOf({})); // false
console.log(Object.prototype.isPrototypeOf({})); // true  期望左操作数是一个原型，{} 原型链能找到 Object.prototype
复制代码
```

------

## 5、Object.prototype.toString

- 利用函数动态 this 的特性

```js
function typeOf(data) {
  return Object.prototype.toString.call(data).slice(8, -1);
}

// 测试
console.log(typeOf(1)); // Number
console.log(typeOf("1")); // String
console.log(typeOf(true)); // Boolean
console.log(typeOf(null)); // Null
console.log(typeOf(undefined)); // Undefined
console.log(typeOf(Symbol(1))); // Symbol
console.log(typeOf({})); // Object
console.log(typeOf([])); // Array
console.log(typeOf(function () {})); // Function
console.log(typeOf(new Date())); // Date
console.log(typeOf(new RegExp())); // RegExp
复制代码
```

------

## 6、鸭子类型检测

- 检查自身属性的类型或者执行结果的类型
- 通常作为候选方案
- 例子：`kindof` 与 `p-is-promise` 库

p-is-promise：

```js
const isObject = value =>
  value !== null && (typeof value === "object" || typeof value === "function");

export default function isPromise(value) {
  return (
    value instanceof Promise ||
    (isObject(value) && typeof value.then === "function" && typeof value.catch === "function")
  );
}
复制代码
```

kindof：

```js
function kindof(obj) {
  var type;
  if (obj === undefined) return "undefined";
  if (obj === null) return "null";

  switch ((type = typeof obj)) {
    case "object":
      switch (Object.prototype.toString.call(obj)) {
        case "[object RegExp]":
          return "regexp";
        case "[object Date]":
          return "date";
        case "[object Array]":
          return "array";
      }

    default:
      return type;
  }
}
复制代码
```

------

## 7、Symbol.toStringTag

- 原理：`Object.prototype.toString` 会读取该值
- 适用场景：需自定义类型
- 注意事项：兼容性

```js
class MyArray {
  get [Symbol.toStringTag]() {
    return "MyArray";
  }
}

const arr = new MyArray();
console.log(Object.prototype.toString.call(arr)); // [object MyArray]
复制代码
```

------

## 8、等比较

- 原理：与某个固定值进行比较
- 适用场景：`undefined`、 `window`、 `document`、 `null` 等

underscore.js：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d329bc51315a419082fc0bfe75f62390~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

`void 0` 始终返回 `undefined`，`void` 后面接任意值都是返回 `undefined`， 这是为了兼容 IE，因为在 IE 中 `undefined` 值可以被改写

## 总结

| 方法                | 基础数据类型 | 引用类型 | 注意事项                      |
| ------------------- | ------------ | -------- | ----------------------------- |
| typeof              | √            | ×        | NaN、object、document.all     |
| constructor         | √ 部分       | √        | 可以被改写                    |
| instanceof          | ×            | √        | 多窗口，右边构造函数或者class |
| isPrototypeof       | ×            | √        | 小心 null 和 undefined        |
| toString            | √            | √        | 小心内置原型                  |
| 鸭子类型            | -            | √        | 不得已兼容                    |
| Symbol.toString Tag | ×            | √        | 识别自定义对象                |
| 等比较              | √            | √        | 特殊对象                      |

## 加餐：ES6 增强的 NaN

### NaN 和 Number.NaN 特点

1. `typeof` 判断类型是数字
2. 自己不等于自己

### isNaN

- 如果非数字，隐式转换传入结果如果是 `NaN`，就返回 `true`，反之返回 `false`

```js
console.log(isNaN(NaN)); // true
console.log(isNaN({})); // true
复制代码
```

### Number.isNaN

- 判断一个值是否是数字，并且值是否等于 `NaN`

```js
console.log(Number.isNaN(NaN)); // true
console.log(Number.isNaN({})); // false
复制代码
```

综合垫片（如果不支持 `Number.isNaN` 的话）

```js
if (!("isNaN" in Number)) {
  Number.isNaN = function (val) {
    return typeof val === "number" && isNaN(val);
  };
}
复制代码
```

------

### indexOf 和 includes

- `indexOf` 不可查找 `NaN`，`includes` 则可以

```js
const arr = [NaN];

console.log(arr.indexOf(NaN)); // -1
console.log(arr.includes(NaN)); // true
```

