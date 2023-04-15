# react使用cookie

在 [react](https://link.juejin.cn?target=) 中使用 cookie，首先要了解 cookie 是什么？

[session](https://link.juejin.cn?target=)/cookie 是用于存储用户相关信息的数据存储形式
 session 存储在服务器保存的是对象，而`cookie`存储在浏览器本地保存的是[字符串](https://link.juejin.cn?target=)
 由于 session 是存储在服务器，会占用服务器资源，一般来说小型项目使用 cookie 的较多

#### 1. 下载 cookie 相关的包

```css
npm install react-cookies --save
```

#### 2.cookie 知识储备

```csharp
// 引用
import cookie from 'react-cookies'

//设置cookie，第三个参数的意思是所有页面都能用这个cookie
cookie.save(key,value,{path:"/"})
// 加载名为cookieName的cookie信息
cookie.load(cookieName)
// 删除名为cookieName的cookie信息
cookie.remove(cookieName)
```

根据以上存取 cookie 的格式，可以写出`cookie.js`

```javascript
import cookie from 'react-cookies'

// 获取当前用户cookie
export const loginUser = () => {
  return cookie.load('userInfo')
}

// 用户登录，保存cookie
export const onLogin = (user) => {
  cookie.save('userInfo', user, { path: '/' })
}

// 用户登出，删除cookie
export const logout = () => {
  cookie.remove('userInfo')
  window.location.href = '/Login'
}
```

#### 3.react 页面调用

以学生管理系统为例，未登录（无 cookie 时）pathname 为’/‘时，跳转到 Login 进行登录，登录后跳转到对应权限页面。已登录（有 cookie 存储时）pathname 为’/'时，跳转到当前用户对应的权限主页面

```javascript
import React, { Component } from 'react'
import { Router, Route, Switch } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import { loginUser } from './cooike' // 引入
import {
  StudentLayout, TeacherLayout, AdminLayout, Login,
} from './pages' // 导入页面
import NotFound from './components/Common/NotFound'
import Loading from './components/Common/Loading'

const browserHistory = createBrowserHistory() // 路由分发

class BasicRoute extends Component {
  render () {
    const userInfo = loginUser()
    if (userInfo && window.location.pathname === '/') {
      if (userInfo.accountRole === 0) {
        window.location.href = '/Admin'
      } else if (userInfo.accountRole === 1) {
        window.location.href = '/Teacher'
      } else if (userInfo.accountRole === 2) {
        window.location.href = '/Student'
      }
    }
    return (
      <Router history={browserHistory}>
        <Switch>
          {
            !loginUser()
              ? <Route exact path="/Login" component={Login} />
              : (
                <>
                <Route path="/Student" component={StudentLayout} />
                <Route path="/Teacher" component={TeacherLayout} />
                <Route path="/Admin" component={AdminLayout} />
                </>
              )
          }
          <Route exact path="/" component={Loading} />
          <Route exact component={NotFound} />
        </Switch>
      </Router>
    )
  }
}

export default BasicRoute
```

react-cookie 官网实例：[www.npmjs.com/package/rea…](https://link.juejin.cn?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Freact-cookies)

补充：
 在用户登出，删除 cookie 时

```javascript
// 用户登出，删除cookie
export const logout = () => {
  cookie.remove('userInfo')
  window.location.href = '/Login'
}
```

如果未在 cookie.remove() 方法中指定 path，那么并不会完全登出当前账号，比如在 / Admin/Personal/Add 路径下点击退出按钮，并不会如预期登出，解决这个问题的办法就是，在 cookie.remove() 方法中设定 path

```javascript
// 用户登出，删除cookie
export const logout = () => {
  cookie.remove('userInfo', { path: '/' })
  window.location.href = '/Login'
}
```

就可以解决 cookie 并未清除的问题了