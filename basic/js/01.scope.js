/*
 * @description: 作用域
 * @Date: 2022-03-20 22:01:10
 * @Author: xingheng
 */

// console.log(a) // 报错
// let a = 1

// console.log(b) // 
// var b = 2

var arr = [1, 2, 3]
for (var i = 0; i <= arr.length - 1; i++) {
  setTimeout(function() {
    console.log(arr[i])
    // console.log(i)
  }, i*10)
}

