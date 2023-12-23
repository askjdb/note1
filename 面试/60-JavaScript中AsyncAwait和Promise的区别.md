# JavaScript中Async/Await和Promise的区别

从Node 8 LTS开始，Node完全支持[Async](https://cloud.tencent.com/developer/tools/blog-entry?target=http%3A%2F%2Fwww.javanx.cn%2Ftag%2Fasync%2F)/[Await](https://cloud.tencent.com/developer/tools/blog-entry?target=http%3A%2F%2Fwww.javanx.cn%2Ftag%2Fawait%2F)。下面通过简单示例的方式来讲讲Async/Await和[Promise](https://cloud.tencent.com/developer/tools/blog-entry?target=http%3A%2F%2Fwww.javanx.cn%2Ftag%2Fpromise%2F)的区别。 简单介绍下Async/Await:

1. Async/Await是一种新的编写异步代码的方式。其他方式是回调或者Promise。
2. Async/Await实质是构建在Promise之上，它不能用于纯的回调或者Node.js的回调中。
3. 和Promise一样，Async/Await是非阻塞的
4. Async/Await很大的特点是，它可以让异步代码看起来就像同步代码那样，大大提高了异步代码的可读性。

## 语法

假设函数getJSON()返回一个Promise，基于Promise的调用示例如下：

```javascript
const makeRequest = () =>
  getJSON()
    .then(data => {
      console.log(data)
      return "done"
    })
makeRequest()
```



getJSON()返回Promise后，在then()函数里输出结果，并返回done。 使用Async/Await改写如下：

```javascript
const makeRequest = async () => {
  console.log(await getJSON())
  return "done"
}
makeRequest()
```



1. 在函数前使用关键词async来标记这是一个异步函数，它隐含着表示函数会返回一个Promise，当函数返回值时就表示Promise被处理（resolve）了。
2. await关键字只能用在async标记的函数内，换句话说它是不能用在代码的最顶层。await的意思是等待getJSON()返回的Promise被处理了才会执行。

与Promise对比**简洁干净** 与Promise需要使用then()函数来处理Promise返回的结果，而async/await则直接在代码按顺序上处理结果，代码量减少的同时，显得更简洁。

## 错误处理

async/await让我们可以同时捕获异步和同步代码抛出的异常。Promise如果在then()函数里出现异常，在Promise的外面的try/catch是捕获不到，这种情况我们需要使用Promise的catch()函数。如：

```javascript
const makeRequest = () => {
  try {
    getJSON()
      .then(result => {
        // this parse may fail
        const data = JSON.parse(result)
        console.log(data)
      })
      .catch((err) => {
        console.log(err)
      })
  } catch (err) {
    console.log(err)
  }
}
```



async/await异步代码和同步代码共用try/catch

```javascript
const makeRequest = async () => {
  try {
    const data = JSON.parse(await getJSON())
    console.log(data)
  } catch (err) {
    console.log(err)
  }
}
```



## 条件语句

有一种情况是我们会对返回的Promise数据做判断，如果符合某种条件则需要发起另外一个异步请求。使用Promise示例如下：

```javascript
const makeRequest = () => {
  return getJSON()
    .then(data => {
      if (data.needsAnotherRequest) {
        return makeAnotherRequest(data)
          .then(moreData => {
            console.log(moreData)
            return moreData
          })
      } else {
        console.log(data)
        return data
      }
    })
}
```



这种嵌套的Promise读起来很容易迷糊。 async/await改写如下：

```javascript
const makeRequest = async () => {
  const data = await getJSON()
  if (data.needsAnotherRequest) {
    const moreData = await makeAnotherRequest(data);
    console.log(moreData)
    return moreData
  } else {
    console.log(data)
    return data    
  }
}
```



看起来像同步代码，大大增强了异步代码的可读性。

## 中间值

有一种情况是需要通过多个嵌套的请求，其中前面的请求返回的是一个中间值，后面的请求需要使用中间值来发起请求。使用Promise如下：

```javascript
const makeRequest = () => {
  return promise1()
    .then(value1 => {
      // do something
      return promise2(value1)
        .then(value2 => {
          // do something          
          return promise3(value1, value2)
        })
    })
}
```



async/await改写就很简单：

```javascript
const makeRequest = async () => {
  const value1 = await promise1()
  const value2 = await promise2(value1)
  return promise3(value1, value2)
}
```



另外，Async/Await也很方便我们调试代码。