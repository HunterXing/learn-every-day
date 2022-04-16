/*
 * @description: 
 * @Date: 2022-02-22 20:21:11
 * @LastEditTime: 2022-02-23 20:19:02
 * @Author: xingheng
 */
async function async1() {
  console.log("a");
  await async2();
  console.log("b");
}
async function async2() {
  console.log('c');
}
setTimeout(() => {
  console.log('f');
})
async1();
new Promise(function (resolve) {
  console.log("d");
}).then(function () {
  console.log("e");
});

// 同步 异步 宏任务 微任务


// script 是宏任务，代码从上到下执行
// console.log("a"); 同步 进入执行栈 执行 输出a
// console.log('c'); 同步 进入执行栈 执行 输出c
// console.log("b"); 进入微任务队列
// console.log('f'); 宏任务 进入宏任务队列
// console.log("d"); 同步 进入执行栈 执行 输出d
// console.log("e"); 进入微任务队列
// 执行栈队列为空 执行所有存在的微任务，输出b 输出e

// 进行下一次宏任务
// console.log('f') 输出 f

