


// 将99个数字放入长为99的数组中，数字可以重复，数字范围是1-100，如何找到1-100没有出现过的数字，
// 要求时间复杂度为On，空间复杂度也为On，使用js
function findMissingNumber(nums) {
    const n = nums.length;
  
    let a100=false
    // 遍历数组，将出现过的数字所对应的位置标记为负数
    for (let i = 0; i < n; i++) {
      const index = Math.abs(nums[i]) - 1;
      if (index ===99){
        a100=true
        continue;
      }
      if (nums[index] > 0) {
        nums[index] = -nums[index];
      }
    }
  
    // 再次遍历数组，找到第一个正数所对应的索引位置，即为未出现过的数字
    let result = [];
    if (a100===false){
        result.push(100)
    }
    for (let i = 0; i < n; i++) {
      if (nums[i] > 0) {
        result.push(i+1)
      }
    }
  
    // 如果所有数字都出现过，返回数组长度加1
    return result;
  }
  
  // 示例用法
  const nums = [1, 4, 4, 6, 7, 9, 2, 5, 5, 10, 11, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99,99];
  console.log(nums.length);
  console.log(findMissingNumber(nums)); // 输出 8