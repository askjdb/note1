### **1. cookie的创建**

express直接提供了api,只需要在需要使用的地方调用如下api即可

```js

    function(req, res, next){
        ...
        res.cookie(name, value [, options]);
        ...
    }

```

express就会将其填入Response Header中的Set-Cookie，达到在浏览器中设置cookie的作用。

- name: 类型为String
- value: 类型为String和Object，**如果是Object会在cookie.serialize()之前自动调用JSON.stringify对其进行处理**
- Option: 类型为对象，可使用的属性如下



```text
   domain：cookie在什么域名下有效，类型为String,。默认为网站域名
   expires: cookie过期时间，类型为Date。如果没有设置或者设置为0，那么该cookie只在这个这个session有效，即关闭浏览器后，这个cookie会被浏览器删除。
   httpOnly: 只能被web server访问，类型Boolean。
   maxAge: 实现expires的功能，设置cookie过期的时间，类型为String，指明从现在开始，多少毫秒以后，cookie到期。
   path: cookie在什么路径下有效，默认为'/'，类型为String
   secure：只能被HTTPS使用，类型Boolean，默认为false
   signed:使用签名，类型Boolean，默认为false。`express会使用req.secret来完成签名，需要cookie-parser配合使用`

```

- 上面是我结合实验和自己的理解，对[官网api](https://link.jianshu.com/?t=http%3A%2F%2Fexpressjs.com%2Fen%2F4x%2Fapi.html)的翻译。原英文如下：

> [图片上传失败...(image-a57d79-1517212254735)]

用例如下

```js
res.cookie('name', 'koby', { domain: '.example.com', path: '/admin', secure: true });
//cookie的有效期为900000ms
res.cookie('rememberme', '1', { expires: new Date(Date.now() + 900000), httpOnly: true });
//cookie的有效期为900000ms
res.cookie('rememberme', '1', { maxAge: 900000, httpOnly: true });

//cookie的value为对象
res.cookie('cart', { items: [1,2,3] });
res.cookie('cart', { items: [1,2,3] }, { maxAge: 900000 });

res.cookie('name', 'tobi', { signed: true });
```

### **2.cookie的删除**

express直接提供了api删除浏览器中的cookie,只需要在需要使用的地方调用如下api即可

```js

    function(req, res, next){
        ...
        res.clearCookie(name [, options]);
        ...
    }

```

### **3.利用cookie-parser读取cookie**

 cookie-parser是一个非常好用方便的插件，可以直接用在express和connect中，官文地址为[https://www.npmjs.com/package/cookie-parser](https://link.jianshu.com?t=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fcookie-parser)。npm安装命令



```
$npm install cookie-parser --save
```

#### 使用方式



```php
var express = require('express');
var cookieParser = require('cookie-parser');

var app = express();
//不使用签名
app.use(cookiePareser());

//若需要使用签名，需要指定一个secret,字符串,否者会报错
app.use(cookiePareser('Simon'));
```

- 如果没有为signed功能，cookie-parser通过如下代码解析req.headers.cookie

  

  ```jsx
      //index.js
      var cookie = require('cookie');
      var parse = require('./lib/parse');
  
      if (req.cookies) return next();    //如果存在req.cookies跳过这个middleware
      var cookies = req.headers.cookie;    //保存对象地址，提高运行效率
      req.cookies = Object.create(null);    //创建一个对象，解析后的且未使用签名的cookie保存在req.cookies中
      req.cookies = cookie.parse(cookies);    //与express中调用cookie.serialize()对应，解析cookie
      req.cookies = JSONCookies(req.cookies);    // JSON字符序列转化为JSON对象
  ```

  

  ```jsx
      //./lib/parse.js
  
      //接续cookie中的JSON字符序列
      exports.JSONCookies = function(obj){
        var cookies = Object.keys(obj);    //获取obj对象的property
        var key;
        var val;
  
         //循环判断并解析
        for (var i = 0; i < cookies.length; i++) {
          key = cookies[i];
          val = exports.JSONCookie(obj[key]);
  
          //如果是JSON字符序列则保存
          if (val) {
            obj[key] = val;
          }
        }
  
        return obj;
      };
  
     //解析JSON字符序列
      exports.JSONCookie = function(str) {
        if (!str || str.substr(0, 2) !== 'j:') return; //判断是否为JSON字符序列，如果不是返回undefined
  
        try {
          return JSON.parse(str.slice(2));    //解析JSON字符序列
        } catch (err) {
          // no op
        }
      };
  ```

- 如果使用了signed功能，cookie-parser通过如下代码解析req.headers.cookie

  

  ```jsx
      //index.js
      var cookie = require('cookie');
      var parse = require('./lib/parse');
  
      if (req.cookies) return next(); //如果存在req.cookies跳过这个middleware
  
      //调用res.cookie(name, value , {singed: true})，express会使用req.secret。故使用了签名功能，需给cookie-parser传递secret，且res.cookie(name, value , {singed: true})需在cookie-parser插        
      //入express后再使用
      req.secret = secret;     
      req.cookies = Object.create(null);
      req.signedCookies = Object.create(null); //创建req.singedCookies，所有解析后的signed cookie都保存在这个对象中，req.cookies中没有任何signed cookie
  
      // 如果请求中没有cookies
      if (!cookies) {
        return next();
      }
  
      req.cookies = cookie.parse(cookies, options); //与express中调用cookie.serialize()对应，解析cookie
  
      // parse signed cookies
      if (secret) {
        //判断是否为singed cookie。如果是，则去掉签名，同时删除req.cookies中对应的property，将这些去掉签名的cookie组成一个对象，保存在req.signedCookies中
        req.signedCookies = parse.signedCookies(req.cookies, secret); 
        // JSON字符序列转化为JSON对象
        req.signedCookies = parse.JSONCookies(req.signedCookies);    
      }
  ```



```jsx
    //./lib/parse.js
    var signature = require('cookie-signature');

    exports.signedCookies = function(obj, secret){
      var cookies = Object.keys(obj);    //获取obj对象的property
      var dec;
      var key;
      var ret = Object.create(null);  //创建返回对象
      var val;

      for (var i = 0; i < cookies.length; i++) {
        key = cookies[i];
        val = obj[key];
        dec = exports.signedCookie(val, secret);

        //判断是否是去掉签名后的value，如果是保存该值到ret中同时删除obj中的相应property
        if (val !== dec) {
          ret[key] = dec;
          delete obj[key];
        }
      }

      return ret;
    };

    exports.signedCookie = function(str, secret){
        //判断是否添加了签名，如果添加了签名则去掉签名，否则返回原字符串
      return str.substr(0, 2) === 's:' 
        ? signature.unsign(str.slice(2), secret)
        : str;
    };
```

综上所诉，解析后的unsigned cookie保存在req.cookies中，而解析后的signed cookie只保存在req.signedCookies中。使用cookie-parser插件，后续代码直接使用req.cookies或者req.signedCookies即可