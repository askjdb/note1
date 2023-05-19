# useEffect 与 useLayoutEffect 有什么区别

useEffect 与 useLayoutEffect 有什么区别
useEffect
首先我们应该知道 useEffect 的两个参数分别是什么，干什么的。

而且我们也应该知道在函数组件中是没有生命周期的，代替生命周期的是useEffect(处理副作用)和useLayoutEffect(同步执行副作用)。

第一个参数是一个回调函数，第二个参数是一个数组

功能


> 当我们没有写第二个参数时,useEffect 类似于componentDidupdate钩子
> 当我写了第二个参数，但是给了空数组，那么useEffect 在DOM挂载完后 只会执行一次 类似于componentDidMount
> 当我们给第二参数数组中传了依赖(依赖可以传多个)，当多个依赖中有一个值发生变化 那么 useEffect就会执行一次
> 当我们在useEffect 的第一个参数中，return 内容组件即将被销毁前执行 类式于componentWillUnmont钩子

注意官方是推荐优先使用 useEffect

useLayoutEffect 与 useEffect 区别
useLayoutEffect 与 useEffect 的功能是一样的，但是它们调用react的内部方法不同

useLayoutEffect 是同步调用在执行的过程中是先调用React内部的mountLayoutEffect，然后再调用mountEffectImpl 注意 componentDidMount componentDidupdate 与 useLayoutEffect 一样

useEffect 是异步调用 执行的时候则是调用的mountEffect，最后再调用的方法也跟useLayoutEffect一样

而 mountLayoutEffect 与 mountEffect 的不同是 触发的时机不同


**详细解释**

> 我的理解
>
> useEffect 与useLayoutEffect 都是在 DOM挂载完执行
>
> 但是 在DOM进入浏览器时先进入缓存 还有一步操作 就是渲染
>
> 然而 useEffect 是 在渲染结束后执行 useLayoutEffect 是在DOM在缓存中 没有被渲染之前执行
>
> 这样对比的结果是什么呢
>
> 我们通常这样使用 useLayoutEffect ，如果你想在副作用钩子函数中 写一些 dom 结构 修改 ，这样在还没渲染前就可以改变dom的内容 这些修改会和react 做出的改变 一起被渲染到屏蔽上，这样就避免了重排重绘的改变
>
> 而useEffect就会直接改变 导致掉帧卡顿。 可以看我的上一篇文章 了解重排 重绘的原因
> 

简单来说就是调用时机不同，useLayoutEffect和原来componentDidMount & componentDidupdate一致，在react完成DOM更新后马上同步调用的代码，会阻塞页面渲染。而useEffect是会在整个页面渲染完才会调用的代码。