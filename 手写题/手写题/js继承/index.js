// //组合式继承
// function Parent(name){
//     this.name = name;
//     this.say=()=>{
//         console.log(111);
//     }
// }

// Parent.prototype.play = ()=>{
//     console.log(222);
// }

// function Children(name){
//     Parent.call(this);
//     this.name = name;
// }

// Children.prototype = Object.create(parent.prototype);
// Children.prototype.constructor = Children;



function Person(name) {
    this.name = name;
    this.permission = ["user", "salary", "vacation"];
}

Person.prototype.say = function () {
    console.log(`${this.name} 说话了`);
};

function Staff(name, age) {
    Person.call(this, name);
    this.age = age;
}
const woc=Object.create(Person.prototype, {
    constructor: {
        // 若是不将Staff constructor指回到Staff, 此时的Staff实例zs.constructor则指向Person
        value: Staff,
    },
});

Staff.prototype = woc
console.log(woc);