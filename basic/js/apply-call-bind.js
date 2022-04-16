/*
 * @description: apply/call/bind
 * @Date: 2022-02-18 09:40:16
 * @LastEditTime: 2022-02-24 14:22:07
 * @Author: xingheng
 */

/*
  thisArg(可选):
  fun的this指向thisArg对象
  非严格模式下：thisArg指定为null，undefined，fun中的this指向window对象.
  严格模式下：fun的this为undefined
  值为原始值(数字，字符串，布尔值)的this会指向该原始值的自动包装对象，如 String、Number、Boolean
 */

// fun.call(thisArg, param1, param2, ...)
// fun.apply(thisArg, [param1,param2,...])
// fun.bind(thisArg, param1, param2, ...) 返回值是函数名，需要调用

// fun.bind(thisArg, arg1,arg2,...)
function funcA(a, b) {
  // this.a()
  console.log("🚀 --> a, b", a, b)
  console.log(this);
  return "this is funcA"
}

function funcB() {
  let a = 1
  console.log("🚀 --> a", a)
  console.log(this);
  return "this is funcB"
}

const objB = {
  a: function() {
    console.log(1);
  }
}

Function.prototype.myApply = function (context = window, args = []) {
  const key = Symbol()
  context[key] = this

  const result = context[key](...args)
  delete context[key]
  return result
}

Function.prototype.myCall = function (context = window, ...args) {
  const key = Symbol()
  context[key] = this

  const result = context[key](...args)
  delete context[key]
  return result
}

Function.prototype.myBind = function (context = window, ...args) {

  const key = Symbol()
  context[key] = this
  
  return () => {
    const func = context[key](...args)
    delete context[key]
    return func
  }
}

// funcA.myCall(objB, 1,2)

const funC = funcA.myBind(objB, 1, 2)
const returnParam = funC()
// funcA.myBind(objB, [1, 2])()
console.log("🚀 --> returnParam", returnParam)

// let a = 1

// if(1) {
//  console.log(a);
// }

// if(2) {
//   console.log(a);
// }


