在引入Store对象时与react不同,其他一样

要在pages文件夹下建立一个_app.js文件

写入

```jsx
import { Provider } from "react-redux"
import store from '../redux/store'


export default function _app({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  )
}

```

这样就可以了

