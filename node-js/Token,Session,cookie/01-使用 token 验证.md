### 搭建一个简单的本地服务来模拟 token 验证 。

- 创建一个node项目



```kotlin
1.初始化项目
npm init -y  // 初始化项目 -y为yes 自行配置项目信息可不写

2.安装node 框架express
npm i express --save

3.安装一些会使用到的插件
npm i jsonwebtoken --save
npm i express-jwt
npm i body-parser --save // 解析post请求发送过来的数据
```

- 开始在项目中使用 主文件main.js



```js
main.js 
const express = require('express');
var bodyParser = require('body-parser');
const expressJWT = require('express-jwt');

//导入配置文件
const setting = require('./setting');
//导入 token 校验文件
const verify = require('./verify');
const app = express();

//bodyParser 使用bodyParser 解析post请求传递过来的参数
app.use(bodyParser.json());

//跨域配置
app.use((req, res, next) => {
  res.append("Access-Control-Allow-Origin", "*");
  res.append("Access-Control-Allow-Origin-Type", "*");
  next();
})

// 使用expressJWT 验证token是否过期
app.use(expressJWT.expressjwt({
  secret: setting.token.signKey // 签名的密钥 或 PublicKey
}).unless({ // 设置并规定哪些路由不用验证 token
  path: ['/api/hello'] // 指定路径不经过 Token 解析
}));


//当token失效返回提示信息 时间过期了执行这一条 要放在错误c
app.use((err, req, res, next) => {
    // console.log(req);
  if (err.status === 401) {
    return res.json({
      status: err.status,
      msg: 'token失效',
      error: err.name + ':' + err.message
    })
  }
});

// post 请求
app.post('/api/hello', (req, res) => {
  verify.setToken(req.body.name,req.body.password).then(async(token) => {
    return res.json({
      status: 0,
      msg: 'success',
      token,
      signTime: setting.token.signTime
    })
  });
})

// get 请求
app.get('/api/info', async(req, res) => {
  let data = await verify.getToken(req.query.token);
  // 有些请求是需要登录状态的 所以验证token
  // 验证 data.state >>> true Or false
  data.state ?
    (res.json({
      status:0,
      msg: '可以访问'
    })) :
    (res.json({
      status:-1,
      msg: '请登录'
    }));
});

app.listen(5000, () => {
  console.log(`你的本地服务 localhost:5000`);
})
```

- 相关的配置文件  setting.js



```java
setting.js
module.exports = {
  token:{
    // token密匙
    signKey:'123456',
    // 过期时间
    // signTime: 3600 * 24,
      signTime: 10,
    // 请求头参数
    header: 'authorization',
    //不用校验的路由
    unRoute:[
      {url:'/api/hello',methods:['POST']},
    ]
  }
}
```

- 相关配置文件   verify.js



```tsx
verify.js
const jwt = require('jsonwebtoken'); //使用jwt 来生成或者解密 token
const setting = require('./setting');

const verify = {
  //设置 token
  setToken(name,pwd){
    return new Promise(resolve=>{
      let token = jwt.sign(
        //存储数据，自定义
        {name,pwd},
        //密匙
        setting.token.signKey,
        // 过期时间
        { expiresIn: setting.token.signTime}
      )
      resolve(token)
    })
  },
  getToken(token){
    return new Promise((res,rej)=>{
      //判断token是否存在
      if(!token){
        console.log("这里是空的 没有数据");
        rej({error:'The token value is empty'})
      }else{
         //jwt.verify 里面传入三个参数第一个 token, 第二个 signKey 就是生成token的密匙 第三个 方法 判断； 是否解密成功
        jwt.verify(token,setting.token.signKey,(err,data)=>{
          if(err){
            // console.log("请求失败");
            res({
              state: false,
              info: "token验证失败"
            });
          }else{
            // console.log("请求成功");
            res({
              state: true,
              info: "token验证成功"
            });
          }
        });
      }
    })
  }
}
module.exports = verify;
```

### 这个node 项目的目录结构 如下

![img](https:////upload-images.jianshu.io/upload_images/19846395-e46e5d22a0093279.png?imageMogr2/auto-orient/strip|imageView2/2/w/459/format/webp)

1-1

- 使用axios 发送请求

  ![img](https:////upload-images.jianshu.io/upload_images/19846395-2d6ee644d50966f4.png?imageMogr2/auto-orient/strip|imageView2/2/w/813/format/webp)

  1-2

- 后台成功生成 token 并且成功返回回来，前端用 localstorage 保存token。

- 通过 axios 的请求拦截，把token添加到 http报文头部。

  ![img](https:////upload-images.jianshu.io/upload_images/19846395-36489f0d5fe479c0.png?imageMogr2/auto-orient/strip|imageView2/2/w/1001/format/webp)

  1-3

- 第一个模拟登录请求，后台返回 token 前端保存，现在模拟一个 需要 token 验证的 get 请求。

![img](https:////upload-images.jianshu.io/upload_images/19846395-fced938d331eb7d7.png?imageMogr2/auto-orient/strip|imageView2/2/w/937/format/webp)

1-4

- 第一个可以正常访问，第二个不能 是因为设置了 token 有效保存时间。signTime: 10 >>> 有效值为 10秒



```css
seeting.js 

signTime: 10
```

![img](https:////upload-images.jianshu.io/upload_images/19846395-8e54bc598aaae1bc.png?imageMogr2/auto-orient/strip|imageView2/2/w/606/format/webp)

image.png

- 如果时间超过10秒 那么会执行 main.js 里面的这个方法



```jsx
main.js

//当token失效返回提示信息 时间过期了执行这一条
app.use((err, req, res, next) => {
    // console.log(req);
  if (err.status === 401) {
    return res.json({
      status: err.status,
      msg: 'token失效',
      error: err.name + ':' + err.message
    })
  }
});
```

. 如果 token 错误那么解析 token 的 Object.verify()方法会报错。



```tsx
verify.js

  getToken(token){
    return new Promise((res,rej)=>{
      //判断token是否存在
      if(!token){
        console.log("这里是空的 没有数据");
        rej({error:'The token value is empty'})
      }else{
         //jwt.verify 里面传入三个参数第一个 token, 第二个 signKey 就是生成token的密匙 第三个 方法 判断； 是否解密成功
        jwt.verify(token,setting.token.signKey,(err,data)=>{
          if(err){
            // console.log("请求失败");
            res({
              state: false,
              info: "token验证失败"
            });
          }else{
            // console.log("请求成功");
            res({
              state: true,
              info: "token验证成功"
            });
          }
        });

      }
    })
  }
```

