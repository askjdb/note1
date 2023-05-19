Object.prototype.Mycreate=(obj)=>{
    function F(){}
    F.prototype=obj;
    return new F() 
}

