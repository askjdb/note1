//防抖是只执行最后一次


function dec(fn, delay, ...args) {
    let timer = null;
    return function (...args) {
        if (timer !== null) {
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            fn.call(this, ...args)
        }, delay);
    }
}