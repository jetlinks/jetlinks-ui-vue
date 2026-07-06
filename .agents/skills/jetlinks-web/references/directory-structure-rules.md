# JetLinks Web Directory Structure Rules

本文件用于确定前端改动的代码落点，避免页面、API、hooks、store 放错层级。

## 适用范围

- 新增页面或模块能力时判断目录位置
- 判断能力应放 `jetlinks-web-core` 还是 `modules/*-ui`
- 模块入口、注册文件、资源组织调整

## 常见结构（候选）

- `jetlinks-web-core/`：应用壳层与跨模块共享能力（路由、布局、公共组件、公共 hooks、公共 utils）
- `modules/*-ui/`：业务子模块（页面、模块 API、模块组件、模块 store、模块 hooks）
- 子模块入口常见为 `index.ts` + `register.ts`

## 落点决策

1. 跨模块复用能力优先放 `jetlinks-web-core`。
2. 单业务域页面、组件、API、store 放对应 `modules/<module>-ui`。
3. 页面优先放 `views/**/index.vue`，接口放 `api/**`，复用逻辑放 `hooks/**`。
4. 新目录按需创建，不为了“结构完整”额外造目录。

## 约束

- 不要跨模块用深层相对路径直接引用内部实现。
- 不要把模块私有逻辑堆进 `jetlinks-web-core`。
- 不要改变现有模块加载机制（入口与注册模式）。
- 若实际目录约定与本文不同，始终优先跟随当前工作区真实结构。

## 自检清单

- 代码是否落在正确层级（core vs module）。
- 页面、API、hooks、store 是否遵循模块既有目录风格。
- 模块入口与注册是否保持可发现、可加载。
