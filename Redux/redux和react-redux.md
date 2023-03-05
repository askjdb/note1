## 一、redux

1. 什么是redux？ 按照官网上的解释：redux 是 js 应用的可预测状态的容器。 其实就是一个全局数据状态管理工具（状态管理机），管理数据流用来做组件通信等。需要注意的是，Redux 和 React 之间没有关系。Redux 支持 React、Angular、Ember、jQuery 甚至纯 JavaScript

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c3a17c4a5a3d42d68698a0779d88ac9c~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp) 当没有使用redux时兄弟组件间传值将很麻烦，代码很复杂冗余。使用redux定义全局单一的数据Store，可以自定义Store里面存放哪些数据，整个数据结构也是自己清楚的。

1. redux如何管理数据流？

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aceec9d1ca114dfb8cdd2ce7c428db1e~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

上图是redux对数据流的管理有一个固定的流程，要理解该过程，首先我们需要明确三个概念：store,action,reducers。

- store：store是保存数据state的地方，你可以把它看成是数据源对数据进行统一管理，整个应用中只能有一个store，所有组件均可通过redux规范与store中的数据进行交互
- action：action 就是 JavaScript 普通对象。并且action 内必须使用一个字符串类型的 type 字段来表示将要执行的动作(规定action对象里面必须有type字段，否则代码将报错)
- reducers: actions发送给store，根据action中的type来改变相应的store内的state，但是如何改变呢？就是通过reducers来改变的，reducers是一个纯函数，并且记住 actions 只是描述了有事情发生了这一事实，并没有描述应用如何更新state，而是有reducers根据action对象内的信息来改变store内的数据

理解这三个名词上面的redux流程图就好理解了： 当组件需要改变store内的数据时，就发送一个action给到store，store收到action后就会调用相应的reducers函数，reducers函数会返回一个新的对象来作为新的数据值回传给store，之后组件再从store里面获取更新后的数据了。

1. 结合react，代码说明redux的使用 那么action如何定义，如和定义store，action如何发送给store，reducers是如何更新store内的数据值的，组件内又是如何获取到新的store内的值呢？我们一一道来。

首先我们需要分别定义action，reducers以及store：

```javascript
    //分别用三个文件actions.js,reducers.js,store.js来定义action,reducer,store
    
    //actions.js  前文已经说过，action就是一个普通的对象，其中必须有type字段
    const action={
      type:'ADD_TODO',
      payload:'redux原理'
    }
    export default action;
    
    //reducers.js 定义一个纯函数，用于处理store内的state
    const reducer =(state={},action)=>{
      switch(action.type){
        case ADD_TODO:
            return newstate;
        default return state
      }
      export default reducer;
      
   //store.js store就是整个项目保存数据的地方，并且只能有一个。创建store就是把reducer给它
   import { createStore} from "redux";
   //把定义的reducer引入进来
   import reducer from "./reducer.js";
   // 全局就管理一个store
    const store = createStore(reducer)
    export default store;

   //至此三个文件定义完成，那组件如何去更新store内的state呢？
   //component.js,定义一个我们的组件
 
    import React, { Component } from 'react';  
    import store from './store';
    import action from './action';
    export default class Home extends Component {
        componentDidMount(){
            //redux需要调用store.subscribe监听store的变化，store.getState用来获取store内的state，
            //store.subscribe调用返回的值unsubscribe在页面卸载的时候调用，目的是取消页面对store的监听，防止内存泄漏
            let unsubscribe = store.subscribe(() =>
                  console.log(store.getState())
            );
            //unsubscribe();
        }
        change=()=>{
            //store.dispatch会向store发送action，store接收到action后就会自动调用reducers，
            //reducers根据action中的type执行相应的处理逻辑，并且返回新的state给到store，
            //此时store.subscribe(）就会被触发，通过store.getState()就可以拿到store内的state值
            store.dispatch(action);
            //其实就是一下代码
           // store.dispatch({
            //  type: 'ADD_TODO',
             // payload: 'redux原理'
            //});
        }
        render() {
            return <div className='container'>
                <p onClick={this.change}>test</p>
            </div>
        }
    }
    
复制代码
```

以上是一个redux使用的小案例，里面包含了组件如何发送action修改store以及如何从store中获取数据。通过这个案例你应该明白了代码中如何在组件中使用redux管理数据，总结就是一下几点：

- 定义action，reducers,store，这步是基础
- 在组件中引入store，通过store.subscribe(）自动监听store内的变化
- 组价中需要改变store是，用store.dispatch(action),执行后reducers会自动执行相应的逻辑修改store
- 组件中获取store，用store.getState()

## 二、react-redux

1. 什么是react-redux？ react-redux是一个react插件库,专门用来简化react应用中使用redux。他是从redux封装而来，因此基本原理和redux是一样的，同时存在一些差异。
2. react-redux模型图

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2f45c6b06d0649a68992d5b833692409~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

React-Redux 将所有组件分成两大类：UI 组件（presentational component）和容器组件（container component）

UI组件

- 只负责 UI 的呈现，不带有任何业务逻辑
- 没有状态（即不使用this.state这个变量）
- 所有数据都由参数（this.props）提供
- 不使用任何 Redux 的 API 容器组件
- 负责管理数据和业务逻辑，不负责 UI 的呈现
- 带有内部状态
- 使用 Redux 的 API
- UI 组件负责 UI 的呈现，容器组件负责管理数据和逻辑 React-Redux 规定，所有的 UI 组件都由用户提供，容器组件则是由 React-Redux 自动生成(由connect()函数生成)。也就是说，用户负责视觉层，状态管理则是全部交给它

1. react-redux相比于redux简化在哪里？ 我们已经知道，组件使用redux与store交互需要引入store，并且要手动调用store.subscript()监听store变化，使用起来比较麻烦。react-redux简化了这些步骤，使数据流管理使用起来更加方便。这些功能的实现得益于四个react-redux的API:provider、connect、mapStateToprops、mapDispatchToProps

-  组件：React-Redux 提供Provider组件，该组件把根组件包含起来，并且provider组件需要传入store，这样一来所有组件都可以得到state数据

```javascript
    //APP组件被包裹后，所有子组件都可以得到state数据
    <Provider store={store}>
       <App />
    </Provider>
复制代码
```

- connect：provider传入store，所有子组件都能拿到state，那具体怎么拿呢？就需要用到connect，它用于包装 UI 组件生成容器组件。connect包裹后生成了一个容器组件，connect方法接受两个参数：mapStateToProps和mapDispatchToProps。它们定义了 UI 组件的业务逻辑。前者负责输入逻辑，即将state映射到 UI 组件的参数（props），后者负责输出逻辑，即将用户对 UI 组件的操作映射成 Actio,此时就可以与store交互了。

```javascript
import { connect } from 'react-redux'
  connect(
    mapStateToprops,
    mapDispatchToProps
  )(OurComponent)
复制代码
```

- mapStateToProps(): 它是一个函数，建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系,把store的state挂载到组件的props上。mapStateToProps执行后应该返回一个对象，里面的每一个键值对就是一个映射。

```javascript
    const mapStateToProps = (state) => {
      return {
        todos: "todo value"
      }
    }
复制代码
```

- mapDispatchToProps(): mapDispatchToProps是connect函数的第二个参数，用来建立 UI 组件的参数到store.dispatch方法的映射,把dispatch触发action的函数挂载到props上。它定义了哪些用户的操作应该当作 Action，传给 Store。它可以是一个函数，也可以是一个对象。

```javascript
//dispatch就是store.dispatch,ownProps是容器组件的props对象
const mapDispatchToProps = (
  dispatch,
  ownProps
) => {
  return {
    onClick: () => {
      dispatch({
        type: 'SET_VISIBILITY_FILTER',
        filter: ownProps.filter
      });
    }
  };
}
复制代码
```

因此，react-redux通过provider组件做到了store的统一管理，并利用connect包裹组件生成容器组件是的组件与store打通数据流，这样一来就不需要在每一个组件中引入store，并监听store变化，使用更加方便