// 如果a中含有b,则b的值覆盖a的值 如果a中不含有b 则b的值新增到a

const MergeRecursive = (obj1, obj2) => {
  // 合并两个数组
  for (var p in obj2) {
    if (obj1[p] === undefined) { // 如果obj1没有p 直接把obj2的p加入
      obj1[p] = obj2[p]
    }
    try {
      if (obj2[p].constructor === Object) {
        obj1[p] = MergeRecursive(obj1[p], obj2[p])
      } else {
        if (typeof obj1[p] === 'object') {
          for (let i = 0; i < obj2[p].length; i++) {
            if (typeof obj2[p][i] === 'object') { // 数组里面的数据也是数组对象 则进行查找重复并赋值
              if (obj1[p][i] === undefined) { // 如果obj1中没有obj2的属性就把obj2的属性push到1里
                obj1[p].push(obj2[p][i])
              } else {
                 uniq(obj1[p][i], obj2[p][i])
              }
            } else {
              obj1[p] = obj2[p] // 数组 但是里面的数据是普通类型 直接赋值
            }
          }
        } else {
          obj1[p] = obj2[p] // 普通类型有直接赋值 obj1没有的就创建并赋值
        }
      }
    } catch (e) {
      console.log(e)
    }
  }
  return obj1
}
const uniq = (obj1, obj2) => {
  // 查找重复并obj2的值赋给obj1
  Object.keys(obj1).forEach(key => {
    if (typeof obj1[key] === 'object') {
      try {
        if (key in obj2) { // 确保obj2有obj1的key 不然会导致失败
          uniq(obj1[key], obj2[key])
        }
      } catch (err) {
        obj1 = obj2
      }
    } else {
      if (key in obj2) {
        obj1[key] = obj2[key]
      }
      Object.keys(obj2).forEach(obj2key => { // 把obj2中有的obj1中没有的添加进去
        if (!(obj2key in obj1)) {
          obj1[obj2key] = obj2[obj2key]
        }
      })
    }
  })
}

const arr = [
  {
    code: '1',
    name: 'test1',
    isShow: true
  }
]

const arrNew = [
  {
    code: '1',
    name: 'test1',
    isShow: false
  },
  {
    code: '2',
    name: 'test2',
    isShow: false
  }
]


const result = MergeRecursive(arrNew, arr)
console.log(result)