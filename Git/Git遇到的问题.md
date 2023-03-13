# [Github "Updates were rejected because the remote contains work that you do not have locally."](https://stackoverflow.com/questions/18328800/github-updates-were-rejected-because-the-remote-contains-work-that-you-do-not-h)

如果您使用`README`和/或`LICENSE`文件初始化了一个新的 github 存储库，就会发生这种情况

出现错误的原因可能是您提交的代码与 GitHub 上的代码结构不同。它会产生可以通过以下方式解决的冲突

```
git pull
```

合并冲突解决：

```
git push
```

如果您确认您的新代码一切正常，您可以使用：

```
git push -f origin master
```