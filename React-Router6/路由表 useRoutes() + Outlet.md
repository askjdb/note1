# React-Router6】路由表 useRoutes() + Outlet

# 1、useRoutes() 介绍

- **原来写的路由管理如下**

```jsx
<Routes>
    <Route path='/about' element={<About />} />
    <Route path='/home' element={<Home />} />
    <Route path='/' element={<Navigate to='/about' />} />
</Routes>

```

- 使用路由表 `useRoutes()` 后
  - 正常会单独建一个 `routes` 文件夹，文件夹下单独维护一个路由表js文件

```jsx
import { useRoutes } from 'react-router-dom'

// 定义路由表
const elements = useRoutes([{
    path: '/about',
    element: <About />
}, {
    path: '/home',
    element: <Home />
}, {
    path: '/',
    element: <Navigate to='/about' />
}])

// 在配置路由管理的地方直接插入即可
{elements}

```

# 2、简单 CODING

## 2.1、项目结构

![在这里插入图片描述](https://img-blog.csdnimg.cn/776247fdc74447bcb40c96081da68617.png)

## 2.2、routes.js

```jsx
import { Navigate } from 'react-router-dom'
import About from '../components/About'
import Home from '../components/Home'

const routes = [{
    path: '/about',
    element: <About />
}, {
    path: '/home',
    element: <Home />
}, {
    path: '/',
    element: <Navigate to='/about' />
}]

export default routes

```

## 2.3、App.js

```jsx
import React from 'react'
import { NavLink, useRoutes } from 'react-router-dom'
import routes from './routes'

export default function App() {

    const activeClassName = ({ isActive }) => isActive ? 'list-group-item peiqi' : 'list-group-item'

    const elements = useRoutes(routes)

    return (
        <div>
            <div className="row">
                <div className="col-xs-offset-2 col-xs-8">
                    <div className="page-header"><h1>React Router Demo</h1></div>
                </div>
            </div>
            <div className="row">
                <div className="col-xs-2 col-xs-offset-2">
                    <div className="list-group" style={{ whiteSpace: 'pre-wrap' }}>
                        <NavLink className={activeClassName} to="/about">About</NavLink>
                        <NavLink className={activeClassName} to="/home">Home</NavLink>
                    </div>
                </div>
                <div className="col-xs-6">
                    <div className="panel">
                        <div className="panel-body" style={{ whiteSpace: 'pre-wrap' }}>
                            {/* 注册路由 */}
                            {elements}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

```

## 2.4、Result

![在这里插入图片描述](https://img-blog.csdnimg.cn/3052c99a6b574926a8ad159143e2f8c3.png#pic_center)

# 3、嵌套 Outlet CODING

## 3.1、项目结构

- **增加了子组件**

![在这里插入图片描述](https://img-blog.csdnimg.cn/5392e016fe1c430c82568c38b32505be.png)

## 3.2、routes.js

- **有子路由就加 `children` 属性，可以无限套娃**

```jsx
import { Navigate } from 'react-router-dom'
import About from '../components/About'
import Home from '../components/Home'
import Message from '../components/Home/Message'
import News from '../components/Home/News'

const routes = [{
    path: '/about',
    element: <About />
}, {
    path: '/home',
    element: <Home />,
    children: [{
        path: 'news',
        element: <News />
    }, {
        path: 'message',
        element: <Message />
    }]
}, {
    path: '/',
    element: <Navigate to='/about' />
}]

export default routes

```

## 3.3、Home.js

- **这里需要注意的变化**
- 子路由 NavLink 的 to 可以像原来一样写全 path：to="/home/news"
  也可以直接 ./ + 子路由名：to="./news"
  最简单直接写子路由名：to="news"
  子路由组件呈现的位置直接使用 6 提供的 <Outlet> 标签声明即可，会自动分配子路由管理

```jsx
import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'

export default function Home() {
    return (
        <>
            <h3>我是Home的内容</h3>
            <div>
                <ul class="nav nav-tabs">
                    <li>
                        <NavLink className='list-group-item' to="/home/news">News</NavLink>
                    </li>
                    <li>
                        {/* to 可以直接 ./ + 子路由名 */}
                        <NavLink className='list-group-item' to="./message">Message</NavLink>
                    </li>
                    <li>
                        {/* to 甚至可以直接写子路由名字 */}
                        <NavLink className='list-group-item' to="other">Other</NavLink>
                    </li>
                </ul>
                {/* 指定路由组件呈现的位置 */}
                <Outlet />
            </div>
        </>
    )
}

```

## 3.4、App.js

- 这里需要注意的变化
  - `<NavLink end>` end 属性可以父路由失去被选中状态，默认 false

```js
<NavLink className={activeClassName} end to="/home">Home</NavLink>
```

## 3.5、Result

![在这里插入图片描述](https://img-blog.csdnimg.cn/e8153d20258b40ed89ea504142dcf147.png#pic_center)