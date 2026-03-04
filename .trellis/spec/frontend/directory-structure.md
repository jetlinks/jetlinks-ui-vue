# 目录结构

> 本项目前端代码组织方式。

---

## 概览

本仓库采用主应用 + 子模块结构：

- `jetlinks-web-core/`：主应用与通用能力
- `modules/*`：业务子模块（多数为子仓库，按实际存在目录参与构建/加载）
- 根目录配置用于统一构建与联邦加载

## 目录布局

```text
jetlinks-ui-vue/
├── jetlinks-web-core/
│   ├── src/
│   │   ├── api/           # 请求封装
│   │   ├── components/    # 通用组件
│   │   ├── hooks/         # 复用逻辑
│   │   ├── layout/        # 布局壳层
│   │   ├── locales/       # 国际化
│   │   ├── router/        # 路由与守卫
│   │   ├── store/         # Pinia 状态
│   │   ├── utils/         # 工具/注册中心
│   │   └── views/         # 页面视图
├── modules/
│   └── <module-name>-ui/
│       ├── api/                # 模块 API 封装
│       ├── components/         # 模块组件库（业务组件）
│       ├── assets/             # 模块资源库（图片/样式/静态资源）
│       ├── hooks/ 或 hook/     # 模块复用逻辑
│       ├── locales/            # 模块国际化
│       ├── store/ 或 stores/   # 模块状态管理
│       ├── utils/              # 模块工具方法（可选）
│       ├── packages/ 或 core/  # 模块内部可复用能力（可选）
│       ├── views/              # 模块页面
│       ├── index.ts
│       └── register.ts
└── tests/e2e/
```

## 模块加载行为（关键）

- `modules/*` 不是“必须全量存在”的固定集合，而是“可选模块集合”。
- 主应用通过 `import.meta.glob('../../../modules/*/index.ts')` 扫描当前存在的子模块并按需注册。
- 因此本地缺少某些模块时，只会导致对应业务能力不可用，不会阻塞主应用基础能力运行。
- 开发调试也支持只启动部分模块（例如通过 `--module-name` 过滤），不要求全模块同时启动。

## 模块组织约定

- 路由页面统一放在 `views/**/index.vue`
- 接口封装放在 `api/**`
- 模块入口使用 `index.ts`
- 模块注册能力放在 `register.ts`（向主应用注册组件、API、store 等资源）

## 子模块能力边界

- 每个子模块应具备独立演进能力：组件库、资源库、API、hooks、store、views 尽量在模块内闭环。
- `assets/`、`components/`、`api/`、`hooks/`、`store/` 等目录按业务需要提供，不要求每个模块目录完全一致。
- 若某目录当前无业务需求可不创建；新增目录不应破坏已有模块加载机制。
- 模块间共享优先通过注册中心/公共包进行，避免直接跨模块深层相对路径引用。

参考：

- `modules/authentication-manager-ui/index.ts`
- `modules/data-collector-ui/index.ts`
- `modules/authentication-manager-ui/views/system/*`

## 命名约定

- Hook 使用 `use*` 命名
- Store 文件使用业务域命名（如 `menu.ts`、`system.ts`）
- API 文件按业务域拆分（如 `api/system/user.ts`）
- 页面以目录层级表达业务关系（如 `views/system/User/index.vue`）
