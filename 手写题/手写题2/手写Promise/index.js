const PENDING = "pending";
const RESOLVED = "resolved";
const REJECTED = "rejected";

module.exports = class MyPromise {
    constructor(func) {
        if (typeof func !== 'function') {
            throw new Error('参数不是函数')
        }
        this.init();
        this.changeThis();
        try {
            func(this.resolve, this.reject)
        } catch (e) {
            this.reject(e)
        }
    }
    //初始化数据
    init() {
        this.value = null;
        this.reason = null;
        this.state = PENDING;
        this.onFulfilledCallback = [];
        this.onRejectedCallback = [];
    }

    changeThis() {
        this.resolve = this.resolve.bind(this)
        this.reject = this.reject.bind(this)
    }

    resolve(value) {
        if (this.state === PENDING) {
            this.state = RESOLVED
            this.value = value;
        }
    }
    reject(reason) {
        if (this.state === PENDING) {
            this.state = REJECTED
            this.reason = reason;
        }
    }
    then(onFulfilled, onRejected) {
        if (typeof onFulfilled !== 'function') {
            onFulfilled = (value) => {
                return value
            }
        }
        if (typeof onRejected !== 'function') {
            onFulfilled = (reason) => {
                return reason
            }
        }
        const self = this;
        return new MyPromise((resolve, reject) => {
            function ResultPromise(x) {
                setTimeout(() => {
                    try {
                        if (x === MyPromise) {
                            throw new Error('不能返回自身')
                        }
                        else if (x instanceof MyPromise) {
                            x.then(resolve, reject)
                        } else {
                            resolve(x)
                        }
                    } catch (e) {
                        reject(e.message)
                        throw new Error('运行错误')
                    }
                })
            }
            if (self.state === PENDING) {
                setTimeout(() => {
                    self.onFulfilledCallback.push(onFulfilled)
                    self.onRejectedCallback.push(onRejected)
                })
            }
            if (self.state === RESOLVED) {
                setTimeout(() => {
                    ResultPromise(onFulfilled(self.value))
                })
            }
            if (self.state === REJECTED) {
                setTimeout(() => {
                    ResultPromise(onRejected(self.reason))
                })
            }
        })
    }

    static all(Promises) {
        return new MyPromise((resolve, reject) => {
            let result = []
            let xiabiao = 0;
            function ResultArr(value, index) {
                result[index] = value;
                xiabiao++
                if (xiabiao === Promises.length) {
                    resolve(result)
                }
            }
            Promises.forEach((item, index) => {
                if (item instanceof MyPromise) {
                    item.then(val => {
                        ResultArr(val, index)
                    }, reason => {
                        reject(reason)
                    })
                } else {
                    ResultArr(item, index)
                }
            });
        })
    }

    static race(Promises) {
        return new MyPromise((resolve, reject) => {
            Promises.forEach(item => {
                if (item instanceof MyPromise) {
                    item.then(val => {
                        resolve(val)
                    }, reason => {
                        reject(reason)
                    })
                } else {
                    resolve(item)
                }
            })
        })
    }

    static any(Promises) {
        return new MyPromise((resolve, reject) => {
            let result = []
            let xiaoniao = 0;
            function x(val, index) {
                result[index] = val;
                xiaoniao++
                if (xiaoniao === Promises.length) {
                    reject(result)
                }
            }
            Promises.forEach((item, index) => {
                if (item instanceof MyPromise) {
                    item.then(val => {
                        resolve(val)
                    }, reason => {
                        x(reason, index)
                    })
                } else {
                    resolve(item)
                }
            })
        })
    }

    static retry(fn, delay, MaxCount) {
        return new MyPromise((resolve, reject) => {
            let count = 0
            function x() {
                fn.then(val => {
                    resolve(val)
                }, error => {
                    if (count === MaxCount) {
                        reject(error.message)
                    } else {
                        count++;
                        setTimeout(() => {
                            x()
                        }, delay)
                    }
                })
            }
            x()
        })
    }
}
