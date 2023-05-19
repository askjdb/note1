// 李泽琦
<!-- 单位px、em、rem、vh的区别✅
定位方式✅
布局方式✅inline-block
flex 属性✅ 子容器属性❌ grid的区别✅
水平垂直居中方式✅
js数据类型 判断类型✅
闭包✅
内存回收机制❌
react和vue区别✅
主要使用vue2较多 -->

<!-- 题目描述
async function async1() {​
    console.log('async1 start')​
    await async2()​
    console.log('async1 end')​
}​
async function async2() {​
    console.log('async2')​
}​
console.log('script start')​
setTimeout(function () {​
    console.log('settimeout')​
})​
async1()​
new Promise(function (resolve) {​
    console.log('promise1')​
    resolve()​
}).then(function () {​
    console.log('promise2')​
})​
console.log('script end') -->



<!-- 标题
合并有序数组

题目描述
给出一个有序的整数数组 A 和有序的整数数组 B ，请将数组 B 合并到数组 A 中，变成一个有序的升序数组​

数据范围： 0≤n,m≤100，∣Ai∣<=100， ∣Bi∣<=100​

注意：​
1.保证 A 数组有足够的空间存放 B 数组的元素， A 和 B 中初始的元素数目分别为 m 和 n，A的数组空间大小为 m+n​
2.不要返回合并的数组，将数组 B 的数据合并到 A 里面就好了，且后台会自动将合并后的数组 A 的内容打印出来，所以也不需要自己打印​
3. A 数组在[0,m-1]的范围也是有序的​

示例​
输入：[4,5,6],[1,2,3]​
返回值：[1,2,3,4,5,6] -->


// 徐和言
<!-- 标题
布局题 3个子元素

题目描述
用 html+css 实现如下布局：​
父元素宽度未知，三个子元素默认间距30px, 但当父元素不够宽时，三个子元素的间距会自动缩小​



​
​
<div class="parent">​
    <div class="child a">A</div>​
    <div class="child b">B</div>​
    <div class="child c">C</div>​
</div>​​​
​
​
.parent{​
    background: grey;​
    width: 100%;​
    height: 100px;​
}​

.child{​
    background: red;​
    width: 50px;​
    height: 50px;​
} -->





<!-- 标题
F. 算法 大数组中移除小数组

题目描述
语言：js或ts​

有两个数组，想要从大数组中移除最少数量的元素，使得两个数组不再有交集。返回改变后的大数组。​
例：​
大：[1, 3, 4, 2, 5, 6, 7, 8, 9]​
小：[13, 2, 3, 5, 7]​
结果:  [1, 4, 6, 8, 9]​

时间复杂度尽量低 -->


<!-- 标题
C. 布局题 4:3

题目描述
用 html+css 实现一个容器，其宽高比恒为 4:3（容器的宽度为100%，但其父元素宽度不确定），容器中心有一行内容的不固定的水平垂直居中的文字 -->