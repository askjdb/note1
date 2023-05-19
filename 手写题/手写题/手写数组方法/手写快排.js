let arr = [123,213,4,32,56,5,345,421];
let arr2=[1,2,3,4,5,6,7,8,9]
function sort(array){
    if(array.length<=1){
        return array
    }
    let left=[]
    let right=[]
    let midd=array[0]
    for(let i=0;i<array.length;i++){
        if (array[i]<midd){
            left.push(array[i])
        }
        if (array[i]>midd){
            right.push(array[i])
        }
    }
    return [...sort(left),midd,...sort(right)]
}

console.log(sort(arr2));
