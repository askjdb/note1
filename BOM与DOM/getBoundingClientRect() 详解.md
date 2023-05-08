# getBoundingClientRect() 详解



## `getBoundingClientRect()`

`getBoundingClientRect()` 返回的是矩形的集合，表示了当前盒子在浏览器中的位置以及自身占据的空间的大小，除了 `width` 和 `height` 以外的属性是相对于 `视图窗口的左上角` 来计算的。

如：`bottom` 是`盒子底部边框` 距离 `视口顶部` 的距离；`right` 是`盒子右侧边框`距离`视口左侧`的距离。

```
位置相关属性：
```

## `getBoundingClientRect()`

`getBoundingClientRect()` 返回的是矩形的集合，表示了当前盒子在浏览器中的位置以及自身占据的空间的大小，除了 `width` 和 `height` 以外的属性是相对于 `视图窗口的左上角` 来计算的。

如：`bottom` 是`盒子底部边框` 距离 `视口顶部` 的距离；`right` 是`盒子右侧边框`距离`视口左侧`的距离。

```
位置相关属性：
```

![getBoundingClientRect.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a3cc7788243749bcabefd0b9cad249c5~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp?)

```
自身宽高属性：
```

如果是标准盒子模型，元素的尺寸等于width/height + padding + border-width的总和。如果box-sizing: border-box，元素的的尺寸等于 width/height。

### 实例

盒子有无滚动条，对该方法没有影响，它获取的是盒子在页面上占据的空间，滚动的区域是隐藏起来的内容，不会影响该方法的宽高。

```html
<style>
  * {
    margin: 0;
    padding: 0;
  }
  .box {
    width: 400px;
    height: 200px;
    margin: 100px auto;
    border: 1px solid #ccc;
  }
  .child {
    width: 200px;
    height: 100px;
    margin: 20px;
    border: 1px solid #ccc;
  }
</style>
<body>
  <div class="box">
    <div class="child">
      child
    </div>
  </div>
</body>
<script>
  const childDom = document.querySelector('.child');
  console.log(childDom.getBoundingClientRect());
  // --- 相对于视口左上角的位置，均是 numer ---
  // top: 100     --- 盒子上边框距离视口顶部的距离
  // bottom: 302  --- 盒子底边框距离视口顶部的距离 = top + height
  // left: 394    --- 盒子左边框距离视口左侧的距离
  // right: 796   --- 盒子右边框距离视口左侧的距离 = left + width
  // x: 394       --- 盒子左上角相对于视口左侧的距离
  // y: 100       --- 盒子左上角相对于视口顶部的距离

  // 盒子的宽高
  // width: 402
  // height: 202
</script>
复制代码
自身宽高属性：
```

如果是标准盒子模型，元素的尺寸等于width/height + padding + border-width的总和。如果box-sizing: border-box，元素的的尺寸等于 width/height。

### 实例

盒子有无滚动条，对该方法没有影响，它获取的是盒子在页面上占据的空间，滚动的区域是隐藏起来的内容，不会影响该方法的宽高。

```html
<style>
  * {
    margin: 0;
    padding: 0;
  }
  .box {
    width: 400px;
    height: 200px;
    margin: 100px auto;
    border: 1px solid #ccc;
  }
  .child {
    width: 200px;
    height: 100px;
    margin: 20px;
    border: 1px solid #ccc;
  }
</style>
<body>
  <div class="box">
    <div class="child">
      child
    </div>
  </div>
</body>
<script>
  const childDom = document.querySelector('.child');
  console.log(childDom.getBoundingClientRect());
  // --- 相对于视口左上角的位置，均是 numer ---
  // top: 100     --- 盒子上边框距离视口顶部的距离
  // bottom: 302  --- 盒子底边框距离视口顶部的距离 = top + height
  // left: 394    --- 盒子左边框距离视口左侧的距离
  // right: 796   --- 盒子右边框距离视口左侧的距离 = left + width
  // x: 394       --- 盒子左上角相对于视口左侧的距离
  // y: 100       --- 盒子左上角相对于视口顶部的距离

  // 盒子的宽高
  // width: 402
  // height: 202
</script>
```