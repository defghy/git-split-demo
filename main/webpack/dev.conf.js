var path = require('path')
var fs = require('fs');
var merge = require('webpack-merge')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var baseWebpackConfig = require('./base.conf')
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const McServiceUpdatePlugin = require('../../service-update-plugin');

var devDefine = require('./define.js').webpackConfig.dev;
const PORT = 7000;

var devConfig = merge({}, baseWebpackConfig, {
  mode: 'development',
  output: {
    publicPath: `http://localhost:${PORT}${devDefine.publicPath}`
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: '',
      template: path.resolve(__dirname, '../template/template.html'),
      filename: 'index.html',
      chunks: ['manifest', 'vendor', 'bundle']
    }),
  ],
  devServer: {
    before(app, server) {
      app.use(async (req, res, next) => {
        if (!req.path.includes('getServiceLineConfig')) {
          return next();
        }

        try {
          var json = fs.readFileSync(path.resolve('./service-line-config.json'), "utf8")
          json = new Function (`var a = ${json}; return a;`) ()
          json = JSON.stringify(json);

          res.writeHead(200, {'content-type': 'application/json;charset=utf8'})
          res.write(json) // 重新压缩为gzip
          res.end()
          return
        } catch (e) {
          console.error(`json parse fail: ${e.message}`.red)
        }

        next()
      })
    },
    compress: true,
    port: PORT,
    disableHostCheck: true
  },
  devtool: 'inline-source-map'
})

module.exports = devConfig
