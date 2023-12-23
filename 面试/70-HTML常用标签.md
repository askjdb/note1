# HTML常用标签

### 文本标签

常⽤文本标签如下：

- <hn>...</hn>标题标签，其中n为1–6的值。
- <i>...</i>斜体
- <em>...</em> 强调斜体
- <b>...</b> 加粗
- <strong>...</strong> 强调加粗
- <cite></cite> 作品的标题（引⽤用）
- <sub>...</sub> 下标 <sup>...</sup> 上标
- <del>...</del> 删除线

**示例**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>⽂文本标题示例例</title>
</head>
<body>
    <h3>HTML标签实例例--⽂文本标签</h3>
    
    <h1>h1标题</h1>
    <h2>h2标题</h2>
    <h3>h3标题</h3>
    <h4>h4标题</h4>
    <h5>h5标题</h5>
    <h6>h6标题</h6>
    
    <i>i: 斜体标签</i> <br/>
    <em>em: 强调斜体标签</em> <br/>
    <b>b: 加粗标签</b><br/><br/>
    
    <strong>strong: 强调加粗标签</strong><br/>
    <del>del: 删除线</del><br/>
    <u>u: 下划线</u> <br/><br/>
    
    水分子：H<sub>2</sub>O <br/>
    4<sup>2</sup>=16
</body>
</html>

```

效果如下：

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200913204231255.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80NDE0MTQ5NQ==,size_16,color_FFFFFF,t_70#pic_center)

注意：

- HTML 中有⽤用的字符实体
- 实体名称对⼤大⼩小写敏敏感

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200913204738186.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80NDE0MTQ5NQ==,size_16,color_FFFFFF,t_70#pic_center)

### HTML格式化标签

常⻅见格式化标签如下：

- `<br/>`换⾏行行
- `<p>...</p>` 换段
- `<hr />`⽔水平分割线
- `<ul>...</ul>` ⽆无序列表
- `<ol>...</ol>` 有序列表 其中type类型值：A a I i 1 start属性表示起始值
- `<li>...</li>`列表项
- `<dl>...</dl>`自定义列表
- `<dt>...</dt>`自定义列表头
- `<dd>...</dd>` 自定义列表内容
- `<div>...</div>` 常⽤用于组合块级元素，以便便通过 CSS 来对这些元素进⾏行行格式化
- `<span>...</span>` 常⽤用于包含的⽂文本，您可以使⽤用 CSS 对它定义样式，或者使⽤JavaScript 对它进行操作。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>HTML标签实例例--格式化标签</title>
</head>
<body>
    <h3>HTML介绍</h3>
    <p>超⽂文本标记语⾔言(Hyper Text Markup Language)，标准通⽤用标记语⾔言下的⼀一个应⽤用。HTML 不不
    是⼀一种编程语⾔言，⽽而是⼀一种标记语言 (markup language)，是⽹网⻚页制作所必备的。</p>
    <p>“超⽂文本”就是指⻚页⾯面内可以包含图片、链接，甚⾄至⾳音乐、程序等⾮非⽂文字元素。<br/>
超⽂文本标记语⾔言的结构包括“头”部分（英语：Head）、和“主体”部分（英语：Body），其中“头”部提
供关于⽹网⻚页的信息，“主体”部分提供⽹网⻚页的具体内容。</p>

<hr/>

<!-- 列列表标签 -->
你的爱好：
<ul>
    <li>看书</li>
    <li>上⽹网</li>
    <li>爬⼭山</li>
    <li>唱歌</li>
</ul>

<ol type="a">
    <li>看书</li>
    <li>上⽹网</li>
    <li>爬⼭山</li>
    <li>唱歌</li>
</ol>

<dl>
    <dt>问：HTML?</dt>
    <dd>答：超⽂文本标记语言</dd>
    <dt>问：HTML?</dt>
    <dd>答：超⽂文本标记语言</dd>
    <dt>问：HTML?</dt>
    <dd>答：超⽂文本标记语言</dd>
</dl>

<div>aaa</div>
<div>bbb</div>
<span>aaaa</span><span>bbbb</span>

</body>
</html>

```

效果

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200913204833900.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80NDE0MTQ5NQ==,size_16,color_FFFFFF,t_70#pic_center)

### HTML图像标签

在HTML网页中插入一张图片，使用img标签，他是一个单标签：
其中img标签中常用属性如下：

- src： 图⽚名及url地址
- alt: 图⽚加载失败时的提示信息
- title：文字提示属性
- width：图片宽度
- height：图片⾼高度
- border：边框线粗细

绝对路径和相对路径：

- 绝对路径：绝对路径就是你的主⻚上的⽂件或⽬录在硬盘上真正的路径，(URL和物理路径)
  - 例如：
    C:\xyz\test.txt 代表了test.txt文件的绝对路径。
    http://www.sun.com/index.htm也代表了一个URL绝对路径。
- 相对路路径：相对与某个基准⽬目录的路路径。包含Web的相对路径（HTML中的相对目录），
  - 例如：
    在Web开发中，"/"代表Web应用的根目录。
    物理路径的相对表示，
    “./” 代表当前目录,
    "…/"代表上级目录。这种类似的表示，也是属于相对路径。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
</head>
<body>
    <h3>HTML标签实例例--图⽚标签</h3>
    
    <img src="./images/a.jpg" title="图⽚" width="300" />
    <img src="./images/add.jpg" alt="⼆⽉兰花图⽚" width="300" />
    <img src="./images/a.jpg" width="280" border="2" />
</body>
</html>

```

