# electron react-router-dom

如果您想在 Electron 中使用 React Router Dom，需要先安装 React 和 React Router Dom：

```bash
npm install react react-dom react-router-dom
```

然后在 Electron 的主进程中创建一个窗口，然后加载 React 应用的入口文件：

```javascript
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
}

app.whenReady().then(() => {
  createWindow();
});
```

在 React 应用的入口文件中，需要引入 React Router Dom，并创建一个 Router 组件，其中包含若干个 Route 组件，每个 Route 组件都对应一个页面，例如：

```javascript
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './Home';
import About from './About';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/about">
          <About />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
```

在这个例子中，我们创建了两个页面组件 Home 和 About，分别对应根路径和 /about 路径。在 Router 中，使用 Switch 组件来判断当前路径匹配哪个 Route，并渲染对应的页面组件。

最后，在渲染 React 应用的 div 元素中，使用 Electron 提供的 webFrame 对象来设置窗口的大小和标题：

```javascript
import React from 'react';
import { render } from 'react-dom';
import App from './App';
const { webFrame } = window.require('electron');

webFrame.setVisualZoomLevelLimits(1, 1);
webFrame.setLayoutZoomLevelLimits(0, 0);

render(<App />, document.getElementById('root'));

document.title = 'My Electron App';
```

这样就可以在 Electron 中使用 React Router Dom 进行页面路由了。