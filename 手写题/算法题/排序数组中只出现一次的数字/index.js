const singleNonDuplicate=(arr)=>{
    return arr.reduce((pre,cur)=>pre^cur)
}