# jetlinks-ui-vue

[更新说明](./CHANGELOG.md)

## 项目说明
本项目包含多个 **Git 子模块（submodule）**，用于拆分组件、公共模块等。
请严格按照下列步骤进行操作，否则会出现代码不全、依赖安装失败、无法运行、缺少菜单等问题。

## ⚙️ 一、环境要求

在开始之前，请确保你已经安装以下工具：

| 工具   | 版本要求        | 检查命令            |
| ---- |-------------|-----------------|
| Git  | ≥ 2.30      | `git --version` |
| Node.js | ≥ 20        | `node -v`       |
| pnpm | ≥ 10        | `pnpm -v`       |
| SSH Key | 已添加到 GitHub | 见下方配置说明         |

---

## 二、配置 SSH 访问（非常重要）

项目中的子模块使用 **SSH 地址**，如果没有配置 SSH，会导致代码无法拉取。

### 🪟 Windows 环境配置步骤

#### 1. 检查是否已有 SSH Key

打开 **PowerShell** 或 **Git Bash**，执行：

```bash
ls ~/.ssh/id_rsa.pub
```

若提示文件不存在，请生成：

```bash
ssh-keygen -t rsa -C "你的邮箱@example.com"
```

一路按回车即可。

#### 2. 查看并复制公钥内容

```bash
cat ~/.ssh/id_rsa.pub
```

复制输出的整段内容。

#### 3. 添加到 GitHub

* GitHub: [https://github.com/settings/keys](https://github.com/settings/keys)

点击 “New SSH Key” → 粘贴上面复制的公钥。

#### 4. 测试连接是否成功

```bash
ssh -T git@github.com
```

若提示：

```
Hi username! You've successfully authenticated...
```

说明 SSH 设置成功。

---

### 🍎 macOS 环境配置步骤

#### 1. 打开终端，检查是否已有 SSH Key

```bash
ls ~/.ssh/id_rsa.pub
```

若无文件，执行：

```bash
ssh-keygen -t rsa -C "你的邮箱@example.com"
```

#### 2. 添加 SSH 到系统代理（可选）

```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_rsa
```

#### 3. 复制公钥内容

```bash
pbcopy < ~/.ssh/id_rsa.pub
```

（命令会自动复制内容到剪贴板）

#### 4. 到 GitHub 添加公钥

* GitHub: [https://github.com/settings/keys](https://github.com/settings/keys)

点击 “New SSH Key” → 粘贴上面复制的公钥。

#### 5. 测试 SSH 是否成功

```bash
ssh -T git@github.com
```


## 三、运行以及安装步骤
使用 **pnpm** 命令运行该项目，[安装pnpm](https://www.pnpm.cn/installation)

### 1. 拉取子仓库
项目内置有拉取子模块的命令
```shell
pnpm modules:init
```

### 2. 安装依赖
先查看子模块文件是否拉取完整，确保拉取完整之后再安装依赖
```shell
pnpm install
```

### 3. 生成子tsconfig.paths.json文件
这是添加在ts中添加子模块别名，一定要执行。后面每新增一个子模块都需要运行一次
```shell
# 修改tsconfig,将子模块的别名写入paths中
pnpm update:tsconfig
```

### 4. 运行
```shell
pnpm dev
```
- 运行完成之后在浏览器访问`http://localhost:9100`即可

### 5. 其它指令

```shell

# 更新子仓库
pnpm modules:update

# 打包
pnpm build
```

## 🧰 四、常见问题排查

| 问题                              | 可能原因                     | 解决方案                            |
|---------------------------------|--------------------------|---------------------------------|
| ❌ 子模块代码为空                       | 忘记使用 `pnpm modules:init` | 执行 `pnpm modules:init`          |
| ❌ Permission denied (publickey) | SSH 没配置或公钥未添加            | 按上方 “SSH 配置” 步骤操作               |
| ❌ pnpm install 报错               | Node 版本过低或缓存损坏           | 升级 Node 至 ≥18                   |
| ❌ 启动时报模块找不到                     | 子模块未初始化                  | 删除项目重新完整 clone                  |
| ❌ 初始化页面中，菜单初始化项显示 “系统初始化0个菜单”   | 子模块代码没有拉取下来              | 检查子模块目录， 执行 `pnpm modules:init` |
| ❌ 登录进去之后页面没有菜单                  | 菜单未初始化成功                 | 进入 "/init-home" 进行初始化菜单操作       |

---

## 五、浏览器版本要求
- chrome: ^105
- edge: ^105
- Firefox: ^140

## [注册中心使用方式](./docs/模块注册中心.md)

