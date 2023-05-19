let index = -1;
let currentState=[]
function useState(initialState){
    index++
    const currentIndex =index; //这里保存index是因为useState可能会有多个所以要使用闭包，
    //将不同的useState内部的变量保存下来,这里保存了这个useState对应的下标，因为index是
    //全局变量，会随着useState的多次调用而变化，所以需要通过闭包保存对应的index
    currentState[currentIndex]=currentState[currentIndex] || initialState
    const setState=(newVal)=>{
        currentState[currentIndex]=newVal
        render()
    }
    return [currentState[currentIndex],setState]
}