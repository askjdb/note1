使用socket.emit，您可以像这样注册自定义事件：

服务器：

```javascript
var io = require('socket.io').listen(80);

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
```

客户端：

```javascript
var socket = io.connect('http://localhost');
socket.on('news', function (data) {
  console.log(data);
  socket.emit('my other event', { my: 'data' });
});
```

Socket.send也做了同样的事情，但是你不是注册“新闻”，而是注册消息：

服务器：

```javascript
var io = require('socket.io').listen(80);

io.sockets.on('connection', function (socket) {
  socket.send('hi');
});
```

客户端：

```javascript
var socket = io.connect('http://localhost');
socket.on('message', function (message) {
  console.log(message);
});
```

`socket.emit`允许您在服务器和客户端上发出自定义事件

`socket.send`发送通过`'message'`事件接收的消息

实现`socket.send`是为了与普通的WebSocket接口兼容。`socket.emit`仅是Socket.IO的功能。它们都做同样的事情，但是`socket.emit`在处理消息方面更方便一些。

`socket.send` //发送消息事件

`socket.emit(eventName[, ...args][, ack])` //您可以自定义eventName