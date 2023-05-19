let text=[3,2,1,5,6,4]
let x=[1,3,2,5,6,4]
let y=[100,101,2,5]
let w=[1,4,3,5,2,3]
//普通方法
// function find(arr,i){
//     if (i===arr.length-1){
//         return 1
//     }
//     let max_len=1
//     for ( let j=i+1;j<arr.length;j++){
//         if(arr[j]>arr[i]){
//           max_len=Math.max(max_len,find(arr,j)+1)  
//         }
//     }
//     return max_len;
// }


// let b=[]

// for (i=0;i< text.length;i++){
//     b.push(find(text,i))
// }
// console.log(Math.max(...b));

//动态规划
function find2(arr){
    let dp=[]
    for(let i=0;i<arr.length;i++){
        dp.push(1)
    }
    for(let i=0;i<arr.length;i++){
        for(let j=0;j<i;j++){
            if(arr[i]>arr[j]){
                dp[i]=Math.max(dp[i],dp[j]+1)
            }
        }
    }
    return dp
}

console.log(find2(w));