# 关于async/await、promise和setTimeout执行顺序

前段时间领导给我们出了一道题，关于[async](https://so.csdn.net/so/search?q=async&spm=1001.2101.3001.7020)/await、promise和setTimeout的执行顺序，网上查了查资料，这是头条的一道笔试题，记录一下，加深理解。

题目如下：

```js
async function async1() {
	console.log('async1 start');
	await async2();
	console.log('asnyc1 end');
}
async function async2() {
	console.log('async2');
}
console.log('script start');
setTimeout(() => {
	console.log('setTimeOut');
}, 0);
async1();
new Promise(function (reslove) {
	console.log('promise1');
	reslove();
}).then(function () {
	console.log('promise2');
})
console.log('script end');
```

执行结果：

```
script start
async1 start
async2
promise1
script end
asnyc1 end
promise2
setTimeOut
```

### 首先，我们先来了解一下基本概念：

### js EventLoop 事件循环机制:

**JavaScript的事件分两种，宏任务(macro-task)**和**微任务(micro-task)**

+ 宏任务：包括整体代码script，setTimeout，setInterval
+ 微任务：Promise.then(非new Promise)，process.nextTick(node中)

+ 事件的执行顺序，是先执行宏任务，然后执行微任务，这个是基础，任务可以有同步任务和异步任务，同步的进入主线程，异步的进入Event Table并注册函数，异步事件完成后，会将回调函数放入Event Queue中(宏任务和微任务是不同的Event Queue)，同步任务执行完成后，会从Event Queue中读取事件放入主线程执行，回调函数中可能还会包含不同的任务，因此会循环执行上述操作。
  

注意： setTimeOut并不是直接的把你的回掉函数放进上述的异步队列中去，而是在定时器的时间到了之后，把回掉函数放到执行异步队列中去。如果此时这个队列已经有很多任务了，那就排在他们的后面。这也就解释了为什么setTimeOut为什么不能精准的执行的问题了。setTimeOut执行需要满足两个条件：


> 1. 主进程必须是空闲的状态，如果到时间了，主进程不空闲也不会执行你的回掉函数 
> 2. 这个回掉函数需要等到插入异步队列时前面的异步函数都执行完了，才会执行 .

上面是比较官方的解释，说一下自己的理解吧：

> 了解了什么是宏任务和微任务，就好理解多了，首先执行 宏任务 => 微任务的Event Queue => 宏任务的Event Queue

promise、async/await

1. 首先，new Promise是同步的任务，会被放到主进程中去立即执行。而.then()函数是异步任务会放到异步队列中去，那什么时候放到异步队列中去呢？当你的promise状态结束的时候，就会立即放进异步队列中去了。

2. 带async关键字的函数会返回一个promise对象，如果里面没有await，执行起来等同于普通函数；如果没有await，async函数并没有很厉害是不是
3. await 关键字要在 async 关键字函数的内部，await 写在外面会报错；await如同他的语意，就是在等待，等待右侧的表达式完成。此时的await会让出线程，阻塞async内后续的代码，先去执行async外的代码。等外面的同步代码执行完毕，才会执行里面的后续代码。就算await的不是promise对象，是一个同步函数，也会等这样操作

### 步入正题：

![img](https://img-blog.csdnimg.cn/20190322161332450.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3l1bl9ob3U=,size_16,color_FFFFFF,t_70)

根据图片显示我们来整理一下流程：

1. 执行console.log('script start')，输出script start；
2. 执行setTimeout，是一个异步动作，放入宏任务异步队列中；
3. 执行async1()，输出async1 start，继续向下执行，遇到awite，将剩下的放入微任务队列；
4. 执行async2()，输出async2，并返回了一个promise对象，await让出了线程，把返回的promise加入了微任务异步队列，所以async1()下面的代码也要等待上面完成后继续执行;
5. 执行 new Promise，输出promise1，然后将resolve放入微任务异步队列；
6. 执行console.log('script end')，输出script end；
7. 到此同步的代码就都执行完成了，然后去微任务异步队列里去获取任务
8. 接下来执行resolve（async2返回的promise返回的），输出了async1 end。
9. 然后执行resolve（new Promise的），输出了promise2。
10. 最后执行setTimeout，输出了settimeout。
    

### 任务的一般执行顺序：

同步任务 --> 微任务 --> 宏任务，promise的resolve（）是同步任务，then（）里面的是异步微任务。

同步任务执行完毕才会执行微任务之后宏任务

在async中遇到await，就先执行await，把async中await后面的内容放到异步微任务队列中，等待同步任务执行完后执行

Promise是一个立即执行函数,但是它的成功(或失败:reject)的回调函数resolve却是一个异步执行的回调.当执行到resolve()时,这个任务会被放入到回调队列中,等待调用栈有空闲时事件循环再来取走它.



### **JS代码执行机制:**

1. 遇到同步代码直接执行
2. 遇到异步代码先放到一边,并且将他回调函数存起来,存的地方叫事件队列.
3. 等所有同步代码都执行完,再从事件队列中把存起来的所有异步回调函数拿出来按顺序执行.

useEffect的回调函数是[异步宏任务],在下一轮事件循环才会执行.更具JS线程与GUI渲染线程互斥原则,在JS中页面的渲染线程需要当前事件循环的宏任务与微任务都执行完,才会执行渲染线程,渲染页面后,退出渲染线程,控制权交给JS线程,再执行下一轮事件循环.

而useLayoutEffect与componentDidMount,componentDidUpdate生命周期钩子是[异步微任务],在渲染线程被调用之前就执行.这意味着回调内部执行完才会更新渲染页面,没有二次渲染问题.