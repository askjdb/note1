const tree = {
    value: 1,
    children: [
        {
            value: 2,
            children: [
                {
                    value: 3,
                    children: [],
                },
            ],
        },
        {
            value: 4,
            children: [
                {
                    value: 5,
                    children: [],
                },
            ],
        },
        {
            value: 6,
            children: [],
        },
    ]
}



function cengxu(tree){
    let result=[]
    let w=[]
    result.push(tree);
    while (result.length !==0){
        let x=result.shift();
        if (x.children!==[]){
            result= result.concat(x.children) 
        }
        w.push(x.value);
    }
    return w;
}

const dfs = tree => {
    
}

// console.log(cengxu(tree));
console.log(dfs(tree));