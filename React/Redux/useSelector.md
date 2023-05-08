# react-redux@7.1.0 useSelector: 别啦 connect

## API简单的介绍

因为在新的项目中用到了hooks，但是用的时候react-redux还处于`alpha.x`版本的状态。用不了最新的API，感觉不是很美妙。好在，这两天发布了7.1版本。

现在来看看怎么用这个新的API。

## `useSelector()`

```sql
const result : any = useSelector(selector : Function, equalityFn? : Function)
复制代码
```

这个是干啥的呢？就是从redux的store对象中提取数据(state)。

**注意：** 因为这个可能在任何时候执行多次，所以你要保持这个selector是一个纯函数。

这个selector方法类似于之前的connect的mapStateToProps参数的概念。并且`useSelector`会订阅store, 当action被dispatched的时候，会运行selector。

当然，仅仅是概念和mapStateToProps相似，但是肯定有不同的地方，看看selector和mapStateToProps的一些差异：

- selector会返回任何值作为结果，并不仅仅是对象了。然后这个selector返回的结果，就会作为`useSelector`的返回结果。
- 当action被dispatched的时候，`useSelector()`将对前一个selector结果值和当前结果值进行浅比较。**如果不同，那么就会被re-render。** 反之亦然。
- selector不会接收ownProps参数，但是，可以通过闭包(下面有示例)或使用柯里化selector来使用props。
- 使用记忆(memoizing) selector时必须格外小心(下面有示例)。
- `useSelector()`默认使用`===`(严格相等)进行相等性检查，而不是浅相等(`==`)。

你可能在一个组件内调用`useSelector`多次，但是对`useSelector()`的每个调用都会创建redux store的单个订阅。由于react-reduxv7版本使用的react的批量(batching)更新行为，造成同个组件中，多次useSelector返回的值只会re-render一次。

### 相等比较和更新

当函数组件渲染时，会调用提供的selector函数，并且从`useSelector`返回其结果。(如果selector运行且没有更改，则会返回缓存的结果)。

上面有说到，只当对比结果不同的时候会被re-render。从v7.1.0-alpha.5开始，默认比较是严格比较(`===`)。这点于connect的时候不同，connect使用的是[浅比较](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fxiaohesong%2FTIL%2Fblob%2Fmaster%2Ffront-end%2Freact%2Freact-redux%2Fshallow-equal.md)。这对如何使用`useSelector()`有几个影响。

使用`mapState`，所有单个属性都在组合对象中返回。返回的对象是否是新的引用并不重要 - `connect()`只比较各个字段。使用`useSelector`就不行了，默认情况下是，如果每次返回一个新对象将始终进行强制re-render。如果要从store中获取多个值，那你可以这样做：

- `useSelector()`调用多次，每次返回一个字段值。
- 使用Reselect或类似的库创建一个记忆化(memoized) selector，它在一个对象中返回多个值，但只在其中一个值发生更改时才返回一个新对象。
- 使用react-redux 提供的`shallowEqual`函数作为`useSelector`的`equalityFn`参数。

就像下面这样：

```javascript
import { shallowEqual, useSelector } from 'react-redux'

// later
const selectedData = useSelector(selectorReturningObject, shallowEqual)
复制代码
```

### useSelector 例子

上面做了一些基本的阐述，下面该用一些例子来加深理解。

基本用法

```javascript
import React from 'react'
import { useSelector } from 'react-redux'

export const CounterComponent = () => {
  const counter = useSelector(state => state.counter)
  return <div>{counter}</div>
}
复制代码
```

通过闭包使用props来确定要提取的内容：

```javascript
import React from 'react'
import { useSelector } from 'react-redux'

export const TodoListItem = props => {
  const todo = useSelector(state => state.todos[props.id])
  return <div>{todo.text}</div>
}
复制代码
```

#### 使用记忆化(memoizing) selector

对于memoizing不是很了解的，可以[通往此处](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fxiaohesong%2FTIL%2Fblob%2Fmaster%2Ffront-end%2Freact%2FuseMemo.md)了解。

当使用如上所示的带有内联selector的`useSelector`时，如果渲染组件，则会创建selector的新实例。只要selector不维护任何状态，这就可以工作。但是，记忆化(memoizing) selectors 具有内部状态，因此在使用它们时必须小心。

当selector仅依赖于状态时，只需确保它在组件外部声明，这样一来，每个渲染所使用的都是相同的选择器实例：

```javascript
import React from 'react'
import { useSelector } from 'react-redux'
import { createSelector } from 'reselect' //上面提到的reselect库

const selectNumOfDoneTodos = createSelector(
  state => state.todos,
  todos => todos.filter(todo => todo.isDone).length
)

export const DoneTodosCounter = () => {
  const NumOfDoneTodos = useSelector(selectNumOfDoneTodos)
  return <div>{NumOfDoneTodos}</div>
}

export const App = () => {
  return (
    <>
      <span>Number of done todos:</span>
      <DoneTodosCounter />
    </>
  )
}
复制代码
```

如果selector依赖于组件的props，但是只会在单个组件的单个实例中使用，则情况也是如此：

```javascript
import React from 'react'
import { useSelector } from 'react-redux'
import { createSelector } from 'reselect'

const selectNumOfTodosWithIsDoneValue = createSelector(
  state => state.todos,
  (_, isDone) => isDone,
  (todos, isDone) => todos.filter(todo => todo.isDone === isDone).length
)

export const TodoCounterForIsDoneValue = ({ isDone }) => {
  const NumOfTodosWithIsDoneValue = useSelector(state =>
    selectNumOfTodosWithIsDoneValue(state, isDone)
  )

  return <div>{NumOfTodosWithIsDoneValue}</div>
}

export const App = () => {
  return (
    <>
      <span>Number of done todos:</span>
      <TodoCounterForIsDoneValue isDone={true} />
    </>
  )
}
复制代码
```

但是，如果selector被用于多个组件实例并且依赖组件的props，那么你需要确保每个组件实例都有自己的selector实例(为什么要这样？看[这里](https://link.juejin.cn?target=https%3A%2F%2Fjsproxy.ga%2F-----https%3A%2F%2Fgithub.com%2Freduxjs%2Freselect%23accessing-react-props-in-selectors))：

```javascript
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { createSelector } from 'reselect'

const makeNumOfTodosWithIsDoneSelector = () =>
  createSelector(
    state => state.todos,
    (_, isDone) => isDone,
    (todos, isDone) => todos.filter(todo => todo.isDone === isDone).length
  )

export const TodoCounterForIsDoneValue = ({ isDone }) => {
  const selectNumOfTodosWithIsDone = useMemo(
    makeNumOfTodosWithIsDoneSelector,
    []
  )

  const numOfTodosWithIsDoneValue = useSelector(state =>
    selectNumOfTodosWithIsDoneValue(state, isDone)
  )

  return <div>{numOfTodosWithIsDoneValue}</div>
}

export const App = () => {
  return (
    <>
      <span>Number of done todos:</span>
      <TodoCounterForIsDoneValue isDone={true} />
      <span>Number of unfinished todos:</span>
      <TodoCounterForIsDoneValue isDone={false} />
    </>
  )
}
复制代码
```

## `useDispatch()`

```ini
const dispatch = useDispatch()
复制代码
```

这个Hook返回Redux store中对`dispatch`函数的引用。你可以根据需要使用它。

用法和之前的一样，来看个例子：

```javascript
import React from 'react'
import { useDispatch } from 'react-redux'

export const CounterComponent = ({ value }) => {
  const dispatch = useDispatch()

  return (
    <div>
      <span>{value}</span>
      <button onClick={() => dispatch({ type: 'increment-counter' })}>
        Increment counter
      </button>
    </div>
  )
}
复制代码
```

当使用`dispatch`将回调传递给子组件时，建议使用`useCallback`对其进行记忆，否则子组件可能由于引用的更改进行不必要地呈现。

```javascript
import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'

export const CounterComponent = ({ value }) => {
  const dispatch = useDispatch()
  const incrementCounter = useCallback(
    () => dispatch({ type: 'increment-counter' }),
    [dispatch]
  )

  return (
    <div>
      <span>{value}</span>
      <MyIncrementButton onIncrement={incrementCounter} />
    </div>
  )
}

export const MyIncrementButton = React.memo(({ onIncrement }) => (
  <button onClick={onIncrement}>Increment counter</button>
))
复制代码
```

## `useStore()`

```ini
const store = useStore()
复制代码
```

这个Hook返回redux `<Provider>`组件的`store`对象的引用。

这个钩子应该不长被使用。`useSelector`应该作为你的首选。但是，有时候也很有用。来看个例子：

```javascript
import React from 'react'
import { useStore } from 'react-redux'

export const CounterComponent = ({ value }) => {
  const store = useStore()

  // 仅仅是个例子! 不要在你的应用中这样做.
  // 如果store中的state改变，这个将不会自动更新
  return <div>{store.getState()}</div>
}
复制代码
```

### 性能

前面说了，selector的值改变会造成re-render。但是这个与`connect`有些不同，`useSelector()`不会阻止组件由于其父级re-render而re-render，即使组件的props没有更改。

如果需要进一步的性能优化，可以在`React.memo()`中包装函数组件：

```javascript
const CounterComponent = ({ name }) => {
  const counter = useSelector(state => state.counter)
  return (
    <div>
      {name}: {counter}
    </div>
  )
}

export const MemoizedCounterComponent = React.memo(CounterComponent)
复制代码
```

## Hooks 配方

### 配方: `useActions()`

这个是alpha的一个hook，但是在alpha.4中听取[Dan的建议](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Freduxjs%2Freact-redux%2Fissues%2F1252%23issuecomment-488160930)被移除了。这个建议是基于“binding actions creator”在基于钩子的用例中没啥特别的用处，并且导致了太多的概念开销和语法复杂性。

你可能更喜欢直接使用[useDispatch](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fxiaohesong%2FTIL%2Fnew%2Fmaster%2Ffront-end%2Freact%2Freact-redux%23usedispatch)。你可能也会使用Redux的[`bindActionCreators`](https://link.juejin.cn?target=https%3A%2F%2Fredux.js.org%2Fapi%2Fbindactioncreators)函数或者手动绑定他们，就像这样: `const boundAddTodo = (text) => dispatch(addTodo(text))`。

但是，如果你仍然想自己使用这个钩子，这里有一个现成的版本，它支持将action creator作为单个函数、数组或对象传递进来。

```javascript
import { bindActionCreators } from 'redux'
import { useDispatch } from 'react-redux'
import { useMemo } from 'react'

export function useActions(actions, deps) {
  const dispatch = useDispatch()
  return useMemo(() => {
    if (Array.isArray(actions)) {
      return actions.map(a => bindActionCreators(a, dispatch))
    }
    return bindActionCreators(actions, dispatch)
  }, deps ? [dispatch, ...deps] : deps)
}
复制代码
```

### 配方: `useShallowEqualSelector()`

```javascript
import { shallowEqual } from 'react-redux'

export function useShallowEqualSelector(selector) {
  return useSelector(selector, shallowEqual)
}
复制代码
```

## 使用

现在在hooks组件里，我们不需要写`connect`, 也不需要写`mapStateToProps`， 也不要写`mapDispatchToProps`了，只需要一个`useSelector`。

# 浅比较和深比较

## 基本类型和引用类型的值

ECMAScript 变量可能包含两种不同数据类型的值：基本类型值和引用类型值。**基本类型值**指的是简单的数据段，而**引用类型的值**指那些可能由多个值构成的对象。

在将一个值赋给变量时，解析器必须确定这个值是基本类型值还是引用类型值。

ECMAScript 中有五种基本类型: Undefined、Null、Boolean、Number 和 String。这五种基本数据类型是按值访问的，因为可以操作保存在变量中的实际的值。

引用类型的值是保存在内存中的对象。与其他语言不同，JavaScript 不允许直接访问内存中的位置。也就是说不能直接操作对象的内存空间。在复制保存着对象的某个变量时，操作的是对象的引用。但在为对象添加属性时，操作的是实际的对象。

> 在很多语言中，字符串以对象的形式来表示，因此被认为是引用类型的。ECMAScript 放弃了这一传统

## 浅比较

**浅比较**也称引用相等，在 javascript 中， `===` 是作**浅比较**,只检查左右两边是否是同一个对象的引用：

```js
var m = { a: 1 }
var n = { a: 1 }
console.log(m === n) // false
// 虽然没有赋值给变量，但比较的还是栈内存中的值引用
console.log({ a:1 } === { a:1 }) // false
复制代码
```

> 变量名只是指向栈内存的指针，也就是给这个栈内存取得别名

## 深比较

**深比较**也称原值相等，深比较是指检查两个**对象**的所有属性是否**都相等**,深比较需要以递归的方式遍历两个对象的所有属性，操作比较耗时，深比较不管这两个对象是不是同一对象的引用。

> `_.isEqual`: 执行深比较来确定两者的值是否相等。 注意: 这个方法支持比较 `arrays`, `array buffers`, `booleans`, `date objects`, `error objects`, `maps`, `numbers`, `Object objects`, `regexes`, `sets`, `strings`, `symbols`, 以及 `typed arrays`. Object对象值比较自身的属性，不包括继承的和可枚举的属性。不支持函数和DOM节点比较。

### lodash.isEqual

```js
import _ from 'lodash'
const m = {a:1}
const n = {a:1}
console.log(_.isEqual(m, n)) // true
复制代码
```

### fast-deep-equal

```js
import deepEqual from 'fast-deep-equal'
deepEqual({name:'杨俊宁'},{name:'杨俊宁'}) // true
```





## useSelector第二个参数

useSelector [hooks](https://so.csdn.net/so/search?q=hooks&spm=1001.2101.3001.7020)的第二个参数。useSelector的第二个参数是一个比较函数，比较结果为true是不进行重新渲染，为false才渲染。可以使用react-redux提供的shallowEqual函数、lodash的isEqual()， 或者自己定义的函数

```jsx
import { useSelector, shallowEqual } from 'react-redux'; 

const _obj = useSelector((store: any) => ({      
  aaa: store.xxx.aaa,      
  bbb: store.xxx.bbb, 
}), shallowEqual);

```



# 个人总结

> useselector会监听store变化，进行浅比较，所以reduer函数里必须返回一个新的state，而不是原来的state，否则页面不会变化，不会重新渲染,如果state返回的是原来的state，那么不管如何都不会重新渲染，使用useselector第二个参数也不行，只有返回新的state，才可以用useselector的第二个参数控制重新渲染