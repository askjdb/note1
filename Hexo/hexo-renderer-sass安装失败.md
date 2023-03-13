# 解决 hexo-renderer-sass 无法安装

# 前言

一些主题指明道姓需要这个依赖插件，没这插件样式渲染失败。而不幸的是，这个插件从接触开始，就各种水土不服。

去翻该依赖插件，最近一次更新是4年前，网上一堆针对这个插件的错误求助，十之八九没有一个完全解决的方案。

# 错误提示

> npm ERR! path /home/runner/work/action-hexo/action-hexo/node_modules/node-sass
>
> npm ERR! code 1
>
> npm ERR! command failed
>
> npm ERR! command sh -c node scripts/build.js
>
> npm ERR! Building: /opt/hostedtoolcache/node/16.15.0/x64/bin/node /home/runner/work/action-hexo/action-hexo/node_modules/node-gyp/bin/node-gyp.js rebuild –verbose –libsass_ext= –libsass_cflags= –libsass_ldflags= –libsass_library=
>
> npm ERR! make: Entering directory ‘/home/runner/work/action-hexo/action-hexo/node_modules/node-sass/build’

出现以上错误，有的是因为被墙的网络问题，有的是因为python版本问题，所以有时候全局翻墙照样报错，然而在 `github action` 中安装照样出错：

> npm ERR! gyp ERR! cwd /home/runner/work/action-hexo/action-hexo/node_modules/node-sass
>
> npm ERR! gyp ERR! node -v v16.15.0
>
> npm ERR! gyp ERR! node-gyp -v v3.8.0
>
> npm ERR! gyp ERR! not ok
>
> npm ERR! Build failed with error code: 1>

大概是这插件太老了，已不适用 `node -v v16.15.0` ，`node 12` 大概是同时代版本，可自行尝试。

# 解决方案

这插件网上一堆错误，开发者根本也不管了，好在还有其他替代方案，适用有人更新的替代版本 `hexo-renderer-sass-next` ：

```
npm uninstall hexo-renderer-sass
npm i --save hexo-renderer-sass-next
```

换插件后，根本不存在网络问题，node、python 版本问题，测试下依赖 `node-sass` 的主题，一切都这么丝滑。