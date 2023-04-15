## 1. async/await是什么？

async/await其实是Promise的语法糖，它能实现的效果都能用then链来实现，这也和我们之前提到的一样，它是为优化then链而开发出来的。从字面上来看，async是“异步”的简写，await译为等待，所以我们很好理解async声明function是异步的，await等待某个操作完成。当然语法上强制规定await只能出现在asnyc函数中，我们先来看看async函数返回了什么： 

```js
async function testAsy(){
   return 'hello world';
}
let result = testAsy(); 
console.log(result)
```

![img](https://img2018.cnblogs.com/blog/900566/201903/900566-20190305111634765-1348673175.png)

这个async声明的异步函数把return后面直接量通过Promise.resolve()返回Promise对象，所以如果这个最外层没有用await调用的话，是可以用原来then链的方式来调用的：

```js
async function testAsy(){
   return 'hello world'
}
let result = testAsy() 
console.log(result)
result.then(v=>{
    console.log(v)   //hello world
})
```

联想一下Promise特点——异步无等待，所以当没有await语句执行async函数，它就会立即执行，返回一个Promise对象，非阻塞，与普通的Promise对象函数一致。

重点就在await，它等待什么呢？

按照[语法说明](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/await)，await等待的是一个Promise对象，或者是其他值（也就是说可以等待任何值），如果等待的是Promise对象，则返回Promise的处理结果；如果是其他值，则返回该值本身。并且await会暂停当前async function的执行，等待Promise的处理完成。若Promise正常处理（fulfillded），其将回调的resolve函数参数作为await表达式的值，继续执行async function；若Promise处理异常（rejected），await表达式会把Promise异常原因抛出；另外如果await操作符后面的表达式不是一个Promise对象，则返回该值本身。

## 2. 深入理解async/await

我们来详细说明一下async/await的作用。await操作符后面可以是任意值，当是Promise对象的时候，会暂停async function执行。也就是说，必须得等待await后面的Promise处理完成才能继续：

```js
 function testAsy(x){
   return new Promise(resolve=>{setTimeout(() => {
       resolve(x);
     }, 3000)
    }
   )
}
async function testAwt(){    
  let result =  await testAsy('hello world');
  console.log(result);    // 3秒钟之后出现hello world
}
testAwt();
```

await 表达式的运算结果取决于它等的东西。

如果它等到的不是一个 Promise 对象，那 await 表达式的运算结果就是它等到的东西。

如果它等到的是一个 Promise 对象，await 就忙起来了，它会阻塞后面的代码，等着 Promise 对象 resolve，然后得到 resolve 的值，作为 await 表达式的运算结果。

我们再把上面的代码修改一下，好好体会“阻塞”这个词

```js
 function testAsy(x){
   return new Promise(resolve=>{setTimeout(() => {
       resolve(x);
     }, 3000)
    }
   )
}
async function testAwt(){    
  let result =  await testAsy('hello world');
  console.log(result);    // 3秒钟之后出现hello world
  console.log('tangj')   // 3秒钟之后出现tangj
}
testAwt();
console.log('tangSir')  //立即输出tangSir
```

这就是 await 必须用在 async 函数中的原因。async 函数调用不会造成阻塞，它内部所有的阻塞都被封装在一个 Promise 对象中异步执行。await暂停当前async的执行，所以'tangSir''最先输出，hello world'和‘tangj’是3秒钟后同时出现的。

## 3. async和await简单应用

上面已经说明了 async 会将其后的函数（函数表达式或 Lambda）的返回值封装成一个 Promise 对象，而 await 会等待这个 Promise 完成，并将其 resolve 的结果返回出来。

现在举例，用 setTimeout模拟耗时的异步操作，先来看看不用 async/await 会怎么写

```js
function takeLongTime() {
    return new Promise(resolve => {
        setTimeout(() => resolve("long_time_value"), 1000);
    });
}

takeLongTime().then(v => {
    console.log("got", v); //一秒钟后输出got long_time_value
});
```

如果改用 async/await 呢，会是这样

```js
function takeLongTime() {
    return new Promise(resolve => {
        setTimeout(() => resolve("long_time_value"), 1000);
    });
}

async function test() {
    const v = await takeLongTime();
    console.log(v);  // 一秒钟后输出long_time_value
}

test();
```



tankLongTime()本身就是返回的 Promise 对象，所以加不加 async结果都一样。

## 4. 处理then链

前面我们说了，async和await是处理then链的语法糖，现在我们来看看具体是怎么实现的：

假设一个业务，分多个步骤完成，每个步骤都是异步的，而且依赖于上一个步骤的结果。我们仍然用setTimeout来模拟异步操作：



```js
/**
 * 传入参数 n，表示这个函数执行的时间（毫秒）
 * 执行的结果是 n + 200，这个值将用于下一步骤
 */
function takeLongTime(n) {
    return new Promise(resolve => {
        setTimeout(() => resolve(n + 200), n);
    });
}

function step1(n) {
    console.log(`step1 with ${n}`);
    return takeLongTime(n);
}

function step2(n) {
    console.log(`step2 with ${n}`);
    return takeLongTime(n);
}

function step3(n) {
    console.log(`step3 with ${n}`);
    return takeLongTime(n);
}
```



现在用 Promise 方式来实现这三个步骤的处理。



```js
function doIt(){
    console.time('doIt');
    let time1 = 300;
    step1(time1)
        .then((time2) => step2(time2))
        .then((time3) => step3(time3))　　
        .then((result) => {
            console.log(`result is ${result}`);
            console.timeEnd("doIt");
        })
}

doIt();

//执行结果为:
//step1 with 300
//step2 with 500
//step3 with 700
//result is 900
//doIt: 1510.2490234375ms
```



输出结果 `result` 是 `step3()` 的参数 `700 + 200` = `900`。`doIt()` 顺序执行了三个步骤，一共用了 `300 + 500 + 700 = 1500` 毫秒，和 `console.time()/console.timeEnd()` 计算的结果一致。

如果用 async/await 来实现呢，会是这样：



```js
async function doIt() {
    console.time('doIt');
    let time1 = 300;
    let time2 = await step1(time1);//将Promise对象resolve(n+200)的值赋给time2
    let time3 = await step1(time2);
    let result = await step1(time3);
    console.log(`result is ${result}`);
    console.timeEnd('doIt');
}

doIt();

//执行结果为:
//step1 with 300
//step2 with 500
//step3 with 700
//result is 900
//doIt: 1512.904296875ms
```



显然我们用async/await简单多了。

## 5. Promise处理结果为rejected

await 命令后面的 Promise 对象，运行结果可能是 rejected，所以最好把 await 命令放在 try...catch 代码块中。



```js
async function myFunction() {
    try {
        await somethingThatReturnAPromise();
    } catch (err){
        console.log(err);
    }
}

//另一种写法
async function myFunction() {
    await somethingThatReturnAPromise().catch(function(err) {
        console.log(err);
    })
}
```