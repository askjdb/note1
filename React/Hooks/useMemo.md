## 计数器示例

依然是计数器示例，创建2个计数器，并能区分当前是奇数或者偶数，为了模拟点击按钮时包含大量的计算逻辑影响性能，在判断偶数的方法中添加了没有用的计算逻辑，为了让性能差的明显。代码如下

Counter.tsx

```jsx
import React, { useState } from 'react'

function Counter() {
  const [counterOne, setCounterOne] = useState(0)
  const [counterTwo, setCounterTwo] = useState(0)

  const incrementOne = () => {
    setCounterOne(counterOne + 1)
  }

  const incrementTwo = () => {
    setCounterTwo(counterTwo + 1)
  }

  const isEven = () => {
    let i = 0
    while (i < 1000000000) i += 1
    return counterOne % 2 === 0
  }

  return (
    <div>
      <button
        onClick={incrementOne}
      >Count One = {counterOne}</button>
      <span>
        {
          isEven() ? 'even' : 'odd'
        }
      </span>
      <br />
      <button
        onClick={incrementTwo}
      >Count Two = {counterTwo}</button>
    </div>
  )
}

export default Counter
复制代码
```

App.tsx

```jsx
import React from 'react'
import './App.css'

import Counter from './components/27.Counter'

const App = () => {
  return (
    <div className="App">
      <Counter />
    </div>
  )
}

export default App
复制代码
```

页面展示如下

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/18/1722810b8f2b8042~tplv-t2oaga2asx-zoom-in-crop-mark:4536:0:0:0.awebp)

我们发现点击第一个按钮有较长的延迟，因为我们的判断偶数的逻辑中包含了大量的计算逻辑。但是，我们点击第二个按钮，也有较长的延迟！这很奇怪。

这是因为，每次 state 更新时，组件会 rerender，isEven 会被执行，这就是我们点击第二个按钮时，也会卡的原因。我们需要优化，告诉 React 不要有不必要的计算，特别是这种计算量复杂的。

在我们的示例中，我们要告诉 React，在点击第二个按钮时，不要执行 isEven 方法。这时就需要 useMemo hook 登场了。

## useMemo

### 优化示例

与 useCallback 的用法类似。

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
复制代码
```

> 返回一个 memoized 值。 把“创建”函数和依赖项数组作为参数传入 `useMemo`，它仅会在某个依赖项改变时才重新计算 memoized 值。这种优化有助于避免在每次渲染时都进行高开销的计算。
>
> 记住，传入 `useMemo` 的函数会在渲染期间执行。请不要在这个函数内部执行与渲染无关的操作，诸如副作用这类的操作属于 `useEffect` 的适用范畴，而不是 `useMemo`。
>
> 如果没有提供依赖项数组，`useMemo` 在每次渲染时都会计算新的值。
>
> **你可以把 useMemo 作为性能优化的手段，但不要把它当成语义上的保证。** 将来，React 可能会选择“遗忘”以前的一些 memoized 值，并在下次渲染时重新计算它们，比如为离屏组件释放内存。先编写在没有 useMemo 的情况下也可以执行的代码 —— 之后再在你的代码中添加 useMemo，以达到优化性能的目的。

首先引入 useMemo

```js
import React, { useState, useMemo } from 'react'
复制代码
```

然后将 isEven 方法使用 useMemo 改写，返回值赋给 isEven

```js
const isEven = useMemo(() => {
  let i = 0
  while (i < 1000000000) i += 1
  return counterOne % 2 === 0
}, [counterOne])
复制代码
```

最后记得修改 isEven 使用的地方，已经从一个方法变为了一个变量

```js
{
  isEven ? 'even' : 'odd'
}
复制代码
```

完整代码如下

Counter.tsx

```jsx
import React, { useState, useMemo } from 'react'

function Counter() {
  const [counterOne, setCounterOne] = useState(0)
  const [counterTwo, setCounterTwo] = useState(0)

  const incrementOne = () => {
    setCounterOne(counterOne + 1)
  }

  const incrementTwo = () => {
    setCounterTwo(counterTwo + 1)
  }

  const isEven = useMemo(() => {
    let i = 0
    while (i < 1000000000) i += 1
    return counterOne % 2 === 0
  }, [counterOne])

  return (
    <div>
      <button
        onClick={incrementOne}
      >Count One = {counterOne}</button>
      <span>
        {
          isEven ? 'even' : 'odd'
        }
      </span>
      <br />
      <button
        onClick={incrementTwo}
      >Count Two = {counterTwo}</button>
    </div>
  )
}

export default Counter
复制代码
```

效果如下

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/18/1722810b9c48ecc9~tplv-t2oaga2asx-zoom-in-crop-mark:4536:0:0:0.awebp)

我们看到点击第二个按钮时，不会有任何卡顿，这是因为使用了 useMemo 只依赖了 counterOne 变量，点击第二个按钮时，isEven 读取的是缓存值，不需要再重新计算是否为偶数。

### useMemo 与 useCallback 的区别

useCallback 是缓存了函数自身，而 useMemo 是缓存了函数的返回值。

#### useEffect 和 useMemo 区别

- useEffect是在`DOM改变之后触发`，useMemo在`DOM渲染之前就触发`
- useMemo是在`DOM更新前触发的`，就像官方所说的，类比生命周期就是[shouldComponentUpdate]
- useEffect可以帮助我们在`DOM更新完成后执行某些副作用操作`，如数据获取，设置订阅以及手动更改 React 组件中的 DOM 等
- 不要在这个useMemo函数内部`执行与渲染无关的操作`，诸如`副作用这类的操作属于 useEffect 的适用范畴`，而不是 useMemo
- 在useMemo中使用`setState你会发现会产生死循环`，并且会有警告，因为useMemo是`在渲染中进行的`，你在其中操作`DOM`后，又会导致触发`memo`

#### useCallback 和 useMemo 区别

- 类似 `shouldComponentUpdate`， 判定该组件的 props 和 state 是否有变化，从而避免每次父组件render时都去重新渲染子组件

- `useCallback返回一个函数`，当把它返回的这个函数作为子组件使用时，可以避免每次父组件更新时都重新渲染这个子组件,子组件一般配合 `memo` 使用

- 

- ```pre
  const renderButton = useCallback(
       () => (
           <Button type="link">
              {buttonText}
           </Button>
       ),
       [buttonText]    // 当buttonText改变时才重新渲染renderButton
  );
  
  ```

  - `useMemo返回的的是一个值`，用于避免在每次渲染时都进行高开销的计算

  ```pre
  const result = useMemo(() => {
      for (let i = 0; i < 100000; i++) {
        (num * Math.pow(2, 15)) / 9;
      }
  }, [num]);
  ```

  

## 小结

本章通过示例展示了 useMemo 在性能优化中的作用。通过缓存函数的返回值，避免不必要的调用，从而避免了组件 rerender。

最后有分析了 useMemo 与 useCallback 的区别，即 useMemo 是缓存了函数的返回值，useCallback 是缓存了函数自身。这两个 api 都是性能优化的方法。