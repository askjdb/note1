# React-Router BrowserHistory 刷新页面404问题

不管是做React项目还是Vue 的项目，当我们使用了路由Router，访问页面刷新页面不会出现 404的情况，这是因为在  webpack dev-serverde 使用已经默认有配置了；

```json
devServer: {
    port: 8989,
    historyApiFallback: true,
    proxy: {
      "/api": {
        target: "https://123",
        changeOrigin: true,
        pathRewrite: {
          "^/api": "",
        },
      },
    },
  },
```

historyApiFallback: true  就是这个配置，当在webserver中配置这一属性的时候，当服务端路由没有命中，就会自动render `index.html`，这时候，react-router就会生效，404路径的页面就能出来了；

那到了项目上线的时候，假如用了BrowserHistort，browserHistory 是使用 React-Router 的应用推荐的 history方案。它使用浏览器中的 History API 用于处理 URL，创建一个像example.com/list/123这样真实的 URL 。

在browserHistory 模式下，URL 是指向真实 URL 的资源路径，当通过真实 URL 访问网站的时候，由于路径是指向服务器的真实路径，但该路径下并没有相关资源，所以用户访问的资源不存在。

所以在 Nginx 配置文件里需要加入配置

```json
server {
	server_name react.thinktxt.com;
	listen 80;

	root /Users/txBoy/WEB-Project/React-Demo/dist;
	index index.html;
	location / {
    	try_files $uri /index.html;
  	}
}
```

通过配置Nginx，访问任何URI都指向index.html，浏览器上的path，会自动被React-router处理;

如果是Node端也是类似的，任何请求都指回到前端打包后的index.html文件

当然这只适用于单页应用，只有一个html文件的情况；

