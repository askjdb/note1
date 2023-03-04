# 填坑”之解决Unable to preventDefault inside passive event listener

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210424133919796.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80NDUxNDg5NA==,size_16,color_FFFFFF,t_70)
**翻译一下：chrome 监听touch类事件报错：无法被动侦听事件preventDefault，是新版本chrome 浏览器报错。**
**说明**：说一下这个 preventDefault()是个什么鬼，这个是取消默认事件的，如果这个函数起作用的，比如默认的表单提交，a链接的点击跳转，就不好用了。
**原因**：google浏览器为了最快速的相应touch事件，做出的改变。
**历史**：当浏览器首先对默认的事件进行响应的时候，要检查一下是否进行了默认事件的取消。这样就在响应滑动操作之前有那么一丝丝的耽误时间。
现在：google就决定默认取消了对这个事件的检查，默认时间就取消了。直接执行滑动操作。这样就更加的顺滑了。但是浏览器的控制台就会进行错误提醒了。

**具体情况：**
从 chrome56 开始，在 window、document 和 body 上注册的 touchstart 和 touchmove 事件处理函数，会默认为是 passive: true。浏览器忽略 preventDefault() 就可以第一时间滚动了。

导致下面的效果一致：

```
wnidow.addEventListener('touchmove', func) 效果和下面一句一样
wnidow.addEventListener('touchmove', func, { passive: true })
12
```

**这样会出现新的问题：**

如果在以上这 3 个元素的 touchstart 和 touchmove 事件处理函数中调用 e.preventDefault() ，会被浏览器忽略掉，并不会阻止默认行为。
各位亲人们可以测试一下：

```
body {
  margin: 0;
  height: 2000px;
  background: linear-gradient(to bottom, red, green);
}

// 在 chrome56 中，照样滚动，而且控制台会有提示，blablabla
window.addEventListener('touchmove', e => e.preventDefault())
12345678
```

**那么我们这些小程序员该怎么办呢？？？**

可以做到：

即不让控制台提示，而且 preventDefault() 有效果呢？
两个方案：
**1、注册处理函数时，用如下方式，明确声明为不是被动的
window.addEventListener(‘touchmove’, func, { passive: false })**

**2、应用 CSS 属性 touch-action: none; 这样任何触摸事件都不会产生默认行为，但是 touch 事件照样触发。touch-action 还有很多选项，**