# clientX/screenX/offsetX/pageX

## 鼠标事件属性

主要分为MouseEvent.clientX、MouseEvent.clientY、MouseEvent.movementX、MouseEvent.movementY、MouseEvent.offsetX、MouseEvent.offsetY、MouseEvent.pageX、MouseEvent.pageY、MouseEvent.screenX、MouseEvent.screenY、MouseEvent.x、MouseEvent.y

- `MouseEvent.clientX` 是只读属性， 它提供事件发生时的应用客户端区域的水平坐标 (与页面坐标不同)。例如，不论页面是否有水平滚动，当你点击客户端区域的左上角时，鼠标事件的 clientX 值都将为 0 。最初这个属性被定义为长整型（long integer），如今 CSSOM 视图模块将其重新定义为双精度浮点数（double float）。你可以查阅浏览器兼容性部分的文档来进一步了解有关信息。
- `MouseEvent.clientY` 是只读属性， 它提供事件发生时的应用客户端区域的垂直坐标 (与页面坐标不同)。例如，当你点击客户端区域的左上角时，鼠标事件的 clientY 值为 0 ，这一值与页面是否有垂直滚动无关。
- `MouseEvent.movementX` 是只读属性，它提供了当前事件和上一个mousemove事件之间鼠标在水平方向上的移动值。换句话说，这个值是这样计算的 : currentEvent.movementX = currentEvent.screenX - previousEvent.screenX.
- `MouseEvent.movementY` 是只读属性，它提供了当前事件和上一个 mousemove 事件之间鼠标在水平方向上的移动值。换句话说，这个值是这样计算的 :currentEvent.movementY = currentEvent.screenY - previousEvent.screenY.
- `MouseEvent.offsetX`规定了事件对象与目标节点的内填充边（padding edge）在 X 轴方向上的偏移量。
- `MouseEvent.offsetY`规定了事件对象与目标节点的内填充边（padding edge）在 Y 轴方向上的偏移量。
- `MouseEvent.pageX` 是一个由MouseEvent接口返回的相对于整个文档的x（水平）坐标以像素为单位的只读属性。这个属性将基于文档的边缘，考虑任何页面的水平方向上的滚动。举个例子，如果页面向右滚动 200px 并出现了滚动条，这部分在窗口之外，然后鼠标点击距离窗口左边 100px 的位置，pageX 所返回的值将是 300。
- `MouseEvent.pageY`是一个只读属性，它返回触发事件的位置相对于整个 document 的 Y 坐标值。由于其参考物是整个 dom，所以这个值受页面垂直方向的滚动影响。例如：当你垂直方向向下滚动了 50 pixel，那么你在顶端进行点击的时候，获取的pageY为 50pixed 而不是 0。
- `MouseEvent.screenX`是只读属性，他提供了鼠标相对于屏幕坐标系的水平偏移量。
- `MouseEvent.screenY`是只读属性，它提供了鼠标相对于屏幕坐标系的垂直偏移量。
- `MouseEvent.x` 是 MouseEvent.clientX 属性的别名.
- `MouseEvent.y` 属性是 MouseEvent.clientY 属性的别称。

![img](https:////p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/950786c262ec4484af4f20c839fdc43d~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

## 元素属性

Element 是一个通用性非常强的基类，所有 Document 对象下的对象都继承自它。这个接口描述了所有相同种类的元素所普遍具有的方法和属性。一些接口继承自 Element 并且增加了一些额外功能的接口描述了具体的行为。例如， HTMLElement 接口是所有 HTML 元素的基本接口，而 SVGElement 接口是所有 SVG 元素的基础。大多数功能是在这个类的更深层级（hierarchy）的接口中被进一步制定的。

- `Element.clientHeight`是只读属性，对于没有定义CSS或者内联布局盒子的元素为0，否则，它是元素内部的高度(单位像素)，包含内边距，但不包括水平滚动条、边框和外边距。clientHeight 可以通过 CSS height + CSS padding - 水平滚动条高度 (如果存在)来计算.
- `Element.clientWidth`只读属性，内联元素以及没有 CSS 样式的元素的 clientWidth 属性值为 0。Element.clientWidth 属性表示元素的内部宽度，以像素计。该属性包括内边距，但不包括垂直滚动条（如果有）、边框和外边距。

![img](https://i.loli.net/2019/12/30/wAsQgbidVTKEfhx.png)

- `Element.clientLeft`表示一个元素的左边框的宽度，以像素表示。如果元素的文本方向是从右向左（RTL, right-to-left），并且由于内容溢出导致左边出现了一个垂直滚动条，则该属性包括滚动条的宽度。clientLeft 不包括左外边距和左内边距。clientLeft 是只读的。
- `Element.clientTop`一个元素顶部边框的宽度（以像素表示）。不包括顶部外边距或内边距。clientTop 是只读的。

![img](https:////p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/79d5316a60b94eaf87be6228dfcf3446~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

- `Element.scrollHeight`这个只读属性是一个元素内容高度的度量，包括由于溢出导致的视图中不可见内容。scrollHeight 的值等于该元素在不使用滚动条的情况下为了适应视口中所用内容所需的最小高度。 没有垂直滚动条的情况下，scrollHeight值与元素视图填充所有内容所需要的最小值clientHeight相同。包括元素的padding，但不包括元素的border和margin。scrollHeight也包括 ::before 和 ::after这样的伪元素。
- `Element.scrollWidth`这个只读属性是元素内容宽度的一种度量，包括由于overflow溢出而在屏幕上不可见的内容。scrollWidth值等于元素在不使用水平滚动条的情况下适合视口中的所有内容所需的最小宽度。 宽度的测量方式与clientWidth相同：它包含元素的内边距，但不包括边框，外边距或垂直滚动条（如果存在）。 它还可以包括伪元素的宽度，例如::before或::after。 如果元素的内容可以适合而不需要水平滚动条，则其scrollWidth等于clientWidth

![img](https:////p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/86d88ace407c4ec9b866f17408e33a08~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

- `Element.scrollLeft`可以读取或设置元素滚动条到元素左边的距离。注意如果这个元素的内容排列方向（direction） 是rtl (right-to-left) ，那么滚动条会位于最右侧（内容开始处），并且scrollLeft值为0。此时，当你从右到左拖动滚动条时，scrollLeft会从0变为负数（这个特性在chrome浏览器中不存在）。
- `Element.scrollTop`可以获取或设置一个元素的内容垂直滚动的像素数。一个元素的 scrollTop 值是这个元素的顶部到视口可见内容（的顶部）的距离的度量。当一个元素的内容没有产生垂直方向的滚动条，那么它的 scrollTop 值为0。

![img](https://i.loli.net/2019/12/31/tJm51BuQHAeLrZ2.png)

## HTMLElement接口属性

HTMLElement 接口表示所有的 HTML 元素。一些HTML元素直接实现了HTMLElement接口，其它的间接实现HTMLElement接口.

- `HTMLElement.offsetHeight` 是一个只读属性，它返回该元素的像素高度，高度包含该元素的垂直内边距和边框，且是一个整数。通常，元素的offsetHeight是一种元素CSS高度的衡量标准，包括元素的边框、内边距和元素的水平滚动条（如果存在且渲染的话），不包含:before或:after等伪类元素的高度。对于文档的body对象，它包括代替元素的CSS高度线性总含量高。浮动元素的向下延伸内容高度是被忽略的。 如果元素被隐藏（例如 元素或者元素的祖先之一的元素的style.display被设置为none），则返回0
- `HTMLElement.offsetWidth` 是一个只读属性，返回一个元素的布局宽度。一个典型的（译者注：各浏览器的offsetWidth可能有所不同）offsetWidth是测量包含元素的边框(border)、水平线上的内边距(padding)、竖直方向滚动条(scrollbar)（如果存在的话）、以及CSS设置的宽度(width)的值。

![img](https://i.loli.net/2019/12/31/P7HImEBsoK4MFwO.png)

- `HTMLElement.offsetLeft` 是一个只读属性，返回当前元素左上角相对于  HTMLElement.offsetParent 节点的左边界偏移的像素值。对块级元素来说，offsetTop、offsetLeft、offsetWidth 及 offsetHeight 描述了元素相对于 offsetParent 的边界框。然而，对于可被截断到下一行的行内元素（如 span），offsetTop 和 offsetLeft 描述的是第一个边界框的位置（使用 Element.getClientRects() 来获取其宽度和高度），而 offsetWidth 和 offsetHeight 描述的是边界框的尺寸（使用 Element.getBoundingClientRect 来获取其位置）。因此，使用 offsetLeft、offsetTop、offsetWidth、offsetHeight 来对应 left、top、width 和 height 的一个盒子将不会是文本容器 span 的盒子边界。
- `HTMLElement.offsetTop` 为只读属性，它返回当前元素相对于其 offsetParent 元素的顶部内边距的距离。
- `HTMLElement.offsetParent` 是一个只读属性，返回一个指向最近的（指包含层级上的最近）包含该元素的定位元素或者最近的 table,td,th,body元素。当元素的 style.display 设置为 "none" 时，offsetParent 返回 null。offsetParent 很有用，因为 offsetTop 和 offsetLeft 都是相对于其内边距边界的。

## window属性

window 对象表示一个包含DOM文档的窗口，其 document 属性指向窗口中载入的 DOM文档 。使用 document.defaultView 属性可以获取指定文档所在窗口。

window作为全局变量，代表了脚本正在运行的窗口，暴露给 Javascript 代码。

本节为 DOM Window 对象中可用的所有方法、属性和事件提供简要参考。window 对象实现了 Window 接口，此接口继承自 AbstractView 接口。一些额外的全局函数、命名空间、对象、接口和构造函数与 window 没有典型的关联，但却是有效的，它们在 JavaScript参考 和 DOM参考 中列出。

在有标签页功能的浏览器中，每个标签都拥有自己的 window 对象；也就是说，同一个窗口的标签页之间不会共享一个 window 对象。有一些方法，如 window.resizeTo 和 window.resizeBy 之类的方法会作用于整个窗口而不是 window 对象所属的那个标签。一般而言，如果一样东西无法恰当地作用于标签，那么它就会作用于窗口。

- `Window.innerHeight`浏览器窗口的视口（viewport）高度（以像素为单位）；如果有水平滚动条，也包括滚动条高度。
- `Window.innerWidth`浏览器视口（viewport）宽度（单位：像素），如果存在垂直滚动条则包括它。
- `Window.outerHeight`Window.outerHeight 获取整个浏览器窗口的高度（单位：像素），包括侧边栏（如果存在）、窗口镶边（window chrome）和窗口调正边框（window resizing borders/handles）
- `Window.outerWidth`获取浏览器窗口外部的宽度。表示整个浏览器窗口的宽度，包括侧边栏（如果存在）、窗口镶边（window chrome）和调正窗口大小的边框（window resizing borders/handles）。

![img](https:////p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d075b935621f4a88a6d8f881e43aee19~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

- `Window.screenLeft` 只读属性返回浏览器左边框到左边屏幕边缘的距离，单位是css的像素。
- `Window.screenTop` 只读属性返回垂直距离，单位是CSS 像素, 从用户浏览器的上边界到屏幕最顶端。
- `Window.screenX`返回浏览器左边界到操作系统桌面左边界的水平距离。
- `Window.screenY`返回浏览器顶部距离系统桌面顶部的垂直距离。
- `Window.scrollX`返回文档/页面水平方向滚动的像素值。pageXOffset 属性是 scrollY 属性的别名
- `Window.scrollY`返回文档在垂直方向已滚动的像素值。pageYOffset 属性是 scrollY 属性的别名

## screen属性

Screen 接口表示一个屏幕窗口，往往指的是当前正在被渲染的window对象，可以使用 window.screen 获取它。

- `Screen.availTop`浏览器窗口在屏幕上的可占用空间上边距离屏幕上边界的像素值。
- `Screen.availLeft`返回浏览器可用空间左边距离屏幕（系统桌面）左边界的距离。
- `Screen.availHeight`返回浏览器窗口在屏幕上可占用的垂直空间，即最大高度。
- `Screen.availWidth`返回浏览器窗口可占用的水平宽度（单位：像素）。
- `Screen.height`返回屏幕的高度（单位：像素）。
- `Screen.width`返回屏幕的宽度。