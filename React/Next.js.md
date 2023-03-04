# Next.js简单使用教程

## 简介

> Next.js 是一个轻量级的 React 服务端渲染应用框架。

**优点：**

- 零配置

  自动编译并打包。从一开始就为生产环境而优化。

- 混合模式： SSG 和 SSR

  在一个项目中同时支持构建时预渲染页面（SSG）和请求时渲染页面（SSR）

- 增量静态生成

  在构建之后以增量的方式添加并更新静态预渲染的页面。

- 支持 TypeScript

  自动配置并编译 TypeScript。

- 快速刷新

  快速、可靠的实时编辑体验，已在 Facebook 级别的应用上规模上得到验证。

- 基于文件系统的路由

  每个 `pages` 目录下的组件都是一条路由。

- API 路由

  创建 API 端点（可选）以提供后端功能。

- 内置支持CSS

  使用 CSS 模块创建组件级的样式。内置对 Sass 的支持。

- 代码拆分和打包

  采用由 Google Chrome 小组创建的、并经过优化的打包和拆分算法。

## 创建Next.js项目

### 手动创建Next.js项目

> mkdir nextDemo //创建项目
>
> npm init //初始化项目
>
> npm i react react-dom next --save //添加依赖

在`package.json`中添加快捷键命令

```JSON
 "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev" : "next" ,
    "build" : " next build",
    "start" : "next start"
  },
```

创建`pages`文件夹和文件

在项目根目录创建`pages`文件夹并在`pages`文件夹中创建`index.js`文件

```js
function Index(){
    return (
        <div>Hello Next.js</div>
    )
}
export default Index
```

运行项目

> npm run dev

### `creact-next-app`快速创建项目

`create-next-app`可以快速的创建`Next.js`项目，它就是一个脚手架。

> npm install -g create-next-app		//全局安装脚手架
>
> create-next-app nextDemo		//基于脚手架创建项目
>
> cd nextDemo
>
> npm run dev		//运行项目

**目录结构介绍：**

- components文件夹: 这里是专门放置自己写的组件的，这里的组件不包括页面，指公用的或者有专门用途的组件。
- node_modules文件夹：Next项目的所有依赖包都在这里，一般我们不会修改和编辑这里的内容。
- pages文件夹：这里是放置页面的，这里边的内容会自动生成路由，并在服务器端渲染，渲染好后进行数据同步。
- static文件夹： 这个是静态文件夹，比如项目需要的图片、图标和静态资源都可以放到这里。
- .gitignore文件： 这个主要是控制git提交和上传文件的，简称就是忽略提交。
- package.json文件：定义了项目所需要的文件和项目的配置信息（名称、版本和许可证），最主要的是使用`npm install` 就可以下载项目所需要的所有包。

## Pages

在 Next.js 中，一个 **page（页面）** 就是一个从 `.js`、`jsx`、`.ts` 或 `.tsx` 文件导出（export）的 [React 组件](https://link.juejin.cn?target=https%3A%2F%2Freactjs.org%2Fdocs%2Fcomponents-and-props.html) ，这些文件存放在 `pages` 目录下。每个 page（页面）都使用其文件名作为路由（route）。

如果你创建了一个命名为 `pages/about.js` 的文件并导出（export）一个如下所示的 React 组件，则可以通过 `/about` 路径进行访问。

## 路由

页面跳转一般有两种形式，第一种是利用标签`<Link>`,第二种是用js编程的方式进行跳转，也就是利用`Router`组件

### Link

```js
import React from 'react'
import Link from 'next/link'


const Home = () => (
  <>
    <div>我是首页</div>
    <div><Link href="/pageA"><a>去A页面</a></Link></div>
    <div><Link href="/pageB"><a>去B页面</a></Link></div>

  </>
)

export default Home
```

注意：用`<Link>`标签进行跳转是非常容易的，但是又一个小坑需要你注意一下，就是他不支持兄弟标签并列的情况。

```jsx
 //错误写法
 <div>
  <Link href="/pageA">
    <span>去A页面</span>
    <span>前端博客</span>
  </Link>
</div>

//正确写法
<Link href="/pageA">
  <a>
    <span>去A页面</span>
    <span>前端博客</span>
  </a>
</Link>
```

### Router

```javascript
import Router from 'next/router'

<button onClick={()=>{Router.push('/pageA')}}>去A页面</button>


```

```jsx
import { useRouter } from 'next/router'

function ActiveLink({ children, href }) {
  const router = useRouter()
  const style = {
    marginRight: 10,
    color: router.asPath === href ? 'red' : 'black',
  }

  const handleClick = (e) => {
    e.preventDefault()
    router.push(href)
  }

  return (
    <a href={href} onClick={handleClick} style={style}>
      {children}
    </a>
  )
}

export default ActiveLink

useRouter is a React Hook, meaning it cannot be used with classes. You can either use withRouter or wrap your class in a function component.
```





### 参数传递与接收

在`Next.js`中只能通过通过query（`?id=1`）来传递参数，而不能通过(`path:id`)的形式传递参数。

```javascript
import Link from 'next/link'

//传递
<Link href="/blogDetail?bid=23"><a>{blog.title}</a></Link>

    
    
//blog.js
import { withRouter} from 'next/router'
import Link from 'next/link'

const BlogDetail = ({router})=>{
    return (
        <>
            <div>blog id: {router.query.name}</div>
            <Link href="/"><a>返回首页</a></Link>
        </>
    )
}
//withRouter是Next.js框架的高级组件，用来处理路由用的
export default withRouter(BlogDetail)


/************************************************************************************/
import Router from 'next/router'

<button onClick={gotoBlogDetail} >博客详情</button>

function gotoBlogDetail(){
    Router.push('/blogDetail?bid=23')
}

//object 形式
function gotoBlogDetail(){
    Router.push({
        pathname:"/blogDetail",
        query:{
            bid:23
        }
    })
}

<Link href={{pathname:'/blogDetail',query:{bid:23}}><a>博客详情</a></Link>
```

### 动态路由

```css
pages/post/[pid].js
route : /post/abc  -->  query : { "pid": "abc" }


pages/post/[pid]/[comment].js
route : /post/abc/a-comment  -->  query : { "pid": "abc", "comment": "a-comment" }

```

### 钩子事件

利用钩子事件是可以作很多事情的，比如转换时的加载动画，关掉页面的一些资源计数器.....

```jsx
//路由发生变化时
Router.events.on('routeChangeStart',(...args)=>{
    console.log('1.routeChangeStart->路由开始变化,参数为:',...args)
})

//路由结束变化时
Router.events.on('routeChangeComplete',(...args)=>{
    console.log('routeChangeComplete->路由结束变化,参数为:',...args)
})

//浏览器 history触发前
Router.events.on('beforeHistoryChange',(...args)=>{
    console.log('3,beforeHistoryChange->在改变浏览器 history之前触发,参数为:',...args)
})

//路由跳转发生错误时
Router.events.on('routeChangeError',(...args)=>{
    console.log('4,routeChangeError->跳转发生错误,参数为:',...args)
})

/****************************hash路由***********************************/

Router.events.on('hashChangeStart',(...args)=>{
    console.log('5,hashChangeStart->hash跳转开始时执行,参数为:',...args)
})

Router.events.on('hashChangeComplete',(...args)=>{
    console.log('6,hashChangeComplete->hash跳转完成时,参数为:',...args)
})
//注意钩子事件要放到useEff()里面，使用完毕卸载，否则每次更新页面都会触发事件
```

## 获取数据

### `getStaticProps`

**构建时请求数据**

在build阶段将页面构建成静态的html文件，这样线上直接访问HTML文件，性能极高。

- 使用`getStaticProps`方法在build阶段返回页面所需的数据。
- 如果是动态路由的页面，使用`getStaticPaths`方法来返回所有的路由参数，以及是否需要回落机制。

```javascript
// posts will be populated at build time by getStaticProps()
function Blog({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <li>{post.title}</li>
      ))}
    </ul>
  )
}

// This function gets called at build time on server-side.
// It won't be called on client-side, so you can even do
// direct database queries. See the "Technical details" section.
export async function getStaticProps(context) {
  // Call an external API endpoint to get posts.
  // You can use any data fetching library
  const res = await fetch('https://.../posts')
  const posts = await res.json()

  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      posts,
    },
  }
}

export default Blog
复制代码
```

### `getServerSideProps`

**每次访问时请求数据**

页面中`export`一个`async`的`getServerSideProps`方法，next就会在每次请求时候在服务端调用这个方法。

- 方法只会在服务端运行，每次请求都运行一边`getServerSideProps`方法
- 如果页面通过浏览器端`Link`组件导航而来，Next会向服务端发一个请求，然后在服务端运行`getServerSideProps`方法，然后返回JSON到浏览器。

```javascript
function Page({ data }) {
  // Render data...
}

// This gets called on every request
export async function getServerSideProps(context) {
  // Fetch data from external API
  const res = await fetch(`https://.../data`)
  const data = await res.json()

  // Pass data to the page via props
  return { props: { data } }
}

export default Page
复制代码
```

### getInitialProps

`getInitialProps` 是挂在 `React` 组件上的静态方法

我们可以在这个方法内部完成页面数据获取的工作

使用示例如下图：

![carbon (18).png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f6e6610d913f48a78feec3599ccaff77~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

那我们难道不可以在 `React` 组件内部 `ComponentDidMount` 去获取页面数据吗？ 

当然可以，不过既然 `Nextjs` 提供了这个为数据获取提供的方法，那自然有它的道理 

毕竟 `Nextjs` 身为 同构框架，事情并没有表面上看到的这么简单 

我们如果需要 `Nextjs` 的 `SSR` 大部分功能的话，还是尽可能地按照 `Nextjs` 提供的数据获取规范走

> `getInitialProps` 只会在组件身为页面 `pages` 目录下的一员时生效

值得注意的是，`getInitialProps` 会在服务端渲染时执行，也会在客户端渲染时执行这也是事情不简单的原因所在

当页面通过页面刷新等直接形式访问时，会触发 `Nextjs` 使用服务端渲染的方式返回页面数据

此时 `getInitialProps` 会在服务端执行，浏览器端不会执行

如图所示，通过服务端渲染访问 `Home` 时，在终端会输出 `console.log`：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1d3e3022b4cf4c37aac0a5dc0af33531~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

当页面通过浏览器端路由跳转的形式访问时（如浏览器前进后退），该页面渲染不会触发 `Nextjs` 服务端渲染

此时页面渲染前仍会触发 `getInitialProps` 方法，只不过执行时在浏览器端，如图所示：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8211450c77f3420396ed22215009f009~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

所以实际上 `getInitialProps` 方法会根据当前页面渲染时的端侧不同，自主地选择在 Node 端还是 Client 端执行

getInitialProps 一些需要了解的点：

- 数据获取通常为异步操作，`getInitialProps` 方法使用 `async` 异步执行即可
- `getInitialProps` 异步获取数据，页面会等到页面数据都获取加载完成后才进行渲染
- 因为是双端执行，所以需要尤为小心地使用仅一端存在的 `API`，如：`document`、`window` 等
- 因为是双端执行，数据获取需要某些时候考虑如何取用户状态如服务端侧可以使用 `ctx.req/ctx.res`
- 因为是双端执行，在 `getInitialProps` 方法里进行页面跳转也需要根据端侧不同使用跳转方式也不同

不清楚是不是自己还没 `Get` 到它的 `G` 点的缘故，`getInitialProps` 就目前自己使用的情况来看，它并不讨我喜欢 

在想是不是还是使用旧有的 `getStaticProps` 和 `getServerProps`，最起码很清晰所属哪一端，能够使用什么 `API`

## CSS支持（现在的Next.js支持直接import引入css）

### 添加全局css

要将样式表添加到您的应用程序中，请在 `pages/_app.js` 文件中导入（import）CSS 文件。

例如，假设有以下样式表 `styles.css`：

```css
body {
  font-family: 'SF Pro Text', 'SF Pro Icons', 'Helvetica Neue', 'Helvetica',
    'Arial', sans-serif;
  padding: 20px 20px 60px;
  max-width: 680px;
  margin: 0 auto;
}
```

首先创建一个 [`pages/_app.js` 文件](https://www.nextjs.cn/docs/advanced-features/custom-app) （如果不存在的话）。 然后 [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) 该 `styles.css` 文件。

```jsx
import '../styles.css'

// 新创建的 `pages/_app.js` 文件中必须有此默认的导出（export）函数
export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}
```

这些样式 (`styles.css`) 将应用于你的应用程序中的所有页面和组件。 由于样式表的全局特性，并且为了避免冲突，你应该 **只在 [`pages/_app.js`](https://www.nextjs.cn/docs/advanced-features/custom-app) 文件中导入（import）样式表**。

在开发中，以这种方式表示样式可让你在编辑样式时对其进行热重载，这意味着你可以保持应用程序的状态。

在生产环境中，所有 CSS 文件将自动合并为一个经过精简的 `.css` 文件。

从 Next.js **9.5.4** 版本开始，你可以在应用程序中的任何位置从 `node_modules` 目录导入（import） CSS 文件了。

对于全局样式表（例如 `bootstrap` 或 `nprogress`），你应该在 `pages/_app.js` 文件中对齐进行导入（import）。 例如：

```jsx
// pages/_app.js
import 'bootstrap/dist/css/bootstrap.css'

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}
```

对于导入第三方组件所需的 CSS，可以在组件中进行。例如：

```tsx
// components/ExampleDialog.js
import { useState } from 'react'
import { Dialog } from '@reach/dialog'
import VisuallyHidden from '@reach/visually-hidden'
import '@reach/dialog/styles.css'

function ExampleDialog(props) {
  const [showDialog, setShowDialog] = useState(false)
  const open = () => setShowDialog(true)
  const close = () => setShowDialog(false)

  return (
    <div>
      <button onClick={open}>Open Dialog</button>
      <Dialog isOpen={showDialog} onDismiss={close}>
        <button className="close-button" onClick={close}>
          <VisuallyHidden>Close</VisuallyHidden>
          <span aria-hidden>×</span>
        </button>
        <p>Hello there. I am a dialog</p>
      </Dialog>
    </div>
  )
}
```

### 添加组件级CSS

- `[name].module.css`

  ```css
  //login.module.css
  .loginDiv{
      color: red;
  }
  
  //修改第三方样式
  .loginDiv :global(.active){
      color:rgb(30, 144, 255) !important;
  }
  复制代码
  ```

  ```javascript
  import styles from './login.module.css'
  
  <div className={styles.loginDiv}/>
  
  复制代码
  ```

  Next.js 允许你导入（import）具有 `.scss` 和 `.sass` 扩展名的 Sass 文件。 你可以通过 CSS 模块以及 `.module.scss` 或 `.module.sass` 扩展名来使用组件及的 Sass

  > npm i sass --save

  如果要配置 Sass 编译器，可以使用 `next.config.js` 文件中的 `sassOptions` 参数进行配置。

  ```javascript
  const path = require('path')
  
  module.exports = {
    sassOptions: {
      includePaths: [path.join(__dirname, 'styles')],
    },
  }
  复制代码
  ```

- `CSS-in-JS`

  可以使用任何现有的 CSS-in-JS 解决方案。 最简单的一种是内联样式：

  ```javascript
  <p style={{ color: 'red' }}>hi there</p>
  复制代码
  ```

  使用 `styled-jsx` 的组件就像这样

  ```javascript
  function HelloWorld() {
    return (
      <div>
        Hello world
        <p>scoped!</p>
        <style jsx>{`
          p {
            color: blue;
          }
          div {
            background: red;
          }
          @media (max-width: 600px) {
            div {
              background: blue;
            }
          }
        `}</style>
        <style global jsx>{`
          body {
            background: black;
          }
        `}</style>
      </div>
    )
  }
  
  export default HelloWorld
  复制代码
  ```

## 懒加载

### 模块懒加载

第一步，先选择一个需要懒加载的插件，我们拿moment做例子。先安装它：

npm install moment -s

第二步，在页面里，用moment写一个例子

```jsx
const Task = ({ time }) => (
    <div>
        <span>time：{time}</span>
    </div>
)

Task.getInitialProps = async (ctx) =>{
    const moment = await import('moment')
    return { 
    	time: moment.default(Date.now() - 60*1000).fromNow()
    }
}

export default withRouter(Task)

```

第三步，重启，运行，在network里会发现moment的代码被新打包成了一个1.js加载出来

### 组件懒加载

第一步，先新建一个组件

task.list.jsx

```jsx
const TaskList = ()=>{
    return <div>这里是任务列表</div>
}
export default TaskList

```

第二步，再在页面内引入

task.js

```jsx
import dynamic from 'next/dynamic'
const TaskList = dynamic(import('../components/pages/task/task.list'))
const Task = ()=>{
	return <TaskList />
}
export default TaskList

```

第三步，重启，运行。在network里会发现task.list.js被新打包了一个js加载出来

## 自定义Header

```js
<Head>
    <title>技术胖是最胖的！</title>
    <meta charSet='utf-8' />
</Head>
```

## 在Next.js框架下使用AntDesineUI

