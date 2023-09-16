# ESM(ESModule)和CJS(CommonJS)的区别

### 壹（序）

`ES6`之前，JS一直没有自己的`模块体系`，这一点对于大型项目的开发很不友好，所以社区出现了`CommonJS`和`AMD`（本人不熟悉），`CommonJS`主要是用于`服务器（Node`），`AMD`主要是用于`浏览器`。

但是ES6引入了`ESM`，到此，JS终于有了自己的`模块体系`，基本上可以`完全取代`CJS和AMD。

下面简单总结一下`ESM`以及`ESM和CJS的区别`。

### 贰（ESM使用）

ESM是`ESModule`，是`ECMAScript`自己的模块体系，于ES6引入，主要使用如下：

```javascript
// 导出：export命令
export const obj = {name: 'E1e'}；

// 默认导出 export default命令
export default {name: 'E1e'};


// 引入接口：import命令

// 引入普通导出
import { obj } from './test.js';

// 引入默认导出
import obj from './test.js';
```

### 叁（CJS使用）

CJS`CommonJS`，主要用于服务器端，主要使用如下：

```ini
// 导出
const obj = {a: 1};
module.exports = obj;

// 引入
const obj = require('./test.js');
```

### 肆（区别）

1. 使用方式不同（以上）；
2. ESM输出的是`值的引用`，而CJS输出的是`值的拷贝`； ESM:

```javascript
// a.mjs(Node环境中进行测试，必须修改后缀名为mjs，这是Node的强制规定)
export let age = 18;

export function addAge() {
  age++;
}

// b.mjs
import { age, addAge } from "./a.mjs";

addAge();

console.log(age); // 19
```

CJS:

```javascript
// a.js(Node环境中进行测试，必须修改后缀名为mjs，这是Node的强制规定)
let age = 18;

module.exports = {
  age,
  addAge: function () {
    age++;
  },
};


// b.js
const { age, addAge } = require("./a.js");

addAge();

console.log(age); // 18
```

从上面的例子可以看出，ESM在调用方法修改模块中的值后，引用这个值的地方也随着改变；而CJS在调用方法后，并没有随着改变；就是因为CJS输出的是一个值的拷贝，而ESM输出的是值的引用；

由于ESM是输出值的引用，所以不允许在外部直接修改值（对象修改或新增属性除外），否则报错；

1. CJS的输出是`运行时加载`，而ESM是`编译时`输出接口；

```
因为CJS输出的是一个对象，该对象需要在脚本运行完成后才生成，而ESM的输出是静态的，在编译时就能生成。
```

1. CJS是`同步加载`，ESM是`异步加载`；

```
由于CJS是用于服务器端的模块体系，需要加载的模块都在本地，所以采用同步加载也不会出问题，但是ESM用于浏览器端时，可能涉及到一些异步请求，所以需要采用异步加载。
```



