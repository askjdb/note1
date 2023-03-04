# 安装Nodejs踩过的坑：npm安装报错npm ERR! code EPERM npm ERR! syscall mkdir npm ERR! path D:\Program Files\nod..)

![img](https://img-blog.csdnimg.cn/202110101909410.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5bCR5bCR5LiN5Lya57yW56iL,size_20,color_FFFFFF,t_70,g_se,x_16)

网上查找了许多博文之后找到了解决方法：

**1、删除C:\Users\用户\下的.npmrc文件**

![img](https://img-blog.csdnimg.cn/20211010212408816.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5bCR5bCR5LiN5Lya57yW56iL,size_20,color_FFFFFF,t_70,g_se,x_16)

这里我的.npmrc是正常显示的，如果你的没有，看是不是因为将隐藏的项目勾选上了，然后去掉勾选。

2、在命令行输入npm cache clean --force

执行成功后会出现npm WARN using --force I sure hope you know what you are doing

