const path = require('path')
const webpack = require('webpack')
const FooterPlugin = require('./plugins/FooterPlugin')
const bannerPlugin = new webpack.BannerPlugin({
  banner: "hello webpack plugin"
})

const footerPlugin = new FooterPlugin({
  footer: "bye webpack plugin"
})

module.exports = {
  entry: "./src/index.js",
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: "bundle.js",
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /.x$/,
        use: [path.resolve(__dirname, 'loader/x-loader.js')]
      }
    ]
  },

  plugins: [
    bannerPlugin,
    footerPlugin
  ]
}