# react函数式组件中使用react-redux

# 一、背景

最近我最近在用react重构公司的项目，但是在使用[redux](https://so.csdn.net/so/search?q=redux&spm=1001.2101.3001.7020)时，我遇到了很多坑，经过多次查找资料,特此记录：

# 二、踩坑过程

因为我已经搭建了项目架构，所以这里只从[react-redux](https://so.csdn.net/so/search?q=react-redux&spm=1001.2101.3001.7020)的使用开始

## 1、安装插件

```
npm i redux react-redux -S
```

## 2、定义store仓库，action，reducer

- #### redux目录结构如下

![在这里插入图片描述](https://img-blog.csdnimg.cn/cb13bd7b7dc242ffaa2274e8fe962be4.png)

#### 我们先来看看index.js，定义全局 数据仓库

### /redux/index.js

```js
import {legacy_createStore as createStore} from 'redux'
import {reducer} from './reducer'
const store = createStore(reducer)
export default store

```

如上，因为 redux已经不推荐使用 createStore()创建数据仓库了，如果我们继续使用，需要引入具有标识的 legacy_createStore
我这里仓库的数据比较简单，如果结构很复杂，我们应当根据模块拆分不同的文件，再用combineReducers合并为一个reducer

### /redux/reducer.js

```js
// store初始化仓库数据
const initState = {
    isLogin:false,
    menuList:[]
}
// reducer纯函数，用于操作中央仓库的数据
export const reducer = (state=initState,action)=>{
    const { type,data} = action
    switch(type){
        case 'SET_LOGIN_STATUS':
        	// 在不改变原有的state基础上，返回一个新的state
            return {
                ...state,
                isLogin:data
            }
        case 'SET_MENU_LIST':
            return {
                ...state,
                menuList:data
            }
        default:
            return initState    
    }
}

```

## 3、跟组件中引用

### /index.js

```js
import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom'
import './index.css';
import 'antd/dist/antd.min.css'
import App from './App';
import reportWebVitals from './reportWebVitals';
// redux实现数据共享
import {Provider} from 'react-redux'
import store from './redux/index'

console.log('app......store.....',store,store.getState())
ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
        	{/* 引入Provider，并将store注入 */}
            <Provider store={store}>
                <App store={store} />
            </Provider>
        </BrowserRouter>
    </React.StrictMode>
)

```

### 4、在需要获取store仓库数据的组件中获取

我这里是在Login登录页面中，需要获取仓库中的 isLogin字段

#### /components/login/index.jsx

```js
import React, { useEffect } from 'react'
import {useSelector,useDispatch} from 'react-redux'	// 通过useSelector(callback)获取store数据
// 登录页面组件
const Login = ()=>{
	// 获取中央仓库中的isLogin数据
	const isLogin = useSelector(state => state.isLogin)
	
	// 修改中央仓库数据
	const dispatch = useDispatch()
	dispatch({type:'SET_LOGIN_STATUS',data:true})
}

```

## useStore()



```js
const store = useStore()
```

这个`Hook`返回`redux` `<Provider>`组件的`store`对象的引用。

这个钩子应该不长被使用。`useSelector`应该作为你的首选。但是，有时候也很有用。来看个例子：

```js
import React from 'react'
import { useStore } from 'react-redux'

export const CounterComponent = ({ value }) => {
  const store = useStore()

  // 仅仅是个例子! 不要在你的应用中这样做.
  // 如果store中的state改变，这个将不会自动更新
  return <div>{store.getState()}</div>
}


```



# 三、api总结

- createStore()： 创建仓库
- useSelector()： 用户获取数据仓库某一项数据
- useDispatch()：更新数据