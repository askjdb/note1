# node.js 使用 express-jwt 报错：expressJWT is not a function

# 问题描述

**node.js** 使用 **express-jwt** 生成token报错

##  控制台报错

![img](https://img-blog.csdnimg.cn/cd43b399fec648b1b823ccb45d5cc252.png)

# 问题原因

>  由于**express-jwt** 版本的更新，之前的语法不适用于现在的 新版本 ，可以看到现在 是 7 开头的版本

![img](https://img-blog.csdnimg.cn/4aa0962cbf9e4129b97b7180d7f15c76.png)

# 解决办法一 

简单粗暴，换更早版本的 **express-jwt**