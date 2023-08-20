# React 的 Fiber 树是什么？

我发现，如果不搞清楚 React 的更新流程，就无法理解 useEffect 的原理，于是分享 React 更新流程的文章就来了。

其实我本想把整个更新流程放到一篇文章里去的，但是昨天查了一天资料后，发现这太不现实了，要是写在一篇里，中秋假期仅剩的一个下午也没了，还写不完，并且我现在的能力并不能很好的组织它们。

所以，我还是放弃了，我决定把它拆开，分多篇博客更新，拆分的结果大概是这样子的：

1. React 的 Fiber 树是什么(当前文章)；
2. 更新流程中的 `Render` 阶段：[已更新](https://juejin.cn/post/7016142577527160840)；
3. 更新流程中的 `Commit` 阶段；
4. 通过 `useEffect` 里调用 `useSate`， 把 2、3 结合起来。

> What I cannot [re]create, I do not understand.

分享完上面的内容后，我们应该就可以有能力自己实现一个 Mini 版 React 了。为了真正的掌握，我会和大家一起实现一个支持 Hooks 的 Mini 版 React，可能以文章的形式放出，也可能就把源码贴在这里，不过，那肯定是 10 月份或者 11 月份的事情了。

刚开始听到 「Fiber」 这个词的时候，觉得高端极了，当时甚至没有去网上搜索一下这个到底是什么，就默认自己不可能理解了。逃的了一时，逃不了一世，为了不当框架熟练工，最终还是要克服它。

幸运的是，了解之后发现，这东西既没有想得那么难，也没有想得那么简单，只要花一点时间，大家都还是能理解的。

你要试着了解一下吗，如果选择是的话，那我们就开始吧。

## Fiber 树与 DOM 树

DOM 树大家都很熟悉，下面是我们的一段 HTML 的片段：

```html
html复制代码<div>
    <ul>
        <li>1</li>
        <li>2</li>
    </ul>
    <button>submit</button>
<div>
```

对应到 DOM 结构，就是下面这样子：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3affecd627304463bace9e2c7cd4da3f~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp?)

大家可能都知道 React 使用了虚拟 DOM 来提高性能。

虚拟 DOM 是一个描述 DOM 节点信息的 JS 对象，操作 DOM 是一个比较昂贵的操作，使用虚拟 DOM 这项技术，我们就能通过在 JS 对象中进行新老节点的对比，尽量减小查询、更新 DOM 操作的频次和范围。在 React 中，虚拟 DOM 对应的就是 Fiber 树。

说到 Fiber 树，名字中带一个「树」字，大家的第一印象会把它和树结构联系起来，认为它和 DOM 树的结构是一样的，但这里还真就有点不同了，它和我们见过的树都不一样。

还是用上面那段 HTMl 代码，我们假设它是一段用 JSX 语法书写的，它的结构实际是如下图这般：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c7d40ac5bbf149459c09cc9afc3f7a3f~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp?)

父节点只和它的第一个孩子节点相连接，而第一个孩子和后面的兄弟节点相连接，它们之间构成了一个单项链表的结构。最后，每个孩子都有一个指向父节点的指针。

因为比较重要，我们再来复述一遍：在上面的结构中，我们会有一个 `child` 指针指向它的孩子节点，也会有一个 `return` 指针指向它的父节点，另外会有一个叫做 `sibling` 的指针指向它的兄弟节点，如果它没有孩子节点、兄弟节点或父节点，他们的指向就为空。

乍一看，这种结构还是很奇怪的，你可能会疑问，为什么不用树结构，这个我们放在本文的后面讨论。

## Fiber 树的遍历

在我们学习树的时候，我们学的第一个算法往往是遍历算法，在继续下面的内容之前，我们也先来看一下怎么去遍历下面这样结构的 Fiber 树。

这一块还是很重要的，因为在后面 React 的更新流程中，它要遍历整个 Fiber 去收集更新，理解了这一块就有助于我们理解后面它的遍历过程。

我们先来描述一下它的遍历顺序：

1. 把当前遍历的节点名记作 aaa
2. 遍历当前节点 aaa，完成对这个节点要做的事
3. 判断 a.childa.childa.child 是否为空
4. 若 a.childa.childa.child 不为空，则把 a.childa.childa.child 记作 aaa，回到 [步骤 1]
5. 若 a.childa.childa.child 为空，则判断 a.sibinga.sibinga.sibing 是否为空，不为空将 a.sibinga.sibinga.sibing 记为 aaa，回到 [步骤 1]
6. 若 a.childa.childa.child、a.siblinga.siblinga.sibling 都为空，则证明当前节点和和他兄弟节点都遍历完了，那就返回它的父节点，找父节点中还没有遍历的兄弟节点，找到了，回到步骤 1
7. 如此反复，直到遍历到顶点，结束。

只看逻辑可能不太直观，我们举一个例子。

```html
html复制代码<div id="a"> 
    <ul id="b"> 
        <li id="c">1</li> 
        <li id="d">2</li> 
    </ul> 
    <button id="e">submit</button> 
<div>
```

对于上面这段代码，我们的遍历顺序会是：a -> b -> c -> d -> e，和正常树结构的前序遍历的结果是一样的。

如果看着还是有点懵，没关系，这很正常，接下来我会和大家演示代码。

为了方便起见，我们就固定写好的一个 Fiber 树结构，它对应我们上面那段 HTML。

```js
js复制代码// 为了简单起见，我把 TextNode 节点省略了
function createFiberTree() {
  let rootFiber =  {
    type: 'div',
    sibling: null,
    return: null,
    child: {
      type: 'ul',
      return: null,
      sibling: {
        type: 'button',
        return: null,
        sibling: null,
        child: null 
      },
      child: {
        type: 'li',
        return: null,
        child: null,
        sibling: {
          type: 'li',
          return: null,
          child: null 
        }
      }
    }
  }

  
  rootFiber.return = null;
  rootFiber.child.return = rootFiber
  rootFiber.child.sibling.return  = rootFiber;

  let ul = rootFiber.child;
  rootFiber.child.child.return = ul;
  rootFiber.child.child.sibling.return = ul;

  return rootFiber;
}
```

上面那段代码很有点长，不用管，大家就知道它根据上面的 HTML 结构构造了 Fiber 对象就好了。

接下来我们要去遍历这个树，下面就是我们的遍历方法，大家可以稍微停一会看一下这个算法，在React 的更新流程的 `Render` 阶段，遍历 Fiber 树的地方都是沿用这个思路。

```js
js复制代码function traverse(node) {
  const root = node;
  let current = node;

  while(true) {
    console.log('当前遍历的节点是：' + current.type)

    if (current.child) {
      current = current.child
      continue
    }

    if (current.sibling) {
      current = current.sibling
      continue
    }

    while(!current.sibling) {
      if (
        current.return === null || current.return === root) {
        return;
      }
      current = current.return;
    }
    current = current.sibling
  }
}
```

我们在控制台运行上面遍历方法的结果如下：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5753bb808dd047cd9eb129d1b76ed61b~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp?)

## Fiber 树结构的优势

好了，现在我们就已经和大家讨论清楚 Fiber 树大体是什么样了，并且我们了解了怎样去遍历一棵 Fiber 树，接下来讨论一下，为什么需要这么样的设计。

刚开始的时候，我也很疑惑，为什么不和 DOM 一样，使用普通的多叉树呢？

```ts
ts复制代码type Fiber {
    type: string;
    children: Array<Fiber>
}
```

这样子的话，我们不需要维护孩子节点之间的指针，找某个节点的孩子的话，直接读取 `children` 属性就好了。这样看起来是没问题的，我们知道，在遍历树的时候，我们最常用的是使用递归去写，如果我们采用上面的多叉树结构，遍历节点可能就是这样的：

```ts
ts复制代码function traverse(node) {
    if (!node || !node.children) {
        return;
    }
    
    for (let i = 0; i < node.children.length; i++) {
        traverse(node.children[i]);
    }
}
```

看起来确实是简洁了很多，但是如果我们的 DOM 层级很深就会引发严重的性能问题，在一个普通的项目里，几百层的 DOM 嵌套是经常发生的，这样以来，使用递归会占用大量的 JS 调用栈，不仅如此，我们的调用栈肯定不是只给这一块遍历 Fiber 节点的呀，我们还有其他的事情要去做，这对性能来说是很不能接受的。

但是，如果用我们上面提到的那种架构，我们就能做到不使用递归去遍历链表，就能始终保持遍历时，调用栈只使用了一个层，这就很大的提升了性能。

除此之外，上述遍历 Fiber 节点的过程是发生在整个更新流程的 `Render` 阶段，在这个阶段，React 是允许低优先级的任务被更高优先级的任务所打断的。所以说，遍历过程也可能随时被中断。为了能在下次更新时继续从上次中断的点开始，我们就需要记录下上一次的中断点。

如果使用普通的树结构，是很难记录下中断点的，假设我们有一段这样一段 HTML：

```html
html复制代码<div>
    <ul>
        <li>
            <a>在这里中断了</a>
        </li>
        <!-- 可能还有很多项 -->
    </ul>
    <!-- 可能还有很多项 -->
</div>
```

按照上面的遍历算法，假设我们在遍历到 a 标签的时候中断了。

当遍历到 a 标签的时候，我们还有很多节点没有遍历的，包括 ul 的其他孩子节点、div 的其他孩子节点，也就是我标注 '可能还有很多项' 的那个地方，为了下一次能继续下去，我们就需要把这些都保存下来，当这些节点很多的时候，这在内存上是一个巨大的开销。

使用当前 Fiber 架构呢？只需要把当前节点记录在一个变量里就好了，等下次更新，它还是可以按照一样的逻辑，先遍历自己，再遍历 child 节点，再遍历 sibling 节点......

因此，我们最终选用了刚开始看起来有点怪的 Fiber 树结构。

## Fiber 节点部分属性介绍

在 React官网的[这一章节](https://link.juejin.cn?target=https%3A%2F%2Fzh-hans.reactjs.org%2Fdocs%2Freconciliation.html)，讲述了 Diff 算法的大致流程，这里 Diff 的东西就是两棵新旧 Fiber 树。

说了这么多，我们还没看过一个 Fiber 节点到底长什么样。

不妨，我们先用 Babel 转译一段 JSX 看看。就编译下面这一小段吧：

```jsx
jsx复制代码<div>
    <span key="1" className="box">hello world</span>
</div>
```

结果是下面这样的：

```jsx
jsx复制代码const a = React.createElement("div", null, 
    React.createElement("span", {
      key: "1",
      className: "box"
}, "hello world"))
```

我们会根据这个结果去构建 Fiber 对象，就是这样：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5b381f608f474912a893c4dd6e95c108~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp?)

> **注意:** 上面的截图并不是全部的属性，本人只截取了一部分。

我们再根据上面的图，介绍几个 Fiber 节点常用的属性。

`alternate`：Diff 过程要新老节点对比，他们就是通过这个找到对方。所以，新节点的 Fiber.alternate 就指向它对应的老节点；同时，老节点的 `alternate` 也指向新节点。

`child`： 指向第一个孩子节点，我们这里就是指向了 `span` 那个节点。

`elementType`： 和 React.createElement 的第一个参数相同，DOM 元素是它的类型，组件的话就是对应的构造函数，比如函数式组件就是对应的函数，类组件就是对应的类。

`sibling`：指向下一个兄弟节点

`return`：指向父节点

`stateNode`：对应的 DOM 节点

`memoizedProps` 存储的计算好了的 props，可能是已经更新到页面上的了；也可能是刚根据 `pendingProps` 计算好，还没有来得及更新到页面上，准备和旧节点进行对比

`memoizedState`：和 `memoziedProps` 一样。像 usetState 能保存状态，就是因为上一次的值被存到了这个属性里面。

关于 Fiber 的属性，我们就先介绍这几个，后面等我们用到了再介绍更多。

好了，这就是我们今天的全部内容了，相信看完了上面的内容就对 Fiber 树是什么有大体印象了吧。之前我写的 useState 源码解读可能不是特别好，可能原因就是不太明白某些朋友不了解 Fiber 到底是什么，现在我通过这篇文章把它补上了，希望能弥补一下吧。

中秋回家的朋友，你们现在在归程了吗？

