/*
 * @description: this 指向问题
 * @Date: 2022-02-18 09:39:19
 * @LastEditTime: 2022-05-26 15:04:48
 * @Author: xingheng
 */

function fn1() {
  console.log(1);
  this.num = 111;

  this.sayHey = function () {
    console.log("say hey.");
  };
}
function fn2() {
  console.log(2);
  this.num = 222;
  this.sayHello = function () {
    console.log("say hello.");
  };
}
fn1.call(fn2);
// fn1();
// fn1.num;
fn1.sayHello();
// fn2();
// fn2.num;
// fn2.sayHello();
// fn2.sayHey();
