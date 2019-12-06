'use strict';

var fs = require('fs');
var os = require('os');
var path = require('path');
require('colors');

var pluginName = 'mc-service-update-plugin';

let runCount = 0;

console.log('test npm link');

class McServiceUpdatePlugin {
  constructor(options) {
    this.options = options;
    this.runCount = 0;
  }

  // 更新本地配置文件
  updateLocalConfig({srcs}) {
    let { configFile, app_name } = this.options;
    if(!app_name || !configFile) {
      return;
    }

    let services = {};
    let paths = path.parse(configFile);
    // 存在文件读取配置
    if(fs.existsSync(configFile)) {
      try {
        let json = fs.readFileSync(configFile);
        services = JSON.parse(json);
      } catch(e) {}
    }
    // 文件不存在，新建文件夹
    else if(!fs.existsSync(paths.dir)) {
      // todo
      // fs.mkdirSync(paths.dir, {
      //   recursive: true
      // })
    }

    // 写文件
    services[app_name] = {
      src: srcs
    }
    fs.writeFileSync(configFile, JSON.stringify(services));
    setTimeout(() => {
      console.log(`${'更新业务线配置成功: '.green} ${configFile.bold}`);
    }, 300)
  }

  // 更新线上配置文件
  uploadOnlineConfig({files}) {
    let { noticeApi, app_name } = this.options;
    // todo
    console.log(`${'更新业务线配置成功: '.green} ${JSON.stringify(files)}`);
  }

  apply(compiler) {
    // 调试环境：编译完毕，修改本地文件
    if(process.env.NODE_ENV === 'dev') {
      // 本地调试没有md5值，不需要每次刷新
      compiler.hooks.done.tap('McServiceUpdatePlugin', (stats) => {
        if(this.runCount > 0) {
          return;
        }
        let assets = stats.compilation.assets;
        let publicPath = stats.compilation.options.output.publicPath;
        let js = Object.keys(assets).filter(item => {
          // 过滤入口文件
          return item.startsWith('js/');
        }).map(path => `${publicPath}${path}`);

        this.updateLocalConfig({srcs: js});
        this.runCount++;
      });
    }
    // 发布环境：上传完毕，请求后端修改
    else {
      if(!compiler.hooks.mcUploaded) {
        console.error('依赖包 @mc/webpack-mc-static 未引入：mnpm install @mc/webpack-mc-static');
        return;
      }

      compiler.hooks.mcUploaded.tap('McServiceUpdatePlugin', (upFiles) => {
        let entries = upFiles.filter(file => {
          return file &&
            file.endsWith('js') &&
            file.includes('js/');
        });

        this.uploadOnlineConfig({files: entries});
        return;
      })

    }
  }
}

module.exports = McServiceUpdatePlugin;