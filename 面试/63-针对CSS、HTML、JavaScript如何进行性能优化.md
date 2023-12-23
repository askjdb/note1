# 针对CSS、HTML、JavaScript如何进行性能优化

## 针对CSS如何进行性能优化？

(1)正确使用display属性，display属性会影响页面的渲染， 因此要注意以下几方面，●display:inline后不应该再使用width、 height、 margin、 padding和float.

●display:inline-block后不应该再使用float.

●display:block 后不应该再使用vertical-align.

●display:table-*后 不应该再使用margin或者float.

(2)不滥用float.

(3)不声明过多的font-size.

(4)当值为0时不需要单位。

(5)标准化各种浏览器前缀，并注意以下几方面。

●浏览器无前缀应放在最后。

●CSS动画只用( -webkit-无前缀)两种即可。

●其他前缀包括-webkit-、-m0z-、 -ms-、无前缀(Opera浏览器改用blink内核，所以-0-被淘汰)。

(6)避免让选择符看起来像是正则表达式。高级选择器不容易读懂，执行时间也长。

(7)尽量使用id、 class选择器设置样式(避免使用style属性设置行内样式)。

(8)尽量使用CSS3动画。

(9)减少重绘和回流。

## 针对CSS如何进行性能优化？

(1)正确使用display属性，display属性会影响页面的渲染， 因此要注意以下几方面，●display:inline后不应该再使用width、 height、 margin、 padding和float.

●display:inline-block后不应该再使用float.

●display:block 后不应该再使用vertical-align.

●display:table-*后 不应该再使用margin或者float.

(2)不滥用float.

(3)不声明过多的font-size.

(4)当值为0时不需要单位。

(5)标准化各种浏览器前缀，并注意以下几方面。

●浏览器无前缀应放在最后。

●CSS动画只用( -webkit-无前缀)两种即可。

●其他前缀包括-webkit-、-m0z-、 -ms-、无前缀(Opera浏览器改用blink内核，所以-0-被淘汰)。

(6)避免让选择符看起来像是正则表达式。高级选择器不容易读懂，执行时间也长。

(7)尽量使用id、 class选择器设置样式(避免使用style属性设置行内样式)。

(8)尽量使用CSS3动画。

(9)减少重绘和回流。


## 针对JavaScript,如何优化性能?

(1)缓存DOM的选择和计算。

(2)尽量使用事件委托模式，避免批量绑定事件。

( 3)使用touchstart、 touchend代替click.

( 4)合理使用requestAnimationFrame动画代替setTimeOut。

(5)适当使用canvas动画。

(6)尽量避免在高频事件(如TouchMove、 Scroll 事件)中修改视图，这会导致多次渲染。
