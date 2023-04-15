使用mongoose中方法时，例如查询第一条数据fondOne()，以then()获取返回值，获得的是promise对象，但如果在then(）前加上exec()方法，发现返回值并没有什么变化，那么exec（）方法还有存在的必要吗，查询了半天，获得了答案

加不加 .exec() 都会调用 then 方法？
查看资料都说 exec() 返回 Promise ？但是不加 exec() 也调用 then() 里面的方法。
答：
有区别的，一个是返回data一个是返回query，比如你想写一个统一的分页方法，就需要把查询的query传进去分页方法，通过附加其他查询来实现


两者返回的都是 promise对象
exec一般用于独立的动作一次性执行，
then则用于连续性的动作
从其方法名也可以区别它们的用法，exec就是执行的意思，then就是然后怎么怎么，
exec和then的参数是有所不同的，前者是 callback(err,doc)，后者则是 resolved(doc),rejected(err)
