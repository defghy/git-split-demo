# git项目拆分demo

## install

分别到 `hello`，`service-update-plugin`,`main`执行

```
npm install
```

## 使用

1. `hello`文件夹下执行 `npm run start`;
2. `main`文件夹下执行 `npm run start`;
3. 访问 http://localhost:7000/index.html  // 主项目
4. 访问 http://localhost:7000/index.html#/hello/index // 业务线项目
5. 直接访问 http://localhost:7000/index.html#/hello/index

观察js加载情况

## 目录说明
- `main`: 主项目
- `hello`: 业务线项目
- `service-update-plugin`: 发布后更新版本工具
