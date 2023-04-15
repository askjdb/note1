# node连接mongodb时出错·已解决（ECONNREFUSED错误）

最近在玩node.js时连接mongodb,代码如下

```js
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";
 
MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    console.log("连接成功！")
    db.close();
});
```

结果出现以下错误

```js
E:\node\mirth\node_modules\mongodb\lib\utils.js:504
                    throw error;
                    ^
 
MongoServerSelectionError: connect ECONNREFUSED ::1:27017
    at Timeout._onTimeout (E:\node\mirth\node_modules\mongodb\lib\sdam\topology.js:312:38)
    at listOnTimeout (node:internal/timers:559:17)
    at processTimers (node:internal/timers:502:7) {
  reason: TopologyDescription {
    type: 'Unknown',
    servers: Map(1) {
      'localhost:27017' => ServerDescription {
        _hostAddress: HostAddress { isIPv6: false, host: 'localhost', port: 27017 },
        address: 'localhost:27017',
        type: 'Unknown',
        hosts: [],
        passives: [],
        arbiters: [],
        tags: {},
        minWireVersion: 0,
        maxWireVersion: 0,
        roundTripTime: -1,
        lastUpdateTime: 519633465,
        lastWriteDate: 0,
        error: MongoNetworkError: connect ECONNREFUSED ::1:27017
            at connectionFailureError (E:\node\mirth\node_modules\mongodb\lib\cmap\connect.js:375:20)
            at Socket.<anonymous> (E:\node\mirth\node_modules\mongodb\lib\cmap\connect.js:295:22)
            at Object.onceWrapper (node:events:642:26)
            at Socket.emit (node:events:527:28)
            at emitErrorNT (node:internal/streams/destroy:164:8)
            at emitErrorCloseNT (node:internal/streams/destroy:129:3)
            at processTicksAndRejections (node:internal/process/task_queues:83:21)
      }
    },
    stale: false,
    compatible: true,
    heartbeatFrequencyMS: 10000,
    localThresholdMS: 15,
    logicalSessionTimeoutMinutes: undefined
  },
  code: undefined
}
```

网上找了将近一个小时原因，又试了试mongoose，结果出现了一样的ECONNREFUSED错误

使用其他工具连接mongodb,都没有出错,mongoCompass也连接成功

最终才发现原来是node localhost没有配置好，只需换成127.0.0.1即可

惨啊惨啊，浪费了多久时间~~~

最终代码


```js
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://127.0.0.1:27017/";
 
MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    console.log("连接成功！")
    db.close();
});
```

