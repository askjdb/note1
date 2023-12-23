# CSS堵塞和JS堵塞



## CSS

#### 1. CSS 文件是并行下载的

#### 2. CSS 并不会阻塞构建 `DOM树`

#### 3. CSS 的下载不会阻塞后面 JS 的下载，但是 JS 下载完成后，被阻塞执行

但是， CSS 加载会影响 JS 代码的执行，这个起初我也感觉很不可思议，让我们来看个例子：

为了方便测试，大家可以把谷歌浏览器的网速进行设置

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/353da72244bc4c7881f56879f91eb03c~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3f4633f0e7124141a28d9be0da2d2d3d~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>css阻塞</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script>
        alert('文档开始解析了!');
    </script>
    <link href="https://cdn.bootcss.com/bootstrap/4.0.0-alpha.6/css/bootstrap.css" rel="stylesheet">
</head>
<body>
<h1>这是红色的</h1>
</body>
<script>
    alert('文档解析结束了!');
</script>
</html>
```

文档会从上往下进行解析，先执行 `alert('文档开始解析了!');` ，然后，遇到 `link` 标签，加载外链 `CSS` ,直到加载完成之后，才会执行下面的 `alert('文档解析结束了!');` 。

这是由于 JS 可能会获取或者改变元素的样式，所以浏览器会按照顺序，等上面的 CSS 加载解析完成之后，再执行下面的 JS 。

## JS

1. 现代浏览器会并行加载 JS 文件，但是按照书写顺序执行代码
2. 加载或者执行 JS 时会阻塞构建 `DOM树`，只有等到js执行完毕，浏览器才会继续解析 DOM 。没有 `DOM树` ，浏览器就无法渲染，所以当加载很大的 JS 文件时，可以看到页面很长时间是一片空白。

这是由于 `JS引擎线程` 与 `GUI渲染线程` 互斥。

至于互斥的初衷，主要是因为加载的 JS 中可能会创建，删除节点等，这些操作会对 `DOM树` 产生影响，如果不阻塞，等浏览器解析完标签生成 `DOM树`后， JS 修改了某些节点，那么浏览器又得重新解析，然后重新生成 `DOM树`，性能比较差。

如果你不想 JS 阻塞你的 `DOM树` 生成，也是有方法的。

### defer / async

`defer` 和 `async` 都是作用于 `外链JS` 的。对于 `内部JS` 是没有效果的。

`defer` 和 `async` 都是异步的，主要的区别在于执行顺序以及执行的时间。

`async` 标志的脚本文件一旦加载完成就会立即执行，并且不会按照书写顺序，谁下载好了就直接执行。所以适用于那些没有代码依赖顺序，并且没有 `DOM操作` 的脚本文件。

`defer` 标志的脚本文件会严格按照书写顺序执行，并且，会在 DOMContentLoaded 事件之前（也就是页面DOM加载完成时）执行。适用于有 `DOM操作` ，或者是有代码依赖顺序的脚本文件。

