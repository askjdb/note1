## useEffect 简介

首先介绍两个概念，纯函数和副作用函数。

- 纯函数（ Pure Function ）：对于相同的输入，永远会得到相同的输出，而且没有任何可观察的副作用，这样的函数被称为纯函数。
- 副作用函数（ Side effect Function ）：如果一个函数在运行的过程中，除了返回函数值，还对主调用函数产生附加的影响，这样的函数被称为副作用函数。 `useEffect` 就是在 React 更新 DOM 之后运行一些额外的代码，也就是执行副作用操作，比如请求数据，设置订阅以及手动更改 React 组件中的 DOM 等。

## 正确使用 useEffect

基本使用方法：`useEffect(effect) `

根据传参个数和传参类型，`useEffect(effect)` 的执行次数和执行结果是不同的，下面一一介绍。

- 默认情况下，`effect` 会在每次渲染之后执行。示例如下：

```js
useEffect(() => {
  const subscription = props.source.subscribe();
  return () => {
    // 清除订阅
    subscription.unsubscribe();
  };
});
复制代码
```

- 也可以通过设置第二个参数，依赖项组成的数组 ` useEffect(effect,[])` ，让它在数组中的值发生变化的时候执行，数组中可以设置多个依赖项，其中的任意一项发生变化，`effect` 都会重新执行。示例如下：

```js
useEffect(
  () => {
    const subscription = props.source.subscribe();
    return () => {
      subscription.unsubscribe();
    };
  },
  [props.source],
);
复制代码
```

**需要注意的是**：当依赖项是引用类型时，React 会对比当前渲染下的依赖项和上次渲染下的依赖项的内存地址是否一致，如果一致，`effect` 不会执行，只有当对比结果不一致时，`effect` 才会执行。[示例如下 (点击在线测试)](https://link.juejin.cn?target=https%3A%2F%2Fcodesandbox.io%2Fs%2Fgracious-dew-yr3gb%3Ffile%3D%2Fsrc%2FApp.js)：

```js
function Child(props) {
  
  useEffect(() => {
    console.log("useEffect");
  }, [props.data]);
  
  return <div>{props.data.x}</div>;
}

let b = { x: 1 };

function Parent() {
  const [count, setCount] = useState(0);
  console.log("render");
  return (
    <div>
      <button
        onClick={() => {
          b.x = b.x + 1;
          setCount(count + 1);
        }}
      >
        Click me
      </button>
      <Child data={b} />
    </div>
  );
}
复制代码
```

结果如下：

![useEffect1.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6dcb5ea27a64437b824a714378a8de45~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

上面实例中，组件 `<Child/>` 中的 `useEffect` 函数中的依赖项是一个对象，当点击按钮对象中的值发生变化，但是传入 `<Child/> ` 组件的内存地址没有变化，所以 `console.log("useEffect") `不会执行，useEffect 不会被打印。为了解决这个问题，我们可以使用对象中的属性作为依赖，而不是整个对象。把上面示例中组件 `<Child/>` 修改如下：

```js
function Child(props) {
  
  useEffect(() => {
    console.log("useEffect");
  }, [props.data.x]);
  
  return <div>{props.data.x}</div>;
}
复制代码
```

修改后结果如下：

![useEffect2.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b1b985512b644cc098de1ff032217de4~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

可见 `useEffect` 函数中的 `console.log("useEffect")` 被执行，打印出 useEffect。

- 当依赖项是一个空数组 [] 时 , `effect` 只在第一次渲染的时候执行。

## useEffect 的执行时机

默认情况下，`effect` 在第一次渲染之后和每次更新之后都会执行，也可以是只有某些值发生变化之后执行，重点在于是**每轮渲染结束后延迟调用（ 异步执行 ）**，这是 `useEffect` 的好处，保证执行 `effect `的时候，DOM 都已经更新完毕，不会阻碍 DOM 渲染，造成视觉阻塞。

## useEffect 和 useLayoutEffect 的区别

`useLayoutEffect` 的使用方法和 `useEffect` 相同，区别是他们的执行时机。

如上面所说，`effect` 的内容是会在渲染 DOM 之后执行，然而并非所有的操作都能被放在 `effect` 都延迟执行的，例如，在浏览器执行下一次绘制前，需要操作 DOM 改变页面样式，如果放在 `useEffect` 中执行，会出现闪屏问题。而 `useLayoutEffect` 是在**浏览器执行绘制之前被同步执行**，放在 `useLayoutEffect` 中就会避免这个问题。

这篇文章中可以清楚的看到上述例子的具体实现：[useEffect 和 useLayoutEffect 的区别](https://link.juejin.cn?target=https%3A%2F%2Fwww.jianshu.com%2Fp%2F412c874c5add)

## 对比 useEffect 和生命周期

如果你熟悉生命周期函数，你可能会用生命周期的思路去类比思考 `useEffect` 的执行过程，但其实并不建议这么做，因为 `useEffect` 的心智模型和 `componentDidMount` 等其他生命周期是不同的。

Function 组件中不存在生命周期，React 会根据我们当前的 props 和 state 同步 DOM ，每次渲染都会被固化，包括 state、props、side effects 以及写在 Function 组件中的所有函数。

另外，大多数 `useEffect` 函数不需要同步执行，不会像 `componentDidMount` 或 `componentDidUpdate` 那样阻塞浏览器更新屏幕。

所以 `useEffect` 可以被看作是每一次渲染之后的一个独立的函数 ，可以接收 props 和 state ，并且接收的 props 和 state 是当次 render 的数据，是独立的 。相对于生命周期 `componentDidMount` 中的 this.state 始终指向最新数据， `useEffect` 中不一定是最新的数据，更像是渲染结果的一部分 —— 每个 `useEffect` 属于一次特定的渲染。对比示例如下：

- 在 Function 组件中使用  `useEffect` ，[代码示例 (点击在线测试)](https://link.juejin.cn?target=https%3A%2F%2Fcodesandbox.io%2Fs%2Ffervent-kowalevski-f54ok%3Ffile%3D%2Fsrc%2FApp.js)：

```js
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      console.log(`You clicked ${count} times`);
    }, 3000);
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
复制代码
```

结果如下：

![useEffect3.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c4de346327714bf78dfe9023aa926ccf~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

- 在 Class 组件中的使用生命周期，代码示例如下：

```js
 componentDidUpdate() {
    setTimeout(() => {
      console.log(`You clicked ${this.state.count} times`);
    }, 3000);
  }
复制代码
```

结果如下：

![useEffect4.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9ef14171481d4958961ee78e0c6c634a~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

但是每次渲染之后都去执行 `effect` 并不高效。所以怎么解决呢 ？这就需要我们告诉 React 对比依赖来决定是否执行 `effect` 。

## 如何准确绑定依赖

在 `effect` 中用到了哪些外部变量，都需要如实告诉 React ，那如果没有正确设置依赖项会怎么样呢 ？示例如下 ：

![useEffect5.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5d10b3ef8c5f468da2e6ed059bdee17f~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

上面例子中， `useEffect` 中用到的依赖项 `count`，却没有声明在卸载依赖项数组中，`useEffect` 不会再重新运行（只打印了一次 useEffect ）， `effect` 中 `setInterVal` 拿的 `count` 始终是初始化的 0 ，它后面每一秒都会调用 `setCount(0 + 1)` ，得到的结果始终是 1 。下面有两种可以正确解决依赖的方法：

### 1.在依赖项数组中包含所有在 effect 中用到的值

将 `effect` 中用到的外部变量 `count` 如实添加到依赖项数组中，结果如下：

![useEffect6.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2318ce39eb3a4050b1b7e47b2fe72a66~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

可以看到依赖项数组是正确的，并且解决了上面的问题，但是也可以发现，随之带来的问题是：定时器会在每一次 `count` 改变后清除和重新设定，重复创建/销毁，这不是我们想要的结果。

### 2.第二种方法是修改 effect 中的代码来减少依赖项

即修改 `effect` 内部的代码让 `useEffect` 使得依赖更少，需要一些移除依赖常用的技巧，如： `setCount` 还有一种函数回调模式，你不需要关心当前值是什么，只要对 “旧的值” 进行修改即可，这样就不需要通过把 `count` 写到依赖项数组这种方式来告诉 React 了，因为 React 已经知道了，示例如下：

![useEffect7.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7d0aa8a2177c4bf38d056c763a1c446d~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

## 是否需要清除副作用

若只是在 React 更新 DOM 之后运行一些额外的代码，比如发送网络请求，手动变更 DOM，记录日志，无需清除操作，因为执行之后就可以被忽略。

需要清除的是指那些执行之后还有后续的操作，比如说监听鼠标的点击事件，为防止内存泄漏清除函数将在组件卸载之前调用，可以通过 `useEffect` 的返回值销毁通过 `useEffect` 注册的监听。

清除函数执行时机是在新的渲染之后进行的，[示例如下（点击在线测试）](https://link.juejin.cn?target=https%3A%2F%2Fcodesandbox.io%2Fs%2Fquizzical-paper-3frj2%3Ffile%3D%2Fsrc%2FApp.js)：

```js
const Example = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("useEffect");
    return () => {
      console.log("return");
    };
  }, [count]);

  return (
    <div>
      <p>You Click {count} times </p>
      {console.log("dom")}
      <button
        onClick={() => {
          setCount(count + 1);
        }}
      >
        Click me
      </button>
    </div>
  );
};
复制代码
```

结果如下：

![useEffect8.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/528c4b0432c04f95be02b144e4b02f8a~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

**需要注意的是**：`useEffect` 的清除函数在每次重新渲染时都会执行，而不是只在卸载组件的时候执行 。



# React 简析useEffect return执行时机

```abap
import React, { useState } from "react";
import ReactDOM from "react-dom";

function App() {
  const [n, setN] = useState(0);
  const onClick = () => {
    setN(n + 1);
  };
  React.useEffect(() => {
    console.log("App");
    return () => {
      console.log("App挂了");
    };
  });
  return (
    <div className="App">
      <h1>n: {n}</h1>
      <button onClick={onClick}>+1</button>
      {/* {n % 2 === 0 ? <B /> : ""} */}
      <B />
    </div>
  );
}

function B() {
  const [m, setM] = useState(0);
  const onClick = () => {
    setM(m + 1);
  };
  React.useEffect(() => {
    console.log("B");
    return () => {
      console.log("B挂了");
    };
  });
  return (
    <div>
      B组件
      <h1>m: {m}</h1>
      <button onClick={onClick}>+1</button>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```

注意点：**useEffect 是在render结束之后才执行的。**

组件 App 首次渲染后，先执行 console.log("B"); 再执行 console.log("App")

当执行 n + 1 之后，先执行 console.log("B挂了")，再执行执行 console.log("B")， 再执行 console.log("App挂了")， 最后执行console.log("App")， 程序结束。

当执行 m + 1 之后，先执行console.log("B挂了")，再执行console.log("B")， 程序结束。

当组件 App内，使用 useState 创建的变量，发生变化时，会造成重新render，也就导致原组件（包含子组件）的销毁，以及新组件（包含子组件）的诞生。

可以得出，**每次重新渲染，都会导致原组件（包含子组件）的销毁，以及新组件（包含子组件）的诞生**。

**结论**：

1、首先渲染，并不会执行useEffect中的 return

2、变量修改后，导致的重新render，会先执行 useEffect 中的 return，再执行useEffect内除了return部分代码。

3、return 内的回调，可以用来清理遗留垃圾，比如订阅或计时器 ID 等占用资源的东西。

代码例子 ：[https://codesandbox.io/s/festive-wilbur-ds0tsm?file=/src/index.js:0-869](https://link.zhihu.com/?target=https%3A//codesandbox.io/s/festive-wilbur-ds0tsm%3Ffile%3D/src/index.js%3A0-869)

示例用途：[react hook 中useEffect返回的函数是在什么时候执行](https://link.zhihu.com/?target=https%3A//segmentfault.com/q/1010000021397269)