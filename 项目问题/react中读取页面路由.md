在5.1以上版本中，通过Hook可以获得pathname

```js
import { useLocation } from 'react-router-dom'

function Breadcrumb() {
  const location = useLocation();
  console.log(location.pathname);
  return (<div>Path : {location.pathname}</div>);
}
```

