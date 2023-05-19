# 通俗易懂的 JSX 与 虚拟DOM

## JSX是什么？

JSX 是 JavaScript 的一种语法扩展，它和模板语言很接近，但是它充分具备 JavaScript 的能力。

## JSX如何在js中生效：

Babel 会把 JSX 转译成一个名为 React.createElement() 函数调用，React.createElement() 的语法糖。

（Babel不仅能将es6以上代码转换为es5，也可以将 JSX 语法转换为 JavaScript 代码。）

官网例子： ![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3372b4e9b0d040e5b245b4525c268345~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp) （图1）

## 为什么不直接用React.createElement()写代码而用JSX：

如图1还好，代码少，如图2代码多了的话会很乱，层次不分明，结构不清晰。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4c02faa71f224a99bc5a1677f98d9979~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp) （图2）

## React.createElement()源码：

createElement 函数的 3 个参数

type：标签。

config：组件。

如图2的：

{ className: "class5" }

children：子元素。

如图2的被嵌套部分：

/*#**PURE***/React.createElement("div", { className: "class1" }, "abc"), /*#**PURE***/React.createElement("div", { className: "class2" }, "abc"), /*#**PURE***/React.createElement("div", { className: "class3" }, /*#**PURE***/React.createElement("div", { className: "class4" }, "abc"))

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b627b9bfe4364c2fb031d07802e3e52e~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

```ini
ini复制代码
/**
 * Create and return a new ReactElement of the given type.
 * See https://reactjs.org/docs/react-api.html#createelement
 */
export function createElement (type, config, children) {
  // 储存后面需要用到的元素属性
  let propName;

  // Reserved names are extracted
  // 储存元素属性的键值对集合
  const props = {};

  // React 元素的属性
  let key = null;
  let ref = null;
  let self = null;
  let source = null;

  if (config != null) {
    // 依次对 ref、key、self 和 source 属性赋值
    if (hasValidRef(config)) {
      ref = config.ref;

      if (__DEV__) {
        warnIfStringRefCannotBeAutoConverted(config);
      }
    }

    // 将 key 转为字符串
    if (hasValidKey(config)) {
      key = '' + config.key;
    }

    self = config.__self === undefined ? null : config.__self;
    source = config.__source === undefined ? null : config.__source;
     // 接着就是要把 config 里面的属性都一个一个挪到 props 这个之前声明好的对象里面
    // Remaining properties are added to a new props object
    for (propName in config) {
      if (
        // 筛选出可以提进 props 对象里的属性
        hasOwnProperty.call(config, propName) &&
        !RESERVED_PROPS.hasOwnProperty(propName)
      ) {
        props[propName] = config[propName];
      }
    }
  }

  // Children can be more than one argument, and those are transferred onto
  // the newly allocated props object.
  // 把第二个参数之后的那个参数取出来
  const childrenLength = arguments.length - 2;
    // 判断长度，长度为1，就是个对象，直接赋值给props.children
  if (childrenLength === 1) {
    // 直接把这个参数的值赋给props.children
    props.children = children;
    // 长度大于1，就是个数组，处理嵌套多个子元素的情况
  } else if (childrenLength > 1) {
    // 声明一个子元素数组
    const childArray = Array(childrenLength);
    // 把子元素推进数组里
    for (let i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    if (__DEV__) {
      if (Object.freeze) {
        Object.freeze(childArray);
      }
    }
    // 最后把这个数组赋值给props.children
    props.children = childArray;
  }

  // Resolve default props
  if (type && type.defaultProps) {
    const defaultProps = type.defaultProps;
    for (propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }
  if (__DEV__) {
    if (key || ref) {
      const displayName =
        typeof type === 'function'
          ? type.displayName || type.name || 'Unknown'
          : type;
      if (key) {
        defineKeyPropWarningGetter(props, displayName);
      }
      if (ref) {
        defineRefPropWarningGetter(props, displayName);
      }
    }
  }
  // 最后返回一个调用ReactElement执行方法，并传入刚才处理过的参数
  return ReactElement(
    type,
    key,
    ref,
    self,
    source,
    ReactCurrentOwner.current,
    props,
  );
}
```

## React.createElement()作用：

将JSX解析为ReactElement()需要的参数，然后给ReactElement()调用。

## ReactElement()源码：

```php
php复制代码const ReactElement = function(type, key, ref, self, source, owner, props) {
  const element = {
    // This tag allows us to uniquely identify this as a React Element
    // 这个标签允许我们唯一地将其标识为React元素
    $$typeof: REACT_ELEMENT_TYPE,

    // Built-in properties that belong on the element
    // 属于元素的内置属性
    type: type,
    key: key,
    ref: ref,
    props: props,

    // Record the component responsible for creating this element.
    // 记录负责创建此元素的组件。
    _owner: owner,
  };
  
    // dev环境处理  不影响逻辑
  if (__DEV__) {
    // The validation flag is currently mutative. We put it on
    // an external backing store so that we can freeze the whole object.
    // This can be replaced with a WeakMap once they are implemented in
    // commonly used development environments.
    element._store = {};

    // To make comparing ReactElements easier for testing purposes, we make
    // the validation flag non-enumerable (where possible, which should
    // include every environment we run tests in), so the test framework
    // ignores it.
    Object.defineProperty(element._store, 'validated', {
      configurable: false,
      enumerable: false,
      writable: true,
      value: false,
    });
    // self and source are DEV only properties.
    Object.defineProperty(element, '_self', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: self,
    });
    // Two elements created in two different places should be considered
    // equal for testing purposes and therefore we hide it from enumeration.
    Object.defineProperty(element, '_source', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: source,
    });
    if (Object.freeze) {
      Object.freeze(element.props);
      Object.freeze(element);
    }
  }

  return element;
};
```

## ReactElement()作用：

返回一个ReactElement对象（虚拟dom节点）。

## ReactDOM.render()：

```javascript
javascript复制代码ReactDOM.render(

    // ReactElement

    element, 

    // 容器（真实DOM）

    container,

    // 回调函数，可选参数，可以用来处理渲染结束后的逻辑

    [callback]

)

用法：
ReactDOM.render(<App />, document.getElementById('root'));
```

## ReactDOM.render()作用：

将ReactElement渲染成真实dom

