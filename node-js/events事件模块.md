## 1. 什么是事件驱动？

事件驱动，简单来说就是通过有效方法来**监听**事件状态的变化，并在发生变化时做出相应的动作。

举一个生活应用的场景来理解：当我们去饭店吃饭点餐，当我们下单之后，服务员告诉我们的订单号（这时候可以理解为注册了一个事件），我们在坐着等候，这时候我们的耳朵就一直**监听**着服务员的喊号，当喊到我们的时候，我们可以去前台取餐。

## 2. 事件模型

NodeJS的事件架构采用经典的--订阅发布模式

订阅发布模式，也可以称之为消息机制，定义了一种依赖关系，这种依赖关系可以理解为 1对N(多个或者单个)观察者们同时监听某一个对象相应的状态变换，一旦变化则通知到所有观察者，从而触发观察者注册的相应事件，该设计模式解决了主体对象与观察者之间功能的耦合。

## 3. events模块

events模块是NodeJS非常重要的一个模块，在node中大部分的模块的实现都继承了Events类，如fs,http,net等。它提供了一个对象events.EventEmitter，EventEmitter 的核心是事件发射与事件监听器。

简单使用：

```js
import { EventEmitter } from 'events';
class MyEmiter extends EventEmitter{};
const myEmitter = new MyEmiter();
myEmitter.on('hello', () => {
  console.log('hello 有人喊你啦');
});
myEmitter.emit('hello');
```

## 4. Events模块核心API

**4.1 `eventEmitter.on(eventName, callback)`**

注册监听事件

参数：

- eventName: 事件名称
- callback: 事件触发被调用回调函数

**4.2 `eventEmitter.once(eventName, callback)`**

可以注册一个监听器，该监听器最多为特定事件调用一次。 一旦事件被触发，则监听器就会被注销然后被调用。

参数：

- eventName: 事件名称
- callback: 事件触发被调用回调函数

**4.3 `eventEmitter.emit(eventName[, ...args])`**

触发指定的监听事件

参数：

- eventName: 事件名称
- args可选参数，按顺序传入回调函数的参数；

**4.4 `eventEmitter.removeListener(eventName, callback)`**

移除指定事件的监听器，注意：该监听器必须是注册过的。否则无效。

参数：

- eventName: 事件名称
- callback: 回调函数

**4.5 `EventEmitter.removeAllListeners(eventName)`**

移除所有监听器，一个事件可以有多个监听，需要全部移除时，可以用此方法。

参数：

- eventName： 需要全部移除的事件名称；

```
需要特别注意的是，如果不传参数，将会移除所有的监听事件，比较暴力，建议慎用。
```

**4.6 `EventEmitter.listeners(eventName)`**

返回名为 `eventName` 的事件的监听器绑定回调函数数组的副本。

**4.7 `EventEmitter.eventNames()`**

返回列出触发器已为其注册监听器的事件的数组。

**4.8 `EventEmitter.setMaxListeners(n)`**

默认情况下，如果为特定事件添加了 `10` 个以上的监听器，则 `EventEmitter` 将打印警告。

emitter.setMaxListeners() 方法允许修改此特定 `EventEmitter` 实例的限制。 该值可以设置为 `Infinity`（或 `0`）以指示无限数量的监听器。

## **5. 同步异步的问题**

`EventEmitter` 按照注册的顺序`同步`地调用所有监听器。这确保了事件的正确排序，并有助于避免竞争条件和逻辑错误。

## **6.错误处理**

当 `EventEmitter` 实例中发生错误时，典型的操作是触发 `'error'` 事件。 这些在 Node.js 中被视为特殊情况。

如果 `EventEmitter` 没有为 `'error'` 事件注册至少一个监听器，并且触发 `'error'` 事件，则会抛出错误，打印堆栈跟踪，然后退出 Node.js 进程。

作为最佳实践，应始终为 `'error'` 事件添加监听器。

```js
import { EventEmitter } from 'events';
class MyEmiter extends EventEmitter{};
const myEmitter = new MyEmiter();
myEmitter.on('hello', () => {
  console.log('hello 有人喊你啦');
});
myEmitter.on('error', (e) => {
  console.log(e)
})
myEmitter.emit('hello');
myEmitter.emit('error', new Error('an error happen'))
```