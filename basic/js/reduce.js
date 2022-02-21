/*
 * @description: reduce的学习
 * @Date: 2022-01-27 15:21:43
 * @LastEditTime: 2022-01-27 17:31:55
 * @Author: xingheng
 */

// 1. 求和
const arr = [1, 2, 3, 4, 5]
const sum = arr.reduce((sum, curVal, curIndex, array) => {
  console.log("🚀 --> array", array)
  console.log("🚀 --> curIndex", curIndex)
  console.log("🚀 --> curVal", curVal)
  console.log("🚀 --> sum", sum)
  return sum + curVal
}, 100)
console.log("🚀 --> sum", sum)

// 2. 计数
// eg: 计算2 在数组中存在的次数
const arr2 = [1, 2, 3, 4, 5, 6, 2, 4, 1, 3, 2, 6, 10]
const n = 2
const count = arr2.reduce((count, curVal, curIndex, array) => {
  return curVal === 2 ? count + 1 : count
}, 0)
console.log("🚀 --> count", count)


