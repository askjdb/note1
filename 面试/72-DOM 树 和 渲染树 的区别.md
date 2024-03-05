# Dom树 CSS树 渲染树(render树) 规则、原理

前端不可不学的浏览器渲染机制，阿里年年问，去一个栽一个。听说百度也在考这个，你还不准备学吗？

首先你要了解浏览器渲染的顺序： 1.构建dom树 2.构建css树 3.构建渲染树 4.节点布局 5.页面渲染

**什么是dom 树？** 浏览器将HTML解析成树形的数据结构，简称DOM。 DOM 是文档对象模型 (Document Object Model) 的缩写。它是 HTML 文档的对象表示，同时也是外部内容（例如 JavaScript）与 HTML 元素之间的接口。 解析树的根节点是Document对象。 

![在这里插入图片描述](https://ask.qcloudimg.com/http-save/7774611/gp6f96hr4n.png)

在这里插入图片描述

那我们就可以这样操作 dom 树：

```javascript
<html> 
<head> 
<title>never-online'swebsite</title> 
<script> 
	functionchangedivText(strText){  
	varnodeRoot=document;//这个是根结点  
	varnodeHTML=nodeRoot.childNodes[0];//这个是html结点  
	varnodeBody=nodeHTML.childNodes[1];//body结点  
	varnodeDiv=nodeBody.childNodes[0];//DIV结点  
	varnodeText=nodeDiv.childNodes[0];//文本结点'  
	nodeText.data=strText;//文本节点有data这个属性，  
	因此我们可以改变这个属性，也就成功的操作了DOM树中的一个结点了  
}  
</script> 
</head> 
<body> 
	<div>tutorialofDHTMLandjavascriptprogramming</div> 
	<input onclick="changedivText('change?')" type="button" value="change"/> 
</body> 
</html> 
```

复制

`注：`   1.跨域除外，跨域通常是在操作frame 上，简单的说，就是两个frame 不属于同一[域名](https://cloud.tencent.com/act/pro/domain-sales?from_column=20065&from=20065)。   2.上面的操作为了演示，采用的方法是从根结点一直到文本结点的遍历，在DOM 方法上，有更简洁的方法，这些以后会有更多示例加以说明。

你还可以这样理解 dom 树：   1.DOM树揭示了DOM对象之间的层次关系，这样就方便动态地对html文档进行增删改查。   2.增删改查必须要遵循层次关系   3.文本对象是最底层的节点   4.获取 对象的值 .value 

**什么是CSS树？**

![在这里插入图片描述](https://ask.qcloudimg.com/http-save/7774611/8dz1lawdo8.jpeg)

在这里插入图片描述

   看着有点像 less 写法（less这种预处理语言，就是借用DOM树的思想，来将less这种语法结构，转译成普通的css语法，最终我们用的还是普通的css语法构成的css文件）。 

**什么是渲染树(render树)？**

  浏览器在构造DOM树的同时也在构造着另一棵树-Render Tree,与DOM树相对应暂且叫它Render树。我们知道DOM树为javascript提供了一些列的访问接口（DOM API），但这棵树是不对外的。它的主要作用就是把HTML按照一定的布局与样式显示出来，用到了CSS的相关知识。从MVC的角度来说，可以将render树看成是V，dom树看成是M，C则是具体的调度者，比HTMLDocumentParser等。

```javascript
class RenderObject{
    virtual void layout();
    virtual void paint(PaintInfo);
    virtual void rect repaintRect();
    Node* node;  //the DOM node
    RenderStyle* style;  // the computed style
    RenderLayer* containgLayer; //the containing z-index layer
}
```

复制

  从中我们可以发现renderer包含了一个dom对象以及为其计算好的样式规则，提供了布局以及显示方法。具体效果图如下：（firefox的Frames对应renderers,content对应dom） 

![在这里插入图片描述](https://ask.qcloudimg.com/http-save/7774611/dwrmezi6e7.png)

在这里插入图片描述

   具体显示的时候，每一个renderer体现了一个矩形区块的东西，即我们常说的CSS盒子模型的概念，它本身包含了一些几何学相关的属性，如宽度width，高度height，位置position等。每一个renderer还有一个很重要的属性，就是如何显示它，display。我们知道元素的display有很多种，常见的就有none,inline,block,inline-block…，不同的display它们之间到底有啥不同呢？我们看一下代码：

```javascript
RenderObject* RenderObject::createObject(Node* node, RenderStyle* style)
{
    Document* doc = node->document();
    RenderArena* arena = doc->renderArena();
    ...
    RenderObject* o = 0;
  
    switch (style->display()) {
        case NONE:
            break;
        case INLINE:
            o = new (arena) RenderInline(node);
            break;
        case BLOCK:
            o = new (arena) RenderBlock(node);
            break;
        case INLINE_BLOCK:
            o = new (arena) RenderBlock(node);
            break;
        case LIST_ITEM:
            o = new (arena) RenderListItem(node);
            break;
       ...
    }
  
    return o;
}
```

复制

  说了这么多render树，我们还没见一下它的真容呢，它到底会是个什么模样呢？我们看一下图。 

![在这里插入图片描述](https://ask.qcloudimg.com/http-save/7774611/q4tv47kdep.png)

在这里插入图片描述

------

   对渲染树的解释我们暂且告一段落，接下来看一看浏览器的渲染原理：   

**深入浅出浏览器渲染原理**

  首先浏览器的内核是指支持浏览器运行的最核心的程序，分为两个部分的，一是渲染引擎，另一个是JS引擎。渲染引擎在不同的浏览器中也不是都相同的。比如在 Firefox 中叫做 Gecko，在 Chrome 和 Safari 中都是基于 WebKit 开发的。 

![在这里插入图片描述](https://ask.qcloudimg.com/http-save/7774611/x6bty4xkq0.png)

在这里插入图片描述

------

**浏览器工作大体流程**

  渲染引擎首先通过网络获得所请求文档的内容，通常以8K分块的方式完成。 下面是渲染引擎在取得内容之后的基本流程：   1.解析html为dom树，解析css为cssom。渲染引擎开始解析html，并将标签转化为内容树中的dom节点。   2. 把dom和cssom结合起来生成渲染树(render)。接着，它解析外部CSS文件及style标签中的样式信息。这些样式信息以及html中的可见性指令将被用来构建另一棵树——render树。Render树由一些包含有颜色和大小等属性的矩形组成，它们将被按照正确的顺序显示到屏幕上。   3. 布局渲染树，计算几何形状。Render树构建好了之后，将会执行布局过程，它将确定每个节点在屏幕上的确切坐标。   4. 把渲染树展示到屏幕上。再下一步就是绘制，即遍历render树，并使用UI后端层绘制每个节点。

![在这里插入图片描述](https://ask.qcloudimg.com/http-save/7774611/ychsfhr5eq.png)

在这里插入图片描述

------

```
浏览器要解析的三样东西：
1.一个是HTML/SVG/XHTML，事实上，Webkit有三个C++的类对应这三类文档。解析这三种文件会产生一个DOM Tree。
2.CSS，解析CSS会产生CSS规则树。
3.Javascript，脚本，主要是通过DOM API和CSSOM API来操作DOM Tree和CSS Rule Tree.
```

复制

**构造dom 树** 

![在这里插入图片描述](https://ask.qcloudimg.com/http-save/7774611/jbnupxk0gd.png)

在这里插入图片描述

   浏览器从磁盘或网络读取HTML的原始字节，并根据文件的指定编码（例如 UTF-8）将它们转换成字符串。   在网络中传输的内容其实都是 0 和 1 这些字节数据。当浏览器接收到这些字节数据以后，它会将这些字节数据转换为字符串，也就是我们写的代码。   将字符串转换成Token，例如：、等。Token中会标识出当前Token是“开始标签”或是“结束标签”亦或是“文本”等信息。   事实上，构建DOM的过程中，不是等所有Token都转换完成后再去生成节点对象，而是一边生成Token一边消耗Token来生成节点对象。换句话说，每个Token被生成后，会立刻消耗这个Token创建出节点对象。注意：带有结束标签标识的Token不会创建节点对象。  比如：

```javascript
<html>
<head>
    <title>Web page parsing</title>
</head>
<body>
    <div>
        <h1>Web page parsing</h1>
        <p>This is an example Web page.</p>
    </div>
</body>
</html>
```

复制

![在这里插入图片描述](https://ask.qcloudimg.com/http-save/7774611/s7814uuvea.png)

在这里插入图片描述

------

**构建CSSOM**

  DOM会捕获页面的内容，但浏览器还需要知道页面如何展示，所以需要构建CSSOM。

  构建CSSOM的过程与构建DOM的过程非常相似，当浏览器接收到一段CSS，浏览器首先要做的是识别出Token，然后构建节点并生成CSSOM。

  在这一过程中，浏览器会确定下每一个节点的样式到底是什么，并且这一过程其实是很消耗资源的。因为样式你可以自行设置给某个节点，也可以通过继承获得。在这一过程中，浏览器得递归 CSSOM 树，然后确定具体的元素到底是什么样式。

  注意：CSS匹配HTML元素是一个相当复杂和有性能问题的事情。所以，DOM树要小，CSS尽量用id和class，千万不要过渡层叠下去。 

**构建渲染树**

  当我们生成 DOM 树和 CSSOM 树以后，就需要将这两棵树组合为渲染树。 

![在这里插入图片描述](https://ask.qcloudimg.com/http-save/7774611/sc02hpnnwh.png)

在这里插入图片描述

 值得注意的是：   关键的点在于上述的4个过程并不是以严格顺序执行的。渲染引擎会以最快的速度展示内容，所以第二阶段不会等到第一阶段结束才开始，而是在第一阶段有输出的时候就开始执行。其它阶段也是如此。由于浏览器会尝试尽快展示内容，所以内容有时会在样式还没有加载的时候展示出来。

  这就是经常发生的FOCU(flash of unstyled content)或白屏问题。 

**布局与绘制**

  当浏览器生成渲染树以后，就会根据渲染树来进行布局（也可以叫做回流）。这一阶段浏览器要做的事情是要弄清楚各个节点在页面中的确切位置和大小。通常这一行为也被称为“自动重排”。    布局流程的输出是一个“盒模型”，它会精确地捕获每个元素在视口内的确切位置和尺寸，所有相对测量值都将转换为屏幕上的绝对像素。    布局完成后，浏览器会立即发出“Paint Setup”和“Paint”事件，将渲染树转换成屏幕上的像素。

WebKit 主流程示意： 

![在这里插入图片描述](https://ask.qcloudimg.com/http-save/7774611/nodlif1jxl.png)

在这里插入图片描述

------

Mozilla 的 Gecko 呈现引擎主流程： 

![在这里插入图片描述](https://ask.qcloudimg.com/http-save/7774611/x83zqawdkr.png)

在这里插入图片描述

------

   从上图我们可以看出，虽然 WebKit 和 Gecko 使用的术语略有不同，但整体流程是基本相同的。Gecko 将视觉格式化元素组成的树称为“框架树”。每个元素都是一个框架。WebKit 使用的术语是“呈现树”，它由“呈现对象”组成。对于元素的放置，WebKit 使用的术语是“布局”，而 Gecko 称之为“重排”。对于连接 DOM 节点和可视化信息从而创建呈现树的过程，WebKit 使用的术语是“附加”。有一个细微的非语义差别，就是 Gecko 在 HTML 与 DOM 树之间还有一个称为“内容模块（Content Model）”的层，用于生成 DOM 元素。   

**渲染过程中遇到JS文件怎么处理？**

  JavaScript的加载、解析与执行会阻塞DOM的构建，也就是说，在构建DOM时，HTML解析器若遇到了JavaScript，那么它会暂停构建DOM，将控制权移交给JavaScript引擎，等JavaScript引擎运行完毕，浏览器再从中断的地方恢复DOM构建。

  也就是说，如果你想首屏渲染的越快，就越不应该在首屏就加载 JS 文件，这也是都建议将 script 标签放在 body 标签底部的原因。当然在当下，并不是说 script 标签必须放在底部，因为你可以给 script 标签添加 defer 或者 async 属性（下文会介绍这两者的区别）。

  JS文件不只是阻塞DOM的构建，它会导致CSSOM也阻塞DOM的构建。

  原本DOM和CSSOM的构建是互不影响，井水不犯河水，但是一旦引入了JavaScript，CSSOM也开始阻塞DOM的构建，只有CSSOM构建完毕后，DOM再恢复DOM构建。

  这是什么情况？

  这是因为JavaScript不只是可以改DOM，它还可以更改样式，也就是它可以更改CSSOM。前面我们介绍，不完整的CSSOM是无法使用的，但JavaScript中想访问CSSOM并更改它，那么在执行JavaScript时，必须要能拿到完整的CSSOM。所以就导致了一个现象，如果浏览器尚未完成CSSOM的下载和构建，而我们却想在此时运行脚本，那么浏览器将延迟脚本执行和DOM构建，直至其完成CSSOM的下载和构建。也就是说，在这种情况下，浏览器会先下载和构建CSSOM，然后再执行JavaScript，最后在继续构建DOM。

**你真的了解回流和重绘吗?**

![在这里插入图片描述](https://ask.qcloudimg.com/http-save/7774611/b0jq6se5mz.png)

在这里插入图片描述

------

`重绘：`   当元素属性发生改变且不影响布局时（背景颜色、透明度、字体样式等），产生重绘，相当于 不刷新页面，动态更新内容。 `回流：`   当元素属性发生改变且影响布局时（宽度、高度、内外边距等），产生回流，相当于 刷新页面。

>  重绘不一定引起回流，回流必将引起重绘 

**如何减少回流和重绘？**

1. 使用 transform 替代 top 

2. 使用 visibility 替换 display: none ，因为前者只会引起重绘，后者会引发回流（改变了布局） 
3. 不要使用 table 布局，可能很小的一个小改动会造成整个 table 的重新布局 
4. 动画实现的速度的选择，动画速度越快，回流次数越多，也可以选择使用requestAnimationFrame 
5. CSS 选择符从右往左匹配查找，避免节点层级过多 
6. 将频繁重绘或者回流的节点设置为图层，图层能够阻止该节点的渲染行为影响别的节点。比如对于 video 标签来说，浏览器会自动将该节点变为图层。