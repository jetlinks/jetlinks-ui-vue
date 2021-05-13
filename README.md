
<h1 align="center">Jetlinks Vue</h1>

<div align="center">
项目下载和运行
----

- 拉取项目代码
```bash
git clone https://github.com/jetlinks/jetlinks-ui-vue.git
cd jetlinks-ui-vue
```

- 修改后台接口地址： 后台接口配置文件地址：config/proxy.ts:

  ```js
  /**
   * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
   */
  export default {
    dev: {
      '/jetlinks': {
        target: '后台地址',
        changeOrigin: true,
        pathRewrite: { '^/jetlinks': '' },
      },
    },
    test: {
      '/jetlinks': {
        target: '后台地址',
        changeOrigin: true,
        pathRewrite: { '^/jetlinks': '' },
      },
    },
    pre: {
      '/jetlinks': {
        target: '后台地址',
        changeOrigin: true,
        pathRewrite: { '^/jetlinks': '' },
      },
    },
  };
  ```

- 安装依赖
```
yarn install
```

- 开发模式运行
```
yarn run serve
```

- 编译项目
```
yarn run build
```

- Lints and fixes files
```
yarn run lint
```


