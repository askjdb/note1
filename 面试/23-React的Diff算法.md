# 面试官：请你描述一下React的Diff算法

答：
React 的 diff 算法是一种优化 Virtual DOM 更新的算法，它可以比较两个 Virtual DOM 树的差异，并且只更新必要的部分，从而避免了不必要的重新渲染。

React diff 算法的基本思想是将 Virtual DOM 树上的节点按照深度优先的顺序进行比较，比较的过程中可以使用三个指针来跟踪原始树、新树和上一次更新时的树，从而找到需要更新的节点。

具体来说，React diff 算法会按照以下策略进行比较：

+ 如果节点类型不同，则直接删除原来的节点，用新节点替换原来的节点。
+ 如果节点类型相同，但是节点的属性不同，则更新节点的属性。
+ 如果节点类型相同，且节点的属性也相同，则比较节点的子节点。
+ 如果节点的子节点有增加或删除，则更新子节点。
+ 如果节点的子节点没有变化，则对每对相同位置的子节点进行递归比较。

在比较过程中，React diff 算法会尽可能地利用一些启发式的优化策略，比如同级比较、key 值比较等等，以提高比较效率和减少比较次数。

总的来说，React diff 算法是 React 的核心算法之一，它通过有效地比较 Virtual DOM 树的差异来提高渲染性能，同时还可以避免不必要的重新渲染，提高应用程序的性能和用户体验。

### key的作用：

在 React 中，key 是用来帮助 React 进行元素列表的 diff 算法，从而在更新列表时更加高效地更新 DOM。
当 React 更新一个元素列表时，会根据元素在列表中的位置以及元素的 key 来判断该元素是新的、已被移动还是被删除了。如果元素没有 key，React 只能根据其在列表中的位置来判断其是否被更新，这样会导致一些性能问题，因为在更新列表时，React 需要遍历整个列表来查找元素是否被移动或删除。
使用 key，可以让 React 更加高效地更新元素列表。当更新列表时，React 会根据 key 来快速定位元素，从而减少不必要的 DOM 操作，提高更新性能。此外，使用 key 还可以帮助 React 识别出新添加的元素，从而正确地将其插入到列表中。
需要注意的是，key 的值必须是唯一的，且稳定不变的。如果 key 的值不唯一或不稳定，会导致 React 在更新元素列表时出现错误。

`react`判断`key`的流程具体如下图：



![img](https://static.vue-js.com/3b9afe10-dd69-11eb-ab90-d9ae814b240d.png)





## 使用index作为key可能会应发的问题?

#### 1、效率问题，页面不会出现展示问题

- 如果对数据进行逆序添加、删除等破坏顺序操作，会产生没有必要的真实DOM更新，页面效果没有问题，但是效率低下。
- 我们希望可以在B和C之间加一个F，Diff算法默认执行起来是这样的：
   ![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/441c9cfe6a474d79b3dfc10e7af96ccb~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)
   即把C更新成F，D更新成C，E更新成D，最后再插入E，这样效率不高，且性能不够好。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/311d5383dcb04700a854372629b14623~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

#### 2、存在输入类DOM，产生错乱数据展示问题

- 如果DOM结构中还包括输入类（input、textarea）DOM ，会产生错误的DOM更新，界面明显看到问题。
- 如下图所示，当我们在列表中，在每个输入框中添加对应（数据）内容，逆向添加一个数据，在红色框中的位置，可以看到输入框中的数据产生错乱。
   ![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/47ef3a02ba8948a1bc0408cdf57e51bf~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)
   ![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f057e09544544882ab2954d35ba0d30b~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)
- 下面我们来分析一下原因
   1）、初始化数据，根据数据生成虚拟DOM，将虚拟DOM转化为展示DOM；
   2）、更新数据，向初始数据逆序添加一个数据（老刘-30），生成新数据；
   3）、数据变化，生成新的虚拟DOM；
   4）、新旧虚拟DOM比较：查找相同key值，如果查询到，存在差异，则以新虚拟DOM替换旧虚拟DOM，反之，则使用久虚拟DOM；
   5）、如下图，key=0时，老刘-30与张三-18不等，则替换；input则完全一样，则使用旧虚拟DOM，但是发现没有，key=1,2...每一步都需要替换，（张三、李四、王五都需要新旧替换）效率低下问题出现；
   6）、当key=3时，在旧的虚拟DOM中未找到，则创建新的虚拟DOM；
   7）、将新的虚拟DOM转化为真实DOM。
   ![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6e3a47c090ff42feb13bc3936ff9f25e~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

## 解决index作为key可能引发的问题

- 通过唯一标识作为key，则简洁很多
   1）、前四步都一样，从第五步开始节省，查找key=004，发现在旧虚拟DOM并未找到，直接创建新的虚拟DOM；
   2）、后面key=001,002,003...都在旧的虚拟DOM中查询到，则直接使用旧虚拟DOM
   3）、将新的虚拟DOM转化为真实的DOM。
   ![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9c36c0b5797041fbb291f2e9f2e8684a~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

## 总结：key有什么作用（内部原理）

#### 1、虚拟DOM中的key作用

- key是虚拟DOM对象的标识，当数据发生变化时，Vue会根据新数据生成新的虚拟DOM，随后Vue进行新虚拟DOM和旧虚拟DOM的差异比较；比较规则如:
   1）、旧虚拟DOM中找到了与新虚拟DOM相同地key：如果虚拟DOM内容没有变化，则直接使用之前的真实DOM；如果虚拟DOM中内容发生改变，则生成新的真实DOM，随后替换掉页面之前的真实DOM；
   2）、旧虚拟DOM中未找到与新虚拟DOM相同地key，则创建新的真实DOM，随后渲染到页面。

## 开发中如何选择key?

- 最好使用每条数据的唯一标识作为key，比如id、身份账号、手机号等等；
- 如果不存在对数据逆序添加、删除等破坏顺序的操作，仅用于列表展示，使用index作为key是没有问题的。





#### 什么是diff算法

react 作为一款最主流的前端框架之一，在设计的时候除了简化操作之外，最注重的地方就是节省性能了。diff算法就是为节省性能而设计的，diff算法和虚拟DOM的完美结合是react最有魅力的地方。其中，diff 是 different 的简写，这样一来，diff 算法是什么也就顾名思义了——找不同。

> diff算法的基本流程：
>
> 第一次render在执行的时候会将第一次的虚拟dom做一次缓存，第二次渲染的时候会将新的虚拟dom和老的虚拟dom进行对比。这个对比的过程其实就是diff算法。
> 

#### diff算法的作用

在DOM需要更新的时候，通过diff算法可以 计算出 [虚拟DOM](https://www.jianshu.com/p/353fa4b0513d) 中真正变化的部分，从而只针对变化的部分进行更新渲染，避免”牵一发而动全身“，造成性能浪费。

#### 普通的diff算法

虽然完美地实现了找不同的功能，但是傻瓜式的**循环递归对节点进行依次的对比**，使其算法的时间复杂度为**O(n^3)**，其中n是dom树的节点数。如果dom数足够大的话，这个算法将对cpu形成绝杀

#### React中的diff算法

为了优化diff算法，react中对普通的diff算法实行了三大策略，成功将时间复杂度降为**O(n)**

1. 策略一：tree diff —— 层级对比

由于开发过程中极少出现DOM的跨层级移动，所以tree diff 忽略了DOM节点的跨层级移动。（react不建议开发人员跨层级移动DOM）

2. 策略二：component diff —— 组件对比

   同类型的两个组件，直接比较Virtual DOM树，不同类型的组件将会被判定作为脏组件(dirty component)处理，直接删除或创建新组件

3. 策略三：element diff —— 节点对比

​		对于同一层级的一组子节点，通过分配唯一唯一key值进行区分


***

tree diff
tree diff 是diff算法的基础策略，它的重点在于同层比较。

出于对diff算法的优化，react的tree diff对DOM节点的跨层级移动的操作忽略不计，react对Virtual DOM树进行层级控制，也就是说只对相同层级的DOM节点进行比较（即同一个父节点下的所有子节点）。对比时，一旦发现节点不存在，则直接删除掉该节点以及之下的所有子节点。这样秩序对DOM树进行依次遍历，就可以完成整个树的对比。时间复杂度为O(n)
![层级控制——图片来自网络](https://imgconvert.csdnimg.cn/aHR0cHM6Ly91cGxvYWQtaW1hZ2VzLmppYW5zaHUuaW8vdXBsb2FkX2ltYWdlcy8xOTE5ODk5My1jMzRhYjdlZjFhNjQ2Nzc1LnBuZw?x-oss-process=image/format,png)

一个疑问：既然tree diff忽略了跨层级移动的操作，如果这种情况出现了，diff算法会怎么处理呢？

答：不管，多了就新增，少了就删除（**只有创建节点和删除节点的操作**）。所以官方明确建议不要进行DOM节点的跨层级操作。



***

component diff
component diff是组件间的对比

在遇到组件之间的比较时，有三种策略

1. 对比时，遇到同一类型的组件遵循 tree diff，进行层级对比

2. 对比时，一旦遇到不同类型的组件，直接将这个不同的组件判断为 dirty component（脏组件），并替换该组件和之下所有的子节点。

3. 对比时，在同一类型的两个组件中，如果你知道这个组件的 Virtual DOM没有任何变化，你（开发者）就可以手动使用 shouldComponentUpdate() 来判断组件是否需要进行diff，进一步的提升了diff效率和性能

   

优化点：

- 避免使用结构相同但是类型不同的组件，因为虽然组件的结构不需要改动，但是由于类型不同的原因，diff会直接销毁该组件并重建，虽然这种情况极少出现，但是造成的性能浪费挺严重的。
- 对于同一类型并且没有变化的组件，合理使用 shouldComponentUpdate() 进行优化
  

***

#### element diff

element diff 是针对同一层级的element节点的

在双方同一层级的节点对比时，有三种情况

1. 面对全新的节点时，执行插入操作 —— INSERT_MARKUP

这点不需要过多解释

2. 面对多余的节点时，执行删除操作 —— REMOVE_NODE

删除操作有两种情况：

- 组件新集合中有组件旧集合中的类型，但对应的element不可更新，只能执行删除
- 旧组件不在新集合里面，执行删除

3. 面对换位的节点时，执行移动操作 —— MOVE_EXISTING

比如该层级的组件原本是 [A,B,C,D] ，新的结构为 [A,D,B,C] ，只进行了移动操作。在传统的diff算法中，只要遇见不同（B/D）就删除并重新插入，这样的做法过于粗暴，浪费了很多可以复用的节点，所以在element diff中，对新旧该层级的对比双方都添加了唯一的key值进行区分，只要对应的key值对应的元素没有改变，则只需要执行移动即可。

> 细节：
>
> 新旧节点会遍历后对比下标，新的下标称为lastIndex，旧的称为index，如果lastIndex大于index，需要将节点旧的节点移动到新的位置，相反则不动。
> 如果没有找到对应位置节点，则执行新增； 如果旧的节点在新的节点组用不到，则执行删除；一般是在最后做删除操作。
> 特殊情形，最后一个节点移动到第一个位置，会导致，前面的n-1个节点都进行后移，影响性能。尽量避免这样的操作。
