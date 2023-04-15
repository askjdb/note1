# 解决[ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client

# [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client

## 这个问题是服务端重复响应照成的，例如：

```
db.query(sqlStr,userinfo.username,(err, result) => {
        if (err) {
            res.send({
                status:1,
                message:err.message
            })
        }
        if(result.length>0){
            res.send({
                status:1,
                msg:'用户名被占用'
            })
        }
        // 用户名可以使用
        res.send("ok")
    })

```

## 这里响应了两个以上，就会出现上面的报错，解决办法：

```
db.query(sqlStr,userinfo.username,(err, result) => {
        if (err) {
            return res.send({
                status:1,
                message:err.message
            })
        }
        if(result.length>0){
            return res.send({
                status:1,
                msg:'用户名被占用'
            })
        }
        // 用户名可以使用
        res.send("ok")
    })

```

## 这里把 出现问题的结果进行 return出去 ，就不会影响程序的运行了