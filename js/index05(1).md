<!-- // 岳鹏飞
1. 左右上下居中，说出了flex,line-height,margin,position等多种方式
2. 清楚cookie localStorage sessionStorage 区别，能够在合适的情况下选择使用
3. 跨域方式，清楚cors、jsonp，能说清楚原理
4. 熟悉react, 对hooks使用相对熟练
5. eventloop原理比较清楚 -->

<!-- // 连小壮

标题
事件循环打印题

题目描述
console.log('1'); ​
setTimeout(function () { ​
    console.log('2'); ​
    new Promise(function (resolve) { ​
        console.log('3'); ​
        resolve(); ​
    }).then(function () { ​
        console.log('4'); ​
    }); ​
}); ​

new Promise(function (resolve) { ​
    console.log('5'); ​
    resolve(); ​
}).then(function () { ​
    console.log('6'); ​
}); ​
setTimeout(function () { ​
    console.log('7'); ​
    new Promise(function (resolve) { ​
        console.log('8'); ​
        resolve(); ​
    }).then(function () { ​
        console.log('9'); ​
    }); ​
});  -->


<!-- 标题
instanceof、type区别

题目描述
instanceof、type区别？ 手写myInstanceof 函数，使  myInstanceof(A, B); -->

<!-- 标题
用flex布局实现左侧100px右侧自适应布局

题目描述
<div class='parent'>​
<div class="left">​

</div>​
<div class="right">​

</div>​
</div> -->

<!-- 标题
节流防抖和应用

题目描述
-- -->


<!-- 标题
简述es6中的Set和Map

题目描述
哪些场景会用到Set？weakMap？ -->


<!-- 标题
简述深拷贝

题目描述
let temp = {​
fn: function(){},​
count: 20,​
loop: temp,​
} -->


<!-- 标题
算法：有效括号

题目描述
给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串 s ，判断字符串是否有效。​

有效字符串需满足：​
左括号必须用相同类型的右括号闭合。​
左括号必须以正确的顺序闭合。​
每个右括号都有一个对应的相同类型的左括号。​
 ​
示例 1：​
输入：s = "()"​
输出：true​

示例 2：​
输入：s = "()[]{}"​
输出：true​

示例 3：​
输入：s = "(]"​
输出：false -->