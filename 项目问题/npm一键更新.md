### **npm一键更新的包方法**

```
// 第一步：全局安装插件
npm install -g npm-check-updates
 
// 第二步在需更新的package.json默认下执行-u的命令更新package.json文件中的版本
ncu -u
 
// 第三步：执行npm install  自动安装最新的包
npm install

```

