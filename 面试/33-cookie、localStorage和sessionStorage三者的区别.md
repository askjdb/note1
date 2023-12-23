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

# 理解localstorage和localstorage的跨域存储方案

[html5](https://so.csdn.net/so/search?q=html5&spm=1001.2101.3001.7020)标准中一个亮点就是提供了浏览器本地存储的功能。方式有两种：localStorage和 sessionStorage。 相对于cookie，他们具有存储空间大的特点，一般可以存储5M左右，而cookie一般只有4k。

[localStorage](https://so.csdn.net/so/search?q=localStorage&spm=1001.2101.3001.7020)和 sessionStorage的主要区别是：localStorage的生命周期是永久的，意思就是如果不主动清除，存储的数据将一直被保存。而sessionStorage顾名思义是针对一个session的数据存储，生命周期为当前窗口，一旦窗口关闭，那么存储的数据将被清空。

当然作为孪生兄弟，两者也有很多相同点。比如存取数据的方法就是一样的。

```js
#localStorage和sessionStorage的一些方法：
#添加键值对： setItem(key,value);
#获取键值对： getItem(key);
#删除键值对： removeItem(key);
#清除所有键值对： clear();
#获取属性名称（键名称）： key(index);
#获取键值对的数量： length;
 
#localStorage 的存取方式
localStorage.age = 88; // 用localStorage属性的方式来添加条目
localStorage.setItem("animal","cat"); // 推荐使用setItem的方式存储一个名为animal，值为cat的数据
var animal = localStorage.getItem("animal"); //读取本地存储中名为animal的数据，并赋值给变量animal
console.log(animal);  
localStorage.removeItem("animal"); //删除单条数据
localStorage.clear(); //清除所有数据
 
#sessionStorage 的存取方式
sessionStorage.work = "police";
sessionStorage.setItem("person", "Li Lei");
var person = sessionStorage.getItem("person");
console.log(person);
 
```

另外，不同浏览器无法共享localStorage和sessionStorage中的信息。同一浏览器的相同域名和端口的不同页面间可以共享相同的 localStorage，但是不同页面间无法共享sessionStorage的信息。这里需要注意的是，页面仅指顶级窗口，如果一个页面包含多个iframe且他们属于同源页面，那么他们之间是可以共享sessionStorage的。在实际开发过程中，遇到的最多的问题就是localStorage的同源策略问题。为了了解这个问题，我们先得清楚什么是同源策略。同源策略（[same-origin policy](https://link.jianshu.com/?t=https://en.wikipedia.org/wiki/Same-origin_policy)）是浏览器执行的一种安全措施，目的是为了保证用户信息的安全，防止恶意的网站窃取数据。浏览器的同源策略具体如下：

| URL                                                          | 说明                           | 是否允许通信                           |
| :----------------------------------------------------------- | :----------------------------- | :------------------------------------- |
| [http://www.a.com/a.js](https://link.jianshu.com/?t=http://www.a.com/a.js) [http://www.a.com/b.js](https://link.jianshu.com/?t=http://www.a.com/b.js) | 同一域名下                     | 允许                                   |
| [http://www.a.com/lab/a.js](https://link.jianshu.com/?t=http://www.a.com/lab/a.js) [http://www.a.com/script/b.js](https://link.jianshu.com/?t=http://www.a.com/script/b.js) | 同一域名下不同文件夹           | 允许                                   |
| [http://www.a.com:8000/a.js](https://link.jianshu.com/?t=http://www.a.com:8000/a.js) [http://www.a.com/b.js](https://link.jianshu.com/?t=http://www.a.com/b.js) | 同一域名，不同端口             | 不允许                                 |
| [http://www.a.com/a.js](https://link.jianshu.com/?t=http://www.a.com/a.js) [https://www.a.com/b.js](https://link.jianshu.com/?t=https://www.a.com/b.js) | 同一域名，不同协议             | 不允许                                 |
| [http://www.a.com/a.js](https://link.jianshu.com/?t=http://www.a.com/a.js) [http://70.32.92.74/b.js](https://link.jianshu.com/?t=http://70.32.92.74/b.js) | 域名和域名对应ip               | 不允许                                 |
| [http://www.a.com/a.js](https://link.jianshu.com/?t=http://www.a.com/a.js) [http://script.a.com/b.js](https://link.jianshu.com/?t=http://script.a.com/b.js) | 主域相同，子域不同             | 不允许                                 |
| [http://www.a.com/a.js](https://link.jianshu.com/?t=http://www.a.com/a.js) [http://file.a.com/b.js](https://link.jianshu.com/?t=http://file.a.com/b.js) | 同一域名，不同二级域名（同上） | 不允许（cookie这种情况下也不允许访问） |
| [http://www.cnblogs.com/a.js](https://link.jianshu.com/?t=http://www.cnblogs.com/a.js) [http://www.a.com/b.js](https://link.jianshu.com/?t=http://www.a.com/b.js) | 不同域名                       | 不允许                                 |

只要不同源就不能共享localStorage的数据。但是在实际开发中又时常会遇到这样的需求，那我们该如何解决呢？

目前广泛采用的是postMessage和iframe相结合的方法。postMessage(data,origin)方法允许来自不同源的脚本采用异步方式进行通信，可以实现跨文本档、多窗口、跨域消息传递。接受两个参数：

- data：要传递的数据，[HTML5](https://link.jianshu.com/?t=http://lib.csdn.net/base/html5)规范中提到该参数可以是[JavaScript](https://link.jianshu.com/?t=http://lib.csdn.net/base/javascript)的任意基本类型或可复制的对象，然而并不是所有浏览器支持任意类型的参数，部分浏览器只能处理字符串参数，所以在传递参数时需要使用JSON.stringify()方法对对象参数序列化。
- origin：字符串参数，指明目标窗口的源，协议+主机+端口号[+URL]，URL会被忽略，所以可以不写，只是为了安全考虑，postMessage()方法只会将message传递给指定窗口，当然也可以将参数设置为"*"，这样可以传递给任意窗口，如果要指定和当前窗口同源的话设置为"/"。
