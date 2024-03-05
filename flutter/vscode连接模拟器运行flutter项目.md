# vscode连接模拟器运行flutter项目

用VSCode开发Flutter APP，连接网易MUMU模拟器和夜神模拟器：

mumu模拟器
1，在vscode终端输入命令行进入MuMu安装bin目录：
如：cd D:\emulator\nemu\vmonitor\bin（查找自己电脑中安装mumu模拟器的文件路径）
2，输入命令行连接模拟器：
adb_server.exe connect 127.0.0.1:7555

ps:直接运行adb_server.exe connect 127.0.0.1:7555可能会报错：


![在这里插入图片描述](https://img-blog.csdnimg.cn/38d04e209fd441dd86ea94982dd5c6a2.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5aSn546L4LmR,size_20,color_FFFFFF,t_70,g_se,x_16)

解决：根据终端提示，重新输入命令：.\adb_server.exe connect 127.0.0.1:7555
连接成功！

![在这里插入图片描述](https://img-blog.csdnimg.cn/2064561c459049fa8d03cec355e98d42.png)

##### 夜神模拟器：

cd 到对应夜神模拟器 目录
D:\Program Files\Nox\bin
运行
nox_adb.exe connect 127.0.0.1:62001