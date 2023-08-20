## **Dom**

### 什么是Dom

DOM 是 Document Object Model——**文档对象模型** 的简称

DOM 是 W3C组织推荐的一套操作**文档结构、样式和内容**的技术标准（所有的浏览器都遵循了）

一句话概括：DOM是浏览器提供的一套专门用来 **操作网页内容** 的功能

### DOM对象（重要）

DOM的核心思想 ： 把网页内容当做 **对象** 来处理

DOM对象：浏览器根据html标签生成的 **JS对象**

document 对象 ：DOM 里表示整个网页（整个文档）的对象 ，所以它提供的属性和方法都是用来访问和操作网页内容的

例：document.write()  网页所有内容都在document里面

### DOM树

#### DOM树是什么

DOM技术将 HTML 文档和标签映射成对象后，形成了类似“倒着的大树”的组织结构

HTML文档的树状结构，我们称之为 **文档树** 或 **DOM 树**

#### DOM树的作用

**DOM文档树直观的体现了标签与标签之间的关系**

**通过DOM树可以获取到网页上的任意内容**

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ba59970992d14eea8a0d9c7b1ffcdf72~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### 获取DOM对象

#### 根据CSS选择器来获取DOM元素 (重点)

**语法：**

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7a44c5322fe74e5dace1f1b7f2c49ef1~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

**参数:**

包含一个或多个有效的CSS选择器 **字符串**

**返回值：**

CSS选择器匹配的**第一个元素**，一个 HTMLElement对象。 如果没有匹配到，则返回null。

#### 选择匹配到的多个元素

**语法：**

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7e0e117eb23646fdbe4cb678547bb693~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

**参数：**

包含一个或多个有效的CSS选择器 **字符串**

**返回值：**

CSS选择器匹配的**NodeList 元素对象集合（伪数组）**

**例如：**

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d1632ee9490e4d16a9de92e04845e6f3~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

得到的是一个伪数组：

➢ 有长度有索引号的数组

➢ 但是没有 pop() push() 等数组方法

想要得到里面的每一个对象，则需要遍历（for）的方式获得。

#### 其他获取DOM元素方法（了解）

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2bff60cc509a405287fe3208f7b9d15f~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### 操作元素内容

#### 元素对象.innerText 属性

元素对象的innerText属性对应着标签的内容

通过innerText属性，就可以获取/更新标签的内容

纯文本，**不解析标签**

```javascript
javascriptconst info = docment.querySelector('.info');
info.innerText = '123';
```

#### 元素对象.innerHTML 属性

元素对象的innerHTML属性对应着标签的内容

通过innerHTML属性，就可以获取/更新标签的内容

会解析标签，多标签建议使用模板字符

```javascript
javascriptconst info = docment.querySelector('.info');
info.innerHTML = `<strong>123</strong>`;
```

#### 操作元素常用属性

- 通过 JS 设置/修改标签元素的属性，比如通过 src更换图片
- 最常见的属性比如： href、title、src 等
- **语法：**![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c735eb39ef12455bb14dfd842457bb7b~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

举例：

```js
js   const pic = document.querySelector('img')
    pic.title = 'hhh'
```

### 操作元素样式属性

#### 通过 style 属性操作CSS

**语法：**  ![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e058f93df8f84d22a2b7dfcbf87f0796~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

例如：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6a4f247da9ce43aca9feec344891ef17~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

#### 操作类名(className) 操作CSS

如果要修改的样式比较多，直接通过style属性修改比较繁琐，我们可以通过修改标签的类名实现

**语法：**

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/552f18334edc4e2b8dd60101ece8ad55~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

注意： className是使用新值换旧值, 如果需要添加一个类，注意保留之前的类名

#### 通过 classList 操作类控制CSS

使用className 会覆盖以前的类名，我们可以通过classList方式**追加**和**删除**类名（ 不影响以前的类名  ）

**元素.contains()  查找元素中是否有该类**

**语法：**

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5ee331866dff496094aa76c3e538c19c~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### 操作表单元素 属性

表单标签有些属性是表示状态的，比如： disabled、checked、selected （ 布尔值修改）

**获取: DOM对象.属性名**

**设置: DOM对象.属性名 = 新值**

**例如：**

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9c6a87162ac74aff854311311bc8fee5~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### 自定义属性

**标准属性**: 标签天生自带的属性，比如class id title等, 可以直接使用“.属性名”操作

**自定义属性：**

➢ html5中推出来了data-* 格式的自定义属性（在标签上记录一些信息）

➢ 给标签添加自定义属性一律以data- 开头

➢ 在DOM对象上以dataset对象方式获取

### 间歇函数

#### 开启定时器 （ 定时器返回的是一个id数字  ）

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/80669437d825444998e807961d5b0b19~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

**作用：每隔一段时间调用这个函数，间隔时间单位是毫秒**

**例如：**

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c4e5cee1ca974ab297b4969d85df61ca~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

#### 关闭定时器

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/015d0fdafc0b457985aaf2691f3f6054~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### 事件监听

**语法：**

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3ceaefd1ba344d6f8b2e407f7608e12f~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

**例如:**

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/74a313d063d94787bbf4cc8637acdc98~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### 事件监听版本（了解）

1.DOM L0 事件源.on事件 = function() { }

2.DOM L2 事件源.addEventListener(事件， 事件处理函数)

3.区别： on方式会被覆盖，**addEventListener**方式可绑定多次，拥有事件更多特性，推荐使用

4.发展史：

➢ DOM L0 ：是 DOM 的发展的第一个版本； L：level

➢ DOM L1：DOM级别1 于1998年10月1日成为W3C推荐标准

➢ DOM L2：使用addEventListener注册事件

➢ DOM L3： DOM3级事件模块在DOM2级事件的基础上重新定义了这些事件，也添加了一些新事件类型

### 解绑事件

on事件方式，直接使用null覆盖就可以实现事件的解绑

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b99bbb1d1b2949e48e664a3dc27368b2~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

**addEventListener方式**，必须使用： removeEventListener(事件类型, 事件处理函数的名字)

例如：  **（注意：匿名函数无法被解绑）**

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8eb0e4b6da2849c88c5c506cfeba5be0~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### 事件类型

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/41c7ac9c9b884e8d8766d9035bc60d17~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### 获取事件对象

在**JavaScript**中，**回调函数**具体的定义为：函数A作为参数 (函数引用)传递到另一个函数B中，并且这个函数B执行函数A。

**语法：**

➢ 在事件绑定的回调函数的第一个参数就是事件对象

➢ 一般命名为event、ev、e

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8cd9249939974a068d143b62d9dec6e9~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

**部分常用属性  ：**

➢ type

获取当前的事件类型

➢ clientX/clientY

获取光标相对于浏览器可见窗口左上角的位置

➢ offsetX/offsetY

获取光标相对于当前DOM元素左上角的位置

➢ key 用户按下的键盘键的值

现在不提倡使用keyCode

### 事件对象的方法

事件对象的方法——阻止默认行为 我们某些情况下还需要阻止默认行为的发生，比如 阻止 链接的跳转，表单域跳转

**语法：**

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/152a23318f514c5eb8498938a1156ec3~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### 事件流

#### 事件流和两个阶段说明

⚫ 当触发事件时，会经历两个阶段，分别是捕获阶段、冒泡阶段

⚫ 简单来说：捕获阶段是 从父到子 冒泡阶段是从子到父 **实际工作都是使用事件冒泡为主**

#### 事件捕获

目标：简单了解事件捕获执行过程

⚫ 事件捕获概念： 当一个元素的事件被触发时，会从DOM的根元素开始去执行对应的事件 (从外到里)

⚫ 事件捕获需要写对应代码才能看到效果，代码：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2d31b6a9c59845738f3633726b2f0cee~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

⚫ 说明：

➢ addEventListener第三个参数传入 true 代表在捕获阶段触发（很少使用）

➢ 若传入false代表冒泡阶段触发，默认就是false

➢ 若是用 L0 事件监听，则只会在冒泡阶段触发

#### 事件冒泡

目标：能够说出事件冒泡的执行过程 事件冒泡概念: 当一个元素的事件被触发时，事件会依次传播给其所有祖先元素，这一过程被称为事件冒泡

⚫ 简单理解：当一个元素触发事件后，会依次向上调用所有父级元素的 同名事件

⚫ L2事件监听第三个参数是 false、或者默认，都是冒泡

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b468491b068a420593ba6b873654b17a~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

#### 阻止冒泡

目标：能够写出阻止冒泡的代码

⚫ 问题：因为默认就有冒泡模式的存在，所以容易导致事件影响到父级元素

⚫ 需求：若想把事件就限制在当前元素内，就需要阻止事件的传播

⚫ 前提：阻止事件冒泡需要拿到事件对象

⚫ **语法**：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7b3d4809677748e79ba0af9f8500f8ed~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

⚫ 注意：此方法可以阻断事件流动传播，不光在冒泡阶段有效，捕获阶段也有效

#### 鼠标经过事件的区别

⚫ 鼠标经过事件：

➢ mouseover 和 mouseout 会有冒泡效果

➢ mouseenter 和 mouseleave 没有冒泡效果 (推荐)

#### 事件委托

事件委托是事件操作的一个开发小技巧

➢ 优点：减少注册次数，可以提高程序性能

➢ 原理：事件委托利用了事件冒泡的特性

➢ 实现：

➢ 不给子元素注册事件，给**父元素注册事件**，当触发事件时，会冒泡到父元素身上，从而触发父元素的事件

➢ 使用事件对象.target可以获得真正触发事件的子元素，e.target.tagName可以获得其标签名

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fac9c7bdfbae4eb0b11709aee129bea6~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### 页面事件

#### 页面加载事件（load）

➢ 有些时候需要等页面资源全部处理完了做一些事情

➢ 老代码喜欢把 script 写在 head 中，这时候直接找 dom 元素找不到

事件名：load

监听页面所有资源加载完毕：

➢ 给 window 添加 load 事件，页面所有**外部资源**（如图片、外联CSS和JavaScript等）加载完毕时触发的事件

⚫ 注意：不光可以监听整个页面资源加载完毕，也可以针对某个资源绑定load事件

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1199b7fa85944850851bc2c0ad63601c~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

#### 页面加载事件（DOMContentLoaded）

⚫ 事件名：DOMContentLoaded

⚫ 监听页面DOM结构加载完毕：

➢ 给 document 添加 DOMContentLoaded 事件，当 HTML 文档被完全加载和解析完成之后触发，无需等待样式表、图像等资源完成加载

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/69fbca480bc54bed809dd384bde8ef64~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

#### 页面滚动事件

⚫ 滚动事件：滚动条在滚动的时候持续触发的事件

⚫  很多网页需要检测用户把页面滚动到某个区域后做一些处理， 比如固定导航栏，比如返回顶部

⚫ 事件名：scroll

⚫ 监听整个页面滚动：给 window 或 document 添加 scroll 事件

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f0cb6ab3743a4157be07c9decb9f90f5~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

⚫ 监听某个元素的内部滚动直接给某个元素加即可

#### 页面滚动事件-获取卷去的距离

⚫ scrollLeft和scrollTop （属性）

➢ 获取被卷去的大小

➢ 获取元素内容往左、往上滚出去看不到的距离

➢ 这两个值是可读写的

⚫ 尽量在scroll事件里面获取被卷去的距离

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eabdcc0a75e945c0a596647103fc7001~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

⚫ 开发中，我们经常检测页面滚动的距离，比如页面滚动100像素，就可以显示一个元素，或者固定一个元素

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b43e9a1e90d84b5e9d2f99bcd36cac55~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dfbc8258bedc4d61b2f7d0e6122d4904~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

#### 页面滚动事件-设置卷去的距离

⚫ scrollTop属性是可读写的

⚫ 可以获取卷去的距离（不带单位）

⚫ 也可以设置卷去的距离（数字）

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/befc9140de8e499cb87fe9cbf34fa0fc~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

⚫ scrollTo() 方法可把内容滚动到指定的坐标

⚫ 语法：

元素.scrollTo(x, y)

⚫ 例如：（这两种方法几乎没有什么区别，都是返[回滚](https://link.juejin.cn?target=https%3A%2F%2Fso.csdn.net%2Fso%2Fsearch%3Fq%3D%E5%9B%9E%E6%BB%9A%26spm%3D1001.2101.3001.7020)动距离。要说区别的话，window.scrollTop()能被更多的浏览器支持。）

```less
less
	![img](https://cdn.nlark.com/yuque/0/2022/png/29759368/1660147345597-326de5f2-fc0d-40fa-8a5f-48b417ad5193.png)
```

#### 页面尺寸事件

在窗口尺寸改变的时候触发事件：

➢ resize

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/41ce957ac53d4388934597d8cf7cfe93~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

⚫ 检测屏幕的宽度：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3cb9f2524e814ce6b90066a32b2b3ba3~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

#### 元素尺寸（ 内容 + padding  ）

⚫ 获取宽高：

➢ 获取元素的可见部分宽高（不包含边框，margin，滚动条等）

➢ **clientWidth 和 clientHeight**

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/09cd48dddf0d44068be9906fd1420375~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

#### 获取尺寸（ 内容 + padding + border  ）

➢ 获取元素的自身宽高、包含元素自身设置的宽高、padding、border

➢ offsetWidth 和 offsetHeight

➢ 获取出来的是数值,方便计算

➢ 注意: 获取的是可视宽高, 如果盒子是隐藏的,获取的结果是0

⚫ 获取位置：

➢ 获取元素距离自己定位父级元素的左、上距离， 如果没有定位父元素，则以文档左上角为准

➢ offsetLeft 和 offsetTop 注意是只读属性

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/31ca6ccfad164ace9df19d047ed13d17~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

#### 元素位置

⚫ 获取位置：

element.getBoundingClientRect()

➢ 方法返回值是对象

➢ 对象中包含元素的大小及其相对于视口的位置

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d9dc5066f75d47ec96b63e5bb67b830b~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

**总结：**

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/39b29fa34b7944df9fc2284a7b2337d2~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### 节点操作

#### 查找节点

**父节点查找：**

➢ parentNode 属性

```
➢ 返回最近一级的父节点  
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2f9b9e5b5b5443f0ab03cf8df53d3634~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

**子节点查找：**

➢ childNodes（获得所有子节点、包括文本节点（空格、换行）、注释节点等）

**➢ children 属性 （重点）****仅获得所有元素节点，返回的还是一个伪数组**

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eb4dceb4a08d44d5a4765547c57c76c4~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

**兄弟关系查找：**

1. 下一个兄弟元素节点

➢ nextElementSibling 属性

1. 上一个兄弟元素节点

​       ➢ previousElementSibling 属性

#### 增加节点

##### 创建节点

⚫ 即创造出一个新的网页元素，再添加到网页内，一般先创建节点，然后插入节点

⚫ 创建元素节点方法：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5a210e1e7b8a4c8d9ba636b098b10343~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

##### 追加节点

⚫ 要想在界面看到，还得插入到某个父元素中

⚫ 插入到父元素中内部的最后（作为父元素的最后一个子元素）:

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8454866341834db0b6b94dbdb1d05301~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

⚫ 插入到父元素中某个子元素的前面：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1cb39aa376614cf0ba61d85399384120~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

⚫ 克隆节点

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5bf387f60694465da9bc7f16970b1dd9~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

cloneNode会克隆出一个跟原标签一样的元素，括号内传入布尔值

➢ 若为true，则代表克隆时会包含后代节点一起克隆

➢ 若为false，则代表克隆时不包含后代节点

➢ 默认为false

#### 删除节点

⚫ 若一个节点在页面中已不需要时，可以删除它

⚫ 在 JavaScript 原生DOM操作中，要删除元素必须通过**父元素删除**

⚫ 语法  ：![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9c91e698d4444f30aea872670f6bebd0~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

⚫ 注： ➢ 如不存在父子关系则删除不成功

➢ 删除节点和隐藏节点（display:none） 有区别的： 隐藏节点还是存在的，但是删除，则从html中删除节点

#### 删除自身

```js
var box=document.getElementById("box");
box.remove();
```



### 移动端事件

移动端也有自己独特的地方。比如 触屏事件 touch（也称触摸事件），Android 和 IOS 都有。

⚫ touch 对象代表一个触摸点。触摸点可能是一根手指，也可能是一根触摸笔。

⚫ 触屏事件可响应用户手指（或触控笔）对屏幕或者触控板操作。

⚫ 常见的触屏事件如下：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/161f52c0790647348e150d9ea91163a3~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

## BOM

### 定时器-延迟函数

⚫ JavaScript 内置的一个用来让代码延迟执行的函数，叫 setTimeout

⚫ 语法：  ![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ca1f25c58f2f4f7f859d2bc457e8ceab~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

⚫ window.setTimeout 的回调函数仅仅只执行一次，所以可以理解为就是把一段代码延迟执行, 省略window

⚫ 清除延时函数：![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/69e68aa38de54146918fdda0b1e35b90~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

⚫ 注意点

➢ 延迟器需要等待，所以后面的代码先执行

⚫ 两种定时器对比：执行的次数

➢ 延迟函数：执行一次

➢ 间歇函数：每隔一段时间就执行一次，除非手动清除

### location对象

⚫ window对象给我们提供了一个location 属性，它是一个对象，这个对象可以用来操作窗口的URL地址。

⚫ 常用属性和方法：

➢ href 属性获取完整的 URL 地址，对其赋值时用于地址的跳转

➢ search 属性获取地址中携带的参数，符号 ？后面部分

➢ hash 属性获取地址中的啥希值，符号 # 后面部分

**➢ reload 方法用来刷新当前页面，传入参数 true 时表示强制刷新**

​       ![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a95e3c8c30cb47c79541b4c3a2a45402~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### navigator对象

⚫ navigator对象也是window的一个属性，该对象下记录了浏览器自身的相关信息

⚫ 常用属性和方法： ➢ 通过 userAgent 检测浏览器的版本及平台

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/431c7f4d919b4240b98f95b9f46171db~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### histroy对象

⚫ history 对象，主要管理浏览器的历史记录， 该对象与浏览器地址栏的操作相对应，如前进、后退、历史记录等

⚫ 常用属性和方法：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c58e6e971dec48eba73bc1cd9aef0f2c~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### 本地存储

**本地存储分类- localStorage** 目标： 能够使用localStorage 把数据存储的浏览器中 ⚫ 作用: 可以将数据 永久存储 在本地(用户的电脑)，除非手动删除，否则关闭页面也会存在 ⚫ 特性： ➢ 生命周期为永久存在（除非手动删除） ➢ 以键值对的形式存储使用（存的数据叫“值”，给数据起的名字叫“键”） ➢ 同一个网站的多个页面共享（同一浏览器） **注意事项：本地存储只能存字符串**

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9900031858b247929149bebafffe36b0~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

**本地存储分类-sessionStorage**

作用: 可以将数据存在本地，其生命周期为页面关闭

![image-20230531152552081转存失败，建议直接上传图片文件]()

### 存储复杂类型数据

本地只能存储字符串，无法存储复杂数据类型
 ⚫ 解决：需要将复杂数据类型转换成JSON格式的字符串，再存储到本地 ⚫ 语法：JSON.stringify(复杂数据类型) : ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/96d049f06a894af2b8262f2686c2d353~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### js运行机制

#### 同步和异步

Javascript 这门脚本语言诞生时的使命是——处理页面中用户的交互，以及操作 DOM。 所以，JavaScript 语言的一大特点就是单线程，也就是说，同一个时间只能做一件事。例如：我们 对某个 DOM 元素进行添加和删除操作，不能同时进行，应该先进行添加，之后再删除。 单线程就意味着，所有任务需要排队，前一个任务结束，才会执行后一个任务。 这样导致的问题是：** 如果前面的任务执行所耗时间过长，后面的任务会处于等待状态，这样就会造成页面的渲染不连 贯，导致页面渲染加载阻塞的感觉。 ** **同步任务（不用等待执行时机的任务）** **同步任务代码都放入主线程上的 执行栈 中执行。** **异步任务（需要等待执行时机的任务）** 异步任务代码会交给宿主环境中的异步进程来处理，时机到了会将其要执行的代码，放入任务队列 中等待。 常见的异步任务有: 1、普通事件，如 click、resize 等 2、资源加载，如 load、error 等 3、定时器，包括 setInterval、setTimeout 等

1. 先执行 执行栈中的同步任务。
2. 一旦执行栈中的所有同步任务执行完毕，系统就会按次序读取 任务队列 中的异步任务，于是被读取的异步任务结 束等待状态，进入**执行栈**，开始执行。
3. 执行栈中的代码执行完毕，会不断地到任务队列读取待执行的代码，这种循环机制叫做“**事件循环Event Loop**”
    ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eea8b3d7549c4382a502bba1f243ed09~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

## 浏览器的渲染机制（重绘和回流）

重绘和回流

⚫ 回流(重排)

当 Render Tree 中部分或者全部元素的尺寸、结构、布局等发生改变时，浏览器就会重新渲染部分或全部文档的

过程称为 回流。

⚫ 重绘

由于节点(元素)的样式的改变并不影响它在文档流中的位置和文档布局时(比如：color、background-color、

outline等), 称为重绘。

⚫ 重绘不一定引起回流，而回流一定会引起重绘。