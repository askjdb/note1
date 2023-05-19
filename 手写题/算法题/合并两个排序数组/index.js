/**
 * @param {number[]} A
 * @param {number} m
 * @param {number[]} B
 * @param {number} n
 * @return {void} Do not return anything, modify A in-place instead.
 */
var merge = function (arr1, m, arr2, n) {
    const sum=m+n;
    let i = j = 0;
    let b=[]
    function insert(arr1, arr2, i, j) {
        if (i === m && arr2 === []) {
            arr1.splice(i, 0, ...arr2);
            for(let w=0;w<sum;w++){
                b.push(arr1[w])
            }
            return b
        }
        if (i === m && arr2 !== []) {
            arr1.splice(i, 0, ...arr2);
            for(let w=0;w<sum;w++){
                b.push(arr1[w])
            }
            return b
        }
        if (arr1[i] <= arr2[j] && arr1[i + 1] >= arr2[j]) {
            arr1.splice(i + 1, 0, arr2[j])
            arr2.splice(j, 1)
            m++
            i = i + 2;
            insert(arr1, arr2, i, j)
        } else {
            i++
            insert(arr1, arr2, i, j)
        }
    }
    insert(arr1, arr2, i, j)
    return b
};
console.log(merge([1, 2, 3, 0, 0, 0], 3, [2, 5, 6], 3));
