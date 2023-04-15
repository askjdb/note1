# express中间件cookie-parser的使用

# cookie-parser

## 一.cookie未加密

### **1.安装cookie-parser中间件**

```cpp
npm install --save-dev cookie-parser
```

### **2.引入cookie-parser**

```js
//express框架
const express=require("express");
//引入一个框架实例
const app=express();
//引入cookie-parser
const cookieParser=require("cookie-parser");
app.use(cookieParser());
```

### **3.设置cookie**

样板模式为：

```cpp
res.cookies('key','value',option)
```

其中option要求是要json格式，有以下选项：

+ domain: 域名。设置子域名（二级域名）是否可以访问cookie。
+ name=value：键值对，可以设置要保存的 Key/Value，注意这里的 name 不能和其他属性项的名字一样。
+ expires： 过期时间（秒），在设置的某个时间点后该Cookie 就会失效，如 expires=Wednesday, 09-Nov-99 23:12:40 GMT
+ maxAge：最大失效时间（毫秒），设置在多少时间后失效、
+ secure： 当 secure 值为 true 时， cookie 在 HTTP 中是无效，在 HTTPS 中才有效 
+ path： 表示 cookie 影响到的路由，如 path=/。如果路径不能匹配时，浏览器则不发送这个 Cookie
+ httpOnly：默认为false,建议设置为true, 客户端将无法通过document.cookie读取到 COOKIE 信息，可防止XSS 攻击产生
+ signed： 表示是否签名（加密） cookie, 设为 true 会对这个 cookie 签名
  

实例：
是在router.js路由文件：

```js
const express = require("express");
const router = express.Router();
//.....

moudle=exports=router

```

设置cookies

```js
router.get("/sendData", (req, res) => {
    //写入缓存
    let str = "周日"
    console.log(str);  //输出结果为周日
    res.cookie('_user',str, {
        //最大失效时间
        maxAge: 1000 * 60 * 60 * 24 * 2,
        //路径
        path: '/',
    });
    res.send("写入缓存");
});

```

显示结果：

![在这里插入图片描述](https://img-blog.csdnimg.cn/4da76fa76455443ba107193d8ed06e06.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80Nzg2MzU0Nw==,size_16,color_FFFFFF,t_70)

### **4.读取cookie 通过 req.cookies.(注意是req)**

```js
router.get("/getcookie", (req, res) => {
    //未加密使用下面这个读取
    res.send(req.cookies['_user']);
});

```

显示结果：

![在这里插入图片描述](https://img-blog.csdnimg.cn/2f56f9c0f1374d5faf8b3c5899a81289.png)

## 二.cookie 的加密

出于安全的考虑，通常需要对cookie进行签名
设置cookie时，将signed设置为true，表示对cookie进行签名。

### 1.在配置中间件时传参

```js
//引入cookie-parser
const cookieParser=require("cookie-parser");
app.use(cookieParser('abc'));   //括号内随意填写字符串 都是可以的
```

### 2.设置cookie时，要把有signed属性设为true

```js
router.get("/sendData", (req, res) => {
    //写入缓存
    let str = "加密的周日"  //数据
    console.log(str);  //输出结果为周日
    res.cookie('_user',str, {
        //最大失效时间
        maxAge: 1000 * 60 * 60 * 24 * 2,
        //路径
        path: '/',
        signed:true; //加密属性
    });
    res.send("写入缓存");
});

```

加密后显示结果：

![在这里插入图片描述](https://img-blog.csdnimg.cn/afc35957a0f0401db2b8558a73bb4cf9.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80Nzg2MzU0Nw==,size_16,color_FFFFFF,t_70)

### 3.读取cookie 通过 req.signedCookies.(注意是req)

```js
router.get("/getcookie", (req, res) => {
    //加密后使用
    res.send(req.signedCookies['_user']);
});

```

![在这里插入图片描述](https://img-blog.csdnimg.cn/f780a1cd54504b81a878725f2a032ddf.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80Nzg2MzU0Nw==,size_16,color_FFFFFF,t_70)