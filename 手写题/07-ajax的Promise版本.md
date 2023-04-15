```js
function ajax(url, options = "get") {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest;
        xhr.open(options, url)
        xhr.send()
        xhr.onreadystatechange = () => {
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
                resolve(xhr.response);
            }
            else {
                reject(xhr.status);
            }
        }
    })
}
```

