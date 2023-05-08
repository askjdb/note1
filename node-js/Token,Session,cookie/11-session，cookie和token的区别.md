

# 一文搞懂Cookie、Session 和 Token

前后端交互过程中常用到的3大角色：Cookie、Session、Token，平常使用时总有一些小伙伴容易混淆，或者不知道他们的特性，系统设计时该用哪个，今天来详细聊聊。

我们都知道HTTP 协议是一种无状态协议，即每次服务端接收到客户端的请求时，都是一个全新的请求，服务器并不知道客户端的历史请求记录；早期Session 和 Cookie 的出现主要目的就是为了弥补 HTTP 的无状态特性。

# Session 是什么

客户端请求服务端，服务端会为这次请求开辟一块内存空间，这个对象便是 Session 对象，存储结构为 ConcurrentHashMap。Session 弥补了 HTTP 无状态特性，服务器可以利用 Session 存储客户端在同一个会话期间的一些操作记录。

### Session 如何判断是否是同一会话

服务器第一次接收到请求时，开辟了一块 Session 空间（创建了Session对象），同时生成一个 sessionId ，并通过响应头的 **Set-Cookie：JSESSIONID=XXXXXXX** 命令，向客户端发送要求设置 Cookie 的响应； 客户端收到响应后，在本机客户端设置了一个 **JSESSIONID=XXXXXXX** 的 Cookie 信息，该 Cookie 的过期时间为浏览器会话结束；

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b89077bbb637485fbf7877418d40051d~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp?)

接下来客户端每次向同一个网站发送请求时，请求头都会带上该 Cookie信息（包含 sessionId ）， 然后，服务器通过读取请求头中的 Cookie 信息，获取名称为 JSESSIONID 的值，得到此次请求的 sessionId。

### Session 的缺点

- 服务器压力大： 通常Session是存储在内存中的，每个用户通过认证之后都会将session数据保存在服务器的内存中，而当用户量增大时，服务器的压力增大。
- 扩展性： 在分布式集群中，用户的每次请求可能会落到不同的服务器上，因此就会存在session共享的问题。虽然可以将session统一保存到Redis中，但是这样做无疑增加了系统的复杂性，对于不需要redis的应用也会白白多引入一个缓存中间件
- session认证本质上是基于cookie，而cookie无法跨域，所以session的认证也无法跨域，对单点登录不适用
- CSRF跨站伪造请求攻击：Session机制是基于浏览器端的cookie的，cookie如果被截获，用户就会很容易受到跨站请求伪造的攻击。

# Cookies 是什么

HTTP 协议中的 Cookie 包括 Web Cookie 和浏览器 Cookie，它是服务器发送到 Web 浏览器的一小块数据。服务器发送到浏览器的 Cookie，浏览器会进行存储，并与下一个请求一起发送到服务器。通常，它用于判断两个请求是否来自于同一个浏览器，例如用户保持登录状态。

HTTP Cookie 机制是 HTTP 协议无状态的一种补充和改良

Cookie 主要用于下面三个目的

- 会话管理 登陆、购物车、游戏得分或者服务器应该记住的其他内容
- 个性化 用户偏好、主题或者其他设置
- 追踪 记录和分析用户行为

Cookie 曾经用于一般的客户端存储。虽然这是合法的，因为它们是在客户端上存储数据的唯一方法，但如今建议使用现代存储 API。Cookie 随每个请求一起发送，因此它们可能会降低性能（尤其是对于移动数据连接而言）。

创建 Cookie 当接收到客户端发出的 HTTP 请求时，服务器可以发送带有响应的 Set-Cookie 标头，Cookie 通常由浏览器存储，然后将 Cookie 与 HTTP 标头一同向服务器发出请求。

Set-Cookie 和 Cookie 标头 Set-Cookie HTTP 响应标头将 cookie 从服务器发送到用户代理。下面是一个发送 Cookie 的例子

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4b59f6f3136c43639e3d4ef414e6c983~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp?)

此标头告诉客户端存储 Cookie

现在，随着对服务器的每个新请求，浏览器将使用 Cookie 头将所有以前存储的 Cookie 发送回服务器。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/507dbf4909d44ac3a6a2569859712221~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp?)

有两种类型的 Cookies，一种是 Session Cookies，一种是 Persistent Cookies，如果 Cookie 不包含到期日期，则将其视为会话 Cookie。会话 Cookie 存储在内存中，永远不会写入磁盘，当浏览器关闭时，此后 Cookie 将永久丢失。如果 Cookie 包含有效期 ，则将其视为持久性 Cookie。在到期指定的日期，Cookie 将从磁盘中删除。

还有一种是 Cookie的 Secure 和 HttpOnly 标记，下面依次来介绍一下

### 会话 Cookies

上面的示例创建的是会话 Cookie ，会话 Cookie 有个特征，客户端关闭时 Cookie 会删除，因为它没有指定Expires或 Max-Age 指令。

但是，Web 浏览器可能会使用会话还原，这会使大多数会话 Cookie 保持永久状态，就像从未关闭过浏览器一样。

### 永久性 Cookies

永久性 Cookie 不会在客户端关闭时过期，而是在特定日期（Expires）或特定时间长度（Max-Age）外过期。例如

```ini
 Set-Cookie: id=a3fWa; Expires=Wed, 21 Oct 2015 07:28:00 GMT;
复制代码
```

### Cookie 的 Secure 和 HttpOnly 标记

安全的 Cookie 需要经过 HTTPS 协议通过加密的方式发送到服务器。即使是安全的，也不应该将敏感信息存储在cookie 中，因为它们本质上是不安全的，并且此标志不能提供真正的保护。

HttpOnly 的作用

- 会话 Cookie 中缺少 HttpOnly 属性会导致攻击者可以通过程序(JS脚本、Applet等)获取到用户的 Cookie 信息，造成用户 Cookie 信息泄露，增加攻击者的跨站脚本攻击威胁。
- HttpOnly 是微软对 Cookie 做的扩展，该值指定 Cookie 是否可通过客户端脚本访问。
- 如果在 Cookie 中没有设置 HttpOnly 属性为 true，可能导致 Cookie 被窃取。窃取的 Cookie 可以包含标识站点用户的敏感信息，如 ASP.NET 会话 ID 或 Forms 身份验证票证，攻击者可以重播窃取的 Cookie，以便伪装成用户或获取敏感信息，进行跨站脚本攻击等。

### Cookie 的作用域

Domain 和 Path 标识定义了 Cookie 的作用域：即 Cookie 应该发送给哪些 URL。

Domain 标识指定了哪些主机可以接受 Cookie。如果不指定，默认为当前主机(不包含子域名）。如果指定了Domain，则一般包含子域名。

例如，如果设置 Domain=aaa.org，则 Cookie 也包含在子域名中（如developer.aaa.org）。

例如，设置 Path=/docs，则以下地址都会匹配：

- /docs
- /docs/Web/
- /docs/Web/HTTP

# Token 是什么

Json Web Token 的简称是 JWT，通常可以称为 Json 令牌。它是RFC 7519 中定义的用于安全的将信息作为 Json 对象进行传输的一种形式。JWT 中存储的信息是经过数字签名的，因此可以被信任和理解。可以使用 HMAC 算法或使用 RSA/ECDSA 的公用/专用密钥对 JWT 进行签名。

使用 JWT 主要用来下面两点

- 认证(Authorization)：这是使用 JWT 最常见的一种情况，一旦用户登录，后面每个请求都会包含 JWT，从而允许用户访问该令牌所允许的路由、服务和资源。单点登录是当今广泛使用 JWT 的一项功能，因为它的开销很小。
- 信息交换(Information Exchange)：JWT 是能够安全传输信息的一种方式。通过使用公钥/私钥对 JWT 进行签名认证。此外，由于签名是使用 head 和 payload 计算的，因此你还可以验证内容是否遭到篡改。

### JWT 的格式

下面，我们会探讨一下 JWT 的组成和格式是什么

JWT 主要由三部分组成，每个部分用 . 进行分割，各个部分分别是

- Header
- Payload
- Signature

因此，一个非常简单的 JWT 组成会是下面这样

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6a95a149c56946e3afe58f23dfca6a4e~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp?)

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ

复制代码
```

###### Header

Header 是 JWT 的标头，它通常由两部分组成：令牌的类型(即 JWT)和使用的 签名算法，例如 HMAC SHA256 或 RSA。

JWT的头部承载两个信息：

- 声明类型，这里是JWT

- 声明加密的算法

完整的头部就像下面这样的JSON：

```arduino
{ 
    'typ': 'JWT', 
    'alg': 'HS256' 
}
复制代码
```

然后将头部进行Base64编码（该编码是可以对称解码的），构成了第一部分。

```
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9
复制代码
```

###### Payload

Token 的第二部分是 Payload，Payload 中包含一个声明。声明是有关实体（通常是用户）和其他数据的声明。共有三种类型的声明：registered, public 和 private 声明。

- registered 声明： 包含一组建议使用的预定义声明，主要包括

```lua
iss：令牌颁发者。表示该令牌由谁创建，该声明是一个字符串
sub: Subject Identifier，iss提供的终端用户的标识，在iss范围内唯一，最长为255个ASCII个字符，区分大小写
aud：Audience(s)，令牌的受众，分大小写的字符串数组
exp：Expiration time，令牌的过期时间戳。超过此时间的token会作废， 该声明是一个整数，是1970年1月1日以来的秒数
iat: 令牌的颁发时间，该声明是一个整数，是1970年1月1日以来的秒数
jti: 令牌的唯一标识，该声明的值在令牌颁发者创建的每一个令牌中都是唯一的，为了防止冲突，它通常是一个密码学随机值。这个值相当于向结构化令牌中加入了一个攻击者无法获得的随机熵组件，有利于防止令牌猜测攻击和重放攻击。
复制代码
```

- public 声明：公共的声明，可以添加任何的信息，一般添加用户的相关信息或其他业务需要的必要信息，但不建议添加敏感信息，因为该部分在客户端可解密。
- private 声明：自定义声明，旨在在同意使用它们的各方之间共享信息，既不是注册声明也不是公共声明。 例如:

```json
{
    "sub": "1234567890",
    "name": "John Doe" 
}
复制代码
```

然后将其进行Base64编码，得到Jwt的第二部分：

```
JTdCJTBBJTIwJTIwJTIyc3ViJTIyJTNBJTIwJTIyMTIzNDU2Nzg5MCUyMiUyQyUwQSUyMCUyMCUyMm5hbWUlMjIlM0ElMjAlMjJKb2huJTIwRG9lJTIyJTBBJTdE
复制代码
```

###### Signature

这个部分需要Base64编码后的Header和Base64编码后的Payload使用 . 连接组成的字符串，然后通过Header中声明的加密方式进行加密（$secret 表示用户的私钥），然后就构成了jwt的第三部分。

```ini
// javascript
var encodedString = base64UrlEncode(header) + '.' + base64UrlEncode(payload);
var signature = HMACSHA256(encodedString, '$secret');
复制代码
```

将这三部分用 `.` 连接成一个完整的字符串，就构成了开始的JWT示例。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/82231ebd79db459fa1233540c85432b2~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp?)

###### 基于token的常用认证方案

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eb56ef626e7f4c65a72a5b1d6bb015ed~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp?)

上图是API网关利用JWT实现认证的整个业务流程时序图，下面我们用文字来详细描述图中标注的步骤：

1. 客户端向API网关发起认证请求，请求中一般会携带终端用户的用户名和密码；

1. API网关将请求直接转发给后端服务；

1. 后端服务读取请求中的验证信息（比如用户名、密码）进行验证，验证通过后使用私钥生成标准的token，返回给API网关；

1. API网关将携带token的应答返回给客户端，客户端需要将这个token缓存到本地；

1. 客户端向API网关发送业务请求，请求中携带token；

1. API网关使用用户设定的公钥对请求中的token进行验证，验证通过后，将请求透传给后端服务；

1. 后端服务进行业务处理后应答；

1. API网关将业务应答返回给客户端。

在这个整个过程中，API网关利用token认证机制，实现了用户使用自己的用户体系对自己API进行授权的能力。

### Token 的特点

- JWT 默认是不加密，不能将秘密数据写入 JWT。
- JWT 不仅可以用于认证，也可以用于交换信息。有效使用 JWT，可以降低服务器查询数据库的次数。
- JWT 的最大缺点是，由于服务器不保存 session 状态，因此无法在使用过程中废止某个 token，或者更改 token 的权限。也就是说，一旦 JWT 签发了，在到期之前就会始终有效，除非服务器部署额外的逻辑。
- JWT 本身包含了认证信息，一旦泄露，任何人都可以获得该令牌的所有权限。为了减少盗用，JWT 的有效期应该设置得比较短。对于一些比较重要的权限，使用时应该再次对用户进行认证。
- 为了减少盗用，JWT 不应该使用 HTTP 协议明码传输，要使用HTTPS 协议传输。
- Session 是存储在服务器内存中，这就意味着如果网站或者应用很大的情况下会耗费大量的资源。由于 JWT 是无状态的，在许多情况下，它们可以节省服务器资源。因此 JWT 要比 Session Cookies 具有更强的可扩展性
- Session Cookies 只能用在单个节点的域或者它的子域中有效。如果它们尝试通过第三个节点访问，就会被禁止。如果你希望自己的网站和其他站点建立安全连接时，这是一个问题。使用 JWT 可以解决这个问题，使用 JWT 能够通过多个节点进行用户认证，也就是我们常说的跨域认证。
- 避免CSRF跨站伪造攻击，还是因为不依赖cookie；

# 后记

通过上面的特性比较，相信大家对选型有了更深的认识，大致来说

对于只需要登录用户并访问存储在站点数据库中的一些信息的中小型网站来说，Session Cookies 通常就能满足。

如果你有企业级站点，客户端应用程序或附近的站点，并且需要处理大量的请求，尤其是第三方或很多第三方（包括位于不同域的API），则 JWT 显然更适合。



# **session，cookie和token究竟是什么**

## **简述**

cookie，session，token作为面试必问题，很多同学能答个大概，但是又迷糊不清，希望本篇文章对大家有所帮助

## **http是一个无状态协议**

什么是无状态呢？就是说这一次请求和上一次请求是没有任何关系的，互不认识的，没有关联的。这种无状态的的好处是快速。

## **cookie和session**

由于http的无状态性，为了使某个[域名](https://cloud.tencent.com/act/pro/domain-sales?from=10680)下的所有网页能够共享某些数据，session和cookie出现了。客户端访问服务器的流程如下

- 首先，客户端会发送一个http请求到服务器端。
- 服务器端接受客户端请求后，建立一个session，并发送一个http响应到客户端，这个响应头，其中就包含Set-Cookie头部。该头部包含了sessionId。Set-Cookie格式如下，具体请看Cookie详解 `Set-Cookie: value[; expires=date][; domain=domain][; path=path][; secure]`
- 在客户端发起的第二次请求，假如服务器给了set-Cookie，浏览器会自动在请求头中添加cookie
- 服务器接收请求，分解cookie，验证信息，核对成功后返回response给客户端

![img](https://ask.qcloudimg.com/http-save/yehe-6864425/tb8nwm0013.png?imageView2/2/w/1620)

### **注意**

- cookie只是实现session的其中一种方案。虽然是最常用的，但并不是唯一的方法。禁用cookie后还有其他方法存储，比如放在url中
- 现在大多都是Session + Cookie，但是只用session不用cookie，或是只用cookie，不用session在理论上都可以保持会话状态。可是实际中因为多种原因，一般不会单独使用
- 用session只需要在客户端保存一个id，实际上大量数据都是保存在服务端。如果全部用cookie，数据量大的时候客户端是没有那么多空间的。
- 如果只用cookie不用session，那么账户信息全部保存在客户端，一旦被劫持，全部信息都会泄露。并且客户端数据量变大，网络传输的数据量也会变大

### **cookie和session通俗小结**

简而言之, session 有如用户信息档案表, 里面包含了用户的认证信息和登录状态等信息. 而 cookie 就是用户通行证

## **token定义**

token 也称作令牌，由uid+time+sign[+固定参数] token 的认证方式类似于临时的证书签名, 并且是一种服务端无状态的认证方式, 非常适合于 REST API 的场景. 所谓无状态就是服务端并不会保存身份认证相关的数据。

### **token组成**

- uid: 用户唯一[身份标识](https://cloud.tencent.com/solution/tb-digitalid?from=10680)
- time: 当前时间的时间戳
- sign: 签名, 使用 hash/encrypt 压缩成定长的十六进制字符串，以防止第三方恶意拼接
- 固定参数(可选): 将一些常用的固定参数加入到 token 中是为了避免重复查库

### **存放**

token在客户端一般存放于localStorage，cookie，或sessionStorage中。在服务器一般存于数据库中

### **token认证流程**

token 的认证流程与cookie很相似

- 用户登录，成功后服务器返回Token给客户端。
- 客户端收到数据后保存在客户端
- 客户端再次访问服务器，将token放入headers中
- 服务器端采用filter过滤器校验。校验成功则返回请求数据，校验失败则返回错误码

## **token可以抵抗csrf，cookie+session不行**

因为form 发起的 POST 请求并不受到浏览器同源策略的限制，因此可以任意地使用其他域的 Cookie 向其他域发送 POST 请求，形成 CSRF 攻击。在post请求的瞬间，cookie会被浏览器自动添加到请求头中。但token不同，token是开发者为了防范csrf而特别设计的令牌，浏览器不会自动添加到headers里，攻击者也无法访问用户的token，所以提交的表单无法通过服务器过滤，也就无法形成攻击。

## **分布式情况下的session和token**

我们已经知道session时有状态的，一般存于服务器内存或硬盘中，当服务器采用分布式或集群时，session就会面对负载均衡问题。

- 负载均衡多服务器的情况，不好确认当前用户是否登录，因为多服务器不共享session。这个问题也可以将session存在一个服务器中来解决，但是就不能完全达到负载均衡的效果。当今的几种解决session负载均衡的方法。

而token是无状态的，token字符串里就保存了所有的用户信息

- 客户端登陆传递信息给服务端，服务端收到后把用户信息加密（token）传给客户端，客户端将token存放于localStroage等[容器](https://cloud.tencent.com/product/tke?from=10680)中。客户端每次访问都传递token，服务端解密token，就知道这个用户是谁了。通过cpu加解密，服务端就不需要存储session占用存储空间，就很好的解决负载均衡多服务器的问题了。这个方法叫做JWT(Json Web Token)

## **总结**

- session存储于服务器，可以理解为一个状态列表，拥有一个唯一识别符号sessionId，通常存放于cookie中。服务器收到cookie后解析出sessionId，再去session列表中查找，才能找到相应session。依赖cookie
- cookie类似一个令牌，装有sessionId，存储在客户端，浏览器通常会自动添加。
- token也类似一个令牌，无状态，用户信息都被加密到token中，服务器收到token后解密就可知道是哪个用户。需要开发者手动添加。
- jwt只是一个跨域认证的方案

**补充:JWT**

JWT就是token的一种实现方式，并且基本是java web领域的事实标准。

JWT全称是JSON Web Token。基本可以看出是使用JSON格式传输token

JWT 由 3 部分构成:

Header :描述 JWT 的元数据。定义了生成签名的算法以及 Token 的类型。Payload（负载）:用来存放实际需要传递的数据Signature（签名）：服务器通过Payload、Header和一个密钥(secret)使用 Header 里面指定的签名算法（默认是 HMAC SHA256）生成。流程：

在基于 Token 进行身份验证的的应用程序中，用户登录时，服务器通过Payload、Header和一个密钥(secret)创建令牌（Token）并将 Token 发送给客户端，

然后客户端将 Token 保存在 Cookie 或者 localStorage 里面，以后客户端发出的所有请求都会携带这个令牌。你可以把它放在 Cookie 里面自动发送，但是这样不能跨域，所以更好的做法是放在 HTTP Header 的 Authorization字段中：Authorization: 你的Token。