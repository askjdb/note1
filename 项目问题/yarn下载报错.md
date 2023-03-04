# yarn下载报错There appears to be trouble with your network connection. Retrying.

首先我更换了淘宝的源：

1.yarn config set registry https://registry.npm.taobao.org

然后我删除了网络代理

1.yarn config delete proxy
2.npm config rm proxy
3.npm config rm https-proxy

最后我删除了yarn的配置文件，并执行了

yarn install --netwrok -timeout 100000





yarn 命令

yarn 升级最新版本

npm install yarn@latest -g

查看yarn历史版本

npm view yarn versions --json

yarn 升级指定版本 （例：升级到1.21.3版本）

yarn upgrade v1.21.3

yarn 降低到指定版本（先卸载，再安装）

npm uninstall yarn -g
npm install -g yarn@1.3.2

如果yarn install有误时。可重新install或者清除 重新执行

yarn install --force
yarn cache clean
