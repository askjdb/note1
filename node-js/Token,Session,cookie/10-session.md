**什么是session**

Session：在计算机中，尤其是在网络应用中，称为“会话控制”。Session对象存储特定用户会话所需的属性及配置信息。这样，当用户在应用程序的Web页之间跳转时，存储在Session对象中的变量将不会丢失，而是在整个用户会话中一直存在下去。这是百度百科中对于session的定义，对于session没有一定了解的人可能并不能很好的理解。下面是我对session的一些浅显的理解。我们先从session的产生开始说起。

我们都知道HTTP协议本身是无状态的，这与HTTP协议本来的目的是相符的，客户端只需要简单的向服务器请求下载某些文件，无论是客户端还是服务器都没有必要纪录彼此过去的行为，每一次请求之间都是独立的。那么如果我希望几个页面的请求是有关联的，比如A页面是记录用户的信息，B页面是记录用户的订单记录。我需要登录才能看到用户的信息，那我不可能A页面登录B页面再次登录，或者每次请求都带上用户名密码，因此诞生了session，从上面的描述来讲，它就是在一次会话中解决2次HTTP的请求的关联，让它们产生联系，使客户端与服务器之间保持状态，那么session是怎么让客户端与服务器之间保持状态的呢，我们需要先了解session的机制

**session的机制**

session并不是浏览器产生的，而是由服务端生成。

当访问服务器某个网页的时候，只要发起了http请求（包括请求html,css,img,js等等），就会在服务器端的内存里开辟一块内存，这块内存就叫做session，而这个内存是跟浏览器关联在一起的。当程序需要为某个客户端的请求创建一个session的时候，服务器首先检查这个客户端的请求里是否已包含了一个session标识 - 称为session id，如果已包含一个session id则说明以前已经为此客户端创建过session，服务器就按照session id把这个session检索出来使用，如果检索不到，就会新建一个。如果客户端请求不包含session id，则为此客户端创建一个session并且生成一个与此session相关联的session id，然后把这个session id返回给客户端，并在客户端的cookie中保存起来。如图：



![img](https://pic3.zhimg.com/80/v2-a508cf4d0cb277e757e3e950c8720952_720w.webp)



这个session id会在客户端做为临时会话的cookie保存起来，我们可以通过谷歌浏览器的开发者工具查看到这个cookie，如图：



![img](https://pic2.zhimg.com/80/v2-4b314482891d96d399d35a7bc5fb3725_720w.webp)



在当前打开的浏览器窗口中的任何请求都会自动的带上这个cookie,比如用户提交登录请求时带上了这个cookie，那么在用户查看订单记录的时候也会带上这个cookie,服务器通过这个cookie就能获取到session id的值，就能判断发送这个请求的是哪个用户，然后返回正确的数据给客户端。下面这张图很好的诠释了这个过程：



![img](https://pic4.zhimg.com/80/v2-d0a446f4ef86f09c6538a2195dfc47d3_720w.webp)

现在我们应该对于session有一定的了解了，下面来看一案例，利用session id解决微信小程序的登录状态问题。

第一次接触微信小程序开发的小伙伴们都会遇见这样的问题，每次请求后端服务器都会返回一个新的JSESSIONID，无法保存用户的登录状态。

**注意：**如果首次进入的时候不保存session id而是在登录以后再保存，容易造成串号的问题。一般串号或者session ID混乱，在Web Page上面很少见，而在小程序、APP上很常见，原因是:

1. 网页首先访问的是html文件，其次才是登录的API， 后续的API都是沿用html里面的这个session
2. 如果是小程序，或者是APP，需要有一个过渡的请求， 比如一个空的API，通过这个API创建session，然后完成后续操作，这样才能彻底避免session问题
3. 在后端，特别注意session相关的字段一定要做成local变量，一旦做成全局或者局部变量，很容易造成串号

![img](https://pic4.zhimg.com/80/v2-43abf44da38440c083115b2aed3dda03_720w.webp)





![img](https://pic2.zhimg.com/80/v2-e608d894e4ea70a1a1eb05bdd46ccda9_720w.webp)



那是因为小程序无法保存Cookie，导致每次wx.request到服务端都会创建一个新的会话（传过去的sessionid会变化），小程序端就不能保持登录状态了。我们了解session id的机制后就能很简单的解决这个问题，首次进入的时候或者登录成功后将session id保存起来

```js
wx.request({
  url: 'test',
  data: {
    x: '',
  },
  header: {
    'content-type': 'application/json' 
  },
  success (res) {
 let cookie = res.header['Set-Cookie'].split(';')[0].split('=')
     wx.setStorageSync('cookieKey', cookie[1])
  }
})
```

然后调用接口时，在header中加入：

```js
wx.request({
  url: 'test',
  data: {
    x: '',
  },
 header: { 
  'content-type': 'application/json' 
  'Cookie': 'JSESSIONID=' + wx.getStorageSync('cookieKey')
}，
  success (res) {
  }
})
```

这样就能比较简单保存小程序的登录状态。