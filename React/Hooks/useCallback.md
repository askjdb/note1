## 组件多次被复用的场景

有如下的，组件树结构。ParentWrap 包含 Title 组件、2次使用 Count 组件、2次使用 Button 组件。

点击 Button，对应的 Count 分别会增加。

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/18/17226e2be3884074~tplv-t2oaga2asx-zoom-in-crop-mark:4536:0:0:0.awebp)

App.tsx

```jsx
import React from 'react'
import './App.css'

import ParentComponent from './components/26ParentComponenet'

const App = () => {
  return (
    <div className="App">
      <ParentComponent />
    </div>
  )
}

export default App
复制代码
```

ParentComponent.tsx

```jsx
import React, { useState } from 'react'
import Title from './26Title'
import Count from './26Count'
import Button from './26Button'

function ParentComponenet() {
  const [age, setAge] = useState(29)
  const [salary, setSalary] = useState(50000)
  const incrementAge = () => {
    setAge(age + 1)
  }
  const incrementSalary = () => {
    setSalary(salary + 1000)
  }
  return (
    <div>
      <Title />
      <Count
        text="Age"
        count={age}
      />
      <Button
        handleClick={incrementAge}
      >Increment age</Button>
      <Count
        text="Salary"
        count={salary}
      />
      <Button
        handleClick={incrementSalary}
      >Increment salary</Button>
    </div>
  )
}

export default ParentComponenet
复制代码
```

Title.tsx

```jsx
import React from 'react'

function Title() {
  console.log('Rendering Title')
  return (
    <h2>useCallback</h2>
  )
}

export default Title
复制代码
```

Count.tsx

```jsx
import React from 'react'

function Count(props: {
  text: string
  count: number
}) {
  console.log(`Rendering ${props.text}`)
  return (
    <div>
      {props.text} - {props.count}
    </div>
  )
}

export default Count
复制代码
```

Button.tsx

```jsx
import React from 'react'

function Button(props: {
  handleClick: () => void
  children: string
}) {
  console.log('Rendering button', props.children)
  return (
    <button onClick={props.handleClick}>
      {props.children}
    </button>
  )
}

export default Button
复制代码
```

当然，我们可以将所有的 jsx 代码写在一起，我们这么组织代码的主要原因是让大家理解 react 中的性能优化，以及如何使用 useCallback api 进行性能优化。

页面展示效果如下

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/18/17226e2be38b1a98~tplv-t2oaga2asx-zoom-in-crop-mark:4536:0:0:0.awebp)

而我们要关注到的是性能问题，可以在 console 中看到，每次点击时，看到以下日志：

```css
Rendering Title
Rendering Age
Rendering button Increment age
Rendering Salary
Rendering button Increment salary
复制代码
```

每次状态改变都触发了所有组件的 rerender，这个示例比较简单，但是假如未来遇到20、30、甚至50个组件 rerender 的时候，就一定要考虑到性能问题了。下面讲讲在这个示例中怎么进行优化。

## 使用 React.memo 优化

在本例中，我们当然希望点击增加年龄的按钮时，只有关于年龄的 Count 和 Button 进行 rerender，而其他组件不发生 rerender，点击增加 salary 时也一样。如何才能做到呢？答案是 `React.memo`。

我们给 Title.tsx, Count.tsx, Button.tsx 添加 `React.memo()`，代码如下：

Title.tsx

```jsx
import React from 'react'

function Title() {
  console.log('Rendering Title')
  return (
    <h2>useCallback</h2>
  )
}

export default React.memo(Title)

复制代码
```

Count.tsx

```jsx
import React from 'react'

function Count(props: {
  text: string
  count: number
}) {
  console.log(`Rendering ${props.text}`)
  return (
    <div>
      {props.text} - {props.count}
    </div>
  )
}

export default React.memo(Count)
复制代码
```

Button.tsx

```jsx
import React from 'react'

function Button(props: {
  handleClick: () => void
  children: string
}) {
  console.log('Rendering button', props.children)
  return (
    <button onClick={props.handleClick}>
      {props.children}
    </button>
  )
}

export default React.memo(Button)
复制代码
```

效果如下：

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/18/17226e2be462d40e~tplv-t2oaga2asx-zoom-in-crop-mark:4536:0:0:0.awebp)

> React.memo 为高阶组件。它与 React.PureComponent 非常相似，但只适用于函数组件，而不适用 class 组件。

```js
const MyComponent = React.memo(function MyComponent(props) {
  /* 使用 props 渲染 */
});
复制代码
```

> 如果你的函数组件在给定相同 props 的情况下渲染相同的结果，那么你可以通过将其包装在 React.memo 中调用，以此通过记忆组件渲染结果的方式来提高组件的性能表现。这意味着在这种情况下，React 将跳过渲染组件的操作并直接复用最近一次渲染的结果。
>
> React.memo 仅检查 props 变更。如果函数组件被 React.memo 包裹，且其实现中拥有 useState 或 useContext 的 Hook，当 context 发生变化时，它仍会重新渲染。
>
> 默认情况下其只会对复杂对象做浅层对比，如果你想要控制对比过程，那么请将自定义的比较函数通过第二个参数传入来实现。

```js
function MyComponent(props) {
  /* 使用 props 渲染 */
}
function areEqual(prevProps, nextProps) {
  /*
  如果把 nextProps 传入 render 方法的返回结果与
  将 prevProps 传入 render 方法的返回结果一致则返回 true，
  否则返回 false
  */
}
export default React.memo(MyComponent, areEqual);
复制代码
```

> 此方法仅作为性能优化的方式而存在。但请不要依赖它来“阻止”渲染，因为这会产生 bug。

但是，使用了 React.memo 后，我们看到点击增加年龄的按钮时，日志变为了

```css
Rendering Age
Rendering button Increment age
Rendering button Increment salary
复制代码
```

依然有不相关的 rerender `Rendering button Increment salary`，我们来分析一下。

在 ParentComponenet.tsx 中，我们看到点击 Increment age 按钮时，导致了 state 变化，ParentComponenet 进行了 rerender。`<Title />` 没有传入属性，React.memo 判断出不需要 rerender，但是 Increment salary 按钮上的属性 incrementSalary 方法，实际上被重新创建了，导致了这个 Button 传入的 props 发生了变化，因此 React.memo 没有阻止 rerender。点击按钮 Increment salary 导致的相同的现象也是同理。那么如何解决呢？答案是使用 useCallback hook。

## useCallback

### 什么是 useCallback

```js
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b);
  },
  [a, b],
);
复制代码
```

> 返回一个 memoized 回调函数。
>
> 把内联回调函数及依赖项数组作为参数传入 `useCallback`，它将返回该回调函数的 memoized 版本，该回调函数仅在某个依赖项改变时才会更新。当你把回调函数传递给经过优化的并使用引用相等性去避免非必要渲染（例如 shouldComponentUpdate）的子组件时，它将非常有用。

类比到我们的例子中，useCallback 会缓存我们的 `incrementSalary()` 如果 salary 没有变化，直接返回缓存的incrementSalary()，如果 salary 发生变化，也就是 useCallback 的依赖发生变化，那么一个新的方法将被返回。

这就可以帮助我们解决只依赖某个变量的子组件避免不必要的 render 问题。

### 如何使用 useCallback

步骤如下：

1. import useCallback
2. 调用 useCallback

我们将 ParentComponenet.tsx 中的 incrementAge 和 incrementSalary 使用 useCallback 改写如下：

```js
const incrementAge = useCallback(
  () => {
    setAge(age + 1)
  },
  [age],
)

const incrementSalary = useCallback(
  () => {
    setSalary(salary + 1000)
  },
  [salary],
)
复制代码
```

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/18/17226e2be53124b0~tplv-t2oaga2asx-zoom-in-crop-mark:4536:0:0:0.awebp)

可以看到，已经达到了我们的目的，点击 Increment age 时，salary 的按钮组件也没有 rerender。至此，我们已经完成了所有的性能优化。

### useCallback的返回值

useCallback的返回值是一个memoized回调函数，在它所依赖的参数不变的而情况下，(就是指deps中的参数)返回的回调函数地址不变，如果依赖的参数发生变化，usecallback就会返回一个新的memoized回调函数，这时函数地址也会发生改变，这里稍微多讲点(useCallback的这种形式和createRef,useRef之间的区别有点相似，createRef创建的ref在每次重新执行函数，这里的函数指hook，或者重新更新组件时都会重新去创建ref，这时ref和之前的ref不同，但是通过useRef创建ref就不会出现这个问题，因为useRef创建的ref可以作为全局变量，它不会随着函数重新执行或者组件更新而去重新创建)。

## 小结

本章我们从一个组件多次被复用的的例子说起，一步一步对其进行性能优化，核心是阻止不必要的 rerender。

学习使用了 React.memo 在 props 或 state 没有变化时，阻止组件的 rerender。

学习了什么是 useCallback，如何使用 useCallback 缓存一个方法，只依赖某几个变量变化才更新，避免了每次传递给子组件的 props 都被更新，最终也是阻止了子组件不必要的 rerender。