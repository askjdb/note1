# useState 源码细致解析

本文是参考的是最新的 React 18 alpha 版本，但是 Hooks 的原理自「出生」后，就基本没有什么变化。

useState 的原理一点也不复杂，我也会努力,让只要使用过 React 的人，就能看明白。

Anyway，今天就让我来带大家阅读一下它的源码，一块梳理一下 useState 的原理吧！

这是我们的一个函数式组件：

```js
function App() {
  const [count, setCount] = useState(0)

  function handleClick() {
    setCount((count) => {
      return count + 1;
    })
  }

  return (
    <button type="button" onClick={handleClick}>
        count is: {count}
    </button>
  )
}
```

1. 这个组件在初始渲染的时候，会把 `count` 初始化为 0，并且在页面上渲染出来；
2. 当我们点击按钮的时候，会触发 `setCount` 操作，之后整个 FunctionComponent 都会重新调用一遍，最后会把 `count` 的数量更新为 1。

我们今天的讲解也会按照上面的流程，分为两个部分：第一部分，先介绍初次渲染的情况；第二部分介绍组件是怎么更新的。

假设我们在组件内部使用了两个 useState：

```js
const [count1, setCount1] = useState(0)
const [count2, setCount2] = useState(10)
```

如果我们想渲染 `App` 这个组件，说得简单点，就是执行一遍 `App` 这个函数，拿到返回值去渲染。

在 React 中，像我们的 ClassComponent、FunctionComponent 等都会对应着一个叫做 Fiber 的对象来保存它的各种节点状态信息，也就是 React 中的虚拟 DOM 对象。我们当前的 `App` 组件也不例外，也会对应着一个 Fiber 对象。如果你想了解 Fiber 是什么，可以看[这篇文章](https://juejin.cn/post/7010263907008937997)，但是不看也不影响后面的阅读。

Fiber 对象的上有一个记录内部 `State` 对象的属性，以便让我们能在下次渲染的时候取到上一次的值，叫做 `memoizedState` 。有了这个属性，我们的 FunctionComponent 就能有和 ClaassComponent 一样使用 `this.setState` 的能力了。

`Fiber.memoizedState` 是一个**单项链表**的结构。首先，我们的每一个 useState 都会在后面生成一个 hook 节点。而它会把当前组件所有 useState 对应的 hook 节点用 `next` 指针串起来，头结点就是 `Fiber.memoizedState`。 我们初始化的目的就是为了构造完成它。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0bc6ff8a51034b1a98206d3a2987e857~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

为了后面的描述更简单，现在我们来引入一些变量的定义：

1. `currentlyRenderingFiber`：指当前渲染组件的 Fiber 对象，在我们的例子中，就是 App 对应的 Fiber 对象
2. `workInProgressHook`：指当前运行到哪个 hooks 了，我们一个组件内部可以有多个 hook，而当前运行的 hook 只有一个。
3. hook 节点：我们每一个 useState 语句，在初始化的时候，都会产生一个对象，来记录它的状态，我们称它为 hook 节点。

初次渲染的 `App` 时候，也叫做 `mount` 阶段，我们还没执行任何一个 useState 函数，`currentlyRenderingFiber.memoizedState` 会存储当前组件的状态，此时是空的。 `workInProgressHook` 也是空的。

接下我们就要执行我们的第一个 hook 语句了，执行第一个 hook 语句的代码也比较简单，就是先根据 useState 的初始值新建一个 hook 节点，然后再把 `currentlyRenderingFiber.memoizedState` 和 `workInProgressHook` 指向它。

```js
var hook = {
    memoizedState: null,
    baseState: null,
    baseQueue: null,
    queue: null,
    next: null
};

if (typeof initialState === 'function') {
    initialState = initialState();  
    // initialState 就是 useState 的第一个参数
}

hook.memoizedState = hook.baseState = initialState;

currentlyRenderingFiber.memoizedState = workInProgressHook = hook;
```

运行完上面这段代码之后，我们第一条 useState 语句的初始值就可以被记录在 currentRenderingFiber 上了。

也就是说，如果我们此时在执行第一个 useState 语句：

```js
const [count1, setCount1] = useState(0)
```

此时该 useState 对应的 hook 节点的 `memoizedState` 就由 null 变为 0 了。这个值后面也将作为 useState 返回值数组的第一项 `count1` 而返回。

那我们返回值的第二项，也就是 `setCount1` 是什么呢？

它是把 `currentlyRenderingFiber` 、当前的 hook 节点的 queue 属性绑定到当前的函数上下文的一个函数：

```js
  var dispatch = queue.dispatch = dispatchAction
      .bind(null, currentlyRenderingFiber, queue);
```

`dispatchAction` 是类似于这样的一个函数，它会在后面派发更新，内部逻辑我们可以不用管：

```js
function dispatchAction(fiber, queue, action) {
   .... 
}
```

我们为它绑定了前两个参数。你有没有疑问为什么要绑定呢？

在 `App` 组件初次渲染的时候，是处于我们构造整个应用对应 Fiber 树的阶段，此时每一个组件的Fiber 节点会被一一构造。我们会先创建了某个组件对应的 Fiber 对象，接下来才去执行它对应的 FunctionComponent 或者 ClassComponent 的 `render` 方法。此时，我们事先已经知道 `currentlyRenderingFiber` 的值了。

但是在后续触发更新的时候就不一样了，我们可能随时在某一个组件上触发更新，如果不在这里进行绑定，我们是无法确定是 Fiber 树上的哪个节点触发了更新操作，我们就无法给对应节点追加更新任务。

大家现在还有点疑惑的话没关系，我们在更新的阶段还会看到如何使用它。

接下来我们会执行第二条 Hook 语句：

```js
const [count1, setCount1] = useState(0)
```

理解了上面的逻辑，再理解第二条就比较简单了，初始化第一条之后的都遵循同一个逻辑：

1. 根据 useState 的 initialState 新建一个 hook 节点
2. 把新建的节点放到 `workInProgressHook` 指向的节点的后面
3. 让 `workInProgressHook` 指向下一个节点，也就是最后一个节点

按照这个思路一直做下去的话，我们就生成了一条链表，该链表的头指针是 `currentlyRenderingFiber.memoizedState` ，剩下的每个节点都是 useState 对应的 hook 节点。

下面这段代码就是我们上面讲的逻辑：

```js
function mountWorkInProgressHook() {
  var hook = {
    memoizedState: null,
    baseState: null,
    baseQueue: null,
    queue: null,
    next: null
  };

  if (workInProgressHook === null) {
    // 当初始化第一个 hook 节点的时候
    currentlyRenderingFiber$1.memoizedState = workInProgressHook = hook;
  } else {
    // 不是第一个节点，直接放到后面
    workInProgressHook = workInProgressHook.next = hook;
  }

  return workInProgressHook;
}
```

下面就是我们初始化 hook 返回值的代码。

```js
function mountState(initialState) {
  // 根据初始值初始化当前的 hook 节点
  var hook = mountWorkInProgressHook(); 

  if (typeof initialState === 'function') {
    // $FlowFixMe: Flow doesn't like mixed types
    initialState = initialState();
  }

  hook.memoizedState = hook.baseState = initialState;
  // 初始化当前 hook 对象的更新队列
  // 后面的更新阶段操作会往里面放值
  var queue = hook.queue = { 
    pending: null,
    interleaved: null,
    lanes: NoLanes,
    dispatch: null,
    lastRenderedReducer: basicStateReducer,
    lastRenderedState: initialState
  };
  var dispatch = queue.dispatch = dispatchAction.bind(null, currentlyRenderingFiber$1, queue);
  return [hook.memoizedState, dispatch];
}
```

执行到最后，各种 state 都已经初始化好了，接下来会运行到 App 组件的 `return` 语句，返回一个 JSX 节点，剩下的就是交给 React 的调度部分了，他们会最终把更新的结果显示到页面上了。这个过程我们肯定不涉及了，不然内容就还得再写好几篇。

接下来是更新的流程。也就是调用 `setCount`。

其实，大体逻辑和初次渲染的时候是一致的，只不过我们在初始化阶段只是初始化了每个 hook 节点上的 `queue`，而更新的时候会往 `queue` 里加任务了；并且，我们不再根据 `initialState` 去赋初始值，而是根据上一次生成的 hook 节点链表去赋初始值，并且根据 hook 节点 `queue` 上的更新任务计算最后的结果。

我们更新节点的示例如下：

```js
function App() {
  const [count, setCount] = useState(0)
  const [count2, setCount2] = useState(10)

  function handleClick() {
    setCount((count) => {
      return count + 1;
    })

    setCount2((count2) => {
      return count2 + 10;
    })
  }

  return (
    <button type="button" onClick={handleClick}>
    count is: {count}
    </button>
  )
}
```

当我们点击 button 按钮，就开始触发更新流程了。

首先，我们要先把更新任务加到对应的 hook 节点的 `queue` 里去。

每一个 hook 节点都对应一个 queue 对象，这是我们 queue 对象的数据结构：

```js
 var queue = { 
    pending: null,
    interleaved: null,
    lanes: NoLanes,
    dispatch: null,
    lastRenderedReducer: basicStateReducer,
    lastRenderedState: initialState
};
```

在 mount 阶段，我们已经为 `setCount` 指定好了两个参数，一个是它对应的 Fiber 对象，另外一个是它的更新队列 `queue`。我们 `setCount` 函数的入参将作为第三个参数 `action` 传入。

当执行第一行语句时：

```js
setCount((count) => {
  return count + 1;
})
```

我们会根据入参生成的一个更新节点：

```js
var update = {
    lane: lane,
    action: action, // 这个就是 setCount 的入参
    eagerReducer: null,
    eagerState: null,
    next: null
};
```

`queue.pending` 存储产生的更新。它的数据结构是一个**单项循环链表**，当只有一个节点的时候，是自己指向自己，当有多个节点的时候，就把它插入进去。

ps: 在这里循环链表是直接使用的对象，而它也可以使用数组做，如果您有兴趣，可以参考我的这篇[双端队列的旧文](https://juejin.cn/post/6912623368571682824)。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5754d8dc17984785be35f4aec7f507d0~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

```js
var pending = queue.pending;

if (pending === null) {
  // This is the first update. Create a circular list.
  update.next = update;
} else {
  update.next = pending.next;
  pending.next = update;
}

queue.pending = update;
```

经过上面的过程，我们第一个 hook 节点的 queue 队列已经处理好了，由于 React 的事件处理函数一直都自带 AutoBatching 的特性，接下来我们不会去直接计算刚刚产生的 queue 队列，而是先会一样的步骤，执行后面的 hook 语句，处理第二个 hook 节点，为它产生 queue 队列。第二个处理步骤和第一个一样，我们就省略了。

上面处理完毕后，两个 hook 节点的 `queue.pending` 内部的节点都只有一个。你可能会问，为什么我们这里的 `queue.pending` 的结构是链表结构呢？

因为我们这里讲解的场景比较特殊，如果我们一次执行了多次相同的 hook 操作，就会产生多个节点的情况，比如：

```js
setCount(1);
setCount(2);
```

对于这种情况，我们会直接追加到当前 queue 的链表上去。另外，我们有一些更新任务可能由于优先级不够，暂时被挂起，所以 queue 里面可能还存储着上次没有更新完成的信息。如果再更新，就要先把上一次未做完的更新合并进来，再更新。

接下来就进入了真正的更新阶段（update）。我们上面提过来，这个过程和初始化阶段非常像。我们就和大家分享一下不同的点就好了。

我们依然会重新生成 hook 节点，只不过这时候再生成的时候，我们的 `memoizedState` 、`queue` 就不是 `null` 了，相同的是，我们还是会把生成的这些 hooks 串起来。它依然是一个单项链表的结构。

```js
var newHook = {
  memoizedState: currentHook.memoizedState,
  baseState: currentHook.baseState,
  baseQueue: currentHook.baseQueue,
  queue: currentHook.queue,
  next: null
};

if (workInProgressHook === null) {
      // 当前还没有 hook 节点被初始化
      currentlyRenderingFiber$1.memoizedState = workInProgressHook = newHook;
} else {
      // 加到链表的最后面
      workInProgressHook = workInProgressHook.next = newHook;
}
```

当生成了一个新的 hook 节点之后，我们剩下要做的是根据 `hook.queue` 算出新的 `memoizedState` 的值。

```js
var first = baseQueue.next;
var newState = current.baseState;
var update = first;

do {
  var action = update.action;
  newState = reducer(newState, action);

  update = update.next;
} while (update !== null && update !== first);

hook.memoizedState = newState;
```

最后 `memoizedState` 这个值算完后，还是跟之前一样，作为 useState 返回值的第一项返回。接下来就是走调度任务了。就不是 useState 的范围了。

经过上面的过程，我们就走完了初始化渲染和更新阶段 useState 的过程。初始化渲染部分的代码基本没有删减，但为了讲解顺畅，我略过了更新阶段的一些代码。

以上就是 useState 的源码解读了，不知道我的讲解有没有让您觉得清楚，如果您哪里没有听懂或者觉得我哪里讲的不对，可以评论区留言，我会在看到后第一时间回复。

说一下我的感受，个人觉得应该是我最近写得最累的一篇文章了。

不过，还是希望您读得开心。

