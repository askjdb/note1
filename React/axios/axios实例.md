## 创建一个实例axios.create([config])

```js
const instance = axios.create({
  baseURL: 'https://some-domain.com/api/',
  timeout: 1000,
  headers: {'X-Custom-Header': 'foobar'}
});
```

## 实例方法

以下是可用的实例方法。指定的配置将与实例的配置合并。

##### axios#request(config)

##### axios#get(url[, config])

##### axios#delete(url[, config])

##### axios#head(url[, config])

##### axios#options(url[, config])

##### axios#post(url[, data[, config]])

##### axios#put(url[, data[, config]])

##### axios#patch(url[, data[, config]])

##### axios#getUri([config])