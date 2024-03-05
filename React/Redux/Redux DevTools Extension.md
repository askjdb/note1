# react 项目如何安装并使用 Redux DevTools Extension

一、react项目安装并使用Redux DevTools Extension

* 在 react 项目中，通过 npm install --save redux-devtools-extension 命令进行下载 redux-devtools-extension 工具, GitHub 地址为 https://github.com/zalmoxisus/redux-devtools-extension。

+ 在安装完成以后，就可以在 store 的 index.js 文件中进行使用， redux 与 redux-thunk的结合，代码如下所示：

- **第一种方式：**

```jsx
import { createStore, compose, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import reducer from './reducer'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(reducer, composeEnhancers(
    applyMiddleware(thunk)
))

export default store

```

- **第二种方式：**

```jsx
import { createStore, applyMiddleware } from 'redux'
import {thunk} from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import reducers from './reducers'

export default createStore(reducers, composeWithDevTools(applyMiddleware(thunk)))

```

+ **第三种方式：**
+ 在 `store` 的 `index.js` 文件中进行使用， `redux` 与 `redux-saga` 的结合，代码如下所示：

```jsx
import { createStore, applyMiddleware, compose } from 'redux'
import reducer from './reducer'
import todoSagas from './sagas'
import createSagaMiddleware from 'redux-saga'

const sagaMiddleware = createSagaMiddleware()
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose;
const enhancer = composeEnhancers(applyMiddleware(sagaMiddleware))

const store = createStore(reducer, enhancer)
sagaMiddleware.run(todoSagas)

export default store


```

