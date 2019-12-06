var path = require('path')
var merge = require('webpack-merge')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var baseWebpackConfig = require('./base.conf')
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const McServiceUpdatePlugin = require('../../service-update-plugin');
const { app_name } = require('../package.json');

var devDefine = require('./define.js').webpackConfig.dev;
const PORT = 7000;

var devConfig = merge({}, baseWebpackConfig, {
  mode: 'development',
  output: {
    publicPath: `http://localhost:${PORT}${devDefine.publicPath}`,
    library: app_name
  },
  plugins: [
    // 业务线js md5更新
    new McServiceUpdatePlugin({
      app_name,
      configFile: path.resolve(process.cwd(), '../main/service-line-config.json')
    })
  ],
  devServer: {
    compress: true,
    port: PORT,
    disableHostCheck: true
  },
  devtool: 'inline-source-map'
})

module.exports = devConfig
