# JetLinks Web Component Source Rules

本文件用于确认前端组件、hooks、utils 和交互样例的来源优先级，避免把外部组件库或业务局部组件误当成当前项目通用能力。

## 来源优先级

1. 当前 workspace 的 `jetlinks-web-core/src/components/index.ts`
   - 这是通用组件第一事实源。
   - 先确认组件是否被当前项目注册或导出，再决定是否使用。
2. 当前 workspace 的 `jetlinks-web-core/src/components/*`
   - 用于核验 props、emits、slot、样式约束和真实能力边界。
3. 当前业务模块或相邻模块对 `jetlinks-web-core` 组件的真实用法
   - 用于确认本项目如何组合组件、处理权限、i18n、路由和状态。
4. 新版交互样例
   - 当本地可访问 `/Users/zhouhao/IdeaProjects/cloud.jetlinks/ui` 或 `/Users/zhouhao/IdeaProjects/cloud.jetlinks/runtime-ui` 时，可参考其中的新设计页面。
   - 只提取方案、布局、组件组合和交互节奏。
5. 用户明确指定的外部参考
   - `jetlinks-project-ui-cli` 只在用户明确要求参考时查看。
   - 它不能作为默认依赖、默认导入来源或当前项目组件存在性的证据。

## 新版样例提取规则

- 可参考设备资产管理、视频资源、巡检、通知配置、AI 模型/应用等页面的交互方案。
- 只借鉴业务相似的页面结构、筛选方式、详情承载、编辑节奏和状态反馈。
- 不复制业务字段、指标、接口路径、权限码、局部组件实现或样例数据。
- 不把另一个业务页面的功能介绍、统计卡、流程步骤直接搬到当前业务。
- 外部优秀设计只补充交互思路，不覆盖 JetLinks 当前组件体系和 Ant Design / Ant Design Vue 基线。

## 硬约束

- 不要在技能默认流程中要求读取或安装 `jetlinks-project-ui-cli`。
- 不要假设外部组件库中的组件在目标 workspace 存在。
- 不要在业务模块中重复手写 `jetlinks-web-core` 已经提供的通用组件。
- 不要因为某个业务模块里有一个局部组件，就把它复制到另一个业务模块；先判断是否应复用 `jetlinks-web-core` 或抽成共享组件。
- 如果没有复用现有能力，必须说明已核验的导出入口、相邻页面和不满足原因。

## 自检清单

- 是否已从当前 workspace 的 `jetlinks-web-core` 核验组件真实存在。
- 是否区分了“通用组件事实源”和“业务页面参考样例”。
- 是否避免把 `jetlinks-project-ui-cli` 作为默认依赖或导入来源。
- 是否只借鉴了相似业务中的结构和交互节奏，而不是复制字段、接口或指标。
