# 如何在 TypeScript 中使用 getter/setter？

## How to use getters/setters in TypeScript ?

在 TypeScript 中，有两种受支持的方法 getter 和 setter 来访问和设置类成员。在这篇非常短的文章中，我将向您展示 Typescript 访问器，其中包含 getters/setters 方法。

实际上，getter 和 setter 只不过是您提供对对象属性的访问的一种方式。与其他 OOP 语言(如 Java、C++ 等)不同，您只能通过 getter 或 setter 方法访问变量，但在 Typescript 中的工作方式有所不同，您可以直接访问变量(在下面的示例中给出)。这称为 TypeScript 访问器。

Typescript 访问器属性的方法：

- getter：当您想要访问对象的任何属性时，就会出现此方法。 getter 也称为访问器。
- setter：当你想改变一个对象的任何属性时，这个方法就会出现。 setter 也称为 mutator。

下面给出的代码是一个具有 3 个属性的 Student 类：名称、学期和class。



```
class Student {
    public name: string;
    public semester: number;
    public course: string;
}
```



要访问 Student 类的任何属性：



```
let student = new Student();
// You can access Student class variables directly
Student.name = "Aman Rathod";
```

Getter 方法：

注意：对于提取变量的值，getter 访问器属性是常规方法。它由对象字面量中的 get 关键字表示。 getter 可以是公共的、受保护的、私有的。

语法：



```
get accessName() {
    // getter, the code executed on
    // getting obj.accessName
}
```









例子：

## Javascript实现



```
class Student {
      private _name: string = "Aman Rathod";
    private _semester: number;
    private _course: string;
      // Getter method to return name of
    // Student class
    public get name() {
        return this._name;
    }
  }
  // Access any property of the Student class
let student = new Student();
  // Getter call
let value = student.name;
  console.log(value);
```



输出：



```
Aman Rathod
```



从上面的示例中，您可以观察到，当我们调用 getter 方法 (student.name) 时，我们没有像使用常规函数那样包含开括号和闭括号。因此，您可以直接访问变量。

Setter 方法：为了更新变量的值，setter 访问器属性是使用的常规方法。它们由对象字面量中的 set 关键字表示。

语法：



```
set accessName(value) {  
    // The code executed on setting
    // obj.accessName = value, from setter
}  
```



例子：

## Javascript实现



```
class Student {
      private _name: string = "Aman Rathod";
    private _semester: number;
    private _course: string;
      // Getter method to return name
    // of Student class
    public get name() {
        return this._name;
    }
      // Setter method to set the semester number
    public set semester(thesem: number) {
        this._semester = thesem;
    }
      // Setter method
    public set course(thecourse: string) {
        this._course = thecourse;
    }
}
  // Access any property of the Student class
let student = new Student();
  // Setter call
student.semester = 5;
student.course = "Web Development";
```



从上面的示例中，您还可以注意到对 setter 方法的调用不像常规方法那样带有括号。当您调用 student.semester 或 student.course 时，将调用学期或class设置器方法并分配值。

处理错误：您也可以在 setter 方法中添加条件，如果条件无效则抛出错误。让我们通过下面的例子来理解。

## Javascript实现



```
class Student {    
    private _name: string = "Aman Rathod";
    private _semester: number;
    private _course: string;
          // Suppose the only 1st to 8th-semester students
    // are allowed to purchase the courses.
    public set semester( thesem: number ) {
                  if( thesem < 1 || thesem > 8 ){
            throw new Error(
'Sorry, this course is valid for students from 1st to 8th semester');
        }
                      this._semester = thesem;
    }
}
  // Access any property of the Student class
let student = new Student();
  // setter call
student.semester = 9;
```



输出：

![img](https://i1.wp.com/media.geeksforgeeks.org/wp-content/uploads/20210725142718/Screenshotfrom20210725142619.png)

构造函数：现在让我们讨论使用构造函数的 Getter 和 Setter 方法。实际上，在类中使用或不使用构造函数来访问getter或setter方法没有区别，但我们只是想忽略TypeScript中的构造函数。

例子：

## Javascript实现



```
class Student {
    name: string;
    semester: number;
    course: string;
          constructor(nm: string, sm: number, cs: string) {
        this.name = nm;
        this.semester = sm;
        this.course = cs;
    }
          // Getter method 
    public get courses() {
        return this.course;
    }
          public set courses( thecourse: string) {
        this.course = thecourse;
    }
}
  // Access any property of the Student class, 
let student = new Student("Aman Rathod", 4, "Web Development" ); 
  // Setter call
student.course = "Data structure";
  // Getter call
console.log("Course purchased is " + student.courses);
```



输出：

![img](https://i1.wp.com/media.geeksforgeeks.org/wp-content/uploads/20210725142727/Screenshotfrom20210725142418.png)

