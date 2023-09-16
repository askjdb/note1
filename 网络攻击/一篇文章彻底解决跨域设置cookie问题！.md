# 一篇文章彻底解决跨域设置cookie问题！

## 原理讲解

- 我们可以看到Cookie有以下属性

![image-20230108222229187](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ea8564059f3540b49f8a1bdfd55829f1~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

> **Cookie属性**
>
> **名称**：Cookie的name。
>
> **值**：Cookie的value。
>
> **Domain**： Cookie的域。如果设成xxx.com(一级域名)，那么子域名x.xxx.com(二级域名)，都可以使用xxx.com的Cookie。
>
> **Path**：Cookie的路径。如果设为/，则同域名全部路径均可使用该Cookie。如果设为/xxx/，则只有路径为/xxx/可以使用该Cookie。
>
> **Expires / Max-Age**：Cookie的超时时间。如果值为时间，则在到达指定时间后Cookie失效。如果值为Session(会话)，Cookie会同Session一起失效，当整个浏览器关闭的时候Cookie失效。
>
> **Size**：Cookie的大小。
>
> **HttpOnly**：值为true时，Cookie只会在Http请求头中存在，不能通过doucment.cookie(JavaScript)访问Cookie。
>
> **Secure**：值为true时，只能通过https来传输Cookie。
>
> **SameSite**：
>
> - 值为Strict，完全禁止第三方Cookie，跨站时无法使用Cookie。
> - 值为Lax，允许在跨站时使用Get请求携带Cookie，下面有一个表格介绍Lax的Cookie使用情况。
> - 值为None，允许跨站跨域使用Cookie，前提是将Secure属性设置为true。
>
> **Priority** ：Cookie的优先级。值为Low/Medium/High，当Cookie数量超出时，低优先级的Cookie会被优先清除。

- **还需要了解两个概念**：
  - 跨站：两个域名不属于同站（域名-主机名/IP相同，协议相同）。
  - 跨域：两个域名不属于同源（域名-主机名/IP相同，端口号相同，协议相同）。

- **并且**谷歌浏览器新版本Chrome 80将Cookie的SameSite属性默认值**由None变为Lax**。

**这下就很清楚明了了，有两种解决方案**：

1. 将Cookie的SameSite值设为None，Secure值改为true，并且升级为https，我们就可以跨域使用Cookie。
2. 将Cookie的SameSite值设为Lax/Strict，并且将前后端部署在同一台服务器下，我们就可以在同一站点使用Cookie。

- **注意**：
  - `如果是本地测试想要前后端对接我们就只能使用方案一了`
  - `两种方案需要先解决浏览器同源策略也就是跨域问题`

## 前端设置

- **这里以vue的axios为例**

```javascript
import axios from 'axios'
// 只需要将axios中的全局默认属性withCredentials修改为true即可
// 在axios发送请求时便会携带Cookie
axios.defaults.withCredentials = true
```

## 后端设置

- **这里以Django为例**
- **Django跨域问题请参考另一篇文章**：[【Django跨域】一篇文章彻底解决Django跨域问题！ - 掘金 (juejin.cn)](https://juejin.cn/post/7171036423674396685)

```ini
ini复制代码# 我们需要修改 seeting.py 修改项目设置
# 记得先设置允许访问的IP
ALLOWED_HOSTS = ['*']

# 就像我们上面所说的一样有两种解决方案

# 方案一
# 将session属性设置为 secure
SESSION_COOKIE_SECURE = True
# 设置cookie的samesite属性为None
SESSION_COOKIE_SAMESITE = 'None'
# 且将协议升级为https

# 方案二
# 前后端部署在同一台服务器即可

# 记得先解决ajax的跨域问题
# 加入以下代码即可
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_HEADERS = ('*')
```

> 是不是非常简单呢，不同的前后端框架按照原理解决即可。
>
> 如果对你有帮助的话请给我点个赞吧👍。

