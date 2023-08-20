# 浅谈 npm, yarn, pnpm之间的区别

### 一、npm

NPM（Node Package Managemnt）为Node创造了一个强大且丰富的生态，是[Node.js](https://link.juejin.cn?target=https%3A%2F%2Fso.csdn.net%2Fso%2Fsearch%3Fq%3DNode%26spm%3D1001.2101.3001.7020)能够如此成功的主要原因之一。npm也是node.js内置的包管理器，和node一并安装。我们可以从npm的发展历程来看其的特性变化。

#### 1. npm v2

特性 ：采用简单的**递归安装**方法，将每个模块的依赖安装到自身的node_modules文件夹中，形成一个**高度嵌套**的依赖树。

可能存在的问题 ：

1. 项目规模比较大时，容易出现重复依赖，互相依赖，嵌套地狱等问题。
2. 大量的重复依赖安装，造成空间资源的大量浪费，同时也会造成依赖安装时间过长（体积大，安装慢）。
3. 由于嵌套层级过深会导致文件路径过长，在windows系统中可能会引发错误。 windows 文件系统中，文件路径不能超过 260 个字符长度。

#### 2. npm v3

特性 ：v3版本作了较大的更新，采取了**扁平化**的依赖结构。

可能存在的问题 ：

1. 采取扁平化的结构可以解决上述的问题。但是也会存在新的问题。为了生成扁平化的依赖树，npm需要便利项目中的所有依赖关系，构建完整的依赖关系树，这是一个比较耗时的操作，所以也会造成依赖安装时间过长。这个是github上npm仓库中的一个[issue](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fnpm%2Fnpm%2Fissues%2F8826)对此的描述

> npm@3 is sometimes slower than npm@2, though this is highly tree dependent. It is doing more, but all the same, folks'd like it to be as fast as it can be. Profiling would be grand. ;) This ticket exists as the tracker for npm@3 performance.

#### 3. npm v5

特性 ：引入了**package-lock.json**机制，保证了依赖安装的确定性。package-lock.json 的作用是锁定项目的依赖结构，理论上只要项目中存在 package-lock.json 文件，每次执行 npm install 后生成的node_modules 目录结构一定是完全相同的。

其实在package-lock.json机制出现之前，可以通过**npm-shrinkwrap**实现锁定依赖结构，但是npm-shrinkwrap的默认关闭的，需要主动执行。



**什么是语义版本控制（semver）？**

在了解为什么要引入锁定依赖结构的机制之前，我们需要了解npm的[语义版本控制（semver）](https://link.juejin.cn?target=http%3A%2F%2Fsemver.org%2F)。简单来说，npm包的版本描述并不是绝对精确的，而是包含一定语义（可变化）。我们可能会遇到形如这样的版本号。

```js
js
复制代码"@types/react": "^18.0.12",
```

这里的 **^** 表示指定的 MAJOR 版本号下, 所有更新的版本。这里会安装18.x.x的任意最新版本。

npm包的版本规范为**MAJOR**.**MINOR**.**PATCH**。官网原文描述请[点击](https://link.juejin.cn?target=https%3A%2F%2Fdocs.npmjs.com%2Fabout-semantic-versioning)，不同的符号含义如下图所示。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aba7ef4c5c934503984e4d2cf6789314~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp?)

从这里我们知道，即使是相同的package.json，每次安装的依赖并不都是完全一样的。这可能会导致一些问题。



**为什么要引入 lockfiles？ 在npm中即为package-lock.json**

因为单一的 `package.json` 不能确定唯一的依赖树。 主要原因有两点：

1. 不同版本的npm的安装依赖的策略和算法可能是不一样的。
2. 就是上面提到的 [semver-range version](https://link.juejin.cn/?target=https%3A%2F%2Fdocs.npmjs.com%2Fcli%2Fv6%2Fusing-npm%2Fsemver)。**npm install** 将根据 `package.json` 中的 [semver-range version](https://link.juejin.cn/?target=https%3A%2F%2Fdocs.npmjs.com%2Fcli%2Fv6%2Fusing-npm%2Fsemver) 更新依赖，如果某些依赖更新了，就可能会导致安装的依赖不同。

因此, **保证能够完整准确的还原项目依赖** 就是**lockfiles**出现的原因。



**配置了package-lock.json，就一定会生效吗？**

**不一定**。

主要取决于npm版本以及 package-lock.json 和 package.json 之间的兼容关系。

| 版本                | 方案                                                         |
| ------------------- | ------------------------------------------------------------ |
| NPM v5.0.x          | 依据 package-lock.json 安装依赖                              |
| NPM v5.1.0 - v5.4.2 | 如果package.json中声明的依赖版本规范有符合的更新的版本的时候，会忽略package-lock.json，按照package.json 安装依赖，并更新 package-lock.json |
| NPM >v5.4.2         | 如果package.json中声明的依赖版本规范和package.lock.json中声明的依赖版本兼容，则依据package-lock.json 安装依赖；如果不兼容，按照package.json 安装依赖，并更新 package-lock.json |

### 二、yarn

yarn的出现解决了npm存在的一些比较严重的问题，主要是依赖的**确定性**，**完整性**，**依赖安装速度**等等。

这里要注意的是，yarn的出现是在2016年，此时 npm 处于 v3 时期，之后npm的更新也在不断实现yarn所拥有的一部分优点。这里所说的yarn的优点主要是针对早期的npm而言。

#### 1. yarn的优点

- **速度快** yarn的速度快是其特性共同表现出来的优点。
- **依赖的确定性。** 通过yarn.lock等机制，可以锁定依赖的版本，保证相同的依赖关系所安装的依赖是一致的。（npm v5中提出了package-lock.json实现相同的功能）
- **扁平化依赖结构，减少依赖的冗余。** yarn实现了扁平化依赖结构，避免了相同的依赖被重复安装，减小体积，加快安装速度。（npm v3中也做了相同的优化）
- **网络性能更好** 采用了请求排队的理念,类似于并发池连接,利用并行下载以最大化网络资源利用率;同时也引入了一种安装失败的重试机制。
- **实现了离线模式** 通过缓存机制，实现了离线模式。可以让 Yarn 在网络出现故障的情况下仍然能正常工作。（npm也具有缓存机制）

### 三、pnpm

pnpm是一个比较新的包管理工具，虽然比较新，但是热度还是挺高的。 这个是pnpm官网的[描述](https://link.juejin.cn?target=https%3A%2F%2Fwww.pnpm.cn%2Fmotivation)。

#### 1. pnpm的优点

1. 速度非常快，超过了npm和yarn
2. pnpm继承了yarn的所有优点，包括离线模式和确定性安装。

#### 2. pnpm的不同点

1. **利用硬链接和符号链接来避免复制所有本地缓存源文件**，从而节省磁盘空间并提升安装速度。
2. **非扁平的 node_modules 目录。**

简单点来说，

1. npm和yarn实现的都是**项目级别**的依赖去重，项目和项目之间可能还具有大量相同的依赖。100个项目就对应100份依赖文件，这些依赖可能有大量的重复依赖，从而占用了大量的硬盘资源。
2. pnpm实现的是**机器级别**的依赖去重，所有文件都保存在硬盘上的统一的位置。通过硬连接，项目之间方便地共享相同版本的依赖包。 以项目和依赖包的比例来看，节省了大量的硬盘空间， 并且安装速度也大大提高了！

### 四、npm, pnpm, yarn 比较

| 特性              | npm 2.X | npm 3.X | npm 5.X | yarn | pnpm   |
| ----------------- | ------- | ------- | ------- | ---- | ------ |
| 速度              | 慢      | 慢      | 较快    | 快   | 非常快 |
| 依赖共享          | 否      | 否      | 否      | 否   | 是     |
| 嵌套化依赖        | ✅       |         |         |      | ✅      |
| 扁平化依赖        |         | ✅       | ✅       | ✅    |        |
| 锁定依赖结构      |         |         | ✅       | ✅    | ✅      |
| package-lock.json |         |         | ✅       |      |        |
| yarn.lock         |         |         |         | ✅    |        |
| 离线安装          |         |         |         | ✅    | ✅      |

### 五、一些记录

在了解npm, yarn, pnpm的时候，又发现了新的东西比如[Turbo](https://juejin.cn/post/6844903535117598733)和[Lerna](https://link.juejin.cn?target=https%3A%2F%2Fwww.lernajs.cn%2F)，还有一张有意思的图片（来源于参考文章）。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/00c28a3fa55b4bbca0fbad59201edac0~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp?)









好像还有几个比较像的指令，**npx, cnpm**,也顺便提一下好了。

npx, cnpm都不是包管理工具。

**npx**

npx是npm内置的一个命令，可以用来执行二进制文件。比如之前主要是通过npm scripts来执行二进制文件，有了npx指令之后，可以直接在npx 后 加上需要执行的二进制文件。

举个栗子：

```js
js复制代码"scripts": {
    "serve": "vue-cli-service serve"
}
```

一般情况，我们通过 `npm run serve` 启动项目，本质上还是运行 `vue-cli-service serve` 有了npx之后，可以直接执行 `npx vue-cli-service serve`

**cnpm**

cnpm跟npm用法完全一致，只是在执行命令时将npm改为cnpm。

为了解决npm服务器在国外而产生的网速慢，连接不稳定的问题，淘宝团队建立了npm在国内的镜像服务器，通过cnpm指令来连接。

> cnpm官网：“这是一个完整 npmjs.org镜像，你可以用此代替官方版本(只读)，同步频率目前为 10分钟 一次以保证尽量与官方服务同步。

安装的命令为：

```
npm install -g cnpm --registry=https://registry.npm.taobao.org
```

当然也可以继续使用npm，把源替换成淘宝的镜像。

临时：`npm --registry https://registry.npm.taobao.org install express`

永久：`npm config set registry https://registry.npm.taobao.org`

# JavaScript常见面试题：npm跟pnpm有什么区别？

## npm的发展

### 最早期的npm

早期的npm的依赖会被嵌套安装，也就是说：



```json
{
  "dependencies": {
    "A": "^1.0",
    "B": "^1.0",
    "C": "^1.0"
  }
}
```

如果我A,B,C三个包均引用了D包，但是A、B引用的是`D@1.0.0`，而C引用的是`D@2.0.0`，他们会分别安装到自己的node_modules底下。



```kotlin
// 项目的根node_modules
node_modules
     A
           node_modules
                  D@1.0.0
     B
           node_modules
                  D@1.0.0
     C
           node_modules
                  D@2.0.0
```

但是这样会导致依赖地狱。会出现依赖路径过长、以及文件被多次复制的问题！

### npm3

为了解决依赖路径过长的问题，在npm3之后，依赖就被扁平化管理了。依赖被顶到了顶层，但是当出现上面的情况的时候，依赖的表现是怎么样的？

这时候先安装的包，会把他依赖的相应版本提前，后面安装的D包如果版本跟被置顶的版本号不一致，会被安装到其node_modules下。



```kotlin
// 项目的根node_modules
node_modules
     A
     B
     C
           node_modules
                  D@2.0.0
     D（@1.0.0 ）
```

但是这个会出现一个问题，就是如果根据安装的顺序进行依赖提升，用户在`npm i`的时候，得到的结果是不确定的。因为npm也做了相对应的优化，把引用次数多的包扁平化管理，但当两个引用次数一样的时候，那必然带来的**不确定性**

### npm5

为了解决上面的问题，在package.json的基础上，又新增了 package-lock.json 文件。

虽然v5.0.x跟v5.1.0的版本不一样，我们无需记住这个，只需要稍微了解即可。

- npm@5.0.x 里，不管package.json怎么变，`npm i`都会根据lock文件下载。
- npm@5.1.0版本后，`npm i`会无视package-lock.json文件，直接下载新的npm包；
- npm@5.4.2版本后，如果package.json和package.lock文件不同那么，`npm i`时会根据package的版本进行下载并更新package-lock；如果两个文件相同则会根据package-lock文件下载，不管package有无更新

但是尽管这样，他会有幽灵依赖的问题。

#### 幽灵依赖

幽灵依赖在npm@3.x的版本中就已经出现了，因为有了提升的特性，上述例子中，虽然项目中没有在package.json中显性声明要安装D@1.0.0，但是npm已经将他提升到根部，此时在项目中引用D并进行使用是不会报错的。但是由于我们没有显性声明，假如一旦依赖A不再依赖D或者版本有变化那么此时install后代码就会因为找不到依赖而报错！！！

当然，npm还有另一个问题，就是**依赖分身**。比如我们A,B引用的是D@1.0.0，而C,E引用的是D@2.0.0，项目中D@1.0.0已经被依赖提升到顶部了，那么C,E的node_modules种均会有 D@2.0.0 的依赖，因此他会被重复安装。

## pnpm

pnpm 号称 performance npm，与npm的依赖提升和扁平化不同。pnpm采取了一套新的策略：**内容寻址储存**；

还是使用上面的例子： 项目依赖了A、B、C，之后A依赖D@1.0，B依赖D@2.0，而C也依赖D@1.0，使用 pnpm 安装依赖后 node_modules 结构如下



```kotlin
// 项目的根node_modules
node_modules
     .pnpm
           A@1.0.0
                  node_modules
                       A => <store>/A@1.0.0
                       D => ../../D@1.0.0
           D@1.0.0
                  node_modules
                        D => <store>/D@1.0.0
           B@1.0.0
                  node_modules
                       B => <store>/B@1.0.0
                       D => ../../D@2.0.0
           C@1.0.0
                node_modules
                     C => <store>/C@1.0.0
                     D => ../../D@1.0.0
      A => .pnpm/A@1.0.0/node_modules/A
      B => .pnpm/B@1.0.0/node_modules/B
      C => .pnpm/C@1.0.0/node_modules/C
```

我们看到，pnpm拥有自己的.pnpm目录，他会以平铺的方式来存储所有包，以依赖名加上版本号的名字为命名，实现了版本的复用。而且他不是通过拷贝机器缓存中的依赖到项目目录下，而是通过硬链接的方式，这能减少空间占用。

至于根目录下用于项目使用的依赖，则是通过符号链接的方式，链接到它的 .pnpm 目录下的对应位置。

### shamefully-hosit

默认情况下，通过pnpm的node_modules你只能访问到在 package.json 文件中声明的依赖，只有依赖项才能访问未声明的依赖项。你可能需要需要再.npmrc文件中声明了 shamefully-host=true，他才会像npm平铺的方式，我们才能使用package.json没有显性声明的幽灵依赖。

不过事实上，pnpm的严格模式能够帮助我们避免一些低级错误。正常情况下，是不推荐使用羞耻提升的。