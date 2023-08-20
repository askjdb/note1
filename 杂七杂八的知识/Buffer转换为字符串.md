# [nodejs 里字符串同Buffer之间的互转](https://www.cnblogs.com/baby123/p/13971823.html)

1.string转buffer

```js
var str = 'hello,world';
var buffer = Buffer.from(str)
```

buffer的值为

<Buffer 68 65 6c 6c 6f 2c 77 6f 72 6c 64>

转回字符串

```js
buffer.toString()
```

hello,world

2.使用 Uint8Array

```js
var array = new Uint8Array(new ArrayBuffer(str.length));
for (var i = 0, il = str.length; i < il; i++) {
    var value = str.charCodeAt(i);
    array[i] = value > 0xFF ? 0x20 : value;
}
var arrBuffer=array.buffer
```

arrBuffer的值为

ArrayBuffer {
[Uint8Contents]: <68 65 6c 6c 6f 2c 77 6f 72 6c 64>,
byteLength: 11
}

转成buffer

```
Buffer.from(array.buffer)
```

转成字符串

```
(Buffer.from(array.buffer)).toString()
```

<Buffer 68 65 6c 6c 6f 2c 77 6f 72 6c 64>

```
(Buffer.from(array.buffer)).toString()
```

hello,world







buf.toString()方法可传入一个指示编码格式的参数（参考NodeJS文档），如果可以通过设置编码格式使得toString()方法不发生乱码则这个问题迎刃而解。其默认值为utf-8.
但是多数情况下我们并不能找到一种合适的编码格式，比如当buf是来自一个图片的二进制数据时，所以最好的方法还是尽量避免这种操作…

[Node](https://so.csdn.net/so/search?q=Node&spm=1001.2101.3001.7020).js 当前支持的字符编码如下：

> 'utf8': 多字节编码的 Unicode 字符。 许多网页和其他文档格式都使用 UTF-8。 这是默认的字符编码。 当将 Buffer 解码为不专门包含有效 UTF-8 数据的字符串时，则会使用 Unicode 替换字符 U+FFFD � 来表示这些错误。
> 'utf16le': 多字节编码的 Unicode 字符。 与 ‘utf8’ 不同，字符串中的每个字符都会使用 2 个或 4 个字节进行编码。 Node.js 仅支持 UTF-16 的小端序变体。
> 'latin1': Latin-1 代表 ISO-8859-1。 此字符编码仅支持从 U+0000 到 U+00FF 的 Unicode 字符。 每个字符使用单个字节进行编码。 超出该范围的字符会被截断，并映射成该范围内的字符。
> 'base64': Base64 编码。 当从字符串创建 Buffer 时，此编码也会正确地接受 RFC 4648 第 5 节中指定的 “URL 和文件名安全字母”。 base64 编码的字符串中包含的空格字符（例如空格、制表符和换行）会被忽略。
> 'hex': 将每个字节编码成两个十六进制的字符。 当解码仅包含有效的十六进制字符的字符串时，可能会发生数据截断。 请参见下面的示例。
> 'ascii': 仅适用于 7 位 ASCII 数据。 当将字符串编码为 Buffer 时，这等效于使用 ‘latin1’。 当将 Buffer 解码为字符串时，则使用此编码会在解码为 ‘latin1’ 之前额外取消设置每个字节的最高位。 通常，当在编码或解码纯 ASCII 文本时，应该没有理由使用这种编码，因为 ‘utf8’（或者，如果已知的数据始终为纯 ASCII，则为 ‘latin1’）会是更好的选择。 这仅为传统的兼容性而提供。
> 'binary': ‘latin1’ 的别名。 有关此编码的更多背景，请参阅二进制字符串。 该编码的名称可能会引起误解，因为此处列出的所有编码都是在字符串和二进制数据之间转换。 对于在字符串和 Buffer 之间进行转换，通常 ‘utf-8’ 是正确的选择。
> 'ucs2': ‘utf16le’ 的别名。 UCS-2 以前是指 UTF-16 的一种变体，该变体不支持代码点大于 U+FFFF 的字符。 在 Node.js 中，始终支持这些代码点。