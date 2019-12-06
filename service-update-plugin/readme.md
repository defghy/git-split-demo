# 功能
业务线没有自己的html
项目发布后将入口文件更新到目标位置

## 使用

```javascript
  plugins: [
    // 业务线js md5更新
    new McServiceUpdatePlugin({
      app: app_name,  // 业务线名称
      configFile: path.resolve(process.cwd(), '../weixin-old/app/service-line-config.json')
    })
  ],
```

## 参数

```javascript
app: 业务线标识，定义在package.json中 必填
configFile: 本地业务线统一配置文件地址
noticeApi: 后端业务线统一配置更新地址
```

