## morgan的基本知识

### 1、dev

1.1、app.use(logger(‘dev’))

在express的app.js中：app.use(logger('dev'));这里logger有一个参数 dev
文档中给出了一段格式：

+ 请求方法 ；请求的url和状态 ；响应耗时间 ；响应结果
  :method :url :status :response-time ms - :res[content-length]

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200704100445293.png)

1.2、app.use(logger(‘dev’,{stream:process.stdout})
logger第二个参数：app.use(logger('dev',{stream:process.stdout})，标准输出流；这个参数是默认的；所以可以不用写

如果是在开发环境中；用dev返回的基本数据是足够的；但是在线上环境这些数据还不足够


### 2、combined

2.1、app.use(logger(‘combined’))
所以线上环境可以用app.use(logger('combined'));
在文档中给出的格式是：

+ IP ；时间 ；请求方法 ；url；请求状态 ；带协议名和域名的url；响应结果；请求的引用头；请求用户代理头
  :remote-addr - :remote-user [:date[clf]] “:method :url HTTP/:http-version” :status :res[content-length] “:referrer” “:user-agent”

![在这里插入图片描述](https://img-blog.csdnimg.cn/2020070410052711.png)