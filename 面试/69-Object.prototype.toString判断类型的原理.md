# Object.prototype.toString判断类型的原理

## 具体原理

在toString方法被调用时,会执行以下几个操作步骤～

1. 获取`this指向`的那个对象的`[[Class]]`属性的值。*（这也是我们为什么要用call改变this指向的原因）*
2. 计算出三个字符串"[object "、 第一步的操作结果Result(1)、 以及 "]" 连接后的新字符串。
3. 返回第二步的操作结果Result(2)，也就是类似 `[object className]` 这种格式字符串。

## `[[Class]]` 类属性

> 对象的类属性（class attribute）是一个字符串，用以表示对象的类型信息。ES3和ES5都没有提供设置这个属性的方法，并只有一种间接的方法可以查询到它。默认的toString方法（继承自Object.prototype）返回了如下格式的字符串：[object *class*] 因此，想要获得对象的类，可以调用对象的toString方法，然后提取已返回字符串的第8个到倒数第2个位置之间的字符。

```js
Object.prototype.toString.call(target).slice(8, -1);
```

综上，`[[Class]]`是一个字符串值，表明了该对象的类型。他是一个内部属性，所有的对象(原生对象和宿主对象)都拥有该属性，且不能被任何人修改。在规范中，`[[Class]]`是这么定义的：**内部属性 描述**。

> 宿主对象也包含有意义的“类属性”，但这和具体的JavaScript实现有关。

因为js中每个类型都有自己私有的`[[Class]]`属性，而且这个class是不能被任何人修改的，所以`tostring`方法是检测属性类型最准确的方法，比`instanceof`还准确。

**他也可以细分内置构造函数创建的类对象**：

> 通过内置构造函数（Array、Date等）创建的对象包含“类属性”（class attribute），他与构造函数的名称相匹配（这里也是我从contructor.name来区分数据类型的启发点）。

但是，**他无法区分自定义对象类型**。

> 通过对象直接量和Object.create创建的对象的类属性是“object”，那些自定义构造函数创建的对象也是一样。类属性都是“Object”，因此对于自定义类来说，没办法通过类属性来区分对象的类。

## 为什么用`call`

这里用`call`是为了改变`toString`函数内部的`this`指向，其实也可以用`apply`。

之所以必须改变this指向是因为，`toString`内部是获取`this`指向那个对象的`[[Class]]`属性值的，如果不改变`this`指向为我们的目标变量，`this`将永远指向调用`toString`的`prototype`。
 另外也是因为，很多对象继承的`toString`方法重写了，为了能调用正确的`toString`，才间接的使用`call/apply`方法。

代码演示：

```js
Object.prototype.toString = function () {
  console.log(this);
};
const arr1 = [];
Object.prototype.toString(arr1); // 打印(即this指向) Object.prototype
Object.prototype.toString.call(arr1); // 打印(即this指向) arr1
```

## 为什么null也能判断？undefined和null这两个原始值不是没有属性值吗？

因为每一个类型都有自己唯一的特定 **类属性**(`class attribute`) 标识，null也有、undefined也有。

## 该方法判断类型的缺陷

他虽然判断类型完善，但也不是没有缺点，主要有两点：

1. tostring会进行`装箱操作`，产生很多**临时对象**（所以真正进行类型转换时建议配合`typeof`来区分是对象类型还是基本类型，见最后代码）
2. 他无法区分**自定义对象类型**，用来判断这类对象时，返回的都是`Object`（针对“自定义类型”可以采用`instanceof`区分）

## 扩展：什么是装箱操作？

- `“装箱”`就是把基本类型用它们相应的引用类型包装起来，使其具有对象的性质。可以简单理解为 **“包装类”**。*（详细信息，可参考阅读《JavaScript权威指南-3.6 包装对象》相关解析，这里不再延伸）。*
- 而对应的“拆箱”，就是将引用类型的对象简化成值类型的数据

## 封装一个用于类型判断的完整工具

虽然Object原型的`toString`方法是一个比较完善的方案，但是为了弥补其装箱的缺点，我平时工作中封装了一个工具函数，结合`typeof` 和 `toString` 各自的特点，各取其所长，进行变量数据类型的判断：

```js
function classof(o) {
  if (o === null) return "null";
  if (typeof o !== "object") return typeof o;
  else
    return Object.prototype.toString
      .call(o)
      .slice(8, -1)
      .toLocaleLowerCase();
}
```

测试类型校验结果：

```js
classof(2020); // number
classof("石头加油"); // string
classof(true); // boolean
classof(undefined); // undefined
classof(null); // null
classof(Symbol("没毛病！")); // symbol
classof(1n); // bigint
classof({}); // object
classof(classof); // function
classof([]); // array
classof(new Date()); // date
// 还是没法细分自定义类，如果需要的话可以再结合constructor.name继续封装
classof(new classof()); // object
```

