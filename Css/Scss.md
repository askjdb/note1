# 【SCSS】常用的SCSS语法

CSS 预处理器用一种专门的编程语言，进行 Web 页面样式设计，然后再编译成正常的 CSS 文件，以供项目使用。CSS 预处理器为 CSS 增加一些编程的特性，无需考虑浏览器的兼容性问题”Sass 是采用 Ruby 语言编写的一款 CSS 预处理语言

Sass 和 SCSS 其实是同一种东西，我们平时都称之为 Sass，两者之间不同之处有以下两点： 文件扩展名不同，Sass 是以“.sass”后缀为扩展名，而 SCSS 是以“.scss”后缀为扩展名 语法书写方式不同，Sass 是以严格的缩进式语法规则来书写，不带大括号({})和分号(;)，而 SCSS 的语法书写和我们的 CSS 语法书写方式非常类似

做一下对比

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bd10007ee21a44e988afe092aff50684~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp?)

```
单文件编译
sass <要编译的Sass文件路径>/style.scss:<要输出CSS文件路径>/style.css

多文件编译：
sass sass/:css/ 表示将项目中“sass”文件夹中所有“.scss”(“.sass”)文件编译成“.css”文件，
并且将这些 CSS 文件都放在项目中“css”文件夹中

sass --watch <要编译的Sass文件路径>/style.scss:<要输出CSS文件路径>/style.css开启“watch”功能，
这样只要你的代码进行任保修改，都能自动监测到代码的变化，并且给你直接编译出来：
```

## 1.四种输出方式

```
嵌套输出方式 nested
展开输出方式 expanded  
紧凑输出方式 compact 
压缩输出方式 compressed
```

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f949a8998ec847c390e860e45a81744a~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp?)

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/182e72492d1e47538aca4fffdcfdd6b6~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp?)

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/45ece9b0ca844ae2b8c06520ea706383~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp?)

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2fdc14e52b90485d8fa8fa8810daa693~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp?)

## 2.嵌套

(1) 选择器嵌套

```css
#css
nav a {
  color:red;
}
header nav a {
  color:green;
}
复制代码
#scss
nav {
  a {
    color: red;
    header & {
      color:green;
    }
  }  
}
复制代码
```

(2)属性嵌套

```css
#css
.box {
    border-top: 1px solid red;
    border-bottom: 1px solid green;
}
复制代码
#scss
.box {
  border: {
   top: 1px solid red;
   bottom: 1px solid green;
  }
}
复制代码
```

(3)伪类嵌套

```css
.clearfix{
    &:after {
        clear:both;
        overflow: hidden;
    }
}
```

## 3.变量

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/94bc768126b644e7941e79746ca5ab20~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp?)

定义之后可以在`全局范围内使用`。在选择器、函数、混合宏...的外面定义的变量为全局变量。 如果值后面加上`!default`则表示默认值。

> $btn-primary-color : #fff !default;

sass 的默认变量一般是用来设置默认值，然后根据需求来覆盖的，覆盖的方式也很简单，只需要`在默认变量之前重新声明下`变量即可。

```css
$baseLineHeight: 2;
$baseLineHeight: 1.5 !default;
# 注意先后顺序
```

```css
em {
  $color: red;//定义局部变量
  a {
    color: $color;//调用局部变量
  }
}
```

#### 数据类型

在 Sass 中包含以下几种数据类型：

- 数字: 如，1、 2、 13、 10px；
- 字符串：有引号字符串或无引号字符串，如，"foo"、'bar'、baz；
- 布尔型：如，true、 false；
- 空值：如，null；
- 值列表：`用空格或者逗号分开，`如，1.5em 1em 0 2em 、 Helvetica, Arial, sans-serif。
- 颜色：如，blue、 #04a3f9、 rgba(255,0,0,0.5)；

**（1）字符串**
 SassScript 支持 CSS 的两种字符串类型：

- 有引号字符串 (quoted strings)
- 无引号字符串 (unquoted strings) 在编译 CSS 文件时不会改变其类型。只有一种情况例外，使用 #{ }插值语句 (interpolation) 时，有引号字符串将被编译为无引号字符串。

**（2）值列表**
 事实上，独立的值也被视为值列表——只包含一个值的值列表。 可以用 () 表示空的列表，这样不可以直接编译成 CSS，比如编译 font-family: ()时，Sass 将会报错。如果值列表中包含空的值列表或空值，编译时将清除空值，比如 1px 2px () 3px 或 1px 2px null 3px。

## 4. 混合宏

#### 声明混合宏

在 Sass 中，使用“`@mixin`”来声明一个混合宏。

- 不带参数混合宏

```scss
@mixin border-radius{
    border-radius: 5px;
}
```

- 带参数混合宏

```scss
# 带值参数
@mixin border-radius($radius:5px){
    border-radius: $radius;
}
# 不带值参数
@mixin border-radius($radius){
    border-radius: $radius;
}
# 带多个参数
@mixin center($width,$height){
  width: $width;
  height: $height;
  margin-top: -($height) / 2;
  margin-left: -($width) / 2;
}
```

带特别多参数混合宏：

有一个特别的参数“…”。当混合宏传的参数过多之时，可以使用参数来替代

```scss
# 带特别多参数
@mixin box-shadow($shadows...){
  @if length($shadows) >= 1 {
    -webkit-box-shadow: $shadows;
    box-shadow: $shadows;
  } @else {
    $shadows: 0 0 2px rgba(#000,.25);
    -webkit-box-shadow: $shadow;
    box-shadow: $shadow;
  }
}
```

#### 调用混合宏

匹配了一个关键词“`@include`”来调用声明好的混合宏

````scss
button {
  @include border-radius;
}
.box {
  @include border-radius(3px);
}
.box-center {
  @include center(500px,300px);
}
.box {
  @include box-shadow(0 0 1px rgba(#000,.5),0 0 2px rgba(#000,.2));
}
````

混合宏在实际编码中给我们带来很多方便之处，特别是对于复用重复代码块。但其最大的不足之处是会生成冗余的代码块。比如在不同的地方调用一个相同的混合宏时，不能将两个合成并集形式。

## 4.继承

在 Sass 中是通过关键词 “`@extend`”来继承已存在的类样式块，从而实现代码的继承。

```css
.btn {
  border: 1px solid #ccc;
  padding: 6px 10px;
  font-size: 14px;
}
.btn, .btn-primary, .btn-second {
  border: 1px solid #ccc;
  padding: 6px 10px;
  font-size: 14px;
}
.btn-primary {
  background-color: #f36;
  color: #fff;
}
.btn-second {
  background-clor: orange;
  color: #fff;
}
```

写成继承的形式

```scss
.btn-primary {
  background-color: #f36;
  color: #fff;
  @extend .btn;
}
.btn-second {
  background-color: orange;
  color: #fff;
  @extend .btn;
}
```

从示例代码可以看出，在 Sass 中的继承，可以继承类样式块中所有样式代码，而且编译出来的 CSS 会将选择器合并在一起，形成组合选择器.

## 5.占位符 %placeholder

Sass 中的占位符 `%placeholder` 功能是一个很强大，很实用的一个功能，。他可以取代以前 CSS 中的基类造成的代码冗余的情形。因为 %placeholder 声明的代码，如果不被 @extend 调用的话，不会产生任何代码 这段代码没有被 @extend 调用，他并没有产生任何代码块，只是静静的躺在你的某个 SCSS 文件中。只有通过 @extend 调用才会产生代码

```scss
%mt5 {
  margin-top: 5px;
}
.btn {
  @extend %mt5;
}
.block {
  @extend %mt5;
}
```

通过 @extend 调用的占位符，编译出来的代码会将相同的代码合并在一起.

```scss
.btn, .block {
  margin-top: 5px;
}
```

## 6. 混合宏VS继承VS占位符

如果你的代码块中涉及到变量，建议使用混合宏来创建相同的代码块。
 如果你的代码块不需要专任何变量参数，而且有一个基类已在文件中存在，那么建议使用 Sass 的继承。
 占位符是独立定义，不调用的时候是不会在 CSS 中产生任何代码；                             继承是首先有一个基类存在，不管调用与不调用，基类的样式都将会出现在编译出来的 CSS 代码中。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/86d85aa8d1cb43e9a15802e46d93ce98~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp?)

## 7.基础语法

#### 插值#{}

（1）构建一个选择器

```swift
@mixin generate-sizes($class, $small, $medium, $big) {
    .#{$class}-small { font-size: $small; }
    .#{$class}-medium { font-size: $medium; }
    .#{$class}-big { font-size: $big; }
}
@include generate-sizes("header-text", 12px, 20px, 40px);
复制代码
```

(2) 属性变量

```swift
$properties: (margin, padding);
@mixin set-value($side, $value) {
    @each $prop in $properties {
        #{$prop}-#{$side}: $value;
    }
}
.login-box {
    @include set-value(top, 14px);
}
复制代码
```

> @mixin中插值不能作为赋值语句的值部分，只能用做属性名定义或者选择器构建时@include中不能使用插值

#### 注释

1、类似 CSS 的注释方式，使用 ”/* ”开头，结属使用 ”*/ ” 2、类似 JavaScript 的注释方式，使用“//” 两者区别，前者会在编译出来的 CSS 显示，`后者在编译出来的 CSS 中不会显示`

#### 加减法

在变量或属性中都可以做加法运算，但对于携带不同类型的单位时，在 Sass 中计算会报错

```arduino
.content {
  width: $full-width - $sidebar-width;
}
复制代码
```

#### 乘法

Sass 中的乘法运算也能够支持多种单位（比如 em ,px , %），`但当一个单位同时声明两个值时会有问题` `只能有一个值带单位`

```css
# 编译的时候报“20px*px isn't a valid CSS value.”错误信息。
.box {
  width:10px * 2px;  
}
复制代码
# 正确的写法
.box {
  width: 10px * 2;
}
复制代码
```

在运算中有不同类型的单位时，也将会报错。

#### 除法

如果数值或它的任意部分是存储在一个变量中或是函数的返回值。
 •    如果数值被圆括号包围。
 •    如果数值是另一个数学表达式的一部分

> 在除法运算时，如果两个值带有相同的单位值时，除法运算之后会得到一个不带单位的数值

```css
.box {
  width: (1000px / 100px);
}
编译后
.box {
  width: 10;
}
复制代码
```

#### 颜色运算

```css
p {
  color: #010203 + #040506;
}
# 计算公式为 01 + 04 = 05、02 + 05 = 07 和 03 + 06 = 09，
p {
  color: #010203 * 2;
}
# 计算公式为 01 * 2 = 02、02 * 2 = 04 和 03 * 2 = 06
复制代码
```

#### 字符串运算

在 Sass 中可以通过加法符号“+”来对字符串进行连接。除了在变量中做字符连接运算之外，还可以直接通过 +，把字符连接在一起。

```css
div {
  cursor: e + -resize;
}
编译后
div {cursor: e-resize;}
复制代码
```

注意，如果有引号的字符串被添加了一个没有引号的字符串 （也就是，带引号的字符串在 + 符号左侧）， 结果会是一个有引号的字符串。 同样的，如果一个没有引号的字符串被添加了一个有引号的字符串 （没有引号的字符串在 + 符号左侧）， 结果将是一个没有引号的字符串。

#### @if

`@if` 指令是一个 SassScript，它可以根据条件来处理样式块，如果if后面的条件为 true 返回一个样式块，反之 false 返回另一个样式块。在 Sass 中除了 @if 之，还可以配合 `@else if` 和 `@else` 一起使用。

```less
@mixin blockOrHidden($boolean:true) {
  @if $boolean {
      display: block;
    }
  @else {
      display: none;
    }
}
.block {
  @include blockOrHidden;
}
.hidden{
  @include blockOrHidden(false);
}
复制代码
```

#### @for

```less
@for $i from <start> through <end>
@for $i from <start> to <end>
复制代码
```

这两个的区别是关键字 `through` 表示包括 end 这个数，而` to` 则不包括 end 这个数

```less
@for $i from 1 through 3 {
  .item-#{$i} { width: 2em * $i; }
}
复制代码
```

#### @while循环

`@while` 指令也需要 SassScript 表达式（像其他指令一样），并且会生成不同的样式块，直到表达式值为 false 时停止循环。

```bash
@while $types > 0 {
    .while-#{$types} {
        width: $type-width + $types;
    }
    $types: $types - 1;
}
复制代码
```

#### @each循环

`@each `循环就是去遍历一个列表，然后从列表中取出对应的值。 @each 循环指令的形式：

```less
@each $var in <list>
$list: adam john wynn mason kuroir;
@mixin author-images {
    @each $author in $list {
        .photo-#{$author} {
            background: url("/images/avatars/#{$author}.png") no-repeat;
        }
    }
}
.author-bio {
    @include author-images;
}
复制代码
```

#### 字符串函数

- `unquote()`函数，删除字符串中的引号；unquote( ) 函数只能删除字符串`最前和最后`的引号（双引号或单引号），而无法删除字符串中间的引号。如果字符没有带引号，返回的将是字符串本身
- `quote($string)`：给字符串添加引号，如果`字符串自身带有引号（单引号）会统一换成双引号 ""`
- `To-upper-case()` 函数将字符串小写字母转换成大写字母
- `To-lower-case()` 函数 与 To-upper-case() 刚好相反，将字符串转换成小写字母

#### 数字函数

- `percentage()`函数主要是将一个不带单位的数字转换成百分比形式：

> percentage(2px / 10px)-----20% 参数可以是个表达式

- `round()` 函数可以将一个数四舍五入为一个最接近的整数

> round(2.2%)   参数可以为表达式 2%
>  round(3.9em)         4em

- `ceil()` 向上取整 参数可以为表达式

> ceil(2.3px)            3px         ceil(2.3%)            3%

- `floor()` 函数  向下取整
- `abs( )` 函数会返回一个数的绝对值
- `max() /min()` 函数功能主要是在多个数之中找到最大/最小的一个，这个函数可以设置任意多个参数.不过在 min() 函数中同时出现两种不同类型的单位，将会报错误信息.min(1px,1em)
- `random()` 函数是用来获取一个随机数；

> random()       0.03886

#### 列表函数

- `length()` 函数主要用来返回一个列表中有几个值，简单点说就是返回列表清单中有多少个值：

> length(10px 20px (border 1px solid) 2em)     4
>  length() 函数中的列表参数之间使用空格隔开，不能使用逗号，否则函数将会出错

- `nth()`函数

> nth($list,$n)
>  nth() 函数用来指定列表中某个位置的值。
>  不过在 Sass 中，nth() 函数和其他语言不同，1 是指列表中的第一个标签值，2 是指列给中的第二个标签值，依此类推
>  注：在 nth($list,$n) 函数中的 $n 必须是大于 0 的整数

- `join()` 函数是将两个列表连接合并成一个列表。

> join(10px 20px, 30px 40px)
>  join((blue,red),(#abc,#def))
>  不过 join() 只能将两个列表连接成一个列表，如果直接连接两个以上的列表将会报错.
>  但很多时候不只碰到两个列表连接成一个列表，这个时候就需要将多个 join() 函数合并在一起使用：
>  嵌套join((blue red), join((#abc #def),(#dee #eff)))

> 在 join() 函数中还有一个很特别的参数 $separator，这个参数主要是用来给列表函数连接列表值是，使用的分隔符号，默认值为 auto。
>  join() 函数中 $separator 除了默认值 auto 之外，还有 comma 和 space 两个值，其中 comma 值指定列表中的列表项值之间使用逗号（,）分隔，space 值指定列表中的列表项值之间使用空格（ ）分隔。 在 join() 函数中除非明确指定了 $separator值，否则将会有多种情形发生：如果列表中的第一个列表中每个值之间使用的是逗号（,），那么 join() 函数合并的列表中每个列表项之间使用逗号,分隔；
>  但当第一个列表中只有一个列表项，那么 join() 函数合并的列表项目中每个列表项目这间使用的分隔符号会根据第二个列表项中使用的，如果第二列表项中使用是,分隔，则使用逗号分隔；如果第二列项之间使用的空格符，则使用空格分隔

- `append()`函数 是用来将某个值插入到列表中，并且处于最末位

> > append(10px 20px ,30px)     =>   (10px 20px 30px)
> >  append((10px,20px),30px)    =>   (10px, 20px, 30px)
> >  如果列表只有一个列表项时，那么插入进来的值将和原来的值会以空格的方式分隔。 如果列表中列表项是以空格分隔列表项，那么插入进来的列表项也将以空格分隔；
> >  如果列表中列表项是以逗号分隔列表项，那么插入进来的列表项也将以逗号分隔。 当然，在 append() 函数中，可以显示的设置 $separator 参数，
> >  如果取值为 comma 将会以逗号分隔列表项
> >  如果取值为 space 将会以空格分隔列表项
> >  append((blue, green),red,comma)

- `zip()`函数,将多个列表值转成一个多维的列表

> zip(1px 2px 3px,solid dashed dotted,green blue red)
>  => ((1px "solid" #008000), (2px "dashed" #0000ff), (3px "dotted" #ff0000)) 在使用zip()函数时，每个单一的列表个数值必须是相同的 *****等分

- `index()`函数,类似于索引一样，主要让你找到某个值在列表中所处的位置

> 在 index() 函数中，如果指定的值不在列表中（没有找到相应的值），那么返回的值将是 false， 从1开始。

#### Introspection函数

- `type-of($value)`：返回一个值的类型number 为数值型。string 为字符串型。bool 为布尔型。color 为颜色型.
   `unit($number)`：返回一个值的单位，unit() 函数主要是用来获取一个值所使用的单位，碰到复杂的计算时，其能根据运算得到一个“多单位组合”的值，不过只充许乘、除运算.
   `unitless($number)`：判断一个值是否带有单位，unitless() 函数相对来说简单明了些，只是用来判断一个值是否带有单位，如果不带单位返回的值为 true，带单位返回的值为 false；
   `comparable($number-1, $number-2)`：判断两个值是否可以做加、减和合并，comparable() 函数主要是用来判断两个数是否可以进行“加，减”以及“合并”。如果可以返回的值为 true，如果不可以返回的值是 false， comparable(2cm,1cm)         true

#### Miscellaneous函数   三元条件函数

他有两个值，当条件成立返回一种值，当条件不成立时返回另一种值 `if($condition,$if-true,$if-false)` 上面表达式的意思是当 $condition 条件成立时，返回的值为 $if-true，否则返回的是 $if-false 值；

#### Map

Sass 的 map 常常被称为数据地图，也有人称其为数组，因为他总是以 key:value 成对的出现，但其`更像是一个 JSON 数据`。 首先有一个类似于 Sass 的变量一样，用个 `$ `加上命名空间来声明 map。后面紧接是一个小括号 `()`，将数据以 `key:value `的形式赋予，其中 key 和 value 是成对出现，并且每对之间使用逗号 (,) 分隔，其中最后一组后面没有逗号。 对于 Sass 的 map，还可以让` map 嵌套 map`。其实就是 map 的某一个 key 当成 map，里面可以继续放一对或者多对 key:value；

```yaml
$map: (
    key1: value1,
    key2: (
        key-1: value-1,
        key-2: value-2,
    ),
    key3: value3
);
复制代码
```

- Maps的函数-map-get($map,$key) map-get($map,$key) 函数的作用是根据 $key 参数，返回 $key 在 $map 中对应的 value 值。如果 $key 不存在 $map中，将返回 null 值。
- Sass Maps的函数-map-has-key($map,$key) map-has-key($map,$key) 函数将返回一个布尔值。当 $map 中有这个 $key，则函数返回 true，否则返回 false

```perl
@if map-has-key($social-colors,facebook){
复制代码
```

- Sass Maps的函数-map-keys($map) map-keys($map) 函数将会返回 $map 中的所有 key。这些值赋予给一个变量，那他就是一个列表。

```perl
\$list: map-keys(\$social-colors)
\$list:"dribble","facebook","github","google","twitter";

@for \$i from 1 through length(map-keys(\$social-colors)){
@each \$name in map-keys(\$social-colors){
复制代码
```

- Sass Maps的函数-map-values($map)、map-merge($map1,$map2)
- map-values($map )获取的是 $map 的所有 value 值
- map-merge($map1,$map2) 函数是将 $map1 和 $map2 合并，然后得到一个新的 $map。如果你要快速将新的值插入到 $map 中的话，这种方法是最佳方法.
- Sass Maps的函数-map-remove($map,$key)、keywords($args)
- map-remove($map,$key) 函数是用来删除当前 $map 中的某一个 $key，从而得到一个新的 map。其返回的值还是一个 map。他并不能直接从一个 map 中删除另一个 map，仅能通过删除 map 中的某个 key 得到新 map
- keywords($args) 函数
- keywords($args) 函数可以说是一个动态创建 map 的函数。可以通过混合宏或函数的参数变创建 map。参数也是成对出现，其中 $args 变成 key(会自动去掉$符号)，而 $args 对应的值就是value。

```less
@mixin map($args...){
    @debug keywords($args);
}
@include map(
  $dribble: #ea4c89,
  $facebook: #3b5998,
  $github: #171515,
  $google: #db4437,
  $twitter: #55acee
);
复制代码
```

#### @import

Sass 扩展了 CSS 的 @import 规则，让它能够引入 SCSS 和 Sass 文件。 所有引入的 SCSS 和 Sass 文件都会被合并并输出一个单一