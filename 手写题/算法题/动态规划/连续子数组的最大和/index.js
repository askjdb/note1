const maxSubArray=(arr)=>{
    let dp = []
    dp.push(arr[0])
    let maxValue=arr[0]
    for(let i=1;i<length;i++){
        dp[i]=Math.max(dp[i-1]+arr[i],arr[i])
        maxValue=Math.max(dp[i],maxValue)
    }
    return maxValue;
}
