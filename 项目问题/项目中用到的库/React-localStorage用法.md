# React-localStorage用法

除非被清除，否则永久保存
大小一般为5MB
仅在客户端（即浏览器）中保存，不参与和服务器的通信
存在 XSS 注入的风险，只要打开控制台，就可以随意修改它们的值

```js
// 下载
npm install localStorage --save

// 引入
import localStorage from "localStorage";
```

## 1、存

```js
localStorage.setItem("phone", "123")

//对象
let obj = {"name":"xiaoming","age":"16"}
localStorage.setItem("phone",JSON.stringify(obj));
```

## 2、取

```js
localStorage.getItem("phone")

//对象
let user = JSON.parse(localStorage.getItem("phone"))
```

## 3、删

```js
//指定删
localStorage.removeItem('phone');

//全删
localStorage.clear(); 
```

## 4、设置localStorageSet 过期时间

```js
//设置缓存
const localStorageSet = (name, data) => {
    const obj = {
        data,
        expire: new Date().getTime() + 1000 * 60 * 30
    };
    localStorage.setItem(name, JSON.stringify(obj));
};
```

## 5、读取缓存，且比较时间戳是否过期

```js
//读取缓存
const localStorageGet = name => {
    const storage = localStorage.getItem(name);
    const time = new Date().getTime();
    let result = null;
    if (storage) {
        const obj = JSON.parse(storage);
        if (time < obj.expire) {
            result = obj.data;
        } else {
            localStorage.removeItem(name);
        }
    }
    return result;
};
```

## 6、使用

```js
//存
localStorageSet('weather', data)

//取（返回null则过期）
localStorageGet('weather')
```

确实可以不用“npm install localStorage”

```js
window.localStorage("", data)
```