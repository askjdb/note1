# 超好用的API之IntersectionObserver

## IntersectionObserver

这是个还在草案中的API，不过大部分浏览器均已实现（除了IE）。先看下MDN中的介绍：

> IntersectionObserver接口提供了一种异步观察目标元素与祖先元素或顶级文档[viewport](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FGlossary%2Fviewport)的交集中的变化的方法。祖先元素与视窗viewport被称为**根(root)。**



![目标元素与视窗](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/6/25/16b8d8fdcedfbbf1~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)



不知大家有没有发现随着网页发展，对**检测某个（些）元素是否出现在可视窗**相关的需求越来越多了？比如：

- 当页面滚动时，懒加载图片或其他内容。
- 实现“可无限滚动”网站，也就是当用户滚动网页时直接加载更多内容，无需翻页。
- 对某些元素进行埋点曝光
- 滚动到相应区域来执行相应动画或其他任务。

一直以来，检测元素的可视状态或者两个元素的相对可视状态都不是件容易事，大部分解决办法并不完全可靠，实现方式很丑陋，也极易拖慢整个网站的性能。

**IntersectionObserver正因此而生**

### API解读：

#### 1.用法

是以`new`的形式声明一个对象，接收两个参数`callback`和`options`

```js
const io = new IntersectionObserver(callback, options)

io.observe(DOM)
const options = {
  root: null,
  rootMargin: 0,
  thresholds: 1,
}
const io = new IntersectionObserver(entries => {
  console.log(entries)
  // Do something
}, options)
```

#### 2.callback

callback是添加监听后，当监听目标发生滚动变化时触发的回调函数。接收一个参数entries，即IntersectionObserverEntry实例。描述了目标元素与root的交叉状态。具体参数如下：

| 属性                  | 说明                                                         |
| --------------------- | ------------------------------------------------------------ |
| boundingClientRect    | 返回包含目标元素的边界信息，返回结果与element.getBoundingClientRect() 相同 |
| **intersectionRatio** | 返回目标元素出现在可视区的比例                               |
| intersectionRect      | 用来描述root和目标元素的相交区域                             |
| **isIntersecting**    | 返回一个布尔值，下列两种操作均会触发callback：1. 如果目标元素出现在root可视区，返回true。2. 如果从root可视区消失，返回false |
| rootBounds            | 用来描述交叉区域观察者(intersection observer)中的根.         |
| target                | 目标元素：与根出现相交区域改变的元素 (Element)               |
| time                  | 返回一个记录从 IntersectionObserver 的时间原点到交叉被触发的时间的时间戳 |

表格中加粗的两个属性是比较常用的判断条件：**isIntersecting**和**intersectionRatio**



![IntersectionObserverEntry打印的值](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/6/25/16b8d8fdd043b259~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)



#### 3.options

options是一个对象，用来配置参数，也可以不填。共有三个属性，具体如下：

| 属性       | 说明                                                         |
| ---------- | ------------------------------------------------------------ |
| root       | 所监听对象的具体祖先元素。如果未传入值或值为`null`，则默认使用顶级文档的视窗(一般为html)。 |
| rootMargin | 计算交叉时添加到**根(root)\**边界盒[bounding box](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FGlossary%2Fbounding_box)的矩形偏移量， 可以有效的缩小或扩大根的判定范围从而满足计算需要。所有的偏移量均可用\**像素**(`px`)或**百分比**(`%`)来表达, 默认值为"0px 0px 0px 0px"。 |
| threshold  | 一个包含阈值的列表, 按升序排列, 列表中的每个阈值都是监听对象的交叉区域与边界区域的比率。当监听对象的任何阈值被越过时，都会触发callback。默认值为0。 |

#### 4.方法

介绍了这么多配置项及参数，差点忘了最重要的，IntersectionObserver有哪些方法？ 如果要监听某些元素，则必须要对该元素执行一下observe

| 方法          | 说明                                                |
| ------------- | --------------------------------------------------- |
| observe()     | 开始监听一个目标元素                                |
| unobserve()   | 停止监听特定目标元素                                |
| takeRecords() | 返回所有观察目标的IntersectionObserverEntry对象数组 |
| disconnect()  | 使IntersectionObserver对象停止全部监听工作          |

### 应用：

#### 1.图片懒加载

```js
const imgList = [...document.querySelectorAll('img')]

var io = new IntersectionObserver((entries) =>{
  entries.forEach(item => {
    // isIntersecting是一个Boolean值，判断目标元素当前是否可见
    if (item.isIntersecting) {
      item.target.src = item.target.dataset.src
      // 图片加载后即停止监听该元素
      io.unobserve(item.target)
    }
  })
}, {
  root: document.querySelector('.root')
})

// observe遍历监听所有img节点
imgList.forEach(img => io.observe(img))复制代码
```

#### 2.埋点曝光

假如有个需求，对一个页面中的特定元素，只有在其完全显示在可视区内时进行埋点曝光。

```js
const boxList = [...document.querySelectorAll('.box')]

var io = new IntersectionObserver((entries) =>{
  entries.forEach(item => {
    // intersectionRatio === 1说明该元素完全暴露出来，符合业务需求
    if (item.intersectionRatio === 1) {
      // 。。。 埋点曝光代码
      io.unobserve(item.target)
    }
  })
}, {
  root: null,
  threshold: 1, // 阀值设为1，当只有比例达到1时才触发回调函数
})

// observe遍历监听所有box节点
boxList.forEach(box => io.observe(box))复制代码
```

#### 3.滚动动画

用上面的例子随便写了一个，太丑勿喷

![IntersectionObserver.gif](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/6/25/16b8d8fdd0bba525~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)



**总之，这是一个相当方便好用的API！**

