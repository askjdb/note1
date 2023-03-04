## 作用是什么

express-jwt是nodejs的一个中间件，他来验证指定http请求的JsonWebTokens的有效性，如果有效就将JsonWebTokens的值设置到req.user里面，然后路由到相应的router。 此模块允许您使用Node.js应用程序中的JWT令牌来验证HTTP请求。 JWT通常用于保护API端点。

## express-jwt和jsonwebtoken是什么关系

express-jwt内部引用了jsonwebtoken，对其封装使用。 在实际的项目中这两个都需要引用，他们两个的定位不一样。jsonwebtoken是用来生成token给客户端的，express-jwt是用来验证token的。

## 如何使用

#### 安装



```undefined
npm install express-jwt
```

#### 设置需要保护的API



```jsx
var expressJWT = require('express-jwt');

var secretOrPrivateKey = "hello  BigManing"  //加密token 校验token时要使用
app.use(expressJWT({
    secret: secretOrPrivateKey   
}).unless({
    path: ['/getToken']  //除了这个地址，其他的URL都需要验证
}));
```

#### 校验token失败时的处理



```jsx
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {   
      //  这个需要根据自己的业务逻辑来处理（ 具体的err值 请看下面）
    res.status(401).send('invalid token...');
  }
});
```

1. token过期时的err值



```json
{
    "name": "UnauthorizedError",
    "message": "jwt expired",
    "code": "invalid_token",
    "status": 401,
    "inner": {
        "name": "TokenExpiredError",
        "message": "jwt expired",
        "expiredAt": "2017-08-03T10:08:44.000Z"
    }
}
```

1. token无效时的err值：



```json
{
    "name": "UnauthorizedError",
    "message": "invalid signature",
    "code": "invalid_token",
    "status": 401,
    "inner": {
        "name": "JsonWebTokenError",
        "message": "invalid signature"
    }
}
```

#### 定义返回给客户端token的接口



```js
var jwt = require('jsonwebtoken');

//  何时返回token  要根据自己的业务逻辑
app.get('/getToken', function (req, res) {
    res.json({
        result: 'ok',
        token: jwt.sign({
            name: "BinMaing",
            data: "============="
        }, secretOrPrivateKey, {
                expiresIn: 60 * 1
            })
    })
});
```

#### 带着token访问/getData接口



```js
// 访问这个地址  ， token 要放到 authorization 这个header里，
// 对应的值以Bearer开头然后空一格，接近着是token值。为什么会这样，请看下面后续。
app.get('/getData', function (req, res) {
            res.send(req.user)
});
```

查看返回的结果：



```json
{
    "name": "BinMaing",
    "data": "=============",
    "iat": 1501814188,
    "exp": 1501814248
}
```

#### 客户端携带token正确的姿势



```json
authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQmluTWFpbmciLCJkYXRhIjoiPT09PT09PT09PT09PSIsImlhdCI6MTUwMTgxNDE4OCwiZXhwIjoxNTAxODE0MjQ4fQ.GoxGlc6E02W5VvqDNawaOrj3MPO-4UYeFdngKR4bVTE
```

为什么会这样携带token，请看express-jwt源码里是如何获取token的：



```jsx
//1 从options中获取token  这个忽略  因为 在设置 需要保护的API 时 并没有传递 getToken 这个方法
 if (options.getToken && typeof options.getToken === 'function') {
      try {
        token = options.getToken(req);
      } catch (e) {
        return next(e);
      }
      //2 从authorization中获取token
    } else if (req.headers && req.headers.authorization) {
      // --这是关键代码-----开始切割--------->
      var parts = req.headers.authorization.split(' '); 
      if (parts.length == 2) {
        var scheme = parts[0];
        var credentials = parts[1];

        if (/^Bearer$/i.test(scheme)) {
          token = credentials; // <-------最终获取到token---------          
        } else {
          if (credentialsRequired) {
            return next(new UnauthorizedError('credentials_bad_scheme', { message: 'Format is Authorization: Bearer [token]' }));
          } else {
            return next();
          }
        }
        //3 以上两个途径都没有token时 就报错呗
      } else {
        return next(new UnauthorizedError('credentials_bad_format', { message: 'Format is Authorization: Bearer [token]' }));
      }
    }
```



![img](https://upload-images.jianshu.io/upload_images/16647299-46d32e1735c9fbd2.png?imageMogr2/auto-orient/strip|imageView2/2/w/1116/format/webp)