# Webpack 高频面试题

# 1、简单说一下 webpack 的构建流程

webpack 的运行流程是一个串行的过程，从启动到结束会依次执行以下流程：

1. `初始化参数：`  从配置文件和shell 语句中读取与合并参数，得到最终的参数。
2. `开始编译：`  用上一步得到的参数初始化 Compiler 对象，加载所有配置的插件，执行 compiler 对象的 run 方法开始执行编译。
3. `确定入口：` 根据配置中的 entry 找出所有的入口文件。
4. `编译模块：` 从入口文件出发，调用所有配置的 Loader 对模块进行编译，找出该模块依赖的模块，再递归本步骤直到所有依赖文件都经过本步骤的处理。
5. 完成模块编译： 在经过第 4 步使用 Loader 编译完所有模块之后，得到每个模块被编译后的最终内容以及它们之间的依赖关系。
6. `输出资源：` 根据入口和模块之间的关系，组装成一个个包含多个模块的 chunk，再把每个 chunk 转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会。
7. `输出完成：` 在确定输出内容之后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统。

# 2、Loader 和 Plugin 的区别

`Loader` 本质就是一个函数，在该函数对接收到的内容进行转换，返回转换后的结果。你可以理解为是一个“管道”，在外部接收到的内容通过这个“管道”进行转换，然后再将转换后的结果输出。因为 webpack 只认识 js，所以，你也可以将 Loader 称之为“翻译官”，对其他类型的资源进行转译的预处理工作。

`Plugin` 直译为插件，基于事件流框架 `Tapable`。Plugin 可以扩展 webpack 的功能，让 webpack 具有更多的灵活性。在 Webpack 运行的生命周期中会广播出许多事件，Plugin可以监听这些事件，在合适的时机通过 webpack 提供的 API 改变输出结果。
 干货来了！！！（通过这个 `Tapable` 框架，你可以更深层的谈一下 webpack 底层 plugin 是如何实现的以及微内核，其实 webpack 就是微内核架构的一个例子，本质上就是一个是很小的功能，它并没有携带任何业务的功能，比如：打包多个页面，在打包页面上做相应的操作，其实它都没有，形象的来说它更像是一个底座，这底座可以插上各个地方增添的功能）

扩展：

`微内核系统`一般分为两部分 ---`核心系统`和`插件系统`，这样就提供了很好的灵活性和可扩展性。核心系统是最小可运行的模块，它提供的是通用逻辑（比如 `Tapable`），而插件系统这些是具体的逻辑（比如`HtmlWebpackPlugin`插件），再比如系统怎么跑起来，插件之间怎么通信等模块都属于核心系统里面，让系统更加丰富多彩就是插件系统了。插件之间可以相互独立，也可以有依赖。
 核心系统怎么知道哪些插件可用呢？
 这就需要注册表了，其实我们的 `webpack.config.js `就起到了这样的作用，它告诉我们需要使用哪些插件。
 插件系统和核心系统怎么通信呢？
 这就需要用到 `Tapable` 了，里面有各种 `hooks`，并且在运行各个生命周期过程中会执行对应的回调。我们的核心系统有生命周期的概念，插件里面也有，因为它们的架构是类似的。我们的核心系统在运行后会先读取注册表信息，这个过程其实就是订阅事件，主车回调的过程。插件可以在运行回调的过程中再不断订阅自己需要的其他事件，注册其他回调。服务于具体逻辑的插件模块是独立于核心系统之外的，但是它可能会需要操作核心模块的系统服务来实现这些规定的功能，此时核心系统需要提供一个上下文对象（`context`），当然，插件模块与外部进行交互只允许通过此上下文对象完成。上下文对象提供了基础操作（调起其他插件模块、调起系统服务，获取系统信息）的 API 和事件。
 这样待核心系统的生命周期顺序执行的过程，也就伴随这对应的时期的插件的生命周期交替执行，生命周期走完了，整个程序流程也就结束了。

# 3、说一下 webpack 的热更新原理

webpack 的热更新又称为热替换（`Hot Module Replacement`），缩写为 `HMR`，这个机制可以做到不用刷新浏览器而将新变更的模块替换掉旧的模块。

HMR 的核心就是客户端从服务端拉取更新后的文件，准确的说是 chunk diff（chunk需要更新的部分），实际上 webpack-dev-server 与浏览器之间维护了一个 `WebSocket`，当本地资源发生变化时，webpack-dev-server会向浏览器推送更新，并带上构建时的 hash，让客户端与上一次资源进行对比。客户端对比出差异后会向 webpack-dev-server 发起 `ajax` 请求来获取更改内容（文件列表、hash），这样客户端就可以再借助这些信息继续向 webpack-dev-server 发起 `jsonp` 请求获取该 chunk 的增量更新。后续的部分由 `HotModulePlugin` 来完成，提供了相关的 API 以供开发真针对自身场景进行处理，像 `react-hot-loader` 和 `vue-loader` 都是借助这些 API 实现 HMR。
 [详细的HRM原理解析](https://link.juejin.cn?target=https%3A%2F%2Fzhuanlan.zhihu.com%2Fp%2F30669007)

# 4、如何提高 webpack 的打包速度？

1. 多入口情况下，使用 `optimization.splitChunks `来提取公共代码。
2. 通过 `externals` 配置来提取常用库。
3. 利用 `DllPlugin` 和` DllReferencePlugin` 预编译资源模块，通过 `DllPlugin` 来对那些我们引用但是绝对不会修改的npm包来进行预编译，再通过`DllReferencePlugin` 将编译编译的模块加载进来。
4. 使用 `thread-loader` 实现多进程加速编译。
5. 使用 `terser-webpack-plugin` 对js进行代码压缩。
6. 优化 `resolve` 配置缩小范围。
7. 使用 `tree-shaking` 和 `Scope hoisting` 来剔除多余代码。

# 5、如何减少 webpack 打包体积？

1. 使用 `externals `配置来提取常用库。
2. 使用 `tree-sjaking` 和 `scope hoisting` 来剔除多余代码。
3. 使用 `optimize-css-assets-webpack-plugin` 压缩css。
4. 使用 `terser-webpack-plugin` 对 js 进行代码压缩。

# 6、webpack 有哪些常见的 loader？你用过哪些 loader？

- `cache-loader`：可以在一些性能开销较大的 Loader 之前添加，目的是将结果缓存到磁盘里。
- `file-loader`：把文件输出到一个文件夹中，在代码中通过相对 URL 去引用输出的文件（处理图片、字体、图标）。
- `url-loader`：与file-loader 类似，区别是用户可以设置一个阈值，大于阈值会交给 file-loader，小于阈值时返回文件 base64 形式编码（处理图片）。
- `image-loader`：加载并且压缩图片文件。
- `babel-loader`：把 ES6 转换成 ES5。
- `ts-loader`：将 typescript 转换成 JavaScript。
- `svg-inline-loader`：将压缩后的SVG内容注入代码中。
- `raw-loader`：加载文件原始内容（utf-8）。
- `sass-loader`：将 scss/sass 代码转换成 css。
- `css-loader`：加载 css，支持模块化、压缩、文件导入等特性。
- `less-loader`：将 less 代码转换成 css。
- `style-loader`：生成 style 标签，将 js 中的样式资源插入，并添加到 header 中生效。
- `postcss-loader`：扩展 css 语法，使用下一代 css，可以配合 autoprefixer 插件自动补齐 css3 前缀。
- `eslint-loader`：通过 eslint 检查 JavaScript 代码。
- `tslint-loader`：通过tslint 检查 typesc 代码。
- `vue-loader`：加载 vue.js 单文件组件。
- `awesome-typescript-loader`：将 typescript 转换成 JavaScript，性能优于 ts-loader。

# 7、webpack 有哪些常见的 plugin？你用过哪些 plugin？

- `ignore-plugin：`忽略部分文件。
- `html-webpack-plugin：`简化 html 文件创建。
- `web-webpack-plugin：`可以方便地为单页应用输出 html，比 html-webpack-plugin 好用。
- `terser-webpack-plugin：`支持压缩ES6。
- `optimize-css-assets-webpack-plugin：`压缩css代码。
- `mini-css-extract-plugin：`分离样式文件，css 提取为单独文件，支持按需加载。
- `werviceworker-webpack-plugin：`为网页应用追加离线缓存功能。
- `clean-webpack-plugin：`目录清理。
- `ModuleconcatenationPlugin：`开启 Scope Hoisting。
- `webpack-bundle-analyzer：`可视化 webpack 输出文件的体积（业务组件、依赖第三方模块）。
- `speed-measure-webpack-plugin：`可以看到每个 loader 和 plugin 执行耗时（这个打包耗时、plugin 和 loader 耗时）。 -` HotModuleReplacementPlugin：`模块热替换。

# 8、在使用 webpack 开发时，你用过哪些可以提供效率的插件？

- `webpack-dashboard：`可以更有好的展示相关打包信息。
- `webpack-merge：`提取公共配置，减少重复配置代码。
- `speed-measure-webpack-plugin：`简称SMP，分析出 webpack 打包过程中 loader 和 plugin的耗时，有助于找到构建过程中的性能瓶颈。
- `HotModuleReplacementPlugin：`模块热替换。
- `size-plugin：`监控资源体积变化，尽早发现问题。

# 9、source map 是什么？生产环境怎么用？

`source map` 是将编译、打包、压缩后的代码映射会源代码的过程。打包压缩后的代码不具备良好的可读性，想要调试源码就需要 source map。
 map 文件只要不打开开发者工具，浏览器是不会加载的。
 显示环境一般有三种处理方案：

- `hidden-source-map：`借助第三方错误监控平台 Sentry 使用。
- `nosource-source-map：`只会显示具体行数以及查看源代码的错误栈。安全性比 source-map 高
- `source-map：`通过 nginx 设置将.map文件指对白名单开发。 `注意：`在生产环境中避免使用 `inline-` 和 `eval-`，因为它们会增加 bundle 体积大小，并降低整体性能。

# 10、文件指纹是什么？

文件指纹是指打包后输出文件的名的后缀。

- `hash：`和整个项目的构建相关，只要项目文件有修改，整个项目构建的 hash 就会变化。
- `chunkhash：`和webpack打包的 chunk 有关，不同的 chunk、不同的 entry 会生成不同的 chunkhash。
- `contenthash：`根据文件内容来定义 hash，文件内容不发生变化，则contenthash就不会变化。 直接在输出文件名添加对应的 hash值即可。

# 11、tree shaking 原理是什么？

webpack中，tree-shaking 的实现 一是先标记出模块导出值中哪些没有被动用过，二是 Terser 使用删除掉这些没被用到的导出语句。

```ini
标记功能需要配置 optimization.usedExports = true 开启   
复制代码
```

标记过程大致可划分为三个步骤：

- `Make 阶段：`收集模块导出变量并记录到模块依赖关系图 ModuleGraph 变量中。
- `Seal 阶段：`遍历 ModuleGraph 标记模块导出变量有没有被使用
- `生成产物时：`若变量没有被其他模块使用则删除对应的导出语句。 Webpack 中 Tree Shaking 的实现分为如下步骤：
- 在 `FlagDependencyExportsPlugin` 插件中根据模块的 `dependencies` 列表收集模块导出值，并记录到 ModuleGraph 体系的 `exportsInfo` 中
- 在 `FlagDependencyUsagePlugin` 插件中收集模块的导出值的使用情况，并记录到 `exportInfo._usedInRuntime` 集合中
- 在 `HarmonyExportXXXDependency.Template.apply` 方法中根据导出值的使用情况生成不同的导出语句
- 使用 DCE 工具删除 Dead Code，实现完整的树摇效果 [详细tree-shaking原理请参考这里](https://juejin.cn/post/7002410645316436004)

# 12、说一下 Babel 原理

大多数JavaScript Parser遵循 `estree` 规范，Babel 最初基于 `acorn` 项目(轻量级现代 JavaScript 解析器) Babel大概分为三大部分：

- 解析：将代码转换成 AST
  - 词法分析：将代码(字符串)分割为token流，即语法单元成的数组
  - 语法分析：分析token流(上面生成的数组)并生成 AST
- 转换：访问 AST 的节点进行变换操作生产新的 AST
  - [Taro](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FNervJS%2Ftaro%2Fblob%2Fmaster%2Fpackages%2Ftaro-transformer-wx%2Fsrc%2Findex.ts%23L15)就是利用 babel 完成的小程序语法转换
- 生成：以新的 AST 为基础生成代码 详细参考 [深入理解babel](https://juejin.cn/post/6844903746804137991)

# 13、有写过 loader 吗？简单描述一下思路

没有。但是我知道其开发的基本思路：因为 loader 支持链式调用，所以开发上需要严格遵循“单一职责”，每个 loader 只负责自己需要负责的事情。loader 拿到的是源文件的内容（`content`），通过`this.getOptions() `拿到传入的参数，可以通过返回值的方式将处理后的内容输出或者通过 `this.callback()` `同步方式`将内容返回出去，也可以调用 `this.async()` 生成一个`异步的函数`， `callback` 来处理传入的内容，再通过调用 `cabllback（）`将处理后的内容返回出去。开发的过程中尽量使用`异步 loader`。使用 `schema-utils` 来检验的我们的参数。然后再利用第三方提供的模块进行 loader 的开发。

# 14、有写过 plugin 吗？简答描述一下思路

没有。但是我知道其开发的基本思路： webpack 在运行生命周期中会广播出许多事件，PLugin 可以监听这些事件，在特定的阶段写入想要添加的自定义功能。webpack 的 tapable 事件流机制保证了插件的有序性，使得整个系统扩展性良好。 通过 `consturctor` 获取传入的配置参数，`apply()` 方法得到 `compiler`，compiler 暴露了和 webpack 整个生命周期相关的钩子，通过 `conpiler.hooks.thiscompilation` 初始 `compilation`。`compilation` 暴露了与模块和依赖有关的粒度更小的事件钩子，再使用相关的 hooks 对资源进行添加或者修改。`emit` 事件发生时，可以读取到最终输出的资源、代码块、模块及其依赖，并进行修改（emit 事件是修改 webpack 输出资源的最后时机）。
 异步的事件需要再插件处理完任务时调用回调函数通知 webpack 进入下一个流程，不然会卡住。