# 基本使用

```js
const jwt = require('jsonwebtoken');
 
const secretKey = '&*^R*G&(FRDwp4eg3'   //secret
const expiresIn = 60 * 60 * 24 * 30;    //时效 (秒)
 
//生成jwt
function generateToken(uid) {
    const token = jwt.sign({
        uid
    }, secretKey, {
        expiresIn
    })
    return token
}
 
//解析jwt
function verifyToken(token) {
    return jwt.verify(token, secretKey)
}
 
 
//计算剩余时间
function tokenExp(token) {
    let verify = verifyToken(token);
    let time = parseInt((new Date().getTime()) / 1000);
    return `剩余${verify.exp - time}秒`
}
 
let token = generateToken(1);
 
console.log(token);                //输出token
console.log(verifyToken(token));   //输出token内容
tokenExp(token);        //输出token剩余时间
```

以上封装了三个函数，常用的功能就是这些了。

在实际项目中必须要对jwt.verify进行try catch捕捉错误，因为如果**token过期或者无效会直接抛出错误**。

#### 用法 

**jwt.sign(payload, secretOrPrivateKey, [options, callback])**

（异步）如果提供回调，则使用err或JWT 调用回调。

（同步）将JsonWebToken返回为字符串。

**payload**必须是一个object, buffer或者string。请注意， exp只有当payload是object字面量时才可以设置。

**secretOrPrivateKey** 是包含HMAC算法的密钥或RSA和ECDSA的PEM编码私钥的string或buffer。

**options:**

​    algorithm：加密算法（默认值：HS256）

​    expiresIn：以秒表示或描述时间跨度[zeit / ms](https://link.jianshu.com?t=https://github.com/zeit/ms)的字符串。如60，"2 days"，"10h"，"7d"，Expiration time，过期时间

​    notBefore：以秒表示或描述时间跨度zeit / ms的字符串。如：60，"2days"，"10h"，"7d"

​    audience：Audience，观众

​    issuer：Issuer，发行者

​    jwtid：JWT ID

​    subject：Subject，主题

​    noTimestamp

​    header

如果payload不是buffer或string，它将被强制转换为使用的字符串JSON.stringify()。

在expiresIn，notBefore，audience，subject，issuer没有默认值时。也可以直接在payload中用exp，nbf，aud，sub和iss分别表示，但是你不能在这两个地方同时设置。

请记住exp，nbf，iat是NumericDate类型。

生成的jwts通常会包含一个iat值除非指定了noTimestamp。如果iat插入payload中，则将使用它来代替实际的时间戳来计算其他事情，诸如options.expiresIn给定一个exp这样的时间间隔。

小栗子：

![img](https:////upload-images.jianshu.io/upload_images/3466051-d4f79c9703cda77f.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)

jsonwebtoken基本用法

T**oken Expiration(exp claim)**

小栗子：

![img](https:////upload-images.jianshu.io/upload_images/3466051-bb550dbec5d7fe3c.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)

期限token

注意：secret是加密的字符串，在反加密的时候需要用到。

![img](https:////upload-images.jianshu.io/upload_images/3466051-2e737867355ee3a0.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)

期限token

以上方式实现的效果是一样的。

**jwt.verify（token，secretOrPublicKey，[options，callback]）**

验证token的合法性

**jwt.decode（token [，options]）**

（同步）返回解码没有验证签名是否有效的payload。

警告：这不会验证签名是否有效。你应该不为不可信的消息使用此。你最有可能要使用jwt.verify()。

**错误与代码**

TokenExpiredError

如果令牌过期，则抛出错误。

错误对象：

  name：'TokenExpiredError'

  message：'jwt expired'

   expiredAt：[ExpDate]

JsonWebTokenError

错误对象：

  name：'JsonWebTokenError'

  message：

  jwt异常

  jwt签名是必需的

  无效签名

  jwt观众无效 预期：[OPTIONS AUDIENCE]

  jwt发行人无效。预期：[OPTIONS ISSUER]

  jwt id无效。预期：[OPTIONS JWT ID]

  jwt主题无效。预期：[OPTIONS SUBJECT]

**使用jsonwebtoken加密和解密的栗子：**

![img](https:////upload-images.jianshu.io/upload_images/3466051-5c5201e2ccfcf96a.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)

加密和解密

**使用jsonwebtoken验证token是否过期：**

![img](https:////upload-images.jianshu.io/upload_images/3466051-b8384322cea344fc.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)

