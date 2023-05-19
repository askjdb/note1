// 邱文斌  主做vue开发
<!-- 标题
求多个数组之间的交集

题目描述
求多个数组之间的交集​

例：​
func([1,2,2,1],[2,2],[2,2,4],[2])​
// log-> 2​

​
```
function intersect(..args){​
// 边界处理,  length ===0 / ===1​
    //filter / reduce​

return args.reduce((result, arg)=>{​
return result.filter(item => arg.includes(item))​
})​
}
``` -->


<!-- 标题
请把俩个数组 [A1, A2, B1, B2, C1, C2, D1, D2] 和 [A, B, C, D]，合并为 [A1, A2, A, B1, B2, B, C1, C2, C, D1, D2, D]

题目描述
请把俩个数组 [A1, A2, B1, B2, C1, C2, D1, D2] 和 [A, B, C, D]，合并为 [A1, A2, A, B1, B2, B, C1, C2, C, D1, D2, D] -->



<!-- 标题
有以下 3 个判断数组的方法，请分别介绍它们之间的区别和优劣 

题目描述
Object.prototype.toString.call() 、 instanceof 以及 Array.isArray() -->


<!-- 标题
输出结果

题目描述
var b = 10;​
(function b(){​
    b = 20;​
    console.log(b); ​
})();​
执行上下文、作用域：变量作用域or函数作用域、闭包​
challenge:​
改造一下分别输出10 和 20 -->



<!-- 标题
Virtual DOM 真的比操作原生 DOM 快吗？谈谈你的想法

题目描述
-- -->


<!-- 标题
Vue中的computed是如何实现的

题目描述
-- -->


<!-- 标题
Vue 谈一谈 nextTick 的原理

题目描述
-- -->



<!-- 标题
Promise 构造函数是同步执行还是异步执行，那么 then 方法呢？

题目描述
宏微任务​

执行顺序​

宏微任务执行顺序 / event Loop -->
