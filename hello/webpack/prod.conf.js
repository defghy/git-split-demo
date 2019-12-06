var path = require('path')
var webpack = require('webpack')
var merge = require('webpack-merge')
var CleanWebpackPlugin = require('clean-webpack-plugin')
var fs = require('fs')
var UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin')
const SentryCliPlugin = require('@sentry/webpack-plugin')
const McServiceUpdatePlugin = require('../../service-update-plugin');

var Pkg = require('../package.json');
var baseWebpackConfig = require('./base.conf')
var { webpackConfig } = require('./define.js')
const { app_name } = require('../package.json');

var prodConfig = merge({}, baseWebpackConfig, {
  mode: 'production',
  optimization: {
    minimizer: [
      new UglifyJSPlugin({
        cache: true,
        parallel: true,
        sourceMap: true // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessor: require('cssnano')({
          reduceIdents: false, // https://github.com/ben-eb/cssnano/issues/247
        }),
      })
    ]
  },
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new CleanWebpackPlugin(['public'], {
      root: path.resolve(__dirname, '../public/dist/'),
      verbose: true, // 控制台打印日志
      dry: false // 不清空任何文件，用于测试
    }),
    new SentryCliPlugin({
      release: Pkg.version+(process.env.NODE_ENV=='test'?'_test':''),
      include: baseWebpackConfig.output.path,
      ignoreFile: '.sentrycliignore',
      ignore: ['node_modules', 'webpack.config.js'],
      configFile: './../.sentryclirc',
      // dryRun: true,
      urlPrefix: baseWebpackConfig.output.publicPath,
      // validate: true,
      debug: true
    }),
    // 业务线js md5更新
    new McServiceUpdatePlugin({
      app_name,
      noticeApi: 'https://aaa.api'
    })
  ],
  stats: {
    modules: false,
    entrypoints: false
  }
})

module.exports = prodConfig
