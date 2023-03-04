# [react](https://so.csdn.net/so/search?q=react&spm=1001.2101.3001.7020)渲染过程

1、React整个的渲染机制就是React会调用render()函数构建一棵Dom树，
2、在state/props发生改变的时候，render()函数会被再次调用渲染出另外一棵树，重新渲染所有的节点，构造出新的虚拟Dom tree跟原来的Dom tree用Diff算法进行比较，找到需要更新的地方批量改动，再渲染到真实的DOM上，由于这样做就减少了对Dom的频繁操作，从而提升的性能

***所以在本文我会重点介绍下react render()函数的react diff算法***

## 一、react render()

1、在使用React进行构建应用时，我们总会有一个步骤将组建或者虚拟DOM元素渲染到真实的DOM上，将任务交给浏览器，进而进行layout和paint等步骤，这个函数就是React.render()

ReactComponent render( ReactElement element, DOMElement container, [function callback] )
