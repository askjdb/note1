## 为什么需要 splitChunks？

先来举个简单的栗子，wepack 设置中有 3 个入口文件：`a.js`、`b.js` 和 `c.js`，每个入口文件都同步 import 了 `m1.js`，不设置 splitChunks，配置下 [webpack-bundle-analyzer](https://link.segmentfault.com/?enc=DDYORYb34WEYsC%2BGHL9Lag%3D%3D.m5LqanSZ1t1BhNQWkVnSjNzqwZw1oM5ws3uUvJJ%2FYl%2Bq%2BQ1PgXnYXIKgx%2FdLr1Ah%2BqMddgDbRqxcMw1JAFG9wg%3D%3D) 插件用来查看输出文件的内容，打包输出是这样的：

![img](https://segmentfault.com/img/bVc0MH4)

从分析图中可以比较直观的看出，三个输出 bundle 文件中都包含了 `m1.js` 文件，这说明有重复的模块代码。splitChunks 的目的就是用来把重复的模块代码分离到单独的文件，以异步加载的方式来节省输出文件的体积。splitChunks 的配置项很多而且感觉官方文档的一些描述不是很清楚，下面通过一些重点配置属性和场景解释来帮助大家理解和弄懂如何配置 splitChunks。为方便理解和简单演示，webpack 和 splitChunks 的初始设置如下：

```javascript
const path = require('path');
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  mode: 'development',
  entry: {
    a: './src/a.js',
    b: './src/b.js',
    c: './src/c.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    clean: true,
  },
  optimization: {
    splitChunks: {
      chunks: 'async',
      
      // 生成 chunk 的最小体积（以 bytes 为单位）。
      // 因为演示的模块比较小，需要设置这个。
      minSize: 0,
    },
  },
  plugins: [new BundleAnalyzerPlugin()],
};
```

## chunks

`splitChunks.chunks` 的作用是指示采用什么样的方式来优化分离 chunks，常用的有三种常用的取值：`async`、`initial` 和 `all`，`async` 是默认值，接下来分别看下这三种设置的区别。

### async

`chunks: 'async'` 的意思是只选择通过 `import()` 异步加载的模块来分离 chunks。举个例子，还是三个入口文件 `a.js`、`b.js` 和 `c.js`，有两个模块文件 `m1.js` 和 `m2.js`，三个入口文件的内容如下：

```javascript
// a.js
import('./utils/m1');
import './utils/m2';

console.log('some code in a.js');

// b.js
import('./utils/m1');
import './utils/m2';

console.log('some code in a.js');

// c.js
import('./utils/m1');
import './utils/m2';

console.log('some code in c.js');
```

这三个入口文件对于 `m1.js` 都是异步导入，`m2.js` 都是同步导入。打包输出结果如下：

![img](https://segmentfault.com/img/bVc0MIf)

对于异步导入，splitChunks 分离出 chunks 形成单独文件来重用，而对于同步导入的相同模块没有处理，这就是 `chunks: 'async'` 的默认行为。

### initial

把 chunks 的这只改为 `initial` 后，再来看下输出结果：

![img](https://segmentfault.com/img/bVc0MIg)

同步的导入也会分离出来了，效果挺好的。这就是 `initial` 与 `async` 的区别：同步导入的模块也会被选中分离出来。

### all

我们加入一个模块文件 `m3.js`，并对入口文件作如下更改：

```javascript
// a.js
import('./utils/m1');
import './utils/m2';
import './utils/m3'; // 新加的。

console.log('some code in a.js');

// b.js
import('./utils/m1');
import './utils/m2';
import('./utils/m3'); // 新加的。

console.log('some code in a.js');

// c.js
import('./utils/m1');
import './utils/m2';

console.log('some code in c.js');
```

有点不同的是 `a.js` 中是同步导入 `m3.js`，而 `b.js` 中是异步导入。保持 chunks 的设置为 `initial`，输出如下：

![img](https://segmentfault.com/img/bVc0MIh)

可以到看 `m3.js` 单独输出的那个 chunks 是 b 中异步导入的，a 中同步导入的没有被分离出来。也就是在 `initial` 设置下，就算导入的是同一个模块，但是同步导入和异步导入是不能复用的。

把 chunks 设置为 `all`，再导出康康：

![img](https://segmentfault.com/img/bVc0MIi)

不管是同步导入还是异步导入，`m3.js` 都分离并重用了。所以 `all` 在 `initial` 的基础上，更优化了不同导入方式下的模块复用。

**这里有个问题**，发现 webpack 的 mode 设置为 `production` 的情况下，上面例子中 `a.js` 中同步导入的 `m3.js` 并没有分离重用，在 mode 设置为 `development` 时是正常的。不知道是啥原因，如果有童鞋知道的话麻烦解释下。

我们看到 `async`、`initial` 和 `all` 类似层层递进的模块复用分离优化，所以如果考虑体积最优化的输出，那就设 chunks 为 `all`。

## cacheGroups

通过 `cacheGroups`，可以自定义 chunk 输出分组。设置 `test` 对模块进行过滤，符合条件的模块分配到相同的组。splitChunks 默认情况下有如下分组：

```javascript
module.exports = {
  // ...
  optimization: {
    splitChunks: {
      // ...
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
};
```

意思就是存在两个默认的自定义分组，`defaultVendors` 和 `default`，`defaultVendors` 是将 `node_modules` 下面的模块分离到这个组。我们改下配置，设置下将 `node_modules` 下的模块全部分离并输出到 `vendors.bundle.js` 文件中：

```javascript
const path = require('path');
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  mode: 'development',
  entry: {
    a: './src/a.js',
    b: './src/b.js',
    c: './src/c.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    clean: true,
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 0,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
          name: 'vendors',
        },
      },
    },
  },
  plugins: [new BundleAnalyzerPlugin()],
};
```

入口文件内容如下：

```javascript
// a.js
import React from 'react';
import ReactDOM from 'react-dom';

console.log('some code in a.js');

// b.js
import React from 'react';

console.log('some code in a.js');

// c.js
import ReactDOM from 'react-dom';

console.log('some code in c.js');
```

输出结果如下：

![img](https://segmentfault.com/img/bVc0MIl)

所以根据实际的需求，我们可以利用 `cacheGroups` 把一些通用业务模块分成不同的分组，优化输出的拆分。

举个栗子，我们现在输出有两个要求：

1. `node_modules` 下的模块全部分离并输出到 `vendors.bundle.js` 文件中。
2. `utils/` 目录下有一系列的工具模块文件，在打包的时候都打到一个 `utils.bundle.js` 文件中。

调整 webpack 中的设置如下：

```javascript
const path = require('path');
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  mode: 'development',
  entry: {
    a: './src/a.js',
    b: './src/b.js',
    c: './src/c.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    clean: true,
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 0,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
          name: 'vendors',
        },
        default: {
          test: /[\\/]utils[\\/]/,
          priority: -20,
          reuseExistingChunk: true,
          name: 'utils',
        },
      },
    },
  },
  plugins: [new BundleAnalyzerPlugin()],
};
```

入口文件调整如下：

```javascript
// a.js
import React from 'react';
import ReactDOM from 'react-dom';
import('./utils/m1');
import './utils/m2';

console.log('some code in a.js');

// b.js
import React from 'react';
import './utils/m2';
import './utils/m3';

console.log('some code in a.js');

// c.js
import ReactDOM from 'react-dom';
import './utils/m3';

console.log('some code in c.js');
```

输出如下：

![img](https://segmentfault.com/img/bVc0MIs)

## maxInitialRequests 和 maxAsyncRequests

### maxInitialRequests

`maxInitialRequests` 表示入口的最大并行请求数。规则如下：

- 入口文件本身算一个请求。
- `import()` 异步加载不算在内。
- 如果同时有多个模块满足拆分规则，但是按 `maxInitialRequests` 的当前值现在只允许再拆分一个，选择容量更大的 chunks。

举个栗子，webpack 设置如下：

```javascript
const path = require('path');
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  mode: 'development',
  entry: {
    a: './src/a.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    clean: true,
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 0,
      maxInitialRequests: 2,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
          name: 'vendors',
        },
        default: {
          test: /[\\/]utils[\\/]/,
          priority: -20,
          reuseExistingChunk: true,
          name: 'utils',
        },
      },
    },
  },
  plugins: [new BundleAnalyzerPlugin()],
};
```

入口文件内容如下：

```javascript
// a.js
import React from 'react';
import './utils/m1';

console.log('some code in a.js');
```

打包输出结果如下：

![img](https://segmentfault.com/img/bVc0MIu)

按照 `maxInitialRequests = 2` 的拆分过程如下：

- a.bundle.js 算一个文件。
- vendors.bundle.js 和 utils.bundle.js 都可以拆分，但现在还剩一个位，所以选择拆分出 vendors.bundle.js。

把 `maxInitialRequests `的值设为 3，结果如下：

![img](https://segmentfault.com/img/bVc0MIv)

再来考虑另外一种场景，入口依然是 `a.js` 文件，`a.js` 的内容作一下变化：

```javascript
// a.js
import './b';

console.log('some code in a.js');

// b.js
import React from 'react';
import './utils/m1';

console.log('some code in b.js');
```

调整为 `a.js` 同步导入了 `b.js`，`b.js` 里再导入其他模块。这种情况下 `maxInitialRequests` 是否有作用呢？可以这样理解，`maxInitialRequests` 是描述的入口并行请求数，上面这个场景 `b.js` 会打包进 `a.bundle.js`，没有异步请求；`b.js` 里面的两个导入模块按照 `cacheGroups` 的设置都会拆分，那就会算进入口处的并行请求数了。

比如 `maxInitialRequests` 设置为 2 时，打包输出结果如下：

![img](https://segmentfault.com/img/bVc0MIx)

设置为 3 时，打包输出结果如下：

![img](https://segmentfault.com/img/bVc0MIB)

### maxAsyncRequests

`maxAsyncRequests` 的意思是用来限制异步请求中的最大并发请求数。规则如下：

- `import()` 本身算一个请求。
- 如果同时有多个模块满足拆分规则，但是按 `maxAsyncRequests` 的当前值现在只允许再拆分一个，选择容量更大的 chunks。

还是举个栗子，webpack 配置如下：

```javascript
const path = require('path');
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  mode: 'development',
  entry: {
    a: './src/a.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    clean: true,
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 0,
      maxAsyncRequests: 2,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
          name: 'vendors',
        },
        default: {
          test: /[\\/]utils[\\/]/,
          priority: -20,
          reuseExistingChunk: true,
          name: 'utils',
        },
      },
    },
  },
  plugins: [new BundleAnalyzerPlugin()],
};
```

入口及相关文件内容如下：

```javascript
// a.js
import ('./b');

console.log('some code in a.js');

// b.js
import React from 'react';
import './utils/m1';

console.log('some code in b.js');
```

这个时候是异步导入 `b.js` 的，在 `maxAsyncRequests = 2` 的设置下，打包输出结果如下：

![img](https://segmentfault.com/img/bVc0MIF)

按照规则：

- `import('.b')` 算一个请求。
- 按 chunks 大小再拆分 `vendors.bundle.js`。

最后 `import './utils/m1'` 的内容留在了 `b.bundle.js` 中。如果将 `maxAsyncRequests = 3` 则输出如下：

![img](https://segmentfault.com/img/bVc0MIH)

这样 `b.js` 中导入的 `m1.js` 也被拆分出来了。实际情况中，我们可以根据需求来调整 `maxInitialRequests` 和 `maxAsyncRequests`，个人觉得默认设置已经够用了。

# 如何使用 splitChunks 精细控制代码分割

## 问题测验

讲解开始之前，大家先看一个问题。如果你已经知道问题的答案，而且明白为什么，就不必往下阅读了。如果不知道答案或者知道答案，但不知道原因。那么，强烈建议阅读本文。

```css
// webpack.config.js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: { app: "./src/index.js" },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist")
  },
  optimization: {
    splitChunks: {
      chunks: "all"
    }
  },
  plugins: [
    new HtmlWebpackPlugin()
  ]
};
// index.js

import "vue"
import(/*webpackChunkName: 'a' */ "./a");
import(/*webpackChunkName: 'b' */ "./b");
// a.js

import "vue-router";
import "./someModule"; // 模块大小大于30kb
// b.js

import "vuex";
import "./someModule"; // 模块大小大于30kb
// someModule.js
// 该模块大小超过30kb

// ...
```

## 代码分割的三种方式

webpack 中以下三种常见的代码分割方式:

- 入口起点：使用 `entry` 配置手动地分离代码。
- 动态导入：通过模块的内联函数调用来分离代码。
- 防止重复：使用 `splitChunks` 去重和分离 chunk。

第一种方式，很简单，只需要在 `entry` 里配置多个入口即可：

```css
entry: { app: "./index.js", app1: "./index1.js" }
```

第二种方式，就是在代码中自动将使用 `import()` 加载的模块分离成独立的包：

```go
//...

import("./a");

//...
```

第三种方式，是使用 `splitChunks` 插件，配置分离规则，然后 `webpack` 自动将满足规则的 `chunk` 分离。一切都是自动完成的。

前两种拆分方式，很容易理解。本文主要针对第三种方式进行讨论。

## splitChunks 代码拆分

### `splitChunks` 默认配置

```less
splitChunks: {
    // 表示选择哪些 chunks 进行分割，可选值有：async，initial和all
    chunks: "async",
    // 表示新分离出的chunk必须大于等于minSize，默认为30000，约30kb。
    minSize: 30000,
    // 表示一个模块至少应被minChunks个chunk所包含才能分割。默认为1。
    minChunks: 1,
    // 表示按需加载文件时，并行请求的最大数目。默认为5。
    maxAsyncRequests: 5,
    // 表示加载入口文件时，并行请求的最大数目。默认为3。
    maxInitialRequests: 3,
    // 表示拆分出的chunk的名称连接符。默认为~。如chunk~vendors.js
    automaticNameDelimiter: '~',
    // 设置chunk的文件名。默认为true。当为true时，splitChunks基于chunk和cacheGroups的key自动命名。
    name: true,
    // cacheGroups 下可以可以配置多个组，每个组根据test设置条件，符合test条件的模块，就分配到该组。模块可以被多个组引用，但最终会根据priority来决定打包到哪个组中。默认将所有来自 node_modules目录的模块打包至vendors组，将两个以上的chunk所共享的模块打包至default组。
    cacheGroups: {
        vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10
        },
        // 
    default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
        }
    }
}
```

以上配置，可以概括为如下4个条件：

1. 模块在代码中被复用或者来自 `node_modules` 文件夹
2. 模块的体积大于等于30kb（压缩之前）
3. 当按需加载 chunks 时，并行请求的最大数量不能超过5
4. 页面初始加载时，并行请求的最大数量不能超过3

```go
// index.js

import("./a");

// ...
// a.js

import "vue";

// ...
```

以上代码，在默认配置下的构建结果如下：

![图1](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/22b1993da73f4e1b88f992acbe32ea88~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

**原因分析**：

- `index.js` 作为入口文件，属于入口起点手动配置分割代码的情况，因此会独立打包。(app.js)
- `a.js` 通过 `import()` 进行加载，属于动态导入的情况，因此会独立打出一个包。(1.js)
- `vue` 来自 `node_modules` 目录，并且大于30kb；将其从 `a.js` 拆出后，与 `a.js` 并行加载，并行加载的请求数为2，未超过默认的5；`vue` 拆分后，并行加载的入口文件并无增加，未超过默认的3。`vue` 也符合 `splitChunks` 的拆分条件，单独打了一个包（2.js）

### 理解 chunks

`chunks` 用以告诉 `splitChunks` 的作用对象，其可选值有 `async`、 `initial` 和 `all`。默认值是 `async`，也就是默认只选取异步加载的chunk进行代码拆分。这个我们在开头的例子里已经验证。这里我们通过两个例子来看一下当chunks的值为 `initial` 和 `all` 时，打包结果如何。 首先将chunks值改为 `initial`：

```vbnet
chunks: "initial"
```

构建结果如下：

![图2](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a4fe63c9d2ab478d884b98fa826b586d~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

**原因分析：**

当 `chunks` 值为 `initial` 时，`splitChunks` 的作用范围变成了非异步加载的初始 chunk，例如我们的 `index.js` 就是初始化的时候就存在的chunk。而 vue 模块是在异步加载的chunk `a.js` 中引入的，所以并不会被分离出来。

`chunks` 仍使用 `initial`, 我们对 `index.js` 和 `a.js` 稍作修改：

```go
// index.js
import 'vue'
import('./a')
// a.js
console.log('a')
```

构建结果如下：

![图3](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/03b68c0417e74049902bee14e1585dad~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

**原因分析：**

`vue` 在 `index.js` 直接被引入，而 `index.js` 是初始chunk，所以分离出来打到了 `vendors~app.js` 中。

能不能让 `splitChunks` 既处理初始chunk也处理异步chunk呢？答案是可以，只需要将 `chunks` 改为 `all` ：

```vbnet
chunks: "all"
```

对 `index.js` 和 `a.js` 稍作修改：

```go
// index.js
import 'vue-router'
import('./a')
// a.js
import 'vue'
console.log('a')
```

构建结果如下：

![图4](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9b2bc7fd711b4b7a9aca4e93c4a0fc1b~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

**原因分析：**

`chunks` 值为 `all` 时，`splitChunks` 的处理范围包括了初始chunk和异步chunk两种场景，因此 `index.js` 中的 `vue-router` 被分拆到了 `vendors~app.js` 中，而异步加载的chunk `a.js` 中的 `vue` 被分拆到了 `3.js` 中。推荐在开发中将 `chunks` 设置为 `all`。

### 理解 maxInitialRequests

`maxIntialRequests` 表示 `splitChunks` 在拆分chunk后，页面中需要请求的初始chunk数量不超过指定的值。所谓初始chunk，指的是页面渲染时，一开始就需要下载的js，区别于在页面加载完成后，通过异步加载的js。

对 `splitChunks` 做以下修改，其他使用默认配置：

```vbnet
chunks: 'initial',
maxInitialRequests: 1
```

对 index.js 稍作修改：

```arduino
// index.js
import 'vue'
```

构建结果如下：

![图5](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/806d5f1e5808436fac26feeb85199192~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

**原因分析：**

因为 `maxInitialRequests` 为1，如果 `vue` 从 `index.js` 中拆出的话，新创建的chunk作为初始chunk  `index.js` 的前置依赖，是需要在页面初始化的时候就先请求的。那么初始化时的请求数变成了2，因此不满足拆分条件，所以 `splitChunks` 没有对 `index.js` 进行拆分。

### 理解 maxAsyncRequests

与 `maxInitialRequests` 相对，`maxAsyncRequests` 表示 `splitChunks` 在拆分chunk后，并行加载的异步 chunk 数不超过指定的值。

对 `splitChunks` 做以下修改，其他使用默认配置：

```makefile
maxAsyncRequests: 1
```

对 `index.js` 稍作修改：

```go
// index.js
import('./a')
// a.js
import 'vue'
console.log('a')
```

构建结果如下：

![图6](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/85a9d9b248a54a1d80e0761061db9e59~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

**原因分析：**

因为 `maxAsyncRequests` 为1，由于 `a.js` 是通过 `import()` 异步加载的，此时并行的异步请求数是1。如果将 `vue` 从 `a.js` 中拆出的话，拆出的包也将成为一个异步请求chunk。这样的话，当异步请求 `a.js` 的时候，并行请求数有2个。因此，不满足拆分条件，所以 `splitChunks` 没有对 `a.js` 进行拆分。

### 理解 minChunks

`minChunks` 表示一个模块至少应被指定个数的 chunk 所共享才能分割。默认为1。

对 `splitChunks` 做以下修改，其他使用默认配置：

```vbnet
chunks: 'all',
minChunks: 2
```

对 `index.js` 稍作修改：

```arduino
// index.js
import 'vue'
```

构建结果如下：

![图7](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9da6fd96885940499c7235d70f152c1f~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

**原因分析：**

因为 `minChunks` 为 2，所以只有当 `vue` 至少被2个 chunk 所共享时，才会被拆分出来。

**思考题**

请问如下代码，构建结果是什么？

```vbnet
chunks: 'all',
minChunks: 2
// index.js
import 'vue'
import './a'
// a.js
import 'vue'
console.log('a')
```

### 理解 cache groups

`cacheGroups` 继承 `splitChunks` 里的所有属性的值，如 `chunks`、`minSize`、`minChunks`、`maxAsyncRequests`、`maxInitialRequests`、`automaticNameDelimiter`、`name` ，我们还可以在 `cacheGroups` 中重新赋值，覆盖 `splitChunks` 的值。另外，还有一些属性只能在 `cacheGroups` 中使用：`test`、`priority` 、`reuseExistingChunk`。

通过 `cacheGroups`，我们可以定义自定义 chunk 组，通过 `test` 条件对模块进行过滤，符合条件的模块分配到相同的组。

`cacheGroups` 有两个默认的组，一个是 `vendors`，将所有来自 `node_modules` 目录的模块；一个 `default`，包含了由两个以上的 chunk 所共享的模块。

前面的例子中，你可能注意到了怎么有的拆分出的chunk名字这么奇怪，例如 `vendors~app`（默认由 `cacheGroups` 中组的 key + 源chunk名组成）。我们看一下如何自定义拆分出的chunk名。

首先找到该chunk所属的分组，该例为 `vendors` 分组，作如下修改，其他使用默认配置:

```less
chunks:'all',
cacheGroups: {
    vendors: {
      test: /[\\/]node_modules[\\/]/,
      name: "customName",
      priority: -10
    }
}
```

对 index.js 稍作修改：

```arduino
// index.js
import 'vue'
```

构建结果如下：

![图8](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f1f269f852e24d32a5e2c90393d0a40a~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

**原因分析：**

vue 来自 `node_modules` 目录，被分配到了默认的 `vendors` 组中，如果不指定 `name` 的话，会使用默认的chunk名，这里我们指定了 `name`，因此最终的chunk名为`customName`。

模块还可以分配到多个不同的组，但最终会根据 `priority` 优先级决定打包到哪个 chunk。

新增一个分组：

```yaml
chunks:'all',
cacheGroups: {
    vendors: {
      test: /[\\/]node_modules[\\/]/,
      name: "customName",
      priority: -10
    },
    customGroup: {
      test: /[\\/]node_modules[\\/]/,
      name: "customName1",
      priority: 0
    }
}
```

构建结果： ![图9](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/85e45a1e9cd94128a854d50c6e39ef14~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

**原因分析：**

虽然 `vendors` 和 `customGroup` 这个两个组的条件都符合，但由于后者的优先级更高，所以最终将 `vue` 打包到了 `customName1.js` 中。

