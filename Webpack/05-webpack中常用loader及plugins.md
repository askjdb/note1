# 一、loader同plugins是什么

- loader 用于对模块的源代码进行转换。loader 可以使你在 import 或"加载"模块时预处理文件。

> webapck的本质是一个模块打包工具, 所以webpack默认只能处理JS文件,不能处理其他文件,
> 因为其他文件中没有模块的概念, 但是在企业开发中我们除了需要对JS进行打包以外,
> 还有可能需要对图片/CSS等进行打包,  所以为了能够让webpack能够对其它的文件类型进行打包,
> 在打包之前就必须将其它类型文件转换为webpack能够识别处理的模块,
> 注意：loader都是用NodeJS编写的

> loader特点:
> 单一原则, 一个loader只做一件事情
> 多个loader会按照从右至左, 从下至上的顺序执行

- 插件（plugin）是 webpack 的支柱功能。用于扩展webpack的功能。当然loader也是变相的扩展了webpack ，但是它只专注于转化文件这一个领域。而plugin的功能更加的丰富，而不仅局限于资源的加载。一个插件就是一个类，可以在打包过程中的特定阶段执行。
  从作用角度简单来讲：loader帮助我们加载文件资源，而plugins则是loader的延伸，并不限制于加载文件资源。丰富了loader的功能。

# 二、常用loader

file-loader：打包图片，打包字体图标。使用说明

url-loader 功能类似于 file-loader，但是在文件大小（单位 byte）低于指定的限制时，可以返回一个 DataURL（提升网页性能）。使用说明

css-loader：和图片一样webpack默认能不能处理CSS文件, 所以也需要借助loader将CSS文件转换为webpack能够处理的类型。解析css文件中的@import依赖关系,打包时会将依赖的代码复制过来代替@import。

style-loader: 将css文件通过css-loader处理之后，将处理之后的内容插入到HTML的HEAD代码中。

scss-loader：自动将scss转换为CSS

less-loader：自动将less转换为CSS

PostCSS-loader：PostCSS和sass/less不同, 它不是CSS预处理器（换个格式编写css）。PostCSS是一款使用插件去转换CSS的工具，PostCSS有许多非常好用的插件。例如：autoprefixer(自动补全浏览器前缀)、postcss-pxtorem(自动把px代为转换成rem)。使用说明，必须放在css规则的最后，最先执行。

eslint-loader：用于检查常见的 JavaScript 代码错误，也可以进行"代码规范"检查，在企业开发中项目负责人会定制一套 ESLint 规则，然后应用到所编写的项目上，从而实现辅助编码规范的执行，有效控制项目代码的质量。在编译打包时如果语法有错或者有不符合规范的语法就会报错, 并且会提示相关错误信息。使用说明

imports-loader（不推荐使用）：1. 自动加载模块功能同 Provide-Plugin，2. 还可修改全局this指向（一般都是使用此功能）。使用说明。

loader-utils：获取配置文件webpack.config.js文件中option传递的参数。

schema-utils：校验配置文件传递的参数。


三、常用plugins
HtmlWebpackPlugin：会在打包结束之后自动创建一个index.html, 并将打包好的JS自动引入到这个文件中。使用说明

```json
默认情况下生成html文件并没有压缩,如果想让html文件压缩可以设置
new HtmlWebpackPlugin({
    template: "index.html",//配置模板
     minify: {
			collapseWhitespace: true//压缩
		}
})
```

默认情况下生成html文件并没有压缩,如果想让html文件压缩可以

- clean-webpack-plugin：在打包之前将我们指定的文件夹清空。应用场景每次打包前将目录清空, 然后再存放新打包的内容, 避免新老混淆问题，非官方功能。使用说明

- copy-webpack-plugin：打包相关的文档。除了JS/CSS/图片/字体图标等需要打包以外, 可能还有一些相关的文档也需要打包（word等）。文档内容是固定不变的, 我们只需要将对应的文件拷贝到打包目录中即可。使用说明。

- mini-css-extract-plugin：是一个专门用于将打包的CSS内容提取到单独文件的插件。前面我们通过style-loader打包的CSS都是直接插入到head中的。使用说明

- terser-webpack-plugin：压缩js代码

- optimize-css-assets-webpack-plugin：压缩css代码

- image-webpack-loader或img-loader：压缩图片。image-

- webpack-loader使用说明、img-loader使用说明

- postcss-sprites或webpack-spritesmith：合并图片。

  postcss-sprites使用说明、 webpack-spritesmith使用说明

- webpack-merge：用于优化配置文件。针对不同的环境将不同的配置写到不同的文件中。如：common文件做公共配置项文件，dev文件为开发配置，prod文件为上线配置。在dev，prod文件中配置webpack-merge，使其分别同common文件合并，并暴露给外界。

- SplitChunksPlugin：Code-Splitting实现的底层就是通过Split-Chunks-Plugin实现的，其作用就是代码分割。

- Provide-Plugin：功能同imports-loader，自动加载模块，所配置模块（jquery等）可以在全局使用。而不必在html头部引用，或在import导入模块。使用说明

- IgnorePlugin：用于忽略第三方包指定目录，让指定目录不被打包进去。使用说明

- add-asset-html-webpack-plugin：将打包好的库引入到html界面上

- DllPlugin：生成动态库的映射关系，即dll/[name].mainfest.json文件

- DllReferencePlugin：查找动态库。把只有 dll 的 bundle(们)(dll-only-bundle(s)) 引用到需要的预编译的依赖。
  webpack-bundle-analyzer：可视化的打包优化插件。会将打包的结果以图形化界面的方式展示给我们,并且在本地开启服务器，将服务器上生成的界面自动在浏览器中展示出来。使用说明
  watch：webpack 可以监听打包文件变化，当它们修改后会重新编译打包

- webpack-dev-server：
  webpack-dev-server和watch一样可以监听文件变化，两者不要同时配置，防止冲突。
  webpack-dev-server可以将我们打包好的程序运行在一个服务器环境下
  webpack-dev-server可以解决企业开发中"开发阶段"的跨域问题
  可以监听css，js代码且能自动刷新

- HMR(HotModuleReplacementPlugin)：热更新插件, 会在内容发生改变的时候，时时的更新（打包）修改的内容但是不会重新刷新网站。推荐使用

- babel：将ES678高级语法转换为ES5低级语法，否则在低级版本浏览器中我们的程序无法正确执行。使用说明

- babel-preset-env：告诉webpack我们需要兼容哪些浏览器，然后babel就会根据我们的配置自动调整转换方案, 如果需要兼容的浏览器已经实现了, 就不转换了。

- babel/polyfill：没有对应关系就是指E5中根本就没有对应的语法, 例如Promise, includes等方法是ES678新增的。ES5中根本就没有对应的实现, 这个时候就需要再增加一些额外配置, 让babel自己帮我们实现对应的语法。

- babel/parser：将JS代码转换为AST抽象语法树。使用说明

- babel/generator：将AST抽象语法树转换为JS代码。

- babel/traverse：遍历抽象语法树。使用说明

- babel/types：创建AST抽象语法树。使用说明

- html-withimg-loader：实现HTML中图片的打包（file-loader或者url-loader并不能将HTML中用到的图片打包到指定目录中）。使用说明
  

# 四、其他常用功能/配置

sourcemap：用来存储打包之后的文件同打包之前文件的映射关系。使用说明
使用比较重要，因此描述一下：

> 一般企业开发配置:
> 开发环境：development: cheap-module-eval-source-map
> 只需要行错误信息, 并且包含第三方模块错误信息, 并且不会生成单独sourcemap文件
> 生产环境：production: cheap-module-source-map
> 只需要行错误信息, 并且包含第三方模块错误信息, 并且会生成单独sourcemap文件
> 因为不单独生成sourcemap文件会增加打包文件体积，影响网页性能。单独的sourcemap文件不会被别人请求。

tree shaking：过滤掉无用的JS代码和CSS代码, 我们称之为Tree-Shaking。webpack无需插件即可过滤无用js代码：使用说明

purifycss：过滤无用css文件。下载地址

Code-Splitting（代码分隔）：默认情况下webpack会将所有引入的模块都打包到一个文件中,代码分隔就是将不经常修改的模块打包到单独的文件中, 避免每次修改用户都需要重新下载所有内容。webpack自有功能。

lazy-loading（异步加载）：用于提升网页性能。使用说明。

Prefetching: 空闲的时候加载js文件。使用说明

contenthash：长缓存优化。解决浏览器缓存功能造成的修改文件后资源并未重新加载替换原文件的问题。

resolve（解析）：用于配置导入模块的解析规则。也就是import时简化导入路径（alias属性）；修改模块入口查找顺序（mainFields属性）等功能。

noParse：默认情况下无论我们导入的模块(库)是否依赖于其它模块(库), 都会去分析它的依赖关系。noParse提前告诉webpack对于一些独立的模块(库), 我们不要去分析它的依赖关系，以提升打包速度。

externals：将不会发生变化的第三方模块(库,例如：jquery)设置为外部扩展，避免将这些内容打包到我们的项目中, 从而提升打包速度。使用说明

HappyPack：实现多线程打包。使用说明

alias：设置模块路径的代替名，方便快读引用模块路径

this-callback：提供异步loader返回结果方案。使用说明
