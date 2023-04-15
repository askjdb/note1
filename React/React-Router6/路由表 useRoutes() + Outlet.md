# React6---配置路由表

### 1.在src/page中创建路由组件

![在这里插入图片描述](https://img-blog.csdnimg.cn/f6a54f1d8e234f709f4a215aaa6706d7.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAX0NlY2lsaWE=,size_15,color_FFFFFF,t_70,g_se,x_16#pic_center)

***注***：其中，Login和Main为并列路由， Analyse，Manage，Sign 为Main的子路由：

### 2.在src/route下创建[路由表](https://so.csdn.net/so/search?q=路由表&spm=1001.2101.3001.7020)index.js

> 步骤：
> 1.引入路由组件
> 2.引入Navigate实现重定向
> 3.创建并暴露路由表

具体代码如下：

```jsx
import Main from "../pages/Main";
import Analyse from "../pages/Analyse";
import Manage from "../pages/Manage";
import Sign from "../pages/Sign";
import Login from "../pages/Login";

import {Navigate} from 'react-router-dom'

// 路由表统一管理理由
export default([
    {
        path:'/main',  //路径
        element:<Main/>,  //组件
        //子路由
        children:[  
            {
                path:'analyse',
                element:<Analyse/>
            },
            {
                path:'manage',
                element:<Manage/>
            },
            {
                path:'sign',
                element:<Sign/>
            }
        ]
    },
    {
        path:'login', 
        element:<Login/>
    },
    {
        path:'/',
        //实现路由重定向
        element:<Navigate to='/main'/>
    }
])

```

### 3.App.js组件内

**1.引入useRoutes以及route.js**

```jsx
import { useRoutes } from 'react-router-dom'
import route from './route'

```

**2.根据路由表生成对应路由**

```jsx
 const element = useRoutes(route)

```

**3.引用路由表**

```
{element}

```

完整代码如下：

```jsx
import React from 'react'
import { useRoutes } from 'react-router-dom'
import route from './route'
import './App.css'

export default function App() {
  //根据路由表生成对应路由
  const element = useRoutes(route)
  return (
    <div>
      {/* 引用路由表 */}
      {element}
    </div>
  )
} 


```

### 4. 若要显示子路由，需在父级路由组件(Main.js)中引入Outlet！！！

```jsx
import React from 'react'
import { Outlet } from 'react-router-dom'

export default function Main() {
  return (
    <div>
      Main
      <Outlet/>
    </div>
  )
}

```

