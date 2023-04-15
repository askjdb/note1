## Store 方法

### getState()

返回应用当前的 state 树。 它与 store 的最后一个 reducer 返回值相同。

#### 返回值

*(any)*: 应用当前的 state 树。

### dispatch(action)

dispatch action。这是触发 state 变化的惟一途径。

将使用当前 [`getState()`](https://cn.redux.js.org/api/store/#getstate) 的结果和传入的 `action` 以同步方式的调用 store 的 reducer 函数。它的返回值会被作为下一个 state。从现在开始，这就成为了 [`getState()`](https://cn.redux.js.org/api/store/#getstate) 的返回值，同时变化监听器(change listener)会被触发。

当你在 [reducer](https://cn.redux.js.org/understanding/thinking-in-redux/glossary#reducer) 内部调用 `dispatch` 时，将会抛出错误提示“Reducers may not dispatch actions.（Reducer 内不能 dispatch action）”。这就相当于 Flux 里的 “Cannot dispatch in a middle of dispatch（dispatch 过程中不能再 dispatch）”，但并不会引起对应的错误。在 Flux 里，当 Store 处理 action 和触发 update 事件时，dispatch 是禁止的。这个限制并不好，因为他限制了不能在生命周期回调里 dispatch action，还有其它一些本来很正常的地方。

在 Redux 里，只会在根 reducer 返回新 state 结束后再会调用事件监听器，因此，你可以在事件监听器里再做 dispatch。惟一使你不能在 reducer 中途 dispatch 的原因是要确保 reducer 没有副作用。如果 action 处理会产生副作用，正确的做法是使用异步 [action 创建函数](https://cn.redux.js.org/understanding/thinking-in-redux/glossary#action-creator)。

#### 参数[](https://cn.redux.js.org/api/store/#参数)

1. `action` (*Object*†): 描述应用变化的普通对象。Action 是把数据传入 store 的惟一途径，所以任何数据，无论来自 UI 事件，网络回调或者是其它资源如 WebSockets，最终都应该以 action 的形式被 dispatch。按照约定，action 具有 `type` 字段来表示它的类型。type 也可被定义为常量或者是从其它模块引入。最好使用字符串，而不是 [Symbols](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Symbol) 作为 action，因为字符串是可以被序列化的。除了 `type` 字段外，action 对象的结构完全取决于你。参照 [Flux 标准 Action](https://github.com/acdlite/flux-standard-action) 获取如何组织 action 的建议。

#### Returns[](https://cn.redux.js.org/api/store/#returns)

(Object†): 要 dispatch 的 action。

#### Notes[](https://cn.redux.js.org/api/store/#notes)

† 使用 [`createStore`](/api/createstore) 创建的 “纯正” store 只支持普通对象类型的 action，而且会立即传到 reducer 来执行。

但是，如果你用 [`applyMiddleware`](https://cn.redux.js.org/api/applymiddleware) 来套住 [`createStore`](https://cn.redux.js.org/api/createstore) 时，middleware 可以修改 action 的执行，并支持执行 dispatch [异步 actions](https://cn.redux.js.org/understanding/thinking-in-redux/glossary#async-action)。异步 action 通常使用异步原语如 Promise、Observable 或者 Thunk。

Middleware 是由社区创建，并不会同 Redux 一起发行。你需要手动安装 [redux-thunk](https://github.com/gaearon/redux-thunk) 或者 [redux-promise](https://github.com/acdlite/redux-promise) 库。你也可以创建自己的 middleware。

想学习如何描述异步 API 调用？看一下 action 创建函数里当前的 state，执行一个有副作用的操作，或者以链式操作执行它们，参照 [`applyMiddleware`](https://cn.redux.js.org/api/applymiddleware) 中的示例。

#### Example[](https://cn.redux.js.org/api/store/#example)

```js
import { createStore } from 'redux'
const store = createStore(todos, ['Use Redux'])

function addTodo(text) {
  return {
    type: 'ADD_TODO',
    text
  }
}

store.dispatch(addTodo('Read the docs'))
store.dispatch(addTodo('Read about the middleware'))
```



------

### subscribe(listener)[](https://cn.redux.js.org/api/store/#subscribelistener)

添加一个变化监听器。每当 dispatch action 的时候就会执行，state 树中的一部分可能已经变化。你可以在回调函数里调用 [`getState()`](https://cn.redux.js.org/api/store/#getstate) 来拿到当前 state。

你可以在变化监听器里面进行 [`dispatch()`](https://cn.redux.js.org/api/store/#dispatchaction)，但你需要注意下面的事项：

1. 监听器调用 [`dispatch()`](https://cn.redux.js.org/api/store/#dispatchaction) 仅仅应当发生在响应用户的 actions 或者特殊的条件限制下（比如： 在 store 有一个特殊的字段时 dispatch action）。虽然没有任何条件去调用 [`dispatch()`](https://cn.redux.js.org/api/store/#dispatchaction) 在技术上是可行的，但是随着每次 [`dispatch()`](https://cn.redux.js.org/api/store/#dispatchaction) 改变 store 可能会导致陷入无穷的循环。
2. 订阅器（subscriptions） 在每次 [`dispatch()`](https://cn.redux.js.org/api/store/#dispatchaction) 调用之前都会保存一份快照。当你在正在调用监听器（listener）的时候订阅(subscribe)或者去掉订阅（unsubscribe），对当前的 [`dispatch()`](https://cn.redux.js.org/api/store/#dispatchaction) 不会有任何影响。但是对于下一次的 [`dispatch()`](https://cn.redux.js.org/api/store/#dispatchaction)，无论嵌套与否，都会使用订阅列表里最近的一次快照。
3. 订阅器不应该注意到所有 state 的变化，在订阅器被调用之前，往往由于嵌套的 [`dispatch()`](https://cn.redux.js.org/api/store/#dispatchaction) 导致 state 发生多次的改变。保证所有的监听器都注册在 [`dispatch()`](https://cn.redux.js.org/api/store/#dispatchaction) 启动之前，这样，在调用监听器的时候就会传入监听器所存在时间里最新的一次 state。

这是一个底层 API。多数情况下，你不会直接使用它，会使用一些 React（或其它库）的绑定。如果你想让回调函数执行的时候使用当前的 state，你可以 [写一个定制的 `observeStore` 工具](https://github.com/rackt/redux/issues/303#issuecomment-125184409)。 `Store` 也是一个 [`Observable`](https://github.com/zenparsing/es-observable)， 所以你可以使用 [RxJS](https://github.com/ReactiveX/RxJS) 的这样的库来 `subscribe` 订阅更新。

如果需要解绑这个变化监听器，执行 `subscribe` 返回的函数即可。

#### 参数[](https://cn.redux.js.org/api/store/#参数-1)

1. `listener` (*Function*): 每当 dispatch action 的时候都会执行的回调。state 树中的一部分可能已经变化。你可以在回调函数里调用 [`getState()`](https://cn.redux.js.org/api/store/#getstate) 来拿到当前 state。store 的 reducer 应该是纯函数，因此你可能需要对 state 树中的引用做深度比较来确定它的值是否有变化。

##### 返回值[](https://cn.redux.js.org/api/store/#返回值-1)

(*Function*): 一个可以解绑变化监听器的函数。

##### 示例[](https://cn.redux.js.org/api/store/#示例)

```js
function select(state) {
  return state.some.deep.property
}

let currentValue
function handleChange() {
  let previousValue = currentValue
  currentValue = select(store.getState())

  if (previousValue !== currentValue) {
    console.log(
      'Some deep nested property changed from',
      previousValue,
      'to',
      currentValue
    )
  }
}

const unsubscribe = store.subscribe(handleChange)
unsubscribe()
```



------

### replaceReducer(nextReducer)[](https://cn.redux.js.org/api/store/#replacereducernextreducer)

替换 store 当前用来计算 state 的 reducer。

这是一个高级 API。只有在你需要实现代码分隔，而且需要立即加载一些 reducer 的时候才可能会用到它。在实现 Redux 热加载机制的时候也可能会用到。

#### 参数[](https://cn.redux.js.org/api/store/#参数-2)

1. `nextReducer` (*Function*) store 会使用的下一个 reducer。