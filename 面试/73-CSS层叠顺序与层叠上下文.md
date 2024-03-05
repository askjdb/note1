# CSS层叠顺序与层叠上下文

## 前言

层叠顺序和层叠上下文是两个概念，但它们又有着密不可分的关系，层叠顺序很简单，认真思考即可

在考虑到两个元素可能重合的情况下，W3C提出了层叠这个概念，层叠是指如何去层叠另一个元素，比如两个元素重合的时候应该让谁在前面，谁在后面。那它们的规则又是什么？

## **层叠顺序**

**当两个元素都是块级元素时，默认情况越后面的元素层级越高**

这里为了效果就不使用 绝对定位了

```html
<style>
	div{
		width:100px;
		height:100px;
	}
	.box1{
		color:red;
		background:#00FFFF;
	}
	.box2{
		margin-top:-100px;
		background:#20aa5e;
	}
</style>

<body>
	<div class="box1">box1</div>
	<div class="box2">box2</div>
</body>
```

![动图封面](https://pic4.zhimg.com/v2-d80d1f08f7cfd23673b57c708f1a4213_b.jpg)



这里可以看到 box2 把 box1 给盖住了，说明越后面的元素层级越高，另外 box1 的文字还是隐隐约约的可以看到，这说明了背景的层级比文字小。

**当两个元素为行内块时**

```html
<style>
	div{
		width:100px;
		height:100px;
		display: inline-block;
	}
	.box1{
		color:red;
		background:#00FFFF;
	}
	.box2{
		margin-left:-105px;
		background:#20aa5e;
	}
</style>

<body>
	<div class="box1">box1</div>
	<div class="box2">box2</div>
</body>
```

![动图封面](https://pic2.zhimg.com/v2-7ce6193066372d526e79a3970468f8ed_b.jpg)



这里可以看到也是后一个元素的层级比前一个元素的层级高，不过和两个块级元素不同的是行内块元素的背景层级比文字高。

**当两个元素为行内元素时**

```html
<style>
	div{
		width:100px;
		height:100px;
		display: inline;
	}
	.box1{
		color:red;
		background:#00FFFF;
	}
	.box2{
		margin-left:-43px;
		background:#20aa5e;
	}
</style>

<body>
	<div class="box1">box1</div>
	<div class="box2">box2</div>
</body>
```

![动图](https://pic2.zhimg.com/v2-ece0c85d27af47e916746c5d922a7b89_b.webp)



这里也可以看到和行内块的行为一样，背景层级比文字高，并且也是后一个元素比前一个元素层级高。

## **小总结**

> 当两个元素为正常流时，默认情况下后一个元素比前一个元素层级高，并且允许后面的元素透上来。
> 如果两个元素是块级元素，文字比背景层级高（因此不管是否设置背景文字始终会透上来）。
> 如果是行内或行内块，背景比文字层级高（因此只要设置背景，后一个元素将透不上来）。

## **层叠上下文**

在HTML中有一个三维概念，也就是我们面向电脑屏幕的这一端为Z轴。

![img](https://pic4.zhimg.com/80/v2-87c158e5ef77fac335355619c36eee6b_720w.webp)

而凡是拥有层叠上下文的元素，将离用户最近，也就是越靠在Z轴前面。默认情况下只有根元素`HTML`会产生一个层叠上下文，并且元素一旦使用了一些属性也将会产生一个层叠上下文，如我们常用的定位属性。如两个层叠上下文相遇时，总是后一个层叠前一个，除非使用z-index来改变。

```html
<style>
	.box1{
		width:100px;
		height:100px;
		background:#008000;
	}
	.box1 .item{
		position:relative;
		left: 50px;
		height:100px;
		background: #0077AA;
	}
	.box2{
		margin-top:-50px;
		margin-left: 10px;
		width:100px;
		height:100px;
		background:#00FFFF;
	}
</style>

<body>
	<div class="box1">绿色box1
		<div class="item">定位</div>
	</div>
	<div class="box2">青蓝色box2</div>
</body>
```

![img](https://pic4.zhimg.com/80/v2-d5e1319ddd0c13b9591ffbd2f7655a93_720w.webp)

这里我们可以看到当我们使用定位属性后将会产生一个层叠上下文。虽然item产生了一个层叠上下文，但并不影响它父元素。它的父元素依然被box2层叠了。

除了定位元素可以创建层叠上下文以外，还有如下几个属性也可以做到：

- 根元素 (HTML),
- z-index 值不为 "auto"的 绝对/相对定位，
- 一个 z-index 值不为 "auto"的 flex 项目 (flex item)，即：父元素 display: flex|inline-flex，
- opacity 属性值小于 1 的元素
- transform 属性值不为 "none"的元素，
- mix-blend-mode 属性值不为 "normal"的元素，
- filter值不为“none”的元素，
- perspective值不为“none”的元素，
- isolation 属性被设置为 "isolate"的元素，
- position: fixed
- 在 will-change 中指定了任意 CSS 属性，即便你没有直接指定这些属性的值
- -webkit-overflow-scrolling 属性被设置 "touch"的元素

## **总结**

> 创建了层叠上下文的元素比其他元素层级高。
> 两个层叠上下文相遇时，后一个层级高。如果想改变层级可以使用z-index