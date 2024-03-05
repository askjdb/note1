# 解决npm安装electron总失败的问题

## 总述解决办法

先运行

```text
npm install -g cnpm --registry=https://registry.npmmirror.com
```

再运行

```text
cnpm install --save-dev electron
```

## 解决过程

今天在学习electron的quick start教程时到安装electron的步骤`npm install --save-dev electron`总是不成功.会卡在`reify:lodash: timing reifyNode:node_modules/@types/node Completed in 578ms`这里。

百度和谷歌搜索，各种换源加代理都没解决。 最后找到了`https://npmmirror.com/`这个网站，根据指导，安装定制的cnpm管理工具`npm install -g cnpm --registry=https://registry.npmmirror.com`

然后执行`cnpm install --save-dev electron` 成功了。

日志如下：

```text
F:\learn\my-electron-app>npm install -g cnpm --registry=https://registry.npmmirror.com

added 359 packages in 17s

11 packages are looking for funding
  run `npm fund` for details

F:\learn\my-electron-app>cnpm install --save-dev electron
√ Installed 1 packages
√ Linked 74 latest versions
[1/1] scripts.postinstall electron@latest run "node install.js", root: "F:\\learn\\my-electron-app\\node_modules\\_electron@20.1.1@electron"
Downloading electron-v20.1.1-win32-x64.zip: [==================================================] 100% ETA: 0.0 seconds
[1/1] scripts.postinstall electron@latest finished in 2m
√ Run 1 scripts
anti semver electron@20.1.1 › extract-zip@2.0.1 › @types/yauzl@2.10.0 › @types/node@* delcares @types/node@*(resolved as
 18.7.15) but using ancestor(electron)'s dependency @types/node@^16.11.26(resolved as 16.11.57)
√ All packages installed (77 packages installed from npm registry, used 2m(network 6s), speed 
```