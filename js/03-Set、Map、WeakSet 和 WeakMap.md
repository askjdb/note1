# 介绍下 Set、Map、WeakSet 和 WeakMap

## 1. 集合（Set）

### 1.1 啥是Set

> ES6 新增的一种新的数据结构，类似于数组，但成员是唯一且无序的，没有重复的值。

**Set 本身是一种构造函数，用来生成 Set 数据结构**。

```js
new Set([iterable])
```

举个例子：

```js
const s = new Set()
[1, 2, 3, 4, 3, 2, 1].forEach(x => s.add(x))

for (let i of s) {
    console.log(i)	// 1 2 3 4
}

// 去重数组的重复对象！！！
let arr = [1, 2, 3, 2, 1, 1]
[... new Set(arr)]	// [1, 2, 3]

//去除字符串里面的重复字符
[...new Set('ababbc')].join('')  // "abc"
```

Set 对象允许你储存任何类型的唯一值，无论是原始值或者是对象引用。

向 Set 加入值的时候，不会发生类型转换，所以5和"5"是两个不同的值。Set 内部判断两个值是否不同，使用的算法叫做“Same-value-zero equality”，它类似于精确相等运算符（===），主要的区别是**NaN等于自身，而精确相等运算符认为NaN不等于自身**。

```js
let set = new Set();
let a = NaN;
let b = NaN;
set.add(a);
set.add(b);
set // Set {NaN}

let set1 = new Set()
set1.add(5)
set1.add('5')
console.log([...set1])	// [5, "5"]
```

另外，两个对象总是不相等的

```js
let set = new Set();

set.add({});
set.size // 1

set.add({});
set.size // 2
```

### 1.2 set的属性和方法

- Set 实例属性：
  - constructor： 构造函数
  - size：元素数量

```js
let set = new Set([1, 2, 3, 2, 1])
console.log(set.length)	// undefined
console.log(set.size)	// 3
```

- Set 实例方法1：
  - 操作方法
    - add(value)：新增，相当于 array里的push
    - delete(value)：存在即删除集合中value
    - has(value)：判断集合中是否存在 value
    - clear()：清空集合

```js
let set = new Set()
set.add(1).add(2).add(1)
set.has(1)	// true
set.has(3)	// false
set.delete(1)	
set.has(1)	// false
```

Array.from 方法可以将 Set 结构转为数组

```js
const items = new Set([1, 2, 3, 2])
const array = Array.from(items)
console.log(array)	// [1, 2, 3]
// 或
const arr = [...items]
console.log(arr)	// [1, 2, 3]

//这就提供了去除数组重复成员的另一种方法。！！！
function dedupe(array) {
  return Array.from(new Set(array));
}

dedupe([1, 1, 2, 3]) // [1, 2, 3]
```

- Set 实例方法2：
  - 遍历方法（遍历顺序为插入顺序）
    - keys()：返回一个包含集合中所有键的迭代器
    - values()：返回一个包含集合中所有值得迭代器
    - entries()：返回一个包含Set对象中所有元素得键值对迭代器
    - forEach(callbackFn, thisArg)：用于对集合成员执行callbackFn操作，如果提供了 thisArg 参数，回调中的this会是这个参数，没有返回值

由于 Set 结构没有键名，只有键值（或者说**键名和键值是同一个值**），所以keys方法和values方法的行为完全一致

```js
let set = new Set([1, 2, 3])
console.log(set.keys())	// SetIterator {1, 2, 3}
console.log(set.values()) // SetIterator {1, 2, 3}
console.log(set.entries()) // SetIterator {1, 2, 3}

for (let item of set.keys()) {
  console.log(item);
}	
// 1
// 2
// 3
for (let item of set.entries()) {
  console.log(item);
}
//键名和键值是同一个值
// [1, 1]	
// [2, 2]	
// [3, 3]

set.forEach((value, key) => {
    console.log(key + ' : ' + value)
})	
// 1 : 1	
// 2 : 2	
// 3 : 3
console.log([...set])	// [1, 2, 3]
```

Set 结构的实例默认可遍历，它的默认遍历器生成函数就是它的values方法：

```js
Set.prototype[Symbol.iterator] === Set.prototype.values
// true
```

所以， Set可以使用 map、filter 方法：

```js
let set = new Set([1, 2, 3])
set = new Set([...set].map(item => item * 2))
console.log([...set])	// [2, 4, 6]

set = new Set([...set].filter(item => (item >= 4)))
console.log([...set])	//[4, 6]
```

因此，Set 很容易实现交集（Intersect）、并集（Union）、差集（Difference）：

```js
let set1 = new Set([1, 2, 3])
let set2 = new Set([4, 3, 2])

let intersect = new Set([...set1].filter(value => set2.has(value)))
let union = new Set([...set1, ...set2])
let difference = new Set([...set1].filter(value => !set2.has(value)))

console.log(intersect)	// Set {2, 3}
console.log(union)		// Set {1, 2, 3, 4}
console.log(difference)	// Set {1}
```

## 2. WeakSet

WeakSet 结构与 Set 类似，也是不重复的值的集合。 WeakSet 对象允许你将**弱引用对象**储存在一个集合中。

### 2.1 WeakSet 与 Set 的区别

- WeakSet **只能储存对象引用，不能存放值**，而 Set 对象都可以

```js
//WeakSet 是一个构造函数，可以使用new命令，创建 WeakSet 数据结构
const ws = new WeakSet();
ws.add(1)
// TypeError: Invalid value used in weak set
ws.add(Symbol())
// TypeError: invalid value used in weak set
```

- WeakSet 对象中储存的对象值都是被弱引用的，即**垃圾回收机制不考虑 WeakSet 对该对象的应用**，如果没有其他的变量或属性引用这个对象值，则这个对象将会被垃圾回收掉（不考虑该对象还存在于 WeakSet 中），所以，WeakSet 对象里有多少个成员元素，取决于垃圾回收机制有没有运行，运行前后成员个数可能不一致，遍历结束之后，有的成员可能取不到了（被垃圾回收了），**WeakSet 对象是无法被遍历**的（ES6 规定 WeakSet 不可遍历），也没有办法拿到它包含的所有元素
- constructor：构造函数，任何一个具有 Iterable 接口的对象，都可以作参数。

```js
const bList = [[1, 2], [3, 4]];
const wb = new WeakSet(bList);
console.log(wb)
```

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/00c53b0ac89e4d1f97e4058dcac15c1b~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

上面代码中，bList是一个数组，它有两个成员，也都是数组。将bList作为 WeakSet 构造函数的参数，bList的成员会自动成为 WeakSet 的成员。

注意，是bList数组的成员成为 WeakSet 的成员，而不是bList数组本身。这意味着，数组的成员只能是对象。

```js
//数组b的成员不是对象，加入 WeakSet 就会报错。
const b = [3, 4];
const ws = new WeakSet(b);
// Uncaught TypeError: Invalid value used in weak set(…)
```

### 2.1 WeakSet方法

- add(value)：在WeakSet 对象中添加一个元素value
- has(value)：判断 WeakSet 对象中是否包含value
- delete(value)：删除元素 value
- clear()：**注意该方法已废弃, WeakSet没这个方法**

```js
var ws = new WeakSet()
var obj = {}
var foo = {}

ws.add(window)
ws.add(obj)

ws.has(window)	// true
ws.has(foo)	// false

ws.delete(window)	// true
ws.has(window)	// false
```

## 3. Map

### 3.1 Map诞生原因

> 为了解决对象只能用字符串当作键的问题。

JavaScript 的对象（Object），本质上是键值对的集合（Hash 结构），但是传统上只能用**字符串**当作键。这给它的使用带来了很大的限制。

ES6 提供了 Map 数据结构，类似于对象，也是键值对的集合，但是 **“键”的范围不限于字符串，各种类型的值（包括对象）都可以当作键**。也就是说，Object 结构提供了“字符串—值”的对应，Map 结构提供了“值—值”的对应，是一种更完善的 Hash 结构实现。如果你需要“键值对”的数据结构，Map 比 Object 更合适。

### 3.1 Map的属性和方法

(1)size属性

size属性返回 Map 结构的成员总数。

```js
const map = new Map();
map.set('foo', true);
map.set('bar', false);

map.size // 2
```

(2)set方法

set方法设置键名key对应的键值为value，然后返回整个 Map 结构。如果key已经有值，则键值会被更新，否则就新生成该键。

```js
const m = new Map();

m.set('edition', 6)        // 键是字符串
m.set(262, 'standard')     // 键是数值
m.set(undefined, 'nah')    // 键是 undefined
```

set方法返回的是当前的Map对象，因此可以采用链式写法。

```js
let map = new Map()
  .set(1, 'a')
  .set(2, 'b')
  .set(3, 'c');
```

如果对同一个键多次赋值，后面的值将覆盖前面的值:

```js
const map = new Map();

map
.set(1, 'aaa')
.set(1, 'bbb');

map.get(1) // "bbb"
```

(3)get方法

get方法读取key对应的键值，如果找不到key，返回undefined。

```js
const m = new Map();

const hello = function() {console.log('hello');};
m.set(hello, 'Hello ES6!') // 键是函数

m.get(hello)  // Hello ES6!
```

(4)has方法

has方法返回一个布尔值，表示某个键是否在当前 Map 对象之中。

```js
const m = new Map();

m.set('edition', 6);
m.set(262, 'standard');
m.set(undefined, 'nah');

m.has('edition')     // true
m.has('years')       // false
m.has(262)           // true
m.has(undefined)     // true
```

(5)delete方法

delete方法删除某个键，返回true。如果删除失败，返回false。

```js
const m = new Map();
m.set(undefined, 'nah');
m.has(undefined)     // true

m.delete(undefined)
m.has(undefined)       // false
```

(6)clear方法

clear方法清除所有成员，没有返回值。

```js
let map = new Map();
map.set('foo', true);
map.set('bar', false);

map.size // 2
map.clear()
map.size // 0
```

### 3.3 Map使用时注意事项

（1）数组做参数

作为构造函数，Map 也可以接受一个数组作为参数。该**数组的成员是一个个表示键值对的数组**。

```js
const map = new Map([
  ['name', '张三'],
  ['title', 'Author']
]);

map.size // 2
map.has('name') // true
map.get('name') // "张三"
map.has('title') // true
map.get('title') // "Author"
```

上面代码在新建 Map 实例时，就指定了两个键name和title。

Map构造函数接受数组作为参数，实际上执行的是下面的算法：

```js
const items = [
  ['name', '张三'],
  ['title', 'Author']
];

const map = new Map();

items.forEach(
  ([key, value]) => map.set(key, value)
);
```

事实上，不仅仅是数组，**任何具有 Iterator 接口、且每个成员都是一个双元素的数组的数据结构都可以当作Map构造函数的参数**。这就是说，**Set和Map都可以用来生成新的 Map**。

```js
//分别使用 Set 对象和 Map 对象，当作Map构造函数的参数，结果都生成了新的 Map 对象
const set = new Set([
  ['foo', 1],
  ['bar', 2]
]);
const m1 = new Map(set);
m1.get('foo') // 1

const m2 = new Map([['baz', 3]]);
const m3 = new Map(m2);
m3.get('baz') // 3
```

（2）Map 的键实际上是跟内存地址绑定的

如果读取一个未知的键，则返回undefined:

```js
new Map().get('asfddfsasadf')
// undefined
```

**只有对同一个对象的引用，Map 结构才将其视为同一个键**。这一点要非常小心:

```js
const map = new Map();

map.set(['a'], 555);
map.get(['a']) // undefined
```

上面代码的set和get方法，表面是针对同一个键，但实际上这是两个不同的数组实例，**内存地址是不一样的**，因此get方法无法读取该键，返回undefined。

同理，同样的值的两个实例，在 Map 结构中被视为两个键:

```js
const map = new Map();

const k1 = ['a'];
const k2 = ['a'];

map
.set(k1, 111)
.set(k2, 222);

map.get(k1) // 111
map.get(k2) // 222
```

上面代码中，变量k1和k2的值是一样的，但是它们在 Map 结构中被视为两个键.

由上可知，**Map 的键实际上是跟内存地址绑定的**，只要内存地址不一样，就视为两个键。这就解决了同名属性碰撞（clash）的问题，我们扩展别人的库的时候，如果使用对象作为键名，就不用担心自己的属性与原作者的属性同名。

如果 Map 的键是一个简单类型的值（数字、字符串、布尔值），则只要两个值严格相等，Map 将其视为一个键，比如0和-0就是一个键，布尔值true和字符串true则是两个不同的键。另外，undefined和null也是两个不同的键。**虽然NaN不严格相等于自身，但 Map 将其视为同一个键**。

```js
let map = new Map();

map.set(-0, 123);
map.get(+0) // 123

map.set(true, 1);
map.set('true', 2);
map.get(true) // 1

map.set(undefined, 3);
map.set(null, 4);
map.get(undefined) // 3

map.set(NaN, 123);
map.get(NaN) // 123
```

### 3.4 Map遍历方法

Map 结构原生提供三个遍历器生成函数和一个遍历方法。

- Map.prototype.keys()：返回键名的遍历器。
- Map.prototype.values()：返回键值的遍历器。
- Map.prototype.entries()：返回所有成员的遍历器。
- Map.prototype.forEach()：遍历 Map 的所有成员。

需要特别注意的是，Map 的遍历顺序就是插入顺序。

```js
const map = new Map([
  ['F', 'no'],
  ['T',  'yes'],
]);

for (let key of map.keys()) {
  console.log(key);
}
// "F"
// "T"

for (let value of map.values()) {
  console.log(value);
}
// "no"
// "yes"

for (let item of map.entries()) {
  console.log(item[0], item[1]);
}
// "F" "no"
// "T" "yes"

// 或者
for (let [key, value] of map.entries()) {
  console.log(key, value);
}
// "F" "no"
// "T" "yes"

// 等同于使用map.entries()
for (let [key, value] of map) {
  console.log(key, value);
}
// "F" "no"
// "T" "yes"
```

上面代码最后的那个例子，表示 Map 结构的默认遍历器接口（Symbol.iterator属性），就是entries方法：

```js
map[Symbol.iterator] === map.entries
// true
```

Map 结构转为数组结构，比较快速的方法是使用扩展运算符（...）：

```js
const map = new Map([
  [1, 'one'],
  [2, 'two'],
  [3, 'three'],
]);

[...map.keys()]
// [1, 2, 3]

[...map.values()]
// ['one', 'two', 'three']

[...map.entries()]
// [[1,'one'], [2, 'two'], [3, 'three']]

[...map]
// [[1,'one'], [2, 'two'], [3, 'three']]
```

结合数组的map方法、filter方法，可以实现 Map 的遍历和过滤（Map 本身没有map和filter方法）：

```js
const map0 = new Map()
  .set(1, 'a')
  .set(2, 'b')
  .set(3, 'c');

const map1 = new Map(
  [...map0].filter(([k, v]) => k < 3)
);
// 产生 Map 结构 {1 => 'a', 2 => 'b'}

const map2 = new Map(
  [...map0].map(([k, v]) => [k * 2, '_' + v])
    );
// 产生 Map 结构 {2 => '_a', 4 => '_b', 6 => '_c'}
```

此外，Map 还有一个forEach方法，与数组的forEach方法类似，也可以实现遍历：

```js
map.forEach(function(value, key, map) {
  console.log("Key: %s, Value: %s", key, value);
});
```

forEach方法还可以接受第二个参数，用来绑定this：

```js
const reporter = {
  report: function(key, value) {
    console.log("Key: %s, Value: %s", key, value);
  }
};

map.forEach(function(value, key, map) {
  this.report(key, value);
}, reporter);
```

上面代码中，forEach方法的回调函数的this，就指向reporter。

### 3.5 与其他数据结构的互相转换

（1）Map 转为数组 Map 转为数组最方便的方法，就是使用扩展运算符（...）：

```js
const myMap = new Map()
  .set(true, 7)
  .set({foo: 3}, ['abc']);
[...myMap]
// [ [ true, 7 ], [ { foo: 3 }, [ 'abc' ] ] ]
```

（2）数组 转为 Map 将数组传入 Map 构造函数，就可以转为 Map：

```js
new Map([
  [true, 7],
  [{foo: 3}, ['abc']]
])
// Map {
//   true => 7,
//   Object {foo: 3} => ['abc']
// }
```

（3）Map 转为对象 如果所有 Map 的键都是字符串，它可以无损地转为对象。

```js
function strMapToObj(strMap) {
  let obj = Object.create(null);
  for (let [k,v] of strMap) {
    obj[k] = v;
  }
  return obj;
}

const myMap = new Map()
  .set('yes', true)
  .set('no', false);
strMapToObj(myMap)
// { yes: true, no: false }
```

如果有非字符串的键名，那么这个键名会被转成字符串，再作为对象的键名。

（4）对象转为 Map 对象转为 Map 可以通过Object.entries()：

```js
let obj = {"a":1, "b":2};
let map = new Map(Object.entries(obj));
```

此外，也可以自己实现一个转换函数：

```js
function objToStrMap(obj) {
  let strMap = new Map();
  for (let k of Object.keys(obj)) {
    strMap.set(k, obj[k]);
  }
  return strMap;
}

objToStrMap({yes: true, no: false})
// Map {"yes" => true, "no" => false}
```

（5）Map 转为 JSON Map 转为 JSON 要区分两种情况。一种情况是，Map 的键名都是字符串，这时可以选择转为对象 JSON:

```js
function strMapToJson(strMap) {
  return JSON.stringify(strMapToObj(strMap));
}

let myMap = new Map().set('yes', true).set('no', false);
strMapToJson(myMap)
// '{"yes":true,"no":false}'
```

另一种情况是，Map 的键名有非字符串，这时可以选择转为数组 JSON:

```js
function mapToArrayJson(map) {
  return JSON.stringify([...map]);
}

let myMap = new Map().set(true, 7).set({foo: 3}, ['abc']);
mapToArrayJson(myMap)
// '[[true,7],[{"foo":3},["abc"]]]'
```

（6）JSON 转为 Map JSON 转为 Map，正常情况下，所有键名都是字符串:

```js
function jsonToStrMap(jsonStr) {
  return objToStrMap(JSON.parse(jsonStr));
}

jsonToStrMap('{"yes": true, "no": false}')
// Map {'yes' => true, 'no' => false}
```

但是，有一种特殊情况，整个 JSON 就是一个数组，且每个数组成员本身，又是一个有两个成员的数组。这时，它可以一一对应地转为 Map。这往往是 Map 转为数组 JSON 的逆操作:

```js
function jsonToMap(jsonStr) {
  return new Map(JSON.parse(jsonStr));
}

jsonToMap('[[true,7],[{"foo":3},["abc"]]]')
// Map {true => 7, Object {foo: 3} => ['abc']}
```

## 4.WeakMap

### 4.1 含义

WeakMap结构与Map结构类似，也是用于生成键值对的集合

```js
// WeakMap 可以使用 set 方法添加成员
const wm1 = new WeakMap();
const key = {foo: 1};
wm1.set(key, 2);
wm1.get(key) // 2

// WeakMap 也可以接受一个数组，
// 作为构造函数的参数
const k1 = [1, 2, 3];
const k2 = [4, 5, 6];
const wm2 = new WeakMap([[k1, 'foo'], [k2, 'bar']]);
wm2.get(k2) // "bar"
```

### 4.2 WeakMap与Map的区别

(1)**WeakMap只接受对象作为键名（null除外），不接受其他类型的值作为键名**

```js
const map = new WeakMap();
map.set(1, 2)
// TypeError: 1 is not an object!
map.set(Symbol(), 2)
// TypeError: Invalid value used as weak map key
map.set(null, 2)
// TypeError: Invalid value used as weak map key
```

上面代码中，如果将数值1和Symbol值作为 WeakMap 的键名，都会报错。

(2)**WeakMap的键名所指向的对象，不计入垃圾回收机制。**

WeakMap的设计目的在于，有时我们想在某个对象上面存放一些数据，但是这会形成对于这个对象的引用。请看下面的例子:

```js
const e1 = document.getElementById('foo');
const e2 = document.getElementById('bar');
const arr = [
  [e1, 'foo 元素'],
  [e2, 'bar 元素'],
];
```

上面代码中，e1和e2是两个对象，我们通过arr数组对这两个对象添加一些文字说明。这就形成了arr对e1和e2的引用。

一旦不再需要这两个对象，我们就必须手动删除这个引用，否则垃圾回收机制就不会释放e1和e2占用的内存。

```js
// 不需要 e1 和 e2 的时候
// 必须手动删除引用
arr [0] = null;
arr [1] = null;
```

上面这样的写法显然很不方便。一旦忘了写，就会造成内存泄露。

WeakMap 就是为了解决这个问题而诞生的，它的键名所引用的对象都是弱引用，即垃圾回收机制不将该引用考虑在内。因此，只要所引用的对象的其他引用都被清除，垃圾回收机制就会释放该对象所占用的内存。也就是说，一旦不再需要，WeakMap 里面的键名对象和所对应的键值对会自动消失，不用手动删除引用。

基本上，**如果你要往对象上添加数据，又不想干扰垃圾回收机制，就可以使用 WeakMap**。一个典型应用场景是，在网页的 DOM 元素上添加数据，就可以使用WeakMap结构。当该 DOM 元素被清除，其所对应的WeakMap记录就会自动被移除。

```js
const wm = new WeakMap();

const element = document.getElementById('example');

wm.set(element, 'some information');
wm.get(element) // "some information"
```

上面代码中，先新建一个 WeakMap 实例。然后，将一个 DOM 节点作为键名存入该实例，并将一些附加信息作为键值，一起存放在 WeakMap 里面。这时，WeakMap 里面对element的引用就是弱引用，不会被计入垃圾回收机制。

也就是说，上面的 DOM 节点对象除了 WeakMap 的弱引用外，其他位置对该对象的引用一旦消除，该对象占用的内存就会被垃圾回收机制释放。WeakMap 保存的这个键值对，也会自动消失。

总之，WeakMap的专用场合就是，它的键所对应的对象，可能会在将来消失。WeakMap结构有助于防止内存泄漏。

注意，WeakMap 弱引用的只是键名，而不是键值。键值依然是正常引用。

```js
const wm = new WeakMap();
let key = {};
let obj = {foo: 1};

wm.set(key, obj);
obj = null;
wm.get(key)
// Object {foo: 1}
```

上面代码中，键值obj是正常引用。所以，即使在 WeakMap 外部消除了obj的引用，WeakMap 内部的引用依然存在。

### 4.3 WeakMap 的语法

WeakMap 与 Map 在 API 上的区别主要是两个，一是**没有遍历操作**（即没有keys()、values()和entries()方法），也**没有size属性**。因为没有办法列出所有键名，某个键名是否存在完全不可预测，跟垃圾回收机制是否运行相关。这一刻可以取到键名，下一刻垃圾回收机制突然运行了，这个键名就没了，为了防止出现不确定性，就统一规定不能取到键名。二是无法清空，即不支持clear方法。因此，**WeakMap只有四个方法可用：get()、set()、has()、delete()**。

```js
const wm = new WeakMap();

// size、forEach、clear 方法都不存在
wm.size // undefined
wm.forEach // undefined
wm.clear // undefined
```

### 4.4 WeakMap 的用途

WeakMap 应用的典型场合就是 DOM 节点作为键名。下面是一个例子:

```js
let myWeakmap = new WeakMap();

myWeakmap.set(
  document.getElementById('logo'),
  {timesClicked: 0})
;

document.getElementById('logo').addEventListener('click', function() {
  let logoData = myWeakmap.get(document.getElementById('logo'));
  logoData.timesClicked++;
}, false);
```

上面代码中，document.getElementById('logo')是一个 DOM 节点，每当发生click事件，就更新一下状态。我们将这个状态作为键值放在 WeakMap 里，对应的键名就是这个节点对象。一旦这个 DOM 节点删除，该状态就会自动消失，不存在内存泄漏风险。

WeakMap 的另一个用处是部署私有属性。

```js
const _counter = new WeakMap();
const _action = new WeakMap();

class Countdown {
  constructor(counter, action) {
    _counter.set(this, counter);
    _action.set(this, action);
  }
  dec() {
    let counter = _counter.get(this);
    if (counter < 1) return;
    counter--;
    _counter.set(this, counter);
    if (counter === 0) {
      _action.get(this)();
    }
  }
}

const c = new Countdown(2, () => console.log('DONE'));

c.dec()
c.dec()
// DONE
```

上面代码中，Countdown类的两个内部属性_counter和_action，是实例的弱引用，所以如果删除实例，它们也就随之消失，不会造成内存泄漏。



