# [Hexo中添加本地图片 ](https://www.cnblogs.com/codehome/p/8428738.html)

## First

1 把主页配置文件`_config.yml` 里的`post_asset_folder:`这个选项设置为`true`

2 在你的hexo目录下执行这样一句话`npm install hexo-asset-image --save`，这是下载安装一个可以上传本地图片的插件，来自dalao：[dalao的git](https://github.com/CodeFalling/hexo-asset-image)

3 等待一小段时间后，再运行`hexo n "xxxx"`来生成md博文时，`/source/_posts`文件夹内除了`xxxx.md`文件还有一个同名的文件夹

4 最后在`xxxx.md`中想引入图片时，先把图片复制到xxxx这个文件夹中，然后只需要在xxxx.md中按照markdown的格式引入图片：

```
![你想输入的替代文字](xxxx/图片名.jpg)
```

注意： xxxx是这个md文件的名字，也是同名文件夹的名字。只需要有文件夹名字即可，不需要有什么绝对路径。你想引入的图片就只需要放入xxxx这个文件夹内就好了，很像引用相对路径。

5 最后检查一下，`hexo g`生成页面后，进入`public\2017\02\26\index.html`文件中查看相关字段，可以发现，html标签内的语句是`<img src="2017/02/26/xxxx/图片名.jpg">`，而不是`<img src="xxxx/图片名.jpg>`。这很重要，关乎你的网页是否可以真正加载你想插入的图片。

## Second

本地source中建立img文件夹

<img src="img/图片名.jpg">

这个比较方便

## Third

图床，不太稳定。