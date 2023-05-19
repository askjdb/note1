const Sum=(array)=>{
    let sum=0;
    for(i of array){
        sum=sum+i;
    }
    return sum
}


const findContinuousSequence=(target)=>{
    let result=[];
    for(let i=1;i<target;i++){
        let text=[];
        let right=i;
        while(Sum(text)<target){
            text.push(right)
            right++
        }
        let sum=Sum(text)
        if(sum===target){
            let x=[]
            for(let j=i;j<right;j++){
                x.push(j)
            }
            result.push(x)
        }
    }
    return result
}
