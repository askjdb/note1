function quickSelect(arr, k) {
    // 边界条件：如果数组只有一个元素，直接返回该元素
    if (arr.length === 1) {
      return arr[0];
    }
  
    // 选择一个基准值
    const pivotIndex = 0;
    const pivot = arr[pivotIndex];
  
    // 划分数组
    const left = [];
    const right = [];
    for (let i = 0; i < arr.length; i++) {
      if (i === pivotIndex) {
        continue;
      }
      if (arr[i] < pivot) {
        left.push(arr[i]);
      } else {
        right.push(arr[i]);
      }
    }
  
    // 根据基准值的位置递归查找第 k 大的数
    if (right.length >= k) {
      return quickSelect(right, k);
    } else if (right.length === k - 1) {
      return pivot;
    } else {
      return quickSelect(left, k - right.length - 1);
    }
  }
  
  const arr = [3, 2, 1, 5, 6, 4];
  const k = 1;
  const result = quickSelect(arr, k);
  console.log(result);
  