# 详解 HTTP2.0 及 HTTPS 协议

## 开始之前

众所周知， HTTP协议是没有安全加密的协议，因为使用明文传输，所以使用HTTP协议的站点很容易会被窃听、篡改，劫持；而伴随着互联网的发展，网络上承载了越来越多也越来越重要的数据，金融，商业，支付，机密数据等等，数据安全的重要性越来越凸显，越来越多的网站通过启用HTTPS来保障web数据传输的安全性。此外，HTTP2.0 作为新一代的WEB协议，以重量级的新特性带来更好，性能更高的web服务体验。本文基于运维视角在阐述解析HTTP2.0协议相比较HTTP1.1的优点的同时讲述HTTPS协议的原理，并结合实际业务场景作为案例，目的是可以通过本文掌握HTTP2.0及HTTPS协议，了解原理，具备定位排查问题，调优的能力。

## 一、HTTP1.1 VS HTTP2

严格意义上HTTP2.0和HTTPS并没有什么必然的联系，只是搭配使用更香一些，HTTP2 是1999年HTTP1.1之后的第一次更新。没错，现在还在被大量使用的HTTP1.1协议已经是20年前的东西了，对于互联网的技术变革速度而言，很明显，HTTP1.1已经非常古老。HTTP2具有更好的效率和资源利用率，尤其适用于页面比较重，有大量资源加载的场景（公司的业务属于典型的场景），根据网络上的测试数据，在大量图片、资源需要加载的场景下，HTTP2解决HTTP1.1的线头阻塞（一次请求交互必须等待前一次请求交互的完成）问题相比HTTP1.1可以达到5倍以上的速度提升，目前，淘宝，天猫，京东等平台都已启用HTTP2，如果是页面存在大量惊天资源需要加载的情况，启用HTTP2.0，绝对物超所值。

## 1. HTTP2.0新特性

### 二进制分帧

- HTTP/2 采用二进制格式传输数据，而非 HTTP 1.x 的文本格式，二进制协议解析起来更高效。 HTTP / 1 的请求和响应报文，都是由起始行，首部和实体正文（可选）组成，各部分之间以文本换行符分隔。HTTP/2 将请求和响应数据分割为更小的帧，并且它们采用二进制编码。虽然HTTP1.1 的纯文本形式看起来一目了然，非常直观，但这只是对人的体验而言，事实上这种方式存在多义性，例如大小写、空白字符、回车换行、多字少字等，程序在处理的时候需要复杂的处理。效率比较低且麻烦，而二进制的方式，只是0和1，可以严格规定字段大小，顺序，标志位等，不存在歧义，提交小，同时也提升了数据在网络中传输的效率。

### 多路复用

HTTP1.1中一次请求与响应的交互必须要等待前面的请求交互完成，否则后面的只能等待。如果遇到某一个资源加载耗时较久，就会拖累整个站点的加载速度。而在HTTP2.0中，一次链接成功后，只要链接还没断开，那么 client 端就可以在一个链接中并发的发起多个请求，且每个请求的响应不需要等待其他请求。

- 多路复用，代替原来的序列和阻塞机制。所有就是请求的都是通过一个 TCP连接并发完成。 HTTP 1.x 中，如果想并发多个请求，必须使用多个 TCP 链接，且浏览器为了控制资源，还会对单个域名有 6-8个的TCP链接请求限制。常见的一个情况是，如果一个页面需要加载的静态资源过多，因为只有6-8个并发，所以客户端浏览器的等待时间就会比较久，例如政采云主站。开启页面需要几十个请求来获取静态资源。在这里耗费了不少的时间。

### 服务器推送

- HTTP2中服务端可以在发送页面HTML时主动推送其它资源，而不用等到浏览器解析到相应位置，发起请求再响应。例如服务端可以主动把JS和CSS文件推送给客户端，而不需要客户端解析HTML时再发送这些请求。

HTTP1.1的方式，客户端浏览器解析到哪里需要什么资源再加载什么资源，在HTTP2中，服务端可以主动推送，结合业务场景，服务端可以先把关键的首要的资源首先推送给客户端。对用户体验来说，只需要一次HTTP请求，浏览器就得到了首要资源，页面性能大大提升。当然，如果一次性推送了太多的资源，因为浏览器需要处理所有推送过来的资源。反而会拖累性能。所以需要根据业务场景做权衡。

### 头部压缩

- HTTP 1.1请求的大小变得越来越大，有时甚至会大于TCP窗口的初始大小，因为它们需要等待带着ACK的响应回来以后才能继续被发送。HTTP/2对消息头采用HPACK（专为http/2头部设计的压缩格式）进行压缩传输，能够节省消息头占用的网络的流量。而HTTP/1.x每次请求，都会携带大量冗余头信息，浪费了很多带宽资源。像cookie这些信息，每个请求都会附带，产生了很多不必要的资源消耗。为了减少这块的资源消耗并提升性能， HTTP/2对这些首部采取了压缩策略：
  - HTTP/2在客户端和服务器端使用“首部表”来跟踪和存储之前发送的键－值对，对于相同的数据，不再通过每次请求和响应发送；
  - 首部表在HTTP/2的连接存续期内始终存在，由客户端和服务器共同渐进地更新;
  - 每个新的首部键－值对要么被追加到当前表的末尾，要么替换表中之前的值。

## 2. ALPN 应用协议协商

- HTTPS 握手的时候，客户端会首先告诉服务端自己支持的协议，由服务端选择客户端服务端都支持的协议。如果服务端Nginx开启了HTTP2支持，服务端会选择HTTP2协议，否则，服务端就会选择HTTP1.1协议来通讯。

## 二、SSL/TLS 模型

## 1. TLS版本

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8867968221a74cbca00f38bcb3ff7379~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

历史版本的TLS/SSL因为安全漏洞和性能问题已经慢慢成为历史的尘埃，目前应用最为广泛的是TLS1.2版本，而TLS 1.3 是对于TLS1.2的升级，提供更强大的安全性和更高的性能。

## 2. 加密套件

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5d3a0dfd60ce4e8d996c223a6cfa7f42~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

- 加密套件：TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA解释
  - 基于TLS协议，使用ECDHE和RSA作为秘钥交换算法，加密算法是AES GCM，秘钥长度128位，哈希算法使用sha256
  - AES-GCM 是目前常用的分组加密算法，但是其有一个缺点就是计算量大，导致性能和电量开销比较大。为了解决这个问题，Intel 推出了名为 AES NI（Advanced Encryption Standard new instructions）的 x86 指令拓展集，从硬件上提供对 AES 的支持。对于支持 AES NI 指令的主机来说，使用 AES-GCM 是最佳选择。AES-GCM的优点在于可以利用多核提高加解密性能。

## 3. 对称加密和非对称加密

### 对称加密算法

对称加密算法是采用单钥解密的加密方法，加密解密都是用这一个密码。

- 常用，目前公认安全级别最高的加密算法：AES
  - AES的秘钥位数： 128、192、256、512，秘钥长度越长安全性越高但是同时会影响加解密性能。目前来说128位的秘钥长度已经足够安全。
- 对称加密算法的优点：计算量小、加密速度快、加密效率高。
- 对称加密算法的缺点：数据传送前，发送方和接收方必须商定好秘钥，想要接收方可以加解密数据就必须要告知秘钥。会带来秘钥管理上的诸多不便。

### 非对称加密算法

非对称加密算法是有一对公钥、私钥，公钥用于加密，私钥用于解密，当然也可以针对不同场景用私钥加密，公钥解密。

- 应用广泛的算法：RSA
- 非对称加密算法的优点：
  - 相对于对称加密，加解密是分开的，一个简单场景，私钥保存，公钥公开，只有持有私钥才可以解密，典型的场景例如SSH认证。
  - 灵活。秘钥管理方便。
- 非对称加密算法的缺点：
  - 计算量大，加密性能低于对称加密。非对称加密算法的执行效率制约着实际应用，大部分应用在身份验证中

### 题外话：技术角度分析当年WannaCry勒索病毒中的对称加密和非对称加密的应用场景

当年WannaCry勒索病毒的破坏性毋庸置疑，一夜之间，全球的政府、银行、企业被祸害的不胜枚举，在这种场景下，为什么业界的技术大牛却没能提供有效修复和恢复方案哪？

- 勒索病毒的实现原理：抛开零日漏洞（这个只跟感染传播途径有关，与加密技术无关）WannaCry在计算机上运行后，会使用AES对称加密加密指定后缀的文件，这里选用AES的原因在于对称加密的计算量比较小，速度快，试想要全盘加密指定后缀的文件，这个量级是比较大的，所以对称加密是比较合适的选择，但是问题来了，对称加密在加密时会暴露解密密码，如果这个密码存在客户端中会被拿到然后直接解开，利用障眼法挑战不了全球的技术大神，如果删除密码，则会导致加密文件永远也无法解密，这样就不能达到勒索的目的。所以WannaCry的开发者又同时利用了RSA非对称加密算法加密了AES的秘钥然后存放在加密文件的文件头部。这样的话，WannaCry的作者只需要掌握RSA的私钥，即可通过私钥先解密文件头部中的AES秘钥，再通过AES秘钥解密文件。那么为什么不直接通过RSA加密文件哪？其实也有一些勒索病毒是这么干的，这样的缺点是加密过程因为非对称加密需要大量的计算所以加密耗时较久，加密过程中大量消耗系统资源也容易被发现。
- AES的破解难度：暴力破解的话用地球的每一粒沙子做出存储运算的话不夸张的说在太阳膨胀或者地球毁灭之前你都算不出来。简单来说，目前没有可能被爆破。

## 4. HTTPS 握手过程

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e6370edd4d6647fa8c2a9dbc1f1b577d~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

- 1. Client-hello 阶段

     Client-hello 是TCP链接建立后客户端发送的第一条消息，主要目的是把客户端支持的功能和选项高速服务端。

     - 浏览器中完成地址输入后, 解析域名获得 IP Host 地址, 浏览器会与此 Host 的443(默认, 如果指定其他端口则会连接此端口) 三次握手建立TCP连接，然后进入TLS 握手协议的 Client-hello。这一步骤中浏览器会将客户端支持的加密套件，目标Host等信息发送给服务器, 并会附上一份随机生成的 session ticket1.

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fbd5477b98a9413eb4924494b48c3741~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

```markdown
markdown
复制代码 + ALPN协商: 应用层可以协商在安全连接层之上使用什么协议, 避免了额外的往返通讯,  如上图
```

- Server-hello阶段
  - 服务器收到浏览器发送来的 TLS 握手请求后, 存储浏览器发送的session ticket1, 然后根据发送来的 host 寻找对应的服务器证书, 然后会将服务器证书, 服务器从Client Hello提供的客户端支持的加密套件清单中按照优先级选择一个双方都支持的套件（如果服务端支持的套件和client支持的套件交集为空则握手失败）, 和一份随机生成的 session ticket2 返回给浏览器.

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c706e10119014299aeeb10c38844fa12~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

Client-hello和server-hello的步骤很像是买东西： 客户端： 我有多少钱，能支付宝也能微信付款， 服务端：需要xxx RMB，我们使用支付宝吧。

- Cipher-spec 阶段

  经过Client Hello和Server Hello 客户端和服务端完成了加密套件的协商。进入Cipher-spec 阶段会核验证书的有效性并

  - 浏览器收到服务器返回的证书后, 会验证证书有效性. 验证步骤如下:
    - 验证证书有效期
    - 验证证书域名与实际的host是否匹配。
    - 验证证书吊销状态(CRL+OCSP)确认证书是否被吊销。
    - 验证证书颁发机构, 如果颁发机构是中间证书（基本都是）, 再验证中间证书的有效期/颁发机构/吊销状态. 一直验证到最后一层证书, 中途任何一个环节不通过都会提示不信任。
    - 若检查通过, 随机生成一份 session ticket 3 (这是浏览器生成的第二份 ticket), 通过返回证书中的公钥, 用协商的加密算法加密, 返回给服务器.同时浏览器用 session ticket 1(浏览器) & session ticket 2(服务器) & session ticket 3(浏浏览器) 组合成 session key。

- 内容传输阶段

  - TLS 连接建立完成, 在连接销毁前, 浏览器与服务器的交互数据均通过 session key 来进行对称加密.

- HTTPS握手过程抓包：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cabaf999fa844f0aa76b078becfe87da~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

前三行为TCP三次握手，第四行客户端发起Client hello， 第五行服务端ack回复， 第六行Server Hello，第9行Cipher-spec阶段进行证书校验，完成握手之后第13行进入数据交互阶段。

## 5. HSTS

通常访问网址的时候我们大多不会刻意的在前面写上https，也很少会关注我们是通过HTTP协议还是HTTPS协议在浏览。而要求https访问的站点，在用户通过http访问的时候大多以重定向的方式重定向到HTTPS地址，而如果我劫持了用户流量，拦截向https的重定向请求，然后担当一个代理的角色，如实转发客户端请求并返回，但是客户端跟中间人的交互采用的是明文的HTTP协议，由于没有建立SSL连接，所以客户端提交的信息都会暴露。基于此问题，是国际互联网工程组织 IETF 发布了HSTS的安全策略机制，强制让浏览器使用HTTPS与站点进行通信。

- HSTS（HTTP Strict Transport Security）的作用是强制客户端（如浏览器）使用HTTPS与服务器创建连接。HSTS主要是通过服务器发送响应头的方式来控制浏览器操作：
  - 当客户端通过 HTTPS 发出请求时，服务器会在返回的 HTTP 响应头中包含 **Strict-Transport-Security** 字段（HSTS的开关由服务端控制）。
  - 浏览器接收到这样的信息之后，在一定期限内对该网站的任何请求都会以 HTTPS 发起（浏览器内部307跳转），而不会以 HTTP发起再由服务器重定向到 HTTPS。

## 三、SSL 证书

SSL证书特指由受信任的数字证书颁发机构（CA）颁发的数字证书。SSL证书具备身份验证（DV/OV/EV）和数据传输加密功能。

## 1. CA的公信力

- 所有人只需要通过开源的openssl就可以很容易的生成根证书然后进行签发，而且几乎不需要花费什么成本。甚至也可以配置到web服务器上提供HTTPS服务，只是不被浏览器信任而已。为什么我们还需要付出价值不菲成本去购买CA机构颁发的证书哪？在证书体系中CA证书的根证书非常重要，假如一个人拿到了CA的根证书私钥，那理论上就可以以上帝视角，解密HTTPS数据，通过中间人劫持，篡改数据。所以目前的CA根证书具有非常高的安全要求，一个CA的机构，想要通过审查，私钥起码有365天 x 24小时无间断的保安巡逻。门禁卡+指纹虹膜等生物识别双重安保，每一次记录都会写入不可修改的日志系统，CA私钥本身物理隔离，CA的加密模组保证私钥从物理上不可被复制只能用来签发。可想而知，个人生成的CA不可能会有这么高的安全级别。
- CA归根结底是靠公信力得以存活的。如果不被信任，那就和个人签发的证书没有什么分别。一个悲哀的案例：国内的沃通本来是一家有CA资质的受信任的根证书机构，也是全中国唯一的CA，因为违规签发github.com的证书（这个行为的风险是，持有github.com证书的人或者组织，可以解密窃听、劫持github.com）被火狐浏览器，谷歌浏览器停止信任。从而沦为下级代理商。

## 2. 机构角色

- CA 根证书机构 （CA,certification authority) 可存在ROOT CA 一级CA、二级CA...等等。多级CA可以理解成根CA为了分销而将证书的签发权限下发给下级CA，根CA通常不会直接签发证书。
- RA 证书注册机构（Registration Authority，RA）相当于代理商，代理CA标识和鉴别证书申请者，同意或拒绝证书申请，在某些环境下主动吊销或挂起证书，处理订户吊销或挂起其证书的请求，同意或拒绝用户更新其证书或密钥的请求。但是并不能签发证书。例如阿里云就是一个RA。

- SRCA 不受信任的CA， 其实私人或者不受信任的机构颁发的证书都是这种类型，早期的12306就是用的这种证书。

## 3. 证书颁发过程

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9dce1ab591d1416bb47eb7b0a9f8cd40~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

## 3. 证书类型

### DV（Domain validated）

- 域名验证证书只验证域名，因为只需要验证域名的所有权，颁发速度最快。几乎准实时，Let's Encrypt的免费证书就是这种类型。

### OV（Organization validated）

- 组织验证证书，除了验证域名之外还会验证组织，例如如果要购买OV证书，不仅会验证域名所有权，还会验证申请证书时填写的组织是否是正确的。所以颁发速度较慢，通常3天左右，价格也比DV证书很多。目前政采云使用的就是此种类型的证书。颁发速度较慢，需要3-5个工作日。

### EV（Extended validated）

- 扩展验证证书，对浏览器非常友好，会直接在浏览器地址栏中显示出组织名称，比较利于品牌建设，也号称是安全级别最高的顶级证书，当然这也是成本最高的证书类型。EV证书的申请核验非常严格，需要5-7个工作日的时间，除DV/OV证书的核验外还要经过第三方审查，法务证明文件等，而且EV没有通配符版本的证书。只能购买单域名版。

## 4. 证书链

web服务器例如Nginx在向浏览器发送证书的时候需要发送2个证书，一个是Intermediates证书，一个是域名证书，根证书不需要，因为根证书是操作系统内置的。首先发送域名证书，再发送Intermediates证书，浏览器会负责核验签发Intermediates证书的根证书是不是有效的受信任的。

### 根证书（root）

- windows、安卓、linux等主流系统，基本上一年以上才会更新一次根证书库。大部分浏览器使用的是操作系统的根证书库，也有例外，例如火狐浏览器，谷歌浏览器维护的就是自己的CA证书库。一个新的根证书是很难再短时间内获得信任的。

### Intermediates证书

- 通常CA机构不会直接签发域名证书，而是通过授权二级CA来签发证书，而二级CA可以再授权三级CA....这种非CQ直接签发的证书就叫做Intermediates证书。这类证书可以有很多级，没有限制，但是在验证证书有效性的时候，会一层一层的验证，直到找到CA根证书为止。而目前购买的证书中大多Intermediates证书只有一级。例如：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/955564eb316e4d9bb9d24b51fe5d6640~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### 域名证书

- 域名证书分为公钥和私钥，在浏览器与WEB服务器交互式，WEB服务器会将公钥返回给浏览器。

## 5. 证书吊销

- 证书吊销列表(**C**ertificate Revocation **L**ist ) 简称CRL， CRL中包含了：证书颁发机构信息吊销列表失效时间和下一次更新时间。
   ![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/163d0b138e7a411ba186f143c008b31f~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)
- **O**nline **C**ertificate **S**tatus **P**rotocol，缩写：**OCSP**：在线证书状态协议，CRL的替代品，由于OCSP响应包含的信息少于CRL，因此减轻了网络和客户端资源的负担， 需要解析的信息也更少。

## 四、HTTP2.0时代带来的运维挑战

### 1. 最佳CP： HTTP2 + HTTPS

https其实就是建构在SSL/TLS之上的 http协议，所以要比较https比http多用多少服务器资源，这个主要看SSL/TLS本身消耗多少服务器CPU资源。网络部分：http使用TCP 三次握手建立连接，客户端和服务器需要交换3个包，https除了 TCP 的三个包，还要加上 ssl握手需要的9个包，所以一共是12个包。CPU部分因为HTTPS有加解密过程，所以会消耗更多的资源。而HTTP2.0 标准中，虽然没有强制提出要使用加密（HTTPS）但是目前主流浏览器，chrome、火狐等都已经公开宣布只支持加密的HTTP2，所以目前互联网上能见到的HTTP2基本都是基于HTTPS协议的。HTTPS保证了传输的安全性却造成了额外的性能开销，而HTTP2的出现正好通过多路复用，头部压缩等特性大大的提升了传输性能。不得不说，HTTP2 + HTTPS是新一代web服务的最佳组合。

### 2. 一次证书链不全引发的问题

- 现象：公司切换新域名，在阿里云直接部署证书到SLB后个别客户反馈手机打开官网提示不受信任的证书。但是电脑端chrome打开又一切正常。
- 问题解析：操作系统中通常都包含了受信任的CA，但是很多证书通常不是由CA直接签发的。而是使用中间层证书进行签名。这就会导致如果你部署的证书中没有包含中间层证书，就会因为证书链不全而不被信任，当然chrome和火狐两大主流的浏览器中已经包含了大多的中间层证书所以访问时没有问题，但是像安卓的各种发行版里面的浏览器，未必包含二级证书，如果web服务端没有包含中间证书且使用的浏览器中也没有包含中间证书，就会导致信任问题。

### 3. 证书安全

- 在部署HTTPS后，很容易被忽视的一个问题是证书本身的安全保障。HTTPS的私钥泄露，会产生诸多的安全问题。上文中的内容可以获知，拿到了私钥，在满足一定条件的情况下，用户与服务端的交互基本处于裸奔的状态，用户账密，订单交易信息都可能会被拦截。因此，CA签发下来的SSL证书本身也有必要管理起来，不能随意复制，放置。

### 4. 证书监控

- 通过curl命令可以获取HTTPS握手的整个过程，以及证书详情。通常我们通过获取expire date来监控证书过期时间。如果curl命令的错误输出不为0 排除网络问题，就可能是证书不被信任。当然也可以不用curl命令，通过openssl或者编写脚本来实现监控，原理一样。

```yaml
 wangxun@wangxun ~ curl https://zcygov.cn -vv
* Rebuilt URL to: https://zcygov.cn/
*   Trying 101.37.44.108...
* TCP_NODELAY set
* Connected to zcygov.cn (101.37.44.108) port 443 (#0)
* ALPN, offering h2
* ALPN, offering http/1.1
* Cipher selection: ALL:!EXPORT:!EXPORT40:!EXPORT56:!aNULL:!LOW:!RC4:@STRENGTH
* successfully set certificate verify locations:
*   CAfile: /etc/ssl/cert.pem
  CApath: none
* TLSv1.2 (OUT), TLS handshake, Client hello (1):
* TLSv1.2 (IN), TLS handshake, Server hello (2):
* TLSv1.2 (IN), TLS handshake, Certificate (11):
* TLSv1.2 (IN), TLS handshake, Server key exchange (12):
* TLSv1.2 (IN), TLS handshake, Server finished (14):
* TLSv1.2 (OUT), TLS handshake, Client key exchange (16):
* TLSv1.2 (OUT), TLS change cipher, Client hello (1):
* TLSv1.2 (OUT), TLS handshake, Finished (20):
* TLSv1.2 (IN), TLS change cipher, Client hello (1):
* TLSv1.2 (IN), TLS handshake, Finished (20):
* SSL connection using TLSv1.2 / ECDHE-RSA-AES128-GCM-SHA256
* ALPN, server accepted to use http/1.1
* Server certificate:
*  subject: C=CN; ST=\U6D59\U6C5F\U7701; L=\U676D\U5DDE\U5E02; O=\U653F\U91C7\U4E91\U6709\U9650\U516C\U53F8; OU=IT; CN=*.zcygov.cn
*  start date: May  7 00:00:00 2019 GMT
*  expire date: May  6 12:00:00 2021 GMT
*  subjectAltName: host "zcygov.cn" matched cert's "zcygov.cn"
*  issuer: C=US; O=DigiCert Inc; OU=www.digicert.com; CN=GeoTrust RSA CA 2018
*  SSL certificate verify ok.
> GET / HTTP/1.1
> Host: zcygov.cn
> User-Agent: curl/7.54.0
> Accept: */*
>
< HTTP/1.1 301 Moved Permanently
< Date: Wed, 07 Aug 2019 07:16:47 GMT
< Content-Type: text/html
< Content-Length: 191
< Connection: keep-alive
< Set-Cookie: acw_tc=76b20feb15651622072312298e0526c6496462332328e0842a443f28ecb7be;path=/;HttpOnly;Max-Age=2678401
< Location: https://www.zcygov.cn/
<
<html>
<head><title>301 Moved Permanently</title></head>
<body bgcolor="white">
<center><h1>301 Moved Permanently</h1></center>
<hr><center>openresty/1.13.6.1</center>
</body>
</html>
* Connection #0 to host zcygov.cn left intact
```

### 6. Nginx下的HTTP2及HTTPS配置

```ini
server {
    listen       4433 ssl;
    listen       [::]:4433 ssl;
    server_name  cai-inc.com;
    add_header Strict-Transport-Security "max-age=31536000; includeSubdomains";  # 启用HSTS
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;  # 服务端支持的TLS版本
    ssl_ciphers "EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH:!aNULL:!eNULL:!EXPORT:!DES:!MD5:!PSK:!RC4";
    # 服务端支持的和不支持的加密套件。
        ssl_certificate "/etc/letsencrypt/certs/fullchain.pem";
        ssl_certificate_key "/etc/letsencrypt/certs/privkey.pem";
        ssl_session_cache shared:SSL:10m;
        ssl_session_timeout  10m;
        ssl_prefer_server_ciphers on;
    location / {
      proxy_pass http://127.0.0.1:8899;
      }

  }
```

## 总结

- HTTP2.0和HTTPS是一组很好的搭配，HTTP2.0为HTTP1.1提效， HTTPS来保障链接的安全性。在应对页面大量资源加载的情况下使用HTTP2.0可以明显的提升页面加载效率。
- HTTPS证书的体系的核心是信任的CA机构，同样的域名的HTTPS证书的私钥泄露也将导致安全风险，因为部署在用户侧，域名证书私钥需要妥善保管。

- 证书部署时需要部署完整的证书链， 证书链不全会导致在一些老旧的设备上存在证书校验无法通过的问题。
- 伪造根证书，又被操作系统所信任是很可怕的，这意味着你的所有请求在根证书私钥的拥有者眼中是裸奔的。

- 证书不可信可以导致很大的稳定性事故， 所以证书的监控很有必要



作者：政采云技术团队已转移到新的政采云技术
链接：https://juejin.cn/post/7034668672262242318
来源：稀土掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。