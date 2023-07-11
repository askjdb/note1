# 为什么forEach不能用await

> `forEach()` 期望的是一个同步函数，它不会等待 Promise 兑现。在使用 Promise（或异步函数）作为 `forEach` 回调时，请确保你意识到这一点可能带来的影响。

### 为什么

今天在工作时候将await写进了forEach循环里，但是并没有生效！查询了资料发现MDN上有一段这样的描述：

> 如果使用 promise 或 async 函数作为 `forEach()` 等类似方法的 `callback` 参数，最好对造成的执行顺序影响多加考虑，否则容易出现错误。

简单的来说，forEach 的参数只是一个回调函数，便利时候只是进行简单的回调，不能接受异步操作（我把官方源码放在文末，里面是用 `while` 循环做的）。大家可以打开F12打印一下：

```ini
let ratings = [5, 4, 5];

let sum = 0;

let sumFunction = async function (a, b) {
    return a + b;
}

ratings.forEach(async function(rating) {
    sum = await sumFunction(sum, rating);
})

console.log(sum);// 0
```

在网上搜了一下相关的问题：

- 为什么 forEach 不能 `break`
- 为什么 forEach 不能 `return`

以及其他的一些为什么...... 基本上都和上面说的有关，即使 return 也只是 return 了回调函数，没有 return 掉整个循环。

### 怎么做

将循环换成 `for` 循环就好啦, 或者其他原生 for 循环也可以。

```ini
let test = async function () {
  let sum = 0; 
  for (let i = 0; i < 6; i++) {
    sum += await Promise.resolve(i);
  };
  console.log(sum);
};

test(); // 15
```

# for循环使用await，for of以及for await of

几个for循环里使用await的方法让小编有点混乱，所以决定今天捋一捋，顺便把是否能用break也标一下：

其实for循环中使用await就分几种，看看哪个是生效的：

1、for：循环中使用await的写法（生效）：

```javascript
for( let i=0; i<array.length; i++ ){
    let datas = await getDatas()
    break
}
```

2、forEach：循环中使用await的写法（不生效）：

```javascript
array.forEach(async (item)=>{
    let datas = await getDatas()
})
```

3、for of：循环中使用await的写法（生效）：

```javascript
for( let item of array ){
    let datas = await getDatas()
    break
}
```

4、for await of：循环的使用方法（生效）：

```javascript
for await (let item of array){
    break
}
```

> **注意：**
>
> 1. for：要使用在async异步方法里，循环会等await执行而停留，await是有效的，有break；
> 2. forEach：没有break，循环不会等await执行而停留，await是无效的；
> 3. for of：要使用在async异步方法里，执行期间，await之前的代码会执行，到了await会等待await执行完才继续往下执行，有break；
> 4. for await of：也要用在async异步方法里，有break，但是它一般是使用在item是个异步方法的情况下，并不常见，场景如下面对应的例子，要遍历的数组元素是个异步请求，异步没回来之前整个for循环代码不执行：

------

下面我们来验证：

**for** 使用await的验证例子：

```javascript
//模拟异步代码
function getDatas(times){
    times = times || 0
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve(times)
        }, times*1000)
    })
}
let arrays = [1, 2, 3]
async function execute(){
    for( let i=0; i<arrays.length; i++ ){
        console.log(`第${i+1}次我先执行了`)
        let datas = await getDatas(arrays[i])
        console.log("返回结果："+datas)
        console.log(`第${i+1}次执行完了`)
        console.log("-------------------------")
    }
}
execute()
```

执行结果图：

![img](http://seozhijia.net/uploads/allimg/2210/1-221031195413S4.jpg)

**forEach**使用await的验证例子：

```javascript
//模拟异步代码
function getDatas(times){
    times = times || 0
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve(times)
        }, times*1000)
    })
}
let arrays = [1, 2, 3]
arrays.forEach(async (item, index)=>{
    console.log(`第${index+1}次开始`)
    let datas = await getDatas(item)
    console.log("返回结果："+datas)
    console.log(`第${item}次结束`)
})
```

执行结果图：

![img](http://seozhijia.net/uploads/allimg/2206/1-22061123522A36.jpg)

把顺序调换一下：

![img](http://seozhijia.net/uploads/allimg/2206/1-2206120009511T.jpg)

可以看到forEach中使用await是无效的，每次执行结果都是一样，只不过在let的作用下，await后面的代码能按顺序执行；

------

**for of** 使用await的验证例子：

```javascript
//模拟异步代码
function getDatas(times){
    times = times || 0
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve(times)
        }, times*1000)
    })
}
let arrays = [2, 1, 3]
async function execute(){
    let index = 1
    for (let item of arrays){
        console.log(`第${index}次我先执行了`)
        let datas = await getDatas(item)
        console.log("返回结果："+datas)
        console.log(`第${index}次执行完了`)
        console.log("-------------------------")
        index++
    }
}
execute()
```

执行结果图：

![img](http://seozhijia.net/uploads/allimg/2206/1-2206120110194Y.jpg)

------

**for await of** 的使用验证例子：

```javascript
//模拟异步代码
function getDatas(times){
    times = times || 0
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve(times)
        }, times*1000)
    })
}
let arrays = [getDatas(0), getDatas(1), getDatas(1.5)]
//一定要在async方法里使用，不能直接写for await (let item of arrays){}执行
async function execute(){
    for await (let item of arrays){
        console.log(item)
    }
}
execute()
```

执行结果图：

![img](http://seozhijia.net/uploads/allimg/2206/1-220611232I0913.jpg)

------

**总结：**

- for、for of、for await of是生效的，forEach的await是不生效的；
- for、for of是await这一行代码在等待，for await of是整个for在等待；

**扩展：**

- 实际开发中我们可以发现其实for、while、for in、for of、for await of使用await都是生效的；
- 而几乎有回调的遍历方法：forEach、map、filter、reduce、some、every、find等，使用await都是不生效的；

今天就到这里啦，赶紧去试试吧