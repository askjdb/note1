俗话说：“工欲善其事，必先利其器”，调试是每一个开发人员都要遇到的问题，选择一个合适的调试工具也尤为重要。 在 Node.js 开发过程中除了万能的 console.log 之外，本节介绍一个 Node.js 与 Chrome Devtools 结合的调试工具，以后你可以选择使用浏览器来调试 Node.js 应用程序了。

## **启动调试器**

### **创建测试代码**

```text
const fs = require('fs');
const path = require('path');
const filePath = path.resolve(__dirname, 'hello.txt')

console.log('filePath: ', filePath);

fs.readFile(filePath, (err, res) => {
  console.log(err, res.toString());
});
```

### **运行带有 --inspect-brk 标志的 node**

启动时在 node 后面加上 **`--inspect-brk`** 标志，Node.js 将监听调试客户端，默认情况下监听在 127.0.0.1:9229 地址，也可以显示指定地址 **`--inspect-brk=_host:port_`**

```text
$ node --inspect-brk app.js
Debugger listening on ws://127.0.0.1:9229/c7a51e5a-d9be-4506-83fb-0a9340d2b9ba
For help, see: https://nodejs.org/en/docs/inspector
```

注意 node --inspect 与 node --inspect-brk 的区别：--inspect 不会终断，--inspect-brk 在用户代码启动之前会终断，也就是代码在第一行就会暂停执行。

### **在 Chrome 中打开**

浏览器地址栏输入 **chrome://inspect/** 按回车键，如下所示：

![img](https://pic2.zhimg.com/80/v2-0dca2852d5fc554e499ff7c022d2c53d_720w.webp)

Remote Target 下展示了当前运行的 Node.js 版本号，打开 **inspect** 或 **Open dedicated Devtools for Node** 链接，如下所示：

![img](https://pic1.zhimg.com/80/v2-ad00a6f5e720a9d13aa2a407dc2aa8a4_720w.webp)

## **断点调试**

### **调试工具窗口介绍**

上方展示与服务器端调试需要的 5 个面板，和 Chrome 开发工具中的是基本相同的，可以理解为 “服务端的定制版”

- Connection：链接
- Console：控制台
- Sources：源代码调试（本节主要讲的）
- Memory：内存，查找影响性能的内存问题，包括内存泄漏、内存膨胀和频繁的垃圾回收
- Profiler：性能

![img](https://pic4.zhimg.com/80/v2-926928c8e922244059347c0aa39579a3_720w.webp)

右上角的五个图表，从左至右依次分别表示：

- Resume script execution(F8): 恢复脚本执行，每一次都会自动执行到断点处。
- Step over next function call(F10)：跳过下一个函数调用，执行当前代码行，在当前代码行的下一行处停止，是一步一步的操作。
- Step into next function call(F11)：单步进入下一个函数调用。
- Step out next function call(F11)：单步退出下一个函数调用。
- Step(F9)：执行当前代码行并在下一行处停止。

### **设置断点**

在 Source 选项卡下，找到 app.js 这是我们测试脚本的入口文件，如果是执行的 --inspect-brk 标志，默认会停留在代码第一行处。

第一种设置断点的方式，是在程序里加入 `debugger` 命令。

第二种设置断点的方式是在编辑器窗口中单击要设置的代码行，此时编辑器窗口中该行会处于被选中状态，还有一个右侧的小箭头。另外右下方 Breakpoints 面板中也展示出了我们设置的断点。

![img](https://pic3.zhimg.com/80/v2-3202d9f148f515e98f2e726608ebe0da_720w.webp)

取消断点，再次单击选中的代码行左侧，起到切换作用，或者右键选择 `Remove breakpoint`

![img](https://pic2.zhimg.com/80/v2-6bec42b9b7e5970a0d75480106e63e1d_720w.webp)

欲了解更多断点调试相关内容，参考了解 Chrome DevTools 更多信息，参考 **[使用断点暂停代码](https://zhuanlan.zhihu.com/developers.google.com/web/tools/chrome-devtools/javascript/breakpoints#conditional-loc)**

## **对已启动 Node.js 进程做调试**

如果一个 Node.js 进程启动时没有加 --inspect-brk 标志，但是我们又不想重启进程来调试，这个时候怎么办？以下两种方式任何一种都可以：

### **方式一：process._debugProcess(PID)**

找到当前启动的 Node 进程 ID，之后使用 `node -e 'process._debugProcess(26853)'` 会建立进程 26853 与调试工具的链接。

```text
$ ps ax | grep app.js 
26864 s001  S+     0:00.01 grep app.js
26853 s002  S+     0:00.09 node app.js

$ node -e 'process._debugProcess(26853)'
SIGUSR1
```

### **方式二：SIGUSR1 信号**

向 Node 进程发送 SIGUSR1 信号，也可以建立与调试工具的链接。在 Windows 上不可用，还需要注意版本，在 Node.js Version 8 或更高版本中将激活 Inspect API。

```text
$ kill -SIGUSR1 26853
```

### **测试**

以下对 Demo 做了修改，创建一个 HTTP Server 每收到一个请求读取文件，如果按照以上方式开启调试工具后，在浏览器输入 **`http://localhost:3000`** 回车后，会自动跳转到调试界面，现在你可以设置断点，向上面的方式一样进行调试。

**Tips：**当前程序运行在断点第 6 行，鼠标移动到 req.url 上之后会看到该属性对应的值。

![img](https://pic2.zhimg.com/80/v2-3a152576d1e8d5c9f2e5486e29d3362d_720w.webp)

## **远程调试**

如果是在服务器上调试，建议不要让调试器监听公共 IP 地址，这可能会引起远程访问的安全风险，但我们又想用本地的方式调试该怎么办呢？

如果要允许远程调试链接，建议是使用 SSL 隧道的方式，假设我们的服务运行在服务器 debug.nodejs.red 上，首先启动服务，和上面的方式一样。

```text
$ node --inspect-brk app.js
```

### **设置 SSH 隧道**

在本地计算机上设置 SSH 隧道，这将使本地计算机上端口为 9221 接收的链接转换到服务器 debug.nodejs.red 上的 9229 端口。

```text
$ ssh -L 9221:localhost:9229 user@debug.nodejs.red
```

### **Chrome DevTools 调试器的 Connection 中增加链接**

默认情况下，Connection 下只有一个 localhost:9229，在添加 1 个 localhost:9221 之后我们就可以向在本地运行 Node.js 程序一样进行调试。

![img](https://pic1.zhimg.com/80/v2-e9718d4c46263b23239140772b621ba8_720w.webp)

## **Reference**

- **[chrome-devtools](https://link.zhihu.com/?target=https%3A//developers.google.com/web/tools/chrome-devtools/)**
- **[debugging-getting-started](https://link.zhihu.com/?target=https%3A//nodejs.org/en/docs/guides/debugging-getting-started/)**