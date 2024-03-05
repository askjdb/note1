回想当年刚接触前端，`Ajax` 真的碰一次就跪一次。当时不懂后端，不知道 `` 是什么东东，也没有后端小伙伴写接口给我测试。



本文整理了我用过的几个 **免费的在线接口**，而且不需要处理跨域等问题。

希望能给刚入门的前端小白在学习 `Ajax` 时提供一点帮助。



本文列举的在线接口包括：**文本** 和 **图片**。

本文案例都是使用 `postman` 进行测试的，因为我懒得自己写 `Ajax` 代码。



如果你想在本地 **30秒搭建一套模拟接口**，如果你 **不懂后端**，如果你需要 **自定义** 接口地址和数据格式。那可以试试跟着这篇文章去实现：

[《『前端必备』本地数据接口 —— json-server 从入门到膨胀》](https://juejin.cn/post/7043424909472563208)



**如果本文对您有帮助，请帮我点个赞呗👍**





## 一、{JSON} Placeholder

**[『JSONPlaceholder』](https://link.juejin.cn?target=http%3A%2F%2Fjsonplaceholder.typicode.com%2F) 提供用于测试的免费。**

![01.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8a8d8ca0bcd14901bdce018a1c448569~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)



`JSONPlaceholder` 使用方式非常简单，提供了 `GET`、`POST`、`PUT`、`PATCH`、`DELETE` 几个请求方法。

还提供分页查询、具体id查询等功能。



#### 例：获取100篇文章数据（GET）

返回100条数据，每条内容都有帖子 ID、发贴人 ID、标题、以及简介。

```apl
apl
http://jsonplaceholder.typicode.com/posts
```



![02.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0f67fbfc6b9944b1883c0a8cde621ae6~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

#### 例：根据文章ID获取文章数据（GET）

根据文章 `ID` 获取指定文章的数据。

返回：文章 ID、发贴人 ID、标题、以及内容。

```api

http://jsonplaceholder.typicode.com/posts/2
```



![03.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8b658392c4a0486d80ec5397372440fc~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)



本例传入的 ID 为2，返回 ID 为2的数据。



#### 例：添加文章（POST）

使用 `POST` 发送一篇文章，发送成功会返回一个文章 ID 回来。

```api

http://jsonplaceholder.typicode.com/posts
```



![04.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/51054098efc74c7881da0a9e96cdb346~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)



#### 其他接口（自己试试吧）

##### 帖子接口：

- 获取帖子列表：[jsonplaceholder.typicode.com/posts](https://link.juejin.cn?target=http%3A%2F%2Fjsonplaceholder.typicode.com%2Fposts)
- 根据帖子ID获取详情：[jsonplaceholder.typicode.com/posts/1](https://link.juejin.cn?target=https%3A%2F%2Fjsonplaceholder.typicode.com%2Fposts%2F1)
- 获取某个用户所有的帖子：[jsonplaceholder.typicode.com/posts?userI…](https://link.juejin.cn?target=http%3A%2F%2Fjsonplaceholder.typicode.com%2Fposts%3FuserId%3D5)
- 获取帖子所有的评论：[jsonplaceholder.typicode.com/posts/1/com…](https://link.juejin.cn?target=https%3A%2F%2Fjsonplaceholder.typicode.com%2Fposts%2F1%2Fcomments)



##### 评论接口

- 获取评论列表：[jsonplaceholder.typicode.com/comments](https://link.juejin.cn?target=http%3A%2F%2Fjsonplaceholder.typicode.com%2Fcomments)
- 获取某个帖子的所有评论：[jsonplaceholder.typicode.com/comments?po…](https://link.juejin.cn?target=http%3A%2F%2Fjsonplaceholder.typicode.com%2Fcomments%3FpostId%3D4)



##### 专辑接口：

- 获取专辑列表：[jsonplaceholder.typicode.com/albums](https://link.juejin.cn?target=http%3A%2F%2Fjsonplaceholder.typicode.com%2Falbums)
- 根据专辑ID获取详情：[jsonplaceholder.typicode.com/albums/6](https://link.juejin.cn?target=http%3A%2F%2Fjsonplaceholder.typicode.com%2Falbums%2F6)
- 获取某个用户所有专辑：[jsonplaceholder.typicode.com/albums?user…](https://link.juejin.cn?target=http%3A%2F%2Fjsonplaceholder.typicode.com%2Falbums%3FuserId%3D9)



##### 待办事宜接口：

- 获取待办事宜列表：[jsonplaceholder.typicode.com/todos](https://link.juejin.cn?target=http%3A%2F%2Fjsonplaceholder.typicode.com%2Ftodos)
- 根据待办ID获取详情：[jsonplaceholder.typicode.com/todos/6](https://link.juejin.cn?target=http%3A%2F%2Fjsonplaceholder.typicode.com%2Ftodos%2F6)
- 获取某个用户所有待办事宜：[jsonplaceholder.typicode.com/todos?userI…](https://link.juejin.cn?target=http%3A%2F%2Fjsonplaceholder.typicode.com%2Ftodos%3FuserId%3D9)



##### 用户接口：

- 获取用户列表：[jsonplaceholder.typicode.com/users](https://link.juejin.cn?target=http%3A%2F%2Fjsonplaceholder.typicode.com%2Fusers)
- 根据用户ID获取详情：[jsonplaceholder.typicode.com/users/5](https://link.juejin.cn?target=http%3A%2F%2Fjsonplaceholder.typicode.com%2Fusers%2F5)



##### 照片接口：

- 获取照片列表：[jsonplaceholder.typicode.com/photos](https://link.juejin.cn?target=http%3A%2F%2Fjsonplaceholder.typicode.com%2Fphotos)
- 根据照片ID获取详情：[jsonplaceholder.typicode.com/photos/8](https://link.juejin.cn?target=http%3A%2F%2Fjsonplaceholder.typicode.com%2Fphotos%2F8)





## 二、猫奴福利接口

**[『The Cat  - Cats as a Service.』](https://link.juejin.cn?target=https%3A%2F%2Fthecat.com%2F) 会返回猫的图片，绝对是福利。**



![05.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7b90fdc6c7e74d379ceb1dc0afd29a64~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)



使用方法可以看 [『文档』](https://link.juejin.cn?target=https%3A%2F%2Fdocs.thecat.com%2F) ，里面包括猫的 “按品种搜索”、“按类别搜索”、“分页搜索”、“图片上传”、“图像分析”等接口，可以对照文档使用。



#### 例：随机获取1张猫图（GET）

每次请求都会随机返回一张猫的图片。

```api

https://.thecat.com/v1/images/search?limit=1
```



![06.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4cdd0bcdbb8147fb853d61e03c1218f8~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)



其他接口的使用都比较简单，[『官方文档』](https://link.juejin.cn?target=https%3A%2F%2Fdocs.thecat.com%2F)  都讲得很明白的，可以自己用 `postman` 测一下。





## 三、狗子接口

[『Dog 』](https://link.juejin.cn?target=https%3A%2F%2Fdog.ceo%2Fdog-%2F) 提供了狗子的图片，官网的首页第一眼看到的 `` 就可以随机获得一张狗子照片，非常有趣。



![07.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d5e845a5e66741259694599e86ef1737~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)



#### 例：随机返回一张狗子照片（GET）

```api

https://dog.ceo//breeds/image/random
```



![08.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d9adef5ab90849ff94314824383d0e7e~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)



其他接口的用法也好简单，详情可看 [『狗子官方文档』](https://link.juejin.cn?target=https%3A%2F%2Fdog.ceo%2Fdog-%2Fdocumentation%2F)





## 四、随机图片接口

[『Lorem Picsum』](https://link.juejin.cn?target=https%3A%2F%2Fpicsum.photos%2F) 可以随机返回一张照片，还可以指定照片的尺寸。

![09.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/883c71a9e1ee4d91853ad7feb22d1322~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)



`Lorem Picsum`  提供的接口返回的是一个图片资源，而且是随机返回的。

可以直接放在 `<img>` 标签的 `src` 属性内使用。



#### 例：返回 `宽和高都是200px` 的图片（GET）

```api

https://picsum.photos/200
```



![10.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/febb388c7d41495a818fe1a946c36148~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)



#### 例：比如想要获取 `宽200，高300` 的图片（GET）

如果宽高尺寸不同，可以自己设置。

```api

https://picsum.photos/200/300
```



![11.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/39e1d9e5f87948548ca2eff5a7056caa~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)





## 五、其他接口

前面4个是我用得最多的测试平台，接下来这些是我用得比较少，但知道有这回事。有需要的话可以自己测测。



#### 爱奇艺接口

```api

https://cache.video.iqiyi.com/jp/avlist/{片源id}/{页码}/
```



##### 例：用海贼王的片源id（GET）

```api

https://cache.video.iqiyi.com/jp/avlist/202861101/1/
```



![12.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/116d760d085b4eb996ca3771a9a0f2e9~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

可以猜到：

- `vpic`：每集的封面
- `shortTitle`：集数
- `vt`：本集的名称
- `vid`：视频id
- `vur`：视频播放地址



其他字段自己猜吧，我懒~





#### 物流接口

```api

http://www.kuaidi100.com/query?type=快递公司代号&postid=快递单号
```



**快递公司编码：**

- 申通：`shentong`
- EMS：`ems`
- 顺丰：`shunfeng`
- 圆通：`yuantong`
- 中通：`zhongtong`
- 韵达：`yunda`
- 天天：`tiantian`
- 汇通：`huitongkuaidi`
- 全峰：`quanfengkuaidi`
- 德邦：`debangwuliu`
- 宅急送：`zhaijisong`





#### 淘宝商品接口

```api

http://suggest.taobao.com/sug?code=utf-8&q=商品关键字&callback=cb
```

`callback` 是回调函数设定