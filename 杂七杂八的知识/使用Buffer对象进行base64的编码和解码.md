# 使用Buffer对象进行base64的编码和解码

### 编码

流程：先将待编码的字符串转成[Buffer](https://so.csdn.net/so/search?q=Buffer&spm=1001.2101.3001.7020)对象，然后将Buffer中的内容用Base64编码导出编码后的base64字符串

代码:

```js
let str = "我是待编码的字符串"

console.log(str) // 输出： 我是待编码的字符串
let buffer = Buffer.from(str, 'utf-8')

var base64Str = buffer.toString('base64')
console.log('base64编码后的字符串: '+base64Str) // 输出：base64编码后的字符串: 5oiR5piv5b6F57yW56CB55qE5a2X56ym5Liy

```

##### 注意

转成buffer对象的时候要指定原始字符串的编码，如上例中

> let buffer = Buffer.from(str, ‘utf-8’)

指定了从utf-8编码转为buffer对象，而转为[base64](https://so.csdn.net/so/search?q=base64&spm=1001.2101.3001.7020)编码后的字符串时

> var base64Str = buffer.toString(‘base64’)

指定了buffer转成字符串时使用base64编码

### 解码

流程：先将base64编码后的字符串转成buffer对象，然后将buffer对象转成utf-8或者其他格式的字符串

代码如下：

```js
let str = "我是待编码的字符串"

console.log(str)
let buffer = Buffer.from(str, 'utf-8')

var base64Str = buffer.toString('base64')
console.log('base64编码后的字符串: '+base64Str)

let rawStr = Buffer.from(base64Str,'base64').toString('utf-8')
console.log('base64解码后的字符串: ',rawStr)

```

### 总结

编码和解码类似，都是先将字符串转为Buffer对象，然后从buffer导出其他格式编码的字符串，只要注意指定写入buffer对象时和导出字符串时指定正确的编码就可以了。