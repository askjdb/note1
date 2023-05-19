
let lastArry = []
let effectIndex = 0;

function useEffect(callback, arry) {
    if (typeof callback !== 'function') {
        throw new Error('第一个参数不是函数')
    }
    if (arry === undefined) {
        callback()
    }
    else {
        if (!Array.isArray(arry)) {
            throw new Error('第二个参数不是数组')
        }
        else {
            if (!lastArry[effectIndex]) {
                callback();
            }
            else {
                const change = arry.every((item, index) => {
                    return item === lastArry[effectIndex][index]
                })
                if (!change) {
                    callback();
                }
            }
        }
        lastArry[effectIndex] = arry
        effectIndex++
    }
}