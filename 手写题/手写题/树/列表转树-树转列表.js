const listData = [
    {
        id: "p1",
        title: '广东',
    },
    {
        id: "p1-1",
        pid: 'p1',
        title: '广州',
    },
    {
        id: "p2",
        title: "四川",
    },
    {
        id: "p2-1",
        pid: 'p2',
        title: "成都",
    },
    {
        id: "p2-2",
        pid: 'p2',
        title: "德阳"
    },
    {
        id: "p2-3",
        pid: 'p2',
        title: "绵阳"
    },
    {
        id: "p2-1-1",
        pid: 'p2-1',
        title: "高新区",
    }
]
//列表转树
function list2tree(list,pid=undefined) {//pid是指向父节点的
    const result=list.reduce((pre,curr)=>{
        if(curr.pid===pid){
            const child=list2tree(list,curr.id)
            curr.child=child
            pre.push(curr)
        }
        return pre
    },[])
    return result
}
const tree=list2tree(listData)


//树转列表
function tree2list(tree){
    return tree.reduce((pre,curr)=>{
        if(!curr.child){
            pre.push(curr.child)
        }else{
            const sublist=tree2list(curr.child)
            delete curr.child
            pre.push(curr,...sublist)
        }
        return pre
    },[])
}
console.log(tree2list(tree));