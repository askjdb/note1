// const { resolve, reject } = require("promise")

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