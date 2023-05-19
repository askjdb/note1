class A{

    constructor(callback){
        this.exent=[]
        callback(this.text1,this.text2)
    }

    text1(){
        console.log('text1',this);
    }
    text2(){
        console.log('text2',this);
    }
}

function last(text1,text2){
    console.log(this);
    text1();
    text2();
}

const a=new A(last)

const woc=a.text1
woc()




// function findBy(current,data){
//     if (current===null){
//         return null;
//     }
//     if(current[data]){
//         return current[data]
//     }else{
//         return findBy(current.__proto__)
//     }
// }

// Function.prototype.woc=1
// Array.prototype.caonima=2
// function a(){}
// let b=[]

// console.log(findBy(b,"caonim"));