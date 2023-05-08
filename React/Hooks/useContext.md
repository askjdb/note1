## 什么是 Context Api

考虑这样一种场景，如果组件树结构如下，现在想从根节点传递一个 userName 的属性到叶子节点 A D F，通过 props 的方式传递，会不可避免的传递通过 B C E，即使这些组件也没有使用这个 userName 属性。

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/11/17202eed8258da00~tplv-t2oaga2asx-zoom-in-crop-mark:1512:0:0:0.awebp)

如果这样的嵌套树形结构有5层或10层，那么将是灾难式的开发维护体验。如果能不经过中间的节点直接到达需要的地方就可以避免这种问题，这时 Context api 就是来解决这个问题的。

Context api 是在组件树中传递数据但不用每层都经过的一种 api。下面我们一起看看 Context Hook 的使用方法。

## 使用 Context

我们举个例子重点看下最右边的分支，C E F，从根节点传递一个变量 username 到 F 节点。

我们先创建好 App, ComponentC, ComponentE, ComponentF, 如下

App.tsx

```jsx
import React from 'react'

import './App.css'

import ComponentC from './components/16ComponentC'

const App = () => {
  return (
    <div className="App">
      <ComponentC />
    </div>
  )
}

export default App
复制代码
```

ComponentC.tsx

```jsx
import React from 'react'

import ComponentE from './16ComponentE'

function ComponentC() {
  return (
    <div>
      <ComponentE />
    </div>
  )
}

export default ComponentC

复制代码
```

ComponentE.tsx

```jsx
import React from 'react'

import ComponentF from './16ComponentF'

function ComponentE() {
  return (
    <div>
      <ComponentF />
    </div>
  )
}

export default ComponentE

复制代码
```

ComponentF.tsx

```jsx
import React from 'react'

function ComponentF() {
  return (
    <div>
      ComponentF
    </div>
  )
}

export default ComponentF
复制代码
```

页面展示如下：

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/11/17202eed83485b44~tplv-t2oaga2asx-zoom-in-crop-mark:1512:0:0:0.awebp)

接下来我们来研究如何使用 Context 将 username 从 App 传递到 ComponentF，共分为以下3个步骤

### 创建 context

在根节点 App.tsx 中使用 `createContext()` 来创建一个 context

```js
const UserContext = React.createContext('')
复制代码
```

> 创建一个 Context 对象。当 React 渲染一个订阅了这个 Context 对象的组件，这个组件会从组件树中离自身最近的那个匹配的 Provider 中读取到当前的 context 值。
>
> 只有当组件所处的树中没有匹配到 Provider 时，其 defaultValue 参数才会生效。这有助于在不使用 Provider 包装组件的情况下对组件进行测试。注意：将 undefined 传递给 Provider 的 value 时，消费组件的 defaultValue 不会生效。

### 提供 Provider

在根节点中使用 Provider 包裹子节点，将 context 提供给子节点

```js
<UserContext.Provider value={'chuanshi'}>
  <ComponentC />
</UserContext.Provider>
复制代码
```

> 每个 Context 对象都会返回一个 Provider React 组件，它允许消费组件订阅 context 的变化。
>
> Provider 接收一个 `value` 属性，传递给消费组件。一个 Provider 可以和多个消费组件有对应关系。多个 Provider 也可以嵌套使用，里层的会覆盖外层的数据。
>
> 当 Provider 的 `value` 值发生变化时，它内部的所有消费组件都会重新渲染。Provider 及其内部 consumer 组件都不受制于 `shouldComponentUpdate` 函数，因此当 consumer 组件在其祖先组件退出更新的情况下也能更新。
>
> 通过新旧值检测来确定变化，使用了与 Object.is 相同的算法。

别忘了将之前定义好的 Context export 出去，以便在子孙节点中引入

```js
export const UserContext = React.createContext('')
复制代码
```

此时 App.tsx 的完整代码为

```jsx
import React from 'react'

import './App.css'

import ComponentC from './components/16ComponentC'

export const UserContext = React.createContext('')

const App = () => {
  return (
    <div className="App">
      <UserContext.Provider value={'chuanshi'}>
        <ComponentC />
      </UserContext.Provider>
    </div>
  )
}

export default App
复制代码
```

### 在使用的节点处消费 Context

import context 对象

```js
import { UserContext } from '../App'
复制代码
```

使用 Consumer 进行消费

```jsx
<UserContext.Consumer>
  {
    (user) => (
      <div>
        User context value {user}
      </div>
    )
  }
</UserContext.Consumer>
```

> 这里，React 组件也可以订阅到 context 变更。这能让你在函数式组件中完成订阅 context。
>
> 这需要函数作为子元素（function as a child）这种做法。这个函数接收当前的 context 值，返回一个 React 节点。传递给函数的 value 值等同于往上组件树离这个 context 最近的 Provider 提供的 value 值。如果没有对应的 Provider，value 参数等同于传递给 createContext() 的 defaultValue。

完整的 ComponentF.tsx 代码如下

```jsx
import React from 'react'

import { UserContext } from '../App'

function ComponentF() {
  return (
    <div>
      <UserContext.Consumer>
        {
          (user) => (
            <div>
              User context value {user}
            </div>
          )
        }
      </UserContext.Consumer>
    </div>
  )
}

export default ComponentF
复制代码
```

效果如下

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/11/17202eed9e94c4d7~tplv-t2oaga2asx-zoom-in-crop-mark:1512:0:0:0.awebp)

目前看只有1个 Context 的时候情况还好，下面我们来看看有多个 Context 的情况

### 多个 Context 情况

我们在 App.tsx 中再增加一个 Context

```jsx
import React from 'react'

import './App.css'

import ComponentC from './components/16ComponentC'

export const UserContext = React.createContext('')
export const ChannelContext = React.createContext('')

const App = () => {
  return (
    <div className="App">
      <UserContext.Provider value={'chuanshi'}>
        <ChannelContext.Provider value={'code volution'}>
          <ComponentC />
        </ChannelContext.Provider>
      </UserContext.Provider>
    </div>
  )
}

export default App
复制代码
```

接下来在 component F 中消费它们

```jsx
import React from 'react'

import { UserContext, ChannelContext } from '../App'

function ComponentF() {
  return (
    <div>
      <UserContext.Consumer>
        {
          (user) => (
            <ChannelContext.Consumer>
              {
                (channel) => (
                  <div>
                    User context value {user}, channel value {channel}
                  </div>
                )
              }
            </ChannelContext.Consumer>

          )
        }
      </UserContext.Consumer>
    </div>
  )
}

export default ComponentF
复制代码
```

页面展示如下

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/11/17202eed84d8178e~tplv-t2oaga2asx-zoom-in-crop-mark:1512:0:0:0.awebp)

虽然代码运行没有问题，但是美观性和可读性都不太好，如果使用多个 Context，有个更好的方法，就是使用 Context hook 来解决消费多个 Context 的代码优雅问题。

## useContext

举个例子，我们在上述的 demo 中的 component E 中通过 `useContext` 使用根节点创建的 Context。分为以下步骤

1. 从 react 对象中 import `useContext` 这个 hook api
2. import 根节点创建的 Context 对象（可以导入多个）
3. 执行 `useContext()` 方法，将 Context 传入

ComponentE 完整代码:

```jsx
import React, { useContext } from 'react'

import ComponentF from './16ComponentF'
import {UserContext, ChannelContext} from '../App'

function ComponentE() {
  const user = useContext(UserContext)
  const channel = useContext(ChannelContext)
  return (
    <div>
      <ComponentF />
      --- <br/>
      {user} - {channel}
    </div>
  )
}

export default ComponentE
```

页面展示如下

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/11/17202eed851c6f89~tplv-t2oaga2asx-zoom-in-crop-mark:1512:0:0:0.awebp)

其关键的一行代码如下

```js
const value = useContext(MyContext)
```

> useContext 方法接收一个 context 对象（`React.createContext` 的返回值）并返回该 context 的当前值。当前的 context 值由上层组件中距离当前组件最近的 `<MyContext.Provider>` 的 `value` prop 决定。
>
> 当组件上层最近的 `<MyContext.Provider>` 更新时，该 Hook 会触发重渲染，并使用最新传递给 `MyContext` provider 的 context `value` 值。即使祖先使用 `React.memo` 或 `shouldComponentUpdate`，也会在组件本身使用 `useContext` 时重新渲染。
>
> 可以理解为，`useContext(MyContext)` 相当于 class 组件中的 `static contextType = MyContext` 或者 `<MyContext.Consumer>`。
>
> `useContext(MyContext)` 只是让你能够读取 context 的值以及订阅 context 的变化。你仍然需要在上层组件树中使用 `<MyContext.Provider>` 来为下层组件提供 context。

至此，关于 useContext hook api 我们已经掌握了使用方式，可以看到通过 useContext 可以极大的减小多个 Context 使用的代码复杂的问题。

## 用typescript写React Context案例详细讲解

### Context.Provider

首选建议单独写一个文件放Context容器，该文件要导出2个东西，一是数据类型、二是容器组件。

#### ThemeContext.tsx文件代码：

##### 函数组件：

```tsx
import React, { createContext, useState } from "react";

// 创建context，约定数据类型，设置初始值
export const ThemeCtx = createContext<{
    color: string,
    setColor: (color:string)=>void,
} | null>(null)

// ContextProvide组件
const ThemeProvide: React.FC<{
    children: React.ReactNode[]
}> = (props) => {
    const [color, setColor] = useState("red")

    return (
        <ThemeCtx.Provider value={{ color, setColor }}>
            {props.children}
        </ThemeCtx.Provider>
    );
};

export default ThemeProvide
```

##### 类组件：

```tsx
import React, { createContext } from "react";

// 创建context，约定数据类型，设置初始值
export const ThemeCtx = createContext<{
    color: string,
    setColor: (color:string)=>void,
} | null>(null);

type Props = {
    children: React.ReactNode[]
}
type State = {
    color: string,
    setColor: (color:string)=>void,
}

class ThemeProvide extends React.Component<Props,State>{
    constructor(props: Props) {
        super(props);
        this.state = { color: "blue", setColor: (color: string) => this.setState({...this.state,color}) };
    }

    render() {
        const { color, setColor } = this.state
        return (
            <ThemeCtx.Provider value={{ color, setColor }}>
                {this.props.children}
            </ThemeCtx.Provider>
        );
    }
}

export default ThemeProvide;
```

### 代码讲解：

1. 在创建Context要写初始值，但执行createContext时更新初始值的函数还没有拿到，所以建议类型加个null初始值写null。
2. Provider内部可能有多个子组件，所以它的children类型应该定义为React.ReactNode[]。
3. 从上述函数组件和类组件代码对比可以看出，实现同样功能使用函数组件比用类组件代码少很多行。

## Context.Consumer

真心不建议使用Context.Consumer包一层的方式拿数据，太不灵活了！建议拿数据的方式如下，注意类组件和函数组件拿数据的方式有不同。

#### App.tsx文件代码：

```tsx
import React, { useContext } from "react"
import ThemeContext, { ThemeCtx } from "./类式组件/ThemeContext"


class Show extends React.Component {
    static contextType = ThemeCtx;
    context!: React.ContextType<typeof ThemeCtx>
    render() {
        return (
            <div style={{ color: this.context?.color }}>展示内容，字体颜色可切换！</div>
        )
    }
}


const Button: React.FC = () => {
    const { color, setColor } = useContext(ThemeCtx)!
    return (
        <button
        onClick={() => (color === "red" ? setColor("blue") : setColor("red"))}
    >
        点我切换颜色
    </button>
    )
}


export default function App() {
    return (
        <ThemeContext>
            <Show />
            <Button />
        </ThemeContext>
    );
}
```

### 代码讲解：

1. 函数组件使用useContext拿数据，直接可以获得数据类型，注意useContext函数后面的感叹号，如果不加typescript会报数据可能为null。
2. 类组件使用`static contextType = ThemeCtx`绑定context即可通过this.context拿到数据。注意：这样拿到的数据类型是unknown，在后面使用时非常不方便，所以必须加1行代码`context!: React.ContextType<typeof ThemeCtx>`，如果写的是jsx那么这行代码不用加。

## 性能优化

#### 代码示例

```tsx
import { useState, useContext, createContext, useMemo } from "react";

const ThemeCtx = createContext<{
  theme: string;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
} | null>(null);

const ThemeProvide: React.FC<{
  children: React.ReactNode[];
}> = (props) => {
  const [theme, setTheme] = useState("dark");

  return (
    <ThemeCtx.Provider value={{ theme, setTheme }}>
      {props.children}
    </ThemeCtx.Provider>
  );
};

const Theme = () => {
  const ctx = useContext(ThemeCtx);
  const { theme } = ctx!;
  return <div>theme: {theme}</div>;
};

const ChangeButton = () => {
  const ctx = useContext(ThemeCtx);
  const { setTheme } = ctx!;
  const dom = useMemo(() => {
    console.log("ChangeButton被渲染！！！");
    return (
      <div>
        <button
          onClick={() => setTheme((v) => (v === "light" ? "dark" : "light"))}
        >
          改变theme
        </button>
      </div>
    );
  }, [setTheme]);
  return dom;
};

const Other = () => {
  console.log("Other组件被渲染！！！");
  return <div>other组件，没消费Context数据</div>;
};

export default function App() {
  return (
    <ThemeProvide>
      <ChangeButton />
      <Theme />
      <Other />
    </ThemeProvide>
  );
}
```

#### 讲解

react Context是发布订阅机制的数据共享，被Context.Provider包围住的Context.Consumer子节点会在Provider数据变更时统统会重新渲染。需要注意避免重复渲染，对于有些Context.consumer只做更新不消费数据的组件，可以用memo包一下，另外不能直接把Context.Provider写在App里，这样会造成重复渲染，建议将Context.Provider单独写一个组件，App再引入这个组件，这样可以避免重复渲染。

## 多层Context

#### 代码

```tsx
import { useState, useContext, createContext, useMemo } from "react";

const ColorCtx = createContext<{
  color: string;
  setColor: React.Dispatch<React.SetStateAction<string>>;
} | null>(null);

const ColorProvide: React.FC<{
  children: React.ReactNode[] | React.ReactNode;
}> = (props) => {
  const [color, setColor] = useState("red");

  return (
    <ColorCtx.Provider value={{ color, setColor }}>
      {props.children}
    </ColorCtx.Provider>
  )
}

const BackgroundCtx = createContext<{
  background: string;
  setBackground: React.Dispatch<React.SetStateAction<string>>;
} | null>(null);

const BackgroundProvide: React.FC<{
  children: React.ReactNode[] | React.ReactNode;
}> = (props) => {
  const [background, setBackground] = useState("black");

  return (
    <BackgroundCtx.Provider value={{ background, setBackground }}>
      {props.children}
    </BackgroundCtx.Provider>
  )
}

const Color = () => {
  const ctx1 = useContext(ColorCtx);
  const { color } = ctx1!;
  const ctx2 = useContext(BackgroundCtx);
  const { background } = ctx2!;
  return <div style={{ color, background }}>这段文字的字体颜色和背景颜色会变换</div>;
};

const ChangeButton = () => {
  const ctx1 = useContext(ColorCtx);
  const { setColor } = ctx1!;
  const ctx2 = useContext(BackgroundCtx);
  const { setBackground } = ctx2!;
  const dom = useMemo(() => {
    console.log("ChangeButton被渲染！！！");
    return (
      <div>
        <button
          onClick={() => setColor(value => value === "red" ? "blue" : "red")}
        >
          改变字体颜色
        </button>
        <button
          onClick={() => setBackground(value => value === "black" ? "gray" : "black")}
        >
          改变背景颜色
        </button>
      </div>
    );
  }, [setColor, setBackground]);
  return dom;
};

const Other = () => {
  console.log("Other组件被渲染！！！");
  return <div>other组件，没消费Context数据</div>;
};

export default function App() {
  return (
    <ColorProvide>
      <BackgroundProvide>
        <br />
        <br />
        <Color />
        <br />
        <ChangeButton />
        <br />
        <Other />
      </BackgroundProvide>
    </ColorProvide>
  );
}
```

#### 讲解

多层Context非常简单，用法看上面的代码，没啥特别的。
