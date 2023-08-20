# absolute导致的高度塌陷问题——解决方法

前段时间写前端页面排版的时候又又又遇到了absolute导致的父元素高度塌陷的问题，以前代码写的少所以遇到问题就是查查查，问题解决后了一个漫长的学期后又遇到一样的问题又得重新查查查，所以这次索性总结一下。

什么是高度塌陷？

在文档流中，父元素的高度默认被子元素撑开的，也就是说子元素多高父元素就多高，但是当为我们子元素设置浮动以后，子元素就会完全脱离文档流，此时会导致子元素无法撑开父元素的高度，导致父元素的高度塌陷。由于父元素的高度塌陷，则父元素下的所有元素都会向上移动，导致页面的布局混乱。
**正常代码：**

```html
<html>
    <head>
        <style>
            .container{
                width: 300px;
                height: auto;
                background: rgb(54, 181, 219);
		position: relative;
            }
            .box{
                width: 200px;
                height: 200px;
                border: 2px solid rgb(247, 129, 129);
            }
        </style>
    </head>
    <body>
        <div class="container" >
            <div class="box"></div>
        </div>
    </body>
</html>


```

**代码结果：父元素(蓝色背景）高度被子元素（红色边框）高度撑起**

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200703235305297.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80NDA2NjUzNA==,size_16,color_FFFFFF,t_70)

**问题出现：当子元素添加了positive：absolute属性后。**
**结果：父元素高度塌陷，高度为0。**

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200703235514504.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80NDA2NjUzNA==,size_16,color_FFFFFF,t_70)

温馨提示：因为position设置为absolute而导致高度塌陷的同学可跳过下列四种常见的解决方法，因为无法解决问题（具体原因请往下拉…）

**常见的高度塌陷问题的解决方法**

1. 给父元素添加固定高度。
   （缺点：添加了固定高度的父元素高度不再自适应）
2. 给父元素添加属性overflow: hidden;
   （缺点：当子元素有定位属性时,容器以外的部分会被裁剪掉)
3. 在子元素的末尾添加一个高度为0的空白 div来清除浮动属性。
   （缺点：在页面中添加无意义的div会造成代码冗余）

```html
//代码结构如下
<body>
     <div class="father" >
         <div class="son"></div>
         //清除浮动属性的div
         <div style="clear: both;"></div>
    </div>
</body>

```

4. 给父元素中添加一个伪元素。

```css
 .父元素:after{
                 content: "";
                 height: 0;
                 clear: both;
                 overflow: hidden;
                 display: block;
                 visibility: hidden;
            } 

```

当高度塌陷是因为position设置为absolute所导致的时候，上面的四种方法除了第一种把高度写死之外，其它三种方法都是无效的。

原因：解决父元素高度塌陷的通常解决办法是在父元素中开启BFC。当子元素脱离文档流的原因是float，则可以通过开启BFC解决。但是如果子元素脱离文档流是因为absolute或者fixed，则开启BFC同样不管用。这种情况下，CSS没有办法解决，只能通过JS获取子元素的高度然后赋值给父元素来解决。

```html
 <body>
        <div class="container" id="container">
            <div class="box" id="box" ></div>
        </div>
        <script>
            //拿到子元素的高度
            var box=document.getElementById("box").offsetHeight;
            //将子元素的高度赋予父元素
            document.getElementById("container").style.height=box;
            alert(box);
        </script>
</body>


```

至此absolute导致的父元素高度塌陷问题解决👍

后来我尝试将绝对定位改为相对定位，这样相对定位子元素的位置还是会在原来的位置，不会脱离文档流。所以块还是快，内联还是内联，但是子元素会提升一个层级，相对自身的位置进行定位也是一种解决方法。

查资料的时候意外发现针对absolute的高度塌陷问题好像没什么人写，难道是因为它只能用JS解决而大神们都不屑于写这种小文章了吗？我这个前端新手怕不记下来下回又又又找不到资料了🙃


# 注意:

# top

**`top`**[样式](https://developer.mozilla.org/zh-CN/docs/Web/CSS)属性定义了定位元素的**上外边距边界**与其包含块**上边界**之间的偏移，**非定位元素设置此属性无效。**