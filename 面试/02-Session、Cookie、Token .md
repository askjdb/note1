# Session、Cookie、Token 【浅谈三者之间的那点事】

### Cookie 和 Session

HTTP 协议是一种`无状态协议`，即每次服务端接收到客户端的请求时，都是一个全新的请求，服务器并不知道客户端的历史请求记录；Session 和 Cookie 的主要目的就是为了弥补 HTTP 的无状态特性。

![img](https://ask.qcloudimg.com/http-save/yehe-7022588/v546ndidb8.png?imageView2/2/w/2560/h/7000)

**Session 是什么**

客户端请求服务端，服务端会为这次请求开辟一块`内存空间`，这个对象便是 Session 对象，存储结构为 `ConcurrentHashMap`。Session 弥补了 HTTP 无状态特性，服务器可以利用 Session 存储客户端在同一个会话期间的一些操作记录。

**Session 如何判断是否是同一会话**

服务器第一次接收到请求时，开辟了一块 Session 空间（创建了Session对象），同时生成一个 sessionId ，并通过响应头的 **Set-Cookie：JSESSIONID=XXXXXXX **命令，向客户端发送要求设置 Cookie 的响应； 客户端收到响应后，在本机客户端设置了一个 **JSESSIONID=XXXXXXX **的 Cookie 信息，该 Cookie 的过期时间为浏览器会话结束；

![img](https://ask.qcloudimg.com/http-save/yehe-7022588/fd22y7mcf1.png?imageView2/2/w/2560/h/7000)

接下来客户端每次向同一个网站发送请求时，请求头都会带上该 Cookie信息（包含 sessionId ）， 然后，服务器通过读取请求头中的 Cookie 信息，获取名称为 JSESSIONID 的值，得到此次请求的 sessionId。

**Session 的缺点**

Session 机制有个缺点，比如 A 服务器存储了 Session，就是做了[负载均衡](https://cloud.tencent.com/product/clb?from=10680)后，假如一段时间内 A 的访问量激增，会转发到 B 进行访问，但是 B 服务器并没有存储 A 的 Session，会导致 Session 的失效。

**Cookies 是什么**

![img](https://ask.qcloudimg.com/http-save/yehe-7022588/su9r55a34m.png?imageView2/2/w/2560/h/7000)

HTTP 协议中的 Cookie 包括 `Web Cookie` 和`浏览器 Cookie`，它是服务器发送到 Web 浏览器的一小块数据。服务器发送到浏览器的 Cookie，浏览器会进行存储，并与下一个请求一起发送到服务器。通常，它用于判断两个请求是否来自于同一个浏览器，例如用户保持登录状态。

- HTTP Cookie 机制是 HTTP 协议无状态的一种补充和改良

Cookie 主要用于下面三个目的

- `会话管理`

登陆、购物车、游戏得分或者服务器应该记住的其他内容

- `个性化`

用户偏好、主题或者其他设置

- `追踪`

记录和分析用户行为

Cookie 曾经用于一般的客户端存储。虽然这是合法的，因为它们是在客户端上存储数据的唯一方法，但如今建议使用现代存储 API。Cookie 随每个请求一起发送，因此它们可能会降低性能（尤其是对于移动数据连接而言）。

**创建 Cookie**

当接收到客户端发出的 HTTP 请求时，服务器可以发送带有响应的 `Set-Cookie` 标头，Cookie 通常由浏览器存储，然后将 Cookie 与 HTTP 标头一同向服务器发出请求。

**Set-Cookie 和 Cookie 标头**

`Set-Cookie` HTTP 响应标头将 cookie 从服务器发送到用户代理。下面是一个发送 Cookie 的例子

![img](https://ask.qcloudimg.com/http-save/yehe-7022588/oap79bdexv.png?imageView2/2/w/2560/h/7000)

此标头告诉客户端存储 Cookie

现在，随着对服务器的每个新请求，浏览器将使用 Cookie 头将所有以前存储的 Cookie 发送回服务器。

![img](https://ask.qcloudimg.com/http-save/yehe-7022588/qb7z1wrrgz.png?imageView2/2/w/2560/h/7000)

有两种类型的 Cookies，一种是 Session Cookies，一种是 Persistent Cookies，如果 Cookie 不包含到期日期，则将其视为会话 Cookie。会话 Cookie 存储在内存中，永远不会写入磁盘，当浏览器关闭时，此后 Cookie 将永久丢失。如果 Cookie 包含`有效期` ，则将其视为持久性 Cookie。在到期指定的日期，Cookie 将从磁盘中删除。

还有一种是 `Cookie的 Secure 和 HttpOnly 标记`，下面依次来介绍一下

**会话 Cookies**

上面的示例创建的是会话 Cookie ，会话 Cookie 有个特征，客户端关闭时 Cookie 会删除，因为它没有指定`Expires`或 `Max-Age` 指令。

但是，Web 浏览器可能会使用会话还原，这会使大多数会话 Cookie 保持永久状态，就像从未关闭过浏览器一样。

**永久性 Cookies**

永久性 Cookie 不会在客户端关闭时过期，而是在`特定日期（Expires）`或`特定时间长度（Max-Age）`外过期。例如

```javascript
Set-Cookie: id=a3fWa; Expires=Wed, 21 Oct 2015 07:28:00 GMT;
```

**Cookie 的 Secure 和 HttpOnly 标记**

安全的 Cookie 需要经过 HTTPS 协议通过加密的方式发送到服务器。即使是安全的，也不应该将敏感信息存储在cookie 中，因为它们本质上是不安全的，并且此标志不能提供真正的保护。

**HttpOnly 的作用**

-  会话 Cookie 中缺少 HttpOnly 属性会导致攻击者可以通过程序(JS脚本、Applet等)获取到用户的 Cookie 信息，造成用户 Cookie 信息泄露，增加攻击者的跨站脚本攻击威胁。 
-  HttpOnly 是微软对 Cookie 做的扩展，该值指定 Cookie 是否可通过客户端脚本访问。 
-  如果在 Cookie 中没有设置 HttpOnly 属性为 true，可能导致 Cookie 被窃取。窃取的 Cookie 可以包含标识站点用户的敏感信息，如 ASP.NET 会话 ID 或 Forms 身份验证票证，攻击者可以重播窃取的 Cookie，以便伪装成用户或获取敏感信息，进行跨站脚本攻击等。 

### Cookie 的作用域

`Domain` 和 `Path` 标识定义了 Cookie 的作用域：即 Cookie 应该发送给哪些 URL。

`Domain` 标识指定了哪些主机可以接受 Cookie。如果不指定，默认为当前主机(不包含子域名）。如果指定了`Domain`，则一般包含子域名。

例如，如果设置 `Domain=mozilla.org`，则 Cookie 也包含在子域名中（如`developer.mozilla.org`）。

例如，设置 `Path=/docs`，则以下地址都会匹配：

- `/docs`
- `/docs/Web/`
- `/docs/Web/HTTP`

### JSON Web Token 和 Session Cookies 的对比

`JSON Web Token ，简称 JWT`，它和 `Session`都可以为网站提供用户的身份认证，但是它们不是一回事。

下面是 JWT 和 Session 不同之处的研究

**JWT 和 Session Cookies 的相同之处**

在探讨 JWT 和 Session Cookies 之前，有必要需要先去理解一下它们的相同之处。

它们既可以对用户进行身份验证，也可以用来在用户单击进入不同页面时以及登陆网站或应用程序后进行身份验证。

如果没有这两者，那你可能需要在每个页面切换时都需要进行登录了。因为 HTTP 是一个无状态的协议。这也就意味着当你访问某个网页，然后单击同一站点上的另一个页面时，服务器的`内存中`将不会记住你之前的操作。

![img](https://ask.qcloudimg.com/http-save/yehe-7022588/lhogli53qd.png?imageView2/2/w/2560/h/7000)

因此，如果你登录并访问了你有权访问的另一个页面，由于 HTTP 不会记录你刚刚登录的信息，因此你将再次登录。

**JWT 和 Session Cookies 就是用来处理在不同页面之间切换，保存用户登录信息的机制。**

也就是说，这两种技术都是用来保存你的登录状态，能够让你在浏览任意受密码保护的网站。通过在每次产生新的请求时对用户数据进行身份验证来解决此问题。

所以 JWT 和 Session Cookies 的相同之处是什么？那就是它们能够支持你在发送不同请求之间，记录并验证你的登录状态的一种机制。

### 什么是 Session Cookies

Session Cookies 也称为`会话 Cookies`，在 Session Cookies 中，用户的登录状态会保存在`服务器`的`内存`中。当用户登录时，Session 就被服务端安全的创建。

在每次请求时，服务器都会从会话 Cookie 中读取 SessionId，如果服务端的数据和读取的 SessionId 相同，那么服务器就会发送响应给浏览器，允许用户登录。

![img](https://ask.qcloudimg.com/http-save/yehe-7022588/3lu5r9dimp.png?imageView2/2/w/2560/h/7000)

**token** 令牌，是用户身份的验证方式。 最简单的token组成:uid(用户唯一的[身份标识](https://cloud.tencent.com/solution/tb-digitalid?from=10680))、time（当前时间的时间戳）、sign（签名）。 **对Token认证的五点认识**

- 一个Token就是一些信息的集合；
- 在Token中包含足够多的信息，以便在后续请求中减少查询数据库的几率；
- 服务端需要对cookie和HTTP Authrorization Header进行Token信息的检查；
- 基于上一点，你可以用一套token认证代码来面对浏览器类客户端和非浏览器类客户端；
- 因为token是被签名的，所以我们可以认为一个可以解码认证通过的token是由我们系统发放的，其中带的信息是合法有效的；

**session**

- 会话，代表服务器与浏览器的一次会话过程，这个过程是连续的，也可以时断时续。
- cookie中存放着一个sessionID，请求时会发送这个ID；
- session因为请求（request对象）而产生；
- session是一个[容器](https://cloud.tencent.com/product/tke?from=10680)，可以存放会话过程中的任何对象；
- session的创建与使用总是在服务端，浏览器从来都没有得到过session对象；
- session是一种http存储机制，目的是为武装的http提供持久机制。

**cookie**

储存在用户本地终端上的数据，服务器生成，发送给浏览器，下次请求统一网站给服务器。

**cookie与session区别** cookie数据存放在客户端上，session数据放在服务器上； cookie不是很安全，且保存数据有限； session一定时间内保存在服务器上,当访问增多，占用服务器性能。

**session与token** 作为身份认证，token安全行比session好； Session 认证只是简单的把User 信息存储到Session 里，因为SID 的不可预测性，暂且认为是安全的。这是一种认证手段。 而Token ，如果指的是OAuth Token 或类似的机制的话，提供的是 认证 和 授权 ，认证是针对用户，授权是针对App 。其目的是让 某App有权利访问 某用户 的信息。

**token与cookie** Cookie是不允许垮域访问的，但是token是支持的， 前提是传输的用户认证信息通过HTTP头传输；

token就是令牌，比如你授权（登录）一个程序时，他就是个依据，判断你是否已经授权该软件；cookie就是写在客户端的一个txt文件，里面包括你登录信息之类的，这样你下次在登录某个网站，就会自动调用cookie自动登录用户名；session和cookie差不多，只是session是写在服务器端的文件，也需要在客户端写入cookie文件，但是文件里是你的浏览器编号.Session的状态是存储在服务器端，客户端只有session id；而Token的状态是存储在客户端。

HTTP协议与状态保持：Http是一个无状态协议 

- \1. 实现状态保持的方案： 

  - 1)修改Http协议，使得它支持状态保持(难做到)
  - 2)Cookies：通过客户端来保持状态信息
  - Cookie是服务器发给客户端的特殊信息
  - cookie是以文本的方式保存在客户端，每次请求时都带上它
  - 3)Session：通过服务器端来保持状态信息
  - Session是服务器和客户端之间的一系列的交互动作
  - 服务器为每个客户端开辟内存空间，从而保持状态信息
  - 由于需要客户端也要持有一个标识(id)，因此，也要求服务器端和客户端传输该标识，
  - 标识(id)可以借助Cookie机制或者其他的途径来保存

- \2. 

  COOKIE

  机制 

  - 1)Cookie的基本特点
  - Cookie保存在客户端
  - 只能保存字符串对象，不能保存对象类型
  - 需要客户端浏览器的支持：客户端可以不支持，浏览器用户可能会禁用Cookie
  - 2)采用Cookie需要解决的问题

- Cookie的创建 

  - 通常是在服务器端创建的(当然也可以通过javascript来创建)
  - 服务器通过在http的响应头加上特殊的指示，那么浏览器在读取这个指示后就会生成相应的cookie了

- Cookie存放的内容 

  - 业务信息("key","value")
  - 过期时间
  - 域和路径
  - 浏览器是如何通过Cookie和服务器通信？
  - 通过请求与响应，cookie在服务器和客户端之间传递
  - 每次请求和响应都把cookie信息加载到响应头中；依靠cookie的key传递。

- \3. 

  COOKIE

  编程 

  - 1)Cookie类　　
  - Servlet API封装了一个类：javax.servlet.http.Cookie，封装了对Cookie的操作，包括：　　 

```javascript
public Cookie(String name, String value) //构造方法，用来创建一个Cookie
HttpServletRequest.getCookies() //从Http请求中可以获取Cookies
HttpServletResponse.addCookie(Cookie) //往Http响应添加Cookie
public int getMaxAge() //获取Cookie的过期时间值
public void setMaxAge(int expiry) //设置Cookie的过期时间值
```

复制

- 2)Cookie的创建 
  - Cookie是一个名值对(key=value)，而且不管是key还是value都是字符串　　

```javascript
如： Cookie visit = new Cookie("visit", "1");
```

复制

- 3)Cookie的类型——过期时间 
  - 会话Cookie　　
  - Cookie.setMaxAge(-1);//负整数　　
  - 保存在浏览器的内存中，也就是说关闭了浏览器，cookie就会丢失　　
  - 普通cookie　　
  - Cookie.setMaxAge(60);//正整数，单位是秒　　
  - 表示浏览器在1分钟内不继续访问服务器，Cookie就会被过时失效并销毁(通常保存在文件中)　　

注意：

```javascript
cookie.setMaxAge(0);//等价于不支持Cookie；
```

复制

- 4.

   SESSION

  机制 

  - 每次客户端发送请求，服务断都检查是否含有sessionId。　　
  - 如果有，则根据sessionId检索出session并处理；如果没有，则创建一个session，并绑定一个不重复的sessionId。　　
  - 1)基本特点　　 
    - 状态信息保存在服务器端。这意味着安全性更高　　　　
    - 通过类似与Hashtable的数据结构来保存　　　　
    - 能支持任何类型的对象(session中可含有多个对象)　　　　
  - 2)保存会话id的技术(1)　　
  - Cookie　　 
    - 这是默认的方式，在客户端与服务器端传递JSeesionId　　　　
    - 缺点：客户端可能禁用Cookie　　　　
    - 表单隐藏字段　　　　
    - 在被传递回客户端之前，在 form 里面加入一个hidden域，设置JSeesionId：　　　　

```javascript
<input type=hidden name=jsessionid value="3948E432F90932A549D34532EE2394" />
```

复制

- URL重写 
  - 直接在URL后附加上session id的信息　　
  - HttpServletResponse对象中，提供了如下的方法：　　

```javascript
encodeURL(url); //url为相对路径
```

复制

- \5. 

  SESSION

  编程 

  - 1)HttpSession接口　　 
    - Servlet API定义了接口：javax.servlet.http.HttpSession， Servlet容器必须实现它，用以跟踪状态。　　　　
    - 当浏览器与Servlet容器建立一个http会话时，容器就会通过此接口自动产生一个HttpSession对象　　　　
  - 2)获取Session　　 

```javascript
HttpServletRequest对象获取session，返回HttpSession：
request.getSession(); # 表示如果session对象不存在，就创建一个新的会话
request.getSession(true); # 等价于上面这句；如果session对象不存在，就创建一个新的会话
request.getSession(false); # 表示如果session对象不存在就返回 null，不会创建新的会话对象
```

复制

- 3)Session存取信息

```javascript
session.setAttribute(String name,Object o) # 往session中保存信息
Object session.getAttribute(String name) # 从session对象中根据名字获取信息
```

复制

- 4)设置Session的有效时间 
  - public void setMaxInactiveInterval(int interval)　　
  - 设置最大非活动时间间隔，单位秒；　　
  - 如果参数interval是负值，表示永不过时。零则是不支持session。　　
  - 通过配置web.xml来设置会话超时，单位是分钟　　

```javascript
<seesion-config>
<session-timeout>1</session-timeout>
</session-config>
```

复制

允许两种方式并存，但前者优先级更高

- 5)其他常用的API

```javascript
HttpSession.invalidate() # 手工销毁Session
boolean HttpSession.isNew() # 判断Session是否新建
如果是true，表示服务器已经创建了该session，但客户端还没有加入(还没有建立会话的握手)
HttpSession.getId() # 获取session的id
```

复制

- 6). 两种状态跟踪机制的比较

**Cookie Session**

- 保持在客户端 保存在服务器端
- 只能保持字符串对象 支持各种类型对象
- 通过过期时间值区分Cookie的类型 需要sessionid来维护与客户端的通信
- 会话Cookie——负数 Cookie(默认)
- 普通Cookie——正数 表单隐藏字段
- 不支持Cookie——0 url重写

### 什么是 Json Web Tokens

Json Web Token 的简称就是 JWT，通常可以称为 `Json 令牌`。它是`RFC 7519` 中定义的用于`安全的`将信息作为 `Json 对象`进行传输的一种形式。JWT 中存储的信息是经过`数字签名`的，因此可以被信任和理解。可以使用 HMAC 算法或使用 RSA/ECDSA 的公用/专用密钥对 JWT 进行签名。

使用 JWT 主要用来下面两点

- `认证(Authorization)`：这是使用 JWT 最常见的一种情况，一旦用户登录，后面每个请求都会包含 JWT，从而允许用户访问该令牌所允许的路由、服务和资源。`单点登录`是当今广泛使用 JWT 的一项功能，因为它的开销很小。
- `信息交换(Information Exchange)`：JWT 是能够安全传输信息的一种方式。通过使用公钥/私钥对 JWT 进行签名认证。此外，由于签名是使用 `head` 和 `payload` 计算的，因此你还可以验证内容是否遭到篡改。

**JWT 的格式**

下面，我们会探讨一下 JWT 的组成和格式是什么

JWT 主要由三部分组成，每个部分用 `.` 进行分割，各个部分分别是

- `Header`
- `Payload`
- `Signature`

因此，一个非常简单的 JWT 组成会是下面这样

![img](https://ask.qcloudimg.com/http-save/yehe-7022588/ebdlw0iodk.png?imageView2/2/w/2560/h/7000)

然后我们分别对不同的部分进行探讨。

**Header**

Header 是 JWT 的标头，它通常由两部分组成：`令牌的类型(即 JWT)`和使用的 `签名算法`，例如 HMAC SHA256 或 RSA。

例如

```javascript
{
  "alg": "HS256",
  "typ": "JWT"
}
```

复制

指定类型和签名算法后，Json 块被 `Base64Url` 编码形成 JWT 的第一部分。

**Payload**

Token 的第二部分是 `Payload`，Payload 中包含一个声明。声明是有关实体（通常是用户）和其他数据的声明。共有三种类型的声明：**registered, public 和 private** 声明。

- `registered 声明`： 包含一组建议使用的预定义声明，主要包括

| ISS                   | 签发人   |
| :-------------------- | :------- |
| iss (issuer)          | 签发人   |
| exp (expiration time) | 过期时间 |
| sub (subject)         | 主题     |
| aud (audience)        | 受众     |
| nbf (Not Before)      | 生效时间 |
| iat (Issued At)       | 签发时间 |
| jti (JWT ID)          | 编号     |

- `public 声明`：公共的声明，可以添加任何的信息，一般添加用户的相关信息或其他业务需要的必要信息，但不建议添加敏感信息，因为该部分在客户端可解密。
- `private 声明`：自定义声明，旨在在同意使用它们的各方之间共享信息，既不是注册声明也不是公共声明。

例如

```javascript
{
  "sub": "1234567890",
  "name": "John Doe",
  "admin": true
}
```

复制

然后 payload Json 块会被`Base64Url` 编码形成 JWT 的第二部分。

**signature**

JWT 的第三部分是一个签证信息，这个签证信息由三部分组成

- header (base64后的)
- payload (base64后的)
- secret

比如我们需要 HMAC SHA256 算法进行签名

```javascript
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret)
```

复制

签名用于验证消息在此过程中没有更改，并且对于使用私钥进行签名的令牌，它还可以验证 JWT 的发送者的真实身份

**拼凑在一起**

现在我们把上面的三个由点分隔的 Base64-URL 字符串部分组成在一起，这个字符串可以在 HTML 和 HTTP 环境中轻松传递这些字符串。

下面是一个完整的 JWT 示例，它对 header 和 payload 进行编码，然后使用 signature 进行签名

```javascript
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ
```

复制

![img](https://ask.qcloudimg.com/http-save/yehe-7022588/o401vy1pn.png?imageView2/2/w/2560/h/7000)

如果想自己测试编写的话，可以访问 JWT [官网](https://jwt.io/#debugger-io) 

### JWT 和 Session Cookies 的不同

JWT 和 Session Cookies 都提供安全的用户身份验证，但是它们有以下几点不同

**密码签名**

JWT 具有加密签名，而 Session Cookies 则没有。

**JSON 是无状态的**

JWT 是`无状态`的，因为声明被存储在`客户端`，而不是服务端内存中。

身份验证可以在`本地`进行，而不是在请求必须通过服务器数据库或类似位置中进行。 这意味着可以对用户进行多次身份验证，而无需与站点或应用程序的数据库进行通信，也无需在此过程中消耗大量资源。

**可扩展性**

Session Cookies 是存储在服务器内存中，这就意味着如果网站或者应用很大的情况下会耗费大量的资源。由于 JWT 是无状态的，在许多情况下，它们可以节省服务器资源。因此 JWT 要比 Session Cookies 具有更强的`可扩展性`。

**JWT 支持跨域认证**

Session Cookies 只能用在`单个节点的域`或者它的`子域`中有效。如果它们尝试通过第三个节点访问，就会被禁止。如果你希望自己的网站和其他站点建立安全连接时，这是一个问题。

使用 JWT 可以解决这个问题，使用 JWT 能够通过`多个节点`进行用户认证，也就是我们常说的`跨域认证`。

### JWT 和 Session Cookies 的选型

我们上面探讨了 JWT 和 Cookies 的不同点，相信你也会对选型有了更深的认识，大致来说 

对于只需要登录用户并访问存储在站点数据库中的一些信息的中小型网站来说，Session Cookies 通常就能满足。

如果你有企业级站点，应用程序或附近的站点，并且需要处理大量的请求，尤其是第三方或很多第三方（包括位于不同域的API），则 JWT 显然更适合。