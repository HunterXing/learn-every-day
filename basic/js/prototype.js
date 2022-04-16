/*
 * @description: 原型和原型链
 * @Date: 2022-02-20 17:15:50
 * @LastEditTime: 2022-02-22 16:36:07
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
// 动物类
class Animal {
  constructor(classify, age) {
    this.classify = classify;
    this.age = age;
  }
  info() {
    console.log(`这是${this.classify}`);
  }
  active() {
    console.log(`${this.classify}可以活动`);
  }
}
class Human extends Animal {
  constructor(name, age) {
    super("人类", age)
    this.name = name;
    this.age = age
  }
  // 重写父类info方法
  info() {
    console.log(`${this.name}今年${this.age}岁`);
  }
  // 多出thinking方法
  thinking() {
    console.log(`人类可以思考`);
  }
}


// 继承
class Chinese extends Human {
  constructor(name, age, province) {
   super(name, age)
   this.province = province
  }
  // 种地
  farming() {
    console.log(`${this.name}会种地，籍贯${this.province}`);
  }
}

const reptiles = new Animal("爬行类", 200)
reptiles.info()
reptiles.active()

const human = new Human("Jack", 87)
human.info()
human.active()

const p = new Chinese("张三", 45, "安徽")
p.farming()
p.active()

