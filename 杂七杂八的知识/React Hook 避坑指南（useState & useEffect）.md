# React Hook 避坑指南（useState & useEffect）

## useState

```tsx
tsx
复制代码const [state, setState] = useState(initialState);
```

- 返回一个 state，以及更新 state 的函数。
- 在初始渲染期间，返回的状态 (`state`) 与传入的第一个参数 (`initialState`) 值相同。
- `setState` 函数用于更新 state。它接收一个新的 state 值并将组件的一次重新渲染加入队列。

#### state的更新

​	通过 `setState` 方法可以更新state。例如：[查看在线示例](https://link.juejin.cn?target=https%3A%2F%2Fcodesandbox.io%2Fs%2Fgracious-shadow-8mvfb8%3Ffile%3D%2Fsrc%2Fhooks%2FuseState%2FDemo1.js)

```tsx
const [count, setCount] = useState(0);

function handleOnClick() {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
}

return (
    <div>
        <div>
            count: {count}
        </div>
        <button onClick={handleOnClick}>
            +1
        </button>
    </div>
);
```

​	如果点击按钮后连续调用3次 `setCount(count + 1)`，你会发现界面上count的值并没有 +3，仍然是 + 1。

**函数式更新**

​	如果新的 state 需要通过使用先前的 state 计算得出，那么可以将函数传递给 `setState`。该函数将接收先前的 state，并返回一个更新后的值。

```tsx
setCount(count => count + 1);
setCount(count => count + 1);
setCount(count => count + 1);
```

#### 更新对象

当useState的值为对象时，可能会存在视图不更新的情况，例如：[查看在线示例](https://link.juejin.cn?target=https%3A%2F%2Fcodesandbox.io%2Fs%2Fgracious-shadow-8mvfb8%3Ffile%3D%2Fsrc%2Fhooks%2FuseState%2FObject.js)

```tsx
const [list, setList] = useState([0, 1, 2]);
const [useInfo, setUserInfo] = useState({
    name: "张三",
    age: 18
});

function handleOnClick() {
    list.push(4);
    list.push(4);
    setList(list);

    useInfo.name = "李四";
    useInfo.age = 20;
    setUserInfo(useInfo);
}

return (
    <div>
        <p>姓名：{useInfo.name}</p>
        <p>年龄：{useInfo.age}</p>
        <p>ist.length: {list.length}</p>
        <button onClick={handleOnClick}>
            修改
        </button>
    </div>
);
```

**问题原因**：React 中默认是浅监听，当state的值为对象时，栈中存的是对象的引用（地址），setState改变的是堆中的数据，栈中的地址还是原地址，React浅监听到地址没变，故会认为State并未改变，所以没有重渲染页面。

**解决方案**：只要改变了原对象的地址即可，可通过以下几种方式实现

- 将原对象进行克隆
- 使用ES6的拓展运算符

对于数组我们可以使用一些数组自身的方法来进行深拷贝：

```tsx
// 使用Array.slice
const nextList = list.slice(0);
nextList.push("slice");
setList(nextList);

// 使用Array.concat
const nextList = list.concat();
nextList.push("concat");
setList(nextList);
```

**总结**：无论是在 `useState` 中，还是传入函数中的参数，都不要直接去操作对象本身，先克隆出一份来再操作，避免引起一些意想不到的问题。

#### 无法在setSate后拿到最新的值

​	由于setSate后并不会立即更新，React会在某个时候将多个 setSate进行合并后再更新。因此无法在 setState后拿到最新的值。一般有以下几种方式可以拿到最新值：

- 使用 `useRef` ，但是数据的更新不会引起视图的更新
- 使用 `useEffect` ，这种方式在很多场景下也不适用，每次更新都会执行 `useEffect` 中的内容，往往我们在需求并不是如此
- 使用函数式更新
- 使用 ahooks 的 `useGetState`    【原理：使用useRef将useState的值存起来】

[查看在线示例](https://link.juejin.cn?target=https%3A%2F%2Fcodesandbox.io%2Fs%2Fgracious-shadow-8mvfb8%3Ffile%3D%2Fsrc%2Fhooks%2FuseState%2FGetNewestValue.js)

```tsx
const [count, setCount] = useState(0);
const countRef = useRef(0);

useEffect(() => {
    console.log("useEffect", count);
}, [count]);

function handleOnClick() {
    countRef.current += 1;
    setCount(count + 1);
    console.log("正常打印", count);
    console.log("countRef", countRef.current);
    setCount(count => {
        console.log("函数式更新获取最新值", count);
        return count;
    });
}

return (
    <div>
        <div>
            count: {count}
        </div>
        <button onClick={handleOnClick}>
            +1
        </button>
    </div>
);
```

[查看在线示例](https://link.juejin.cn?target=https%3A%2F%2Fcodesandbox.io%2Fs%2Fgracious-shadow-8mvfb8%3Ffile%3D%2Fsrc%2Fhooks%2FuseState%2FuseGetState.js)

```tsx
const useGetState = (initiateState) => {
      const [state, setState] = useState(initiateState);
      const stateRef = useRef(state);
      stateRef.current = state;
    
      const getState = useCallback(() => stateRef.current, []);
    
      return [state, setState, getState];
};
```

#### 定时器中获取最新值

​		在下面的例子中，无论是视图还是打印，count 的值永远都是0。 [查看在线示例](https://link.juejin.cn?target=https%3A%2F%2Fcodesandbox.io%2Fs%2Fgracious-shadow-8mvfb8%3Ffile%3D%2Fsrc%2Fhooks%2FuseState%2FSetInterval.js)

```tsx
const [count, setCount] = useState(0);
useEffect(() => {
    const interval = setInterval(() => {
        console.log(count);
        setCount(count + 1);
    }, 1000);
    return () => {
        clearInterval(interval);
    }
}, []);
```

​		**问题原因**：定时器在创建后一直都没有被清除，因此内部获取的状态始终都是创建时state的状态

​		**解决方案**：

​			    （1）定时器内部更新state使用函数式更新，函数式更新可以获取到state的最新状态。此方法可以解决视图更新问题，但是在定时器中的打印仍然是0。

​				（2）将state作为 `useEffect` 的依赖，state发生变化后会重新创建定时器

## useEffect

> 如果你熟悉 React class 的生命周期函数，你可以把 `useEffect` Hook 看做 `componentDidMount`，`componentDidUpdate` 和 `componentWillUnmount` 这三个函数的组合。

与 `componentDidMount`、`componentDidUpdate` 不同的是，传给 `useEffect` 的函数会在浏览器完成布局与绘制**之后**，在一个延迟事件中被调用。这使得它适用于许多常见的副作用场景，比如设置订阅和事件处理等情况，因为绝大多数操作不应阻塞浏览器对屏幕的更新。[查看官方文档](https://link.juejin.cn?target=https%3A%2F%2Fzh-hans.reactjs.org%2Fdocs%2Fhooks-reference.html%23timing-of-effects)

```tsx
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    // Update the document title using the browser API
    document.title = `You clicked ${count} times`;
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
```

`useEffect` 在每次渲染后都会执行，包括**第一次渲染后和每次更新**。**React 保证了每次运行 effect 的同时，DOM 都已经更新完毕。**

可以通过第二个参数来控制 `useEffect` 在什么情况下才执行：[查看在线示例](https://link.juejin.cn?target=https%3A%2F%2Fcodesandbox.io%2Fs%2Fgracious-shadow-8mvfb8%3Ffile%3D%2Fsrc%2Fhooks%2FuseEffect%2Fdemo1.js)

```tsx
import { useState, useEffect } from "react";

export default () => {
  const [count, setCount] = useState(0);
  const [number, setNumber] = useState(0);

  // 没有任何依赖，每次重新渲染都要执行
  useEffect(() => {
    console.log("null", count);
  });

  // 依赖值为空，只在第一次渲染后执行一次
  useEffect(() => {
    console.log("[]", count);
  }, []);

  // 只有依赖值发生变化后，才会执行；第一次渲染也会执行
  useEffect(() => {
    console.log("count", count);
  }, [count]);

  function addCount() {
    setCount(count + 1);
  }

  function addNumber() {
    setNumber(number + 1);
  }

  return (
    <div>
      <div>count: {count}</div>
      <div>number: {number}</div>
      <button onClick={addCount}>count+1</button>
      <button onClick={addNumber}>number+1</button>
    </div>
  );
};
```

#### 依赖值为对象的时

​		我们经常会将一个对象作为依赖，一般我们都是希望对象的内容发生变化时，去执行某些操作。在实际的业务开发中，我们会遇到一些莫名其妙的坑，列举几个常见的现象：

- 明明对象的内容已经发生了变化，但是为什么没有触发useEffect
- 明明对象的内容没有发生变化，但是为什么一直触发useEffect

这看起来有点像在说绕口令，出现问题的本质就是因为对象是引用类型，通过下面几个例子可以更加深入的理解

**案例1：改变对象中的属性值，未触发useEffect**

```tsx
const [info, setInfo] = useState({
    name: "张三",
    age: 18
});

useEffect(() => {
	console.log("info", info);
}, [info]);

function handleChangeName(e) {
    const value = e.target.value;
    setInfo((info) => {
      info.name = value;
      return info;
    });
}

return <input onChange={handleChangeName} />;
```

**问题原因：**调用 `setInfo` 时，是直接改变的入参，此时返回改变后的信息其引用是没有发生变化的。

**注意点：在任何情况下，都不能直接去改变入参，或者是直接改变state值本身。**

```tsx
// 错误写法
info.name = value;
setInfo(info);

// 错误写法
setInfo((info) => {
  info.name = value;
  return info;
});

// 正确写法
setInfo({
    ...info,
    name: value
});

// 正确写法
setInfo((info) => {
  return {
    ...info,
    name: value
  };
});
```

**案例2：接受父组件的对象属性作为依赖，useEffect频繁触发**

开发组件时，对某些属性需要设置默认值，一般的写法就是结构props时同时赋予默认值

```tsx
const {
    count = 0,
    list = []
} = props;
```

如果父组件没有传递list属性，每当父组件重新渲染时，子组件会跟随重新渲染，每次渲染都会触发useEffect。[在线查看示例](https://link.juejin.cn?target=https%3A%2F%2Fcodesandbox.io%2Fs%2Fgracious-shadow-8mvfb8%3Ffile%3D%2Fsrc%2Fhooks%2FuseEffect%2Fdemo2.js)

```tsx
import { useState, useEffect } from "react";

const Com = () => {
  const [count, setCount] = useState(0);

  function hanleOnClick() {
    setCount((count) => count + 1);
  }

  return (
    <div>
      <button onClick={hanleOnClick}>add</button>
      <SubCom count={count} />
    </div>
  );
};

const SubCom = (props) => {
  const { list = [], count } = props;

  useEffect(() => {
    console.log(list);
  }, [list]);

  return <div>子组件{count}</div>;
};

export default Com;
```

**问题原因：**当父组件更新时，会重新渲染子组件，每次渲染，`props.list` 都被赋予了新的引用， 虽然看起来都是空数组，但是useEffect 是判断list的引用发生了变化，所以就会执行。一旦该组件用于复杂场景，导致更新频繁就会出现白屏现象。

**正确写法**：在用到的地方去做兼容处理，而不是直接赋予默认值。

**案例3：对象内容未变化时，我们不希望触发useEffect**

将对象作为依赖时，往往都是希望其内容发生变化时，才触发相应的执行。但是 useEffect 的本质是监听引用的变化，很多情况下这与我们实际的业务开发有点不相符。

- 业务层经常会对一些状态进行重置，`setState([])` 或者 `setState({})` 。有可能本身state的值就是 `[]` 或者 `{}` ，重置后，内容未发生变化，但是引用已经改变，从而导致触发 `useEffect` 。[查看在线示例](https://link.juejin.cn?target=https%3A%2F%2Fcodesandbox.io%2Fs%2Fgracious-shadow-8mvfb8%3Ffile%3D%2Fsrc%2Fhooks%2FuseEffect%2Fdemo3.js)

```tsx
import { useState, useEffect } from "react";

const Com = () => {
  const [list, setList] = useState([]);

  function reset() {
    setList([]);
  }

  return (
    <div>
      <p>{list.join(",")}</p>
      <button onClick={reset}>reset</button>
      <SubCom list={list} />
    </div>
  );
};

const SubCom = (props) => {
  const { list } = props;

  useEffect(() => {
    console.log(list);
  }, [list]);

  return <div>子组件</div>;
};

export default Com;
```

**解决方案**：

- 将对象转为字符串后再作为useEffect的依赖。

```tsx
useEffect(() => {
	console.log(list);
}, [JSON.stringify(list)]);
```

- 使用 ahooks 的 useDeepCompareEffect 来解决。用法与 useEffect 一致，但 deps 通过 [lodash isEqual](https://link.juejin.cn?target=https%3A%2F%2Flodash.com%2Fdocs%2F4.17.15%23isEqual) 进行深比较。

```tsx
import { useRef } from 'react';
import type { DependencyList, useEffect, useLayoutEffect } from 'react';
import isEqual from 'lodash/isEqual';

type EffectHookType = typeof useEffect | typeof useLayoutEffect;
type CreateUpdateEffect = (hook: EffectHookType) => EffectHookType;

const depsEqual = (aDeps: DependencyList = [], bDeps: DependencyList = []) => {
  return isEqual(aDeps, bDeps);
};

export const createDeepCompareEffect: CreateUpdateEffect = (hook) => (effect, deps) => {
  const ref = useRef<DependencyList>();
  const signalRef = useRef<number>(0);

  // 本地更新的依赖值与缓存的依赖深比较
  if (deps === undefined || !depsEqual(deps, ref.current)) {
    // 将依赖保存一份
    ref.current = deps;
    // 如果发现变更，则改变signalRef的值，是为了触发真正的useEffect
    signalRef.current += 1;
  }

  hook(effect, [signalRef.current]);
};
```

**案例4：第一次渲染时，不希望触发useEffect**

`useEffect` 在 **第一次渲染后和每次更新** 都会执行。

有的业务场景并不希望在第一次加载的时候触发，此场景可通过创建一个标志位来解决。当然可以直接使用 [ahooks](https://link.juejin.cn?target=https%3A%2F%2Fahooks.js.org%2F) 中的 [useUpdateEffect](https://link.juejin.cn?target=https%3A%2F%2Fahooks.js.org%2Fhooks%2Fuse-update-effect) 这个hook，其原理也是使用标志位来实现的。[查看在线示例](https://link.juejin.cn?target=https%3A%2F%2Fcodesandbox.io%2Fs%2Fgracious-shadow-8mvfb8%3Ffile%3D%2Fsrc%2Fhooks%2FuseEffect%2Fdemo4.js)

```tsx
import { useState, useEffect, useRef } from "react";

export default () => {
  const [count, setCount] = useState(0);
  const isMounted = useRef(false);

  // 第一次渲染置为false
  useEffect(() => {
    isMounted.current = false;
  }, []);

  useEffect(() => {
    console.log("第一渲染时会执行");
  }, [count]);

    // 第一次渲染将标志位置为true
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
    } else {
      console.log("第一渲染时不会执行，后续更新才会执行");
    }
  }, [count]);

  return (
    <div>
      <button onClick={() => setCount((c) => c + 1)}>+1</button>
    </div>
  );
};
```

**案例5：两个useEffect更新相互依赖，无限更新导致白屏**

```tsx
const {
    value,
    defaultValue = 0.5,
    onChange
} = props;

const [innerValue, setInnerValue] = useState<number>(defaultValue);

// 取名为useEffect1
useEffect(() => {
    if (value !== undefined) {
        setInnerValue(value);
    }
}, [value]);

// 取名为useEffect2
useEffect(() => {
    onChange?.(innerValue);
}, [innerValue]);
```

**组件功能**：这里是一个自定义的表单组件，其中 `value` 是受控属性，当改变表单值时，通过 `onChange` 通知上层，上层改变 `value` 值。

如果业务层在初始化时，对value 赋予的初始值不是undefined 并且不等于 `defaultValue` 的值，则会导致白屏现象，下面来分析一下整个过程：

- 假设业务层对 value 赋予了一个初始值0.6。在第一次加载时，useEffect1 和 useEffect2 都会执行一遍。
- useEffect1 执行时，会将 innerValue 的值设置为 0.6
- useEffect2 执行时，会将 innerValue 的值通过onChange 方法通知到业务层，这里要注意，此时的 innerValue 值为 defaultValue 的值，是0.5 。并不是 useEffect1 中改变后的 0.6；
- 当业务层监听到调用了 onChange 时，会将 onChange 传过来的是也就是0.5更新到 value上。
- 当进入第二次更新时，useEffect1 监听到 value 的值从0.6变为了0.5，因此会执行useEffect1 。useEffect2 监听到 innerValue 的值从0.5 变为了0.6，因此也会执行useEffect2，从而又触发了onChange
- 由于 value 与 innerValue 的值永远都在同一次更新中，更新为了不同的值，会导致这个更新会无限的循环执行下去，从而导致白屏。

![未命名绘图.drawio](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/37a7801f5c2947638190b5a988656a21~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

**问题点：**

- 在第一次加载时，就会触发useEffect2导致调用onChange方法。
- 如果是业务层手动变更了value值，也会触发onChange

**正确写法：**

- 在真正手动改变表单值的时候，去调用 onChange，而不是直接去使用useEffect监听innerValue的变化

**案例6：不要将普通变量作为依赖**

[查看在线示例](https://link.juejin.cn?target=https%3A%2F%2Fcodesandbox.io%2Fs%2Fgracious-shadow-8mvfb8%3Ffile%3D%2Fsrc%2Fhooks%2FuseEffect%2Fdemo6.js)

```tsx
import { useState, useEffect } from "react";

export default () => {
  const [count, setCount] = useState(0);

  const list = [];

  useEffect(() => {
    console.log("触发useEffect", count);
  }, [list]);

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount((c) => c + 1)}>+1</button>
    </div>
  );
};
```

**问题原因：** 组件在每次更新时，会对list赋予新的值，与 `案例2` 原理相同。

**案例7：依赖监听useRef的值，有时可以触发更新，有时无法触发更新**

[查看在线示例](https://link.juejin.cn?target=https%3A%2F%2Fcodesandbox.io%2Fs%2Fgracious-shadow-8mvfb8%3Ffile%3D%2Fsrc%2Fhooks%2FuseEffect%2Fdemo7.js)

```tsx
import { useState, useEffect, useRef } from "react";

export default () => {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
    
  // 取名为useEffect1
  useEffect(() => {
    console.log("count", count);
  }, [count]);

  // 取名为useEffect2
  useEffect(() => {
    console.log("countRef", countRef);
  }, [countRef.current]);

  

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount((c) => c + 1)}>button1</button>
      <button onClick={() => (countRef.current += 1)}>button2</button>
    </div>
  );
};
```

**现象**：

- 点击 `button1` 时，会触发 `useEffect1`
- 点击 `button2` 时，不会触发 `useEffect2`
- 再次点击 `button1` 时，会触发 `useEffect1` 和 `useEffect2`

**问题原因**：只有状态变更的时候，才会触发更新，而状态变更，只有 `useState` 和 `useReducer` 可以触发更新。

**使用指南**：建议不要使用 `useRef` 的值作为依赖，除非你十分确定当 `useRef` 的值改变时，有state发生了改变。