class Prohub{
    constructor(){
        this.events = {}
    }
    
    on=function(type,callback){
        if(!this.events[type]){
            this.events[type]=[]
        }
        this.events[type].push(callback)
    }

    off=function(type,callback){
        if(!this.events[type]) return
        if(!callback){
            this.events[type]=undefined
        }else{
            this.events[type]=this.events[type].filter((item)=>item!==callback)
        }
    }

    emit=function(type){
        if(!this.events[type]) return
        this.events[type].forEach((item)=>{
            item()
        })
    }
}


function handlerA() {
    console.log('buy handlerA');
}
function handlerB() {
    console.log('buy handlerB');
}
function handlerC() {
    console.log('buy handlerC');
}

// 使用构造函数创建一个实例
const person1 = new Prohub();

person1.on('buy', handlerA);
person1.on('buy', handlerB);
person1.on('buy', handlerC);

console.log('person1 :>> ', person1);

// 触发 buy 事件
person1.emit('buy')

