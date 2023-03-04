#### 简易的命令行入门教程:

Git 全局设置:

```
git config --global user.name "王麻子"
git config --global user.email "12542501+ausbdbdh@user.noreply.gitee.com"
```

创建 git 仓库:

```
mkdir one
cd one
git init //初始化
touch README.md
git add README.md
git add . //将目录下所有文件传到缓冲区
git commit -m "first commit" //将缓冲区的文件上传到本地仓库
git remote add origin https://gitee.com/ausbdbdh/one.git //zgitee自己创建的仓库的地址
git push -u origin "master"  //master是分支名，默认是master
```

已有仓库?

```
cd existing_git_repo
git remote add origin https://gitee.com/ausbdbdh/one.git
git push -u origin "master"
```