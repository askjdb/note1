# vscode+flutter+夜神模拟器(Windows篇)

### 前言

最近着手学习flutter，看了看网上的配置教程，很大部分是有vscode还要装Android Studio的，这对于大部分web前端同学来说Android Studio相对陌生，配置起来也不是很上手，so,下面就轮到我献献丑(装装逼)，给大家说说如何不安装Android Studio的情况下让flutter运行起来。

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/12/23/16f304c9ab55bf02~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)



#### 一、 Flutter SDK

下载Flutter SDK [链接](https://link.juejin.cn?target=https%3A%2F%2Fflutter.dev%2Fdocs%2Fdevelopment%2Ftools%2Fsdk%2Freleases%23windows)，解压到你要放置的目录，最好不要C盘下。然后打开系统环境变量，在Path中添加 flutter sdk 的bin路径，比如：D:XXX\flutter\bin
 由于墙的原因，安装packages慢，需要配置两个用户环境变量
 变量名PUB_HOSTED_URL，变量值https://pub.flutter-io.cn
 变量名FLUTTER_STORAGE_BASE_URL，变量值https://storage.flutter-io.cn

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/12/23/16f308d0ac2f2676~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)



配置完可以重启电脑，进入cmd 运行flutter doctor ，正常会提示缺少Android SDK 的问题，下面我们继续配置

#### 二、 下载jdk，配置java环境

下载jdk8,并配置好系统环境变量，这部分网上有很多教程。 配置成功在cmd下运行java和javac 能正常就行

#### 三、 配置Android SDK

前往[Android SDK官网](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.android.com%2Fstudio%2Findex.html)下载sdk-tools, 如果上不去，这个也行[androiddevtools](https://link.juejin.cn?target=https%3A%2F%2Fwww.androiddevtools.cn%2F%23)找到SDK Tools 下载
 解压sdk-tools,这里文件夹我改名为android_sdk了，配置sdk环境
 ANDROID_HOME:D:\android_sdk  （就是你的sdk-tools的解压目录） PATH:%ANDROID_HOME%\tools;%ANDROID_HOME%\platform-tools;

#### 四、安装sdk packages

在下载包之前，在你的C盘用户找到.android文件夹，没有的话设置显示隐藏的文件夹。然后在.android新建repositories.cfg，若存在则不新建

进入cmd，cd到android sDK tools bin 下 执行sdkmanager --list查看packages,可以查看版本

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/12/23/16f30ca41b2a806e~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)

我们可以通过sdkmanager --install "" 下载各种包，下面列举需要下载的包名，xxx代表版本号



| 需要下载的包名                                     | 说明                                         |
| -------------------------------------------------- | -------------------------------------------- |
| sdkmanager --install “build-tools;xx”              | 平台构建工具                                 |
| sdkmanager --install “platforms;android-xx         | APIs 对应构建工具                            |
| sdkmanager --install “platform-tools”              | 平台工具集                                   |
| sdkmanager --install “extras;google;m2repository”  | gradle相关                                   |
| sdkmanager --install “extras;android;m2repository” | gradle相关                                   |
| sdkmanager --install “emulator                     | 模拟器 (可选 如果你打算直连手机的话就不需要) |
| system-images;android-xx;google_apis_playstore;x86 | 如果你用模拟器就需要一个系统镜像             |



![安装成功](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/12/23/16f30d53141b6785~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)



#### 五、vscode运行flutter

1. vscode安装flutter查件

2. 在终端中运行flutter doctor,查看输出是否有问题 flutter doctor 没响应的话，查看电脑进程是否有git进程，杀死后重新运行flutter doctor即可，以下是成功的截图

   ![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/12/23/16f30d985e0978f7~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)

3. 左下角的设置点击进入 “命令面板”，在命令面板中点击flutter：new project 项

4. 打开你安装好的夜神模拟器，夜神运行起来后在cmd里面重连，比如：D:\Nox\bin\nox_adb.exe connect 127.0.0.1:62001，这里可以新建个bat文件，不用每次都要输入，点击bat文件就行

   ![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/12/23/16f30dcc55574b3e~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)

   这时在vscode右下角可以看到有模拟器啦。

5. 运行flutter run，第一次会卡很久，需要梯子在jcenter和google库里下载依赖，但是又因为有厚厚的墙访问不到，需要配置 阿里云的镜像。
    在你flutter项目的app 里的build.gradle 加 阿里云的镜像
    在你flutter sdk 的 如下路径 下的 flutter.gradle 也同样添加镜像。 flutter\packages\flutter_tools\gradle\flutter.gradle 下的buildscript{repositoreis{注释掉google() jcenter()}}
    添加的内容：

```
复制代maven{ url 'https://maven.aliyun.com/repository/google' }   
maven{ url 'https://maven.aliyun.com/repository/jcenter' }  
maven{ url 'http://maven.aliyun.com/nexus/content/groups/public'}
```



![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/12/23/16f30e1ec924df34~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/12/23/16f30e22525bf095~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)



1. flutter doctor 提示Some Android licenses not accepted
    按照提示 flutter doctor --android-license就行，然后一直y下去



![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/12/23/16f315522b4e9928~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)



7.执行flutter run 可以看到项目运行起来了

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/12/23/16f30e5410b1176b~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)

#### 六 、vscode中如何保存代码时自动热重载?

> **在vscode中每次修改完代码, 保存后还需要再按一次r, 才能热重载!
> 怎么才能实现像在Android Studio中, 当按了 ctrl + s 保存代码后自动热重载呢?
> 我们可以在vscode设置中 --> 找到Dart&Flutter扩展 --> Dart:Flutter Hot Reload On Save设置, 将默认选项manual修改为always,
> 现在可以愉快的使用ctrl + s 了!，设置了自动保存的话，只要修改就可以显示了
> **

![img](https://pic2.zhimg.com/80/v2-c9495d8bc2ecccd111444a116fc036e9_720w.webp)

### 总结

开发app的环境着实是复杂，没有web端直来直去的简单，说多都是泪

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/12/23/16f30e8575a7a0d9~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)

