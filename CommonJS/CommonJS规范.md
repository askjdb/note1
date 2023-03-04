### Commonjs规范

#### 1.1 commonjs规范说明

> 每一个js文件就是一个模块，文章中我说的模块可以等价为一个js文件

node应用由模块组成，采用的commonjs模块规范。**每一个js文件就是一个模块**，拥有自己独立的作用域，变量，以及方法等，对其他的模块都不可见。

CommonJS规范规定，每个模块内部，`module`变量代表当前模块。这个变量是一个对象，它的`exports`属性（即`module.exports`）是对外的接口。加载某个模块，其实是加载该模块的`module.exports`属性。`require`方法用于加载模块。

- 在服务器端：模块的加载和运行是同步的，意味着可能导致堵塞，速度慢
- 在浏览器端：浏览器看不懂这种规范，服务器需要将模块编译打包，再发给浏览器

#### 1.2 基本语法

关于模块的语法主要就是暴露模块和引入模块

##### 1.21暴露模块

上面我们说了，每个模块对默认有一个module变量，这个变量代表当前模块；这个变量有exports属性

```js
console.log(JSON.stringify(module)); // {exports,......}
console.log(typeof module);  // object
console.log(typeof module.exports) // object
```

我们可以打开vs code，输入以上代码，运行；可以验证存在module对象和exports属性；且**exports属性也指向一个对象**

exports对象会向外暴露，所以暴露模块使用 `module.exports`

每个js文件除了有一个默认的module变量，还有一个默认的`exports`变量，这个变量指向`module.exports`属性，所以也可以直接使用`exports.x`暴露模块

```js
// example.js
var x = 5;
var add = function (x=0,y=0) {
  return x+y;
};
exports.x = x; // 就相当于module.exports.x = x;
module.exports.add = add;
```

##### 1.22引入模块

`module.exports`属性表示当前模块对外输出的接口，**其他文件加载该模块，实际上就是读取`module.exports`变量**

```js
// ex2.js
var example = require('./example.js');

console.log(example.x); // 5
console.log(example.add(5,6)); // 11
```

`require`函数相当于直接把`example.js`这个模块当中`module.exports`对象加载进来，然后返回这个对象，赋值给example变量

第三方的模块不需要写路径，直接写名字即可:

```js
var path = require('path')
```

#### 1.3问题

如果我们创建一个html文件，引入这个js文件

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Commonjs规范</title>
</head>
<body>
    <script src="./ex2.js"></script>
</body>
</html>
```

会报错`Uncaught ReferenceError: require is not defined`，因为浏览器不理解这种规范

### 总结

- 每个js文件都默认有一个`module`变量，该变量指向一个对象，这个对象有一个属性叫`exports`
- 每个js文件都默认有一个`exports`变量，这个变量指向`module.exports`对象
- `require`实际上就是加载别的js文件的`module.exports`对象进来，返回这个对象，然后我们接受这个对象去使用
- `require`加载自己写的模块时加路径，加载第三方模块时，可以直接使用名字
- 浏览器不理解Commonjs规范，需要在服务器端使用工具进行处理，才可以在浏览器中运行