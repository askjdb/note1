# socket跨域问题 

socket跨域问题 ，可以让他监听一个新的端口就解决了  io.listen(1001)，然后加上跨域资源共享const io = require("socket.io")(server, { cors: true })

```js
module.exports = function (server) {
    // 得到 IO 对象
    const io = require('socket.io')(server, { cors: true })//跨域资源共享
    io.listen(1001)//监听新的duan'o
    // 监视连接(当有一个客户连接上时回调)
    io.on('connection', function (socket) {
        console.log('soketio connected')
        // 绑定 sendMsg 监听, 接收客户端发送的消息
        socket.on('sendMsg', function (data) {
            console.log('服务器接收到浏览器的消息', data)
            // 向客户端发送消息(名称, 数据)
            io.emit('receiveMsg', data.name + '_' + data.date)
            console.log('服务器向浏览器发送消息', data)
        })
    })
}
```

