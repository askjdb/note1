# useEffect

## 原生useEffect具备的几个特点

1. useEffect可以多次调用。
2. useEffect根据传入参数的不同，具有不同的执行方法。

## 手写useEffect的步骤

### 第一步：使用数组来存储不同的effect

```js
// 以前的依赖值
let preArray = [];
// 定义effect的索引
let effectId = 0;
复制代码
```

### 第二步：判断传入参数是否正确

- 如果第一个参数传入的不是函数则报错

```js
// 如果第一个参数不是一个函数则报错
if (Object.prototype.toString.call(callback) !== '[object Function]') {
    throw new Error('第一个参数不是函数')
}
复制代码
```

- 判断第二个参数
  - 没传的话，按照componentDidMount 和 componentDidUptate处理
  - 传的话，判读是不是数组，不是则报错
  - 获取前一个effect，如果没有则等同于compoentDidMout，直接执行callback，如果有则判断是否与以前的依赖值一样，如果不一样则执行callback，这样就实现了第二个参数数组内的元素发生变化的时候才执行callback.

```js
// 如果第二个参数不传，相当于componentDidMount和componentDidUpdate
if (typeof array === 'undefined') {
    callback();
} else {
    // 判断array是不是数组
    if (Object.prototype.toString.call(array) !== '[object Array]') throw new Error('useEffect的第二个参数必须是数组')
    // 获取前一个的effect
    if (preArray[effectId]) {
        // 判断和以前的依赖值是否一致，一致则执行callback
        let hasChange = array.every((item,index) => item === preArray[effectId][index]) ? false : true;
        if (hasChange) {
            callback();
        }
    } else {
        callback()
    }
复制代码
```

### 第三步：更新依赖值

> 注意，本次实现的useEffect是需要render函数执行的时候，将effectId置为0的。

```js
// 更新依赖值
preArray[effectId] = array;
effectId++;
```



### 第四步：完整代码

```js
// 以前的依赖值
let preArray = [];
// 定义effect的索引
let effectId = 0;
function myUseEffect(callback,array) {
    // 如果第一个参数不是一个函数则报错
    if (Object.prototype.toString.call(callback) !== '[object Function]') {
        throw new Error('第一个参数不是函数')
    }
    // 如果第二个参数不传，相当于componentDidMount和componentDidUpdate
    if (typeof array === 'undefined') {
        callback();
    } else {
        // 判断array是不是数组
        if (Object.prototype.toString.call(array) !== '[object Array]') throw new Error('useEffect的第二个参数必须是数组')
        // 获取前一个的effect
        if (preArray[effectId]) {
            // 判断和以前的依赖值是否一致，不一致则执行callback
            let hasChange = array.every((item,index) => item === preArray[effectId][index]) ? false : true;
            if (hasChange) {
                callback();
            }
        } else {
            callback()
        }
        // 更新依赖值
        preArray[effectId] = array;
        effectId++;
    }
}
```

# useState

```js
let index = -1;
let currentState=[]
function useState(initialState){
    index++
    const currentIndex =index; //这里保存index是因为useState可能会有多个所以要使用闭包，
    //将不同的useState内部的变量保存下来,这里保存了这个useState对应的下标，因为index是
    //全局变量，会随着useState的多次调用而变化，所以需要通过闭包保存对应的index
    currentState[currentIndex]=currentState[currentIndex] || initialState
    const setState=(newVal)=>{
        currentState[currentIndex]=newVal
        render()
    }
    return [currentState[currentIndex],setState]
}
```

