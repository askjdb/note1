# TypeScript 中 import type 与 import 的区别

## import type vs import

之前没有深入学习过 TypeScript，就是看项目里别人怎么用，就照猫画虎地写。

这次也是一样，别人都是 import type，我就直接在其中加了一个我想引入的 MyEnum，结果就不行了，还得把 MyEnum 分开来用 import。


但这是为什么呢？后来搜了一下，终于弄明白了。[TypeScript 3.8 文档](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html)上说：

* import type only imports declarations to be used for type annotations and declarations. It always gets fully erased, so there’s no remnant of it at runtime.
  

大概意思就是：import type 是用来协助进行类型检查和声明的，在运行时是完全不存在的。

这下终于明白上面 enum 的那个问题了：如果通过 import type 来引入 MyEnum，固然可以在构建时起到类型检查的作用，但在运行时 MyEnum 就不存在了，当然就无法检查 MyEnum.SOME_VALUE 之类的取值了！

可是仔细一想，TypeScript 本来就不应该在运行时存在呀！为什么还要用 import type 呢？

其实，在少部分情况下（刚好就包括 enum ），import 的内容在运行时的确是存在的，使用 import type 和import 就会有区别。


## 使用 `import type` 的好处

import type 是 TypeScript 3.8 才加入的，为什么要加入这个功能呢？使用 import type 而不是 import 有什么好处？

简单来说，大部分情况下用 import 完全就可以了，但在比较罕见的情况下，会遇到一些问题，这时候使用 import type 就可以解决问题了。

当然，我也没碰到过这样的问题，只不过项目里在所有引入 TypeScript 类型的地方用的基本都是 import type，也就跟着用了。这样当然是更保险一些，没啥坏处。
