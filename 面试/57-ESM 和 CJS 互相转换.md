# ESM 和 CJS 互相转换

ESM 和 CJS 是我们常用的模块格式，两种模块系统具有不同的语法和加载机制。在项目中，我们可能会遇到 ESM 和 CJS 转换的场景：

- ESM 引入只支持 CJS 的库
- 开发 npm 库的时候，写 ESM 然后编译成 CJS。
- ……

最近在项目中也刚好遇到的转换上的一些问题，于是就研究了一下

本文将介绍 ESM 和 CJS 之间转换，帮助大家加深对它们的了解，并从中了解它们之间转换的细节与局限性

# ESM 转 CJS

ESM 转 CJS 的使用场景非常常见，例如：

- **npm 库**，需要同时提供 ESM 和 CJS，供开发者自行选择使用。一般是用 ESM 开发，然后同时输出 ESM 和 CJS
- **使用 ESM 进行开发**，但最后由于兼容性、性能等原因，**编译成 CJS 在线上运行**。例如：利用 Vite、webpack 等构建工具进行开发 开发

各大工具，如 TSC、Babel、Vite、webpack、Rollup 等，都自带了 ESM 转 CJS 的能力。

## export 的转换

- 情况一，**只有默认导出**：

```js
码export default 666
```

Rollup 会转换成

```js
modules.exports = 666
```

很好理解，**`modules.exports` 导出的整个东西就是默认导出**嘛

用 CJS 引用该模块的方式：

```js
const lib = require('lib')
console.log(lib)
// 666
```

- 情况二，**只有命名导出**：

```js
export const a = 123
export const b = 234
```

转换成

```js
module.exports.a = 123
module.exports.b = 234
```

**命名导出用 `module.exports.xxx` 一个个导出就行**

用 CJS 引用该模块的方式：

```js
const {a, b} = require('lib')
console.log(a, b)
// 123 234
```

- 情况三：**默认导出和命名导出同时存在**

```js
export default 666
export const a = 123
export const b = 234
```

这时候会发现，**前面两种情况的转换思路不能用了**，你不能这样转换

```js
modules.exports = 666
module.exports.a = 123
module.exports.b = 234
```

毕竟 `modules.exports` 不是对象，因此设置不了属性。

那莫得办法了，只能这样表示了：

- **`module.exports.default` 为默认导出**
- **`module.exports.xxx` 其他为命名导出**

为了跟前两种情况做区分，因此还要**新增一个标记`__esModule`**

于是就会编译成这样的代码：

```diff
+ Object.defineProperty(exports, '__esModule', { value: true })
+ module.exports.default = 666
- module.exports = 666
module.exports.a = 123
module.exports.b = 234
```

用 CJS 引用该模块的方式：

```js
const lib = require('lib')
console.log(lib.default, lib.a, lib.b)
// 666 123 234
```

在这种情况下，**必须要用 `.default` 访问默认导出**

但这样子看起来非常的别扭，但是没有办法，混用默认导出和命名导出是有代价的。

> 为什么我们项目中，从来就遇到过该问题？

一般情况下，我们使用 ESM 写项目，然后编译成 CJS

假如，我们写的代码引用了上述的代码（默认导出和命名导出混用）:

```js
// foo.js
import lib from 'lib'
import {a, b} from 'lib'
console.log(lib, a, b)
```

这段代码，会被转换成：

```js
'use strict';
var lib = require('lib');
function _interopDefault (e) { 
  return e && e.__esModule ? e : { default: e }; 
}
var lib__default = /*#__PURE__*/_interopDefault(lib);
console.log(lib__default.default, lib.a, lib.b);
```

`_interopDefault` 函数会自动根据 `__esModule`，将导出对象**标准化**，**使 `.default` 一定为默认导出**

- 如果有 `__esModule`，那就不用处理
- 没有  `__esModule`，就将其放到 `default` 属性中，作为默认导出

![image-20230301204326169](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/05e14c1f952743b187812bd20870a9ce~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

工具在转译 `lib.js` 的同时，也会转译引入它的 `foo.js`，**会加上标准化 `require` 对象的逻辑**。

我们的项目，在编译的时候，**全部 ESM 模块都转为 CJS**（不是只转换一个，不转另外一个） ，在这个过程中它**自动屏蔽了模块默认导出的差异**，由于编译工具已经帮我们处理好，因此我们没有任何感知。

如果我们**直接写 CJS**，去引入 ESM 转换后的 CJS，就需要自行处理该问题

要想尽量避免这种情况，建议**全部都使用命名导出**，由于没有默认导出，就不需要担心默认导出是 `module.exports` 还是 `module.exports.default`，都用以下方式进行引入即可：

```js
const {a, b} = require('lib')
```

这样开发者在任何情况下都没有心智负担。

## import 的转换

其实上一小节已经讲了

```js
import lib from 'lib'
import {a, b} from 'lib'
console.log(lib, a, b)
```

会被转换成

```js
'use strict';
var lib = require('lib');
function _interopDefault (e) { 
  return e && e.__esModule ? e : { default: e }; 
}
var lib__default = /*#__PURE__*/_interopDefault(lib);
console.log(lib__default.default, lib.a, lib.b);
```

加上 `_interopDefault`，**屏蔽了不同情况下默认导出的差异**，因此如果所有代码都是从 ESM 转 CJS，就不用担心默认导出的差异问题。

## 小结

其实 ESM 转 CJS，**不同的工具的输出会稍微有些不同**。以上是 Rollup 的的转换方式，个人认为这种更为简洁，而 TSC 的转换则更复杂。

不过这些工具的思路都是相同的，**都遵守 `__esModule` 的约定**，标记 `__esModule` 的模块默认导出是 `.default`

> ESM 转 CJS 有哪些局限性？

存在以下情况可能无法进行转换：

- 存在循环依赖
- import.meta，这个特性只能在 ESM 中使用

# CJS 转 ESM

CJS 转 ESM 的场景不多，一般不会用 CJS 写 npm 库然后输出 ESM；用 CJS 写的库，当时不会输出 ESM。新写的 npm 库，一般来说也是用 ESM 写。

因此一般**只有写 ESM 项目，引入了一个只有 CJS 的库时，且编译出 ESM 时**，才会用到 CJS 转 ESM。

> 为什么我们用 webpack 写 ESM，然后引入 CJS 的时候，基本上没遇到什么问题？

要运行 ESM 引入 CJS 的代码，有两种方式：

- 把 ESM 转 CJS，然后运行 CJS
- 把 CJS 转成 ESM，然后运行 ESM

因为 webpack 是前者，ESM 转 CJS 能够很好地进行转换。

CJS 转 ESM，**没有一种统一的转换标准**（相对来说，ESM 转 CJS 有 `__esModule` 约定），不同的工具和库，可能转换出来的结果是不一样的，可能**会导致代码不兼容**。

## export 的转换

场景一：

```js
module.exports = {
    a: 3,
    b: 4
}
```

Rollup 会转换成

```js
var lib = {
    a: 3,
    b: 4
};

export { lib as default };
```

**`module.exports` 会被当做默认导出**

而 esbuild 会这样转换

```js
var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_lib = __commonJS({
  "src/cjs/lib.js"(exports, module) {
    module.exports = {
      a: 3,
      b: 4
    };
  }
});
export default require_lib();
```

esbuild 会给**代码包一层辅助函数**，然后**将代码搬过去就好了**。好处是，这样编译工具就**不需要考虑代码的真正意义**，直接简单包一层即可

这种情况下，虽然 Rollup 和 esbuild 转换的代码不太相同，但代码的**运行结果是相同**的

场景二：

```js
js
复制代码exports.c =123
```

Rollup 会转换成：

```js
var lib = {};
var c = lib.c =123;
export { c, lib as default };
```

**Rollup 会转换成默认导出和命名导出。**

esbuild 则转换成：

```js
var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_lib = __commonJS({
  "src/cjs/lib.js"(exports) {
    exports.d = 666;
  }
});
export default require_lib();
```

仍然是包一层辅助函数，但 **esbuild 全部都当做默认导出**

在这种情况下，Rollup 和 esbuild 转换的代码，**其运行结果是不同的**

场景三：

```js
exports.d = 123
module.exports = {
    a: 3,
    b: 4
}
exports.c =123
```

`exports.d = 123` 其实是无效的

Rollup 会编译成这样：

```js
var libExports = {};
var lib$1 = {
  get exports(){ return libExports; },
  set exports(v){ libExports = v; },
};

(function (module, exports) {
	exports.d =123;
	module.exports = {
	    a: 3,
	    b: 4
	};
	exports.c =123;
} (lib$1, libExports));

var lib = libExports;

export { lib as default };
```

此时 Rollup 也会加上一层辅助函数

而 esbuild 仍然是加一层辅助函数

```js
var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_lib = __commonJS({
  "src/cjs/lib.js"(exports, module) {
    exports.d = 666;
    module.exports = {
      a: 3,
      b: 4
    };
    exports.c = 666;
  }
});
export default require_lib();
```

辅助函数的好处之前也说了，**不需要关注代码逻辑**，可以看到，即使 ` exports.d = 666;` 是一行无效语句，照样执行也是没有问题的，**不需要先分析出代码的语义**。

总体对比下来，`esbuild` 的处理还是相对简单的

## require 的转换

```js
const lib = require('./lib')
const {c} = require('./lib')
console.info(lib,c)
```

Rollup 转换成：

```js
import require$$0 from './lib';
const lib = require$$0;
const {c} = require$$0;
console.info(lib,c);
```

require 的转换比较简单，不管你解不解构，反正我就只有默认引入

而 esbuild。。。还不支持，干脆就报错了

![image-20230302213815451](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a1e24a8d2a1f4dd69bfd8127b0185dfd~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

## 小结

> 为什么工具的转换结果是不同的？

CJS 转换成 ESM 是**有歧义的**

```js
module.export.a = 123
module.export.b = 345
```

等价于

```js
module.export = {
    a: 123,
    b: 345,
}
```

那么它是默认导出，还是命名导出呢？都行

本质上，是因为 **CJS 只有一个导出方式，不确定它对应的是 ESM 的命名导出还是默认导出**。

用一个形象点的例子就是，女朋友回了一句哦，但是你不知道女朋友是想说肯定的意思，还是表示无语的意思、还是其他别的意思。。。

对于 require

```js
const {c} = require('./lib')
```

你说这个是默认导入呢？还是命名导入？好像也都行。。。

正是由于这个歧义，且**没有一个标准去规范这个转换行为**，因此不同工具的转换结果是不同的

> CJS 转换成 ESM 有哪些局限性？

- 不同工具的转换结果不同
- CJS 模块可以使用 `require.resolve` 方法查找模块的路径，而 ESM 模块不可以
- CJS 模块可以导入和导出非 JavaScript 文件，例如 JSON
- CJS 在运行时导入导出，支持运行时改变导入导出的内容，以下代码是合法的：

```js
module.exports.a = 123
if( Date.now() % 2){
    module.exports.b = 234
}
```

由于没有统一的标准，CJS 转 ESM 的工具，相对来说少了很多，目前**仅有少量工具能够进行转换**，`esbuild`、`babel-plugin-transform-commonjs`、`@rollup/commonjs`。

有时候 Vite 使用一些 CJS 包不兼容，也是因为有些 CJS 转不了 ESM。但幸运的是，目前大部分常见的 npm 包，都已经支持 ESM，或者能够比较好的被转换成 ESM，因此也不需要太担心 Vite 的问题。