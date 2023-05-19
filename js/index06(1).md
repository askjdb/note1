<!-- // 徐强
标题
三列布局

题目描述
左右宽度100px,整个高度300px，中间宽度自适应
```
 <div class="root">
    <div class="left">left</div>
    <div class="center">center</div>
    <div class="right">right</div>
  </div>
  ``` -->

  <!-- 标题
作用域

题目描述
```
var value = 1;
function foo() {
    console.log(value);
}
function bar() {
    var value = 2;
    foo();
}
bar();
``` -->


<!-- 标题
原型链 

题目描述
```
Function.prototype.a = () => {
  console.log(1);
}
Object.prototype.b = () => {
  console.log(2);
}
function A() {}
const a = new A();

a.a();
a.b();
A.a();
A.b();
``` -->
<!-- 答案:
```
a.__proto__ => A.prototype => A.prototype.__ptoto__ => Object.prototype
a => A.prototype => Object.prototype => null
A => Function.prototype => Object.prototype => null

// 报错 
// 2
// 1
// 2
``` -->

<!-- 标题
事件循环

题目描述
```
new Promise(function (resolve, reject) {
  console.log(1);
  resolve();
}).then(function () {
  console.log(2);
}).then(function () {
  console.log(3);
});

setTimeout(function () {
  console.log(4)
}, 0);

new Promise(function (resolve, reject) {
  console.log(5);
  resolve();
}).then(function () {
  console.log(6);
})

console.log(7);
``` -->

<!-- 标题
遍历树

题目描述
```
const tree = {
  value: 1,
  children: [
    {
      value: 2,
      children: [
        {
          value: 3,
          children: [],
        },
      ],
    },
    {
      value: 4,
      children: [
        {
          value: 5,
          children: [],
        },
      ],
    },
    {
      value: 6,
      children: [],
    },
  ]
}
``` -->

<!-- 答案:
```
const traveral = (tree) => {
    let node = tree;
    console.log(node.value);
    if(node.children.length){
        node.children.forEach(n => {
            traveral(n);
        })
    }
}


const traveralTwo = (tree) => {
    // let nodes = [];
    let stack = [];
    if(tree){
        stack.push(tree);
        while(stack.length){
            let item = stack.shift();
            console.log(item.value);
            let children = item.children || [];
            // nodes.push(item);
            for(let i=0;i< children.length;++i){
                stack.push(children[i]);
            }
            // stack.push(...children);
        }
    }
    // return nodes;
}

traveralTwo(tree);
``` -->



<!-- // 王娟娟
Q4. 防抖和节流的区别
     回答的挺清楚的
Q5: websocket和http 的区别
     websocket是不是有状态的连接回答错误，301/302/304区别回答正确
Q6:  vue和react的区别，react hooks
  区别回答了几点，jsx原理不知道，useCallback和useMemo的区别回答正确
Q7: cookie 和token 的区别
  回答听清楚的 -->

  <!-- 标题
无重复字符的最长子串

题目描述
给定一个字符串 s ，请你找出其中不含有重复字符的 最长子串 的长度。​

示例1：​
输入: s = "abcabcbb"​
输出: 3 ​
解释: 因为无重复字符的最长子串是 "abc",所以长度为3​

tips:​
0 <= s.length <= 5 * 104​
s 由英文字母、数字、符号和空格组成 -->



<!-- 标题
react 

题目描述
```
// 点击Father组件的div，Child会打印Child吗 
function Child() {
  console.log('Child');
  return <div>Child</div>;
}
    
    
function Father(props) {
  const [num, setNum] = React.useState(0);
  return (
    <div onClick={() => {setNum(num + 1)}}>
      {num}
      {props.children}
    </div>
  );
}
    
    
function App() {
  return (
    <Father>
      <Child/>
    </Father>
  );
}
    
const rootEl = document.querySelector("#root");
ReactDOM.render(<App/>, rootEl);
``` -->

