### 一、Cookie中的path

cookie中的path是cookie生效的范围，一般场景下cookie是服务器返回给客户端的一段数据，并且在该cookie的作用域内，每次请求都会在请求头中自动带上该cookie。而path就是这个cookie的作用域范围。
/fileUp/userLogin下创建的cookie默认path是/fileUp/userLogin。此时请求/fileUp/userLogin/aa会带上该cookie，但访问/fileUp/aa则不会。

### 二、当我们使用默认的path值

cookie的默认path是根据我们创建cookie时所在的uri决定的

1.当URI的path值是以“/”结尾的时候，直接设置为cookie的path值
2.当URI的path值不是以“/”结尾的时候，查看path里面是否有“/” ，如果有“/”的话，直接截取到最后一个“/”，然后设置为cookie的path值。如果没有“/”的话，将cookie的path设置为”/”。

### 三、手动设置path时

将path设置为index.jsp时，我们只有访问/fileUp/index.jsp/** 这样的资源才带cookie，访问跟index.jsp同目录的资源的时候不会带cookie.![在这里插入图片描述](https://img-blog.csdnimg.cn/0f6fe58f962649d2a556480c62e29d65.PNG#pic_center)

![在这里插入图片描述](https://img-blog.csdnimg.cn/89bf947dc74a453e9dccacaf6bcbe220.PNG?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5oOz5Yiw55qE5ZCN5a2X6YO96KKr5Lq655So5LqG,size_19,color_FFFFFF,t_70,g_se,x_16#pic_center)

**但当我们访问index.jsp/xx的时候**

![在这里插入图片描述](https://img-blog.csdnimg.cn/4f36201241aa414b9f6c900e27216fb0.PNG?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5oOz5Yiw55qE5ZCN5a2X6YO96KKr5Lq655So5LqG,size_19,color_FFFFFF,t_70,g_se,x_16#pic_center)

**我们看到cookie被带上了**