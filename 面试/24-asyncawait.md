# async await异步请求

先理解同步和异步，异步和同步的区别就在于：

- 同步：会阻塞后续代码的执行
- 异步：不会阻塞代码执行

[同步和异步深入理解>>](https://blog.csdn.net/qq_42238554/article/details/115660058)

使用[async](https://so.csdn.net/so/search?q=async&spm=1001.2101.3001.7020) await进行异步处理。（它本身就是promise的一种语法糖）
await必须在async函数中，否则会报错。

# 1.深入理解await与async

### async

- async作为一个关键字放在函数的前面，表示该函数是一个异步函数，意味着该函数的执行不会阻塞后面代码的执行 异步函数的调用跟普通函数一样.
- 并且该函数默认返回一个Promise对象。

async是异步的简写，而await可以认为是async wait的简写，所以应该很好理解async用于声明一个function是异步的，而await用于等待一个异步方法执行完成。

```js
 async function asyFn(){
     return "hello";
 }
 console.log(asyFn());
 console.log("我在异步后面");

```

打印结果![在这里插入图片描述](https://img-blog.csdnimg.cn/20200819112950577.png#pic_center)

通过上面的代码可以看出函数asyFn()是先执行,函数返回的一个结果是Promise对象，要获取Promise的返回值应该使用then方法，此时我们加上then看一下效果。

```js
 async function asyFn(){
     return "hello";
 }
asyFn().then((res) => {
    console.log(res);
})
 console.log("我在异步后面");

```

打印结果：

此时我们发现，先输出的是后面那个打印文字，说明异步函数的执行没有阻塞后面的代码执行。
注：![在这里插入图片描述](https://img-blog.csdnimg.cn/20200819113407279.png#pic_center)

async的内部实现原理就是如果该函数中有一个返回值，当调用该函数时，默认会在内部调用Promise.solve() 方法把它转化成一个Promise 对象作为返回，若函数内部抛出错误，则调用Promise.reject()返回一个Promise 对象


### async起什么作用呢?

写段代码来试试，它到底会返回什么？

```js
  methods: {
    async myf1(){
      return "123"
    }
  },
  mounted() {
    this.myf1().then(function(d){
      console.log(d)
    });
  },

```

输出结果：123

分析：上面例子中，我们写了一个myf1()方法，声明它是异步的，而且它返回的是一个Promise对象，我们使用了return来返回一个值。
我们调用它，可以直接接一个then()，then里面的参数值d的值就是myf1()方法返回的值。

所以，async 函数返回的是一个 Promise 对象。从文档中也可以得到这个信息。async 函数（包含函数语句、函数表达式、Lambda表达式）会返回一个 Promise 对象，如果在函数中 return 一个直接量，async 会把这个直接量通过 Promise.resolve() 封装成 Promise 对象。

Promise.resolve(x) 可以看作是 new Promise(resolve => resolve(x)) 的简写，可以用于快速封装字面量对象或其他对象，将其封装成 Promise 实例。

# await在等什么

+ await即等待，用于等待一个Promise对象。它只能在异步函数 async function中使用，否则会报错

+ 它的返回值不是Promise对象，而是Promise对象处理之后的结果。

+ await表达式会暂停当前 async function的执行，等待Promise 处理完成。若 Promise 正常处理(fulfilled)，其回调的resolve函数参数作为 await 表达式的值，继续执行 async function，若 Promise 处理异常(rejected)，await 表达式会把 Promise 的异常原因抛出。如果 await 操作符后的表达式的值不是一个 Promise，那么该值将被转换为一个已正常处理的 Promise。
  

一般来说，都认为 await 是在等待一个 async 函数完成。不过按语法说明，await 等待的是一个表达式，这个表达式的计算结果是 Promise 对象或者其它值（换句话说，就是没有特殊限定）。

因为 async 函数返回一个 Promise 对象，所以 await 可以用于等待一个 async 函数的返回值——这也可以说是 await 在等 async 函数，但要清楚，它等的实际是一个返回值。注意到 await 不仅仅用于等 Promise 对象，它可以等任意表达式的结果，所以，await 后面实际是可以接普通函数调用或者直接量的。所以下面这个示例完全可以正确运行


```js
  methods: {
    myf1() {
      return "somethings";
    },
    async myf2() {
      return Promise.resolve("hello async");
    },
    async myf3() {
      const v1 = await this.myf1();
      const v2 = await this.myf2();
      console.log(v1, v2);
    },
  },
  mounted() {
    this.myf3();
  },

```

上述例子说明：
await 等到了它要等的东西，一个 Promise 对象，或者其它值，然后呢？我不得不先说，await 是个运算符，用于组成表达式，await 表达式的运算结果取决于它等的东西。

如果它等到的不是一个 Promise 对象，那 await 表达式的运算结果就是它等到的东西。

如果它等到的是一个 Promise 对象，await 就忙起来了，它会阻塞后面的代码，等着 Promise 对象 resolve，然后得到 resolve 的值，作为 await 表达式的运算结果。

看到上面的阻塞一词，心慌了吧……放心，这就是 await 必须用在 async 函数中的原因。async 函数调用不会造成阻塞，它内部所有的阻塞都被封装在一个 Promise 对象中异步执行。


**为什么要用async await？它与Promise相比优势在哪？**

1、不再需要多层.then方法
假设一个业务分很多步骤完成，并且每个步骤都是异步，依赖上一个步骤的结果。

```js

function takeLongTime(n){
//返回一个Promise对象
    return new Promise(resolve=>{
        setTimeout(() => {
            resolve(n+200);
        }, n);
    });
}
//创建一个方法
function step1(n){
    console.log(`step1 ${n}`);
    return takeLongTime(n);
}
//创建一个方法
function step2(n){
    console.log(`step2 ${n}`);
    return takeLongTime(n);
}
//创建一个方法
function step3(n){
    console.log(`step3 ${n}`);
    return takeLongTime(n);
}
//创建一个async方法
async function doit(){
    console.time("do");//计时
    const time1=300;
    const time2=await step1(time1);//time2获取step1调用takeLongTime返回的Promise的resolve结果
    const time3=await step2(time2);
    const re=await step3(time3);
    console.log(re);
    console.timeEnd("do");//计时结束
}
//执行方法
doit();

```

展示结果：

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200819155138705.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQyMjM4NTU0,size_16,color_FFFFFF,t_70#pic_center)

注：

+ await会阻塞代码执行，第一个await的代码执行完后，才会执行下一个await中的代码，await阻塞了后面语句的执行，等待promise确定结果后继续执行后面语句。

+ 其实之所以async声明能解决await的阻塞问题，就是因为async声明将函数作了一层promise包装，这样内部的异步操作其实就是由pending转为resolve或者reject的过程。这样函数本身就能够随意调用，函数内部的await也不会再影响到函数外部的代码执行。
  

额外讲解：

那什么叫单线程呢？？

+ 简单来说就是一次只能干一件事，一个一个排队，不能多个一起执行（因为不是多线程）
+ 标准定义：浏览器只分配给js一个主线程，用来执行任务（函数），但一次只能执行一个任务，这些任务形成一个任务队列排队等候执行，但前端的某些任务是非常耗时的，比如网络请求，定时器和事件监听，如果让他们和别的任务一样，都老老实实的排队等待执行的话，执行效率会非常的低，甚至导致页面的假死。所以，浏览器为这些耗时任务开辟了另外的线程，主要包括http请求线程，浏览器定时触发器，浏览器事件触发线程，这些任务是异步的。
  

# 注意点

await 命令后面的 Promise 对象，运行结果可能是 rejected，所以最好把 await 命令放在 try…catch 代码块中。

```js
async function myFunction() {
  try {
    await somethingThatReturnsAPromise();
  } catch (err) {
    console.log(err);
  }
}

```

另一种写法：

```js
async function myFunction() {
  await somethingThatReturnsAPromise().catch(function (err){
    console.log(err);
  });
}

```

