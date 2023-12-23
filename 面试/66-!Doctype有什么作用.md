# !Doctype有什么作用

> 每个 HTML 文件里开头都有个很重要的东西`<!DOCTYPE html>`,DOCTYPE是document type的简写，它并不是 HTML 标签，也没有结束标签，它是一种标记语言的文档类型声明，即告诉浏览器当前 HTML 是用什么版本编写的。

## 一. 背景介绍

什么是DOCTYPE?
DOCTYPE是document type的简写，它并不是 HTML 标签，也没有结束标签，它是一种标记语言的文档类型声明，即告诉浏览器当前 HTML 是用什么版本编写的。

注意: DOCTYPE的声明必须是 HTML 文档的第一行，位于html标签之前。大多数Web文档的顶部都有doctype声明，它是在新建一个文档时，由Web创作软件草率处理的众多细节之一。很少人会去注意 doctype ，但在遵循标准的任何Web文档中，它都是一项必需的元素。doctype会影响代码验证，并决定了浏览器最终如何显示你的 Web文档。

## 二. 知识剖析

### DOCTYPE的作用?

DOCTYPE是document type(文档类型)的简写，在web设计中用来声明文档类型。
在所有 HTML 文档中规定 DOCTYPE 是非常重要的，这样浏览器就能了解预期的文档类型， 告诉浏览器要通过哪一种规范（DTD）解析文档（比如HTML或XHTML规范）。
DOCTYPE会影响代码验证，并决定了浏览器最终如何显示你的Web文档。

### HTML 4.01 和 HTML5 中 DOCTYPE的区别

HTML 4.01 中的 doctype 需要对 DTD 进行引用，因为 HTML 4.01 基于 SGML。
HTML 5 不基于 SGML，因此不需要对 DTD 进行引用，但是需要 doctype 来规范浏览器的行为（html 5简化了这种声明，意在告诉浏览器使用统一的标准即可）。

## 三. 代码实战

### 如何使用DOCTYPE?

HTML 文档的第一行，位于html标签之前 ,引入DOCTYPE声明。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
</body>
</html> 

```

**注意事项:**DOCTYPE的声明必须是 HTML 文档的第一行，位于html标签之前。在DOCTYPE声明前面出现了这些内容：普通文本、HTML 标签、HTML 注释、XML 声明、IE条件注释,会导致HTML 进入怪异模式.