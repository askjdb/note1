Cookie是什么
        cookie的中文翻译是曲奇，小甜饼的意思。cookie其实就是一些数据信息，类型为“小型文本文件”，存储于电脑上的文本文件中。

Cookie有什么用
        我们想象一个场景，当我们打开一个网站时，如果这个网站我们曾经登录过，那么当我们再次打开网站时，发现就不需要再次登录了，而是直接进入了首页。例如bilibili，csdn等网站。

 这是怎么做到的呢？其实就是游览器保存了我们的cookie，里面记录了一些信息，当然，这些cookie是服务器创建后返回给游览器的。游览器只进行了保存。下面展示bilibili网站保存的cookie。

![img](https://img-blog.csdnimg.cn/c935d116e49344f6a9e4ef9a97982247.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5LiN5pyN6L6T55qE5bCR5bm0,size_20,color_FFFFFF,t_70,g_se,x_16)

Cookie的表示 
        一般情况下，cookie是以键值对进行表示的(key-value)，例如name=jack，这个就表示cookie的名字是name，cookie携带的值是jack。

Cookie的组成
        下面我自己写了一个简易Servlet来设置cookie，我们游览器抓包进行查看。然后进行分析

![img](https://img-blog.csdnimg.cn/6635770f0959461d937263dcba0d4edc.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5LiN5pyN6L6T55qE5bCR5bm0,size_20,color_FFFFFF,t_70,g_se,x_16)

以下是cookie中常用属性的解释。

Name：这个是cookie的名字
Value：这个是cooke的值
Path：这个定义了Web站点上可以访问该Cookie的目录
Expires：这个值表示cookie的过期时间，也就是有效值，cookie在这个值之前都有效。
Size：这个表示cookie的大小
        想要完全了解所有cookie属性，请参考百度知道：cookie

Cookie的HTTP传输
        我们还是通过抓包进行查看。首先查看cookie在HTTP请求中是怎样进行表示的。

HTTP请求

![img](https://img-blog.csdnimg.cn/046cfd41d5b34376a8bd48a6241a8ed4.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5LiN5pyN6L6T55qE5bCR5bm0,size_20,color_FFFFFF,t_70,g_se,x_16)

        我们在发送HTTP请求时，发现游览器将我们的cookie都进行了携带(注意：游览器只会携带在当前请求的url中包含了该cookie中path值的cookie)，并且是以key：value的形式进行表示的。多个cookie用；进行隔开。 
    
        我们再来查看cookie在HTTP响应中是如何进行表示的。

HTTP响应

![img](https://img-blog.csdnimg.cn/09f69d7f814242a580f70c2ba4ade8d6.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5LiN5pyN6L6T55qE5bCR5bm0,size_20,color_FFFFFF,t_70,g_se,x_16)

        我在服务器设置了2个cookie，返回给游览器。通过抓包，我们发现在HTTP响应中， cookie的表示形式是，Set-Cookie：cookie的名字，cookie的值。如果有多个cookie，那么在HTTP响应中就使用多个Set-Cookie进行表示。

Cookie的生命周期
        cookie有2种存储方式，一种是会话性，一种是持久性。

会话性：如果cookie为会话性，那么cookie仅会保存在客户端的内存中，当我们关闭客服端时cookie也就失效了
持久性：如果cookie为持久性，那么cookie会保存在用户的硬盘中，直至生存期结束或者用户主动将其销毁。
        cookie我们是可以进行设置的，我们可以人为设置cookie的有效时间，什么时候创建，什么时候销毁。


总结
        Cookie就是一些数据，用于存储服务器返回给客服端的信息，客户端进行保存。在下一次访问该网站时，客户端会将保存的cookie一同发给服务器，服务器再利用cookie进行一些操作。利用cookie我们就可以实现自动登录，保存游览历史，身份验证等功能。
