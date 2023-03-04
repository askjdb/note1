来看一个CommonJS的例子：（index.js和moduleA.js在同级目录中）

index.js



```jsx
let a = require('./moduleA');
console.log(a);
console.log(a.xxx);
```

moduleA.js



```java
exports.xxx = {
  name: 'moduleA'
}
```

执行node index.js
 返回



```css
{ xxx: { name: 'moduleA' } }
{ name: 'moduleA' }
```

在上面这里例子里可以发现，require和exports是相对应的。

另外你或许知道还有一个module.exports
 它和exports有相同的作用，
 但两者有细微的差距。

例子：
 index.js



```jsx
let a = require('./moduleA');
console.log(a);
console.log(a.xxx);
```

moduleA.js



```java
exports = {     //这里省去.xxx
  name: 'moduleA'
}
```

这次会输出



```css
{}
undefined
```

这是为什么？

本质上一个文件就是一个module，
 当我们require一个文件的时候，
 真正对应去找的是module.export

moduleA.js 其实等价于



```java
module.exports = {}
exports = {     //这里省去.xxx
  name: 'moduleA'
}
```

1.module.exports 初始值为一个空对象 {}
 2.exports 是指向的 module.exports 的引用
 （在上面这里例子中，exports这个指针被重新赋值成了一个新的对象。）
 3.require() 返回的是 module.exports 而不是 exports
 （在上面这个例子中module.export没有被赋予任何值）