var path = require('path');
var pkg = require('../package.json');

const PATH_PREFIX = "public/dist/";

// webpack打包配置
const webpackConfig = {
  dev: {
    path: path.resolve(__dirname, '../' + PATH_PREFIX +'dev/'),
    publicPath: '/',
    filename: 'js/[name].js',
    chunkFilename: 'chunks/[name].js',
    cssFilename: 'css/[name].css'
  },
  test: {
    path: path.resolve(__dirname, '../' + PATH_PREFIX +'public/'),
    publicPath: 'https://cdn.test.com/cdn/public/',
    filename: 'js/[name].[chunkhash:8].min.js',
    chunkFilename: 'chunks/[name].chunk[chunkhash:8].js',
    cssFilename: 'css/[name].[contenthash:8].min.css'
  },
  online: {
    path: path.resolve(__dirname, '../' + PATH_PREFIX +'public/'),
    publicPath: 'https://cdn.com/cdn/public/',
    filename: 'js/[name].[chunkhash:8].min.js',
    chunkFilename: 'chunks/[name].chunk[chunkhash:8].js',
    cssFilename: 'css/[name].[contenthash:8].min.css'
  }
};

module.exports = {
  webpackConfig
};
