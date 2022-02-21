/*
 * @description: 闭包
 * @Date: 2022-02-18 22:43:38
 * @LastEditTime: 2022-02-18 22:48:10
 * @Author: xingheng
 */

// function create() {
//   let a = 100
//   return function () {
//     console.log(a);
//   }
// }

// let func = create()
// let a = 200

// func() // 100


function print(func) {
  let a = 200
  func()
}

let a = 100
function fn() {
  console.log(a);
}

print(fn) // 100