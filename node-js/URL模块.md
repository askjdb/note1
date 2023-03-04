# Node.js URL 模块

要加载 URL 模块，请使用 `require()` 方法:

```js
var url = require('url');
```

URL一共提供了三个方法，分别是`url.parse()`，`url.format()`，`url.resolve()`。



使用 `url.parse()` 方法解析地址，它将返回一个 URL 对象，地址的每个部分都作为属性:

语法如下：

```js
url.parse（urlString [，parseQueryString [，slashesDenoteHost]]）
```

- `urlString`：要解析的URL字符串。
- `parseQueryString`：默认为false，query返回的URL对象上的属性将是未解析，未解码的字符串。如果为true，则该query属性将始终设置为querystring模块parse() 方法返回的对象。
- `shashesDenoteHost`：默认为false，是否以斜线解析主机名。

实例

将网址拆分为可读部分:

```js
var url = require('url');
var adr = 'http://localhost:8080/default.htm?year=2017&month=february';
var q = url.parse(adr, true);

console.log(q.host); //returns 'localhost:8080'
console.log(q.pathname); //returns '/default.htm'
console.log(q.search); //returns '?year=2017&month=february'

var qdata = q.query; //returns an object: { year: 2017, month: 'february' }
console.log(qdata.month); //returns 'february'
```

### url.format()方法

`url.format()`方法将传入的url对象编程一个url字符串并返回。

语法如下：

```js
url.format(urlObject)
```

参数 urlObject 是URL对象（由返回url.parse()或以其他方式构造），如果是字符串，则通过将其传递给来将其转换为对象url.parse()。

### url.resolve()方法

`url.resolve()`方法以类似于解决锚标记HREF的Web浏览器的方式来解析相对于基础URL的目标URL，返回一个格式为"from/to"的字符串。

语法如下：

```js
url.resolve(from,to)

from -- 要解析的基本URL
to -- 正在解析的HREF URL
```

### url.hash属性

获取并设置URL的片段部分。分配给该`hash`属性的值中包含的无效URL字符已进行百分比编码。注意选择要百分比编码的字符可能会与url.parse()和 url.format()方法产生的字符有所不同。

### url.host属性

获取并设置URL的主机部分。分配给该`host`属性的无效主机值将被忽略。

### url.hostnam属性

获取并设置URL的主机名部分。`url.host` 和 `url.hostname` 之间的区别是 `url.hostname` 不包含端口。为 `hostname` 属性设置无效的值则会被忽略。

### url.href属性

获取及设置序列化的 URL。

获取 `href` 属性的值等同于调用url.toString()。将此属性的值设置为新值等同于使用 new URL(value) 创建新的URL对象。 URL 对象的每个属性都将被修改。如果给 href 属性设置的值是无效的 URL，则将会抛出 TypeError。

### url.origin属性

获取只读的序列化的 URL 的 origin。

### url.password属性

获取及设置 URL 的密码部分。分配给 `password` 属性的值中包含的无效 URL 字符是百分比编码的。 选择哪些字符进行百分比编码可能与url.parse() 和 url.format() 方法产生的内容有所不同。

### url.pathname属性

获取及设置 URL 的路径部分。

### url.port属性

获取及设置 URL 的端口部分。端口值可以是数字或包含 `0` 到 `65535`（含）范围内的数字字符串。 将值设置为给定 `protocol` 的 `URL` 对象的默认端口将会导致 `port` 值变为空字符串（`''`）。

端口值可以是空字符串，在这种情况下，端口取决于协议/规范：

- `ftp`：21
- `gopher`：70
- `http`：80
- `https`：443
- `ws`：80
- `wss`：443

在为端口分配值后，将首先使用 `.toString()` 将值转换为字符串。

### url.protocol属性

获取及设置 URL 的协议部分。分配给 `protocol` 属性的无效协议值将会被忽略。

### url.search属性

获取及设置 URL 的序列化查询部分。

### url.username属性

获取及设置 URL 的用户名部分。

### url.toString()方法

在 `URL` 对象上调用 `toString()` 方法将返回序列化的 URL。返回值与 url.href 和 url.toJSON() 的相同。

### url.toJSON()方法

在 URL 对象上调用 toJSON() 方法将返回序列化的 URL。 返回值与 url.href 和 url.toString() 的相同。