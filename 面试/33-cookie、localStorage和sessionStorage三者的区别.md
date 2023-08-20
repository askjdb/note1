cookie、[localstorage](https://so.csdn.net/so/search?q=localstorage&spm=1001.2101.3001.7020)和sessionStorage三者都是在开发中用到的临时存储客户端会话信息或者数据的方法，下面就简单介绍一下三者的区别：

**一、存储的时间有效期不同**

1、cookie的有效期是可以设置的，默认的情况下是关闭浏览器后失效

2、sessionStorage的有效期是仅保持在当前页面，关闭当前会话页或者浏览器后就会失效

3、localStorage的有效期是在不进行手动删除的情况下是一直有效的

**二、存储的大小不同**

1、cookie的存储是4kb左右，存储量较小，一般页面最多存储20条左右信息

2、localStorage和sessionStorage的存储容量是5Mb(官方介绍，可能和浏览器有部分差异性)

**三、与服务端的通信**

1、cookie会参与到与服务端的通信中，一般会携带在http请求的头部中，例如一些关键密匙验证等。

2、localStorage和sessionStorage是单纯的前端存储，不参与与服务端的通信

**四、读写操作的便捷程度**

1、cookie的相关操作，cookie操作起来较为繁琐，并且部分数据不可以读取操作

<1>、cookie的创建（修改和创建相同，创建同样名称会覆盖之前的）

```
//JavaScript 中，创建 cookie 如下所示：
document.cookie="username=John Doe";
//您还可以为 cookie 添加一个过期时间（以 UTC 或 GMT 时间）。默认情况下，cookie 在浏览器关闭时删除：
document.cookie="username=John Doe; expires=Thu, 18 Dec 2043 12:00:00 GMT";
//您可以使用 path 参数告诉浏览器 cookie 的路径。默认情况下，cookie 属于当前页面。
document.cookie="username=John Doe; expires=Thu, 18 Dec 2043 12:00:00 GMT; path=/";
```

<2>、cookie的读取

```
var x = document.cookie;
```

<3>、cookie的删除

````
//删除 cookie 非常简单。您只需要设置 expires 参数为以前的时间即可，如下所示，设置为 Thu, 01 Jan 1970 00:00:00 GMT:
document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
````

2、sessionStorage的相关操作

<1>、存储一条数据

```
sessionStorage.setItem('数据名', '数据值');
```

<2>、读取一条数据

```
let data = sessionStorage.getItem('数据名');
```

<3>、清除一条数据

```
sessionStorage.removeItem('数据名');
```

<4>、移除所有数据

```
sessionStorage.clear();
```

3、localStorage的相关操作

<1>、存储一条数据

```
localStorage.setItem('数据名', '数据值');
```

<2>、读取一条数据

```
let data = localStorage.getItem('数据名');
```

<3>、清除一条数据

```
localStorage.removeItem('数据名');
```

<4>、移除所有数据

````
localStorage.clear();
````

**五、对于浏览器的支持**

1、cookie出现的时间较早，目前见到的浏览器都支持

2、localStorage和sessionStorage出现的时间较晚，对于版本较低的浏览器不支持(比如IE8版本以下的都不支持)

