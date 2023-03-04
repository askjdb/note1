- forEach(): 针对每一个元素执行提供的函数(executes a provided function once for each array element)。除了抛出异常以外，没有办法中止或跳出 forEach() 循环。如果你需要中止或跳出循环，forEach() 方法不是应当使用的工具。
- map(): 创建一个新的数组，其中每一个元素由调用数组中的每一个元素执行提供的函数得来(creates a new array with the results of calling a provided function on every element in the calling array)。map 方法会给原数组中的每个元素都按顺序调用一次 callback 函数。callback 每次执行后的返回值（包括 undefined）组合起来形成一个新数组。 callback 函数只会在有值的索引上被调用；那些从来没被赋过值或者使用 delete 删除的索引则不会被调用。

##### 共同点

- 都是循环遍历数组中的每一项
- 每一次执行匿名函数都支持三个参数，数组中的当前项item，当前项的索引index，原始数组input
- 匿名函数中的this都是指window
- 只能遍历数组

能用forEach()做到循环的，map()同样也可以做到循环。反过来也是如此。

##### 差异点

1.map

**有返回值，可以return出来一个length和原数组一致的数组(内容可能包含undefined、null等)**

- 参数：item数组中的当前项，index当前项的索引，input原始数组
- 区别：map的回调函数中支持return返回值，return的是一个数组，相当于把数组中的这一项进行改变（并不影响原来的数组，只是相当于把原数组克隆了一份，把克隆这一份的数组中的对应项改变了 ）；

2.forEach

***\*没有返回值，返回结果为undefined\****

- 参数：item数组中的当前项，index当前项的索引，input原始数组；
- 数组中有几项，那么传递进去的匿名回调函数就需要执行几次
- 理论上这个方式是没有返回值的，只是遍历数组中的每一项，不对原来数组进行修改，但是可以自己通过数组的索引来修改原来的数组

总结来说:

forEach()方法不会返回执行结果，而是undefined。forEach() 被调用时，不会改变原数组，也就是调用它的数组（尽管 callback 函数在被调用时可能会改变原数组）。
map()方法会分配内存空间存储新数组并返回，map 不修改调用它的原数组本身（当然可以在 callback 执行时改变原数组）。
