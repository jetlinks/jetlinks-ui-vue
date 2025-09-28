# jetlinks-ui-vue

[更新说明](./CHANGELOG.md)

## 重要说明
推荐使用`SSH`协议拉取代码，因为 .gitmodules 文件中已经使用了 SSH 地址（例如：git@github.com:xxx/xxx.git）。

但如果你使用`HTTPS`协议 拉取主项目，会出现问题：
Git 在拉取子模块时仍然使用`SSH`地址，这会导致出错或卡住，特别是在没有配置`SSH`密钥的情况下。

**这是因为主项目用的是 HTTPS，而子模块还是 SSH，两种协议混在一起容易出问题，比如权限不一致或认证失败。**

[通过 SSH 连接到 GitHub](https://blog.csdn.net/weixin_74850661/article/details/145274872)

## 运行以及安装步骤
推荐使用pnpm命令运行该项目，[安装pnpm](https://www.pnpm.cn/installation)

### 1. 拉取子仓库

```shell
pnpm modules:init
```
执行完成之后检查`src/modules/`下各子模块是否有文件，如果没有请看 [重要说明](./README.md#重要说明)

### 2. 安装依赖
```shell
pnpm install
```

### 3. 生成子模块ts别名
```shell
# 修改tsconfig,将子模块的别名写入paths中
pnpm update:tsconfig
```
### 4. 运行
```shell
pnpm dev
```
- 运行完成之后在浏览器访问`http://localhost:9100`即可

### 其它指令

```shell
# 更新子仓库
pnpm modules:update

# 打包
pnpm build
```

## 浏览器版本要求
- chrome: ^105
- edge: ^105
- Firefox: ^140

## [注册中心](./docs/模块注册中心.md)

