JavaScript分为 ECMAScript，DOM，BOM。

- BOM（Browser Object Model）是指**浏览器对象模型**，它使 JavaScript 有能力与浏览器进行“对话”。
- DOM （Document Object Model）是指**文档对象模型**，通过它可以访问HTML文档的所有元素。

Window对象是客户端`JavaScript`最高层对象之一，由于`window`对象是其它大部分对象的共同祖先，在调用`window`对象的方法和属性时，可以省略`window`对象的引用。例如：`window.document.write()`可以简写成：`document.write()`。





# 深入理解js的BOM及DOM

# 一、BOM

## 定义

- Browser Object Model 浏览器对象模型，提供一系列与浏览器相关的信息。
- BOM对象分为window对象和window子对象（screen对象，location对象，navigator对象，history对象）。

## window对象

- Window 对象表示浏览器中打开的窗口。
- window对象是BOM顶层对象。
- window对象是JS访问浏览器窗口的一个接口。
- window对象是一个全局对象，声明的所有的全局变量。全局方法函数最终都是window对象的属性或方法。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e7659004bcb64d9bb8ebdb9b30c8a4f2~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

看上面的例子你会发现，bbb直接封装到了window对象上。

所有浏览器都支持 window 对象。它表示浏览器窗口。

如果文档包含框架（`<frame>` 或 `<iframe> 标签`），浏览器会为 `HTML`文档创建一个 window 对象，并为每个框架创建一个额外的 window 对象。

> 没有应用于 window 对象的公开标准，不过所有浏览器都支持该对象

所有 JavaScript 全局对象、函数以及变量均自动成为 window 对象的成员。

全局变量是 window 对象的属性。全局函数是 window 对象的方法。 接下来要讲的HTML DOM 的 document 也是 window 对象的属性之一。

window方法

- `window.innerHeight` 浏览器窗口的内部高度
- `window.innerWidth` 浏览器窗口的内部宽度
- `window.open()` 打开一个新的浏览器窗口，
- `window.close()` 关闭新打开的窗口，仅限open打开的窗口
- `window.moveTo()` 移动当前窗口
- `window.resizeTo()` 调整当前窗口的尺寸
- `window.addEventListener()`
- `window.onload()` 事件在文件加载过程结束的时候触发

`window.onload()`说明：

当我们给页面上的元素绑定事件的时候，必须等到文档加载完毕。因为我们无法给一个不存在的元素绑定事件。

window.onload事件在文件加载过程结束的时候触发。此时，文档中的所有对象都位于DOM中，并且所有图像，脚本，链接和子框架都已完成加载。

注意：`.onload()`函数存在覆盖现象。 eg:

```js
window.onload = function () { 
    document.getElementById("s").style.color = "green"; 
}
复制代码
```

## window的子对象

### （1）screen对象

屏幕对象，包含显示器设备的信息（不常用）

属性：

- `screen.height` 设备高
- `screen.width` 设备宽
- `screen.availWidth` 屏幕可用宽
- `screen.availHeight` 屏幕可用高

> 屏幕可用宽高，值为屏幕的实际大小减去操作系统某些功能占据的空间，如系统任务栏

### （2）location对象

`window.location` 对象用于获得当前页面的地址 (`URL`)，并把浏览器重定向到新的页面。

保存当前文档信息，将URL解析为独立片段

属性：

- `location.href`  返回当前页面完整的URL ,修改这个属性，即跳转新页面
- `location.hash` 返回URL中的hash（#号后跟零或多个字符）
- `location.host` 返回服务器名称和端口号
- `location.port` 返回服务器端口号
- `location.pathname` 返回URL中的目录和文件名
- `location.hostname` 返回不带端口号的服务器名称
- `location.protocol` 返回页面使用的协议（`http://或https://`)
- `location.search` 返回URL的查询字符串，字符串以问号开头

方法：

- `location.reload()` 重新加载页面,就是刷新一下页面

### （3）navigator对象

浏览器对象，提供一系列属性用于检测浏览器。通过这个对象可以判定用户所使用的浏览器，包含了浏览器相关信息。

属性：

- `navigator.appName`　　// Web浏览器全称
- `navigator.appVersion`　　// Web浏览器厂商和版本的详细字符串
- `navigator.userAgent`　　// 客户端绝大部分信息
- `navigator.platform`　　　// 浏览器运行所在的操作系统平台类型
- `navigator.onLine` 判断是否联网

### （4）history 对象

`window.history` 对象包含浏览器的历史。

浏览历史对象，包含了用户对当前页面的浏览历史，但我们无法查看具体的地址，可以简单的用来前进或后退一个页面。

方法：

- `history.back()` 与在浏览器点击后退按钮相同，后退一页。
- `history.forward()` 与在浏览器中点击按钮向前相同，前进一页。
- `history.go(参数)` 前进后退功能，参数如果是1前进一个页面，如果是-1后退一个页面，如果是N则前进或后退N个页面
- `history.length()` 保存历史记录的数量

## window上直接挂载的方法

### （1）弹出框

可以在 JavaScript 中创建三种消息框：警告框、确认框、提示框。

#### 警告框

**定义：** 警告框经常用于确保用户可以得到某些信息。当警告框出现后，用户需要点击确定按钮才能继续进行操作。

**语法：**

```js
alert("你看到了吗？");
复制代码
```

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/668af5e1e30b4e9a8233a011628ba9ed~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

#### 确认框

**定义：**

- 确认框用于使用户可以验证或者接受某些信息。
- 当确认框出现后，用户需要点击确定或者取消按钮才能继续进行操作。
- 如果用户点击确认，那么返回值为 true。如果用户点击取消，那么返回值为 false。
- 我们可以根据返回的true和false来判断一下，然后根据这个值来使用location去跳转对应的网站。

**语法：**

```js
confirm("你确定吗？")
复制代码
```

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d12e9a5622e34feb969bad80e150be73~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

#### 提示框

**定义：**

- 提示框经常用于提示用户在进入页面前输入某个值。
- 当提示框出现后，用户需要输入某个值，然后点击确认或取消按钮才能继续操纵。
- 如果用户点击确认，那么返回值为输入的值。如果用户点击取消，返回null。

**语法：**

```js
prompt("请在下方输入","你的答案")
复制代码
```

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8b3f32a9f7bb4f15803790fbe402c79a~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

可以通过用户输入的内容来判断我们怎么去进行后面的操作

> 除了那个警告框（用的也不多），其他的都很少用，比较丑陋，了解一下就行

### （2）计时器

通过使用 JavaScript，我们可以在一定时间间隔之后来执行代码，而不是在函数被调用后立即执行。我们称之为计时事件。

#### setTimeout

**定义：** `setTimeout()`  一段时间后做一些事情

**语法：**

```js
var t=setTimeout("JS语句",毫秒)  
复制代码
setTimeout(()=>{

},0)
复制代码
```

- 第一个参数js语句多数是写一个函数，不然一般的js语句到这里就直接执行了，先用函数封装一下，返回值t其实就是一个id值（浏览器给你自动分配的）
- setTimeout() 方法会返回某个值。在上面的语句中，值被储存在名为 t 的变量中。假如你希望取消这个 setTimeout()，你可以使用这个变量名来指定它。
- setTimeout() 的第一个参数是含有 JavaScript 语句的字符串。这个语句可能诸如 "alert('5 seconds!')"，或者对函数的调用，诸如 alertMsg()"。
- 第二个参数指示从当前起多少毫秒后执行第一个参数（1000 毫秒等于一秒）。

#### clearTimeout

**定义：** 取消setTimeout设置

**语法：**

```js
clearTimeout(setTimeout_variable)
复制代码
```

eg:

```js
// 在指定时间之后执行一次相应函数
var timer = setTimeout(function(){alert(123);}, 3000)
// 取消setTimeout设置
clearTimeout(timer);
复制代码
```

#### setInterval

**定义：** 每隔一段时间做一些事情

**语法：**

```js
setInterval("JS语句",时间间隔)
复制代码
```

- setInterval() 方法可按照指定的周期（以毫秒计）来调用函数或计算表达式。
- setInterval() 方法会不停地调用函数，直到 clearInterval() 被调用或窗口被关闭。由 setInterval() 返回的 ID 值可用作 clearInterval() 方法的参数。
- 返回值:一个可以传递给 Window.clearInterval() 从而取消对 code 的周期性执行的值。

#### clearTimeout

**定义：**

- clearInterval() 方法可取消由 setInterval() 设置的 timeout。
- clearInterval() 方法的参数必须是由 setInterval() 返回的 ID 值。

**语法：**

```js
clearInterval(setinterval返回的ID值)
复制代码
```

eg:

```js
// 每隔一段时间就执行一次相应函数
var timer = setInterval(function(){console.log(123);}, 3000)
// 取消setInterval设置
clearInterval(timer);
复制代码
```

# 二、DOM

## 定义

DOM（Document Object Model）是一套对文档的内容进行抽象和概念化的方法。 

当网页被加载时，浏览器会创建页面的文档对象模型（Document Object Model）。

HTML DOM 模型被构造为对象的树。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5de000c5b3be4c3aa8fe183f94894bdb~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

**DOM标准规定HTML文档中的每个成分都是一个节点(node)：**

- 文档节点(document对象)：代表整个文档
- 元素节点(element 对象)：代表一个元素（标签）
- 文本节点(text对象)：代表元素（标签）中的文本
- 属性节点(attribute对象)：代表一个属性，元素（标签）才有属性
- 注释是注释节点(comment对象)　

**JavaScript 可以通过DOM创建动态的 HTML：**

- JavaScript 能够改变页面中的所有 HTML 元素
- JavaScript 能够改变页面中的所有 HTML 属性
- JavaScript 能够改变页面中的所有 CSS 样式
- JavaScript 能够对页面中的所有事件做出反应（鼠标点击事件，鼠标移动事件等）

## 查找标签

- [www.cnblogs.com/clschao/art…](https://link.juejin.cn?target=https%3A%2F%2Fwww.cnblogs.com%2Fclschao%2Farticles%2F10092991.html)

### （1）直接查找

- `document.getElementById`           根据ID获取一个标签
- `document.getElementsByClassName`   根据class属性获取（可以获取多个元素，所以返回的是一个数组）
- `document.getElementsByTagName`     根据标签名获取标签合集

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/87348fa8a1384eb1b2a11d362d54c8d4~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

### （2）间接查找

- `parentElement`            父节点标签元素
- `children`                 所有子标签
- `firstElementChild`        第一个子标签元素
- `lastElementChild`         最后一个子标签元素
- `nextElementSibling`       下一个兄弟标签元素
- `previousElementSibling`   上一个兄弟标签元素

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0de1deb838dd4fd7beedd2db55439d12~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

如果查找出来的内容是个数组，那么就可以通过索引来取对应的标签对象。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d16834d3097a49958767ce4b5c907b7f~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

> 上面说的这些查找标签的方法，以后我们很少用，等学了JQuery，会有很好用、更全的查找标签的功能，上面这些大家简单练习一下，有个了解就行了。

## 节点操作

### （1）创建节点

语法：

```scss
createElement(标签名)
复制代码
```

eg:

```js
var divEle = document.createElement("div");
复制代码
```

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8c02848ccc924f02b23391164eba398f~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

### （2）添加节点

语法：

```scss
// 追加一个子节点（作为最后的子节点）
somenode.appendChild(newnode)；

// 把增加的节点放到某个节点的前边。
somenode.insertBefore(newnode,某个节点);
复制代码
```

eg:

```js
var imgEle=document.createElement("img");
imgEle.setAttribute("src", "http://image11.m1905.cn/uploadfile/s2010/0205/20100205083613178.jpg");
var d1Ele = document.getElementById("d1");
d1Ele.appendChild(imgEle);
复制代码
```

### （3）删除节点

```js
// 获得要删除的元素，通过父元素调用该方法删除。
somenode.removeChild(要删除的节点)
复制代码
```

### （4）替换节点

```js
// somenode是父级标签，然后找到这个父标签里面的要被替换的子标签，然后用新的标签将该子标签替换掉
somenode.replaceChild(newnode, 某个节点);
复制代码
```

### （5）属性节点

获取文本节点的值：

```js
var divEle = document.getElementById("d1")
divEle.innerText  #输入这个指令，一执行就能获取该标签和内部所有标签的文本内容
divEle.innerHTML  #获取的是该标签内的所有内容，包括文本和标签
复制代码
```

设置文本节点的值：

```js
var divEle = document.getElementById("d1")
divEle.innerText="1"  
divEle.innerHTML="<p>2</p>" #能识别成一个p标签
复制代码
```

**attribute操作**

```js
var divEle = document.getElementById("d1");
divEle.setAttribute("age","18")  #比较规范的写法
divEle.getAttribute("age")
divEle.removeAttribute("age")

// 自带的属性还可以直接.属性名来获取和设置，如果是你自定义的属性，是不能通过.来获取属性值的
imgEle.src
imgEle.src="..."
复制代码
```

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9c14179210d24da3b126fa4aaf809b4f~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

## 获取值操作

语法：

```js
elementNode.value
复制代码
```

适用于以下标签，用户输入或者选择类型的标签：

1. `input`  
2. `select`
3. `textarea`

```js
var iEle = document.getElementById("i1");
console.log(iEle.value);
var sEle = document.getElementById("s1");
console.log(sEle.value);
var tEle = document.getElementById("t1");
console.log(tEle.value);
复制代码
```

eg:

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0eb65e08a2c843c0ac3dbecf54c32059~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

## class操作

```js
className  获取所有样式类名(字符串)

首先获取标签对象

标签对象.classList.remove(cls)  删除指定类
标签对象.classList.add(cls)  添加类
标签对象.classList.contains(cls)  存在返回true，否则返回false
标签对象.classList.toggle(cls)  存在就删除，否则添加，toggle的意思是切换，有了就给你删除，如果没有就给你加一个
复制代码
```

eg:将c2的类加到class里面去

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e08f007e459d4258a176f4a7f5afc57a~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

## 指定CSS操作

```ini
obj.style.backgroundColor="red"
复制代码
```

JS操作CSS属性的规律：

1. 对于没有中横线的CSS属性一般直接使用style.属性名即可。如：

```js
obj.style.margin
obj.style.width
obj.style.left
obj.style.position
复制代码
```

1. 对含有中横线的CSS属性，将中**横线后面的第一个字母换成大写**即可。如：

```js
obj.style.marginTop
obj.style.borderLeftWidth
obj.style.zIndex
obj.style.fontFamily
复制代码
```

eg:

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8a77b916ad5c4fafa605600169d71284~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

## 事件

HTML 4.0 的新特性之一是有能力使 HTML 事件触发浏览器中的动作（action），比如当用户点击某个 HTML 元素时启动一段 JavaScript。下面是一个属性列表，这些属性可插入 HTML 标签来定义事件动作。

### （1）常用事件

```js
onclick        当用户点击某个对象时调用的事件句柄。
ondblclick     当用户双击某个对象时调用的事件句柄。

onfocus        元素获得焦点。               // 练习：输入框
onblur         元素失去焦点。               应用场景：用于表单验证,用户离开某个输入框时,代表已经输入完了,我们可以对它进行验证.
onchange       域的内容被改变。             应用场景：通常用于表单元素,当元素内容被改变时触发.（select联动）

onkeydown      某个键盘按键被按下。          应用场景: 当用户在最后一个输入框按下回车按键时,表单提交.
onkeypress     某个键盘按键被按下并松开。
onkeyup        某个键盘按键被松开。
onload         一张页面或一幅图像完成加载。
onmousedown    鼠标按钮被按下。
onmousemove    鼠标被移动。
onmouseout     鼠标从某元素移开。
onmouseover    鼠标移到某元素之上。

onselect      在文本框中的文本被选中时发生。
onsubmit      确认按钮被点击，使用的对象是form。
复制代码
```

### （2）绑定方式

方式一：（已经不常用了，多数用方式二了）

```html
<div id="d1" onclick="changeColor(this);">点我</div>  
<script>  
  function changeColor(ths) {  
    ths.style.backgroundColor="green";
  }
</script>
复制代码
```

> this是实参，表示触发事件的当前元素。 函数定义过程中的ths为形参。

方式二：

```html
<div id="d2">点我</div>
<script>
  var divEle2 = document.getElementById("d2");
  divEle2.onclick=function () {
　　 //console.log(this)
    this.innerText="呵呵"; #哪个标签触发的这个事件，this就指向谁
  }
</script>
复制代码
```

> 注意一个问题：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fff2a39119cc499c9674118c43b91b7e~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

**解决方案：**

方案1：onload

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f2c3433a69674ef897f2c85b0eb17d97~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

方案2：将script标签写到body标签最下面

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f3ae9fcd94c1430b88889344cca70d06~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

## 案例

### （1）结合计时器的事件示例，input框里面动态显示时间

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="x-ua-compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>定时器</title>
  <script>  //当js代码中有找标签的操作的时候，别忘了页面加载的时候的顺序，以防出现找不到标签的情况出现，我们可以将这个script标签放到body标签最下面，或者用window.onload，这里我没有放，你们练习的时候放到下面去
    var intervalId; //用来保存定时器对象，因为开始定时器是一个函数，结束定时器是一个函数，两个函数都是操作的一个定时器，让他们互相能够操作这个定时器，就需要一个全局变量来接受一下这个对象
　　　　　　//把当前事件放到id为i1的input标签里面
    function f() {
      var timeStr = (new Date()).toLocaleString(); // 1.拿到当前事件
      var inputEle = document.getElementById("i1");// 2.获取input标签对象
      inputEle.value = timeStr;  //3.将事件赋值给input标签的value属性
    }
　　//开始定时任务
    function start() {
      f();
      if (intervalId === undefined) { //如果不加这个判断条件，你每次点击开始按钮，就创建一个定时器，每点一次就创建一个定时器，点的次数多了就会在页面上生成好多个定时器，并且点击停止按钮的时候，只能停止最后一个定时器，这样不好，也不对，所以加一个判断
        intervalId = setInterval(f, 1000);
      }
    }    //结束定时任务
    function end() {
      clearInterval(intervalId); //　清除对应的那个定时器
      intervalId = undefined;
    }

  </script>
</head>
<body>

<input type="text" id="i1">
<input type="button" value="开始" id="start" onclick="start();">
<input type="button" value="结束" id="end" onclick="end();">
</body>
</html>
复制代码
```

### （2）搜索框示例

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>搜索框示例</title>

</head>
<body>
    <input id="d1" type="text" value="请输入关键字" onblur="blur1()" onfocus="focus1()">
    
<script>// 注意：函数名称不能为blur或者focus
function focus1(){  //如果在标签中写的blur1()等方法，没有传入this参数，那么我们就需要自己来获取一下这个标签，例如下面的getElementById('d1')
    var inputEle=document.getElementById("d1");
    if (inputEle.value==="请输入关键字"){
        inputEle.value="";　　　　 //inputEle.setAttribute('value','')
    }
}

function blur1(){
    var inputEle=document.getElementById("d1");
    var val=inputEle.value;
    if(!val.trim()){
        inputEle.value="请输入关键字";
    }
}
</script>
</body>
</html>
复制代码
```

### （3）select联动：选择省份，自动列出所有的城市

例如：选择河北省就显示河北省所有的市

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="x-ua-compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>select联动</title>
</head>
<body>
<select id="province">
  <option>请选择省:</option>
</select>

<select id="city">
  <option>请选择市:</option>
</select>

<script>
  data = {"河北省": ["廊坊", "邯郸"], "北京": ["朝阳区", "海淀区"], "山东": ["威海市", "烟台市"]};

  var p = document.getElementById("province");
  var c = document.getElementById("city");
  //页面一刷新就将所有的省份都添加到select标签中
  for (var i in data) {
    var optionP = document.createElement("option"); //创建option标签
    optionP.innerHTML = i; //将省份的数据添加到option标签中
    p.appendChild(optionP);//将option标签添加到select标签中
  }  //只要select中选择的值发生变化的时候，就可以触发一个onchange事件，那么我们就可以通过这个事件来完成select标签联动
  p.onchange = function () {    //1.获取省的值
    var pro = (this.options[this.selectedIndex]).innerHTML;//this.selectedIndex是当前选择的option标签的索引位置，this.options是获取所有的option标签，通过索引拿到当前选择的option标签对象，然后.innerHTML获取对象中的内容，也就是省份
    //还可以这样获取省：var pro = this.value;    var citys = data[pro]; //2. 通过上面获得的省份去data里面取出该省对应的所有的市
    // 3. 清空option
    c.innerHTML = ""; //清空显示市的那个select标签里面的内容
　　    //4.循环所有的市，然后添加到显示市的那个select标签中
    for (var i=0;i<citys.length;i++) {
      var option_city = document.createElement("option");
      option_city.innerHTML = citys[i];
      c.appendChild(option_city);
    }
  }
</script>
</body>
</html>
```

