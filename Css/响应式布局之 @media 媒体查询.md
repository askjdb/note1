# 响应式布局之 @media 媒体查询

### 响应式布局是什么呢？

响应式布局就是一个网站能够兼容多个终端，可以根据屏幕的大小自动调整页面的的展示方式以及布局，我们不用为每一个终端做一个特定的版本！

### 响应式设计与自适应设计的区别？

**响应式设计**：响应式**开发一套界面**，通过检测视口分辨率，针对不同客户端在客户端做代码处理，来展现不同的布局和内容。

**自适应设计**：自适应需要**开发多套界面**，通过检测视口分辨率，来判断当前访问的设备是 `PC` 端、平板还是手机，从而请求服务层，返回不同的页面。

### 响应式设计与自适应设计如何选取？

- 页面不是太复杂的情况下，采用响应式布局的方式
- 页面中信息较多，布局较为复杂的情况，采用自适应布局的方式

#### 响应式设计与自适应设计的优缺点？

##### 响应式布局

**优点**：灵活性强，能够快捷解决多设备显示适用问题

**缺点**

- 效率较低，兼容各设备工作量大
- 代码较为累赘，加载时间可能会加长
- 在一定程度上改变了网站原有的布局结构

##### 自适应布局

**优点**

- 对网站复杂程度兼容更大
- 代码更高效
- 测试和运营都相对容易和精准

**缺点**：同一个网站需要为不同的设备开发不同的页面，增加的开发的成本

### 媒体查询（Media Queries）

`Media Queries` 能在不同的条件下使用不同的样式，使页面在不同在终端设备下达到不同的渲染效果

**Media Query 原理**：允许添加表达式用以媒体查询（包括 **媒体类型** 和 **媒体特性**），以此来选择不同的样式表，从而自动适应不同的屏幕分辨率

#### 使用方式

- 通过 `link` 标签中判断设备的尺寸，从而引用不同的 `css` 样式文件

```html
html复制代码<!-- style.css 样式被用在宽度小于或等于 480px 的手持设备上，或者被用于屏幕宽度大于或等于 960px 的设备上 -->
<link rel="stylesheet" type="text/css" href="style.css" media="handheld and (max-width:480px), screen and (min-width:960px)" />
```

- 通过 `@media` 判断设备的尺寸应用不同的 `css` 样式

```css
css复制代码// 屏幕大于 1024px 或小于 1440px 时应用该样式
@media screen and (min-width: 1024px) and (max-width: 1440px) {
  ...
}
```

#### 响应式设计实践

1. 设置 [meta](https://juejin.cn/post/6844904083296370702#heading-11) 标签

```html
html
复制代码<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
```

1. 使用 [@media](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FLearn%2FCSS%2FCSS_layout%2FMedia_queries) 设置样式

```css
css复制代码// 屏幕大于 1024px 或小于 1440px 时应用该样式
@media screen and (min-width: 1024px) and (max-width: 1440px) { 
  ...
}
```

1. 依据要求并结合屏幕尺寸设置布局分界点

```css
css复制代码// 屏幕大于 1440px 时应用该样式
@media screen and (min-width: 1441px) { 
  ...
}

// 屏幕大于 1024px 或小于 1440px 时应用该样式
@media screen and (min-width: 1024px) and (max-width: 1440px) { 
  ...
}
```

**说明：**设置布局分界点时需要注意样式的先后顺序，后面的 `@media` 范围不应该包含前面的范围（满足条件时，后面的样式会覆盖前面的样式）

#### 常见的屏幕尺寸

```yaml
yaml复制代码分辨率   比例 | 设备尺寸

1024 * 500		（8.9 寸）
1024 * 768		（4 : 3  | 10.4 寸、12.1 寸、14.1 寸、15 寸）
1280 * 800		（16 : 10  |15.4 寸）
1280 * 1024		（5：4  | 14.1寸、15.0寸）
1280 * 854		（15 : 10 | 15.2）
1366 * 768		（16：9 | 不常见）
1440 * 900		（16：10  17寸 仅苹果用）
1440 * 1050		（5：4  | 14.1寸、15.0寸）
1600 * 1024		（14：9 | 不常见）
1600 * 1200		（4：3 | 15、16.1）
1680 * 1050		（16：10 | 15.4寸、20.0寸）
1920 * 1200		（23寸）
```

### Sass 结合媒体查询 + react-responsive

使用 sass 处理不同尺寸下对应的样式问题，结合 [react-responsive](https://link.juejin.cn?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Freact-responsive) 在不同尺寸下对不同内容部分进行显示隐藏

#### 嵌套媒体查询

结合 `sass` 的特性可以使用嵌套媒体查询来编写样式，而其相较于 `css` 媒体查询主要优点在于：

可以将 `@media` 样式写在相应元素样式上下文附近，而不是在样式的文件最底部或单独的样式文件中编写，更利于后期的维护。

示例：

```scss
scss复制代码div.demo {
    width: 800px;
    @media screen and (max-width: 1440px) {
        width: 600px;
    }
    @media screen and (max-width: 768px) {
        width: 400px;
    }
}
```

编译后：

```css
css复制代码div.demo {
    width: 800px;
}
@media screen and (max-width: 1440px) {
    div.demo {
        width: 600px;
    }
}
@media screen and (max-width: 768px) {
    div.demo {
        width: 400px;
    }
}
```

#### 提取断点变量

##### 提取布局分界点作为变量

针对不同的屏幕尺寸会选择合适的**布局分界点**，而且这些分界点可能是会发生变化的。对此，如果将分界点值提取作为**变量**统一起来管理相信是更为方便的，而 `sass` 就可以做到这点。

```scss
scss复制代码// theme.scss
$width-small: 375px;
$width-medium: 768px;
$width-large: 1440px;
```

示例：

```scss
scss复制代码div.demo {
    width: 800px;
    @media screen and (max-width: $width-large) {
        width: 600px;
    }
    @media screen and (max-width: $width-medium) {
        width: 400px;
    }
  	 @media screen and (max-width: $width-small) {
        width: 200px;
    }
}
```

编译后：

```css
css复制代码div.demo {
    width: 800px;
}
@media screen and (max-width: 1440px) {
    div.demo {
        width: 600px;
    }
}
@media screen and (max-width: 768px) {
    div.demo {
        width: 400px;
    }
}
@media screen and (max-width: 375px) {
    div.demo {
        width: 200px;
    }
}
```

##### 提取整个媒体查询作为变量

除了可以将分界点提取作为变量之外，进一步，我们也可以用一个变量定义整个媒体查询

```scss
scss复制代码$mobile-first: "screen and (min-width: 375px)";

@media #{$mobile-first} {
    #demo {
        width: 60%;
      	margin: 0 auto;
    }
}
```

编译后：

```css
css复制代码@media screen and (min-width: 375px) {
    #demo {
        width: 60%;
      	margin: 0 auto;
    }
}
```

#### @content和mixins的结合用法

通过使用 `Sass` 的 `@content` 命令，你可以将整个样式代码传递给 `mixin`，`Sass` 将会在调用 `mixin` 的声明中替换这些代码块

针对不同分界点可以进行不同的样式覆盖操作。

##### 全局样式文件

```scss
scss复制代码// style/theme.scss

// 内容宽度变量
$n-width: 800px;
$l-width: 600px;
$m-width: 400px;
$s-width: 200px;

// 屏幕分界点
$width-small: 375px;
$width-medium: 768px;
$width-large: 1440px;

@mixin responsive($width) {
  @if $width == $width-large { // 769 ~ 1440
    @media only screen and (min-width: $width-medium + 1) and (max-width: $width-large) { @content; }
  }
  @else if $width == $width-medium { // 376 ~ 768
    @media only screen and (min-width: $width-small + 1) and (max-width: $width-medium) { @content; }
  }
  @else if $width == $width-small { // <= 375
    @media only screen and (max-width: $width-small) { @content; }
  }
  @else { // > 1440
    @media only screen and (min-width: $$width-large + 1) { @content; }
  }
}
```

##### 实例中使用

- `media queries`嵌套在相应选择器中使用

```scss
scss复制代码@import '../style/theme.scss';

div.demo {
  width: $n-width; // 800px
	@include responsive($width-large) {
    width: $l-width; // 600px
  }
  @include responsive($width-medium) {
     width: $m-width; // 400px
  }
  @include responsive($width-small) {
     width: $s-width; // 200px
  }
}
```

- 编译后 `css` 式 `media queries`

```css
css复制代码div.demo {
    width: 800px;
}
@media screen and (max-width: 1440px) {
    div.demo {
        width: 600px;
    }
}
@media screen and (max-width: 768px) {
    div.demo {
        width: 400px;
    }
}
@media screen and (max-width: 375px) {
    div.demo {
        width: 200px;
    }
}
```

#### 总结

- 采用嵌套媒体查询在编译后，不同元素相同媒体查询并不会进行合并，这样会使得编译后的样式文件体积变大
- 不采用嵌套媒体查询开发过程中可能并不那么直观，后期维护可能相对也不是很方便
- 在编写样式的过程中将分界点和部分值提取作为全局变量是较好的选择

个人比较喜欢 **@content 和 mixins 的结合用法** 方式，同时结合将值提取作为全局变量使用。不过在 `media queries` 的嵌套和纯 `css` 的方式，我这边还是较喜欢后者（可能是不太想构建重复的代码吧！而且其实 `css` 方式维护起来也还好）。