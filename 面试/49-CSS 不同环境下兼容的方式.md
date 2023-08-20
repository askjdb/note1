# CSS 不同环境下兼容的方式

# CSS兼容性

CSS背后的套路，对前端开发人员来说是必修的学问。由于不同浏览器之间会存在差异，因此我们需要考虑处理这些差异，以便使网页在不同浏览器中都有一致的效果。

当然前端的迅速发展这些兼容问题都已经被"巨人们"解决了，比如前前webpack、gulp、grunt等等，但我们还是得需要了解它。

## 问题

主要来自于：

1. 不同的浏览器有不同的CSS解析器，主要包括Internet Explorer (IE) 、 Google Chrome、 Opera 和 Mozilla Firefox 等。
2. IE之外的浏览器大部分都符合 W3C 规则，但是 IE 以前的版本逐渐被抛弃或者逐步偏向W3C规则。
3. 移动端浏览器内核差异，例如Android与ios浏览器或小程序样式差异。

# 一、CSS Hack

CSS Hack指的是为不同的浏览器写不同的样式表，常见的有IE条件注释法、属性前缀法和选择器前缀法。

## IE条件注释法

```xml
<!--[if IE]>
   <p>IE</p>
<![endif]-->
```

## 属性前缀法

添加特定符号作为前缀，以指定特定浏览器执行对应的CSS文件内容。

```css
h1{
    color:#111; /*全部浏览器*/
    color:#111\9; /*只支持IE*/
    *color:#111; /*只支持IE6 IE7*/
    _color:#111; /*只支持IE6*/
}
```

## 选择器前缀法

类似属性前缀法，只是在选择器字前面加上前缀。

```css
*h1{
    color:#111;
}
```

# 二、使用浏览器私有属性

如果要在不同浏览器中实现一致的效果，在书写CSS时，需要特别指明对应浏览器支持的私有CSS属性，以便让浏览器在相应属性下可以得到完美运行。

CopyInsertNew

```css
.box{
    width:300px;
    height:300px;
    background:red;
    -webkit-border-radius:100px;/*chrome/safari*/
    -moz-border-radius:100px;/*Firefox*/
    -ms-border-radius:100px;/*IE*/
    -o-border-radius:100px;/* 
```

> 这种方式也是"巨人们"解决问题的主要方法。

# 三、使用注意

- 可以采取重置默认样式避免一些误差
  - 例如`padding`和`margin`为0等等
- flex布局兼容：建议能用BFC默认样式实现布局，尽量不要使用FFC等其他方式
- Android版本差异
  - 2.3 开始就支持旧版本`display:-webkit-box;`
  - 4.4 开始支持标准版本`display: flex;`
  - ...
- IOS版本差异
  - 6.1 开始支持旧版本`display:-webkit-box;`
  - 7.1 开始支持标准版本`display: flex;`