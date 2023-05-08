# Node.js怎么选版本？

# Node.js版本介绍

## 安装

Node.js是一个基于Google V8引擎的、跨平台的JavaScript运行环境

直接官网下载安装👉[官网地址](https://link.juejin.cn?target=https%3A%2F%2Fnodejs.org%2Fzh-cn%2F)

## 版本介绍

### 怎么选？

在官网下载的时候会看到LTS和Current两个版本可以下载，怎么选？

简单的说就是【选LTS】

![image-20210828152251539](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d2222aa3553b47658fd60dae61b33bf6~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### 为什么这么选？

**LTS和Current的解释**

首先LTS和Current并不是版本，而是同一个主版本号的不同阶段（”主版本号“是指semver-major)。

**Current**：

一个新主版本号release后，先进入Current阶段，该阶段持续6个月，目的是给各个库(library)的作者时间来支持新版。六个月之后，奇数版本（诸如 9、11 等）将变为不支持状态，只有偶数版本（诸如 10、12 等）变成 *Active LTS* 状态，并且准备投入使用（每年的 4 月发布偶数版本、10 月发布奇数版本）

![image-20210828160925277](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a71f64d108df40b1afffb5f58a1ee6c2~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

**LTS（Long Term Support）**：

*LTS* 发布版的状态是“长期维护版”。它分为两个阶段：*Active LTS*和*Maintenance LTS*。*Active LTS*阶段持续18个月，到期后进入*Maintenance LTS*版本，持续18个月，到期后进入 *EOL*版本，正式退出历史舞台。

### **生命周期**

![image-20210828161222795](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6e1a4b064cca4a4499099971d335900a~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### **总结**

- 如果是测试环境想尝试一些新特性，可以下载Current；
- 如果是生产环境，为了保证稳定性，应该选择LTS，并且可以在每年发布 Active LTS 版本的时候进行跟进升级，最迟更新时间不要超过30 个月，因为30个月之后就进入EOL了。

### **一些术语解释**

`Active`：指正在积极维护和升级的版本系列，包括向后移植非破坏性功能和改进，解决错误以及修补安全漏洞。

`Maintenance`：这是一个维护的 LTS 版本系列，直到它的生命周期终止，只会在短时间内收到错误修复和安全补丁

`EOL`：EOL 是 End of Life 的首字母缩写，进入到 EOL 时间线的版本，将不在维护。



**顺带解释一下semver-major**

`Semver`指Semver规范，Github 起草了一个具有指导意义的，统一的版本号表示规则，称为 Semantic Versioning(语义化版本表示)。该规则规定了版本号如何表示，如何增加，如何进行比较，不同的版本号意味着什么。

[Semver官网](https://link.juejin.cn?target=https%3A%2F%2Fsemver.org%2F)

[Semver官网中文版](https://link.juejin.cn?target=https%3A%2F%2Fsemver.org%2Flang%2Fzh-CN%2F)

`major`指主版本号，版本格式：`主版本号.次版本号.修订号`，版本号递增规则如下：

- 主版本号(major)：当你做了不兼容的 API 修改，
- 次版本号(minor)：当你做了向下兼容的功能性新增，可以理解为Feature版本，
- 修订号(patch)：当你做了向下兼容的问题修正，可以理解为Bug fix版本。

> 参考资料：
>
> [node releases](https://link.juejin.cn?target=https%3A%2F%2Fnodejs.org%2Fen%2Fabout%2Freleases%2F)
>
> [Node.js Release Working Group](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fnodejs%2FRelease%23release-phases)

# Node.js版本管理

### 如何快速切换Node.js版本?



有以下面几种方式:

**`n`：一个npm全局的开源包，是依赖npm来全局安装、使用的**

你看没错，node有一个模块就叫`n`（起的好随意...），是专门用来管理node.js的版本的（这个方式比较常用）。

*安装n模块*

```
npm install -g n
复制代码
```

*查看安装版本*

```css
n --version
复制代码
```

*升级node.js到最新稳定版*

```
n stable
复制代码
```

*升级任意版本*，n后面跟随版本号【[版本号大全](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fnodejs%2Fnode%2Ftree%2Fmaster%2Fdoc%2Fchangelogs)】

```
n v14.17.5 或者 n 14.17.5
复制代码
```

*常用命令*

```scss
查看node版本
node --version

查看npm 版本,检查npm 是否正确安装。
npm -v

安装cnpm (国内淘宝镜像源),主要用于某些包或命令程序下载不下来的情况
npm install cnpm -g --registry=https://registry.npm.taobao.org

列出已安装模块
npm list
复制代码
```



**`fnm`:快速简单，兼容性支持.node-version和.nvmrc文件**

这是一个内置了 Rust，用于 Node.js 多发布版本的快速便捷管理工具;

[fnm](https://link.juejin.cn?target=https%3A%2F%2Fnodejs.org%2Fzh-cn%2Fdownload%2Fpackage-manager%2F%23fnm) 有跨版本的支持（macOS、Windows 以及 Linux），以及一系列衍生命令（Bash, Zsh, Fish, PowerShell, Windows 命令行）

[github地址](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FSchniz%2Ffnm)



**`nvm`:独立的软件包, Node Version Manager**

[nvm](https://link.juejin.cn?target=https%3A%2F%2Fnodejs.org%2Fzh-cn%2Fdownload%2Fpackage-manager%2F%23nvm)是一个只适用于Mac/Linux用户的项目，而nvm-windows则是其在windows平台的一个替代方案，两者有联系，但是各自独立的项目;

[nvm-windows下载](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fcoreybutler%2Fnvm-windows%2Freleases)

# 结语

如以上有错误的地方，请在评论区中指出！

