# jetlinks-ui-vue

[更新说明](./CHANGELOG.md)

## 项目说明
本项目将各业务子仓库以 **Git subtree** 方式内嵌于主仓库（目录 `jetlinks-web-core`、`modules/*`），无需再使用子模块初始化。
请严格按照下列步骤进行操作，否则会出现依赖安装失败、无法运行、缺少菜单等问题。

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

若你需要使用 `pnpm modules:update` 从上游 **拉取 subtree 更新**，远程仍为 **SSH** 地址，需配置 SSH；仅本地开发、不拉取上游时可不配置。

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

### 1. 子仓库说明
克隆主仓库后子仓库源码已包含在内。`pnpm modules:init` 仅作提示；若需从上游同步 subtree，请使用：
```shell
pnpm modules:update
```
（需已配置 SSH，且会按当前主仓库分支名对应上游分支执行 `git subtree pull`。）

### 2. 安装依赖
确认 `jetlinks-web-core` 与 `modules` 下各目录存在后再安装依赖
```shell
pnpm install
```

### 3. 生成子tsconfig.paths.json文件
这是向 tsconfig 写入子包别名，一定要执行。后面每新增一个内嵌子目录都需要运行一次
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

# 从上游拉取 subtree 更新（需 SSH）
pnpm modules:update

# 打包
pnpm build
```

## 🧰 四、常见问题排查

| 问题                              | 可能原因                     | 解决方案                            |
|---------------------------------|--------------------------|---------------------------------|
| ❌ 子目录代码为空                       | 使用了浅克隆或未拉全仓库           | 使用完整 clone，勿 `--depth 1`（除非你知道影响） |
| ❌ Permission denied (publickey) | 执行 `modules:update` 时 SSH 未配置 | 按上方 “SSH 配置” 步骤操作               |
| ❌ pnpm install 报错               | Node 版本过低或缓存损坏           | 升级 Node 至 ≥18                   |
| ❌ 启动时报模块找不到                     | 目录缺失或路径错误                | 确认 `jetlinks-web-core`、`modules/*` 存在 |
| ❌ 初始化页面中，菜单初始化项显示 “系统初始化0个菜单”   | 业务模块目录不完整                | 检查 `modules` 下各目录是否齐全           |
| ❌ 登录进去之后页面没有菜单                  | 菜单未初始化成功                 | 进入 "/init-home" 进行初始化菜单操作       |

---

## 五、浏览器版本要求
- chrome: ^105
- edge: ^105
- Firefox: ^140

## [注册中心使用方式](./docs/模块注册中心.md)

