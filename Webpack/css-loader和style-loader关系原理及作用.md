# css-loader和style-loader关系原理及作用

用webpack打包就需要用到css-loader和style-loader，接下来让我们逐步解析两个loader的作用以及它们都做了怎样的工作

#### 创建空项目

-  创建一个名为demo的空文件夹，这就是我们实验的项目目录
-  进入到目录下执行`npm init -y`

按照上述两步，我们就搭建好了最简单的项目环境了，接下来需要安装依赖包和创建源码目录

-  在项目目录创建`src`子目录
-  基于webpack4讲解，运行npm安装所需依赖

```bash
bash
复制代码npm i webpack@webpack-4 webpack-dev-server@version-3 webpack-cli@4 css-loader@5 style-loader@2 html-webpack-plugin@webpack-4 -D
```

#### 创建`webpack.cofnig.js`

```js
js复制代码const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    module: {
        rules: [
            {
                test: /.css$/,
                use: [
                    'css-loader'
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin()
    ]
}
```

#### 创建一个`src/public.css`样式文件

```css
css复制代码.rect{
    background-color: red;
    width: 100px;
    height: 100px;
}
```

#### 创建`src/index.js`程序入口文件

```js
js复制代码import './public.css';

let div = document.createElement("div");
div.className = "rect";
div.innerText = "hello div";
document.getElementsByTagName("body")[0].appendChild(div);
```

#### 运行

```bash
bash
复制代码webpack server
```

打开浏览器[`http://localhost:8080`](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A8080)，显示内容如下：

![运行结果1](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b3385946c4a34c4cb1b1be196413ff3b~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

> 我们点击浏览器查看源码，发现样式内容并没有应用到div上面，原因是css-loader只是帮我们解析了css文件里面的代码，默认webpack是只解析js代码的，所以想要应用样式我们要把解析完的css代码拿出来加入到style标签中。

#### 更改`src/index.js`

```js
js复制代码// 打印到浏览器控制台，看一下导入的css文件究竟是什么
import css from './public.css';

console.log(css);
```

#### 重新运行

> 我们发现原来获取的css竟然是一个js对象，这就是css-loader帮助我们编译时进行的转换工作

![运行结果2](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e1b82d0fd8c34821a1bf0c39c56483e1~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

#### 继续更改`src/index.js`代码

```js
js复制代码// 这次我们将css-loader解析的js对象中的css样式挂载到head的style标签中
import css from './public.css';

let div = document.createElement("div");
div.className = "rect";
div.innerText = "hello div";

let body = document.getElementsByTagName("body")[0];

let style = document.createElement("style");
style.innerText = css[0][1];

body.appendChild(style);
body.appendChild(div);
```

### 运行查看

![运行结果3](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ee3d198497564eb3bc00ddda40f62af4~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

> 我们发现style的样式被成功应用到div上面了，这是我们手动挂载css-loader解析的内容到style标签下，并且将style标签加入到html文档中，但是这样手动做很麻烦，所以就有了style-loader

#### 引入`style-loader`

如果你看懂我上面说的，那么你应该已经猜测到了style-loader作用了，style-loader就是帮我们直接将css-loader解析后的内容挂载到html页面当中，我们来看一下

#### 修改`webpack.cofnig.js`配置

```diff
diff复制代码const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    module: {
        rules: [
            {
                test: /.css$/,
                use: [
+                   'style-loader',
                    'css-loader'
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin()
    ]
}
```

#### 继续更改`src/index.js`代码

> 去掉手动挂载样式

```js
js复制代码import './public.css';

let div = document.createElement("div");
div.className = "rect";
div.innerText = "hello div";
document.getElementsByTagName("body")[0].appendChild(div);
```

### 运行结果

> 我们发现和之前的手动挂载一样

![运行结果4](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ee3d198497564eb3bc00ddda40f62af4~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

## 总结

-  css-loader帮助我们解析css成为js对象
-  sytle-loader可以从css-loader解析的对象中提取css样式挂载到页面当中



css-loader编译后的css代码模块默认default是有内容导出是一个数组对象，但是你加入style-loader以后那么他编译出的模块是没有导出这个对象的，但是它基于css-loader导出的对象做了样式挂载，style-loader也是有导出的不过它导出的逻辑是，(有没有css-loader导出的对象 && 对象中有没有local属性 ? 如果有导出local属性内容 : 没有导出undefined)，你如果没给css做模块化配置默认是undefined，这个local属性就是给css-loader配置模块化以后产生的属性，但是你js代码里面导出的也不是css-loader的完整对象，style-loader只给了你模块化对象就是local属性的内容，有这个经过hash的混淆class类，就可以做样式隔离了，不过前提是你要为css-loader配置模块化支持，手动配置webpack过于麻烦，我推荐你个webpack零配置方案，[![img](https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/3f843e8626a3844c624fb596dddd9674.svg)github.com](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2FSystemLight%2Fwebpack-config%2Ftree%2Fmaster%2Fpackages%2Fwebpack-config)，如果感兴趣可以看看里面的css模块化是如何实现的，我认为你想做的就是css模块化，不然style-loader都帮助你挂载了你也没必要获取css-loader提供的对象了，css-loader提供的对象也没有什么高度解析。