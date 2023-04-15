# 简析Webpack打包流程

Webpack 是一个常用的前端打包工具，它能够将多个 JavaScript 模块打包成一个或多个文件。在打包过程中，Webpack 会经历一系列的流程和生命周期。在这篇文章中，我们将介绍 Webpack 的打包流程和生命周期，并且给出一个自定义 Plugin 的示例。

## Webpack 打包流程

Webpack 的打包流程可以分为以下几个步骤：

1. 解析配置文件：Webpack 会读取并解析配置文件（通常是 `webpack.config.js` 文件），并根据配置生成一个 Compiler 对象。
2. 读取入口文件：Webpack 根据配置中的入口文件，读取这些文件及其依赖的模块，并将它们组成一个依赖图。
3. 解析模块依赖：Webpack 会根据模块之间的依赖关系，递归地解析它们的依赖，直到所有的依赖都被解析完毕。
4. 加载模块：Webpack 会根据模块的路径，使用相应的 Loader 加载模块的源代码，并将其转换为 Webpack 可以处理的形式。
5. 转换代码：Webpack 会根据配置中的插件，对加载的模块进行一系列的转换操作，比如压缩、合并、优化等。
6. 生成代码：Webpack 会将所有模块转换后的代码合并成一个或多个文件，并输出到指定的输出目录中。

## Webpack 生命周期

在 Webpack 打包的过程中，Webpack 会触发一系列的生命周期事件。这些事件可以被插件所监听，并在相应的时机执行插件的逻辑。

Webpack 生命周期的主要事件包括：

1. `beforeRun`：Webpack 进入编译前的阶段，此时会初始化 Compiler 对象。
2. `run`：Webpack 开始编译前的阶段，此时会读取入口文件和依赖，并创建依赖图。
3. `compilation`：Webpack 进入编译阶段，此时会开始编译入口文件和依赖的模块，并生成输出文件。
4. `emit`：Webpack 生成输出文件前的阶段，此时可以在插件中处理生成的输出文件。
5. `done`：Webpack 完成打包后的阶段，此时可以在插件中进行一些清理工作。

## 自定义 Plugin 示例

我们可以通过编写自定义 Plugin，来扩展 Webpack 的功能。下面是一个简单的 Plugin 示例，它可以在打包完成后输出打包文件的大小。

```ini
class FileSizePlugin {
  apply(compiler) {
    compiler.hooks.done.tap('FileSizePlugin', stats => {
      const { compilation } = stats;
      const assets = compilation.assets;
      let size = 0;

      for (let filename in assets) {
        size += assets[filename].size();
      }

      console.log(`Total size of the generated files: ${size} bytes`);
    });
  }
}

```

在上面的示例中，我们编写了一个名为 `FileSizePlugin` 的 Plugin，它监听了 Webpack 的 `done` 生命周期事件，并在事件发生时，统计生成文件的大小，并输出到控制台上。

我们可以通过以下方式在 Webpack 的配置中使用该 Plugin：

```ini
const FileSizePlugin = require('./FileSizePlugin');

module.exports = {
  // ...
  plugins: [
    new FileSizePlugin(),
    // ...
  ],
};
```

通过以上的配置，Webpack 在打包完成后，就会输出生成文件的大小了。