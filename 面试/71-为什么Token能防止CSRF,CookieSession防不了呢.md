# Cookie、Session与Token、JWT及CSRF攻击

由于HTTP是一种无状态的协议，所以当我打开淘宝，登录后，点击跳转结账（另一个页面），服务器端就不知道现在发请求的是不是我了，就得让我再次登录来确认身份。所以每一次请求的发生都是全新的，那么就需要一个来记录身份并且验证的东西，相对于通行证一样。这就需要**会话跟踪**，Cookie和Session就是起这个作用，会话跟踪参考[四种会话跟踪](https://link.juejin.cn?target=https%3A%2F%2Fsegmentfault.com%2Fa%2F1190000025183410)

## Cookie和Session流程

- 客户端首次发出请求，服务器端收到后开辟一块 Session 空间（创建了Session对象），同时生成一个 sessionId ，并通过响应头的 **Set-Cookie：JSESSIONID=XXXXXXX **命令，向客户端发送要求设置 Cookie 的响应；
- 客户端收到响应后，在本机客户端设置了一个 **JSESSIONID=XXXXXXX **的 Cookie 信息，该 Cookie 的过期时间为浏览器会话结束；
- 后面每次客户端请求，都会携带Cookie信息，服务器端收到Cookie，会根据JSESSIONID是否一致去确认是否为本人。 [参考1](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Fqq_28296925%2Farticle%2Fdetails%2F80921585%3Fops_request_misc%3D%257B%2522request%255Fid%2522%253A%2522162328488516780366533414%2522%252C%2522scm%2522%253A%252220140713.130102334..%2522%257D%26request_id%3D162328488516780366533414%26biz_id%3D0%26utm_medium%3Ddistribute.pc_search_result.none-task-blog-2~all~sobaiduend~default-2-80921585.first_rank_v2_pc_rank_v29%26utm_term%3Dcookiesession%26spm%3D1018.2226.3001.4187) [参考2](https://link.juejin.cn?target=https%3A%2F%2Fcxuan.blog.csdn.net%2Farticle%2Fdetails%2F105322171)

## Token

cookie和session实际上是同一套认证流程，相辅相成。session保存在服务器，cookie保存在客户端。最常见的做法就是客户端的cookie仅仅保存一个sessionID，这个sessionID是一个毫无规则的随机数，由服务器在客户端登录通过后随机生产的。往后，客户端每次访问该网站都要带上这个由sessionID组成的cookie。服务器收到请求，首先拿到客户端的sessionID，然后从服务器内存中查询它所代表的客户端(用户名，用户组，有哪些权限等)。

与token相比，这里的重点是，服务器必须保存sessionID以及该ID所代表的客户端信息。这些内容可以保存在内存，也可以保存到数据库(通常是内存数据库)。

而token则可以服务器完全不用保存任何登录信息。

token的流程是这样的。客户端登录通过后，服务器生成一堆客户端身份信息，包括用户名、用户组、有那些权限、过期时间等等。另外再对这些信息进行签名。之后把身份信息和签名作为一个整体传给客户端。这个整体就叫做token。之后，客户端负责保存该token，而服务器不再保存。客户端每次访问该网站都要带上这个token。服务器收到请求后，把它分割成身份信息和签名，然后验证签名，若验证成功，就直接使用身份信息(用户名、用户组、有哪些权限等等)。

可以看出，相对于cookie/session机制，token机制中，服务器根本不需要保存用户的身份信息(用户名、用户组、权限等等)。这样就减轻了服务器的负担。

我们举个例来说，假如目前有一千万个用户登录了，在访问不同的网页。如果用cookie/session，则服务器内存(或内存数据库)中要同时记录1千万个用户的信息。每次客户端访问一个页面，服务器都要从内存中查询出他的登录信息。而如果用token，则服务器内存中不记录用户登录信息。它只需要在收到请求后，直接使用客户端发过来的登录身份信息。

可以这么说，cookie/session是服务器说客户端是谁，客户端才是谁。而token是客户端说我(客户端)是谁，我就是谁。当然了，token是有签名机制的。要是客户端伪造身份，签名通不过。这个签名算法很简单，就是将客户端的身份信息加上一个只有服务器知道的盐值(不能泄露)，然后进行md5散列算法(这里只是简化，方便理解，实际细节要稍复杂一些)。

cookie/session在单服务器，单域名时比较简单，否则的话，就要考虑如何将客户端的session保存或同步到多个服务器。还要考虑一旦宕机，内存中的这些信息是否会丢失。token因为服务器不保存用户身份，就不存在这个问题。这是token的优点。

token因为服务器不保存用户身份信息，一切都依赖当初那个签名。所以存在被盗用的风险。也就是说一旦盗用，服务器可能毫无办法，因为它只认签名算法。而session机制，服务器看谁不爽，可以随时把他踢出(从内存中删掉)。正是因为如此，token高度依赖过期时间。过期时间不能太长。过期短，可以减少被盗用的风险。

除了上面所说的，如果开发的系统足够小，倾向于使用cookie/session。如果系统同时登录用户多，集群服务器多，有单点登录需求，则倾向于使用token。

token相关转载原文链接：[blog.csdn.net/jmlqqs/arti…](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Fjmlqqs%2Farticle%2Fdetails%2F103632221)

## CSRF

参考[美团的文章](https://link.juejin.cn?target=https%3A%2F%2Ftech.meituan.com%2F2018%2F10%2F11%2Ffe-security-csrf.html) CSRF (Cross-site Request Forgery)，中文名称：跨站伪造。危害是攻击者可以盗用你的身份，以你的名义发送恶意请求。比如可以盗取你的账号，以你的身份发送邮件，购买商品等。 ![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/47f4fcb913b04e608b33e179a2fd31a3~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) 即是客户端和淘宝断开连接后，但是客户端保存着淘宝给的cookie，这个记录着客户端的信息，用于确认客户端本人，但是钓鱼网站，给客户端发链接，让它点击了该链接进入一个页面，这个钓鱼页面里面可能写了如下代码：

```javascript
javascript
复制代码  <img src='http://www.taobao.com/action?k1=v1&k2=v2' width=0 height=0 />
```

这里width=0 height=0 表示图片是不可见的。这个语句会导致客户端浏览器器向另外的服务器（淘宝）发送一个请求。

因为浏览器不管该图片url实际是否指向一张图片，只要src字段中规定了url，就会按照地址触发这个请求。（浏览器默认都是没有禁止下载图片，这是因为禁用图片后大多数web程序的可用性就会打折扣）。加载图片根本不考虑所涉及的图像所在位置（可以跨域）。如果A网站不小心提供了get接口就非常不幸得中招了。[参考](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Fweixin_30716725%2Farticle%2Fdetails%2F95281064)

意思是，客户端打开了钓鱼网站，却在不知情的情况下，发送了一个请求给淘宝，这个请求有可能是转账，付款等等，因为是客户端发出的请求，所以客户端会带上自己的cookie，这样就可以请求成功。 [参考，express实现CSRF](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Fazl397985856%2Farticle%2Fdetails%2F113903915)

## 为什么Token能防止CSRF,Cookie/Session防不了呢

参考[链接](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Fbesmarterbestronger%2Farticle%2Fdetails%2F102544093%3Futm_medium%3Ddistribute.pc_relevant.none-task-blog-baidujs_title-0%26spm%3D1001.2101.3001.4242) ![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/91d8cf3bf3af451395eeac8695a99ce6~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

因为，在信任网站的HTML或js中，会向服务器传递参数token，不是通过Cookie传递的，若恶意网站要伪造用户的请求，也必须伪造这个token，否则用户身份验证不通过。但是，同源策略限制了恶意网站不能拿到信任网站的Cookie内容，只能使用，所以就算是token是存放在Cookie中的，恶意网站也无法提取出Cookie中的token数据进行伪造。也就无法传递正确的token给服务器，进而无法成功伪装成用户了。

比喻： tom在村口tony师傅开的理发店那里办了一张理发卡(Cookie)，jerry从tom那里盗取了这张理发卡之后(CSRF)，去到理发店，tony师傅在洗剪吹理发系统中(session)验证发现是自己的理发卡，那么jerry就能在tony师傅这儿剪发了。

后来，为了防止这种行为，tony师傅为理发卡增加了密码(token)，就算jerry从tom那里盗取了理发卡(CSRF)，但是jerry不知道理发卡的密码(token)，那么jerry去到理发店之后，tony师傅在洗剪吹理发系统中发现是本店的理发卡之后，还会要求jerry给出密码(token)，这样就阻止了jerry的这种行为(CSRF)。

恶意网站的js中有一些构造出来的信任网站的URL，当用户触发了这个js之后，这个用户就请求了该URL了，然后就会根据这个URL进行操作，例如修改账户里的钱，或者删除掉某些数据等，总之这是一种很不安全的行为。所以，在信任网站的js中额外传递了一个参数token（通常是根据Cookie来生成的）给后端，这个参数只有在该信任网站的页面中才能生成对应的token，而恶意网站通过构造信任网站的URL能够伪造用户的操作，但是由于同源策略的原因，恶意网站无法使用Cookie也就无法生成对应的token，无法逃避信任服务器的验证。

再结合另一篇文章[链接](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Fweixin_39740737%2Farticle%2Fdetails%2F111112191%3Futm_medium%3Ddistribute.pc_relevant_t0.none-task-blog-2~default~BlogCommendFromMachineLearnPai2~default-1.control%26depth_1-utm_source%3Ddistribute.pc_relevant_t0.none-task-blog-2~default~BlogCommendFromMachineLearnPai2~default-1.control) ![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a10540c2e1f647529cf8c73f1f52c94b~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) 一般通过session token来实现保护。当客户端请求页面时，服务器会生成一个随机数Token，并且将Token放置到session当中，然后将Token发给客户端(一般通过构造hidden表单)。下次客户端提交请求时，Token会随着表单一起提交到服务器端。接收到请求后，服务器端会对Token值进行验证，判断是否和session中的Token值相等，若相等，则可以证明请求有效，不是伪造的。

在实现One-Time Tokens时，需要注意一点：就是“并行会话的兼容”。如果用户在一个站点上同时打开了两个不同的表单，CSRF保护措施不应该影响到他对任何表单的提交。考虑一下如果每次表单被装入时站点生成一个伪随机值来覆盖以前的伪随机值将会发生什么情况：用户只能成功地提交他最后打开的表单，因为所有其他的表单都含有非法的伪随机值。必须小心操作以确保CSRF保护措施不会影响选项卡式的浏览或者利用多个浏览器窗口浏览一个站点。

另外，这里的session token机制也可用于注册或者cms文章添加等功能上，可以用来防止用户"重复提交"，相比于上面的CSRF方案是这样的：服务器端第一次验证相同过后，会将涩session中的Token值更新下，若用户重复提交，第二次的验证判断将失败，因为用户提交的表单中的Token没变，但服务器端session中Token已经改变了。

另一篇[链接](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Fweixin_39753211%2Farticle%2Fdetails%2F111112175%3Fops_request_misc%3D%26request_id%3D%26biz_id%3D102%26utm_term%3Dtoken%E4%BC%9A%E4%B8%8D%E4%BC%9A%E5%8F%91%E7%94%9Fcsrf%26utm_medium%3Ddistribute.pc_search_result.none-task-blog-2~all~sobaiduweb~default-0-.first_rank_v2_pc_rank_v29%26spm%3D1018.2226.3001.4187) ![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/24f0e9053b5a4e098bb5789220558263~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

**我的理解**是，比如要进行转账的操作，服务器端会要求客户端传递token，如果是正常的转账操作，没问题，

但是如果是点击钓鱼网站，然后触发向服务器端发出转账请求，这个请求是已经提前写好了放在钓鱼网站里面，它只能让客户端访问，取不到cookie，更取不到token，所以在请求中就明确要求写明放在cookie里面的token，就可以了

比如在银行里转账，银行页面上的转账请求链接，是银行服务器那边生成的链接，所以那边是可以在请求里面就加上你客户端的token的，但是钓鱼网站无法得到你的token，钓鱼网站仿造的转账请求链接是无法把token写入的，所以就无法生效 自己做了如下示意图 ![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b5d77bf492284a5a849677f09429313f~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) ![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6baeeb6d6660420599eb9243e50bc17e~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### 为什么使用token

token相对cookie的优势

- 无状态 基于token的验证是无状态的，这也许是它相对cookie来说最大的优点。后端服务不需要记录token。每个令牌都是独立的，包括检查其有效性所需的所有数据，并通过声明传达用户信息。

  服务器唯一的工作就是在成功的登陆请求上签署token，并验证传入的token是否有效。

- 防跨站请求伪造（CSRF） 举个CSRF攻击的例子，在网页中有这样的一个链接 [外链图片转存失败,源站可能有防盗链机制,建议将图片保存下来直接上传(img-QyqaHHTy-1623457679996)([bank.com?withdraw=1000&to=tom)\]，假设你已经通过银行的验证并且cookie中存在验证信息，同时银行网站没有CSRF保护。一旦用户点了这个图片，就很有可能从银行向tom这个人转1000块钱。](https://link.juejin.cn?target=http%3A%2F%2Fbank.com%3Fwithdraw%3D1000%26to%3Dtom)%5D%EF%BC%8C%E5%81%87%E8%AE%BE%E4%BD%A0%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%B6%E8%A1%8C%E7%9A%84%E9%AA%8C%E8%AF%81%E5%B9%B6%E4%B8%94cookie%E4%B8%AD%E5%AD%98%E5%9C%A8%E9%AA%8C%E8%AF%81%E4%BF%A1%E6%81%AF%EF%BC%8C%E5%90%8C%E6%97%B6%E9%93%B6%E8%A1%8C%E7%BD%91%E7%AB%99%E6%B2%A1%E6%9C%89CSRF%E4%BF%9D%E6%8A%A4%E3%80%82%E4%B8%80%E6%97%A6%E7%94%A8%E6%88%B7%E7%82%B9%E4%BA%86%E8%BF%99%E4%B8%AA%E5%9B%BE%E7%89%87%EF%BC%8C%E5%B0%B1%E5%BE%88%E6%9C%89%E5%8F%AF%E8%83%BD%E4%BB%8E%E9%93%B6%E8%A1%8C%E5%90%91tom%E8%BF%99%E4%B8%AA%E4%BA%BA%E8%BD%AC1000%E5%9D%97%E9%92%B1%E3%80%82)

  但是如果银行网站使用了token作为验证手段，攻击者将无法通过上面的链接转走你的钱。（因为攻击者无法获取正确的token）

- 多站点使用 cookie绑定到单个域。foo.com域产生的cookie无法被bar.com域读取。使用token就没有这样的问题。这对于需要向多个服务获取授权的单页面应用程序尤其有用。

  使用token，使得用从myapp.com获取的授权向myservice1.com和myservice2.com获取服务成为可能。

- 支持移动平台 好的API可以同时支持浏览器，iOS和Android等移动平台。然而，在移动平台上，cookie是不被支持的。

- 性能 一次网络往返时间（通过数据库查询session信息）总比做一次HMACSHA256计算的Token验证和解析要费时得多。

参考另一篇好文[segmentfault.com/a/119000002…](https://link.juejin.cn?target=https%3A%2F%2Fsegmentfault.com%2Fa%2F1190000025183410)

### token和JWT的区别

参考[链接](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Fm19123456789%2Farticle%2Fdetails%2F85010509)

相同： 都是访问资源的令牌， 都可以记录用户信息，都是只有验证成功后

区别：服务端验证客户端发来的token信息要进行数据的查询操作；JWT验证客户端发来的token信息就不用， 在服务端使用密钥校验就可以，不用数据库的查询。 评论区有用的评论如下 ![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9855a5236efe4010b864c6a89345e32b~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

#### 疑问

既然这样，之前理解的是token把用户的信息都传给客户端，服务器端不保留，这样节省空间也可以做到负载均衡后依旧生效，但是这里又说token同样也存在了服务器端，所以token和session到底有什么区别呢，不都存在了服务器端嘛，就想下面评论区的问题一样 ![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d9242c4a7514489f9b31f74f65497464~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) 这个时候，再回去看一下token的定义： ![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/81749e2927fc40e99ecc2bdf11876e35~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) 这下就彻底清楚了，来理一下思路

## cookie/session 、 token 、JWT总结

**session**：

session在服务器端保存的是客户端所有的信息，包括sessionID、用户名、密码、权限等等，所以用cookie+session的方式，每次客户端请求，cookie携带的只是sessionID，但是服务器端却保存了大量用户的sessionID、用户名、密码等信息，验证过程也是通过比较sessionID，如果用户过多，就给服务器造成很大压力，因为保存了太多用户的完整信息。

***为了缓解服务器压力**，并且预防CSRF攻击，所以**用token***

**token**

token，改变思路，让每个客户端，自己携带自己的完整信息，然后服务器再给你个签名再保存这个签名在服务器用来下次验证，每次客户端请求，都携带自己的完整信息（用户名、密码、权限等）和一个签名，服务器端拿到后，分出信息和签名，取出签名，和存在服务器端的签名库进行对比，通过就用这次传过来的信息，

所以，这种方式，服务器只保存了每个客户端的签名，这一个信息，而之前的session则是保存了全部信息，相比之下，服务器的压力大大减小

*那么JWT（JSON Web Token）和token的区别呢* 首先说到底，token和session只是服务器端保存的数据量减少，但服务器端依旧是要保存客户端的相关信息的，那么如果网站新开一个服务器，还得把原先服务器的用户数据给拷贝一份，当然这是没用数据库的情况下，那么有什么办法可以不拷贝一份吗，这就要用到JWT了 token相对于是服务器端也要保留给每一个用户的那个签名，每次用户的客户端发送信息过来，服务器端分离出签名，与存在服务器上的签名进行对比来确认身份，但是JWT就是只要是能通过服务器私钥解密的就认为是合法的客户端，所以不用保存每个用户的签名信息

**JWT（JSON Web Token）**

JWT 是能够安全传输信息的一种方式。通过使用公钥/私钥对 JWT 进行签名认证。此外，由于签名是使用 head 和 payload 计算的，因此你还可以验证内容是否遭到篡改。

JWT不用像普通token一样对比验证存于服务器端的用户信息，而是通过加密和解密计算，服务器端只需要保留secret私钥

步骤如下

- 首先客户端请求，服务器端发出JWT的secret，
- 在后面的请求，客户端会携带自己所有的信息，外加一个一个通过加密好了的JWT，
- JWT有三个部分header、payload、signature（包含secret），前两个部分是用 Base64 的形式编码，第三部分是前两部分再通过secret进行编码
- 服务器端接收到JWT，用服务器端的secret来对前两部分进行加密，得到一个用来验证的“第三部分Signature”，对比穿过来的Signature，就可以知道对不对了 ![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9d4df1ea327940c685be6c8970708a20~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

评论区的优秀比喻，哈哈 ![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/34e5040d99cb484f98fb68d5075b7644~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)



