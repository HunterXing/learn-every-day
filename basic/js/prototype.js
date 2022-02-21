/*
 * @description: 原型和原型链
 * @Date: 2022-02-20 17:15:50
 * @LastEditTime: 2022-02-20 17:58:32
 * @Author: xingheng
 */

/**
 * ES6+ 中的原型和原型链，ES5之前的先不讲述。
 */

// q: 如何判断一个变量是不是数组
// a: 


// q: 手写 jquery

// q: class 的原型本质


/**
 * 实现类和继承
 */
// 一个人类
class Human {
  constructor(name, age) {
    this.name = name;
    this.age = age
  }

  sayHi() {
    console.log(`姓名： ${this.name}, 年龄： ${this.age}`);
  }

  eat() {
    console.log(`${this.name}吃饭`);
  }
}



// 继承
// 学生
class Student extends Human {
  constructor(name, age, number) {
    super(name, age)
    this.number = number
  }
  
}

// 老师
class Teacher extends Human {
  constructor(name, age, major) {
    super(name, age)
    this.major = major
  }

  teach() {
    console.log(`${this.name}教授${this.major}课程`);
  }
}

// 申明一个学生类实例
const Bob = new Student("Bob", 12, 1001)
Bob.sayHi()
Bob.eat()

const James = new Teacher("James", 34, "英语")
James.sayHi()
James.eat()
James.teach()

console.log(James instanceof Teacher);
console.log(James instanceof Human);
console.log(James instanceof Object);





