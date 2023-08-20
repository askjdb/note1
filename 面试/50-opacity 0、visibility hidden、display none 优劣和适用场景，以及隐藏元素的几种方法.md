# opacity: 0、visibility: hidden、display: none 优劣和适用场景，以及隐藏元素的几种方法

![image-20230513165043731](C:\Users\123\AppData\Roaming\Typora\typora-user-images\image-20230513165043731.png)

### **1. display: none**

- **DOM 结构：**浏览器不会渲染 display 属性为 none 的元素，会让元素完全从渲染树中消失，渲染的时候不占据任何空间；
- **事件监听：**无法进行 DOM 事件监听，不能点击；
- **性能：**修改元素会造成文档重绘重排（ repaint 与reflow ）,读屏器不会读取display: none元素内容，性能消耗较大；
- **继承：**是非继承属性，由于元素从渲染树消失，造成子孙节点消失，即使修改子孙节点属性子孙节点也无法显示，毕竟子类也不会被渲染；
- **属性值从 none 改为非 none 时的效果：**显示出原来这里不存在的结构；
- **transition：**transition 不支持 display。
- **用途：**虽然会造成大量的重绘重排，但是也是对复杂结构减少重绘重排常用的办法。常常将一个“会被大量修改结构和视觉效果”的结构先赋予 display:none 属性，让其在 DOM 树中消失，然后进行 DOM 操作，操作完再让其显示。更多有关重绘重排的方法可以参考这篇文章：[前端性能优化之重排和重绘](https://segmentfault.com/a/1190000016990089)。

### **2. visibility: hidden**

- **DOM 结构：**不会让元素从渲染树消失，渲染元素继续占据空间，但是内容不可见；
- **事件监听：**无法进行 DOM 事件监听，不能点击；
- **性能：**修改元素只会造成本元素的重绘（repaint），是重绘操作，比重排操作性能高一些，性能消耗较少；读屏器读取visibility: hidden元素内容；
- **继承：**是继承属性，子孙节点消失是由于继承了visibility: hidden，子元素可以通过设置 visibility: visible 来取消隐藏；
- **属性值从 hidden 改为 visible 时的效果：**显示不会导致页面结构发生变动，不会撑开；
- **transition：**transition 支持 visibility，visibility 会立即显示，隐藏时会延时。

### **3. opacity: 0**

- **DOM 结构：**透明度为 100%，不会让元素从渲染树消失，渲染元素继续占据空间，只是内容不可见；
- **事件监听：**可以进行 DOM 事件监听，可以点击；
- **性能：**提升为合成层，是**重建图层**，不和动画属性一起则**不会产生repaint**（不脱离文档流，不会触发重绘），性能消耗较少；
- **继承：**会被子元素继承，且子元素并不能通过 opacity: 1 来取消隐藏；
- **场景：**可以跟transition搭配；
- **transition：**transition 支持 opacity，opacity 可以延时显示和隐藏。

*打个比方*： **display: none**： 从这个世界消失了, 不存在了； **opacity: 0**： 视觉上隐身了, 看不见, 可以触摸得到； **visibility: hidden**： 视觉和物理上都隐身了, 看不见也摸不到, 但是存在的；

 

==附加题：CSS 隐藏页面上的一个元素有哪几种方法？==

1. display:none，visibility:hiden，opacity:0 这三种；
2. 设置 fixed 并设置足够大负距离的 left top 使其“隐藏”；
3. 用层叠关系 z-index 把元素叠在最底下使其“隐藏”；
4. 用 text-indent:-9999px 使其文字隐藏。