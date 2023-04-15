# 手写Promise遇到的问题

## 一.源码

```js
const { resolve, reject } = require("promise")

class Promise {

    constructor(concenters) {
        if (typeof concenters !== 'function') {
            throw new TypeError('草泥马,你传的不是函数')
        }
        this.init()
        this.changeThis()
        try {
            concenters(this.resolve, this.reject)
        }
        catch (e) {
            this.reject(e)
        }
    }

    //初始化
    init() {
        this.value = null;
        this.reason = null;
        this.state = 'padding';
        this.onFulfilledCallback = [];
        this.onRejectedCallback = [];
    }

    //改变resolve和reject函数内部this指向
    changeThis() {
        this.resolve = this.resolve.bind(this)
        this.reject = this.reject.bind(this)
    }

    //成功的回调
    resolve(value) {
        if (this.state === 'padding' && this.state !== 'rejected') {
            this.state = 'fulfilled'
            this.value = value;
            while (this.onFulfilledCallback.length) {
                this.onFulfilledCallback.shift()(this.value)
            }
        }
    }

    //失败的回调
    reject(reason) {
        if (this.state === 'padding' && this.state !== 'fulfilled') {
            this.state = 'rejected';
            this.reason = reason
            while (this.onRejectedCallback.length) {
                this.onRejectedCallback.shift()(this.reason)
            }
        }
    }


    then(onFulfilled, onRejected) {
        if (typeof onFulfilled !== 'function') {
            onFulfilled = function (value) {
                return value
            }
        }
        if (typeof onRejected !== 'function') {
            onRejected = function (reason) {
                return reason
            }
        }
        const self = this;
        let Promise2 = new Promise((resolve, reject) => {
            var ResolvePromise = (x) => {
                setTimeout(() => {
                    try {
                        if (x === Promise2) {
                            throw new Error('不能返回自身')
                            //如果 x是当前 promise 本身（promise2和x相等），那么reject TypeError
                        }
                        if (x instanceof Promise) {
                            x.then(resolve, reject)
                        }
                        else {
                            //其他值直接就是成功
                            resolve(x);
                        }
                    }
                    catch (e) {
                        reject(e)
                        throw new Error(e.message)
                    }
                })
            }
            if (self.state === 'fulfilled') {
                //这里加入setTimeout是为了实现Promise在样例里的异步调用
                
                setTimeout(() => {
                    ResolvePromise(onFulfilled(self.value))
                })
            }
            if (self.state === 'rejected') {
                setTimeout(() => {
                    ResolvePromise(onRejected(self.reason))
                })
            }
            if (self.state === 'padding') {
                setTimeout(() => {
                    self.onFulfilledCallback.push(onFulfilled)
                    self.onRejectedCallback.push(onRejected)
                })
            }
        })
        return Promise2
    }


    static all(promises){
        return new Promise((resolve, reject)=>{
            let result=[];
            let count=0;
            const addPromise=(index,value)=>{
                result[index]=value
                count++
                if(count===promises.length){
                    resolve(result)
                }
            }
            promises.forEach((promise,index)=>{
                if(promise instanceof Promise){
                    promise.then((val)=>{
                        addPromise(index,val)
                    },(err)=>{
                        reject(err)
                    })
                }
                else{
                    addPromise(index,promise)
                }
            })
        })
    }


    static race(promises){
        return new Promise((resolve,reject)=>{
            promises.forEach((promise)=>{
                if(promise instanceof Promise){
                    promise.then(val=>{
                        resolve(val)
                    },err=>{
                        reject(err)
                    })
                }
                else{
                    resolve(promise)
                }
            })
        })
    }

    static any(promises){
        return new Promise((resolve,reject)=>{
            let count=0;
            promises.forEach((promise)=>{
                if(promise  instanceof Promise){
                    promise.then(val=>{
                        resolve(val)
                    },err=>{
                        count++;
                        if(count===promises.length){
                            reject(err)
                        }
                    })
                }
                else{
                    resolve(promise)
                }
            })
        })
    }

}

module.exports = Promise
```

## 二.问题

+ 当then函数执行后，onFulfilled函数返回一个Promise，为什么这种情况要使用x.then(resolve,reject)

  ```js
  let Promise2 = new Promise((resolve, reject) => {
              var ResolvePromise = (x) => {
                  setTimeout(() => {
                      try {
                          if (x === Promise2) {
                              throw new Error('不能返回自身')
                              //如果 x是当前 promise 本身（promise2和x相等），那么reject TypeError
                          }
  
                          if (x instanceof Promise) {
                                                      x.then(resolve, reject)
       /*如果 x是另一个 promise（即x是一个promise），那么沿用它的 state 和 result 状态
         如果x是pending态，那么promise必须要在pending，直到x变成fulfilled或者rejected
         如果x是fulfilled态，用相同的value执行promise
         如果x是rejected态，用相同的reason拒绝promise
         				x.then(resolve, reject)传入Promise2的reject和resolve函数是为了完成上面三步，
                      即通过x的状态改变Promise2的状态，所以需要传入Promise2的resolve和reject函数，来改变Promise2
                      的状态。而x.then()函数里面新建的promise对象不用管他在 then 中新创建的 Promise，它的状态变为 fulfilled 的节点是在上一个 Promise的回调执行完毕的时候。也就是说当一个 Promise 的状态被 fulfilled 之后，会执行其回调函数，而回调函数返回的结果会被当作 value， 返回给下一个 Promise(也就是then 中产生的 Promise)，同时下一个 Promise的状态也会被改变(执行 resolve 或 reject)， 然后再去执行其回调,以此类推下去…链式调用的效应就出来了。*/
  ```

  + onfulfilled函数为啥要异步执行

  ```js
   if (self.state === 'fulfilled') {
                  //这里加入setTimeout是为了实现Promise在样例里的异步调用
                  
                  setTimeout(() => {
                      ResolvePromise(onFulfilled(self.value))
                  })
              }
  ```

  因为不去异步执行onfulfilled函数就无法实现Promsie整体的异步调用

  例如：

  ```js
  const Promise=require('./Promise');
  // const Promise=require('./index');
  
  
  console.log(1);
  new Promise((resolve, reject)=>{
      resolve(2)
      // reject(2)
  }).then(value =>{
      console.log(2);
      console.log("第一个promise成功",value);
  },reason=>{
      console.log("第一个promise失败",reason);
  })
  console.log(3);
  ```

  这种情况如果不加setTimeout就会输出1，2，3；

  而加了setTimeout则会输出1，3，2；

  

+ 这三个函数为什么要写在新的Promise(即Promise2)里

```js
if (self.state === 'fulfilled') { 
                setTimeout(() => {
                    ResolvePromise(onFulfilled(self.value))
                })
            }
if (self.state === 'rejected') {
    setTimeout(() => {
        ResolvePromise(onRejected(self.reason))
    })
}
if (self.state === 'padding') {
    setTimeout(() => {
        self.onFulfilledCallback.push(onFulfilled)
        self.onRejectedCallback.push(onRejected)
    })
}
```

因为then函数返回一个Prmoise对象，而这个Promise对象状态由then函数里的两个参数函数（onfulfilled，onrejected）的返回值决定，

将这三个函数放在这里是为了Promise2内部的ResolvePromise函数可以得到onFulfilled/onRejected函数的返回值，根据这个返回值，

修改Promsie2的状态，self等于调用then的Promise实例

## 三.其他方法

### all

+ 接收一个数组，数组中如有非Promise项，则此项当做成功

+ 如果所有Promise都成功，则返回成功结果数组

+ 如果有一个Promise失败，则返回这个失败结果

```js
    static all(promises) {
        const result = []
        let count = 0
        return new Promise((resolve, reject) => {
            const addData = (index, value) => {
                result[index] = value
                count++
                if (count === promises.length) resolve(result)
            }
            promises.forEach((promise, index) => {
                if (promise instanceof Promise) {
                    promise.then(res => {
                        addData(index, res)
                    }, err => reject(err))
                } else {
                    addData(index, promise)
                }
            })
        })
    }
```

### **race**

接收一个Promise数组，数组中如有非Promise项，则此项当作成功.

哪个Promise最快得到结果，就返回哪个结果，无论成功失败.

```js
    static race(promises) {
        return new Promise((resolve, reject) => {
            promises.forEach(promise => {
                if (promise instanceof MyPromise) {
                    promise.then(res => {
                        resolve(res)
                    }, err => {
                        reject(err)
                    })
                } else {
                    resolve(promise)
                }
            })
        })
    }
```

**any**

any与all相反

接收一个Promise数组，数组中如有非Promise项，则此项当作成功.

如果有一个Promise成功，则饭返回这个成功结果.

如果所有Promise都失败，则报错

```js
    static any(promises) {
        return new Promise((resolve, reject) => {
            let count = 0
            promises.forEach((promise) => {
                promise.then(val => {
                    resolve(val)
                }, err => {
                    count++
                    if (count === promises.length) {
                        reject(new AggregateError('All promises were rejected'))
                    }
                })
            })
        })
    }
}
```

