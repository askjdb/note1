const lengthOfLongestSubstring=(string)=>{
    let asn=[]
    let maxLength=0;
    for(let i=0;i<string.length;i++){
        let x=asn.indexOf(string[i])
        if(x!==-1){
            asn.splice(0,x+1)
        }
        asn.push(string[i])
        maxLength=Math.max(maxLength,asn.length)
    }
    return maxLength
}

