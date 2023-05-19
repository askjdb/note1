function Quick(arr) {
    if (arr.length <= 1) {
        return arr
    }
    let x = arr[0]
    let left = []
    let right = []
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > x) {
            right.push(arr[i])
        } else {
            left.push(arr[i])
        }
    }
    return [...Quick(left), x, ...Quick(right)]
}

const threeSumClosest = (arr1, target) => {
    let arr = Quick(arr1) //排序后的数组
    let min = Infinity //无限大
    let ans 
    for (let i = 0; i < arr.length - 2; i++) {
        let left = i + 1;
        let right = arr.length - 1
        while (left< right) {
            let sum = arr[i] + arr[left] + arr[right]
            let diff = Math.abs(target - sum)
            if (diff < min) {
                min = diff
                ans=sum
            }
            if (sum > target) {
                right--;
            } else {
                left++
            }
        }
    }
    return ans
}


