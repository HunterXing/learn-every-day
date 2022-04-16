const regScript = /<script>([\s\S]+?)<\/script>/


module.exports = function (source) {
  console.log("🚀 --> x-loader running", source)
  const __source__ = source.match(regScript)
  console.log("🚀 --> __source__", __source__)
  return __source__ && __source__[1] ? __source__[1] : __source__
}

// 测试loader
if(require.main === module) {
  // 此处用于测试loader
}