### 当npm 命令安装第三方包的时候发生如下错误时

![image-20221213102817794](C:\Users\123\AppData\Roaming\Typora\typora-user-images\image-20221213102817794.png)

## 可以在npm命令后面加上--legacy-peer-deps

## 如：

## npm i --save redux-thunk --legacy-peer-deps





# Package subpath ‘./lib/tokenize’ is not defined by “exports” in the package.json

今天在启动一个react项目的时候，我运行了这个命令：

```powershell
npm run start
复制代码
```

项目启动过程中，控制台突然报了这个`错误`：

> Error [ERR_PACKAGE_PATH_NOT_EXPORTED]: Package subpath './lib/tokenize' is not defined by "exports" in the package.json of a module in node_modules

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4ac9ff01fd2246b3afe8f80927636728~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp?) `原因：`

原来是我当时安装这个项目需要的依赖的时候，使用的node版本比较低，最近升级了一下node版本导致的。

```
解决办法:
```

> 第一种办法：将当前的node版本切回到当时安装项目依赖的时候的版本，这样的话再运行`npm run start`命令就不会再报错了；

> 第二种办法：删除已经安装好的`node_modules`文件夹、package-lock.json文件或者 yarn.lock文件；重新在升级后的node环境下执行`npm i`或者`yarn install`，重新下载项目所需要的依赖就好了；

