var path = require('path')
var webpack = require('webpack')
var WebpackBuildNotifierPlugin = require('webpack-build-notifier')
const { VueLoaderPlugin } = require('vue-loader')
const ChunkRenamePlugin = require("webpack-chunk-rename-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const progressBar = require('progress-bar-webpack-plugin');
var { webpackConfig } = require('./define.js')
var config = {
  'dev': webpackConfig.dev,
  'test': webpackConfig.test,
  'prod': webpackConfig.online
}[process.env.NODE_ENV] || webpackConfig.dev;

const SRC = path.resolve(__dirname, '../src');

var RootDir = process.cwd();
var baseConfig = {
  entry: {
    bundle: path.resolve(SRC, `entry.js`)
  },
  output: {
    path: config.path,
    publicPath: config.publicPath,
    filename: config.filename,
    chunkFilename: config.chunkFilename
  },
  resolve: {
    // 构建时，module 的查找路径
    modules: [ 'node_modules'],
    // 定义模块别名，缩短构建时路径搜索时间
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      'app': SRC
    },
    // 自动扩展的文件名后缀
    extensions: ['.js', '.css', '.scss', '.vue', '.png', '.jpg']
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }, {
        test: /\.s?[ac]ss$/,
        //loaders: ['style-loader', 'css-loader?sourceMap', 'postcss-loader', 'sass-loader?sourceMap'],
        use: [
          {loader: process.env.NODE_ENV !== 'dev'? MiniCssExtractPlugin.loader: "style-loader"},
          {loader: "css-loader", options: {sourceMap: true}},
          {loader: "postcss-loader", options: {
            ident: 'postcss',
            sourceMap: true,
            plugins: (loader) => [
              require('autoprefixer')()
            ]
          }},
          {loader: "sass-loader",
            options: {
                sourceMap: true,
                includePaths: [SRC]
            }
          }
        ],
        //loaders的处理顺序是从右到左的，这里就是先运行css-loader然后是style-loader
        include: SRC
      }, {
        test: /\.(png|jpg|gif|jpeg)$/, //处理css文件中的背景图片
        loader: 'url-loader?limit=8192&name=img/[hash:8].[name].[ext]'
        //当图片大小小于这个限制的时候，会自动启用base64编码图片。减少http请求,提高性能
      }, {
        test: /\.(eot|svg|ttf|woff)$/, //处理css文件中的背景图片
        loader: 'file-loader?name=font/[name].[hash:8].[ext]'
      }, {
        test: /\.js$/, //用babel编译jsx和es6
        exclude: file => (
          /node_modules/.test(file)
        ),
        loader: 'babel-loader',
        options: {
          cacheDirectory: true
        }
      }
    ]
  },
  optimization: {
    runtimeChunk: false,
    splitChunks: {
      cacheGroups: { // 这里开始设置缓存的 chunks
        // 业务线不分包
        // vendor: { // key 为entry中定义的 入口名称
        //   test: /[\\/]node_modules[\\/]/,
        //   chunks: 'all',
        //   name: 'vendor', // 要缓存的 分隔出来的 chunk 名称
        // }
      }
    }
  },
  plugins: [
    new progressBar(),
    new VueLoaderPlugin(),
    new ChunkRenamePlugin({
      initialChunksWithEntry: true,
      // vendor: config.filename
    }),
    new WebpackBuildNotifierPlugin(),
    // CSS提取为独立文件
    new MiniCssExtractPlugin({
      filename: config.cssFilename
    })
  ],
  stats: { colors: true }
}

module.exports = baseConfig;
