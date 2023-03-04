## 安装 Express

安装Express并将其保存到依赖列表中：

```
$ npm install express --save
```

以上命令会将Express框架安装在当期目录的**node_modules**目录中， **node_modules**目录下会自动创建express目录。以下几个重要的模块是需要与express框架一起安装的：

- **body-parser** - node.js中间件，用于处理JSON, Raw, Text和URL编码的数据。
- **cookie-parser** - 这就是一个解析Cookie的工具。通过req.cookies可以取到传过来的cookie，并把它们转成对象。
- **multer** - node.js中间件，用于处理enctype="multipart/form-data"（设置表单的MIME编码）的表单数据。

```
$ npm install body-parser --save
$ npm install cookie-parser --save
$ npm install multer --save
```

------

## 第一个 Express 框架实例

接下来我们使用Express框架来输出"Hello World"。

以下实例中我们引入了express模块，并在客户端发起请求后，响应"Hello World"字符串。

创建express_demo.js文件，代码如下所示：

```js
//express_demo.js 文件
var express = require('express');
var app = express();

app.get('/', function (req, res) {
   res.send('Hello World');
})

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("应用实例，访问地址为 http://%s:%s", host, port)

})
```

执行以上代码：

```
$ node express_demo.js 
应用实例，访问地址为 http://0.0.0.0:8081
```

在浏览器中访问http://127.0.0.1:8081，结果如下图所示：

![img](https://atts.w3cschool.cn/attachments/image/nodejs_sample.jpg)

------

## 请求和响应

Express应用使用回调函数的参数： **request**和**response**对象来处理请求和响应的数据。

```
app.get('/', function (req, res) {
   // --
})
```

**request**和**response**对象的具体介绍：

**Request 对象** - request对象表示HTTP请求，包含了请求查询字符串，参数，内容，HTTP头部等属性。常见属性有：

1. req.app：当callback为外部文件时，用req.app访问express的实例
2. req.baseUrl：获取路由当前安装的URL路径
3. req.body / req.cookies：获得「请求主体」/ Cookies
4. req.fresh / req.stale：判断请求是否还「新鲜」
5. req.hostname / req.ip：获取主机名和IP地址
6. req.originalUrl：获取原始请求URL
7. req.params：获取路由的parameters
8. req.path：获取请求路径
9. req.protocol：获取协议类型
10. req.query：获取URL的查询参数串
11. req.route：获取当前匹配的路由
12. req.subdomains：获取子域名
13. req.accpets（）：检查请求的Accept头的请求类型
14. req.acceptsCharsets / req.acceptsEncodings / req.acceptsLanguages
15. req.get（）：获取指定的HTTP请求头
16. req.is（）：判断请求头Content-Type的MIME类型

**Response 对象** - response对象表示HTTP响应，即在接收到请求时向客户端发送的HTTP响应数据。常见属性有：

1. res.app：同req.app一样
2. res.append（）：追加指定HTTP头
3. res.set（）在res.append（）后将重置之前设置的头
4. res.cookie（name，value [，option]）：设置Cookie
5. opition: domain / expires / httpOnly / maxAge / path / secure / signed
6. res.clearCookie（）：清除Cookie
7. res.download（）：传送指定路径的文件
8. res.get（）：返回指定的HTTP头
9. res.json（）：传送JSON响应
10. res.jsonp（）：传送JSONP响应
11. res.location（）：只设置响应的Location HTTP头，不设置状态码或者close response
12. res.redirect（）：设置响应的Location HTTP头，并且设置状态码302
13. res.send（）：传送HTTP响应
14. res.sendFile（path [，options] [，fn]）：传送指定路径的文件 -会自动根据文件extension设定Content-Type
15. res.set（）：设置HTTP头，传入object可以一次设置多个头
16. res.status（）：设置HTTP状态码
17. res.type（）：设置Content-Type的MIME类型

------

## 路由

我们已经了解了HTTP请求的基本应用，而路由决定了由谁(指定脚本)去响应客户端请求。

在HTTP请求中，我们可以通过路由提取出请求的URL以及GET/POST参数。

接下来我们扩展Hello World，添加一些功能来处理更多类型的HTTP请求。

创建express_demo2.js文件，代码如下所示：

```
var express = require('express');
var app = express();

//  主页输出 "Hello World"
app.get('/', function (req, res) {
   console.log("主页 GET 请求");
   res.send('Hello GET');
})


//  POST 请求
app.post('/', function (req, res) {
   console.log("主页 POST 请求");
   res.send('Hello POST');
})

//  /del_user 页面响应
app.delete('/del_user', function (req, res) {
   console.log("/del_user 响应 DELETE 请求");
   res.send('删除页面');
})

//  /list_user 页面 GET 请求
app.get('/list_user', function (req, res) {
   console.log("/list_user GET 请求");
   res.send('用户列表页面');
})

// 对页面 abcd, abxcd, ab123cd, 等响应 GET 请求
app.get('/ab*cd', function(req, res) {   
   console.log("/ab*cd GET 请求");
   res.send('正则匹配');
})


var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("应用实例，访问地址为 http://%s:%s", host, port)

})
```

执行以上代码：

```
$ node express_demo2.js 
应用实例，访问地址为 http://0.0.0.0:8081
```

接下来你可以尝试访问http://127.0.0.1:8081不同的地址，查看效果。

在浏览器中访问http://127.0.0.1:8081/list_user，结果如下图所示：

![1](https://atts.w3cschool.cn/attachments/image/20211203/1638523361154676.png)

在浏览器中访问http://127.0.0.1:8081/abcd，结果如下图所示：

![1](https://atts.w3cschool.cn/attachments/image/20211203/1638523390468746.png)

在浏览器中访问http://127.0.0.1:8081/abcdefg，结果如下图所示：

![11](https://atts.w3cschool.cn/attachments/image/20211203/1638523439171587.png)

------

## 静态文件

Express提供了内置的中间件**express.static**来设置静态文件如：图片，CSS, JavaScript等。

你可以使用**express.static**中间件来设置静态文件路径。例如，如果你将图片， CSS, JavaScript文件放在public目录下，你可以这么写：

```
app.use(express.static('public'));
```

我们可以到public/images目录下放些图片,如下所示：

```
node_modules
server.js
public/
public/images
public/images/logo.png
```

让我们再修改下"Hello Word"应用添加处理静态文件的功能。

创建express_demo3.js文件，代码如下所示：

```
var express = require('express');
var app = express();

app.use(express.static('public'));

app.get('/', function (req, res) {
   res.send('Hello World');
})

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("应用实例，访问地址为 http://%s:%s", host, port)

})
```

执行以上代码：

```
$ node express_demo3.js 
应用实例，访问地址为 http://0.0.0.0:8081
```

执行以上代码：

在浏览器中访问 http://127.0.0.1:8081/images/logo.png（本实例采用了W3Cschool教程的logo），结果如下图所示：

![img](https://atts.w3cschool.cn/attachments/image/youj-logo.png)

------

## GET 方法

以下实例演示了在表单中通过GET方法提交两个参数，我们可以使用server.js文件内的**process_get**路由器来处理输入：

index.htm文件代码如下：

```
<html>
<body>
<form action="http://127.0.0.1:8081/process_get" method="GET">
First Name: <input type="text" name="first_name">  <br>

Last Name: <input type="text" name="last_name">
<input type="submit" value="Submit">
</form>
</body>
</html>
```

server.js文件代码如下:

```
var express = require('express');
var app = express();

app.use(express.static('public'));

app.get('/index.htm', function (req, res) {
   res.sendFile( __dirname + "/" + "index.htm" );
})

app.get('/process_get', function (req, res) {

   // 输出 JSON 格式
   response = {
       first_name:req.query.first_name,
       last_name:req.query.last_name
   };
   console.log(response);
   res.end(JSON.stringify(response));
})

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("应用实例，访问地址为 http://%s:%s", host, port)

})
```

执行以上代码：

```
node server.js 
应用实例，访问地址为 http://0.0.0.0:8081
```

浏览器访问 http://127.0.0.1:8081/index.htm，如图所示：

![1](https://atts.w3cschool.cn/attachments/image/20211203/1638523229830681.png)

现在你可以向表单输入数据，并提交，如下演示：

![4](https://atts.w3cschool.cn/attachments/image/20211203/1638523137579455.gif)

------

## POST 方法

以下实例演示了在表单中通过POST方法提交两个参数，我们可以使用server.js文件内的**process_post**路由器来处理输入：

index.htm文件代码修改如下：

```
<html>
<body>
<form action="http://127.0.0.1:8081/process_post" method="POST">
First Name: <input type="text" name="first_name">  <br>

Last Name: <input type="text" name="last_name">
<input type="submit" value="Submit">
</form>
</body>
</html>
```

server.js文件代码修改如下:

```
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(express.static('public'));

app.get('/index.htm', function (req, res) {
   res.sendFile( __dirname + "/" + "index.htm" );
})

app.post('/process_post', urlencodedParser, function (req, res) {

   // 输出 JSON 格式
   response = {
       first_name:req.body.first_name,
       last_name:req.body.last_name
   };
   console.log(response);
   res.end(JSON.stringify(response));
})

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("应用实例，访问地址为 http://%s:%s", host, port)

})
```

执行以上代码：

```
$ node server.js
应用实例，访问地址为 http://0.0.0.0:8081
```

浏览器访问http://127.0.0.1:8081/index.htm，如图所示：

![1](https://atts.w3cschool.cn/attachments/image/20211203/1638523681522976.png)

现在你可以向表单输入数据，并提交，如下演示：

![6](https://atts.w3cschool.cn/attachments/image/20211203/1638523867360999.gif)

------

## 文件上传

以下我们创建一个用于上传文件的表单，使用POST方法，表单enctype属性设置为multipart/form-data。

index.htm文件代码修改如下：

```
<html>
<head>
<title>文件上传表单</title>
</head>
<body>
<h3>文件上传：</h3>
选择一个文件上传: <br />
<form action="/file_upload" method="post" enctype="multipart/form-data">
<input type="file" name="image" size="50" />
<br />
<input type="submit" value="上传文件" />
</form>
</body>
</html>
```

server.js文件代码修改如下:

```
var express = require('express');
var app = express();
var fs = require("fs");

var bodyParser = require('body-parser');
var multer  = require('multer');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ dest: '/tmp/'}).array('image'));

app.get('/index.htm', function (req, res) {
   res.sendFile( __dirname + "/" + "index.htm" );
})

app.post('/file_upload', function (req, res) {

   console.log(req.files[0]);  // 上传的文件信息

   var des_file = __dirname + "/" + req.files[0].originalname;
   fs.readFile( req.files[0].path, function (err, data) {
        fs.writeFile(des_file, data, function (err) {
         if( err ){
              console.log( err );
         }else{
               response = {
                   message:'File uploaded successfully', 
                   filename:req.files[0].originalname
              };
          }
          console.log( response );
          res.end( JSON.stringify( response ) );
       });
   });
})

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("应用实例，访问地址为 http://%s:%s", host, port)

})
```

执行以上代码：

```
$ node server.js 
应用实例，访问地址为 http://0.0.0.0:8081
```

浏览器访问http://127.0.0.1:8081/index.htm，如图所示：

![1111](https://atts.w3cschool.cn/attachments/image/20211203/1638524418897562.png)

现在你可以向表单输入数据，并提交，如下演示：

![1](https://atts.w3cschool.cn/attachments/image/20211203/1638524747208147.gif)

------

## Cookie 管理

我们可以使用中间件向Node.js服务器发送cookie信息，以下代码输出了客户端发送的cookie信息：

```
// express_cookie.js 文件
var express      = require('express')
var cookieParser = require('cookie-parser')

var app = express()
app.use(cookieParser())

app.get('/', function(req, res) {
  console.log("Cookies: ", req.cookies)
})

app.listen(8081)
```

执行以上代码：

```
$ node express_cookie.js 
```

现在你可以访问 http://127.0.0.1:8081 并查看终端信息的输出，如下演示：

![3](https://atts.w3cschool.cn/attachments/image/20211203/1638525481488380.gif)

# Express 中间件

# 使用中间件

Express 是一个自身功能极简，完全是由路由和中间件构成一个的 web 开发框架：从本质上来说，一个 Express 应用就是在调用各种中间件。

*中间件（Middleware）* 是一个函数，它可以访问请求对象（[request object](http://www.expressjs.com.cn/4x/api.html#req) (`req`)）, 响应对象（[response object](http://www.expressjs.com.cn/4x/api.html#res) (`res`)）, 和 web 应用中处于请求-响应循环流程中的中间件，一般被命名为 `next` 的变量。

中间件的功能包括：

- 执行任何代码。
- 修改请求和响应对象。
- 终结请求-响应循环。
- 调用堆栈中的下一个中间件。

如果当前中间件没有终结请求-响应循环，则必须调用 `next()` 方法将控制权交给下一个中间件，否则请求就会挂起。

Express 应用可使用如下几种中间件：

- [应用级中间件](http://www.expressjs.com.cn/guide/using-middleware.html#middleware.application)
- [路由级中间件](http://www.expressjs.com.cn/guide/using-middleware.html#middleware.router)
- [错误处理中间件](http://www.expressjs.com.cn/guide/using-middleware.html#middleware.error-handling)
- [内置中间件](http://www.expressjs.com.cn/guide/using-middleware.html#middleware.built-in)
- [第三方中间件](http://www.expressjs.com.cn/guide/using-middleware.html#middleware.third-party)

使用可选则挂载路径，可在应用级别或路由级别装载中间件。另外，你还可以同时装在一系列中间件函数，从而在一个挂载点上创建一个子中间件栈。

## 应用级中间件

应用级中间件绑定到 [app 对象](http://www.expressjs.com.cn/4x/api.html#app) 使用 `app.use()` 和 `app.METHOD()`，其中， `METHOD` 是需要处理的 HTTP 请求的方法，例如 GET, PUT, POST 等等，全部小写。例如：

```javascript
var app = express();

// 没有挂载路径的中间件，应用的每个请求都会执行该中间件
app.use(function (req, res, next) {
  console.log('Time:', Date.now());
  next();
});

// 挂载至 /user/:id 的中间件，任何指向 /user/:id 的请求都会执行它
app.use('/user/:id', function (req, res, next) {
  console.log('Request Type:', req.method);
  next();
});

// 路由和句柄函数(中间件系统)，处理指向 /user/:id 的 GET 请求
app.get('/user/:id', function (req, res, next) {
  res.send('USER');
});
```

下面这个例子展示了在一个挂载点装载一组中间件。

```javascript
// 一个中间件栈，对任何指向 /user/:id 的 HTTP 请求打印出相关信息
app.use('/user/:id', function(req, res, next) {
  console.log('Request URL:', req.originalUrl);
  next();
}, function (req, res, next) {
  console.log('Request Type:', req.method);
  next();
});
```

作为中间件系统的路由句柄，使得为路径定义多个路由成为可能。在下面的例子中，为指向 `/user/:id` 的 GET 请求定义了两个路由。第二个路由虽然不会带来任何问题，但却永远不会被调用，因为第一个路由已经终止了请求-响应循环。

```javascript
// 一个中间件栈，处理指向 /user/:id 的 GET 请求
app.get('/user/:id', function (req, res, next) {
  console.log('ID:', req.params.id);
  next();
}, function (req, res, next) {
  res.send('User Info');
});

// 处理 /user/:id， 打印出用户 id
app.get('/user/:id', function (req, res, next) {
  res.end(req.params.id);
});
```

如果需要在中间件栈中跳过剩余中间件，调用 `next('route')` 方法将控制权交给下一个路由。**注意**： `next('route')` 只对使用 `app.VERB()` 或 `router.VERB()` 加载的中间件有效。

```javascript
// 一个中间件栈，处理指向 /user/:id 的 GET 请求
app.get('/user/:id', function (req, res, next) {
  // 如果 user id 为 0, 跳到下一个路由
  if (req.params.id == 0) next('route');
  // 否则将控制权交给栈中下一个中间件
  else next(); //
}, function (req, res, next) {
  // 渲染常规页面
  res.render('regular');
});

// 处理 /user/:id， 渲染一个特殊页面
app.get('/user/:id', function (req, res, next) {
  res.render('special');
});
```

## 路由级中间件

路由级中间件和应用级中间件一样，只是它绑定的对象为 `express.Router()`。

```javascript
var router = express.Router();
```

路由级使用 `router.use()` 或 `router.VERB()` 加载。

上述在应用级创建的中间件系统，可通过如下代码改写为路由级：

```javascript
var app = express();
var router = express.Router();

// 没有挂载路径的中间件，通过该路由的每个请求都会执行该中间件
router.use(function (req, res, next) {
  console.log('Time:', Date.now());
  next();
});

// 一个中间件栈，显示任何指向 /user/:id 的 HTTP 请求的信息
router.use('/user/:id', function(req, res, next) {
  console.log('Request URL:', req.originalUrl);
  next();
}, function (req, res, next) {
  console.log('Request Type:', req.method);
  next();
});

// 一个中间件栈，处理指向 /user/:id 的 GET 请求
router.get('/user/:id', function (req, res, next) {
  // 如果 user id 为 0, 跳到下一个路由
  if (req.params.id == 0) next('route');
  // 负责将控制权交给栈中下一个中间件
  else next(); //
}, function (req, res, next) {
  // 渲染常规页面
  res.render('regular');
});

// 处理 /user/:id， 渲染一个特殊页面
router.get('/user/:id', function (req, res, next) {
  console.log(req.params.id);
  res.render('special');
});

// 将路由挂载至应用
app.use('/', router);
```

## 错误处理中间件

错误处理中间件有 *4* 个参数，定义错误处理中间件时必须使用这 4 个参数。即使不需要 `next` 对象，也必须在签名中声明它，否则中间件会被识别为一个常规中间件，不能处理错误。

错误处理中间件和其他中间件定义类似，只是要使用 4 个参数，而不是 3 个，其签名如下： `(err, req, res, next)`。

```javascript
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
```

请参考 [错误处理](http://www.expressjs.com.cn/guide/error-handling.html) 一章了解更多关于错误处理中间件的内容。

## 内置中间件

从 4.x 版本开始，, Express 已经不再依赖 [Connect](https://github.com/senchalabs/connect) 了。除了 `express.static`, Express 以前内置的中间件现在已经全部单独作为模块安装使用了。请参考 [中间件列表](https://github.com/senchalabs/connect#middleware)。

#### express.static(root, [options])

`express.static` 是 Express 唯一内置的中间件。它基于 [serve-static](https://github.com/expressjs/serve-static)，负责在 Express 应用中提托管静态资源。

参数 `root` 指提供静态资源的根目录。

可选的 `options` 参数拥有如下属性。

| 属性           | 描述                                                         | 类型     | 缺省值       |
| :------------- | :----------------------------------------------------------- | :------- | :----------- |
| `dotfiles`     | 是否对外输出文件名以点（`.`）开头的文件。可选值为 “allow”、“deny” 和 “ignore” | String   | “ignore”     |
| `etag`         | 是否启用 etag 生成                                           | Boolean  | `true`       |
| `extensions`   | 设置文件扩展名备份选项                                       | Array    | `[]`         |
| `index`        | 发送目录索引文件，设置为 `false` 禁用目录索引。              | Mixed    | “index.html” |
| `lastModified` | 设置 `Last-Modified` 头为文件在操作系统上的最后修改日期。可能值为 `true` 或 `false`。 | Boolean  | `true`       |
| `maxAge`       | 以毫秒或者其[字符串格式](https://www.npmjs.org/package/ms)设置 Cache-Control 头的 max-age 属性。 | Number   | 0            |
| `redirect`     | 当路径为目录时，重定向至 “/”。                               | Boolean  | `true`       |
| `setHeaders`   | 设置 HTTP 头以提供文件的函数。                               | Function |              |

下面的例子使用了 `express.static` 中间件，其中的 `options` 对象经过了精心的设计。

```javascript
var options = {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['htm', 'html'],
  index: false,
  maxAge: '1d',
  redirect: false,
  setHeaders: function (res, path, stat) {
    res.set('x-timestamp', Date.now());
  }
}

app.use(express.static('public', options));
```

每个应用可有多个静态目录。

```javascript
app.use(express.static('public'));
app.use(express.static('uploads'));
app.use(express.static('files'));
```

更多关于 `serve-static` 和其参数的信息，请参考 [serve-static](https://github.com/expressjs/serve-static) 文档。

## 第三方中间件

通过使用第三方中间件从而为 Express 应用增加更多功能。

安装所需功能的 node 模块，并在应用中加载，可以在应用级加载，也可以在路由级加载。

下面的例子安装并加载了一个解析 cookie 的中间件： `cookie-parser`

```sh
$ npm install cookie-parser
var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');

// 加载用于解析 cookie 的中间件
app.use(cookieParser());
```