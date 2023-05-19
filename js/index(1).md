// 秦振的问题
// 题目描述: 给出一个简单的柯里化函数实现实例  --- 函数的柯里化
// 注意追问: 函数的柯里化应用场景.



// 考察原型链
// function Foo() {
//     Foo.a = function () {
//       console.log(1);
//     };
//     this.a = function () {
//       console.log(2);
//     };
//   }
//   Foo.prototype.a = function () {
//     console.log(3);
//   };
//   Foo.a = function () {
//     console.log(4);
//   };
//   Foo.a();
//   let obj = new Foo();
//   obj.a();
//   Foo.a();

// 楼梯问题
// 题目描述： 假设你正在爬楼梯。需要 n 阶你才能到达楼顶。每次你可以爬 1 或 2 个台阶。你有多少种不同的方法可以爬到楼顶呢？


// 合并两个有序数组.
// 题目描述: 给你两个有序整数数组 nums1 和 nums2，请你将 nums2 合并到 nums1 中，使 num1 成为一个有序数组。
// 说明:
// 初始化 nums1 和 nums2 的元素数量分别为 m 和 n 。
// 你可以假设 nums1 有足够的空间（空间大小大于或等于 m + n ）来保存 nums2 中的元素。



// promise
// 题目描述
// 实现 Promise.retry，成功后 resolve 结果，失败后重试，尝试超过一定次数才真正的 reject