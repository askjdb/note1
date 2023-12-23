# react 中 css modules-基本使用



import './index.css' 是全局引入css 但是这种引入方式会出现css全局污染（在不同组件的css文件中用了同一个类选择器，发生错误，相互覆盖） 即：当进行一个项目开发过程中，由于CSS类型定义不规范，导致存在相同类名出现样式覆盖的情况，就是CSS全局污染。简单来说，因为CSS引入的规则是引入CSS的时候后面引入的会覆盖掉前面的相同CSS样式，就像我们合并多个对象，当存在相同的key的时候，后面的对象会把前面相同key的value覆盖成自己的 

1. 下包 `     npm i sass -D        `

2. 改样式文件名。从 `xx.scss -> xx.module.scss` （React脚手架中的约定，与普通 CSS 作区分）

3. 引入使用。

   1. 组件中导入该样式文件（注意语法）

      ```javascript
       import styles from './index.module.scss'
      
      ```

   2. 通过 styles 对象访问对象中的样式名来设置样式

      ```xml
       <div className={styles.css类名}></div>
      
      ```

      css类名是index.module.scss中定义的类名。

### 示例

**原来**

- 定义样式 index.css

```css
 .root {font-size: 100px;}
复制代码
```

- 使用样式

```erlang
 import 'index.css'
 <div className="root">div的内容</div>
复制代码
```

**现在**

修改文件名： index.css ----> index.module.css。内部不变

使用样式

```css
 import styles from './index.module.css'
 
 <div className={styles.root}>div的内容</div>
复制代码
```

### 原理

CSS Modules 通过自动给 CSS 类名补足类名，保证类名的唯一性，从而避免样式冲突的问题 。

```javascript
 // Login.jsx
 import styles from './index.module.css'
 console.log(styles)
复制代码
```

![image-20211116154129900.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/15889061c6e34a988d8ee763981ddec3~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp?)

### css module的注意点

类名最好使用驼峰命名，因为最终类名会生成`styles`的一个属性

```lua
 .tabBar {}  ---> styles.tabBar
复制代码
```

如果使用中划线的命名，需要使用[]语法

```css
 .tab-bar {}  ---> styles['tab-bar']
复制代码
```

## cssModules-维持类名

### 目标

掌握:global关键字的用法，能用它来维持原类名

![image-20211116155020471.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e545dd0115154368958112bfcd2d67f6~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp?)

### 格式

在xxx.module.scss中，如果希望维持类名，可以使用格式：

```
:global(.类名)
```

### 示例

```css
 /*这样css modules就不会修改掉类名.a了。等价于写在 index.css中 */
 :global(.a) {   }
复制代码
 /* 这样css modules就不会修改掉类名.a了, 但是 .aa还是会被修改 */
 .aa :golbal(.a) { }
复制代码
```

### 应用

覆盖第三方组件的样式

```css
 :global(.ant-btn) {
   color: red !important;
 }
复制代码
```

## css modules-最佳实践

- 每个组件的根节点使用 CSSModules 形式的类名（ 根元素的类名： `root` ）
- 其他所有的子节点，都使用普通的 CSS 类名 :global

### index.module.scss

```arduino
 // index.module.scss
 .root {
   display: 'block';
   position: 'absolute';
   // 此处，使用 global 包裹其他子节点的类名。此时，这些类名就不会被处理，在 JSX 中使用时，就可以用字符串形式的类名
   // 如果不加 :global ，所有类名就必须添加 styles.title 才可以
   :global {
     .title {
       .text {
       }
       span {
       }
     }
     .login-form { ... }
   }
 }
复制代码
```

### 组件

```javascript
 import styles from './index.module.scss'
 const 组件 = () => {
   return (
     {/* （1） 根节点使用 CSSModules 形式的类名（ 根元素的类名： `root` ）*/}
     <div className={styles.root}>
       {/* （2） 所有子节点，都使用普通的 CSS 类名*/}
       <h1 className="title">
         <span className="text">登录</span>  
         <span>登录</span>  
       </h1>
       <form className="login-form"></form>
     </div>
   )
 }
```

