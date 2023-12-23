# JavaScript 性能利器 —— Web Worker

### 简介

Web Worker (工作线程) 是 HTML5 中提出的概念，分为两种类型，专用线程（Dedicated Web Worker） 和共享线程（Shared Web Worker）。专用线程仅能被创建它的脚本所使用（一个专用线程对应一个主线程），而共享线程能够在不同的脚本中使用（一个共享线程对应多个主线程）。

专用线程可以看做是默认情况的 Web Worker，其加上修饰词的目的是为了与共享线程进行区分。本文会较为严格地区分两者，可能较为累赘，但个人认为这是必要的。如果单纯以 `Web Worker` 字样出现的地方指的是两者都会有的情况。

### 用途

Web Worker 的意义在于可以将一些耗时的数据处理操作从主线程中剥离，使主线程更加专注于页面渲染和交互。

- 懒加载
- 文本分析
- 流媒体数据处理
- canvas 图形绘制
- 图像处理
- ...

### 需要注意的点

- 有同源限制
- 无法访问 DOM 节点
- 运行在另一个上下文中，无法使用Window对象
- Web Worker 的运行不会影响主线程，但与主线程交互时仍受到主线程单线程的瓶颈制约。换言之，如果 Worker 线程频繁与主线程进行交互，主线程由于需要处理交互，仍有可能使页面发生阻塞
- 共享线程可以被多个浏览上下文（Browsing context）调用，但所有这些浏览上下文必须同源（相同的协议，主机和端口号）

### 浏览器支持度

根据 CanI Use 网站的统计，目前约有 93.05% 的浏览器支持专用线程。 ![image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/af51cf353eb148529ba8041ad484e5bf~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

而对于共享线程，则仅有大约 41.66% 的浏览器支持。 ![image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d24fb447b7e340e1b186ec890dfdef54~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

由于专用线程和共享线程的构造方法都包含在 window 对象中，我们在使用两者之前可以对浏览器的支持性进行判断。

```js
if (window.Worker) {
    // ...
}
if (window.SharedWorker) {
    // ...
}
```

### 线程创建

专用线程由 `Worker()`方法创建，可以接收两个参数，第一个参数是必填的脚本的位置，第二个参数是可选的配置对象，可以指定 `type`、`credentials`、`name` 三个属性。

```js
var worker = new Worker('worker.js')
// var worker = new Worker('worker.js', { name: 'dedicatedWorker'})
```

共享线程使用 `Shared Worker()` 方法创建，同样支持两个参数，用法与 `Worker()` 一致。

```js
var sharedWorker = new SharedWorker('shared-worker.js')
```

值得注意的是，因为 Web Worker 有同源限制，所以在本地调试的时候也需要通过启动本地服务器的方式访问，使用 `file://` 协议直接打开的话将会抛出异常。

### 数据传递

Worker 线程和主线程都通过 `postMessage()` 方法发送消息，通过 `onmessage` 事件接收消息。在这个过程中数据并不是被共享的，而是被复制的。值得注意的是 `Error` 和 `Function` 对象不能被结构化克隆算法复制，如果尝试这么做的话会导致抛出 `DATA_CLONE_ERR` 的异常。另外，`postMessage()` 一次只能发送一个对象， 如果需要发送多个参数可以将参数包装为数组或对象再进行传递。

关于 `postMessage()` 和结构化克隆算法（The structured clone algorithm）将在本文最后进行阐述。

下面是专用线程数据传递的示例。

```scss
// 主线程
var worker = new Worker('worker.js')
worker.postMessage([10, 24])
worker.onmessage = function(e) {
    console.log(e.data)
}

// Worker 线程
onmessage = function (e) {
    if (e.data.length > 1) {
        postMessage(e.data[1] - e.data[0])
    }
}
```

在 Worker 线程中，`self` 和 `this` 都代表子线程的全局对象。对于监听 `message` 事件，以下的四种写法是等同的。

```javascript
// 写法 1
self.addEventListener('message', function (e) {
    // ...
})

// 写法 2
this.addEventListener('message', function (e) {
    // ...
})

// 写法 3
addEventListener('message', function (e) {
    // ...
})

// 写法 4
onmessage = function (e) {
    // ...
}
```

主线程通过 `MessagePort` 访问专用线程和共享线程。专用线程的 port 会在线程创建时自动设置，并且不会暴露出来。与专用线程不同的是，共享线程在传递消息之前，端口必须处于打开状态。MDN 上的 `MessagePort` 关于 `start()` 方法的描述是：

> Starts the sending of messages queued on the port (only needed when using EventTarget.addEventListener; it is implied when using MessagePort.onmessage.)

这句话经过试验，可以理解为 `start()` 方法是与 `addEventListener` 配套使用的。如果我们选择 `onmessage` 进行事件监听，那么将隐含调用 `start()` 方法。

```javascript
// 主线程
var sharedWorker = new SharedWorker('shared-worker.js')
sharedWorker.port.onmessage = function(e) {
    // 业务逻辑
}
var sharedWorker = new SharedWorker('shared-worker.js')
sharedWorker.port.addEventListener('message', function(e) {
    // 业务逻辑
}, false)
sharedWorker.port.start() // 需要显式打开
```

在传递消息时，`postMessage()` 方法和 `onmessage` 事件必须通过端口对象调用。另外，在 Worker 线程中，需要使用 `onconnect` 事件监听端口的变化，并使用端口的消息处理函数进行响应。

```ini
// 主线程
sharedWorker.port.postMessage([10, 24])
sharedWorker.port.onmessage = function (e) {
    console.log(e.data)
}

// Worker 线程
onconnect = function (e) {
    let port = e.ports[0]

    port.onmessage = function (e) {
        if (e.data.length > 1) {
            port.postMessage(e.data[1] - e.data[0])
        }
    }
}
```

### 关闭 Worker

可以在主线程中使用 `terminate()` 方法或在 Worker 线程中使用 `close()` 方法关闭 worker。这两种方法是等效的，但比较推荐的用法是使用 `close()`，防止意外关闭正在运行的 Worker 线程。Worker 线程一旦关闭 Worker 后 Worker 将不再响应。

```scss
// 主线程
worker.terminate()

// Dedicated Worker 线程中
self.close()

// Shared Worker 线程中
self.port.close()
```

### 错误处理

可以通过在主线程或 Worker 线程中设置 `onerror` 和 `onmessageerror` 的回调函数对错误进行处理。其中，`onerror` 在 Worker 的 `error` 事件触发并冒泡时执行，`onmessageerror` 在 Worker 收到的消息不能进行反序列化时触发(本人经过尝试没有办法触发 `onmessageerror` 事件，如果在 worker 线程使用 `postMessage` 方法传递一个 Error 或 Function 对象会因为无法序列化优先被 `onerror` 方法捕获，而根本不会进入反序列化的过程)。

```javascript
// 主线程
worker.onerror = function () {
    // ...
}

// 主线程使用专用线程
worker.onmessageerror = function () {
    // ...
}

// 主线程使用共享线程
worker.port.onmessageerror = function () {
    // ...
}

// worker 线程
onerror = function () {

}
```

### 加载外部脚本

Web Worker 提供了 `importScripts()` 方法，能够将外部脚本文件加载到 Worker 中。

```scss
importScripts('script1.js')
importScripts('script2.js')

// 以上写法等价于
importScripts('script1.js', 'script2.js')
```

### 子线程

Worker 可以生成子 Worker，但有两点需要注意。

- 子 Worker 必须与父网页同源
- 子 Worker 中的 URI 相对于父 Worker 所在的位置进行解析

### 嵌入式 Worker

目前没有一类标签可以使 Worker 的代码像 `<script>` 元素一样嵌入网页中，但我们可以通过 `Blob()` 将页面中的 Worker 代码进行解析。

```xml
xml复制代码<script id="worker" type="javascript/worker">
// 这段代码不会被 JS 引擎直接解析，因为类型是 'javascript/worker'

// 在这里写 Worker 线程的逻辑
</script>
<script>
    var workerScript = document.querySelector('#worker').textContent
    var blob = new Blob([workerScript], {type: "text/javascript"})
    var worker = new Worker(window.URL.createObjectURL(blob))
</script>
```

### 关于 postMessage

Web Worker 中，Worker 线程和主线程之间使用结构化克隆算法（The structured clone algorithm）进行数据通信。结构化克隆算法是一种通过递归输入对象构建克隆的算法，算法通过保存之前访问过的引用的映射，避免无限遍历循环。这一过程可以理解为，在发送方使用类似 `JSON.stringfy()` 的方法将参数序列化，在接收方采用类似 `JSON.parse()` 的方法反序列化。

但是，一次数据传输就需要同时经过序列化和反序列化，如果数据量大的话，这个过程本身也可能造成性能问题。因此， Worker 中提出了 `Transferable Objects` 的概念，当数据量较大时，我们可以选择在将主线程中的数据直接移交给 Worker 线程。值得注意的是，这种转移是彻底的，一旦数据成功转移，主线程将不能访问该数据。这个移交的过程仍然通过 `postMessage` 进行传递。

```scss
scss
复制代码postMessage(message, transferList)
```

例如，传递一个 ArrayBuffer 对象

```ini
let aBuffer = new ArrayBuffer(1)
worker.postMessage({ data: aBuffer }, [aBuffer])
```

### 上下文

Worker 工作在一个 `WorkerGlobalDataScope` 的上下文中。每一个 `WorkerGlobalDataScope` 对象都有不同的 `event loop`。这个 `event loop` 没有关联浏览器上下文（browsing context），它的任务队列也只有事件（events）、回调（callbacks）和联网的活动（networking activity）。

每一个 `WorkerGlobalDataScope` 都有一个 `closing` 标志，当这个标志设为 `true` 时，任务队列将丢弃之后试图加入任务队列的任务，队列中已经存在的任务不受影响（除非另有指定）。同时，定时器将停止工作，所有挂起（pending）的后台任务将会被删除。

### Worker 中可以使用的函数和类

由于 Worker 工作的上下文不同于普通的浏览器上下文，因此不能访问 window 以及 window 相关的 API，也不能直接操作 DOM。Worker 中提供了 `WorkerNavigator` 和 `WorkerLocation` 接口，它们分别是 window 中 `Navigator` 和 `Location` 的子集。除此之外，Worker 还提供了涉及时间、存储、网络、绘图等多个种类的接口，以下列举了其中的一部分，更多的接口可以参考 [MDN 文档](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FWeb_Workers_API%2FFunctions_and_classes_available_to_workers)。

#### 时间相关

- clearInterval()
- clearTimeout()
- setInterval()
- setTimeout

#### Worker 相关

- importScripts()
- close()
- postMessage()

#### 存储相关

- Cache
- IndexedDB

#### 网络相关

- Fetch
- WebSocket
- XMLHttpRequest



## 1. 概述

JavaScript是单线程模型，所有的任务都只能在一个线程上完成，一次只能做一件事情。 Web Worker的作用就是为JavaScript创建多线程环境，允许主线程创建Worker线程，将一些任务分配给后者运行，两者互不干扰。等到Worker线程完成计算任务，再把结果返回给主线程。

**优点：一些计算密集型或高延迟的任务，被Worker线程负担了，主线程（通常负责UI交互）就会很流畅，不会被阻塞或拖慢。**

**注意：Worker一旦新建成功，就会始终运行，不会被主线程的活动（比如按钮点击等）打断。有利于随时响应主线程的通讯，但是Worker比较耗费资源，不应该过度使用，一旦使用应该关闭**

#### 注意事项

(1) 同源限制：分配给Worker线程运行的脚本文件，必须与主线程的脚本文件同源

(2) DOM限制：Worker线程所在的全局对象，与主线程的不一样，无法读取主线程所在的网页的DOM对象，也无法使用`document`、`windown`、`parent`这些对象。但是，Worker线程可以获取`navigator`和`location`对象。

(3) 通信联系：Worker线程和主线程不在同一个上下文环境，它们不能直接通信，必须通过消息完成。

(4) 脚本限制：Worker线程不能执行`alert()`和`confirm()`，但可以使用XMLHttpRequest对象发出Ajax请求

(5) 文件限制：Worker线程无法读取本地文件，即不能打开本机的文件系统 (file://)，它所加载的脚本，必须来自网络

## 基本用法

#### 1. 主线程

主线程采用`new`命令，调用`worker`构造函数，新建一个Worker线程。

```js
var worker = new Worker('work.js');
```

`Worker()`构造函数的参数是一个脚本文件，该文件就是Worker线程索要执行的任务。由于Worker不能读取本地文件，所以这个脚本必须来自网络。如果下载不成功（比如404错误），Worker就会默默的失败。然后，主线程调用`worker.postMessage()`方法，向Worker发消息。

```js
worker.postMessage('Hello World');
worker.postMessage({method: 'echo', args: ['Work']})
```

`worker.postMessage()`方法的参数，就是主线程传给Worker的数据，它可以是各种数据类型，包括二进制数据。接着，主线程通过`worker.onmessage`指定监听函数，接收子线程发出来的消息。

```js
worker.onmessage = function(event) {
    console.log('Recevied message ' + event.data);
    doSomething();
}
function doSomething() {
    // 执行任务
    worker.postMessage('Work done!');
}
```

Worker 完成任务以后，主线程就可以把它关掉

```js
js
复制代码worker.terminate();
```

#### 2. Worker线程

Worker线程内部需要有一个监听函数，监听message事件。

```js
// 写法一:
self.addEventListener('message', function(e) {
    this.postMessage('You said: ' + e.data);
}， false);

// 写法二:
addEventListener('message', function(e) {
    this.postMessage('You said: ' + e.data);
}， false);
```

也可以根据主线程发过来的数据，worker线程可以调用不同的方法。

```js
self.addEventListener('message', function(e) {
    var data = e.data;
    switch (data.cmd) {
        case 'start':
            self.postMessage('WORKER STARTER: ' + data.msg);
            break;
        case 'stop':
            self.postMessage('WORKED STOPED: ' + data.msg);
            self.close(); // Terminates the worker.
            break;
        default:
            self.postMessage('Unknown commandL ' + data.msg);
    }
}, false);
```

上述代码中，`self.close()`用于Worker内部关闭自身监听

#### 3. Worker加载脚本

Worker内部如果需要加载其他脚本，有一个专门的方法`importScripts()`。

```js
importScripts('script1.js);
// 同时加载多个脚本
importScripts('script1.js', 'script2.js');
```

#### 4. 错误处理

主线程可以监听Worker是否发生错误，Worker会触发主线程的`error`事件。

```js
worker.onerror(function(event) {
    console.log([
        'ERROR: Line', e.lineno, ' in ', e.filename, ': ', e.message
    ].join(''));
});
// 或者
worker.addEventListener('error', function(event) {
    // ...
})
```

Worker 内部也可以监听`error`事件。

#### 5. 关闭worker

```js
// 主线程
worker.terminate();

// Worker 线程
self.close();
```

## 数据通信

前面提及，主线程和worker之间的通信可以是文本，也可以是对象也可以是二进制数据【File、Blob、ArrayBuffer等类型】，但是这种关系是拷贝关系即是传值而不是传地址，worker对通信内容的修改，不应该到主线程。事实上，浏览器内部的运行机制是，先将通信内容串行化，然后把串行化后的字符发给worker，后者再将其还原。

```js
// 主线程
var uInt8Array = new Uint8Array(new ArrayBuffer(10));
for (var i = 0; i < uInt8Array.length;  ++i) {
    uInt8Array[i] = i * 2;
}
worker.postMessage(uInt8Array);

// Worker 进程
self.onmesssage = function(e) {
    var uInt8Array = e.data;
    postMessage('Inside worker.js: uInt8Array.toString() = ' + uInt8Array.toString());
    postMessage('Inside worker.js: uInt8Array.byteLength = ' + uInt8Array.byteLength);
}
```

但是，拷贝方式发送二进制数据，会造成性能问题。比如，主线程向 Worker 发送一个 500MB 文件，默认情况下浏览器会生成一个原文件的拷贝。为了解决这个问题，JavaScript 允许主线程把二进制数据直接转移给子线程，但是一旦转移，主线程就无法再使用这些二进制数据了，这是为了防止出现多个线程同时修改数据的麻烦局面。这种转移数据的方法，叫做[Transferable Objects](https://link.juejin.cn?target=https%3A%2F%2Fwww.w3.org%2Fhtml%2Fwg%2Fdrafts%2Fhtml%2Fmaster%2Finfrastructure.html%23transferable-objects)。这使得主线程可以快速把数据交给 Worker，对于影像处理、声音处理、3D 运算等就非常方便了，不会产生性能负担。

如果要直接转移数据的控制权，就要使用下面的写法。

```js
// Transferable Objects 格式
worker.postMessage(arrayBuffer, [arrayBuffer]);

// 例子
var ab = new ArrayBuffer(1);
worker.postMessage(ab, [ab]);
```

## 同页面的Web Worker

通常请下，Worker载入的是一个单独的JavaScript脚本，但是也可以载入与主线程在同一个网页的代码。

```js
<!DOCTYPE html>
  <body>
    <script id="worker" type="app/worker">
      addEventListener('message', function () {
        postMessage('some message');
      }, false);
    </script>
  </body>
</html>
```

上面是一段嵌入网页的脚本，注意必须指定script标签的type属性是一个浏览器不认识的值，上例是app/worker。然后，读取这一段嵌入页面的脚本，用 Worker 来处理。

```js
var blob = new Blob([document.querySelector('#worker').textContent]);
var url = window.URL.createObjectURL(blob);
var worker = new Worker(url);

worker.onmessage = function (e) {
  // e.data === 'some message'
};
```

上面代码中，先将嵌入网页的脚本代码，转成一个二进制对象，然后为这个二进制对象生成 URL，再让 Worker 加载这个 URL。这样就做到了，主线程和 Worker 的代码都在同一个网页上面。

## 事例：worker 线程完成轮询

有时，浏览器需要轮询服务器状态，以便第一时间得知状态改变。这个工作可以放在 Worker 里面。

```js
function createWorker(f) {
  var blob = new Blob(['(' + f.toString() +')()']);
  var url = window.URL.createObjectURL(blob);
  var worker = new Worker(url);
  return worker;
}

var pollingWorker = createWorker(function (e) {
  var cache;

  function compare(new, old) { ... };

  setInterval(function () {
    fetch('/my-api-endpoint').then(function (res) {
      var data = res.json();

      if (!compare(data, cache)) {
        cache = data;
        self.postMessage(data);
      }
    })
  }, 1000)
});

pollingWorker.onmessage = function () {
  // render data
}

pollingWorker.postMessage('init');
```

上面代码中，Worker 每秒钟轮询一次数据，然后跟缓存做比较。如果不一致，就说明服务端有了新的变化，因此就要通知主线程。

## 实例：Worker新建Worker

Worker 线程内部还能再新建 Worker 线程（目前只有 Firefox 浏览器支持）。下面的例子是将一个计算密集的任务，分配到10个 Worker。

主线程代码如下。

```js
var worker = new Worker('worker.js');
worker.onmessage = function (event) {
  document.getElementById('result').textContent = event.data;
};
```

Worker 线程代码如下。

```js
// worker.js

// settings
var num_workers = 10;
var items_per_worker = 1000000;

// start the workers
var result = 0;
var pending_workers = num_workers;
for (var i = 0; i < num_workers; i += 1) {
  var worker = new Worker('core.js');
  worker.postMessage(i * items_per_worker);
  worker.postMessage((i + 1) * items_per_worker);
  worker.onmessage = storeResult;
}

// handle the results
function storeResult(event) {
  result += event.data;
  pending_workers -= 1;
  if (pending_workers <= 0)
    postMessage(result); // finished!
}
```

上面代码中，Worker 线程内部新建了10个 Worker 线程，并且依次向这10个 Worker 发送消息，告知了计算的起点和终点。计算任务脚本的代码如下。

```js
// core.js
var start;
onmessage = getStart;
function getStart(event) {
  start = event.data;
  onmessage = getEnd;
}

var end;
function getEnd(event) {
  end = event.data;
  onmessage = null;
  work();
}

function work() {
  var result = 0;
  for (var i = start; i < end; i += 1) {
    // perform some complex calculation here
    result += 1;
  }
  postMessage(result);
  close();
}
```

## API

#### 1. 主线程

浏览器原生提供`Worker()`构造函数，用来供主线程生成Worker线程。

```js
var myWorker = new Worker(jsUrk, options);
```

`Worker()`构造函数，可以接受两个参数。第一个参数是脚本的网址（必须是同源），该参数是必须的，且只能加载JS脚本，否则会报错。第二个参数是配置对象，该对象可选，它的一个作用就是指定Worker的名称，用来区分多个Worker线程。

```js
// 主线程
var myWorker = new Worker('worker.js', { name : 'myWorker' });

// Worker 线程
self.name // myWorker
```

`Worker()`构造函数返回一个 Worker 线程对象，用来供主线程操作 Worker。Worker 线程对象的属性和方法如下。

```markdown
-   Worker.onerror：指定 error 事件的监听函数。
-   Worker.onmessage：指定 message 事件的监听函数，发送过来的数据在`Event.data`属性中。
-   Worker.onmessageerror：指定 messageerror 事件的监听函数。发送的数据无法序列化成字符串时，会触发这个事件。
-   Worker.postMessage()：向 Worker 线程发送消息。
-   Worker.terminate()：立即终止 Worker 线程。
```

### Worker 线程

Web Worker 有自己的全局对象，不是主线程的`window`，而是一个专门为 Worker 定制的全局对象。因此定义在`window`上面的对象和方法不是全部都可以使用。 Worker 线程有一些自己的全局属性和方法。

```markdown
-   self.name： Worker 的名字。该属性只读，由构造函数指定。
-   self.onmessage：指定`message`事件的监听函数。
-   self.onmessageerror：指定 messageerror 事件的监听函数。发送的数据无法序列化成字符串时，会触发这个事件。
-   self.close()：关闭 Worker 线程。
-   self.postMessage()：向产生这个 Worker 线程发送消息。
-   self.importScripts()：加载 JS 脚本。
```

