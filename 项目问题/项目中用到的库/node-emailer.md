# nodejs 实现邮箱发送验证码

- 开发个人网站时，注册页面可以使用邮箱验证，于是记录一下如何用nodejs/express服务器实现邮箱发送验证码，不仅可以在邮箱注册时使用，还可以拓展用于各种安全验证。

# 依赖包

- nodejs服务器需要

  ```
  express
  ```

  ，另外就是我们发送邮箱的包

  ```
  nodemailer
  ```

  , 

  ```
  cors
  ```

  解决跨域用于测试

  ```shell
  $ npm i express nodemailer cors
  复制代码
  ```

# nodejs服务端代码

1. 首先封装nodemailer.js文件，添加基本配置，配置前需要得到邮箱类型的**port和secure**还有邮箱**stmp授权码**。

2. `//node_modules/nodemailer/lib/well-known/services.json`可以查看相关的配置，比如这里是qq邮箱，**port为465，secure为true**。 ![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/180078faa28045dc9ccd13e70197e6b0~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

3. **邮箱---设置--账户--POP3/SMTP服务---开启---获取stmp授权码** ![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9bdb0532b5aa446099a7f64077c479d8~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

   ```javascript
   //nodemailer.js
   import nodemailer from 'nodemailer'
   
   let nodeMail = nodemailer.createTransport({
       service: 'qq', //类型qq邮箱
       port: 465,//上文获取的port
       secure: true,//上文获取的secure
       auth: {
           user: 'xxxxx@qq.com', // 发送方的邮箱，可以选择你自己的qq邮箱
           pass: 'xxxxxxxx' // 上文获取的stmp授权码
       }
   });
   
   export default nodeMail
   复制代码
   ```

4. 引入写好的`nodemailer.js`完成nodejs服务器`app.js`，掌握**发送邮件**对象`mail`的各种属性。

```javascript
 //app.js
 import express from 'express'
 import cors from 'cors'
 import nodeMail from './nodemailer.js'

 const app = express()
 app.use(express.json())
 app.use(cors());
 
 app.post('/api/email', async (req, res) => {
     const email = req.body.email
     const code = String(Math.floor(Math.random() * 1000000)).padEnd(6, '0') //生成6位随机验证码
     //发送邮件
     const mail = {
         from: `"月亮前端开发"<xxxxxx@qq.com>`,// 发件人
         subject: '验证码',//邮箱主题
         to: email,//收件人，这里由post请求传递过来
         // 邮件内容，用html格式编写
         html: `
             <p>您好！</p>
             <p>您的验证码是：<strong style="color:orangered;">${code}</strong></p>
             <p>如果不是您本人操作，请无视此邮件</p>
         ` 
     };
     await nodeMail.sendMail(mail, (err, info) => {
         if (!err) {
             res.json({msg: "验证码发送成功"})
         } else {
             res.json({msg: "验证码发送失败，请稍后重试"})
         }
     })
 });

 app.listen(3000, () => {
     console.log("服务开启成功");
 })
复制代码
```

# 前端代码测试

```html
<body>
<button onclick="test()">发送邮件</button>
<script>
    const test = async () => {
        const res = await fetch('/api/email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'xxxxxxxx@qq.com'
            })
        })
        const data = await res.json()
        console.log(data)
    }
</script>
</body>
复制代码
```

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/64ead0181bd743129769f7bb77d221fa~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a18c4eb1b219409ba1a59a4584b6c0c3~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/56a3171f35544c1f80a27cd357e38f3e~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

# 封装自己的短信发送依赖包

1. 我们发现这个实现起来虽然不难，但是需要分将入参内容分开配置，看过去挺麻烦的。
2. 我们不如封装属于自己的短信依赖包。有兴趣可以看看我之前的两篇文章：

- [nodejs npm使用攻略（如何发布属于自己的npm包）](https://juejin.cn/post/7080034894000324639)
- [nodejs ES6模块使用 以及 ES6代码转ES5兼容性处理](https://juejin.cn/post/7080034140195651615)

1. 于是我封装了一个包`node-send-email`，npm包地址：[node-send-email](https://link.juejin.cn?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fnode-send-email)。感兴趣下个发发邮件试试，当然也建议自己DIY。

```shell
$ npm i node-send-email
复制代码
// test.js
import {sendMail} from 'node-send-email'

const test = async () => {
    const code = String(Math.floor(Math.random() * 1000000)).padEnd(6, '0') //生成随机验证码
//发送邮件需要的入参
    const params = {
        //邮箱类型，@qq.com就传qq，@163.com就是传163，不传的话默认为qq，
        //其余类型可以在node_modules/node-send-email/service.js中找到。
        type: 'qq',
        // 发件人
        name: '月亮',
        // 发件箱，要与收件箱邮箱类型一致
        from: 'xxxxxxx@qq.com',
        // 发件箱smtp,需要去邮箱—设置–账户–POP3/SMTP服务—开启—获取stmp授权码
        smtp: 'xxxxxx',
        // 发送的邮件标题
        subject: '验证码',
        // 收件箱，要与发件箱邮箱类型一致
        to: 'xxxxxxx@qq.com',
        // 邮件内容，HTML格式
        html: `
            <p>您好！</p>
            <p>您的验证码是：<strong style="color:orangered;">${code}</strong></p>
            <p>如果不是您本人操作，请无视此邮件</p>
        `
    };

    await sendMail(params, (result) => {
        if (result) {
            console.log('发送成功')
        } else {
            console.log('发送失败')
        }
    })
}

test()
复制代码
$ node test.js
发送成功
```