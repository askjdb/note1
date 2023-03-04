# VSCode远程连接Gitee

### 1、gitee介绍

Gitee（码云）是[开源中国](https://baike.baidu.com/item/开源中国/5462428)（OSChina）推出的基于Git的代码托管服务

[https://gitee.com](https://blog.csdn.net/qq_45099813/article/details/120047149)

GitHub：*GitHub*是世界上最大的代码托管平台,超5千万开发者正在使用，国外的

### 2、准备

- 下载git:[https://git-scm.com/downloads](https://blog.csdn.net/qq_45099813/article/details/120047149)

![在这里插入图片描述](https://img-blog.csdnimg.cn/e090a0dbde314637aae248d89c2ef0e4.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5Lic5pa5X-WIneeZvQ==,size_20,color_FFFFFF,t_70,g_se,x_16#pic_center)

![在这里插入图片描述](https://img-blog.csdnimg.cn/ba59effd5a6f4ed68d5f73cfe9f711c6.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5Lic5pa5X-WIneeZvQ==,size_20,color_FFFFFF,t_70,g_se,x_16#pic_center)

- 在gitee上创建一个仓库备用，仓库名随意

### 3、生成ssh公钥

- 安装好git后，找到git文件夹安装位置

![在这里插入图片描述](https://img-blog.csdnimg.cn/c68e7cf0689b4934a966e080869144eb.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5Lic5pa5X-WIneeZvQ==,size_20,color_FFFFFF,t_70,g_se,x_16#pic_center)

- 运行git.bash.exe，输入如下代码，gitee没有绑定邮箱需要绑定邮箱

```
ssh-keygen -t rsa -C "这里填写你git上面绑定的邮箱"
```

- 然后回车，正常情况下会出现如下代码，不是的话就检查一下自己输错没有

```
Generating public/private rsa key pair...
```

- 连续按三次回车，就会生成ssh key
- 生成的公钥可以在’C盘 -> 用户 -> <你自己电脑的账户> ->.ssh’中的id_rsa.pub查看，id_rsa.pub可以使用vscode打开

![在这里插入图片描述](https://img-blog.csdnimg.cn/1e0dbe29681442cc8c305dd174758a2c.png#pic_center)

### 4、添加公钥

- 打开你的gitee，找到设置，在设置栏找到ssh公钥

![在这里插入图片描述](https://img-blog.csdnimg.cn/7fbd90db12f3463eb0f0f4e0c58e10c6.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5Lic5pa5X-WIneeZvQ==,size_20,color_FFFFFF,t_70,g_se,x_16#pic_center)

### 5、初始化git

- 首先回到git-bash.exe命令窗口
- 输入以下指令：

```
git config --global user.name 你的gitee仓库名字  
git config --global user.email 你的gitee绑定的邮箱
```

- 仓库名字可以在设置里，个人资料的个人空间地址查看

![在这里插入图片描述](https://img-blog.csdnimg.cn/878e31c6c235488393cabc8ae7062d42.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5Lic5pa5X-WIneeZvQ==,size_20,color_FFFFFF,t_70,g_se,x_16#pic_center)

### 6、关联远程仓库

- 回到你的git仓库，打开最先创建的仓库，我这里创建了一个test仓库，然后复制仓库的地址

![在这里插入图片描述](https://img-blog.csdnimg.cn/8a12e7fb0a9b4044a0a0c2a17ad38b35.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5Lic5pa5X-WIneeZvQ==,size_20,color_FFFFFF,t_70,g_se,x_16#pic_center)

- 打开vscode，把这个仓库克隆到你想放的文件夹中

![在这里插入图片描述](https://img-blog.csdnimg.cn/ffd64b91530b4e52ad3881c18a09dbdf.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5Lic5pa5X-WIneeZvQ==,size_15,color_FFFFFF,t_70,g_se,x_16#pic_center)

- 我这里放到了我的VScode-Gitee工作区中，如果你想放在其他地方，也可以在其他文件夹下右键在集成终端中打开输入以下指令。

![在这里插入图片描述](https://img-blog.csdnimg.cn/adc95ce2d5c847b8a81c71087f614890.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5Lic5pa5X-WIneeZvQ==,size_20,color_FFFFFF,t_70,g_se,x_16#pic_center)

- 克隆完成后，你会发现你的文件夹下多了一个test文件夹，这个文件夹就是你gitee上面的远程仓库

![在这里插入图片描述](https://img-blog.csdnimg.cn/cfc28282ae7c4559be26e26b70a3c6e9.png#pic_center)

* 其实也可以在本地手动添加本地仓库，然后在资源管理器中打开本地仓库文件夹下点击右键Git Bash Here（这个选项安装完git后就有），然后使用命令行将本地仓库和远程仓库连接起来，前提是你的码云上有一个和本地仓库名字一模一样的远程仓库。我这里使用仓库克隆就省去了使用命令行连接的过程。

### 7、推送更新的代码

- 将本地仓库和远程仓库连接起来后就可以将本地修改的代码随时提交到码云上了。
- 首先，我这里在test下面添加了一个test.txt文件，这个时候你会发现左边的源代码管理栏出现了一个1，文件夹变成绿色，新建的test.txt文件右边出现了一个U，代表Update，即更新。

![在这里插入图片描述](https://img-blog.csdnimg.cn/ad5519e05e7145f7a264540a6878e7d9.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5Lic5pa5X-WIneeZvQ==,size_10,color_FFFFFF,t_70,g_se,x_16#pic_center)

- 然后我们打开源代码管理栏，发现test仓库下面出现刚刚添加的test.txt文件。所有在test文件夹下面的修改的内容都会出现在这里。

![在这里插入图片描述](https://img-blog.csdnimg.cn/66618f22a97d4eb18397bf3ae79e85ed.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5Lic5pa5X-WIneeZvQ==,size_10,color_FFFFFF,t_70,g_se,x_16#pic_center)

- 然后点击修改的文件后面的+号，再点击test仓库右边的√，然后就会弹出对话框，对话框输入的内容为本次远程提交的备注，然后回车

![在这里插入图片描述](https://img-blog.csdnimg.cn/b460e43c5e974263ae0ed1e84303fd37.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5Lic5pa5X-WIneeZvQ==,size_10,color_FFFFFF,t_70,g_se,x_16#pic_center)

![在这里插入图片描述](https://img-blog.csdnimg.cn/f178d9cb776c4c7c86aff3cfd8e4b645.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5Lic5pa5X-WIneeZvQ==,size_20,color_FFFFFF,t_70,g_se,x_16#pic_center)

- 然后点击test仓库右边的`···`，点击推送

![在这里插入图片描述](https://img-blog.csdnimg.cn/065e7ea91bca42ada334b28571c48890.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5Lic5pa5X-WIneeZvQ==,size_15,color_FFFFFF,t_70,g_se,x_16#pic_center)

- 此时我们回到码云仓库，就会发现刚刚提交的文件

![在这里插入图片描述](https://img-blog.csdnimg.cn/36ced6c8aaee440a8f183d87a90ad4c0.png#pic_center)

### 8、拉取远程仓库代码

- 当我们在码云上的仓库内容在非本设备的vscode上面被修改时，我们需要将码云上的代码复制到本机上时，就需要用到拉取功能
- 比如：我在码云上将test.txt文件手动删除，此时码云上跟我们的本地仓库的代码不一致

![在这里插入图片描述](https://img-blog.csdnimg.cn/9aad4cf459504cf6956687dfa0bcc4b5.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5Lic5pa5X-WIneeZvQ==,size_20,color_FFFFFF,t_70,g_se,x_16#pic_center)

- 这时我们回到vscode，点击源代码管理的test仓库的`···`，点击拉取

![在这里插入图片描述](https://img-blog.csdnimg.cn/6c7ad0869ddd48a3952f9fb8ca017634.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5Lic5pa5X-WIneeZvQ==,size_17,color_FFFFFF,t_70,g_se,x_16#pic_center)

- 拉取过后本地仓库test的test.txt也会被删除

![在这里插入图片描述](https://img-blog.csdnimg.cn/52f9b75e39454056b38a90fec037140c.png#pic_center)

### 9、移除远程连接

- 如果我们现在不想本地test仓库远程连接码云上的test，可以找到本地的test仓库目录中的.git文件，这个文件是隐藏文件，需要在资源管理器中的查看中勾选查看隐藏隐藏文件，然后删除它，这样本地test仓库中的内容被修改就不会出现在源代码管理中。

![在这里插入图片描述](https://img-blog.csdnimg.cn/a7b691b5eb374aacbcb3f09f4d783fee.png#pic_center)

以上就是vscode连接gitee的一些基础用法。