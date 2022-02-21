/*
 * @description: 简易 jquery
 * @Date: 2022-02-20 22:38:40
 * @LastEditTime: 2022-02-21 09:22:20
 * @Author: xingheng
 */

// class jQuery {
//   constructor(selector) {
//     const selectors = document.querySelectorAll(selector)
//     selectors.forEach((dom, i) => {
//       this[i] = dom
//     })
//     this.length = selectors.length
//   }

//   // 方法
//   each(fn) {
//     for(let i = 0; i < this.length; i++) {
//       fn(this[i], i)
//     }
//   }
// }

// function $(selector) {
//   return new jQuery(selector)
// }

(function (window) {
  var xQuery = function (selector) {
      return new xQuery.fn.init(selector);
  }
  window.$ = xQuery;

  xQuery.fn = {
    init: function (selector) {
      const selectors = document.querySelectorAll(selector)
      selectors.forEach((dom, i) => {
        this[i] = dom
      })
      this.length = selectors.length
      this.prototype
    }, 

    each: function (fn) {
      for(let i = 0; i < this.length; i++) {
        fn(this[i], i)
      }
    }
  }
  // 将fn中其他的方法绑定在xQuery.fn.init的原型上，这样在初始化的时候就能
  xQuery.fn.init.prototype = xQuery.fn; 
})(window);
