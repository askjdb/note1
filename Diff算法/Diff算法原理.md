## Diff同层对比

新旧虚拟DOM对比的时候，Diff算法比较只会在同层级进行, 不会跨层级比较。 所以Diff算法是:`深度优先算法`。 时间复杂度:`O(n)`

![截屏2021-08-08 上午11.32.47.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5ca3d338e5a445ab80e40042c50ac79a~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

## Diff对比流程

当数据改变时，会触发`setter`，并且通过`Dep.notify`去通知所有`订阅者Watcher`，订阅者们就会调用`patch方法`，给真实DOM打补丁，更新相应的视图。对于这一步不太了解的可以看一下我之前写[Vue源码系列](https://juejin.cn/column/6969563635194527758)`newVnode和oldVnode`：同层的新旧虚拟节点



![截屏2021-08-08 上午11.49.38.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1db54647698e4c76b6fc38a02067ad72~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

## patch方法

这个方法作用就是，对比当前同层的虚拟节点是否为同一种类型的标签`(同一类型的标准，下面会讲)`：

- 是：继续执行`patchVnode方法`进行深层比对
- 否：没必要比对了，直接整个节点替换成`新虚拟节点`

来看看`patch`的核心原理代码

```js
function patch(oldVnode, newVnode) {
  // 比较是否为一个类型的节点
  if (sameVnode(oldVnode, newVnode)) {
    // 是：继续进行深层比较
    patchVnode(oldVnode, newVnode)
  } else {
    // 否
    const oldEl = oldVnode.el // 旧虚拟节点的真实DOM节点
    const parentEle = api.parentNode(oldEl) // 获取父节点
    createEle(newVnode) // 创建新虚拟节点对应的真实DOM节点
    if (parentEle !== null) {
      api.insertBefore(parentEle, vnode.el, api.nextSibling(oEl)) // 将新元素添加进父元素
      api.removeChild(parentEle, oldVnode.el)  // 移除以前的旧元素节点
      // 设置null，释放内存
      oldVnode = null
    }
  }

  return newVnode
}

```

### sameVnode方法

patch关键的一步就是`sameVnode方法判断是否为同一类型节点`，那问题来了，怎么才算是同一类型节点呢？这个`类型`的标准是什么呢？

咱们来看看sameVnode方法的核心原理代码，就一目了然了

```js
function sameVnode(oldVnode, newVnode) {
  return (
    oldVnode.key === newVnode.key && // key值是否一样
    oldVnode.tagName === newVnode.tagName && // 标签名是否一样
    oldVnode.isComment === newVnode.isComment && // 是否都为注释节点
    isDef(oldVnode.data) === isDef(newVnode.data) && // 是否都定义了data
    sameInputType(oldVnode, newVnode) // 当标签为input时，type必须是否相同
  )
}
复制代码
```

### patchVnode方法

这个函数做了以下事情：

- 找到对应的`真实DOM`，称为`el`
- 判断`newVnode`和`oldVnode`是否指向同一个对象，如果是，那么直接`return`
- 如果他们都有文本节点并且不相等，那么将`el`的文本节点设置为`newVnode`的文本节点。
- 如果`oldVnode`有子节点而`newVnode`没有，则删除`el`的子节点
- 如果`oldVnode`没有子节点而`newVnode`有，则将`newVnode`的子节点真实化之后添加到`el`
- 如果两者都有子节点，则执行`updateChildren`函数比较子节点，这一步很重要

```js
function patchVnode(oldVnode, newVnode) {
  const el = newVnode.el = oldVnode.el // 获取真实DOM对象
  // 获取新旧虚拟节点的子节点数组
  const oldCh = oldVnode.children, newCh = newVnode.children
  // 如果新旧虚拟节点是同一个对象，则终止
  if (oldVnode === newVnode) return
  // 如果新旧虚拟节点是文本节点，且文本不一样
  if (oldVnode.text !== null && newVnode.text !== null && oldVnode.text !== newVnode.text) {
    // 则直接将真实DOM中文本更新为新虚拟节点的文本
    api.setTextContent(el, newVnode.text)
  } else {
    // 否则

    if (oldCh && newCh && oldCh !== newCh) {
      // 新旧虚拟节点都有子节点，且子节点不一样

      // 对比子节点，并更新
      updateChildren(el, oldCh, newCh)
    } else if (newCh) {
      // 新虚拟节点有子节点，旧虚拟节点没有

      // 创建新虚拟节点的子节点，并更新到真实DOM上去
      createEle(newVnode)
    } else if (oldCh) {
      // 旧虚拟节点有子节点，新虚拟节点没有

      //直接删除真实DOM里对应的子节点
      api.removeChild(el)
    }
  }
}
复制代码
```

其他几个点都很好理解，我们详细来讲一下`updateChildren`

### updateChildren方法

这是`patchVnode`里最重要的一个方法，新旧虚拟节点的子节点对比，就是发生在`updateChildren方法`中，接下来就结合一些图来讲，让大家更好理解吧

是怎么样一个对比方法呢？就是`首尾指针法`，新的子节点集合和旧的子节点集合，各有首尾两个指针，举个例子：

```html
<ul>
    <li>a</li>
    <li>b</li>
    <li>c</li>
</ul>

修改数据后

<ul>
    <li>b</li>
    <li>c</li>
    <li>e</li>
    <li>a</li>
</ul>

复制代码
```

那么新旧两个子节点集合以及其首尾指针为：

![截屏2021-08-08 下午2.55.26.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3eb33b1b28e7461f9aedb857736a142c~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

然后会进行互相进行比较，总共有五种比较情况：

- 1、`oldS 和 newS `使用`sameVnode方法`进行比较，`sameVnode(oldS, newS)`
- 2、`oldS 和 newE `使用`sameVnode方法`进行比较，`sameVnode(oldS, newE)`
- 3、`oldE 和 newS `使用`sameVnode方法`进行比较，`sameVnode(oldE, newS)`
- 4、`oldE 和 newE `使用`sameVnode方法`进行比较，`sameVnode(oldE, newE)`
- 5、如果以上逻辑都匹配不到，再把所有旧子节点的 `key` 做一个映射到旧节点下标的 `key -> index` 表，然后用新 `vnode` 的 `key` 去找出在旧节点中可以复用的位置。

![截屏2021-08-08 下午2.57.22.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/727b5dd8a3424d22afd9dc5cf0dae05e~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

**接下来就以上面代码为例，分析一下比较的过程**

分析之前，请大家记住一点，最终的渲染结果都要以newVDOM为准，这也解释了为什么之后的节点移动需要移动到newVDOM所对应的位置

![截屏2021-08-08 下午3.03.31.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1efbc4e76c234dccb44cef0a75073d98~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

- 第一步

```js
oldS = a, oldE = c
newS = b, newE = a
复制代码
```

比较结果：`oldS 和 newE` 相等，需要把`节点a`移动到`newE`所对应的位置，也就是末尾，同时`oldS++`，`newE--`

![截屏2021-08-08 下午3.26.25.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d7698f560bb44107911585580c241a99~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

- 第二步

```js
oldS = b, oldE = c
newS = b, newE = e
复制代码
```

比较结果：`oldS 和 newS`相等，需要把`节点b`移动到`newS`所对应的位置，同时`oldS++`,`newS++`

![截屏2021-08-08 下午3.27.13.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1cda8545d6634bcdbf2d007193922092~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

- 第三步

```js
oldS = c, oldE = c
newS = c, newE = e
复制代码
```

比较结果：`oldS、oldE 和 newS`相等，需要把`节点c`移动到`newS`所对应的位置，同时`oldS++`,`newS++`

![截屏2021-08-08 下午3.31.48.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fdbca1cefdec4ba08637c37a70f26af6~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

- 第四步 `oldS > oldE`，则`oldCh`先遍历完成了，而`newCh`还没遍历完，说明`newCh比oldCh多`，所以需要将多出来的节点，插入到真实DOM上对应的位置上

![截屏2021-08-08 下午3.37.51.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1ec374b664e94888b00721829738ea7a~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

