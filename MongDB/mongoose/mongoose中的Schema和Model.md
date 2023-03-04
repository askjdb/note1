## **Schema**

Schema主要用于定义MongoDB中集合Collection里文档document的结构,可以理解为mongoose对表结构的定义(不仅仅可以定义文档的结构和属性，还可以定义文档的实例方法、静态模型方法、复合索引等)，每个schema会映射到mongodb中的一个collection，schema不具备操作数据库的能力

定义Schema非常简单，指定字段名和类型即可，支持的类型包括以下8种

String      字符串
Number      数字    
Date        日期
Buffer      二进制
Boolean     布尔值
Mixed       混合类型
ObjectId    对象ID    
Array       数组

通过mongoose.Schema来调用Schema，然后使用new方法来创建schema

```js
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
var mySchema = new Schema({
  title:  String,
  author: String,
  body:   String,
  comments: [{ body: String, date: Date }],
  date: { type: Date, default: Date.now },
  hidden: Boolean,
  meta: {
    votes: Number,
    favs:  Number
  }
});
```

**注意** 创建Schema对象时，声明字段类型有两种方法，一种是首字母大写的字段类型，另一种是引号包含的小写字段类型

```js
var mySchema = new Schema({title:String, author:String});
//或者 
var mySchema = new Schema({title:'string', author:'string'});
```

如果需要在Schema定义后添加其他字段，可以使用add()方法

```js
var MySchema = new Schema;
MySchema.add({ name: 'string', color: 'string', price: 'number' });
```

## **Model**

[Model](https://so.csdn.net/so/search?q=Model&spm=1001.2101.3001.7020)是由Schema编译而成的假想（fancy）构造器，具有抽象属性和行为。Model的每一个实例（instance）就是一个document，document可以保存到数据库和对数据库进行操作。简单说就是model是由schema生成的模型，可以对数据库的操作。

使用model()方法，将Schema编译为Model。model()方法的第一个参数是模型名称

```js
mongoose.model(`文档名称`, Schema)
```

注意 一定要将model()方法的第一个参数和其返回值设置为相同的值，否则会出现不可预知的结果

　　Mongoose会将集合名称设置为模型名称的小写版。如果名称的最后一个字符是字母，则会变成复数；如果名称的最后一个字符是数字，则不变；如果模型名称为"MyModel"，则集合名称为"mymodels"；如果模型名称为"Model1"，则集合名称为"model1"

```js
var schema = new mongoose.Schema({ num:Number, name: String, size: String});
var MyModel = mongoose.model('MyModel', schema);
```

【实例化文档document】

　　通过对原型Model1使用new方法，实例化出文档document对象

```js
var mongoose = require('mongoose');
mongoose.connect("mongodb://u1:123456@localhost/db1", function(err) {
    if(err){
        console.log('连接失败');
    }else{
        console.log('连接成功');
        var schema = new mongoose.Schema({ num:Number, name: String, size: String});
        var MyModel = mongoose.model('MyModel', schema);
        var doc1 = new MyModel({ size: 'small' });
        console.log(doc1.size);//'small'
    }
});
```

【文档保存】

　　通过new Model1()创建的文档doc1，必须通过save()方法，才能将创建的文档保存到数据库的集合中，集合名称为模型名称的小写复数版

　　回调函数是可选项，第一个参数为err，第二个参数为保存的文档对象

```js
save(function (err, doc) {})
```

```js
var mongoose = require('mongoose');
mongoose.connect("mongodb://u1:123456@localhost/db1", function(err) {
    if(!err){
        var schema = new mongoose.Schema({ num:Number, name: String, size: String });
        var MyModel = mongoose.model('MyModel', schema);
        var doc1 = new MyModel({ size: 'small' });
        doc1.save(function (err,doc) {
        //{ __v: 0, size: 'small', _id: 5970daba61162662b45a24a1 }
          console.log(doc);
        })
    }
});
```

【实例方法】

　　Model的实例是document，内置实例方法有很多，如 save，可以通过Schema对象的methods属性给实例自定义扩展方法

```js
var mongoose = require('mongoose');
mongoose.connect("mongodb://u1:123456@localhost/db1", function(err) {
    if(!err){
        var schema = new mongoose.Schema({ num:Number, name: String, size: String });        
        schema.methods.findSimilarSizes = function(cb){
            return this.model('MyModel').find({size:this.size},cb);
        }
        var MyModel = mongoose.model('MyModel', schema);
        var doc1 = new MyModel({ name:'doc1', size: 'small' });
        var doc2 = new MyModel({ name:'doc2', size: 'small' });
        var doc3 = new MyModel({ name:'doc3', size: 'big' });
        doc1.save();
        doc2.save();
        doc3.save();
        setTimeout(function(){
            doc1.findSimilarSizes(function(err,docs){
                docs.forEach(function(item,index,arr){
                    //doc1
                    //doc2
                     console.log(item.name)        
                })
            })  
        },0)  
    }
});
```

【静态方法】

　　通过Schema对象的statics属性给 Model 添加静态方法

```js
var mongoose = require('mongoose');
mongoose.connect("mongodb://u1:123456@localhost/db1", function(err) {
    if(!err){
        var schema = new mongoose.Schema({ num:Number, name: String, size: String });        
        schema.statics.findByName = function(name,cb){
            return this.find({name: new RegExp(name,'i')},cb);
        }
        var MyModel = mongoose.model('MyModel', schema);
        var doc1 = new MyModel({ name:'doc1', size: 'small' });
        var doc2 = new MyModel({ name:'doc2', size: 'small' });
        var doc3 = new MyModel({ name:'doc3', size: 'big' });
        doc1.save();
        doc2.save();
        doc3.save();
        setTimeout(function(){
            MyModel.findByName('doc1',function(err,docs){
                //[ { _id: 5971e68f4f4216605880dca2,name: 'doc1',size: 'small',__v: 0 } ]
                console.log(docs);
            })  
        },0)  
    }
});
```

由上所示，实例方法和静态方法的区别在于，静态方法是通过Schema对象的statics属性给model添加方法，实例方法是通过Schema对象的methods是给document添加方法

【Methods 和 Statics 的区别】

statics是给model添加方法，methods是给实例（instance）添加方法。methods和statics的区别

```js
//module.exports = mongoose.model(`Article`, ArticleSchema )
//将article的model保存为文件 article.js
 
const Article = require('../models/article')
 
// statics
Article.staticFunc ()
 
//methods
const article = new Article(arguments)
article.methodFunc()
```

【查询方法】

　　通过schema对象的query属性，给model添加查询方法

```js
var mongoose = require('mongoose');
mongoose.connect("mongodb://u1:123456@localhost/db1", function(err) {
    if(!err){
        var schema = new mongoose.Schema({ age:Number, name: String});        
        schema.query.byName = function(name){
            return this.find({name: new RegExp(name)});
        }
        var temp = mongoose.model('temp', schema);   
        temp.find().byName('huo').exec(function(err,docs){
            //[ { _id: 5971f93be6f98ec60e3dc86c, name: 'huochai', age: 27 },
            // { _id: 5971f93be6f98ec60e3dc86e, name: 'huo', age: 30 } ]
            console.log(docs);
        })  
 
    }           
});
```

