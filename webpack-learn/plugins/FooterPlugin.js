/*
 * @description: Add a banner to the bottom of each generated chunk
 * @Date: 2022-04-10 16:07:43
 * @Author: xingheng
 */
const { ConcatSource } = require('webpack-sources')

class FooterPlugins {
  constructor(options) {
    this.options = options
    console.log("🚀 --> options", options)
  }
  
  apply(compiler) {
    console.log("🚀 --> compiler", typeof compiler)
    compiler.hooks.compilation.tap("FooterPlugin", (compilation) => {
      compilation.hooks.processAssets.tap("FooterPlugin", (assets) => {
        const chunks = compilation.chunks
        console.log("🚀 --> chunks", chunks)
        chunks.forEach(chunk => {
          for (const file of chunk.files) {
            console.log("🚀 --> file", file)
            const common = `/*! ${this.options.footer}*/`
            compilation.updateAsset(file, old => new ConcatSource(old,'\n', common))

          }
        });
      })
    })
  }
}

module.exports = FooterPlugins