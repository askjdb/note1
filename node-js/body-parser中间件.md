# body-parser 使用详解

#### 搭建一个简单的demo



```bash
mkdir body-parser-demo
cd body-parser-demo

npm init -y
npm install express body-parser --save
```

在根目录下创建`index.js`



```tsx
var express = require('express')
var bodyParser = require('body-parser')

const localPort = 3000
var app = express()

// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })


app.post('/login.do', (req, res) => {
    console.log('********************')
    console.log(req.body)

    res.end();
})

app.listen(localPort, () => {
    console.log('http://127.0.0.1:%s', host, port)
})
```

执行`node index.js`

网络模拟请求使用`Postman`工具

![img](https:////upload-images.jianshu.io/upload_images/3276385-4c2bb57dff5e54ed.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)

Postman



#### 不使用中间件，直接获取`body`

执行结果：

> ```
> undefined
> ```

#### JSON解析器



```tsx
app.post('/login.do', jsonParser, (req, res) => {
    console.log('********************')
    console.log(req.body)

    res.end();
})
```

Postman 以raw 方式发送JSON 数据，执行结果：

> ```
> { name: 'wang', password: '123456' }
> ```

注：如果在模拟器上以非`JSON`格式发送，则会获得一个空的`JSON`对象

#### urlencoded解析器



```tsx
app.post('/login.do', urlencodedParser, (req, res) => {
    console.log('********************')
    console.log(req.body)

    res.end();
})
```

![img](https:////upload-images.jianshu.io/upload_images/3276385-0dbb7438baaabb1e.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)

Postman



执行结果：

> ```
> { name: 'wang', password: '123456' }
> ```

#### 加载到没有挂载路径的中间件



```rust
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
```



# 关于bodyParser.json( )与bodyParser.urlencoded( )

bodyParser.json(options) options可选 ， 这个方法返回一个仅仅用来解析json格式的中间件。这个中间件能接受任何body中任何Unicode编码的字符。支持自动的解析gzip和 zlib。

bodyParser.urlencoded(options) options可选，这个方法也返回一个中间件，这个中间件用来解析body中的urlencoded字符， 只支持utf-8的编码的字符。同样也支持自动的解析gzip和 zlib。
bodyParser.json是用来解析json数据格式的。bodyParser.urlencoded则是用来解析我们通常的form表单提交的数据，也就是请求头中包含这样的信息： Content-Type: application/x-www-form-urlencoded

常见的四种Content-Type类型：

application/x-www-form-urlencoded 常见的form提交

multipart/form-data 文件提交

application/json 提交json格式的数据

text/xml 提交xml格式的数据

bodyParser.urlencoded 模块用于解析req.body的数据，解析成功后覆盖原来的req.body，如果解析失败则为 {}。

## 创建body中间件时，express.urlencoded 中设置 extended 为 true 和 false 有什么区别吗？

一、采用的模块的区别
        如果设置为false，那么对URL-encoded的数据的解析采用querystring库；
        如果设置为true，那么采用qs库，允许将富对象和数组编码为url编码格式，允许使用url编码的json体验。

二、返回的对象格式的区别
        返回的对象是一个键值对，

​				当extended为**false**的时候，键值对中的值就为'String'或'Array'形式，

​        		当extended为**true**的时候，则可为任何数据类型。

![img](https://img-blog.csdnimg.cn/img_convert/d7fbe0cb7f20c6ae8597472f184ad796.png)