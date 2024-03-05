# fetch 处理响应数据

# fetch 基本用法

```ini
fetch('https://api.github.com/users/ruanyf')
  .then(response => response.json())
  .then(json => console.log(json))
  .catch(err => console.log('Request Failed', err)); 
```

`fetch()` 接收到的 `response` 是一个 `Stream` 对象， `response.json()` 是一个异步操作，格式化内容。

`await`写法：

```javascript
async function getJSON() {
  let url = 'https://api.github.com/users/ruanyf';
  try {
    let response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.log('Request Failed', error);
  }
}
```

# Response 对象

`fetch` 请求返回的 `Promis`e 通常情况下都会 `resolve`，只有遇到网络错误时才会 `reject`.

`Response` 包含的数据通过 `Stream` 接口异步读取，也包含一些同步属性可以直接读取，如

### response.ok

布尔值，表示请求是否成功

### response.status

数字，表示 HTTP 回应的状态码

### response.statusText

字符串，表示 HTTP 回应的状态信息

### response.url

请求的 URL。如果 URL 存在跳转，该属性返回的是最终 URL。

### response.type

请求的类型

### response.redirected

布尔值，表示请求是否发生过跳转。

通常通过 `response.ok` 或 `response.status` 判断请求是否成功

## 读取响应内容的方法

### response.json()

得到JSON对象。

### response.text()

得到文本字符串。

### response.blob()

得到二进制Blob对象。

### response.formData()

得到 FormData 表单对象。

### response.arrayBuffer()

得到二进制 ArrayBuffer 对象。

上面5个读取方法都是异步的，返回的都是 `Promise` 对象。

## response.clone()

`Stream` 对象只能读取一次，读取完就没了。这意味着，前一节的五个读取方法，只能使用一个，否则会报错。

`Response` 对象提供 `response.clone()` 方法，创建 `response` 对象的副本，实现多次读取。

## response.body 属性

`Response` 实现了 `Body` 接口，提供了两个属性。

### response.bodyUesd

只读属性，布尔值，标志 `response.body` 是否被读取过。

### response.body

`response.body` 是 `Response` 对象暴露出的底层接口，返回一个 `ReadableStream` 对象，供用户操作。

它可以用来分块读取内容，应用之一就是显示下载的进度。

```javascript
javascript复制代码const response = await fetch('flower.jpg');
const reader = response.body.getReader();

while(true) {
  const {done, value} = await reader.read();

  if (done) {
    break;
  }

  console.log(`Received ${value.length} bytes`)
}
```

上面示例中，`response.body.getReader()` 方法返回一个遍历器。这个遍历器的 `read()` 方法每次返回一个对象，表示本次读取的内容块。

这个对象的 `done` 属性是一个布尔值，用来判断有没有读完；`value` 属性是一个 `arrayBuffer` 数组，表示内容块的内容，而 `value.length` 属性是当前块的大小。