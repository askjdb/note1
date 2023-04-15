最近在项目中使用 redux 时遇到一个问题：使用多个 reducer 管理状态（如 ruducerA，reducerB），当通过 action 更新数据时，当前的 reducerA 数据更新成功，但另一个 reducerB 数据被初始化。

这个行为让我非常迷惑，排查了很久， 一度找不到下手点。代码如下：

```
APP.js
const rootReducer = combineReducers({
  RudecerA,
  RudecerB,
});
 
const store = createStore(
	rootReducer
);
 
 
export default function App(props) {
  return (
    <Provider store={store}>
    	<Router {...props} />
    </Provider>
  );
}
复制代码
reducerB.js
export function ReducerB(
  state = initState,
  action,
  ) {
    switch (action.type) {
      case UPDATE_RECORD_DATA:
        return { ...state, recordData: action.payload };
       case DELETE_RECORD_DATA:
         return { ...state, recordData: initRecordData };
        default:
    	  return initState;
   }
}
复制代码
```

### 解决办法

后来在官方文档看到关于 combineReducer 的介绍及注意点：

> 所有未匹配到的 action，必须把它接收到的第一个参数也就是那个 state 原封不动返回。

看到这里突然好像找到了希望，因为我在 reducerB 中默认返回的是 initState。**于是我试着将 initState 改为 state，问题竟然真的解决了！**

**但是为什么 combineReducer 要求默认返回 state 呢？**

### 追问溯源

首先我们使用 combineRuducer 的目的是通过切片方式来管理 state，它最终会合并所有的 state 并返回。

```js
export function combineReducers<S>(
  reducers: ReducersMapObject<S, any>
): Reducer<CombinedState<S>>
复制代码
```

通过查看源码，发现 combineRudecer 主要做了以下几件事：

- 过滤不合法的 reducer
- 遍历所有合法的 reducer ，并得到新的 state
- 判断 state 是否更新，如果更新就返回新值，否则反之。
- 合并所有 state，并返回。

### 总结

因为在平时开发中使用 switch case 时，都会给 default 赋值为 initState，防止程序出错。

而在 combineReducer 中每当发起 action 时，当前 reducer 会走到 case 中，返回期望的结果，但另外的reducer 没有命中条件，返回的就是初始值。

有时候因为惯性思维而写下一些难以排查的 bug，非常浪费精力，在使用这些库时，应该多理解其中原理，让自己少走弯路。

